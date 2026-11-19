// Dashboard rendering (RPM gauge, gear, tiles) driven by config.

const SVG = 'http://www.w3.org/2000/svg';
const A0 = 135, SWEEP = 270;
const CX = 150, CY = 150, R = 118;

const pt = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arc = (d0, d1, r) => {
  const [x0, y0] = pt(d0, r);
  const [x1, y1] = pt(d1, r);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const el = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class Dashboard {
  constructor(root) {
    this.root = root;
    this.gauge = null;
    this.tiles = new Map();
    this.shown = 0;
    this.target = 0;
  }

  build(config) {
    this.config = config;
    this.root.innerHTML = '';
    this.tiles.clear();
    this.gauge = null;
    this.gear = null;
    const vals = config.values.filter((v) => v.enabled);

    const g = vals.find((v) => v.display === 'gauge');
    if (g) this._buildGauge(g);

    const sel = vals.find((v) => v.display === 'gear-selector');
    const num = vals.find((v) => v.display === 'gear-number');
    const prog = vals.find((v) => v.display === 'gear-program');
    if (sel || num) {
      const card = document.createElement('div');
      card.className = 'card gear-card';
      card.innerHTML = `<div class="label">Gear</div>${(sel && !sel.verified) || (num && !num.verified) ? '<span class="badge" title="Offsets unverified">UNVERIFIED</span>' : ''}
        <div class="gear-main"><span class="gear-sel">–</span><span class="gear-num"></span></div><div class="gear-prog"></div>`;
      this.root.appendChild(card);
      this.gear = { card, sel, num, prog, selEl: card.querySelector('.gear-sel'), numEl: card.querySelector('.gear-num'), progEl: card.querySelector('.gear-prog') };
    }

    const tiles = vals.filter((v) => v.display === 'tile' || !v.display);
    if (tiles.length) {
      const wrap = document.createElement('div');
      wrap.className = 'tiles';
      for (const v of tiles) {
        const t = document.createElement('div');
        t.className = 'card tile';
        t.innerHTML = `<div class="label">${esc(v.name || v.id)}</div>${v.verified ? '' : '<span class="badge" title="Request/offset unverified">UNVERIFIED</span>'}
          <div class="val">--<span class="u">${esc(v.unit || '')}</span></div><div class="foot">waiting</div>`;
        wrap.appendChild(t);
        this.tiles.set(v.id, { def: v, el: t, val: t.querySelector('.val'), foot: t.querySelector('.foot'), last: '' });
      }
      this.root.appendChild(wrap);
    }
  }

  _buildGauge(def) {
    const card = document.createElement('div');
    card.className = 'card rpm-card';
    const svg = el('svg', { viewBox: '0 0 300 280', preserveAspectRatio: 'xMidYMid meet' }, card);
    const min = def.min ?? 0, max = def.max ?? 7000, red = def.redline ?? max;
    const deg = (v) => A0 + (SWEEP * (Math.min(Math.max(v, min), max) - min)) / (max - min);
    el('path', { d: arc(A0, A0 + SWEEP, R), class: 'gauge-track' }, svg);
    if (red < max) el('path', { d: arc(deg(red), A0 + SWEEP, R), class: 'gauge-red' }, svg);
    const val = el('path', { d: arc(A0, A0 + SWEEP, R), class: 'gauge-val', pathLength: '1000', 'stroke-dasharray': '0 1000' }, svg);
    const step = max - min > 2000 ? 1000 : 100;
    for (let v = min; v <= max + 1e-6; v += step / 2) {
      const major = Math.abs(((v - min) / step) % 1) < 1e-6;
      const d = deg(v);
      const [x0, y0] = pt(d, R - 14);
      const [x1, y1] = pt(d, R - (major ? 26 : 20));
      el('line', { x1: x0, y1: y0, x2: x1, y2: y1, class: `gauge-tick${major ? ' major' : ''}` }, svg);
      if (major) {
        const [tx, ty] = pt(d, R - 40);
        const t = el('text', { x: tx, y: ty, class: `gauge-num${v >= red ? ' red' : ''}` }, svg);
        t.textContent = step === 1000 ? String(v / 1000) : String(v);
      }
    }
    const num = el('text', { x: CX, y: CY + 22, class: 'gauge-value' }, svg);
    num.textContent = '----';
    const unit = el('text', { x: CX, y: CY + 48, class: 'gauge-unit' }, svg);
    unit.textContent = (def.unit || '').toUpperCase();
    if (step === 1000) { const x = el('text', { x: CX, y: CY - 46, class: 'gauge-x1000' }, svg); x.textContent = '×1000'; }
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = def.name || def.id;
    card.appendChild(label);
    this.root.appendChild(card);
    this.gauge = { def, card, val, num, min, max, red, lastText: '' };
  }

  // Values are never blanked or dimmed when data stops: the last good reading stays on screen.
  render(state) {
    const has = (s) => s && s.value != null && s.status !== 'invalid';
    // gauge
    if (this.gauge) {
      const s = state.get(this.gauge.def.id);
      if (has(s)) this.target = s.value;
      this.shown += (this.target - this.shown) * 0.35;
      if (Math.abs(this.target - this.shown) < 1) this.shown = this.target;
      const { min, max, red } = this.gauge;
      const pct = Math.min(Math.max((this.shown - min) / (max - min), 0), 1) * 1000;
      this.gauge.val.setAttribute('stroke-dasharray', `${pct.toFixed(1)} 1000`);
      this.gauge.val.classList.toggle('hot', this.shown >= red);
      const txt = has(s) || this.target ? String(Math.round(this.target / 10) * 10) : '----';
      if (txt !== this.gauge.lastText) { this.gauge.num.textContent = txt; this.gauge.lastText = txt; }
    }

    // gear
    if (this.gear) {
      const { sel, num, selEl, numEl } = this.gear;
      const ss = sel && state.get(sel.id);
      const ns = num && state.get(num.id);
      let letter = '–';
      if (has(ss)) letter = ss.label ?? `?${Number(ss.value).toString(16).toUpperCase()}`;
      const ps = this.gear.prog && state.get(this.gear.prog.id);
      const progLabel = has(ps) ? (ps.label ?? '') : '';
      if (progLabel === 'M' && letter === 'D') letter = 'M'; // manual program while in D
      const progTxt = letter === 'M' ? 'Manual' : progLabel ? { S: 'Sport', C: 'Comfort', A: 'Agility', M: 'Manual' }[progLabel] || progLabel : '';
      if (this.gear.progEl.textContent !== progTxt) this.gear.progEl.textContent = progTxt;
      let gearTxt = '';
      if (has(ns) && (letter === 'D' || letter === 'M' || !sel)) gearTxt = String(Math.round(ns.value));
      if (selEl.textContent !== letter) { selEl.textContent = letter; selEl.className = `gear-sel ${/^[PRNDM]$/.test(letter) ? letter : ''}`; }
      if (numEl.textContent !== gearTxt) numEl.textContent = gearTxt;
    }

    // tiles
    for (const t of this.tiles.values()) {
      const s = state.get(t.def.id);
      const d = t.def;
      let valHtml = `--<span class="u">${esc(d.unit || '')}</span>`;
      let foot = 'waiting';
      let cls = 'card tile';
      if (s) {
        if (s.value != null) {
          const disp = s.label ?? (typeof s.value === 'number' ? s.value.toFixed(d.decimals ?? 0) : String(s.value));
          valHtml = `${esc(disp)}<span class="u">${esc(d.unit || '')}</span>`;
          const v = s.value;
          if ((d.critAbove != null && v >= d.critAbove) || (d.critBelow != null && v <= d.critBelow)) cls += ' crit';
          else if ((d.warnAbove != null && v >= d.warnAbove) || (d.warnBelow != null && v <= d.warnBelow)) cls += ' warn';
        }
        if (s.status === 'error') { if (s.value == null) cls += ' err'; foot = s.error || 'error'; }
        else if (s.status === 'invalid') foot = 'out of range';
        else foot = s.hz ? `${s.hz.toFixed(1)} Hz` : 'ok';
        if (d.peakHoldSec && typeof s.value === 'number') {
          const now = performance.now();
          if (t.peak == null || s.value >= t.peak || now - t.peakAt > d.peakHoldSec * 1000) { t.peak = s.value; t.peakAt = now; }
          if (t.peak > 0.5) foot = `max ${t.peak.toFixed(d.decimals ?? 0)} ${d.unit || ''}`;
        }
      }
      const key = cls + valHtml + foot;
      if (key !== t.last) {
        t.el.className = cls;
        t.val.innerHTML = valHtml;
        t.foot.textContent = foot;
        t.last = key;
      }
    }
  }
}
