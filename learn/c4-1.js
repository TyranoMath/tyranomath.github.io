/* =========================================================
   🦖 개념 탐험대 — 4학년 1학기 (2022 개정 교육과정)
   단원 순서: 1 각도 · 2 큰 수 · 3 평면도형의 이동 · 4 곱셈과 나눗셈 · 5 규칙 찾기 · 6 막대그래프
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g4-1.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, G4 = window.TM_G4, T = window.TM_L3;
const { fr, svg, txt, line, range, tableH, ri, pick, shuffle } = A;
const { P } = T;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const rad = d => d * Math.PI / 180;

/* ═════════════ 1. 각도 실험실 ═════════════ */
const protLab = { title: '각도기로 각도 재어 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>각의 크기</label><input type="range" min="5" max="175" step="5" value="65" id="pd"><button class="tbtn" type="button" id="pb" aria-pressed="false">한 변을 왼쪽 0에 맞추기</button></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  let left = false;
  const draw = () => { const d = +$in(el, '#pd').value; $in(el, '#pf').innerHTML = G4.protFig(d, left);
    $in(el, '#po').innerHTML = `① 각도기의 <b>중심</b>을 각의 꼭짓점에 맞춰요 ② <b>밑금</b>을 각의 한 변에 맞춰요 ③ 그 변이 <b>${left ? '바깥쪽(검은색)' : '안쪽(파란색)'} 눈금 0</b>에 있으니 ${left ? '바깥쪽' : '안쪽'} 눈금을 읽어요 → <b>${d}°</b><br><span style="color:${GRAY}">반대쪽 눈금(${180 - d})을 읽지 않도록 조심해요!</span>`; };
  $in(el, '#pd').addEventListener('input', draw);
  $in(el, '#pb').addEventListener('click', e => { left = !left; e.target.setAttribute('aria-pressed', left); draw(); }); draw();
} };
const angleCmpLab = { title: '두 각의 벌어진 정도 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가</label><input type="range" min="10" max="170" step="5" value="50" id="ca"><label>나</label><input type="range" min="10" max="170" step="5" value="80" id="cb"><button class="tbtn" type="button" id="cl" aria-pressed="false">변의 길이 바꾸기</button></div><div class="figc" id="cf" style="gap:10px;flex-wrap:wrap"></div><div class="out" id="co"></div>`;
  let longB = false;
  const fig = (d, L1, col, nm) => { const C = [70, 120], p2 = [C[0] + L1 * Math.cos(-rad(d)), C[1] + L1 * Math.sin(-rad(d))];
    return `<div style="text-align:center">${svg(240, 140, line(C[0], C[1], C[0] + L1, C[1], { w: 3, stroke: col }) + line(C[0], C[1], p2[0], p2[1], { w: 3, stroke: col }) + `<path d="M${C[0] + 22} ${C[1]} A22 22 0 0 0 ${(C[0] + 22 * Math.cos(-rad(d))).toFixed(1)} ${(C[1] + 22 * Math.sin(-rad(d))).toFixed(1)}" fill="none" stroke="${col}" stroke-width="2"/>`)}<div><b>${nm}</b></div></div>`; };
  const draw = () => { const a = +$in(el, '#ca').value, b = +$in(el, '#cb').value;
    $in(el, '#cf').innerHTML = fig(a, 100, BL, '가') + fig(b, longB ? 60 : 110, OR, '나');
    $in(el, '#co').innerHTML = `${a === b ? '두 각의 크기가 <b>같아요</b>' : `<b>${a > b ? '가' : '나'}</b>의 두 변이 더 많이 벌어졌어요 → 더 큰 각`}<br><span style="color:${GRAY}">각의 크기는 <b>변의 길이와 상관없이</b> 두 변이 벌어진 정도로 정해져요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#cl').addEventListener('click', e => { longB = !longB; e.target.setAttribute('aria-pressed', longB); draw(); }); draw();
} };
const kindLab = { title: '각을 벌리며 예각, 직각, 둔각 구별하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>각도</label><input type="range" min="5" max="175" step="5" value="40" id="kd"><span class="v" id="kdv"></span></div><div class="figc" id="kf"></div><div class="out" id="ko"></div>`;
  const draw = () => { const d = +$in(el, '#kd').value; $in(el, '#kdv').textContent = d + '°'; $in(el, '#kf').innerHTML = G4.angFig(d);
    const k = d < 90 ? ['예각', '0°보다 크고 직각보다 작은 각', GR] : d === 90 ? ['직각', '90°', BL] : ['둔각', '직각보다 크고 180°보다 작은 각', OR];
    $in(el, '#ko').innerHTML = `<b style="color:${k[2]}">${k[0]}</b> — ${k[1]}`; };
  $in(el, '#kd').addEventListener('input', draw); draw();
} };
const estLab = { title: '각도를 어림하고 각도기로 확인하기', init(el){
  el.innerHTML = `<div class="figc" id="ef"></div><div class="ctrl"><label>내 어림</label><input type="range" min="0" max="180" step="5" value="90" id="eg"><span class="v" id="egv"></span><button class="tbtn" type="button" id="ec">📐 확인</button><button class="tbtn" type="button" id="en">🎲 다른 각</button></div><div class="out" id="eo"></div>`;
  let d = 0;
  const fresh = () => { d = ri(3, 17) * 10 + pick([0, 5]); $in(el, '#ef').innerHTML = G4.angFig(d, ri(0, 3) * 10); $in(el, '#eo').innerHTML = '삼각자의 30°, 45°, 60°, 90°와 비교해서 어림해 보세요.'; };
  $in(el, '#eg').addEventListener('input', () => { $in(el, '#egv').textContent = $in(el, '#eg').value + '°'; });
  $in(el, '#ec').addEventListener('click', () => { const g = +$in(el, '#eg').value, df = Math.abs(g - d); $in(el, '#eo').innerHTML = `실제 각도: <b>${d}°</b> · 내 어림: ${g}° → 차이 ${df}° ${df <= 10 ? '🎉 아주 잘 어림했어요!' : df <= 20 ? '👍 좋아요!' : '🤔 직각(90°)과 먼저 비교해 봐요.'}`; });
  $in(el, '#en').addEventListener('click', fresh); $in(el, '#egv').textContent = '90°'; fresh();
} };
const sumLab = { title: '두 각을 이어 붙이고, 겹쳐 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가</label><input type="range" min="10" max="170" step="5" value="60" id="sa"><span class="v" id="sav"></span><label>나</label><input type="range" min="10" max="170" step="5" value="45" id="sb"><span class="v" id="sbv"></span></div><div class="figc" id="sf" style="gap:12px;flex-wrap:wrap"></div><div class="out" id="so"></div>`;
  const draw = () => { const a = +$in(el, '#sa').value, b = +$in(el, '#sb').value; $in(el, '#sav').textContent = a + '°'; $in(el, '#sbv').textContent = b + '°';
    const C = [110, 120], Lg = 95, pt = d => [C[0] + Lg * Math.cos(-rad(d)), C[1] + Lg * Math.sin(-rad(d))];
    const wedge = (d0, d1, col) => { const p0 = [C[0] + 40 * Math.cos(-rad(d0)), C[1] + 40 * Math.sin(-rad(d0))], p1 = [C[0] + 40 * Math.cos(-rad(d1)), C[1] + 40 * Math.sin(-rad(d1))]; return `<path d="M${C[0]} ${C[1]} L${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A40 40 0 ${d1 - d0 > 180 ? 1 : 0} 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Z" fill="${col}" opacity=".55"/>`; };
    const s1 = Math.min(a + b, 360), f1 = svg(230, 150, wedge(0, a, '#8FD19E') + wedge(a, s1, '#FFC48A') + [0, a, s1].map(d => line(C[0], C[1], ...pt(d), { w: 2.6 })).join(''));
    const big = Math.max(a, b), sm = Math.min(a, b), f2 = svg(230, 150, wedge(0, big, '#9CC7EE') + wedge(0, sm, '#F7A6C4') + [0, sm, big].map(d => line(C[0], C[1], ...pt(d), { w: 2.6 })).join(''));
    $in(el, '#sf').innerHTML = `<div style="text-align:center">${f1}<div>합: <b>${a}° + ${b}° = ${a + b}°</b></div></div><div style="text-align:center">${f2}<div>차: <b>${big}° - ${sm}° = ${big - sm}°</b></div></div>`;
    $in(el, '#so').innerHTML = `각도의 합과 차는 <b>자연수의 덧셈, 뺄셈과 같은 방법</b>으로 계산하고 단위 °를 붙여요.${a + b > 180 ? ' (합이 180°를 넘으면 일직선보다 더 벌어진 각이에요)' : ''}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const triSumLab = quad => ({ title: quad ? '사각형을 두 삼각형으로 나누어 네 각의 합 구하기' : '삼각형의 세 각을 모아 일직선 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>꼭짓점 옮기기 ↔</label><input type="range" min="20" max="280" value="${quad ? 200 : 110}" id="tx"><label>↕</label><input type="range" min="30" max="150" value="40" id="ty">${quad ? '<label>오른쪽 아래 꼭짓점</label><input type="range" min="220" max="320" value="290" id="tz">' : ''}</div><div class="figc" id="tf"></div><div class="out" id="to"></div>`;
  const ang = (p, q, r) => { const v1 = [q[0] - p[0], q[1] - p[1]], v2 = [r[0] - p[0], r[1] - p[1]]; return Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / Math.hypot(...v1) / Math.hypot(...v2)) * 180 / Math.PI; };
  const arc = (p, q, r, col) => { const a1 = Math.atan2(q[1] - p[1], q[0] - p[0]), a2 = Math.atan2(r[1] - p[1], r[0] - p[0]); let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; const R = 20;
    return `<path d="M${p[0]} ${p[1]} L${(p[0] + R * Math.cos(a1)).toFixed(1)} ${(p[1] + R * Math.sin(a1)).toFixed(1)} A${R} ${R} 0 0 ${d > 0 ? 1 : 0} ${(p[0] + R * Math.cos(a2)).toFixed(1)} ${(p[1] + R * Math.sin(a2)).toFixed(1)} Z" fill="${col}" opacity=".75"/>`; };
  const COL = ['#FF9F43', '#4CB963', '#4A90D9', '#F06292'];
  const draw = () => { const x = +$in(el, '#tx').value, y = +$in(el, '#ty').value;
    if (!quad){ const p = [[30, 170], [300, 170], [x, y]], as = [ang(p[0], p[1], p[2]), ang(p[1], p[2], p[0]), ang(p[2], p[0], p[1])].map(Math.round), fix = 180 - as[0] - as[1];
      let g = `<polygon points="${p.map(q => q.join(',')).join(' ')}" fill="#FFFBEA" stroke="${INK}" stroke-width="2.4"/>` + p.map((q, i) => arc(q, p[(i + 1) % 3], p[(i + 2) % 3], COL[i])).join('');
      // 일직선 위에 모은 세 각
      const B = [180, 230]; let start = 180; [as[0], as[1], fix].forEach((d, i) => { const a1 = rad(start), a2 = rad(start - d); g += `<path d="M${B[0]} ${B[1]} L${(B[0] + 40 * Math.cos(a1)).toFixed(1)} ${(B[1] - 40 * Math.sin(a1)).toFixed(1)} A40 40 0 0 1 ${(B[0] + 40 * Math.cos(a2)).toFixed(1)} ${(B[1] - 40 * Math.sin(a2)).toFixed(1)} Z" fill="${COL[i]}" opacity=".75"/>`; start -= d; });
      g += line(110, 230, 250, 230, { w: 2.4 }) + txt(180, 250, '일직선 = 180°', { size: 12, bold: true });
      $in(el, '#tf').innerHTML = svg(330, 260, g);
      $in(el, '#to').innerHTML = `<span style="color:${COL[0]}">■</span> ${as[0]}° + <span style="color:${COL[1]}">■</span> ${as[1]}° + <span style="color:${COL[2]}">■</span> ${fix}° = <b>180°</b><br><span style="color:${GRAY}">세 각을 잘라 한 점에 모으면 일직선이 돼요 → 삼각형의 세 각의 크기의 합은 항상 180°</span>`; }
    else { const z = +$in(el, '#tz').value, p = [[30, 170], [z, 180], [x, y], [40, 50]], tri1 = [p[0], p[1], p[2]], tri2 = [p[0], p[2], p[3]];
      let g = `<polygon points="${tri1.map(q => q.join(',')).join(' ')}" fill="#E8F7EA" stroke="${INK}" stroke-width="2"/><polygon points="${tri2.map(q => q.join(',')).join(' ')}" fill="#FFF1DE" stroke="${INK}" stroke-width="2"/>` + line(p[0][0], p[0][1], p[2][0], p[2][1], { stroke: RED, w: 2, dash: '6 4' });
      const as = p.map((q, i) => Math.round(ang(q, p[(i + 1) % 4], p[(i + 3) % 4]))); const fix = 360 - as[0] - as[1] - as[3];
      g += p.map((q, i) => arc(q, p[(i + 1) % 4], p[(i + 3) % 4], COL[i])).join('');
      $in(el, '#tf').innerHTML = svg(340, 200, g);
      $in(el, '#to').innerHTML = `${as[0]}° + ${as[1]}° + ${fix}° + ${as[3]}° = <b>360°</b><br><span style="color:${GRAY}">대각선을 그으면 삼각형 2개 → 180° × 2 = 360°</span>`; } };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });

/* ═════════════ 2. 큰 수 실험실 ═════════════ */
const PL = ['일', '십', '백', '천'];
const placeLab = (maxGroup, start) => ({ title: maxGroup >= 3 ? '자리마다 숫자를 바꾸어 조 단위까지 읽어 보기' : maxGroup === 2 ? '억 단위 수를 만들고 읽어 보기' : '만 단위 수를 만들고 읽어 보기', init(el){
  const G = ['', '만', '억', '조'], n = (maxGroup + 1) * 4; let dg = String(start).padStart(n, '0').split('').map(Number);
  el.innerHTML = `<div id="pt" style="overflow-x:auto"></div><div class="out" id="po"></div><div class="ctrl"><button class="tbtn" type="button" id="pr">🎲 아무 수나</button><button class="tbtn" type="button" id="pz">0으로</button></div>`;
  const draw = () => { let h = '<table class="qt" style="font-size:15px"><tr>';
    for (let g = maxGroup; g >= 0; g--) h += `<th colspan="4" style="background:${['#E8F7EA', '#FFF1DE', '#E6F0FF', '#FFE3EA'][g]}">${G[g] || '일'} 단위</th>`; h += '</tr><tr>';
    for (let i = 0; i < n; i++){ const k = n - 1 - i; h += `<td style="padding:2px 4px;font-size:12px;color:${GRAY}">${PL[k % 4]}${k >= 4 && k % 4 === 0 ? '' : ''}</td>`; } h += '</tr><tr>';
    for (let i = 0; i < n; i++) h += `<td style="padding:0"><button class="tbtn" type="button" data-i="${i}" style="min-width:30px;min-height:40px;padding:2px 6px;font-family:Fredoka;font-size:20px;${i < dg.findIndex(x => x) || !dg.some(x => x) ? 'color:#C9D3E0' : ''}">${dg[i]}</button></td>`;
    $in(el, '#pt').innerHTML = h + '</tr></table>';
    el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; dg[i] = (dg[i] + 1) % 10; draw(); }));
    const v = +dg.join('');
    $in(el, '#po').innerHTML = v ? `<b style="font-family:Fredoka">${v.toLocaleString('ko-KR')}</b> = ${G4.numKo(v)}<br>읽기: <b>${G4.readKo(v)}</b><br><span style="color:${GRAY}">칸을 누르면 숫자가 1씩 커져요. 뒤에서부터 네 자리씩 끊어 읽어요.</span>` : '칸을 눌러 숫자를 만들어 보세요.'; };
  $in(el, '#pr').addEventListener('click', () => { dg = dg.map((_, i) => i < n - 4 * maxGroup - 2 ? 0 : ri(0, 9)); if (!dg.some(x => x)) dg[n - 1] = 1; draw(); });
  $in(el, '#pz').addEventListener('click', () => { dg = dg.map(() => 0); draw(); }); draw();
} });
const tenThousandLab = { title: '돈으로 10000 만들기', init(el){
  const U = [[1000, '천 원', '#B9E3C6'], [100, '백 원', '#FFE7A8'], [10, '십 원', '#E7D3B8']];
  el.innerHTML = `<div class="ctrl">${U.map((u, i) => `<button class="tbtn" type="button" data-u="${i}">+ ${u[1]}</button>`).join('')}<button class="tbtn" type="button" id="mr">↺ 비우기</button></div><div id="mv" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;min-height:60px"></div><div class="out" id="mo"></div>`;
  let c = [9, 9, 9];
  const draw = () => { const v = c[0] * 1000 + c[1] * 100 + c[2] * 10;
    $in(el, '#mv').innerHTML = U.map((u, i) => range(1, c[i]).map(() => `<span style="display:inline-grid;place-items:center;${i ? 'width:30px;height:30px;border-radius:50%' : 'width:52px;height:28px;border-radius:4px'};background:${u[2]};border:2px solid ${INK};font-size:10px;font-weight:700">${u[0]}</span>`).join('')).join('');
    $in(el, '#mo').innerHTML = `모두 <b>${v}원</b>${v >= 10000 ? ` 🎉 ${v === 10000 ? '1000이 10개인 수 = <b>10000(만)</b>' : `만 원보다 ${v - 10000}원 많아요`}` : ` · 10000원이 되려면 ${10000 - v}원 더!`}<br><span style="color:${GRAY}">10000은 9000보다 1000, 9900보다 100, 9990보다 10, 9999보다 1 큰 수예요.</span>`; };
  el.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => { c[+b.dataset.u]++; draw(); }));
  $in(el, '#mr').addEventListener('click', () => { c = [0, 0, 0]; draw(); }); draw();
} };
const skipLab = { title: '뛰어 세며 어느 자리가 바뀌는지 보기', init(el){
  const K = [1e4, 1e5, 1e6, 1e7, 1e8, 1e10, 1e12];
  el.innerHTML = `<div class="ctrl">${K.map((k, i) => `<button class="tbtn" type="button" data-k="${i}" aria-pressed="${i === 1}">${G4.numKo(k)}씩</button>`).join('')}</div><div class="ctrl"><button class="tbtn" type="button" id="sg">🦖 뛰어 세기 ▶</button><button class="tbtn" type="button" id="sr">↺ 처음</button></div><div id="sv" class="out" style="font-family:Fredoka;font-size:20px;line-height:1.8"></div><div class="out" id="so"></div>`;
  let k = 1e5, start = 0, seq = [];
  const reset = () => { start = ri(10, 99) * k * 10 + ri(1, 9) * k / 10 * 3; seq = [start]; draw(); };
  const hl = (v, prev) => { const s = String(v), p = String(prev ?? '').padStart(s.length, ' '); return s.split('').map((c, i) => c !== p[i] && prev != null ? `<span style="background:#FFE38A;border-radius:4px">${c}</span>` : c).join(''); };
  const draw = () => { $in(el, '#sv').innerHTML = seq.map((v, i) => hl(v, seq[i - 1])).join('<br>');
    $in(el, '#so').innerHTML = `${G4.numKo(k)}씩 뛰어 세면 <b>${['', '', '', '', '만', '십만', '백만', '천만', '억', '', '백억', '', '조'][String(k).length - 1]}의 자리</b> 숫자가 1씩 커져요. (노란색이 바뀐 숫자)`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { k = K[+b.dataset.k]; press(el, '[data-k]', b); reset(); }));
  $in(el, '#sg').addEventListener('click', () => { if (seq.length < 8) seq.push(seq[seq.length - 1] + k); draw(); });
  $in(el, '#sr').addEventListener('click', reset); reset();
} };
const cmpBigLab = { title: '자리를 맞추어 두 수의 크기 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cn">🎲 새 두 수</button></div><div id="ct" style="overflow-x:auto"></div><div class="out" id="co"></div>`;
  const fresh = () => { const len = ri(7, 10); let a = String(ri(1, 9)); for (let i = 1; i < len; i++) a += ri(0, 9); const t = ri(0, 2); let b = a.split('');
    if (t === 0) b.pop(); else { const j = ri(1, len - 1); b[j] = String((+b[j] + ri(1, 9)) % 10); } b = b.join('');
    const n = Math.max(a.length, b.length), pa = a.padStart(n, ' '), pb = b.padStart(n, ' '); let first = -1; if (a.length === b.length) for (let i = 0; i < n; i++) if (pa[i] !== pb[i]){ first = i; break; }
    const row = s => s.split('').map((c, i) => `<td style="font-family:Fredoka;font-size:22px;padding:2px 6px;${i === first ? 'background:#FFE38A' : ''}">${c.trim()}</td>`).join('');
    $in(el, '#ct').innerHTML = `<table class="qt"><tr><th>가</th>${row(pa)}</tr><tr><th>나</th>${row(pb)}</tr></table>`;
    const c = +a > +b ? '&gt;' : +a < +b ? '&lt;' : '=';
    $in(el, '#co').innerHTML = a.length !== b.length ? `자리 수가 다르면 <b>자리 수가 많은 쪽</b>이 커요 (${a.length}자리 vs ${b.length}자리) → <b>가 ${c} 나</b>` : first < 0 ? '두 수가 같아요!' : `자리 수가 같으면 높은 자리부터 비교해요. 노란 칸에서 처음으로 달라져요 (${pa[first]} vs ${pb[first]}) → <b>가 ${c} 나</b>`; };
  $in(el, '#cn').addEventListener('click', fresh); fresh();
} };

/* ═════════════ 3. 평면도형의 이동 실험실 ═════════════ */
const moveLab = { title: '화살표를 눌러 점 이동시키기', init(el){
  const u = 30, W = 10, H = 7;
  el.innerHTML = `<div class="figc" id="mf"></div><div class="ctrl">${[['⬅ 왼쪽', -1, 0], ['➡ 오른쪽', 1, 0], ['⬆ 위쪽', 0, -1], ['⬇ 아래쪽', 0, 1]].map(d => `<button class="tbtn" type="button" data-d="${d[1]},${d[2]}">${d[0]}</button>`).join('')}<button class="tbtn" type="button" id="mr">↺ 처음</button></div><div class="out" id="mo"></div>`;
  let s = [2, 5], p = [2, 5], log = [], goal = [7, 2];
  const draw = () => { let g = ''; for (let i = 0; i <= W; i++) g += line(15 + i * u, 15, 15 + i * u, 15 + H * u, { stroke: '#D5DDE8', w: 1 }); for (let j = 0; j <= H; j++) g += line(15, 15 + j * u, 15 + W * u, 15 + j * u, { stroke: '#D5DDE8', w: 1 });
    g += `<circle cx="${15 + goal[0] * u}" cy="${15 + goal[1] * u}" r="9" fill="none" stroke="${RED}" stroke-width="2.4" stroke-dasharray="4 3"/>` + txt(15 + goal[0] * u + 14, 15 + goal[1] * u - 12, '⭐', { size: 14 });
    g += `<circle cx="${15 + s[0] * u}" cy="${15 + s[1] * u}" r="5" fill="#9AA6B6"/><circle cx="${15 + p[0] * u}" cy="${15 + p[1] * u}" r="8" fill="${GR}" stroke="${INK}" stroke-width="2"/>`;
    $in(el, '#mf').innerHTML = svg(W * u + 30, H * u + 30, g);
    const dx = p[0] - s[0], dy = p[1] - s[1];
    $in(el, '#mo').innerHTML = `${p[0] === goal[0] && p[1] === goal[1] ? '🎉 별에 도착! ' : '별(⭐)까지 점을 옮겨 보세요. '}<br>처음 위치에서 ${[dx ? `${dx > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(dx)}칸` : '', dy ? `${dy > 0 ? '아래쪽' : '위쪽'}으로 ${Math.abs(dy)}칸` : ''].filter(Boolean).join(', ') || '그대로'} 이동했어요.`; };
  el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { const [dx, dy] = b.dataset.d.split(',').map(Number); p = [Math.max(0, Math.min(W, p[0] + dx)), Math.max(0, Math.min(H, p[1] + dy))]; draw(); }));
  $in(el, '#mr').addEventListener('click', () => { p = s.slice(); goal = [ri(0, W), ri(0, H)]; draw(); }); draw();
} };
const tfLab = mode => ({ title: { slide: '도형을 밀어 보기', flip: '도형을 뒤집어 보기', rot: '도형을 돌려 보기', mix: '뒤집고 돌리며 같은 결과 찾기' }[mode], init(el){
  const B = { slide: [['➡ 오른쪽으로 밀기', 'slide'], ['⬅ 왼쪽으로 밀기', 'slide'], ['⬆ 위쪽으로 밀기', 'slide']], flip: [['↔ 오른쪽(왼쪽)으로 뒤집기', 'flipH'], ['↕ 위쪽(아래쪽)으로 뒤집기', 'flipV']], rot: [['↻ 시계 방향 90°', 'cw'], ['↺ 시계 반대 방향 90°', 'ccw'], ['↻ 180°', 'r180'], ['↻ 270°', 'ccw']], mix: [['↔ 뒤집기', 'flipH'], ['↕ 뒤집기', 'flipV'], ['↻ 90°', 'cw'], ['↺ 90°', 'ccw']] }[mode];
  el.innerHTML = `<div class="ctrl">${B.map((b, i) => `<button class="tbtn" type="button" data-b="${i}">${b[0]}</button>`).join('')}<button class="tbtn" type="button" id="tr">↺ 처음 도형</button><button class="tbtn" type="button" id="ts">🎲 다른 도형</button></div><div class="figc" id="tf" style="gap:18px;align-items:center;flex-wrap:wrap"></div><div class="out" id="to"></div>`;
  let s0 = pick(G4.GOOD), cur = s0, log = [], shift = 0;
  const draw = () => { const same = G4.norm(cur).join() === G4.norm(s0).join();
    $in(el, '#tf').innerHTML = `<div style="text-align:center">${G4.shapeFig(s0, '#C9D3E0', 26)}<div>처음</div></div><div style="font-size:30px">➜</div><div style="text-align:center;transform:translateX(${shift}px);transition:transform .3s">${G4.shapeFig(cur, '#8FD19E', 26)}<div>지금</div></div>`;
    const tip = { slide: '밀기: 모양은 그대로, <b>위치만</b> 바뀌어요.', flip: '오른쪽·왼쪽으로 뒤집으면 <b>왼쪽 ↔ 오른쪽</b>, 위쪽·아래쪽으로 뒤집으면 <b>위쪽 ↔ 아래쪽</b>이 바뀌어요.', rot: '시계 방향으로 90° 돌리면 위쪽이 <b>오른쪽</b>으로, 180° 돌리면 위쪽이 <b>아래쪽</b>으로 가요. 270° = 시계 반대 방향 90°!', mix: '여러 번 움직인 다음, 처음 도형과 같은지 비교해 보세요.' }[mode];
    $in(el, '#to').innerHTML = `${log.length ? `한 일: ${log.join(' → ')}${log.length && same ? ' → 🎉 <b>처음 도형과 같아졌어요!</b>' : ''}<br>` : ''}${tip}`; };
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => { const [nm, k] = B[+b.dataset.b];
    if (k === 'slide'){ shift = nm.includes('오른') ? Math.min(shift + 30, 60) : nm.includes('왼') ? Math.max(shift - 30, -60) : shift; }
    else cur = G4.TR[k](cur); log.push(nm.replace(/^[^ ]+ /, '')); if (log.length > 6) log.shift(); draw(); }));
  $in(el, '#tr').addEventListener('click', () => { cur = s0; log = []; shift = 0; draw(); });
  $in(el, '#ts').addEventListener('click', () => { s0 = pick(G4.GOOD); cur = s0; log = []; shift = 0; draw(); }); draw();
} });

/* ═════════════ 4. 곱셈과 나눗셈 실험실 ═════════════ */
const mulLongLab = (tensOnly) => ({ title: tensOnly ? '(세 자리 수) × (몇십)은 (세 자리 수) × (몇)에 0 붙이기' : '(세 자리 수) × (몇십몇)을 두 번 나누어 곱하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="mn">🎲 새 문제</button><button class="tbtn" type="button" id="ms">▶ 다음 단계</button><button class="tbtn" type="button" id="mr">↺ 처음부터</button></div><div id="mt"></div><div class="out" id="mo"></div>`;
  let a, b, k;
  const fresh = () => { a = ri(112, 789); b = tensOnly ? ri(2, 9) * 10 : ri(12, 89); if (!tensOnly && b % 10 === 0) b++; k = 0; draw(); };
  const draw = () => { const o = b % 10, t = b - o, p1 = a * o, p2 = a * t, r = a * b, W = String(r).length + 1;
    const row = (v, lab, st = '', show = true) => { const s = show ? String(v) : ''; return `<tr>${[...' '.repeat(W - s.length) + s].map((c, i) => `<td style="width:1.1em;text-align:center;${st}">${c.trim()}</td>`).join('')}<td style="font-size:.5em;color:${GRAY};text-align:left;padding-left:8px">${lab}</td></tr>`; };
    let h = `<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(24px,3.6vw,34px);margin:6px auto">` + row(a, '') + row('×' + b, '', `border-bottom:3px solid ${INK}`);
    const steps = tensOnly ? [[a * (b / 10), `${a} × ${b / 10}`], [r, `0을 하나 붙여요`]] : [[p1, `${a} × ${o}`], [p2, `${a} × ${t}`], [r, `${p1} + ${p2}`]];
    steps.forEach((s, i) => { if (!tensOnly && i === 2) h += row(s[0], k > i ? s[1] : '', k > i ? `border-top:3px solid ${INK};color:#2F8A47` : '', k > i); else h += row(s[0], k > i ? s[1] : '', k > i ? (i === steps.length - 1 ? 'color:#2F8A47' : '') : '', k > i); });
    $in(el, '#mt').innerHTML = h + '</table>';
    const M = tensOnly ? ['▶를 눌러 차례로 계산해요.', `${a} × ${b / 10} = ${a * b / 10}`, `🎉 ${a} × ${b} = ${a} × ${b / 10} × 10 = <b>${r}</b>`] : ['▶를 눌러 차례로 계산해요. 곱하는 수를 <b>몇</b>과 <b>몇십</b>으로 나누어요.', `① ${a} × ${o} = <b>${p1}</b>`, `② ${a} × ${t} = <b>${p2}</b> (일의 자리에 0이 생기므로 0을 생략하고 한 칸 왼쪽부터 쓰기도 해요)`, `③ ${p1} + ${p2} = <b>${r}</b> 🎉`];
    $in(el, '#mo').innerHTML = M[k]; $in(el, '#ms').disabled = k >= M.length - 1; };
  $in(el, '#mn').addEventListener('click', fresh);
  $in(el, '#ms').addEventListener('click', () => { k++; draw(); });
  $in(el, '#mr').addEventListener('click', () => { k = 0; draw(); }); fresh();
} });
const quotEstLab = { title: '몫을 어림하고 고쳐 가며 찾기', init(el){
  el.innerHTML = `<div class="out" id="qx" style="font-size:24px;font-family:Fredoka"></div><div class="ctrl"><label>내가 생각한 몫</label><input type="range" min="1" max="9" value="5" id="qg"><span class="v" id="qgv"></span><button class="tbtn" type="button" id="qn">🎲 새 문제</button></div><div class="figc" id="qf"></div><div class="out" id="qo"></div>`;
  let a, b;
  const fresh = () => { b = ri(13, 79); const q = ri(2, 9), r = ri(0, b - 1); a = b * q + r; if (a > 999 || a < 100) return fresh(); $in(el, '#qx').innerHTML = `${a} ÷ ${b} = ?`; draw(); };
  const draw = () => { const g = +$in(el, '#qg').value, p = b * g, q = Math.floor(a / b); $in(el, '#qgv').textContent = g;
    const W = 420, s = W / Math.max(a, p) ; $in(el, '#qf').innerHTML = svg(W + 20, 70, `<rect x="10" y="10" width="${a * s}" height="20" fill="#BFE3FF" stroke="${INK}"/>` + txt(10 + a * s / 2, 20, `나누어지는 수 ${a}`, { size: 12, bold: true }) + `<rect x="10" y="38" width="${p * s}" height="20" fill="${p > a ? '#FFD7DE' : '#D9F2DC'}" stroke="${INK}"/>` + txt(10 + Math.max(p * s / 2, 60), 48, `${b} × ${g} = ${p}`, { size: 12, bold: true }));
    $in(el, '#qo').innerHTML = p > a ? `${p} &gt; ${a} → 몫이 너무 커요! <b>1 작게</b> 해 보세요.` : a - p >= b ? `남은 수 ${a - p}가 ${b}보다 크거나 같아요 → 몫을 <b>더 크게</b> 할 수 있어요.` : `🎉 몫 <b>${g}</b>, 나머지 <b>${a - p}</b> (${a - p} &lt; ${b})${g === q ? '' : ''}<br><span style="color:${GRAY}">확인: ${b} × ${g} + ${a - p} = ${a}</span>`; };
  $in(el, '#qg').addEventListener('input', draw); $in(el, '#qn').addEventListener('click', fresh); fresh();
} };
const div2Gen = big => () => { const b = ri(12, big ? 45 : 89), q = big ? ri(11, 40) : ri(2, 9), r = ri(0, b - 1), a = b * q + r; return a >= 100 && a <= 999 ? [a, b] : [b * 5 + 3 > 99 ? b * 5 + 3 : 236, b]; };

/* ═════════════ 5. 규칙 찾기 실험실 ═════════════ */
const growLab = { title: '모양의 배열에서 규칙 찾기', init(el){
  const PT = [['계단 모양', n => n * (n + 1) / 2, '1, 2, 3, …씩 늘어나요 (1 + 2 + … + 째)'], ['ㄱ자 모양', n => 2 * n - 1, '2개씩 늘어나요 (2 × 째 - 1)'], ['정사각형 모양', n => n * n, '째 × 째 개'], ['십자 모양', n => 4 * n - 3, '4개씩 늘어나요']];
  el.innerHTML = `<div class="ctrl">${PT.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${!i}">${p[0]}</button>`).join('')}</div><div class="ctrl"><label>몇째</label><input type="range" min="1" max="7" value="4" id="gn"><span class="v" id="gnv"></span></div><div class="figc" id="gf"></div><div class="out" id="go"></div>`;
  let m = 0;
  const cells = (m, n) => { const c = []; if (m === 0) for (let y = 0; y < n; y++) for (let x = 0; x <= y; x++) c.push([x, n - 1 - y]); else if (m === 1){ for (let i = 0; i < n; i++) c.push([0, i]); for (let i = 1; i < n; i++) c.push([i, n - 1]); } else if (m === 2){ for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) c.push([x, y]); } else { const k = n - 1; c.push([k, k]); for (let i = 1; i <= k; i++) c.push([k + i, k], [k - i, k], [k, k + i], [k, k - i]); } return c; };
  const draw = () => { const n = +$in(el, '#gn').value, u = Math.min(22, 160 / (m === 3 ? 2 * n - 1 : n)); $in(el, '#gnv').textContent = n + '째';
    const cs = cells(m, n), W = (m === 3 ? 2 * n - 1 : n) * u + 10; $in(el, '#gf').innerHTML = svg(W, W, cs.map(([x, y]) => `<rect x="${5 + x * u}" y="${5 + y * u}" width="${u}" height="${u}" fill="${GR}" stroke="${INK}" stroke-width="1.4"/>`).join(''));
    $in(el, '#go').innerHTML = `${range(1, 5).map(k => `${k}째: ${PT[m][1](k)}개`).join(' · ')}<br>규칙: ${PT[m][2]} → <b>${n}째: ${PT[m][1](n)}개</b>`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { m = +b.dataset.p; press(el, '[data-p]', b); draw(); }));
  $in(el, '#gn').addEventListener('input', draw); draw();
} };
const arrayLab = { title: '수 배열표에서 규칙 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>오른쪽으로</label><select id="ax" class="tbtn">${[1, 10, 100, 1000, 1100].map(x => `<option>${x}</option>`).join('')}</select><label>아래쪽으로</label><select id="ay" class="tbtn">${[10, 100, 1000, 10000].map(x => `<option ${x === 1000 ? 'selected' : ''}>${x}</option>`).join('')}</select><button class="tbtn" type="button" id="ar">🎲 다시</button></div><div id="at"></div><div class="out" id="ao">빈칸(?)을 누르면 수가 나타나요. 먼저 예상해 보세요!</div>`;
  let s, hide;
  const fresh = () => { s = ri(10, 50) * 100 + ri(0, 9); hide = new Set(shuffle(range(0, 19)).slice(0, 6)); draw(); };
  const draw = () => { const dx = +$in(el, '#ax').value, dy = +$in(el, '#ay').value;
    let h = '<table class="qt">'; for (let i = 0; i < 4; i++){ h += '<tr>'; for (let j = 0; j < 5; j++){ const k = i * 5 + j, v = s + i * dy + j * dx; h += `<td data-k="${k}" style="cursor:pointer;font-family:Fredoka;${hide.has(k) ? 'background:#FFF4D0' : ''}">${hide.has(k) ? '?' : v}</td>`; } h += '</tr>'; }
    $in(el, '#at').innerHTML = h + '</table>';
    el.querySelectorAll('td[data-k]').forEach(td => td.addEventListener('click', () => { hide.delete(+td.dataset.k); draw(); $in(el, '#ao').innerHTML = `규칙: 오른쪽으로 <b>${dx}씩</b>, 아래쪽으로 <b>${dy}씩</b> 커져요. ↘ 방향으로는 <b>${dx + dy}씩</b>!`; })); };
  el.querySelectorAll('select').forEach(x => x.addEventListener('change', draw)); $in(el, '#ar').addEventListener('click', fresh); fresh();
} };
const balanceLab = { title: '저울로 등호(=)의 뜻 알아보기', init(el){
  el.innerHTML = `<div class="out" id="bx" style="font-size:22px;font-family:Fredoka"></div><div class="ctrl"><label>□</label><input type="range" min="0" max="60" value="20" id="bv"><span class="v" id="bvv"></span><button class="tbtn" type="button" id="bn">🎲 다른 식</button></div><div class="figc" id="bf"></div><div class="out" id="bo"></div>`;
  let a, b, c, mode;
  const fresh = () => { mode = ri(0, 1); a = ri(15, 40); b = ri(10, 30); c = ri(2, 9) * (mode ? 1 : pick([1, -1])); if (b - c < 0) c = -c; draw(); };
  const draw = () => { const x = +$in(el, '#bv').value; $in(el, '#bvv').textContent = x;
    const L = mode ? a - b : a + b, Lt = mode ? `${a} - ${b}` : `${a} + ${b}`, Rt = mode ? `${a + c} - □` : `${a + c} + □`, R = mode ? a + c - x : a + c + x, need = mode ? b + c : b - c;
    $in(el, '#bx').innerHTML = `${Lt} = ${Rt}`;
    const tilt = Math.max(-14, Math.min(14, (R - L) * 1.2)), C = 170;
    $in(el, '#bf').innerHTML = svg(340, 170, `<polygon points="${C - 16},160 ${C + 16},160 ${C},120" fill="#C9D3E0" stroke="${INK}" stroke-width="2"/><g transform="rotate(${tilt} ${C} 120)">${line(C - 130, 120, C + 130, 120, { w: 5, stroke: '#8899AA' })}<rect x="${C - 160}" y="78" width="80" height="34" rx="8" fill="#BFE3FF" stroke="${INK}" stroke-width="2"/>${txt(C - 120, 95, L, { size: 18, bold: true })}<rect x="${C + 80}" y="78" width="80" height="34" rx="8" fill="#FFD7A8" stroke="${INK}" stroke-width="2"/>${txt(C + 120, 95, R, { size: 18, bold: true })}</g>`);
    $in(el, '#bo').innerHTML = L === R ? `⚖️ 양쪽이 <b>같아요!</b> □ = <b>${x}</b><br><span style="color:${GRAY}">${mode ? `빼지는 수가 ${c} 커졌으니 빼는 수도 ${c} 커져야 해요.` : `${a}에서 ${a + c}로 ${Math.abs(c)} ${c > 0 ? '커졌으니 □는 ' + b + '보다 ' + c + ' 작아야' : '작아졌으니 □는 ' + b + '보다 ' + (-c) + ' 커야'} 해요.`}</span>` : `${L} ${L > R ? '&gt;' : '&lt;'} ${R} → 저울이 기울었어요. 등호(=)는 <b>양쪽의 크기가 같다</b>는 뜻이에요.`; void need; };
  $in(el, '#bv').addEventListener('input', draw); $in(el, '#bn').addEventListener('click', fresh); fresh();
} };
const exprLab = (m0 = 0) => ({ title: '계산식 배열의 규칙으로 다음 식 추측하기', init(el){
  const S = [['더해지는 수 100씩', i => `${300 + 100 * i} + ${205 + 10 * i} = ${505 + 110 * i}`, '더해지는 수는 100씩, 더하는 수는 10씩 커지면 합은 110씩 커져요.'], ['빼는 수 1000씩', i => `${9000} - ${1000 + 1000 * i} = ${8000 - 1000 * i}`, '빼지는 수는 같고 빼는 수가 1000씩 커지면 차는 1000씩 작아져요.'], ['1이 늘어나는 곱셈', i => `${'1'.repeat(i + 1)} × ${'1'.repeat(i + 1)} = ${(+'1'.repeat(i + 1)) ** 2}`, '가운데 숫자가 하나씩 커졌다가 다시 작아지는 수가 나와요.'], ['37의 곱', i => `37 × ${3 * (i + 1)} = ${111 * (i + 1)}`, '곱하는 수가 3씩 커지면 곱은 111씩 커져요.'], ['나눗셈 배열', i => `${(i + 1) * 1100} ÷ 11 = ${(i + 1) * 100}`, '나누어지는 수가 1100씩 커지면 몫은 100씩 커져요.']];
  el.innerHTML = `<div class="ctrl">${S.map((s, i) => `<button class="tbtn" type="button" data-s="${i}" aria-pressed="${i === m0}">${s[0]}</button>`).join('')}</div><div class="out" id="xr" style="font-family:Fredoka;font-size:21px;line-height:1.7"></div><div class="ctrl"><button class="tbtn" type="button" id="xn">🔮 다음 식 추측하기</button></div><div class="out" id="xo"></div>`;
  let m = m0, n = 3;
  const draw = () => { $in(el, '#xr').innerHTML = range(0, n - 1).map(i => (i === n - 1 && n > 3 ? '<span style="background:#FFE38A;border-radius:6px;padding:0 4px">' : '') + S[m][1](i) + (i === n - 1 && n > 3 ? '</span>' : '')).join('<br>'); $in(el, '#xo').innerHTML = n > 3 ? `규칙: ${S[m][2]}` : '규칙을 찾아 넷째 식을 먼저 말해 보세요!'; };
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { m = +b.dataset.s; n = 3; press(el, '[data-s]', b); draw(); }));
  $in(el, '#xn').addEventListener('click', () => { if (n < 7) n++; draw(); }); draw();
} });
const calLab = { title: '달력에서 규칙적인 계산식 찾기', init(el){
  el.innerHTML = `<div id="cc"></div><div class="out" id="co">달력에서 날짜를 눌러 가운데로 정해 보세요.</div>`;
  let mid = 16; const start = 3;
  const draw = () => { let h = '<table class="qt" style="font-family:Fredoka">' + '<tr>' + ['일', '월', '화', '수', '목', '금', '토'].map(d => `<th>${d}</th>`).join('') + '</tr>'; let d = 1 - start;
    const near = new Set([mid, mid - 1, mid + 1, mid - 7, mid + 7]);
    for (let w = 0; w < 5; w++){ h += '<tr>'; for (let k = 0; k < 7; k++, d++) h += d >= 1 && d <= 31 ? `<td data-d="${d}" style="cursor:pointer;${d === mid ? 'background:#FFE38A;font-weight:700' : near.has(d) ? 'background:#E8F7EA' : ''}">${d}</td>` : '<td></td>'; h += '</tr>'; }
    $in(el, '#cc').innerHTML = h + '</table>';
    el.querySelectorAll('[data-d]').forEach(td => td.addEventListener('click', () => { const v = +td.dataset.d; if (v > 7 && v < 25 && (v + start - 1) % 7 !== 0 && (v + start) % 7 !== 0) mid = v; draw(); }));
    $in(el, '#co').innerHTML = mid > 7 && mid < 25 ? `${mid - 7} + ${mid + 7} = ${2 * mid} = ${mid} × 2 · ${mid - 1} + ${mid + 1} = ${2 * mid}<br>십자 모양 5개의 합: ${[mid - 7, mid - 1, mid, mid + 1, mid + 7].join(' + ')} = <b>${5 * mid} = ${mid} × 5</b><br><span style="color:${GRAY}">위아래로는 7씩, 옆으로는 1씩 차이 나서 가운데 수를 중심으로 짝을 지으면 합이 같아요.</span>` : '가장자리가 아닌 날짜를 눌러 주세요.'; };
  draw();
} };

/* ═════════════ 6. 막대그래프 실험실 ═════════════ */
const barLab = { title: '수를 바꾸며 막대그래프 그려 보기', init(el){
  const N = ['축구', '피구', '줄넘기', '수영'];
  el.innerHTML = `${N.map((n, i) => `<div class="ctrl"><label>${n}</label><input type="range" min="0" max="20" value="${[12, 6, 9, 4][i]}" data-i="${i}"><span class="v" data-v="${i}"></span></div>`).join('')}<div class="ctrl"><label>눈금 한 칸</label><button class="tbtn" type="button" data-s="1" aria-pressed="true">1명</button><button class="tbtn" type="button" data-s="2">2명</button><button class="tbtn" type="button" id="bh" aria-pressed="false">가로 막대</button></div><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><div id="bt"></div><div id="bg"></div></div><div class="out" id="bo"></div>`;
  let step = 1, horiz = false;
  const draw = () => { const v = [...el.querySelectorAll('input[data-i]')].map(i => +i.value); v.forEach((x, i) => { $in(el, `[data-v="${i}"]`).textContent = x; });
    $in(el, '#bt').innerHTML = tableH([['운동', ...N, '합계'], ['학생 수(명)', ...v, v.reduce((a, b) => a + b, 0)]]);
    $in(el, '#bg').innerHTML = G4.barG(v.map(x => Math.max(x, 0)), N, step, '명', '좋아하는 운동별 학생 수', horiz);
    const mx = Math.max(...v);
    $in(el, '#bo').innerHTML = `가장 많은 학생이 좋아하는 운동: <b>${N.filter((_, i) => v[i] === mx).join(', ')}</b> · 눈금 한 칸이 ${step}명이면 ${v[0]}명은 <b>${v[0] / step}칸</b><br><span style="color:${GRAY}">막대그래프는 수량의 많고 적음을 막대의 길이로 한눈에 비교할 수 있어요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { step = +b.dataset.s; press(el, '[data-s]', b); el.querySelectorAll('input').forEach(i => { i.step = step; i.value = Math.round(+i.value / step) * step; }); draw(); }));
  $in(el, '#bh').addEventListener('click', e => { horiz = !horiz; e.target.setAttribute('aria-pressed', horiz); draw(); }); draw();
} };
const surveyBarLab = { title: '우리 반 친구들을 조사하여 막대그래프로 나타내기', init(el){
  const F = [['🌸', '봄'], ['☀️', '여름'], ['🍁', '가을'], ['⛄', '겨울']];
  el.innerHTML = `<div class="out">좋아하는 계절을 눌러 조사해 보세요.</div><div class="ctrl">${F.map((f, i) => `<button class="tbtn" type="button" data-f="${i}">${f[0]} ${f[1]}</button>`).join('')}<button class="tbtn" type="button" id="sr">🎲 25명 조사</button><button class="tbtn" type="button" id="sc">↺</button></div><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><div id="st"></div><div id="sg"></div></div><div class="out" id="so"></div>`;
  let c = [0, 0, 0, 0];
  const draw = () => { const tot = c.reduce((a, b) => a + b, 0);
    $in(el, '#st').innerHTML = tableH([['계절', ...F.map(f => f[1]), '합계'], ['학생 수(명)', ...c, tot]]);
    $in(el, '#sg').innerHTML = G4.barG(c, F.map(f => f[1]), 1, '명', '좋아하는 계절별 학생 수');
    const mx = Math.max(...c);
    $in(el, '#so').innerHTML = tot ? `가장 많이 좋아하는 계절: <b>${F.filter((_, i) => c[i] === mx).map(f => f[1]).join(', ')}</b><br><span style="color:${GRAY}">① 조사 주제 정하기 → ② 자료 수집 → ③ 표로 정리 → ④ 가로·세로에 나타낼 것과 눈금 정하기 → ⑤ 막대 그리기 → ⑥ 제목 붙이기</span>` : ''; };
  el.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { c[+b.dataset.f]++; draw(); }));
  $in(el, '#sr').addEventListener('click', () => { c = [0, 0, 0, 0]; const w = shuffle([5, 3, 2, 1]); for (let i = 0; i < 25; i++){ let r = Math.random() * 11, j = 0; while (j < 3 && r > w[j]){ r -= w[j]; j++; } c[j]++; } draw(); });
  $in(el, '#sc').addEventListener('click', () => { c = [0, 0, 0, 0]; draw(); }); $in(el, '#sr').click();
} };

/* ═════════════ 1. 각도 ═════════════ */
add({ key:'4-1-1', title:'각도', intro:'각의 크기를 비교하고 각도기로 재요. 예각과 둔각을 구별하고, 각도의 합과 차, 삼각형과 사각형의 각의 크기의 합을 탐구해요.',
  prev:'[3-1] 평면도형 (각, 직각)', lessons:[
  { title:'각의 크기 비교', std:['4수03-02'], key:'각의 크기는 <b>두 변이 벌어진 정도</b>로 비교해요. 변의 길이와는 상관없어요!',
    body:`<p>두 각을 겹쳐 보거나, 똑같은 작은 각(부채꼴 조각)이 몇 개 들어가는지 세어 비교할 수 있어요.</p><div class="warn">⚠️ 변이 길다고 큰 각이 아니에요.</div>`,
    lab: angleCmpLab, ex:`<p>두 변이 더 많이 벌어진 각이 <b>더 큰 각</b>이에요.</p>`, quiz:[['ag-kind', 1]] },
  { title:'각의 크기 재어 보기', std:['4수03-24'], key:'직각을 똑같이 90으로 나눈 하나 = <b>1도(1°)</b>. 직각은 90°예요.',
    body:`<ol><li>각도기의 <b>중심</b>을 각의 꼭짓점에 맞춰요.</li><li>각도기의 <b>밑금</b>을 각의 한 변에 맞춰요.</li><li>나머지 변이 가리키는 눈금을 읽어요 — 밑금에 맞춘 변이 0인 쪽의 눈금!</li></ol><div class="note">💡 각의 변이 짧으면 자로 변을 길게 늘인 다음 재어요.</div>`,
    lab: protLab, ex:`<p>한 변이 안쪽 눈금 0에 맞춰져 있으면 <b>안쪽 눈금</b>을 읽어요.</p>`, quiz:[['ag-read', 1], ['ag-read', 2]] },
  { title:'예각과 둔각', std:['4수03-02'], key:'0°보다 크고 직각보다 작은 각 = <b>예각</b>, 직각보다 크고 180°보다 작은 각 = <b>둔각</b>',
    body:`<div class="figc" style="gap:10px;flex-wrap:wrap">${G4.angFig(50)}${G4.angFig(90)}${G4.angFig(130)}</div><p style="text-align:center">예각 · 직각 · 둔각</p>`,
    lab: kindLab, ex:`<p>3시 → 직각, 1시 → 예각(30°), 5시 → 둔각(150°)</p>`, quiz:[['ag-kind', 1], ['ag-count', 2], ['ag-clock', 2]] },
  { title:'각도의 어림', std:['4수03-24'], key:'삼각자의 각(30°, 45°, 60°, 90°)을 기준으로 <b>어림</b>한 다음 각도기로 확인해요.',
    body:`<p>"약 ○○°"라고 말해요. 어림한 각도와 잰 각도의 차가 작을수록 잘 어림한 거예요.</p>`,
    lab: estLab, ex:`<p>직각보다 조금 작아 보이면 약 80°, 직각과 일직선의 가운데쯤이면 약 135°</p>`, quiz:[['ag-est', 2], ['ag-clockdeg', 3]] },
  { title:'각도의 합과 차', std:['4수03-24'], key:'각도의 합과 차는 <b>자연수의 덧셈과 뺄셈처럼</b> 계산하고 °를 붙여요.',
    body:`${E('65° + 40° = 105° &nbsp;&nbsp; 130° - 45° = 85°')}<div class="note">💡 일직선이 이루는 각은 180°, 한 바퀴는 360°예요.</div>`,
    lab: sumLab, ex:`<p>삼각자 두 개의 45°와 30°를 이어 붙이면 <b>75°</b></p>`, quiz:[['ag-add', 1], ['ag-add', 2], ['ag-line', 3], ['ag-set', 3]] },
  { title:'삼각형의 세 각의 크기의 합', std:['4수03-25'], key:'삼각형의 세 각의 크기의 합은 <b>180°</b>예요.',
    body:`<p>세 각을 잘라 꼭짓점이 한 점에 모이도록 이어 붙이면 <b>일직선</b>이 돼요. 각도기로 재어 더해 보아도 180°!</p>${E('□ = 180° - 70° - 45° = 65°')}`,
    lab: triSumLab(false), ex:`<p>두 각이 50°, 85°인 삼각형의 나머지 한 각 → 180° - 50° - 85° = <b>45°</b></p>`, quiz:[['ag-tri', 2], ['ag-tri', 3], ['ag-ext', 4]] },
  { title:'사각형의 네 각의 크기의 합', std:['4수03-25'], key:'사각형의 네 각의 크기의 합은 <b>360°</b>예요.',
    body:`<p>사각형에 대각선을 하나 그으면 삼각형 <b>2개</b>로 나누어져요 → 180° × 2 = 360°</p>${E('□ = 360° - 90° - 110° - 75° = 85°')}`,
    lab: triSumLab(true), ex:`<p>세 각이 100°, 80°, 95°인 사각형의 나머지 한 각 → <b>85°</b></p>`, quiz:[['ag-quad', 3], ['ag-quadeq', 5]] }
]});

/* ═════════════ 2. 큰 수 ═════════════ */
add({ key:'4-1-2', title:'큰 수', intro:'10000(만)부터 억, 조까지 큰 수의 자릿값을 알고 읽고 쓰며, 뛰어 세기와 크기 비교를 해요.',
  prev:'[2-1] 세 자리 수 · [2-2] 네 자리 수', lessons:[
  { title:'1000이 10개인 수', std:['4수01-01'], key:'1000이 10개인 수 = <b>10000</b> (만 또는 일만)',
    body:`${E('9000보다 1000 큰 수 · 9900보다 100 큰 수 · 9990보다 10 큰 수 · 9999보다 1 큰 수 = 10000')}`,
    lab: tenThousandLab, ex:`<p>만 원 = 천 원짜리 <b>10장</b> = 백 원짜리 동전 <b>100개</b></p>`, quiz:[['bn-10000', 1]] },
  { title:'다섯 자리 수', std:['4수01-01'], key:'10000이 3개, 1000이 2개, 100이 7개, 10이 5개, 1이 4개 → <b>32754</b> (삼만 이천칠백오십사)',
    body:`${tableH([['자리', '만', '천', '백', '십', '일'], ['숫자', 3, 2, 7, 5, 4], ['나타내는 값', 30000, 2000, 700, 50, 4]])}<p>32754 = 30000 + 2000 + 700 + 50 + 4</p>`,
    lab: placeLab(1, 32754), ex:`<p>만이 4개, 천이 0개, 백이 9개, 일이 2개 → <b>40902</b> (사만 구백이)</p>`, quiz:[['bn-count', 2], ['bn-money', 2], ['bn-read', 1]] },
  { title:'십만, 백만, 천만', std:['4수01-01'], key:'10000이 10개 = <b>십만</b>, 100개 = <b>백만</b>, 1000개 = <b>천만</b>',
    body:`<p>36580000 → 뒤에서부터 네 자리씩 끊어요: 3658 | 0000 → <b>3658만</b> (삼천육백오십팔만)</p><div class="note">💡 숫자 6은 백만의 자리 숫자이고 6000000을 나타내요.</div>`,
    lab: placeLab(1, 36580000), ex:`<p>25340000은 <b>이천오백삼십사만</b>으로 읽어요.</p>`, quiz:[['bn-read', 2], ['bn-place', 2], ['bn-value', 2]] },
  { title:'억', std:['4수01-01'], key:'1000만이 10개인 수 = <b>1억</b> (100000000, 일억)',
    body:`<p>억 단위도 일, 십, 백, 천이 되풀이돼요: 일억, 십억, 백억, 천억</p>${E('523400000000 = 5234억')}`,
    lab: placeLab(2, 523416000000), ex:`<p>억이 315개, 만이 2700개인 수 → <b>315억 2700만</b></p>`, quiz:[['bn-write', 2], ['bn-count', 3]] },
  { title:'조', std:['4수01-01'], key:'1000억이 10개인 수 = <b>1조</b> (1000000000000, 일조)',
    body:`<p>억이 10000개인 수도 1조예요. 조 단위에도 일조, 십조, 백조, 천조가 있어요.</p><div class="note">💡 큰 수는 뒤에서부터 <b>네 자리씩</b> 끊어 만, 억, 조를 붙여 읽어요.</div>`,
    lab: placeLab(3, 3725000080000000), ex:`<p>3725000080000000 → <b>3725조 8000만</b></p>`, quiz:[['bn-write', 3], ['bn-value', 3], ['bn-10x', 3]] },
  { title:'뛰어 세기', std:['4수01-02'], key:'10만씩 뛰어 세면 <b>십만의 자리</b> 숫자가 1씩 커져요.',
    body:`${E('350만 — 360만 — 370만 — 380만')}<p>어느 자리 숫자가 바뀌는지 보면 몇씩 뛰어 세었는지 알 수 있어요.</p>`,
    lab: skipLab, ex:`<p>20억 → 40억 → 60억: <b>20억씩</b> 뛰어 세었어요.</p>`, quiz:[['bn-skip', 2], ['bn-skipk', 3], ['bn-10x', 4]] },
  { title:'수의 크기 비교', std:['4수01-02'], key:'자리 수가 다르면 <b>자리 수가 많은 수</b>가 커요. 같으면 <b>높은 자리부터</b> 비교해요.',
    body:`${E('1528000 &lt; 10000000 &nbsp;&nbsp; 82450000 &gt; 82390000')}`,
    lab: cmpBigLab, ex:`<p>47□385 &gt; 476385 → □에는 7, 8, 9가 들어갈 수 있어요.</p>`, quiz:[['bn-cmp', 2], ['bn-order', 3], ['bn-missing', 4], ['bn-cards', 5]] }
]});

/* ═════════════ 3. 평면도형의 이동 ═════════════ */
add({ key:'4-1-3', title:'평면도형의 이동', intro:'점의 이동을 방향과 거리로 설명하고, 평면도형을 밀기, 뒤집기, 돌리기 했을 때의 변화를 탐구해요.',
  prev:'[3-1] 평면도형', lessons:[
  { title:'점의 이동', std:['4수03-05'], key:'점의 이동은 <b>어느 방향</b>으로 <b>몇 칸(몇 cm)</b> 이동했는지로 설명해요.',
    body:`<p>점 ㄱ을 오른쪽으로 5 cm, 위쪽으로 2 cm 이동 → 가로 방향과 세로 방향으로 나누어 생각해요.</p>`,
    lab: moveLab, ex:`<p>점 ㄴ에서 점 ㄱ으로 되돌아가려면 <b>반대 방향</b>으로 같은 거리만큼: 왼쪽으로 5 cm, 아래쪽으로 2 cm</p>`, quiz:[['pt-move', 1], ['pt-move', 2], ['pt-desc', 2]] },
  { title:'평면도형 밀기', std:['4수03-04'], key:'도형을 어느 방향으로 밀어도 <b>모양은 그대로</b>, 위치만 바뀌어요.',
    body:`<p>도형의 한 꼭짓점이 몇 칸 움직였는지 세어 밀기 한 위치를 찾아요.</p>`,
    lab: tfLab('slide'), ex:`<p>오른쪽으로 8 cm 밀어도, 위쪽으로 밀어도 모양과 크기는 똑같아요.</p>`, quiz:[['tf-slide', 1]] },
  { title:'평면도형 뒤집기', std:['4수03-04'], key:'오른쪽(왼쪽)으로 뒤집으면 <b>왼쪽 ↔ 오른쪽</b>, 위쪽(아래쪽)으로 뒤집으면 <b>위쪽 ↔ 아래쪽</b>이 바뀌어요.',
    body:`<div class="note">💡 같은 방향으로 <b>두 번</b> 뒤집으면 처음 도형과 같아요. 오른쪽으로 뒤집은 것과 왼쪽으로 뒤집은 것은 결과가 같아요.</div>`,
    lab: tfLab('flip'), ex:`<p>글자 카드 "ㅋ"을 오른쪽으로 뒤집으면 꺾인 부분이 반대쪽으로 가요.</p>`, quiz:[['tf-flip', 1], ['tf-flip', 2]] },
  { title:'평면도형 돌리기', std:['4수03-04'], key:'시계 방향으로 90° 돌리면 도형의 <b>위쪽이 오른쪽</b>으로, 180° 돌리면 <b>위쪽이 아래쪽</b>으로 이동해요.',
    body:`<ul><li>시계 방향 90° = 시계 반대 방향 270°</li><li>시계 방향 180° = 시계 반대 방향 180°</li><li>360° 돌리면 처음 도형과 같아요.</li></ul>`,
    lab: tfLab('rot'), ex:`<p>디지털 숫자 카드 "69"를 180° 돌리면 → <b>69</b> (6과 9가 바뀌고 순서도 바뀌어요)</p>`, quiz:[['tf-rot', 2], ['tf-rot', 3], ['tf-same', 3]] },
  { title:'뒤집고 돌리기', std:['4수03-04'], key:'여러 번 움직일 때는 <b>순서대로 하나씩</b> 생각해요. 순서를 바꾸면 결과가 달라질 수 있어요.',
    body:`<p>처음 도형을 알고 싶으면 <b>거꾸로</b> 생각해요: 시계 방향으로 돌렸다면 시계 반대 방향으로 돌려 보아요.</p>`,
    lab: tfLab('mix'), ex:`<p>오른쪽으로 뒤집고 180° 돌린 도형 = 위쪽으로 뒤집은 도형</p>`, quiz:[['tf-twice', 4], ['tf-back', 4], ['tf-num', 4]] }
]});

/* ═════════════ 4. 곱셈과 나눗셈 ═════════════ */
add({ key:'4-1-4', title:'곱셈과 나눗셈', intro:'(세 자리 수) × (두 자리 수)와 나누는 수가 두 자리 수인 나눗셈의 계산 원리를 탐구하고 생활 문제를 해결해요.',
  prev:'[3-2] 곱셈 · [3-2] 나눗셈', lessons:[
  { title:'(세 자리 수) × (몇십)', std:['4수01-04'], key:'(세 자리 수) × (몇)을 계산한 다음 <b>0을 하나 붙여요</b>.',
    body:`${E('324 × 30 = 324 × 3 × 10 = 972 × 10 = 9720')}`,
    lab: mulLongLab(true), ex:`<p>215 × 40 = 860 × 10 = <b>8600</b></p>`, quiz:[['m-3x10', 1]] },
  { title:'(세 자리 수) × (몇십몇)', std:['4수01-04', '4수01-08'], key:'곱하는 수를 <b>몇</b>과 <b>몇십</b>으로 나누어 곱한 다음 더해요.',
    body:`${E('247 × 36 = 247 × 6 + 247 × 30 = 1482 + 7410 = 8892')}<div class="note">💡 어림: 247 × 36 → 약 250 × 40 = 10000쯤</div>`,
    lab: mulLongLab(false), ex:`<p>사탕이 한 봉지에 17개씩 34봉지 → 17 × 34 = <b>578개</b></p>`, quiz:[['m-3x2', 1], ['m-3x2', 2], ['m-word', 2], ['m-est', 3]] },
  { title:'(몇백몇십) ÷ (몇십)', std:['4수01-07'], key:'240 ÷ 30의 몫은 <b>24 ÷ 3</b>의 몫과 같아요.',
    body:`${E('240 ÷ 30 = 8 (30 × 8 = 240)')}<p>나누어지는 수와 나누는 수를 똑같이 10으로 나누어도 몫은 같아요.</p>`,
    lab: quotEstLab, ex:`<p>350 ÷ 50 = <b>7</b> · 190 ÷ 30 = <b>6 … 10</b></p>`, quiz:[['d-10', 1]] },
  { title:'(두 자리 수) ÷ (두 자리 수)', std:['4수01-07'], key:'나누는 수를 <b>몇십</b>으로 어림하여 몫을 짐작하고, 곱해서 확인해요.',
    body:`${E('78 ÷ 26 → 26을 약 30으로 어림 → 몫 약 3 → 26 × 3 = 78 ✔')}`,
    lab: quotEstLab, ex:`<p>87 ÷ 21 = <b>4 … 3</b> (21 × 4 = 84, 87 - 84 = 3)</p>`, quiz:[['d-2by2', 1], ['d-2by2', 2]] },
  { title:'몫이 한 자리 수인 (세 자리 수) ÷ (몇십몇)', std:['4수01-07'], key:'몫을 어림해 곱해 보고, <b>너무 크면 1 작게, 나머지가 나누는 수보다 크면 1 크게</b> 고쳐요.',
    body:`${E('156 ÷ 39 → 160 ÷ 40 = 4 → 39 × 4 = 156 ✔')}<div class="warn">⚠️ 나머지는 항상 나누는 수보다 작아야 해요.</div>`,
    lab: quotEstLab, ex:`<p>365 ÷ 47 = <b>7 … 36</b> (47 × 7 = 329)</p>`, quiz:[['d-3by2', 2], ['d-rem', 2], ['d-check', 3]] },
  { title:'몫이 두 자리 수인 (세 자리 수) ÷ (몇십몇)', std:['4수01-07'], key:'나누어지는 수의 <b>앞의 두 자리</b>부터 나누고, 남은 수와 다음 자리를 함께 나눠요.',
    body:`${E('598 ÷ 26 = 23')}<p>59 ÷ 26 = 2 … 7 → 78 ÷ 26 = 3 → 몫 23</p>`,
    lab: T.longDivLab('세로셈으로 (세 자리 수) ÷ (두 자리 수)', div2Gen(true)), ex:`<p>740 ÷ 35 = <b>21 … 5</b></p>`, quiz:[['d-3by2b', 3], ['d-rem', 3]] },
  { title:'곱셈과 나눗셈의 활용', std:['4수01-07'], key:'남은 것도 담아야 하면 <b>몫 + 1</b>, 남은 것으로 만들 수 없으면 <b>몫</b>만!',
    body:`<ul><li>토마토 150개를 12개씩 봉지에 → 150 ÷ 12 = 12 … 6 → 봉지 <b>13개</b> 필요</li><li>(나누는 수) × (몫) + (나머지) = (나누어지는 수)로 확인해요.</li></ul>`,
    ex:`<p>□ ÷ 24의 몫이 9일 때 가장 큰 □ → 24 × 9 + 23 = <b>239</b></p>`, quiz:[['d-word', 3], ['d-word', 4], ['md-range', 4], ['md-cards', 5]] }
]});

/* ═════════════ 5. 규칙 찾기 ═════════════ */
add({ key:'4-1-5', title:'규칙 찾기', intro:'모양과 수의 배열에서 규칙을 찾아 수나 식으로 나타내고, 등호의 뜻과 계산식 배열의 규칙을 탐구해요.',
  prev:'[2-2] 규칙 찾기', lessons:[
  { title:'규칙을 찾아 수로 나타내기', std:['4수02-01'], key:'모양이 늘어나는 개수를 <b>수로</b> 나타내면 규칙이 잘 보여요.',
    body:`<p>1, 3, 5, 7, … → 2씩 늘어나요. 1, 4, 9, 16, … → 1×1, 2×2, 3×3, 4×4</p>`,
    lab: growLab, ex:`<p>정사각형이 1, 3, 5, 7개 … → 다섯째는 <b>9개</b></p>`, quiz:[['rl-shape', 2], ['rl-desc', 2]] },
  { title:'규칙을 찾아 식으로 나타내기', std:['4수02-01'], key:'규칙을 <b>식</b>으로 나타내면 열째, 스무째도 쉽게 구할 수 있어요.',
    body:`${E('첫째 1 · 둘째 1 + 2 · 셋째 1 + 2 + 3 · 넷째 1 + 2 + 3 + 4')}`,
    lab: growLab, ex:`<p>4개에서 시작해 3개씩 늘어나면 열째 → 4 + 3 × 9 = <b>31개</b></p>`, quiz:[['rl-shape', 3], ['rl-shape10', 4]] },
  { title:'수 배열표에서 규칙 찾기', std:['4수02-01'], key:'<b>오른쪽, 아래쪽, 대각선</b> 방향으로 수가 어떻게 변하는지 살펴봐요.',
    body:`<p>오른쪽으로 10씩, 아래쪽으로 1000씩 커지면 ↘ 방향으로는 1010씩 커져요.</p>`,
    lab: arrayLab, ex:`<p>2025, 2125, 2225, □ → 100씩 커지므로 □ = <b>2325</b></p>`, quiz:[['rl-table', 1], ['rl-table', 2]] },
  { title:'등호(=)의 의미 알기', std:['4수02-03'], key:'등호(=)는 "답은"이 아니라 <b>양쪽의 크기가 같다</b>는 뜻이에요.',
    body:`${E('47 = 40 + 7 &nbsp;&nbsp; 15 + 8 = 16 + 7 &nbsp;&nbsp; 30 - 9 = 31 - 10')}<p>한쪽에 1을 더 더하면 다른 쪽에서 1을 덜 더해야 크기가 같아요.</p>`,
    lab: balanceLab, ex:`<p>25 + 18 = 23 + □ → 25가 23으로 2 작아졌으니 □ = 18 + 2 = <b>20</b></p>`, quiz:[['eq-true', 2], ['eq-fill', 2], ['eq-fill', 3]] },
  { title:'덧셈식과 뺄셈식의 배열에서 규칙 찾기', std:['4수02-02'], key:'더해지는 수, 더하는 수가 <b>각각 어떻게 변하는지</b> 보면 계산 결과를 추측할 수 있어요.',
    body:`${E('100 + 201 = 301<br>200 + 202 = 402<br>300 + 203 = 503<br>400 + 204 = 604')}`,
    lab: exprLab(0), ex:`<p>위의 규칙으로 다섯째 식 → 500 + 205 = <b>705</b></p>`, quiz:[['cs-add', 2], ['cs-which', 4]] },
  { title:'곱셈식과 나눗셈식의 배열에서 규칙 찾기', std:['4수02-02'], key:'곱하는 수가 2배, 3배가 되면 곱도 <b>2배, 3배</b>가 돼요.',
    body:`${E('11 × 11 = 121<br>111 × 111 = 12321<br>1111 × 1111 = 1234321')}`,
    lab: exprLab(2), ex:`<p>11111 × 11111 = <b>123454321</b></p>`, quiz:[['cs-mul', 3], ['cs-mul', 4]] },
  { title:'실생활에서 규칙적인 계산식 만들기', std:['4수02-02'], key:'달력, 승강기 버튼, 자리 배치표에서도 <b>규칙적인 계산식</b>을 찾을 수 있어요.',
    body:`<p>달력에서 가운데 수를 중심으로 위아래 두 수의 합 = 왼쪽 오른쪽 두 수의 합 = 가운데 수 × 2</p>`,
    lab: calLab, ex:`<p>달력의 9, 15, 16, 17, 23 → 합 = 16 × 5 = <b>80</b></p>`, quiz:[['rl-board', 4], ['cs-which', 5]] }
]});

/* ═════════════ 6. 막대그래프 ═════════════ */
add({ key:'4-1-6', title:'막대그래프', intro:'조사한 자료를 막대그래프로 나타내고, 막대의 길이를 비교하여 해석해요.',
  prev:'[3-2] 그림그래프', lessons:[
  { title:'막대그래프', std:['4수04-01'], key:'조사한 자료를 <b>막대 모양</b>으로 나타낸 그래프 = 막대그래프',
    body:`<p>가로에는 조사한 항목, 세로에는 수량(또는 반대로)을 나타내요. 막대의 길이로 수량을 나타내요.</p>${G4.barG([8, 5, 12, 6], ['봄', '여름', '가을', '겨울'], 1, '명', '좋아하는 계절별 학생 수')}`,
    lab: barLab, ex:`<p>표는 정확한 수를, 막대그래프는 많고 적음을 <b>한눈에</b> 비교하기 좋아요.</p>`, quiz:[['bg-what', 1], ['bg-scale', 1], ['bg-read', 1]] },
  { title:'막대그래프를 통해 알아보기', std:['4수04-01'], key:'막대의 길이를 비교하면 <b>가장 많은 것, 가장 적은 것</b>, 몇 배인지를 알 수 있어요.',
    body:`<p>세로 눈금 한 칸의 크기를 먼저 확인한 다음 막대가 몇 칸인지 세어요.</p>`,
    lab: barLab, ex:`<p>눈금 한 칸이 2명일 때 8칸 → <b>16명</b></p>`, quiz:[['bg-read', 2], ['bg-most', 1], ['bg-diff', 2], ['bg-times', 3]] },
  { title:'막대그래프로 나타내는 방법', std:['4수04-01'], key:'① 가로·세로에 나타낼 것 정하기 ② 눈금 한 칸의 크기 정하기 ③ 막대 그리기 ④ <b>제목</b> 쓰기',
    body:`<div class="note">💡 가장 큰 수까지 나타낼 수 있도록 눈금의 수를 정해요. 막대를 가로로 그릴 수도 있어요.</div>`,
    lab: barLab, ex:`<p>눈금 한 칸이 5명이면 35명은 <b>7칸</b></p>`, quiz:[['bg-cells', 2], ['bg-total', 2]] },
  { title:'자료를 수집하여 막대그래프로 나타내기', std:['4수04-03'], key:'궁금한 것을 <b>조사 → 표 → 막대그래프 → 해석</b>하여 생활에 활용해요.',
    body:`<p>예: 우리 반이 좋아하는 계절을 조사해 막대그래프로 나타내고, 계절 체험 활동을 정해요.</p>`,
    lab: surveyBarLab, ex:`<p>합계를 알면 지워진 막대의 수량도 구할 수 있어요.</p>`, quiz:[['bg-missing', 4], ['bg-true', 3], ['bg-true', 4]] }
]});
})();
