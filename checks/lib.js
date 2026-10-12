/* =========================================================
   TyranoMath 🎯 실력 진단소 — 문제 만들기 도구 모음
   (분수 계산, 식 계산, 보기 만들기, 그림 그리기)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS = window.TM_ASSESS || { units: {}, STD: {} };

/* ---------- 수 ---------- */
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, n) => shuffle(arr).slice(0, n);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b){ [a, b] = [b, a % b]; } return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
const divisors = n => range(1, n).filter(d => n % d === 0);
const dz = x => Number.isInteger(x) ? x : Math.round(x * 1e9) / 1e9;                       // 소수 오차 없애기
const nf = x => { x = dz(x); if (Number.isInteger(x) && Math.abs(x) >= 10000) return x.toLocaleString('ko-KR'); return String(x); };
const won = x => x.toLocaleString('ko-KR');
const sum = arr => arr.reduce((s, x) => s + x, 0);
const KO = '㉠㉡㉢㉣㉤㉥'.split('');
const CIRC = ['①','②','③','④','⑤'];
// 받침 있는지 → 조사 고르기 (예: josa(3,'이','가'))
const hasBatchim = w => { const s = String(w); const ch = s[s.length - 1];
  if (/[0-9]/.test(ch)) return '013678'.includes(ch);
  const c = ch.charCodeAt(0); if (c < 0xAC00 || c > 0xD7A3) return false; return (c - 0xAC00) % 28 !== 0; };
const josa = (w, a, b) => String(w) + (hasBatchim(w) ? a : b);

/* ---------- 분수 ---------- */
class Frac {
  constructor(n, d = 1){
    if (d < 0){ n = -n; d = -d; }
    const g = gcd(n, d) || 1; this.n = n / g; this.d = d / g;
  }
  add(o){ o = toF(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o){ o = toF(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o){ o = toF(o); return new Frac(this.n * o.n, this.d * o.d); }
  div(o){ o = toF(o); return new Frac(this.n * o.d, this.d * o.n); }
  cmp(o){ o = toF(o); return Math.sign(this.n * o.d - o.n * this.d); }
  eq(o){ return this.cmp(o) === 0; }
  get v(){ return this.n / this.d; }
  isInt(){ return this.d === 1; }
}
const toF = x => x instanceof Frac ? x : new Frac(x, 1);
const F = (n, d = 1) => new Frac(n, d);
const M = (w, n, d) => new Frac(w * d + n, d);              // 대분수 w n/d
// 분수 → HTML (기본: 대분수로)
function frH(x, opt = {}){
  x = toF(x);
  if (x.d === 1) return `<span class="num">${x.n}</span>`;
  const neg = x.n < 0, n = Math.abs(x.n);
  if (opt.improper || n < x.d) return `<span class="fr">${neg ? '-' : ''}<span class="nd"><span class="n">${n}</span><span class="d">${x.d}</span></span></span>`;
  const w = Math.floor(n / x.d), r = n % x.d;
  return `<span class="fr">${neg ? '-' : ''}<span class="w">${w}</span><span class="nd"><span class="n">${r}</span><span class="d">${x.d}</span></span></span>`;
}
// 약분하지 않은 그대로의 분수 HTML
const fr = (n, d, w) => `<span class="fr">${w ? `<span class="w">${w}</span>` : ''}<span class="nd"><span class="n">${n}</span><span class="d">${d}</span></span></span>`;
const fracText = x => { x = toF(x); if (x.d === 1) return String(x.n); const w = Math.floor(x.n / x.d), r = x.n % x.d; return w ? `${w}과 ${r}/${x.d}` : `${r}/${x.d}`; };

/* ---------- 식 계산 (계산 순서 지키기 / 앞에서부터 잘못 계산하기) ---------- */
function evalExpr(s, ltr){
  const t = String(s).match(/\d+|[+\-×÷()]/g) || []; let i = 0, ok = true;
  const ap = (a, op, b) => {
    if (op === '+') return a + b;
    if (op === '-'){ if (a - b < 0) ok = false; return a - b; }
    if (op === '×') return a * b;
    if (b === 0 || a % b !== 0) ok = false; return b ? a / b : 0;
  };
  const prim = () => { const x = t[i++]; if (x === '('){ const v = expr(); i++; return v; } return Number(x); };
  const term = () => { let v = prim(); while (t[i] === '×' || t[i] === '÷'){ const op = t[i++]; v = ap(v, op, prim()); } return v; };
  function expr(){
    if (ltr){ let v = prim(); while (i < t.length && t[i] !== ')'){ const op = t[i++]; v = ap(v, op, prim()); } return v; }
    let v = term(); while (t[i] === '+' || t[i] === '-'){ const op = t[i++]; v = ap(v, op, term()); } return v;
  }
  const v = expr();
  return { v, ok: ok && Number.isInteger(v) && v >= 0 };
}
// 패턴(a+b×c …)의 글자에 수를 넣어 '나누어떨어지고 음수가 없는' 식을 만들어요
function makeExpr(pattern, rng, test){
  for (let k = 0; k < 6000; k++){
    const vals = {};
    const s = pattern.replace(/[a-hx]/g, ch => { if (!(ch in vals)){ const r = rng[ch] || [2, 30]; vals[ch] = ri(r[0], r[1]); } return vals[ch]; });
    const e = evalExpr(s);
    if (!e.ok) continue;
    if (test && !test(e.v, vals, s)) continue;
    return { s, v: e.v, vals };
  }
  return null;
}
const showExpr = s => String(s).replace(/([+\-×÷=])/g, ' $1 ').replace(/\s+/g, ' ').trim();
// 계산 순서대로 한 단계씩 (풀이에 사용) → { steps:[…], first:'39 ÷ 3' }
function exprSteps(s){
  let t = String(s).match(/\d+|[+\-×÷()]/g); const steps = [t.join(' ')]; let first = null;
  const calc = (a, op, b) => op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b;
  const clean = () => { for (let i = 0; i + 2 < t.length; i++) if (t[i] === '(' && t[i + 2] === ')'){ t.splice(i + 2, 1); t.splice(i, 1); i = -1; } };
  for (let guard = 0; t.length > 1 && guard < 30; guard++){
    let lo = 0, hi = t.length, open = -1;
    for (let i = 0; i < t.length; i++){ if (t[i] === '(') open = i; else if (t[i] === ')'){ lo = open + 1; hi = i; break; } }
    let k = -1;
    for (let i = lo; i < hi; i++) if (t[i] === '×' || t[i] === '÷'){ k = i; break; }
    if (k < 0) for (let i = lo; i < hi; i++) if (t[i] === '+' || t[i] === '-'){ k = i; break; }
    if (k < 0) break;
    if (!first) first = `${t[k - 1]} ${t[k]} ${t[k + 1]}`;
    t.splice(k - 1, 3, String(calc(+t[k - 1], t[k], +t[k + 1]))); clean();
    steps.push(t.join(' '));
  }
  return { steps, first, text: steps.join(' = ') };
}

/* ---------- 답과 보기 ---------- */
// 답 종류: int(자연수) · dec(소수) · frac(분수) · set(여러 수) · text(낱말)
function ansHTML(a, val){
  const v = val === undefined ? a.v : val;
  const u = a.unit ? `<span class="u">${a.unit}</span>` : '';
  if (a.k === 'frac') return frH(v, { improper: a.improper }) + u;
  if (a.k === 'set') return v.join(', ') + u;
  if (a.k === 'text') return String(v) + u;
  return nf(v) + u;
}
function sameVal(a, x, y){
  if (a.k === 'frac') return toF(x).eq(toF(y));
  if (a.k === 'set') return x.length === y.length && x.slice().sort((p, q) => p - q).every((v, i) => v === y.slice().sort((p, q) => p - q)[i]);
  if (a.k === 'dec' || a.k === 'int') return dz(x) === dz(y);
  return String(x) === String(y);
}
function autoWrong(a){
  const v = a.v, out = [];
  if (a.k === 'int'){ [v + 1, v - 1, v + 2, v + 10, v - 10, v * 2, v + 3, Math.round(v / 2)].forEach(x => { if (x >= 0 && x !== v) out.push(x); }); }
  else if (a.k === 'dec'){ [v * 10, v / 10, v + 0.1, v - 0.1, v + 1, v * 100, v + 0.01].forEach(x => { x = dz(x); if (x > 0 && x !== dz(v)) out.push(x); }); }
  else if (a.k === 'frac'){ const f = toF(v);
    [F(f.n + 1, f.d), F(f.n - 1, f.d), F(f.n, f.d + 1), F(f.n + f.d, f.d), F(f.n * 2, f.d), F(f.n, f.d * 2)].forEach(x => { if (x.n > 0 && !x.eq(f)) out.push(x); }); }
  else if (a.k === 'set'){ const s = v.slice(); out.push(s.slice(0, -1), s.slice(1), s.concat([s[s.length - 1] + 1]).filter((x, i, arr) => arr.indexOf(x) === i)); }
  return out;
}
// 4개의 보기를 만들어요 (정답 1 + 오답 3)
function makeChoices(q){
  if (q.choices){ return q; }                                        // 직접 만든 보기
  const a = q.ans, seen = [], opts = [];
  const add = (val) => {
    if (opts.length >= 4) return;
    if (seen.some(s => sameVal(a, s, val))) return;
    if (a.k === 'frac' && toF(val).n <= 0) return;
    if ((a.k === 'int' || a.k === 'dec') && !(val >= 0)) return;
    if (a.k === 'int' && !Number.isInteger(val)) return;
    seen.push(val); opts.push(val);
  };
  add(a.v);
  shuffle(q.wrong || []).forEach(add);
  shuffle(autoWrong(a)).forEach(add);
  const order = shuffle(opts.map((_, i) => i));
  q.choices = order.map(i => ansHTML(a, opts[i]));
  q.correct = order.indexOf(0);
  return q;
}

/* ---------- 그림 (SVG) ---------- */
const FONT = `font-family="Gowun Dodum, Jua, sans-serif"`;
const svg = (w, h, inner, cls = '') => `<svg class="fig ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="문제 그림">${inner}</svg>`;
const txt = (x, y, s, opt = {}) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" ${FONT} font-size="${opt.size || 15}" fill="${opt.fill || '#22314A'}" text-anchor="${opt.anchor || 'middle'}" dominant-baseline="central" ${opt.bold ? 'font-weight="700"' : ''}>${s}</text>`;
const line = (x1, y1, x2, y2, opt = {}) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${opt.stroke || '#22314A'}" stroke-width="${opt.w || 2}" ${opt.dash ? `stroke-dasharray="${opt.dash}"` : ''} stroke-linecap="round"/>`;
// 다각형: pts=[[x,y]…], v=꼭짓점 이름, e={i:'4 cm'} (i→i+1 변), ang={i:'70°'}, 등
function polyFig(pts, o = {}){
  const n = pts.length, cx = sum(pts.map(p => p[0])) / n, cy = sum(pts.map(p => p[1])) / n;
  let s = `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${o.fill || '#EEF6FF'}" stroke="${o.stroke || '#22314A'}" stroke-width="2.2" stroke-linejoin="round"/>`;
  (o.extra || []).forEach(x => { s += x; });
  if (o.v) pts.forEach((p, i) => {
    if (!o.v[i]) return;
    const dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1;
    s += txt(p[0] + dx / L * 15, p[1] + dy / L * 15, o.v[i], { size: 15, bold: true });
  });
  if (o.e) Object.keys(o.e).forEach(k => {
    const i = +k, p = pts[i], q = pts[(i + 1) % n];
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    let nx = -(q[1] - p[1]), ny = q[0] - p[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
    if ((mx - cx) * nx + (my - cy) * ny < 0){ nx = -nx; ny = -ny; }
    const lab = String(o.e[k]), w = lab.length * 7.6, off = Math.abs(nx) * (w / 2 + 7) + Math.abs(ny) * 13;
    s += txt(mx + nx * off, my + ny * off, lab, { size: 14, fill: o.eColor || '#2a6fae', bold: true });
  });
  if (o.ang) Object.keys(o.ang).forEach(k => {
    const i = +k, p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const u1 = norm(a[0] - p[0], a[1] - p[1]), u2 = norm(b[0] - p[0], b[1] - p[1]);
    let bx = u1[0] + u2[0], by = u1[1] + u2[1]; const L = Math.hypot(bx, by) || 1; bx /= L; by /= L;
    const sh = (o.angShift && o.angShift[k]) || [0, 0]; s += txt(p[0] + bx * 28 + sh[0], p[1] + by * 28 + sh[1], o.ang[k], { size: 13, fill: '#C2410C', bold: true });
  });
  return s;
}
const norm = (x, y) => { const L = Math.hypot(x, y) || 1; return [x / L, y / L]; };
// 점들을 상자(w×h) 안에 꼭 맞게 옮기기
function fitPts(pts, x0, y0, w, h){
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
  const k = Math.min(w / ((maxx - minx) || 1), h / ((maxy - miny) || 1));
  const ox = x0 + (w - (maxx - minx) * k) / 2, oy = y0 + (h - (maxy - miny) * k) / 2;
  return pts.map(p => [ox + (p[0] - minx) * k, oy + (p[1] - miny) * k]);
}
const rotPts = (pts, deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return pts.map(p => [p[0] * c - p[1] * s, p[0] * s + p[1] * c]); };
const flipPts = pts => pts.map(p => [-p[0], p[1]]);
// 직각 표시
function rightMark(p, a, b, size = 9){
  const u = norm(a[0] - p[0], a[1] - p[1]), v = norm(b[0] - p[0], b[1] - p[1]);
  const q1 = [p[0] + u[0] * size, p[1] + u[1] * size], q2 = [q1[0] + v[0] * size, q1[1] + v[1] * size], q3 = [p[0] + v[0] * size, p[1] + v[1] * size];
  return `<polyline points="${[q1, q2, q3].map(q => q.map(x => x.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#22314A" stroke-width="1.5"/>`;
}
// 수직선: from~to, 범위 표시 [a,b,aClosed,bClosed] (a 또는 b가 null이면 화살표로 계속)
function numberLine(from, to, step, rg){
  const W = 520, H = 80, x0 = 30, x1 = W - 30, X = v => x0 + (v - from) / (to - from) * (x1 - x0);
  let s = line(x0 - 10, 50, x1 + 10, 50, { w: 2 });
  for (let v = from; v <= to + 1e-9; v = dz(v + step)){ s += line(X(v), 44, X(v), 56, { w: 1.6 }); s += txt(X(v), 70, nf(v), { size: 13 }); }
  if (rg){
    const [a, b, ac, bc] = rg, xa = a == null ? x0 - 6 : X(a), xb = b == null ? x1 + 6 : X(b);
    s += line(xa, 26, xb, 26, { stroke: '#E5546B', w: 4 });
    if (a == null) s += `<polygon points="${xa - 8},26 ${xa + 2},20 ${xa + 2},32" fill="#E5546B"/>`;
    if (b == null) s += `<polygon points="${xb + 8},26 ${xb - 2},20 ${xb - 2},32" fill="#E5546B"/>`;
    if (a != null) s += `<circle cx="${xa}" cy="26" r="6.5" fill="${ac ? '#E5546B' : '#fff'}" stroke="#E5546B" stroke-width="3"/>`;
    if (b != null) s += `<circle cx="${xb}" cy="26" r="6.5" fill="${bc ? '#E5546B' : '#fff'}" stroke="#E5546B" stroke-width="3"/>`;
  }
  return svg(W, H, s, 'wide');
}
// 직육면체 겨냥도 (가로 a, 세로 b(깊이), 높이 c) — 꼭짓점: 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ
function cuboidFig(a, b, c, o = {}){
  const k = o.k || Math.min(230 / (a + b * 0.5), 150 / (c + b * 0.45), 24);
  const W = a * k, D = b * k * 0.5, Hh = c * k, ox = 60, oy = 22 + D * 0.85;
  const dx = D, dy = -D * 0.85;
  // 앞면 아래 왼쪽부터
  const P = {
    ㅁ: [ox, oy + Hh], ㅂ: [ox + W, oy + Hh], ㄴ: [ox + W, oy], ㄱ: [ox, oy],
    ㅇ: [ox + dx, oy + Hh + dy], ㅅ: [ox + W + dx, oy + Hh + dy], ㄷ: [ox + W + dx, oy + dy], ㄹ: [ox + dx, oy + dy]
  };
  const E = (p, q, dash) => line(P[p][0], P[p][1], P[q][0], P[q][1], { w: 2.2, dash: dash ? '6 5' : '' });
  let s = '';
  if (o.shade){ const f = o.shade; s += `<polygon points="${f.map(v => P[v].join(',')).join(' ')}" fill="#FFE29A" opacity=".85"/>`; }
  s += E('ㅁ', 'ㅇ', 1) + E('ㅇ', 'ㅅ', 1) + E('ㅇ', 'ㄹ', 1);
  s += E('ㄱ', 'ㄴ') + E('ㄴ', 'ㅂ') + E('ㅂ', 'ㅁ') + E('ㅁ', 'ㄱ') + E('ㄱ', 'ㄹ') + E('ㄹ', 'ㄷ') + E('ㄷ', 'ㄴ') + E('ㄷ', 'ㅅ') + E('ㅅ', 'ㅂ');
  if (o.names !== false){
    const off = { ㄱ: [-12, -6], ㄴ: [4, 12], ㄷ: [10, -8], ㄹ: [-8, -10], ㅁ: [-12, 8], ㅂ: [6, 12], ㅅ: [12, 6], ㅇ: [-12, -4] };
    Object.keys(P).forEach(v => { s += txt(P[v][0] + off[v][0], P[v][1] + off[v][1], v, { size: 13, bold: true, fill: '#5D6C83' }); });
  }
  if (o.dims){
    const [la, lb, lc] = o.dims;
    if (la) s += txt((P.ㅁ[0] + P.ㅂ[0]) / 2, P.ㅁ[1] + 20, la, { size: 14, fill: '#2a6fae', bold: true });
    if (lb) s += txt((P.ㅂ[0] + P.ㅅ[0]) / 2 + 22, (P.ㅂ[1] + P.ㅅ[1]) / 2 + 8, lb, { size: 14, fill: '#2a6fae', bold: true });
    if (lc) s += txt(P.ㅁ[0] - 26, (P.ㅁ[1] + P.ㄱ[1]) / 2, lc, { size: 14, fill: '#2a6fae', bold: true });
  }
  const Wd = Math.ceil(ox + W + dx + 50), Hd = Math.ceil(oy + Hh + 34);
  return svg(Wd, Hd, s);
}
// 전개도: cells=[[col,row]…], labels=['가'…]
function netFig(cells, labels, size = 44){
  const maxc = Math.max(...cells.map(c => c[0])), maxr = Math.max(...cells.map(c => c[1]));
  let s = '';
  cells.forEach((c, i) => {
    const x = 10 + c[0] * size, y = 10 + c[1] * size;
    s += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${labels[i] && labels[i].startsWith('*') ? '#FFE29A' : '#EEF6FF'}" stroke="#22314A" stroke-width="2"/>`;
    s += txt(x + size / 2, y + size / 2, String(labels[i] || '').replace('*', ''), { size: 17, bold: true });
  });
  return svg(20 + (maxc + 1) * size, 20 + (maxr + 1) * size, s);
}
// 정육면체 굴리기로 전개도의 면 → 정육면체 면 번호 (0아래 1위 2북 3남 4동 5서)
function foldNet(cells){
  const key = c => c[0] + ',' + c[1], idx = {}; cells.forEach((c, i) => idx[key(c)] = i);
  const face = new Array(cells.length).fill(-1), seen = new Set([0]);
  const queue = [[0, { b: 0, t: 1, n: 2, s: 3, e: 4, w: 5 }]]; face[0] = 0;
  while (queue.length){
    const [i, o] = queue.shift(), c = cells[i];
    const moves = [[1, 0, x => ({ b: x.e, e: x.t, t: x.w, w: x.b, n: x.n, s: x.s })], [-1, 0, x => ({ b: x.w, w: x.t, t: x.e, e: x.b, n: x.n, s: x.s })],
      [0, -1, x => ({ b: x.n, n: x.t, t: x.s, s: x.b, e: x.e, w: x.w })], [0, 1, x => ({ b: x.s, s: x.t, t: x.n, n: x.b, e: x.e, w: x.w })]];
    moves.forEach(([dx, dy, f]) => {
      const j = idx[key([c[0] + dx, c[1] + dy])];
      if (j === undefined || seen.has(j)) return;
      seen.add(j); const no = f(o); face[j] = no.b; queue.push([j, no]);
    });
  }
  const valid = cells.length === 6 && new Set(face).size === 6 && !face.includes(-1);
  const opp = f => [1, 0, 3, 2, 5, 4][f];
  return { face, valid, opposite: i => face.indexOf(opp(face[i])) };
}
// 정육면체 전개도 11가지 (컴퓨터로 모두 찾아 접어 보고 확인한 목록)
const CUBE_NETS = [[[3,0],[0,1],[1,1],[2,1],[3,1],[3,2]],[[3,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[3,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[3,0],[0,1],[1,1],[2,1],[3,1],[0,2]],[[2,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[2,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[2,0],[0,1],[1,1],[2,1],[2,2],[3,2]],[[2,0],[3,0],[0,1],[1,1],[2,1],[1,2]],[[3,0],[1,1],[2,1],[3,1],[0,2],[1,2]],[[2,0],[3,0],[4,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]]];
// 정육면체 전개도가 될 수 없는 6칸 모양
const NON_NETS = [[[4,0],[0,1],[1,1],[2,1],[3,1],[4,1]],[[3,0],[0,1],[1,1],[2,1],[3,1],[4,1]],[[2,0],[0,1],[1,1],[2,1],[3,1],[4,1]],[[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]],[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1]],[[0,0],[3,0],[0,1],[1,1],[2,1],[3,1]],[[3,0],[4,0],[0,1],[1,1],[2,1],[3,1]],[[3,0],[3,1],[0,2],[1,2],[2,2],[3,2]],[[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]],[[2,0],[2,1],[0,2],[1,2],[2,2],[3,2]],[[1,0],[0,1],[1,1],[0,2],[1,2],[2,2]],[[1,0],[2,0],[1,1],[0,2],[1,2],[2,2]],[[1,0],[0,1],[1,1],[2,1],[1,2],[2,2]],[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[1,1],[2,1],[1,2],[2,2]],[[1,0],[2,0],[3,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[1,1],[0,2],[1,2],[2,2]],[[1,0],[2,0],[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[1,2],[2,2],[3,2]],[[0,0],[2,0],[3,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[0,1],[0,2],[1,2],[2,2]],[[0,0],[1,0],[2,0],[2,1],[2,2],[3,2]],[[3,0],[2,1],[3,1],[0,2],[1,2],[2,2]]];
// 회전판: parts=[{w:2, color:'#…', label:'빨강'}]
function spinnerFig(parts, r = 70){
  const C = r + 10, tot = sum(parts.map(p => p.w)); let a0 = -Math.PI / 2, s = '';
  parts.forEach(p => {
    const a1 = a0 + p.w / tot * Math.PI * 2, large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = C + r * Math.cos(a0), y0 = C + r * Math.sin(a0), x1 = C + r * Math.cos(a1), y1 = C + r * Math.sin(a1);
    s += parts.length === 1 ? `<circle cx="${C}" cy="${C}" r="${r}" fill="${p.color}" stroke="#22314A" stroke-width="2"/>`
      : `<path d="M${C} ${C} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${p.color}" stroke="#22314A" stroke-width="2"/>`;
    if (p.label){ const am = (a0 + a1) / 2; s += txt(C + r * .58 * Math.cos(am), C + r * .58 * Math.sin(am), p.label, { size: 13, bold: true }); }
    a0 = a1;
  });
  s += `<circle cx="${C}" cy="${C}" r="5" fill="#22314A"/>` + line(C, C, C, C - r * .7, { w: 3 });
  return svg(2 * C, 2 * C, s);
}
// 막대그래프 + 평균선
function barsFig(vals, names, unit, avg){
  const W = 60 + vals.length * 62, H = 210, max = Math.max(...vals, avg || 0) * 1.15, Y = v => 175 - v / max * 150;
  let s = line(40, 20, 40, 175, { w: 1.6 }) + line(40, 175, W - 10, 175, { w: 1.6 });
  vals.forEach((v, i) => {
    const x = 56 + i * 62;
    s += `<rect x="${x}" y="${Y(v).toFixed(1)}" width="34" height="${(175 - Y(v)).toFixed(1)}" rx="4" fill="#8EC5F4" stroke="#2a6fae"/>`;
    s += txt(x + 17, Y(v) - 10, nf(v), { size: 12, bold: true }) + txt(x + 17, 192, names[i], { size: 12 });
  });
  if (avg !== undefined) s += line(40, Y(avg), W - 10, Y(avg), { stroke: '#E5546B', w: 2.4, dash: '7 5' }) + txt(W - 14, Y(avg) - 10, '평균', { size: 12, fill: '#E5546B', anchor: 'end', bold: true });
  s += txt(14, 12, `(${unit})`, { size: 11, anchor: 'start', fill: '#5D6C83' });
  return svg(W, H, s, 'wide');
}
// 표 (HTML)
const table = (rows, opt = {}) => `<table class="qt">${rows.map((r, i) => `<tr>${r.map(c => i === 0 && opt.head !== false || (opt.firstCol && 0) ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const tableH = (rows) => `<table class="qt">${rows.map(r => `<tr><th>${r[0]}</th>${r.slice(1).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const blank = '<span class="bx">□</span>';

Object.assign(A, {
  ri, pick, shuffle, sample, gcd, lcm, range, divisors, dz, nf, won, sum, KO, CIRC, josa,
  Frac, F, M, toF, frH, fr, fracText,
  evalExpr, makeExpr, showExpr, exprSteps,
  ansHTML, sameVal, makeChoices,
  svg, txt, line, polyFig, fitPts, rotPts, flipPts, rightMark, numberLine, cuboidFig, netFig, foldNet, CUBE_NETS, NON_NETS, spinnerFig, barsFig, table, tableH, blank,
  addUnit(u){ A.units[u.key] = u; }
});
})();
