// Simulated ELM327 + car for testing the UI without hardware.

const hx = (n) => n.toString(16).toUpperCase().padStart(2, '0');

export class MockTransport extends EventTarget {
  constructor() {
    super();
    this.connected = false;
    this.name = 'Demo ELM327';
    this.inbuf = '';
    this.echo = true;
    this.headers = false;
    this.spaces = true;
    this.header = '7DF';
    this.t0 = Date.now();
  }
  _emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }
  async request() {}
  async restore() { return false; }
  async connect() {
    this._emit('status', 'Connecting to demo…');
    await new Promise((r) => setTimeout(r, 300));
    this.connected = true;
    this._emit('connected', { name: this.name });
  }
  async disconnect() {
    this.connected = false;
    this._emit('disconnected', { user: true, wasConnected: true });
  }
  async write(str) {
    if (!this.connected) throw new Error('Not connected');
    for (const ch of str) {
      if (ch === '\r') { const cmd = this.inbuf.trim(); this.inbuf = ''; this._handle(cmd); }
      else this.inbuf += ch;
    }
  }

  _reply(cmd, lines, delay = 25 + Math.random() * 30) {
    let text = (this.echo ? cmd + '\r' : '') + lines.join('\r') + '\r\r>';
    setTimeout(() => {
      // deliver in BLE-sized chunks to exercise buffering
      for (let i = 0; i < text.length; i += 20) {
        const part = text.slice(i, i + 20);
        this._emit('data', part);
      }
    }, delay);
  }

  _frame(id, bytes) {
    const parts = [id, ...bytes.map(hx)];
    if (!this.headers) parts.shift();
    return parts.join(this.spaces ? ' ' : '');
  }

  _respond(id, payload) {
    if (payload.length <= 7) {
      const b = [payload.length, ...payload];
      while (b.length < 8) b.push(0x55);
      return [this._frame(id, this.headers ? b : payload)];
    }
    if (!this.headers) {
      const out = [hx(payload.length).padStart(3, '0')];
      let i = 0;
      out.push('0: ' + payload.slice(0, 6).map(hx).join(' '));
      i = 6;
      let n = 1;
      while (i < payload.length) { out.push(`${n.toString(16).toUpperCase()}: ` + payload.slice(i, i + 7).map(hx).join(' ')); i += 7; n++; }
      return out;
    }
    const out = [this._frame(id, [0x10 | (payload.length >> 8), payload.length & 0xff, ...payload.slice(0, 6)])];
    let i = 6;
    let seq = 1;
    while (i < payload.length) {
      const chunk = payload.slice(i, i + 7);
      while (chunk.length < 7) chunk.push(0x55);
      out.push(this._frame(id, [0x20 | (seq & 0xf), ...chunk]));
      i += 7;
      seq++;
    }
    return out;
  }

  _sim() {
    const t = (Date.now() - this.t0) / 1000;
    const phase = Math.floor(t / 8) % 6; // P R N D D M
    const sel = [0x0a, 0x09, 0x08, 0x07, 0x07, 0x07][phase];
    const prog = phase === 5 ? 3 : 0; // last phase: manual program
    const driving = sel === 0x07;
    const rpm = driving ? 1400 + 2600 * (0.5 + 0.5 * Math.sin(t * 0.9)) : 650 + 30 * Math.sin(t * 3);
    const gear = driving ? 1 + (Math.floor(t / 2) % 7) : 0;
    return { rpm, sel, prog, gear, atf: 50 + Math.min(40, t / 10), oil: 85 + 10 * Math.sin(t / 30), clt: 88 };
  }

  _handle(raw) {
    const cmd = raw.replace(/\s+/g, '').toUpperCase();
    if (!cmd) return this._reply(raw, []);
    if (cmd.startsWith('AT')) {
      const a = cmd.slice(2);
      if (a === 'Z' || a === 'WS') { this.echo = true; this.headers = false; this.spaces = true; return this._reply(raw, ['', 'ELM327 v1.5'], 400); }
      if (a === 'I') return this._reply(raw, ['ELM327 v1.5']);
      if (a === 'RV') return this._reply(raw, ['14.2V']);
      if (a === 'DP') return this._reply(raw, ['ISO 15765-4 (CAN 11/500)']);
      if (/^E[01]$/.test(a)) { const r = this._reply(raw, ['OK']); this.echo = a === 'E1'; return r; }
      if (/^H[01]$/.test(a)) { this.headers = a === 'H1'; return this._reply(raw, ['OK']); }
      if (/^S[01]$/.test(a)) { this.spaces = a === 'S1'; return this._reply(raw, ['OK']); }
      if (/^SH[0-9A-F]{3}$/.test(a)) { this.header = a.slice(2); return this._reply(raw, ['OK']); }
      if (/^CRA/.test(a)) return this._reply(raw, ['?']); // emulate a clone lacking ATCRA
      return this._reply(raw, ['OK']);
    }
    if (!/^[0-9A-F]+$/.test(cmd)) return this._reply(raw, ['?']);
    const s = this._sim();
    const h = this.header;
    const toEngine = h === '7E0' || h === '7DF';
    const toTcu = h === '7E1';
    if (toEngine && cmd === '0100') return this._reply(raw, ['SEARCHING...', ...this._respond('7E8', [0x41, 0x00, 0xbe, 0x3f, 0xa8, 0x13])], 300);
    if (toEngine && cmd === '010C') { const v = Math.round(s.rpm * 4); return this._reply(raw, this._respond('7E8', [0x41, 0x0c, v >> 8, v & 0xff])); }
    if (toEngine && cmd === '0133') return this._reply(raw, this._respond('7E8', [0x41, 0x33, 100]));
    if (toEngine && cmd === '010B') return this._reply(raw, this._respond('7E8', [0x41, 0x0b, Math.round(Math.max(35, 100 + (s.rpm - 1400) / 30))]));
    if (toEngine && cmd === '2112') return this._reply(raw, this._respond('7E8', [0x61, 0x12, 0x33, 0x80, Math.round(s.clt + 40), 0x10, Math.round(30 + (Date.now() - this.t0) / 2000) & 0xff, (Date.now() / 50) & 0xff]));
    if (toEngine && cmd === '222095') return this._reply(raw, this._respond('7E8', [0x62, 0x20, 0x95, Math.round((s.oil + 48) / 0.75)]));
    if (toEngine && cmd === '0105') return this._reply(raw, this._respond('7E8', [0x41, 0x05, Math.round(s.clt + 40)]));
    if (toEngine && cmd === '015C') return this._reply(raw, ['NO DATA'], 150);
    if (toEngine && cmd === '2201A6') return this._reply(raw, this._respond('7E8', [0x62, 0x01, 0xa6, Math.round(s.oil + 40)]));
    if (toTcu && cmd === '2130') {
      const p = [0x61, 0x30];
      for (let i = 2; i < 30; i++) p.push((i * 37) & 0xff);
      p[9] = s.sel;
      p[10] = s.prog;
      p[12] = s.gear | (s.gear << 4);
      p[13] = Math.round(s.atf + 50);
      p[5] = (Date.now() / 100) & 0xff; // a counter, to show the diff view
      return this._reply(raw, this._respond('7E9', p));
    }
    if (toTcu && cmd === '2131') return this._reply(raw, this._respond('7E9', [0x61, 0x31, 1, 2, 3]));
    if (toTcu && /^21/.test(cmd)) return this._reply(raw, this._respond('7E9', [0x7f, 0x21, 0x12]));
    if (/^1[0-9A-F]/.test(cmd) || /^3E/.test(cmd)) {
      const id = toTcu ? '7E9' : '7E8';
      const sid = parseInt(cmd.slice(0, 2), 16) + 0x40;
      return this._reply(raw, this._respond(id, [sid, parseInt(cmd.slice(2, 4) || '0', 16)]));
    }
    return this._reply(raw, ['NO DATA'], 120);
  }
}
