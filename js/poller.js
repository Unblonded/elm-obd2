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
        g = { key, header, request, responseId, values: [], rateHz: 0, priority: 0, nextDue: 0, fails: 0, lastOk: 0, lastBytes: null, hist: [] };
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

  async _poll(g) {
    const t0 = performance.now();
    const r = await this.elm.request(g.header, g.request, g.responseId, { useCRA: this.config.useCRA });
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
    const s = { ts: performance.now(), status: 'ok', error: null, hz: this._hz(g) };
    try {
      const val = evalValue(v, bytes);
      s.value = val;
      s.label = mapLabel(v, val);
      if (v.validRange && (val < v.validRange[0] || val > v.validRange[1])) s.status = 'invalid';
    } catch (e) {
      s.status = 'error';
      s.error = e.message;
    }
    this.state.set(v.id, s);
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
