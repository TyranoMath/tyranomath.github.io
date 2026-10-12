/* =========================================================
   🦖 개념 탐험대 — 4학년 2학기 (2022 개정 교육과정)
   단원 순서: 1 삼각형 · 2 분수의 덧셈과 뺄셈 · 3 사각형 · 4 소수의 덧셈과 뺄셈 · 5 다각형 · 6 꺾은선그래프
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g4-2.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, G42 = window.TM_G42, T = window.TM_L3;
const { fr, svg, txt, line, range, tableH, ri, pick, shuffle, gcd } = A;
const { P } = T;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const rad = d => d * Math.PI / 180;
const angAt = (p, q, r) => { const v1 = [q[0] - p[0], q[1] - p[1]], v2 = [r[0] - p[0], r[1] - p[1]]; return Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / Math.hypot(...v1) / Math.hypot(...v2)))) * 180 / Math.PI; };
const MX = G42.MX;

/* ═════════════ 1. 삼각형 실험실 ═════════════ */
const angLab = (p, q, r, v, col = '#FF9F43') => { const a1 = Math.atan2(q[1] - p[1], q[0] - p[0]), a2 = Math.atan2(r[1] - p[1], r[0] - p[0]); let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; const R = 22, m = a1 + d / 2;
  return `<path d="M${p[0]} ${p[1]} L${(p[0] + R * Math.cos(a1)).toFixed(1)} ${(p[1] + R * Math.sin(a1)).toFixed(1)} A${R} ${R} 0 0 ${d > 0 ? 1 : 0} ${(p[0] + R * Math.cos(a2)).toFixed(1)} ${(p[1] + R * Math.sin(a2)).toFixed(1)} Z" fill="${col}" opacity=".45"/>` + txt(p[0] + 40 * Math.cos(m), p[1] + 40 * Math.sin(m), v + '°', { size: 12, bold: true }); };
const isoLab = { title: '이등변삼각형을 접어 보며 두 각 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>꼭대기 각</label><input type="range" min="20" max="150" step="2" value="50" id="ia"><span class="v" id="iav"></span><button class="tbtn" type="button" id="if" aria-pressed="false">반으로 접는 선 보기</button></div><div class="figc" id="ig"></div><div class="out" id="io"></div>`;
  let fold = false;
  const draw = () => { const ap = +$in(el, '#ia').value, S = 150, h = S * Math.cos(rad(ap / 2)), half = S * Math.sin(rad(ap / 2)), C = 180, top = [C, 20], l = [C - half, 20 + h], r = [C + half, 20 + h], b = (180 - ap) / 2;
    $in(el, '#iav').textContent = ap + '°';
    let g = `<polygon points="${[top, l, r].map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="#EEF6FF" stroke="${INK}" stroke-width="2.4"/>` + angLab(top, l, r, ap, '#9CC7EE') + angLab(l, r, top, b) + angLab(r, top, l, b);
    g += txt((top[0] + l[0]) / 2 - 22, (top[1] + l[1]) / 2, '같은 길이', { size: 11, fill: BL, bold: true }) + txt((top[0] + r[0]) / 2 + 24, (top[1] + r[1]) / 2, '같은 길이', { size: 11, fill: BL, bold: true });
    if (fold) g += line(C, 20, C, 20 + h, { stroke: RED, w: 2, dash: '6 4' });
    $in(el, '#ig').innerHTML = svg(360, 40 + h, g);
    const kind = ap < 90 && b < 90 ? '예각삼각형' : ap === 90 ? '직각삼각형' : '둔각삼각형';
    $in(el, '#io').innerHTML = `길이가 같은 두 변과 함께 있는 두 각: <b>${b}° = ${b}°</b> (크기가 같아요)<br>180° - ${ap}° = ${180 - ap}° → ${180 - ap}° ÷ 2 = <b>${b}°</b> · 이 삼각형은 <b>${kind}</b>${ap === 60 ? '이고 세 각이 모두 60° → <b>정삼각형</b>!' : ''}<br><span style="color:${GRAY}">${fold ? '반으로 접으면 두 각이 꼭 맞게 겹쳐요.' : '접는 선을 보면 왜 두 각이 같은지 알 수 있어요.'}</span>`; };
  $in(el, '#ia').addEventListener('input', draw);
  $in(el, '#if').addEventListener('click', e => { fold = !fold; e.target.setAttribute('aria-pressed', fold); draw(); }); draw();
} };
const eqLab = { title: '정삼각형의 변과 각 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>한 변</label><input type="range" min="2" max="9" value="5" id="ea"><span class="v" id="eav"></span></div><div class="figc" id="eg"></div><div class="out" id="eo"></div>`;
  const draw = () => { const a = +$in(el, '#ea').value, s = a * 26, h = s * Math.sqrt(3) / 2, top = [140, 15], l = [140 - s / 2, 15 + h], r = [140 + s / 2, 15 + h]; $in(el, '#eav').textContent = a + ' cm';
    $in(el, '#eg').innerHTML = svg(280, 35 + h, `<polygon points="${[top, l, r].map(p => p.join(',')).join(' ')}" fill="#FFF1DE" stroke="${INK}" stroke-width="2.4"/>` + angLab(top, l, r, 60, '#FFC48A') + angLab(l, r, top, 60, '#FFC48A') + angLab(r, top, l, 60, '#FFC48A') + txt(140, 28 + h, `${a} cm`, { size: 12, bold: true, fill: BL }));
    $in(el, '#eo').innerHTML = `세 변이 모두 <b>${a} cm</b> · 세 각이 모두 <b>60°</b> (180° ÷ 3)<br>세 변의 길이의 합: ${a} × 3 = <b>${a * 3} cm</b><br><span style="color:${GRAY}">정삼각형은 두 변의 길이가 같으므로 <b>이등변삼각형</b>이라고도 할 수 있어요.</span>`; };
  $in(el, '#ea').addEventListener('input', draw); draw();
} };
const classLab = { title: '꼭짓점을 움직이며 두 가지 기준으로 분류하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>꼭짓점 ↔</label><input type="range" min="-60" max="260" value="100" id="cx"><label>↕</label><input type="range" min="20" max="200" value="173" id="cy"><button class="tbtn" type="button" id="ce">정삼각형</button><button class="tbtn" type="button" id="cr">직각이등변</button></div><div class="figc" id="cg"></div><div id="ct" class="tscroll"></div><div class="out" id="co"></div>`;
  const draw = () => { const x = +$in(el, '#cx').value, y = +$in(el, '#cy').value, base = 200, l = [70, 220], r = [70 + base, 220], t = [70 + x, 220 - y];
    const sd = [Math.hypot(r[0] - t[0], r[1] - t[1]), Math.hypot(l[0] - t[0], l[1] - t[1]), base].map(v => v / 20);
    const as = [angAt(l, r, t), angAt(r, t, l), angAt(t, l, r)].map(v => Math.round(v)); as[2] = 180 - as[0] - as[1];
    const eqS = (p, q) => Math.abs(p - q) < .15, eqCount = [eqS(sd[0], sd[1]), eqS(sd[1], sd[2]), eqS(sd[0], sd[2])].filter(Boolean).length;
    const bySide = eqCount >= 2 ? 2 : eqCount === 1 ? 1 : 0, mx = Math.max(...as), byAng = mx < 90 ? 0 : mx === 90 ? 1 : 2;
    $in(el, '#cg').innerHTML = svg(360, 240, `<polygon points="${[l, r, t].map(p => p.join(',')).join(' ')}" fill="#EEF6FF" stroke="${INK}" stroke-width="2.4"/>` + angLab(l, r, t, as[0]) + angLab(r, t, l, as[1]) + angLab(t, l, r, as[2]));
    const S = ['세 변의 길이가 모두 다른 삼각형', '이등변삼각형', '정삼각형'], An = ['예각삼각형', '직각삼각형', '둔각삼각형'];
    let h = '<table class="qt" style="font-size:14px"><tr><th></th>' + An.map(a => `<th>${a}</th>`).join('') + '</tr>';
    S.forEach((s, i) => { h += `<tr><th>${s}</th>` + An.map((_, j) => `<td style="${i === bySide && j === byAng ? 'background:#FFE38A;font-weight:700' : ''}">${i === bySide && j === byAng ? '🦖' : (i === 2 && j > 0 ? '✕' : '')}</td>`).join('') + '</tr>'; });
    $in(el, '#ct').innerHTML = h + '</table>';
    $in(el, '#co').innerHTML = `세 변: ${sd.map(v => v.toFixed(1)).join(' cm, ')} cm · 세 각: ${as.join('°, ')}°<br>→ <b>${S[bySide]}</b>이면서 <b>${An[byAng]}</b><br><span style="color:${GRAY}">정삼각형은 세 각이 모두 60°라서 직각삼각형이나 둔각삼각형이 될 수 없어요(✕).</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#ce').addEventListener('click', () => { $in(el, '#cx').value = 100; $in(el, '#cy').value = 173; draw(); });
  $in(el, '#cr').addEventListener('click', () => { $in(el, '#cx').value = 100; $in(el, '#cy').value = 100; draw(); }); draw();
} };

/* ═════════════ 2. 분수의 덧셈과 뺄셈 실험실 ═════════════ */
const fracBars = (parts, d, W = 120) => { // parts: 칸별 색 배열(길이 = 칸 수), 1마다 굵은 테두리
  const wholes = Math.max(1, Math.ceil(parts.length / d)), u = W / d; let g = '';
  for (let w = 0; w < wholes; w++){ for (let i = 0; i < d; i++){ const k = w * d + i, c = parts[k]; g += `<rect x="${6 + w * (W + 12) + i * u}" y="6" width="${u}" height="36" fill="${c || '#fff'}" stroke="${INK}" stroke-width="1.2"/>`; if (c === 'X') g += line(6 + w * (W + 12) + i * u, 6, 6 + w * (W + 12) + (i + 1) * u, 42, { stroke: RED, w: 2 }); }
    g += `<rect x="${6 + w * (W + 12)}" y="6" width="${W}" height="36" fill="none" stroke="${INK}" stroke-width="2.6"/>` + txt(6 + w * (W + 12) + W / 2, 54, '1', { size: 11, fill: GRAY }); }
  return svg(wholes * (W + 12) + 6, 62, g.replace(/fill="X"/g, 'fill="#FFD7DE"')); };
const fracAddLab = (minus, a0, b0) => ({ title: minus ? '분모가 같은 분수의 뺄셈을 막대로 알아보기' : '분모가 같은 분수의 덧셈을 막대로 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>분모</label><input type="range" min="3" max="9" value="5" id="fd"><span class="v" id="fdv"></span><label>첫째 분자</label><input type="range" min="1" max="20" value="${a0 || (minus ? 12 : 3)}" id="fa"><span class="v" id="fav"></span><label>둘째 분자</label><input type="range" min="1" max="20" value="${b0 || 4}" id="fbb"><span class="v" id="fbv"></span></div><div class="figc" id="fg"></div><div class="out" id="fo"></div>`;
  const draw = () => { const d = +$in(el, '#fd').value, aI = $in(el, '#fa'), bI = $in(el, "#fbb"); aI.max = 3 * d - 1; bI.max = minus ? Math.max(1, +aI.value - 1) : 3 * d - 1; const a = +aI.value, b = Math.min(+bI.value, +bI.max); bI.value = b;
    $in(el, '#fdv').textContent = d; $in(el, '#fav').textContent = a; $in(el, '#fbv').textContent = b;
    const r = minus ? a - b : a + b;
    const parts = minus ? range(0, a - 1).map(i => i >= a - b ? 'X' : '#8FD19E') : range(0, a + b - 1).map(i => i < a ? '#8FD19E' : '#FFC48A');
    $in(el, '#fg').innerHTML = fracBars(parts, d);
    $in(el, '#fo').innerHTML = `${MX(a, d)} ${minus ? '-' : '+'} ${MX(b, d)} → ${fr(1, d)}이 ${a}개 ${minus ? '-' : '+'} ${b}개 = ${r}개 → ${fr(r, d)}${r >= d ? ` = <b>${MX(r, d)}</b>` : ` = <b>${fr(r, d)}</b>`}<br><span style="color:${GRAY}">분모는 그대로! 분자끼리 ${minus ? '빼요' : '더해요'}. ${r > d && r % d ? '가분수는 대분수로 바꾸어 나타내요.' : ''}</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
const borrowLab = nat => ({ title: nat ? '(자연수) - (분수): 1을 분수로 바꾸어 빼기' : '분수끼리 뺄 수 없을 때 1을 받아내리기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="bn">🎲 새 문제</button><button class="tbtn" type="button" id="bs">▶ 다음 단계</button></div><div class="out" id="bx" style="font-size:24px"></div><div class="figc" id="bg"></div><div class="out" id="bo"></div>`;
  let d, w1, a, w2, b, k;
  const fresh = () => { d = pick([4, 5, 6, 7, 8]); w1 = ri(2, 4); a = nat ? 0 : ri(1, d - 2); w2 = ri(0, w1 - 1); b = ri(a + 1, d - 1); k = 0; draw(); };
  const draw = () => { const top = w1 * d + a, sub = w2 * d + b, r = top - sub;
    $in(el, '#bx').innerHTML = `${a ? fr(a, d, w1) : w1} - ${w2 ? fr(b, d, w2) : fr(b, d)} = ?`;
    let parts = range(0, top - 1).map(() => '#8FD19E');
    if (k >= 1) parts = parts.map((c, i) => i >= (w1 - 1) * d && i < w1 * d ? '#BFE3FF' : c);
    if (k >= 2) parts = parts.map((c, i) => i >= top - sub ? 'X' : c);
    $in(el, '#bg').innerHTML = fracBars(parts, d, 110);
    const M = [a ? `분수 부분 ${fr(a, d)}에서 ${fr(b, d)}를 뺄 수 없어요. ▶를 눌러 보세요.` : `자연수 ${w1}에는 분수 부분이 없어서 ${fr(b, d)}를 바로 뺄 수 없어요. ▶를 눌러 보세요.`,
      `자연수 1을 ${fr(d, d)}로 바꾸어요(파란 칸) → ${a ? fr(a, d, w1) : w1} = <b>${fr(a + d, d, w1 - 1 || '')}</b>`,
      `자연수끼리 ${w1 - 1} - ${w2} = ${w1 - 1 - w2}, 분수끼리 ${fr(a + d, d)} - ${fr(b, d)} = ${fr(a + d - b, d)} → 🎉 <b>${MX(r, d)}</b><br><span style="color:${GRAY}">가분수로 바꾸어 ${fr(top, d)} - ${fr(sub, d)} = ${fr(r, d)}처럼 계산해도 돼요.</span>`];
    $in(el, '#bo').innerHTML = M[k]; $in(el, '#bs').disabled = k >= 2; };
  $in(el, '#bn').addEventListener('click', fresh); $in(el, '#bs').addEventListener('click', () => { k++; draw(); }); fresh();
} });

/* ═════════════ 3. 사각형 실험실 ═════════════ */
const perpLab = { title: '한 직선을 돌리며 수직 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>직선 나 돌리기</label><input type="range" min="20" max="160" value="70" id="pa"><span class="v" id="pav"></span><button class="tbtn" type="button" id="p9">수직 만들기</button></div><div class="figc" id="pg"></div><div class="out" id="po"></div>`;
  const draw = () => { const d = +$in(el, '#pa').value, C = [170, 130], Lg = 120; $in(el, '#pav').textContent = d + '°';
    let g = line(20, C[1], 320, C[1], { w: 3 }) + txt(312, C[1] + 16, '가', { size: 14, bold: true }) + line(C[0] - Lg * Math.cos(rad(d)), C[1] + Lg * Math.sin(rad(d)), C[0] + Lg * Math.cos(rad(d)), C[1] - Lg * Math.sin(rad(d)), { w: 3, stroke: d === 90 ? RED : BL }) + txt(C[0] + (Lg + 10) * Math.cos(rad(d)), C[1] - (Lg + 10) * Math.sin(rad(d)), '나', { size: 14, bold: true, fill: d === 90 ? RED : BL });
    g += d === 90 ? `<path d="M${C[0] + 16} ${C[1]} L${C[0] + 16} ${C[1] - 16} L${C[0]} ${C[1] - 16}" fill="none" stroke="${RED}" stroke-width="2.4"/>` : `<path d="M${C[0] + 28} ${C[1]} A28 28 0 0 0 ${(C[0] + 28 * Math.cos(rad(d))).toFixed(1)} ${(C[1] - 28 * Math.sin(rad(d))).toFixed(1)}" fill="none" stroke="${OR}" stroke-width="2.4"/>`;
    $in(el, '#pg').innerHTML = svg(340, 260, g);
    $in(el, '#po').innerHTML = d === 90 ? '🎉 두 직선이 만나서 이루는 각이 <b>직각</b> → 직선 가와 나는 서로 <b>수직</b>이에요. 직선 나는 직선 가에 대한 <b>수선</b>!' : `두 직선이 만나서 이루는 각: ${d}°, ${180 - d}° → 직각이 아니므로 수직이 아니에요.`; };
  $in(el, '#pa').addEventListener('input', draw); $in(el, '#p9').addEventListener('click', () => { $in(el, '#pa').value = 90; draw(); }); draw();
} };
const parLab = { title: '두 직선이 만나지 않게 만들어 평행선 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>직선 가의 기울기</label><input type="range" min="-30" max="30" value="0" id="la"><label>직선 나의 기울기</label><input type="range" min="-30" max="30" value="12" id="lb"><button class="tbtn" type="button" id="lp">평행하게</button></div><div class="figc" id="lg"></div><div class="out" id="lo"></div>`;
  const draw = () => { const a = +$in(el, '#la').value, b = +$in(el, '#lb').value, y1 = 60, y2 = 170, f = (y0, s, x) => y0 - (x - 170) * Math.tan(rad(s));
    let g = line(10, f(y1, a, 10), 330, f(y1, a, 330), { w: 3, stroke: BL }) + line(10, f(y2, b, 10), 330, f(y2, b, 330), { w: 3, stroke: OR }) + txt(20, f(y1, a, 20) - 12, '가', { size: 14, bold: true }) + txt(20, f(y2, b, 20) - 12, '나', { size: 14, bold: true });
    const par = a === b;
    if (par) [90, 170, 250].forEach(x => { const yy1 = f(y1, a, x), yy2 = f(y2, b, x); const nx = Math.sin(rad(a)), ny = Math.cos(rad(a)), len = (y2 - y1) * Math.cos(rad(a)); g += line(x, yy1, x + nx * len, yy1 + ny * len, { stroke: RED, w: 2, dash: '5 4' }); });
    $in(el, '#lg').innerHTML = svg(340, 240, g);
    $in(el, '#lo').innerHTML = par ? `🎉 아무리 늘여도 서로 만나지 않아요 → <b>평행</b>! 평행한 두 직선 = <b>평행선</b><br><span style="color:${GRAY}">빨간 점선(수선)의 길이는 어디서 재어도 같아요 → 평행선 사이의 거리</span>` : `두 직선을 길게 늘이면 언젠가 <b>만나요</b> → 평행하지 않아요.`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); $in(el, '#lp').addEventListener('click', () => { $in(el, '#lb').value = $in(el, '#la').value; draw(); }); draw();
} };
const distLab = { title: '평행선 사이의 가장 짧은 선분 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>아래 점 옮기기</label><input type="range" min="20" max="320" value="250" id="dx"></div><div class="figc" id="dg"></div><div class="out" id="do"></div>`;
  const draw = () => { const x = +$in(el, '#dx').value, P0 = [170, 50], y2 = 170, len = Math.hypot(x - P0[0], y2 - P0[1]) / 24;
    let g = line(10, 50, 330, 50, { w: 3 }) + line(10, y2, 330, y2, { w: 3 }) + line(P0[0], P0[1], P0[0], y2, { stroke: '#C9D3E0', w: 2, dash: '4 4' }) + line(P0[0], P0[1], x, y2, { stroke: x === 170 ? RED : BL, w: 3 }) + `<circle cx="${P0[0]}" cy="${P0[1]}" r="5" fill="${INK}"/><circle cx="${x}" cy="${y2}" r="6" fill="${x === 170 ? RED : BL}"/>`;
    if (x === 170) g += `<path d="M${P0[0] + 14} ${y2} L${P0[0] + 14} ${y2 - 14} L${P0[0]} ${y2 - 14}" fill="none" stroke="${RED}" stroke-width="2"/>`;
    $in(el, '#dg').innerHTML = svg(340, 200, g);
    $in(el, '#do').innerHTML = `선분의 길이: 약 <b>${len.toFixed(1)} cm</b> ${x === 170 ? '🎉 가장 짧아요! 평행선에 <b>수직</b>인 선분 → 이 길이가 <b>평행선 사이의 거리 (5 cm)</b>' : '— 점을 움직여 가장 짧은 선분을 찾아보세요.'}`; };
  $in(el, '#dx').addEventListener('input', draw); $in(el, '#dx').step = 10; draw();
} };
const quadLab = (pre = '6,3,1,4') => ({ title: '변을 바꾸며 여러 가지 사각형 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>아랫변</label><input type="range" min="2" max="8" value="6" id="qw"><span class="v" id="qwv"></span><label>윗변</label><input type="range" min="1" max="8" value="3" id="qt"><span class="v" id="qtv"></span></div><div class="ctrl"><label>윗변 밀기</label><input type="range" min="-3" max="5" value="1" id="qs"><span class="v" id="qsv"></span><label>높이</label><input type="range" min="2" max="8" value="4" id="qh"><span class="v" id="qhv"></span></div><div class="ctrl"><button class="tbtn" type="button" data-p="6,6,0,6">정사각형</button><button class="tbtn" type="button" data-p="7,7,0,4">직사각형</button><button class="tbtn" type="button" data-p="5,5,3,4">마름모</button><button class="tbtn" type="button" data-p="6,6,2,3">평행사변형</button><button class="tbtn" type="button" data-p="7,3,2,4">사다리꼴</button></div><div class="figc" id="qg"></div><div class="out" id="qo"></div>`;
  const draw = () => { const w = +$in(el, '#qw').value, t = +$in(el, '#qt').value, s = +$in(el, '#qs').value, h = +$in(el, '#qh').value, u = 28, X = 20 + 3 * u, Y = 20 + h * u;
    ['w', 't', 's', 'h'].forEach(k => { $in(el, `#q${k}v`).textContent = $in(el, `#q${k}`).value; });
    const p = [[X, Y], [X + w * u, Y], [X + (s + t) * u, Y - h * u], [X + s * u, Y - h * u]];
    let g = A.svg ? '' : ''; for (let i = 0; i <= 16; i++) g += line(20 + i * u, 10, 20 + i * u, Y + 10, { stroke: '#EEF1F6', w: 1 }); for (let j = 0; j <= h + 1; j++) g += line(20, Y - j * u, 20 + 16 * u, Y - j * u, { stroke: '#EEF1F6', w: 1 });
    g += `<polygon points="${p.map(q => q.join(',')).join(' ')}" fill="#FFF1DE" stroke="${INK}" stroke-width="2.6"/>`;
    const para = t === w, side = Math.hypot(s, h), rect = para && s === 0, rhom = para && Math.abs(side - w) < 1e-9, sq = rect && h === w;
    const names = ['사다리꼴', ...(para ? ['평행사변형'] : []), ...(rhom ? ['마름모'] : []), ...(rect ? ['직사각형'] : []), ...(sq ? ['정사각형'] : [])];
    $in(el, '#qg').innerHTML = svg(20 + 16 * u + 10, Y + 20, g);
    $in(el, '#qo').innerHTML = `윗변과 아랫변이 평행 → <b>사다리꼴</b>${para ? ' · 윗변 = 아랫변이라 마주 보는 두 쌍의 변이 평행 → <b>평행사변형</b>' : ''}${rhom ? ' · 네 변의 길이가 모두 같아요 → <b>마름모</b>' : ''}${rect ? ' · 네 각이 모두 직각 → <b>직사각형</b>' : ''}${sq ? ' · 네 변도 같아요 → <b>정사각형</b>' : ''}<br>이 사각형의 이름: <b>${names.join(', ')}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  const setP = p => { const [w, t, s, h] = p.split(','); $in(el, '#qw').value = w; $in(el, '#qt').value = t; $in(el, '#qs').value = s; $in(el, '#qh').value = h; draw(); };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => setP(b.dataset.p))); setP(pre);
} });

/* ═════════════ 4. 소수의 덧셈과 뺄셈 실험실 ═════════════ */
const fx = x => String(A.dz(x));
const gridLab = { title: '모눈 100칸으로 소수 두 자리 수 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>색칠한 칸</label><input type="range" min="1" max="100" value="37" id="gn"><span class="v" id="gnv"></span></div><div class="figc" id="gg"></div><div class="out" id="go"></div>`;
  const draw = () => { const n = +$in(el, '#gn').value, u = 22; $in(el, '#gnv').textContent = n; let g = '';
    for (let i = 0; i < 100; i++) g += `<rect x="${4 + (i % 10) * u}" y="${4 + Math.floor(i / 10) * u}" width="${u}" height="${u}" fill="${i < n ? (Math.floor(i / 10) % 2 ? '#8FD19E' : '#B9E3C6') : '#fff'}" stroke="#9AA6B6" stroke-width="1"/>`;
    $in(el, '#gg').innerHTML = svg(10 * u + 8, 10 * u + 8, g + `<rect x="4" y="4" width="${10 * u}" height="${10 * u}" fill="none" stroke="${INK}" stroke-width="2.4"/>`);
    const v = (n / 100).toFixed(2); $in(el, '#go').innerHTML = `${fr(1, 100)} = <b>0.01</b> (영 점 영일) · 색칠한 부분: ${fr(n, 100)} = <b>${n === 100 ? '1' : v}</b><br><span style="color:${GRAY}">한 줄(10칸) = 0.1 → ${Math.floor(n / 10)}줄과 ${n % 10}칸 = 0.1이 ${Math.floor(n / 10)}개, 0.01이 ${n % 10}개</span>`; };
  $in(el, '#gn').addEventListener('input', draw); draw();
} };
const DK = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const readDec = s => { const [w, f] = s.split('.'); return (+w ? window.TM_G4.readKo(+w) : '영') + (f ? ' 점 ' + f.split('').map(d => DK[+d]).join('') : ''); };
const placeDecLab = { title: '자리마다 숫자를 바꾸며 소수 읽기', init(el){
  const PN = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'], PV = [1, 0.1, 0.01, 0.001];
  let dg = [2, 4, 0, 7];
  el.innerHTML = `<div id="dt"></div><div class="out" id="do"></div>`;
  const draw = () => { let h = '<table class="qt"><tr>' + PN.map(p => `<th style="font-size:13px">${p}</th>`).join('') + '</tr><tr>';
    dg.forEach((d, i) => { h += `<td style="padding:2px"><button class="tbtn" type="button" data-i="${i}" style="min-width:52px;font-family:Fredoka;font-size:26px">${d}${i === 0 ? '<span style="color:#E0464A">.</span>' : ''}</button></td>`; });
    $in(el, '#dt').innerHTML = h + '</tr></table>';
    el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; dg[i] = (dg[i] + 1) % 10; draw(); }));
    const s = `${dg[0]}.${dg[1]}${dg[2]}${dg[3]}`.replace(/0+$/, '').replace(/\.$/, '');
    $in(el, '#do').innerHTML = `<b style="font-family:Fredoka;font-size:28px">${s}</b> → 읽기: <b>${readDec(s)}</b><br>${dg.map((d, i) => d ? `${d}${P(d, '은', '는')} ${fx(d * PV[i])}` : '').filter(Boolean).join(' · ')}<br><span style="color:${GRAY}">0.001이 ${dg[0] * 1000 + dg[1] * 100 + dg[2] * 10 + dg[3]}개인 수 · 소수 끝자리의 0은 생략할 수 있어요.</span>`; };
  draw();
} };
const decCmpLab = { title: '자리를 맞추어 소수의 크기 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cn">🎲 새 두 소수</button></div><div id="ct"></div><div class="out" id="co"></div>`;
  const fresh = () => { const a = (ri(1, 9) + ri(0, 999) / 1000).toFixed(3); let b = a.split(''); const j = pick([2, 3, 4]); b[j] = String((+b[j] + ri(1, 9)) % 10); b = b.join('');
    const tA = a.replace(/0+$/, ''), tB = b.replace(/0+$/, '');
    let first = -1; for (let i = 0; i < 5; i++) if (a[i] !== b[i]){ first = i; break; }
    const row = s => s.split('').map((c, i) => `<td style="font-family:Fredoka;font-size:24px;padding:2px 8px;${i === first ? 'background:#FFE38A' : ''}">${c}</td>`).join('');
    $in(el, '#ct').innerHTML = `<table class="qt"><tr><th>가</th>${row(a)}</tr><tr><th>나</th>${row(b)}</tr></table>`;
    const c = +a > +b ? '&gt;' : '&lt;';
    $in(el, '#co').innerHTML = `<b>${tA} ${c} ${tB}</b><br><span style="color:${GRAY}">${tA !== a || tB !== b ? `자릿수가 다르면 끝에 0을 붙여 맞추고(${tA !== a ? `${tA} = ${a}` : `${tB} = ${b}`}), ` : ''}높은 자리부터 비교해요. 노란 칸에서 처음 달라져요.</span>`; };
  $in(el, '#cn').addEventListener('click', fresh); fresh();
} };
const shiftLab = { title: '10배, 100배, 1/10, 1/100 하면 소수점이 움직여요', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" data-k="10">× 10</button><button class="tbtn" type="button" data-k="100">× 100</button><button class="tbtn" type="button" data-k="0.1">× 1/10</button><button class="tbtn" type="button" data-k="0.01">× 1/100</button><button class="tbtn" type="button" id="sr">↺ 2.36</button></div><div id="st"></div><div class="out" id="so"></div>`;
  let v = 2.36, log = [];
  const draw = () => { const PN = ['백', '십', '일', '.', '0.1', '0.01', '0.001'], s = v.toFixed(3).padStart(7, ' '), fd = fx(v).split('.')[1] || '', cells = [s[0], s[1], s[2], '.', ...[4, 5, 6].map((j, q) => q < fd.length ? s[j] : '')];
    const trimmed = fx(v); let h = '<table class="qt"><tr>' + PN.map(p => `<th style="font-size:12px">${p === '.' ? '' : p}</th>`).join('') + '</tr><tr>' + cells.map((c, i) => `<td style="font-family:Fredoka;font-size:26px;${i === 3 ? 'color:#E0464A;padding:0 2px' : ''}">${c.trim()}</td>`).join('') + '</tr></table>';
    $in(el, '#st').innerHTML = h; $in(el, '#so').innerHTML = `지금 수: <b>${trimmed}</b>${log.length ? `<br>${log.join(' → ')}` : ''}<br><span style="color:${GRAY}">10배 하면 소수점이 오른쪽으로 한 칸, 1/10을 하면 왼쪽으로 한 칸 옮겨져요.</span>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { const k = +b.dataset.k, nv = A.dz(v * k); if (nv >= 1000 || nv < 0.001) return; log.push(`${fx(v)} ${b.textContent} = ${fx(nv)}`); if (log.length > 3) log.shift(); v = nv; draw(); }));
  $in(el, '#sr').addEventListener('click', () => { v = 2.36; log = []; draw(); }); draw();
} };
const decColLab = (op, k, mix) => ({ title: `소수 ${k === 1 ? '한' : '두'} 자리 수의 ${op === '+' ? '덧셈' : '뺄셈'} 세로셈`, init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="dn">🎲 새 문제</button><button class="tbtn" type="button" id="ds">▶ 다음 단계</button></div><div id="dt"></div><div class="out" id="do"></div>`;
  let a, b, S, kk, K;
  const NAME = i => i < K ? `소수 ${['첫째', '둘째'][K - 1 - i]} 자리` : ['일의 자리', '십의 자리', '백의 자리'][i - K];
  const fresh = () => { K = k; const m = Math.pow(10, k);
    if (mix){ a = ri(20, 99) * 10; b = ri(11, a - 20); if (b % 10 === 0) b++; if (op === '+') [a, b] = [ri(11, 99) * 10, ri(11, 499)]; }
    else if (op === '+'){ a = ri(11, 9 * m); b = ri(11, 9 * m); } else { a = ri(2 * m, 9 * m); b = ri(11, a - 1); }
    const r = op === '+' ? a + b : a - b; S = T.colSteps(op, a, b);
    S.st.forEach(s => { s.msg = s.msg.replace(/(일|십|백|천|만)의 자리/g, mm => NAME(['일', '십', '백', '천', '만'].indexOf(mm[0]))).replace(/ &nbsp;🎉 <b>.*<\/b>$/, ''); });
    const last = S.st[S.st.length - 1]; last.msg += ` &nbsp;🎉 <b>${fx(a / m)} ${op} ${fx(b / m)} = ${fx(r / m)}</b>`; S.r = r; kk = 0; draw(); };
  const draw = () => { const s = S.st[kk], m = Math.pow(10, K), da = String(a).split('').reverse().map(Number), db = String(b).split('').reverse().map(Number), W = Math.max(String(a).length, String(b).length, String(S.r).length, K + 1) + (op === '+' ? 1 : 0), rl = String(S.r).length;
    const td = (v, st = '') => `<td style="width:1.1em;height:1.2em;text-align:center;${st}">${v ?? ''}</td>`, hl = i => i === s.hl ? 'background:#FFE38A;' : '';
    const cells = (arr, f, st = () => '', dot = true) => range(0, W - 1).reverse().map(i => td(f(i), st(i)) + (i === K ? td(dot ? '.' : '', 'width:.4em;color:#E0464A;' + (st(i).includes('border') ? `border-top:3px solid ${INK}` : '')) : '')).join('');
    let h = '<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(26px,3.8vw,36px);margin:4px auto">';
    h += '<tr>' + td('') + cells(null, i => s.top[i] ?? '', i => `font-size:.5em;color:${RED};vertical-align:bottom;${hl(i)}`, false) + '</tr>';
    h += '<tr>' + td('') + cells(null, i => da[i] != null ? da[i] : i <= K ? 0 : '', i => hl(i) + (s.strike[i] ? 'text-decoration:line-through;color:#9AA6B6;' : '')) + '</tr>';
    h += '<tr>' + td(op) + cells(null, i => db[i] != null ? db[i] : i <= K ? 0 : '', hl) + '</tr>';
    h += '<tr>' + td('', `border-top:3px solid ${INK}`) + cells(null, i => s.res[i] != null && (i < rl || i <= K) ? s.res[i] : (s.done && i <= K && s.res[i] == null ? 0 : ''), i => `border-top:3px solid ${INK};color:#2F8A47;${hl(i)}`) + '</tr>';
    $in(el, '#dt').innerHTML = `<div class="out">${fx(a / m)} ${op} ${fx(b / m)}</div>` + h + '</table>';
    $in(el, '#do').innerHTML = (kk === 0 ? '<b>소수점끼리 맞추어</b> 세로로 쓰고, 자연수처럼 계산한 다음 소수점을 그대로 내려 찍어요. ' : '') + s.msg.replace('<b>일의 자리</b>부터 차례로 계산해요. ▶ 다음 단계를 눌러 보세요.', '▶ 다음 단계를 눌러 보세요.'); $in(el, '#ds').disabled = !!s.done; };
  $in(el, '#dn').addEventListener('click', fresh); $in(el, '#ds').addEventListener('click', () => { if (kk < S.st.length - 1) kk++; draw(); }); fresh();
} });

/* ═════════════ 5. 다각형 실험실 ═════════════ */
const POLY = G42.POLY;
const polyPts = (n, R = 90, C = [120, 110], irr = 0) => range(0, n - 1).map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / n + (irr ? Math.sin(i * 2.3) * .25 : 0), r = R * (irr ? 0.75 + 0.25 * Math.cos(i * 1.7) : 1); return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]; });
const polyLab = (r0 = true) => ({ title: '변의 수를 바꾸며 다각형과 정다각형 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>변의 수</label><input type="range" min="3" max="12" value="5" id="pn"><span class="v" id="pnv"></span><button class="tbtn" type="button" id="pr" aria-pressed="true">정다각형</button></div><div class="figc" id="pg"></div><div class="out" id="po"></div>`;
  let reg = r0;
  const draw = () => { const n = +$in(el, '#pn').value, pts = polyPts(n, 90, [120, 110], !reg); $in(el, '#pnv').textContent = n;
    $in(el, '#pg').innerHTML = svg(240, 220, `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${reg ? '#E8F7EA' : '#FFF1DE'}" stroke="${INK}" stroke-width="2.6"/>` + pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="${RED}"/>`).join(''));
    $in(el, '#po').innerHTML = `변 ${n}개, 꼭짓점 ${n}개 → <b>${reg ? '정' : ''}${POLY[n]}</b><br><span style="color:${GRAY}">${reg ? '변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형 = <b>정다각형</b>' : '선분으로만 둘러싸인 도형 = <b>다각형</b> (변의 길이나 각의 크기가 달라도 돼요)'}</span>`; };
  $in(el, '#pn').addEventListener('input', draw); $in(el, '#pr').addEventListener('click', e => { reg = !reg; e.target.setAttribute('aria-pressed', reg); e.target.textContent = reg ? '정다각형' : '모양 바꾸기'; draw(); }); $in(el, '#pr').setAttribute('aria-pressed', reg); $in(el, '#pr').textContent = reg ? '정다각형' : '모양 바꾸기'; draw();
} });
const diagLab = { title: '꼭짓점을 눌러 대각선 그어 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>다각형</label><input type="range" min="4" max="10" value="6" id="dn"><span class="v" id="dnv"></span><button class="tbtn" type="button" id="da">모든 대각선</button></div><div class="figc" id="dg"></div><div class="out" id="do"></div>`;
  let sel = 0, all = false;
  const draw = () => { const n = +$in(el, '#dn').value, pts = polyPts(n, 100, [130, 120]); $in(el, '#dnv').textContent = POLY[n];
    let g = `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="#EEF6FF" stroke="${INK}" stroke-width="2.6"/>`;
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++){ if (i === 0 && j === n - 1) continue; const on = all || i === sel || j === sel; if (on) g += line(pts[i][0], pts[i][1], pts[j][0], pts[j][1], { stroke: i === sel || j === sel ? RED : '#9CC7EE', w: i === sel || j === sel ? 2.4 : 1.6 }); }
    g += pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === sel ? 9 : 7}" fill="${i === sel ? RED : INK}" data-v="${i}" style="cursor:pointer"/>`).join('');
    $in(el, '#dg').innerHTML = svg(260, 240, g);
    el.querySelectorAll('circle[data-v]').forEach(c => c.addEventListener('click', () => { sel = +c.dataset.v; draw(); }));
    $in(el, '#do').innerHTML = `서로 <b>이웃하지 않는</b> 두 꼭짓점을 이은 선분 = 대각선<br>한 꼭짓점에서: ${n} - 3 = <b>${n - 3}개</b> · 모두: ${n} × ${n - 3} ÷ 2 = <b>${n * (n - 3) / 2}개</b><br><span style="color:${GRAY}">자기 자신과 이웃한 두 꼭짓점에는 대각선을 그을 수 없어요. 같은 대각선을 두 번 세지 않도록 2로 나눠요.</span>`; };
  $in(el, '#dn').addEventListener('input', () => { sel = 0; draw(); }); $in(el, '#da').addEventListener('click', e => { all = !all; e.target.setAttribute('aria-pressed', all); draw(); }); draw();
} };
const tileLab = (m0 = 0) => ({ title: '모양 조각으로 정육각형 채우기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" data-t="0" aria-pressed="true">정삼각형 6개</button><button class="tbtn" type="button" data-t="1">마름모 3개</button><button class="tbtn" type="button" data-t="2">사다리꼴 2개</button><button class="tbtn" type="button" data-t="3">섞어서 채우기</button></div><div class="figc" id="tg"></div><div class="out" id="to"></div>`;
  let m = m0;
  const draw = () => { const C = [140, 125], R = 100, V = range(0, 5).map(i => [C[0] + R * Math.cos(rad(-90 + 60 * i)), C[1] + R * Math.sin(rad(-90 + 60 * i))]), tri = i => [C, V[i], V[(i + 1) % 6]];
    const groups = [[[0], [1], [2], [3], [4], [5]], [[0, 1], [2, 3], [4, 5]], [[0, 1, 2], [3, 4, 5]], [[0, 1, 2], [3, 4], [5]]][m], COL = ['#8FD19E', '#FFC48A', '#9CC7EE', '#F7A6C4', '#FFE38A', '#C7B6F2'];
    let g = '';
    groups.forEach((gr, gi) => { gr.forEach(i => { g += `<polygon points="${tri(i).map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${COL[gi]}" stroke="${COL[gi]}" stroke-width="1"/>`; }); });
    groups.forEach(gr => { const outline = []; gr.forEach(i => outline.push(i)); /* 조각 경계 */ const first = gr[0], lastI = gr[gr.length - 1]; g += line(C[0], C[1], V[first][0], V[first][1], { w: 2.4 }) + line(C[0], C[1], V[(lastI + 1) % 6][0], V[(lastI + 1) % 6][1], { w: 2.4 }); });
    g += `<polygon points="${V.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="3"/>`;
    $in(el, '#tg').innerHTML = svg(280, 250, g);
    $in(el, '#to').innerHTML = [`정삼각형 <b>6개</b>로 정육각형을 빈틈없이 채웠어요.`, `마름모 1개 = 정삼각형 2개 → 마름모 <b>3개</b>`, `사다리꼴 1개 = 정삼각형 3개 → 사다리꼴 <b>2개</b>`, `사다리꼴 1개 + 마름모 1개 + 정삼각형 1개로도 채울 수 있어요! 방법은 여러 가지예요.`][m] + `<br><span style="color:${GRAY}">모양 조각을 겹치지 않게, 빈틈없이 이어 붙여 여러 가지 모양을 만들 수 있어요.</span>`; };
  el.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { m = +b.dataset.t; press(el, '[data-t]', b); draw(); })); press(el, '[data-t]', el.querySelector(`[data-t="${m0}"]`)); draw();
} });

/* ═════════════ 6. 꺾은선그래프 실험실 ═════════════ */
const lineLab = (w0 = false) => ({ title: '수를 바꾸며 꺾은선그래프 그리기 (막대그래프와 비교)', init(el){
  const H = ['9시', '10시', '11시', '12시', '1시'];
  el.innerHTML = `${H.map((h, i) => `<div class="ctrl"><label>${h}</label><input type="range" min="10" max="30" value="${[14, 16, 19, 23, 22][i]}" data-i="${i}"><span class="v" data-v="${i}"></span></div>`).join('')}<div class="ctrl"><button class="tbtn" type="button" id="lb" aria-pressed="false">막대그래프로 보기</button><button class="tbtn" type="button" id="lw" aria-pressed="false">물결선 사용</button></div><div class="figc" id="lg"></div><div class="out" id="lo"></div>`;
  let bar = false, wave = w0;
  const draw = () => { const v = [...el.querySelectorAll('input[data-i]')].map(i => +i.value); v.forEach((x, i) => { $in(el, `[data-v="${i}"]`).textContent = x + '°C'; });
    if (bar) $in(el, '#lg').innerHTML = window.TM_G4.barG(v, H, 1, '°C', '교실의 온도');
    else { const base = wave ? Math.floor((Math.min(...v) - 2) / 5) * 5 : 0; $in(el, '#lg').innerHTML = G42.lgFig(v, H, wave ? 0.5 : 1, '°C', '교실의 온도', base > 0 ? base : 0); }
    const ch = range(0, 3).map(i => v[i + 1] - v[i]), mi = ch.reduce((b, c, i) => Math.abs(c) > Math.abs(ch[b]) ? i : b, 0);
    $in(el, '#lo').innerHTML = bar ? '막대그래프는 시각별 온도를 <b>비교</b>하기 좋지만, 변화의 흐름은 꺾은선그래프가 더 잘 보여요.' : `변화가 가장 큰 때: <b>${H[mi]} ~ ${H[mi + 1]}</b> (${ch[mi] > 0 ? '+' : ''}${ch[mi]}°C) — 선이 가장 많이 기울어진 곳!<br><span style="color:${GRAY}">${wave ? '물결선(≈)으로 필요 없는 부분을 줄이면 세로 눈금 한 칸을 작게 할 수 있어 변화가 더 잘 보여요.' : '물결선을 사용해 보세요.'}</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#lb').addEventListener('click', e => { bar = !bar; e.target.setAttribute('aria-pressed', bar); draw(); });
  $in(el, '#lw').addEventListener('click', e => { wave = !wave; e.target.setAttribute('aria-pressed', wave); draw(); }); $in(el, '#lw').setAttribute('aria-pressed', wave); draw();
} });
const beanLab = { title: '강낭콩을 기르며 꺾은선그래프 완성하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="bg">🌱 이틀 지나기</button><button class="tbtn" type="button" id="br">↺ 다시 심기</button></div><div class="figc" id="bf"></div><div class="out" id="bo"></div>`;
  let v = [2, 4, 7];
  const draw = () => { const labs = v.map((_, i) => `${1 + 2 * i}일`); $in(el, '#bf').innerHTML = G42.lgFig(v, labs, 1, 'cm', '강낭콩의 키');
    const last = v.length > 1 ? v[v.length - 1] - v[v.length - 2] : 0;
    $in(el, '#bo').innerHTML = `${labs[labs.length - 1]}: <b>${v[v.length - 1]} cm</b>${v.length > 1 ? ` (이틀 동안 ${last} cm 자랐어요)` : ''}${v.length >= 3 ? `<br>다음에는 약 <b>${v[v.length - 1] + last} cm</b>쯤 될 것 같아요. 예상해 보고 확인해 봐요!` : ''}`; };
  $in(el, '#bg').addEventListener('click', () => { if (v.length < 7) v.push(v[v.length - 1] + ri(1, 4)); draw(); });
  $in(el, '#br').addEventListener('click', () => { v = [ri(1, 3)]; draw(); }); draw();
} };

/* ═════════════ 1. 삼각형 ═════════════ */
add({ key:'4-2-1', title:'삼각형', intro:'변의 길이에 따라 이등변삼각형, 정삼각형을, 각의 크기에 따라 예각삼각형, 둔각삼각형을 알고 그 성질을 탐구해요.',
  prev:'[3-1] 평면도형 · [4-1] 각도', lessons:[
  { title:'이등변삼각형', std:['4수03-08'], key:'<b>두 변의 길이가 같은</b> 삼각형 = 이등변삼각형',
    body:`<div class="figc">${G42.triFig(6, 6, 4, ['6 cm', '6 cm', '4 cm'])}</div><p>자로 세 변의 길이를 재어 두 변의 길이가 같은지 확인해요.</p>`,
    lab: isoLab, ex:`<p>세 변이 7 cm, 7 cm, 5 cm → <b>이등변삼각형</b></p>`, quiz:[['is-def', 1], ['is-side', 1]] },
  { title:'이등변삼각형의 성질', std:['4수03-08'], key:'이등변삼각형은 <b>두 각의 크기가 같아요</b>. (길이가 같은 두 변과 함께 있는 두 각)',
    body:`<p>이등변삼각형을 반으로 접으면 두 각이 꼭 맞게 겹쳐요.</p>${E('180° - 40° = 140° → 140° ÷ 2 = 70°')}`,
    lab: isoLab, ex:`<p>두 각이 50°로 같은 이등변삼각형의 나머지 한 각 → 180° - 50° - 50° = <b>80°</b></p>`, quiz:[['is-angle', 2], ['is-side', 2], ['is-ext', 4]] },
  { title:'정삼각형', std:['4수03-08'], key:'<b>세 변의 길이가 같은</b> 삼각형 = 정삼각형',
    body:`<div class="figc">${G42.triFig(5, 5, 5, ['5 cm', '5 cm', '5 cm'])}</div><div class="note">💡 정삼각형은 두 변의 길이도 같으므로 이등변삼각형이에요. 하지만 이등변삼각형이 모두 정삼각형은 아니에요.</div>`,
    lab: eqLab, ex:`<p>세 변의 길이의 합이 27 cm인 정삼각형의 한 변 → <b>9 cm</b></p>`, quiz:[['is-def', 1], ['eq-angle', 1], ['eq-angle', 2]] },
  { title:'정삼각형의 성질', std:['4수03-08'], key:'정삼각형은 <b>세 각의 크기가 모두 60°</b>로 같아요.',
    body:`${E('180° ÷ 3 = 60°')}<p>컴퍼스로 반지름이 같은 원 두 개를 그려 정삼각형을 그릴 수 있어요.</p>`,
    lab: eqLab, ex:`<p>정삼각형 4개를 한 줄로 번갈아 붙인 도형의 둘레 → 한 변의 6배</p>`, quiz:[['eq-angle', 2], ['eq-chain', 4], ['is-wire', 4]] },
  { title:'예각삼각형과 둔각삼각형', std:['4수03-09'], key:'세 각이 모두 예각 = <b>예각삼각형</b>, 한 각이 둔각 = <b>둔각삼각형</b>',
    body:`<p>한 각이 직각이면 직각삼각형이에요. 삼각형에서 둔각(또는 직각)은 <b>하나만</b> 있을 수 있어요.</p>`,
    lab: classLab, ex:`<p>두 각이 35°, 40° → 나머지 105° → <b>둔각삼각형</b></p>`, quiz:[['tri-kind', 1], ['tri-kind', 2]] },
  { title:'두 가지 기준으로 삼각형 분류하기', std:['4수03-08', '4수03-09'], key:'<b>변의 길이</b>와 <b>각의 크기</b> 두 가지 기준으로 함께 분류해요.',
    body:`<div class="tscroll">${tableH([['', '예각삼각형', '직각삼각형', '둔각삼각형'], ['이등변삼각형', '○', '○', '○'], ['세 변의 길이가 다른 삼각형', '○', '○', '○'], ['정삼각형', '○', '✕', '✕']])}</div>`,
    lab: classLab, ex:`<p>세 각이 30°, 30°, 120° → <b>이등변삼각형이면서 둔각삼각형</b></p>`, quiz:[['tri-two', 3], ['tri-can', 3], ['tri-can', 4]] }
]});

/* ═════════════ 2. 분수의 덧셈과 뺄셈 ═════════════ */
add({ key:'4-2-2', title:'분수의 덧셈과 뺄셈', intro:'분모가 같은 진분수, 대분수의 덧셈과 뺄셈 원리를 탐구하고, 받아올림과 받아내림이 있는 계산을 해요.',
  prev:'[3-2] 분수 (진분수, 가분수, 대분수)', lessons:[
  { title:'진분수의 덧셈과 뺄셈', std:['4수01-15'], key:'분모가 같으면 <b>분모는 그대로</b>, 분자끼리 더하거나 빼요.',
    body:`${E(`${fr(2, 7)} + ${fr(3, 7)} = ${fr(5, 7)} &nbsp;&nbsp; ${fr(6, 7)} - ${fr(4, 7)} = ${fr(2, 7)}`)}<p>${fr(1, 7)}이 2개 + 3개 = 5개 → ${fr(5, 7)}</p><div class="warn">⚠️ 분모끼리 더하면 안 돼요! ${fr(2, 7)} + ${fr(3, 7)} ≠ ${fr(5, 14)}</div>`,
    lab: fracAddLab(false), ex:`<p>${fr(5, 6)} + ${fr(4, 6)} = ${fr(9, 6)} = <b>${fr(3, 6, 1)}</b></p>`, quiz:[['fa-proper', 1], ['fs-proper', 1], ['fa-over', 2]] },
  { title:'분수의 덧셈 (1) — 대분수의 덧셈', std:['4수01-15'], key:'<b>자연수끼리, 분수끼리</b> 더해요.',
    body:`${E(`${fr(1, 5, 2)} + ${fr(3, 5, 1)} = (2 + 1) + (${fr(1, 5)} + ${fr(3, 5)}) = ${fr(4, 5, 3)}`)}<div class="note">💡 가분수로 바꾸어 계산해도 돼요: ${fr(11, 5)} + ${fr(8, 5)} = ${fr(19, 5)} = ${fr(4, 5, 3)}</div>`,
    lab: fracAddLab(false, 11, 8), ex:`<p>${fr(2, 9, 3)} + ${fr(5, 9, 2)} = <b>${fr(7, 9, 5)}</b></p>`, quiz:[['fa-mixed', 2]] },
  { title:'분수의 덧셈 (2) — 받아올림이 있는 덧셈', std:['4수01-15'], key:'분수끼리 더한 값이 가분수가 되면 <b>자연수로 받아올림</b>해요.',
    body:`${E(`${fr(3, 4, 1)} + ${fr(2, 4, 2)} = 3 + ${fr(5, 4)} = 3 + ${fr(1, 4, 1)} = ${fr(1, 4, 4)}`)}`,
    lab: fracAddLab(false, 9, 13), ex:`<p>${fr(5, 7, 2)} + ${fr(4, 7, 1)} = 3 + ${fr(9, 7)} = <b>${fr(2, 7, 4)}</b></p>`, quiz:[['fa-mixed', 3], ['fr-word', 3]] },
  { title:'분수의 뺄셈 (1) — 대분수의 뺄셈', std:['4수01-15'], key:'<b>자연수끼리, 분수끼리</b> 빼요.',
    body:`${E(`${fr(5, 8, 4)} - ${fr(2, 8, 1)} = (4 - 1) + (${fr(5, 8)} - ${fr(2, 8)}) = ${fr(3, 8, 3)}`)}`,
    lab: fracAddLab(true), ex:`<p>${fr(4, 5, 3)} - ${fr(1, 5, 2)} = <b>${fr(3, 5, 1)}</b></p>`, quiz:[['fs-mixed', 2], ['fr-cmp', 3]] },
  { title:'분수의 뺄셈 (2) — (자연수) - (분수)', std:['4수01-15'], key:'자연수에서 <b>1만큼을 가분수로</b> 바꾸어 빼요.',
    body:`${E(`3 - ${fr(2, 5, 1)} = ${fr(5, 5, 2)} - ${fr(2, 5, 1)} = ${fr(3, 5, 1)}`)}`,
    lab: borrowLab(true), ex:`<p>5 - ${fr(3, 4)} = ${fr(4, 4, 4)} - ${fr(3, 4)} = <b>${fr(1, 4, 4)}</b></p>`, quiz:[['fs-nat', 3]] },
  { title:'분수의 뺄셈 (3) — 받아내림이 있는 뺄셈', std:['4수01-15'], key:'분수끼리 뺄 수 없으면 <b>자연수에서 1을 받아내려</b> 가분수로 바꾸어 빼요.',
    body:`${E(`${fr(1, 6, 4)} - ${fr(5, 6, 1)} = ${fr(7, 6, 3)} - ${fr(5, 6, 1)} = ${fr(2, 6, 2)}`)}`,
    lab: borrowLab(false), ex:`<p>□ + ${fr(3, 7, 1)} = ${fr(2, 7, 4)} → □ = ${fr(2, 7, 4)} - ${fr(3, 7, 1)} = <b>${fr(6, 7, 2)}</b></p>`, quiz:[['fs-borrow', 3], ['fs-borrow', 4], ['fr-missing', 4], ['fr-range', 5]] }
]});

/* ═════════════ 3. 사각형 ═════════════ */
add({ key:'4-2-3', title:'사각형', intro:'수직과 평행을 알고, 사다리꼴, 평행사변형, 마름모의 성질과 여러 가지 사각형의 관계를 탐구해요.',
  prev:'[3-1] 평면도형 · [4-2] 삼각형', lessons:[
  { title:'수직과 수선', std:['4수03-03'], key:'두 직선이 만나서 이루는 각이 <b>직각</b>이면 서로 <b>수직</b>, 한 직선을 다른 직선에 대한 <b>수선</b>이라고 해요.',
    body:`<p>삼각자의 직각 부분이나 각도기의 90°를 이용해 수선을 그어요.</p>`,
    lab: perpLab, ex:`<p>직선 가와 나가 수직이고 한 각이 35°이면 나머지 → 90° - 35° = <b>55°</b></p>`, quiz:[['pp-def', 1], ['pp-angle', 3]] },
  { title:'평행과 평행선', std:['4수03-03'], key:'한 직선에 수직인 두 직선처럼 <b>아무리 늘여도 만나지 않는</b> 두 직선 = 평행선',
    body:`<p>평행선은 삼각자 두 개를 이용해 그릴 수 있어요. 한 삼각자를 고정하고 다른 삼각자를 밀면서 그어요.</p>`,
    lab: parLab, ex:`<p>정육각형에서 서로 평행한 변은 <b>3쌍</b></p>`, quiz:[['pp-def', 1], ['pp-count', 1], ['pp-count', 2]] },
  { title:'평행선 사이의 거리', std:['4수03-03'], key:'평행선 사이에 그은 <b>수선의 길이</b> = 평행선 사이의 거리. 어디서 재어도 같아요.',
    body:`<p>평행선 사이의 선분 중 수선의 길이가 <b>가장 짧아요</b>.</p>`,
    lab: distLab, ex:`<p>직선 가와 나 사이 4 cm, 나와 다 사이 6 cm → 가와 다 사이 <b>10 cm</b></p>`, quiz:[['pp-dist', 2], ['pp-dist', 3]] },
  { title:'사다리꼴', std:['4수03-10'], key:'<b>평행한 변이 한 쌍이라도</b> 있는 사각형 = 사다리꼴',
    body:`<p>평행한 두 변 사이에서 같은 쪽에 있는 두 각의 합은 180°예요.</p>`,
    lab: quadLab('7,3,2,4'), ex:`<p>평행사변형, 마름모, 직사각형, 정사각형도 모두 <b>사다리꼴</b>이에요.</p>`, quiz:[['q-kind', 1], ['trap-angle', 4]] },
  { title:'평행사변형', std:['4수03-10'], key:'<b>마주 보는 두 쌍의 변이 서로 평행한</b> 사각형 = 평행사변형',
    body:`<ul><li>마주 보는 두 변의 길이가 같아요.</li><li>마주 보는 두 각의 크기가 같아요.</li><li>이웃한 두 각의 크기의 합은 180°예요.</li></ul>`,
    lab: quadLab('6,6,2,3'), ex:`<p>한 각이 70°인 평행사변형의 이웃한 각 → <b>110°</b></p>`, quiz:[['q-kind', 2], ['para-side', 2], ['para-angle', 2], ['para-angle', 3]] },
  { title:'마름모', std:['4수03-10'], key:'<b>네 변의 길이가 모두 같은</b> 사각형 = 마름모',
    body:`<ul><li>마주 보는 두 쌍의 변이 서로 평행해요(평행사변형).</li><li>마주 보는 두 각의 크기가 같아요.</li><li>두 대각선이 서로 <b>수직</b>으로 만나고, 서로를 똑같이 둘로 나눠요.</li></ul>`,
    lab: quadLab('5,5,3,4'), ex:`<p>네 변의 길이의 합이 36 cm인 마름모의 한 변 → <b>9 cm</b></p>`, quiz:[['rh-prop', 2], ['rh-prop', 3]] },
  { title:'여러 가지 사각형', std:['4수03-10'], key:'정사각형은 직사각형이면서 마름모이고, 이들은 모두 평행사변형, 평행사변형은 사다리꼴이에요.',
    body:`<div class="tscroll">${tableH([['', '사다리꼴', '평행사변형', '마름모', '직사각형', '정사각형'], ['정사각형', '○', '○', '○', '○', '○'], ['직사각형', '○', '○', '', '○', ''], ['마름모', '○', '○', '○', '', ''], ['평행사변형', '○', '○', '', '', '']])}</div>`,
    lab: quadLab('6,6,0,6'), ex:`<p>"마름모는 정사각형이다" → <b>옳지 않아요</b> (네 각이 직각이 아닐 수 있어요)</p>`, quiz:[['q-true', 2], ['q-true', 3], ['q-name', 4]] }
]});

/* ═════════════ 4. 소수의 덧셈과 뺄셈 ═════════════ */
add({ key:'4-2-4', title:'소수의 덧셈과 뺄셈', intro:'소수 두 자리 수, 세 자리 수를 알고 크기를 비교하며, 소수의 덧셈과 뺄셈의 원리를 탐구해요.',
  prev:'[3-1] 분수와 소수 (소수 한 자리 수)', lessons:[
  { title:'소수 두 자리 수', std:['4수01-13'], key:`${fr(1, 100)} = <b>0.01</b> (영 점 영일). ${fr(37, 100)} = 0.37`,
    body:`<p>2.45는 "이 점 사오"라고 읽어요. 1이 2개, 0.1이 4개, 0.01이 5개인 수예요.</p><div class="note">💡 1 cm = 0.01 m → 135 cm = 1.35 m</div>`,
    lab: gridLab, ex:`<p>0.01이 263개인 수 → <b>2.63</b></p>`, quiz:[['dc-read', 1], ['dc-unit', 2]] },
  { title:'소수 세 자리 수', std:['4수01-13'], key:`${fr(1, 1000)} = <b>0.001</b> (영 점 영영일). 1 m = 1000 mm → 1 mm = 0.001 m`,
    body:`${tableH([['자리', '일', '소수 첫째', '소수 둘째', '소수 셋째'], ['3.582', '3', '5', '8', '2'], ['나타내는 수', '3', '0.5', '0.08', '0.002']])}`,
    lab: placeDecLab, ex:`<p>1250 g = <b>1.25 kg</b> · 3027 m = <b>3.027 km</b></p>`, quiz:[['dc-read', 1], ['dc-digit', 1], ['dc-digit', 2], ['dc-unit', 3]] },
  { title:'소수의 크기 비교', std:['4수01-14'], key:'<b>자연수 부분 → 소수 첫째 → 둘째 → 셋째 자리</b> 순서로 비교해요.',
    body:`${E('0.6 = 0.60 &nbsp;&nbsp; 3.27 &lt; 3.3 &nbsp;&nbsp; 1.405 &gt; 1.399')}<div class="note">💡 소수 끝자리의 0은 생략할 수 있어요.</div>`,
    lab: decCmpLab, ex:`<p>0.01이 352개인 수와 3.5 → 3.52 &gt; 3.5</p>`, quiz:[['dc-cmp', 2], ['dc-cmp', 3]] },
  { title:'소수 사이의 관계', std:['4수01-13'], key:'10배 하면 <b>소수점이 오른쪽으로 한 칸</b>, 1/10을 하면 <b>왼쪽으로 한 칸</b> 옮겨져요.',
    body:`${E('0.036 ×10→ 0.36 ×10→ 3.6 ×10→ 36')}`,
    lab: shiftLab, ex:`<p>4.2의 1/100 → <b>0.042</b></p>`, quiz:[['dc-10x', 2], ['dc-10x', 3]] },
  { title:'소수 한 자리 수의 덧셈', std:['4수01-16'], key:'0.1이 몇 개인지 생각하거나, <b>소수점끼리 맞추어</b> 세로로 계산해요.',
    body:`${E('0.6 + 0.8 = 1.4 (0.1이 6 + 8 = 14개)')}`,
    lab: decColLab('+', 1), ex:`<p>2.7 + 3.5 = <b>6.2</b></p>`, quiz:[['da-1', 1]] },
  { title:'소수 한 자리 수의 뺄셈', std:['4수01-16'], key:'소수점끼리 맞추고, 같은 자리 수끼리 뺄 수 없으면 <b>받아내림</b>해요.',
    body:`${E('4.3 - 1.8 = 2.5')}`,
    lab: decColLab('-', 1), ex:`<p>6.1 - 2.4 = <b>3.7</b></p>`, quiz:[['ds-1', 1]] },
  { title:'소수 두 자리 수의 덧셈', std:['4수01-16'], key:'자릿수가 다르면 <b>끝에 0을 붙여</b> 자릿수를 맞춘 다음 더해요.',
    body:`${E('1.46 + 2.8 = 1.46 + 2.80 = 4.26')}`,
    lab: decColLab('+', 2), ex:`<p>3.58 + 1.67 = <b>5.25</b></p>`, quiz:[['da-2', 2], ['d-mixlen', 3], ['d-word', 3]] },
  { title:'소수 두 자리 수의 뺄셈', std:['4수01-16'], key:'소수점끼리 맞추고 자연수의 뺄셈처럼 계산한 다음 <b>소수점을 그대로 내려 찍어요</b>.',
    body:`${E('5 - 1.37 = 5.00 - 1.37 = 3.63')}<div class="warn">⚠️ 소수점의 위치를 맞추지 않으면 틀려요: 3.5 - 0.42에서 5와 2를 같은 자리로 맞추면 안 돼요!</div>`,
    lab: decColLab('-', 2, true), ex:`<p>□ - 1.26 = 3.4 → □ = 3.4 + 1.26 = <b>4.66</b></p>`, quiz:[['ds-2', 2], ['d-missing', 4], ['d-cards', 5]] }
]});

/* ═════════════ 5. 다각형 ═════════════ */
add({ key:'4-2-5', title:'다각형', intro:'다각형과 정다각형, 대각선을 알고, 모양 조각으로 여러 가지 모양을 만들고 채워요.',
  prev:'[4-2] 삼각형 · [4-2] 사각형', lessons:[
  { title:'다각형', std:['4수03-11'], key:'<b>선분으로만 둘러싸인</b> 도형 = 다각형. 변의 수에 따라 오각형, 육각형, …',
    body:`<p>원이나 반원처럼 <b>곡선</b>이 있거나, 선분이 끊어져 있으면 다각형이 아니에요.</p>`,
    lab: polyLab(false), ex:`<p>변이 8개인 다각형 → <b>팔각형</b></p>`, quiz:[['pg-name', 1], ['pg-is', 1]] },
  { title:'정다각형', std:['4수03-11'], key:'<b>변의 길이가 모두 같고, 각의 크기가 모두 같은</b> 다각형 = 정다각형',
    body:`<div class="warn">⚠️ 마름모는 변의 길이는 모두 같지만 각의 크기가 다를 수 있어서 정다각형이 아니에요. (정사각형은 정다각형!)</div>`,
    lab: polyLab(true), ex:`<p>한 변이 6 cm인 정오각형의 모든 변의 길이의 합 → <b>30 cm</b></p>`, quiz:[['pg-is', 2], ['rp-peri', 1], ['rp-peri', 2], ['rp-wire', 3]] },
  { title:'대각선', std:['4수03-11'], key:'다각형에서 <b>서로 이웃하지 않는 두 꼭짓점을 이은 선분</b> = 대각선',
    body:`<ul><li>삼각형은 대각선이 없어요.</li><li>직사각형: 두 대각선의 길이가 같아요. 마름모: 두 대각선이 수직으로 만나요. 정사각형: 둘 다!</li></ul>`,
    lab: diagLab, ex:`<p>육각형의 대각선 → 6 × 3 ÷ 2 = <b>9개</b></p>`, quiz:[['dg-def', 1], ['dg-count', 2], ['dg-count', 3], ['dg-prop', 3], ['rp-angle', 4]] },
  { title:'여러 가지 모양 조각으로 모양 만들기', std:['4수03-12'], key:'정삼각형, 마름모, 사다리꼴, 정육각형 조각을 <b>겹치지 않게</b> 이어 붙여 모양을 만들어요.',
    body:`<p>정삼각형 2개 → 마름모, 정삼각형 3개 → 사다리꼴, 정삼각형 6개 → 정육각형</p>`,
    lab: tileLab(0), ex:`<p>정육각형 = 사다리꼴 <b>2개</b> = 마름모 <b>3개</b></p>`, quiz:[['tile', 2], ['tile', 3]] },
  { title:'여러 가지 모양 조각으로 모양 채우기', std:['4수03-12'], key:'주어진 모양을 조각으로 <b>빈틈없이</b> 채우는 방법은 여러 가지예요.',
    body:`<p>큰 조각부터 놓으면 조각의 수가 적어지고, 작은 조각을 쓰면 조각의 수가 많아져요.</p>`,
    lab: tileLab(3), ex:`<p>한 변이 3 cm인 정삼각형을 한 변이 1 cm인 정삼각형으로 채우면 <b>9개</b></p>`, quiz:[['tile2', 4], ['tile2', 5]] }
]});

/* ═════════════ 6. 꺾은선그래프 ═════════════ */
add({ key:'4-2-6', title:'꺾은선그래프', intro:'시간에 따라 변하는 자료를 꺾은선그래프로 나타내고, 변화의 흐름을 해석하여 앞으로를 예상해요.',
  prev:'[4-1] 막대그래프', lessons:[
  { title:'꺾은선그래프', std:['4수04-02'], key:'수량을 점으로 찍고 그 점들을 <b>선분으로 이어</b> 그린 그래프 = 꺾은선그래프',
    body:`${G42.lgFig([14, 16, 19, 23, 22], ['9시', '10시', '11시', '12시', '1시'], 1, '°C', '교실의 온도')}<p>시간에 따른 <b>변화</b>를 한눈에 알아볼 수 있어요.</p>`,
    lab: lineLab(false), ex:`<p>막대그래프는 항목끼리 비교, 꺾은선그래프는 <b>변화의 흐름</b>을 보기에 좋아요.</p>`, quiz:[['lg-what', 1], ['lg-scale', 1], ['lg-read', 1]] },
  { title:'꺾은선그래프를 통해 알아보기', std:['4수04-02'], key:'선이 <b>많이 기울어질수록</b> 변화가 커요. 오르면 늘어난 것, 내려가면 줄어든 것!',
    body:`<p>두 점 사이의 가운데 시각의 값은 선분의 가운데를 읽어 <b>예상</b>할 수 있어요.</p>`,
    lab: lineLab(false), ex:`<p>10시 14°C, 11시 18°C → 10시 30분은 약 <b>16°C</b></p>`, quiz:[['lg-read', 2], ['lg-diff', 2], ['lg-change', 2], ['lg-mid', 3]] },
  { title:'꺾은선그래프로 나타내는 방법', std:['4수04-02'], key:'필요 없는 부분은 <b>물결선(≈)</b>으로 줄여서 변화가 잘 보이게 그려요.',
    body:`<ol><li>가로, 세로에 무엇을 나타낼지 정해요.</li><li>세로 눈금 한 칸의 크기와 물결선을 넣을 위치를 정해요.</li><li>점을 찍고 선분으로 이어요.</li><li>제목을 붙여요.</li></ol>`,
    lab: lineLab(true), ex:`<p>가장 작은 값이 152, 가장 큰 값이 168 → 150부터 시작하고 물결선을 넣어요.</p>`, quiz:[['lg-wave', 3], ['lg-true', 3]] },
  { title:'자료를 수집하여 꺾은선그래프로 나타내기', std:['4수04-03'], key:'변화를 조사해 꺾은선그래프로 나타내면 <b>앞으로를 예상</b>할 수 있어요.',
    body:`<p>강낭콩의 키, 한 달 동안의 기온, 연도별 인구 등을 조사해 그래프로 나타내 보아요.</p>`,
    lab: beanLab, ex:`<p>매주 3 cm씩 자랐다면 다음 주에는 약 3 cm 더 자랄 것이라고 예상할 수 있어요.</p>`, quiz:[['lg-predict', 4], ['lg-total', 4], ['lg-true', 4]] }
]});
})();
