// Fault codes (DTCs): engine (UDS 19 02 / 14 FFFFFF) and transmission (KWP2000 18 02 FF00 / 14 FF00).
// Descriptions come from js/dtc-data.js, generated from the Mercedes CBF files.

import { toHex } from './elm.js';

const ECUS = [
  { id: 'engine', name: 'Engine (MED17.7)', header: '7E0', responseId: '7E8', proto: 'uds' },
  { id: 'trans', name: 'Transmission (7G-Tronic)', header: '7E1', responseId: '7E9', proto: 'kwp' },
];
const UDS_MASK = 0x2d; // failed now | pending | confirmed | failed since last clear
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let textPromise = null;
const loadText = () => (textPromise ||= import('./dtc-data.js').then((m) => m.DTC_TEXT).catch(() => ({})));

function udsCode(b0, b1, b2) {
  const letter = 'PCBU'[b0 >> 6];
  const base = `${letter}${toHex(b0 & 0x3f)}${toHex(b1)}`;
  return { base, full: `${base}${toHex(b2)}` };
}

function udsStatus(st) {
  const t = [];
  if (st & 0x01) t.push('active');
  if (st & 0x08) t.push('stored');
  if (st & 0x04) t.push('pending');
  if (!(st & 0x0d) && (st & 0x20)) t.push('history');
  if (st & 0x80) t.push('MIL');
  return t;
}

function kwpStatus(st) {
  const state = (st >> 5) & 3;
  const t = [['', 'stored', 'intermittent', 'active'][state]].filter(Boolean);
  if (st & 0x80) t.push('MIL');
  return t;
}

export class Faults {
  constructor({ elm, root, note }) {
    this.elm = elm;
    this.root = root;
    this.note = note;
    this.results = {}; // ecu id -> { list, error, ts }
    this.busy = false;
    this.build();
  }

  build() {
    this.root.innerHTML = `
      <div class="btn-row">
        <button class="btn primary" data-act="read-all">Read all faults</button>
        ${ECUS.map((e) => `<button class="btn" data-act="read" data-ecu="${e.id}">Read ${e.id}</button>`).join('')}
      </div>
      <div class="faults-out"></div>
      <div class="btn-row faults-clear">
        ${ECUS.map((e) => `<button class="btn danger" data-act="clear" data-ecu="${e.id}">Clear ${e.id} faults</button>`).join('')}
      </div>
      <p class="muted small">Clearing erases stored codes and freeze-frame data in that module. Engine running is fine; codes that are still present come back.</p>`;
    this.out = this.root.querySelector('.faults-out');
    this.root.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-act]');
      if (!b || this.busy) return;
      const ecu = ECUS.find((x) => x.id === b.dataset.ecu);
      if (b.dataset.act === 'read-all') this.run(() => this.readAll());
      else if (b.dataset.act === 'read') this.run(() => this.read(ecu));
      else if (b.dataset.act === 'clear' && confirm(`Clear all fault codes in ${ecu.name}?`)) this.run(() => this.clear(ecu));
    });
    this.render();
  }

  async run(fn) {
    if (!this.elm.t.connected) { this.note('Not connected'); this.out.innerHTML = '<p class="muted">Connect first.</p>'; return; }
    this.busy = true;
    this.root.classList.add('busy');
    try { await fn(); } finally { this.busy = false; this.root.classList.remove('busy'); this.render(); }
  }

  async readAll() { for (const e of ECUS) await this.read(e); }

  async read(ecu) {
    this.results[ecu.id] = { reading: true };
    this.render();
    const text = (await loadText())[ecu.responseId] || {};
    const req = ecu.proto === 'uds' ? `1902${toHex(UDS_MASK)}` : '1802FF00';
    const res = await this.elm.send(req, { header: ecu.header, source: 'term', timeout: 5000, priority: true });
    const pos = ecu.proto === 'uds' ? 0x59 : 0x58;
    const msg = (res.msgs || []).find((m) => (!m.header || m.header === ecu.responseId) && (m.bytes[0] === pos || m.bytes[0] === 0x7f));
    if (!msg || msg.bytes[0] === 0x7f) {
      const err = msg ? `NRC ${toHex(msg.bytes[2])}` : (res.error || 'no response');
      this.results[ecu.id] = { error: err, ts: Date.now() };
      return;
    }
    const b = msg.bytes;
    const list = [];
    if (ecu.proto === 'uds') {
      for (let i = 3; i + 3 < b.length; i += 4) {
        const { base, full } = udsCode(b[i], b[i + 1], b[i + 2]);
        const st = b[i + 3];
        list.push({ code: base, sub: toHex(b[i + 2]), status: udsStatus(st), raw: st,
          text: text[full] || text[`${base}00`] || Object.entries(text).find(([k]) => k.startsWith(base))?.[1] || '' });
      }
    } else {
      for (let i = 2; i + 2 < b.length; i += 3) {
        const code = `${toHex(b[i])}${toHex(b[i + 1])}`;
        const st = b[i + 2];
        list.push({ code, sub: '', status: kwpStatus(st), raw: st, text: text[code] || '' });
      }
    }
    this.results[ecu.id] = { list, ts: Date.now(), complete: msg.complete };
  }

  async clear(ecu) {
    const req = ecu.proto === 'uds' ? '14FFFFFF' : '14FF00';
    const res = await this.elm.send(req, { header: ecu.header, source: 'term', timeout: 5000, priority: true });
    const ok = (res.msgs || []).some((m) => (!m.header || m.header === ecu.responseId) && m.bytes[0] === 0x54);
    this.note(`Clear ${ecu.name}: ${ok ? 'OK' : res.error || 'rejected'}`);
    if (ok) await this.read(ecu);
    else this.results[ecu.id] = { ...(this.results[ecu.id] || {}), error: `Clear failed: ${res.error || 'rejected'}` };
  }

  render() {
    let html = '';
    for (const e of ECUS) {
      const r = this.results[e.id];
      html += `<div class="fault-ecu"><div class="fault-head">${esc(e.name)}`;
      if (!r) html += ' <span class="muted">– not read</span></div>';
      else if (r.reading) html += ' <span class="muted">– reading…</span></div>';
      else if (r.error) html += ` <span class="err-txt">– ${esc(r.error)}</span></div>`;
      else {
        html += ` <span class="${r.list.length ? 'err-txt' : 'ok-txt'}">– ${r.list.length ? `${r.list.length} code${r.list.length > 1 ? 's' : ''}` : 'no faults'}</span>`;
        html += ` <span class="muted small">${new Date(r.ts).toLocaleTimeString()}</span></div>`;
        for (const f of r.list) {
          html += `<div class="fault"><div class="fault-code mono">${esc(f.code)}${f.sub ? `<span class="muted">-${esc(f.sub)}</span>` : ''}</div>
            <div class="fault-text">${esc((f.text || 'Unknown code').replace(/ no sub type information$/i, ''))}</div>
            <div class="fault-st small">${f.status.map((t) => `<span class="tag ${t}">${t}</span>`).join('')}<span class="muted mono"> 0x${toHex(f.raw)}</span></div></div>`;
        }
      }
      html += '</div>';
    }
    this.out.innerHTML = html;
  }
}
