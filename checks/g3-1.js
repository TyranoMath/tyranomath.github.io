/* =========================================================
   3학년 1학기 문제 만들기 — 수학익힘 3-1(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
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
const Q = (q, f, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: 'frac', v: toF(f), unit }, wrong, ex }, extra);
const CMP = (a, b) => a > b ? '&gt;' : a < b ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];
const coprime = (lo, hi) => { let n, d; do { d = ri(lo, hi); n = ri(1, d - 1); } while (gcd(n, d) !== 1); return [n, d]; };

/* ---------- 3학년 공통 그림 ---------- */
const DOT = (x, y, nm, dx = 0, dy = -14) => `<circle cx="${x}" cy="${y}" r="4" fill="#22314A"/>` + txt(x + dx, y + dy, nm, { size: 15, bold: true });
const arrowHead = (x, y, dir) => dir > 0 ? `<polygon points="${x},${y} ${x - 12},${y - 6} ${x - 12},${y + 6}" fill="#22314A"/>` : `<polygon points="${x},${y} ${x + 12},${y - 6} ${x + 12},${y + 6}" fill="#22314A"/>`;
// kind: 'seg' | 'ray' (a→b 방향으로 늘어남) | 'line'
const lineFig = (kind, a = 'ㄱ', b = 'ㄴ') => { const x1 = 80, x2 = 220, y = 40; let s = '';
  const L = kind === 'seg' ? [x1, x2] : kind === 'ray' ? [x1, 290] : [10, 290];
  s += line(L[0], y, L[1], y, { w: 2.6 });
  if (kind === 'ray') s += arrowHead(296, y, 1); if (kind === 'line') s += arrowHead(296, y, 1) + arrowHead(4, y, -1);
  return svg(300, 70, s + DOT(x1, y, a) + DOT(x2, y, b)); };
const angleFig = (names = ['ㄱ', 'ㄴ', 'ㄷ'], deg = 55) => { const vx = 60, vy = 130, L = 150, r = deg * Math.PI / 180, ax = vx + L * Math.cos(-r), ay = vy + L * Math.sin(-r), bx = vx + L, by = vy;
  return svg(240, 160, line(vx, vy, ax, ay, { w: 2.6 }) + line(vx, vy, bx, by, { w: 2.6 }) + DOT(ax - 20, ay + 10, names[0], -6, -12) + DOT(vx, vy, names[1], -10, 14) + DOT(bx - 20, by, names[2], 0, 16)); };
const poly = (pts, fill = '#EEF6FF') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" stroke="#22314A" stroke-width="2.2" stroke-linejoin="round"/>`;
const gridBG = (w, h, u = 20) => { let g = ''; for (let x = 0; x <= w; x += u) g += line(x, 0, x, h, { stroke: '#E2E8F0', w: 1 }); for (let y = 0; y <= h; y += u) g += line(0, y, w, y, { stroke: '#E2E8F0', w: 1 }); return g; };
const triOnGrid = right => { const u = 20; let p; do { const a = [ri(1, 3), ri(4, 6)], b = right ? [a[0], ri(1, 2)] : [ri(1, 6), ri(1, 2)], c = right ? [ri(4, 7), a[1]] : [ri(4, 7), ri(4, 6)]; p = [a, b, c]; } while (!right && isRight(p) || area(p) < 3);
  return svg(170, 150, gridBG(170, 150) + poly(p.map(q => [q[0] * u, q[1] * u]))); };
const isRight = p => [0, 1, 2].some(i => { const a = p[i], b = p[(i + 1) % 3], c = p[(i + 2) % 3]; return (b[0] - a[0]) * (c[0] - a[0]) + (b[1] - a[1]) * (c[1] - a[1]) === 0; });
const area = p => Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1])) / 2;
const clockFig = (h, m) => { const C = 60, R = 52; let s = `<circle cx="${C}" cy="${C}" r="${R}" fill="#fff" stroke="#22314A" stroke-width="2.4"/>`;
  for (let i = 1; i <= 12; i++){ const a = i * Math.PI / 6 - Math.PI / 2; s += txt(C + 41 * Math.cos(a), C + 41 * Math.sin(a), i, { size: 11 }); }
  const ah = ((h % 12) + m / 60) * Math.PI / 6 - Math.PI / 2, am = m * Math.PI / 30 - Math.PI / 2;
  s += line(C, C, C + 24 * Math.cos(ah), C + 24 * Math.sin(ah), { w: 4 }) + line(C, C, C + 36 * Math.cos(am), C + 36 * Math.sin(am), { w: 2.6, stroke: '#2a6fae' }) + `<circle cx="${C}" cy="${C}" r="3.5" fill="#22314A"/>`;
  return svg(120, 120, s); };
window.TM_G3 = { lineFig, angleFig, triOnGrid, clockFig, gridBG, poly, DOT };

/* ─────────────── 1. 평면도형 ─────────────── */
const LN = { seg: '선분', ray: '반직선', line: '직선' };
A.addUnit({ key:'3-1-1', title:'평면도형', items:[
  { id:'ln-name', name:'선분, 반직선, 직선 구별하기', std:'4수03-01', lv:[1,1], t:'mc',
    g(){ const k = pick(['seg', 'ray', 'line']);
      return MC('도형의 이름은?', [`${LN[k]} ㄱㄴ`, ...['seg', 'ray', 'line'].filter(x => x !== k).map(x => `${LN[x]} ㄱㄴ`)], `양쪽 끝이 있으면 선분, 한쪽으로 끝없이 늘어나면 반직선, 양쪽으로 늘어나면 직선 → <b>${LN[k]} ㄱㄴ</b>`, { fig: lineFig(k) }); } },
  { id:'ln-ray', name:'반직선의 이름 바르게 쓰기', std:'4수03-01', lv:[2,2], t:'mc',
    g(){ const rev = ri(0, 1), [a, b] = rev ? ['ㄴ', 'ㄱ'] : ['ㄱ', 'ㄴ'];
      return MC('도형의 이름으로 알맞은 것은?', [`반직선 ${a}${b}`, `반직선 ${b}${a}`, `선분 ${a}${b}`, `직선 ${a}${b}`], `반직선은 <b>시작하는 점</b>을 먼저 읽어요. 점 ${a}에서 시작해 점 ${b} 쪽으로 늘어나므로 <b>반직선 ${a}${b}</b>`, { fig: lineFig('ray', a, b) }); } },
  { id:'ln-count', name:'점을 이어 그을 수 있는 선분의 수', std:'4수03-01', lv:[3,4], t:'both',
    g(){ const n = ri(3, 6), v = n * (n - 1) / 2;
      return N(`원 위에 점 ${n}개가 있어요. 두 점을 이어 그을 수 있는 선분은 모두 몇 개일까요? (세 점이 한 직선 위에 있지 않아요)`, v, `한 점에서 ${n - 1}개씩 그을 수 있지만 같은 선분을 두 번 세게 되므로 ${n} × ${n - 1} ÷ 2 = <b>${v}개</b>`, [n * (n - 1), v + 1, n], '개'); } },
  { id:'ang-name', name:'각의 이름 알기', std:'4수03-02', lv:[1,2], t:'mc',
    g(){ const nm = shuffle(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ']).slice(0, 3);
      return MC('각의 이름으로 알맞은 것은?', [`각 ${nm[0]}${nm[1]}${nm[2]}`, `각 ${nm[1]}${nm[0]}${nm[2]}`, `각 ${nm[0]}${nm[2]}${nm[1]}`, `각 ${nm[1]}${nm[2]}${nm[0]}`], `각의 꼭짓점 ${nm[1]}${P(nm[1], '을', '를')} <b>가운데</b>에 써요 → 각 ${nm[0]}${nm[1]}${nm[2]} 또는 각 ${nm[2]}${nm[1]}${nm[0]}`, { fig: angleFig(nm, ri(35, 70)) }); } },
  { id:'ang-count', name:'도형에서 각의 수 세기', std:'4수03-02', lv:[1,2], t:'both',
    g(){ const sh = shuffle([['삼각형', 3], ['사각형', 4], ['오각형', 5], ['육각형', 6], ['원', 0]]).slice(0, 3), v = sh.reduce((a, b) => a + b[1], 0);
      return N(`${sh.map(x => x[0]).join(', ')}에 있는 각의 수를 모두 더하면 몇 개일까요?`, v, `${sh.map(x => `${x[0]} ${x[1]}개`).join(', ')} → <b>${v}개</b> (원은 곧은 선이 없어 각이 없어요)`, [v + 1, v - 1, v + 3], '개'); } },
  { id:'right-clock', name:'시계에서 직각 찾기', std:'4수03-02', lv:[2,3], t:'mc',
    g(){ const good = pick([[3, 0], [9, 0]]), bad = shuffle([[1, 0], [2, 0], [4, 0], [6, 0], [12, 0], [5, 0], [7, 0], [8, 0]]).slice(0, 3), f = t => `${t[0]}시`;
      return MC('시계의 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 <b>직각</b>인 시각은?', [f(good), ...bad.map(f)], `3시와 9시에는 두 바늘이 직각을 이뤄요. 6시는 일직선, 12시는 겹쳐 있어요.`); } },
  { id:'right-count', name:'도형에 있는 직각의 수', std:'4수03-10', lv:[2,3], t:'both',
    g(){ const sh = shuffle([['직사각형', 4], ['정사각형', 4], ['직각삼각형', 1]]).slice(0, ri(2, 3)).map(x => [x[0], x[1], ri(1, 3)]), v = sh.reduce((a, b) => a + b[1] * b[2], 0);
      return N(`${sh.map(x => `${x[0]} ${x[2]}개`).join(', ')}에 있는 직각은 모두 몇 개일까요?`, v, `직사각형·정사각형은 직각 4개, 직각삼각형은 1개 → ${sh.map(x => `${x[1]} × ${x[2]}`).join(' + ')} = <b>${v}개</b>`, [v + 1, v - 1, v + 4], '개'); } },
  { id:'rt-tri', name:'직각삼각형 찾기', std:'4수03-09', lv:[1,2], t:'mc',
    g(){ const ok = triOnGrid(true), bad = []; let t = 0; while (bad.length < 3 && t < 50){ t++; const b = triOnGrid(false); if (!bad.includes(b)) bad.push(b); }
      return MC('직각삼각형은?', [ok, ...bad], '한 각이 직각인 삼각형이 <b>직각삼각형</b>이에요. 모눈의 가로선과 세로선이 만나는 곳을 살펴보세요.', { gridChoices: true }); } },
  { id:'rect-prop', name:'직사각형과 정사각형의 성질', std:'4수03-10', lv:[2,3], t:'mc',
    g(){ return pick([
      () => MC('직사각형에 대한 설명으로 옳은 것은?', ['네 각이 모두 직각이에요.', '네 변의 길이가 항상 모두 같아요.', '직각이 2개뿐이에요.', '변이 3개예요.'], '직사각형은 네 각이 모두 직각인 사각형이에요. 마주 보는 두 변의 길이가 같아요.'),
      () => MC('정사각형에 대한 설명으로 옳지 <b>않은</b> 것은?', ['직사각형이라고 할 수 없어요.', '네 각이 모두 직각이에요.', '네 변의 길이가 모두 같아요.', '꼭짓점이 4개예요.'], '정사각형은 네 각이 모두 직각이므로 <b>직사각형이라고 할 수 있어요</b>.'),
      () => MC('네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은?', ['정사각형', '직사각형이 아닌 사각형', '직각삼각형', '삼각형'], '네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형은 <b>정사각형</b>이에요.')])(); } },
  { id:'rect-peri', name:'직사각형·정사각형의 네 변의 길이의 합', std:'4수03-10', lv:[2,3], t:'both',
    g(){ if (ri(0, 1)){ const a = ri(4, 15), b = ri(2, a - 1); return N(`가로 ${a} cm, 세로 ${b} cm인 직사각형의 네 변의 길이의 합은 몇 cm일까요?`, 2 * (a + b), `직사각형은 마주 보는 변의 길이가 같아요: ${a} + ${b} + ${a} + ${b} = <b>${2 * (a + b)} cm</b>`, [a + b, a * b, 2 * a + b], 'cm'); }
      const a = ri(3, 15); return N(`한 변이 ${a} cm인 정사각형의 네 변의 길이의 합은 몇 cm일까요?`, 4 * a, `정사각형은 네 변의 길이가 모두 같아요: ${a} × 4 = <b>${4 * a} cm</b>`, [2 * a, a * a, 3 * a], 'cm'); } },
  { id:'sq-cut', name:'직사각형에서 정사각형 잘라 내기', std:'4수03-10', lv:[4,4], t:'both',
    g(){ const b = ri(4, 9), a = b + ri(2, 7);
      return N(`가로 ${a} cm, 세로 ${b} cm인 직사각형 모양 종이에서 가장 큰 정사각형을 잘라 냈어요. 남은 직사각형의 네 변의 길이의 합은 몇 cm일까요?`, 2 * ((a - b) + b), `가장 큰 정사각형의 한 변은 ${b} cm → 남은 직사각형은 가로 ${a - b} cm, 세로 ${b} cm → (${a - b} + ${b}) × 2 = <b>${2 * a} cm</b>`, [4 * b, 2 * (a + b), (a - b) * 2], 'cm'); } },
  { id:'sq-count', name:'크고 작은 사각형의 수 세기', std:'4수03-10', lv:[4,5], t:'both',
    g(){ if (ri(0, 1)){ const n = ri(3, 6), v = n * (n + 1) / 2; return N(`직사각형 모양의 종이를 세로 점선을 따라 똑같은 직사각형 ${n}개로 나누었어요. 그림에서 찾을 수 있는 크고 작은 직사각형은 모두 몇 개일까요?`, v, `1칸짜리 ${n}개, 2칸짜리 ${n - 1}개, … , ${n}칸짜리 1개 → ${range(1, n).reverse().join(' + ')} = <b>${v}개</b>`, [n, v - 1, 2 * n], '개', { fig: svg(40 + n * 40, 70, range(0, n - 1).map(i => `<rect x="${20 + i * 40}" y="10" width="40" height="50" fill="#EEF6FF" stroke="#22314A" stroke-width="2"/>`).join('')) }); }
      const m = ri(2, 3), v = m === 2 ? 5 : 14; return N(`정사각형 ${m * m}개를 겹치지 않게 이어 붙여 큰 정사각형을 만들었어요. 찾을 수 있는 크고 작은 정사각형은 모두 몇 개일까요?`, v, m === 2 ? '작은 정사각형 4개 + 큰 정사각형 1개 = <b>5개</b>' : '1칸 9개 + 4칸(2×2) 4개 + 9칸 1개 = <b>14개</b>', [m * m, m * m + 1, v + 2], '개', { fig: svg(20 + m * 36, 20 + m * 36, range(0, m * m - 1).map(i => `<rect x="${10 + (i % m) * 36}" y="${10 + Math.floor(i / m) * 36}" width="36" height="36" fill="#EEF6FF" stroke="#22314A" stroke-width="2"/>`).join('')) }); } }
]});

/* ─────────────── 2. 덧셈과 뺄셈 ─────────────── */
// carries: 받아올림 횟수에 맞는 두 세 자리 수
const addPair = c => { let a, b, k, t = 0; do { a = ri(100, 899); b = ri(100, 999 - (c ? 0 : 0)); k = carryCount(a, b); t++; } while ((k !== c || a + b > 1998 || (c < 3 && a + b > 999)) && t < 500); return [a, b]; };
const carryCount = (a, b) => { let c = 0, cr = 0; for (let i = 0; i < 3; i++){ const s = (a % 10) + (b % 10) + cr; cr = s >= 10 ? 1 : 0; c += cr; a = Math.floor(a / 10); b = Math.floor(b / 10); } return c; };
const subPair = c => { let a, b, k, t = 0; do { a = ri(200, 999); b = ri(100, a - 1); k = borrowCount(a, b); t++; } while (k !== c && t < 500); return [a, b]; };
const borrowCount = (a, b) => { let c = 0, br = 0; for (let i = 0; i < 2; i++){ const d = (a % 10) - br - (b % 10); br = d < 0 ? 1 : 0; c += br; a = Math.floor(a / 10); b = Math.floor(b / 10); } return c; };
A.addUnit({ key:'3-1-2', title:'덧셈과 뺄셈', items:[
  { id:'as-est', name:'덧셈과 뺄셈 어림하기', std:'4수01-08', lv:[1,2], t:'mc',
    g(){ const a = ri(1, 7) * 100 + ri(-30, 30), b = ri(1, 2) * 100 + ri(-30, 30), plus = ri(0, 1), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, v = plus ? ra + rb : ra - rb;
      if (v <= 0) return this.g();
      return MC(`${a} ${plus ? '+' : '-'} ${b}${P(b, '은', '는')} 몇백쯤일까요?`, [`${v}쯤`, `${v + 100}쯤`, `${Math.max(100, v - 100) === v ? v + 200 : Math.max(100, v - 100)}쯤`, `${v + 300}쯤`], `${a}${P(a, '은', '는')} 약 ${ra}, ${b}${P(b, '은', '는')} 약 ${rb} → ${ra} ${plus ? '+' : '-'} ${rb} = <b>${v}</b>쯤`); } },
  { id:'add0', name:'받아올림이 없는 세 자리 수의 덧셈', std:'4수01-03', lv:[1,1], t:'both',
    g(){ const [a, b] = addPair(0); return N(`${a} + ${b}의 값은?`, a + b, `같은 자리 수끼리 더해요 → <b>${a + b}</b>`, [a + b + 10, a + b - 100, a + b + 100]); } },
  { id:'add1', name:'받아올림이 한 번 있는 세 자리 수의 덧셈', std:'4수01-03', lv:[1,2], t:'both',
    g(){ const [a, b] = addPair(1); return N(`${a} + ${b}의 값은?`, a + b, `일의 자리부터 더하고, 10이 되면 윗자리로 받아올림해요 → <b>${a + b}</b>`, [a + b - 10, a + b - 100, a + b + 10]); } },
  { id:'add2', name:'받아올림이 여러 번 있는 세 자리 수의 덧셈', std:'4수01-03', lv:[2,3], t:'both',
    g(){ const [a, b] = addPair(ri(2, 3)); return N(`${a} + ${b}의 값은?`, a + b, `받아올림한 1을 윗자리 계산에 꼭 더해요 → <b>${a + b}</b>`, [a + b - 10, a + b - 110, a + b - 100]); } },
  { id:'sub0', name:'받아내림이 없는 세 자리 수의 뺄셈', std:'4수01-03', lv:[1,1], t:'both',
    g(){ const [a, b] = subPair(0); return N(`${a} - ${b}의 값은?`, a - b, `같은 자리 수끼리 빼요 → <b>${a - b}</b>`, [a - b + 10, a - b + 100, a + b]); } },
  { id:'sub1', name:'받아내림이 한 번 있는 세 자리 수의 뺄셈', std:'4수01-03', lv:[1,2], t:'both',
    g(){ const [a, b] = subPair(1); return N(`${a} - ${b}의 값은?`, a - b, `뺄 수 없으면 윗자리에서 10을 받아내려요 → <b>${a - b}</b>`, [a - b + 10, a - b + 100, a - b - 10]); } },
  { id:'sub2', name:'받아내림이 두 번 있는 세 자리 수의 뺄셈', std:'4수01-03', lv:[2,3], t:'both',
    g(){ const [a, b] = subPair(2); return N(`${a} - ${b}의 값은?`, a - b, `일의 자리, 십의 자리에서 차례로 받아내림해요 → <b>${a - b}</b>`, [a - b + 110, a - b + 100, a - b + 10]); } },
  { id:'as-word', name:'덧셈과 뺄셈 생활 문제', std:'4수01-03', lv:[2,3], t:'both',
    g(){ const t = ri(0, 3);
      if (t === 0){ const [a, b] = addPair(ri(1, 2)); return N(`집에서 공원까지 ${a} m, 공원에서 도서관까지 ${b} m예요. 집에서 공원을 지나 도서관까지 가는 거리는 몇 m일까요?`, a + b, `${a} + ${b} = <b>${a + b} m</b>`, [a - b, a + b - 100], 'm'); }
      if (t === 1){ const tot = ri(600, 950), s = ri(100, tot - 100); return N(`기차에 ${tot}명이 탈 수 있어요. 지금까지 ${s}명이 탔다면 더 탈 수 있는 사람은 몇 명일까요?`, tot - s, `${tot} - ${s} = <b>${tot - s}명</b>`, [tot + s, tot - s + 10], '명'); }
      if (t === 2){ const tot = ri(500, 900), g = ri(200, tot - 150); return N(`어느 학교 학생 ${tot}명 중 남학생이 ${g}명이에요. 여학생은 몇 명일까요?`, tot - g, `${tot} - ${g} = <b>${tot - g}명</b>`, [tot + g, tot - g - 10], '명'); }
      const [a, b] = addPair(1); return N(`오전에 빵을 ${a}개, 오후에 ${b}개 만들었어요. 오늘 만든 빵은 모두 몇 개일까요?`, a + b, `${a} + ${b} = <b>${a + b}개</b>`, [a - b, a + b - 10], '개'); } },
  { id:'as-cmp', name:'계산 결과의 크기 비교하기', std:'4수01-03', lv:[3,3], t:'mc',
    g(){ const [a, b] = addPair(1), [c, d] = subPair(1), x = a + b, y = c - d, cv = CMP(x, y);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${a} + ${b} ○ ${c} - ${d}`)}`, [cv, ...CMPC.filter(z => z !== cv)], `${a} + ${b} = ${x}, ${c} - ${d} = ${y} → <b>${cv}</b>`); } },
  { id:'as-missing', name:'□ 안에 알맞은 수 구하기', std:'4수01-03', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2), [a, b] = addPair(1), s = a + b;
      if (t === 0) return N(`□ + ${b} = ${s}에서 □ 안에 알맞은 수는?`, a, `□ = ${s} - ${b} = <b>${a}</b>`, [s + b, a + 10, a - 100]);
      if (t === 1) return N(`${s} - □ = ${a}에서 □ 안에 알맞은 수는?`, b, `□ = ${s} - ${a} = <b>${b}</b>`, [s + a, b + 10, b - 10]);
      return N(`□ - ${b} = ${a}에서 □ 안에 알맞은 수는?`, s, `□ = ${a} + ${b} = <b>${s}</b>`, [a - b > 0 ? a - b : a + 1, s + 10, s - 100]); } },
  { id:'as-cards', name:'수 카드로 만든 수의 합과 차', std:'4수01-03', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 3).sort((x, y) => y - x), big = c[0] * 100 + c[1] * 10 + c[2], small = c[2] * 100 + c[1] * 10 + c[0], t = ri(0, 1);
      return t ? N(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 만들 수 있는 가장 큰 세 자리 수와 가장 작은 세 자리 수의 <b>합</b>은?`, big + small, `가장 큰 수 ${big}, 가장 작은 수 ${small} → ${big} + ${small} = <b>${big + small}</b>`, [big - small, big + small - 10, big * 2])
        : N(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 만들 수 있는 가장 큰 세 자리 수와 가장 작은 세 자리 수의 <b>차</b>는?`, big - small, `가장 큰 수 ${big}, 가장 작은 수 ${small} → ${big} - ${small} = <b>${big - small}</b>`, [big + small, big - small + 10, big - small - 100]); } },
  { id:'as-wrong', name:'잘못 계산한 식에서 바르게 계산하기', std:'4수01-03', lv:[4,4], t:'both',
    g(){ const x = ri(300, 800), k = ri(110, Math.min(299, x - 10)), wrong = x + k;
      if (wrong > 999) return this.g();
      return N(`어떤 수에서 ${k}${P(k, '을', '를')} 빼야 할 것을 잘못하여 더했더니 ${wrong}${P(wrong, '이', '가')} 되었어요. 바르게 계산한 값은?`, x - k, `어떤 수 = ${wrong} - ${k} = ${x} → 바르게 계산: ${x} - ${k} = <b>${x - k}</b>`, [x, wrong + k, wrong - k * 3 > 0 ? wrong - 3 * k : x + 1]); } },
  { id:'as-range', name:'□ 안에 들어갈 수 있는 가장 큰 수', std:'4수01-03', lv:[5,5], t:'both',
    g(){ const a = ri(200, 500), b = ri(a + 200, 999);
      return N(`${a} + □ &lt; ${b}에서 □ 안에 들어갈 수 있는 세 자리 수 중 가장 큰 수는?`, b - a - 1, `${a} + □ = ${b}이면 □ = ${b - a} → 이보다 작아야 하므로 가장 큰 수는 <b>${b - a - 1}</b>`, [b - a, b - a + 1, b + a]); } }
]});

/* ─────────────── 3. 길이와 시간 ─────────────── */
const hms = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return `${h}시 ${m}분 ${x}초`; };
const ms = s => `${Math.floor(s / 60)}분 ${s % 60}초`;
const dur = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return `${h ? h + '시간 ' : ''}${m}분 ${x}초`; };
A.addUnit({ key:'3-1-3', title:'길이와 시간', items:[
  { id:'mm-conv', name:'cm와 mm의 관계', std:'4수03-16', lv:[1,2], t:'both',
    g(){ const c = ri(1, 25), m = ri(1, 9);
      return ri(0, 1) ? N(`${c} cm ${m} mm는 몇 mm일까요?`, c * 10 + m, `1 cm = 10 mm → ${c} cm = ${c * 10} mm → ${c * 10} + ${m} = <b>${c * 10 + m} mm</b>`, [c + m, c * 100 + m, c * 10], 'mm')
        : N(`${c * 10 + m} mm는 몇 cm 몇 mm일까요? <b>cm 부분</b>의 수를 구하세요.`, c, `${c * 10 + m} mm = ${c * 10} mm + ${m} mm = <b>${c} cm</b> ${m} mm`, [c * 10, m, c + 1], 'cm'); } },
  { id:'km-conv', name:'km와 m의 관계', std:'4수03-16', lv:[1,2], t:'both',
    g(){ const k = ri(1, 9), m = pick([ri(1, 9) * 100, ri(10, 99) * 10, ri(1, 99), ri(100, 999)]);
      return ri(0, 1) ? N(`${k} km ${m} m는 몇 m일까요?`, k * 1000 + m, `1 km = 1000 m → ${k} km = ${k * 1000} m → <b>${k * 1000 + m} m</b>`, [k * 100 + m, k + m, k * 1000], 'm')
        : N(`${k * 1000 + m} m는 몇 km 몇 m일까요? <b>m 부분</b>의 수를 구하세요.`, m, `${k * 1000 + m} m = ${k * 1000} m + ${m} m = ${k} km <b>${m} m</b>`, [k, m * 10, k * 1000 + m], 'm'); } },
  { id:'len-unit', name:'알맞은 길이 단위 고르기', std:'4수03-15', lv:[1,2], t:'mc',
    g(){ const c = pick([['엄지손톱의 길이', 'mm', '약 11'], ['필통의 길이', 'cm', '약 21'], ['교실 칠판의 길이', 'm', '약 4'], ['서울에서 부산까지의 거리', 'km', '약 400'], ['개미의 몸길이', 'mm', '약 5'], ['학교에서 은행까지의 거리', 'km', '약 3']]);
      return MC(`${c[0]}${P(c[0], '은', '는')} ${c[2]} □예요. □ 안에 알맞은 단위는?`, [c[1], ...['mm', 'cm', 'm', 'km'].filter(x => x !== c[1])], `${c[0]}에는 <b>${c[1]}</b>가 알맞아요. 아주 짧은 길이는 mm, 먼 거리는 km를 써요.`); } },
  { id:'len-cmp', name:'길이 비교하기', std:'4수03-16', lv:[2,3], t:'mc',
    g(){ const base = ri(12, 18), vals = shuffle([[base * 10 + ri(1, 9), 'mm'], [base * 10 + ri(1, 9), 'cmmm'], [base * 10 + ri(1, 9), 'cmmm']]);
      if (new Set(vals.map(v => v[0])).size < 3) return this.g();
      const lab = v => v[1] === 'mm' ? `${v[0]} mm` : `${Math.floor(v[0] / 10)} cm ${v[0] % 10} mm`, mx = vals.slice().sort((a, b) => b[0] - a[0])[0];
      return MC(`가장 긴 길이는? (${vals.map(lab).join(', ')})`, [lab(mx), ...vals.filter(v => v !== mx).map(lab)], `모두 mm로 바꾸면 ${vals.map(v => `${v[0]} mm`).join(', ')} → <b>${lab(mx)}</b>`); } },
  { id:'len-add', name:'길이의 덧셈과 뺄셈', std:'4수03-16', lv:[3,4], t:'both',
    g(){ const a = ri(1200, 4800), b = ri(600, 3800);
      return ri(0, 1) ? N(`집에서 시장까지 ${Math.floor(a / 1000)} km ${a % 1000} m, 시장에서 학교까지 ${Math.floor(b / 1000) ? Math.floor(b / 1000) + ' km ' : ''}${b % 1000} m예요. 집에서 시장을 지나 학교까지는 모두 몇 m일까요?`, a + b, `m로 바꾸어 더하면 ${a} + ${b} = <b>${a + b} m</b> (= ${Math.floor((a + b) / 1000)} km ${(a + b) % 1000} m)`, [a + b - 1000, a - b > 0 ? a - b : a + 1, a + b + 100], 'm')
        : N(`길이가 ${Math.floor((a % 300 + 100) / 10)} cm ${(a % 300 + 100) % 10} mm인 색연필과 ${Math.floor((b % 200 + 50) / 10)} cm ${(b % 200 + 50) % 10} mm인 지우개를 이어 놓으면 모두 몇 mm일까요?`, (a % 300 + 100) + (b % 200 + 50), `mm로 바꾸어 더하면 ${a % 300 + 100} + ${b % 200 + 50} = <b>${(a % 300 + 100) + (b % 200 + 50)} mm</b>`, [(a % 300 + 100) - (b % 200 + 50), (a % 300 + 100) + (b % 200 + 50) + 10], 'mm'); } },
  { id:'sec-conv', name:'분과 초의 관계', std:'4수03-13', lv:[1,2], t:'both',
    g(){ const m = ri(1, 5), s = ri(1, 59);
      return ri(0, 1) ? N(`${m}분 ${s}초는 몇 초일까요?`, m * 60 + s, `1분 = 60초 → ${m}분 = ${m * 60}초 → ${m * 60} + ${s} = <b>${m * 60 + s}초</b>`, [m * 100 + s, m + s, m * 60], '초')
        : N(`${m * 60 + s}초는 몇 분 몇 초일까요? <b>초 부분</b>의 수를 구하세요.`, s, `${m * 60 + s}초 = ${m * 60}초 + ${s}초 = ${m}분 <b>${s}초</b>`, [m, m * 60 + s - 100 > 0 ? m * 60 + s - 100 : s + 10, s + 60], '초'); } },
  { id:'clock-read', name:'초 단위까지 시각 읽기', std:'4수03-13', lv:[1,1], t:'mc',
    g(){ const h = ri(1, 11), m = ri(1, 11) * 5, s = ri(1, 11) * 5;
      return MC(`시계의 시각이 ${h}시 ${m}분이고 초바늘이 숫자 ${s / 5}${P(s / 5, '을', '를')} 가리켜요. 몇 시 몇 분 몇 초일까요?`, [`${h}시 ${m}분 ${s}초`, `${h}시 ${m}분 ${s / 5}초`, `${h}시 ${s}분 ${m}초`, `${h}시 ${m}분 ${s === 55 ? s - 5 : s + 5}초`], `초바늘이 숫자 1을 가리키면 5초, ${s / 5}${P(s / 5, '을', '를')} 가리키면 ${s}초 → <b>${h}시 ${m}분 ${s}초</b>`, { fig: clockFig(h, m) }); } },
  { id:'time-add', name:'시간의 덧셈', std:'4수03-14', lv:[2,3], t:'mc',
    g(){ const t0 = ri(1, 8) * 3600 + ri(0, 59) * 60 + ri(0, 59), d = ri(0, 2) * 3600 + ri(1, 59) * 60 + ri(1, 59), r = t0 + d;
      return MC(`${hms(t0)}에서 ${dur(d)} 후의 시각은?`, [hms(r), hms(r + 60), hms(r - 60 > t0 ? r - 60 : r + 120), hms(r + 3600)], `초는 초끼리, 분은 분끼리 더하고 60이 넘으면 받아올림해요 → <b>${hms(r)}</b>`); } },
  { id:'time-sub', name:'시간의 뺄셈', std:'4수03-14', lv:[2,3], t:'mc',
    g(){ const t0 = ri(4, 11) * 3600 + ri(0, 59) * 60 + ri(0, 59), d = ri(0, 3) * 3600 + ri(1, 59) * 60 + ri(1, 59), r = t0 - d;
      return MC(`${hms(t0)}에서 ${dur(d)} 전의 시각은?`, [hms(r), hms(r + 60), hms(r - 60), hms(r + 3600)], `초끼리 뺄 수 없으면 1분 = 60초를 받아내려요 → <b>${hms(r)}</b>`); } },
  { id:'time-dur', name:'걸린 시간 구하기', std:'4수03-14', lv:[3,4], t:'mc',
    g(){ const s0 = ri(1, 10) * 3600 + ri(0, 59) * 60 + ri(0, 59), d = ri(1, 59) * 60 + ri(1, 59), e = s0 + d, nm = pick(NAMES);
      return MC(`${josa(nm, '이', '가')} ${hms(s0)}에 그림을 그리기 시작해서 ${hms(e)}에 끝냈어요. 그림을 그리는 데 걸린 시간은?`, [dur(d), dur(d + 60), dur(Math.max(61, d - 60)), dur(d + 3600)], `(끝난 시각) - (시작한 시각) = <b>${dur(d)}</b>`); } },
  { id:'sec-word', name:'초 단위 생활 문제', std:'4수03-13', lv:[3,4], t:'both',
    g(){ const p = shuffle(NAMES).slice(0, 2), a = ri(90, 200), b = ri(90, 200);
      if (a === b) return this.g();
      return N(`${p[0]}${P(p[0], '은', '는')} 양치질을 ${ms(a)} 동안, ${p[1]}${P(p[1], '은', '는')} ${b}초 동안 했어요. 두 사람이 양치질을 한 시간의 차는 몇 초일까요?`, Math.abs(a - b), `${ms(a)} = ${a}초 → ${Math.max(a, b)} - ${Math.min(a, b)} = <b>${Math.abs(a - b)}초</b>`, [a + b, Math.abs(a - b) + 60, Math.abs(Math.floor(a / 60) * 100 + a % 60 - b)], '초'); } },
  { id:'time-start', name:'끝난 시각과 걸린 시간으로 시작한 시각 구하기', std:'4수03-14', lv:[4,5], t:'mc',
    g(){ const e = ri(5, 11) * 3600 + ri(0, 59) * 60 + ri(0, 59), d = ri(1, 2) * 3600 + ri(1, 59) * 60 + ri(1, 59), s0 = e - d;
      return MC(`영화가 ${hms(e)}에 끝났어요. 영화 상영 시간이 ${dur(d)}이라면 영화가 시작한 시각은?`, [hms(s0), hms(e + d), hms(s0 + 60), hms(s0 - 60)], `(끝난 시각) - (걸린 시간) = ${hms(e)} - ${dur(d)} = <b>${hms(s0)}</b>`); } }
]});

/* ─────────────── 4. 나눗셈 ─────────────── */
A.addUnit({ key:'3-1-4', title:'나눗셈', items:[
  { id:'dv-share', name:'똑같이 나누기', std:'4수01-05', lv:[1,1], t:'both',
    g(){ const b = ri(2, 9), q = ri(2, 9), it = pick(['사탕', '쿠키', '연필', '구슬']);
      return N(`${it} ${b * q}개를 ${b}명에게 똑같이 나누어 주면 한 명에게 몇 개씩 줄 수 있을까요?`, q, `${b * q} ÷ ${b} = <b>${q}개</b>`, [b, q + 1, b * q - b], '개'); } },
  { id:'dv-group', name:'똑같이 묶어 덜어 내기', std:'4수01-05', lv:[1,2], t:'both',
    g(){ const b = ri(2, 9), q = ri(2, 9);
      return N(`딸기 ${b * q}개를 한 접시에 ${b}개씩 담으면 접시는 몇 개 필요할까요?`, q, `${b * q}에서 ${b}씩 ${q}번 덜어 낼 수 있어요 → ${b * q} ÷ ${b} = <b>${q}개</b>`, [b, q + 1, q - 1], '개'); } },
  { id:'dv-rel', name:'곱셈과 나눗셈의 관계', std:'4수01-05', lv:[2,2], t:'mc',
    g(){ const a = ri(2, 9); let b = ri(2, 9); if (a === b) b = a % 9 + 2 > 9 ? 2 : a % 9 + 2; const c = a * b;
      return MC(`곱셈식 ${a} × ${b} = ${c}${P(c, '을', '를')} 나눗셈식 2개로 바르게 나타낸 것은?`, [`${c} ÷ ${a} = ${b}, ${c} ÷ ${b} = ${a}`, `${c} ÷ ${a} = ${a}, ${c} ÷ ${b} = ${b}`, `${a} ÷ ${b} = ${c}, ${b} ÷ ${a} = ${c}`, `${c} ÷ ${a} = ${b}, ${b} ÷ ${a} = ${c}`], `곱셈식의 곱(${c})을 두 수 중 하나로 나누면 다른 수가 돼요.`); } },
  { id:'dv-fact', name:'나눗셈의 몫을 곱셈구구로 구하기', std:'4수01-05', lv:[1,2], t:'both',
    g(){ const b = ri(2, 9), q = ri(2, 9);
      return N(`${b * q} ÷ ${b}의 몫은?`, q, `${b} × □ = ${b * q}에서 □ = ${q} → 몫은 <b>${q}</b> (${b}단 곱셈구구 이용)`, [q + 1, q - 1, b]); } },
  { id:'dv-missing', name:'□ 안에 알맞은 수 구하기', std:'4수01-05', lv:[2,3], t:'both',
    g(){ const b = ri(2, 9), q = ri(2, 9), t = ri(0, 1);
      return t ? N(`□ ÷ ${b} = ${q}에서 □ 안에 알맞은 수는?`, b * q, `□ = ${b} × ${q} = <b>${b * q}</b>`, [b + q, q, b * q + b])
        : N(`${b * q} ÷ □ = ${q}에서 □ 안에 알맞은 수는?`, b, `${q} × □ = ${b * q} → □ = <b>${b}</b>`, [q === b + 1 ? b + 2 : b + 1, b * q, Math.max(1, b - 1)]); } },
  { id:'dv-cmp', name:'몫의 크기 비교하기', std:'4수01-05', lv:[3,3], t:'mc',
    g(){ const m = () => { const b = ri(2, 9), q = ri(2, 9); return [b * q, b, q]; }, x = m(), y = m(), c = CMP(x[2], y[2]);
      return MC(`몫의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${x[0]} ÷ ${x[1]} ○ ${y[0]} ÷ ${y[1]}`)}`, [c, ...CMPC.filter(z => z !== c)], `${x[0]} ÷ ${x[1]} = ${x[2]}, ${y[0]} ÷ ${y[1]} = ${y[2]} → <b>${c}</b>`); } },
  { id:'dv-word', name:'나눗셈 생활 문제', std:'4수01-05', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const a = ri(3, 9); return N(`네 변의 길이의 합이 ${4 * a} cm인 정사각형의 한 변의 길이는 몇 cm일까요?`, a, `정사각형은 네 변의 길이가 같아요 → ${4 * a} ÷ 4 = <b>${a} cm</b>`, [4 * a, a + 4, 2 * a], 'cm'); }
      if (t === 1){ const r = ri(2, 6), q = ri(3, 9); return N(`학생 ${r * q}명이 한 줄에 ${r}명씩 서면 모두 몇 줄이 될까요?`, q, `${r * q} ÷ ${r} = <b>${q}줄</b>`, [r, q + 1], '줄'); }
      const d = ri(3, 7), q = ri(2, 9); return N(`사탕 ${d * q}개를 하루에 ${d}개씩 먹으면 며칠 동안 먹을 수 있을까요?`, q, `${d * q} ÷ ${d} = <b>${q}일</b>`, [d, q + 1], '일'); } },
  { id:'dv-two', name:'두 단계 나눗셈 문제', std:'4수01-05', lv:[4,5], t:'both',
    g(){ const per = ri(2, 6), box = ri(2, 4), k = ri(2, 6), tot = per * box; if (tot % k) return this.g(); const q = tot / k;
      if (q > 9 || q < 2) return this.g();
      return N(`한 상자에 공책이 ${per}권씩 ${box}상자 있어요. 이 공책을 ${k}명에게 똑같이 나누어 주면 한 명에게 몇 권씩 줄 수 있을까요?`, q, `공책은 모두 ${per} × ${box} = ${tot}권 → ${tot} ÷ ${k} = <b>${q}권</b>`, [tot, per, q + 1], '권'); } }
]});

/* ─────────────── 5. 곱셈 ─────────────── */
A.addUnit({ key:'3-1-5', title:'곱셈', items:[
  { id:'mu-tens', name:'(몇십) × (몇)', std:'4수01-04', lv:[1,1], t:'both',
    g(){ const a = ri(1, 9) * 10, b = ri(2, 9); return N(`${a} × ${b}의 값은?`, a * b, `${a / 10} × ${b} = ${a / 10 * b} → 10배 하면 <b>${a * b}</b>`, [a / 10 * b, a * b + 10, a + b]); } },
  { id:'mu-nc', name:'올림이 없는 (몇십몇) × (몇)', std:'4수01-04', lv:[1,2], t:'both',
    g(){ let a, b; do { a = ri(11, 44); b = ri(2, 4); } while ((a % 10) * b >= 10 || Math.floor(a / 10) * b >= 10); return N(`${a} × ${b}의 값은?`, a * b, `${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b} = ${Math.floor(a / 10) * 10 * b} + ${a % 10 * b} = <b>${a * b}</b>`, [a * b + 10, a + b, a * b - b]); } },
  { id:'mu-c1', name:'십의 자리 또는 일의 자리에서 올림이 있는 (몇십몇) × (몇)', std:'4수01-04', lv:[2,2], t:'both',
    g(){ let a, b; do { a = ri(12, 95); b = ri(2, 9); } while (!(((a % 10) * b >= 10) !== (Math.floor(a / 10) * b >= 10))); return N(`${a} × ${b}의 값은?`, a * b, `일의 자리 ${a % 10} × ${b} = ${a % 10 * b}, 십의 자리 ${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b} → 더하면 <b>${a * b}</b>`, [a * b - 10, a * b + 10, a * b - 100]); } },
  { id:'mu-c2', name:'올림이 두 번 있는 (몇십몇) × (몇)', std:'4수01-04', lv:[2,3], t:'both',
    g(){ let a, b; do { a = ri(23, 99); b = ri(3, 9); } while (!((a % 10) * b >= 10 && Math.floor(a / 10) * b + Math.floor((a % 10) * b / 10) >= 10)); return N(`${a} × ${b}의 값은?`, a * b, `일의 자리에서 올림한 수를 십의 자리 곱에 더해요 → <b>${a * b}</b>`, [a * b - 10 * Math.floor((a % 10) * b / 10), a * b + 10, a * b - 100]); } },
  { id:'mu-word', name:'곱셈 생활 문제', std:'4수01-04', lv:[2,3], t:'both',
    g(){ const a = ri(12, 48), b = ri(3, 9), it = pick([['한 봉지에 젤리가', '봉지', '젤리'], ['한 상자에 클립이', '상자', '클립'], ['한 줄에 의자가', '줄', '의자']]);
      return N(`${it[0]} ${a}개씩 들어 있어요. ${b}${it[1]}에 들어 있는 ${it[2]}${P(it[2], '은', '는')} 모두 몇 개일까요?`, a * b, `${a} × ${b} = <b>${a * b}개</b>`, [a + b, a * b - 10, a * (b + 1)], '개'); } },
  { id:'mu-cmp', name:'곱의 크기 비교하기', std:'4수01-04', lv:[3,3], t:'mc',
    g(){ const x = [ri(12, 60), ri(2, 9)], y = [ri(12, 60), ri(2, 9)], c = CMP(x[0] * x[1], y[0] * y[1]);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${x[0]} × ${x[1]} ○ ${y[0]} × ${y[1]}`)}`, [c, ...CMPC.filter(z => z !== c)], `${x[0]} × ${x[1]} = ${x[0] * x[1]}, ${y[0]} × ${y[1]} = ${y[0] * y[1]} → <b>${c}</b>`); } },
  { id:'mu-est', name:'곱을 어림하기', std:'4수01-08', lv:[3,3], t:'mc',
    g(){ const th = pick([200, 300, 400]); let ok, bads = [], t = 0; do { ok = [ri(30, 99), ri(4, 9)]; } while (ok[0] * ok[1] <= th);
      while (bads.length < 3 && t < 200){ t++; const b = [ri(11, 60), ri(2, 7)]; if (b[0] * b[1] < th && !bads.some(x => x.join() === b.join())) bads.push(b); }
      return MC(`어림하여 계산 결과가 <b>${th}보다 큰</b> 곱셈을 고르세요.`, [ok, ...bads].map(x => `${x[0]} × ${x[1]}`), `${ok[0]}${P(ok[0], '을', '를')} 약 ${Math.round(ok[0] / 10) * 10}${RO(Math.round(ok[0] / 10) * 10)} 어림하면 ${Math.round(ok[0] / 10) * 10} × ${ok[1]} = ${Math.round(ok[0] / 10) * 10 * ok[1]} → ${ok[0]} × ${ok[1]} = ${ok[0] * ok[1]}`); } },
  { id:'mu-missing', name:'□ 안에 알맞은 수 구하기', std:'4수01-04', lv:[3,4], t:'both',
    g(){ const a = ri(12, 49), b = ri(2, 6);
      return N(`□ × ${b} = ${a * b}에서 □ 안에 알맞은 수는?`, a, `${b}${P(b, '과', '와')} 곱해서 ${a * b}${P(a * b, '이', '가')} 되는 수를 찾아요 → □ = <b>${a}</b>`, [a + 1, a * b - b, a - 10]); } },
  { id:'mu-two', name:'곱셈과 뺄셈이 섞인 생활 문제', std:'4수01-04', lv:[4,4], t:'both',
    g(){ const a = ri(12, 36), b = ri(3, 8), e = ri(5, 20);
      return N(`쿠키를 한 봉지에 ${a}개씩 ${b}봉지 만들었어요. 그중 ${e}개를 먹었다면 남은 쿠키는 몇 개일까요?`, a * b - e, `${a} × ${b} = ${a * b}개 → ${a * b} - ${e} = <b>${a * b - e}개</b>`, [a * b, a * b + e, a * (b - 1)], '개'); } },
  { id:'mu-cards', name:'수 카드로 곱이 가장 큰 곱셈식 만들기', std:'4수01-04', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 3); let best = 0, ex = ''; for (const [x, y, z] of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]){ const v = (c[x] * 10 + c[y]) * c[z]; if (v > best){ best = v; ex = `${c[x]}${c[y]} × ${c[z]}`; } }
      return N(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 (두 자리 수) × (한 자리 수)를 만들려고 해요. 곱이 가장 클 때의 곱은?`, best, `가장 큰 수를 곱하는 수로 두고 나머지로 큰 두 자리 수를 만들어요 → ${ex} = <b>${best}</b>`, [best - 10, best - 9 * c[0] > 0 ? best - 9 * c[0] : best + 1, best + 10]); } },
  { id:'mu-wrong', name:'잘못 계산한 식에서 바르게 계산하기', std:'4수01-04', lv:[5,5], t:'both',
    g(){ const k = ri(3, 8), x = ri(11, 40), w = x + k;
      return N(`어떤 수에 ${k}${P(k, '을', '를')} 곱해야 할 것을 잘못하여 더했더니 ${w}${P(w, '이', '가')} 되었어요. 바르게 계산한 값은?`, x * k, `어떤 수 = ${w} - ${k} = ${x} → ${x} × ${k} = <b>${x * k}</b>`, [w * k, x + k, x * k + k]); } }
]});

/* ─────────────── 6. 분수와 소수 ─────────────── */
const barFrac = (n, d, eq = true) => { const W = 240; let s = '', x = 10; const ws = eq ? range(1, d).map(() => W / d) : (() => { const r = range(1, d).map(() => ri(5, 15)), t = r.reduce((a, b) => a + b, 0); return r.map(v => v / t * W); })();
  ws.forEach((w, i) => { s += `<rect x="${x.toFixed(1)}" y="10" width="${w.toFixed(1)}" height="40" fill="${i < n ? '#FFC56B' : '#fff'}" stroke="#22314A" stroke-width="2"/>`; x += w; });
  return svg(W + 20, 60, s); };
const decBar = (tenths) => { let s = ''; const k = Math.ceil(tenths / 10); for (let r = 0; r < Math.max(1, k); r++) for (let i = 0; i < 10; i++){ const idx = r * 10 + i; s += `<rect x="${10 + i * 24}" y="${10 + r * 34}" width="24" height="28" fill="${idx < tenths ? '#8EC5F4' : '#fff'}" stroke="#22314A" stroke-width="1.4"/>`; }
  return svg(260, 20 + Math.max(1, k) * 34, s); };
A.addUnit({ key:'3-1-6', title:'분수와 소수', items:[
  { id:'fr-equal', name:'똑같이 나눈 도형 찾기', std:'4수01-09', lv:[1,1], t:'mc',
    g(){ const d = ri(3, 6), ok = barFrac(0, d, true), bad = []; let t = 0; while (bad.length < 3 && t < 30){ t++; const b = barFrac(0, d, false); if (!bad.includes(b)) bad.push(b); }
      return MC(`전체를 <b>똑같이 ${d}</b>으로 나눈 것은?`, [ok, ...bad], '나누어진 조각의 모양과 크기가 모두 같아야 "똑같이 나누었다"고 해요.'); } },
  { id:'fr-read', name:'색칠한 부분을 분수로 나타내기', std:'4수01-09', lv:[1,2], t:'both',
    g(){ const [n, d] = coprime(3, 10);
      return Q('전체에 대하여 색칠한 부분은 얼마인지 분수로 나타내면?', F(n, d), `전체를 똑같이 ${d}${RO(d)} 나눈 것 중의 ${n} → <b>${fr(n, d)}</b> (${d}분의 ${n})`, [F(d - n || 1, d), F(n, d + 1), F(d, n * 3)], '', { fig: barFrac(n, d) }); } },
  { id:'fr-rest', name:'남은 부분을 분수로 나타내기', std:'4수01-09', lv:[2,2], t:'both',
    g(){ let n, d; do { [n, d] = coprime(4, 10); } while (gcd(d - n, d) !== 1);
      return Q(`피자를 똑같이 ${d}조각으로 나누어 ${n}조각을 먹었어요. 남은 피자는 전체의 얼마인지 분수로 나타내면?`, F(d - n, d), `남은 조각은 ${d} - ${n} = ${d - n}조각 → <b>${fr(d - n, d)}</b>`, [F(n, d), F(d - n, d + 1)]); } },
  { id:'unit-cmp', name:'단위분수의 크기 비교', std:'4수01-11', lv:[2,3], t:'mc',
    g(){ const a = ri(2, 12); let b = ri(2, 12); if (a === b) b = a + 1; const c = CMP(1 / a, 1 / b);
      return MC(`분수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(1, a)} ○ ${fr(1, b)}`)}`, [c, ...CMPC.filter(z => z !== c)], `단위분수는 <b>분모가 작을수록 커요</b>. (똑같이 적게 나눌수록 한 조각이 커요) → <b>${c}</b>`); } },
  { id:'same-cmp', name:'분모가 같은 분수의 크기 비교', std:'4수01-11', lv:[2,2], t:'mc',
    g(){ const d = ri(4, 12), a = ri(1, d - 1); let b = ri(1, d - 1); if (a === b) b = a === 1 ? 2 : a - 1; const c = CMP(a, b);
      return MC(`분수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(a, d)} ○ ${fr(b, d)}`)}`, [c, ...CMPC.filter(z => z !== c)], `분모가 같으면 <b>분자가 클수록 커요</b> → <b>${c}</b>`); } },
  { id:'fr-order', name:'가장 큰(작은) 분수 찾기', std:'4수01-11', lv:[3,4], t:'mc',
    g(){ const big = ri(0, 1); if (ri(0, 1)){ const ds = shuffle(range(2, 12)).slice(0, 4), t = big ? Math.min(...ds) : Math.max(...ds);
        return MC(`가장 ${big ? '큰' : '작은'} 분수는?`, [fr(1, t), ...ds.filter(x => x !== t).map(x => fr(1, x))], `단위분수는 분모가 ${big ? '작을' : '클'}수록 ${big ? '커요' : '작아요'} → <b>${fr(1, t)}</b>`); }
      const d = ri(6, 12), ns = shuffle(range(1, d - 1)).slice(0, 4), t = big ? Math.max(...ns) : Math.min(...ns);
      return MC(`가장 ${big ? '큰' : '작은'} 분수는?`, [fr(t, d), ...ns.filter(x => x !== t).map(x => fr(x, d))], `분모가 같으면 분자가 ${big ? '클' : '작을'}수록 ${big ? '커요' : '작아요'} → <b>${fr(t, d)}</b>`); } },
  { id:'unit-range', name:'조건에 맞는 단위분수의 수', std:'4수01-11', lv:[4,5], t:'both',
    g(){ const a = ri(2, 4), b = a + ri(3, 6), v = b - a - 1;
      return N(`${fr(1, b)}보다 크고 ${fr(1, a)}보다 작은 단위분수는 모두 몇 개일까요?`, v, `분모가 ${a}보다 크고 ${b}보다 작은 단위분수: ${range(a + 1, b - 1).map(x => fr(1, x)).join(', ')} → <b>${v}개</b>`, [v + 1, v + 2, b - a + 1], '개'); } },
  { id:'dec-read', name:'소수 한 자리 수 알기', std:'4수01-12', lv:[1,1], t:'both',
    g(){ const n = ri(1, 9); return ri(0, 1) ? N(`${fr(1, 10)}이 ${n}개이면 소수로 얼마일까요?`, n / 10, `${fr(1, 10)} = 0.1 → 0.1이 ${n}개이면 <b>0.${n}</b>`, [n, n / 100, n + 0.1])
      : N(`색칠한 부분은 전체의 얼마인지 소수로 나타내면?`, n / 10, `똑같이 10칸으로 나눈 것 중 ${n}칸 → ${fr(n, 10)} = <b>0.${n}</b>`, [n, n / 100, (10 - n) / 10], '', { fig: decBar(n) }); } },
  { id:'dec-count', name:'0.1이 몇 개인지 알기', std:'4수01-12', lv:[2,3], t:'both',
    g(){ const w = ri(1, 9), t = ri(1, 9), x = dz(w + t / 10);
      return ri(0, 1) ? N(`${nf(x)}${P(nf(x), '은', '는')} 0.1이 몇 개인 수일까요?`, w * 10 + t, `${w}${P(w, '은', '는')} 0.1이 ${w * 10}개, 0.${t}${P(t, '은', '는')} 0.1이 ${t}개 → <b>${w * 10 + t}개</b>`, [w + t, w * 100 + t, w * 10], '개')
        : N(`0.1이 ${w * 10 + t}개인 수는?`, x, `0.1이 10개이면 1 → 0.1이 ${w * 10 + t}개이면 <b>${nf(x)}</b>`, [w * 10 + t, x * 10, dz(t + w / 10)]); } },
  { id:'dec-mm', name:'길이를 소수로 나타내기', std:'4수01-12', lv:[2,3], t:'both',
    g(){ const c = ri(1, 15), m = ri(1, 9);
      return N(`${c} cm ${m} mm는 몇 cm인지 소수로 나타내면?`, dz(c + m / 10), `1 mm = 0.1 cm → ${m} mm = 0.${m} cm → <b>${nf(dz(c + m / 10))} cm</b>`, [c * 10 + m, dz(m + c / 10), dz(c + m / 100)], 'cm'); } },
  { id:'dec-cmp', name:'소수의 크기 비교', std:'4수01-14', lv:[2,3], t:'mc',
    g(){ const a = dz(ri(1, 99) / 10); let b = dz(ri(1, 99) / 10); if (a === b) b = dz(a + 0.1); const c = CMP(a, b);
      return MC(`소수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${nf(a)} ○ ${nf(b)}`)}`, [c, ...CMPC.filter(z => z !== c)], `자연수 부분을 먼저 비교하고, 같으면 소수 부분을 비교해요 → <b>${c}</b>`); } },
  { id:'dec-digit', name:'□ 안에 들어갈 수 있는 수', std:'4수01-14', lv:[4,5], t:'both',
    g(){ const w = ri(2, 8), t = ri(2, 8), big = ri(0, 1);
      return big ? N(`${w}.□ &gt; ${w}.${t}에서 □ 안에 들어갈 수 있는 수 중 가장 작은 수는?`, t + 1, `자연수 부분이 같으므로 소수 부분을 비교해요: □ &gt; ${t} → 가장 작은 수 <b>${t + 1}</b>`, [t, t + 2, 9])
        : N(`□.${t} &lt; ${w}.${t}에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?`, w - 1, `소수 부분이 같으므로 □ &lt; ${w} → 1부터 ${w - 1}까지 <b>${w - 1}개</b>`, [w, w - 2 || w + 1, w + 1], '개'); } }
]});
})();
