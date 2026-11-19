// "Find a temperature" helper: scan an ECU for data blocks, then watch every byte
// of every block while the engine warms up and rank the bytes that rise like a temperature.

import { toHex, hexToBytes } from './elm.js';

const KEY = 'obdlive.finder.v1';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SCANS = {
  'ECU 21xx': { header: '7E0', responseId: '7E8', list: () => range(0, 255).map((i) => `21${toHex(i)}`) },
  'ECU 22F4xx': { header: '7E0', responseId: '7E8', list: () => range(0, 255).map((i) => `22F4${toHex(i)}`) },
  'TCU 21xx': { header: '7E1', responseId: '7E9', list: () => range(0, 255).map((i) => `21${toHex(i)}`) },
};
const QUICK = [
  { header: '7E0', responseId: '7E8', request: '22F45C' },
  { header: '7DF', responseId: '', request: '015C' },
  { header: '7E1', responseId: '7E9', request: '015C' },
];

function range(a, b) { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; }

function positive(res, request, responseId) {
  const req = hexToBytes(request);
  const echo = req[0] === 0x22 ? 3 : 2;
  for (const m of res.msgs || []) {
    if (responseId && m.header && m.header !== responseId) continue;
    const b = m.bytes;
    if (b[0] !== ((req[0] + 0x40) & 0xff)) continue;
    let ok = true;
    for (let i = 1; i < echo && i < req.length; i++) if (b[i] !== req[i]) ok = false;
    if (ok) return { bytes: b, header: m.header };
  }
  return null;
}

export class Finder {
  constructor({ elm, poller, root, onUse, note }) {
    this.elm = elm;
    this.poller = poller;
    this.root = root;
    this.onUse = onUse;
    this.note = note;
    this.blocks = [];   // { header, responseId, request, len }
    this.track = new Map(); // `${blockKey}#${idx}` -> { first, last, min, max, ups, downs, n, t0 }
    this.busy = null;
    this.watching = false;
    this.coolant = null;
    try { this.blocks = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch {}
    this.build();
  }

  save() { try { localStorage.setItem(KEY, JSON.stringify(this.blocks)); } catch {} }

  build() {
    this.root.innerHTML = `
      <div class="finder-head"><b>Find oil temp</b> <span class="muted small">(best from a cold start, engine running)</span></div>
      <ol class="small finder-steps">
        <li>Tap <b>Quick try</b>, then <b>Scan ECU 21xx</b> and <b>Scan ECU 22F4xx</b> (30–60 s each; tap again to stop).</li>
        <li>Tap <b>Watch</b> and let the engine warm up 5–10 min. Bytes that rise steadily are listed; oil warms slower than coolant and ends hotter.</li>
        <li>When one looks right, tap <b>Use</b> next to the matching formula.</li>
      </ol>
      <div class="quick" data-role="btns"></div>
      <div class="small" data-role="status"></div>
      <div class="finder-out mono small" data-role="out"></div>`;
    const btns = this.root.querySelector('[data-role=btns]');
    const mk = (label, fn) => { const b = document.createElement('button'); b.className = 'btn'; b.type = 'button'; b.textContent = label; b.onclick = () => fn(b); btns.appendChild(b); return b; };
    mk('Quick try', () => this.quick());
    for (const name of Object.keys(SCANS)) mk(`Scan ${name}`, (b) => this.scan(name, b));
    this.watchBtn = mk('Watch', () => this.toggleWatch());
    mk('Reset', () => { if (confirm('Forget found blocks and watch data?')) { this.stopAll(); this.blocks = []; this.track.clear(); this.save(); this.render(); } });
    this.statusEl = this.root.querySelector('[data-role=status]');
    this.outEl = this.root.querySelector('[data-role=out]');
    this.outEl.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-use]');
      if (!b) return;
      const [key, idx, formula] = b.dataset.use.split('|');
      const blk = this.blocks.find((x) => this.key(x) === key);
      if (blk) this.onUse({ header: blk.header, request: blk.request, responseId: blk.responseId, byteOffsets: [Number(idx)], formula });
    });
    this.render();
  }

  key(b) { return `${b.header}:${b.request}`; }

  status(t) { this.statusEl.textContent = t; }

  stopAll() { this.busy = null; this.watching = false; this.watchBtn.textContent = 'Watch'; }

  addBlock(header, responseId, request, len) {
    if (this.blocks.some((b) => b.header === header && b.request === request)) return;
    this.blocks.push({ header, responseId, request, len });
    this.save();
  }

  async quick() {
    if (!this.elm.t.connected) return this.note('Not connected');
    for (const q of QUICK) {
      const res = await this.elm.send(q.request, { header: q.header, source: 'term', timeout: 1500 });
      const p = positive(res, q.request, q.responseId);
      if (p) this.addBlock(q.header, q.responseId || p.header || '', q.request, p.bytes.length);
      this.status(`@${q.header} ${q.request}: ${p ? 'answers ✓' : (res.error || 'no')}`);
    }
    this.render();
  }

  async scan(name, btn) {
    if (this.busy === name) { this.busy = null; return; }
    if (!this.elm.t.connected) return this.note('Not connected');
    const s = SCANS[name];
    const label = btn.textContent;
    this.busy = name;
    btn.textContent = 'Stop';
    const wasPaused = this.poller.paused;
    this.poller.setPaused(true);
    let found = 0;
    for (const req of s.list()) {
      if (this.busy !== name || !this.elm.t.connected) break;
      const res = await this.elm.send(req, { header: s.header, source: 'term', timeout: 700 });
      const p = positive(res, req, s.responseId);
      if (p && p.bytes.length > hexToBytes(req).length) { this.addBlock(s.header, s.responseId, req, p.bytes.length); found++; }
      this.status(`Scanning ${name}: ${req} · ${found} found`);
    }
    this.status(`${name} done · ${found} found · ${this.blocks.length} blocks total`);
    if (this.busy === name) this.busy = null;
    btn.textContent = label;
    this.poller.setPaused(wasPaused);
    this.render();
  }

  toggleWatch() {
    if (this.watching) { this.watching = false; this.watchBtn.textContent = 'Watch'; return; }
    if (!this.blocks.length) { this.status('Scan first - no blocks found yet.'); return; }
    this.watching = true;
    this.watchBtn.textContent = 'Stop watch';
    this.watchLoop();
  }

  async watchLoop() {
    while (this.watching) {
      if (!this.elm.t.connected) { await new Promise((r) => setTimeout(r, 1000)); continue; }
      const t0 = performance.now();
      const c = await this.elm.send('0105', { header: '7E0', source: 'scan', timeout: 1000 });
      const cp = positive(c, '0105', '7E8');
      if (cp) this.coolant = cp.bytes[2] - 40;
      for (const b of this.blocks) {
        if (!this.watching) break;
        const res = await this.elm.send(b.request, { header: b.header, source: 'scan', timeout: 1000 });
        const p = positive(res, b.request, b.responseId);
        if (p) this.record(b, p.bytes);
      }
      this.render();
      const wait = 2000 - (performance.now() - t0);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    }
  }

  record(b, bytes) {
    const start = hexToBytes(b.request).length; // skip SID + echo bytes
    for (let i = start; i < bytes.length; i++) {
      const k = `${this.key(b)}#${i}`;
      const v = bytes[i];
      const t = this.track.get(k);
      if (!t) { this.track.set(k, { first: v, last: v, min: v, max: v, ups: 0, downs: 0, n: 1 }); continue; }
      if (v > t.last) t.ups++; else if (v < t.last) t.downs++;
      t.last = v; t.min = Math.min(t.min, v); t.max = Math.max(t.max, v); t.n++;
    }
  }

  candidates() {
    const out = [];
    for (const [k, t] of this.track) {
      const rise = t.last - t.first;
      // temperature-like: rose a few degrees, mostly upward, not jumpy, plausible range for A-40/A-50
      if (rise < 3 || t.downs > t.ups || t.max - t.min > 120 || t.last < 40) continue;
      out.push({ k, t, rise, score: rise - t.downs * 2 });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, 12);
  }

  render() {
    const blocks = this.blocks.map((b) => `@${b.header} ${b.request} (${b.len}B)`).join(' · ') || 'none yet';
    let html = `<div class="muted">Blocks: ${esc(blocks)}</div>`;
    if (this.track.size) {
      const c = this.candidates();
      html += `<div class="muted">Coolant now: ${this.coolant == null ? '?' : `${this.coolant} °C`} · watching ${this.track.size} bytes</div>`;
      if (!c.length) html += '<div class="muted">No rising bytes yet - keep the engine running.</div>';
      else {
        html += '<table class="finder-tbl"><tr><th>block</th><th>byte</th><th>start→now</th><th>A-40</th><th>A-50</th><th></th></tr>';
        for (const { k, t } of c) {
          const [key, idx] = k.split('#');
          html += `<tr><td>${esc(key.replace(':', ' '))}</td><td>${idx}</td><td>${t.first}→${t.last}</td>` +
            `<td>${t.last - 40}°</td><td>${t.last - 50}°</td>` +
            `<td><button class="btn sm" data-use="${esc(key)}|${idx}|A-40">Use A-40</button> ` +
            `<button class="btn sm" data-use="${esc(key)}|${idx}|A-50">Use A-50</button></td></tr>`;
        }
        html += '</table>';
      }
    }
    this.outEl.innerHTML = html;
  }
}
