/* =========================================================
   4학년 1학기 문제 만들기 — 수학익힘 4-1(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   단원: 1 각도 · 2 큰 수 · 3 평면도형의 이동 · 4 곱셈과 나눗셈 · 5 규칙 찾기 · 6 막대그래프
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, gcd, range, dz, nf, josa, F, toF, frH, fr, svg, txt, line, tableH } = A;
const P = (w, a, b) => josa(w, a, b).slice(String(w).length);   // 조사만
const RO = w => { const s = String(w), ch = s[s.length - 1]; if (/[0-9]/.test(ch)) return '036'.includes(ch) ? '으로' : '로'; const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 && c % 28 && c % 28 !== 8 ? '으로' : '로'; };
const NAMES = ['민수', '지아', '수아', '지호', '유나', '시우', '하나', '서아', '도희', '예나', '주아', '태호'];
const E = s => `<div class="expr">${s}</div>`;
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};
const N = (q, v, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: Number.isInteger(dz(v)) ? 'int' : 'dec', v: dz(v), unit }, wrong: wrong.map(dz).filter(x => x > 0 && dz(x) !== dz(v)), ex }, extra);
const CMP = (a, b) => a > b ? '&gt;' : a < b ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];
const INK = '#22314A';
const ORD = ['', '첫', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두', '열셋', '열넷', '열다섯'];

/* ---------- 큰 수 읽기/쓰기 ---------- */
const DG = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'], POS = ['천', '백', '십', ''], UNIT = ['', '만', '억', '조'];
const chunkKo = c => String(c).padStart(4, '0').split('').map((d, i) => +d ? ((+d === 1 && i < 3) ? '' : DG[+d]) + POS[i] : '').join('');
const readKo = n => { const parts = []; let u = 0; while (n > 0){ const c = n % 10000; if (c) parts.unshift((c === 1 && u === 1 ? '' : chunkKo(c)) + UNIT[u]); n = Math.floor(n / 10000); u++; } return parts.join(' ') || '영'; };
const numKo = n => { const parts = []; let u = 0; while (n > 0){ const c = n % 10000; if (c) parts.unshift(c + UNIT[u]); n = Math.floor(n / 10000); u++; } return parts.join(' '); };
const PLACES = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조', '십조', '백조', '천조'];
const placeVal = k => numKo(Math.pow(10, k)) || '1';
const big = (lo, hi) => { const len = ri(lo, hi); let s = String(ri(1, 9)); for (let i = 1; i < len; i++) s += ri(0, 9); return +s; };

/* ---------- 그림: 각도 ---------- */
const angFig = (deg, rot = 0, opt = {}) => { const C = [80, 130], L = 110, r1 = rot * Math.PI / 180, r2 = (rot + deg) * Math.PI / 180;
  const p1 = [C[0] + L * Math.cos(-r1), C[1] + L * Math.sin(-r1)], p2 = [C[0] + L * Math.cos(-r2), C[1] + L * Math.sin(-r2)];
  let s = line(C[0], C[1], p1[0], p1[1], { w: 3 }) + line(C[0], C[1], p2[0], p2[1], { w: 3 });
  if (deg === 90) { const a = [Math.cos(-r1), Math.sin(-r1)], b = [Math.cos(-r2), Math.sin(-r2)], k = 16; s += `<path d="M${C[0] + a[0] * k} ${C[1] + a[1] * k} L${C[0] + (a[0] + b[0]) * k} ${C[1] + (a[1] + b[1]) * k} L${C[0] + b[0] * k} ${C[1] + b[1] * k}" fill="none" stroke="#E0464A" stroke-width="2"/>`; }
  else s += `<path d="M${(C[0] + 26 * Math.cos(-r1)).toFixed(1)} ${(C[1] + 26 * Math.sin(-r1)).toFixed(1)} A26 26 0 ${deg > 180 ? 1 : 0} 0 ${(C[0] + 26 * Math.cos(-r2)).toFixed(1)} ${(C[1] + 26 * Math.sin(-r2)).toFixed(1)}" fill="none" stroke="#FF9F43" stroke-width="2.4"/>`;
  if (opt.label) s += txt(C[0] + 44 * Math.cos(-(r1 + r2) / 2), C[1] + 44 * Math.sin(-(r1 + r2) / 2), opt.label, { size: 15, bold: true, fill: '#E0464A' });
  return svg(220, 150, `<circle cx="${C[0]}" cy="${C[1]}" r="3.5" fill="${INK}"/>` + s); };
// 각도기 위의 각: 한 변은 오른쪽 0°(안쪽 눈금) 또는 왼쪽 0°(바깥쪽 눈금)
const protFig = (deg, fromLeft) => { const C = 160, CY = 160, R = 140; let s = `<path d="M${C - R} ${CY} A${R} ${R} 0 0 1 ${C + R} ${CY} Z" fill="#FFFBEA" stroke="${INK}" stroke-width="2"/>`;
  for (let k = 0; k <= 180; k++){ const a = Math.PI - k * Math.PI / 180, l = k % 10 === 0 ? 14 : k % 5 === 0 ? 9 : 5; if (k % 1 === 0 && (k % 5 === 0 || true)) s += line(C + R * Math.cos(a), CY - R * Math.sin(a), C + (R - l) * Math.cos(a), CY - (R - l) * Math.sin(a), { w: k % 10 ? .7 : 1.4 }); }
  for (let k = 0; k <= 180; k += 10){ const a = Math.PI - k * Math.PI / 180; s += txt(C + (R - 24) * Math.cos(a), CY - (R - 24) * Math.sin(a), k, { size: 12, bold: true }) + txt(C + (R - 44) * Math.cos(a), CY - (R - 44) * Math.sin(a), 180 - k, { size: 10, fill: '#2a6fae' }); }
  s += line(C - R, CY, C + R, CY, { w: 1.6 });
  const base = fromLeft ? Math.PI : 0, a2 = fromLeft ? Math.PI - deg * Math.PI / 180 : deg * Math.PI / 180;
  s += line(C, CY, C + (R + 12) * Math.cos(base), CY - (R + 12) * Math.sin(base), { w: 3, stroke: '#E0464A' }) + line(C, CY, C + (R + 12) * Math.cos(a2), CY - (R + 12) * Math.sin(a2), { w: 3, stroke: '#E0464A' }) + `<circle cx="${C}" cy="${CY}" r="4" fill="#E0464A"/>`;
  return svg(320, 180, s); };

/* ---------- 그림: 모눈 위 도형 이동 ---------- */
const SHAPES = [[[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]], [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [2, 1]]];
const norm = c => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(p => [p[0] - mx, p[1] - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
const key = c => norm(c).map(p => p.join(',')).join(';');
const W_ = c => Math.max(...c.map(p => p[0])) + 1, H_ = c => Math.max(...c.map(p => p[1])) + 1;
const TR = {
  flipH: c => norm(c.map(([x, y]) => [W_(c) - 1 - x, y])),
  flipV: c => norm(c.map(([x, y]) => [x, H_(c) - 1 - y])),
  cw: c => norm(c.map(([x, y]) => [H_(c) - 1 - y, x])),
};
TR.r180 = c => TR.cw(TR.cw(c)); TR.ccw = c => TR.cw(TR.r180(c));
const ALL8 = c => [c, TR.cw(c), TR.r180(c), TR.ccw(c), TR.flipH(c), TR.flipV(c), TR.cw(TR.flipH(c)), TR.ccw(TR.flipH(c))].map(norm);
const GOOD = SHAPES.filter(s => new Set(ALL8(s).map(key)).size === 8);
const COLS = ['#8FD19E', '#FFC48A', '#9CC7EE', '#F7A6C4'];
const shapeFig = (c, col = '#8FD19E', u = 20) => { c = norm(c); const n = 4, W = n * u + 8; let s = '';
  for (let i = 0; i <= n; i++) s += line(4 + i * u, 4, 4 + i * u, 4 + n * u, { stroke: '#D5DDE8', w: 1 }) + line(4, 4 + i * u, 4 + n * u, 4 + i * u, { stroke: '#D5DDE8', w: 1 });
  const ox = Math.floor((n - W_(c)) / 2), oy = Math.floor((n - H_(c)) / 2);
  c.forEach(([x, y]) => { s += `<rect x="${4 + (x + ox) * u}" y="${4 + (y + oy) * u}" width="${u}" height="${u}" fill="${col}" stroke="${INK}" stroke-width="1.6"/>`; });
  return svg(W, W, s); };
const TRN = { cw90: ['시계 방향으로 90°만큼 돌린', TR.cw], ccw90: ['시계 반대 방향으로 90°만큼 돌린', TR.ccw], r180: ['시계 방향으로 180°만큼 돌린', TR.r180], flipH: ['오른쪽으로 뒤집은', TR.flipH], flipV: ['아래쪽으로 뒤집은', TR.flipV] };
// 정답 모양 c와 서로 다른 모양 3개
const shapeOpts = (base, ans) => { const ks = [key(ans)], out = [ans]; for (const v of shuffle(ALL8(base))){ if (out.length >= 4) break; if (!ks.includes(key(v))){ ks.push(key(v)); out.push(v); } } return out; };
const DIRS = { 오른쪽: [1, 0], 왼쪽: [-1, 0], 위쪽: [0, -1], 아래쪽: [0, 1] };

/* ---------- 그림: 막대그래프 (눈금 읽기용) ---------- */
const barG = (vals, names, step, unit, title = '', horiz = false) => {
  const max = Math.ceil(Math.max(...vals) / step / 5) * 5 * step || 5 * step, cells = max / step;
  if (!horiz){ const H = 170, cw = H / cells, W = 60 + names.length * 60; let s = '';
    for (let k = 0; k <= cells; k++){ const y = 15 + H - k * cw; s += line(46, y, W - 6, y, { stroke: k % 5 ? '#E2E8F0' : '#B8C4D4', w: 1 }); if (k % 5 === 0) s += txt(38, y, k * step, { size: 11, anchor: 'end' }); }
    vals.forEach((v, i) => { const x = 60 + i * 60, h = v / step * cw; s += `<rect x="${x}" y="${15 + H - h}" width="30" height="${h}" fill="#8EC5F4" stroke="#2a6fae" stroke-width="1.4"/>` + txt(x + 15, H + 30, names[i], { size: 12 }); });
    s += line(46, 15, 46, 15 + H, { w: 1.6 }) + line(46, 15 + H, W - 6, 15 + H, { w: 1.6 }) + txt(8, 6, `(${unit})`, { size: 10, anchor: 'start', fill: '#5D6C83' });
    return `<div style="text-align:center">${title ? `<div style="font-weight:700">${title}</div>` : ''}${svg(W, H + 42, s, 'wide')}</div>`; }
  const W = 260, cw = W / cells, H = 20 + names.length * 34; let s = '';
  for (let k = 0; k <= cells; k++){ const x = 60 + k * cw; s += line(x, 10, x, H, { stroke: k % 5 ? '#E2E8F0' : '#B8C4D4', w: 1 }); if (k % 5 === 0) s += txt(x, H + 12, k * step, { size: 11 }); }
  vals.forEach((v, i) => { const y = 18 + i * 34; s += `<rect x="60" y="${y}" width="${v / step * cw}" height="20" fill="#FFC48A" stroke="#E07B1F" stroke-width="1.4"/>` + txt(52, y + 10, names[i], { size: 12, anchor: 'end' }); });
  s += line(60, 10, 60, H, { w: 1.6 }) + line(60, H, 60 + W, H, { w: 1.6 }) + txt(60 + W, H + 26, `(${unit})`, { size: 10, anchor: 'end', fill: '#5D6C83' });
  return `<div style="text-align:center">${title ? `<div style="font-weight:700">${title}</div>` : ''}${svg(W + 80, H + 32, s, 'wide')}</div>`; };

window.TM_G4 = { readKo, numKo, angFig, protFig, shapeFig, TR, GOOD, ALL8, barG, norm };

/* ─────────────── 1. 각도 ─────────────── */
A.addUnit({ key:'4-1-1', title:'각도', items:[
  { id:'ag-read', name:'각도기로 각도 읽기', std:'4수03-24', lv:[1,2], t:'both',
    g(){ const d = ri(2, 17) * 10 + (ri(0, 1) ? 5 : 0), left = ri(0, 1);
      return N(`각도기로 잰 각의 크기는 몇 도일까요?`, d, `각의 한 변이 ${left ? '바깥쪽' : '안쪽'} 눈금 0에 맞춰져 있으므로 ${left ? '바깥쪽' : '안쪽'} 눈금을 읽어요 → <b>${d}°</b>`, [180 - d, d + 10, d - 10], '°', { fig: protFig(d, left) }); } },
  { id:'ag-kind', name:'예각, 직각, 둔각 구별하기', std:'4수03-02', lv:[1,1], t:'mc',
    g(){ const k = ri(0, 2), d = k === 0 ? ri(2, 8) * 10 + pick([0, 5]) : k === 1 ? 90 : ri(10, 17) * 10 + pick([0, 5]), nm = ['예각', '직각', '둔각'][k];
      return MC(`${d}°인 각은 어떤 각일까요?`, [nm, ...['예각', '직각', '둔각'].filter(x => x !== nm)], `0°보다 크고 직각보다 작은 각 = 예각, 90° = 직각, 직각보다 크고 180°보다 작은 각 = 둔각 → <b>${nm}</b>`, { fig: angFig(d, ri(0, 3) * 10) }); } },
  { id:'ag-count', name:'예각·둔각의 개수 세기', std:'4수03-02', lv:[2,2], t:'both',
    g(){ const ds = shuffle([ri(1, 8) * 10 + 5, ri(1, 8) * 10, 90, ri(10, 17) * 10, ri(9, 17) * 10 + 5, ri(2, 8) * 10, ri(10, 17) * 10 + 5]).slice(0, 6), obt = ri(0, 1), v = ds.filter(d => obt ? d > 90 : d < 90).length;
      if (!v) return this.g();
      return N(`다음 중 <b>${obt ? '둔각' : '예각'}</b>은 모두 몇 개일까요? ${E(ds.map(d => d + '°').join(', '))}`, v, `${obt ? '90°보다 크고 180°보다 작은' : '0°보다 크고 90°보다 작은'} 각: ${ds.filter(d => obt ? d > 90 : d < 90).map(d => d + '°').join(', ')} → <b>${v}개</b>`, [6 - v, v + 1, v - 1], '개'); } },
  { id:'ag-clock', name:'시계의 두 바늘이 이루는 각', std:'4수03-02', lv:[2,3], t:'mc',
    g(){ const h = pick([1, 2, 4, 5, 7, 8, 10, 11, 3, 9]), m = 0, d = Math.min(h, 12 - h) * 30, nm = d < 90 ? '예각' : d === 90 ? '직각' : '둔각';
      return MC(`${h}시 정각일 때 시계의 긴바늘과 짧은바늘이 이루는 작은 쪽의 각은 어떤 각일까요?`, [nm, ...['예각', '직각', '둔각'].filter(x => x !== nm)], `숫자 사이 한 칸 = 30° → ${Math.min(h, 12 - h)}칸 = ${d}° → <b>${nm}</b>`, { fig: window.TM_G3 ? window.TM_G3.clockFig(h, m) : '' }); } },
  { id:'ag-clockdeg', name:'시계 바늘이 이루는 각도 구하기', std:'4수03-24', lv:[3,4], t:'both',
    g(){ const h = ri(1, 5); return N(`${h}시 정각일 때 시계의 긴바늘과 짧은바늘이 이루는 작은 쪽의 각도는 몇 도일까요?`, h * 30, `시계의 숫자 12개가 360°를 똑같이 나누므로 한 칸 = 30° → 30° × ${h} = <b>${h * 30}°</b>`, [h * 10, h * 5 * 6 + 30, 180 - h * 30], '°'); } },
  { id:'ag-est', name:'각도 어림하기', std:'4수03-24', lv:[2,2], t:'mc',
    g(){ const d = ri(2, 16) * 10, near = d;
      return MC(`그림의 각도를 가장 가깝게 어림한 것은?`, [`약 ${near}°`, ...shuffle([near + 40, near - 40, near + 70, near - 70, 180 - near].filter(x => x > 0 && x < 180 && Math.abs(x - near) >= 30)).slice(0, 3).map(x => `약 ${x}°`)], `직각(90°)이나 삼각자의 30°, 45°, 60°와 비교하여 어림해요. 실제 각도는 <b>${d}°</b>예요.`, { fig: angFig(d, ri(0, 2) * 15) }); } },
  { id:'ag-add', name:'각도의 합과 차', std:'4수03-24', lv:[1,2], t:'both',
    g(){ const a = ri(20, 130), b = ri(15, 160 - Math.min(a, 120)), plus = ri(0, 1); if (!plus && a === b) return this.g(); const [x, y] = plus ? [a, b] : [Math.max(a, b), Math.min(a, b)];
      return N(`${x}° ${plus ? '+' : '-'} ${y}°는 몇 도일까요?`, plus ? x + y : x - y, `자연수의 ${plus ? '덧셈' : '뺄셈'}과 같은 방법으로 계산하고 단위 °를 붙여요 → <b>${plus ? x + y : x - y}°</b>`, plus ? [x - y, x + y + 10, x + y - 10] : [x + y, x - y + 10, x - y - 10], '°'); } },
  { id:'ag-tri', name:'삼각형의 나머지 한 각', std:'4수03-25', lv:[2,3], t:'both',
    g(){ const a = ri(25, 100), b = ri(20, 150 - a), c = 180 - a - b;
      return N(`삼각형의 두 각의 크기가 ${a}°, ${b}°예요. 나머지 한 각의 크기는 몇 도일까요?`, c, `삼각형의 세 각의 크기의 합은 180° → 180° - ${a}° - ${b}° = <b>${c}°</b>`, [360 - a - b, 180 - a, c + 10], '°'); } },
  { id:'ag-quad', name:'사각형의 나머지 한 각', std:'4수03-25', lv:[3,3], t:'both',
    g(){ let a, b, c, d; do { a = ri(50, 130); b = ri(50, 130); c = ri(40, 130); d = 360 - a - b - c; } while (d < 30 || d > 170);
      return N(`사각형의 세 각의 크기가 ${a}°, ${b}°, ${c}°예요. 나머지 한 각의 크기는 몇 도일까요?`, d, `사각형의 네 각의 크기의 합은 360° → 360° - ${a}° - ${b}° - ${c}° = <b>${d}°</b>`, [180 - (a + b + c) % 180 || d + 10, d + 10, d - 10], '°'); } },
  { id:'ag-line', name:'일직선과 각도', std:'4수03-24', lv:[3,3], t:'both',
    g(){ const a = ri(25, 155); return N(`일직선 위에 한 점에서 반직선을 그었어요. 한쪽 각이 ${a}°이면 다른 쪽 각은 몇 도일까요?${angFig(180 - a, 0, { label: '?' }).replace('</svg>', `${line(80, 130, 80 - 110, 130, { w: 3 })}</svg>`)}`, 180 - a, `일직선이 이루는 각은 180° → 180° - ${a}° = <b>${180 - a}°</b>`, [90 - a > 0 ? 90 - a : a + 10, 360 - a, a], '°'); } },
  { id:'ag-set', name:'삼각자 두 개로 만든 각', std:'4수03-24', lv:[3,4], t:'both',
    g(){ const S = [30, 45, 60, 90], a = pick(S), b = pick(S.filter(x => x !== a)), plus = ri(0, 1);
      return N(`두 삼각자의 각 ${a}°와 ${b}°를 ${plus ? '이어 붙여 만든 각' : '겹쳐서 생긴 남은 부분의 각(큰 각 - 작은 각)'}은 몇 도일까요?`, plus ? a + b : Math.abs(a - b), `삼각자의 각도: 30°, 45°, 60°, 90° → ${plus ? `${a}° + ${b}° = ` : `${Math.max(a, b)}° - ${Math.min(a, b)}° = `}<b>${plus ? a + b : Math.abs(a - b)}°</b>`, [a + b + 15, Math.abs(a - b) + 15, a + b], '°'); } },
  { id:'ag-ext', name:'삼각형의 바깥쪽 각', std:'4수03-25', lv:[4,5], t:'both',
    g(){ const a = ri(30, 80), b = ri(30, 80); return N(`삼각형의 두 각이 ${a}°, ${b}°예요. 나머지 한 각의 <b>바깥쪽</b>에 생기는 각(일직선을 이루는 각)은 몇 도일까요?`, a + b, `나머지 한 각 = 180° - ${a}° - ${b}° = ${180 - a - b}° → 바깥쪽 각 = 180° - ${180 - a - b}° = <b>${a + b}°</b> (두 각의 합과 같아요!)`, [180 - a - b, 180 - a, a + b + 10], '°'); } },
  { id:'ag-quadeq', name:'사각형에서 크기가 같은 두 각', std:'4수03-25', lv:[5,5], t:'both',
    g(){ let a, b; do { a = ri(60, 140); b = ri(60, 140); } while ((360 - a - b) % 2 || 360 - a - b < 60 || 360 - a - b > 300);
      const x = (360 - a - b) / 2; return N(`사각형의 두 각이 ${a}°, ${b}°이고, 나머지 두 각의 크기는 서로 같아요. 나머지 한 각은 몇 도일까요?`, x, `360° - ${a}° - ${b}° = ${360 - a - b}° → 두 각이 같으므로 ${360 - a - b}° ÷ 2 = <b>${x}°</b>`, [360 - a - b, (180 - a - b + 360) % 180 || x + 5, x + 10], '°'); } }
]});

/* ─────────────── 2. 큰 수 ─────────────── */
A.addUnit({ key:'4-1-2', title:'큰 수', items:[
  { id:'bn-10000', name:'10000 알아보기', std:'4수01-01', lv:[1,1], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const k = pick([9000, 9900, 9990, 9999, 8000, 7000]); return N(`10000은 ${k}보다 몇 큰 수일까요?`, 10000 - k, `10000 - ${k} = <b>${10000 - k}</b>`, [10000 - k + 10, 1000, 10000 - k - 1]); }
      if (t === 1){ const u = pick([1000, 100, 10]); return N(`10000은 ${u}이 몇 개인 수일까요?`, 10000 / u, `${u} × ${10000 / u} = 10000 → <b>${10000 / u}개</b>`, [10000 / u / 10, 10000 / u * 10, 1000], '개'); }
      const k = ri(2, 9); return N(`천 원짜리 지폐 몇 장이 있어야 ${k}만 원이 될까요?`, k * 10, `1만 원 = 천 원 10장 → ${k}만 원 = <b>${k * 10}장</b>`, [k, k * 100, k * 10 + 1], '장'); } },
  { id:'bn-read', name:'큰 수 읽기', std:'4수01-01', lv:[1,2], t:'mc',
    g(L){ const n = L > 1 ? big(7, 11) : big(5, 6), r = readKo(n);
      const bad = [readKo(Math.floor(n / 10)), readKo(n * 10 % Math.pow(10, String(n).length + 1)), readKo(n + Math.pow(10, ri(1, String(n).length - 2)) * pick([1, 2]))].filter(x => x !== r);
      return MC(`<b>${n}</b>${P(n, '을', '를')} 바르게 읽은 것은?`, [r, ...bad], `뒤에서부터 네 자리씩 끊어 만, 억 단위를 붙여 읽어요 → ${numKo(n)} → <b>${r}</b>`); } },
  { id:'bn-write', name:'큰 수를 수로 쓰기', std:'4수01-01', lv:[2,3], t:'mc',
    g(L){ const n = L > 2 ? big(9, 12) : big(6, 9), r = String(n), z = r.replace(/0+$/, '');
      const bad = [String(n * 10), String(Math.floor(n / 10)), r.slice(0, -4) + '0' + r.slice(-4)].filter(x => x !== r);
      return MC(`<b>${readKo(n)}</b>${P(readKo(n), '을', '를')} 수로 바르게 쓴 것은?`, [r, ...bad], `${numKo(n)} → 비어 있는 자리에는 0을 써요 → <b>${r}</b>`); } },
  { id:'bn-place', name:'자리 숫자 알아보기', std:'4수01-01', lv:[2,2], t:'both',
    g(){ const n = big(8, 12), s = String(n), k = ri(4, s.length - 1), d = +s[s.length - 1 - k]; if (!d) return this.g();
      return N(`${n}에서 <b>${PLACES[k]}의 자리</b> 숫자는 무엇일까요?`, d, `뒤에서부터 네 자리씩 끊으면 ${numKo(n)} → ${PLACES[k]}의 자리 숫자는 <b>${d}</b>`, [+s[s.length - k] || 9, +s[s.length - 2 - k] || 8, (d + 1) % 10 || 5]); } },
  { id:'bn-value', name:'숫자가 나타내는 값', std:'4수01-01', lv:[2,3], t:'mc',
    g(){ const n = big(8, 12), s = String(n), k = ri(4, s.length - 1), d = +s[s.length - 1 - k]; if (!d) return this.g();
      const val = k => numKo(d * Math.pow(10, k));
      return MC(`${n}에서 숫자 <b>${d}</b>${P(d, '이', '가')} 나타내는 값은? (뒤에서 ${k + 1}번째 자리)`, [val(k), val(k + 1), val(k - 1), val(k + 4 > 15 ? k - 2 : k + 4)], `${PLACES[k]}의 자리 숫자이므로 ${d} × ${placeVal(k)} → <b>${val(k)}</b>`); } },
  { id:'bn-count', name:'만, 천, 백이 몇 개인 수', std:'4수01-01', lv:[2,3], t:'both',
    g(L){ if (L >= 3){ const e = ri(1, 9), m = ri(10, 9999); const v = e * 1e8 + m * 1e4; return N(`억이 ${e}개, 만이 ${m}개인 수를 쓰면 얼마일까요?`, v, `${e}억 ${m}만 = <b>${v}</b>`, [v + 1e8, e * 1e8 + m * 1e3, v * 10]); }
      const a = ri(2, 9), b = ri(0, 9), c = ri(1, 9), d = ri(0, 9), v = a * 10000 + b * 1000 + c * 100 + d;
      return N(`만이 ${a}개, 천이 ${b}개, 백이 ${c}개, 일이 ${d}개인 수는?`, v, `${a}0000 + ${b}000 + ${c}00 + ${d} = <b>${v}</b>`, [a * 10000 + b * 1000 + c * 10 + d, v + 10000, a * 1000 + b * 100 + c * 10 + d]); } },
  { id:'bn-money', name:'돈으로 알아보는 큰 수', std:'4수01-01', lv:[2,3], t:'both',
    g(){ const a = ri(1, 9), b = ri(1, 19), c = ri(0, 9), v = a * 10000 + b * 1000 + c * 100;
      return N(`저금통에 만 원짜리 ${a}장, 천 원짜리 ${b}장, 백 원짜리 동전 ${c}개가 있어요. 모두 얼마일까요?`, v, `${a * 10000} + ${b * 1000} + ${c * 100} = <b>${v}원</b>${b >= 10 ? ' (천 원짜리 10장 = 만 원!)' : ''}`, [a * 10000 + (b % 10) * 1000 + c * 100, v + 1000, a * 1000 + b * 100 + c * 10], '원'); } },
  { id:'bn-skip', name:'뛰어 세기', std:'4수01-02', lv:[2,3], t:'both',
    g(L){ const k = pick(L > 2 ? [1e5, 1e6, 1e7, 1e8, 1e9] : [1e4, 1e5, 1e6]), s = big(String(k).length + 1, String(k).length + 2), seq = range(0, 4).map(i => s + i * k), hole = ri(2, 4);
      return N(`${numKo(k)}씩 뛰어 세었어요. □에 알맞은 수는? ${E(seq.map((x, i) => i === hole ? '□' : x).join(' — '))}`, seq[hole], `${numKo(k)}씩 뛰어 세면 ${PLACES[String(k).length - 1]}의 자리 숫자가 1씩 커져요 → <b>${seq[hole]}</b>`, [seq[hole] + k / 10, seq[hole] - k, seq[hole] + k * 10]); } },
  { id:'bn-skipk', name:'몇씩 뛰어 세었는지 찾기', std:'4수01-02', lv:[3,3], t:'mc',
    g(){ const ks = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10], i = ri(0, ks.length - 1), k = ks[i], s = big(String(k).length + 1, String(k).length + 2), seq = range(0, 3).map(j => s + j * k);
      return MC(`몇씩 뛰어 세었을까요? ${E(seq.join(' — '))}`, [numKo(k) + '씩', ...ks.filter(x => x !== k).sort((a, b) => Math.abs(Math.log10(a / k)) - Math.abs(Math.log10(b / k))).slice(0, 3).map(x => numKo(x) + '씩')], `${PLACES[String(k).length - 1]}의 자리 숫자가 1씩 커지므로 <b>${numKo(k)}씩</b> 뛰어 세었어요.`); } },
  { id:'bn-cmp', name:'두 수의 크기 비교', std:'4수01-02', lv:[2,3], t:'mc',
    g(L){ const a = big(7, 10); let b; const t = ri(0, 2);
      if (t === 0) b = +String(a).slice(0, -1); else if (t === 1){ const s = String(a).split(''), j = ri(1, s.length - 2); s[j] = String((+s[j] + pick([1, 9])) % 10); b = +s.join(''); } else b = a + pick([1, -1]) * Math.pow(10, ri(0, 3));
      if (a === b) return this.g(); const c = CMP(a, b), sh = L > 2;
      return MC(`두 수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(sh ? `${numKo(a)} ○ ${b}` : `${a} ○ ${b}`)}`, [c, ...CMPC.filter(z => z !== c)], `${String(a).length === String(b).length ? '자리 수가 같으므로 높은 자리 숫자부터 차례로 비교해요' : '자리 수가 많은 쪽이 더 커요'} → <b>${c}</b>`); } },
  { id:'bn-order', name:'가장 큰 수 찾기', std:'4수01-02', lv:[3,4], t:'mc',
    g(){ const base = big(9, 10), s = String(base), vs = new Set([base]); while (vs.size < 4){ const t = s.split(''), j = ri(0, t.length - 1); t[j] = String(ri(j ? 0 : 1, 9)); vs.add(+t.join('')); }
      const arr = [...vs], mx = Math.max(...arr), show = x => ri(0, 1) ? String(x) : numKo(x);
      const lab = arr.map(x => [x, show(x)]); const best = lab.find(z => z[0] === mx)[1];
      return MC(`가장 큰 수는?`, [best, ...lab.filter(z => z[0] !== mx).map(z => z[1])], `모두 수로 바꾸어 높은 자리부터 비교해요 → <b>${mx}</b>`); } },
  { id:'bn-10x', name:'10배, 100배 한 수', std:'4수01-02', lv:[3,4], t:'mc',
    g(){ const t = ri(0, 2);
      if (t === 0){ const b = pick([1e6, 1e7, 1e8, 1e9, 1e10]), k = pick([10, 100, 1000]), r = b * k; return MC(`${numKo(b)}의 ${k}배인 수는?`, [numKo(r), numKo(r / 10), numKo(r * 10), numKo(r * 100)], `${numKo(b)} × ${k} = <b>${numKo(r)}</b>`); }
      if (t === 1){ const k = ri(11, 99) * 1000, r = k * 1e8; return MC(`억이 ${k}개인 수는?`, [numKo(r), numKo(r / 10), numKo(r * 10), numKo(r / 100)], `억이 10000개이면 1조 → 억이 ${k}개 = <b>${numKo(r)}</b>`); }
      const k = pick([1e4, 1e5, 1e6]), n = ri(2, 9) * k * 10; return MC(`${numKo(n)}은(는) ${numKo(k)}이 몇 개인 수일까요?`, [`${n / k}개`, `${n / k / 10}개`, `${n / k * 10}개`, `${n / k + 1}개`], `${numKo(n)} ÷ ${numKo(k)} = <b>${n / k}개</b>`); } },
  { id:'bn-missing', name:'□ 안에 들어갈 수 있는 숫자', std:'4수01-02', lv:[4,5], t:'both',
    g(){ const s = String(big(7, 8)).split(''), j = ri(2, s.length - 3), d = ri(2, 8); s[j] = d; const tgt = s.join(''); const t = s.slice(); t[j] = '□';
      const rest = s.slice(j + 1).join(''), u = t.slice(); const other = s.slice(); other[j] = '□';
      const cmpGreater = ri(0, 1), x = String(+tgt + (cmpGreater ? -1 : 1) * pick([1, 2, 3]) * Math.pow(10, Math.max(0, s.length - j - 3)));
      // 몇 개? □ 자리 숫자 0~9 중 조건 만족
      const ok = range(0, 9).filter(c => { const v = +t.map(z => z === '□' ? c : z).join(''); return cmpGreater ? v > +x : v < +x; }).length;
      if (!ok || ok === 10) return this.g();
      return N(`0부터 9까지의 숫자 중 □ 안에 들어갈 수 있는 숫자는 모두 몇 개일까요? ${E(`${t.join('')} ${cmpGreater ? '&gt;' : '&lt;'} ${x}`)}`, ok, `□ 앞까지는 같은 숫자이므로 □ 자리와 그 뒤를 비교해요. 0~9를 차례로 넣어 보면 <b>${ok}개</b>`, [ok + 1, ok - 1, 10 - ok], '개'); } },
  { id:'bn-cards', name:'수 카드로 큰 수 만들기', std:'4수01-02', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(0, 9)).slice(0, 6); if (!c.some(x => x)) return this.g(); const t = ri(0, 2), d = c.slice().sort((a, b) => b - a), big6 = +d.join('');
      const as = c.slice().sort((a, b) => a - b), nz = as.find(x => x > 0), small = +[nz, ...as.filter((x, i) => i !== as.indexOf(nz))].join('');
      const v = t === 0 ? big6 : t === 1 ? small : big6 - small;
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 여섯 자리 수를 만들려고 해요. ${['가장 큰 수', '가장 작은 수', '가장 큰 수와 가장 작은 수의 차'][t]}는?`, v, `가장 큰 수 ${big6}, 가장 작은 수 ${small} (0은 맨 앞에 올 수 없어요) → <b>${v}</b>`, [t === 1 ? +as.join('') || small + 1 : big6 - 9, v + 9, t === 2 ? big6 + small : +d.reverse().join('')]); } }
]});

/* ─────────────── 3. 평면도형의 이동 ─────────────── */
const ptGrid = (pts, u = 26, W = 9, H = 6) => { let s = ''; for (let i = 0; i <= W; i++) s += line(10 + i * u, 10, 10 + i * u, 10 + H * u, { stroke: '#D5DDE8', w: 1 }); for (let j = 0; j <= H; j++) s += line(10, 10 + j * u, 10 + W * u, 10 + j * u, { stroke: '#D5DDE8', w: 1 });
  pts.forEach(([x, y, lab, col]) => { s += `<circle cx="${10 + x * u}" cy="${10 + y * u}" r="5" fill="${col || INK}"/>` + txt(10 + x * u + 10, 10 + y * u - 10, lab, { size: 13, bold: true, fill: col || INK }); });
  return svg(W * u + 30, H * u + 20, s); };
A.addUnit({ key:'4-1-3', title:'평면도형의 이동', items:[
  { id:'pt-move', name:'점을 이동한 위치 찾기', std:'4수03-05', lv:[1,2], t:'mc',
    g(){ const x0 = ri(2, 6), y0 = ri(1, 4), dx = ri(-3, 3), dy = ri(-2, 2); if (!dx && !dy || x0 + dx < 0 || x0 + dx > 9 || y0 + dy < 0 || y0 + dy > 6) return this.g();
      const cand = [[x0 + dx, y0 + dy], [x0 + dy, y0 + dx], [x0 - dx, y0 - dy], [x0 + dx, y0 - dy], [x0 - dx, y0 + dy]].filter(p => p[0] >= 0 && p[0] <= 9 && p[1] >= 0 && p[1] <= 6 && !(p[0] === x0 && p[1] === y0));
      const uniq = []; cand.forEach(p => { if (!uniq.some(q => q[0] === p[0] && q[1] === p[1])) uniq.push(p); }); if (uniq.length < 3) return this.g();
      const use = uniq.slice(0, 4), labs = shuffle(['가', '나', '다', '라'].slice(0, use.length));
      const desc = [dx ? `${dx > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(dx)}칸` : '', dy ? `${dy > 0 ? '아래쪽' : '위쪽'}으로 ${Math.abs(dy)}칸` : ''].filter(Boolean).join(', ');
      return MC(`점 ㄱ을 <b>${desc}</b> 이동한 위치에 있는 점은?`, [labs[0], ...labs.slice(1)], `점 ㄱ에서 ${desc} 움직이면 점 <b>${labs[0]}</b>에 도착해요.`, { fig: ptGrid([[x0, y0, 'ㄱ', '#E0464A'], ...use.map((p, i) => [p[0], p[1], labs[i]])]) }); } },
  { id:'pt-desc', name:'점의 이동 설명하기', std:'4수03-05', lv:[2,3], t:'mc',
    g(){ const dx = ri(1, 6) * pick([1, -1]), dy = ri(1, 4) * pick([1, -1]), h = dx > 0 ? '오른쪽' : '왼쪽', v = dy > 0 ? '아래쪽' : '위쪽', h2 = dx > 0 ? '왼쪽' : '오른쪽', v2 = dy > 0 ? '위쪽' : '아래쪽';
      const back = ri(0, 1), a = Math.abs(dx), b = Math.abs(dy);
      const ok = back ? `${h2}으로 ${a} cm, ${v2}으로 ${b} cm` : `${h}으로 ${a} cm, ${v}으로 ${b} cm`;
      const bad = back ? [`${h}으로 ${a} cm, ${v}으로 ${b} cm`, `${h2}으로 ${b} cm, ${v2}으로 ${a} cm`, `${h2}으로 ${a} cm, ${v}으로 ${b} cm`] : [`${h2}으로 ${a} cm, ${v2}으로 ${b} cm`, `${h}으로 ${b} cm, ${v}으로 ${a} cm`, `${h}으로 ${a} cm, ${v2}으로 ${b} cm`];
      return MC(`점 ㄱ을 ${h}으로 ${a} cm, ${v}으로 ${b} cm 이동하면 점 ㄴ이에요. ${back ? '점 ㄴ에서 다시 점 ㄱ으로 가려면' : '점 ㄱ에서 점 ㄴ으로 가는 방법은'}?`, [ok, ...bad], back ? `반대 방향으로 같은 거리만큼 움직여야 해요 → <b>${ok}</b>` : `<b>${ok}</b>`); } },
  { id:'tf-slide', name:'도형 밀기', std:'4수03-04', lv:[1,1], t:'mc',
    g(){ const s = pick(GOOD), col = pick(COLS), d = pick(Object.keys(DIRS)), opts = shapeOpts(s, s);
      return MC(`왼쪽 도형을 ${d}으로 5 cm 밀었을 때의 도형은?`, opts.map(o => shapeFig(o, col)), `도형을 밀면 모양은 변하지 않고 <b>위치만</b> 바뀌어요.`, { fig: shapeFig(s, col), gridChoices: true }); } },
  { id:'tf-flip', name:'도형 뒤집기', std:'4수03-04', lv:[1,2], t:'mc',
    g(){ const s = pick(GOOD), col = pick(COLS), k = pick(['flipH', 'flipV', 'flipH']), dirTxt = k === 'flipH' ? pick(['오른쪽', '왼쪽']) : pick(['위쪽', '아래쪽']), ans = TR[k](s);
      return MC(`왼쪽 도형을 <b>${dirTxt}으로 뒤집었을 때</b>의 도형은?`, shapeOpts(s, ans).map(o => shapeFig(o, col)), k === 'flipH' ? '오른쪽(왼쪽)으로 뒤집으면 도형의 <b>왼쪽과 오른쪽</b>이 서로 바뀌어요.' : '위쪽(아래쪽)으로 뒤집으면 도형의 <b>위쪽과 아래쪽</b>이 서로 바뀌어요.', { fig: shapeFig(s, col), gridChoices: true }); } },
  { id:'tf-rot', name:'도형 돌리기', std:'4수03-04', lv:[2,3], t:'mc',
    g(L){ const s = pick(GOOD), col = pick(COLS), k = pick(L > 2 ? ['cw90', 'ccw90', 'r180'] : ['cw90', 'r180']), ans = TRN[k][1](s);
      return MC(`왼쪽 도형을 <b>${TRN[k][0].replace(/돌린$/, '돌렸을 때')}</b>의 도형은?`, shapeOpts(s, ans).map(o => shapeFig(o, col)), k === 'r180' ? '180°만큼 돌리면 위쪽이 아래쪽으로, 왼쪽이 오른쪽으로 바뀌어요.' : `${k === 'cw90' ? '시계 방향' : '시계 반대 방향'}으로 90°만큼 돌리면 도형의 위쪽이 ${k === 'cw90' ? '오른쪽' : '왼쪽'}으로 가요.`, { fig: shapeFig(s, col), gridChoices: true }); } },
  { id:'tf-same', name:'같은 결과가 되는 이동', std:'4수03-04', lv:[3,4], t:'mc',
    g(){ const t = ri(0, 3);
      const Q = [['도형을 시계 방향으로 270°만큼 돌린 도형과 같은 것은?', '시계 반대 방향으로 90°만큼 돌린 도형', ['시계 방향으로 90°만큼 돌린 도형', '시계 방향으로 180°만큼 돌린 도형', '처음 도형'], '시계 방향으로 270° = 시계 반대 방향으로 90°'],
        ['도형을 오른쪽으로 두 번 뒤집은 도형과 같은 것은?', '처음 도형', ['왼쪽으로 뒤집은 도형', '시계 방향으로 180°만큼 돌린 도형', '아래쪽으로 뒤집은 도형'], '같은 방향으로 두 번 뒤집으면 처음 도형과 같아져요.'],
        ['도형을 시계 방향으로 360°만큼 돌린 도형과 같은 것은?', '처음 도형', ['시계 방향으로 180°만큼 돌린 도형', '아래쪽으로 뒤집은 도형', '시계 반대 방향으로 90°만큼 돌린 도형'], '한 바퀴(360°) 돌리면 처음 도형과 같아져요.'],
        ['도형을 시계 방향으로 180°만큼 돌린 도형과 같은 것은?', '시계 반대 방향으로 180°만큼 돌린 도형', ['오른쪽으로 뒤집은 도형', '시계 방향으로 90°만큼 돌린 도형', '처음 도형']]];
      const q = Q[t]; return MC(q[0], [q[1], ...q[2]], q[3] || '180°만큼 돌리면 방향에 관계없이 결과가 같아요.'); } },
  { id:'tf-twice', name:'두 번 이동한 도형', std:'4수03-04', lv:[4,4], t:'mc',
    g(){ const s = pick(GOOD), col = pick(COLS), a = pick(['flipH', 'flipV']), b = pick(['cw90', 'r180', 'ccw90']), ans = TRN[b][1](TR[a](s));
      return MC(`왼쪽 도형을 <b>${a === 'flipH' ? '오른쪽' : '아래쪽'}으로 뒤집은 다음 ${TRN[b][0].replace(/ 돌린$/, ' 돌렸을 때')}</b>의 도형은?`, shapeOpts(s, ans).map(o => shapeFig(o, col)), `먼저 뒤집은 모양을 생각한 다음, 그 모양을 돌려요. 순서를 바꾸면 결과가 달라질 수 있어요!`, { fig: shapeFig(s, col), gridChoices: true }); } },
  { id:'tf-back', name:'처음 도형 찾기', std:'4수03-04', lv:[4,5], t:'mc',
    g(){ const s = pick(GOOD), col = pick(COLS), k = pick(['cw90', 'ccw90', 'flipH']), after = TRN[k][1](s), inv = k === 'cw90' ? 'ccw90' : k === 'ccw90' ? 'cw90' : 'flipH';
      return MC(`어떤 도형을 <b>${TRN[k][0].replace(/ 돌린$/, ' 돌렸더니').replace(/ 뒤집은$/, ' 뒤집었더니')}</b> 왼쪽 도형이 되었어요. 처음 도형은?`, shapeOpts(after, s).map(o => shapeFig(o, col)), `거꾸로 생각해요: 지금 도형을 ${TRN[inv][0].replace(/ 돌린$/, ' 돌리면').replace(/ 뒤집은$/, ' 뒤집으면')} 처음 도형이 돼요.`, { fig: shapeFig(after, col), gridChoices: true }); } },
  { id:'tf-num', name:'수 카드 돌리기', std:'4수03-04', lv:[4,5], t:'both',
    g(){ const R = { 0: 0, 1: 1, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 }, D = [1, 2, 5, 6, 8, 9], len = ri(2, 3); let s = [pick(D)]; for (let i = 1; i < len - 1; i++) s.push(pick([0, ...D])); s.push(pick(D));
      const n = +s.join(''), r = +s.slice().reverse().map(d => R[d]).join(''); if (n === r) return this.g();
      return N(`디지털 숫자로 쓴 수 카드 <span class="card" style="width:auto;padding:0 6px;font-family:monospace">${n}</span>을(를) 시계 방향으로 180°만큼 돌리면 어떤 수가 될까요? (디지털 숫자 6을 돌리면 9, 9를 돌리면 6, 0·1·2·5·8은 그대로)`, r, `180° 돌리면 순서가 거꾸로 되고 6 ↔ 9가 바뀌어요 → <b>${r}</b>`, [+String(n).split('').reverse().join(''), n, +String(n).split('').map(d => R[d]).join('')]); } }
]});

/* ─────────────── 4. 곱셈과 나눗셈 ─────────────── */
A.addUnit({ key:'4-1-4', title:'곱셈과 나눗셈', items:[
  { id:'m-3x10', name:'(세 자리 수) × (몇십)', std:'4수01-04', lv:[1,1], t:'both',
    g(){ const a = ri(112, 899), b = ri(2, 9) * 10; return N(`${a} × ${b}의 값은?`, a * b, `${a} × ${b / 10} = ${a * b / 10} → 0을 하나 붙여 <b>${a * b}</b>`, [a * b / 10, a * b * 10, a * b + 100]); } },
  { id:'m-3x2', name:'(세 자리 수) × (몇십몇)', std:'4수01-04', lv:[1,2], t:'both',
    g(){ const a = ri(112, 899), b = ri(12, 89); if (b % 10 === 0) return this.g();
      return N(`${a} × ${b}의 값은?`, a * b, `${a} × ${b % 10} = ${a * (b % 10)}, ${a} × ${b - b % 10} = ${a * (b - b % 10)} → ${a * (b % 10)} + ${a * (b - b % 10)} = <b>${a * b}</b>`, [a * (b % 10) + a * Math.floor(b / 10), a * b + 1000, a * b - a]); } },
  { id:'m-word', name:'곱셈 생활 문제', std:'4수01-04', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const a = ri(12, 48), b = ri(21, 65); return N(`사탕이 한 봉지에 ${a}개씩 들어 있어요. ${b}봉지에 들어 있는 사탕은 모두 몇 개일까요?`, a * b, `${a} × ${b} = <b>${a * b}개</b>`, [a + b, a * b - a, a * b + 10], '개'); }
      if (t === 1){ const p = ri(12, 95) * 10, n = ri(12, 40); return N(`한 개에 ${p}원인 지우개를 ${n}개 샀어요. 모두 얼마일까요?`, p * n, `${p} × ${n} = <b>${p * n}원</b>`, [p * n / 10, p * n + p, p + n], '원'); }
      const d = ri(105, 365), k = ri(12, 30); return N(`물고기가 하루에 사료 ${d} g씩 먹어요. ${k}일 동안 먹는 사료는 모두 몇 g일까요?`, d * k, `${d} × ${k} = <b>${d * k} g</b>`, [d * k - d, d * (k + 1), d + k], 'g'); } },
  { id:'m-est', name:'곱셈 어림하기', std:'4수01-08', lv:[3,3], t:'mc',
    g(){ const a = ri(2, 8) * 100 + ri(-12, 12), b = ri(2, 8) * 10 + ri(-2, 2), est = Math.round(a / 100) * 100 * Math.round(b / 10) * 10;
      return MC(`${a} × ${b}를 어림한 값으로 가장 알맞은 것은?`, [`약 ${est}`, `약 ${est / 10}`, `약 ${est * 10}`, `약 ${est + 10000}`], `${a}는 약 ${Math.round(a / 100) * 100}, ${b}는 약 ${Math.round(b / 10) * 10} → 약 <b>${est}</b> (실제 ${a * b})`); } },
  { id:'d-10', name:'(몇백몇십) ÷ (몇십)', std:'4수01-07', lv:[1,1], t:'both',
    g(){ const b = ri(2, 9) * 10, q = ri(2, 9); return N(`${b * q} ÷ ${b}의 몫은?`, q, `${b * q / 10} ÷ ${b / 10} = ${q}와 몫이 같아요 → <b>${q}</b>`, [q * 10, q + 1, q - 1]); } },
  { id:'d-2by2', name:'(두 자리 수) ÷ (두 자리 수)', std:'4수01-07', lv:[1,2], t:'both',
    g(L){ const b = ri(11, 32), q = ri(2, Math.floor(99 / b)), r = L > 1 ? ri(1, Math.min(b - 1, 99 - b * q)) : 0, a = b * q + r; if (q < 2 || a > 99) return this.g();
      return L > 1 ? N(`${a} ÷ ${b}의 <b>나머지</b>는?`, r, `${b} × ${q} = ${b * q}, ${a} - ${b * q} = ${r} → 몫 ${q}, 나머지 <b>${r}</b>`, [q, r + b, r + 1].filter(x => x !== r)) : N(`${a} ÷ ${b}의 몫은?`, q, `${b} × ${q} = ${a} → <b>${q}</b>`, [q + 1, q - 1, b]); } },
  { id:'d-3by2', name:'몫이 한 자리 수인 (세 자리 수) ÷ (두 자리 수)', std:'4수01-07', lv:[2,3], t:'both',
    g(L){ const b = ri(21, 89), q = ri(2, 9), r = L > 2 ? ri(1, b - 1) : 0, a = b * q + r; if (a < 100 || a > 999) return this.g();
      return N(`${a} ÷ ${b}의 몫은?${r ? ' (나머지가 있어요)' : ''}`, q, `${b}를 약 ${Math.round(b / 10) * 10}(으)로 어림하면 몫은 약 ${Math.round(a / (Math.round(b / 10) * 10))} → ${b} × ${q} = ${b * q}${r ? `, 나머지 ${r}` : ''} → 몫 <b>${q}</b>`, [q + 1, q - 1, q * 10]); } },
  { id:'d-3by2b', name:'몫이 두 자리 수인 (세 자리 수) ÷ (두 자리 수)', std:'4수01-07', lv:[3,4], t:'both',
    g(){ const b = ri(12, 45), q = ri(11, Math.floor(999 / b)), r = ri(0, b - 1), a = b * q + r; if (a > 999 || q < 10) return this.g();
      return N(`${a} ÷ ${b}의 몫은?`, q, `높은 자리부터 나누어요: ${b} × ${q} = ${b * q}${r ? `, ${a} - ${b * q} = ${r}(나머지)` : ''} → 몫 <b>${q}</b>`, [q + 1, q - 1, Math.floor(q / 10)]); } },
  { id:'d-rem', name:'몫과 나머지 구하기', std:'4수01-07', lv:[2,3], t:'mc',
    g(){ const b = ri(13, 79), q = ri(3, 30), r = ri(1, b - 1), a = b * q + r; if (a > 999 || a < 100) return this.g();
      const f = (x, y) => `몫 ${x}, 나머지 ${y}`;
      return MC(`${a} ÷ ${b}의 몫과 나머지는?`, [f(q, r), f(q - 1, r + b), f(q + 1, Math.abs(r - b)), f(q, r + 1)], `${b} × ${q} = ${b * q}, ${a} - ${b * q} = ${r} → <b>${f(q, r)}</b> (나머지 ${r} &lt; ${b} ✔)`); } },
  { id:'d-check', name:'나눗셈 결과 확인하기', std:'4수01-07', lv:[3,4], t:'both',
    g(){ const b = ri(15, 60), q = ri(3, 18), r = ri(1, b - 1), a = b * q + r;
      return N(`어떤 수를 ${b}${RO(b)} 나누었더니 몫이 ${q}, 나머지가 ${r}${P(r, '이었', '였')}어요. 어떤 수는?`, a, `(나누는 수) × (몫) + (나머지) = ${b} × ${q} + ${r} = <b>${a}</b>`, [b * q, b * q - r, a + b]); } },
  { id:'d-word', name:'나눗셈 생활 문제', std:'4수01-07', lv:[3,4], t:'both',
    g(L){ const t = L > 3 ? ri(1, 2) : ri(0, 1);
      if (t === 0){ const b = ri(12, 35), q = ri(4, 25), a = b * q; if (a > 999) return this.g(); return N(`색종이 ${a}장을 한 사람에게 ${b}장씩 나누어 주면 몇 명에게 줄 수 있을까요?`, q, `${a} ÷ ${b} = <b>${q}명</b>`, [q + 1, q - 1, b], '명'); }
      if (t === 1){ const b = ri(12, 30), q = ri(5, 25), r = ri(1, b - 1), a = b * q + r; if (a > 999) return this.g(); return N(`토마토 ${a}개를 한 봉지에 ${b}개씩 담으려고 해요. 토마토를 <b>모두</b> 담으려면 봉지는 적어도 몇 개 필요할까요?`, q + 1, `${a} ÷ ${b} = ${q} … ${r} → 남은 ${r}개도 담아야 하므로 ${q} + 1 = <b>${q + 1}개</b>`, [q, q + 2, r], '개'); }
      const b = ri(12, 30), q = ri(5, 25), r = ri(1, b - 1), a = b * q + r; if (a > 999) return this.g(); return N(`리본 ${a} cm를 ${b} cm씩 잘라 꽃을 만들어요. 꽃은 몇 개까지 만들 수 있을까요?`, q, `${a} ÷ ${b} = ${q} … ${r} → 남은 ${r} cm로는 꽃을 만들 수 없어요 → <b>${q}개</b>`, [q + 1, r, q - 1], '개'); } },
  { id:'md-range', name:'몫과 나머지로 수 구하기', std:'4수01-07', lv:[4,5], t:'both',
    g(){ const b = ri(13, 40), q = ri(4, 20), mx = ri(0, 1), v = mx ? b * q + b - 1 : b * q;
      return N(`□ ÷ ${b}의 몫이 ${q}일 때, □ 안에 들어갈 수 있는 자연수 중 가장 ${mx ? '큰' : '작은'} 수는?`, v, `나머지는 0부터 ${b - 1}까지 될 수 있어요 → 가장 ${mx ? '큰' : '작은'} 수 = ${b} × ${q} + ${mx ? b - 1 : 0} = <b>${v}</b>`, [mx ? b * q : b * q + b - 1, b * q + b, v + 1]); } },
  { id:'md-cards', name:'수 카드로 나눗셈 만들기', std:'4수01-07', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 5), d = c.slice().sort((a, b) => b - a), bg = +d.slice(0, 3).join(''), sm = +d.slice(3).reverse().join(''), q = Math.floor(bg / sm), r = bg % sm, wantR = ri(0, 1);
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 (가장 큰 세 자리 수) ÷ (남은 카드로 만든 가장 작은 두 자리 수)를 만들었어요. ${wantR ? '나머지' : '몫'}는?`, wantR ? r || sm : q, `가장 큰 세 자리 수 ${bg}, 남은 두 장으로 만든 가장 작은 두 자리 수 ${sm} → ${bg} ÷ ${sm} = ${q} … ${r} → <b>${wantR ? r : q}</b>`, wantR ? [q, r + 1, sm - r] : [q + 1, q - 1, r]); } }
]});

/* ─────────────── 5. 규칙 찾기 ─────────────── */
const gridTable = (rows, hl) => `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => `<td style="${hl && hl[0] === i && hl[1] === j ? 'background:#FFF4D0;font-weight:700' : ''}">${c}</td>`).join('')}</tr>`).join('')}</table>`;
A.addUnit({ key:'4-1-5', title:'규칙 찾기', items:[
  { id:'rl-table', name:'수 배열표의 빈칸', std:'4수02-01', lv:[1,2], t:'both',
    g(L){ const s = ri(10, 90) * (L > 1 ? 100 : 10) + ri(0, 9), dx = pick(L > 1 ? [100, 1000, 110, 1100] : [1, 10, 100]), dy = pick(L > 1 ? [1000, 10, 100] : [10, 100, 1000].filter(x => x !== dx));
      const R = 3, C = 4, r0 = ri(0, R - 1), c0 = ri(1, C - 1), M = range(0, R - 1).map(i => range(0, C - 1).map(j => s + i * dy + j * dx));
      const v = M[r0][c0]; const show = M.map((r, i) => r.map((x, j) => i === r0 && j === c0 ? '□' : x));
      return N(`수 배열표의 규칙을 찾아 □에 알맞은 수를 구하세요.${gridTable(show, [r0, c0])}`, v, `오른쪽으로 ${dx}씩, 아래쪽으로 ${dy}씩 커져요 → <b>${v}</b>`, [v + dx, v - dy, v + 1]); } },
  { id:'rl-desc', name:'수 배열의 규칙 설명하기', std:'4수02-01', lv:[2,2], t:'mc',
    g(){ const d = pick([3, 5, 11, 101, 1010, 2000]), s = ri(100, 900), m = ri(0, 1), seq = range(0, 4).map(i => m ? s * Math.pow(2, i) : s + d * i);
      const ok = m ? `${s}부터 시작하여 2씩 곱한 수` : `${s}부터 시작하여 ${d}씩 커지는 수`;
      return MC(`수 배열의 규칙을 바르게 설명한 것은? ${E(seq.join(', ') + ', …')}`, [ok, m ? `${s}부터 시작하여 ${s}씩 커지는 수` : `${s}부터 시작하여 ${d * 2}씩 커지는 수`, m ? `${s}부터 시작하여 3씩 곱한 수` : `${s}부터 시작하여 ${d}씩 작아지는 수`, `${s}부터 시작하여 2씩 커지는 수`], `이웃한 두 수를 비교하면 ${m ? '앞의 수에 2를 곱한 수' : `${d}씩 커져요`} → <b>${ok}</b>`); } },
  { id:'rl-shape', name:'도형 배열에서 개수 구하기', std:'4수02-01', lv:[2,3], t:'both',
    g(L){ const t = ri(0, 2), k = L > 2 ? ri(6, 8) : 5, f = [n => 2 * n - 1, n => n * n, n => 3 * n + 1][t], nm = ['바둑돌', '정사각형', '성냥개비'][t];
      const first4 = range(1, 4).map(f);
      return N(`${nm}${P(nm, '을', '를')} 규칙에 따라 늘어놓았어요. 첫째부터 넷째까지 ${nm}의 수는 ${first4.join(', ')}개예요. <b>${['', '', '', '', '', '다섯', '여섯', '일곱', '여덟'][k]}째</b>에 놓일 ${nm}${P(nm, '은', '는')} 몇 개일까요?`, f(k), [`1개에서 시작하여 2개씩 늘어나요`, `1×1, 2×2, 3×3, … 로 늘어나요`, `4개에서 시작하여 3개씩 늘어나요`][t] + ` → <b>${f(k)}개</b>`, [f(k) + 1, f(k - 1), f(k + 1)], '개'); } },
  { id:'rl-shape10', name:'도형 배열의 규칙을 식으로', std:'4수02-01', lv:[4,4], t:'both',
    g(){ const a = ri(2, 4), b = ri(1, 3), k = ri(9, 15), f = n => a * n + b - a;
      return N(`쌓기나무를 첫째 ${f(1)}개, 둘째 ${f(2)}개, 셋째 ${f(3)}개, 넷째 ${f(4)}개 … 규칙적으로 쌓았어요. <b>${ORD[k]}째</b>에 필요한 쌓기나무는 몇 개일까요?`, f(k), `${a}개씩 늘어나요 → ${ORD[k]}째 = ${f(1)} + ${a} × ${k - 1} = <b>${f(k)}개</b>`, [a * k, f(k) + a, f(k - 1)], '개'); } },
  { id:'eq-true', name:'등호(=)를 바르게 쓴 식', std:'4수02-03', lv:[2,3], t:'mc',
    g(){ const a = ri(12, 60), b = ri(5, 30), k = ri(1, 6);
      const ok = pick([`${a} + ${b} = ${a + k} + ${b - k}`, `${a} - ${b} = ${a + k} - ${b + k}`, `${a + b} = ${a} + ${b}`]);
      const bad = [`${a} + ${b} = ${a + k} + ${b + k}`, `${a} - ${b} = ${a + k} - ${b - k}`, `${a} + ${b} = ${a + b} + ${k}`];
      return MC(`등호(=)를 바르게 사용한 식은?`, [ok, ...bad], `등호는 양쪽의 크기가 <b>같다</b>는 뜻이에요. 한쪽에 더한 만큼 다른 쪽에서 빼면(뺄셈은 같이 더하면) 크기가 같아요 → <b>${ok}</b>`); } },
  { id:'eq-fill', name:'등호가 있는 식의 □ 구하기', std:'4수02-03', lv:[2,3], t:'both',
    g(L){ const t = L > 2 ? ri(0, 2) : ri(0, 1), a = ri(15, 80), b = ri(10, 60), k = ri(2, 9);
      if (t === 0) return N(`□에 알맞은 수는? ${E(`${a} + ${b} = ${a + k} + □`)}`, b - k, `${a}에서 ${a + k}로 ${k} 커졌으므로 □는 ${b}보다 ${k} 작아야 해요 → <b>${b - k}</b>`, [b + k, a + b, b]);
      if (t === 1){ const x = Math.max(a, b + k + 5); return N(`□에 알맞은 수는? ${E(`${x} - ${b} = ${x + k} - □`)}`, b + k, `빼지는 수가 ${k} 커졌으므로 빼는 수도 ${k} 커져야 차가 같아요 → <b>${b + k}</b>`, [b - k, b, x - b]); }
      const m = ri(2, 4), c = ri(3, 12) * m; return N(`□에 알맞은 수는? ${E(`${c} × ${m * 2} = ${c * 2} × □`)}`, m, `${c}의 2배가 ${c * 2}이므로 곱하는 수는 ${m * 2}의 반 → <b>${m}</b>`, [m * 4, m * 2, m + 1]); } },
  { id:'cs-add', name:'덧셈식·뺄셈식 배열의 규칙', std:'4수02-02', lv:[2,3], t:'both',
    g(){ const a = ri(1, 4) * 100 + ri(1, 9), da = pick([100, 1000, 10]), b = ri(2, 6) * 100 + ri(1, 9), db = pick([100, 10]), k = 5;
      const rows = range(0, 3).map(i => `${a + da * i} + ${b + db * i} = ${a + b + (da + db) * i}`);
      return N(`계산식의 규칙에 따라 <b>다섯째</b> 계산식의 계산 결과는?${E(rows.join('<br>'))}`, a + b + (da + db) * 4, `더해지는 수는 ${da}씩, 더하는 수는 ${db}씩 커지므로 결과는 ${da + db}씩 커져요 → <b>${a + b + (da + db) * 4}</b>`, [a + b + (da + db) * 5, a + b + (da + db) * 3, a + b + da * 4]); } },
  { id:'cs-mul', name:'곱셈식 배열의 규칙', std:'4수02-02', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const k = ri(5, 7), rows = range(1, 4).map(i => `${'1'.repeat(i)} × ${'1'.repeat(i)} = ${(+'1'.repeat(i)) ** 2}`); return N(`계산식의 규칙에 따라 ${'1'.repeat(k)} × ${'1'.repeat(k)}의 값은?${E(rows.join('<br>'))}`, (+'1'.repeat(k)) ** 2, `결과는 1부터 ${k}까지 커졌다가 다시 1까지 작아지는 수 → <b>${(+'1'.repeat(k)) ** 2}</b>`, [(+'1'.repeat(k - 1)) ** 2, (+'1'.repeat(k)) ** 2 + 1]); }
      if (t === 1){ const b = pick([3, 6, 9]), k = ri(5, 8), rows = range(1, 4).map(i => `${b * 37 / 3 === Math.floor(b * 37 / 3) ? '' : ''}37 × ${b * i} = ${37 * b * i}`); return N(`계산식의 규칙에 따라 37 × ${b * k}의 값은?${E(rows.join('<br>'))}`, 37 * b * k, `곱하는 수가 ${b}씩 커지면 결과는 ${37 * b}씩 커져요 → <b>${37 * b * k}</b>`, [37 * b * (k - 1), 37 * b * k + 1, 37 * k]); }
      const k = ri(5, 8), rows = range(1, 4).map(i => `${'1'.repeat(i)}${i ? '' : ''} × 9 + ${i + 1} = ${(+'1'.repeat(i)) * 9 + i + 1}`.replace(/^(\d+)/, m => String(+'123456789'.slice(0, i))));
      const lhs = i => +'123456789'.slice(0, i); const rows2 = range(1, 4).map(i => `${lhs(i)} × 9 + ${i + 1} = ${lhs(i) * 9 + i + 1}`);
      return N(`계산식의 규칙에 따라 ${lhs(k)} × 9 + ${k + 1}의 값은?${E(rows2.join('<br>'))}`, lhs(k) * 9 + k + 1, `결과는 1이 하나씩 늘어나는 수 → <b>${lhs(k) * 9 + k + 1}</b>`, [+'1'.repeat(k), +'1'.repeat(k + 2)]); } },
  { id:'cs-which', name:'규칙으로 몇째 계산식인지 찾기', std:'4수02-02', lv:[4,5], t:'both',
    g(){ const a = ri(2, 6) * 100, da = 100, b = ri(1, 5) * 10, db = 10, k = ri(6, 10), res = a + b + (da + db) * (k - 1);
      const rows = range(0, 2).map(i => `${a + da * i} + ${b + db * i} = ${a + b + (da + db) * i}`);
      return N(`계산식의 규칙에 따라 계산 결과가 <b>${res}</b>인 계산식은 몇 번째일까요?${E(rows.join('<br>') + '<br>…')}`, k, `결과가 ${da + db}씩 커져요: ${a + b}에서 ${res}까지 (${res} - ${a + b}) ÷ ${da + db} = ${k - 1}번 커짐 → <b>${k}번째</b>`, [k - 1, k + 1, k + 2], '번째'); } },
  { id:'rl-board', name:'생활 속 배열에서 규칙 찾기', std:'4수02-02', lv:[4,5], t:'both',
    g(){ const s = ri(1, 9) * 100 + ri(1, 5), dx = pick([1, 10]), dy = pick([5, 100, 20].filter(x => x !== dx)), m = s + dx + dy, sum = 5 * m;
      const M = range(0, 2).map(i => range(0, 2).map(j => s + i * dy + j * dx));
      return N(`승강기 안내판의 수 배열이에요. 가운데 수를 중심으로 <b>십자 모양(+)</b>에 있는 5개 수의 합은?${gridTable(M.map((r, i) => r.map((x, j) => x)), [1, 1])}`, sum, `가운데 수의 위·아래 두 수의 합과 왼쪽·오른쪽 두 수의 합은 각각 가운데 수의 2배 → ${m} × 5 = <b>${sum}</b>`, [m * 4, m * 9, sum + dx]); } }
]});

/* ─────────────── 6. 막대그래프 ─────────────── */
const BG = [['좋아하는 운동', ['축구', '피구', '줄넘기', '수영', '야구'], '명'], ['기르는 채소', ['상추', '고추', '당근', '오이', '토마토'], '명'], ['모은 재활용품', ['종이', '캔', '플라스틱', '유리', '비닐'], 'kg'], ['체험하고 싶은 놀이', ['윷놀이', '팽이치기', '연날리기', '제기차기', '투호'], '명']];
const mkBG = (n = 4, step = pick([1, 2])) => { const [title, names, unit] = pick(BG); let v; do { v = range(1, n).map(() => ri(2, 12) * step); } while (new Set(v).size < n); return { title, names: names.slice(0, n), unit, v, step, horiz: ri(0, 2) === 0 }; };
const bgFig = g => barG(g.v, g.names, g.step, g.unit, g.title + `별 ${g.unit === 'kg' ? '양' : '학생 수'}`, g.horiz);
A.addUnit({ key:'4-1-6', title:'막대그래프', items:[
  { id:'bg-what', name:'막대그래프 알아보기', std:'4수04-01', lv:[1,1], t:'mc',
    g(){ const t = ri(0, 1);
      return t ? MC('조사한 자료의 수량을 <b>막대 모양</b>으로 나타낸 그래프를 무엇이라고 할까요?', ['막대그래프', '그림그래프', '꺾은선그래프', '표'], '조사한 자료를 막대 모양으로 나타낸 그래프 = <b>막대그래프</b>')
        : MC('막대그래프에서 <b>막대의 길이</b>가 나타내는 것은?', ['항목별 조사한 수량', '조사한 항목의 이름', '조사한 날짜', '그래프의 제목'], '막대의 길이는 항목별 수량을 나타내요. 막대가 길수록 수량이 많아요.'); } },
  { id:'bg-scale', name:'눈금 한 칸의 크기', std:'4수04-01', lv:[1,2], t:'both',
    g(){ const step = pick([2, 5, 10]), cells = 5; return N(`막대그래프의 세로 눈금 ${cells}칸이 ${step * cells}명을 나타내요. 세로 눈금 한 칸은 몇 명을 나타낼까요?`, step, `${step * cells} ÷ ${cells} = <b>${step}명</b>`, [step * cells, cells, step + 1], '명'); } },
  { id:'bg-read', name:'막대그래프 읽기', std:'4수04-01', lv:[1,2], t:'both',
    g(){ const g = mkBG(), i = ri(0, 3); return N(`<b>${g.names[i]}</b>${P(g.names[i], '은', '는')} 몇 ${g.unit}일까요? (눈금 한 칸 = ${g.step}${g.unit})${bgFig(g)}`, g.v[i], `막대 끝이 가리키는 눈금을 읽어요: ${g.v[i] / g.step}칸 × ${g.step} = <b>${g.v[i]}${g.unit}</b>`, [g.v[i] / g.step, g.v[i] + g.step, g.v[i] - g.step], g.unit); } },
  { id:'bg-most', name:'가장 많은(적은) 항목', std:'4수04-01', lv:[1,1], t:'mc',
    g(){ const g = mkBG(), mx = ri(0, 1), t = mx ? Math.max(...g.v) : Math.min(...g.v), i = g.v.indexOf(t);
      return MC(`${mx ? '가장 많은' : '가장 적은'} 항목은?${bgFig(g)}`, [g.names[i], ...g.names.filter((_, j) => j !== i)], `막대의 길이가 가장 ${mx ? '긴' : '짧은'} 것 → <b>${g.names[i]}</b>`); } },
  { id:'bg-diff', name:'두 항목의 차', std:'4수04-01', lv:[2,2], t:'both',
    g(){ const g = mkBG(), [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2), d = Math.abs(g.v[i] - g.v[j]);
      return N(`${g.names[i]}${P(g.names[i], '과', '와')} ${g.names[j]}의 차는 몇 ${g.unit}일까요? (눈금 한 칸 = ${g.step}${g.unit})${bgFig(g)}`, d, `${Math.max(g.v[i], g.v[j])} - ${Math.min(g.v[i], g.v[j])} = <b>${d}${g.unit}</b> (막대 ${d / g.step}칸 차이)`, [d / g.step, g.v[i] + g.v[j], d + g.step].filter(x => x !== d), g.unit); } },
  { id:'bg-total', name:'전체 합계 구하기', std:'4수04-01', lv:[2,3], t:'both',
    g(){ const g = mkBG(); const s = g.v.reduce((a, b) => a + b, 0);
      return N(`조사한 전체는 모두 몇 ${g.unit}일까요? (눈금 한 칸 = ${g.step}${g.unit})${bgFig(g)}`, s, `${g.v.join(' + ')} = <b>${s}${g.unit}</b>`, [s / g.step, s - g.v[0], s + g.step], g.unit); } },
  { id:'bg-times', name:'몇 배인지 구하기', std:'4수04-01', lv:[3,3], t:'both',
    g(){ const step = pick([1, 2]), a = ri(2, 4) * step, k = ri(2, 4), g = mkBG(4, step); g.v[0] = a; g.v[1] = a * k; if (new Set(g.v).size < 4) return this.g();
      return N(`${g.names[1]}${P(g.names[1], '은', '는')} ${g.names[0]}의 몇 배일까요? (눈금 한 칸 = ${step}${g.unit})${bgFig(g)}`, k, `${a * k} ÷ ${a} = <b>${k}배</b>`, [k + 1, a * k - a, k * 2], '배'); } },
  { id:'bg-cells', name:'막대그래프로 나타내기 (칸 수)', std:'4수04-01', lv:[2,3], t:'both',
    g(){ const step = pick([2, 5, 10]), v = ri(3, 12) * step; return N(`표를 막대그래프로 나타내려고 해요. 세로 눈금 한 칸이 ${step}명을 나타낼 때, ${v}명은 몇 칸으로 그려야 할까요?`, v / step, `${v} ÷ ${step} = <b>${v / step}칸</b>`, [v, v / step + 1, v * step], '칸'); } },
  { id:'bg-missing', name:'합계로 모르는 막대 구하기', std:'4수04-03', lv:[4,5], t:'both',
    g(){ const g = mkBG(), i = ri(0, 3), s = g.v.reduce((a, b) => a + b, 0), shown = g.v.slice(); shown[i] = 0;
      return N(`조사한 전체가 <b>${s}${g.unit}</b>이에요. 그래프에서 지워진 <b>${g.names[i]}</b>의 막대는 몇 ${g.unit}을 나타낼까요?${barG(shown, g.names, g.step, g.unit, g.title, g.horiz)}`, g.v[i], `${s} - (${g.v.filter((_, j) => j !== i).join(' + ')}) = <b>${g.v[i]}${g.unit}</b>`, [g.v[i] / g.step, g.v[i] + g.step, s - g.v[i]], g.unit); } },
  { id:'bg-true', name:'막대그래프 해석하기', std:'4수04-03', lv:[3,4], t:'mc',
    g(){ const g = mkBG(), mx = Math.max(...g.v), mn = Math.min(...g.v), im = g.v.indexOf(mx), il = g.v.indexOf(mn), s = g.v.reduce((a, b) => a + b, 0);
      const ok = pick([`${g.names[im]}${P(g.names[im], '이', '가')} 가장 많아요.`, `${g.names[im]}${P(g.names[im], '은', '는')} ${g.names[il]}보다 ${mx - mn}${g.unit} 더 많아요.`, `조사한 전체는 ${s}${g.unit}이에요.`]);
      const bad = [`${g.names[il]}${P(g.names[il], '이', '가')} 가장 많아요.`, `${g.names[im]}${P(g.names[im], '은', '는')} ${g.names[il]}보다 ${mx - mn + g.step}${g.unit} 더 많아요.`, `조사한 전체는 ${s + g.step * 2}${g.unit}이에요.`, `세로 눈금 한 칸은 ${g.step * 5}${g.unit}이에요.`];
      return MC(`막대그래프를 보고 <b>바르게</b> 말한 것은? (눈금 한 칸 = ${g.step}${g.unit})${bgFig(g)}`, [ok, ...shuffle(bad).slice(0, 3)], `막대의 길이와 눈금을 정확히 읽어 확인해요 → <b>${ok}</b>`); } }
]});
})();
