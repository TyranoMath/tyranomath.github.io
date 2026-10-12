/* =========================================================
   🦖 개념 탐험대 — 5학년 2학기 (2022 개정 교육과정)
   단원마다 탐험(차시): title · key(핵심 한 줄) · body(설명) · lab(직접 해 보기) · ex(예시) · quiz(확인 문제)
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g5-2.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS;
const { fr, frH, F, svg, txt, line, dz, nf, josa, numberLine, cuboidFig, foldNet, CUBE_NETS, spinnerFig, barsFig, tableH, polyFig, divisors, range } = A;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const G = '#4CB963', GL = '#DFF3E3', OR = '#FFC56B', PK = '#FF9FA8', BL = '#8EC5F4';

/* ---------- 공통 그림 도구 ---------- */
// 분수 막대 (분자가 분모보다 크면 여러 줄)
const barSVG = (rows, W = 420) => {
  let s = '', y = 6;
  rows.forEach(r => { const wholes = Math.max(1, Math.ceil(r.n / r.d));
    for (let w = 0; w < wholes; w++){ const pw = W / r.d;
      for (let i = 0; i < r.d; i++){ const k = w * r.d + i, filled = k < r.n;
        const col = filled ? (r.colors ? r.colors[Math.floor(k / r.step) % r.colors.length] : r.color) : '#fff';
        s += `<rect x="${(70 + i * pw).toFixed(1)}" y="${y}" width="${pw.toFixed(1)}" height="28" fill="${col}" stroke="#22314A" stroke-width="1.6"/>`; }
      if (w === 0) s += txt(34, y + 14, r.label, { size: 15, bold: true });
      y += 33; }
    y += 7; });
  return svg(W + 80, y, s);
};
const roundTo = (x, p, m) => { const q = dz(x / p); const r = m === 'up' ? Math.ceil(q) : m === 'down' ? Math.floor(q) : Math.floor(q + 0.5); return dz(r * p); };
const MW = { up:'올림', down:'버림', half:'반올림' };
const RW = { ge:'이상', le:'이하', gt:'초과', lt:'미만' };
const inR = (x, t, n) => t === 'ge' ? x >= n : t === 'le' ? x <= n : t === 'gt' ? x > n : x < n;
const PLACE = { 1:'일의 자리', 10:'십의 자리', 100:'백의 자리', 1000:'천의 자리', 0.1:'소수 첫째 자리', 0.01:'소수 둘째 자리' };

/* ---------- 직접 해 보기 ---------- */
// 1) 수의 범위 (이상·이하·초과·미만)
const rangeLab = types => ({ title: `${types.map(t => RW[t]).join('과 ')}을 수직선에 나타내기`, init(el){
  el.innerHTML = `<div class="ctrl">${types.map((t, i) => `<button class="tbtn" type="button" data-t="${t}" aria-pressed="${i === 0}">${RW[t]}</button>`).join('')}</div>
    <div class="ctrl"><label>기준 수</label><input type="range" min="12" max="22" value="15" id="rn"><span class="v" id="rv"></span></div>
    <div class="figc" id="rf"></div><div class="board" id="rb"></div><div class="out" id="ro"></div>`;
  let t = types[0];
  const draw = () => { const n = +$in(el, '#rn').value, incl = t === 'ge' || t === 'le'; $in(el, '#rv').textContent = n;
    const rg = t === 'ge' ? [n, null, true] : t === 'gt' ? [n, null, false] : t === 'le' ? [null, n, false, true] : [null, n, false, false];
    $in(el, '#rf').innerHTML = numberLine(10, 25, 1, rg);
    $in(el, '#rb').innerHTML = range(10, 29).map(x => `<span class="${inR(x, t, n) ? 'a' : ''}">${x}</span>`).join('');
    $in(el, '#ro').innerHTML = `<b>${n} ${RW[t]}</b>인 수 → ${n}${incl ? '도 <b>들어가요</b> → 수직선에 ● (속이 찬 점)' : '은(는) <b>들어가지 않아요</b> → 수직선에 ○ (속이 빈 점)'}`; };
  el.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { t = b.dataset.t; press(el, '[data-t]', b); draw(); }));
  $in(el, '#rn').addEventListener('input', draw); draw();
} });
const range2Lab = { title: '두 조건으로 수의 범위 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시작</label><input type="range" min="10" max="20" value="12" id="ra"><span class="v" id="rav"></span>
      <button class="tbtn" type="button" data-lo="ge" aria-pressed="true">이상</button><button class="tbtn" type="button" data-lo="gt" aria-pressed="false">초과</button></div>
    <div class="ctrl"><label>끝</label><input type="range" min="13" max="25" value="17" id="rb2"><span class="v" id="rbv"></span>
      <button class="tbtn" type="button" data-hi="le" aria-pressed="false">이하</button><button class="tbtn" type="button" data-hi="lt" aria-pressed="true">미만</button></div>
    <div class="figc" id="rf"></div><div class="out" id="ro"></div>`;
  let lo = 'ge', hi = 'lt';
  const draw = () => { let a = +$in(el, '#ra').value, b = +$in(el, '#rb2').value; if (b <= a){ b = a + 1; $in(el, '#rb2').value = b; }
    $in(el, '#rav').textContent = a; $in(el, '#rbv').textContent = b;
    $in(el, '#rf').innerHTML = numberLine(10, 26, 1, [a, b, lo === 'ge', hi === 'le']);
    const xs = range(10, 26).filter(x => inR(x, lo, a) && inR(x, hi, b));
    $in(el, '#ro').innerHTML = `<b>${a} ${RW[lo]} ${b} ${RW[hi]}</b>인 자연수: ${xs.join(', ') || '없어요'} → <b>${xs.length}개</b>`; };
  el.querySelectorAll('[data-lo]').forEach(x => x.addEventListener('click', () => { lo = x.dataset.lo; press(el, '[data-lo]', x); draw(); }));
  el.querySelectorAll('[data-hi]').forEach(x => x.addEventListener('click', () => { hi = x.dataset.hi; press(el, '[data-hi]', x); draw(); }));
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 2) 올림·버림·반올림
const roundLab = methods => ({ title: methods.length > 1 ? '올림과 버림 비교하기' : '반올림해 보기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" data-m="int" aria-pressed="true">자연수</button><button class="tbtn" type="button" data-m="dec" aria-pressed="false">소수</button><button class="tbtn" type="button" id="rnew">🎲 다른 수</button></div>
    <div class="ctrl" id="rpl"></div><div class="step-expr" id="rx"></div><div class="figc" id="rf"></div><div id="rt"></div><div class="out" id="ro"></div>`;
  let mode = 'int', x = 0, p = 100;
  const places = () => mode === 'int' ? [10, 100, 1000] : [1, 0.1, 0.01];
  const fresh = () => { x = mode === 'int' ? A.ri(1000, 9999) : dz(A.ri(1001, 9999) / 1000); if (x % 10 === 0) x = dz(x + (mode === 'int' ? 3 : 0.003)); draw(); };
  const draw = () => {
    $in(el, '#rpl').innerHTML = places().map(q => `<button class="tbtn" type="button" data-p="${q}" aria-pressed="${q === p}">${PLACE[q]}까지</button>`).join('');
    el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { p = +b.dataset.p; draw(); }));
    const lo = roundTo(x, p, 'down'), hi = dz(lo + p), below = Math.floor(dz(x / (p / 10))) % 10;
    // 자리 숫자 강조
    const s = nf(x), pos = (() => { const dot = s.indexOf('.'), intLen = dot < 0 ? s.length : dot, k = Math.round(Math.log10(p)); return k >= 0 ? intLen - 1 - k : intLen - k; })();
    $in(el, '#rx').innerHTML = [...s].map((c, i) => i === pos ? `<span class="hl">${c}</span>` : i === pos + 1 + (s[pos + 1] === '.' ? 1 : 0) ? `<u style="text-decoration-color:#E5546B;text-decoration-thickness:3px">${c}</u>` : c).join('');
    const W = 480, X = v => 40 + (v - lo) / (hi - lo) * (W - 80);
    let g = line(30, 50, W - 30, 50) + line(X(lo), 42, X(lo), 58) + line(X(hi), 42, X(hi), 58) + line(X(dz(lo + p / 2)), 44, X(dz(lo + p / 2)), 56, { dash: '3 3', stroke: '#5D6C83' });
    g += txt(X(lo), 72, nf(lo), { size: 14, bold: true }) + txt(X(hi), 72, nf(hi), { size: 14, bold: true }) + txt(X(dz(lo + p / 2)), 72, nf(dz(lo + p / 2)), { size: 12, fill: '#5D6C83' });
    g += `<circle cx="${X(x).toFixed(1)}" cy="50" r="7" fill="#E5546B"/>` + txt(X(x), 26, nf(x), { size: 15, bold: true, fill: '#E5546B' });
    $in(el, '#rf').innerHTML = svg(W, 86, g);
    $in(el, '#rt').innerHTML = tableH([['방법', ...methods.map(m => MW[m])], [`${PLACE[p]}까지`, ...methods.map(m => `<b>${nf(roundTo(x, p, m))}</b>`)]]);
    $in(el, '#ro').innerHTML = methods.includes('half')
      ? `바로 아래 자리(밑줄) 숫자가 <b>${below}</b> → ${below >= 5 ? '5 이상이라 <b>올려요</b>' : '5 미만이라 <b>버려요</b>'}`
      : `${nf(x)}는 <b>${nf(lo)}</b>과 <b>${nf(hi)}</b> 사이 → 올림은 큰 쪽, 버림은 작은 쪽!`; };
  el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; press(el, '[data-m]', b); p = mode === 'int' ? 100 : 0.1; fresh(); }));
  $in(el, '#rnew').addEventListener('click', fresh); fresh();
} });
// 3) (분수) × (자연수)
const fracNatLab = { title: '같은 분수를 여러 번 더하기', init(el){
  const B = [[1, 3], [2, 5], [3, 4], [2, 3], [5, 6]];
  el.innerHTML = `<div class="ctrl">${B.map((f, i) => `<button class="tbtn" type="button" data-b="${i}" aria-pressed="${i === 1}">${fr(f[0], f[1])}</button>`).join('')}</div>
    <div class="ctrl"><label>곱하는 자연수</label><input type="range" min="1" max="5" value="3" id="fk"><span class="v" id="fkv"></span></div><div class="figc" id="ff"></div><div class="out" id="fo"></div>`;
  let bi = 1;
  const draw = () => { const [n, d] = B[bi], k = +$in(el, '#fk').value; $in(el, '#fkv').textContent = k;
    const rows = range(1, k).map(() => ({ n, d, label: `${n}/${d}`, color: G }));
    rows.push({ n: n * k, d, label: '곱', colors: [G, OR], step: n });
    $in(el, '#ff').innerHTML = barSVG(rows);
    const r = F(n * k, d);
    $in(el, '#fo').innerHTML = `${fr(n, d)} × ${k} = ${fr(`${n} × ${k}`, d)} = ${fr(n * k, d)}${r.d !== d || n * k >= d ? ` = ${frH(r)}` : ''} → 분모는 그대로, 분자만 ${k}배!`; };
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => { bi = +b.dataset.b; press(el, '[data-b]', b); draw(); }));
  $in(el, '#fk').addEventListener('input', draw); draw();
} };
// 4) (자연수) × (분수) : 묶음으로 나누기
const natFracLab = { title: '■의 ▲/●만큼 구하기', init(el){
  const NS = [12, 18, 20, 24];
  el.innerHTML = `<div class="ctrl"><label>전체</label>${NS.map((n, i) => `<button class="tbtn" type="button" data-n="${n}" aria-pressed="${i === 0}">${n}개</button>`).join('')}</div>
    <div class="ctrl" id="nd"></div><div class="ctrl"><label>색칠할 묶음</label><input type="range" min="1" max="4" value="3" id="nk"><span class="v" id="nkv"></span></div>
    <div class="figc" id="nf"></div><div class="out" id="no"></div>`;
  let N = 12, d = 4;
  const draw = () => {
    const ds = divisors(N).filter(x => x > 1 && x < N && x <= 8); if (!ds.includes(d)) d = ds.includes(4) ? 4 : ds[0];
    $in(el, '#nd').innerHTML = '<label>몇 묶음으로?</label>' + ds.map(x => `<button class="tbtn" type="button" data-d="${x}" aria-pressed="${x === d}">${x}묶음</button>`).join('');
    el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { d = +b.dataset.d; draw(); }));
    const kIn = $in(el, '#nk'); kIn.max = d; if (+kIn.value > d) kIn.value = d; const k = +kIn.value; $in(el, '#nkv').textContent = k;
    const per = N / d, sz = 26; let g = '';
    for (let r = 0; r < d; r++){
      g += `<rect x="6" y="${6 + r * (sz + 8)}" width="${per * sz + 8}" height="${sz + 2}" rx="10" fill="${r < k ? '#FFF2DC' : '#fff'}" stroke="${r < k ? '#FF9F43' : '#ECDFC8'}" stroke-width="2"/>`;
      for (let c = 0; c < per; c++) g += `<circle cx="${10 + c * sz + sz / 2}" cy="${7 + r * (sz + 8) + sz / 2}" r="${sz * 0.36}" fill="${r < k ? '#FF9F43' : '#CFE9A9'}"/>`;
    }
    $in(el, '#nf').innerHTML = svg(per * sz + 22, d * (sz + 8) + 8, g);
    $in(el, '#no').innerHTML = `${N}의 ${fr(k, d)} → ${d}묶음 중 ${k}묶음 → 한 묶음 ${per}개 × ${k} = <b>${per * k}개</b><br>${N} × ${fr(k, d)} = ${fr(`${N} × ${k}`, d)} = <b>${per * k}</b>`; };
  el.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { N = +b.dataset.n; press(el, '[data-n]', b); draw(); }));
  $in(el, '#nk').addEventListener('input', draw); draw();
} };
// 5) 넓이 모델: (분수) × (분수), (소수) × (소수)
const areaLab = mode => ({ title: mode === 'frac' ? '넓이 모델로 분수끼리 곱하기' : '모눈 100칸으로 소수끼리 곱하기', init(el){
  const PF = [[[2, 3], [3, 5]], [[1, 2], [3, 4]], [[3, 4], [2, 3]], [[2, 5], [5, 6]], [[4, 5], [1, 3]]];
  el.innerHTML = mode === 'frac'
    ? `<div class="ctrl">${PF.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 0}">${fr(...p[0])} × ${fr(...p[1])}</button>`).join('')}</div><div class="figc" id="af"></div><div class="out" id="ao"></div>`
    : `<div class="ctrl"><label>가로</label><input type="range" min="1" max="9" value="3" id="aa"><span class="v" id="aav"></span><label>세로</label><input type="range" min="1" max="9" value="7" id="ab"><span class="v" id="abv"></span></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  let pi = 0;
  const grid = (cols, a, rows, c) => { const S = 240, cw = S / cols, rh = S / rows; let g = '';
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++){ const inA = j < a, inC = i < c;
      g += `<rect x="${(30 + j * cw).toFixed(1)}" y="${(10 + i * rh).toFixed(1)}" width="${cw.toFixed(1)}" height="${rh.toFixed(1)}" fill="${inA && inC ? '#7BCB8A' : inA ? '#CFE6FA' : inC ? '#FFE2B8' : '#fff'}" stroke="#9AA6B8" stroke-width="${cols > 6 ? 0.8 : 1.4}"/>`; }
    g += `<rect x="30" y="10" width="${S}" height="${S}" fill="none" stroke="#22314A" stroke-width="2.4"/>`;
    g += txt(30 + a * cw / 2, S + 26, mode === 'frac' ? `${a}/${cols}` : `0.${a}`, { size: 15, bold: true, fill: '#2a6fae' }) + txt(14, 10 + c * rh / 2, mode === 'frac' ? `${c}/${rows}` : `0.${c}`, { size: 15, bold: true, fill: '#C2410C' });
    return svg(S + 50, S + 44, g); };
  const draw = () => {
    if (mode === 'frac'){ const [[a, b], [c, d]] = PF[pi], r = F(a * c, b * d);
      $in(el, '#af').innerHTML = grid(b, a, d, c);
      $in(el, '#ao').innerHTML = `전체 ${b} × ${d} = ${b * d}칸 중 초록 ${a} × ${c} = ${a * c}칸 → ${fr(a, b)} × ${fr(c, d)} = ${fr(`${a} × ${c}`, `${b} × ${d}`)} = ${fr(a * c, b * d)}${r.d !== b * d ? ` = <b>${frH(r)}</b>` : ''}`; }
    else { const a = +$in(el, '#aa').value, c = +$in(el, '#ab').value; $in(el, '#aav').textContent = `0.${a}`; $in(el, '#abv').textContent = `0.${c}`;
      $in(el, '#af').innerHTML = grid(10, a, 10, c);
      $in(el, '#ao').innerHTML = `0.${a} × 0.${c} → 100칸 중 초록 ${a} × ${c} = ${a * c}칸 → 0.01이 ${a * c}개 = <b>${nf(dz(a * c / 100))}</b>`; } };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; press(el, '[data-p]', b); draw(); }));
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
// 6) 합동: 포개어 보기
const congLab = { title: '돌리고 옮겨서 포개어 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>옮기기</label><input type="range" min="0" max="100" value="0" id="ct"></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  const T = [[0, 0], [150, 0], [40, -100]], O = [50, 190], C = [(0 + 150 + 40) / 3, -100 / 3], SC = ['#E5546B', '#2F7FC1', '#2F8A47'];
  const draw = () => { const t = +$in(el, '#ct').value / 100, ang = Math.PI * (1 - t), off = [270 * (1 - t), 0];
    const base = T.map(p => [O[0] + p[0], O[1] + p[1]]);
    const cp = T.map(p => { const x = p[0] - C[0], y = p[1] - C[1]; return [O[0] + C[0] + x * Math.cos(ang) - y * Math.sin(ang) + off[0], O[1] + C[1] + x * Math.sin(ang) + y * Math.cos(ang) + off[1]]; });
    const tri = (P, fill, op) => `<polygon points="${P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" opacity="${op}"/>` + P.map((p, i) => line(p[0], p[1], P[(i + 1) % 3][0], P[(i + 1) % 3][1], { stroke: SC[i], w: 3.4 })).join('');
    const lab = (P, names, out) => { const cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
      return P.map((p, i) => { const dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy); return txt(p[0] + dx / L * out, p[1] + dy / L * out, names[i], { size: 15, bold: true }); }).join(''); };
    $in(el, '#cf').innerHTML = svg(520, 250, tri(base, '#DFF3E3', 1) + tri(cp, '#FFD7A8', 0.7) + lab(base, ['ㄱ', 'ㄴ', 'ㄷ'], 16) + lab(cp, ['ㄹ', 'ㅁ', 'ㅂ'], t > 0.95 ? -18 : 16));
    $in(el, '#co').innerHTML = t < 1 ? '슬라이더를 끝까지 밀어 주황 삼각형을 돌려서 초록 삼각형에 포개어 보세요.'
      : '완전히 겹쳐요 → 두 삼각형은 <b>합동</b>! 대응점 ㄱ↔ㄹ, ㄴ↔ㅁ, ㄷ↔ㅂ / 같은 색 변끼리 <b>대응변</b>이에요.'; };
  $in(el, '#ct').addEventListener('input', draw); draw();
} };
// 7) 선대칭·점대칭
const reg = (n, r = 85) => range(0, n - 1).map(k => { const a = -Math.PI / 2 + k * 2 * Math.PI / n; return [r * Math.cos(a), r * Math.sin(a)]; });
const SHAPES = [
  { name:'정삼각형', pts: reg(3) }, { name:'이등변삼각형', pts: [[0, -75], [55, 65], [-55, 65]] }, { name:'정사각형', pts: reg(4, 85).map(p => [p[0] * .74 - p[1] * .74, p[0] * .74 + p[1] * .74]) },
  { name:'직사각형', pts: [[-90, -50], [90, -50], [90, 50], [-90, 50]] }, { name:'마름모', pts: [[0, -70], [95, 0], [0, 70], [-95, 0]] },
  { name:'평행사변형', pts: [[-55, -50], [95, -50], [55, 50], [-95, 50]] }, { name:'정오각형', pts: reg(5) }, { name:'정육각형', pts: reg(6) },
  { name:'S 모양', pts: [[1, 0], [3, 0], [3, 1], [2, 1], [2, 2], [0, 2], [0, 1], [1, 1]].map(p => [(p[0] - 1.5) * 50, (p[1] - 1) * 50]) }
].map(s => { const n = s.pts.length, cx = s.pts.reduce((a, p) => a + p[0], 0) / n, cy = s.pts.reduce((a, p) => a + p[1], 0) / n; s.pts = s.pts.map(p => [p[0] - cx, p[1] - cy]);
  const has = Q => Q.every(q => s.pts.some(p => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.6));
  s.axes = []; for (let d = 0; d < 180; d += 0.5){ const t = d * Math.PI / 180, c = Math.cos(2 * t), si = Math.sin(2 * t);
    if (has(s.pts.map(p => [p[0] * c + p[1] * si, p[0] * si - p[1] * c]))) s.axes.push(d); }
  s.point = has(s.pts.map(p => [-p[0], -p[1]])); return s; });
const symLab = point => ({ title: point ? '180° 돌려서 겹치는지 알아보기' : '대칭축 찾기', init(el){
  el.innerHTML = `<div class="ctrl">${SHAPES.map((s, i) => `<button class="tbtn" type="button" data-s="${i}" aria-pressed="${i === (point ? 5 : 0)}">${s.name}</button>`).join('')}</div>
    <div class="ctrl">${point ? '<label>돌리기</label><input type="range" min="0" max="180" value="0" step="5" id="sr"><span class="v" id="srv"></span>' : '<button class="tbtn" type="button" id="sa" aria-pressed="false">대칭축 보기 ✂️</button>'}</div>
    <div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  let si = point ? 5 : 0, show = false;
  const draw = () => { const s = SHAPES[si], cx = 140, cy = 115, P = s.pts.map(p => `${(cx + p[0]).toFixed(1)},${(cy + p[1]).toFixed(1)}`).join(' ');
    let g = '';
    if (point){ const a = +$in(el, '#sr').value; $in(el, '#srv').textContent = a + '°';
      g += `<polygon points="${P}" fill="#DFF3E3" stroke="#22314A" stroke-width="2" stroke-dasharray="6 5"/>`;
      g += `<g transform="rotate(${a} ${cx} ${cy})"><polygon points="${P}" fill="#FFD7A8" fill-opacity=".75" stroke="#C2410C" stroke-width="2.4"/><circle cx="${cx + s.pts[0][0]}" cy="${cy + s.pts[0][1]}" r="6" fill="#E5546B"/></g>`;
      g += `<circle cx="${cx}" cy="${cy}" r="5" fill="#22314A"/>`;
      $in(el, '#so').innerHTML = a < 180 ? '대칭의 중심(검은 점)을 중심으로 180°까지 돌려 보세요. 빨간 점이 어디로 가는지도 살펴봐요!'
        : s.point ? `처음 도형과 <b>완전히 겹쳐요</b> → ${s.name}은(는) <b>점대칭도형</b>이에요.` : `처음 도형과 겹치지 않아요 → ${s.name}은(는) 점대칭도형이 <b>아니에요</b>.`; }
    else { g += `<polygon points="${P}" fill="#DFF3E3" stroke="#22314A" stroke-width="2.4"/>`;
      if (show) s.axes.forEach(d => { const t = d * Math.PI / 180, L = 120; g += line(cx - L * Math.cos(t), cy - L * Math.sin(t), cx + L * Math.cos(t), cy + L * Math.sin(t), { stroke: '#E5546B', w: 2.4, dash: '7 5' }); });
      $in(el, '#so').innerHTML = !show ? '어느 직선을 따라 접으면 완전히 겹칠까요? 생각한 다음 "대칭축 보기"를 눌러요.'
        : s.axes.length ? `${s.name}의 대칭축: <b>${s.axes.length}개</b> → 선대칭도형이에요.` : `${s.name}은(는) 대칭축이 없어요 → 선대칭도형이 <b>아니에요</b>.`;
      $in(el, '#sa').setAttribute('aria-pressed', show); }
    $in(el, '#sf').innerHTML = svg(280, 230, g); };
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { si = +b.dataset.s; press(el, '[data-s]', b); if (point) $in(el, '#sr').value = 0; draw(); }));
  if (point) $in(el, '#sr').addEventListener('input', draw); else $in(el, '#sa').addEventListener('click', () => { show = !show; draw(); });
  draw();
} });
// 8) (소수) × (자연수) : 0.1 막대
const decNatLab = { title: '0.1이 몇 개인지 세어 곱하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>소수</label><input type="range" min="1" max="9" value="4" id="da"><span class="v" id="dav"></span><label>× 자연수</label><input type="range" min="1" max="9" value="3" id="dk"><span class="v" id="dkv"></span></div>
    <div class="figc" id="df"></div><div class="out" id="do"></div>`;
  const draw = () => { const a = +$in(el, '#da').value, k = +$in(el, '#dk').value, tot = a * k, rows = Math.ceil(tot / 10), sz = 30; $in(el, '#dav').textContent = `0.${a}`; $in(el, '#dkv').textContent = k;
    let g = '';
    for (let r = 0; r < Math.max(rows, 1); r++){ for (let c = 0; c < 10; c++){ const i = r * 10 + c;
      g += `<rect x="${60 + c * sz}" y="${6 + r * (sz + 6)}" width="${sz}" height="${sz}" fill="${i < tot ? (Math.floor(i / a) % 2 ? OR : G) : '#fff'}" stroke="#22314A" stroke-width="1.4"/>`; }
      g += txt(28, 6 + r * (sz + 6) + sz / 2, r < Math.floor(tot / 10) ? '1' : '', { size: 15, bold: true, fill: '#2a6fae' }); }
    $in(el, '#df').innerHTML = svg(370, Math.max(rows, 1) * (sz + 6) + 8, g);
    $in(el, '#do').innerHTML = `0.${a} × ${k} → 0.1이 ${a} × ${k} = <b>${tot}개</b> → <b>${nf(dz(tot / 10))}</b> (한 줄을 다 채우면 1)`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 9) 소수점 옮기기
const powLab = { title: '10, 100, 1000 또는 0.1, 0.01, 0.001 곱하기', init(el){
  const XS = [3.47, 0.258, 12.6, 508], MS = [1000, 100, 10, 0.1, 0.01, 0.001], COLS = ['십만', '만', '천', '백', '십', '일', '소수 첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];
  el.innerHTML = `<div class="ctrl">${XS.map((x, i) => `<button class="tbtn" type="button" data-x="${i}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div>
    <div class="ctrl">${MS.map((m, i) => `<button class="tbtn" type="button" data-m="${i}" aria-pressed="${i === 1}">× ${m}</button>`).join('')}</div><div id="pt" style="overflow-x:auto"></div><div class="out" id="po"></div>`;
  let xi = 0, mi = 1;
  const cells = v => { const s = dz(v).toFixed(6), [ip, dp] = s.split('.'), I = ip.padStart(6, ' ').split('').map(c => c === ' ' ? '' : c), last = dp.replace(/0+$/, '').length;
    return [...I.map((c, i) => i === 5 && c === '' ? '0' : c), ...dp.split('').map((c, i) => i < last ? c : '')]; };
  const draw = () => { const x = XS[xi], m = MS[mi], y = dz(x * m), k = Math.round(Math.log10(m));
    const row = (lab, v) => `<tr><th>${lab}</th>${cells(v).map((c, i) => `<td style="${i === 5 ? 'border-right:4px solid #E5546B;' : ''}font-family:Fredoka,sans-serif;font-weight:700">${c}</td>`).join('')}</tr>`;
    $in(el, '#pt').innerHTML = `<table class="qt"><tr><th></th>${COLS.map(c => `<th style="font-size:12px">${c}</th>`).join('')}</tr>${row('처음 수', x)}${row(`× ${m}`, y)}</table>`;
    $in(el, '#po').innerHTML = `${nf(x)} × ${m} = <b>${nf(y)}</b> → 소수점이 <b>${k > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(k)}칸</b> 옮겨졌어요 (빨간 선 = 일의 자리 뒤 소수점)`; };
  el.querySelectorAll('[data-x]').forEach(b => b.addEventListener('click', () => { xi = +b.dataset.x; press(el, '[data-x]', b); draw(); }));
  el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { mi = +b.dataset.m; press(el, '[data-m]', b); draw(); }));
  draw();
} };
// 10) 직육면체 만들기
const cuboidLab = { title: '가로, 세로, 높이를 바꾸며 직육면체 살펴보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="1" max="6" value="5" id="ca"><span class="v" id="cav"></span><label>세로</label><input type="range" min="1" max="6" value="3" id="cb"><span class="v" id="cbv"></span><label>높이</label><input type="range" min="1" max="6" value="3" id="cc"><span class="v" id="ccv"></span></div>
    <div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  const draw = () => { const a = +$in(el, '#ca').value, b = +$in(el, '#cb').value, c = +$in(el, '#cc').value; $in(el, '#cav').textContent = a; $in(el, '#cbv').textContent = b; $in(el, '#ccv').textContent = c;
    $in(el, '#cf').innerHTML = cuboidFig(a, b, c, { dims: [`${a} cm`, `${b} cm`, `${c} cm`], names: false });
    const cube = a === b && b === c;
    $in(el, '#co').innerHTML = `${cube ? '🎲 세 길이가 모두 같아요 → <b>정육면체</b>! (정사각형 6개)' : '📦 <b>직육면체</b> (직사각형 6개)'}<br>면 <b>6</b>개 · 모서리 <b>12</b>개 · 꼭짓점 <b>8</b>개 &nbsp;|&nbsp; 모서리 길이의 합 (${a} + ${b} + ${c}) × 4 = <b>${(a + b + c) * 4} cm</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 11) 평행한 면, 수직인 면
const FACES = { 'ㄱㄴㄷㄹ':'ㅁㅂㅅㅇ', 'ㅁㅂㅅㅇ':'ㄱㄴㄷㄹ', 'ㄱㄴㅂㅁ':'ㄹㄷㅅㅇ', 'ㄹㄷㅅㅇ':'ㄱㄴㅂㅁ', 'ㄱㄹㅇㅁ':'ㄴㄷㅅㅂ', 'ㄴㄷㅅㅂ':'ㄱㄹㅇㅁ' };
const faceLab = { title: '한 면과 평행한 면, 수직인 면 찾기', init(el){
  const fs = Object.keys(FACES);
  el.innerHTML = `<div class="ctrl">${fs.map((f, i) => `<button class="tbtn" type="button" data-f="${f}" aria-pressed="${i === 2}">면 ${f}</button>`).join('')}</div>
    <div class="figc" id="ff" style="gap:10px;flex-wrap:wrap"></div><div class="out" id="fo"></div>`;
  let f = fs[2];
  const draw = () => { const o = FACES[f], per = fs.filter(x => x !== f && x !== o);
    $in(el, '#ff').innerHTML = `<div style="text-align:center">${cuboidFig(5, 3, 3, { shade: [...f] })}<div>고른 면</div></div><div style="text-align:center">${cuboidFig(5, 3, 3, { shade: [...o] })}<div>평행한 면</div></div>`;
    $in(el, '#fo').innerHTML = `면 ${f}과(와) <b>평행한 면</b>: 면 ${o} (마주 보는 면, 1개)<br>면 ${f}과(와) <b>수직인 면</b>: ${per.map(x => '면 ' + x).join(', ')} (만나는 면, 4개)`; };
  el.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { f = b.dataset.f; press(el, '[data-f]', b); draw(); })); draw();
} };
// 12) 정육면체 전개도
const netLab = { title: '전개도에서 마주 보는 면 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>전개도</label>${CUBE_NETS.map((_, i) => `<button class="tbtn" type="button" data-n="${i}" aria-pressed="${i === 0}" style="min-width:46px">${i + 1}</button>`).join('')}</div>
    <div class="figc" id="nf"></div><div class="legend"><span><i style="background:#FFE29A"></i>고른 면</span><span><i style="background:#FFB3C0"></i>평행한 면</span><span><i style="background:#CFE6FA"></i>수직인 면</span></div><div class="out" id="no"></div>`;
  let ni = 0, sel = 1; const NM = '가나다라마바'.split('');
  const draw = () => { const cells = CUBE_NETS[ni], fo = foldNet(cells), op = fo.opposite(sel), S = 52;
    const mx = Math.max(...cells.map(c => c[0])), my = Math.max(...cells.map(c => c[1]));
    const g = cells.map((c, i) => `<g data-c="${i}" style="cursor:pointer"><rect x="${10 + c[0] * S}" y="${10 + c[1] * S}" width="${S}" height="${S}" fill="${i === sel ? '#FFE29A' : i === op ? '#FFB3C0' : '#CFE6FA'}" stroke="#22314A" stroke-width="2"/>${txt(10 + c[0] * S + S / 2, 10 + c[1] * S + S / 2, NM[i], { size: 19, bold: true })}</g>`).join('');
    $in(el, '#nf').innerHTML = svg(20 + (mx + 1) * S, 20 + (my + 1) * S, g);
    el.querySelectorAll('[data-c]').forEach(r => r.addEventListener('click', () => { sel = +r.dataset.c; draw(); }));
    $in(el, '#no').innerHTML = `면을 눌러 보세요! 면 <b>${NM[sel]}</b>과(와) 평행한 면은 <b>면 ${NM[op]}</b>, 나머지 4개 면(${cells.map((_, i) => i).filter(i => i !== sel && i !== op).map(i => NM[i]).join(', ')})은 수직이에요.`; };
  el.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { ni = +b.dataset.n; sel = 1; press(el, '[data-n]', b); draw(); })); draw();
} };
// 13) 평균 — 고르게 하기
const meanLab = { title: '막대를 고르게 하여 평균 알아보기', init(el){
  const NMS = ['월', '화', '수', '목', '금'];
  el.innerHTML = `<div class="ctrl" style="gap:6px 14px">${NMS.map((n, i) => `<label>${n}</label><input type="range" min="0" max="10" value="${[4, 7, 3, 8, 3][i]}" data-i="${i}" style="width:min(110px,22vw)"><span class="v" id="mv${i}"></span>`).join('')}</div>
    <div class="ctrl"><button class="tbtn" type="button" id="mf" aria-pressed="false">고르게 하기 ⚖️</button></div><div class="figc" id="mfig"></div><div class="out" id="mo"></div>`;
  let flat = false;
  const draw = () => { const v = [...el.querySelectorAll('[data-i]')].map(i => +i.value); v.forEach((x, i) => { $in(el, '#mv' + i).textContent = x; });
    const s = v.reduce((a, b) => a + b, 0), m = dz(s / v.length);
    $in(el, '#mfig').innerHTML = barsFig(flat ? v.map(() => m) : v, NMS, '권', m);
    $in(el, '#mo').innerHTML = `읽은 책: 합 ${v.join(' + ')} = <b>${s}권</b> → 평균 ${s} ÷ ${v.length} = <b>${nf(m)}권</b>${flat ? '<br>많은 날에서 적은 날로 옮겨 고르게 하면 모두 평균만큼이 돼요!' : ''}`;
    $in(el, '#mf').setAttribute('aria-pressed', flat); };
  el.querySelectorAll('[data-i]').forEach(i => i.addEventListener('input', () => { flat = false; draw(); }));
  $in(el, '#mf').addEventListener('click', () => { flat = !flat; draw(); }); draw();
} };
// 14) 가능성 — 회전판
const WORDS = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'];
const chanceLab = sim => ({ title: sim ? '회전판을 여러 번 돌려 보기' : '회전판의 색을 바꾸며 가능성 말하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>빨간 칸 (8칸 중)</label><input type="range" min="0" max="8" value="${sim ? 4 : 2}" id="cr"><span class="v" id="crv"></span></div>
    <div class="figc" id="cf"></div><div class="legend" id="cw"></div>
    ${sim ? '<div class="ctrl"><button class="tbtn" type="button" data-s="10">10번 돌리기</button><button class="tbtn" type="button" data-s="100">100번</button><button class="tbtn" type="button" data-s="1000">1000번</button></div><div id="cs"></div>' : ''}<div class="out" id="co"></div>`;
  const draw = () => { const r = +$in(el, '#cr').value; $in(el, '#crv').textContent = r;
    const parts = range(0, 7).map(i => ({ w: 1, color: i < r ? '#FF8FA3' : '#FFE29A' }));
    $in(el, '#cf').innerHTML = spinnerFig(parts, 80);
    const wi = r === 0 ? 0 : r < 4 ? 1 : r === 4 ? 2 : r < 8 ? 3 : 4;
    $in(el, '#cw').innerHTML = WORDS.map((w, i) => `<span style="padding:2px 8px;border-radius:999px;${i === wi ? 'background:#4CB963;color:#fff;font-weight:700' : 'background:#fff;border:1px solid #ECDFC8'}">${w}</span>`).join('');
    const num = r === 0 ? '<b>0</b>' : r === 4 ? `<b>${fr(1, 2)}</b>` : r === 8 ? '<b>1</b>' : r < 4 ? `0과 ${fr(1, 2)} 사이` : `${fr(1, 2)}과 1 사이`;
    $in(el, '#co').innerHTML = `화살이 빨간색에 멈출 가능성: <b>${['불가능하다', '빨간색이 아닐 것 같다', '반반이다', '빨간색일 것 같다', '확실하다'][wi]}</b> → 수로 나타내면 ${num}`;
    if (sim) $in(el, '#cs').innerHTML = ''; };
  if (sim) el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { const n = +b.dataset.s, r = +$in(el, '#cr').value; let red = 0;
    for (let i = 0; i < n; i++) if (Math.floor(Math.random() * 8) < r) red++;
    $in(el, '#cs').innerHTML = `<div class="out">${n}번 중 빨간색 <b>${red}번</b> (${Math.round(red / n * 1000) / 10}%) — 노란색 ${n - red}번 · 예상: 8칸 중 ${r}칸 → ${Math.round(r / 8 * 1000) / 10}%</div>`; }));
  $in(el, '#cr').addEventListener('input', draw); draw();
} });

/* ═════════════ 1. 수의 범위와 어림하기 ═════════════ */
add({ key:'5-2-1', title:'수의 범위와 어림하기', intro:'이상, 이하, 초과, 미만으로 수의 범위를 나타내고, 올림·버림·반올림으로 어림값을 구해 생활 속 문제를 해결해요.',
  prev:'[4-1] 큰 수 · [4-2] 소수의 덧셈과 뺄셈', lessons:[
  { title:'이상과 이하', std:['6수01-02'], key:'<b>■ 이상</b>은 ■와 같거나 큰 수, <b>■ 이하</b>는 ■와 같거나 작은 수예요. 두 말 모두 <b>■를 포함</b>해요.',
    body:`<p>놀이기구는 키가 <b>130 cm 이상</b>인 사람만 탈 수 있어요. 키가 130 cm인 사람도 탈 수 있을까요? → 네! 130도 포함돼요.</p>
      <div class="figc">${numberLine(126, 136, 1, [130, null, true])}</div><p>수직선에서 <b>●(속이 찬 점)</b>은 그 수를 포함한다는 뜻이에요.</p>`,
    lab: rangeLab(['ge', 'le']), ex:`<p>15, 17.5, 20, 21, 24 중 <b>20 이하</b>인 수 → 15, 17.5, <b>20</b> (20도 포함!)</p>`, quiz:[['rg-count', 1], ['rg-line', 1]] },
  { title:'초과와 미만', std:['6수01-02'], key:'<b>■ 초과</b>는 ■보다 큰 수, <b>■ 미만</b>은 ■보다 작은 수예요. 두 말 모두 <b>■를 포함하지 않아요</b>.',
    body:`<p>짐 무게가 <b>15 kg 초과</b>면 추가 요금을 내요. 짐이 15 kg이면? → 15는 포함되지 않으니 추가 요금이 없어요.</p>
      <div class="figc">${numberLine(10, 20, 1, [15, null, false])}</div><p>수직선에서 <b>○(속이 빈 점)</b>은 그 수를 포함하지 않는다는 뜻이에요.</p>
      <div class="note">💡 "이상·이하"는 ●, "초과·미만"은 ○ 로 기억해요.</div>`,
    lab: rangeLab(['gt', 'lt']), ex:`<p>30 미만인 자연수 중 가장 큰 수 → <b>29</b> (30은 들어가지 않아요)</p>`, quiz:[['rg-count', 1], ['rg-line', 2]] },
  { title:'수의 범위를 활용하기', std:['6수01-02'], key:'두 말을 함께 쓰면 수의 범위를 나타낼 수 있어요. 예) <b>10 이상 15 미만</b>인 자연수 = 10, 11, 12, 13, 14',
    body:`<p>태권도 체급 (초등학교 남학생)</p>${tableH([['체급', '핀급', '플라이급', '밴텀급'], ['몸무게(kg)', '32 이하', '32 초과 34 이하', '34 초과 36 이하']])}
      <p>몸무게가 34 kg인 학생은 → 32 초과 34 이하인 <b>플라이급</b>이에요.</p><div class="figc">${numberLine(30, 38, 1, [32, 34, false, true])}</div>`,
    lab: range2Lab, ex:`<p>25 초과 30 이하인 자연수 → 26, 27, 28, 29, 30 → <b>5개</b></p>`, quiz:[['rg-nat', 2], ['rg-include', 2], ['rg-life', 2], ['rg-fee', 4]] },
  { title:'올림과 버림', std:['6수01-03'], key:'<b>올림</b>은 구하려는 자리 아래 수를 올려서, <b>버림</b>은 구하려는 자리 아래 수를 버려서 나타내는 방법이에요.',
    body:`${E('2341 → 백의 자리까지 올림: 2400 　 버림: 2300')}<p>올림은 아래 자리에 0이 아닌 숫자가 있으면 구하려는 자리 숫자를 1 크게 하고, 버림은 아래 자리를 모두 0으로 만들어요.</p>
      <div class="note">💡 아래 자리가 모두 0이면 올림해도 버림해도 그대로예요. 2300 → 백의 자리까지 올림: 2300</div>
      <p>소수도 똑같아요: 3.274를 소수 첫째 자리까지 올림 → <b>3.3</b>, 버림 → <b>3.2</b></p>`,
    lab: roundLab(['up', 'down']), ex:`<p>5072를 천의 자리까지 → 올림 <b>6000</b>, 버림 <b>5000</b></p>`, quiz:[['rd-int', 1], ['rd-int', 2]] },
  { title:'반올림', std:['6수01-03'], key:'구하려는 자리 <b>바로 아래 자리 숫자가 0, 1, 2, 3, 4이면 버리고, 5, 6, 7, 8, 9이면 올려요</b>.',
    body:`${E('2361 → 십의 자리까지 반올림: 2360 (일의 자리 1 → 버림)')}${E('2361 → 백의 자리까지 반올림: 2400 (십의 자리 6 → 올림)')}
      <div class="warn">⚠️ 바로 아래 자리 숫자 하나만 봐요! 2349를 백의 자리까지 반올림하면 십의 자리 4를 보고 → 2300</div>
      <p>소수: 4.68을 소수 첫째 자리까지 반올림 → 소수 둘째 자리 8 → <b>4.7</b></p>`,
    lab: roundLab(['half']), ex:`<p>키 142.7 cm를 일의 자리까지 반올림 → 소수 첫째 자리 7 → <b>143 cm</b></p>`, quiz:[['rd-int', 2], ['rd-dec', 2], ['rd-which', 3]] },
  { title:'생활 속 어림하기', std:['6수01-03'], key:'모자라면 안 될 때는 <b>올림</b>, 다 채운 것만 셀 때는 <b>버림</b>, 가까운 값이 필요할 때는 <b>반올림</b>을 써요.',
    body:`<ul><li>🚌 학생 143명이 40인승 버스를 타면? 143 ÷ 40 = 3 … 23 → 남은 23명도 타야 하니 <b>올림</b> → 4대</li>
      <li>🍬 사탕 368개를 100개씩 봉지에 담으면? 100개가 안 되는 68개는 봉지가 안 되니 <b>버림</b> → 3봉지</li>
      <li>📏 연필의 길이 14.6 cm를 1 cm 단위로 나타내면? 가까운 쪽으로 <b>반올림</b> → 15 cm</li></ul>
      <div class="note">💡 10원짜리 동전 없이 1000원짜리 지폐로만 2780원을 내려면? → 1000원 단위로 <b>올림</b>하여 3000원</div>`,
    ex:`<p>귤 1257개를 한 상자에 10개씩 담아 팔아요. 팔 수 있는 상자는? → 10개 단위로 <b>버림</b> → 1250개 → <b>125상자</b></p>`, quiz:[['rd-life', 3], ['rd-method', 3], ['rd-extreme', 4]] }
]});

/* ═════════════ 2. 분수의 곱셈 ═════════════ */
add({ key:'5-2-2', title:'분수의 곱셈', intro:'(분수) × (자연수), (자연수) × (분수), (분수) × (분수)의 계산 원리를 그림으로 탐구하고, 생활 속 문제를 분수의 곱셈으로 해결해요.',
  prev:'[4-2] 분수의 덧셈과 뺄셈 · 5-1 약분과 통분 · 분수의 덧셈과 뺄셈', lessons:[
  { title:'(진분수) × (자연수)', std:['6수01-09'], key:`(분수) × (자연수)는 <b>분모는 그대로, 분자와 자연수를 곱해요</b>. 약분할 수 있으면 먼저 약분해도 돼요.`,
    body:`${E(`${fr(2, 5)} × 3 = ${fr(2, 5)} + ${fr(2, 5)} + ${fr(2, 5)} = ${fr('2 × 3', 5)} = ${fr(6, 5)} = ${fr(1, 5, 1)}`)}
      <p>곱셈은 같은 수를 여러 번 더한 것이에요. ${fr(1, 5)}이 2 × 3 = 6개!</p>
      <div class="note">💡 약분 먼저: ${fr(5, 6)} × 4 → 6과 4를 2로 약분 → ${fr('5 × 2', 3)} = ${fr(10, 3)} = ${fr(1, 3, 3)}</div>`,
    lab: fracNatLab, ex:`<p>${fr(3, 8)} × 6 = ${fr('3 × 6', 8)} = ${fr(18, 8)} = <b>${fr(1, 4, 2)}</b></p>`, quiz:[['pn', 1]] },
  { title:'(대분수) × (자연수)', std:['6수01-09'], key:'대분수는 <b>가분수로 바꾸어</b> 곱하거나, <b>자연수 부분과 분수 부분에 각각 곱해서</b> 더해요.',
    body:`<p>${fr(2, 3, 1)} × 4</p><ul><li>방법 ①: ${fr(5, 3)} × 4 = ${fr(20, 3)} = <b>${fr(2, 3, 6)}</b></li><li>방법 ②: (1 × 4) + (${fr(2, 3)} × 4) = 4 + ${fr(8, 3)} = 4 + ${fr(2, 3, 2)} = <b>${fr(2, 3, 6)}</b></li></ul>
      <div class="warn">⚠️ 자연수 부분에만 곱하면 안 돼요! ${fr(2, 3, 1)} × 4 ≠ ${fr(2, 3, 4)}</div>`,
    ex:`<p>${fr(1, 4, 2)} × 3 = ${fr(9, 4)} × 3 = ${fr(27, 4)} = <b>${fr(3, 4, 6)}</b></p>`, quiz:[['mn', 2]] },
  { title:'(자연수) × (분수)', std:['6수01-09'], key:`■의 ${fr('▲', '●')}는 ■를 <b>●묶음으로 똑같이 나눈 것 중 ▲묶음</b>이에요. ■ × ${fr('▲', '●')} = ${fr('■ × ▲', '●')}`,
    body:`<p>사탕 12개의 ${fr(3, 4)} → 12개를 4묶음으로 나누면 한 묶음에 3개, 3묶음은 9개</p>${E(`12 × ${fr(3, 4)} = ${fr('12 × 3', 4)} = ${fr(36, 4)} = 9`)}
      <div class="note">💡 1시간의 ${fr(1, 4)} = 60분 × ${fr(1, 4)} = 15분, 1 m의 ${fr(3, 5)} = 100 cm × ${fr(3, 5)} = 60 cm</div>
      <div class="note">💡 자연수에 1보다 작은 분수를 곱하면 원래 수보다 <b>작아지고</b>, 1보다 큰 분수를 곱하면 <b>커져요</b>.</div>`,
    lab: natFracLab, ex:`<p>20 × ${fr(1, 2, 1)} = 20 × ${fr(3, 2)} = ${fr(60, 2)} = <b>30</b></p>`, quiz:[['np', 1], ['np', 2], ['unit-of', 2]] },
  { title:'(진분수) × (진분수)', std:['6수01-09'], key:'분수끼리 곱할 때는 <b>분자는 분자끼리, 분모는 분모끼리</b> 곱해요.',
    body:`<p>${fr(2, 3)} × ${fr(3, 5)}: 가로를 3칸으로 나눠 2칸, 세로를 5칸으로 나눠 3칸 → 전체 15칸 중 겹친 6칸</p>
      ${E(`${fr(2, 3)} × ${fr(3, 5)} = ${fr('2 × 3', '3 × 5')} = ${fr(6, 15)} = ${fr(2, 5)}`)}
      <div class="note">💡 단위분수끼리: ${fr(1, 4)} × ${fr(1, 3)} = ${fr(1, 12)} — 분모끼리만 곱하면 돼요.</div>
      <div class="warn">⚠️ 1보다 작은 분수를 곱하면 결과는 처음 수보다 작아져요. ${fr(3, 4)} × ${fr(2, 3)} = ${fr(1, 2)} &lt; ${fr(3, 4)}</div>`,
    lab: areaLab('frac'), ex:`<p>${fr(5, 6)} × ${fr(3, 10)} → 약분 먼저 → ${fr('1 × 1', '2 × 2')} = <b>${fr(1, 4)}</b></p>`, quiz:[['pp', 2], ['estimate', 3]] },
  { title:'대분수가 있는 곱셈', std:['6수01-09'], key:'대분수가 있으면 <b>가분수로 바꾼 다음</b> 분자끼리, 분모끼리 곱해요. 세 분수도 같은 방법이에요.',
    body:`${E(`${fr(1, 2, 1)} × ${fr(2, 3, 2)} = ${fr(3, 2)} × ${fr(8, 3)} = ${fr(24, 6)} = 4`)}
      <div class="warn">⚠️ 자연수끼리, 분수끼리 곱하면 틀려요: 1 × 2 + ${fr(1, 2)} × ${fr(2, 3)} = ${fr(1, 3, 2)} (×)</div>
      <p>세 분수의 곱셈: ${fr(1, 2)} × ${fr(2, 3)} × ${fr(3, 4)} = ${fr('1 × 2 × 3', '2 × 3 × 4')} = ${fr(6, 24)} = ${fr(1, 4)}</p>`,
    ex:`<p>${fr(1, 3, 2)} × ${fr(3, 5, 1)} = ${fr(7, 3)} × ${fr(8, 5)} = ${fr(56, 15)} = <b>${fr(11, 15, 3)}</b></p>`, quiz:[['mm', 3], ['three', 4]] },
  { title:'생활 속 분수의 곱셈', std:['6수01-09'], key:`"■의 ${fr('▲', '●')}"는 <b>■ × ${fr('▲', '●')}</b>로 식을 세워요. 여러 번 나오면 차례로 곱해요.`,
    body:`<ul><li>🎀 리본 ${fr(3, 4)} m의 ${fr(2, 3)}를 사용 → ${fr(3, 4)} × ${fr(2, 3)} = ${fr(1, 2)} (m)</li>
      <li>🚶 한 시간에 ${fr(1, 2, 4)} km를 걷는 빠르기로 ${fr(1, 3, 2)}시간 → ${fr(9, 2)} × ${fr(7, 3)} = ${fr(21, 2)} = ${fr(1, 2, 10)} (km)</li>
      <li>🏫 전교생의 ${fr(1, 2)}이 여학생, 그중 ${fr(2, 5)}가 안경을 썼다면 → 전교생의 ${fr(1, 2)} × ${fr(2, 5)} = ${fr(1, 5)}</li></ul>`,
    ex:`<p>가로 ${fr(2, 3, 1)} m, 세로 ${fr(3, 5)} m인 직사각형 넓이 → ${fr(5, 3)} × ${fr(3, 5)} = <b>1 m²</b></p>`, quiz:[['word', 3], ['chain', 4], ['area', 4], ['time', 5]] }
]});

/* ═════════════ 3. 합동과 대칭 ═════════════ */
const T3 = (ox, e, ang) => { const pts = [[ox + 34, 140], [ox + 168, 140], [ox + 78, 45]]; return polyFig(pts, { e, ang, fill: '#EEF6FF' }); };
add({ key:'5-2-3', title:'합동과 대칭', intro:'포개었을 때 완전히 겹치는 합동인 도형의 성질을 알아보고, 선대칭도형과 점대칭도형을 이해하고 그려요.',
  prev:'[4-1] 평면도형의 이동 · 각도 · [4-2] 삼각형, 사각형', lessons:[
  { title:'도형의 합동', std:['6수03-01'], key:'모양과 크기가 같아서 <b>포개었을 때 완전히 겹치는</b> 두 도형을 서로 <b>합동</b>이라고 해요.',
    body:`<p>종이를 겹쳐 오린 두 도형, 같은 도장으로 찍은 두 모양은 합동이에요.</p>
      <div class="note">💡 돌리거나 뒤집어서 겹쳐도 완전히 겹치면 합동이에요.</div>
      <div class="warn">⚠️ 모양이 같아도 크기가 다르면 합동이 아니에요. (작은 정사각형과 큰 정사각형 ✗)</div>`,
    lab: congLab, ex:`<p>한 변이 3 cm인 정삼각형 두 개 → 모양과 크기가 같으므로 <b>합동</b></p>`, quiz:[['cong-mean', 1]] },
  { title:'합동인 도형의 성질', std:['6수03-01'], key:'합동인 두 도형에서 <b>대응변의 길이는 서로 같고, 대응각의 크기도 서로 같아요</b>.',
    body:`<ul><li>포개었을 때 겹치는 점 → <b>대응점</b></li><li>겹치는 변 → <b>대응변</b></li><li>겹치는 각 → <b>대응각</b></li></ul>
      <p>합동인 삼각형에는 대응점·대응변·대응각이 각각 <b>3쌍</b>, 합동인 사각형에는 각각 <b>4쌍</b> 있어요.</p>
      <div class="note">💡 합동인 두 도형은 둘레와 넓이도 같아요.</div>`,
    ex:`<p>삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ이 합동이고 변 ㄱㄴ이 7 cm → 대응변 ㄹㅁ도 <b>7 cm</b></p>`, quiz:[['cong-corr', 2], ['cong-side', 2], ['cong-angle', 3], ['cong-peri', 3]] },
  { title:'합동인 삼각형 그리기', std:['6수03-01'], key:'<b>세 변의 길이</b>, <b>두 변의 길이와 그 끼인각</b>, <b>한 변의 길이와 그 양 끝 각</b> 중 하나를 알면 합동인 삼각형을 그릴 수 있어요.',
    body:`<div class="figc">${svg(570, 175, T3(0, { 0:'6 cm', 1:'5 cm', 2:'4 cm' }) + T3(180, { 0:'6 cm', 2:'4 cm' }, { 0:'50°' }) + T3(360, { 0:'6 cm' }, { 0:'50°', 1:'40°' }) + txt(105, 168, '① 세 변', { size: 13, bold: true }) + txt(285, 168, '② 두 변과 끼인각', { size: 13, bold: true }) + txt(465, 168, '③ 한 변과 양 끝 각', { size: 13, bold: true }))}</div>
      <p>자로 한 변을 그은 다음, 컴퍼스(①)나 각도기(②, ③)로 나머지 꼭짓점의 위치를 정해요.</p>
      <div class="warn">⚠️ 세 각의 크기만 알면 크기가 다른 삼각형도 그려지므로 합동인 삼각형을 그릴 수 없어요.</div>`,
    ex:`<p>삼각형의 나머지 한 각: 180° - 50° - 40° = <b>90°</b> (삼각형의 세 각의 합은 180°)</p>`, quiz:[['cong-angle', 3], ['cong-quad', 4]] },
  { title:'선대칭도형', std:['6수03-02'], key:'한 직선을 따라 접었을 때 <b>완전히 겹치는</b> 도형을 <b>선대칭도형</b>, 그 직선을 <b>대칭축</b>이라고 해요.',
    body:`<p>나비, 하트, 물감을 찍어 접은 데칼코마니처럼 우리 주변에는 선대칭인 모양이 많아요.</p>
      <div class="note">💡 대칭축은 도형에 따라 1개일 수도, 여러 개일 수도 있어요. 정■각형의 대칭축은 ■개! (원은 셀 수 없이 많아요)</div>`,
    lab: symLab(false), ex:`<p>정육각형의 대칭축 → <b>6개</b> · 평행사변형 → 대칭축이 <b>없어요</b></p>`, quiz:[['axes', 1], ['axes', 2], ['sym-class', 2]] },
  { title:'선대칭도형의 성질', std:['6수03-02'], key:'대응변의 길이와 대응각의 크기가 같고, <b>대응점을 이은 선분은 대칭축과 수직</b>으로 만나며 <b>대칭축이 그 선분을 둘로 똑같이 나눠요</b>.',
    body:`<p><b>선대칭도형 그리기</b></p><ol><li>각 점에서 대칭축에 수직인 선분을 긋고</li><li>대칭축까지의 거리와 같도록 반대쪽에 대응점을 찍은 뒤</li><li>대응점을 차례로 이어요.</li></ol>
      <div class="note">💡 대칭축 위의 점은 대응점이 자기 자신이에요.</div>`,
    ex:`<p>대칭축과 대응점 ㄴ까지 4 cm → 대응점 ㄹ까지도 4 cm → 선분 ㄴㄹ = <b>8 cm</b></p>`, quiz:[['sym-side', 3], ['sym-true', 2], ['sym-peri', 4]] },
  { title:'점대칭도형', std:['6수03-02'], key:'한 점을 중심으로 <b>180° 돌렸을 때 처음 도형과 완전히 겹치는</b> 도형을 <b>점대칭도형</b>, 그 점을 <b>대칭의 중심</b>이라고 해요.',
    body:`<ul><li>대응변의 길이, 대응각의 크기가 각각 같아요.</li><li>대응점을 이은 선분은 <b>대칭의 중심을 지나고</b>, 대칭의 중심이 그 선분을 <b>둘로 똑같이 나눠요</b>.</li><li>대칭의 중심은 항상 <b>1개</b>예요.</li></ul>
      <div class="note">💡 평행사변형, 직사각형, 마름모, 정사각형, 정육각형은 점대칭도형이에요. 정삼각형, 정오각형은 아니에요.</div>`,
    lab: symLab(true), ex:`<p>대칭의 중심에서 점 ㄱ까지 5 cm → 대응점까지도 5 cm → 두 대응점을 이은 선분은 <b>10 cm</b></p>`, quiz:[['sym-class', 3], ['pt-seg', 3], ['sym-true', 3]] }
]});

/* ═════════════ 4. 소수의 곱셈 ═════════════ */
add({ key:'5-2-4', title:'소수의 곱셈', intro:'(소수) × (자연수), (자연수) × (소수), (소수) × (소수)의 계산 원리를 탐구하고, 곱의 소수점 위치를 찾아 생활 속 문제를 해결해요.',
  prev:'[4-2] 소수의 덧셈과 뺄셈 · 5-2 분수의 곱셈', lessons:[
  { title:'(1보다 작은 소수) × (자연수)', std:['6수01-13'], key:'0.■ × ▲는 <b>0.1이 (■ × ▲)개</b>예요. 자연수처럼 곱한 다음 <b>곱해지는 수와 같은 자리</b>에 소수점을 찍어요.',
    body:`${E('0.4 × 3 = 0.4 + 0.4 + 0.4 = 1.2')}<p>0.4는 0.1이 4개 → 0.4 × 3은 0.1이 4 × 3 = 12개 → <b>1.2</b></p>
      <p>분수로 바꾸어 계산할 수도 있어요: 0.4 × 3 = ${fr(4, 10)} × 3 = ${fr(12, 10)} = 1.2</p>
      <div class="note">💡 0.25 × 3 → 25 × 3 = 75 → 0.01이 75개 → <b>0.75</b></div>`,
    lab: decNatLab, ex:`<p>0.6 × 7 → 6 × 7 = 42 → 0.1이 42개 → <b>4.2</b></p>`, quiz:[['dn1', 1]] },
  { title:'(1보다 큰 소수) × (자연수), (자연수) × (소수)', std:['6수01-13'], key:'자연수처럼 곱한 뒤, 소수의 <b>소수점 아래 자리 수만큼</b> 곱에 소수점을 찍어요. 곱하는 순서를 바꾸어도 결과는 같아요.',
    body:`${E('1.6 × 4 → 16 × 4 = 64 → 6.4')}${E('7 × 0.35 → 7 × 35 = 245 → 2.45')}
      <div class="note">💡 어떤 수에 1보다 작은 소수를 곱하면 처음보다 작아지고, 1보다 큰 소수를 곱하면 커져요. 7 × 0.35 = 2.45 &lt; 7</div>`,
    ex:`<p>2.3 kg인 수박 5통 → 2.3 × 5 = <b>11.5 kg</b></p>`, quiz:[['dn2', 1], ['dn2', 2]] },
  { title:'(소수) × (소수)', std:['6수01-13'], key:'0.■ × 0.▲는 <b>0.01이 (■ × ▲)개</b>예요. 두 소수의 <b>소수점 아래 자리 수를 더한 만큼</b> 곱의 소수점 아래 자리가 생겨요.',
    body:`<p>0.3 × 0.7: 모눈 100칸에서 가로 0.3(3줄), 세로 0.7(7줄) → 겹친 21칸 → <b>0.21</b></p>
      ${E(`0.3 × 0.7 = ${fr(3, 10)} × ${fr(7, 10)} = ${fr(21, 100)} = 0.21`)}<div class="note">💡 소수 한 자리 × 소수 한 자리 = 소수 <b>두</b> 자리</div>`,
    lab: areaLab('dec'), ex:`<p>0.5 × 0.08 → 5 × 8 = 40 → 소수 1 + 2 = 3자리 → 0.040 = <b>0.04</b></p>`, quiz:[['dd1', 2]] },
  { title:'1보다 큰 소수끼리의 곱셈', std:['6수01-13'], key:'자연수처럼 곱한 다음 <b>(두 수의 소수점 아래 자리 수의 합)</b>만큼 소수점을 왼쪽으로 옮겨요.',
    body:`${E('1.5 × 2.3 → 15 × 23 = 345 → 소수 1 + 1 = 2자리 → 3.45')}
      <div class="note">💡 <b>어림</b>으로 확인해요: 1.5 × 2.3은 약 2 × 2 = 4쯤 → 3.45는 알맞아요. 34.5나 0.345는 틀린 답!</div>
      <p>자연수의 곱셈을 이용하기: 26 × 14 = 364라면 2.6 × 1.4 = <b>3.64</b>, 0.26 × 14 = <b>3.64</b></p>`,
    ex:`<p>3.2 × 1.25 → 32 × 125 = 4000 → 소수 1 + 2 = 3자리 → 4.000 = <b>4</b></p>`, quiz:[['dd2', 3], ['use-int', 3], ['est', 3]] },
  { title:'곱의 소수점 위치', std:['6수01-13'], key:'10, 100, 1000을 곱하면 소수점이 <b>오른쪽으로</b> 1, 2, 3칸, 0.1, 0.01, 0.001을 곱하면 <b>왼쪽으로</b> 1, 2, 3칸 옮겨져요.',
    body:`${tableH([['× 10', '× 100', '× 1000'], ['3.47 → 34.7', '3.47 → 347', '3.47 → 3470']])}${tableH([['× 0.1', '× 0.01', '× 0.001'], ['508 → 50.8', '508 → 5.08', '508 → 0.508']])}
      <div class="note">💡 소수점을 옮길 자리가 없으면 0을 채워요: 3.47 × 1000 = 3470</div>`,
    lab: powLab, ex:`<p>0.62 × □ = 62 → 소수점이 오른쪽으로 2칸 → □ = <b>100</b></p>`, quiz:[['pow10', 2], ['pow10', 3]] },
  { title:'생활 속 소수의 곱셈', std:['6수01-13'], key:'"한 개에 ■씩 ▲개", "■의 ▲배"는 곱셈으로 식을 세우고, 답이 알맞은지 <b>어림</b>으로 확인해요.',
    body:`<ul><li>🍯 1 L에 1.2 kg인 꿀 3.5 L → 1.2 × 3.5 = <b>4.2 kg</b> (어림: 1 × 4 = 4 ✓)</li>
      <li>🏃 매일 1.8 km씩 5일 달리면 → 1.8 × 5 = <b>9 km</b></li><li>📐 가로 2.4 m, 세로 1.5 m인 직사각형 넓이 → 2.4 × 1.5 = <b>3.6 m²</b></li></ul>`,
    ex:`<p>한 개에 0.75 kg인 사과 12개를 0.4 kg인 바구니에 담으면? → 0.75 × 12 + 0.4 = 9 + 0.4 = <b>9.4 kg</b></p>`, quiz:[['word1', 3], ['cmp', 2], ['word2', 4], ['trees', 4]] }
]});

/* ═════════════ 5. 직육면체 ═════════════ */
const cubNet = (() => { const k = 22, a = 4, b = 2, c = 3; let g = ''; const R = (x, y, w, h, f) => `<rect x="${10 + x * k}" y="${10 + y * k}" width="${w * k}" height="${h * k}" fill="${f}" stroke="#22314A" stroke-width="2"/>`;
  const cols = [[0, b, '#CFE6FA'], [b, a, '#FFE29A'], [b + a, b, '#CFE6FA'], [2 * b + a, a, '#FFE29A']];
  cols.forEach(([x, w, f]) => { g += R(x, b, w, c, f); });
  g += R(b, 0, a, b, '#DFF3E3') + R(b, b + c, a, b, '#DFF3E3');
  g += txt(10 + (b + a / 2) * k, 10 + (b + c + b) * k + 16, `${a} cm`, { size: 13, fill: '#2a6fae', bold: true }) + txt(10 + (b + a) * k + 22, 10 + (b / 2) * k, `${b} cm`, { size: 13, fill: '#2a6fae', bold: true }) + txt(10 + (2 * b + 2 * a) * k + 24, 10 + (b + c / 2) * k, `${c} cm`, { size: 13, fill: '#2a6fae', bold: true });
  return svg(20 + (2 * a + 2 * b) * k + 44, 20 + (2 * b + c) * k + 26, g); })();
add({ key:'5-2-5', title:'직육면체', intro:'직육면체와 정육면체의 구성 요소와 성질을 탐구하고, 겨냥도와 전개도를 그려요.',
  prev:'[3-1] 평면도형 · [4-2] 수직과 평행 · 다각형', lessons:[
  { title:'직육면체', std:['6수03-03'], key:'<b>직사각형 6개</b>로 둘러싸인 도형을 <b>직육면체</b>라고 해요. 면 6개, 모서리 12개, 꼭짓점 8개!',
    body:`<div class="figc">${cuboidFig(5, 3, 3, { names: false })}</div><ul><li><b>면</b>: 선분으로 둘러싸인 부분</li><li><b>모서리</b>: 면과 면이 만나는 선분</li><li><b>꼭짓점</b>: 모서리와 모서리가 만나는 점</li></ul>
      <p>과자 상자, 벽돌, 지우개 같은 물건이 직육면체 모양이에요.</p>`,
    lab: cuboidLab, ex:`<p>직육면체의 면, 모서리, 꼭짓점 수의 합 → 6 + 12 + 8 = <b>26</b></p>`, quiz:[['count', 1]] },
  { title:'정육면체', std:['6수03-03'], key:'<b>정사각형 6개</b>로 둘러싸인 도형을 <b>정육면체</b>라고 해요. 모서리 12개의 길이가 모두 같아요.',
    body:`<div class="figc">${cuboidFig(3, 3, 3, { names: false, dims: ['4 cm', '4 cm', '4 cm'] })}</div>
      <div class="note">💡 정사각형은 직사각형이므로 <b>정육면체는 직육면체</b>라고 할 수 있어요. 하지만 직육면체는 정육면체라고 할 수 없어요.</div>
      <p>모서리 길이의 합: 직육면체 = (가로 + 세로 + 높이) × 4, 정육면체 = (한 모서리) × 12</p>`,
    ex:`<p>모서리 길이의 합이 96 cm인 정육면체의 한 모서리 → 96 ÷ 12 = <b>8 cm</b></p>`, quiz:[['true', 2], ['edge-sum', 2], ['cube-from-sum', 3]] },
  { title:'직육면체의 성질', std:['6수03-03'], key:'마주 보는 면은 <b>서로 평행</b>하고(3쌍), 만나는 두 면은 <b>서로 수직</b>이에요. 한 면에 수직인 면은 <b>4개</b>예요.',
    body:`<p>직육면체에서 서로 평행한 두 면을 <b>밑면</b>, 밑면과 수직인 면을 <b>옆면</b>이라고 해요.</p>
      <div class="note">💡 주사위는 마주 보는 두 면의 눈의 수를 더하면 7이에요. (1과 6, 2와 5, 3과 4는 평행한 면!)</div>`,
    lab: faceLab, ex:`<p>한 모서리에서 만나는 두 면은 서로 <b>수직</b>이에요.</p>`, quiz:[['par-face', 2], ['rel-count', 2], ['dice', 3]] },
  { title:'직육면체의 겨냥도', std:['6수03-04'], key:'겨냥도는 직육면체 모양을 잘 알 수 있도록 <b>보이는 모서리는 실선</b>, <b>보이지 않는 모서리는 점선</b>으로 그린 그림이에요.',
    body:`<div class="figc">${cuboidFig(5, 3, 3)}</div>${tableH([['', '면', '모서리', '꼭짓점'], ['보이는 것', 3, 9, 7], ['보이지 않는 것', 3, 3, 1]])}
      <div class="warn">⚠️ 보이지 않는 모서리를 실선으로 그리거나, 평행한 모서리를 평행하지 않게 그리지 않도록 조심해요.</div>`,
    ex:`<p>가로 5 cm, 세로 3 cm, 높이 3 cm인 직육면체에서 보이지 않는 모서리 길이의 합 → 5 + 3 + 3 = <b>11 cm</b></p>`, quiz:[['visible', 1], ['visible', 2], ['hidden-sum', 3]] },
  { title:'정육면체의 전개도', std:['6수03-04'], key:'전개도를 접었을 때 <b>마주 보는 면끼리 평행</b>해요. 전개도에서 <b>한 면을 건너뛴 면</b>이 마주 보는 면이에요. 정육면체 전개도는 <b>11가지</b>!',
    body:`<p>정육면체의 모서리를 잘라 펼친 그림을 <b>전개도</b>라고 해요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그려요.</p>
      <div class="note">💡 전개도인지 확인: ① 면이 6개 ② 접었을 때 겹치는 면이 없고 ③ 만나는 모서리의 길이가 같아야 해요.</div>`,
    lab: netLab, ex:`<p>한 줄로 이어진 4개의 면 가-나-다-라에서 가와 다, 나와 라가 <b>평행</b>해요.</p>`, quiz:[['net-par', 3], ['net-valid', 4], ['net-perp', 4]] },
  { title:'직육면체의 전개도', std:['6수03-04'], key:'직육면체 전개도에서 <b>마주 보는 면은 모양과 크기가 같고</b>, 접었을 때 <b>만나는 모서리의 길이가 같아요</b>.',
    body:`<div class="figc">${cubNet}</div><p>가로 4 cm, 세로 2 cm, 높이 3 cm인 직육면체의 전개도예요. 같은 색끼리 마주 보는(평행한) 면이에요.</p>
      <div class="note">💡 전개도는 여러 가지로 그릴 수 있어요. 어느 모서리를 자르는지에 따라 모양이 달라져요.</div>`,
    ex:`<p>가로 6 cm, 세로 4 cm, 높이 5 cm인 직육면체에서 가장 큰 정육면체를 잘라 내면 한 모서리 → <b>4 cm</b></p>`, quiz:[['shade-peri', 3], ['max-cube', 2], ['painted', 5]] }
]});

/* ═════════════ 6. 평균과 가능성 ═════════════ */
add({ key:'5-2-6', title:'평균과 가능성', intro:'자료를 대표하는 값인 평균의 의미를 알고 구하여 해석하며, 일이 일어날 가능성을 말과 수로 나타내고 판단해요.',
  prev:'[3-2] 그림그래프 · [4-1] 막대그래프 · [4-2] 꺾은선그래프', lessons:[
  { title:'평균 알아보기', std:['6수04-01'], key:'각 자료의 값을 <b>고르게 하여</b> 그 자료를 대표하는 값을 <b>평균</b>이라고 해요.',
    body:`<p>지아가 5일 동안 읽은 책은 4, 7, 3, 8, 3권이에요. 많이 읽은 날의 책을 적게 읽은 날로 옮겨서 고르게 하면 하루에 <b>5권</b>씩 읽은 셈이에요.</p>
      <div class="note">💡 평균은 자료 전체를 하나의 수로 나타낸 값이라 모둠끼리 비교할 때 편리해요.</div>`,
    lab: meanLab, ex:`<p>6, 9, 6, 7 → 고르게 하면 모두 <b>7</b></p>`, quiz:[['mean', 1]] },
  { title:'평균 구하기', std:['6수04-01'], key:'(평균) = <b>(자료의 값을 모두 더한 수) ÷ (자료의 수)</b>',
    body:`${E('(4 + 7 + 3 + 8 + 3) ÷ 5 = 25 ÷ 5 = 5')}<p><b>평균을 구하는 여러 방법</b></p>
      <ul><li>막대를 <b>고르게 옮기기</b></li><li>평균을 <b>예상한 뒤</b> 넘치는 것을 모자란 곳에 옮겨 확인하기</li><li><b>합 ÷ 자료의 수</b>로 계산하기</li></ul>
      <div class="note">💡 (자료 값의 합) = (평균) × (자료의 수)</div>`,
    ex:`<p>4번 시험 점수 85, 90, 75, 90 → 340 ÷ 4 = <b>85점</b></p>`, quiz:[['mean', 2], ['total', 2], ['mean-true', 3]] },
  { title:'평균 이용하기', std:['6수04-01'], key:'평균을 알면 <b>(평균) × (자료의 수)</b>로 전체 합을 구해 모르는 값을 찾고, 자료의 수가 달라도 <b>평균으로 비교</b>할 수 있어요.',
    body:`${tableH([['모둠', '학생 수', '읽은 책의 합', '평균'], ['가', '4명', '36권', '9권'], ['나', '5명', '40권', '8권']])}
      <p>나 모둠이 읽은 책의 합은 더 많지만, 한 명당 평균은 <b>가 모둠</b>이 더 많아요.</p>
      <p>모르는 값 구하기: 4명의 평균이 8점이고 세 명이 7, 9, 6점 → 8 × 4 - (7 + 9 + 6) = <b>10점</b></p>`,
    ex:`<p>3번의 평균이 80점, 4번째에 몇 점을 받아야 평균 82점? → 82 × 4 - 80 × 3 = <b>88점</b></p>`, quiz:[['unknown', 2], ['compare', 3], ['same-mean', 4], ['need', 4]] },
  { title:'일이 일어날 가능성을 말로 나타내기', std:['6수04-04'], key:'가능성은 <b>불가능하다 → ~아닐 것 같다 → 반반이다 → ~일 것 같다 → 확실하다</b> 순서로 커져요.',
    body:`<ul><li>☀️ 내일 해가 동쪽에서 뜰 가능성 → <b>확실하다</b></li><li>🪙 동전을 던져 그림 면이 나올 가능성 → <b>반반이다</b></li>
      <li>🎲 주사위를 던져 7이 나올 가능성 → <b>불가능하다</b></li><li>❄️ 8월에 서울에 눈이 올 가능성 → <b>~아닐 것 같다</b></li></ul>`,
    lab: chanceLab(false), ex:`<p>빨간 구슬 9개, 파란 구슬 1개가 든 주머니에서 구슬 하나 → 빨간 구슬일 가능성 <b>~일 것 같다</b></p>`, quiz:[['word', 1], ['word', 2], ['order', 4]] },
  { title:'가능성을 수로 나타내기', std:['6수04-05'], key:`불가능하다는 <b>0</b>, 반반이다는 <b>${fr(1, 2)}</b>, 확실하다는 <b>1</b>로 나타낼 수 있어요.`,
    body:`<div class="figc">${svg(480, 70, line(30, 30, 450, 30, { w: 3 }) + [[30, '0', '불가능하다'], [240, '1/2', '반반이다'], [450, '1', '확실하다']].map(([x, n, w]) => `<circle cx="${x}" cy="30" r="7" fill="#4CB963"/>` + txt(x, 12, n, { size: 15, bold: true }) + txt(x, 54, w, { size: 13 })).join(''))}</div>
      <p>가능성이 클수록 1에, 작을수록 0에 가까워요.</p>
      <div class="note">💡 흰 바둑돌만 든 통에서 검은 돌을 꺼낼 가능성 → 0, 흰 돌을 꺼낼 가능성 → 1</div>`,
    ex:`<p>1부터 6까지 쓰인 주사위를 던져 짝수가 나올 가능성 → 6가지(1~6) 중 3가지(2, 4, 6) → <b>${fr(1, 2)}</b></p>`, quiz:[['num', 2], ['spin', 3], ['reverse', 3]] },
  { title:'가능성을 예상하고 판단하기', std:['6수04-06'], key:'실험을 <b>많이 할수록</b> 결과가 예상한 가능성에 가까워져요. 자료를 보고 가능성을 예상해 알맞게 판단해요.',
    body:`<p>회전판을 10번만 돌리면 결과가 들쭉날쭉하지만, 1000번 돌리면 칸의 비율에 거의 맞아요.</p>
      <div class="note">💡 일기 예보의 "비 올 가능성"처럼 가능성을 알면 우산을 챙길지 판단할 수 있어요.</div>`,
    lab: chanceLab(true), ex:`<p>제비 20개 중 당첨이 10개 → 당첨될 가능성 <b>반반이다(${fr(1, 2)})</b></p>`, quiz:[['experiment', 4], ['spin', 3]] }
]});
})();
