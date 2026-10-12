/* =========================================================
   6학년 1학기 문제 만들기 — 수학익힘 6-1(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, gcd, lcm, range, dz, nf, josa, F, toF, frH, fr, svg, txt, line, tableH, cuboidFig } = A;
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
const POLY = ['', '', '', '삼각', '사각', '오각', '육각', '칠각', '팔각', '구각', '십각', '십일각', '십이각'];
const CMP = (a, b) => a > b + 1e-9 ? '&gt;' : a < b - 1e-9 ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];

/* ---------- 공통 그림 (6학년에서 함께 써요) ---------- */
const COLORS = ['#8EC5F4', '#FFC56B', '#9BE0A6', '#FF9FA8', '#C9A7FF'];
const band = items => { let x = 10, s = ''; items.forEach((it, i) => { const w = it.p * 4.6; s += `<rect x="${x.toFixed(1)}" y="10" width="${w.toFixed(1)}" height="46" fill="${COLORS[i % 5]}" stroke="#22314A" stroke-width="1.5"/>` + txt(x + w / 2, 26, it.n, { size: 12, bold: true }) + txt(x + w / 2, 44, it.show === false ? '?' : it.p + '%', { size: 12 }); x += w; });
  return svg(480, 66, s, 'wide'); };
const pie = (items, r = 80) => { let a0 = -Math.PI / 2, s = ''; const C = r + 10;
  items.forEach((it, i) => { const a1 = a0 + it.p / 100 * Math.PI * 2, L = a1 - a0 > Math.PI ? 1 : 0, am = (a0 + a1) / 2;
    s += `<path d="M${C} ${C} L${(C + r * Math.cos(a0)).toFixed(1)} ${(C + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 ${L} 1 ${(C + r * Math.cos(a1)).toFixed(1)} ${(C + r * Math.sin(a1)).toFixed(1)} Z" fill="${COLORS[i % 5]}" stroke="#22314A" stroke-width="1.5"/>`;
    s += txt(C + r * .62 * Math.cos(am), C + r * .62 * Math.sin(am) - 7, it.n, { size: 12, bold: true }) + txt(C + r * .62 * Math.cos(am), C + r * .62 * Math.sin(am) + 8, it.show === false ? '?' : it.p + '%', { size: 11 }); a0 = a1; });
  return svg(2 * C, 2 * C, s); };
const iso = (H, s = 22) => { const R = H.length, C = H[0].length, a = s * 0.866, b = s * 0.5, mz = Math.max(1, ...H.flat());
  const ox = 10 + R * a, oy = 10 + mz * s, P = (x, y, z) => [ox + (x - y) * a, oy + (x + y) * b - z * s];
  const cells = []; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (let z = 0; z < H[r][c]; z++) cells.push([c, r, z]);
  cells.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]);
  const poly = (pts, f) => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${f}" stroke="#22314A" stroke-width="1.3" stroke-linejoin="round"/>`;
  let out = ''; cells.forEach(([x, y, z]) => { out += poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], '#FFE7A8') + poly([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], '#F4B860') + poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], '#FFD27A'); });
  return svg(Math.ceil(20 + (R + C) * a), Math.ceil(20 + (R + C) * b + mz * s), out); };
const viewSVG = (cols, s = 22) => { const mh = Math.max(1, ...cols); let g = '';
  cols.forEach((h, i) => { for (let z = 0; z < h; z++) g += `<rect x="${4 + i * s}" y="${4 + (mh - 1 - z) * s}" width="${s}" height="${s}" fill="#CFE6FA" stroke="#22314A" stroke-width="1.4"/>`; });
  return svg(8 + cols.length * s, 8 + mh * s, g); };
const front = H => H[0].map((_, c) => Math.max(...H.map(r => r[c])));
const side = H => H.map(r => Math.max(...r)).reverse();
const topMap = (H, nums = true) => { const s = 30; let g = '';
  H.forEach((r, i) => r.forEach((h, j) => { if (h) g += `<rect x="${4 + j * s}" y="${4 + i * s}" width="${s}" height="${s}" fill="#DFF3E3" stroke="#22314A" stroke-width="1.4"/>` + (nums ? txt(4 + j * s + s / 2, 4 + i * s + s / 2, h, { size: 15, bold: true }) : ''); }));
  g += txt(4 + H[0].length * s / 2, 18 + H.length * s, '▲ 앞', { size: 12, fill: '#5D6C83', bold: true });
  return svg(8 + H[0].length * s, 26 + H.length * s, g); };
// 각기둥 전개도 (밑면 한 변 a, 높이 h — 그림 비율용)
const prismNet = (n, lab) => { const W = 34, Hh = 52, x0 = 10, y0 = 12 + W * 1.8; let g = '';
  const poly = (p0, p1, up) => { const P = [p0, p1]; let dir = 0; for (let i = 2; i < n; i++){ dir += (up ? -1 : 1) * 2 * Math.PI / n; const q = P[P.length - 1]; P.push([q[0] + W * Math.cos(dir), q[1] + W * Math.sin(dir)]); } return P; };
  for (let i = 0; i < n; i++) g += `<rect x="${x0 + i * W}" y="${y0}" width="${W}" height="${Hh}" fill="#FFE7A8" stroke="#22314A" stroke-width="1.8"/>`;
  const top = poly([x0 + W, y0], [x0 + 2 * W, y0], true), bot = poly([x0 + W, y0 + Hh], [x0 + 2 * W, y0 + Hh], false);
  const pp = P => P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  g += `<polygon points="${pp(top)}" fill="#CFE6FA" stroke="#22314A" stroke-width="1.8"/><polygon points="${pp(bot)}" fill="#CFE6FA" stroke="#22314A" stroke-width="1.8"/>`;
  if (lab) g += lab(x0, y0, W, Hh);
  return svg(Math.max(x0 * 2 + n * W, 3 * W + 40), y0 + Hh + W * 1.8 + 12, g); };
window.TM_Q6 = { iso, viewSVG, front, side, topMap, band, pie, COLORS, prismNet };

/* ─────────────── 1. 분수의 나눗셈 ─────────────── */
A.addUnit({ key:'6-1-1', title:'분수의 나눗셈', items:[
  { id:'nn-frac', name:'(자연수)÷(자연수)의 몫을 분수로 나타내기 (1보다 작은 몫)', std:'6수01-10', lv:[1,1], t:'both',
    g(){ const b = ri(3, 9), a = ri(1, b - 1);
      return Q(`${a} ÷ ${b}의 몫을 분수로 나타내면?`, F(a, b), `${a} ÷ ${b} = ${fr(a, b)}${gcd(a, b) > 1 ? ` = ${frH(F(a, b))}` : ''} — 나누어지는 수가 분자, 나누는 수가 분모!`, [F(b, a), F(1, b), F(a, b + 1)]); } },
  { id:'nn-frac2', name:'(자연수)÷(자연수)의 몫을 분수로 나타내기 (1보다 큰 몫)', std:'6수01-10', lv:[1,2], t:'both',
    g(){ const b = ri(2, 9); let a = ri(b + 1, 4 * b); if (a % b === 0) a++;
      return Q(`${a} ÷ ${b}의 몫을 분수로 나타내면?`, F(a, b), `${a} ÷ ${b} = ${fr(a, b)} = ${frH(F(a, b))}`, [F(b, a), F(a % b, b), F(a, b + 1)]); } },
  { id:'nn-word', name:'(자연수)÷(자연수) 생활 문제', std:'6수01-10', lv:[2,3], t:'both',
    g(){ if (ri(0, 1)){ const n = ri(5, 8); let p = ri(n + 1, 4 * n); if (p % n === 0) p++;
        return Q(`둘레가 ${p} cm인 정${POLY[n]}형의 한 변의 길이는 몇 cm인지 분수로 나타내 보세요.`, F(p, n), `정${POLY[n]}형은 변이 ${n}개 → ${p} ÷ ${n} = ${frH(F(p, n))} (cm)`, [F(n, p), F(p, n + 1)], 'cm'); }
      const k = ri(3, 8); let a = ri(2, 3 * k); if (a % k === 0) a++;
      return Q(`밀가루 ${a} kg을 ${k}봉지에 똑같이 나누어 담았어요. 한 봉지에 담은 밀가루는 몇 kg일까요?`, F(a, k), `${a} ÷ ${k} = ${frH(F(a, k))} (kg)`, [F(k, a), F(a, k + 1)], 'kg'); } },
  { id:'fn-mul', name:'(분수)÷(자연수) — 분자가 자연수의 배수', std:'6수01-11', lv:[1,2], t:'both',
    g(){ const k = ri(2, 5), m = ri(1, 3), n = k * m, d = ri(n + 1, n + 7);
      return Q(`${fr(n, d)} ÷ ${k}의 값은?`, F(m, d), `분자 ${n}이(가) ${k}의 배수이므로 분자를 나누어요: ${fr(`${n} ÷ ${k}`, d)} = ${frH(F(m, d))}`, [F(n, d * k * 2), F(n * k, d), F(m, d + k)]); } },
  { id:'fn-gen', name:'(분수)÷(자연수)를 곱셈으로 나타내 계산하기', std:'6수01-11', lv:[2,3], t:'both',
    g(){ const k = ri(2, 6), d = ri(3, 9); let n = ri(1, d - 1); if (n % k === 0) n = n - 1 || 1;
      return Q(`${fr(n, d)} ÷ ${k}의 값은?`, F(n, d * k), `÷ ${k}는 × ${fr(1, k)}과(와) 같아요: ${fr(n, d)} × ${fr(1, k)} = ${frH(F(n, d * k))}`, [F(n * k, d), F(n, d + k), F(k, d * n)]); } },
  { id:'mn-div', name:'(대분수)÷(자연수)', std:'6수01-11', lv:[2,3], t:'both',
    g(){ const d = ri(2, 7), n = ri(1, d - 1), w = ri(1, 4), k = ri(2, 6), imp = w * d + n;
      return Q(`${fr(n, d, w)} ÷ ${k}의 값은?`, F(imp, d * k), `대분수를 가분수로 바꾸어요: ${fr(imp, d)} × ${fr(1, k)} = ${fr(imp, d * k)}${gcd(imp, d * k) > 1 || imp > d * k ? ` = ${frH(F(imp, d * k))}` : ''}`, [F(w * d + n * k, d * k), F(imp * k, d), F(n, d * k).add(w)]); } },
  { id:'fn-cmp', name:'분수의 나눗셈 결과 비교하기', std:'6수01-11', lv:[3,3], t:'mc',
    g(){ const d1 = ri(3, 9), n1 = ri(1, d1 - 1), k1 = ri(2, 5), d2 = ri(3, 9), n2 = ri(1, d2 - 1), k2 = ri(2, 5), x = F(n1, d1 * k1), y = F(n2, d2 * k2), c = CMP(x.v, y.v);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(n1, d1)} ÷ ${k1} ○ ${fr(n2, d2)} ÷ ${k2}`)}`, [c, ...CMPC.filter(z => z !== c)], `${fr(n1, d1)} ÷ ${k1} = ${frH(x)}, ${fr(n2, d2)} ÷ ${k2} = ${frH(y)} → 통분하여 비교하면 <b>${c}</b>`); } },
  { id:'fn-area', name:'넓이로 모르는 길이 구하기', std:'6수01-11', lv:[3,4], t:'both',
    g(){ const k = ri(2, 6), d = ri(3, 9), n = ri(1, 3 * d), w = ri(0, 1); const A0 = F(n, d);
      return Q(`넓이가 ${frH(A0)} m²인 평행사변형의 밑변의 길이가 ${k} m일 때, 높이는 몇 m일까요?`, A0.div(k), `(높이) = (넓이) ÷ (밑변) = ${frH(A0)} ÷ ${k} = ${frH(A0.div(k))} (m)`, [A0.mul(k), A0.div(k + 1)], 'm'); } },
  { id:'fn-wrong', name:'잘못 계산한 식에서 바르게 계산하기', std:'6수01-11', lv:[4,4], t:'both',
    g(){ const k = ri(2, 6), x = F(ri(1, 9), ri(2, 9)), wrongR = x.mul(k);
      return Q(`어떤 수를 ${k}로 나누어야 할 것을 잘못하여 곱했더니 ${frH(wrongR)}이(가) 되었어요. 바르게 계산한 몫은?`, x.div(k), `어떤 수 = ${frH(wrongR)} ÷ ${k} = ${frH(x)} → 바르게 계산: ${frH(x)} ÷ ${k} = <b>${frH(x.div(k))}</b>`, [x, wrongR.mul(k), x.mul(k)]); } },
  { id:'fn-ineq', name:'□ 안에 들어갈 수 있는 자연수 구하기', std:'6수01-11', lv:[4,5], t:'both',
    g(){ const k = ri(3, 7), d = ri(2, 5), w = ri(1, 3), n = ri(1, d - 1), lim = F(w * d + n, d), mx = Math.ceil(lim.mul(k).v - 1e-9) - 1;
      return N(`□ ÷ ${k} &lt; ${frH(lim)}에서 □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는?`, mx, `□ &lt; ${frH(lim)} × ${k} = ${frH(lim.mul(k))} → 가장 큰 자연수는 <b>${mx}</b>`, [mx + 1, mx - 1, Math.floor(lim.v)]); } },
  { id:'fn-cards', name:'수 카드로 몫이 가장 작은 나눗셈 만들기', std:'6수01-11', lv:[5,5], t:'both',
    g(){ let c; do { c = shuffle(range(2, 9)).slice(0, 3).sort((a, b) => a - b); } while (c[0] >= c[1]); const best = F(c[0], c[1] * c[2]);
      return Q(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}를 한 번씩 모두 사용하여 (진분수) ÷ (자연수)를 만들려고 해요. 계산 결과가 <b>가장 작은</b> 나눗셈의 몫은?`, best, `분자는 가장 작게(${c[0]}), 분모와 나누는 수는 크게 → ${fr(c[0], c[1])} ÷ ${c[2]} 또는 ${fr(c[0], c[2])} ÷ ${c[1]} = <b>${frH(best)}</b>`, [F(c[0], c[2]), F(c[1], c[0] * c[2]), F(c[2], c[0] * c[1])]); } },
  { id:'fdiv-word', name:'분수의 나눗셈 생활 문제', std:'6수01-11', lv:[3,4], t:'both',
    g(){ const k = ri(2, 6), d = ri(3, 9), n = ri(1, d - 1), w = ri(0, 2), x = F(w * d + n, d);
      return pick([
        () => Q(`리본 ${frH(x)} m를 ${k}명이 똑같이 나누어 가졌어요. 한 명이 가진 리본은 몇 m일까요?`, x.div(k), `${frH(x)} ÷ ${k} = ${frH(x.div(k))} (m)`, [x.mul(k), x.div(k + 1)], 'm'),
        () => Q(`설탕 ${frH(x)} kg을 통 ${k}개에 똑같이 나누어 담았어요. 통 한 개에 담은 설탕은 몇 kg일까요?`, x.div(k), `${frH(x)} ÷ ${k} = ${frH(x.div(k))} (kg)`, [x.mul(k), x.div(k + 1)], 'kg')])(); } },
  { id:'fdiv-who', name:'하루에 더 많이 한 사람 찾기', std:'6수01-11', lv:[4,4], t:'mc',
    g(){ let a, b, ka, kb, x, y; do { ka = ri(2, 5); kb = ri(2, 5); a = F(ri(5, 30), ri(2, 5)); b = F(ri(5, 30), ri(2, 5)); x = a.div(ka); y = b.div(kb); } while (x.eq(y));
      const [p1, p2] = shuffle(NAMES).slice(0, 2);
      return MC(`${p1}는 ${ka}일 동안 ${frH(a)} km를, ${p2}는 ${kb}일 동안 ${frH(b)} km를 걸었어요. 하루에 더 많이 걸은 사람은? (매일 같은 거리를 걸었어요.)`, [x.v > y.v ? p1 : p2, x.v > y.v ? p2 : p1, '두 사람이 같아요'],
        `${p1}: ${frH(a)} ÷ ${ka} = ${frH(x)} km, ${p2}: ${frH(b)} ÷ ${kb} = ${frH(y)} km → <b>${x.v > y.v ? p1 : p2}</b>`); } }
]});

/* ─────────────── 2. 각기둥과 각뿔 ─────────────── */
const PART = { v:'꼭짓점', f:'면', e:'모서리' };
A.addUnit({ key:'6-1-2', title:'각기둥과 각뿔', items:[
  { id:'pr-name', name:'밑면의 모양으로 각기둥 이름 알기', std:'6수03-05', lv:[1,1], t:'mc',
    g(){ const n = ri(3, 8), t = ri(0, 1);
      return MC(t ? `밑면의 모양이 ${POLY[n]}형인 각기둥의 이름은?` : `옆면이 ${n}개인 각기둥의 이름은?`, [`${POLY[n]}기둥`, `${POLY[n]}뿔`, `${POLY[n + 1]}기둥`, `${POLY[n > 3 ? n - 1 : n + 2]}기둥`],
        `각기둥의 이름은 <b>밑면의 모양</b>으로 정해요. 옆면의 수 = 밑면의 변의 수 = ${n} → ${POLY[n]}기둥`); } },
  { id:'py-name', name:'밑면의 모양으로 각뿔 이름 알기', std:'6수03-05', lv:[1,1], t:'mc',
    g(){ const n = ri(3, 8), t = ri(0, 1);
      return MC(t ? `밑면의 모양이 ${POLY[n]}형인 각뿔의 이름은?` : `옆면이 ${n}개인 각뿔의 이름은?`, [`${POLY[n]}뿔`, `${POLY[n]}기둥`, `${POLY[n + 1]}뿔`, `${POLY[n > 3 ? n - 1 : n + 2]}뿔`],
        `각뿔의 옆면은 모두 삼각형이고, 옆면의 수 = 밑면의 변의 수 → ${POLY[n]}뿔`); } },
  { id:'pr-count', name:'각기둥의 꼭짓점, 면, 모서리의 수', std:'6수03-05', lv:[1,2], t:'both',
    g(){ const n = ri(3, 9), k = pick(['v', 'f', 'e']), v = { v: 2 * n, f: n + 2, e: 3 * n }[k];
      return N(`${POLY[n]}기둥의 ${PART[k]}은(는) 몇 개일까요?`, v, `■각기둥: 꼭짓점 ■ × 2, 면 ■ + 2, 모서리 ■ × 3 → <b>${v}개</b>`, [2 * n, n + 2, 3 * n, n + 1].filter(x => x !== v), '개'); } },
  { id:'py-count', name:'각뿔의 꼭짓점, 면, 모서리의 수', std:'6수03-05', lv:[1,2], t:'both',
    g(){ const n = ri(3, 9), k = pick(['v', 'f', 'e']), v = { v: n + 1, f: n + 1, e: 2 * n }[k];
      return N(`${POLY[n]}뿔의 ${PART[k]}은(는) 몇 개일까요?`, v, `■각뿔: 꼭짓점 ■ + 1, 면 ■ + 1, 모서리 ■ × 2 → <b>${v}개</b>`, [2 * n, n + 2, 3 * n, n].filter(x => x !== v), '개'); } },
  { id:'pr-perp', name:'각기둥에서 밑면에 수직인 면의 수', std:'6수03-05', lv:[2,2], t:'both',
    g(){ const n = ri(3, 10);
      return N(`${POLY[n]}기둥에서 한 밑면에 수직인 면은 몇 개일까요?`, n, `밑면에 수직인 면은 <b>옆면</b>이에요. 옆면의 수 = 밑면의 변의 수 = <b>${n}개</b>`, [n + 2, 2, n - 1], '개'); } },
  { id:'pp-true', name:'각기둥과 각뿔의 성질 알기', std:'6수03-05', lv:[2,3], t:'mc',
    g(){ return pick([
      () => MC('각기둥에 대한 설명으로 옳은 것은?', ['두 밑면은 서로 평행하고 합동이에요.', '옆면은 모두 삼각형이에요.', '밑면이 1개예요.', '옆면과 밑면은 항상 평행해요.'], '각기둥은 서로 평행하고 합동인 두 밑면이 있고, 옆면은 모두 직사각형이에요.'),
      () => MC('각뿔에 대한 설명으로 옳은 것은?', ['옆면은 모두 삼각형이에요.', '두 밑면이 서로 평행해요.', '옆면은 모두 직사각형이에요.', '꼭짓점과 면의 수가 항상 달라요.'], '각뿔은 밑면이 1개이고 옆면은 모두 삼각형이에요. 꼭짓점의 수와 면의 수는 항상 같아요(■ + 1).'),
      () => MC('각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이를 무엇이라고 할까요?', ['높이', '모서리', '옆면', '밑면'], '각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이를 <b>높이</b>라고 해요.'),
      () => { const n = ri(5, 9); return MC(`${POLY[n]}기둥에 대한 설명으로 <b>옳지 않은</b> 것은?`, [`옆면은 ${n + 2}개예요.`, `모서리는 ${3 * n}개예요.`, `꼭짓점은 ${2 * n}개예요.`, '두 밑면은 서로 평행하고 합동이에요.'], `${POLY[n]}기둥의 옆면은 ${n}개, 면은 모두 ${n + 2}개예요.`); }])(); } },
  { id:'pr-net', name:'전개도를 보고 각기둥 알기', std:'6수03-06', lv:[2,3], t:'mc',
    g(){ const n = ri(3, 6);
      return MC('전개도를 접으면 만들어지는 입체도형의 이름은?', [`${POLY[n]}기둥`, `${POLY[n]}뿔`, `${POLY[n + 1]}기둥`, `${POLY[n > 3 ? n - 1 : n + 2]}기둥`], `합동인 밑면 2개가 ${POLY[n]}형이고 옆면(직사각형)이 ${n}개 → <b>${POLY[n]}기둥</b>`, { fig: prismNet(n) }); } },
  { id:'pr-net-len', name:'각기둥의 전개도에서 길이 구하기', std:'6수03-06', lv:[3,3], t:'both',
    g(){ const n = ri(3, 8), a = ri(3, 9), h = ri(4, 12);
      return N(`밑면이 한 변 ${a} cm인 정${POLY[n]}형이고 높이가 ${h} cm인 각기둥의 전개도를 그렸어요. 옆면을 모두 이어 붙인 직사각형의 가로는 몇 cm일까요?`, n * a, `옆면 ${n}개가 나란히 이어지므로 가로 = (밑면의 둘레) = ${a} × ${n} = <b>${n * a} cm</b>`, [n * h, a + h, 2 * n * a], 'cm'); } },
  { id:'pr-edgesum', name:'각기둥의 모든 모서리 길이의 합', std:'6수03-05', lv:[3,4], t:'both',
    g(){ const n = ri(3, 6), a = ri(2, 8), h = ri(3, 10), v = 2 * n * a + n * h;
      return N(`밑면이 한 변 ${a} cm인 정${POLY[n]}형이고, 높이가 ${h} cm인 각기둥의 모든 모서리 길이의 합은 몇 cm일까요?`, v, `밑면의 모서리 ${2 * n}개(각 ${a} cm) + 옆 모서리 ${n}개(각 ${h} cm) = ${a} × ${2 * n} + ${h} × ${n} = <b>${v} cm</b>`, [n * a + n * h, 2 * n * a + 2 * n * h, 3 * n * a], 'cm'); } },
  { id:'py-edgesum', name:'각뿔의 모든 모서리 길이의 합', std:'6수03-05', lv:[4,4], t:'both',
    g(){ const n = ri(3, 6), a = ri(3, 8), b = ri(a + 1, 14), v = n * a + n * b;
      return N(`밑면이 한 변 ${a} cm인 정${POLY[n]}형이고, 옆면이 모두 합동인 이등변삼각형(같은 두 변 ${b} cm)인 각뿔이 있어요. 모든 모서리 길이의 합은?`, v, `밑면의 모서리 ${n}개(각 ${a} cm) + 옆 모서리 ${n}개(각 ${b} cm) = <b>${v} cm</b>`, [2 * n * a + n * b, n * a + 2 * n * b, n * (a + b) * 2], 'cm'); } },
  { id:'pp-rev', name:'구성 요소의 수로 입체도형 알아내기', std:'6수03-05', lv:[3,4], t:'mc',
    g(){ const n = ri(3, 8), t = ri(0, 3);
      const [q, ans, ex] = [[`모서리가 ${3 * n}개인 각기둥`, `${POLY[n]}기둥`, `모서리 = ■ × 3 → ■ = ${n}`], [`모서리가 ${2 * n}개인 각뿔`, `${POLY[n]}뿔`, `모서리 = ■ × 2 → ■ = ${n}`], [`꼭짓점이 ${2 * n}개인 각기둥`, `${POLY[n]}기둥`, `꼭짓점 = ■ × 2 → ■ = ${n}`], [`면이 ${n + 1}개인 각뿔`, `${POLY[n]}뿔`, `면 = ■ + 1 → ■ = ${n}`]][t];
      const ty = ans.endsWith('기둥') ? '기둥' : '뿔';
      return MC(`${q}의 이름은?`, [ans, `${POLY[n]}${ty === '기둥' ? '뿔' : '기둥'}`, `${POLY[n + 1]}${ty}`, `${POLY[n > 3 ? n - 1 : n + 2]}${ty}`], ex); } },
  { id:'pp-sum', name:'각기둥과 각뿔의 구성 요소 수 비교·합 구하기', std:'6수03-05', lv:[4,5], t:'both',
    g(){ const n = ri(4, 9), m = ri(3, 9), t = ri(0, 2);
      if (t === 0) return N(`${POLY[n]}기둥의 꼭짓점, 면, 모서리의 수를 모두 더하면?`, 6 * n + 2, `${2 * n} + ${n + 2} + ${3 * n} = <b>${6 * n + 2}</b>`, [6 * n, 5 * n + 2, 6 * n + 4], '');
      if (t === 1) return N(`${POLY[n]}기둥의 모서리 수와 ${POLY[m]}뿔의 모서리 수의 합은?`, 3 * n + 2 * m, `${POLY[n]}기둥 ${3 * n}개 + ${POLY[m]}뿔 ${2 * m}개 = <b>${3 * n + 2 * m}개</b>`, [2 * n + 3 * m, 3 * n + 3 * m, 2 * n + 2 * m], '개');
      return N(`면이 ${n + 2}개인 각기둥의 모서리는 몇 개일까요?`, 3 * n, `면 = ■ + 2 → ■ = ${n} → 모서리 = ${n} × 3 = <b>${3 * n}개</b>`, [3 * (n + 2), 2 * n, 3 * n + 2], '개'); } }
]});

/* ─────────────── 3. 소수의 나눗셈 ─────────────── */
A.addUnit({ key:'6-1-3', title:'소수의 나눗셈', items:[
  { id:'dn-use', name:'자연수의 나눗셈을 이용한 (소수)÷(자연수)', std:'6수01-15', lv:[1,2], t:'both',
    g(){ const k = ri(2, 6), q = ri(12, 250), p = q * k, s = pick([10, 100]);
      return N(`${p} ÷ ${k} = ${q}입니다. ${D2(p / s)} ÷ ${k}의 몫은?`, q / s, `나누어지는 수가 ${s === 10 ? fr(1, 10) : fr(1, 100)}배가 되면 몫도 ${s === 10 ? fr(1, 10) : fr(1, 100)}배 → <b>${D2(q / s)}</b>`, [q / (s === 10 ? 100 : 10), q, q / s * 10]); } },
  { id:'dn-basic', name:'각 자리에서 나누어떨어지지 않는 (소수)÷(자연수)', std:'6수01-15', lv:[1,2], t:'both',
    g(){ const k = ri(2, 9), q = ri(101, 999) / 100, p = dz(q * k);
      return N(`${D2(p)} ÷ ${k}의 값은?`, q, `자연수의 나눗셈처럼 계산하고, 몫의 소수점은 나누어지는 수의 소수점 위치에 맞추어 찍어요 → <b>${D2(q)}</b>`, [q * 10, q / 10, dz(q + 0.1)]); } },
  { id:'dn-small', name:'몫이 1보다 작은 (소수)÷(자연수)', std:'6수01-15', lv:[2,2], t:'both',
    g(){ const k = ri(2, 9), q = ri(11, 99) / 100, p = dz(q * k);
      return N(`${D2(p)} ÷ ${k}의 값은?`, q, `나누어지는 수가 나누는 수보다 작으면 몫의 일의 자리에 0을 써요 → <b>${D2(q)}</b>`, [q * 10, q / 10, dz(q + 1)]); } },
  { id:'dn-zero', name:'소수점 아래 0을 내려 계산하기', std:'6수01-15', lv:[2,3], t:'both',
    g(){ let k, q, p, c = 0; do { k = pick([2, 4, 5, 8]); q = ri(101, 999) / 100; p = dz(q * k); c++; } while ((Math.round(p * 10) !== dz(p * 10) || Math.round(q * 100) % 10 === 0) && c < 300);
      return N(`${D2(p)} ÷ ${k}의 값은?`, q, `나누어떨어지지 않으면 소수 끝자리에 0을 내려 계산해요: ${D2(p)} = ${p.toFixed(2)} → <b>${D2(q)}</b>`, [q * 10, Math.floor(q * 10) / 10, dz(q + 0.01)]); } },
  { id:'dn-zeroq', name:'몫의 소수 첫째 자리에 0이 있는 나눗셈', std:'6수01-15', lv:[3,3], t:'both',
    g(){ const w = ri(1, 9), x = ri(1, 9), q = dz(w + x / 100), k = ri(2, 9), p = dz(q * k);
      return N(`${D2(p)} ÷ ${k}의 값은?`, q, `소수 첫째 자리에서 나눌 수 없으면 몫에 <b>0</b>을 쓰고 다음 자리를 내려요 → <b>${D2(q)}</b>`, [dz(w + x / 10), dz(q * 10), dz(w * 10 + x)]); } },
  { id:'nn-dec', name:'(자연수)÷(자연수)의 몫을 소수로 나타내기', std:'6수01-14', lv:[2,3], t:'both',
    g(){ const b = pick([2, 4, 5, 8, 20, 25]); let a = ri(b + 1, b * 9); if (a % b === 0) a++;
      return N(`${a} ÷ ${b}의 몫을 소수로 나타내면?`, a / b, `${a} ÷ ${b} = ${fr(a, b)} → 0을 내려 끝까지 나누면 <b>${D2(a / b)}</b>`, [Math.floor(a / b) + (a % b) / 10, a / b * 10, Math.floor(a / b)]); } },
  { id:'dn-est', name:'어림하여 몫의 소수점 위치 찾기', std:'6수01-15', lv:[3,3], t:'mc',
    g(){ const k = ri(3, 9), q = ri(11, 99) / 10, p = dz(q * k);
      return MC(`어림하여 ${D2(p)} ÷ ${k}의 몫을 찾아보세요.`, [D2(q), D2(q * 10), D2(q / 10), D2(q * 100)], `${D2(p)}를 약 ${Math.round(p)}(으)로 어림하면 ${Math.round(p)} ÷ ${k} ≈ ${Math.round(Math.round(p) / k * 10) / 10} → 몫은 <b>${D2(q)}</b>`); } },
  { id:'ddn-word', name:'소수의 나눗셈 생활 문제', std:'6수01-15', lv:[3,3], t:'both',
    g(){ const k = ri(2, 8), q = dz(ri(11, 99) / 10 + ri(0, 9) / 100), p = dz(q * k);
      return pick([
        () => N(`철사 ${D2(p)} m를 ${k}도막으로 똑같이 잘랐어요. 한 도막은 몇 m일까요?`, q, `${D2(p)} ÷ ${k} = <b>${D2(q)} (m)</b>`, [q * 10, q / 10], 'm'),
        () => N(`쌀 ${D2(p)} kg을 ${k}자루에 똑같이 나누어 담으면 한 자루에 몇 kg씩 담을 수 있을까요?`, q, `${D2(p)} ÷ ${k} = <b>${D2(q)} (kg)</b>`, [q * 10, q / 10], 'kg')])(); } },
  { id:'dn-avg', name:'평균 구하기와 소수의 나눗셈', std:'6수01-15', lv:[4,4], t:'both',
    g(){ const n = pick([4, 5]); let v, s; do { v = range(1, n).map(() => ri(10, 25) / 10); s = dz(v.reduce((a, b) => a + b, 0)); } while (Math.round(s / n * 100) !== dz(s / n * 100));
      return N(`${n}일 동안 마신 물의 양이 ${v.map(D2).join(' L, ')} L예요. 하루 평균 몇 L를 마셨을까요?`, s / n, `합 ${D2(s)} L ÷ ${n} = <b>${D2(s / n)} L</b>`, [s, dz(s / n * 10), dz(s / (n + 1))], 'L'); } },
  { id:'dn-shape', name:'도형에서 소수의 나눗셈 활용하기', std:'6수01-15', lv:[3,4], t:'both',
    g(){ if (ri(0, 1)){ const a = ri(11, 99) / 10 + ri(0, 9) / 100; return N(`둘레가 ${D2(a * 4)} cm인 정사각형의 한 변의 길이는?`, a, `${D2(a * 4)} ÷ 4 = <b>${D2(a)} cm</b>`, [a * 2, a * 10, dz(a * 4 / 2)], 'cm'); }
      const w = ri(2, 9), h = ri(11, 99) / 10; return N(`넓이가 ${D2(w * h)} m²인 직사각형의 가로가 ${w} m일 때, 세로는 몇 m일까요?`, h, `${D2(w * h)} ÷ ${w} = <b>${D2(h)} m</b>`, [h * 10, h / 10, dz(h + 1)], 'm'); } },
  { id:'dn-wrong', name:'잘못 계산한 식에서 바르게 계산하기', std:'6수01-15', lv:[4,4], t:'both',
    g(){ const k = pick([2, 4, 5]), x = ri(11, 99) / 10, wr = dz(x * k);
      return N(`어떤 수를 ${k}로 나누어야 할 것을 잘못하여 곱했더니 ${D2(wr)}이(가) 되었어요. 바르게 계산한 몫은?`, x / k, `어떤 수 = ${D2(wr)} ÷ ${k} = ${D2(x)} → ${D2(x)} ÷ ${k} = <b>${D2(x / k)}</b>`, [x, wr * k, x * k]); } },
  { id:'dn-ineq', name:'□ 안에 들어갈 수 있는 자연수 구하기', std:'6수01-15', lv:[4,5], t:'both',
    g(){ const k = ri(3, 8), q = ri(21, 99) / 10 + 0.05 * ri(0, 1), p = dz(q * k), mx = Math.ceil(q - 1e-9) - 1;
      return N(`□ &lt; ${D2(p)} ÷ ${k}에서 □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는?`, mx, `${D2(p)} ÷ ${k} = ${D2(q)} → □는 ${D2(q)}보다 작은 자연수 → 가장 큰 수 <b>${mx}</b>`, [mx + 1, mx - 1, Math.round(p)]); } },
  { id:'dn-cards', name:'수 카드로 몫이 가장 큰 나눗셈 만들기', std:'6수01-15', lv:[5,5], t:'both',
    g(){ let c, q; do { c = shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => b - a); q = dz((c[0] * 10 + c[1]) / 10 / c[2]); } while (Math.round(q * 1000) !== dz(q * 1000));
      return N(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}를 한 번씩 모두 사용하여 □.□ ÷ □를 만들려고 해요. 몫이 <b>가장 큰</b> 나눗셈의 몫은?`, q, `나누어지는 수는 가장 크게(${c[0]}.${c[1]}), 나누는 수는 가장 작게(${c[2]}) → ${c[0]}.${c[1]} ÷ ${c[2]} = <b>${D2(q)}</b>`, [dz((c[2] * 10 + c[1]) / 10 / c[0]), q * 10, dz((c[0] * 10 + c[2]) / 10 / c[1])]); } }
]});

/* ─────────────── 4. 비와 비율 ─────────────── */
const NICE = [2, 4, 5, 10, 20, 25, 50];
A.addUnit({ key:'6-1-4', title:'비와 비율', items:[
  { id:'cmp-div', name:'두 양을 나눗셈으로 비교하기', std:'6수02-02', lv:[1,1], t:'both',
    g(){ const k = ri(2, 6), g = range(1, 4), it = pick([['모둠 수', '모둠원 수'], ['글러브 수', '방망이 수'], ['자동차 수', '바퀴 수']]);
      return N(`표를 보고 답하세요. ${it[1]}는 ${it[0]}의 몇 배일까요?${tableH([[it[0], ...g], [it[1], ...g.map(x => x * k)]])}`, k, `나눗셈으로 비교하면 ${k * 2} ÷ 2 = ${k} → ${it[0]}가 변해도 ${it[1]}는 항상 <b>${k}배</b>`, [k + 1, k - 1, k * 2], '배'); } },
  { id:'ratio-read', name:'비의 기준량과 비교하는 양 알기', std:'6수02-02', lv:[1,2], t:'both',
    g(){ const a = ri(2, 15); let b = ri(2, 15); if (b === a) b++; const t = ri(0, 2), say = [`${a} : ${b}`, `${b}에 대한 ${a}의 비`, `${a}의 ${b}에 대한 비`][t];
      return N(`"${say}"에서 <b>기준량</b>은 얼마일까요?`, b, `${a} : ${b}에서 기호 :의 <b>오른쪽</b> ${b}가 기준량, 왼쪽 ${a}가 비교하는 양이에요.`, [a, a + b]); } },
  { id:'ratio-say', name:'비를 바르게 읽기', std:'6수02-02', lv:[1,2], t:'mc',
    g(){ const a = ri(2, 15); let b = ri(2, 15); if (b === a) b++;
      return MC(`비 <b>${a} : ${b}</b>를 바르게 읽은 것은?`, [`${b}에 대한 ${a}의 비`, `${a}에 대한 ${b}의 비`, `${b}의 ${a}에 대한 비`, `${b} 대 ${a}`], `${a} : ${b}는 "${a} 대 ${b}", "${a}와 ${b}의 비", "${b}에 대한 ${a}의 비", "${a}의 ${b}에 대한 비"로 읽어요.`); } },
  { id:'ratio-make', name:'상황을 비로 나타내기', std:'6수02-02', lv:[2,2], t:'mc',
    g(){ const a = ri(8, 18); let b = ri(8, 18); if (a === b) b++;
      return MC(`우리 반 남학생은 ${a}명, 여학생은 ${b}명이에요. <b>반 전체 학생 수에 대한 여학생 수의 비</b>는?`, [`${b} : ${a + b}`, `${a + b} : ${b}`, `${b} : ${a}`, `${a} : ${a + b}`], `기준량은 전체 ${a + b}명, 비교하는 양은 여학생 ${b}명 → <b>${b} : ${a + b}</b>`); } },
  { id:'rate-frac', name:'비율을 분수로 나타내기', std:'6수02-03', lv:[1,2], t:'both',
    g(){ const b = ri(3, 20); let a = ri(1, 2 * b); if (a === b) a++;
      return Q(`비 ${a} : ${b}의 비율을 기약분수로 나타내면?`, F(a, b), `(비율) = (비교하는 양) ÷ (기준량) = ${a} ÷ ${b} = ${frH(F(a, b))}`, [F(b, a), F(a, a + b)]); } },
  { id:'rate', name:'비율을 소수로 나타내기', std:'6수02-03', lv:[2,3], t:'both',
    g(){ const b = pick(NICE.filter(x => x > 2)), a = ri(1, b - 1);
      return N(`비 ${a} : ${b}의 비율을 소수로 나타내면?`, a / b, `${a} ÷ ${b} = ${fr(a, b)} = <b>${D2(a / b)}</b>`, [b / a, a / b * 10, a / (a + b)]); } },
  { id:'rate-life', name:'비율이 사용되는 경우 (속력, 인구, 타율, 축척)', std:'6수02-03', lv:[3,4], t:'both',
    g(){ const t = ri(0, 3);
      if (t === 0){ const h = ri(2, 5), v = ri(6, 18) * 5; return N(`자동차가 ${v * h} km를 ${h}시간 동안 달렸어요. 걸린 시간에 대한 간 거리의 비율은?`, v, `${v * h} ÷ ${h} = <b>${v}</b> (한 시간에 ${v} km)`, [v * h, v + h, v / 5]); }
      if (t === 1){ const s = ri(2, 9), p = ri(30, 90) * 100; return N(`넓이가 ${s} km²인 마을에 ${(p * s).toLocaleString()}명이 살아요. 넓이에 대한 인구의 비율은?`, p, `${(p * s).toLocaleString()} ÷ ${s} = <b>${p.toLocaleString()}</b>`, [p * 10, p / 10, p + s]); }
      if (t === 2){ const n = pick([20, 25, 40, 50]), h = ri(3, Math.round(n / 2)); return N(`${n}번 시도하여 ${h}번 성공했어요. 시도한 횟수에 대한 성공한 횟수의 비율을 소수로 나타내면?`, h / n, `${h} ÷ ${n} = <b>${D2(h / n)}</b>`, [n / h, h / n * 10, h / 100]); }
      const r = ri(2, 9) * 100, m = pick([2, 4, 5]); return Q(`실제 거리 ${r} m를 지도에 ${m} cm로 나타냈어요. 실제 거리에 대한 지도에서 거리의 비율을 분수로 나타내면?`, F(m, r * 100), `${r} m = ${r * 100} cm → ${m} ÷ ${r * 100} = <b>${frH(F(m, r * 100))}</b>`, [F(m, r), F(r * 100, m)]); } },
  { id:'rate-cmp', name:'비율을 비교하여 판단하기', std:'6수02-03', lv:[4,4], t:'mc',
    g(){ if (ri(0, 1)){ let t1, t2, d1, d2; do { t1 = ri(6, 12); t2 = ri(6, 12); d1 = t1 * ri(15, 40); d2 = t2 * ri(15, 40); } while (d1 / t1 === d2 / t2);
        return MC(`가 자동차는 ${d1} m를 ${t1}초, 나 자동차는 ${d2} m를 ${t2}초 동안 달렸어요. 더 빨리 달린 자동차는?`, [d1 / t1 > d2 / t2 ? '가' : '나', d1 / t1 > d2 / t2 ? '나' : '가', '빠르기가 같아요'], `가: ${d1} ÷ ${t1} = ${D2(d1 / t1)}, 나: ${d2} ÷ ${t2} = ${D2(d2 / t2)} → 걸린 시간에 대한 달린 거리의 비율이 큰 <b>${d1 / t1 > d2 / t2 ? '가' : '나'}</b>`); }
      let a1, b1, a2, b2; do { b1 = pick([200, 250, 400, 500]); b2 = pick([200, 250, 400, 500]); a1 = b1 * ri(5, 20) / 100; a2 = b2 * ri(5, 20) / 100; } while (a1 / b1 === a2 / b2);
      return MC(`소금물 가는 ${b1} g에 소금이 ${D2(a1)} g, 나는 ${b2} g에 소금이 ${D2(a2)} g 녹아 있어요. 더 진한 소금물은?`, [a1 / b1 > a2 / b2 ? '가' : '나', a1 / b1 > a2 / b2 ? '나' : '가', '진하기가 같아요'], `소금물 양에 대한 소금 양의 비율: 가 ${D2(a1 / b1 * 100)}%, 나 ${D2(a2 / b2 * 100)}% → <b>${a1 / b1 > a2 / b2 ? '가' : '나'}</b>`); } },
  { id:'pct-color', name:'전체에 대한 색칠한 부분의 백분율', std:'6수02-03', lv:[1,2], t:'both',
    g(){ const tot = pick([10, 20, 25, 50]), k = ri(1, tot - 1), cols = tot === 25 ? 5 : 10, sz = 22; let g = '';
      for (let i = 0; i < tot; i++) g += `<rect x="${4 + (i % cols) * sz}" y="${4 + Math.floor(i / cols) * sz}" width="${sz}" height="${sz}" fill="${i < k ? '#FFC56B' : '#fff'}" stroke="#22314A" stroke-width="1.2"/>`;
      return N(`전체에 대한 색칠한 부분의 비율을 백분율로 나타내면 몇 %일까요?`, k * 100 / tot, `${k} ÷ ${tot} × 100 = <b>${D2(k * 100 / tot)}%</b>`, [k, (tot - k) * 100 / tot, k * 10 / tot], '%', { fig: svg(8 + cols * sz, 8 + Math.ceil(tot / cols) * sz, g) }); } },
  { id:'percent', name:'비율을 백분율로 나타내기', std:'6수02-03', lv:[2,3], t:'both',
    g(){ const b = pick(NICE), a = ri(1, b - 1), t = ri(0, 1);
      return t ? N(`비율 ${fr(a, b)}를 백분율로 나타내면 몇 %일까요?`, a * 100 / b, `${fr(a, b)} × 100 = <b>${a * 100 / b}%</b>`, [a * 10 / b, a * 100 / b + 10, (b - a) * 100 / b], '%')
        : N(`비율 ${D2(a / b)}를 백분율로 나타내면 몇 %일까요?`, a * 100 / b, `${D2(a / b)} × 100 = <b>${D2(a * 100 / b)}%</b>`, [a * 10 / b, a * 1000 / b, (b - a) * 100 / b], '%'); } },
  { id:'pct-life', name:'백분율 생활 문제 (할인율, 득표율, 진하기)', std:'6수02-03', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const p = ri(2, 9) * 1000, r = pick([10, 20, 25, 30, 40, 50]); return N(`${p.toLocaleString()}원짜리 장난감을 ${(p * (100 - r) / 100).toLocaleString()}원에 샀어요. 할인율은 몇 %일까요?`, r, `할인 금액 ${(p * r / 100).toLocaleString()}원 ÷ 원래 가격 ${p.toLocaleString()}원 × 100 = <b>${r}%</b>`, [100 - r, r / 10, r + 5], '%'); }
      if (t === 1){ const n = pick([20, 25, 50, 200, 400]), v = Math.round(n * ri(2, 8) / 10); return N(`회장 선거에서 ${n}명이 투표했고 ${pick(NAMES)}의 득표수는 ${v}표예요. 득표율은 몇 %일까요?`, v * 100 / n, `${v} ÷ ${n} × 100 = <b>${D2(v * 100 / n)}%</b>`, [v, 100 - v * 100 / n, v * 10 / n], '%'); }
      const tot = pick([200, 250, 400, 500]), r = ri(2, 9) * 5, o = tot * r / 100; return N(`오렌지 주스 ${tot} mL에 오렌지 원액이 ${o} mL 들어 있어요. 주스에 원액은 몇 %가 들어 있을까요?`, r, `${o} ÷ ${tot} × 100 = <b>${r}%</b>`, [r * 2, 100 - r, r / 10], '%'); } },
  { id:'pct-rev', name:'백분율로 양 구하기', std:'6수02-03', lv:[4,5], t:'both',
    g(){ const t = ri(0, 1);
      if (t){ const tot = pick([200, 300, 400, 500, 800]), r = ri(1, 9); return N(`어느 공장에서 만든 물건 ${tot}개 중 ${r}%가 불량품이에요. 불량품은 몇 개일까요?`, tot * r / 100, `${tot} × ${fr(r, 100)} = <b>${tot * r / 100}개</b>`, [r, tot * r / 10, tot - tot * r / 100], '개'); }
      const p = ri(2, 9) * 1000, r = pick([10, 20, 25, 30, 40]); return N(`원래 가격이 ${p.toLocaleString()}원인 물건을 ${r}% 할인하여 팔아요. 판매 가격은 얼마일까요?`, p * (100 - r) / 100, `할인 금액 ${p.toLocaleString()} × ${fr(r, 100)} = ${(p * r / 100).toLocaleString()}원 → ${p.toLocaleString()} - ${(p * r / 100).toLocaleString()} = <b>${(p * (100 - r) / 100).toLocaleString()}원</b>`, [p * r / 100, p - r, p * (100 - r) / 10], '원'); } },
  { id:'pct-best', name:'더 유리한 쪽 고르기 (이자율, 할인율)', std:'6수02-03', lv:[5,5], t:'mc',
    g(){ let p1, d1, p2, d2; do { p1 = ri(2, 6) * 1000; p2 = ri(2, 6) * 1000; d1 = p1 * ri(1, 6) / 20; d2 = p2 * ri(1, 6) / 20; } while (d1 / p1 === d2 / p2);
      return MC(`가 가게는 ${p1.toLocaleString()}원짜리 과자를 ${d1.toLocaleString()}원, 나 가게는 ${p2.toLocaleString()}원짜리 과자를 ${d2.toLocaleString()}원 할인해요. 할인율이 더 높은 가게는?`, [d1 / p1 > d2 / p2 ? '가 가게' : '나 가게', d1 / p1 > d2 / p2 ? '나 가게' : '가 가게', '할인율이 같아요'],
        `가: ${d1.toLocaleString()} ÷ ${p1.toLocaleString()} × 100 = ${D2(d1 / p1 * 100)}%, 나: ${D2(d2 / p2 * 100)}% → <b>${d1 / p1 > d2 / p2 ? '가' : '나'} 가게</b>`); } }
]});

/* ─────────────── 5. 직육면체의 겉넓이와 부피 ─────────────── */
A.addUnit({ key:'6-1-5', title:'직육면체의 겉넓이와 부피', items:[
  { id:'sa-cuboid', name:'직육면체의 겉넓이', std:'6수03-17', lv:[1,2], t:'both',
    g(){ const a = ri(3, 10), b = ri(2, 8), c = ri(2, 9), v = 2 * (a * b + b * c + a * c);
      return N(`직육면체의 겉넓이는 몇 cm²일까요?`, v, `(한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2 = (${a * b} + ${b * c} + ${a * c}) × 2 = <b>${v} cm²</b>`, [a * b + b * c + a * c, a * b * c, 4 * a * b + 2 * b * c], 'cm²', { fig: cuboidFig(a, b, c, { names: false, dims: [`${a} cm`, `${b} cm`, `${c} cm`] }) }); } },
  { id:'sa-cube', name:'정육면체의 겉넓이', std:'6수03-17', lv:[1,2], t:'both',
    g(){ const a = ri(2, 12);
      return N(`한 모서리의 길이가 ${a} cm인 정육면체의 겉넓이는 몇 cm²일까요?`, 6 * a * a, `(한 면의 넓이) × 6 = ${a} × ${a} × 6 = <b>${6 * a * a} cm²</b>`, [a ** 3, 4 * a * a, a * a], 'cm²'); } },
  { id:'sa-net', name:'전개도를 보고 겉넓이 구하기', std:'6수03-17', lv:[2,3], t:'both',
    g(){ const a = ri(2, 8), b = ri(2, 6), c = ri(2, 7), k = 14; let g = ''; const R = (x, y, w, h, f) => `<rect x="${10 + x * k}" y="${10 + y * k}" width="${w * k}" height="${h * k}" fill="${f}" stroke="#22314A" stroke-width="1.6"/>`;
      [[0, b], [b, a], [b + a, b], [2 * b + a, a]].forEach(([x, w], i) => { g += R(x, b, w, c, i % 2 ? '#FFE7A8' : '#CFE6FA'); });
      g += R(b, 0, a, b, '#DFF3E3') + R(b, b + c, a, b, '#DFF3E3') + txt(10 + (b + a / 2) * k, 10 + (2 * b + c) * k + 14, `${a} cm`, { size: 12, fill: '#2a6fae', bold: true }) + txt(10 + (b + a) * k + 18, 10 + b * k / 2, `${b} cm`, { size: 12, fill: '#2a6fae', bold: true }) + txt(10 + (2 * a + 2 * b) * k + 20, 10 + (b + c / 2) * k, `${c} cm`, { size: 12, fill: '#2a6fae', bold: true });
      const v = 2 * (a * b + b * c + a * c);
      return N('전개도를 접어 만든 직육면체의 겉넓이는 몇 cm²일까요?', v, `밑면 ${a} × ${b} = ${a * b}, 옆면 둘레 (${a} + ${b}) × 2 = ${2 * (a + b)} → ${a * b} × 2 + ${2 * (a + b)} × ${c} = <b>${v} cm²</b>`, [a * b * c, a * b + 2 * (a + b) * c, v / 2], 'cm²', { fig: svg(40 + (2 * a + 2 * b) * k + 10, 30 + (2 * b + c) * k, g) }); } },
  { id:'vol-cubes', name:'쌓기나무로 부피 구하기', std:'6수03-19', lv:[1,1], t:'both',
    g(){ const a = ri(2, 5), b = ri(2, 4), c = ri(2, 4);
      return N(`부피가 1 cm³인 쌓기나무로 직육면체를 만들었어요. 만든 직육면체의 부피는 몇 cm³일까요?`, a * b * c, `한 층에 ${a} × ${b} = ${a * b}개, ${c}층 → ${a * b * c}개 → <b>${a * b * c} cm³</b>`, [a * b + c, 2 * (a * b + b * c + a * c), a * b], 'cm³', { fig: iso(range(1, b).map(() => range(1, a).map(() => c)), 20) }); } },
  { id:'vol-cuboid', name:'직육면체의 부피', std:'6수03-19', lv:[1,2], t:'both',
    g(){ const a = ri(3, 12), b = ri(2, 9), c = ri(2, 10);
      return N(`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 부피는 몇 cm³일까요?`, a * b * c, `(가로) × (세로) × (높이) = ${a} × ${b} × ${c} = <b>${a * b * c} cm³</b>`, [2 * (a * b + b * c + a * c), a * b + c, a * b * c * 2], 'cm³'); } },
  { id:'vol-cube', name:'정육면체의 부피', std:'6수03-19', lv:[1,2], t:'both',
    g(){ const a = ri(2, 12);
      return N(`한 모서리의 길이가 ${a} cm인 정육면체의 부피는 몇 cm³일까요?`, a ** 3, `${a} × ${a} × ${a} = <b>${a ** 3} cm³</b>`, [6 * a * a, a * a, 3 * a], 'cm³'); } },
  { id:'vol-unit', name:'1 m³와 1 cm³의 관계', std:'6수03-18', lv:[2,3], t:'both',
    g(){ const k = pick([2, 3, 4, 5, 6, 7, 8, 1.5, 2.5, 0.8, 0.4, 6.4]);
      return ri(0, 1) ? N(`${nf(k)} m³는 몇 cm³일까요?`, k * 1000000, `1 m³ = 1000000 cm³ → <b>${nf(k * 1000000)} cm³</b>`, [k * 1000, k * 100, k * 10000], 'cm³')
        : N(`${nf(k * 1000000)} cm³는 몇 m³일까요?`, k, `1000000 cm³ = 1 m³ → <b>${nf(k)} m³</b>`, [k * 10, k * 100, k / 10], 'm³'); } },
  { id:'vol-m', name:'m³ 단위로 부피 구하기', std:'6수03-18', lv:[3,3], t:'both',
    g(){ const a = ri(2, 8), b = ri(2, 6), c = pick([50, 100, 150, 200, 250]);
      return N(`가로 ${a} m, 세로 ${b} m, 높이 ${c} cm인 직육면체의 부피는 몇 m³일까요?`, a * b * c / 100, `${c} cm = ${nf(c / 100)} m → ${a} × ${b} × ${nf(c / 100)} = <b>${nf(dz(a * b * c / 100))} m³</b>`, [a * b * c, a * b * c / 10, a * b * c * 100], 'm³'); } },
  { id:'vol-rev', name:'부피로 모르는 길이 구하기', std:'6수03-19', lv:[3,3], t:'both',
    g(){ const a = ri(3, 10), b = ri(2, 8), c = ri(2, 9);
      return N(`부피가 ${a * b * c} cm³인 직육면체의 가로가 ${a} cm, 세로가 ${b} cm예요. 높이는 몇 cm일까요?`, c, `${a * b * c} ÷ (${a} × ${b}) = <b>${c} cm</b>`, [c + 1, a * b, c * 2], 'cm'); } },
  { id:'sa-rev', name:'겉넓이로 정육면체의 부피 구하기', std:'6수03-17', lv:[3,4], t:'both',
    g(){ const a = ri(2, 10);
      return ri(0, 1) ? N(`겉넓이가 ${6 * a * a} cm²인 정육면체의 한 모서리의 길이는?`, a, `한 면의 넓이 ${6 * a * a} ÷ 6 = ${a * a} → <b>${a} cm</b>`, [a * a, a + 1, 6 * a], 'cm')
        : N(`겉넓이가 ${6 * a * a} cm²인 정육면체의 부피는 몇 cm³일까요?`, a ** 3, `한 면 ${a * a} cm² → 한 모서리 ${a} cm → ${a} × ${a} × ${a} = <b>${a ** 3} cm³</b>`, [a * a, 6 * a * a, a ** 3 * 2], 'cm³'); } },
  { id:'vol-big-cube', name:'잘라 만들 수 있는 가장 큰 정육면체', std:'6수03-19', lv:[3,4], t:'both',
    g(){ const d = shuffle([ri(4, 9), ri(6, 12), ri(8, 15)]), m = Math.min(...d);
      return N(`가로 ${d[0]} cm, 세로 ${d[1]} cm, 높이 ${d[2]} cm인 직육면체를 잘라 만들 수 있는 가장 큰 정육면체의 부피는?`, m ** 3, `한 모서리는 가장 짧은 ${m} cm → ${m} × ${m} × ${m} = <b>${m ** 3} cm³</b>`, [d[0] * d[1] * d[2], Math.max(...d) ** 3, 6 * m * m], 'cm³'); } },
  { id:'vol-cmp', name:'부피의 크기 비교하기', std:'6수03-18', lv:[3,3], t:'mc',
    g(){ const v = shuffle([[ri(2, 9), 'm³'], [ri(11, 99) * 100000, 'cm³'], [ri(2, 9) * 100000 + ri(1, 9) * 10000, 'cm³']]), cm = x => x[1] === 'm³' ? x[0] * 1000000 : x[0], lab = x => `${nf(x[0])} ${x[1]}`, s = v.slice().sort((a, b) => cm(b) - cm(a));
      if (cm(s[0]) === cm(s[1])) s[1][0] += 10000;
      return MC(`부피가 가장 큰 것은? (${v.map(lab).join(', ')})`, [lab(s[0]), lab(s[1]), lab(s[2])], `단위를 cm³로 맞추면 ${v.map(x => `${lab(x)} = ${nf(cm(x))} cm³`).join(', ')} → <b>${lab(s[0])}</b>`); } },
  { id:'sa-cut', name:'자른 조각의 겉넓이 늘어난 양', std:'6수03-17', lv:[5,5], t:'both',
    g(){ const a = ri(6, 15), b = ri(3, 8), c = ri(3, 8), k = ri(1, 3), v = 2 * k * b * c;
      return N(`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체 나무 도막을 가로를 나누는 방향으로 ${k}번 잘라 ${k + 1}조각을 만들었어요. 조각들의 겉넓이의 합은 처음보다 몇 cm² 늘어날까요?`, v, `한 번 자를 때마다 ${b} × ${c} = ${b * c} cm²인 면이 2개씩 생겨요 → ${b * c} × 2 × ${k} = <b>${v} cm²</b>`, [b * c * k, 2 * k * a * b, v + b * c], 'cm²'); } },
  { id:'vol-mix', name:'여러 직육면체를 합하거나 뺀 입체도형의 부피', std:'6수03-19', lv:[4,5], t:'both',
    g(){ const a = ri(6, 12), b = ri(3, 8), c = ri(4, 9), d = ri(2, a - 2), e = ri(1, c - 1), v = a * b * c - d * b * e;
      return N(`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체에서 가로 ${d} cm, 세로 ${b} cm, 높이 ${e} cm인 직육면체를 잘라 냈어요. 남은 입체도형의 부피는?`, v, `${a} × ${b} × ${c} - ${d} × ${b} × ${e} = ${a * b * c} - ${d * b * e} = <b>${v} cm³</b>`, [a * b * c + d * b * e, a * b * c, v - b], 'cm³'); } }
]});

/* ─────────────── 6. 여러 가지 그래프 ─────────────── */
const PCTS = () => { let p; do { p = [ri(5, 10), ri(3, 7), ri(2, 5)].map(x => x * 5); p.push(100 - p[0] - p[1] - p[2]); } while (!(p[0] > p[1] && p[1] > p[2] && p[2] >= p[3] && p[3] >= 5)); return p; };
const TOP = [['간식', ['과자', '과일', '빵', '기타']], ['운동', ['축구', '피구', '줄넘기', '기타']], ['계절', ['여름', '겨울', '봄', '가을']], ['과목', ['수학', '체육', '미술', '기타']], ['장소', ['도서관', '놀이터', '화단', '기타']]];
A.addUnit({ key:'6-1-6', title:'여러 가지 그래프', items:[
  { id:'pic-read', name:'그림그래프 읽기', std:'6수04-03', lv:[1,2], t:'both',
    g(){ const reg = ['가', '나', '다', '라'], v = reg.map(() => ri(12, 58)), i = ri(0, 3), row = x => '🍎'.repeat(Math.floor(x / 10)) + '🍏'.repeat(x % 10);
      return N(`마을별 사과 생산량을 그림그래프로 나타냈어요. (🍎 10상자, 🍏 1상자) <b>${reg[i]} 마을</b>의 생산량은 몇 상자일까요?${tableH(reg.map((r, k) => [r + ' 마을', `<span style="font-size:20px;letter-spacing:1px">${row(v[k])}</span>`]))}`, v[i], `큰 그림 ${Math.floor(v[i] / 10)}개 + 작은 그림 ${v[i] % 10}개 = <b>${v[i]}상자</b>`, [Math.floor(v[i] / 10) + v[i] % 10, v[i] + 10, v[i] - 1], '상자'); } },
  { id:'tbl-pct', name:'표를 보고 백분율 구하기', std:'6수04-02', lv:[1,2], t:'both',
    g(){ const [t, nm] = pick(TOP), p = PCTS(), tot = pick([20, 40, 50, 200, 300]), v = p.map(x => x * tot / 100), i = ri(0, 3);
      return N(`좋아하는 ${t}을(를) 조사한 표예요. <b>${nm[i]}</b>의 백분율은 몇 %일까요?${tableH([[t, ...nm, '합계'], ['학생 수(명)', ...v, tot]])}`, p[i], `${v[i]} ÷ ${tot} × 100 = <b>${p[i]}%</b>`, [v[i], p[i] + 5, 100 - p[i]], '%'); } },
  { id:'band-scale', name:'띠그래프와 원그래프의 눈금 읽기', std:'6수04-02', lv:[1,1], t:'both',
    g(){ const n = pick([10, 20, 25, 50]);
      return N(`전체를 ${n}칸으로 똑같이 나눈 띠그래프(또는 원그래프)에서 작은 눈금 한 칸은 몇 %를 나타낼까요?`, 100 / n, `전체 100%를 ${n}칸으로 나누면 100 ÷ ${n} = <b>${100 / n}%</b>`, [n, 10, 100 / n * 2], '%'); } },
  { id:'band-read', name:'띠그래프 읽기', std:'6수04-02', lv:[1,2], t:'both',
    g(){ const [t, nm] = pick(TOP), p = PCTS(), i = ri(1, 3), items = nm.map((n, k) => ({ n, p: p[k], show: k !== i }));
      return N(`좋아하는 ${t}을(를) 조사하여 띠그래프로 나타냈어요. <b>${nm[i]}</b>은(는) 몇 %일까요?`, p[i], `띠그래프 전체는 100% → 100 - (${p.filter((_, k) => k !== i).join(' + ')}) = <b>${p[i]}%</b>`, [p[i] + 5, p[i] - 5, 100 - p[i]], '%', { fig: band(items) }); } },
  { id:'pie-read', name:'원그래프 읽기', std:'6수04-02', lv:[2,3], t:'both',
    g(){ const [t, nm] = pick(TOP), p = PCTS();
      return ri(0, 1) ? N(`좋아하는 ${t}을(를) 조사한 원그래프예요. <b>${nm[0]}</b>은(는) <b>${nm[1]}</b>보다 몇 %p 더 많을까요?`, p[0] - p[1], `${p[0]} - ${p[1]} = <b>${p[0] - p[1]}</b>`, [p[0] + p[1], p[0], p[1]], '%p', { fig: pie(nm.map((n, k) => ({ n, p: p[k] }))) })
        : N(`좋아하는 ${t}을(를) 조사한 원그래프예요. <b>${nm[0]}</b>와(과) <b>${nm[2]}</b>의 백분율의 합은 몇 %일까요?`, p[0] + p[2], `${p[0]} + ${p[2]} = <b>${p[0] + p[2]}%</b>`, [p[0] - p[2], 100 - p[0] - p[2], p[0]], '%', { fig: pie(nm.map((n, k) => ({ n, p: p[k] }))) }); } },
  { id:'pct-of-total', name:'백분율로 항목의 수 구하기', std:'6수04-02', lv:[2,3], t:'both',
    g(){ const [t, nm] = pick(TOP), p = PCTS(), tot = pick([200, 300, 400, 500]), i = ri(0, 3);
      return N(`학생 ${tot}명이 좋아하는 ${t}을(를) 원그래프로 나타냈어요. <b>${nm[i]}</b>을(를) 좋아하는 학생은 몇 명일까요?`, tot * p[i] / 100, `${tot} × ${fr(p[i], 100)} = <b>${tot * p[i] / 100}명</b>`, [p[i], tot * p[i] / 10, tot - tot * p[i] / 100], '명', { fig: pie(nm.map((n, k) => ({ n, p: p[k] }))) }); } },
  { id:'band-times', name:'항목끼리 몇 배인지 비교하기', std:'6수04-02', lv:[3,4], t:'both',
    g(){ const [t, nm] = pick(TOP); let p; do { p = PCTS(); } while (p[0] % p[3] !== 0 || p[0] === p[3]);
      return N(`좋아하는 ${t}을(를) 조사한 띠그래프예요. <b>${nm[0]}</b>을(를) 좋아하는 학생 수는 <b>${nm[3]}</b>의 몇 배일까요?`, p[0] / p[3], `전체가 같으므로 백분율로 비교해요: ${p[0]} ÷ ${p[3]} = <b>${p[0] / p[3]}배</b>`, [p[0] - p[3], p[0] / p[3] + 1, p[3]], '배', { fig: band(nm.map((n, k) => ({ n, p: p[k] }))) }); } },
  { id:'pie-over', name:'조건에 맞는 항목 찾기', std:'6수04-02', lv:[3,3], t:'mc',
    g(){ const [t, nm] = pick(TOP), p = PCTS(), th = pick([20, 25, 30]), ok = nm.filter((_, k) => p[k] >= th), no = nm.filter((_, k) => p[k] < th);
      if (!ok.length || !no.length) return this.g();
      return MC(`좋아하는 ${t} 중 전체의 <b>${th}% 이상</b>인 것을 모두 고르면?`, [ok.join(', '), nm.join(', '), no.join(', '), [...ok.slice(1), ...no.slice(0, 1)].join(', ')].filter(x => x),
        `${nm.map((n, k) => `${n} ${p[k]}%`).join(', ')} → ${th}% 이상: <b>${ok.join(', ')}</b>`, { fig: pie(nm.map((n, k) => ({ n, p: p[k] }))) }); } },
  { id:'two-school', name:'전체가 다른 두 원그래프 비교하기', std:'6수04-02', lv:[4,5], t:'both',
    g(){ const n1 = pick([200, 300, 400]), n2 = pick([200, 300, 500]), p1 = ri(2, 8) * 5, p2 = ri(2, 8) * 5, a = n1 * p1 / 100, b = n2 * p2 / 100;
      if (a === b) return this.g();
      return N(`가 학교 학생 ${n1}명 중 ${p1}%, 나 학교 학생 ${n2}명 중 ${p2}%가 빵을 좋아해요. 빵을 좋아하는 학생은 어느 학교가 몇 명 더 많을까요? (차를 구하세요)`, Math.abs(a - b), `가: ${n1} × ${fr(p1, 100)} = ${a}명, 나: ${n2} × ${fr(p2, 100)} = ${b}명 → 차 <b>${Math.abs(a - b)}명</b> (백분율만 비교하면 안 돼요!)`, [Math.abs(p1 - p2), a + b, Math.abs(a - b) + 10], '명'); } },
  { id:'graph-pick', name:'목적에 알맞은 그래프 고르기', std:'6수04-03', lv:[2,3], t:'mc',
    g(){ const c = pick([['하루 동안 교실 온도의 <b>변화</b>', '꺾은선그래프', '시간에 따른 변화는 꺾은선그래프가 잘 보여요.'], ['반별 학생 수처럼 <b>양의 크기</b> 비교', '막대그래프', '항목별 양을 비교할 때는 막대그래프가 편리해요.'], ['전체에 대한 각 항목의 <b>비율</b>', '원그래프', '전체에 대한 부분의 비율은 띠그래프나 원그래프로 나타내요.'], ['지역별 쌀 생산량을 <b>지도 위에</b> 한눈에', '그림그래프', '지역별 수량을 그림의 크기와 수로 나타내면 그림그래프예요.']]), all = ['꺾은선그래프', '막대그래프', '원그래프', '그림그래프'];
      return MC(`${c[0]}을(를) 나타내기에 가장 알맞은 그래프는?`, [c[1], ...all.filter(x => x !== c[1])], c[2]); } },
  { id:'graph-true', name:'그래프를 해석한 내용 판단하기', std:'6수04-03', lv:[4,4], t:'mc',
    g(){ const [t, nm] = pick(TOP), p = PCTS();
      return MC(`좋아하는 ${t}을(를) 나타낸 원그래프를 보고 옳은 것을 고르세요.`, [`${nm[0]}을(를) 좋아하는 학생이 가장 많아요.`, `${nm[3]}을(를) 좋아하는 학생이 가장 많아요.`, `${nm[1]}은(는) 전체의 ${p[1] + 10}%예요.`, `모든 항목의 백분율의 합은 ${100 - p[3]}%예요.`], `가장 넓은 부분은 ${nm[0]}(${p[0]}%)이고, 백분율의 합은 항상 100%예요.`, { fig: pie(nm.map((n, k) => ({ n, p: p[k] }))) }); } }
]});
})();
