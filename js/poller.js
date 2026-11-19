// Round-robin / priority scheduler that polls configured values.

import { evalValue, mapLabel } from './config.js';
import { NRC_NAMES, toHex } from './elm.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Poller extends EventTarget {
  constructor(elm) {
    super();
    this.elm = elm;
    this.running = false;
    this.paused = false;
    this.groups = [];
    this.state = new Map(); // value id -> { value, label, ts, status, error, hz }
    this.completions = [];
    this.config = null;
    this._wake = null;
    this.noBatch = new Set();
  }

  _emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }

  load(config) {
    this.config = config;
    this.elm.setRate(config.maxRequestsPerSec || 15);
    this.elm.defaultTimeout = config.commandTimeoutMs || 1200;
    this.elm.headerInit = config.headerInit || {};
    const map = new Map();
    for (const v of config.values) {
      if (!v.enabled) continue;
      const header = (v.header || '').toUpperCase();
      const request = v.request.replace(/\s+/g, '').toUpperCase();
      const responseId = (v.responseId || '').toUpperCase();
      const key = `${header}|${request}|${responseId}`;
      let g = map.get(key);
      if (!g) {
        g = { key, header, request, responseId, did: /^22[0-9A-F]{4}$/.test(request) ? request.slice(2) : null, dataLen: null, values: [], rateHz: 0, priority: 0, nextDue: 0, fails: 0, lastOk: 0, lastBytes: null, hist: [] };
        map.set(key, g);
      }
      g.values.push(v);
      g.rateHz = Math.max(g.rateHz, Number(v.pollRateHz) || 1);
      g.priority = Math.max(g.priority, Number(v.priority) || 0);
    }
    this.groups = [...map.values()];
    for (const g of this.groups) g.intervalMs = 1000 / g.rateHz;
    for (const id of [...this.state.keys()]) if (!config.values.some((v) => v.id === id && v.enabled)) this.state.delete(id);
    this._kick();
  }

  start() {
    if (this.running) return;
    this.running = true;
    for (const g of this.groups) { g.nextDue = 0; g.fails = 0; }
    this.noBatch = new Set();
    this._loop();
  }

  stop() { this.running = false; this._kick(); }

  setPaused(p) { this.paused = p; this._kick(); }

  _kick() { if (this._wake) { const w = this._wake; this._wake = null; w(); } }

  _idle(ms) {
    return new Promise((r) => {
      const t = setTimeout(() => { this._wake = null; r(); }, ms);
      this._wake = () => { clearTimeout(t); r(); };
    });
  }

  _effectiveInterval(g) {
    if (!g.fails) return g.intervalMs;
    return Math.min(g.intervalMs * 2 ** Math.min(g.fails, 6), 10000);
  }

  _pick(now) {
    let best = null;
    let bestScore = -Infinity;
    let earliest = Infinity;
    for (const g of this.groups) {
      if (g.nextDue > now) { earliest = Math.min(earliest, g.nextDue); continue; }
      const overdue = (now - g.nextDue) / this._effectiveInterval(g);
      const score = g.priority + 5 * Math.min(overdue, 4) + (g.header === this.elm.header ? 3 : 0);
      if (score > bestScore) { bestScore = score; best = g; }
    }
    return { best, earliest };
  }

  async _loop() {
    while (this.running) {
      if (this.paused || !this.groups.length || !this.elm.t.connected) { await this._idle(250); continue; }
      const now = performance.now();
      const { best, earliest } = this._pick(now);
      if (!best) { await this._idle(Math.max(5, Math.min(earliest - now, 250))); continue; }
      await this._poll(best);
    }
  }

  /** Other UDS DID groups on the same ECU that can ride along in one 22 request. */
  _batchFor(g, now) {
    if (!g.did || this.config.batchUds === false || this.noBatch.has(g.header)) return [g];
    const maxDids = this.config.maxDidsPerRequest || 6;
    let len = 1 + 2 + (g.dataLen ?? 4);
    const out = [g];
    const cands = this.groups
      .filter((o) => o !== g && o.did && o.dataLen != null && o.header === g.header && o.responseId === g.responseId
        && o.nextDue <= now + this._effectiveInterval(o) * 0.5)
      .sort((x, y) => (x.nextDue - now) / x.intervalMs - (y.nextDue - now) / y.intervalMs);
    for (const o of cands) {
      if (out.length >= maxDids || len + 2 + o.dataLen > 62) break;
      out.push(o); len += 2 + o.dataLen;
    }
    if (g.dataLen == null && out.length > 1) return [g]; // learn own length first
    return out;
  }

  async _poll(g) {
    const t0 = performance.now();
    const batch = this._batchFor(g, t0);
    if (batch.length > 1) return this._pollBatch(batch, t0);
    // single-frame reply known -> let the ELM return immediately (response-count digit)
    const single = this.config.fastResponse !== false && g.lastBytes && g.lastBytes.length <= 7;
    const r = await this.elm.request(g.header, g.request, g.responseId, { useCRA: this.config.useCRA, single });
    this._finishGroup(g, r, t0);
  }

  async _pollBatch(batch, t0) {
    const g0 = batch[0];
    const req = `22${batch.map((g) => g.did).join('')}`;
    const replyLen = 1 + batch.reduce((n, g) => n + 2 + (g.dataLen ?? 99), 0);
    const count = this.config.fastResponse !== false && !this.elm.noCountDigit && replyLen <= 7 ? '1' : '';
    const opts = { header: g0.header, cra: this.config.useCRA ? g0.responseId : null };
    let res = await this.elm.send(req + count, opts);
    if (count && res.errors.includes('UNKNOWN_CMD')) { this.elm.noCountDigit = true; res = await this.elm.send(req, opts); }
    if (res.error === 'DISCONNECTED' || res.error === 'RESET') return;
    const msg = (res.msgs || []).find((m) => (!m.header || m.header === g0.responseId) && m.bytes[0] === 0x62);
    const parts = msg && this._splitDids(msg.bytes, batch);
    if (!parts) {
      // ECU rejected / unexpected layout: stop batching on this ECU, fall back to single requests
      this.noBatch.add(g0.header);
      this.elm._emit('note', `Multi-DID read not accepted by ${g0.header} (${res.error || 'NRC/len'}); using single requests`);
      return;
    }
    batch.forEach((g, i) => this._finishGroup(g, { ok: true, bytes: parts[i] }, t0));
  }

  _splitDids(b, batch) {
    let p = 1;
    const out = [];
    for (const g of batch) {
      const hi = parseInt(g.did.slice(0, 2), 16), lo = parseInt(g.did.slice(2), 16);
      if (b[p] !== hi || b[p + 1] !== lo) return null;
      const n = g.dataLen;
      if (p + 2 + n > b.length) return null;
      out.push([0x62, hi, lo, ...b.slice(p + 2, p + 2 + n)]);
      p += 2 + n;
    }
    return p === b.length ? out : null;
  }

  _finishGroup(g, r, t0) {
    const now = performance.now();
    g.nextDue = Math.max(t0 + this._effectiveInterval(g), now);
    if (r.error === 'DISCONNECTED' || r.error === 'RESET') return;
    this.completions.push(now);

    if (r.ok) {
      g.fails = 0;
      g.lastOk = now;
      g.hist.push(now);
      if (g.hist.length > 20) g.hist.shift();
      g.lastBytes = r.bytes;
      if (g.did) g.dataLen = r.bytes.length - 3;
      g.nextDue = t0 + g.intervalMs;
      for (const v of g.values) this._update(v, g, r.bytes);
    } else {
      g.fails++;
      let err = r.error;
      if (r.error === 'NEGATIVE') err = `NRC ${toHex(r.nrc)} ${NRC_NAMES[r.nrc] || ''}`.trim();
      if (r.error === 'NO_DATA') err = 'NO DATA';
      for (const v of g.values) {
        const s = this.state.get(v.id) || {};
        this.state.set(v.id, { ...s, status: 'error', error: err });
      }
    }
    this._emit('update', { group: g });
  }

  _update(v, g, bytes) {
    const prev = this.state.get(v.id) || {};
    const s = { ...prev, ts: performance.now(), status: 'ok', error: null, hz: this._hz(g) };
    let val;
    try {
      val = evalValue(v, bytes, this.values());
    } catch (e) {
      this.state.set(v.id, { ...prev, status: 'error', error: e.message });
      return;
    }
    if (typeof val === 'number' && !this._plausible(v, val, prev)) {
      // glitch: keep showing the previous value
      this.state.set(v.id, { ...prev, hz: s.hz, rejected: (prev.rejected || 0) + 1 });
      return;
    }
    s.value = val;
    s.label = mapLabel(v, val);
    s.rejected = 0;
    s.candidate = null;
    if (v.validRange && (val < v.validRange[0] || val > v.validRange[1])) s.status = 'invalid';
    this.state.set(v.id, s);
  }

  /**
   * Reject readings outside the value's plausible range, or that jump more than maxJump from the
   * last accepted value - unless the next reading confirms the jump (real change, not a glitch).
   */
  _plausible(v, val, prev) {
    if (!Number.isFinite(val)) return false;
    if (v.range && (val < v.range[0] || val > v.range[1])) return false;
    if (v.maxJump == null || prev.value == null || typeof prev.value !== 'number') return true;
    if (Math.abs(val - prev.value) <= v.maxJump) return true;
    const c = prev.candidate;
    if (c != null && Math.abs(val - c) <= v.maxJump) return true; // confirmed by 2nd reading
    prev.candidate = val;
    return false;
  }

  /** Latest numeric value of every OK value, keyed by id (for val.<id> in formulas). */
  values() {
    const o = {};
    for (const [id, s] of this.state) if (s.status === 'ok' && typeof s.value === 'number') o[id] = s.value;
    return o;
  }

  _hz(g) {
    const h = g.hist;
    if (h.length < 2) return 0;
    return (h.length - 1) / ((h[h.length - 1] - h[0]) / 1000);
  }

  requestsPerSec() {
    const now = performance.now();
    while (this.completions.length && this.completions[0] < now - 2000) this.completions.shift();
    return this.completions.length / 2;
  }
}
