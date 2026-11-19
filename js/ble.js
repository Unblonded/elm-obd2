// Web Bluetooth UART transport for BLE ELM327 clones.

const uuid16 = (x) => `0000${x}-0000-1000-8000-00805f9b34fb`;

export const UART_PROFILES = [
  { service: uuid16('fff0'), write: [uuid16('fff2')], notify: [uuid16('fff1')] },
  { service: uuid16('ffe0'), write: [uuid16('ffe1')], notify: [uuid16('ffe1')] },
  { service: uuid16('18f0'), write: [uuid16('2af1')], notify: [uuid16('2af0')] },
  {
    service: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
    write: ['bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'],
    notify: ['bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'],
  },
];

const CHUNK = 20; // safe for default ATT MTU
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function bluetoothAvailable() {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth;
}

export class BleTransport extends EventTarget {
  constructor() {
    super();
    this.device = null;
    this.server = null;
    this.writeChar = null;
    this.notifyChar = null;
    this.connected = false;
    this.userDisconnect = false;
    this.reconnectAttempt = 0;
    this.reconnectTimer = null;
    this.decoder = new TextDecoder();
    this._onNotify = this._onNotify.bind(this);
    this._onGattDisconnected = this._onGattDisconnected.bind(this);
  }

  get name() { return this.device?.name || 'BLE adapter'; }

  _emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }
  _log(msg) { this._emit('log', msg); }

  /** Shows the chooser (must be called from a user gesture). */
  async request() {
    if (!bluetoothAvailable()) throw new Error('Web Bluetooth not available in this browser');
    const optionalServices = UART_PROFILES.map((p) => p.service);
    this.device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices });
    this._attachDevice();
    try { localStorage.setItem('obdlive.lastDeviceId', this.device.id); } catch {}
  }

  /** Try to reuse a previously-permitted device without the chooser (Chrome with getDevices). */
  async restore() {
    if (!bluetoothAvailable() || !navigator.bluetooth.getDevices) return false;
    let id = null;
    try { id = localStorage.getItem('obdlive.lastDeviceId'); } catch {}
    if (!id) return false;
    try {
      const devices = await navigator.bluetooth.getDevices();
      const d = devices.find((x) => x.id === id);
      if (!d) return false;
      this.device = d;
      this._attachDevice();
      return true;
    } catch { return false; }
  }

  _attachDevice() {
    this.device.removeEventListener('gattserverdisconnected', this._onGattDisconnected);
    this.device.addEventListener('gattserverdisconnected', this._onGattDisconnected);
  }

  async connect() {
    if (!this.device) throw new Error('No device selected');
    this.userDisconnect = false;
    clearTimeout(this.reconnectTimer);
    this._emit('status', `Connecting to ${this.name}…`);
    this.server = await this.device.gatt.connect();
    await this._discover();
    await this.notifyChar.startNotifications();
    this.notifyChar.addEventListener('characteristicvaluechanged', this._onNotify);
    this.connected = true;
    this.reconnectAttempt = 0;
    this._emit('connected', { name: this.name });
  }

  async _discover() {
    this.writeChar = null;
    this.notifyChar = null;
    for (const prof of UART_PROFILES) {
      let svc;
      try { svc = await this.server.getPrimaryService(prof.service); } catch { continue; }
      let chars;
      try { chars = await svc.getCharacteristics(); } catch { continue; }
      const byUuid = (list) => chars.find((c) => list.includes(c.uuid));
      const canWrite = (c) => c.properties.write || c.properties.writeWithoutResponse;
      const canNotify = (c) => c.properties.notify || c.properties.indicate;
      let w = byUuid(prof.write);
      if (!w || !canWrite(w)) w = chars.find(canWrite);
      let n = byUuid(prof.notify);
      if (!n || !canNotify(n)) n = chars.find(canNotify);
      this._log(`Service ${prof.service}: ` +
        chars.map((c) => `${c.uuid.slice(4, 8)}[${propStr(c.properties)}]`).join(' '));
      if (w && n) {
        this.writeChar = w;
        this.notifyChar = n;
        this._log(`Using write=${w.uuid} notify=${n.uuid}`);
        return;
      }
    }
    throw new Error('No UART characteristics found on known services');
  }

  _onNotify(ev) {
    const dv = ev.target.value;
    const text = this.decoder.decode(new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength));
    this._emit('data', text);
  }

  async write(str) {
    if (!this.connected || !this.writeChar) throw new Error('Not connected');
    const bytes = new TextEncoder().encode(str);
    const c = this.writeChar;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      const part = bytes.slice(i, i + CHUNK);
      if (c.properties.write && c.writeValueWithResponse) await c.writeValueWithResponse(part);
      else if (c.properties.writeWithoutResponse && c.writeValueWithoutResponse) await c.writeValueWithoutResponse(part);
      else await c.writeValue(part);
    }
  }

  _onGattDisconnected() {
    const was = this.connected;
    this.connected = false;
    try { this.notifyChar?.removeEventListener('characteristicvaluechanged', this._onNotify); } catch {}
    this._emit('disconnected', { user: this.userDisconnect, wasConnected: was });
    if (!this.userDisconnect) this._scheduleReconnect();
  }

  _scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 10000);
    this.reconnectAttempt++;
    this._emit('status', `Reconnecting in ${Math.round(delay / 1000)}s…`);
    this.reconnectTimer = setTimeout(async () => {
      if (this.userDisconnect) return;
      try {
        await this.connect();
      } catch (e) {
        this._log(`Reconnect failed: ${e.message}`);
        if (!this.userDisconnect) this._scheduleReconnect();
      }
    }, delay);
  }

  async disconnect() {
    this.userDisconnect = true;
    clearTimeout(this.reconnectTimer);
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
    else if (this.connected) this._onGattDisconnected();
    else this._emit('disconnected', { user: true, wasConnected: false });
  }
}

function propStr(p) {
  return [p.read && 'r', p.write && 'w', p.writeWithoutResponse && 'W', p.notify && 'n', p.indicate && 'i']
    .filter(Boolean).join('');
}

export { sleep };
