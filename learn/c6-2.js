/* =========================================================
   🦖 개념 탐험대 — 6학년 2학기 (2022 개정 교육과정)
   단원마다 탐험(차시): title · key(핵심 한 줄) · body(설명) · lab(직접 해 보기) · ex(예시) · quiz(확인 문제)
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g6-2.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, Q6 = window.TM_Q6;
const { fr, frH, F, svg, txt, line, dz, nf, range, tableH, gcd } = A;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const PI = 3.14;

/* ---------- 직접 해 보기 ---------- */
// 1) 분모가 같은 분수의 나눗셈 — 몇 번 들어갈까?
const measureLabF = diff => ({ title: diff ? '통분하여 몇 번 들어가는지 세어 보기' : '나누는 분수가 몇 번 들어가는지 세어 보기', init(el){
  const P = diff ? [[[3, 4], [1, 3]], [[2, 3], [1, 6]], [[5, 6], [1, 4]], [[3, 5], [1, 2]]].map(([[a, b], [c, d]]) => { const L2 = A.lcm(b, d); return [a * L2 / b, c * L2 / d, L2, [a, b, c, d]]; }) : [[6, 2, 8], [6, 3, 7], [5, 2, 9], [7, 3, 10], [9, 4, 10]];
  el.innerHTML = `<div class="ctrl">${P.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 0}">${p[3] ? `${fr(p[3][0], p[3][1])} ÷ ${fr(p[3][2], p[3][3])}` : `${fr(p[0], p[2])} ÷ ${fr(p[1], p[2])}`}</button>`).join('')}</div><div class="figc" id="mf"></div><div class="out" id="mo"></div>`;
  let pi = 0; const C = ['#4CB963', '#FF9F43'];
  const draw = () => { const [a, b, d] = P[pi], W = 440, cw = W / d; let g = '';
    for (let i = 0; i < d; i++){ const grp = Math.floor(i / b), full = (grp + 1) * b <= a;
      g += `<rect x="${(10 + i * cw).toFixed(1)}" y="10" width="${cw.toFixed(1)}" height="40" fill="${i < a ? (full ? C[grp % 2] : '#FFD7DE') : '#fff'}" stroke="#22314A" stroke-width="1.5"/>`; }
    for (let k = 0; k * b < a; k++){ const x1 = 10 + k * b * cw, x2 = 10 + Math.min(a, (k + 1) * b) * cw; g += `<path d="M${x1 + 3} 60 Q${(x1 + x2) / 2} 78 ${x2 - 3} 60" fill="none" stroke="#2a6fae" stroke-width="2"/>` + txt((x1 + x2) / 2, 88, (k + 1) * b <= a ? `${k + 1}번` : `${a - k * b}/${b}번`, { size: 13, bold: true, fill: '#2a6fae' }); }
    $in(el, '#mf').innerHTML = svg(W + 20, 100, g);
    const r = F(a, b);
    $in(el, '#mo').innerHTML = (P[pi][3] ? `통분하면 ${fr(a, d)} ÷ ${fr(b, d)} → ` : '') + `${fr(a, d)}에 ${fr(b, d)}가 몇 번 들어갈까? → ${fr(1, d)}이 ${a}개 중 ${b}개씩 → ${a} ÷ ${b} = <b>${a % b ? fr(a, b) : a / b}</b>${a % b ? ` = <b>${frH(r)}</b>` : ''}`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; press(el, '[data-p]', b); draw(); })); draw();
} });
// 2) (자연수) ÷ (분수)
const natDivLab = { title: '1 안에 몇 번 들어가는지 생각하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>자연수</label><input type="range" min="1" max="4" value="2" id="nn"><span class="v" id="nnv"></span><label>나누는 분수의 분모</label><input type="range" min="2" max="5" value="3" id="nd"><span class="v" id="ndv"></span><label>분자</label><input type="range" min="1" max="4" value="2" id="nb"><span class="v" id="nbv"></span></div><div class="figc" id="nf"></div><div class="out" id="no"></div>`;
  const draw = () => { const N = +$in(el, '#nn').value, c = +$in(el, '#nd').value, bIn = $in(el, '#nb'); bIn.max = c - 1; if (+bIn.value > c - 1) bIn.value = c - 1; const b = +bIn.value;
    $in(el, '#nnv').textContent = N; $in(el, '#ndv').textContent = c; $in(el, '#nbv').textContent = b;
    const W = 110, cw = W / c, tot = N * c; let g = '';
    for (let i = 0; i < tot; i++){ const u = Math.floor(i / c), j = i % c, grp = Math.floor(i / b), full = (grp + 1) * b <= tot;
      g += `<rect x="${(10 + u * (W + 10) + j * cw).toFixed(1)}" y="10" width="${cw.toFixed(1)}" height="40" fill="${full ? (grp % 2 ? '#FF9F43' : '#4CB963') : '#FFD7DE'}" stroke="#22314A" stroke-width="1.3"/>`; }
    for (let u = 0; u < N; u++) g += `<rect x="${10 + u * (W + 10)}" y="10" width="${W}" height="40" fill="none" stroke="#22314A" stroke-width="2.6"/>` + txt(10 + u * (W + 10) + W / 2, 64, '1', { size: 13, bold: true });
    $in(el, '#nf').innerHTML = svg(20 + N * (W + 10), 74, g);
    const r = F(N * c, b);
    $in(el, '#no').innerHTML = `1 안에 ${fr(1, c)}이 ${c}개 → ${N} 안에 ${fr(1, c)}이 ${N * c}개 → ${fr(b, c)}(=${fr(1, c)} ${b}개)는 ${N * c} ÷ ${b}번<br>${N} ÷ ${fr(b, c)} = (${N} × ${c}) ÷ ${b} = ${N} × ${fr(c, b)} = <b>${frH(r)}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 3) 쌓기나무
const stackLab = { title: '칸을 눌러 쌓기나무를 쌓고 본 모양 살펴보기', init(el){
  el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center">
      <div style="text-align:center"><div class="lt" style="font-family:Jua;color:#2F8A47">위에서 본 모양 (누르면 +1)</div><div id="sg" style="display:grid;grid-template-columns:repeat(3,52px);gap:4px;margin:6px auto;width:max-content"></div><div style="font-size:13px;color:#5D6C83">↓ 앞</div></div>
      <div id="si"></div></div>
    <div style="display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:6px"><div style="text-align:center"><div id="sfv"></div>앞에서 본 모양</div><div style="text-align:center"><div id="ssv"></div>오른쪽 옆에서 본 모양</div></div>
    <div class="ctrl"><button class="tbtn" type="button" id="sclr">모두 지우기</button><button class="tbtn" type="button" id="srnd">🎲 아무렇게나 쌓기</button></div><div class="out" id="so"></div>`;
  let H = [[2, 1, 0], [3, 2, 1], [1, 1, 1]];
  const draw = () => {
    $in(el, '#sg').innerHTML = H.map((r, i) => r.map((h, j) => `<button class="tbtn" type="button" data-r="${i}" data-c="${j}" style="width:52px;height:52px;padding:0;font-family:Fredoka;font-size:22px;${h ? 'background:#FFE7A8' : ''}">${h || ''}</button>`).join('')).join('');
    el.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.r, j = +b.dataset.c; H[i][j] = (H[i][j] + 1) % 4; draw(); }));
    const any = H.flat().some(x => x);
    $in(el, '#si').innerHTML = any ? Q6.iso(H, 26) : '<div class="out">칸을 눌러 쌓아 보세요!</div>';
    const fv = H[0].map((_, c) => Math.max(...H.map(r => r[c]))), sv = H.map(r => Math.max(...r)).reverse();
    $in(el, '#sfv').innerHTML = any ? Q6.viewSVG(fv) : ''; $in(el, '#ssv').innerHTML = any ? Q6.viewSVG(sv) : '';
    const s = H.flat().reduce((a, b) => a + b, 0);
    $in(el, '#so').innerHTML = `사용한 쌓기나무: ${H.flat().filter(x => x).join(' + ') || 0} = <b>${s}개</b> · 앞에서 보면 세로줄마다, 옆에서 보면 가로줄마다 <b>가장 높은 층</b>이 보여요.`; };
  $in(el, '#sclr').addEventListener('click', () => { H = H.map(r => r.map(() => 0)); draw(); });
  $in(el, '#srnd').addEventListener('click', () => { H = H.map(r => r.map(() => A.ri(0, 3))); draw(); }); draw();
} };
// 4) 소수점을 똑같이 옮기기
const shiftLab = { title: '두 수의 소수점을 똑같이 옮겨 보기', init(el){
  const P = [[12.6, 0.3], [2.56, 0.32], [5.04, 1.4], [9, 0.75], [3.6, 0.12]];
  el.innerHTML = `<div class="ctrl">${P.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 0}">${p[0]} ÷ ${p[1]}</button>`).join('')}</div>
    <div class="ctrl"><label>두 수에 곱하기</label>${[1, 10, 100].map((m, i) => `<button class="tbtn" type="button" data-m="${m}" aria-pressed="${i === 0}">× ${m}</button>`).join('')}</div><div class="step-expr" id="sx"></div><div class="out" id="so"></div>`;
  let pi = 0, m = 1;
  const draw = () => { const [a, b] = P[pi], A2 = dz(a * m), B2 = dz(b * m), q = dz(a / b);
    $in(el, '#sx').innerHTML = `${nf(A2)} ÷ ${nf(B2)} = ${nf(q)}`;
    $in(el, '#so').innerHTML = m === 1 ? '나누는 수가 소수예요. 두 수에 똑같이 10이나 100을 곱해 보세요!' : `나누어지는 수와 나누는 수에 똑같이 ${m}을(를) 곱해도 몫은 <b>${nf(q)}</b>로 같아요.${Number.isInteger(B2) ? ' 나누는 수가 <b>자연수</b>가 되었어요 → 계산하기 쉬워요!' : ' 아직 나누는 수가 소수예요.'}`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; m = 1; press(el, '[data-p]', b); press(el, '[data-m]', el.querySelector('[data-m="1"]')); draw(); }));
  el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { m = +b.dataset.m; press(el, '[data-m]', b); draw(); })); draw();
} };
// 5) 비의 성질
const ratioPropLab = { title: '전항과 후항에 같은 수 곱하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>전항</label><input type="range" min="1" max="5" value="2" id="pa"><span class="v" id="pav"></span><label>후항</label><input type="range" min="1" max="5" value="3" id="pb"><span class="v" id="pbv"></span><label>× </label><input type="range" min="1" max="4" value="2" id="pk"><span class="v" id="pkv"></span></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  const draw = () => { const a = +$in(el, '#pa').value, b = +$in(el, '#pb').value, k = +$in(el, '#pk').value, sz = 16; $in(el, '#pav').textContent = a; $in(el, '#pbv').textContent = b; $in(el, '#pkv').textContent = k;
    const row = (y, n, col) => range(0, n - 1).map(i => `<rect x="${110 + i * sz}" y="${y}" width="${sz - 2}" height="${sz - 2}" rx="3" fill="${col}"/>`).join('');
    let g = txt(50, 20, `${a} : ${b}`, { size: 16, bold: true }) + row(6, a, '#FF9F43') + row(26, b, '#8EC5F4');
    g += txt(50, 80, `${a * k} : ${b * k}`, { size: 16, bold: true }) + row(66, a * k, '#FF9F43') + row(86, b * k, '#8EC5F4');
    $in(el, '#pf').innerHTML = svg(130 + Math.max(b, a) * k * sz, 108, g);
    $in(el, '#po').innerHTML = `비율: ${fr(a, b)}${gcd(a, b) > 1 ? ` = ${frH(F(a, b))}` : ''} 와 ${fr(a * k, b * k)} = ${frH(F(a, b), { improper: true })} → <b>비율이 같아요!</b> → ${a} : ${b} = ${a * k} : ${b * k}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 6) 비례배분
const shareLab = { title: '주어진 양을 비로 나누어 주기', init(el){
  el.innerHTML = `<div class="ctrl"><label>전체</label><input type="range" min="10" max="60" step="5" value="30" id="st"><span class="v" id="stv"></span><label>가</label><input type="range" min="1" max="5" value="2" id="sa"><span class="v" id="sav"></span><label>나</label><input type="range" min="1" max="5" value="3" id="sb"><span class="v" id="sbv"></span></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  const draw = () => { const T = +$in(el, '#st').value, a = +$in(el, '#sa').value, b = +$in(el, '#sb').value, W = 440, n = a + b, cw = W / n; $in(el, '#stv').textContent = T; $in(el, '#sav').textContent = a; $in(el, '#sbv').textContent = b;
    let g = ''; for (let i = 0; i < n; i++) g += `<rect x="${(10 + i * cw).toFixed(1)}" y="10" width="${cw.toFixed(1)}" height="44" fill="${i < a ? '#FFC56B' : '#8EC5F4'}" stroke="#22314A" stroke-width="1.5"/>`;
    const va = dz(T * a / n), vb = dz(T * b / n);
    g += txt(10 + a * cw / 2, 70, `가 ${nf(va)}`, { size: 14, bold: true }) + txt(10 + a * cw + b * cw / 2, 70, `나 ${nf(vb)}`, { size: 14, bold: true });
    $in(el, '#sf').innerHTML = svg(W + 20, 82, g);
    $in(el, '#so').innerHTML = `전체를 ${a} + ${b} = ${n}칸으로 나누면 한 칸은 ${T} ÷ ${n} = ${nf(dz(T / n))}<br>가: ${T} × ${fr(a, n)} = <b>${nf(va)}</b>, 나: ${T} × ${fr(b, n)} = <b>${nf(vb)}</b>${Number.isInteger(va) ? '' : ' (나누어떨어지지 않아요)'}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 7) 원주 굴리기
const rollLab = { title: '원을 굴려 원주와 지름 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>지름</label><input type="range" min="2" max="5" value="3" id="cd"><span class="v" id="cdv"></span><label>굴리기</label><input type="range" min="0" max="100" value="0" id="cr"></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  const draw = () => { const d = +$in(el, '#cd').value, t = +$in(el, '#cr').value / 100, u = 28, r = d * u / 2, C = Math.PI * d * u, x0 = 20, y = 30 + d * u; $in(el, '#cdv').textContent = d + ' cm';
    const cx = x0 + r + t * C; let g = line(x0, y, x0 + 4 * d * u + 2 * r, y, { stroke: '#9AA6B8' });
    for (let k = 0; k <= 3; k++) g += `<rect x="${x0 + r + k * d * u}" y="${y + 8}" width="${d * u}" height="10" fill="${k % 2 ? '#8EC5F4' : '#CFE6FA'}" stroke="#2a6fae"/>` + (k < 3 ? txt(x0 + r + k * d * u + d * u / 2, y + 32, `지름 ${k + 1}`, { size: 11, fill: '#2a6fae' }) : '');
    g += line(x0 + r, y - 2, x0 + r + t * C, y - 2, { stroke: '#E5546B', w: 5 });
    const ang = t * 2 * Math.PI, px = cx - r * Math.sin(ang), py = y - r + r * Math.cos(ang);
    g += `<circle cx="${cx}" cy="${y - r}" r="${r}" fill="#FFF2DC" stroke="#22314A" stroke-width="2"/>` + line(cx, y - r, px, py, { stroke: '#22314A' }) + `<circle cx="${px}" cy="${py}" r="5" fill="#E5546B"/>`;
    $in(el, '#cf').innerHTML = svg(x0 * 2 + 4 * d * u + 2 * r + 10, y + 44, g);
    $in(el, '#co').innerHTML = t < 1 ? '슬라이더를 밀어 원을 한 바퀴 굴려 보세요. 빨간 선이 원주예요.' : `한 바퀴 굴린 길이(원주) ≈ <b>${nf(dz(d * PI))} cm</b> → 지름의 약 <b>3.14배</b>! (원주) ÷ (지름) = 원주율`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 8) 원을 잘라 붙이기
const sectorLab = { title: '원을 잘게 잘라 다시 붙이기', init(el){
  el.innerHTML = `<div class="ctrl"><label>조각 수</label><input type="range" min="2" max="16" step="1" value="4" id="sn"><span class="v" id="snv"></span></div><div class="figc" id="sf" style="gap:16px;flex-wrap:wrap"></div><div class="out" id="so"></div>`;
  const draw = () => { const n = +$in(el, '#sn').value * 2, r = 70, a = 2 * Math.PI / n, w = Math.PI * r / (n / 2), cols = ['#8EC5F4', '#FFC56B']; $in(el, '#snv').textContent = n;
    let c = ''; for (let i = 0; i < n; i++){ const a0 = i * a, a1 = a0 + a; c += `<path d="M80 80 L${(80 + r * Math.cos(a0)).toFixed(1)} ${(80 + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(80 + r * Math.cos(a1)).toFixed(1)} ${(80 + r * Math.sin(a1)).toFixed(1)} Z" fill="${cols[i % 2]}" stroke="#22314A" stroke-width="1"/>`; }
    let g = ''; const y0 = 10;
    for (let k = 0; k < n / 2; k++){
      const ax = 10 + w / 2 + k * w, ay = y0; // 아래로 향한 조각 (꼭짓점 위)
      g += `<path d="M${ax.toFixed(1)} ${ay} L${(ax + r * Math.cos(Math.PI / 2 + a / 2)).toFixed(1)} ${(ay + r * Math.sin(Math.PI / 2 + a / 2)).toFixed(1)} A${r} ${r} 0 0 0 ${(ax + r * Math.cos(Math.PI / 2 - a / 2)).toFixed(1)} ${(ay + r * Math.sin(Math.PI / 2 - a / 2)).toFixed(1)} Z" fill="${cols[0]}" stroke="#22314A" stroke-width="1"/>`;
      const bx = 10 + w + k * w, by = y0 + r; // 위로 향한 조각 (꼭짓점 아래)
      g += `<path d="M${bx.toFixed(1)} ${by} L${(bx + r * Math.cos(-Math.PI / 2 - a / 2)).toFixed(1)} ${(by + r * Math.sin(-Math.PI / 2 - a / 2)).toFixed(1)} A${r} ${r} 0 0 1 ${(bx + r * Math.cos(-Math.PI / 2 + a / 2)).toFixed(1)} ${(by + r * Math.sin(-Math.PI / 2 + a / 2)).toFixed(1)} Z" fill="${cols[1]}" stroke="#22314A" stroke-width="1"/>`; }
    g += txt(10 + w / 2 + Math.PI * r / 2, y0 + r + 26, '(원주) × 1/2', { size: 13, fill: '#2a6fae', bold: true });
    $in(el, '#sf').innerHTML = svg(160, 160, c) + svg(Math.PI * r + w + 30, r + 50, g);
    $in(el, '#so').innerHTML = `조각을 많이 할수록 <b>직사각형</b>에 가까워져요! 가로 = (원주) × ${fr(1, 2)} = (반지름) × 원주율, 세로 = (반지름)<br>→ (원의 넓이) = (반지름) × (원주율) × (반지름) = <b>(반지름) × (반지름) × (원주율)</b>`; };
  $in(el, '#sn').addEventListener('input', draw); draw();
} };
// 9) 원기둥 전개도
const cylSVG = (rr, hh) => { const u = 20, R = rr * u * 0.9, H = hh * u, W = 2 * Math.PI * rr * u * 0.9, x0 = 10, yR = 10 + 2 * R; let g = '';
  g += `<rect x="${x0}" y="${yR}" width="${W.toFixed(1)}" height="${H}" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/>`;
  g += `<circle cx="${x0 + W / 2}" cy="${yR - R}" r="${R}" fill="#CFE6FA" stroke="#22314A" stroke-width="2"/><circle cx="${x0 + W / 2}" cy="${yR + H + R}" r="${R}" fill="#CFE6FA" stroke="#22314A" stroke-width="2"/>`;
  g += line(x0, yR + H + 2 * R + 14, x0 + W, yR + H + 2 * R + 14, { stroke: '#2a6fae' }) + txt(x0 + W / 2, yR + H + 2 * R + 30, `밑면의 둘레 = ${2 * rr} × 3.14 = ${nf(dz(2 * rr * PI))} cm`, { size: 12, fill: '#2a6fae', bold: true }) + txt(x0 + W + 30, yR + H / 2, `${hh} cm`, { size: 13, fill: '#C2410C', bold: true });
  return svg(Math.max(W + 80, 300), yR + H + 2 * R + 42, g); };
const cylNetLab = { title: '반지름과 높이를 바꾸며 원기둥의 전개도 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>밑면의 반지름</label><input type="range" min="1" max="3" value="2" id="yr"><span class="v" id="yrv"></span><label>높이</label><input type="range" min="2" max="6" value="3" id="yh"><span class="v" id="yhv"></span></div><div class="figc" id="yf"></div><div class="out" id="yo"></div>`;
  const draw = () => { const r = +$in(el, '#yr').value, h = +$in(el, '#yh').value; $in(el, '#yrv').textContent = r + ' cm'; $in(el, '#yhv').textContent = h + ' cm';
    $in(el, '#yf').innerHTML = cylSVG(r, h);
    $in(el, '#yo').innerHTML = `밑면(원) <b>2개</b> + 옆면(직사각형) <b>1개</b> · 옆면의 가로 = 밑면의 둘레 ${nf(dz(2 * r * PI))} cm, 세로 = 높이 ${h} cm`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 10) 돌려 만든 입체도형
const SOL = {
  rect: { nm: '직사각형', sol: '원기둥', shape: '<rect x="70" y="30" width="60" height="110" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/>',
    solid: '<ellipse cx="100" cy="30" rx="60" ry="14" fill="#FFF2DC" stroke="#22314A" stroke-width="2"/><path d="M40 30 V140 A60 14 0 0 0 160 140 V30" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/><path d="M40 140 A60 14 0 0 1 160 140" fill="none" stroke="#7A8699" stroke-width="2" stroke-dasharray="6 5"/><ellipse cx="100" cy="30" rx="60" ry="14" fill="#FFF2DC" stroke="#22314A" stroke-width="2"/>' },
  tri: { nm: '직각삼각형', sol: '원뿔', shape: '<polygon points="70,30 70,140 140,140" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/>',
    solid: '<path d="M100 22 L30 140 A70 16 0 0 0 170 140 Z" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/><path d="M30 140 A70 16 0 0 1 170 140" fill="none" stroke="#7A8699" stroke-width="2" stroke-dasharray="6 5"/><circle cx="100" cy="22" r="4" fill="#E5546B"/>' },
  semi: { nm: '반원', sol: '구', shape: '<path d="M70 25 A60 60 0 0 1 70 145 Z" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/>',
    solid: '<circle cx="100" cy="85" r="62" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/><path d="M38 85 A62 15 0 0 0 162 85" fill="none" stroke="#22314A" stroke-width="1.6"/><path d="M38 85 A62 15 0 0 1 162 85" fill="none" stroke="#7A8699" stroke-width="1.6" stroke-dasharray="6 5"/><circle cx="100" cy="85" r="3.5" fill="#E5546B"/>' }
};
const rotLabF = start => ({ title: '평면도형을 한 바퀴 돌려 보기', init(el){
  el.innerHTML = `<div class="ctrl">${Object.keys(SOL).map(k => `<button class="tbtn" type="button" data-s="${k}" aria-pressed="${k === start}">${SOL[k].nm}</button>`).join('')}</div><div class="figc" id="rf" style="gap:20px;align-items:center;flex-wrap:wrap"></div><div class="out" id="ro"></div>`;
  let k = start;
  const draw = () => { const s = SOL[k];
    $in(el, '#rf').innerHTML = svg(200, 170, s.shape + line(70, 10, 70, 160, { stroke: '#E5546B', dash: '7 5', w: 2.4 }) + '<path d="M58 14 A14 6 0 1 0 82 14" fill="none" stroke="#E5546B" stroke-width="2"/>') + '<div style="font-size:30px">➡️</div>' + svg(200, 170, s.solid);
    $in(el, '#ro').innerHTML = `${s.nm}을(를) 빨간 선(축)을 기준으로 한 바퀴 돌리면 <b>${s.sol}</b>이(가) 돼요.`; };
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { k = b.dataset.s; press(el, '[data-s]', b); draw(); })); draw();
} });

// 11) 남는 양
const remLab = { title: '병에 나누어 담고 남는 양 보기', init(el){
  const P = [[15.4, 3], [20.5, 6], [9.3, 2], [13.7, 4]];
  el.innerHTML = `<div class="ctrl">${P.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 0}">${p[0]} L ÷ ${p[1]} L</button>`).join('')}</div><div class="figc" id="rf"></div><div class="out" id="ro"></div>`;
  let pi = 0;
  const draw = () => { const [x, k] = P[pi], n = Math.floor(x / k), r = dz(x - n * k), u = 12; let g = '';
    for (let i = 0; i < n; i++) g += `<rect x="${10 + i * (k * u + 10)}" y="10" width="${k * u}" height="44" rx="8" fill="#8EC5F4" stroke="#22314A" stroke-width="1.6"/>` + txt(10 + i * (k * u + 10) + k * u / 2, 32, `${k} L`, { size: 12, bold: true });
    const rx = 10 + n * (k * u + 10); g += `<rect x="${rx}" y="10" width="${k * u}" height="44" rx="8" fill="#fff" stroke="#22314A" stroke-width="1.6" stroke-dasharray="5 4"/><rect x="${rx}" y="10" width="${r * u}" height="44" rx="8" fill="#FF9FA8"/>` + txt(rx + k * u / 2, 66, `남는 ${nf(r)} L`, { size: 12, bold: true, fill: '#C2410C' });
    $in(el, '#rf').innerHTML = svg(rx + k * u + 20, 76, g);
    $in(el, '#ro').innerHTML = `${nf(x)} ÷ ${k} → 몫을 자연수까지 구하면 <b>${n}병</b>, 남는 양 ${nf(x)} - ${k} × ${n} = <b>${nf(r)} L</b> (남는 양은 ${k} L보다 작아요)`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; press(el, '[data-p]', b); draw(); })); draw();
} };
// 12) 비례식의 성질 확인
const propLab = { title: '외항의 곱과 내항의 곱 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>3 : 4 = 6 : □ 에서 □</label><input type="range" min="1" max="15" value="5" id="pv"><span class="v" id="pvv"></span></div><div class="step-expr" id="px"></div><div class="out" id="po"></div>`;
  const draw = () => { const v = +$in(el, '#pv').value; $in(el, '#pvv').textContent = v;
    $in(el, '#px').innerHTML = `<span style="color:#E5546B">3</span> : <span style="color:#2a6fae">4</span> = <span style="color:#2a6fae">6</span> : <span style="color:#E5546B">${v}</span>`;
    $in(el, '#po').innerHTML = `외항의 곱 3 × ${v} = <b>${3 * v}</b> · 내항의 곱 4 × 6 = <b>24</b> → ${3 * v === 24 ? '🎉 같아요! 비례식이 맞아요.' : '달라요. 비례식이 아니에요.'}`; };
  $in(el, '#pv').addEventListener('input', draw); draw();
} };
// 13) 원의 넓이 어림 — 모눈 세기
const gridCircleLab = { title: '모눈으로 원의 넓이 어림하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>반지름 (칸)</label><input type="range" min="3" max="9" value="5" id="gr"><span class="v" id="grv"></span></div><div class="figc" id="gf"></div><div class="legend"><span><i style="background:#4CB963"></i>원 안에 완전히 들어간 칸</span><span><i style="background:#CFEFD3"></i>원에 걸친 칸</span></div><div class="out" id="go"></div>`;
  const draw = () => { const r = +$in(el, '#gr').value, u = Math.min(22, Math.floor(240 / r)), C = 10 + r * u; $in(el, '#grv').textContent = r;
    let g = '', ins = 0, part = 0;
    for (let i = -r; i < r; i++) for (let j = -r; j < r; j++){ const cs = [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]].map(([x, y]) => x * x + y * y <= r * r), all = cs.every(Boolean), nearX = Math.max(i, Math.min(0, i + 1)), nearY = Math.max(j, Math.min(0, j + 1)), any = nearX * nearX + nearY * nearY < r * r;
      if (all) ins++; else if (any) part++;
      g += `<rect x="${C + i * u}" y="${C + j * u}" width="${u}" height="${u}" fill="${all ? '#4CB963' : any ? '#CFEFD3' : '#fff'}" stroke="#C9D3DF" stroke-width="1"/>`; }
    g += `<circle cx="${C}" cy="${C}" r="${r * u}" fill="none" stroke="#E5546B" stroke-width="2.5"/>`;
    $in(el, '#gf').innerHTML = svg(2 * C, 2 * C, g);
    $in(el, '#go').innerHTML = `완전히 들어간 칸 <b>${ins}</b>개 &lt; (원의 넓이) &lt; 걸친 칸까지 <b>${ins + part}</b>개 → 실제 넓이 ${r} × ${r} × 3.14 = <b>${nf(dz(r * r * 3.14))}</b>칸`; };
  $in(el, '#gr').addEventListener('input', draw); draw();
} };

/* ═════════════ 1. 분수의 나눗셈 ═════════════ */
add({ key:'6-2-1', title:'분수의 나눗셈', intro:'(분수) ÷ (분수)의 계산 원리를 탐구하고, 나누는 분수의 분모와 분자를 바꾸어 곱하는 방법으로 계산해요.',
  prev:'[5-1] 약분과 통분 · [6-1] 분수의 나눗셈', lessons:[
  { title:'분모가 같은 (분수) ÷ (분수) (1)', std:['6수01-11'], key:'분모가 같은 분수의 나눗셈은 <b>분자끼리 나누어</b> 계산해요.',
    body:`${E(`${fr(6, 8)} ÷ ${fr(2, 8)} = 6 ÷ 2 = 3`)}<p>${fr(6, 8)}은 ${fr(1, 8)}이 6개, ${fr(2, 8)}는 ${fr(1, 8)}이 2개 → 6개 안에 2개씩 3번 들어가요.</p>`,
    lab: measureLabF(false), ex:`<p>${fr(9, 10)} ÷ ${fr(3, 10)} = 9 ÷ 3 = <b>3</b></p>`, quiz:[['ff-same', 1]] },
  { title:'분모가 같은 (분수) ÷ (분수) (2)', std:['6수01-11'], key:'분자끼리 나누어떨어지지 않으면 몫을 <b>분수로</b> 나타내요. ■ ÷ ▲ = ■/▲',
    body:`${E(`${fr(5, 9)} ÷ ${fr(2, 9)} = 5 ÷ 2 = ${fr(5, 2)} = ${fr(1, 2, 2)}`)}<p>${fr(2, 9)}가 2번 들어가고, 남은 ${fr(1, 9)}은 ${fr(2, 9)}의 반 → 2번 반 = ${fr(1, 2, 2)}번</p>`,
    ex:`<p>${fr(3, 7)} ÷ ${fr(5, 7)} = 3 ÷ 5 = <b>${fr(3, 5)}</b></p>`, quiz:[['ff-same2', 2]] },
  { title:'분모가 다른 (분수) ÷ (분수)', std:['6수01-11'], key:'분모가 다르면 <b>통분한 다음 분자끼리 나누어요</b>.',
    body:`${E(`${fr(3, 4)} ÷ ${fr(1, 3)} = ${fr(9, 12)} ÷ ${fr(4, 12)} = 9 ÷ 4 = ${fr(9, 4)} = ${fr(1, 4, 2)}`)}`,
    lab: measureLabF(true), ex:`<p>${fr(2, 3)} ÷ ${fr(1, 6)} = ${fr(4, 6)} ÷ ${fr(1, 6)} = 4 ÷ 1 = <b>4</b></p>`, quiz:[['ff-diff', 2], ['ff-cmp', 3]] },
  { title:'(자연수) ÷ (분수)', std:['6수01-11'], key:`■ ÷ ${fr('▲', '●')} = <b>(■ ÷ ▲) × ●</b> = ■ × ${fr('●', '▲')}`,
    body:`<p>물 6 L를 ${fr(2, 3)} L씩 담으면? ${fr(2, 3)} L가 2칸이면 1칸은 ${fr(1, 3)} L → 1 L에 3칸 → 6 L에 …</p>${E(`6 ÷ ${fr(2, 3)} = (6 ÷ 2) × 3 = 9`)}`,
    lab: natDivLab, ex:`<p>10 ÷ ${fr(5, 6)} = (10 ÷ 5) × 6 = <b>12</b></p>`, quiz:[['nuf-div', 1], ['nf-div', 2]] },
  { title:'(분수) ÷ (분수)를 (분수) × (분수)로', std:['6수01-11'], key:`나누는 분수의 <b>분모와 분자를 바꾸어 곱해요</b>. ${fr('■', '▲')} ÷ ${fr('●', '★')} = ${fr('■', '▲')} × ${fr('★', '●')}`,
    body:`${E(`${fr(3, 5)} ÷ ${fr(2, 7)} = ${fr(3, 5)} × ${fr(7, 2)} = ${fr(21, 10)} = ${fr(1, 10, 2)}`)}
      <div class="note">💡 대분수는 가분수로 바꾼 다음 계산해요: ${fr(1, 2, 1)} ÷ ${fr(3, 4)} = ${fr(3, 2)} × ${fr(4, 3)} = 2</div>
      <div class="warn">⚠️ 나누어지는 분수를 바꾸면 안 돼요. 바꾸는 것은 <b>나누는 분수</b>!</div>`,
    ex:`<p>${fr(4, 9)} ÷ ${fr(2, 3)} = ${fr(4, 9)} × ${fr(3, 2)} = ${fr(12, 18)} = <b>${fr(2, 3)}</b></p>`, quiz:[['ff-mul', 2], ['ff-gt1', 3]] },
  { title:'대분수의 나눗셈', std:['6수01-11'], key:'대분수가 있는 나눗셈은 <b>대분수를 가분수로 바꾼 다음</b> 나누는 분수의 분모와 분자를 바꾸어 곱해요.',
    body:`${E(`${fr(1, 4, 2)} ÷ ${fr(3, 5)} = ${fr(9, 4)} ÷ ${fr(3, 5)} = ${fr(9, 4)} × ${fr(5, 3)} = ${fr(15, 4)} = ${fr(3, 4, 3)}`)}
      <div class="warn">⚠️ 자연수 부분만 따로 나누면 안 돼요! 꼭 가분수로 바꾸어요.</div><div class="note">💡 약분할 수 있으면 곱하기 전에 약분하면 계산이 쉬워요.</div>`,
    ex:`<p>${fr(2, 3, 1)} ÷ ${fr(5, 6)} = ${fr(5, 3)} × ${fr(6, 5)} = <b>2</b></p>`, quiz:[['mf-div', 3], ['ff-cmp', 3]] },
  { title:'생활 속 분수의 나눗셈', std:['6수01-11'], key:'"■에 ▲가 몇 번 들어갈까?", "1에 해당하는 양은?"을 구할 때 <b>나눗셈</b>을 써요.',
    body:`<ul><li>🌾 쌀 ${fr(6, 7)} kg을 ${fr(2, 7)} kg씩 → ${fr(6, 7)} ÷ ${fr(2, 7)} = 3 (봉지)</li><li>🚶 ${fr(2, 3)}시간 동안 ${fr(3, 4)} km → 1시간에 ${fr(3, 4)} ÷ ${fr(2, 3)} = ${fr(9, 8)} = ${fr(1, 8, 1)} (km)</li>
      <li>🎨 페인트 ${fr(1, 2)} L로 ${fr(2, 5)} m²를 칠하면 1 L로 ${fr(2, 5)} ÷ ${fr(1, 2)} = ${fr(4, 5)} (m²)</li></ul>`,
    ex:`<p>넓이가 ${fr(5, 6)} m²이고 가로가 ${fr(2, 3)} m인 직사각형의 세로 → ${fr(5, 6)} ÷ ${fr(2, 3)} = ${fr(5, 6)} × ${fr(3, 2)} = <b>${fr(1, 4, 1)} m</b></p>`, quiz:[['ffdiv-word', 3], ['ff-rect', 4], ['ff-speed', 5], ['ff-ineq', 5]] }
]});

/* ═════════════ 2. 공간과 입체 ═════════════ */
add({ key:'6-2-2', title:'공간과 입체', intro:'쌓기나무로 만든 입체도형을 위, 앞, 옆에서 본 모양으로 나타내고, 사용한 쌓기나무의 개수를 구해요.',
  prev:'[4-1] 평면도형의 이동 · [5-2] 직육면체', lessons:[
  { title:'어느 방향에서 보았을까요', std:['6수03-10'], key:'같은 물건도 <b>보는 방향</b>(위, 앞, 옆)에 따라 보이는 모양이 달라요.',
    body:`<p>컵을 위에서 보면 원, 앞에서 보면 사다리꼴 모양처럼 보여요. 사진을 보고 어느 방향에서 찍었는지 알 수 있어요.</p>
      <div class="note">💡 쌓기나무를 셀 때는 위에서 본 모양을 기준으로 생각하면 편리해요.</div>`,
    ex:`<p>원기둥 모양 통 → 위에서 보면 <b>원</b>, 앞에서 보면 <b>직사각형</b></p>`, quiz:[['stack-true', 1], ['view-top', 2]] },
  { title:'쌓기나무의 개수 구하기', std:['6수03-09'], key:'뒤에 숨은 쌓기나무가 있을 수 있어요. <b>위에서 본 모양</b>과 함께 보면 개수를 정확히 알 수 있어요.',
    body:`<div class="figc">${Q6.iso([[2, 2, 1], [1, 2, 1]], 24)}</div><p>보이는 쌓기나무만 세면 뒤쪽 숨은 쌓기나무를 빠뜨릴 수 있어요. 위에서 본 모양을 보고 자리마다 몇 층인지 세요.</p>`,
    lab: stackLab, ex:`<p>위에서 본 모양의 각 자리에 2, 3, 1, 1, 2 → 2 + 3 + 1 + 1 + 2 = <b>9개</b></p>`, quiz:[['stack-iso', 1], ['stack-count', 2]] },
  { title:'위, 앞, 옆에서 본 모양 그리기', std:['6수03-10'], key:'앞에서 보면 <b>세로줄마다</b>, 옆에서 보면 <b>가로줄마다</b> 가장 높은 층의 모양이 보여요.',
    body:`<div class="figc" style="gap:16px;align-items:end;flex-wrap:wrap"><div style="text-align:center">${Q6.topMap([[1, 2, 0], [3, 1, 1], [2, 1, 1]])}<div>위 (수 = 층)</div></div><div style="text-align:center">${Q6.viewSVG([3, 2, 1])}<div>앞</div></div><div style="text-align:center">${Q6.viewSVG([2, 3, 2])}<div>오른쪽 옆</div></div></div>
      <p>앞에서 본 모양: 왼쪽 줄부터 가장 높은 층 3, 2, 1 / 오른쪽 옆: 앞줄부터 2, 3, 2</p>`,
    ex:`<p>위에서 본 모양에 수를 쓰면 앞·옆에서 본 모양을 정확하게 그릴 수 있어요.</p>`, quiz:[['view-front', 2], ['view-side', 3]] },
  { title:'위에서 본 모양에 수를 쓰기', std:['6수03-09', '6수03-10'], key:'위에서 본 모양의 각 자리에 <b>쌓은 쌓기나무의 수</b>를 쓰면, 모양과 개수를 한 번에 알 수 있어요.',
    body:`<div class="figc">${Q6.topMap([[2, 1, 0], [3, 2, 1], [1, 1, 1]])}</div><p>모든 수를 더하면 쌓기나무의 개수: 2 + 1 + 3 + 2 + 1 + 1 + 1 + 1 = <b>12개</b></p>`,
    lab: stackLab, ex:`<p>앞에서 본 모양만으로는 개수를 하나로 정할 수 없지만, 위에서 본 모양에 수를 쓰면 하나로 정해져요.</p>`, quiz:[['stack-count', 2], ['layer1', 1]] },
  { title:'층별로 나타내기', std:['6수03-10'], key:'쌓은 모양을 <b>1층, 2층, 3층</b>으로 나누어 위에서 본 모양으로 그리면 쌓은 모양을 정확히 알 수 있어요.',
    body:`<p>2층에 쌓기나무가 있는 자리에는 반드시 1층에도 쌓기나무가 있어야 해요. (공중에 뜰 수 없으니까!)</p><div class="note">💡 층별 개수를 모두 더하면 전체 개수예요.</div>`,
    ex:`<p>1층 6개, 2층 3개, 3층 1개 → <b>10개</b></p>`, quiz:[['layer-count', 3], ['layer2', 3]] }
,
  { title:'위, 앞, 옆 모양으로 쌓은 모양 추측하기', std:['6수03-10'], key:'위, 앞, 옆에서 본 모양을 모두 만족하도록 위에서 본 모양의 각 자리에 <b>들어갈 수 있는 가장 작은 수와 가장 큰 수</b>를 생각해요.',
    body:`<div class="figc" style="gap:16px;align-items:end;flex-wrap:wrap"><div style="text-align:center">${Q6.topMap([[1, 1, 0], [1, 1, 1], [1, 1, 1]], false)}<div>위</div></div><div style="text-align:center">${Q6.viewSVG([3, 2, 1])}<div>앞</div></div><div style="text-align:center">${Q6.viewSVG([2, 3, 2])}<div>오른쪽 옆</div></div></div>
      <p>각 자리에는 <b>(그 세로줄의 앞 높이)와 (그 가로줄의 옆 높이) 중 작은 수</b>까지 쌓을 수 있어요. 모두 그만큼 쌓으면 가장 많이, 보이는 모양을 겨우 만족하게 쌓으면 가장 적게 사용한 경우예요.</p>`,
    lab: stackLab, ex:`<p>똑같은 모양으로 쌓는 데 필요한 쌓기나무가 여러 가지일 수 있어요 → 가장 적은 개수와 가장 많은 개수를 찾아봐요.</p>`, quiz:[['stack-min', 4], ['stack-max', 5]] }
]});

/* ═════════════ 3. 소수의 나눗셈 ═════════════ */
add({ key:'6-2-3', title:'소수의 나눗셈', intro:'(소수) ÷ (소수), (자연수) ÷ (소수)의 계산 원리를 탐구하고, 몫을 반올림하거나 나누어 주고 남는 양을 구해요.',
  prev:'[5-2] 소수의 곱셈 · [6-1] 소수의 나눗셈', lessons:[
  { title:'자연수의 나눗셈을 이용하기', std:['6수01-15'], key:'나누어지는 수와 나누는 수에 <b>똑같이 10, 100을 곱해도 몫은 같아요</b>.',
    body:`${E('12.6 ÷ 0.3 = 126 ÷ 3 = 42')}<p>12.6 cm를 0.3 cm씩 자르는 것은 126 mm를 3 mm씩 자르는 것과 같아요.</p>`,
    lab: shiftLab, ex:`<p>1.56 ÷ 0.12 = 156 ÷ 12 = <b>13</b></p>`, quiz:[['dd-use', 1]] },
  { title:'자릿수가 같은 (소수) ÷ (소수)', std:['6수01-15'], key:'두 수의 소수점을 <b>똑같이 오른쪽으로 옮겨</b> (자연수) ÷ (자연수)로 계산해요.',
    body:`${E('2.56 ÷ 0.32 → 256 ÷ 32 = 8')}<p>분수로 계산하기: ${fr(256, 100)} ÷ ${fr(32, 100)} = 256 ÷ 32 = 8</p>`,
    ex:`<p>7.2 ÷ 0.8 = 72 ÷ 8 = <b>9</b></p>`, quiz:[['dd-same', 2]] },
  { title:'자릿수가 다른 (소수) ÷ (소수)', std:['6수01-15'], key:'<b>나누는 수가 자연수가 되도록</b> 두 수의 소수점을 똑같이 옮긴 다음 계산해요.',
    body:`${E('5.04 ÷ 1.4 → 50.4 ÷ 14 = 3.6')}<div class="note">💡 504 ÷ 140으로 계산해도 몫은 3.6으로 같아요.</div>
      <div class="warn">⚠️ 한 수의 소수점만 옮기면 몫이 달라져요!</div>`,
    ex:`<p>8.12 ÷ 2.9 → 81.2 ÷ 29 = <b>2.8</b></p>`, quiz:[['dd-diff', 3], ['dd-cmp', 3]] },
  { title:'(자연수) ÷ (소수)', std:['6수01-15'], key:'자연수 뒤에 <b>0을 붙여</b> 나누는 수와 똑같이 소수점을 옮겨요.',
    body:`${E('9 ÷ 0.75 → 900 ÷ 75 = 12')}${E('6 ÷ 1.5 → 60 ÷ 15 = 4')}<div class="note">💡 1보다 작은 수로 나누면 몫은 나누어지는 수보다 커져요.</div>`,
    lab: shiftLab, ex:`<p>12 ÷ 0.4 = 120 ÷ 4 = <b>30</b></p>`, quiz:[['nd-div', 2], ['dd-count', 4]] },
  { title:'몫을 반올림하여 나타내기', std:['6수01-15'], key:'몫이 나누어떨어지지 않으면 구하려는 자리 <b>바로 아래 자리까지</b> 구해서 반올림해요.',
    body:`${E('2.9 ÷ 7 = 0.414…')}<ul><li>소수 첫째 자리까지: 0.41… → <b>0.4</b></li><li>소수 둘째 자리까지: 0.414… → <b>0.41</b></li></ul>`,
    ex:`<p>10 ÷ 3 = 3.333… → 소수 첫째 자리까지 반올림 → <b>3.3</b></p>`, quiz:[['dd-round', 3]] },
  { title:'나누어 주고 남는 양', std:['6수01-15'], key:'몫을 <b>자연수까지만</b> 구하고, 남는 양 = (전체) - (나누는 수) × (몫). 남는 양은 나누는 수보다 작아요.',
    body:`<p>콩 15.4 kg을 3 kg씩 봉지에 담으면?</p>${E('15.4 - 3 × 5 = 0.4')}<p>→ <b>5봉지</b>, 남는 콩 <b>0.4 kg</b></p>
      <div class="warn">⚠️ 남는 양의 소수점은 나누어지는 수의 소수점 위치에 맞춰 내려 찍어요. (4 kg ✗)</div>`,
    lab: remLab, ex:`<p>리본 20.5 m를 6 m씩 → 20.5 - 6 × 3 = 2.5 → <b>3도막, 2.5 m 남음</b></p>`, quiz:[['dd-rem', 3], ['dd-gap', 4], ['dd-wrong', 5]] }
]});

/* ═════════════ 4. 비례식과 비례배분 ═════════════ */
add({ key:'6-2-4', title:'비례식과 비례배분', intro:'비의 성질을 이용해 비를 간단히 나타내고, 비례식의 성질을 이용해 문제를 해결하며 주어진 양을 비례배분해요.',
  prev:'[6-1] 비와 비율', lessons:[
  { title:'비의 성질', std:['6수02-04'], key:'비의 <b>전항과 후항에 0이 아닌 같은 수를 곱하거나 나누어도</b> 비율은 같아요.',
    body:`<p>2 : 3에서 기호 : 앞의 2를 <b>전항</b>, 뒤의 3을 <b>후항</b>이라고 해요.</p>${E('2 : 3 = 4 : 6 = 6 : 9　　12 : 18 = 6 : 9 = 2 : 3')}`,
    lab: ratioPropLab, ex:`<p>5 : 8 = 20 : □ → 전항에 4를 곱했으므로 □ = 8 × 4 = <b>32</b></p>`, quiz:[['ratio-eq', 1], ['ratio-same', 3]] },
  { title:'간단한 자연수의 비로 나타내기', std:['6수02-04'], key:'자연수의 비는 <b>최대공약수로 나누고</b>, 소수의 비는 <b>10, 100을 곱하고</b>, 분수의 비는 <b>분모의 최소공배수를 곱해요</b>.',
    body:`<ul><li>18 : 24 → 최대공약수 6으로 나누기 → <b>3 : 4</b></li><li>0.6 : 1.5 → × 10 → 6 : 15 → ÷ 3 → <b>2 : 5</b></li><li>${fr(1, 2)} : ${fr(2, 3)} → × 6 → <b>3 : 4</b></li></ul>
      <div class="note">💡 소수와 분수가 섞여 있으면 하나로 바꾸어요: 0.5 : ${fr(1, 4)} = ${fr(1, 2)} : ${fr(1, 4)} → × 4 → 2 : 1</div>`,
    ex:`<p>1.2 : ${fr(3, 5)} → 1.2 : 0.6 → × 10 → 12 : 6 → <b>2 : 1</b></p>`, quiz:[['ratio-simp', 2]] },
  { title:'비례식', std:['6수02-04'], key:'비율이 같은 두 비를 등호로 나타낸 식을 <b>비례식</b>이라고 해요. 바깥쪽 두 항은 <b>외항</b>, 안쪽 두 항은 <b>내항</b>이에요.',
    body:`${E('3 : 4 = 9 : 12')}<p>외항: 3과 12 / 내항: 4와 9</p><div class="warn">⚠️ 3 : 4 = 4 : 3은 비율이 달라서 비례식이 아니에요.</div>`,
    ex:`<p>2 : 5 = 6 : 15 → 외항 <b>2, 15</b>, 내항 <b>5, 6</b></p>`, quiz:[['prop-terms', 2], ['prop-check', 2]] },
  { title:'비례식의 성질', std:['6수02-04'], key:'비례식에서 <b>외항의 곱과 내항의 곱은 같아요</b>. 이를 이용해 □를 구해요.',
    body:`${E('3 : 4 = 9 : 12 → 3 × 12 = 36, 4 × 9 = 36')}${E('5 : 2 = □ : 8 → 5 × 8 = 2 × □ → □ = 20')}
      <p>생활 문제: 연필 3자루가 1200원이면 연필 7자루는? 3 : 1200 = 7 : □ → 3 × □ = 8400 → □ = <b>2800원</b></p>`,
    lab: propLab, ex:`<p>가로와 세로의 비가 4 : 3인 사진의 가로가 20 cm → 4 : 3 = 20 : □ → <b>15 cm</b></p>`, quiz:[['prop-solve', 2], ['prop-inner', 4]] },
  { title:'비례식 활용하기', std:['6수02-04'], key:'모르는 양을 □로 놓고 <b>비례식을 세운 다음</b>, 외항의 곱 = 내항의 곱을 이용해 □를 구해요.',
    body:`<ul><li>🚗 3시간 동안 15대를 만들면 9시간 동안은? 3 : 15 = 9 : □ → 3 × □ = 135 → □ = <b>45대</b></li><li>🍝 2인분에 면 180 g이면 5인분은? 2 : 180 = 5 : □ → □ = <b>450 g</b></li>
      <li>📺 가로 : 세로 = 16 : 9, 세로 81 cm → 16 : 9 = □ : 81 → □ = <b>144 cm</b></li></ul><div class="note">💡 비례식을 세울 때 단위가 같은 양끼리 같은 자리에 오도록 해요.</div>`,
    ex:`<p>연필 3자루가 1200원이면 7자루는? 3 : 1200 = 7 : □ → <b>2800원</b></p>`, quiz:[['prop-word', 3], ['prop-recipe', 4]] },
  { title:'비례배분', std:['6수02-05'], key:'전체를 주어진 비로 나누는 것을 <b>비례배분</b>이라고 해요. ■를 가 : 나로 나누면 가 = ■ × (가)/(가 + 나)',
    body:`<p>사탕 30개를 언니와 동생이 2 : 3으로 나누면</p>${E(`언니: 30 × ${fr(2, 5)} = 12　동생: 30 × ${fr(3, 5)} = 18`)}<div class="note">💡 두 사람 몫을 더하면 전체(30)가 되는지 꼭 확인해요.</div>`,
    lab: shareLab, ex:`<p>둘레가 56 cm, 가로 : 세로 = 4 : 3인 직사각형 → 가로 + 세로 = 28 → 가로 28 × ${fr(4, 7)} = <b>16 cm</b></p>`, quiz:[['share', 2], ['share', 3]] }
,
  { title:'비례배분 활용하기', std:['6수02-05'], key:'생활 속에서 <b>전체와 비</b>를 찾아 비례배분하고, 나눈 양을 더하면 전체가 되는지 확인해요.',
    body:`<ul><li>🎟️ 관람객 378명, 어른 : 어린이 = 4 : 5 → 어린이 378 × ${fr(5, 9)} = <b>210명</b></li><li>🍇 주스 1200 mL, 물 : 원액 = 3 : 1 → 원액 1200 × ${fr(1, 4)} = <b>300 mL</b></li>
      <li>🌱 둘레 56 m, 가로 : 세로 = 2 : 5 → 가로 + 세로 = 28 → 세로 28 × ${fr(5, 7)} = <b>20 m</b></li></ul>`,
    ex:`<p>용돈 15000원을 나와 동생이 3 : 2로 → 나 15000 × ${fr(3, 5)} = <b>9000원</b>, 동생 <b>6000원</b></p>`, quiz:[['share-word', 3], ['share-rect', 4]] }
]});

/* ═════════════ 5. 원의 둘레와 넓이 ═════════════ */
add({ key:'6-2-5', title:'원의 둘레와 넓이', intro:'원주와 지름의 관계를 탐구하여 원주율을 알고, 원주와 원의 넓이를 구하는 방법을 이해해요.',
  prev:'[3-2] 원 · [5-1] 다각형의 둘레와 넓이', lessons:[
  { title:'원주와 지름의 관계', std:['6수03-15'], key:'원의 둘레를 <b>원주</b>라고 해요. 원주는 지름의 <b>약 3배</b>이고 원이 커질수록 원주도 커져요.',
    body:`<p>원 안의 정육각형 둘레는 지름의 3배, 원 밖의 정사각형 둘레는 지름의 4배 → (지름) × 3 &lt; (원주) &lt; (지름) × 4</p>`,
    lab: rollLab, ex:`<p>지름 10 cm인 원의 원주 → 30 cm보다 길고 40 cm보다 짧아요.</p>`, quiz:[['circ-ratio', 1]] },
  { title:'원주율', std:['6수03-15'], key:'(원주) ÷ (지름)의 값은 원의 크기와 관계없이 일정해요. 이 값을 <b>원주율</b>이라 하고 <b>3.14</b>, 3.1, 3 등으로 어림해 써요.',
    body:`${tableH([['물건', '지름', '원주', '원주 ÷ 지름'], ['접시', '20 cm', '62.8 cm', '3.14'], ['컵', '8 cm', '25.12 cm', '3.14'], ['훌라후프', '70 cm', '219.8 cm', '3.14']])}
      <div class="note">💡 원주율은 3.1415926535…처럼 끝없이 이어지는 수예요.</div>`,
    ex:`<p>원주가 31.4 cm, 지름이 10 cm → 원주율 31.4 ÷ 10 = <b>3.14</b></p>`, quiz:[['circ-ratio', 2], ['circ-cmp', 3]] },
  { title:'원주와 지름 구하기', std:['6수03-16'], key:'(원주) = <b>(지름) × (원주율)</b>, (지름) = <b>(원주) ÷ (원주율)</b>',
    body:`${E('지름 6 cm → 원주 6 × 3.14 = 18.84 (cm)')}${E('원주 37.68 cm → 지름 37.68 ÷ 3.14 = 12 (cm)')}<div class="warn">⚠️ 반지름이 주어지면 먼저 × 2를 해서 지름을 구해요.</div>`,
    ex:`<p>지름 60 cm인 바퀴가 5바퀴 → 60 × 3.14 × 5 = <b>942 cm</b></p>`, quiz:[['circum', 2], ['diam-from', 3], ['circ-word', 3]] },
  { title:'원의 넓이 어림하기', std:['6수03-16'], key:'원의 넓이는 <b>원 안의 정사각형보다 크고, 원 밖의 정사각형보다 작아요</b>.',
    body:`<div class="figc">${svg(170, 170, '<rect x="15" y="15" width="140" height="140" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/><circle cx="85" cy="85" r="70" fill="#CFE6FA" stroke="#22314A" stroke-width="2"/><polygon points="85,15 155,85 85,155 15,85" fill="#9BE0A6" stroke="#22314A" stroke-width="2"/>')}</div>
      <p>반지름 10 cm → 안쪽 마름모 20 × 20 ÷ 2 = 200 cm², 바깥 정사각형 20 × 20 = 400 cm² → 200 cm² &lt; (원의 넓이) &lt; 400 cm²</p>`,
    lab: gridCircleLab, ex:`<p>모눈종이로 세어 보면 반지름 10 cm인 원의 넓이는 약 <b>314 cm²</b>예요.</p>`, quiz:[['area-est', 2]] },
  { title:'원의 넓이 구하는 방법', std:['6수03-16'], key:'(원의 넓이) = <b>(반지름) × (반지름) × (원주율)</b>',
    body:`<p>원을 잘게 잘라 엇갈리게 붙이면 직사각형에 가까워져요. 가로 = 원주의 반 = (반지름) × (원주율), 세로 = 반지름</p>`,
    lab: sectorLab, ex:`<p>반지름 5 cm → 5 × 5 × 3.14 = <b>78.5 cm²</b></p>`, quiz:[['circle-area', 2], ['area-from-circ', 4]] },
  { title:'여러 가지 원의 넓이', std:['6수03-16'], key:'복잡한 모양은 <b>원, 반원, 정사각형 등으로 나누거나 빼서</b> 넓이를 구해요.',
    body:`<ul><li>🍩 고리 모양 = (큰 원) - (작은 원)</li><li>🌗 반원 = (원의 넓이) ÷ 2</li><li>🎯 정사각형 안에 꽉 찬 원: 한 변 = 지름</li></ul>`,
    ex:`<p>반지름 6 cm 원에서 반지름 3 cm 원을 뺀 고리 → 6 × 6 × 3.14 - 3 × 3 × 3.14 = <b>84.78 cm²</b></p>`, quiz:[['area-ring', 3], ['area-square', 4]] }
,
  { title:'원의 둘레와 넓이 활용하기', std:['6수03-16'], key:'바퀴가 굴러간 거리는 <b>원주 × 바퀴 수</b>, 원 모양 둘레에 일정한 간격으로 놓을 때는 <b>원주 ÷ 간격</b>(+1을 하지 않아요)이에요.',
    body:`<ul><li>🚲 지름 60 cm인 바퀴가 10바퀴 → 60 × 3.14 × 10 = 1884 cm</li><li>🏞️ 지름 100 m인 원 모양 호수 둘레에 15.7 m 간격으로 가로등 → 314 ÷ 15.7 = 20개</li>
      <li>📏 반지름이 2배가 되면 원주는 2배, 넓이는 2 × 2 = 4배</li></ul>`,
    lab: rollLab, ex:`<p>원주가 31.4 cm인 원의 넓이 → 지름 10 cm, 반지름 5 cm → 5 × 5 × 3.14 = <b>78.5 cm²</b></p>`, quiz:[['circ-lamp', 4], ['area-rel', 5], ['circ-word', 3]] }
]});

/* ═════════════ 6. 원기둥, 원뿔, 구 ═════════════ */
add({ key:'6-2-6', title:'원기둥, 원뿔, 구', intro:'원기둥, 원뿔, 구의 구성 요소와 성질을 알아보고, 원기둥의 전개도를 그려요.',
  prev:'[6-1] 각기둥과 각뿔 · [6-2] 원의 둘레와 넓이', lessons:[
  { title:'원기둥', std:['6수03-07'], key:'서로 평행하고 합동인 <b>두 원</b>이 밑면이고, 옆면이 <b>굽은 면</b>인 입체도형을 <b>원기둥</b>이라고 해요.',
    body:`<div class="figc">${svg(200, 170, SOL.rect.solid)}</div><ul><li>밑면 <b>2개</b>(원) · 옆면 <b>1개</b>(굽은 면)</li><li>두 밑면에 수직인 선분의 길이: <b>높이</b></li><li>꼭짓점과 모서리가 <b>없어요</b>.</li></ul>
      <div class="note">💡 각기둥과 같은 점: 밑면 2개가 서로 평행하고 합동 / 다른 점: 밑면 모양(원 ↔ 다각형), 옆면(굽은 면 ↔ 직사각형)</div>`,
    lab: rotLabF('rect'), ex:`<p>통조림 캔, 두루마리 휴지 → <b>원기둥</b> 모양</p>`, quiz:[['cyl-prop', 1], ['solid-compare', 2]] },
  { title:'원기둥의 전개도', std:['6수03-08'], key:'원기둥의 전개도는 <b>밑면(원) 2개</b>와 <b>옆면(직사각형) 1개</b>예요. 옆면의 가로 = <b>밑면의 둘레</b>, 세로 = <b>높이</b>',
    body:`<p>원기둥 모양 상자의 옆면을 잘라 펼치면 직사각형이 돼요.</p>`,
    lab: cylNetLab, ex:`<p>반지름 4 cm, 높이 10 cm → 옆면 가로 8 × 3.14 = 25.12 cm, 세로 10 cm → 옆면 넓이 <b>251.2 cm²</b></p>`, quiz:[['cyl-net', 2], ['cyl-net-area', 3], ['cyl-height', 4]] },
  { title:'원뿔', std:['6수03-07'], key:'밑면이 원이고 옆면이 굽은 면인 뿔 모양의 입체도형을 <b>원뿔</b>이라고 해요. 꼭짓점과 밑면 둘레의 한 점을 이은 선분이 <b>모선</b>이에요.',
    body:`<div class="figc">${svg(200, 170, SOL.tri.solid + line(100, 22, 100, 140, { dash: '5 4', stroke: '#E5546B' }) + txt(112, 90, '높이', { size: 12, fill: '#E5546B', anchor: 'start', bold: true }) + txt(52, 80, '모선', { size: 12, fill: '#2a6fae', bold: true }))}</div>
      <ul><li>밑면 <b>1개</b>(원), 원뿔의 꼭짓점 <b>1개</b></li><li>모선은 셀 수 없이 많고 길이가 모두 같아요.</li><li>모선의 길이는 항상 높이보다 길어요.</li></ul>`,
    lab: rotLabF('tri'), ex:`<p>고깔모자, 아이스크림 콘 → <b>원뿔</b> 모양</p>`, quiz:[['cone-term', 1], ['cone-peri', 3], ['cone-area', 5]] },
  { title:'구', std:['6수03-07'], key:'공 모양의 입체도형을 <b>구</b>라고 해요. 가장 안쪽의 점이 <b>구의 중심</b>, 중심과 겉면의 한 점을 이은 선분이 <b>구의 반지름</b>이에요.',
    body:`<p>구는 어느 방향에서 보아도 <b>원</b> 모양이에요. 구의 반지름은 셀 수 없이 많고 길이가 모두 같아요.</p>`,
    lab: rotLabF('semi'), ex:`<p>반원의 지름을 기준으로 한 바퀴 돌리면 → <b>구</b></p>`, quiz:[['sphere-term', 1], ['sphere-diam', 2], ['rot-solid', 2]] },
  { title:'원기둥, 원뿔, 구 비교하기', std:['6수03-07'], key:'원기둥은 밑면 <b>2개</b>, 원뿔은 밑면 <b>1개</b>와 꼭짓점, 구는 밑면도 꼭짓점도 <b>없어요</b>.',
    body:`${tableH([['', '원기둥', '원뿔', '구'], ['밑면', '2개 (원)', '1개 (원)', '없음'], ['꼭짓점', '없음', '1개', '없음'], ['위에서 본 모양', '원', '원', '원'], ['앞에서 본 모양', '직사각형', '삼각형', '원']])}`,
    ex:`<p>세 입체도형 모두 위에서 보면 <b>원</b>이에요. 앞에서 본 모양이 원인 것은 <b>구</b>뿐!</p>`, quiz:[['solid-compare', 2], ['rot-solid', 3], ['rot-dims', 4]] }
]});
})();
