// ELM327 command queue + response parsing (incl. ISO-TP multi-frame).

const ERRORS = [
  [/^NO DATA/i, 'NO_DATA'],
  [/^\?$/, 'UNKNOWN_CMD'],
  [/^STOPPED/i, 'STOPPED'],
  [/CAN ERROR/i, 'CAN_ERROR'],
  [/UNABLE TO CONNECT/i, 'UNABLE_TO_CONNECT'],
  [/BUFFER FULL/i, 'BUFFER_FULL'],
  [/BUS ERROR/i, 'BUS_ERROR'],
  [/BUS BUSY/i, 'BUS_BUSY'],
  [/DATA ERROR/i, 'DATA_ERROR'],
  [/FB ERROR/i, 'FB_ERROR'],
  [/<RX ERROR/i, 'RX_ERROR'],
  [/ACT ALERT/i, 'ACT_ALERT'],
  [/LV RESET/i, 'LV_RESET'],
  [/^ERR\d*/i, 'ERROR'],
];

const NOISE = [/^SEARCHING/i, /^BUS INIT/i];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.replace(/\s+/g, '').toUpperCase();

export function hexToBytes(hex) {
  const h = hex.replace(/[^0-9A-Fa-f]/g, '');
  const out = [];
  for (let i = 0; i + 1 < h.length; i += 2) out.push(parseInt(h.substr(i, 2), 16));
  return out;
}

export const toHex = (b) => b.toString(16).toUpperCase().padStart(2, '0');
export const bytesToHex = (arr, sep = ' ') => arr.map(toHex).join(sep);

export function isAtCommand(cmd) { return /^AT/i.test(cmd.trim()); }

/** Split raw ELM text into cleaned lines, classify errors. */
export function parseResponse(cmd, raw) {
  let lines = raw.split(/[\r\n]+/).map((s) => s.trim()).filter(Boolean);
  if (lines.length && norm(lines[0]) === norm(cmd)) lines.shift(); // echo
  lines = lines.filter((l) => !NOISE.some((re) => re.test(l)));
  const errors = [];
  const data = [];
  for (const l of lines) {
    const e = ERRORS.find(([re]) => re.test(l));
    if (e) errors.push(e[1]);
    else data.push(l);
  }
  let error = null;
  if (!data.length) error = errors[0] || (isAtCommand(cmd) ? null : 'EMPTY');
  return { cmd, raw, lines, dataLines: data, errors, error };
}

/**
 * Decode CAN frames into messages (ISO-TP reassembled).
 * headersOn: lines look like "7E8064100BE3FA813" (11-bit) or 29-bit equivalents.
 * headersOff: single frames are bare data, multi-frame is "014" / "0:..." / "1:..." format.
 */
export function decodeFrames(lines, headersOn = true) {
  return headersOn ? decodeWithHeaders(lines) : decodeHeaderless(lines);
}

function decodeWithHeaders(lines) {
  const msgs = [];
  const pending = new Map();
  for (const line of lines) {
    if (!/^[0-9A-Fa-f\s]+$/.test(line)) continue;
    const hex = line.replace(/\s+/g, '').toUpperCase();
    const hLen = hex.length % 2 ? 3 : 8;
    if (hex.length < hLen + 2) continue;
    const header = hex.slice(0, hLen);
    const b = hexToBytes(hex.slice(hLen));
    const type = b[0] >> 4;
    if (type === 0) {
      const len = b[0] & 0x0f;
      msgs.push({ header, bytes: b.slice(1, 1 + len), complete: b.length - 1 >= len, frames: 1 });
    } else if (type === 1) {
      const len = ((b[0] & 0x0f) << 8) | b[1];
      const m = { header, bytes: b.slice(2), complete: false, frames: 1, _len: len, _seq: 1 };
      pending.set(header, m);
      msgs.push(m);
    } else if (type === 2) {
      const m = pending.get(header);
      if (!m) continue;
      const seq = b[0] & 0x0f;
      if (seq !== (m._seq & 0x0f)) m.seqError = true;
      m._seq++;
      m.frames++;
      m.bytes.push(...b.slice(1));
      if (m.bytes.length >= m._len) {
        m.bytes.length = m._len;
        m.complete = true;
        pending.delete(header);
      }
    }
    // type 3 = flow control, ignore
  }
  for (const m of msgs) { delete m._len; delete m._seq; }
  return msgs;
}

function decodeHeaderless(lines) {
  const msgs = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^([0-9A-Fa-f]):\s*(.*)$/);
    if (m) {
      if (!cur) { cur = { header: null, bytes: [], complete: false, frames: 0, _len: Infinity }; msgs.push(cur); }
      cur.bytes.push(...hexToBytes(m[2]));
      cur.frames++;
      if (cur.bytes.length >= cur._len) { cur.bytes.length = cur._len; cur.complete = true; cur = null; }
      continue;
    }
    if (!/^[0-9A-Fa-f\s]+$/.test(line)) continue;
    const hex = line.replace(/\s+/g, '');
    if (hex.length === 3) {
      cur = { header: null, bytes: [], complete: false, frames: 0, _len: parseInt(hex, 16) };
      msgs.push(cur);
      continue;
    }
    if (hex.length % 2 === 0) msgs.push({ header: null, bytes: hexToBytes(hex), complete: true, frames: 1 });
  }
  for (const m of msgs) delete m._len;
  return msgs;
}

/** Find the positive response to `request` from `responseId` among decoded messages. */
export function matchResponse(msgs, request, responseId) {
  const req = hexToBytes(request);
  const sid = req[0];
  const rid = (responseId || '').toUpperCase();
  const echoLen = { 0x01: 1, 0x02: 1, 0x09: 1, 0x21: 1, 0x22: 2, 0x1a: 1 }[sid] || 0;
  let nrc = null;
  for (const m of msgs) {
    if (rid && m.header && m.header !== rid) continue;
    const b = m.bytes;
    if (b[0] === 0x7f && b[1] === sid) {
      if (b[2] === 0x78) continue; // response pending
      nrc = b[2];
      continue;
    }
    if (b[0] !== ((sid + 0x40) & 0xff)) continue;
    let echoOk = true;
    for (let i = 1; i <= echoLen && i < req.length; i++) if (b[i] !== req[i]) echoOk = false;
    if (!echoOk) continue;
    return { ok: true, bytes: b, complete: m.complete, header: m.header };
  }
  if (nrc != null) return { ok: false, error: 'NEGATIVE', nrc };
  return { ok: false, error: 'NO_MATCH' };
}

export const NRC_NAMES = {
  0x10: 'generalReject', 0x11: 'serviceNotSupported', 0x12: 'subFunctionNotSupported',
  0x13: 'incorrectLength', 0x21: 'busyRepeatRequest', 0x22: 'conditionsNotCorrect',
  0x31: 'requestOutOfRange', 0x33: 'securityAccessDenied', 0x78: 'responsePending',
  0x7e: 'subFunctionNotSupportedInActiveSession', 0x7f: 'serviceNotSupportedInActiveSession',
};

export class Elm327 extends EventTarget {
  constructor(transport, opts = {}) {
    super();
    this.t = transport;
    this.queue = [];
    this.current = null;
    this.buf = '';
    this.header = null;
    this.cra = null;
    this.headersOn = true;
    this.defaultTimeout = opts.timeout || 1200;
    this.minGapMs = opts.minGapMs || 50;
    this.lastSend = 0;
    this.recovering = false;
    this.version = '';
    this.unsupported = new Set();
    this.sentHeaderInit = new Set();
    this.headerInit = {};
    this._onData = this._onData.bind(this);
    transport.addEventListener('data', (e) => this._onData(e.detail));
  }

  setRate(maxPerSec) { this.minGapMs = Math.max(0, 1000 / Math.max(1, maxPerSec)); }

  _emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }

  /** Clear state after (re)connect or disconnect. */
  reset(reason = 'RESET') {
    this.buf = '';
    this.header = null;
    this.cra = null;
    this.headersOn = true;
    this.recovering = false;
    this.sentHeaderInit.clear();
    if (this.current) { clearTimeout(this.current.timer); this.current.resolve({ cmd: this.current.cmd, error: reason, lines: [], dataLines: [], errors: [reason], raw: '' }); this.current = null; }
    for (const j of this.queue.splice(0)) j.resolve({ cmd: j.cmd, error: reason, lines: [], dataLines: [], errors: [reason], raw: '' });
  }

  /**
   * Queue a command. Resolves with parseResponse() result (+ msgs, ms). Never rejects.
   * opts.header: TX header this command must go to (ATSH is inserted right before it if needed,
   * so header + request are atomic even when other commands interleave).
   * opts.cra: CAN receive filter to apply (only if adapter supports ATCRA).
   */
  send(cmd, opts = {}) {
    cmd = cmd.trim().toUpperCase();
    return new Promise((resolve) => {
      const job = {
        cmd, resolve,
        timeout: opts.timeout || this.defaultTimeout,
        source: opts.source || 'poll',
        header: opts.header ? opts.header.toUpperCase() : null,
        cra: opts.cra != null ? opts.cra.toUpperCase() : null,
        tries: 0,
      };
      if (opts.priority) this.queue.unshift(job); else this.queue.push(job);
      this._pump();
    });
  }

  _prefixJobs(job) {
    const pre = [];
    const mk = (cmd) => ({ cmd, resolve: () => {}, timeout: this.defaultTimeout, source: job.source, internal: true });
    if (job.header && job.header !== this.header) {
      pre.push(mk(`ATSH${job.header}`));
      const init = this.headerInit[job.header];
      if (init && init.length && !this.sentHeaderInit.has(job.header)) {
        this.sentHeaderInit.add(job.header);
        for (const c of init) pre.push(mk(c.toUpperCase()));
      }
    }
    if (job.cra != null && !this.unsupported.has('ATCRA') && job.cra !== (this.cra ?? '')) {
      pre.push(mk(job.cra ? `ATCRA${job.cra}` : 'ATCRA'));
    }
    return pre;
  }

  async _pump() {
    if (this.current || this.recovering || !this.queue.length) return;
    if (!this.t.connected) { this.reset('DISCONNECTED'); return; }
    let job = this.queue[0];
    const pre = job.internal ? [] : this._prefixJobs(job);
    if (pre.length) {
      if (++job.tries > 3) {
        this.queue.shift();
        job.resolve({ cmd: job.cmd, error: 'ATSH_FAILED', errors: ['ATSH_FAILED'], lines: [], dataLines: [], raw: '' });
        setTimeout(() => this._pump(), 0);
        return;
      }
      this.queue.unshift(...pre);
      job = this.queue[0];
    }
    this.queue.shift();
    this.current = job;
    const wait = this.lastSend + this.minGapMs - performance.now();
    if (wait > 0) await sleep(wait);
    if (this.current !== job) return; // reset meanwhile
    this.buf = '';
    job.t0 = performance.now();
    this.lastSend = job.t0;
    this._emit('tx', { cmd: job.cmd, source: job.source });
    job.timer = setTimeout(() => this._timeout(job), job.timeout);
    try {
      await this.t.write(job.cmd + '\r');
    } catch (e) {
      this._finish(job, '', 'WRITE_FAILED');
    }
  }

  _onData(chunk) {
    this._emit('rxraw', chunk);
    this.buf += chunk;
    let i;
    while ((i = this.buf.indexOf('>')) >= 0) {
      const raw = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 1);
      if (this.recovering) {
        this.recovering = false;
        clearTimeout(this.recoverTimer);
        this._emit('note', 'Adapter prompt recovered');
        setTimeout(() => this._pump(), 0);
      } else if (this.current) {
        this._finish(this.current, raw, null);
      } else if (raw.trim()) {
        this._emit('note', `Unsolicited: ${raw.trim()}`);
      }
    }
  }

  _timeout(job) {
    if (this.current !== job) return;
    const partial = this.buf;
    // Interrupt the ELM (any char stops it) and wait for its prompt before continuing.
    this.recovering = true;
    this.buf = '';
    this.t.write('\r').catch(() => {});
    this.recoverTimer = setTimeout(() => { this.recovering = false; this.buf = ''; this._pump(); }, 800);
    this._finish(job, partial, 'TIMEOUT');
  }

  _finish(job, raw, err) {
    if (this.current !== job) return;
    clearTimeout(job.timer);
    this.current = null;
    const res = parseResponse(job.cmd, raw);
    if (err) { res.error = err; res.errors.push(err); }
    res.ms = Math.round(performance.now() - job.t0);
    res.source = job.source;
    if (!isAtCommand(job.cmd) && res.dataLines.length) res.msgs = decodeFrames(res.dataLines, this.headersOn);
    this._trackState(job.cmd, res);
    this._emit('rx', res);
    job.resolve(res);
    if (!this.recovering) setTimeout(() => this._pump(), 0);
  }

  _trackState(cmd, res) {
    const c = cmd.replace(/\s+/g, '');
    const ok = !res.error && !res.errors.includes('UNKNOWN_CMD');
    if (/^ATSH[0-9A-F]+$/.test(c)) this.header = ok ? c.slice(4) : null;
    else if (/^ATCRA[0-9A-F]*$/.test(c)) this.cra = ok ? c.slice(5) : null;
    else if (/^ATH[01]$/.test(c) && ok) this.headersOn = c === 'ATH1';
    else if (/^AT(Z|D|WS|SP|TP)/.test(c)) {
      this.header = null; this.cra = null; this.sentHeaderInit.clear();
      if (/^AT(Z|D|WS)/.test(c)) this.headersOn = false;
      const v = res.lines.find((l) => /ELM/i.test(l));
      if (v) this.version = v;
    }
    if (res.errors.includes('UNKNOWN_CMD') && isAtCommand(cmd)) this.unsupported.add(c.startsWith('ATCRA') ? 'ATCRA' : c);
  }

  /** Send a diagnostic request to header and return matched positive response. */
  async request(header, request, responseId, opts = {}) {
    const res = await this.send(request, { ...opts, header, cra: opts.useCRA ? (responseId || '') : null });
    if (res.error) return { ok: false, error: res.error, res };
    const m = matchResponse(res.msgs || [], request, responseId);
    m.res = res;
    return m;
  }
}
