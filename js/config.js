// Default configuration for the dashboard.
//
// Byte offsets index into the *reassembled* diagnostic response payload
// (ISO-TP PCI bytes removed). Index 0 is the positive-response service byte:
//   0x41 for OBD mode 01, 0x61 for KWP2000 21 xx, 0x62 for UDS 22 xx xx.
// e.g. "010C" -> 41 0C A B  => RPM bytes are at offsets [2,3].
//
// Formula variables: A,B,C,D,E,F,G,H = bytes at byteOffsets[0..7], val.<id> = other values,
//   x = A, bytes = full payload array,
//   helpers: s8(a), u16(hi,lo), s16(hi,lo), bit(v,n)
//
// Values that share header+request+responseId are fetched with ONE request.

export const DEFAULT_CONFIG = {
  schema: 4,
  maxRequestsPerSec: 18,      // hard cap on commands/sec (ATSH included)
  commandTimeoutMs: 1200,
  staleAfterMs: 3000,
  useCRA: false,              // send ATCRA<responseId> filter (auto-disabled if adapter returns '?')

  init: [
    { cmd: 'ATZ', timeout: 4000, delayAfterMs: 500 },
    { cmd: 'ATE0' },
    { cmd: 'ATL0' },
    { cmd: 'ATS0' },
    { cmd: 'ATH1' },
    { cmd: 'ATSP6' },
    { cmd: 'ATCAF1', optional: true },
    { cmd: 'ATAT1', optional: true },
  ],

  // Sent once after init to open the bus.
  wake: { header: '7DF', cmd: '0100', timeout: 6000 },

  // Commands sent once per connection, the first time a header is selected
  // (e.g. a diagnostic session: { "7E1": ["1081"] }).
  headerInit: {},

  values: [
    {
      id: 'rpm', name: 'Engine RPM', display: 'gauge',
      header: '7E0', request: '010C', responseId: '7E8',
      byteOffsets: [2, 3], formula: '(A*256+B)/4',
      unit: 'rpm', decimals: 0, pollRateHz: 8, priority: 10,
      min: 0, max: 7000, redline: 6200,
      enabled: true, verified: true,
    },
    // --- Transmission (VGS-NAG2), all from one 21 30 request; layout from the VGSNAG2 CBF ---
    {
      id: 'gearSelector', name: 'Selector', display: 'gear-selector',
      header: '7E1', request: '2130', responseId: '7E9',
      byteOffsets: [9], formula: 'A', // "Waehlhebel intern"
      map: {
        '7': 'D', '8': 'N', '9': 'R', '10': 'P',
        '1': 'M', '2': 'M', '3': 'M', '4': 'M', '5': 'M', '6': 'M', '99': 'M', '101': 'M',
        '11': 'N', '12': 'N', '13': 'R', '249': 'D', '250': 'P', '0': '–', '255': '–',
      },
      pollRateHz: 3, priority: 6,
      enabled: true, verified: true,
    },
    {
      id: 'driveProgram', name: 'Program', display: 'gear-program',
      header: '7E1', request: '2130', responseId: '7E9',
      byteOffsets: [10], formula: 'A', // "Fahrprogramm"
      map: { '0': 'S', '1': 'C', '2': 'A', '3': 'M' }, // Standard / Comfort / Agility / Manuell
      pollRateHz: 3, priority: 6,
      enabled: true, verified: true,
    },
    {
      id: 'gearEngaged', name: 'Gear', display: 'gear-number',
      header: '7E1', request: '2130', responseId: '7E9',
      byteOffsets: [12], formula: 'A & 0x0F', validRange: [1, 7], // "Istgang" (high nibble = target gear)
      pollRateHz: 3, priority: 6,
      enabled: true, verified: true,
    },
    {
      id: 'transTemp', name: 'Trans Temp', display: 'tile',
      header: '7E1', request: '2130', responseId: '7E9',
      byteOffsets: [13], formula: 'A-50', // "Getriebeoeltemperatur"
      unit: '°C', decimals: 0, pollRateHz: 1, priority: 2,
      warnAbove: 110, critAbove: 125,
      enabled: true, verified: true,
    },
    // --- Engine (MED17.7, UDS 22 xx xx); IDs from the MED177 CBF ---
    {
      id: 'oilTemp', name: 'Oil Temp', display: 'tile',
      header: '7E0', request: '222095', responseId: '7E8',
      byteOffsets: [3], formula: 'A*0.75-48', // "Temperatursensor Oel"
      unit: '°C', decimals: 0, pollRateHz: 0.5, priority: 2,
      warnAbove: 130, critAbove: 145,
      enabled: true, verified: true,
    },
    {
      id: 'baro', name: 'Baro', display: 'none',
      header: '7E0', request: '0133', responseId: '7E8',
      byteOffsets: [2], formula: 'A', unit: 'kPa',
      pollRateHz: 0.2, priority: 1,
      enabled: true, verified: true,
    },
    {
      id: 'boost', name: 'Boost', display: 'tile',
      header: '7E0', request: '010B', responseId: '7E8',
      byteOffsets: [2],
      // MAP (kPa abs) minus barometric pressure, in psi. Negative = vacuum.
      formula: '(A - (val.baro ?? 101.3)) * 0.145038',
      unit: 'psi', decimals: 1, pollRateHz: 4, priority: 7,
      warnAbove: 15, critAbove: 19,
      enabled: true, verified: false,
      note: 'Standard PID 010B (MAP). For bar use (A - (val.baro ?? 101.3)) / 100.',
    },
    {
      id: 'coolant', name: 'Coolant', display: 'tile',
      header: '7E0', request: '0105', responseId: '7E8',
      byteOffsets: [2], formula: 'A-40',
      unit: '°C', decimals: 0, pollRateHz: 0.5, priority: 1,
      warnAbove: 110, critAbove: 118,
      enabled: false, verified: true,
    },
    {
      id: 'oilPressure', name: 'Oil Press', display: 'tile',
      header: '7E0', request: '222020', responseId: '7E8',
      byteOffsets: [3, 4], formula: 's16(A,B)*0.5/1000', // "Oeldruck" hPa -> bar
      unit: 'bar', decimals: 1, pollRateHz: 1, priority: 2,
      enabled: false, verified: true,
    },
    {
      id: 'intakeTemp', name: 'Intake Air', display: 'tile',
      header: '7E0', request: '22201C', responseId: '7E8',
      byteOffsets: [3], formula: 'A*0.75-48', // "Ansauglufttemperatur im Saugrohr"
      unit: '°C', decimals: 0, pollRateHz: 0.5, priority: 1,
      enabled: false, verified: true,
    },
    {
      id: 'battery', name: 'Battery', display: 'tile',
      header: '7E0', request: '222022', responseId: '7E8',
      byteOffsets: [3, 4], formula: 'u16(A,B)*0.02355', // "Batteriespannung"
      unit: 'V', decimals: 1, pollRateHz: 0.5, priority: 1,
      enabled: false, verified: true,
    },
  ],
};

const KEY = 'obdlive.config.v1';
const PREFS_KEY = 'obdlive.prefs.v1';

const clone = (o) => JSON.parse(JSON.stringify(o));

export function loadConfig() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const c = migrate(JSON.parse(s));
      validateConfig(c);
      return c;
    }
  } catch (e) {
    console.warn('Config load failed, using defaults', e);
  }
  return clone(DEFAULT_CONFIG);
}

function migrate(c) {
  c.schema = c.schema || 1;
  if (c.schema < 2) {
    const sel = c.values?.find((v) => v.id === 'gearSelector');
    if (sel && sel.mapDefault == null) sel.mapDefault = 'M';
    const tt = c.values?.find((v) => v.id === 'transTemp');
    if (tt && JSON.stringify(tt.byteOffsets) === '[18]') tt.byteOffsets = [13];
    c.schema = 2;
  }
  if (c.schema < 3) {
    for (const id of ['baro', 'boost']) {
      if (!c.values.some((v) => v.id === id)) c.values.push(clone(DEFAULT_CONFIG.values.find((v) => v.id === id)));
    }
    c.schema = 3;
  }
  if (c.schema < 4) {
    // Decoded from the Mercedes CBF files: replace guessed transmission/oil definitions.
    const def = (id) => clone(DEFAULT_CONFIG.values.find((v) => v.id === id));
    for (const id of ['gearSelector', 'gearEngaged', 'transTemp', 'oilTemp']) {
      const i = c.values.findIndex((v) => v.id === id);
      if (i >= 0) c.values[i] = { ...def(id), enabled: c.values[i].enabled !== false };
      else c.values.push(def(id));
    }
    for (const id of ['driveProgram', 'oilPressure', 'intakeTemp', 'battery']) {
      if (!c.values.some((v) => v.id === id)) c.values.push(def(id));
    }
    c.schema = 4;
  }
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {}
  return c;
}

export function saveConfig(cfg) {
  validateConfig(cfg);
  try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch {}
}

export function resetConfig() {
  try { localStorage.removeItem(KEY); } catch {}
  return clone(DEFAULT_CONFIG);
}

export function validateConfig(c) {
  if (!c || typeof c !== 'object') throw new Error('Config must be an object');
  if (!Array.isArray(c.values)) throw new Error('"values" must be an array');
  if (!Array.isArray(c.init)) throw new Error('"init" must be an array');
  const ids = new Set();
  for (const v of c.values) {
    if (!v.id) throw new Error('Every value needs an "id"');
    if (ids.has(v.id)) throw new Error(`Duplicate value id "${v.id}"`);
    ids.add(v.id);
    if (!/^[0-9A-Fa-f\s]+$/.test(v.request || '')) throw new Error(`${v.id}: "request" must be hex`);
    if (v.header && !/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{5})?$/.test(v.header)) throw new Error(`${v.id}: "header" must be 3 or 8 hex chars`);
    if (!Array.isArray(v.byteOffsets)) throw new Error(`${v.id}: "byteOffsets" must be an array`);
    if (typeof v.formula !== 'string') throw new Error(`${v.id}: "formula" must be a string`);
    try { compileFormula(v.formula); } catch (e) { throw new Error(`${v.id}: bad formula: ${e.message}`); }
  }
}

const HELPERS = {
  s8: (a) => (a & 0x80 ? a - 0x100 : a),
  u16: (h, l) => ((h << 8) | l) >>> 0,
  s16: (h, l) => { const v = (h << 8) | l; return v & 0x8000 ? v - 0x10000 : v; },
  bit: (v, n) => (v >> n) & 1,
};

const formulaCache = new Map();
export function compileFormula(src) {
  let fn = formulaCache.get(src);
  if (!fn) {
    // eslint-disable-next-line no-new-func
    fn = new Function('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'x', 'bytes', 's8', 'u16', 's16', 'bit', 'val',
      `"use strict"; return (${src});`);
    formulaCache.set(src, fn);
  }
  return fn;
}

// vals: { otherValueId: latestNumber } so formulas can combine values (val.baro).
export function evalValue(def, bytes, vals = {}) {
  const offs = def.byteOffsets || [];
  const vars = [];
  for (const o of offs) {
    if (o >= bytes.length) throw new Error(`short response (${bytes.length}B, need idx ${o})`);
    vars.push(bytes[o]);
  }
  while (vars.length < 8) vars.push(undefined);
  const fn = compileFormula(def.formula || 'A');
  const v = fn(...vars, vars[0], bytes, HELPERS.s8, HELPERS.u16, HELPERS.s16, HELPERS.bit, vals);
  return v;
}

export function mapLabel(def, v) {
  if (!def.map) return null;
  for (const [k, label] of Object.entries(def.map)) {
    if (Number(k) === v) return label;
  }
  return def.mapDefault ?? null;
}

const DEFAULT_PREFS = { demo: false, keepAwake: true, logPolling: true, logRaw: false };

export function loadPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }; }
  catch { return { ...DEFAULT_PREFS }; }
}
export function savePrefs(p) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch {}
}
