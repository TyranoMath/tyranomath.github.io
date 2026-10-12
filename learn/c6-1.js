/* =========================================================
   🦖 개념 탐험대 — 6학년 1학기 (2022 개정 교육과정)
   단원마다 탐험(차시): title · key(핵심 한 줄) · body(설명) · lab(직접 해 보기) · ex(예시) · quiz(확인 문제)
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g6-1.js)와 같은 방식으로 새로 만들어져요.
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
const POLY = ['', '', '', '삼각', '사각', '오각', '육각', '칠각', '팔각'];
const pts = P => P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');

/* ---------- 직접 해 보기 ---------- */
// 1) (자연수)÷(자연수) — 똑같이 나누기
const shareLab = { title: '케이크를 똑같이 나누어 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>케이크</label><input type="range" min="1" max="5" value="3" id="sa"><span class="v" id="sav"></span><label>사람 수</label><input type="range" min="2" max="6" value="4" id="sb"><span class="v" id="sbv"></span></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  const draw = () => { const a = +$in(el, '#sa').value, b = +$in(el, '#sb').value, S = 76; $in(el, '#sav').textContent = a; $in(el, '#sbv').textContent = b;
    let g = ''; for (let i = 0; i < a; i++){ const x = 8 + i * (S + 12); for (let j = 0; j < b; j++) g += `<rect x="${(x + j * S / b).toFixed(1)}" y="8" width="${(S / b).toFixed(1)}" height="${S}" fill="${j === 0 ? '#FF9F43' : '#FFE7CC'}" stroke="#22314A" stroke-width="1.4"/>`;
      g += `<rect x="${x}" y="8" width="${S}" height="${S}" fill="none" stroke="#22314A" stroke-width="2.4"/>`; }
    $in(el, '#sf').innerHTML = svg(16 + a * (S + 12), S + 16, g);
    const r = F(a, b);
    $in(el, '#so').innerHTML = `케이크 ${a}개를 ${b}명이 나누면 한 명은 케이크마다 ${fr(1, b)}씩 → ${fr(1, b)}이 ${a}개 → ${a} ÷ ${b} = <b>${fr(a, b)}</b>${r.d !== b || a >= b ? ` = <b>${frH(r)}</b>` : ''}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 2) (분수)÷(자연수)
const fdivLab = { title: '색칠한 부분을 다시 똑같이 나누기', init(el){
  const B = [[2, 3], [3, 4], [4, 5], [3, 5], [5, 6]];
  el.innerHTML = `<div class="ctrl">${B.map((f, i) => `<button class="tbtn" type="button" data-b="${i}" aria-pressed="${i === 3}">${fr(...f)}</button>`).join('')}</div>
    <div class="ctrl"><label>÷</label><input type="range" min="2" max="4" value="2" id="fk"><span class="v" id="fkv"></span></div><div class="figc" id="ff"></div><div class="out" id="fo"></div>`;
  let bi = 3;
  const draw = () => { const [n, d] = B[bi], k = +$in(el, '#fk').value, S = 240; $in(el, '#fkv').textContent = k;
    let g = ''; for (let i = 0; i < k; i++) for (let j = 0; j < d; j++){ const on = j < n; g += `<rect x="${(10 + j * S / d).toFixed(1)}" y="${(10 + i * S / k / 1.6).toFixed(1)}" width="${(S / d).toFixed(1)}" height="${(S / k / 1.6).toFixed(1)}" fill="${on ? (i === 0 ? '#2F8A47' : '#9BE0A6') : '#fff'}" stroke="#9AA6B8" stroke-width="1.2"/>`; }
    g += `<rect x="10" y="10" width="${S}" height="${S / 1.6}" fill="none" stroke="#22314A" stroke-width="2.4"/>`;
    $in(el, '#ff').innerHTML = svg(S + 20, S / 1.6 + 20, g);
    const r = F(n, d * k);
    $in(el, '#fo').innerHTML = `${fr(n, d)}를 ${k}로 나누면 진한 초록 부분: 전체 ${d * k}칸 중 ${n}칸 → ${fr(n, d)} ÷ ${k} = ${fr(n, d)} × ${fr(1, k)} = <b>${fr(n, d * k)}</b>${r.d !== d * k ? ` = <b>${frH(r)}</b>` : ''}`; };
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => { bi = +b.dataset.b; press(el, '[data-b]', b); draw(); }));
  $in(el, '#fk').addEventListener('input', draw); draw();
} };
// 3) 각기둥·각뿔 겨냥도
const solidSVG = (n, pyr) => { const cx = 150, R = 95, r = 32, yb = 205, H = 150, th = k => Math.PI / 2 + Math.PI / n + 0.3 + 2 * Math.PI * k / n;
  const B = range(0, n - 1).map(k => [cx + R * Math.cos(th(k)), yb + r * Math.sin(th(k))]), T = B.map(p => [p[0], p[1] - H]), apex = [cx, yb - H - 10];
  // 앞쪽 테두리(가장 왼쪽 → 가장 오른쪽, 앞으로 도는 길)에 있는 꼭짓점과 모서리는 실선, 나머지는 점선
  const Li = B.reduce((m, p, i) => p[0] < B[m][0] ? i : m, 0), Ri = B.reduce((m, p, i) => p[0] > B[m][0] ? i : m, 0);
  const walk = d => { const out = [Li]; let k = Li; while (k !== Ri){ k = (k + d + n) % n; out.push(k); } return out; };
  const my = w => w.length > 2 ? w.slice(1, -1).reduce((a, k) => a + B[k][1], 0) / (w.length - 2) : (B[w[0]][1] + B[w[1]][1]) / 2, fw = my(walk(1)) >= my(walk(-1)) ? walk(1) : walk(-1), front = new Set(fw), fEdge = new Set(fw.slice(1).map((k, i) => [k, fw[i]].sort().join()));
  const L = (p, q, dash) => line(p[0], p[1], q[0], q[1], { w: 2.2, dash: dash ? '6 5' : '', stroke: dash ? '#7A8699' : '#22314A' });
  let g = `<polygon points="${pts(pyr ? B : T)}" fill="${pyr ? '#DFF3E3' : '#FFE7A8'}" opacity=".55"/>`;
  for (let k = 0; k < n; k++){ const k2 = (k + 1) % n; g += L(B[k], B[k2], !fEdge.has([k, k2].sort().join())); }
  for (let k = 0; k < n; k++){ if (pyr) g += L(B[k], apex, !front.has(k)); else { g += L(B[k], T[k], !front.has(k)); g += L(T[k], T[(k + 1) % n], false); } }
  if (pyr) g += `<circle cx="${apex[0]}" cy="${apex[1]}" r="4" fill="#E5546B"/>`;
  return svg(300, 250, g); };
const prismLabF = start => ({ title: start ? '밑면의 변의 수를 바꾸며 각뿔 살펴보기' : '밑면의 변의 수를 바꾸며 각기둥과 각뿔 살펴보기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" data-k="0" aria-pressed="${!start}">각기둥</button><button class="tbtn" type="button" data-k="1" aria-pressed="${!!start}">각뿔</button></div>
    <div class="ctrl"><label>밑면의 변의 수</label><input type="range" min="3" max="8" value="3" id="pn"><span class="v" id="pnv"></span></div><div class="figc" id="pf"></div><div id="pt"></div><div class="out" id="po"></div>`;
  let pyr = !!start;
  const draw = () => { const n = +$in(el, '#pn').value; $in(el, '#pnv').textContent = n;
    $in(el, '#pf').innerHTML = solidSVG(n, pyr);
    $in(el, '#pt').innerHTML = pyr ? tableH([['', '꼭짓점', '면', '모서리'], [`${POLY[n]}뿔`, n + 1, n + 1, 2 * n], ['규칙', '■ + 1', '■ + 1', '■ × 2']]) : tableH([['', '꼭짓점', '면', '모서리'], [`${POLY[n]}기둥`, 2 * n, n + 2, 3 * n], ['규칙', '■ × 2', '■ + 2', '■ × 3']]);
    $in(el, '#po').innerHTML = pyr ? `밑면 <b>1개</b>(${POLY[n]}형) · 옆면 <b>삼각형 ${n}개</b> · 빨간 점이 각뿔의 꼭짓점` : `서로 평행하고 합동인 밑면 <b>2개</b>(${POLY[n]}형) · 옆면 <b>직사각형 ${n}개</b>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { pyr = b.dataset.k === '1'; press(el, '[data-k]', b); draw(); }));
  $in(el, '#pn').addEventListener('input', draw); draw();
} });
// 4) 각기둥 전개도
const prismNetLab = { title: '각기둥의 전개도 펼쳐 보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>밑면의 변의 수</label><input type="range" min="3" max="6" value="4" id="nn"><span class="v" id="nnv"></span><label>높이</label><input type="range" min="2" max="5" value="3" id="nh"><span class="v" id="nhv"></span></div><div class="figc" id="nf"></div><div class="out" id="no"></div>`;
  const draw = () => { const n = +$in(el, '#nn').value, h = +$in(el, '#nh').value, a = 2, k = 26; $in(el, '#nnv').textContent = n; $in(el, '#nhv').textContent = h;
    const x0 = 14, y0 = 14 + a * k * 1.8, W = a * k, Hh = h * k; let g = '';
    const poly = (p0, p1, up) => { const P = [p0, p1]; let dir = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]); for (let i = 2; i < n; i++){ dir += (up ? -1 : 1) * 2 * Math.PI / n; const q = P[P.length - 1]; P.push([q[0] + W * Math.cos(dir), q[1] + W * Math.sin(dir)]); } return P; };
    for (let i = 0; i < n; i++) g += `<rect x="${x0 + i * W}" y="${y0}" width="${W}" height="${Hh}" fill="#FFE7A8" stroke="#22314A" stroke-width="2"/>`;
    const top = poly([x0 + W, y0], [x0 + 2 * W, y0], true), bot = poly([x0 + W, y0 + Hh], [x0 + 2 * W, y0 + Hh], false);
    g += `<polygon points="${pts(top)}" fill="#CFE6FA" stroke="#22314A" stroke-width="2"/><polygon points="${pts(bot)}" fill="#CFE6FA" stroke="#22314A" stroke-width="2"/>`;
    for (let i = 1; i < n; i++) g += line(x0 + i * W, y0, x0 + i * W, y0 + Hh, { dash: '5 4' });
    g += line(x0 + W, y0, x0 + 2 * W, y0, { dash: '5 4' }) + line(x0 + W, y0 + Hh, x0 + 2 * W, y0 + Hh, { dash: '5 4' });
    g += txt(x0 + n * W / 2, y0 + Hh + a * k * 1.8 + 14, `옆면을 이은 가로 = 밑면의 둘레 = ${a} × ${n} = ${a * n} cm`, { size: 13, fill: '#2a6fae', bold: true });
    $in(el, '#nf').innerHTML = svg(Math.max(x0 * 2 + n * W, 360), y0 + Hh + a * k * 1.8 + 30, g);
    $in(el, '#no').innerHTML = `${POLY[n]}기둥의 전개도: 밑면(파랑) <b>2개</b>, 옆면(노랑 직사각형) <b>${n}개</b> · 접히는 선은 점선, 잘린 선은 실선`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 5) 소수의 나눗셈 세 가지 방법
const longDiv = (s, k) => { const ip = s.split('.')[0], dp = s.split('.')[1] || '', dg = (ip + dp).split('').map(Number), il = ip.length;
  let rem = 0, q = [], steps = [], i = 0;
  while ((i < dg.length || rem) && i < dg.length + 4){ const d = i < dg.length ? dg[i] : 0, cur = rem * 10 + d, qd = Math.floor(cur / k); rem = cur - qd * k; q.push(qd);
    if (cur >= k || i >= il - 1) steps.push(`${i < dg.length ? '' : '0을 내려 '}${cur} ÷ ${k} = ${qd} … ${rem}`); i++; }
  const qs = q.join(''), qi = qs.slice(0, il).replace(/^0+(?=\d)/, ''), qd = qs.slice(il);
  return { steps, quot: qd.length ? `${qi}.${qd}` : qi }; };
const decDivLabF = start => ({ title: '(소수) ÷ (자연수)를 세 가지 방법으로', init(el){
  const P = [['6.3', 5], ['8.24', 4], ['2.34', 3], ['48.4', 4], ['7', 4], ['5.13', 9]];
  el.innerHTML = `<div class="ctrl">${P.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === start}">${p[0]} ÷ ${p[1]}</button>`).join('')}</div><div id="dd"></div>`;
  let pi = start;
  const draw = () => { const [s, k] = P[pi], x = +s, dpl = (s.split('.')[1] || '').length, sh = Math.max(dpl, 2), m = 10 ** sh, ld = longDiv(s, k);
    $in(el, '#dd').innerHTML = `<div class="out">① 분수로: ${s} ÷ ${k} = ${fr(Math.round(x * m), m)} ÷ ${k} = ${fr(Math.round(x * m) / k, m)} = <b>${nf(dz(x / k))}</b></div>
      <div class="out">② 자연수의 나눗셈으로: ${Math.round(x * m)} ÷ ${k} = ${Math.round(x * m) / k} → ${fr(1, m)}배 → <b>${nf(dz(x / k))}</b></div>
      <div class="out">③ 세로셈 순서 (높은 자리부터):</div><ol style="font-family:Fredoka,sans-serif;font-size:17px;max-width:420px;margin:4px auto">${ld.steps.map(t => `<li>${t}</li>`).join('')}</ol>
      <div class="out">몫: <b>${ld.quot}</b> — 몫의 소수점은 나누어지는 수의 소수점 위치에 맞춰 올려 찍어요.</div>`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; press(el, '[data-p]', b); draw(); })); draw();
} });
// 6) 비와 비율
const ratioLab = { title: '비교하는 양과 기준량을 바꾸며 비율 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>비교하는 양</label><input type="range" min="0" max="20" value="3" id="ra"><span class="v" id="rav"></span><label>기준량</label><input type="range" min="1" max="20" value="5" id="rb"><span class="v" id="rbv"></span></div><div class="figc" id="rf"></div><div id="rt"></div>`;
  const draw = () => { const a = +$in(el, '#ra').value, b = +$in(el, '#rb').value, sz = 22, cols = Math.max(a, b); $in(el, '#rav').textContent = a; $in(el, '#rbv').textContent = b;
    let g = txt(40, 22, '기준량', { size: 13, bold: true }) + txt(40, 54, '비교하는 양', { size: 12, bold: true });
    for (let i = 0; i < b; i++) g += `<rect x="${84 + i * sz}" y="11" width="${sz}" height="${sz}" fill="#8EC5F4" stroke="#22314A" stroke-width="1.2"/>`;
    for (let i = 0; i < a; i++) g += `<rect x="${84 + i * sz}" y="43" width="${sz}" height="${sz}" fill="#FFC56B" stroke="#22314A" stroke-width="1.2"/>`;
    $in(el, '#rf').innerHTML = svg(96 + cols * sz, 74, g);
    const r = a / b, dec = Number.isInteger(dz(r * 1000)) ? nf(dz(r)) : `약 ${nf(Math.round(r * 100) / 100)}`, pc = Number.isInteger(dz(r * 1000)) ? nf(dz(r * 100)) : `약 ${nf(Math.round(r * 1000) / 10)}`;
    $in(el, '#rt').innerHTML = tableH([['비', `<b>${a} : ${b}</b> (${b}에 대한 ${a}의 비)`], ['비율 (분수)', `${a} ÷ ${b} = ${fr(a, b)}${a && gcd(a, b) > 1 ? ` = ${frH(F(a, b), { improper: true })}` : ''}`], ['비율 (소수)', dec], ['백분율', `${pc}%`]]); };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 7) 띠그래프와 원그래프
const graphLab = { title: '자료를 바꾸며 띠그래프와 원그래프 그리기', init(el){
  const NM = ['과자', '과일', '빵', '기타'];
  el.innerHTML = `<div class="ctrl" style="gap:6px 14px">${NM.map((n, i) => `<label>${n}</label><input type="range" min="0" max="12" value="${[8, 6, 4, 2][i]}" data-i="${i}" style="width:min(120px,24vw)"><span class="v" id="gv${i}"></span>`).join('')}</div>
    <div class="ctrl"><button class="tbtn" type="button" data-g="band" aria-pressed="true">띠그래프</button><button class="tbtn" type="button" data-g="pie" aria-pressed="false">원그래프</button></div><div class="figc" id="gf"></div><div id="gt"></div><div class="out" id="go"></div>`;
  let mode = 'band';
  const draw = () => { const v = [...el.querySelectorAll('[data-i]')].map(i => +i.value); v.forEach((x, i) => { $in(el, '#gv' + i).textContent = x; });
    const tot = v.reduce((a, b) => a + b, 0) || 1, p = v.map(x => Math.round(x / tot * 100)), items = NM.map((n, i) => ({ n, p: p[i] })).filter(it => it.p > 0);
    $in(el, '#gf').innerHTML = mode === 'band' ? Q6.band(items) : Q6.pie(items, 95);
    $in(el, '#gt').innerHTML = tableH([['간식', ...NM, '합계'], ['학생 수(명)', ...v, tot], ['백분율(%)', ...p, p.reduce((a, b) => a + b, 0)]]);
    $in(el, '#go').innerHTML = `(백분율) = (항목의 수) ÷ (전체 수) × 100 · 예) 과자: ${v[0]} ÷ ${tot} × 100 ≈ <b>${p[0]}%</b>${p.reduce((a, b) => a + b, 0) !== 100 ? '<br>반올림 때문에 합계가 100%가 아니면, 가장 큰 항목에서 조정해요.' : ''}`; };
  el.querySelectorAll('[data-i]').forEach(i => i.addEventListener('input', draw));
  el.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.g; press(el, '[data-g]', b); draw(); })); draw();
} };
// 8) 쌓기나무로 부피
const volLab = { title: '1 cm³ 쌓기나무로 직육면체 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="1" max="5" value="4" id="va"><span class="v" id="vav"></span><label>세로</label><input type="range" min="1" max="4" value="2" id="vb"><span class="v" id="vbv"></span><label>높이</label><input type="range" min="1" max="4" value="3" id="vc"><span class="v" id="vcv"></span></div><div class="figc" id="vf"></div><div class="out" id="vo"></div>`;
  const draw = () => { const a = +$in(el, '#va').value, b = +$in(el, '#vb').value, c = +$in(el, '#vc').value; $in(el, '#vav').textContent = a; $in(el, '#vbv').textContent = b; $in(el, '#vcv').textContent = c;
    $in(el, '#vf').innerHTML = Q6.iso(range(1, b).map(() => range(1, a).map(() => c)), 26);
    $in(el, '#vo').innerHTML = `한 층에 ${a} × ${b} = ${a * b}개, ${c}층 → 쌓기나무 <b>${a * b * c}개</b> = 부피 <b>${a * b * c} cm³</b><br>겉넓이: (${a * b} + ${b * c} + ${a * c}) × 2 = <b>${2 * (a * b + b * c + a * c)} cm²</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

// 9) 백분율 — 100칸 모눈
const percentLab = { title: '100칸 모눈으로 백분율 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>비교하는 양</label><input type="range" min="0" max="25" value="7" id="pa"><span class="v" id="pav"></span><label>기준량</label><select id="pb" class="tbtn">${[2, 4, 5, 10, 20, 25].map(b => `<option value="${b}"${b === 20 ? ' selected' : ''}>${b}</option>`).join('')}</select></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  const draw = () => { const b = +$in(el, '#pb').value, ain = $in(el, '#pa'); ain.max = b; if (+ain.value > b) ain.value = b; const a = +ain.value, pc = a * 100 / b, sz = 20; $in(el, '#pav').textContent = a;
    let g = ''; for (let i = 0; i < 100; i++) g += `<rect x="${4 + (i % 10) * sz}" y="${4 + Math.floor(i / 10) * sz}" width="${sz}" height="${sz}" fill="${i < pc ? '#FFC56B' : '#fff'}" stroke="#9AA6B8" stroke-width="1"/>`;
    $in(el, '#pf').innerHTML = svg(8 + 10 * sz, 8 + 10 * sz, g);
    $in(el, '#po').innerHTML = `비율 ${a} ÷ ${b} = ${fr(a, b)} = ${fr(pc, 100)} → 기준량을 100으로 보면 <b>${pc}칸</b> → <b>${pc}%</b>`; };
  el.querySelectorAll('input,select').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 10) 직육면체 겉넓이 — 전개도
const surfaceLab = { title: '전개도로 직육면체의 겉넓이 구하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="1" max="6" value="4" id="sa"><span class="v" id="sav"></span><label>세로</label><input type="range" min="1" max="5" value="2" id="sb"><span class="v" id="sbv"></span><label>높이</label><input type="range" min="1" max="5" value="3" id="sc"><span class="v" id="scv"></span></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  const draw = () => { const a = +$in(el, '#sa').value, b = +$in(el, '#sb').value, c = +$in(el, '#sc').value, k = 22; $in(el, '#sav').textContent = a; $in(el, '#sbv').textContent = b; $in(el, '#scv').textContent = c;
    const R = (x, y, w, h, f, t) => `<rect x="${10 + x * k}" y="${10 + y * k}" width="${w * k}" height="${h * k}" fill="${f}" stroke="#22314A" stroke-width="1.8"/>` + txt(10 + (x + w / 2) * k, 10 + (y + h / 2) * k, t, { size: 12, bold: true });
    let g = R(0, b, b, c, '#CFE6FA', b * c) + R(b, b, a, c, '#FFE7A8', a * c) + R(b + a, b, b, c, '#CFE6FA', b * c) + R(2 * b + a, b, a, c, '#FFE7A8', a * c) + R(b, 0, a, b, '#DFF3E3', a * b) + R(b, b + c, a, b, '#DFF3E3', a * b);
    $in(el, '#sf').innerHTML = svg(20 + (2 * a + 2 * b) * k, 20 + (2 * b + c) * k, g);
    $in(el, '#so').innerHTML = `같은 색 면은 넓이가 같아요(마주 보는 면). 겉넓이 = (${a * b} + ${b * c} + ${a * c}) × 2 = <b>${2 * (a * b + b * c + a * c)} cm²</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 1. 분수의 나눗셈 ═════════════ */
add({ key:'6-1-1', title:'분수의 나눗셈', intro:'(자연수) ÷ (자연수)의 몫을 분수로 나타내고, (분수) ÷ (자연수)의 계산 원리를 그림으로 탐구해요.',
  prev:'[5-1] 약분과 통분 · [5-2] 분수의 곱셈', lessons:[
  { title:'(자연수) ÷ (자연수)의 몫을 분수로 (1)', std:['6수01-10'], key:`■ ÷ ▲의 몫은 <b>${fr('■', '▲')}</b>로 나타낼 수 있어요. 나누어지는 수가 분자, 나누는 수가 분모!`,
    body:`<p>케이크 1개를 3명이 똑같이 나누면 한 명은 ${fr(1, 3)}개 → 1 ÷ 3 = ${fr(1, 3)}</p><p>케이크 3개를 4명이 똑같이 나누면 한 명은 ${fr(1, 4)}이 3개 → 3 ÷ 4 = ${fr(3, 4)}</p>
      <div class="note">💡 1 ÷ ▲ = ${fr(1, '▲')}, ■ ÷ ▲는 ${fr(1, '▲')}이 ■개</div>`,
    lab: shareLab, ex:`<p>5 ÷ 8 = <b>${fr(5, 8)}</b>　　2 ÷ 6 = ${fr(2, 6)} = <b>${fr(1, 3)}</b></p>`, quiz:[['nn-frac', 1]] },
  { title:'(자연수) ÷ (자연수)의 몫을 분수로 (2)', std:['6수01-10'], key:'나누어지는 수가 나누는 수보다 크면 몫은 <b>가분수</b>가 되고, <b>대분수</b>로 바꾸어 나타낼 수 있어요.',
    body:`${E(`7 ÷ 3 = ${fr(7, 3)} = ${fr(1, 3, 2)}`)}<p>7 ÷ 3 = 2 … 1 → 몫 2, 나머지 1을 다시 3으로 나누면 ${fr(1, 3)} → 합쳐서 ${fr(1, 3, 2)}</p>`,
    ex:`<p>11 ÷ 4 = ${fr(11, 4)} = <b>${fr(3, 4, 2)}</b></p>`, quiz:[['nn-frac2', 2], ['nn-word', 2]] },
  { title:'(분수) ÷ (자연수) — 분자가 자연수의 배수일 때', std:['6수01-11'], key:'분자가 나누는 자연수의 배수이면 <b>분자를 자연수로 나누어요</b>. 분모는 그대로!',
    body:`${E(`${fr(6, 7)} ÷ 3 = ${fr('6 ÷ 3', 7)} = ${fr(2, 7)}`)}<p>${fr(1, 7)}이 6개인 것을 3묶음으로 나누면 한 묶음은 ${fr(1, 7)}이 2개예요.</p>`,
    lab: fdivLab, ex:`<p>${fr(8, 9)} ÷ 4 = ${fr('8 ÷ 4', 9)} = <b>${fr(2, 9)}</b></p>`, quiz:[['fn-mul', 1]] },
  { title:'(분수) ÷ (자연수) — 곱셈으로 바꾸기', std:['6수01-11'], key:`(분수) ÷ ▲는 <b>(분수) × ${fr(1, '▲')}</b>와 같아요.`,
    body:`<p>${fr(3, 5)} ÷ 2: 분자 3은 2로 나누어떨어지지 않아요. 크기가 같은 분수로 바꾸면 ${fr(6, 10)} ÷ 2 = ${fr(3, 10)}</p>
      ${E(`${fr(3, 5)} ÷ 2 = ${fr(3, 5)} × ${fr(1, 2)} = ${fr(3, 10)}`)}<div class="note">💡 ÷ 2는 "반으로 나누기" = "${fr(1, 2)} 곱하기"와 같아요.</div>`,
    ex:`<p>${fr(4, 7)} ÷ 3 = ${fr(4, 7)} × ${fr(1, 3)} = <b>${fr(4, 21)}</b></p>`, quiz:[['fn-gen', 2], ['fn-cmp', 3]] },
  { title:'(대분수) ÷ (자연수)', std:['6수01-11'], key:'대분수는 <b>가분수로 바꾼 다음</b> 나누거나 × (1/자연수)로 계산해요.',
    body:`${E(`${fr(1, 4, 2)} ÷ 3 = ${fr(9, 4)} ÷ 3 = ${fr('9 ÷ 3', 4)} = ${fr(3, 4)}`)}${E(`${fr(2, 5, 1)} ÷ 4 = ${fr(7, 5)} × ${fr(1, 4)} = ${fr(7, 20)}`)}
      <div class="note">💡 자연수 부분과 분수 부분이 모두 나누어떨어지면 따로 나누어도 돼요: ${fr(3, 5, 6)} ÷ 3 = ${fr(1, 5, 2)}</div>`,
    ex:`<p>${fr(2, 3, 3)} ÷ 2 = ${fr(11, 3)} × ${fr(1, 2)} = ${fr(11, 6)} = <b>${fr(5, 6, 1)}</b></p>`, quiz:[['mn-div', 3], ['fn-ineq', 4]] },
  { title:'생활 속 분수의 나눗셈', std:['6수01-11'], key:'"똑같이 나누기"는 나눗셈으로 식을 세워요. 몫이 나누어떨어지지 않으면 <b>분수로</b> 나타내요.',
    body:`<ul><li>🎀 리본 ${fr(4, 5)} m를 2명이 똑같이 → ${fr(4, 5)} ÷ 2 = ${fr(2, 5)} (m)</li><li>🧃 주스 5 L를 3병에 똑같이 → 5 ÷ 3 = ${fr(2, 3, 1)} (L)</li>
      <li>⬛ 넓이가 ${fr(3, 4)} m²인 직사각형의 가로가 3 m → 세로 = ${fr(3, 4)} ÷ 3 = ${fr(1, 4)} (m)</li></ul>`,
    ex:`<p>밀가루 ${fr(2, 3, 2)} kg을 4일 동안 똑같이 → ${fr(8, 3)} ÷ 4 = <b>${fr(2, 3)} kg</b></p>`, quiz:[['fdiv-word', 3], ['fn-area', 3], ['fn-wrong', 4], ['fdiv-who', 4], ['fn-cards', 5]] }
]});

/* ═════════════ 2. 각기둥과 각뿔 ═════════════ */
add({ key:'6-1-2', title:'각기둥과 각뿔', intro:'각기둥과 각뿔의 뜻과 구성 요소를 알아보고, 규칙을 찾아 꼭짓점·면·모서리의 수를 구하며 각기둥의 전개도를 그려요.',
  prev:'[5-2] 직육면체 · [4-2] 다각형', lessons:[
  { title:'각기둥', std:['6수03-05'], key:'서로 평행하고 합동인 두 다각형이 있는 입체도형을 <b>각기둥</b>이라고 해요. 두 면을 <b>밑면</b>, 밑면에 수직인 면을 <b>옆면</b>이라고 해요.',
    body:`<div class="figc">${solidSVG(5, false)}</div><ul><li>밑면: 서로 평행하고 합동, <b>2개</b></li><li>옆면: 모두 <b>직사각형</b></li><li>이름은 밑면의 모양에 따라 삼각기둥, 사각기둥, 오각기둥…</li></ul>
      <div class="note">💡 직육면체는 밑면이 사각형이니까 사각기둥이에요.</div>`,
    lab: prismLabF(false), ex:`<p>밑면이 육각형인 각기둥 → <b>육각기둥</b> (옆면은 직사각형 6개)</p>`, quiz:[['pr-name', 1], ['pr-perp', 2], ['pp-true', 2]] },
  { title:'각기둥의 구성 요소', std:['6수03-05'], key:'■각기둥의 <b>꼭짓점은 ■ × 2</b>, <b>면은 ■ + 2</b>, <b>모서리는 ■ × 3</b>개예요.',
    body:`<p>면과 면이 만나는 선분이 <b>모서리</b>, 모서리와 모서리가 만나는 점이 <b>꼭짓점</b>, 두 밑면 사이의 거리가 <b>높이</b>예요.</p>
      ${tableH([['', '꼭짓점', '면', '모서리'], ['삼각기둥', 6, 5, 9], ['사각기둥', 8, 6, 12], ['오각기둥', 10, 7, 15]])}`,
    ex:`<p>팔각기둥 → 꼭짓점 16개, 면 10개, 모서리 <b>24개</b></p>`, quiz:[['pr-count', 2], ['pp-rev', 3], ['pp-sum', 4]] },
  { title:'각기둥의 전개도', std:['6수03-06'], key:'각기둥의 전개도에는 <b>합동인 밑면 2개</b>와 <b>옆면(직사각형)이 밑면의 변의 수만큼</b> 있어요. 옆면을 이은 가로는 밑면의 둘레와 같아요.',
    body:`<p>전개도를 접었을 때 맞닿는 선분의 길이는 같아야 해요. 잘린 모서리는 실선, 접는 선은 점선으로 그려요.</p>`,
    lab: prismNetLab, ex:`<p>밑면이 한 변 3 cm인 정삼각형, 높이 7 cm인 삼각기둥의 모든 모서리 길이의 합 → 3 × 6 + 7 × 3 = <b>39 cm</b></p>`, quiz:[['pr-net', 2], ['pr-net-len', 3]] },
  { title:'각기둥의 전개도 그려 보기', std:['6수03-06'], key:'전개도를 그릴 때는 <b>밑면의 모양과 수</b>, <b>옆면의 수</b>, <b>맞닿는 모서리의 길이</b>가 같은지 확인해요.',
    body:`<div class="figc" style="gap:18px;flex-wrap:wrap">${Q6.prismNet(3)}${Q6.prismNet(5)}</div><ol><li>옆면(직사각형)을 밑면의 변의 수만큼 이어 그려요.</li><li>옆면의 위와 아래에 합동인 밑면을 하나씩 붙여요.</li><li>잘린 모서리는 실선, 접히는 모서리는 점선으로 그려요.</li></ol>
      <div class="warn">⚠️ 두 밑면을 옆면의 같은 쪽에 붙이면 접었을 때 겹쳐서 각기둥이 되지 않아요.</div>`,
    ex:`<p>밑면이 한 변 4 cm인 정오각형이고 높이가 6 cm인 오각기둥의 전개도 → 옆면을 이은 직사각형: 가로 4 × 5 = <b>20 cm</b>, 세로 <b>6 cm</b></p>`, quiz:[['pr-net-len', 3], ['pr-edgesum', 3]] },
  { title:'각뿔', std:['6수03-05'], key:'밑면이 다각형이고 옆면이 모두 <b>삼각형</b>인 입체도형을 <b>각뿔</b>이라고 해요. 밑면은 <b>1개</b>예요.',
    body:`<div class="figc">${solidSVG(4, true)}</div><ul><li>이름은 밑면의 모양에 따라 삼각뿔, 사각뿔, 오각뿔…</li><li>옆면이 모두 만나는 점: <b>각뿔의 꼭짓점</b> (빨간 점)</li><li>각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이: <b>높이</b></li></ul>`,
    lab: prismLabF(true), ex:`<p>이집트의 피라미드 모양 → 밑면이 사각형이므로 <b>사각뿔</b></p>`, quiz:[['py-name', 1], ['pp-true', 2]] },
  { title:'각뿔의 구성 요소', std:['6수03-05'], key:'■각뿔의 <b>꼭짓점은 ■ + 1</b>, <b>면은 ■ + 1</b>, <b>모서리는 ■ × 2</b>개예요.',
    body:`${tableH([['', '꼭짓점', '면', '모서리'], ['삼각뿔', 4, 4, 6], ['사각뿔', 5, 5, 8], ['오각뿔', 6, 6, 10]])}
      <div class="note">💡 각뿔은 꼭짓점의 수와 면의 수가 항상 같아요!</div>`,
    ex:`<p>모서리가 14개인 각뿔 → 14 ÷ 2 = 7 → <b>칠각뿔</b></p>`, quiz:[['py-count', 2], ['pp-rev', 3], ['py-edgesum', 4], ['pp-sum', 5]] }
]});

/* ═════════════ 3. 소수의 나눗셈 ═════════════ */
add({ key:'6-1-3', title:'소수의 나눗셈', intro:'(소수) ÷ (자연수)의 계산 원리를 자연수의 나눗셈과 분수의 나눗셈으로 탐구하고, (자연수) ÷ (자연수)의 몫을 소수로 나타내요.',
  prev:'[5-2] 소수의 곱셈 · 6-1 분수의 나눗셈', lessons:[
  { title:'자연수의 나눗셈을 이용하기', std:['6수01-15'], key:'나누는 수가 같을 때 나누어지는 수가 <b>1/10배, 1/100배</b>가 되면 몫도 <b>1/10배, 1/100배</b>가 돼요.',
    body:`${E('484 ÷ 4 = 121')}${E('48.4 ÷ 4 = 12.1　　4.84 ÷ 4 = 1.21')}<p>48.4는 484의 ${fr(1, 10)}배이므로 몫도 121의 ${fr(1, 10)}배예요.</p>`,
    lab: decDivLabF(3), ex:`<p>369 ÷ 3 = 123 → 3.69 ÷ 3 = <b>1.23</b></p>`, quiz:[['dn-use', 1]] },
  { title:'(소수) ÷ (자연수)', std:['6수01-15'], key:'자연수의 나눗셈처럼 계산하고, 몫의 소수점은 <b>나누어지는 수의 소수점 위치에 맞추어</b> 찍어요.',
    body:`${E('6.48 ÷ 2 = 3.24')}<p>분수로 계산하기: 6.48 ÷ 2 = ${fr(648, 100)} ÷ 2 = ${fr(324, 100)} = 3.24</p>
      <div class="note">💡 몫이 1보다 작으면 일의 자리에 0을 써요: 2.34 ÷ 3 = 0.78</div>`,
    ex:`<p>9.45 ÷ 5 = <b>1.89</b>　　1.26 ÷ 6 = <b>0.21</b></p>`, quiz:[['dn-basic', 1], ['dn-small', 2]] },
  { title:'소수점 아래 0을 내려 계산하기', std:['6수01-15'], key:'나누어떨어지지 않으면 소수점 아래 끝자리에 <b>0이 있는 것으로 보고 내려서</b> 계산해요.',
    lab: decDivLabF(0), body:`${E('6.3 ÷ 5 → 6.30 ÷ 5 = 1.26')}<p>6.3 = 6.30 = 6.300 … 처럼 소수 끝에 0을 붙여도 크기는 같아요.</p>`,
    ex:`<p>3.4 ÷ 4 → 3.40 ÷ 4 = <b>0.85</b></p>`, quiz:[['dn-zero', 2]] },
  { title:'몫의 소수 첫째 자리에 0이 있는 나눗셈', std:['6수01-15'], key:'나누어야 할 수가 나누는 수보다 작으면 <b>몫에 0을 쓰고</b> 다음 자리의 수를 내려 계산해요.',
    lab: decDivLabF(1), body:`${E('8.24 ÷ 4 = 2.06')}<p>8 ÷ 4 = 2, 소수 첫째 자리 2는 4로 나눌 수 없으니 몫에 <b>0</b>을 쓰고 24 ÷ 4 = 6</p>
      <div class="warn">⚠️ 0을 빠뜨리면 2.6이 되어 틀려요. 어림하면 8 ÷ 4 = 2쯤이에요.</div>`,
    ex:`<p>5.35 ÷ 5 = <b>1.07</b></p>`, quiz:[['dn-zeroq', 3], ['dn-ineq', 4]] },
  { title:'(자연수) ÷ (자연수)의 몫을 소수로', std:['6수01-14'], key:'자연수의 나눗셈에서 나머지가 생기면 <b>소수점 아래에 0을 내려</b> 계속 나누어 몫을 소수로 나타내요.',
    lab: decDivLabF(4), body:`${E(`7 ÷ 4 = ${fr(7, 4)} = ${fr(175, 100)} = 1.75`)}<p>7 ÷ 4 = 1 … 3 → 3을 30(0.1이 30개)으로 보고 30 ÷ 4 = 7 … 2 → 20 ÷ 4 = 5 → <b>1.75</b></p>`,
    ex:`<p>9 ÷ 8 = <b>1.125</b>　　3 ÷ 5 = <b>0.6</b></p>`, quiz:[['nn-dec', 2]] },
  { title:'몫을 어림하기와 생활 문제', std:['6수01-15'], key:'소수를 <b>자연수로 어림</b>해 계산하면 몫의 소수점 위치를 확인할 수 있어요.',
    body:`<p>19.6 ÷ 4 → 20 ÷ 4 = 5쯤 → 몫은 4.9 (49나 0.49는 틀린 답)</p><ul><li>🧵 철사 13.5 m를 6도막으로 → 13.5 ÷ 6 = 2.25 (m)</li><li>⛽ 4일 동안 7.2 L를 똑같이 → 7.2 ÷ 4 = 1.8 (L)</li></ul>`,
    ex:`<p>둘레가 18.6 cm인 정삼각형의 한 변 → 18.6 ÷ 3 = <b>6.2 cm</b></p>`, quiz:[['dn-est', 3], ['ddn-word', 3], ['dn-shape', 3], ['dn-avg', 4], ['dn-wrong', 4], ['dn-cards', 5]] }
]});

/* ═════════════ 4. 비와 비율 ═════════════ */
add({ key:'6-1-4', title:'비와 비율', intro:'두 양을 나눗셈으로 비교하는 비의 개념을 이해하고, 비율을 분수·소수·백분율로 나타내어 생활 속 문제를 해결해요.',
  prev:'[5-1] 대응 관계 · 약분과 통분 · [6-1] 소수의 나눗셈', lessons:[
  { title:'두 수 비교하기', std:['6수02-02'], key:'두 양은 <b>뺄셈</b>(얼마나 더 많은지)이나 <b>나눗셈</b>(몇 배인지)으로 비교할 수 있어요.',
    body:`${tableH([['모둠 수', 1, 2, 3, 4], ['모둠원 수', 4, 8, 12, 16]])}<ul><li>뺄셈: 모둠원 수는 모둠 수보다 3, 6, 9, 12 많아요 → 차가 <b>계속 변해요</b></li><li>나눗셈: 모둠원 수는 항상 모둠 수의 <b>4배</b> → 관계가 <b>변하지 않아요</b></li></ul>`,
    ex:`<p>밀가루 2컵에 설탕 1컵을 넣는 빵을 3배로 만들면 → 밀가루 6컵, 설탕 3컵 (밀가루는 늘 설탕의 2배)</p>`, quiz:[['cmp-div', 1]] },
  { title:'비', std:['6수02-02'], key:'두 수를 나눗셈으로 비교하기 위해 기호 <b>:</b>를 사용하여 나타낸 것을 <b>비</b>라고 해요. 3 : 2에서 <b>2가 기준량</b>, 3이 비교하는 양이에요.',
    body:`<p>3 : 2는 이렇게 읽어요.</p><ul><li>3 대 2</li><li>3과 2의 비</li><li>2에 대한 3의 비</li><li>3의 2에 대한 비</li></ul>
      <div class="warn">⚠️ 3 : 2와 2 : 3은 서로 다른 비예요! 기준량이 무엇인지 꼭 확인해요.</div>`,
    ex:`<p>남학생 12명, 여학생 13명 → 전체에 대한 남학생 수의 비: <b>12 : 25</b></p>`, quiz:[['ratio-read', 1], ['ratio-say', 1], ['ratio-make', 2]] },
  { title:'비율', std:['6수02-03'], key:'(비율) = <b>(비교하는 양) ÷ (기준량)</b>. 비율은 분수나 소수로 나타낼 수 있어요.',
    body:`${E(`3 : 5의 비율 → 3 ÷ 5 = ${fr(3, 5)} = 0.6`)}<p>기준량을 1로 볼 때 비교하는 양이 얼마인지를 나타내는 수가 비율이에요.</p>`,
    lab: ratioLab, ex:`<p>7에 대한 14의 비율 → 14 ÷ 7 = <b>2</b> (비율은 1보다 클 수도 있어요)</p>`, quiz:[['rate-frac', 1], ['rate', 2]] },
  { title:'비율이 사용되는 경우', std:['6수02-03'], key:'<b>속력</b>(걸린 시간에 대한 간 거리), <b>인구 밀도</b>(넓이에 대한 인구), <b>타율</b>처럼 생활 곳곳에서 비율을 써요.',
    body:`<ul><li>🚗 240 km를 3시간 동안 → 240 ÷ 3 = 80 (한 시간에 80 km)</li><li>🏙️ 넓이 5 km²에 15000명 → 15000 ÷ 5 = 3000 (1 km²에 3000명)</li><li>⚾ 20타수 중 안타 7개 → 7 ÷ 20 = 0.35</li></ul>
      <div class="note">💡 비율을 비교하면 어느 쪽이 더 빠른지, 더 붐비는지 알 수 있어요.</div>`,
    ex:`<p>매실 원액 60 mL를 넣어 매실 주스 300 mL를 만들었어요 → 주스 양에 대한 원액 양의 비율: 60 ÷ 300 = <b>0.2</b></p>`, quiz:[['rate-life', 3], ['rate-cmp', 4]] },
  { title:'백분율', std:['6수02-03'], key:'기준량을 <b>100</b>으로 할 때의 비율을 <b>백분율</b>이라 하고 기호 <b>%</b>를 써요. (백분율) = (비율) × 100',
    body:`${E(`${fr(3, 4)} → ${fr(3, 4)} × 100 = 75%　　0.4 → 0.4 × 100 = 40%`)}<p>75%는 "75 퍼센트"라고 읽어요. 100칸 중 75칸을 색칠한 것과 같아요.</p>
      <div class="note">💡 백분율 ÷ 100 = 비율: 35% = ${fr(35, 100)} = 0.35</div>`,
    lab: percentLab, ex:`<p>전체 20명 중 안경을 쓴 학생 7명 → 7 ÷ 20 × 100 = <b>35%</b></p>`, quiz:[['pct-color', 1], ['percent', 2]] },
  { title:'백분율 활용하기', std:['6수02-03'], key:'<b>할인율, 득표율, 진하기, 이자율</b>처럼 생활 속 비율을 백분율로 나타내 비교하고 판단해요.',
    body:`<ul><li>🏷️ 10000원짜리를 8000원에 → 할인 2000원 → 2000 ÷ 10000 × 100 = <b>20% 할인</b></li><li>🗳️ 25명 중 14명이 찬성 → 14 ÷ 25 × 100 = <b>56%</b></li>
      <li>🧂 소금물 200 g에 소금 30 g → 30 ÷ 200 × 100 = <b>15%</b></li><li>🏭 물건 400개 중 불량품이 2% → 400 × ${fr(2, 100)} = <b>8개</b></li></ul>
      <div class="note">💡 기준량이 다르면 양만 보고 비교하지 말고 백분율로 바꾸어 비교해요.</div>`,
    ex:`<p>5000원짜리 물건을 30% 할인 → 5000 × ${fr(30, 100)} = 1500원 할인 → <b>3500원</b></p>`, quiz:[['pct-life', 3], ['pct-rev', 4], ['pct-best', 5]] }
]});

/* ═════════════ 6. 여러 가지 그래프 ═════════════ */
add({ key:'6-1-6', title:'여러 가지 그래프', intro:'그림그래프, 띠그래프, 원그래프를 그리고 해석하며, 목적에 알맞은 그래프를 골라 자료를 나타내요.',
  prev:'[4-1] 막대그래프 · [4-2] 꺾은선그래프 · [6-1] 비와 비율', lessons:[
  { title:'그림그래프', std:['6수04-03'], key:'<b>그림의 크기와 수</b>로 자료의 양을 나타낸 그래프예요. 큰 그림과 작은 그림이 나타내는 수를 먼저 확인해요.',
    body:`${tableH([['마을', '사과 생산량 (🍎 10상자 · 🍏 1상자)'], ['가', '🍎🍎🍎🍏🍏'], ['나', '🍎🍎🍎🍎🍎🍏'], ['다', '🍎🍎🍏🍏🍏🍏']])}<p>가 마을 32상자, 나 마을 51상자, 다 마을 24상자</p>
      <div class="note">💡 지도 위에 그리면 지역별 양을 한눈에 비교할 수 있어요.</div>`,
    ex:`<p>(🍎 10상자, 🍏 1상자) 🍎🍎🍎🍎🍏🍏🍏 → <b>43상자</b></p>`, quiz:[['pic-read', 1]] },
  { title:'띠그래프', std:['6수04-02'], key:'전체에 대한 각 부분의 비율을 <b>띠 모양에 나타낸</b> 그래프예요. 띠 전체는 <b>100%</b>예요.',
    body:`<p><b>띠그래프 그리는 순서</b></p><ol><li>자료를 조사하여 수를 정리해요.</li><li>각 항목의 <b>백분율</b>을 구해요. (합계가 100%인지 확인!)</li><li>백분율의 크기만큼 띠를 나누고 내용과 백분율을 써요.</li><li>제목을 써요.</li></ol>`,
    lab: graphLab, ex:`<p>전체 40명 중 축구 14명 → 14 ÷ 40 × 100 = <b>35%</b></p>`, quiz:[['band-scale', 1], ['tbl-pct', 2], ['band-read', 2]] },
  { title:'원그래프', std:['6수04-02'], key:'전체에 대한 각 부분의 비율을 <b>원 모양에 나타낸</b> 그래프예요. 원의 중심을 따라 백분율만큼 나누어요.',
    body:`<p>원그래프와 띠그래프는 모두 <b>전체에 대한 부분의 비율</b>을 한눈에 보여 줘요. 항목의 백분율이 클수록 넓게 나타나요.</p>
      <div class="note">💡 원그래프에서 25%는 원의 ${fr(1, 4)}, 50%는 원의 반이에요.</div>
      <p>전체 학생 수를 알면 (항목의 수) = (전체) × (백분율 ÷ 100)으로 항목의 수를 구할 수 있어요.</p>`,
    ex:`<p>400명 중 원그래프에서 30%인 항목 → 400 × ${fr(30, 100)} = <b>120명</b></p>`, quiz:[['pie-read', 2], ['pct-of-total', 3]] },
  { title:'띠그래프와 원그래프 해석하기', std:['6수04-02'], key:'그래프에서 <b>가장 많은 항목, 몇 배인지, 전체 수에 대한 항목의 수</b>를 읽고, 전체가 다른 두 그래프는 <b>실제 수</b>로 비교해요.',
    body:`<p>원그래프에서 과자 40%, 과일 20% → 과자를 좋아하는 학생은 과일의 40 ÷ 20 = <b>2배</b></p>
      <div class="warn">⚠️ 가 학교(200명)의 30%와 나 학교(500명)의 20% → 백분율은 가가 크지만 학생 수는 60명 &lt; 100명이에요!</div>`,
    lab: graphLab, ex:`<p>전체 300명 중 25%가 축구를 좋아해요 → 300 × ${fr(25, 100)} = <b>75명</b></p>`, quiz:[['band-times', 3], ['pie-over', 3], ['two-school', 4], ['graph-true', 4]] },
  { title:'알맞은 그래프 고르기', std:['6수04-03'], key:'<b>변화</b>는 꺾은선그래프, <b>양의 비교</b>는 막대그래프, <b>비율</b>은 띠·원그래프, <b>지역별 양</b>은 그림그래프가 알맞아요.',
    body:`${tableH([['그래프', '이럴 때 좋아요'], ['막대그래프', '항목별 수량의 크기 비교'], ['꺾은선그래프', '시간에 따른 변화'], ['그림그래프', '지역별 수량을 한눈에'], ['띠·원그래프', '전체에 대한 부분의 비율']])}
      <p>탐구 문제를 정하고 → 자료를 모아 정리하고 → 알맞은 그래프로 나타내어 → 해석해요.</p>`,
    ex:`<p>우리 반 학생들이 가장 좋아하는 계절의 비율 → <b>원그래프(또는 띠그래프)</b></p>`, quiz:[['graph-pick', 2]] }
]});

/* ═════════════ 5. 직육면체의 겉넓이와 부피 ═════════════ */
add({ key:'6-1-5', title:'직육면체의 겉넓이와 부피', intro:'직육면체와 정육면체의 겉넓이를 구하는 방법을 탐구하고, 부피의 단위를 알아 부피를 구해요.',
  prev:'[5-1] 다각형의 둘레와 넓이 · [5-2] 직육면체', lessons:[
  { title:'직육면체의 겉넓이', std:['6수03-17'], key:'(직육면체의 겉넓이) = <b>(한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2</b> = (밑면의 넓이) × 2 + (옆면의 넓이)',
    body:`<div class="figc">${A.cuboidFig(5, 3, 4, { names: false, dims: ['5 cm', '3 cm', '4 cm'] })}</div>
      <ul><li>여섯 면의 넓이를 모두 더하기: 15 + 15 + 12 + 12 + 20 + 20 = 94</li><li>세 면의 넓이 × 2: (15 + 12 + 20) × 2 = 94</li><li>밑면 × 2 + 옆면: 15 × 2 + (5 + 3 + 5 + 3) × 4 = 94</li></ul><p>→ 겉넓이 <b>94 cm²</b></p>`,
    lab: surfaceLab, ex:`<p>가로 6 cm, 세로 4 cm, 높이 2 cm → (24 + 8 + 12) × 2 = <b>88 cm²</b></p>`, quiz:[['sa-cuboid', 2], ['sa-net', 2]] },
  { title:'정육면체의 겉넓이', std:['6수03-17'], key:'(정육면체의 겉넓이) = <b>(한 면의 넓이) × 6</b>',
    body:`<p>정육면체는 여섯 면이 모두 합동인 정사각형이에요.</p>${E('한 모서리 5 cm → 5 × 5 × 6 = 150 (cm²)')}`,
    ex:`<p>겉넓이가 216 cm²인 정육면체 → 한 면 216 ÷ 6 = 36 → 한 모서리 <b>6 cm</b></p>`, quiz:[['sa-cube', 2], ['sa-rev', 3]] },
  { title:'부피와 1 cm³', std:['6수03-18'], key:'한 모서리가 1 cm인 정육면체의 부피를 <b>1 cm³</b>(1 세제곱센티미터)라고 해요. 부피는 1 cm³가 몇 개인지로 나타내요.',
    body:`<p>상자 두 개의 부피를 비교할 때 맞대어 보기 어려우면, 크기가 같은 쌓기나무를 담아 그 개수로 비교해요.</p>`,
    lab: volLab, ex:`<p>1 cm³ 쌓기나무가 가로 4개, 세로 3개, 높이 2층 → 24개 → <b>24 cm³</b></p>`, quiz:[['vol-cubes', 1]] },
  { title:'직육면체와 정육면체의 부피', std:['6수03-19'], key:'(직육면체의 부피) = <b>(가로) × (세로) × (높이)</b>, (정육면체의 부피) = <b>(한 모서리) × (한 모서리) × (한 모서리)</b>',
    body:`${E('가로 5 cm, 세로 3 cm, 높이 4 cm → 5 × 3 × 4 = 60 (cm³)')}<div class="note">💡 (밑면의 넓이) × (높이)로 생각할 수도 있어요: 15 × 4 = 60</div>`,
    ex:`<p>부피가 120 cm³, 가로 6 cm, 세로 5 cm → 높이 = 120 ÷ 30 = <b>4 cm</b></p>`, quiz:[['vol-cuboid', 2], ['vol-cube', 2], ['vol-rev', 3]] },
  { title:'1 m³', std:['6수03-18'], key:'한 모서리가 1 m인 정육면체의 부피가 <b>1 m³</b>예요. <b>1 m³ = 1000000 cm³</b>',
    body:`<p>1 m = 100 cm이므로 1 m³ 안에는 1 cm³가 100 × 100 × 100 = <b>1000000개</b> 들어가요.</p>
      <div class="warn">⚠️ 1 m³ = 100 cm³나 1000 cm³가 아니에요!</div><p>방, 교실, 수영장처럼 큰 부피는 m³로 나타내요.</p>`,
    ex:`<p>가로 2 m, 세로 3 m, 높이 50 cm인 상자 → 2 × 3 × 0.5 = <b>3 m³</b> = 3000000 cm³</p>`, quiz:[['vol-unit', 3], ['vol-m', 3], ['vol-cmp', 3]] }
  ,{ title:'겉넓이와 부피 활용하기', std:['6수03-17', '6수03-19'], key:'복잡한 모양은 <b>직육면체로 나누거나 빼서</b> 부피를 구하고, 자르면 <b>새로 생기는 면</b>만큼 겉넓이가 늘어나요.',
    body:`<ul><li>🧱 큰 직육면체에서 작은 직육면체를 잘라 낸 모양 → (큰 부피) - (잘라 낸 부피)</li><li>🔪 나무 도막을 한 번 자르면 자른 면 2개가 새로 생겨 겉넓이가 늘어나요.</li><li>🎲 직육면체를 잘라 만들 수 있는 가장 큰 정육면체 → 가장 짧은 모서리가 한 모서리</li></ul>`,
    ex:`<p>가로 10 cm, 세로 4 cm, 높이 6 cm인 직육면체를 잘라 만들 수 있는 가장 큰 정육면체 → 4 × 4 × 4 = <b>64 cm³</b></p>`, quiz:[['vol-big-cube', 3], ['sa-cut', 5], ['vol-mix', 4]] }
]});
})();
