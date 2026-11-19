import { loadConfig, saveConfig, resetConfig, validateConfig, loadPrefs, savePrefs } from './config.js';
import { BleTransport, bluetoothAvailable } from './ble.js';
import { MockTransport } from './mock.js';
import { Elm327 } from './elm.js';
import { Poller } from './poller.js';
import { Dashboard } from './dashboard.js';
import { DebugPanel } from './debug.js';

const VERSION = '1.0.0';
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let config = loadConfig();
const prefs = loadPrefs();

// ---------- transport proxy (lets us swap BLE <-> demo without rewiring) ----------
class TransportProxy extends EventTarget {
  constructor() { super(); this.inner = null; this._fwd = (e) => this.dispatchEvent(new CustomEvent(e.type, { detail: e.detail })); }
  use(t) {
    if (this.inner === t) return;
    if (this.inner) for (const ev of ['data', 'connected', 'disconnected', 'status', 'log']) this.inner.removeEventListener(ev, this._fwd);
    this.inner = t;
    for (const ev of ['data', 'connected', 'disconnected', 'status', 'log']) t.addEventListener(ev, this._fwd);
  }
  get connected() { return !!this.inner?.connected; }
  get name() { return this.inner?.name || ''; }
  write(s) { return this.inner.write(s); }
}

const ble = new BleTransport();
const mock = new MockTransport();
const transport = new TransportProxy();
transport.use(prefs.demo ? mock : ble);

const elm = new Elm327(transport);
const poller = new Poller(elm);
poller.load(config);
const dash = new Dashboard($('dash'));
dash.build(config);
const debug = new DebugPanel({ elm, poller, prefs, savePrefs });

// ---------- status UI ----------
let connState = 'idle'; // idle | connecting | init | live | reconnecting | error
function setStatus(state, text, sub = '') {
  connState = state;
  $('statusText').textContent = text;
  $('statusSub').textContent = sub;
  $('statusDot').className = `dot ${state === 'live' ? 'ok' : state === 'error' ? 'err' : state === 'idle' ? '' : 'busy'}`;
  const busy = state !== 'idle' && state !== 'error';
  $('btnConnect').textContent = busy ? 'Disconnect' : 'Connect';
  $('btnConnect').classList.toggle('primary', !busy);
  $('btnConnect').classList.toggle('danger', busy);
}
function banner(msg) {
  const b = $('banner');
  b.hidden = !msg;
  b.textContent = msg || '';
}

transport.addEventListener('status', (e) => { if (connState !== 'live') setStatus(connState === 'idle' ? 'connecting' : connState, e.detail); });
transport.addEventListener('log', (e) => debug.note(e.detail));
transport.addEventListener('connected', () => initAdapter());
transport.addEventListener('disconnected', (e) => {
  poller.stop();
  elm.reset('DISCONNECTED');
  releaseWakeLock();
  if (e.detail?.user) { setStatus('idle', 'Disconnected'); debug.note('Disconnected'); }
  else { setStatus('reconnecting', 'Connection lost', 'auto-reconnecting…'); debug.note('Connection lost - reconnecting'); }
});

// ---------- adapter init ----------
let initRun = 0;
async function initAdapter() {
  const run = ++initRun;
  setStatus('init', `Initializing ${transport.name}`);
  debug.note(`Connected to ${transport.name}; initializing`);
  elm.reset('RESET');
  poller.load(config);
  for (const item of config.init) {
    if (run !== initRun || !transport.connected) return;
    const it = typeof item === 'string' ? { cmd: item } : item;
    const r = await elm.send(it.cmd, { timeout: it.timeout || 2000, source: 'init' });
    if (r.errors.includes('UNKNOWN_CMD')) debug.note(`${it.cmd} not supported by adapter - skipped`);
    else if (r.error && r.error !== 'TIMEOUT') debug.note(`${it.cmd}: ${r.error}`);
    else if (r.error === 'TIMEOUT') debug.note(`${it.cmd}: timeout${it.optional ? ' (optional)' : ''}`);
    if (it.delayAfterMs) await sleep(it.delayAfterMs);
  }
  if (run !== initRun || !transport.connected) return;
  if (config.wake?.cmd) {
    setStatus('init', 'Opening CAN bus…', config.wake.cmd);
    const w = await elm.send(config.wake.cmd, { header: config.wake.header, timeout: config.wake.timeout || 6000, source: 'init' });
    if (w.error) debug.note(`Wake ${config.wake.cmd}: ${w.error} (ignition on?)`);
  }
  if (run !== initRun || !transport.connected) return;
  setStatus('live', transport.name || 'Connected', elm.version || '');
  poller.start();
  requestWakeLock();
}

// ---------- connect button ----------
$('btnConnect').onclick = async () => {
  if (connState !== 'idle' && connState !== 'error') {
    initRun++;
    poller.stop();
    await transport.inner.disconnect();
    setStatus('idle', 'Disconnected');
    return;
  }
  banner('');
  try {
    if (prefs.demo) {
      transport.use(mock);
      await mock.connect();
      return;
    }
    if (!bluetoothAvailable()) {
      banner(isIOS()
        ? 'Safari has no Web Bluetooth. Open this page in the Bluefy browser.'
        : 'Web Bluetooth unavailable. Use Chrome (desktop/Android) over HTTPS, or enable Demo mode in Settings.');
      setStatus('error', 'No Web Bluetooth');
      return;
    }
    transport.use(ble);
    setStatus('connecting', 'Choose adapter…');
    await ble.request();
    await ble.connect();
  } catch (e) {
    const cancelled = e && (e.name === 'NotFoundError' || /cancel/i.test(e.message));
    setStatus(cancelled ? 'idle' : 'error', cancelled ? 'Disconnected' : 'Connect failed', cancelled ? '' : e.message);
    if (!cancelled) debug.note(`Connect failed: ${e.message}`);
  }
};

function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }

// ---------- wake lock ----------
let wakeLock = null;
async function requestWakeLock() {
  if (!prefs.keepAwake || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try { wakeLock = await navigator.wakeLock.request('screen'); } catch {}
}
function releaseWakeLock() { try { wakeLock?.release(); } catch {} wakeLock = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && connState === 'live') requestWakeLock(); });

// ---------- fullscreen ----------
$('btnFullscreen').onclick = async () => {
  const d = document;
  try {
    if (d.fullscreenElement || d.webkitFullscreenElement) await (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else await (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen).call(d.documentElement, { navigationUI: 'hide' });
  } catch {}
  try { await screen.orientation?.lock?.('landscape'); } catch {}
};

// ---------- tabs ----------
for (const t of document.querySelectorAll('.tab')) {
  t.onclick = () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === t));
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${t.dataset.view}`));
    debug.setVisible(t.dataset.view === 'debug');
    if (t.dataset.view === 'settings') fillCfg();
  };
}

// ---------- settings ----------
const demoChk = $('demoChk');
const awakeChk = $('awakeChk');
demoChk.checked = prefs.demo;
awakeChk.checked = prefs.keepAwake;
demoChk.onchange = async () => {
  prefs.demo = demoChk.checked;
  savePrefs(prefs);
  if (transport.connected || connState === 'reconnecting') { initRun++; poller.stop(); await transport.inner.disconnect(); }
  transport.use(prefs.demo ? mock : ble);
  setStatus('idle', 'Disconnected', prefs.demo ? 'demo mode' : '');
};
awakeChk.onchange = () => { prefs.keepAwake = awakeChk.checked; savePrefs(prefs); if (!prefs.keepAwake) releaseWakeLock(); else if (connState === 'live') requestWakeLock(); };
$('btnForget').onclick = () => { try { localStorage.removeItem('obdlive.lastDeviceId'); } catch {} debug.note('Saved adapter forgotten'); cfgMsg('Saved adapter forgotten', true); };

function fillCfg() { $('cfgText').value = JSON.stringify(config, null, 2); cfgMsg(''); }
function cfgMsg(text, ok) { const m = $('cfgMsg'); m.textContent = text; m.className = `small ${ok ? 'ok' : 'err'}`; }
function applyConfig(c) {
  config = c;
  poller.load(config);
  dash.build(config);
  fillCfg();
}
$('btnCfgSave').onclick = () => {
  try {
    const c = JSON.parse($('cfgText').value);
    validateConfig(c);
    saveConfig(c);
    applyConfig(c);
    cfgMsg('Saved and applied.', true);
  } catch (e) { cfgMsg(e.message, false); }
};
$('btnCfgReset').onclick = () => { if (confirm('Reset value configuration to defaults?')) { applyConfig(resetConfig()); cfgMsg('Defaults restored.', true); } };
$('btnCfgExport').onclick = () => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cls-live-config.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$('cfgImport').onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try { const c = JSON.parse(await f.text()); validateConfig(c); saveConfig(c); applyConfig(c); cfgMsg('Imported and applied.', true); }
  catch (err) { cfgMsg(`Import failed: ${err.message}`, false); }
  e.target.value = '';
};
$('about').textContent = `CLS Live v${VERSION} · ${bluetoothAvailable() ? 'Web Bluetooth available' : 'no Web Bluetooth in this browser'}`;

// ---------- command rate ----------
const rxTimes = [];
elm.addEventListener('rx', () => rxTimes.push(performance.now()));

// ---------- render loop ----------
let lastRate = 0;
function frame(now) {
  dash.render(poller.state, now, config.staleAfterMs || 3000);
  debug.render();
  if (now - lastRate > 500) {
    lastRate = now;
    while (rxTimes.length && rxTimes[0] < now - 2000) rxTimes.shift();
    $('rate').textContent = `${(rxTimes.length / 2).toFixed(1)} cmd/s`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------- startup ----------
setStatus('idle', 'Disconnected', prefs.demo ? 'demo mode' : '');
if (!prefs.demo && !bluetoothAvailable()) {
  banner(isIOS() ? 'Safari has no Web Bluetooth - open this page in the Bluefy browser.' : 'Web Bluetooth not available in this browser. Demo mode is in Settings.');
}
// Silent reconnect to a previously-permitted adapter (Chrome with getDevices support).
if (!prefs.demo && bluetoothAvailable()) {
  ble.restore().then(async (ok) => {
    if (!ok || connState !== 'idle') return;
    transport.use(ble);
    setStatus('connecting', `Reconnecting to ${ble.name}…`);
    try {
      await ble.connect();
    } catch (e) {
      setStatus('idle', 'Disconnected', 'tap Connect');
      debug.note(`Auto-connect skipped: ${e.message}`);
    }
  });
}

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// expose for console debugging
window.clsLive = { elm, poller, config: () => config, transport };
