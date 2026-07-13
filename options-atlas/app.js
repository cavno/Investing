/* =========================================================
   Options Strategy Atlas — app logic
   ========================================================= */

// -----------------------------------------------------------
// Filter configuration
// -----------------------------------------------------------
const FILTER_GROUPS = [
  {
    key: 'delta',
    label: 'Delta',
    greekFlavor: true,
    values: ['Long Delta', 'Short Delta', 'Neutral Delta', 'Long to Short Delta', 'Neutral to Long Delta'],
  },
  {
    key: 'gamma',
    label: 'Gamma',
    greekFlavor: true,
    values: ['Long Gamma', 'Short Gamma', 'Neutral Gamma'],
  },
  {
    key: 'vega',
    label: 'Vega',
    greekFlavor: true,
    values: ['Long Vega', 'Short Vega', 'Neutral Vega'],
  },
  {
    key: 'theta',
    label: 'Theta',
    greekFlavor: true,
    values: ['Long Theta', 'Short Theta', 'Neutral Theta'],
  },
  {
    key: 'cash_flow',
    label: 'Initial Cash Flow',
    values: ['Credit', 'Debit', 'Zero-Cost / Credit', 'Zero-Cost / Debit', 'Zero-Cost / Credit / Debit'],
  },
  {
    key: 'trader_role',
    label: 'Trader Role',
    values: ['Speculator', 'Hedge', 'Speculator + Hedge', 'Speculator + Hedger + Arbitrageur'],
  },
  {
    key: 'purpose',
    label: 'By Purpose',
    values: [
      'Directional - Bullish',
      'Directional - Bearish',
      'Non-Directional - Long Volatility',
      'Non-Directional - Short Volatility',
      'Directional - Bullish + Non-Directional - Long Volatility',
      'Directional - Bullish + Non-Directional - Short Volatility',
      'Directional - Bearish + Non-Directional - Long Volatility',
      'Directional - Bearish + Non-Directional - Short Volatility',
    ],
  },
  {
    key: 'structure',
    label: 'By Structure',
    values: [
      'Single Option',
      'Vertical Spread',
      'Horizontal Spreads',
      'Diagonal Spread',
      'Combinations',
      'Stock-Option - Covered/Protective Combinations',
      'Stock-Option - Hedging Combinations',
      'Combinations + Vertical Spread',
      'Combinations + Diagonal Spread',
    ],
  },
  {
    key: 'skill',
    label: 'Skill Level',
    values: ['Novice', 'Intermediate', 'Advanced', 'Expert'],
  },
];

// State
const state = {
  filters: Object.fromEntries(FILTER_GROUPS.map((g) => [g.key, new Set()])),
  search: '',
  sort: 'default',
};

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
const SKILL_ORDER = { Novice: 0, Intermediate: 1, Advanced: 2, Expert: 3 };

function flavorOf(value) {
  if (!value) return '';
  if (value.startsWith('Long')) return 'Long';
  if (value.startsWith('Short')) return 'Short';
  if (value.startsWith('Neutral')) return 'Neutral';
  return 'Mixed';
}

function purposeClass(purpose) {
  if (!purpose) return 'neutral';
  const isBull = /Bullish/.test(purpose);
  const isBear = /Bearish/.test(purpose);
  const isVol = /Volatility/.test(purpose);
  if (isBull && isVol) return 'hybrid';
  if (isBear && isVol) return 'hybrid';
  if (isBull) return 'bullish';
  if (isBear) return 'bearish';
  if (isVol) return 'volatility';
  return 'neutral';
}

function shortLabel(value) {
  // Compress some long filter labels
  const repl = {
    'Stock-Option - Covered/Protective Combinations': 'Covered/Protective',
    'Stock-Option - Hedging Combinations': 'Hedging Combinations',
    'Combinations + Vertical Spread': 'Combo + Vertical',
    'Combinations + Diagonal Spread': 'Combo + Diagonal',
    'Directional - Bullish': 'Bullish',
    'Directional - Bearish': 'Bearish',
    'Non-Directional - Long Volatility': 'Long Vol',
    'Non-Directional - Short Volatility': 'Short Vol',
    'Directional - Bullish + Non-Directional - Long Volatility': 'Bullish + Long Vol',
    'Directional - Bullish + Non-Directional - Short Volatility': 'Bullish + Short Vol',
    'Directional - Bearish + Non-Directional - Long Volatility': 'Bearish + Long Vol',
    'Directional - Bearish + Non-Directional - Short Volatility': 'Bearish + Short Vol',
    'Speculator + Hedger + Arbitrageur': 'Spec + Hedge + Arb',
    'Zero-Cost / Credit / Debit': 'Zero / Cr / Db',
    'Zero-Cost / Credit': 'Zero / Credit',
    'Zero-Cost / Debit': 'Zero / Debit',
  };
  return repl[value] || value;
}

// -----------------------------------------------------------
// Render filter UI
// -----------------------------------------------------------
function renderFilters() {
  const root = document.getElementById('filterGroups');
  root.innerHTML = '';

  for (const group of FILTER_GROUPS) {
    const div = document.createElement('div');
    div.className = 'filter-group';
    div.innerHTML = `<h3>${group.label}</h3><div class="chip-group"></div>`;

    const chipBox = div.querySelector('.chip-group');
    for (const v of group.values) {
      const chip = document.createElement('button');
      chip.className = 'chip';
      if (group.greekFlavor) {
        const f = flavorOf(v);
        if (f === 'Long') chip.classList.add('greek-long');
        else if (f === 'Short') chip.classList.add('greek-short');
        else if (f === 'Neutral') chip.classList.add('greek-neutral');
      }
      chip.textContent = shortLabel(v);
      chip.title = v;
      chip.dataset.group = group.key;
      chip.dataset.value = v;
      chip.addEventListener('click', () => toggleFilter(group.key, v, chip));
      chipBox.appendChild(chip);
    }
    root.appendChild(div);
  }
}

function toggleFilter(groupKey, value, btn) {
  const set = state.filters[groupKey];
  if (set.has(value)) set.delete(value);
  else set.add(value);
  btn.classList.toggle('active');
  render();
}

function resetFilters() {
  for (const k of Object.keys(state.filters)) state.filters[k].clear();
  state.search = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.chip.active').forEach((c) => c.classList.remove('active'));
  render();
}

// -----------------------------------------------------------
// Filtering + rendering strategies
// -----------------------------------------------------------
function matches(s) {
  // Search
  if (state.search) {
    const q = state.search.toLowerCase();
    const hay = (s.name + ' ' + (s.nickname || '')).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  // Each filter group: if set is non-empty, value must be in set
  for (const [k, set] of Object.entries(state.filters)) {
    if (set.size > 0 && !set.has(s[k])) return false;
  }
  return true;
}

function sortStrategies(list) {
  const out = [...list];
  switch (state.sort) {
    case 'name':
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'skill':
      out.sort((a, b) => (SKILL_ORDER[a.skill] - SKILL_ORDER[b.skill]) || a.name.localeCompare(b.name));
      break;
    case 'legs':
      out.sort((a, b) => a.legs.length - b.legs.length || a.name.localeCompare(b.name));
      break;
    case 'structure':
      out.sort((a, b) => (a.structure || '').localeCompare(b.structure || '') || a.name.localeCompare(b.name));
      break;
    // default: keep original order
  }
  return out;
}

function render() {
  const filtered = STRATEGIES.filter(matches);
  const sorted = sortStrategies(filtered);

  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');

  grid.innerHTML = '';
  for (const s of sorted) grid.appendChild(makeCard(s));

  empty.hidden = sorted.length > 0;

  document.getElementById('visibleCount').textContent = sorted.length;
  document.getElementById('filteredCount').textContent = STRATEGIES.length - sorted.length;
}

function makeCard(s) {
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.purposeClass = purposeClass(s.purpose);
  el.onclick = () => openModal(s);

  const greeks = ['delta', 'gamma', 'vega', 'theta'].map((g) => {
    const f = flavorOf(s[g]);
    return `
      <div class="greek">
        <span class="greek-label">${g[0].toUpperCase() + g.slice(1)}</span>
        <span class="greek-value" data-pos="${f}">${flavorShort(s[g])}</span>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="card-head">
      <h3 class="card-name">${escapeHtml(s.name)}</h3>
      <span class="card-skill" data-skill="${s.skill}">${s.skill}</span>
    </div>
    <div class="card-nickname">${escapeHtml(s.nickname || '')}</div>
    <div class="greeks">${greeks}</div>
    <div class="card-meta">
      <span class="cash" data-flow="${s.cash_flow}">${shortCash(s.cash_flow)}</span>
      <span class="legs"><strong>${s.legs.length}</strong> leg${s.legs.length === 1 ? '' : 's'}</span>
    </div>
  `;
  return el;
}

function flavorShort(v) {
  if (!v) return '—';
  // "Long Delta" → "Long"; "Neutral to Long Delta" → "→Long"
  if (/^Long to Short/.test(v)) return 'L→S';
  if (/^Neutral to Long/.test(v)) return 'N→L';
  return v.replace(/ (Delta|Gamma|Vega|Theta)$/, '');
}

function shortCash(v) {
  if (!v) return '—';
  return v.replace('Zero-Cost', '0¢');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// -----------------------------------------------------------
// Detail modal
// -----------------------------------------------------------
function openModal(s) {
  const content = document.getElementById('modalContent');
  const greekClass = (v) => {
    const f = flavorOf(v);
    return f === 'Long' ? 'long' : f === 'Short' ? 'short' : f === 'Neutral' ? 'neutral' : '';
  };
  const cashClass = (v) => v === 'Credit' ? 'credit' : v === 'Debit' ? 'debit' : '';

  const legsHtml = s.legs.map((leg, i) => {
    const dir = /^(Long|Buy)/i.test(leg.construction) ? 'long'
              : /^(Short|Sell)/i.test(leg.construction) ? 'short' : '';
    return `
      <div class="leg-row">
        <div class="leg-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="leg-construction ${dir}">${escapeHtml(leg.construction)}</div>
        <div class="leg-effect">${escapeHtml(leg.effect)}</div>
      </div>`;
  }).join('');

  const payoffSvg = buildPayoffSvg(s);

  content.innerHTML = `
    <div class="detail-head">
      <div class="detail-eyebrow">
        <span data-pos-class="${purposeClass(s.purpose)}">${escapeHtml(s.purpose || '')}</span>
        <span class="dot"></span>
        <span>${escapeHtml(s.structure || '')}</span>
        <span class="dot"></span>
        <span>${escapeHtml(s.skill || '')}</span>
      </div>
      <h2 class="detail-name" id="modalTitle">${escapeHtml(s.name)}</h2>
      <p class="detail-nickname">${escapeHtml(s.nickname || '')}</p>
    </div>

    <div class="detail-grid">
      <div class="detail-section">
        <h3>Greeks Exposure</h3>
        <div class="attr-list">
          <div class="attr"><span class="attr-key">Delta</span><span class="attr-val ${greekClass(s.delta)}">${escapeHtml(s.delta)}</span></div>
          <div class="attr"><span class="attr-key">Gamma</span><span class="attr-val ${greekClass(s.gamma)}">${escapeHtml(s.gamma)}</span></div>
          <div class="attr"><span class="attr-key">Vega</span><span class="attr-val ${greekClass(s.vega)}">${escapeHtml(s.vega)}</span></div>
          <div class="attr"><span class="attr-key">Theta</span><span class="attr-val ${greekClass(s.theta)}">${escapeHtml(s.theta)}</span></div>
        </div>
      </div>

      <div class="detail-section">
        <h3>Classification</h3>
        <div class="attr-list">
          <div class="attr"><span class="attr-key">Cash Flow</span><span class="attr-val ${cashClass(s.cash_flow)}">${escapeHtml(s.cash_flow)}</span></div>
          <div class="attr"><span class="attr-key">Trader Role</span><span class="attr-val">${escapeHtml(s.trader_role)}</span></div>
          <div class="attr"><span class="attr-key">Purpose</span><span class="attr-val">${escapeHtml(s.purpose)}</span></div>
          <div class="attr"><span class="attr-key">Structure</span><span class="attr-val">${escapeHtml(s.structure)}</span></div>
          <div class="attr"><span class="attr-key">Skill</span><span class="attr-val">${escapeHtml(s.skill)}</span></div>
          <div class="attr"><span class="attr-key">Legs</span><span class="attr-val">${s.legs.length}</span></div>
        </div>
      </div>
    </div>

    <div class="legs-section">
      <h3>Leg Construction</h3>
      <div class="legs-table">${legsHtml}</div>
    </div>

    <div class="payoff-section">
      <h3>Payoff at Expiry (canonical shape)</h3>
      <div class="payoff-wrap">${payoffSvg}</div>
      <p class="payoff-caveat">${payoffCaveat(s)}</p>
    </div>
  `;

  document.getElementById('modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// -----------------------------------------------------------
// Leg parsing + payoff generation
// -----------------------------------------------------------
function parseLeg(construction) {
  const c = String(construction).toLowerCase();

  // Position
  let position = 0;
  if (/\b(long|buy)\b/.test(c)) position = +1;
  else if (/\b(short|sell)\b/.test(c)) position = -1;

  // Asset
  let asset = null;
  if (/\bstock/.test(c)) asset = 'stock';
  else if (/\bcal?l\b/.test(c)) asset = 'call';   // tolerate typo "Cal"
  else if (/\bput\b/.test(c)) asset = 'put';

  // Time bucket (for diagonal / calendar — flag, but we still plot at expiry)
  let isBackMonth = /(back month|backmonth|back-month|far[- ]?term|leaps)/.test(c);
  let isFrontMonth = /(front month|frontmonth|front-month|near[- ]?term)/.test(c);

  // Moneyness — strike offset relative to spot (S = 100)
  // Calls: ITM=80, ATM=100, OTM=120, Further OTM=140, Deeper ITM=60
  // Puts: ITM=120, ATM=100, OTM=80, Further OTM=60, Deeper ITM=140
  // For ratio backspread we don't infer ratio counts (treat all as 1x)
  let strike = 100;
  const SPOT = 100;

  // "Inner, Lower / Inner, Higher / Outer, Lowest / Outer, Highest" for condors
  if (/inner.*lower/.test(c))      strike = asset === 'call' ? 95 : 105;
  else if (/inner.*higher/.test(c)) strike = asset === 'call' ? 105 : 95;
  else if (/outer.*lowest/.test(c)) strike = asset === 'put' ? 80 : 75;
  else if (/outer.*highest/.test(c)) strike = asset === 'call' ? 125 : 130;
  else if (/outer.*higher/.test(c)) strike = asset === 'call' ? 125 : 75;
  else if (/outer.*lower/.test(c))  strike = asset === 'call' ? 75 : 125;
  // Furthest / further / deeper modifiers
  else if (asset === 'call') {
    if (/(further|furthest|deeper) otm/.test(c))      strike = 130;
    else if (/(further|furthest|deeper) itm/.test(c)) strike = 75;
    else if (/\botm\b/.test(c))                       strike = 115;
    else if (/\bitm\b/.test(c))                       strike = 90;
    else if (/\batm\b/.test(c))                       strike = 100;
    else                                              strike = 100;
  } else if (asset === 'put') {
    if (/(further|furthest|deeper) otm/.test(c))      strike = 70;
    else if (/(further|furthest|deeper) itm/.test(c)) strike = 125;
    else if (/\botm\b/.test(c))                       strike = 85;
    else if (/\bitm\b/.test(c))                       strike = 110;
    else if (/\batm\b/.test(c))                       strike = 100;
    else                                              strike = 100;
  }

  // For a back-month leg, at front-month expiry the option retains time value.
  // We approximate by adding a small bump: the back-month option is treated as
  // holding its intrinsic value plus a residual proportional to its initial premium.
  // To keep the shape readable we just plot intrinsic — calendar/diagonal payoff
  // shape is then signaled by the caveat text.

  return { position, asset, strike, isBackMonth, isFrontMonth, raw: construction };
}

function legPayoff(leg, S) {
  if (leg.position === 0 || !leg.asset) return 0;
  if (leg.asset === 'stock') {
    // P/L of stock from spot of 100: position * (S - 100)
    return leg.position * (S - 100);
  }
  if (leg.asset === 'call') {
    return leg.position * Math.max(0, S - leg.strike);
  }
  if (leg.asset === 'put') {
    return leg.position * Math.max(0, leg.strike - S);
  }
  return 0;
}

function buildPayoffSvg(strategy) {
  // Width/height in SVG units (viewBox); will scale responsively
  const W = 640, H = 280, M = { l: 50, r: 24, t: 18, b: 36 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // Parse legs
  const legs = strategy.legs.map((l) => parseLeg(l.construction));

  // Sample payoff over a price range
  const sMin = 50, sMax = 150;
  const N = 401;
  const samples = [];
  for (let i = 0; i < N; i++) {
    const S = sMin + (sMax - sMin) * i / (N - 1);
    let P = 0;
    for (const leg of legs) P += legPayoff(leg, S);
    samples.push([S, P]);
  }

  // Determine y range
  let yMin = Math.min(...samples.map((s) => s[1]));
  let yMax = Math.max(...samples.map((s) => s[1]));
  const yPad = Math.max(5, (yMax - yMin) * 0.15);
  // Make sure 0 is in range with some margin
  yMin = Math.min(yMin, 0) - yPad;
  yMax = Math.max(yMax, 0) + yPad;
  if (yMax - yMin < 10) { yMax += 5; yMin -= 5; }

  const xScale = (s) => M.l + ((s - sMin) / (sMax - sMin)) * innerW;
  const yScale = (p) => M.t + (1 - (p - yMin) / (yMax - yMin)) * innerH;

  // Path for the payoff line
  const pathParts = samples.map(([s, p], i) => `${i === 0 ? 'M' : 'L'} ${xScale(s).toFixed(2)} ${yScale(p).toFixed(2)}`);
  const linePath = pathParts.join(' ');

  // Build profit/loss fill area: clip into two regions
  // Profit region (above zero line) — fill green
  // Loss region (below zero line) — fill red
  const zeroY = yScale(0);
  const profitFill = `${linePath} L ${xScale(sMax).toFixed(2)} ${zeroY.toFixed(2)} L ${xScale(sMin).toFixed(2)} ${zeroY.toFixed(2)} Z`;

  // Collect unique strike values for vertical markers
  const strikes = [...new Set(legs.filter((l) => l.asset === 'call' || l.asset === 'put').map((l) => l.strike))].sort((a, b) => a - b);

  // Spot marker
  const spotX = xScale(100);

  // X-axis tick labels (relative to spot=100, ATM)
  const xTicks = [60, 80, 100, 120, 140];
  const xTickLabels = { 60: '−40%', 80: '−20%', 100: 'ATM', 120: '+20%', 140: '+40%' };

  // Y-axis tick: 0 line only (the rest is shape, not magnitude)
  const yTicks = [0];

  let svg = `
    <svg class="payoff-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Payoff diagram at expiry for ${escapeHtml(strategy.name)}">
      <defs>
        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7fbf68" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7fbf68" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d96d57" stop-opacity="0"/>
          <stop offset="100%" stop-color="#d96d57" stop-opacity="0.35"/>
        </linearGradient>
        <clipPath id="aboveZero">
          <rect x="${M.l}" y="${M.t}" width="${innerW}" height="${zeroY - M.t}"/>
        </clipPath>
        <clipPath id="belowZero">
          <rect x="${M.l}" y="${zeroY}" width="${innerW}" height="${M.t + innerH - zeroY}"/>
        </clipPath>
      </defs>

      <!-- Plot area background -->
      <rect x="${M.l}" y="${M.t}" width="${innerW}" height="${innerH}" fill="#0f0e0c" stroke="#2c2922" stroke-width="0.5"/>

      <!-- Profit / loss filled regions -->
      <path d="${profitFill}" fill="url(#profitGrad)" clip-path="url(#aboveZero)"/>
      <path d="${profitFill}" fill="url(#lossGrad)" clip-path="url(#belowZero)"/>

      <!-- Strike markers (vertical dashed) -->
      ${strikes.map((k) => `
        <line x1="${xScale(k).toFixed(2)}" y1="${M.t}" x2="${xScale(k).toFixed(2)}" y2="${M.t + innerH}"
              stroke="#3a362d" stroke-width="0.5" stroke-dasharray="3 4"/>
        <text x="${xScale(k).toFixed(2)}" y="${M.t - 4}" fill="#897f6c" font-family="IBM Plex Mono, monospace" font-size="9.5" text-anchor="middle">K${strikes.length > 1 ? (strikes.indexOf(k) + 1) : ''}</text>
      `).join('')}

      <!-- Spot vertical line -->
      <line x1="${spotX}" y1="${M.t}" x2="${spotX}" y2="${M.t + innerH}" stroke="#5a5345" stroke-width="0.8" stroke-dasharray="2 3"/>

      <!-- Zero P/L horizontal line -->
      <line x1="${M.l}" y1="${zeroY.toFixed(2)}" x2="${M.l + innerW}" y2="${zeroY.toFixed(2)}" stroke="#5a5345" stroke-width="0.6"/>
      <text x="${M.l - 6}" y="${zeroY + 3}" fill="#897f6c" font-family="IBM Plex Mono, monospace" font-size="10" text-anchor="end">P/L=0</text>

      <!-- X-axis ticks -->
      ${xTicks.map((t) => `
        <line x1="${xScale(t).toFixed(2)}" y1="${M.t + innerH}" x2="${xScale(t).toFixed(2)}" y2="${M.t + innerH + 4}" stroke="#5a5345" stroke-width="0.5"/>
        <text x="${xScale(t).toFixed(2)}" y="${M.t + innerH + 16}" fill="#897f6c" font-family="IBM Plex Mono, monospace" font-size="10" text-anchor="middle">${xTickLabels[t]}</text>
      `).join('')}

      <!-- X-axis label -->
      <text x="${M.l + innerW / 2}" y="${H - 6}" fill="#5a5345" font-family="IBM Plex Mono, monospace" font-size="9.5" text-anchor="middle" letter-spacing="0.1em">UNDERLYING PRICE AT EXPIRY</text>

      <!-- Payoff line -->
      <path d="${linePath}" fill="none" stroke="#ece5d5" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>
  `;

  return svg;
}

function payoffCaveat(strategy) {
  const hasTime = strategy.legs.some((l) => {
    const c = l.construction.toLowerCase();
    return /(back month|front month|near-term|far-term|leaps|calendar|diagonal)/.test(c);
  });
  if (hasTime || /Calendar|Diagonal/.test(strategy.structure)) {
    return 'Note: this is a Calendar/Diagonal structure. The actual P/L depends on the relative time decay and IV between near- and far-dated legs. The chart shows the canonical at-expiry shape assuming a single expiration — use it for intuition, not for sizing.';
  }
  return 'Strikes are inferred from moneyness labels (ITM≈90, ATM=100, OTM≈115, Further OTM≈130 for calls; mirrored for puts). The diagram shows the shape of intrinsic value at expiry; vertical premium offsets are omitted so the curve sits centered around P/L = 0.';
}

// -----------------------------------------------------------
// Init
// -----------------------------------------------------------
function init() {
  renderFilters();
  render();

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    render();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  document.getElementById('resetBtn').addEventListener('click', resetFilters);

  document.getElementById('totalCount').textContent = STRATEGIES.length;
}

// Expose for inline onclick
window.resetFilters = resetFilters;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', init);
