// Debug panel: TX/RX log, terminal, parsed byte view with diff, poll group table.

import { decodeFrames, toHex, NRC_NAMES } from './elm.js';

const MAX_LOG = 1500;
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const vis = (s) => s.replace(/\r/g, '\\r').replace(/\n/g, '\\n');

const QUICK = [
  ['ATI', 'ATI'], ['ATRV', 'ATRV'], ['ATDP', 'ATDP'], ['0100', '@7DF 0100'],
  ['RPM', '@7E0 010C'], ['TCU 2130', '@7E1 2130'], ['TCU 1A86', '@7E1 1A86'],
  ['ECU 015C', '@7E0 015C'], ['ECU 1A86', '@7E0 1A86'], ['3E00 TCU', '@7E1 3E00'],
];

export class DebugPanel {
  constructor({ elm, poller, prefs, savePrefs }) {
    this.elm = elm;
    this.poller = poller;
    this.prefs = prefs;
    this.savePrefs = savePrefs;
    this.entries = [];
    this.dirty = false;
    this.visible = false;
    this.history = [];
    this.histIdx = -1;
    this.prev = new Map(); // cmd -> last bytes per header
    this.repeatTimer = null;
    this.t0 = performance.now();

    this.logEl = document.getElementById('log');
    this.parsedEl = document.getElementById('parsed');
    this.groupsEl = document.getElementById('groups');
    this.input = document.getElementById('termInput');

    const pollChk = document.getElementById('logPollChk');
    const rawChk = document.getElementById('logRawChk');
    pollChk.checked = prefs.logPolling;
    rawChk.checked = prefs.logRaw;
    pollChk.onchange = () => { prefs.logPolling = pollChk.checked; savePrefs(prefs); };
    rawChk.onchange = () => { prefs.logRaw = rawChk.checked; savePrefs(prefs); };
    this.autoScroll = document.getElementById('autoScrollChk');

    document.getElementById('btnClearLog').onclick = () => { this.entries = []; this.logEl.innerHTML = ''; };
    document.getElementById('btnCopyLog').onclick = () => this.copyLog();
    document.getElementById('pauseChk').onchange = (e) => poller.setPaused(e.target.checked);

    document.getElementById('termForm').onsubmit = (e) => { e.preventDefault(); this.submit(); };
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && this.history.length) {
        this.histIdx = Math.min(this.histIdx + 1, this.history.length - 1);
        this.input.value = this.history[this.histIdx]; e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        this.histIdx = Math.max(this.histIdx - 1, -1);
        this.input.value = this.histIdx < 0 ? '' : this.history[this.histIdx]; e.preventDefault();
      }
    });
    const repeat = document.getElementById('repeatChk');
    repeat.onchange = () => { if (!repeat.checked) this.stopRepeat(); };
    this.repeatChk = repeat;
    this.repeatMs = document.getElementById('repeatMs');

    const q = document.getElementById('quick');
    for (const [label, cmd] of QUICK) {
      const b = document.createElement('button');
      b.className = 'btn'; b.type = 'button'; b.textContent = label; b.title = cmd;
      b.onclick = () => { this.input.value = cmd; this.submit(); };
      q.appendChild(b);
    }

    elm.addEventListener('tx', (e) => {
      if (e.detail.source === 'poll' && !prefs.logPolling) return;
      this.add('tx', `> ${e.detail.cmd}`, e.detail.source);
    });
    elm.addEventListener('rx', (e) => {
      const r = e.detail;
      if (r.source === 'poll' && !prefs.logPolling) return;
      const body = r.lines.length ? r.lines.join(' | ') : '(empty)';
      this.add(r.error ? 'er' : 'rx', `< ${body}${r.error ? `  [${r.error}]` : ''}  ${r.ms}ms`, r.source);
    });
    elm.addEventListener('rxraw', (e) => { if (prefs.logRaw) this.add('rw', `raw ${vis(e.detail)}`); });
    elm.addEventListener('note', (e) => this.add('nt', `# ${e.detail}`));
  }

  note(text) { this.add('nt', `# ${text}`); }

  add(cls, text) {
    const t = ((performance.now() - this.t0) / 1000).toFixed(2).padStart(8, ' ');
    this.entries.push({ cls, text, t });
    if (this.entries.length > MAX_LOG) this.entries.splice(0, this.entries.length - MAX_LOG);
    this.dirty = true;
  }

  setVisible(v) { this.visible = v; this.dirty = true; }

  render() {
    if (!this.visible) return;
    if (this.dirty) {
      this.dirty = false;
      const start = Math.max(0, this.entries.length - 400);
      this.logEl.innerHTML = this.entries.slice(start)
        .map((e) => `<div class="${e.cls}"><span class="ts">${e.t}</span> ${esc(e.text)}</div>`).join('');
      if (this.autoScroll.checked) this.logEl.scrollTop = this.logEl.scrollHeight;
    }
    this.renderGroups();
  }

  renderGroups() {
    const now = performance.now();
    if (this._lastGroups && now - this._lastGroups < 500) return;
    this._lastGroups = now;
    const rows = this.poller.groups.map((g) => {
      const hz = this.poller._hz(g);
      return `<tr><td>${g.header}</td><td>${g.request}</td><td>${g.responseId}</td><td>${g.rateHz}</td><td>${hz.toFixed(1)}</td><td>${g.fails}</td><td>${g.values.map((v) => v.id).join(',')}</td></tr>`;
    }).join('');
    this.groupsEl.innerHTML = `<table><tr><th>hdr</th><th>req</th><th>resp</th><th>Hz set</th><th>Hz real</th><th>fails</th><th>values</th></tr>${rows}</table>`;
  }

  copyLog() {
    const txt = this.entries.map((e) => `${e.t} ${e.text}`).join('\n');
    navigator.clipboard?.writeText(txt).then(() => this.note('Log copied'), () => this.note('Clipboard unavailable'));
  }

  async submit() {
    const line = this.input.value.trim();
    if (!line) return;
    if (this.history[0] !== line) this.history.unshift(line);
    this.history.length = Math.min(this.history.length, 50);
    this.histIdx = -1;
    this.stopRepeat();
    await this.run(line);
    if (this.repeatChk.checked) this.startRepeat(line);
  }

  startRepeat(line) {
    const ms = Math.max(100, Number(this.repeatMs.value) || 500);
    const tick = async () => {
      if (!this.repeatChk.checked) return;
      await this.run(line);
      this.repeatTimer = setTimeout(tick, ms);
    };
    this.repeatTimer = setTimeout(tick, ms);
  }

  stopRepeat() { clearTimeout(this.repeatTimer); this.repeatTimer = null; }

  /** "@7E1 2130" => ATSH7E1 (if needed) then 2130. Multiple commands with ';'. */
  async run(line) {
    if (!this.elm.t.connected) { this.note('Not connected'); return; }
    for (const part of line.split(';').map((s) => s.trim()).filter(Boolean)) {
      let cmd = part;
      let header = null;
      const m = part.match(/^@([0-9A-Fa-f]{3}|[0-9A-Fa-f]{8})\s+(.+)$/);
      if (m) { header = m[1]; cmd = m[2]; }
      const res = await this.elm.send(cmd, { priority: true, source: 'term', timeout: 4000, header });
      this.showParsed(res);
      if (/^AT\s*(Z|D|WS)\b/i.test(cmd)) this.note('Adapter reset - reconnect/re-init may be needed (ATH1 etc.)');
    }
  }

  showParsed(res) {
    const cmd = res.cmd.replace(/\s+/g, '');
    if (/^AT/i.test(cmd) || !res.dataLines.length) {
      this.parsedEl.innerHTML = `<div class="msg-h">${esc(res.cmd)}</div>${esc(res.lines.join(' | ') || '(empty)')}${res.error ? ` <span class="er">[${res.error}]</span>` : ''}`;
      return;
    }
    const msgs = res.msgs || decodeFrames(res.dataLines, this.elm.headersOn);
    let html = '';
    for (const m of msgs) {
      const key = `${this.elm.header}|${cmd}|${m.header}`;
      const prev = this.prev.get(key);
      this.prev.set(key, m.bytes.slice());
      let note = '';
      if (m.bytes[0] === 0x7f) note = ` NRC ${toHex(m.bytes[2])} ${NRC_NAMES[m.bytes[2]] || ''}`;
      html += `<div class="msg-h">${m.header || '---'} · ${m.bytes.length}B · ${m.frames}fr${m.complete ? '' : ' INCOMPLETE'}${m.seqError ? ' SEQ-ERR' : ''}${note}</div><div class="bytes">`;
      m.bytes.forEach((b, i) => {
        const chg = prev && prev[i] !== undefined && prev[i] !== b;
        html += `<span class="byte${chg ? ' chg' : ''}${i === 0 ? ' sid' : ''}" title="dec ${b}"><i>${i}</i>${toHex(b)}</span>`;
      });
      html += '</div>';
    }
    this.parsedEl.innerHTML = html || esc(res.lines.join(' | '));
  }
}
