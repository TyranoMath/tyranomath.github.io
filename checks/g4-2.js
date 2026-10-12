/* =========================================================
   4학년 2학기 문제 만들기 — 수학익힘 4-2(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   단원: 1 삼각형 · 2 분수의 덧셈과 뺄셈 · 3 사각형 · 4 소수의 덧셈과 뺄셈 · 5 다각형 · 6 꺾은선그래프
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, gcd, range, dz, nf, josa, F, toF, frH, fr, svg, txt, line, tableH } = A;
const P = (w, a, b) => josa(w, a, b).slice(String(w).length);
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
const INK = '#22314A';
const POLY = ['', '', '', '삼각형', '사각형', '오각형', '육각형', '칠각형', '팔각형', '구각형', '십각형', '십일각형', '십이각형'];

/* ─────────────── 1. 삼각형 ─────────────── */
const triFig = (a, b, c, labs) => { // 세 변의 길이로 삼각형 그리기
  const sc = 150 / Math.max(a, b, c), A1 = [20, 150], B1 = [20 + c * sc, 150], x = (b * b - a * a + c * c) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x)), C1 = [20 + x * sc, 150 - y * sc];
  const pts = [A1, B1, C1], mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let s = `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="#EEF6FF" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
  const M = [mid(B1, C1), mid(A1, C1), mid(A1, B1)], off = [[14, 0], [-16, 0], [0, 14]];
  labs.forEach((l, i) => { if (l) s += txt(M[i][0] + off[i][0], M[i][1] + off[i][1], l, { size: 14, bold: true, fill: '#2a6fae' }); });
  const minY = Math.min(...pts.map(p => p[1]));
  const top = Math.min(0, minY - 12), H = 172 - top;
  return svg(Math.max(...pts.map(p => p[0])) + 40, H, s).replace(`viewBox="0 0 ${Math.max(...pts.map(p => p[0])) + 40} ${H}"`, `viewBox="0 ${top} ${Math.max(...pts.map(p => p[0])) + 40} ${H}"`); };
A.addUnit({ key:'4-2-1', title:'삼각형', items:[
  { id:'is-def', name:'이등변삼각형과 정삼각형 알기', std:'4수03-08', lv:[1,1], t:'mc',
    g(){ const t = ri(0, 2), Q0 = [['두 변의 길이가 같은 삼각형', '이등변삼각형'], ['세 변의 길이가 같은 삼각형', '정삼각형'], ['한 각이 둔각인 삼각형', '둔각삼각형']][t];
      return MC(`<b>${Q0[0]}</b>을 무엇이라고 할까요?`, [Q0[1], ...['이등변삼각형', '정삼각형', '직각삼각형', '둔각삼각형', '예각삼각형'].filter(x => x !== Q0[1]).slice(0, 3)], `${Q0[0]} → <b>${Q0[1]}</b>`); } },
  { id:'is-side', name:'이등변삼각형의 변의 길이', std:'4수03-08', lv:[1,2], t:'both',
    g(){ const a = ri(5, 15), b = ri(Math.ceil(a / 2) + 1, 18); if (a === b) return this.g(); const t = ri(0, 1), per = 2 * b + a;
      return t ? N(`이등변삼각형의 세 변의 길이의 합이 ${per} cm이고, 길이가 다른 한 변이 ${a} cm예요. 길이가 같은 한 변은 몇 cm일까요?`, b, `(${per} - ${a}) ÷ 2 = <b>${b} cm</b>`, [per - a, a, b + 1], 'cm', { fig: triFig(b, b, a, ['?', '', `${a} cm`]) })
        : N(`두 변의 길이가 각각 ${b} cm인 이등변삼각형의 나머지 한 변이 ${a} cm예요. 세 변의 길이의 합은 몇 cm일까요?`, per, `${b} + ${b} + ${a} = <b>${per} cm</b>`, [2 * a + b, a + b, per + 1], 'cm', { fig: triFig(b, b, a, [`${b} cm`, `${b} cm`, `${a} cm`]) }); } },
  { id:'is-angle', name:'이등변삼각형의 각', std:'4수03-08', lv:[2,3], t:'both',
    g(){ const t = ri(0, 1);
      if (t === 0){ const base = ri(25, 80); return N(`이등변삼각형에서 크기가 같은 두 각 중 한 각이 ${base}°예요. 나머지 한 각은 몇 도일까요?`, 180 - 2 * base, `두 각이 ${base}°로 같으므로 180° - ${base}° - ${base}° = <b>${180 - 2 * base}°</b>`, [180 - base, base, 90 - base > 0 ? 90 - base : base + 10], '°'); }
      const top = ri(10, 70) * 2; return N(`이등변삼각형에서 길이가 같은 두 변 사이의 각이 ${top}°예요. 나머지 두 각 중 한 각은 몇 도일까요?`, (180 - top) / 2, `나머지 두 각의 크기가 같으므로 (180° - ${top}°) ÷ 2 = <b>${(180 - top) / 2}°</b>`, [180 - top, top, (180 - top) / 2 + 10], '°'); } },
  { id:'eq-angle', name:'정삼각형의 성질', std:'4수03-08', lv:[1,2], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0) return N(`정삼각형의 한 각의 크기는 몇 도일까요?`, 60, `세 각의 크기가 모두 같으므로 180° ÷ 3 = <b>60°</b>`, [90, 45, 180], '°');
      const a = ri(4, 25); return t === 1 ? N(`한 변이 ${a} cm인 정삼각형의 세 변의 길이의 합은 몇 cm일까요?`, 3 * a, `${a} × 3 = <b>${3 * a} cm</b>`, [2 * a, 4 * a, a + 3], 'cm') : N(`세 변의 길이의 합이 ${3 * a} cm인 정삼각형의 한 변은 몇 cm일까요?`, a, `${3 * a} ÷ 3 = <b>${a} cm</b>`, [3 * a, a * 2, a + 3], 'cm'); } },
  { id:'tri-kind', name:'예각·직각·둔각삼각형', std:'4수03-09', lv:[1,2], t:'mc',
    g(L){ const k = ri(0, 2); let a, b, c; do { a = ri(20, 100); b = ri(20, 100); c = 180 - a - b; } while (c < 15 || (k === 0 && Math.max(a, b, c) >= 90) || (k === 1 && Math.max(a, b, c) !== 90) || (k === 2 && Math.max(a, b, c) <= 90));
      if (k === 1){ a = 90; b = ri(20, 70); c = 90 - b; }
      const nm = ['예각삼각형', '직각삼각형', '둔각삼각형'][k], show = L > 1 ? `두 각이 ${a}°, ${b}°인 삼각형` : `세 각이 ${a}°, ${b}°, ${c}°인 삼각형`;
      return MC(`<b>${show}</b>은 어떤 삼각형일까요?`, [nm, ...['예각삼각형', '직각삼각형', '둔각삼각형'].filter(x => x !== nm)], `${L > 1 ? `나머지 한 각 = 180° - ${a}° - ${b}° = ${c}° → ` : ''}${k === 0 ? '세 각이 모두 예각' : k === 1 ? '한 각이 직각' : '한 각이 둔각'} → <b>${nm}</b>`); } },
  { id:'tri-two', name:'두 가지 기준으로 분류하기', std:'4수03-09', lv:[3,3], t:'mc',
    g(){ const t = ri(0, 3), Q0 = [[[30, 120, 30], '이등변삼각형이면서 둔각삼각형'], [[60, 60, 60], '정삼각형이면서 예각삼각형'], [[45, 90, 45], '이등변삼각형이면서 직각삼각형'], [[40, 50, 90], '직각삼각형이지만 이등변삼각형은 아님']][t];
      const v = t === 0 ? (() => { const b = ri(10, 40); return [b, 180 - 2 * b, b]; })() : t === 3 ? (() => { const b = ri(20, 40); return [b, 90 - b, 90]; })() : Q0[0];
      return MC(`세 각의 크기가 ${v.join('°, ')}°인 삼각형을 바르게 설명한 것은?`, [Q0[1], ...['이등변삼각형이면서 둔각삼각형', '정삼각형이면서 예각삼각형', '이등변삼각형이면서 직각삼각형', '직각삼각형이지만 이등변삼각형은 아님', '이등변삼각형이면서 예각삼각형'].filter(x => x !== Q0[1]).slice(0, 3)], `두 각이 같으면 이등변삼각형, 세 각이 같으면 정삼각형이고, 가장 큰 각으로 예각·직각·둔각삼각형을 나눠요 → <b>${Q0[1]}</b>`); } },
  { id:'tri-can', name:'그릴 수 없는 삼각형', std:'4수03-09', lv:[3,4], t:'mc',
    g(){ const ok = pick(['정삼각형이면서 둔각삼각형', '정삼각형이면서 직각삼각형', '둔각이 두 개인 삼각형', '직각이 두 개인 삼각형']);
      return MC(`그릴 수 <b>없는</b> 삼각형은?`, [ok, '이등변삼각형이면서 둔각삼각형', '이등변삼각형이면서 직각삼각형', '직각삼각형이면서 이등변삼각형이 아닌 삼각형', '예각삼각형이면서 정삼각형'].filter((x, i, a) => a.indexOf(x) === i).slice(0, 4), `정삼각형의 세 각은 모두 60°(예각)이고, 삼각형의 세 각의 합이 180°이므로 직각이나 둔각은 하나만 있을 수 있어요 → <b>${ok}</b>`); } },
  { id:'is-ext', name:'이등변삼각형의 바깥쪽 각', std:'4수03-08', lv:[4,4], t:'both',
    g(){ const base = ri(25, 75), ext = 180 - base; return N(`이등변삼각형의 크기가 같은 두 각 중 한 각이 ${base}°예요. 이 각의 <b>바깥쪽</b>(일직선이 되도록 늘인 변과 이루는 각)은 몇 도일까요?`, ext, `일직선은 180° → 180° - ${base}° = <b>${ext}°</b>`, [180 - 2 * base, base, 90 + base], '°'); } },
  { id:'is-wire', name:'철사로 삼각형 만들기', std:'4수03-08', lv:[4,5], t:'both',
    g(){ const t = ri(0, 1);
      if (t){ const e = ri(4, 9), b = ri(5, 12), c = ri(3, 2 * b - 1), T = 3 * e + 2 * b + c;
        return N(`길이가 ${T} cm인 철사를 겹치지 않게 모두 사용하여 한 변이 ${e} cm인 정삼각형 1개와, 길이가 같은 두 변이 ${b} cm인 이등변삼각형 1개를 만들었어요. 이등변삼각형의 나머지 한 변은 몇 cm일까요?`, c, `정삼각형에 ${e} × 3 = ${3 * e} cm, 남은 철사 ${T - 3 * e} cm → ${T - 3 * e} - ${b} - ${b} = <b>${c} cm</b>`, [T - 3 * e - b, b, c + e], 'cm'); }
      let a, b; do { a = ri(5, 16); b = ri(Math.ceil(a / 2) + 1, 18); } while ((a + 2 * b) % 3 || a === b); const L = a + 2 * b;
      return N(`길이가 같은 두 변이 ${b} cm이고 나머지 한 변이 ${a} cm인 이등변삼각형을 철사로 만들었어요. 이 철사를 다시 펴서 모두 사용하여 정삼각형을 만들면 한 변은 몇 cm일까요?`, L / 3, `철사 길이 = ${b} + ${b} + ${a} = ${L} cm → ${L} ÷ 3 = <b>${L / 3} cm</b>`, [L, b, a, L / 3 + 1], 'cm'); } },
  { id:'eq-chain', name:'정삼각형을 이어 붙인 도형의 둘레', std:'4수03-08', lv:[4,5], t:'both',
    g(){ const a = ri(3, 9), n = ri(3, 7), per = (n + 2) * a;
      return N(`한 변이 ${a} cm인 정삼각형 ${n}개를 변끼리 맞닿게 한 줄로 번갈아 이어 붙였어요. 만든 도형의 둘레는 몇 cm일까요?`, per, `둘레에는 정삼각형의 변이 (${n} + 2)개 → ${a} × ${n + 2} = <b>${per} cm</b>`, [3 * n * a, (n + 1) * a, per + a], 'cm', { fig: svg(30 + (n + 1) * 22, 50, range(0, n - 1).map(i => { const x = 10 + i * 22, up = i % 2 === 0; return `<polygon points="${up ? `${x},42 ${x + 44},42 ${x + 22},6` : `${x},6 ${x + 44},6 ${x + 22},42`}" fill="${i % 2 ? '#FFE7A8' : '#DFF5E1'}" stroke="${INK}" stroke-width="1.8"/>`; }).join('')) }); } }
]});

/* ─────────────── 2. 분수의 덧셈과 뺄셈 ─────────────── */
// 결과가 기약분수가 되도록 (4학년은 약분을 배우지 않아요)
const D = () => pick([5, 7, 9, 11, 13, 8, 6, 10, 12]);
const ok1 = (n, d) => gcd(n % d || d, d) === 1 && n % d !== 0;
const MX = (n, d) => n >= d ? fr(n % d, d, Math.floor(n / d)) : fr(n, d);
A.addUnit({ key:'4-2-2', title:'분수의 덧셈과 뺄셈', items:[
  { id:'fa-proper', name:'진분수의 덧셈 (합이 1보다 작음)', std:'4수01-15', lv:[1,1], t:'both',
    g(){ const d = D(), a = ri(1, d - 2), b = ri(1, d - 1 - a); if (!ok1(a + b, d)) return this.g();
      return Q(`${fr(a, d)} + ${fr(b, d)}의 값은?`, F(a + b, d), `분모는 그대로, 분자끼리 더해요: ${fr(a, d)} + ${fr(b, d)} = ${fr(`${a} + ${b}`, d)} = <b>${fr(a + b, d)}</b>`, [F(a + b, 2 * d), F(a * b, d), F(a + b + 1, d)].filter(f => f.n < f.d * 3)); } },
  { id:'fs-proper', name:'진분수의 뺄셈', std:'4수01-15', lv:[1,1], t:'both',
    g(){ const d = D(), a = ri(2, d - 1), b = ri(1, a - 1); if (!ok1(a - b, d)) return this.g();
      return Q(`${fr(a, d)} - ${fr(b, d)}의 값은?`, F(a - b, d), `분자끼리 빼요: ${fr(`${a} - ${b}`, d)} = <b>${fr(a - b, d)}</b>`, [F(a + b, d), F(a - b + 1, d)]); } },
  { id:'fa-over', name:'진분수의 덧셈 (합이 1보다 큼)', std:'4수01-15', lv:[2,2], t:'both',
    g(){ const d = D(), a = ri(2, d - 1), b = ri(d - a + 1, d - 1); if (!ok1(a + b, d)) return this.g();
      return Q(`${fr(a, d)} + ${fr(b, d)}의 값을 대분수로 나타내면?`, F(a + b, d), `${fr(a + b, d)} = <b>${MX(a + b, d)}</b> (가분수는 대분수로 바꾸어 나타내요)`, [F(a + b - d, d), F(a + b, 2 * d), F(a + b + d, d)]); } },
  { id:'fa-mixed', name:'대분수의 덧셈', std:'4수01-15', lv:[2,3], t:'both',
    g(L){ const d = D(), w1 = ri(1, 4), w2 = ri(1, 3), a = ri(1, d - 1), b = L > 2 ? ri(d - a, d - 1) : ri(1, d - 1 - a || 1); if (a + b === d || !ok1(w1 * d + a + w2 * d + b, d) || (L <= 2 && a + b > d)) return this.g();
      const tot = (w1 + w2) * d + a + b;
      return Q(`${fr(a, d, w1)} + ${fr(b, d, w2)}의 값은?`, F(tot, d), `자연수끼리 ${w1} + ${w2} = ${w1 + w2}, 분수끼리 ${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}${a + b > d ? ` = ${MX(a + b, d)}` : ''} → <b>${MX(tot, d)}</b>`, [F(tot - d, d), F(tot + d, d), F((w1 + w2) * d + Math.abs(a - b), d)]); } },
  { id:'fs-mixed', name:'대분수의 뺄셈', std:'4수01-15', lv:[2,2], t:'both',
    g(){ const d = D(), w1 = ri(3, 6), w2 = ri(1, w1 - 1), a = ri(2, d - 1), b = ri(1, a - 1), tot = (w1 - w2) * d + a - b; if (!ok1(tot, d)) return this.g();
      return Q(`${fr(a, d, w1)} - ${fr(b, d, w2)}의 값은?`, F(tot, d), `자연수끼리 ${w1} - ${w2} = ${w1 - w2}, 분수끼리 ${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)} → <b>${MX(tot, d)}</b>`, [F(tot + d, d), F((w1 - w2) * d + a + b, d), F(tot - d > 0 ? tot - d : tot + 1, d)]); } },
  { id:'fs-nat', name:'(자연수) - (분수)', std:'4수01-15', lv:[3,3], t:'both',
    g(){ const d = D(), n = ri(2, 6), w = ri(0, n - 1), b = ri(1, d - 1), tot = (n - w) * d - b; if (!ok1(tot, d)) return this.g();
      return Q(`${n} - ${w ? fr(b, d, w) : fr(b, d)}의 값은?`, F(tot, d), `${n}에서 1만큼을 ${fr(d, d)}로 바꾸어요: ${n} = ${fr(d, d, n - 1)} → ${fr(d, d, n - 1)} - ${w ? fr(b, d, w) : fr(b, d)} = <b>${MX(tot, d)}</b>`, [F(tot + d, d), F((n - w) * d + b - 2 * d > 0 ? (n - w - 1) * d + b : tot + 1, d), F(tot - 1 > 0 ? tot - 1 : tot + 2, d)]); } },
  { id:'fs-borrow', name:'받아내림이 있는 대분수의 뺄셈', std:'4수01-15', lv:[3,4], t:'both',
    g(){ const d = D(), w1 = ri(3, 7), w2 = ri(1, w1 - 1), a = ri(1, d - 2), b = ri(a + 1, d - 1), tot = (w1 - w2) * d + a - b; if (!ok1(tot, d)) return this.g();
      return Q(`${fr(a, d, w1)} - ${fr(b, d, w2)}의 값은?`, F(tot, d), `분수끼리 뺄 수 없으므로 ${fr(a, d, w1)} = ${fr(a + d, d, w1 - 1)}로 바꾸어요 → ${w1 - 1} - ${w2} = ${w1 - 1 - w2}, ${fr(a + d, d)} - ${fr(b, d)} = ${fr(a + d - b, d)} → <b>${MX(tot, d)}</b>`, [F((w1 - w2) * d + b - a, d), F(tot + d, d), F((w1 * d + a) + (w2 * d + b), d)]); } },
  { id:'fr-word', name:'분수의 덧셈과 뺄셈 생활 문제', std:'4수01-15', lv:[3,4], t:'both',
    g(){ const d = D(), w1 = ri(2, 5), a = ri(1, d - 1), w2 = ri(1, w1 - 1), b = ri(1, d - 1), plus = ri(0, 1), x = w1 * d + a, y = w2 * d + b, r = plus ? x + y : x - y; if (!ok1(r, d)) return this.g();
      return plus ? Q(`우유를 어제 ${fr(a, d, w1)} L, 오늘 ${fr(b, d, w2)} L 마셨어요. 이틀 동안 마신 우유는 모두 몇 L일까요?`, F(r, d), `${fr(a, d, w1)} + ${fr(b, d, w2)} = <b>${MX(r, d)} L</b>`, [F(x - y, d), F(r + d, d), F(r - 1, d)], 'L')
        : Q(`리본 ${fr(a, d, w1)} m 중에서 ${fr(b, d, w2)} m를 사용했어요. 남은 리본은 몇 m일까요?`, F(r, d), `${fr(a, d, w1)} - ${fr(b, d, w2)} = <b>${MX(r, d)} m</b>`, [F(x + y, d), F(r + d, d), F(r + 1, d)], 'm'); } },
  { id:'fr-missing', name:'□ 안에 알맞은 분수', std:'4수01-15', lv:[4,4], t:'both',
    g(){ const d = D(), x = ri(d + 1, 4 * d), y = ri(1, 3 * d); if (!ok1(x, d) || x % d === 0 || y % d === 0) return this.g(); const plus = ri(0, 1);
      return plus ? Q(`□ + ${MX(y, d)} = ${MX(x + y, d)}에서 □ 안에 알맞은 수는?`, F(x, d), `□ = ${MX(x + y, d)} - ${MX(y, d)} = <b>${MX(x, d)}</b>`, [F(x + 2 * y, d), F(x + d, d), F(x - 1, d)])
        : Q(`□ - ${MX(y, d)} = ${MX(x, d)}에서 □ 안에 알맞은 수는?`, F(x + y, d), `□ = ${MX(x, d)} + ${MX(y, d)} = <b>${MX(x + y, d)}</b>`, [F(Math.abs(x - y) || 1, d), F(x + y + d, d), F(x + y - 1, d)]); } },
  { id:'fr-cmp', name:'계산 결과의 크기 비교', std:'4수01-15', lv:[3,3], t:'mc',
    g(){ const d = D(), a = ri(1, d - 1), b = ri(1, d - 1), c = ri(2, d - 1), e = ri(1, c - 1), w = ri(1, 2), L1 = w * d + a + b, R1 = (w + 1) * d + c - e, cc = CMP(L1, R1);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(a, d, w)} + ${fr(b, d)} ○ ${fr(c, d, w + 1)} - ${fr(e, d)}`)}`, [cc, ...CMPC.filter(z => z !== cc)], `왼쪽 = ${MX(L1, d)}, 오른쪽 = ${MX(R1, d)} → <b>${cc}</b>`); } },
  { id:'fr-range', name:'□ 안에 들어갈 수 있는 수', std:'4수01-15', lv:[5,5], t:'both',
    g(){ const d = D(), a = ri(1, d - 2), lim = ri(a + 2, d + a - 1), cnt = lim - a - 1; if (cnt < 1) return this.g();
      return N(`${fr('□', d)} + ${fr(a, d)} &lt; ${MX(lim, d)}일 때, □ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?`, cnt, `${MX(lim, d)} = ${fr(lim, d)} → □ + ${a} &lt; ${lim} → □ &lt; ${lim - a} → 1부터 ${lim - a - 1}까지 <b>${cnt}개</b>`, [cnt + 1, cnt - 1, lim - a], '개'); } }
]});

/* ─────────────── 3. 사각형 ─────────────── */
A.addUnit({ key:'4-2-3', title:'사각형', items:[
  { id:'pp-def', name:'수직과 평행 알기', std:'4수03-03', lv:[1,1], t:'mc',
    g(){ const t = ri(0, 2), Q0 = [['두 직선이 만나서 이루는 각이 직각일 때 두 직선의 관계', '서로 수직이에요.'], ['한 직선에 수직인 두 직선처럼 서로 만나지 않는 두 직선', '평행선이에요.'], ['평행선 사이의 거리', '평행선 사이에 그은 수선의 길이예요.']][t];
      return MC(`<b>${Q0[0]}</b>에 대한 설명으로 알맞은 것은?`, [Q0[1], ...['서로 수직이에요.', '평행선이에요.', '평행선 사이에 그은 수선의 길이예요.', '두 직선이 만나는 점이에요.', '서로 같은 각이에요.'].filter(x => x !== Q0[1]).slice(0, 3)], `→ <b>${Q0[1]}</b>`); } },
  { id:'pp-count', name:'도형에서 평행한 변 찾기', std:'4수03-03', lv:[1,2], t:'both',
    g(){ const S = [['정사각형', 2], ['직사각형', 2], ['평행사변형', 2], ['마름모', 2], ['정육각형', 3], ['정팔각형', 4], ['정오각형', 0]], s = pick(S.slice(0, 6));
      return N(`<b>${s[0]}</b>에서 서로 평행한 변은 모두 몇 쌍일까요?`, s[1], `${s[0]}에는 마주 보는 두 변이 평행한 쌍이 <b>${s[1]}쌍</b> 있어요.`, [s[1] + 1, s[1] * 2, s[1] - 1], '쌍'); } },
  { id:'pp-dist', name:'평행선 사이의 거리', std:'4수03-03', lv:[2,3], t:'both',
    g(){ const a = ri(3, 12), b = ri(3, 12);
      return N(`직선 가, 나, 다가 서로 평행해요. 직선 가와 나 사이의 거리는 ${a} cm, 직선 나와 다 사이의 거리는 ${b} cm예요. 직선 가와 다 사이의 거리는 몇 cm일까요? (직선 나는 가와 다 사이에 있어요)`, a + b, `평행선 사이의 거리는 수선의 길이 → ${a} + ${b} = <b>${a + b} cm</b>`, [Math.abs(a - b) || a + 1, a * b, a + b + 1], 'cm', { fig: svg(260, 30 + (a + b) * 8, [0, a, a + b].map((y, i) => line(10, 15 + y * 8, 230, 15 + y * 8, { w: 2.4 }) + txt(246, 15 + y * 8, '가나다'[i], { size: 13, bold: true })).join('') + line(60, 15, 60, 15 + (a + b) * 8, { stroke: '#E0464A', w: 2, dash: '5 4' })) }); } },
  { id:'pp-angle', name:'수선과 각도', std:'4수03-03', lv:[3,3], t:'both',
    g(){ const a = ri(15, 75); return N(`직선 가와 직선 나가 서로 수직으로 만나요. 두 직선이 만난 점에서 그은 반직선이 직선 가와 ${a}°를 이룰 때, 이 반직선과 직선 나가 이루는 작은 쪽의 각은 몇 도일까요?`, 90 - a, `수직 → 90° → 90° - ${a}° = <b>${90 - a}°</b>`, [180 - a, a, 90 + a], '°'); } },
  { id:'q-kind', name:'사각형의 이름', std:'4수03-10', lv:[1,2], t:'mc',
    g(){ const t = ri(0, 3), Q0 = [['평행한 변이 한 쌍이라도 있는 사각형', '사다리꼴'], ['마주 보는 두 쌍의 변이 서로 평행한 사각형', '평행사변형'], ['네 변의 길이가 모두 같은 사각형', '마름모'], ['네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형', '정사각형']][t];
      return MC(`<b>${Q0[0]}</b>을 무엇이라고 할까요?`, [Q0[1], ...['사다리꼴', '평행사변형', '마름모', '정사각형', '직사각형'].filter(x => x !== Q0[1]).slice(0, 3)], `→ <b>${Q0[1]}</b>`); } },
  { id:'q-true', name:'여러 가지 사각형의 관계', std:'4수03-10', lv:[2,3], t:'mc',
    g(){ const T = ['정사각형은 마름모예요.', '마름모는 평행사변형이에요.', '직사각형은 사다리꼴이에요.', '정사각형은 직사각형이에요.', '평행사변형은 사다리꼴이에요.'], Fx = ['사다리꼴은 평행사변형이에요.', '마름모는 정사각형이에요.', '평행사변형은 직사각형이에요.', '직사각형은 마름모예요.', '사다리꼴은 마름모예요.'];
      const want = ri(0, 1);
      return want ? MC(`<b>옳은</b> 것은?`, [pick(T), ...shuffle(Fx).slice(0, 3)], '정사각형 ⊂ 직사각형·마름모 ⊂ 평행사변형 ⊂ 사다리꼴 관계예요.') : MC(`<b>옳지 않은</b> 것은?`, [pick(Fx), ...shuffle(T).slice(0, 3)], '정사각형 ⊂ 직사각형·마름모 ⊂ 평행사변형 ⊂ 사다리꼴 관계예요. 거꾸로는 성립하지 않아요.'); } },
  { id:'para-side', name:'평행사변형의 변', std:'4수03-10', lv:[2,3], t:'both',
    g(){ const a = ri(5, 20), b = ri(3, 15), t = ri(0, 1);
      return t ? N(`이웃한 두 변의 길이가 ${a} cm, ${b} cm인 평행사변형의 네 변의 길이의 합은 몇 cm일까요?`, 2 * (a + b), `평행사변형은 마주 보는 두 변의 길이가 같아요 → (${a} + ${b}) × 2 = <b>${2 * (a + b)} cm</b>`, [a + b, a * b, 4 * a], 'cm')
        : N(`네 변의 길이의 합이 ${2 * (a + b)} cm인 평행사변형에서 한 변이 ${a} cm예요. 이 변과 이웃한 변은 몇 cm일까요?`, b, `${2 * (a + b)} ÷ 2 = ${a + b} → ${a + b} - ${a} = <b>${b} cm</b>`, [a, 2 * (a + b) - a, a + b], 'cm'); } },
  { id:'para-angle', name:'평행사변형의 각', std:'4수03-10', lv:[2,3], t:'both',
    g(){ const a = ri(35, 145); if (a === 90) return this.g(); const t = ri(0, 1);
      return t ? N(`평행사변형의 한 각이 ${a}°예요. 이 각과 <b>이웃한</b> 각은 몇 도일까요?`, 180 - a, `평행사변형의 이웃한 두 각의 합은 180° → 180° - ${a}° = <b>${180 - a}°</b>`, [a, 360 - a, 90 - a > 0 ? 90 - a : a - 90], '°')
        : N(`평행사변형의 한 각이 ${a}°예요. 이 각과 <b>마주 보는</b> 각은 몇 도일까요?`, a, `평행사변형은 마주 보는 두 각의 크기가 같아요 → <b>${a}°</b>`, [180 - a, 360 - a, a + 10], '°'); } },
  { id:'rh-prop', name:'마름모의 성질', std:'4수03-10', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const a = ri(4, 20); return N(`네 변의 길이의 합이 ${4 * a} cm인 마름모의 한 변은 몇 cm일까요?`, a, `마름모는 네 변의 길이가 모두 같아요 → ${4 * a} ÷ 4 = <b>${a} cm</b>`, [2 * a, 4 * a, a + 4], 'cm'); }
      if (t === 1){ const a = ri(40, 140); if (a === 90) return this.g(); return N(`마름모의 한 각이 ${a}°예요. 이웃한 각은 몇 도일까요?`, 180 - a, `마름모도 평행사변형이므로 이웃한 두 각의 합은 180° → <b>${180 - a}°</b>`, [a, 360 - a, 90], '°'); }
      return N(`마름모의 두 대각선이 만나서 이루는 각은 몇 도일까요?`, 90, `마름모의 두 대각선은 서로 <b>수직</b>으로 만나요 → <b>90°</b>`, [180, 45, 60], '°'); } },
  { id:'trap-angle', name:'사다리꼴의 각', std:'4수03-10', lv:[4,4], t:'both',
    g(){ const a = ri(50, 130); if (a === 90) return this.g();
      return N(`위아래 두 변이 평행한 사다리꼴에서 왼쪽 아래 각이 ${a}°예요. 왼쪽 위의 각은 몇 도일까요?`, 180 - a, `평행선 사이에서 같은 쪽에 있는 두 각의 합은 180° → 180° - ${a}° = <b>${180 - a}°</b>`, [a, 360 - a, 90], '°'); } },
  { id:'q-name', name:'이름을 모두 붙일 수 있는 사각형', std:'4수03-10', lv:[4,5], t:'both',
    g(){ const S = [['정사각형', 5, '사다리꼴, 평행사변형, 마름모, 직사각형, 정사각형'], ['직사각형', 3, '사다리꼴, 평행사변형, 직사각형'], ['마름모', 3, '사다리꼴, 평행사변형, 마름모'], ['평행사변형', 2, '사다리꼴, 평행사변형']], s = pick(S);
      return N(`<b>${s[0]}</b>${P(s[0], '은', '는')} 사다리꼴, 평행사변형, 마름모, 직사각형, 정사각형 중 몇 가지 이름으로 부를 수 있을까요?`, s[1], `${s[0]} → ${s[2]} → <b>${s[1]}가지</b>`, [s[1] + 1, s[1] - 1, 5 - s[1] || 4], '가지'); } }
]});

/* ─────────────── 4. 소수의 덧셈과 뺄셈 ─────────────── */
const d2 = (lo, hi) => dz(ri(lo * 100, hi * 100) / 100);
const fx = x => { x = dz(x); return String(x); };
A.addUnit({ key:'4-2-4', title:'소수의 덧셈과 뺄셈', items:[
  { id:'dc-read', name:'0.01, 0.001이 몇 개인 수', std:'4수01-13', lv:[1,1], t:'both',
    g(){ const t = ri(0, 1), n = t ? ri(101, 999) : ri(11, 399);
      return t ? N(`0.001이 ${n}개인 수는?`, n / 1000, `0.001이 1000개 = 1 → 0.001이 ${n}개 = <b>${fx(n / 1000)}</b>`, [n / 100, n / 10000, n / 1000 + 0.1]) : N(`0.01이 ${n}개인 수는?`, n / 100, `0.01이 100개 = 1 → 0.01이 ${n}개 = <b>${fx(n / 100)}</b>`, [n / 10, n / 1000, n / 100 + 1]); } },
  { id:'dc-digit', name:'소수의 자리 숫자', std:'4수01-13', lv:[1,2], t:'mc',
    g(){ const s = (ri(1, 9) + ri(1, 999) / 1000).toFixed(3); if (s.endsWith('0')) return this.g(); const k = ri(1, 3), dgt = s[1 + k], nm = ['', '소수 첫째', '소수 둘째', '소수 셋째'][k];
      if (dgt === '0') return this.g(); const val = (+dgt / Math.pow(10, k)).toFixed(k);
      return MC(`${s}에서 <b>${nm} 자리</b> 숫자 ${dgt}${P(dgt, '이', '가')} 나타내는 수는?`, [val, ...[1, 2, 3].filter(x => x !== k).map(x => (+dgt / Math.pow(10, x)).toFixed(x)), dgt].slice(0, 4), `${nm} 자리 숫자는 0.${'0'.repeat(k - 1)}1이 ${dgt}개 → <b>${val}</b>`); } },
  { id:'dc-unit', name:'단위를 소수로 나타내기', std:'4수01-13', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const c = ri(101, 999); return N(`${c} cm는 몇 m일까요?`, c / 100, `1 cm = 0.01 m → ${c} cm = <b>${fx(c / 100)} m</b>`, [c / 10, c / 1000, c], 'm'); }
      if (t === 1){ const m = ri(1001, 9999); if (m % 10 === 0) return this.g(); return N(`${m} m는 몇 km일까요?`, m / 1000, `1 m = 0.001 km → ${m} m = <b>${fx(m / 1000)} km</b>`, [m / 100, m / 10000, m / 10], 'km'); }
      const g = ri(105, 3999); if (g % 10 === 0) return this.g(); return N(`${g} g은 몇 kg일까요?`, g / 1000, `1 g = 0.001 kg → ${g} g = <b>${fx(g / 1000)} kg</b>`, [g / 100, g / 10000, g / 10], 'kg'); } },
  { id:'dc-cmp', name:'소수의 크기 비교', std:'4수01-14', lv:[2,3], t:'mc',
    g(){ const a = d2(1, 9); let b = pick([dz(a + pick([0.01, -0.01, 0.1, -0.1])), +(a.toFixed(2) + ri(1, 9)), dz(Math.floor(a * 10) / 10)]); if (b <= 0 || b === a) return this.g();
      const c = CMP(a, b); return MC(`두 소수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${fx(a)} ○ ${fx(b)}`)}`, [c, ...CMPC.filter(z => z !== c)], `자연수 부분, 소수 첫째, 둘째, 셋째 자리 순서로 비교해요 → <b>${c}</b>`); } },
  { id:'dc-10x', name:'소수 사이의 관계 (10배, 1/10)', std:'4수01-13', lv:[2,3], t:'both',
    g(){ const a = d2(0, 9) || 0.25, t = ri(0, 3), k = [10, 100, 10, 100][t], up = t < 2, r = up ? a * k : a / k;
      return N(`${fx(a)}의 ${up ? `${k}배는` : `${fr(1, k)}은`} 얼마일까요?`, r, `${up ? `${k}배하면 소수점이 오른쪽으로 ${String(k).length - 1}칸` : `${fr(1, k)}을 하면 소수점이 왼쪽으로 ${String(k).length - 1}칸`} 옮겨져요 → <b>${fx(r)}</b>`, up ? [a / k, a * k * 10, a * k / 10] : [a * k, a / k / 10, a / k * 10]); } },
  { id:'da-1', name:'소수 한 자리 수의 덧셈', std:'4수01-16', lv:[1,1], t:'both',
    g(){ const a = ri(1, 89) / 10, b = ri(1, 89) / 10; return N(`${fx(a)} + ${fx(b)}의 값은?`, a + b, `0.1이 ${Math.round(a * 10)}개 + ${Math.round(b * 10)}개 = ${Math.round((a + b) * 10)}개 → <b>${fx(a + b)}</b>`, [a + b + 1, a + b - 0.1, (a + b) * 10]); } },
  { id:'ds-1', name:'소수 한 자리 수의 뺄셈', std:'4수01-16', lv:[1,1], t:'both',
    g(){ const a = ri(20, 99) / 10, b = ri(1, Math.round(a * 10) - 1) / 10; return N(`${fx(a)} - ${fx(b)}의 값은?`, a - b, `소수점끼리 맞추어 빼요 → <b>${fx(a - b)}</b>`, [a + b, a - b + 1, a - b + 0.1]); } },
  { id:'da-2', name:'소수 두 자리 수의 덧셈', std:'4수01-16', lv:[2,2], t:'both',
    g(){ const a = d2(0.1, 9), b = d2(0.1, 9); return N(`${fx(a)} + ${fx(b)}의 값은?`, a + b, `소수점끼리 맞추어 세로로 쓰고, 같은 자리끼리 더해요 → <b>${fx(a + b)}</b>`, [a + b + 0.1, a + b - 0.01, a + b + 1]); } },
  { id:'ds-2', name:'소수 두 자리 수의 뺄셈', std:'4수01-16', lv:[2,2], t:'both',
    g(){ const a = d2(2, 9), b = d2(0.1, a - 0.5); if (b <= 0) return this.g(); return N(`${fx(a)} - ${fx(b)}의 값은?`, a - b, `소수점끼리 맞추고 받아내림에 주의해요 → <b>${fx(a - b)}</b>`, [a + b, a - b + 0.1, a - b - 0.01]); } },
  { id:'d-mixlen', name:'자릿수가 다른 소수의 계산', std:'4수01-16', lv:[3,3], t:'both',
    g(){ const a = ri(20, 99) / 10, b = d2(0.11, a - 0.3), plus = ri(0, 1); if (b <= 0 || Math.round(b * 100) % 10 === 0) return this.g(); const r = plus ? a + b : a - b;
      return N(`${fx(a)} ${plus ? '+' : '-'} ${fx(b)}의 값은?`, r, `${fx(a)} = ${a.toFixed(2)}처럼 끝자리에 0을 붙여 자릿수를 맞춘 다음 계산해요 → <b>${fx(r)}</b>`, plus ? [a + b * 10, a * 10 + b, r + 0.1] : [a * 10 - b * 100 > 0 ? (a * 10 - b * 100) / 10 : r + 1, r + 0.1, Math.abs(a - b * 10) || r + 0.2]); } },
  { id:'d-word', name:'소수의 덧셈과 뺄셈 생활 문제', std:'4수01-16', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const a = d2(0.5, 3), b = d2(0.5, 3); return N(`민수는 ${fx(a)} km를 걷고, ${fx(b)} km를 더 걸었어요. 모두 몇 km를 걸었을까요?`, a + b, `${fx(a)} + ${fx(b)} = <b>${fx(a + b)} km</b>`, [Math.abs(a - b) || a + 1, a + b + 1, a + b - 0.1], 'km'); }
      if (t === 1){ const a = d2(1.5, 5), b = d2(0.2, a - 0.3); return N(`밀가루 ${fx(a)} kg 중에서 ${fx(b)} kg을 사용했어요. 남은 밀가루는 몇 kg일까요?`, a - b, `${fx(a)} - ${fx(b)} = <b>${fx(a - b)} kg</b>`, [a + b, a - b + 0.1, a - b + 1], 'kg'); }
      const a = d2(1.2, 1.6), b = d2(0.1, 0.5); return N(`지호의 키는 ${fx(a)} m이고, 아버지는 지호보다 ${fx(b)} m 더 커요. 아버지의 키는 몇 m일까요?`, a + b, `${fx(a)} + ${fx(b)} = <b>${fx(a + b)} m</b>`, [a - b, a + b + 0.1, a + b * 10], 'm'); } },
  { id:'d-missing', name:'□ 안에 알맞은 소수', std:'4수01-16', lv:[4,4], t:'both',
    g(){ const x = d2(1, 9), y = d2(0.1, 5), t = ri(0, 1);
      return t ? N(`□ - ${fx(y)} = ${fx(x)}에서 □ 안에 알맞은 수는?`, x + y, `덧셈과 뺄셈의 관계 → □ = ${fx(x)} + ${fx(y)} = <b>${fx(x + y)}</b>`, [Math.abs(x - y) || 1, x + y + 1, x + y - 0.1]) : N(`${fx(x + y)} - □ = ${fx(x)}에서 □ 안에 알맞은 수는?`, y, `□ = ${fx(x + y)} - ${fx(x)} = <b>${fx(y)}</b>`, [x + 2 * y, y + 0.1, y * 10]); } },
  { id:'d-cards', name:'수 카드로 소수 만들기', std:'4수01-16', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 3), d = c.slice().sort((a, b) => b - a), bg = dz(d[0] + d[1] / 10 + d[2] / 100), sm = dz(d[2] + d[1] / 10 + d[0] / 100), plus = ri(0, 1), r = plus ? bg + sm : bg - sm;
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')}를 한 번씩만 사용하여 소수 두 자리 수 ■.■■를 만들려고 해요. 가장 큰 수와 가장 작은 수의 ${plus ? '합' : '차'}은?`, r, `가장 큰 수 ${fx(bg)}, 가장 작은 수 ${fx(sm)} → ${fx(bg)} ${plus ? '+' : '-'} ${fx(sm)} = <b>${fx(r)}</b>`, plus ? [bg - sm, r + 1, r - 0.1] : [bg + sm, r + 0.1, r - 1]); } }
]});

/* ─────────────── 5. 다각형 ─────────────── */
A.addUnit({ key:'4-2-5', title:'다각형', items:[
  { id:'pg-name', name:'다각형의 이름', std:'4수03-11', lv:[1,1], t:'mc',
    g(){ const n = ri(5, 10), reg = ri(0, 1), nm = (reg ? '정' : '') + POLY[n];
      return MC(`${reg ? '변의 길이가 모두 같고 각의 크기가 모두 같은, ' : ''}변이 <b>${n}개</b>인 ${reg ? '도형' : '다각형'}의 이름은?`, [nm, ...[n - 1, n + 1, n + 2].map(k => (reg ? '정' : '') + POLY[k])], `변이 ${n}개 → <b>${nm}</b>`); } },
  { id:'pg-is', name:'다각형인 것 찾기', std:'4수03-11', lv:[1,2], t:'mc',
    g(){ const want = ri(0, 1);
      return want ? MC(`<b>다각형</b>인 것은?`, [pick(['오각형', '직사각형', '사다리꼴', '정육각형']), '원', '반원', '선분 하나'], '선분으로만 둘러싸인 도형이 다각형이에요. 원처럼 굽은 선이 있으면 다각형이 아니에요.')
        : MC(`<b>정다각형</b>인 것은?`, [pick(['정사각형', '정삼각형', '정오각형']), '직사각형', '마름모', '이등변삼각형'], '변의 길이가 모두 같고 각의 크기가 모두 같아야 정다각형이에요. 마름모는 각의 크기가 다를 수 있어요.'); } },
  { id:'rp-peri', name:'정다각형의 둘레와 한 변', std:'4수03-11', lv:[1,2], t:'both',
    g(){ const n = ri(3, 10), a = ri(3, 15), t = ri(0, 1);
      return t ? N(`한 변이 ${a} cm인 정${POLY[n]}의 모든 변의 길이의 합은 몇 cm일까요?`, n * a, `정다각형은 변의 길이가 모두 같아요 → ${a} × ${n} = <b>${n * a} cm</b>`, [(n + 1) * a, (n - 1) * a, n + a], 'cm')
        : N(`모든 변의 길이의 합이 ${n * a} cm인 정${POLY[n]}의 한 변은 몇 cm일까요?`, a, `${n * a} ÷ ${n} = <b>${a} cm</b>`, [n * a / (n === 3 ? 4 : n - 1) | 0 || a + 1, n, a + 1], 'cm'); } },
  { id:'rp-wire', name:'철사로 정다각형 만들기', std:'4수03-11', lv:[3,3], t:'both',
    g(){ const n = ri(4, 8), a = ri(4, 12), m = ri(3, 8); if (m === n) return this.g(); const L = n * a; if (L % m) return this.g();
      return N(`철사로 한 변이 ${a} cm인 정${POLY[n]}을 만들었어요. 이 철사를 다시 펴서 모두 사용하여 정${POLY[m]}을 만들면 한 변은 몇 cm일까요?`, L / m, `철사 길이 = ${a} × ${n} = ${L} cm → ${L} ÷ ${m} = <b>${L / m} cm</b>`, [L, a, L / m + 1], 'cm'); } },
  { id:'rp-angle', name:'정다각형의 각', std:'4수03-11', lv:[3,4], t:'both',
    g(){ const n = pick([5, 6, 8]), sum = (n - 2) * 180, t = ri(0, 1);
      return t ? N(`정${POLY[n]}의 모든 각의 크기의 합은 몇 도일까요? (한 꼭짓점에서 대각선을 그어 삼각형으로 나누어 생각해요)`, sum, `삼각형 ${n - 2}개로 나누어져요 → 180° × ${n - 2} = <b>${sum}°</b>`, [180 * n, sum - 180, 360], '°')
        : N(`정${POLY[n]}의 모든 각의 크기의 합은 ${sum}°예요. 한 각의 크기는 몇 도일까요?`, sum / n, `정다각형은 각의 크기가 모두 같아요 → ${sum}° ÷ ${n} = <b>${sum / n}°</b>`, [sum / (n - 2), 180 - sum / n, sum / n + 10], '°'); } },
  { id:'dg-def', name:'대각선 알기', std:'4수03-11', lv:[1,2], t:'mc',
    g(){ const t = ri(0, 1);
      return t ? MC('다각형에서 <b>서로 이웃하지 않는 두 꼭짓점을 이은 선분</b>을 무엇이라고 할까요?', ['대각선', '변', '수선', '평행선'], '→ <b>대각선</b>') : MC('대각선을 그을 수 <b>없는</b> 도형은?', ['삼각형', '사각형', '오각형', '육각형'], '삼각형은 모든 꼭짓점이 서로 이웃하고 있어서 대각선을 그을 수 없어요.'); } },
  { id:'dg-count', name:'대각선의 개수', std:'4수03-11', lv:[2,3], t:'both',
    g(L){ const n = L > 2 ? ri(6, 9) : ri(4, 6), t = L > 2 ? ri(0, 1) : 1, v = t ? n * (n - 3) / 2 : n - 3;
      return t ? N(`${POLY[n]}에 그을 수 있는 대각선은 모두 몇 개일까요?`, v, `한 꼭짓점에서 ${n - 3}개씩, 꼭짓점 ${n}개 → ${n} × ${n - 3} = ${n * (n - 3)}이고 같은 대각선을 두 번 셌으므로 ÷ 2 → <b>${v}개</b>`, [n * (n - 3), n - 3, v + n], '개')
        : N(`${POLY[n]}의 한 꼭짓점에서 그을 수 있는 대각선은 몇 개일까요?`, v, `자기 자신과 이웃한 두 꼭짓점을 빼면 ${n} - 3 = <b>${v}개</b>`, [n - 2, n, n - 1], '개'); } },
  { id:'dg-prop', name:'사각형의 대각선의 성질', std:'4수03-11', lv:[3,4], t:'mc',
    g(){ const t = ri(0, 2), Q0 = [['두 대각선의 길이가 같은 사각형', '직사각형', ['마름모', '평행사변형', '사다리꼴']], ['두 대각선이 서로 수직으로 만나는 사각형', '마름모', ['직사각형', '평행사변형', '사다리꼴']], ['두 대각선의 길이가 같고 서로 수직으로 만나는 사각형', '정사각형', ['직사각형', '마름모', '평행사변형']]][t];
      return MC(`<b>${Q0[0]}</b>은 어느 것일까요?`, [Q0[1], ...Q0[2]], `직사각형: 두 대각선의 길이가 같아요 · 마름모: 두 대각선이 수직 · 정사각형: 둘 다! → <b>${Q0[1]}</b>`); } },
  { id:'tile', name:'모양 조각으로 모양 만들기', std:'4수03-12', lv:[2,3], t:'both',
    g(){ const S = [['정삼각형', '정육각형', 6], ['정삼각형', '사다리꼴(정삼각형 3개 모양)', 3], ['정삼각형', '마름모(정삼각형 2개 모양)', 2], ['사다리꼴', '정육각형', 2], ['마름모', '정육각형', 3]], s = pick(S);
      return N(`모양 조각에서 <b>${s[0]}</b> 조각으로 <b>${s[1]}</b>을 빈틈없이 채우려면 몇 개가 필요할까요?`, s[2], `정육각형 = 정삼각형 6개 = 사다리꼴 2개 = 마름모 3개, 마름모 = 정삼각형 2개, 사다리꼴 = 정삼각형 3개 → <b>${s[2]}개</b>`, [s[2] + 1, s[2] * 2, s[2] - 1], '개'); } },
  { id:'tile2', name:'작은 도형으로 큰 도형 채우기', std:'4수03-12', lv:[4,5], t:'both',
    g(){ const k = ri(2, 4), t = ri(0, 1), v = k * k;
      return t ? N(`한 변이 1 cm인 정삼각형 조각으로 한 변이 ${k} cm인 큰 정삼각형을 빈틈없이 채우려면 조각이 몇 개 필요할까요?`, v, `한 변이 ${k}배가 되면 ${k} × ${k} = <b>${v}개</b>가 필요해요 (1, 3, 5, …를 더한 수와 같아요)`, [k * 3, k * 2, v + 1], '개')
        : N(`한 변이 2 cm인 정사각형 조각으로 가로 ${2 * k} cm, 세로 ${2 * (k + 1)} cm인 직사각형을 빈틈없이 채우려면 조각이 몇 개 필요할까요?`, k * (k + 1), `가로에 ${k}개, 세로에 ${k + 1}개 → ${k} × ${k + 1} = <b>${k * (k + 1)}개</b>`, [4 * k * (k + 1), 2 * k + 1, k * (k + 1) + k], '개'); } }
]});

/* ─────────────── 6. 꺾은선그래프 ─────────────── */
const LG = [['교실의 온도', '°C', ['9시', '10시', '11시', '12시', '1시', '2시']], ['강낭콩의 키', 'cm', ['1일', '3일', '5일', '7일', '9일', '11일']], ['운동장의 기온', '°C', ['오전 8시', '오전 10시', '낮 12시', '오후 2시', '오후 4시', '오후 6시']], ['인형 판매량', '개', ['월', '화', '수', '목', '금', '토']]];
const lgFig = (vals, labs, step, unit, title, base = 0) => {
  const top = Math.ceil(Math.max(...vals) / step / 5) * 5 * step, cells = (top - base) / step, H = 170, ch = H / cells, W = 60 + labs.length * 52; let s = '';
  for (let k = 0; k <= cells; k++){ const y = 15 + H - k * ch; s += line(50, y, W - 6, y, { stroke: k % 5 ? '#E2E8F0' : '#B8C4D4', w: 1 }); if (k % 5 === 0) s += txt(44, y, dz(base + k * step), { size: 11, anchor: 'end' }); }
  labs.forEach((l, i) => { const x = 74 + i * 52; s += line(x, 15, x, 15 + H, { stroke: '#F0F3F8', w: 1 }) + txt(x, H + 30, l, { size: 11 }); });
  const pt = (v, i) => [74 + i * 52, 15 + H - (v - base) / step * ch];
  s += `<polyline points="${vals.map((v, i) => pt(v, i).map(z => z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#E5546B" stroke-width="2.6"/>` + vals.map((v, i) => `<circle cx="${pt(v, i)[0].toFixed(1)}" cy="${pt(v, i)[1].toFixed(1)}" r="4" fill="#E5546B"/>`).join('');
  s += line(50, 15, 50, 15 + H, { w: 1.6 }) + line(50, 15 + H, W - 6, 15 + H, { w: 1.6 }) + txt(10, 6, `(${unit})`, { size: 10, anchor: 'start', fill: '#5D6C83' });
  if (base > 0) s += `<path d="M44 ${15 + H - 8} l6 -4 l6 4 l6 -4" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  return `<div style="text-align:center"><div style="font-weight:700">${title}</div>${svg(W, H + 42, s, 'wide')}</div>`; };
const mkLG = (n = 5, noMono = false) => { let [title, unit, labs] = pick(LG); if (noMono && title === '강낭콩의 키') [title, unit, labs] = LG[0]; const mono = title === '강낭콩의 키', step = pick([1, 2]); let v = [ri(mono ? 2 : 5, mono ? 6 : 12) * step]; for (let i = 1; i < n; i++){ let x; do { x = v[i - 1] + (mono ? ri(1, 4) : ri(-3, 4)) * step; } while (x < step * 2 || x > step * 24 || x === v[i - 1]); v.push(x); }
  return { title, unit, labs: labs.slice(0, n), step, v }; };
const lgOf = g => lgFig(g.v, g.labs, g.step, g.unit, g.title);
A.addUnit({ key:'4-2-6', title:'꺾은선그래프', items:[
  { id:'lg-what', name:'꺾은선그래프 알아보기', std:'4수04-02', lv:[1,1], t:'mc',
    g(){ const t = ri(0, 1);
      return t ? MC('수량을 점으로 표시하고 그 점들을 <b>선분으로 이어</b> 그린 그래프는?', ['꺾은선그래프', '막대그래프', '그림그래프', '표'], '→ <b>꺾은선그래프</b>. 시간에 따른 변화를 알아보기 좋아요.')
        : MC('꺾은선그래프로 나타내기에 <b>가장 알맞은</b> 것은?', [pick(['하루 동안 운동장 기온의 변화', '월별 키의 변화', '연도별 학생 수의 변화']), '좋아하는 과일별 학생 수', '반별 모은 재활용품의 양', '마을별 나무의 수'], '시간에 따라 변화하는 양은 꺾은선그래프, 항목끼리 비교할 때는 막대그래프가 알맞아요.'); } },
  { id:'lg-scale', name:'세로 눈금 한 칸의 크기', std:'4수04-02', lv:[1,2], t:'both',
    g(){ const s = pick([0.5, 1, 2, 5, 10]), k = 5; return N(`꺾은선그래프의 세로 눈금 ${k}칸이 ${dz(s * k)}${pick(['°C', 'cm'])}를 나타내요. 세로 눈금 한 칸은 얼마를 나타낼까요?`, s, `${dz(s * k)} ÷ ${k} = <b>${s}</b>`, [s * k, k, s * 2]); } },
  { id:'lg-read', name:'꺾은선그래프 읽기', std:'4수04-02', lv:[1,2], t:'both',
    g(){ const g = mkLG(), i = ri(0, 4); return N(`<b>${g.labs[i]}</b>의 ${g.title}${P(g.title, '은', '는')} 얼마일까요? (세로 눈금 한 칸 = ${g.step}${g.unit})${lgOf(g)}`, g.v[i], `${g.labs[i]}의 점이 가리키는 눈금: ${g.v[i] / g.step}칸 × ${g.step} = <b>${g.v[i]}${g.unit}</b>`, [g.v[i] + g.step, g.v[i] - g.step, g.v[i] / g.step], g.unit); } },
  { id:'lg-diff', name:'두 때의 차', std:'4수04-02', lv:[2,2], t:'both',
    g(){ const g = mkLG(), [i, j] = shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((a, b) => a - b), d = Math.abs(g.v[j] - g.v[i]); if (!d) return this.g();
      return N(`${g.labs[i]}${P(g.labs[i], '과', '와')} ${g.labs[j]}의 ${g.title}의 차는 얼마일까요? (세로 눈금 한 칸 = ${g.step}${g.unit})${lgOf(g)}`, d, `${Math.max(g.v[i], g.v[j])} - ${Math.min(g.v[i], g.v[j])} = <b>${d}${g.unit}</b>`, [d + g.step, g.v[i] + g.v[j], d / g.step].filter(x => x !== d), g.unit); } },
  { id:'lg-change', name:'변화가 가장 큰 때', std:'4수04-02', lv:[2,3], t:'mc',
    g(L){ const g = mkLG(5, L > 2), ch = range(0, 3).map(i => g.v[i + 1] - g.v[i]), want = L > 2 ? 'down' : 'up';
      const cand = ch.map((c, i) => [c, i]).filter(z => want === 'up' ? z[0] > 0 : z[0] < 0); if (!cand.length) return this.g();
      const best = cand.reduce((a, b) => Math.abs(b[0]) > Math.abs(a[0]) ? b : a); if (cand.filter(z => Math.abs(z[0]) === Math.abs(best[0])).length > 1) return this.g();
      const lab = i => `${g.labs[i]} ~ ${g.labs[i + 1]}`;
      return MC(`${g.title}${P(g.title, '이', '가')} 가장 많이 <b>${want === 'up' ? '늘어난' : '줄어든'}</b> 때는?${lgOf(g)}`, [lab(best[1]), ...range(0, 3).filter(i => i !== best[1]).map(lab)], `선이 가장 많이 ${want === 'up' ? '올라간' : '내려간'}(기울어진) 곳 → <b>${lab(best[1])}</b> (${Math.abs(best[0])}${g.unit})`); } },
  { id:'lg-mid', name:'중간값 예상하기', std:'4수04-02', lv:[3,3], t:'both',
    g(){ const a = ri(8, 20) * 2, d = ri(1, 4) * 2 * pick([1, -1]), b = a + d, h = ri(9, 12);
      return N(`어느 날 기온을 ${h}시에 ${a}°C, ${h + 1}시에 ${b}°C로 재었어요. 꺾은선그래프에서 ${h}시 30분의 기온은 약 몇 °C였을까요?`, (a + b) / 2, `두 점을 이은 선분의 가운데를 읽어요 → (${a} + ${b}) ÷ 2 = 약 <b>${(a + b) / 2}°C</b>`, [a, b, a + b], '°C'); } },
  { id:'lg-wave', name:'물결선으로 나타내기', std:'4수04-02', lv:[3,3], t:'mc',
    g(){ const lo = ri(31, 45) * 10, hi = lo + ri(3, 9) * 10, ok = `${Math.floor(lo / 100) * 100 + (lo % 100 >= 50 ? 50 : 0)}`;
      return MC(`자료의 값이 가장 작은 것이 ${lo}, 가장 큰 것이 ${hi}${P(hi, '이에요', '예요')}. 물결선을 사용하여 세로 눈금을 줄이려면 물결선 위쪽의 세로 눈금을 얼마부터 시작하는 것이 가장 알맞을까요?`, [ok, '0', String(hi), String(lo + 50)], `가장 작은 값(${lo})보다 조금 작은 수부터 시작해야 모든 자료를 나타낼 수 있어요 → <b>${ok}</b>`); } },
  { id:'lg-true', name:'꺾은선그래프 해석하기', std:'4수04-03', lv:[3,4], t:'mc',
    g(){ const g = mkLG(5, true), mx = Math.max(...g.v), im = g.v.indexOf(mx), last = g.v[4] - g.v[3];
      const ok = pick([`${g.labs[im]}에 가장 ${g.unit === '°C' ? '높아요' : '커요(많아요)'}.`, `${g.labs[3]}에서 ${g.labs[4]} 사이에 ${Math.abs(last)}${g.unit} ${last > 0 ? '늘었어요' : '줄었어요'}.`]);
      const bad = [`${g.labs[g.v.indexOf(Math.min(...g.v))]}에 가장 ${g.unit === '°C' ? '높아요' : '커요(많아요)'}.`, `${g.labs[3]}에서 ${g.labs[4]} 사이에 ${Math.abs(last)}${g.unit} ${last > 0 ? '줄었어요' : '늘었어요'}.`, `${g.labs[0]}부터 계속 ${pick(['늘기만', '줄기만'])} 했어요.`, `세로 눈금 한 칸은 ${g.step * 5}${g.unit}예요.`];
      return MC(`꺾은선그래프를 보고 <b>바르게</b> 말한 것은? (세로 눈금 한 칸 = ${g.step}${g.unit})${lgOf(g)}`, [ok, ...bad.slice(0, 3)], `점의 위치와 선의 기울기를 정확히 읽어요 → <b>${ok}</b>`); } },
  { id:'lg-predict', name:'다음 값 예상하기', std:'4수04-03', lv:[4,5], t:'both',
    g(){ const s = ri(3, 10), d = ri(2, 5), labs = ['1주', '2주', '3주', '4주', '5주'], v = range(0, 3).map(i => s + i * d);
      return N(`강낭콩의 키를 매주 재어 꺾은선그래프로 나타냈어요. 키가 일정하게 자란다면 <b>5주</b>에는 약 몇 cm가 될까요?${lgFig(v, labs.slice(0, 4), 1, 'cm', '강낭콩의 키')}`, s + 4 * d, `매주 ${d} cm씩 자라고 있어요 → ${v[3]} + ${d} = 약 <b>${s + 4 * d} cm</b>`, [v[3], s + 5 * d, v[3] + 1], 'cm'); } },
  { id:'lg-total', name:'변화한 양 구하기', std:'4수04-03', lv:[4,4], t:'both',
    g(){ const g = mkLG(), d = g.v[4] - g.v[0]; if (Math.abs(d) < 2 * g.step) return this.g();
      return N(`${g.labs[0]}에 비해 ${g.labs[4]}에는 ${g.title}${P(g.title, '이', '가')} 얼마나 ${d > 0 ? '늘었을까요' : '줄었을까요'}? (세로 눈금 한 칸 = ${g.step}${g.unit})${lgOf(g)}`, Math.abs(d), `${Math.max(g.v[0], g.v[4])} - ${Math.min(g.v[0], g.v[4])} = <b>${Math.abs(d)}${g.unit}</b>`, [Math.abs(d) + g.step, g.v[4], Math.abs(d) / g.step], g.unit); } }
]});
window.TM_G42 = { triFig, lgFig, POLY, MX };
})();
