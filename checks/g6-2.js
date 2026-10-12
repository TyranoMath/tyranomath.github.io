/* =========================================================
   6학년 2학기 문제 만들기 — 수학익힘 6-2(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS, Q6 = window.TM_Q6;
const { ri, pick, shuffle, gcd, lcm, range, dz, nf, josa, F, toF, frH, fr, svg, txt, line, tableH } = A;
const { iso, viewSVG, front, side, topMap } = Q6;
const NAMES = ['민수', '지아', '수아', '지호', '유나', '시우', '하나', '서아', '도희', '예나', '주아', '태호'];
const E = s => `<div class="expr">${s}</div>`;
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};
const N = (q, v, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: Number.isInteger(dz(v)) ? 'int' : 'dec', v: dz(v), unit }, wrong: wrong.map(dz).filter(x => x > 0), ex }, extra);
const Q = (q, f, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: 'frac', v: toF(f), unit }, wrong, ex }, extra);
const D2 = x => nf(dz(x));
const CMP = (a, b) => a > b + 1e-9 ? '&gt;' : a < b - 1e-9 ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];
const PI = 3.14;
const roundTo = (x, p) => dz(Math.floor(dz(x / p) + 0.5) * p);
const circFig = (lab, kind = 'r') => { const C = 70, r = 58; return svg(150, 150, `<circle cx="${C}" cy="${C}" r="${r}" fill="#EEF6FF" stroke="#22314A" stroke-width="2"/><circle cx="${C}" cy="${C}" r="3" fill="#22314A"/>` + (kind === 'r' ? line(C, C, C + r, C, { stroke: '#2a6fae' }) + txt(C + r / 2, C - 10, lab, { size: 13, fill: '#2a6fae', bold: true }) : line(C - r, C, C + r, C, { stroke: '#2a6fae' }) + txt(C, C - 10, lab, { size: 13, fill: '#2a6fae', bold: true }))); };

/* ─────────────── 1. 분수의 나눗셈 ─────────────── */
A.addUnit({ key:'6-2-1', title:'분수의 나눗셈', items:[
  { id:'ff-same', name:'분모가 같은 (분수)÷(분수) — 분자끼리 나누어떨어지는 경우', std:'6수01-11', lv:[1,1], t:'both',
    g(){ const b = ri(1, 3), k = ri(2, 5), a = b * k, d = ri(a + 1, a + 6);
      return N(`${fr(a, d)} ÷ ${fr(b, d)}의 값은?`, k, `분모가 같으면 분자끼리 나누어요: ${a} ÷ ${b} = <b>${k}</b>`, [k + 1, a * b, k * 2]); } },
  { id:'ff-same2', name:'분모가 같은 (분수)÷(분수) — 나누어떨어지지 않는 경우', std:'6수01-11', lv:[1,2], t:'both',
    g(){ const b = ri(2, 4), d = ri(b + 4, 13); let a = ri(b + 1, d - 1); if (a % b === 0) a = a + 1 < d ? a + 1 : a - 1;
      return Q(`${fr(a, d)} ÷ ${fr(b, d)}의 값은?`, F(a, b), `분자끼리 나누어요: ${a} ÷ ${b} = ${fr(a, b)} = ${frH(F(a, b))}`, [F(b, a), F(a, d), F(a * b, d)]); } },
  { id:'nuf-div', name:'(자연수)÷(단위분수)', std:'6수01-11', lv:[1,1], t:'both',
    g(){ const n = ri(2, 9), c = ri(2, 9);
      return N(`${n} ÷ ${fr(1, c)}의 값은?`, n * c, `1 안에 ${fr(1, c)}이 ${c}개 → ${n} 안에는 ${n} × ${c} = <b>${n * c}개</b>`, [n + c, n, c]); } },
  { id:'ff-diff', name:'분모가 다른 (분수)÷(분수)', std:'6수01-11', lv:[2,3], t:'both',
    g(){ const b = ri(2, 7); let d = ri(2, 7); if (d === b) d++; const a = ri(1, b - 1), c = ri(1, d - 1);
      return Q(`${fr(a, b)} ÷ ${fr(c, d)}의 값은?`, F(a * d, b * c), `통분하면 ${fr(a * d, b * d)} ÷ ${fr(c * b, b * d)} = ${a * d} ÷ ${c * b} = ${frH(F(a * d, b * c))}`, [F(a * c, b * d), F(b * c, a * d), F(a, c)]); } },
  { id:'nf-div', name:'(자연수)÷(분수)', std:'6수01-11', lv:[2,2], t:'both',
    g(){ const c = ri(3, 9), b = ri(2, c - 1), m = ri(2, 6), n = b * m;
      return N(`${n} ÷ ${fr(b, c)}의 값은?`, m * c, `${n} ÷ ${fr(b, c)} = (${n} ÷ ${b}) × ${c} = <b>${m * c}</b>`, [m, n * c, m * c + c]); } },
  { id:'ff-mul', name:'(분수)÷(분수)를 (분수)×(분수)로 계산하기', std:'6수01-11', lv:[2,3], t:'both',
    g(){ const b = ri(3, 9), a = ri(1, b - 1), d = ri(3, 9), c = ri(1, d - 1);
      return Q(`${fr(a, b)} ÷ ${fr(c, d)}의 값은?`, F(a * d, b * c), `나누는 분수의 분모와 분자를 바꾸어 곱해요: ${fr(a, b)} × ${fr(d, c)} = ${frH(F(a * d, b * c))}`, [F(a * c, b * d), F(b * c, a * d), F(a * d, b * c + 1)]); } },
  { id:'mf-div', name:'대분수의 나눗셈', std:'6수01-11', lv:[3,4], t:'both',
    g(){ const b = ri(2, 6), a = ri(1, b - 1), w = ri(1, 3), d = ri(2, 6), c = ri(1, d - 1), im = w * b + a;
      return Q(`${fr(a, b, w)} ÷ ${fr(c, d)}의 값은?`, F(im * d, b * c), `가분수로 바꾸어 계산해요: ${fr(im, b)} × ${fr(d, c)} = ${frH(F(im * d, b * c))}`, [F(im * c, b * d), F(w * d, c).add(F(a, b)), F(b * c, im * d)]); } },
  { id:'ff-cmp', name:'분수의 나눗셈 결과 비교하기', std:'6수01-11', lv:[3,3], t:'mc',
    g(){ const mk = () => { const b = ri(2, 9), a = ri(1, b - 1), d = ri(2, 9), c = ri(1, d - 1); return [a, b, c, d, F(a * d, b * c)]; };
      const x = mk(), y = mk(), c = CMP(x[4].v, y[4].v);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(x[0], x[1])} ÷ ${fr(x[2], x[3])} ○ ${fr(y[0], y[1])} ÷ ${fr(y[2], y[3])}`)}`, [c, ...CMPC.filter(z => z !== c)], `왼쪽 = ${frH(x[4])}, 오른쪽 = ${frH(y[4])} → <b>${c}</b>`); } },
  { id:'ff-gt1', name:'몫이 1보다 큰 나눗셈 찾기', std:'6수01-11', lv:[3,3], t:'mc',
    g(){ const mk = big => { let a, b, c, d; do { b = ri(2, 9); a = ri(1, b - 1); d = ri(2, 9); c = ri(1, d - 1); } while ((a / b > c / d) !== big || a * d === b * c); return `${fr(a, b)} ÷ ${fr(c, d)}`; };
      return MC('몫이 1보다 <b>큰</b> 나눗셈은?', [mk(true), mk(false), mk(false), mk(false)], '나누어지는 수가 나누는 수보다 크면 몫이 1보다 커요. 두 분수의 크기를 비교해 보세요.'); } },
  { id:'ff-rect', name:'넓이로 모르는 길이 구하기', std:'6수01-11', lv:[4,4], t:'both',
    g(){ const s = F(ri(1, 4), ri(5, 9)), h = F(ri(1, 9), ri(2, 9)), area = s.mul(h);
      return Q(`넓이가 ${frH(area)} m²인 직사각형의 세로가 ${frH(s)} m일 때, 가로는 몇 m일까요?`, h, `(가로) = (넓이) ÷ (세로) = ${frH(area)} ÷ ${frH(s)} = ${frH(area)} × ${frH(F(s.d, s.n), { improper: true })} = <b>${frH(h)}</b>`, [area.mul(s), s.div(area)], 'm'); } },
  { id:'ffdiv-word', name:'분수의 나눗셈 생활 문제', std:'6수01-11', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const d = ri(5, 10), b = ri(1, 2), k = ri(2, 4), a = b * k; return N(`쌀 ${fr(a, d)} kg을 한 봉지에 ${fr(b, d)} kg씩 담으면 몇 봉지가 될까요?`, k, `${fr(a, d)} ÷ ${fr(b, d)} = ${a} ÷ ${b} = <b>${k}봉지</b>`, [k + 1, a * b, k * 2], '봉지'); }
      if (t === 1){ const c = ri(1, 4), dd = ri(c + 1, 7), a = ri(1, 5), b = ri(a + 1, 9); return Q(`${fr(c, dd)}시간 동안 ${fr(a, b)} km를 걸었어요. 같은 빠르기로 1시간 동안 걸을 수 있는 거리는?`, F(a * dd, b * c), `${fr(a, b)} ÷ ${fr(c, dd)} = ${fr(a, b)} × ${fr(dd, c)} = ${frH(F(a * dd, b * c))} (km)`, [F(a * c, b * dd), F(b * c, a * dd)], 'km'); }
      const L = F(ri(1, 3), ri(4, 7)), S = F(ri(2, 9), ri(2, 5)); return Q(`페인트 ${frH(L)} L로 벽 ${frH(S)} m²를 칠했어요. 페인트 1 L로 칠할 수 있는 벽의 넓이는?`, S.div(L), `${frH(S)} ÷ ${frH(L)} = ${frH(S.div(L))} (m²)`, [L.div(S), S.mul(L)], 'm²'); } },
  { id:'ff-ineq', name:'□ 안에 들어갈 수 있는 자연수 구하기', std:'6수01-11', lv:[5,5], t:'both',
    g(){ const c = ri(3, 9), b = ri(1, c - 1), m = ri(3, 12), lim = F(m * b, c), mx = Math.ceil(lim.v - 1e-9) - 1;
      if (mx < 1) return this.g();
      return N(`□ ÷ ${fr(b, c)} &lt; ${m}에서 □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는?`, mx, `□ &lt; ${m} × ${fr(b, c)} = ${frH(lim)} → 가장 큰 자연수 <b>${mx}</b>`, [mx + 1, m, Math.max(1, mx - 1)]); } },
  { id:'ff-speed', name:'빠르기 문제 (단위 바꾸기)', std:'6수01-11', lv:[5,5], t:'both',
    g(){ const v = ri(2, 9), mins = pick([10, 15, 20, 30]);
      const dist = F(v * mins, 60);
      return Q(`자전거로 ${frH(F(mins, 60))}시간 동안 ${frH(dist)} km를 갔어요. 같은 빠르기로 ${mins === 30 ? 20 : 30}분 동안 갈 수 있는 거리는?`, F(v * (mins === 30 ? 20 : 30), 60), `1시간에 ${frH(dist)} ÷ ${frH(F(mins, 60))} = ${v} km → ${mins === 30 ? 20 : 30}분 = ${frH(F(mins === 30 ? 20 : 30, 60))}시간 → ${v} × ${frH(F(mins === 30 ? 20 : 30, 60))} = ${frH(F(v * (mins === 30 ? 20 : 30), 60))} (km)`, [F(v, 1), dist], 'km'); } }
]});

/* ─────────────── 2. 공간과 입체 ─────────────── */
const randH = () => { let H; do { H = range(1, 3).map(() => range(1, 3).map(() => ri(0, 3))); } while (H.flat().filter(x => x).length < 4 || !H[2].some(x => x) || !H.every(r => r.some(x => x)) || ![0, 1, 2].every(c => H.some(r => r[c]))); return H; };
const views4 = c => { const out = [c]; let t = 0; while (out.length < 4 && t < 200){ t++; const v = c.slice(), i = ri(0, v.length - 1); v[i] = Math.max(1, Math.min(4, v[i] + (ri(0, 1) ? 1 : -1))); if (ri(0, 2) === 0) v.reverse(); if (!out.some(o => o.join() === v.join())) out.push(v); } return out; };
const viewOpts = (ans, other) => { const base = [ans, other].filter((c, i, arr) => arr.findIndex(o => o.join() === c.join()) === i), more = views4(ans).filter(c => !base.some(o => o.join() === c.join())); return [...base, ...more].map(c => viewSVG(c)); };
A.addUnit({ key:'6-2-2', title:'공간과 입체', items:[
  { id:'stack-true', name:'보는 방향과 쌓기나무 개수 알기', std:'6수03-10', lv:[1,2], t:'mc',
    g(){ return pick([
      () => MC('위에서 본 모양만 보고 쌓기나무의 개수를 정확히 알기 어려운 까닭은?', ['보이지 않는 곳에 쌓기나무가 있을 수 있어서', '쌓기나무의 크기가 모두 달라서', '위에서 본 모양은 항상 정사각형이라서', '쌓기나무는 1층에만 쌓기 때문에'], '위에서 본 모양에 각 자리의 개수를 써 주거나, 층별로 나타내면 정확히 알 수 있어요.'),
      () => MC('쌓기나무 개수를 정확하게 나타내는 방법으로 알맞은 것은?', ['위에서 본 모양의 각 자리에 쌓은 개수 쓰기', '앞에서 본 모양만 그리기', '옆에서 본 모양만 그리기', '쌓은 모양을 색칠하기'], '위에서 본 모양에 수를 쓰면 각 자리에 몇 개씩 쌓았는지 알 수 있어 개수가 하나로 정해져요.'),
      () => MC('원기둥 모양의 컵을 <b>위</b>에서 보면 어떤 모양일까요?', ['원', '직사각형', '삼각형', '사다리꼴'], '원기둥은 위에서 보면 원, 앞에서 보면 직사각형이에요.')])(); } },
  { id:'stack-iso', name:'쌓은 모양을 보고 쌓기나무 개수 구하기', std:'6수03-09', lv:[1,2], t:'both',
    g(){ let H; do { H = range(1, 2).map(() => range(1, 3).map(() => ri(1, 3))); } while (!H[0].every((h, i) => h >= H[1][i])); const s = H.flat().reduce((a, b) => a + b, 0);
      return N('쌓기나무로 쌓은 모양이에요. 뒤에 숨겨진 쌓기나무는 없어요. 사용한 쌓기나무는 몇 개일까요?', s, `자리마다 층수를 세어 더하면 <b>${s}개</b>`, [s + 1, s - 1, s + 2], '개', { fig: iso(H) }); } },
  { id:'stack-count', name:'위에서 본 모양에 쓴 수로 개수 구하기', std:'6수03-09', lv:[1,2], t:'both',
    g(){ const H = randH(), s = H.flat().reduce((a, b) => a + b, 0);
      return N('쌓기나무로 쌓은 모양을 위에서 본 모양에 각 자리에 쌓은 개수를 썼어요. 사용한 쌓기나무는 모두 몇 개일까요?', s, `수를 모두 더해요: ${H.flat().filter(x => x).join(' + ')} = <b>${s}개</b>`, [s + 1, s - 1, H.flat().filter(x => x).length], '개', { fig: topMap(H) }); } },
  { id:'view-front', name:'앞에서 본 모양 찾기', std:'6수03-10', lv:[2,3], t:'mc',
    g(){ const H = randH(), f = front(H);
      return MC('위에서 본 모양에 쌓은 개수를 쓴 그림이에요. <b>앞</b>(아래쪽)에서 본 모양은?', viewOpts(f, side(H)).slice(0, 4), `앞에서 보면 세로줄마다 <b>가장 높은 층</b>이 보여요: 왼쪽부터 ${f.join(', ')}층`, { fig: topMap(H), gridChoices: true }); } },
  { id:'view-side', name:'옆에서 본 모양 찾기', std:'6수03-10', lv:[2,3], t:'mc',
    g(){ const H = randH(), sd = side(H);
      return MC('위에서 본 모양에 쌓은 개수를 쓴 그림이에요. <b>오른쪽 옆</b>에서 본 모양은?', viewOpts(sd, front(H)).slice(0, 4), `오른쪽에서 보면 가로줄마다 가장 높은 층이 보여요. 앞줄이 왼쪽에 와요: ${sd.join(', ')}층`, { fig: topMap(H), gridChoices: true }); } },
  { id:'layer2', name:'2층 이상에 쌓인 쌓기나무 세기', std:'6수03-10', lv:[3,3], t:'both',
    g(){ const H = randH(), z = ri(2, 3), v = H.flat().filter(h => h >= z).length;
      if (!v) return this.g();
      return N(`위에서 본 모양에 쌓은 개수를 쓴 그림이에요. <b>${z}층</b>에 있는 쌓기나무는 몇 개일까요?`, v, `수가 ${z} 이상인 자리에 ${z}층 쌓기나무가 있어요 → <b>${v}개</b>`, [v + 1, H.flat().filter(h => h === z).length === v ? v + 2 : H.flat().filter(h => h === z).length, H.flat().filter(h => h).length], '개', { fig: topMap(H) }); } },
  { id:'layer-count', name:'층별로 나타낸 모양으로 개수 구하기', std:'6수03-10', lv:[3,4], t:'both',
    g(){ const H = randH(), L = [1, 2, 3].map(z => H.map(r => r.map(h => h >= z ? 1 : 0))), cnt = L.map(l => l.flat().reduce((a, b) => a + b, 0)), s = cnt.reduce((a, b) => a + b, 0);
      const grid = l => { const sz = 22; let g = ''; l.forEach((r, i) => r.forEach((v, j) => { g += `<rect x="${4 + j * sz}" y="${4 + i * sz}" width="${sz}" height="${sz}" fill="${v ? '#FFD27A' : '#fff'}" stroke="${v ? '#22314A' : '#E2E2E2'}" stroke-width="1.3"/>`; })); return svg(8 + 3 * sz, 8 + 3 * sz, g); };
      const fig = `<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">${L.map((l, k) => cnt[k] ? `<div style="text-align:center">${grid(l)}<div>${k + 1}층</div></div>` : '').join('')}</div>`;
      return N('쌓기나무로 쌓은 모양을 층별로 나타냈어요. 사용한 쌓기나무는 모두 몇 개일까요?', s, `층별 개수를 더해요: ${cnt.filter(x => x).join(' + ')} = <b>${s}개</b>`, [cnt[0], s + 1, s - 1], '개', { fig }); } },
  { id:'layer1', name:'1층에 놓인 쌓기나무 세기', std:'6수03-10', lv:[1,2], t:'both',
    g(){ const H = randH(), v = H.flat().filter(h => h).length;
      return N('위에서 본 모양에 쌓은 개수를 쓴 그림이에요. <b>1층</b>에 놓인 쌓기나무는 몇 개일까요?', v, `1층에는 위에서 본 모양의 칸 수만큼 놓여요 → <b>${v}개</b>`, [H.flat().reduce((a, b) => a + b, 0), v + 1, v - 1], '개', { fig: topMap(H) }); } },
  { id:'view-top', name:'위에서 본 모양 찾기', std:'6수03-10', lv:[2,2], t:'mc',
    g(){ let H; do { H = range(1, 2).map(() => range(1, 3).map(() => ri(0, 3))); } while (!H[0].every((h, i) => h >= H[1][i]) || H.flat().filter(x => x).length < 4 || !H[1].some(x => x) || ![0, 1, 2].every(c => H[0][c] || H[1][c]));
      const shape = M => topMap(M.map(r => r.map(h => h ? 1 : 0)), false), opts = [shape(H)]; let t = 0;
      while (opts.length < 4 && t < 100){ t++; const M = H.map(r => r.map(h => h ? 1 : 0)), i = ri(0, 1), j = ri(0, 2); M[i][j] = 1 - M[i][j]; if (M.flat().some(x => x) && M.every(r => r.some(x => x))){ const o = shape(M); if (!opts.includes(o)) opts.push(o); } }
      return MC('쌓기나무로 쌓은 모양이에요. <b>위</b>에서 본 모양은? (뒤에 숨겨진 쌓기나무는 없어요)', opts, '위에서 보면 쌓기나무가 놓인 자리(1층의 모양)가 보여요.', { fig: iso(H), gridChoices: true }); } },
  { id:'stack-max', name:'위, 앞, 옆에서 본 모양으로 가장 많은 개수 구하기', std:'6수03-10', lv:[5,5], t:'both',
    g(){ const H = randH(), f = front(H), sd = side(H), cells = []; H.forEach((r, i) => r.forEach((h, j) => { if (h) cells.push([i, j]); }));
      let best = 0; const cur = H.map(r => r.map(() => 0));
      const rec = k => { if (k === cells.length){ if (front(cur).join() === f.join() && side(cur).join() === sd.join()) best = Math.max(best, cur.flat().reduce((a, b) => a + b, 0)); return; } const [i, j] = cells[k]; for (let h = 1; h <= 3; h++){ cur[i][j] = h; rec(k + 1); } cur[i][j] = 0; };
      rec(0);
      const fig = `<div style="display:flex;gap:18px;justify-content:center;align-items:end;flex-wrap:wrap"><div style="text-align:center">${topMap(H, false)}<div>위</div></div><div style="text-align:center">${viewSVG(f)}<div>앞</div></div><div style="text-align:center">${viewSVG(sd)}<div>오른쪽 옆</div></div></div>`;
      return N('쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이에요. 쌓기나무를 <b>가장 많이</b> 사용한 경우는 몇 개일까요?', best, `각 자리에는 (그 줄의 앞 모양 높이)와 (옆 모양 높이) 중 작은 수만큼 쌓을 수 있어요 → 모두 더하면 <b>${best}개</b>`, [best - 1, best + 1, best + 2], '개', { fig }); } },
  { id:'stack-min', name:'위, 앞, 옆에서 본 모양으로 가장 적은 개수 구하기', std:'6수03-10', lv:[4,5], t:'both',
    g(){ const H = randH(), f = front(H), sd = side(H), cells = []; H.forEach((r, i) => r.forEach((h, j) => { if (h) cells.push([i, j]); }));
      let best = Infinity; const cur = H.map(r => r.map(() => 0));
      const rec = k => { if (k === cells.length){ if (front(cur).join() === f.join() && side(cur).join() === sd.join()) best = Math.min(best, cur.flat().reduce((a, b) => a + b, 0)); return; } const [i, j] = cells[k]; for (let h = 1; h <= 3; h++){ cur[i][j] = h; rec(k + 1); } cur[i][j] = 0; };
      rec(0);
      const fig = `<div style="display:flex;gap:18px;justify-content:center;align-items:end;flex-wrap:wrap"><div style="text-align:center">${topMap(H, false)}<div>위</div></div><div style="text-align:center">${viewSVG(f)}<div>앞</div></div><div style="text-align:center">${viewSVG(sd)}<div>오른쪽 옆</div></div></div>`;
      return N('쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이에요. 쌓기나무를 <b>가장 적게</b> 사용한 경우는 몇 개일까요?', best, `위에서 본 모양의 각 자리에 앞과 옆에서 본 모양을 함께 만족하는 가장 작은 수를 써서 더하면 <b>${best}개</b>`, [best + 1, best + 2, H.flat().reduce((a, b) => a + b, 0) === best ? best - 1 : H.flat().reduce((a, b) => a + b, 0)], '개', { fig }); } }
]});

/* ─────────────── 3. 소수의 나눗셈 ─────────────── */
A.addUnit({ key:'6-2-3', title:'소수의 나눗셈', items:[
  { id:'dd-use', name:'자연수의 나눗셈을 이용한 (소수)÷(소수)', std:'6수01-15', lv:[1,2], t:'both',
    g(){ const b = ri(2, 9), q = ri(12, 48), a = b * q, s = pick([10, 100]);
      return N(`${a} ÷ ${b} = ${q}를 이용하여 ${D2(a / s)} ÷ ${D2(b / s)}의 몫을 구하면?`, q, `나누어지는 수와 나누는 수를 똑같이 ${s}배 하면 몫은 같아요 → <b>${q}</b>`, [q / 10, q * 10, q / 100]); } },
  { id:'dd-same', name:'자릿수가 같은 (소수)÷(소수)', std:'6수01-15', lv:[1,2], t:'both',
    g(){ const d = pick([ri(2, 9) / 10, ri(11, 99) / 100]), q = ri(2, 12), p = dz(d * q);
      return N(`${D2(p)} ÷ ${D2(d)}의 값은?`, q, `두 수의 소수점을 똑같이 옮기면 (자연수) ÷ (자연수) → <b>${q}</b>`, [q / 10, q * 10, q + 1]); } },
  { id:'dd-diff', name:'자릿수가 다른 (소수)÷(소수)', std:'6수01-15', lv:[2,3], t:'both',
    g(){ const d = ri(11, 49) / 10, q = ri(11, 69) / 10, p = dz(d * q);
      return N(`${D2(p)} ÷ ${D2(d)}의 값은?`, q, `나누는 수가 자연수가 되도록 소수점을 한 칸씩 옮겨요: ${D2(p * 10)} ÷ ${Math.round(d * 10)} = <b>${D2(q)}</b>`, [q * 10, q / 10, dz(q + 0.1)]); } },
  { id:'nd-div', name:'(자연수)÷(소수)', std:'6수01-15', lv:[2,3], t:'both',
    g(){ let d, q, n, c = 0; do { d = pick([0.2, 0.25, 0.4, 0.5, 0.75, 1.2, 1.5, 2.5, 0.6, 0.8]); q = ri(3, 40); n = dz(d * q); c++; } while (!Number.isInteger(n) && c < 300);
      const m = dz(d * 10) % 1 ? 100 : 10;
      return N(`${n} ÷ ${D2(d)}의 값은?`, q, `두 수에 똑같이 ${m}을(를) 곱해요: ${nf(dz(n * m))} ÷ ${nf(dz(d * m))} = <b>${q}</b>`, [q / 10, q * 10, n * d]); } },
  { id:'dd-cmp', name:'몫의 크기 비교하기', std:'6수01-15', lv:[3,3], t:'mc',
    g(){ const mk = () => { const d = ri(2, 9) / 10, q = ri(11, 60) / 10; return [dz(d * q), d, q]; }, x = mk(), y = mk(), c = CMP(x[2], y[2]);
      return MC(`몫의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${D2(x[0])} ÷ ${D2(x[1])} ○ ${D2(y[0])} ÷ ${D2(y[1])}`)}`, [c, ...CMPC.filter(z => z !== c)], `왼쪽 = ${D2(x[2])}, 오른쪽 = ${D2(y[2])} → <b>${c}</b>`); } },
  { id:'dd-round', name:'몫을 반올림하여 나타내기', std:'6수01-15', lv:[3,4], t:'both',
    g(){ const p = pick([[1, '일의 자리'], [0.1, '소수 첫째 자리'], [0.01, '소수 둘째 자리']]); let a, b; do { a = ri(11, 99) / 10; b = pick([3, 6, 7, 9, 1.3, 2.7, 11]); } while (Math.abs(a / b * 1000 - Math.round(a / b * 1000)) < 1e-6 || roundTo(a / b, p[0]) <= 0);
      const v = roundTo(a / b, p[0]), k = p[0] === 1 ? 10 : p[0] === 0.1 ? 100 : 1000, tr = Math.floor(a / b * k) / k, other = dz(Math.floor(dz(a / b / p[0])) * p[0]);
      return N(`${D2(a)} ÷ ${D2(b)}의 몫을 반올림하여 <b>${p[1]}까지</b> 나타내면?`, v, `${p[1]}보다 한 자리 아래까지 구해 반올림해요: ${D2(a)} ÷ ${D2(b)} = ${tr}… → <b>${nf(v)}</b>`, [other === v ? dz(v + p[0]) : other, dz(v * 10), dz(v + p[0] * 2)]); } },
  { id:'dd-rem', name:'나누어 주고 남는 양 알아보기', std:'6수01-15', lv:[3,4], t:'mc',
    g(){ const k = ri(2, 6), n = ri(3, 9), r = ri(1, k * 10 - 1) / 10, x = dz(k * n + r), it = pick([['물', 'L', '한 병에', '병', '몇 병이 되고'], ['끈', 'm', '한 사람에게', '명', '몇 명에게 줄 수 있고'], ['콩', 'kg', '한 봉지에', '봉지', '몇 봉지가 되고']]);
      return MC(`${it[0]} ${D2(x)} ${it[1]}를 ${it[2]} ${k} ${it[1]}씩 나누면 ${it[4]}, 남는 ${it[0]}은(는) 몇 ${it[1]}일까요?`,
        [`${n}${it[3]}, ${D2(r)} ${it[1]}`, `${n + 1}${it[3]}, ${D2(r)} ${it[1]}`, `${n}${it[3]}, ${D2(dz(r + k))} ${it[1]}`, `${n - 1}${it[3]}, ${D2(dz(r + k))} ${it[1]}`],
        `${D2(x)} ÷ ${k}의 몫을 자연수까지 구하면 ${n}, 남는 양 ${D2(x)} - ${k} × ${n} = <b>${D2(r)} ${it[1]}</b> (남는 양은 ${k}보다 작아야 해요)`); } },
  { id:'dd-word', name:'소수의 나눗셈 생활 문제 (몇 배)', std:'6수01-15', lv:[3,4], t:'both',
    g(){ const b = ri(11, 19) / 10 + ri(0, 9) / 100, q = pick([1.5, 2, 2.4, 2.5, 3, 1.2, 1.6]), a = dz(b * q);
      if (Math.round(a * 100) !== dz(a * 100)) return this.g();
      return N(`농구대의 높이는 ${D2(a)} m, ${pick(NAMES)}의 키는 ${D2(b)} m예요. 농구대의 높이는 키의 몇 배일까요?`, q, `${D2(a)} ÷ ${D2(b)} = <b>${D2(q)}배</b>`, [q * 10, q / 10, dz(q + 0.5)], '배'); } },
  { id:'dd-count', name:'(자연수)÷(소수) 생활 문제', std:'6수01-15', lv:[4,4], t:'both',
    g(){ const d = pick([0.4, 0.5, 0.25, 0.75, 1.5]), q = ri(4, 30), n = dz(d * q);
      if (!Number.isInteger(n)) return this.g();
      return N(`식빵 한 개를 만드는 데 밀가루가 ${D2(d)} kg 필요해요. 밀가루 ${n} kg으로 식빵을 몇 개 만들 수 있을까요?`, q, `${n} ÷ ${D2(d)} = <b>${q}개</b>`, [q / 10, q * 10, n * d], '개'); } },
  { id:'dd-gap', name:'간격과 소수의 나눗셈', std:'6수01-15', lv:[4,5], t:'both',
    g(){ const d = pick([2.5, 1.5, 0.5, 3.5, 1.2]), k = ri(4, 20), L = dz(d * k);
      return N(`길이가 ${D2(L)} m인 곧은 길의 처음부터 끝까지 ${D2(d)} m 간격으로 장애물을 세우려고 해요. 필요한 장애물은 몇 개일까요?`, k + 1, `간격 수 ${D2(L)} ÷ ${D2(d)} = ${k} → 처음과 끝에도 세우므로 ${k} + 1 = <b>${k + 1}개</b>`, [k, k + 2, k - 1], '개'); } },
  { id:'dd-wrong', name:'잘못 계산한 식에서 바르게 계산하기', std:'6수01-15', lv:[5,5], t:'both',
    g(){ const d = pick([0.2, 0.4, 0.5, 0.8, 2.5]), x = ri(2, 30) / 10 * (ri(0, 1) ? 1 : 10), wr = dz(x * d), right = dz(x / d);
      if (Math.round(right * 1000) !== dz(right * 1000)) return this.g();
      return N(`어떤 수를 ${D2(d)}로 나누어야 할 것을 잘못하여 곱했더니 ${D2(wr)}이(가) 되었어요. 바르게 계산한 몫은?`, right, `어떤 수 = ${D2(wr)} ÷ ${D2(d)} = ${D2(x)} → ${D2(x)} ÷ ${D2(d)} = <b>${D2(right)}</b>`, [x, wr, dz(x * d * d)]); } }
]});

/* ─────────────── 4. 비례식과 비례배분 ─────────────── */
A.addUnit({ key:'6-2-4', title:'비례식과 비례배분', items:[
  { id:'ratio-eq', name:'비의 성질 알기', std:'6수02-04', lv:[1,2], t:'both',
    g(){ const a = ri(1, 9), b = ri(2, 9), k = ri(2, 6);
      return ri(0, 1) ? N(`비의 성질을 이용하여 □ 안에 알맞은 수를 구하세요. ${E(`${a} : ${b} = ${a * k} : □`)}`, b * k, `전항에 ${k}를 곱했으므로 후항에도 ${k}를 곱해요: <b>${b * k}</b>`, [b + k, b * k + k, a * k])
        : N(`비의 성질을 이용하여 □ 안에 알맞은 수를 구하세요. ${E(`${a * k} : ${b * k} = □ : ${b}`)}`, a, `후항을 ${k}로 나누었으므로 전항도 ${k}로 나누어요: <b>${a}</b>`, [a * k, a + k, b]); } },
  { id:'prop-terms', name:'비례식의 외항과 내항', std:'6수02-04', lv:[1,2], t:'mc',
    g(){ const a = ri(2, 9), b = ri(2, 9), k = ri(2, 4), t = ri(0, 1);
      return MC(`비례식 ${a} : ${b} = ${a * k} : ${b * k}에서 <b>${t ? '외항' : '내항'}</b>은?`, t ? [`${a}, ${b * k}`, `${b}, ${a * k}`, `${a}, ${b}`, `${a * k}, ${b * k}`] : [`${b}, ${a * k}`, `${a}, ${b * k}`, `${a}, ${b}`, `${a * k}, ${b * k}`], `바깥쪽 두 항(${a}, ${b * k})이 외항, 안쪽 두 항(${b}, ${a * k})이 내항이에요.`); } },
  { id:'ratio-simp', name:'간단한 자연수의 비로 나타내기', std:'6수02-04', lv:[2,3], t:'mc',
    g(){ const t = ri(0, 2); let a = ri(1, 9), b = ri(1, 9); if (a === b) b = a % 9 + 1; const g = gcd(a, b); a /= g; b /= g;
      if (t === 0){ const k = ri(2, 6); return MC(`${a * k} : ${b * k}를 가장 간단한 자연수의 비로 나타내면?`, [`${a} : ${b}`, `${b} : ${a}`, `${a * 2} : ${b * 2}`, `${a + 1} : ${b + 1}`], `전항과 후항을 최대공약수 ${k}(으)로 나누어요 → <b>${a} : ${b}</b>`); }
      if (t === 1) return MC(`${nf(a / 10)} : ${nf(b / 10)}을(를) 가장 간단한 자연수의 비로 나타내면?`, [`${a} : ${b}`, `${b} : ${a}`, `${a * 10} : ${b * 10}`, `${a} : ${b * 10}`], `전항과 후항에 10을 곱해요 → <b>${a} : ${b}</b>`);
      const p = a + 1, q = b + 1, G = gcd(p, q);
      return MC(`${fr(1, p)} : ${fr(1, q)}을(를) 가장 간단한 자연수의 비로 나타내면?`, [`${q / G} : ${p / G}`, `${p / G} : ${q / G}`, `1 : 1`, `${p} : ${p * q}`], `두 분모의 최소공배수 ${p * q / G}을(를) 곱해요 → <b>${q / G} : ${p / G}</b>`); } },
  { id:'ratio-same', name:'비율이 같은 비 찾기', std:'6수02-04', lv:[3,3], t:'mc',
    g(){ const a = ri(2, 7), b = ri(2, 9), g = gcd(a, b), A0 = a / g, B0 = b / g, k = ri(2, 5);
      if (A0 === B0) return this.g();
      return MC(`${A0} : ${B0}와(과) 비율이 같은 비는?`, [`${A0 * k} : ${B0 * k}`, `${B0 * k} : ${A0 * k}`, `${A0 + k} : ${B0 + k}`, `${A0 * k} : ${B0 + k}`], `전항과 후항에 같은 수 ${k}를 곱한 비 → <b>${A0 * k} : ${B0 * k}</b> (같은 수를 더하면 비율이 달라져요)`); } },
  { id:'prop-check', name:'비례식인 것 찾기', std:'6수02-04', lv:[2,3], t:'mc',
    g(){ const mk = ok => { const a = ri(2, 9), b = ri(2, 9), k = ri(2, 4); return ok || a === b ? `${a} : ${b} = ${a * k} : ${b * k}` : pick([`${a} : ${b} = ${b * k} : ${a * k}`, `${a} : ${b} = ${a + k} : ${b + k}`, `${a} : ${b} = ${a * k} : ${b * k + 1}`]); };
      return MC('비례식인 것은?', [mk(true), mk(false), mk(false), mk(false)], '두 비의 비율이 같아야 비례식이에요. 외항의 곱과 내항의 곱이 같은지 확인해 봐요.'); } },
  { id:'prop-solve', name:'비례식의 성질로 □ 구하기', std:'6수02-04', lv:[2,3], t:'both',
    g(){ const a = ri(2, 9), b = ri(2, 9), k = ri(2, 7), pos = ri(0, 3), v = [a, b, a * k, b * k], s = v.map((x, i) => i === pos ? '□' : x);
      return N(`비례식에서 □ 안에 알맞은 수는? ${E(`${s[0]} : ${s[1]} = ${s[2]} : ${s[3]}`)}`, v[pos], `외항의 곱 = 내항의 곱: ${a} × ${b * k} = ${b} × ${a * k} → □ = <b>${v[pos]}</b>`, [v[pos] + 1, v[pos] * 2, v[(pos + 1) % 4]]); } },
  { id:'prop-word', name:'비례식 생활 문제', std:'6수02-04', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const n = ri(2, 5), p = ri(3, 12) * 100, m = n * ri(2, 4), nm = pick(['연필', '공책', '지우개']); return N(`${nm} ${n}개의 값이 ${(n * p).toLocaleString()}원이에요. 같은 ${nm} ${m}개의 값은 얼마일까요?`, m * p, `${n} : ${(n * p).toLocaleString()} = ${m} : □ → □ = <b>${(m * p).toLocaleString()}원</b>`, [m * p + p, n * p * m, m * p / 2], '원'); }
      if (t === 1){ const h = ri(2, 4), c = ri(3, 9) * h, H2 = h * ri(2, 4); return N(`자동차 공장에서 ${h}시간 동안 자동차 ${c}대를 만들어요. 같은 빠르기로 ${H2}시간 동안 만들 수 있는 자동차는 몇 대일까요?`, c / h * H2, `${h} : ${c} = ${H2} : □ → □ = ${c} × ${H2} ÷ ${h} = <b>${c / h * H2}대</b>`, [c + H2, c * H2, c / h], '대'); }
      const a = ri(3, 8), b = ri(2, 6), k = ri(2, 6) * 3; return N(`가로와 세로의 비가 ${a} : ${b}인 텔레비전의 세로가 ${b * k} cm일 때, 가로는 몇 cm일까요?`, a * k, `${a} : ${b} = □ : ${b * k} → □ = <b>${a * k} cm</b>`, [b * k, a * k + b, a + b * k], 'cm'); } },
  { id:'prop-recipe', name:'요리 재료의 양 구하기', std:'6수02-04', lv:[4,4], t:'both',
    g(){ const p = ri(2, 4), q = p + ri(1, 4), g1 = ri(3, 12) * 10 * p / gcd(p, 10);
      const per = g1 / p, need = per * q;
      if (!Number.isInteger(need)) return this.g();
      return N(`스파게티 ${p}인분을 만드는 데 면이 ${g1} g 필요해요. ${q}인분을 만들려면 면이 몇 g 필요할까요?`, need, `${p} : ${g1} = ${q} : □ → □ = ${g1} × ${q} ÷ ${p} = <b>${need} g</b>`, [g1 + q, g1 * q, need + per], 'g'); } },
  { id:'prop-inner', name:'내항의 곱을 이용하여 □ 구하기', std:'6수02-04', lv:[4,5], t:'both',
    g(){ const A1 = ri(3, 12), B1 = ri(2, 6), M = A1 * B1 * ri(1, 3), e1 = M / A1, e2 = M / B1;   // A1 : ㉠ = B1 : ㉡
      if (!Number.isInteger(e1) || !Number.isInteger(e2)) return this.g();
      return N(`비례식 ${A1} : ㉠ = ${B1} : ㉡에서 내항의 곱이 ${M}일 때, ㉠에 알맞은 수는?`, e2, `내항의 곱: ㉠ × ${B1} = ${M} → ㉠ = <b>${e2}</b> (외항의 곱도 ${M}: ${A1} × ㉡ = ${M} → ㉡ = ${e1})`, [e1, M / 2, e2 + B1]); } },
  { id:'share', name:'비례배분하기', std:'6수02-05', lv:[2,3], t:'both',
    g(){ const a = ri(1, 5), b = ri(1, 5) + 1, t = ri(0, 1), tot = (a + b) * ri(3, 12) * (ri(0, 1) ? 10 : 1), n1 = pick(NAMES), n2 = pick(NAMES.filter(x => x !== n1)), v = t ? tot * a / (a + b) : tot * b / (a + b);
      return N(`구슬 ${tot}개를 ${n1}와(과) ${n2}가 ${a} : ${b}로 나누어 가지려고 해요. <b>${t ? n1 : n2}</b>는 몇 개를 가질까요?`, v, `${tot} × ${fr(t ? a : b, a + b)} = <b>${v}개</b>`, [tot - v, Math.round(tot / 2), tot * (t ? a : b) / 10], '개'); } },
  { id:'share-word', name:'비례배분 생활 문제', std:'6수02-05', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2), a = ri(2, 5), b = ri(2, 7);
      if (a === b) return this.g();
      if (t === 0){ const tot = (a + b) * ri(10, 50); return N(`어느 공연을 관람한 사람이 모두 ${tot}명이고, 어른과 어린이 수의 비는 ${a} : ${b}예요. 어린이는 몇 명일까요?`, tot * b / (a + b), `${tot} × ${fr(b, a + b)} = <b>${tot * b / (a + b)}명</b>`, [tot * a / (a + b), tot / 2, tot - a], '명'); }
      if (t === 1){ const tot = (a + b) * ri(2, 9) * 100; return N(`포도주스 ${tot} mL를 물과 포도 원액을 ${a} : ${b}로 섞어 만들려고 해요. 포도 원액은 몇 mL 필요할까요?`, tot * b / (a + b), `${tot} × ${fr(b, a + b)} = <b>${tot * b / (a + b)} mL</b>`, [tot * a / (a + b), tot / 2, tot - b * 100], 'mL'); }
      const tot = (a + b) * ri(1, 9) * 1000; return N(`용돈 ${tot.toLocaleString()}원을 나와 동생이 ${a} : ${b}로 나누어 가지려고 해요. 내가 가지는 돈은 얼마일까요?`, tot * a / (a + b), `${tot.toLocaleString()} × ${fr(a, a + b)} = <b>${(tot * a / (a + b)).toLocaleString()}원</b>`, [tot * b / (a + b), tot / 2, tot - a * 1000], '원'); } },
  { id:'share-rect', name:'둘레와 비로 직사각형의 길이·넓이 구하기', std:'6수02-05', lv:[4,5], t:'both',
    g(){ const a = ri(1, 5), b = ri(a + 1, 8), k = ri(2, 6), P = 2 * (a + b) * k, t = ri(0, 1);
      return t ? N(`둘레가 ${P} m이고 가로와 세로의 비가 ${a} : ${b}인 직사각형 모양의 텃밭이 있어요. 세로는 몇 m일까요?`, b * k, `가로 + 세로 = ${P} ÷ 2 = ${P / 2} → 세로 = ${P / 2} × ${fr(b, a + b)} = <b>${b * k} m</b>`, [a * k, P * b / (a + b), b * k * 2], 'm')
        : N(`둘레가 ${P} m이고 가로와 세로의 비가 ${a} : ${b}인 직사각형의 넓이는 몇 m²일까요?`, a * k * b * k, `가로 + 세로 = ${P / 2} → 가로 ${a * k} m, 세로 ${b * k} m → 넓이 <b>${a * k * b * k} m²</b>`, [P, a * b * k, (a + b) * k * k], 'm²'); } }
]});

/* ─────────────── 5. 원의 둘레와 넓이 ─────────────── */
A.addUnit({ key:'6-2-5', title:'원의 둘레와 넓이', items:[
  { id:'circ-ratio', name:'원주와 원주율 알기', std:'6수03-15', lv:[1,2], t:'mc',
    g(){ return pick([
      () => MC('원주율에 대한 설명으로 옳은 것은?', ['원의 크기와 관계없이 (원주) ÷ (지름)은 일정해요.', '원이 클수록 원주율도 커져요.', '원주율은 정확히 3이에요.', '(지름) ÷ (원주)를 원주율이라고 해요.'], '(원주) ÷ (지름)의 값은 원의 크기와 관계없이 일정해요. 이 값을 <b>원주율</b>이라 하고 3.14 등으로 어림해서 써요.'),
      () => MC('원주와 지름의 관계로 옳은 것은?', ['원주는 지름의 3배보다 길고 4배보다 짧아요.', '원주는 지름의 2배예요.', '지름이 길어지면 원주는 짧아져요.', '원주는 반지름의 3배예요.'], '원 안의 정육각형 둘레(지름의 3배) &lt; 원주 &lt; 원 밖의 정사각형 둘레(지름의 4배)'),
      () => MC('원의 둘레를 무엇이라고 할까요?', ['원주', '지름', '원주율', '반지름'], '원의 둘레를 <b>원주</b>라고 해요.')])(); } },
  { id:'circum', name:'원주 구하기', std:'6수03-16', lv:[1,2], t:'both',
    g(){ const r = ri(2, 15);
      return ri(0, 1) ? N(`반지름이 ${r} cm인 원의 원주는 몇 cm일까요? (원주율: 3.14)`, 2 * r * PI, `(원주) = (지름) × (원주율) = ${2 * r} × 3.14 = <b>${D2(2 * r * PI)} cm</b>`, [r * PI, r * r * PI, 2 * r * 3], 'cm', { fig: circFig(`${r} cm`) })
        : N(`지름이 ${2 * r} cm인 원의 원주는 몇 cm일까요? (원주율: 3.14)`, 2 * r * PI, `${2 * r} × 3.14 = <b>${D2(2 * r * PI)} cm</b>`, [4 * r * PI, r * PI, r * r * PI], 'cm', { fig: circFig(`${2 * r} cm`, 'd') }); } },
  { id:'diam-from', name:'원주로 지름(반지름) 구하기', std:'6수03-16', lv:[2,3], t:'both',
    g(){ const d = 2 * ri(2, 15), p = pick([3, 3.1, 3.14]), t = ri(0, 1);
      return t ? N(`원주가 ${D2(d * p)} cm인 원의 지름은 몇 cm일까요? (원주율: ${p})`, d, `(지름) = (원주) ÷ (원주율) = ${D2(d * p)} ÷ ${p} = <b>${d} cm</b>`, [d / 2, d * 2, d + 1], 'cm')
        : N(`원주가 ${D2(d * p)} cm인 원을 그리려면 컴퍼스를 몇 cm만큼 벌려야 할까요? (원주율: ${p})`, d / 2, `지름 ${D2(d * p)} ÷ ${p} = ${d} cm → 컴퍼스는 반지름만큼: <b>${d / 2} cm</b>`, [d, d * 2, d / 2 + 1], 'cm'); } },
  { id:'circ-cmp', name:'원의 크기 비교하기', std:'6수03-16', lv:[3,3], t:'mc',
    g(){ const r = shuffle(range(3, 12)).slice(0, 3), lab = [`반지름이 ${r[0]} cm인 원`, `지름이 ${2 * r[1]} cm인 원`, `원주가 ${D2(2 * r[2] * PI)} cm인 원`], i = r.indexOf(Math.max(...r));
      return MC('가장 큰 원은? (원주율: 3.14)', [lab[i], ...lab.filter((_, k) => k !== i)], `반지름으로 비교해요: ${r[0]} cm, ${r[1]} cm, ${D2(2 * r[2] * PI)} ÷ 3.14 ÷ 2 = ${r[2]} cm → <b>${lab[i]}</b>`); } },
  { id:'circ-word', name:'원주 생활 문제 (바퀴, 굴렁쇠)', std:'6수03-16', lv:[3,4], t:'both',
    g(){ const d = pick([50, 60, 70, 80]), n = ri(2, 10);
      return ri(0, 1) ? N(`지름이 ${d} cm인 굴렁쇠를 ${n}바퀴 굴렸어요. 굴렁쇠가 굴러간 거리는 몇 cm일까요? (원주율: 3.14)`, d * PI * n, `한 바퀴 = ${d} × 3.14 = ${D2(d * PI)} cm → × ${n} = <b>${D2(d * PI * n)} cm</b>`, [d * PI, d * n, d * PI * n / 2], 'cm')
        : N(`지름이 ${d} cm인 바퀴가 굴러간 거리가 ${D2(d * PI * n)} cm예요. 바퀴는 몇 바퀴 굴렀을까요? (원주율: 3.14)`, n, `한 바퀴 ${D2(d * PI)} cm → ${D2(d * PI * n)} ÷ ${D2(d * PI)} = <b>${n}바퀴</b>`, [n + 1, n * 2, n - 1], '바퀴'); } },
  { id:'circ-lamp', name:'원 모양 둘레에 일정한 간격으로 놓기', std:'6수03-16', lv:[4,5], t:'both',
    g(){ const d = pick([50, 100, 150, 200]), g = pick([3.14, 6.28, 7.85, 15.7]), n = dz(d * PI / g);
      if (!Number.isInteger(n)) return this.g();
      return N(`지름이 ${d} m인 원 모양 호수의 둘레에 ${g} m 간격으로 가로등을 세우려고 해요. 필요한 가로등은 몇 개일까요? (원주율: 3.14)`, n, `둘레 ${d} × 3.14 = ${D2(d * PI)} m → ${D2(d * PI)} ÷ ${g} = <b>${n}개</b> (원은 처음과 끝이 만나서 +1을 하지 않아요)`, [n + 1, n - 1, n * 2], '개'); } },
  { id:'area-est', name:'원의 넓이 어림하기', std:'6수03-16', lv:[2,3], t:'mc',
    g(){ const r = ri(3, 12);
      return MC(`반지름이 ${r} cm인 원의 넓이를 원 안의 정사각형과 원 밖의 정사각형으로 어림했어요. 알맞은 것은?`, [`${2 * r * r} cm² &lt; (원의 넓이) &lt; ${4 * r * r} cm²`, `${r * r} cm² &lt; (원의 넓이) &lt; ${2 * r * r} cm²`, `${4 * r * r} cm² &lt; (원의 넓이) &lt; ${6 * r * r} cm²`, `${2 * r} cm² &lt; (원의 넓이) &lt; ${4 * r} cm²`],
        `원 밖 정사각형: ${2 * r} × ${2 * r} = ${4 * r * r} cm², 원 안 정사각형(마름모): ${2 * r} × ${2 * r} ÷ 2 = ${2 * r * r} cm²`); } },
  { id:'circle-area', name:'원의 넓이 구하기', std:'6수03-16', lv:[2,3], t:'both',
    g(){ const r = ri(2, 15);
      return ri(0, 1) ? N(`반지름이 ${r} cm인 원의 넓이는 몇 cm²일까요? (원주율: 3.14)`, r * r * PI, `(반지름) × (반지름) × (원주율) = ${r} × ${r} × 3.14 = <b>${D2(r * r * PI)} cm²</b>`, [2 * r * PI, 4 * r * r * PI, r * PI], 'cm²', { fig: circFig(`${r} cm`) })
        : N(`지름이 ${2 * r} cm인 원의 넓이는 몇 cm²일까요? (원주율: 3.14)`, r * r * PI, `반지름 ${r} cm → ${r} × ${r} × 3.14 = <b>${D2(r * r * PI)} cm²</b>`, [4 * r * r * PI, 2 * r * PI, r * PI * 2 * 2], 'cm²', { fig: circFig(`${2 * r} cm`, 'd') }); } },
  { id:'area-from-circ', name:'원주를 알 때 원의 넓이 구하기', std:'6수03-16', lv:[4,5], t:'both',
    g(){ const r = ri(2, 12);
      return N(`원주가 ${D2(2 * r * PI)} cm인 원의 넓이는 몇 cm²일까요? (원주율: 3.14)`, r * r * PI, `지름 = ${D2(2 * r * PI)} ÷ 3.14 = ${2 * r} cm, 반지름 ${r} cm → ${r} × ${r} × 3.14 = <b>${D2(r * r * PI)} cm²</b>`, [4 * r * r * PI, 2 * r * PI, r * PI], 'cm²'); } },
  { id:'area-ring', name:'여러 가지 원 모양의 넓이 (고리, 반원)', std:'6수03-16', lv:[3,4], t:'both',
    g(){ if (ri(0, 1)){ const R = ri(5, 12), r = ri(2, R - 2); return N(`반지름이 ${R} cm인 원에서 반지름이 ${r} cm인 원을 오려 낸 고리 모양의 넓이는? (원주율: 3.14)`, (R * R - r * r) * PI, `(큰 원) - (작은 원) = ${R} × ${R} × 3.14 - ${r} × ${r} × 3.14 = <b>${D2((R * R - r * r) * PI)} cm²</b>`, [(R - r) * (R - r) * PI, R * R * PI, (R * R + r * r) * PI], 'cm²'); }
      const r = 2 * ri(1, 6); return N(`지름이 ${2 * r} cm인 반원의 넓이는? (원주율: 3.14)`, r * r * PI / 2, `${r} × ${r} × 3.14 ÷ 2 = <b>${D2(r * r * PI / 2)} cm²</b>`, [r * r * PI, 2 * r * 2 * r * PI / 2, r * PI], 'cm²'); } },
  { id:'area-square', name:'정사각형과 원으로 이루어진 넓이', std:'6수03-16', lv:[4,4], t:'both',
    g(){ const a = 2 * ri(2, 10), r = a / 2;
      return ri(0, 1) ? N(`한 변이 ${a} cm인 정사각형 안에 꼭 맞게 그린 원의 넓이는? (원주율: 3.14)`, r * r * PI, `원의 지름 = 정사각형의 한 변 ${a} cm → 반지름 ${r} cm → <b>${D2(r * r * PI)} cm²</b>`, [a * a * PI, a * a, r * PI * 2], 'cm²')
        : N(`한 변이 ${a} cm인 정사각형에서 꼭 맞게 그린 원을 뺀 나머지 넓이는? (원주율: 3.14)`, a * a - r * r * PI, `${a} × ${a} - ${r} × ${r} × 3.14 = ${a * a} - ${D2(r * r * PI)} = <b>${D2(a * a - r * r * PI)} cm²</b>`, [r * r * PI, a * a, a * a - a * PI], 'cm²'); } },
  { id:'area-rel', name:'반지름과 넓이의 관계', std:'6수03-16', lv:[5,5], t:'both',
    g(){ const k = ri(2, 4);
      return N(`반지름을 ${k}배로 늘인 원의 넓이는 처음 원의 넓이의 몇 배일까요?`, k * k, `넓이 = 반지름 × 반지름 × 원주율 → ${k} × ${k} = <b>${k * k}배</b> (원주는 ${k}배)`, [k, 2 * k, k * k * 2], '배'); } }
]});

/* ─────────────── 6. 원기둥, 원뿔, 구 ─────────────── */
A.addUnit({ key:'6-2-6', title:'원기둥, 원뿔, 구', items:[
  { id:'cyl-prop', name:'원기둥 알기', std:'6수03-07', lv:[1,2], t:'mc',
    g(){ return pick([
      () => MC('원기둥에 대한 설명으로 옳은 것은?', ['두 밑면은 서로 평행하고 합동인 원이에요.', '꼭짓점이 1개 있어요.', '옆면은 평평한 직사각형이에요.', '밑면이 1개예요.'], '원기둥은 두 밑면이 서로 평행하고 합동인 원이고, 옆면은 굽은 면이에요. 꼭짓점과 모서리가 없어요.'),
      () => MC('원기둥과 각기둥의 공통점은?', ['밑면이 2개이고 서로 평행해요.', '밑면의 모양이 같아요.', '옆면이 굽은 면이에요.', '꼭짓점이 있어요.'], '둘 다 서로 평행하고 합동인 두 밑면이 있어요. 원기둥의 밑면은 원, 각기둥의 밑면은 다각형이에요.')])(); } },
  { id:'cone-term', name:'원뿔의 구성 요소', std:'6수03-07', lv:[1,1], t:'mc',
    g(){ return pick([
      () => MC('원뿔에서 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분을 무엇이라고 할까요?', ['모선', '높이', '지름', '반지름'], '원뿔의 꼭짓점과 밑면 둘레의 한 점을 이은 선분은 <b>모선</b>, 꼭짓점에서 밑면에 수직인 선분의 길이는 <b>높이</b>예요.'),
      () => MC('원뿔에 대한 설명으로 옳은 것은?', ['모선은 셀 수 없이 많고 길이가 모두 같아요.', '밑면이 2개예요.', '높이는 모선보다 길어요.', '꼭짓점이 없어요.'], '원뿔의 모선은 셀 수 없이 많고 모두 길이가 같아요. 모선은 항상 높이보다 길어요.')])(); } },
  { id:'cone-peri', name:'원뿔을 앞에서 본 모양', std:'6수03-07', lv:[3,3], t:'both',
    g(){ const l = ri(5, 15), d = 2 * ri(2, l - 1);
      return N(`모선의 길이가 ${l} cm, 밑면의 지름이 ${d} cm인 원뿔을 앞에서 본 모양은 이등변삼각형이에요. 이 삼각형의 둘레는 몇 cm일까요?`, 2 * l + d, `두 변은 모선(${l} cm), 한 변은 밑면의 지름(${d} cm) → <b>${2 * l + d} cm</b>`, [l + d, 2 * l + d / 2, 2 * d + l], 'cm'); } },
  { id:'cone-area', name:'원뿔을 앞에서 본 모양의 넓이', std:'6수03-07', lv:[5,5], t:'both',
    g(){ const h = ri(4, 15), d = 2 * ri(2, 9);
      return N(`높이가 ${h} cm, 밑면의 지름이 ${d} cm인 원뿔을 앞에서 본 모양의 넓이는 몇 cm²일까요?`, d * h / 2, `앞에서 본 모양은 밑변 ${d} cm, 높이 ${h} cm인 삼각형 → ${d} × ${h} ÷ 2 = <b>${d * h / 2} cm²</b>`, [d * h, d * h / 4, (d / 2) * (d / 2) * 3.14], 'cm²'); } },
  { id:'sphere-term', name:'구 알기', std:'6수03-07', lv:[1,2], t:'mc',
    g(){ return MC('구에 대한 설명으로 옳은 것은?', ['어느 방향에서 보아도 모양이 원이에요.', '밑면이 1개 있어요.', '꼭짓점이 1개 있어요.', '반지름의 길이가 모두 달라요.'], '구는 어느 방향에서 보아도 원 모양이에요. 구의 반지름은 셀 수 없이 많고 길이가 모두 같아요.'); } },
  { id:'sphere-diam', name:'구의 반지름과 지름', std:'6수03-07', lv:[2,2], t:'both',
    g(){ const r = ri(3, 15);
      return N(`구의 중심에서 구의 겉면의 한 점을 이은 선분의 길이가 ${r} cm예요. 구를 반으로 잘랐을 때 생기는 원의 지름은 몇 cm일까요?`, 2 * r, `중심과 겉면을 이은 선분 = 구의 반지름 ${r} cm → 지름 <b>${2 * r} cm</b>`, [r, r * r, r + 2], 'cm'); } },
  { id:'rot-solid', name:'평면도형을 돌려 만든 입체도형', std:'6수03-07', lv:[2,3], t:'mc',
    g(){ const c = pick([['직사각형의 한 변', '원기둥'], ['직각삼각형의 직각을 낀 한 변', '원뿔'], ['반원의 지름', '구']]);
      return MC(`${c[0]}을(를) 기준으로 한 바퀴 돌리면 어떤 입체도형이 될까요?`, [c[1], ...['원기둥', '원뿔', '구', '각기둥'].filter(x => x !== c[1])], `${c[0]}을(를) 축으로 한 바퀴 돌리면 <b>${c[1]}</b>이(가) 만들어져요.`); } },
  { id:'rot-dims', name:'돌려 만든 입체도형의 길이', std:'6수03-07', lv:[4,5], t:'both',
    g(){ const a = ri(2, 9), b = ri(3, 12), t = ri(0, 1);
      return t ? N(`가로 ${a} cm, 세로 ${b} cm인 직사각형을 세로를 기준으로 한 바퀴 돌려 원기둥을 만들었어요. 원기둥의 밑면의 지름은 몇 cm일까요?`, 2 * a, `돌리는 축에서 떨어진 가로 ${a} cm가 밑면의 반지름 → 지름 <b>${2 * a} cm</b>`, [a, b, 2 * b], 'cm')
        : N(`가로 ${a} cm, 세로 ${b} cm인 직사각형을 세로를 기준으로 한 바퀴 돌려 만든 원기둥을 앞에서 본 모양의 넓이는?`, 2 * a * b, `앞에서 본 모양: 가로 ${2 * a} cm(지름), 세로 ${b} cm인 직사각형 → <b>${2 * a * b} cm²</b>`, [a * b, a * a * 3.14, 2 * a + 2 * b], 'cm²'); } },
  { id:'solid-compare', name:'원기둥, 원뿔, 구 비교하기', std:'6수03-07', lv:[2,3], t:'mc',
    g(){ return pick([
      () => MC('밑면이 없는 입체도형은?', ['구', '원기둥', '원뿔', '각뿔'], '구는 밑면도, 꼭짓점도 없어요. 원뿔은 밑면 1개, 원기둥은 밑면 2개예요.'),
      () => MC('꼭짓점이 있는 입체도형은?', ['원뿔', '원기둥', '구', '없음'], '원뿔에는 뾰족한 꼭짓점이 1개 있어요.'),
      () => MC('위에서 본 모양과 앞에서 본 모양이 모두 원인 입체도형은?', ['구', '원기둥', '원뿔', '삼각기둥'], '구는 어느 방향에서 보아도 원이에요. 원기둥을 앞에서 보면 직사각형, 원뿔은 삼각형이에요.')])(); } },
  { id:'cyl-net', name:'원기둥의 전개도에서 길이 구하기', std:'6수03-08', lv:[2,3], t:'both',
    g(){ const r = ri(2, 10), h = ri(3, 15);
      return ri(0, 1) ? N(`밑면의 반지름이 ${r} cm, 높이가 ${h} cm인 원기둥의 전개도에서 옆면(직사각형)의 가로는 몇 cm일까요? (원주율: 3.14)`, 2 * r * PI, `옆면의 가로 = 밑면의 둘레 = ${2 * r} × 3.14 = <b>${D2(2 * r * PI)} cm</b>`, [r * PI, h, r * r * PI], 'cm')
        : N(`밑면의 반지름이 ${r} cm, 높이가 ${h} cm인 원기둥의 전개도에서 옆면의 세로는 몇 cm일까요?`, h, `옆면의 세로 = 원기둥의 높이 = <b>${h} cm</b>`, [r, 2 * r, h + r], 'cm'); } },
  { id:'cyl-net-area', name:'원기둥의 옆면의 넓이', std:'6수03-08', lv:[3,4], t:'both',
    g(){ const r = ri(2, 10), h = ri(3, 15);
      return N(`밑면의 지름이 ${2 * r} cm, 높이가 ${h} cm인 원기둥의 전개도에서 옆면의 넓이는 몇 cm²일까요? (원주율: 3.14)`, 2 * r * PI * h, `가로 ${2 * r} × 3.14 = ${D2(2 * r * PI)} cm, 세로 ${h} cm → <b>${D2(2 * r * PI * h)} cm²</b>`, [r * PI * h, 2 * r * h, r * r * PI * h], 'cm²'); } },
  { id:'cyl-height', name:'옆면의 넓이로 높이 구하기', std:'6수03-08', lv:[4,5], t:'both',
    g(){ const r = ri(2, 8), h = ri(3, 12);
      return N(`밑면의 반지름이 ${r} cm인 원기둥의 전개도에서 옆면의 넓이가 ${D2(2 * r * PI * h)} cm²예요. 원기둥의 높이는 몇 cm일까요? (원주율: 3.14)`, h, `옆면의 가로 = ${2 * r} × 3.14 = ${D2(2 * r * PI)} cm → 높이 = ${D2(2 * r * PI * h)} ÷ ${D2(2 * r * PI)} = <b>${h} cm</b>`, [h * 2, r, h + 1], 'cm'); } }
]});
})();
