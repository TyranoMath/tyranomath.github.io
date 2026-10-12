/* =========================================================
   🦖 개념 탐험대 — 2학년 2학기 (2022 개정 교육과정)
   단원: 1 네 자리 수 · 2 곱셈구구 · 3 길이 재기 · 4 시각과 시간 · 5 표와 그래프 · 6 규칙 찾기
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, H = window.TM_G12, K = window.TM_L12, L2 = window.TM_L2;
const { svg, txt, line, range, ri, pick, shuffle } = A;
const { P, sino, clock } = H;
const { $in, press } = K;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const DAY = ['일', '월', '화', '수', '목', '금', '토'];
const fmt = t => { t = ((t % 720) + 720) % 720; const h = (Math.floor(t / 60) + 11) % 12 + 1, m = t % 60; return `${h}시${m ? ` ${m}분` : ''}`; };
const dur = d => d >= 60 ? `${Math.floor(d / 60)}시간${d % 60 ? ` ${d % 60}분` : ''}` : `${d}분`;
const mcm = v => v >= 100 ? `${Math.floor(v / 100)} m${v % 100 ? ` ${v % 100} cm` : ''}` : `${v} cm`;

/* ═════════════ 2-2 실험실 ═════════════ */
// 돈으로 네 자리 수
const moneyLab = { title: '돈을 모아 네 자리 수 만들기', init(el){
  const M = [[1000, '천 원', '#9BE0A6'], [100, '백 원', '#E3E7EE'], [10, '십 원', '#F2C58A']];
  let c = [2, 3, 5];
  el.innerHTML = `<div class="ctrl">${M.map((m, i) => `<button class="tbtn" type="button" data-a="${i}">+ ${m[0]}원</button><button class="tbtn" type="button" data-s="${i}">−</button>`).join('')}</div><div class="figc" id="mf" style="line-height:2.1;flex-direction:column;align-items:center"></div><div class="out" id="mo"></div>`;
  const piece = i => i === 0 ? `<span style="display:inline-block;width:52px;height:26px;margin:2px;border-radius:4px;background:${M[0][2]};border:2px solid ${INK};font:700 12px Fredoka;line-height:22px;text-align:center;vertical-align:middle">1000</span>`
    : `<span style="display:inline-block;width:30px;height:30px;margin:2px;border-radius:50%;background:${M[i][2]};border:2px solid ${INK};font:700 11px Fredoka;line-height:26px;text-align:center;vertical-align:middle">${M[i][0]}</span>`;
  const draw = () => { const v = c[0] * 1000 + c[1] * 100 + c[2] * 10;
    $in(el, '#mf').innerHTML = M.map((m, i) => c[i] ? `<div>${range(1, c[i]).map(() => piece(i)).join('')} <b>${m[1]} ${c[i]}장</b></div>` : '').join('') || '돈을 넣어 보세요!';
    let msg = `모두 <b style="font-family:Fredoka;font-size:26px">${v}원</b> (${sino(v) || '영'} 원)<br>${c.map((k, i) => k ? `${M[i][0]}원 ${k}개 → ${k * M[i][0]}원` : '').filter(Boolean).join(' · ')}`;
    if (c[1] === 10) msg += `<br><span style="color:${RED}">💡 100원이 10개면 1000원! 천 원짜리 1장으로 바꿀 수 있어요.</span>`;
    if (c[2] === 10) msg += `<br><span style="color:${RED}">💡 10원이 10개면 100원이에요.</span>`;
    $in(el, '#mo').innerHTML = msg; };
  el.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.a; c[i] = Math.min(i ? 10 : 9, c[i] + 1); draw(); }));
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.s; c[i] = Math.max(0, c[i] - 1); draw(); }));
  draw();
} };

// 곱셈구구 만들기
const TIP = { 1: '1과 어떤 수의 곱은 항상 <b>어떤 수</b>예요.', 2: '2단의 곱은 모두 <b>짝수</b>예요 (2, 4, 6, 8, …).', 3: '3단은 3씩 커지고, 3단의 곱을 두 번 더하면 6단이 돼요.',
  4: '4단의 곱은 2단의 곱의 <b>2배</b>예요.', 5: '5단의 곱은 일의 자리 숫자가 <b>5, 0</b>이 반복돼요.', 6: '6단의 곱은 3단의 곱의 <b>2배</b>예요.', 7: '7단은 7씩 커져요. 7 × 7 = 49를 기억해요.',
  8: '8단의 곱은 4단의 곱의 <b>2배</b>예요.', 9: '9단의 곱은 십의 자리와 일의 자리 숫자의 합이 <b>9</b>예요 (18 → 1 + 8 = 9).' };
const danLab = d0 => ({ title: '묶음을 늘리며 곱셈구구 만들기', init(el){
  let d = d0;
  el.innerHTML = `<div class="ctrl">${range(1, 9).map(k => `<button class="tbtn" type="button" data-d="${k}" aria-pressed="${k === d}">${k}단</button>`).join('')}</div><div class="ctrl"><label>묶음 수</label><input type="range" min="0" max="9" value="3" id="dn"><span class="v" id="dnv"></span></div><div class="figc" id="dg" style="min-height:40px;flex-wrap:wrap"></div><div class="out" id="dl"></div>`;
  const draw = () => { const n = +$in(el, '#dn').value; $in(el, '#dnv').textContent = n;
    $in(el, '#dg').innerHTML = n ? range(1, n).map(() => `<span style="display:inline-block;border:2px dashed ${GR};border-radius:10px;padding:1px 4px;margin:3px;font-size:15px;letter-spacing:-2px">${'🟠'.repeat(d)}</span>`).join('') : `<span style="color:${GRAY}">묶음이 하나도 없어요 → 0개</span>`;
    const list = range(0, 9).map(k => `<span style="${k === n ? 'background:#FFE38A;font-weight:700;border-radius:4px' : ''};padding:0 4px">${d} × ${k} = ${d * k}</span>`).join('');
    $in(el, '#dl').innerHTML = `<b style="font-size:24px">${d} × ${n} = ${d * n}</b>${n ? ` <span style="color:${GRAY}">(${range(1, n).map(() => d).join(' + ')})</span>` : ' <span style="color:' + GRAY + '">(어떤 수와 0의 곱은 0)</span>'}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:2px 6px;margin:8px 0;font-family:Fredoka">${list}</div>${n ? `묶음이 하나 늘면 곱은 <b>${d}</b>만큼 커져요. ` : ''}${TIP[d]}`; };
  el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { d = +b.dataset.d; press(el, '[data-d]', b); draw(); }));
  $in(el, '#dn').addEventListener('input', draw); draw();
} });

// 덧셈표·곱셈표
const tableLab = op => ({ title: op === '+' ? '덧셈표의 칸을 눌러 규칙 찾기' : '곱셈표의 칸을 눌러 규칙 찾기', init(el){
  const NS = op === '+' ? range(0, 9) : range(1, 9), f = (a, b) => op === '+' ? a + b : a * b;
  const MODES = op === '+' ? [['row', '가로·세로 줄'], ['d1', '↘ 방향'], ['d2', '↙ 방향']] : [['row', '가로·세로 줄'], ['sym', '순서 바꾸기'], ['diag', '같은 수끼리']];
  let mode = 'row', sel = op === '+' ? [3, 5] : [3, 6];
  el.innerHTML = `<div class="ctrl">${MODES.map((m, i) => `<button class="tbtn" type="button" data-m="${m[0]}" aria-pressed="${i === 0}">${m[1]}</button>`).join('')}</div><div class="tscroll" id="tt"></div><div class="out" id="to"></div>`;
  const draw = () => { const [a, b] = sel;
    const hi = (r, c) => { if (r === a && c === b) return '#FF9F43';
      if (mode === 'row' && (r === a || c === b)) return '#FFE7A8';
      if (mode === 'd1' && r - c === a - b) return '#BDE8C6';
      if (mode === 'd2' && r + c === a + b) return '#CFE2FA';
      if (mode === 'sym' && r === b && c === a) return '#F7A6C4';
      if (mode === 'diag' && r === c) return '#BDE8C6';
      return ''; };
    let h = `<table class="qt" style="margin:auto"><tr><th style="background:#22314A;color:#fff">${op === '+' ? '+' : '×'}</th>${NS.map(c => `<th>${c}</th>`).join('')}</tr>`;
    NS.forEach(r => { h += `<tr><th>${r}</th>${NS.map(c => `<td data-r="${r}" data-c="${c}" style="cursor:pointer;padding:3px 5px;font-family:Fredoka;min-width:22px;background:${hi(r, c)}">${f(r, c)}</td>`).join('')}</tr>`; });
    $in(el, '#tt').innerHTML = h + '</table>';
    el.querySelectorAll('[data-r]').forEach(td => td.addEventListener('click', () => { sel = [+td.dataset.r, +td.dataset.c]; draw(); }));
    let o = `<b style="font-size:22px">${a} ${op === '+' ? '+' : '×'} ${b} = ${f(a, b)}</b><br>`;
    if (op === '+'){
      o += mode === 'row' ? `오른쪽으로 한 칸 갈 때마다 <b>1씩</b> 커지고, 아래쪽으로 한 칸 갈 때마다 <b>1씩</b> 커져요.`
        : mode === 'd1' ? `↘ 방향으로 갈 때마다 <b>2씩</b> 커져요 (오른쪽으로 1, 아래로 1).`
        : `↙ 방향에 있는 수는 모두 <b>${a + b}</b>로 같아요. 하나가 1 커지면 다른 하나가 1 작아지거든요.`;
    } else {
      o += mode === 'row' ? `${a}단은 오른쪽으로 갈 때마다 <b>${a}씩</b>, ${b}단은 아래로 갈 때마다 <b>${b}씩</b> 커져요.${a % 2 === 0 || b % 2 === 0 ? ` <span style="color:${GRAY}">(${f(a, b)}는 짝수)</span>` : ''}`
        : mode === 'sym' ? `${a} × ${b} = ${b} × ${a} = <b>${a * b}</b> — 곱하는 두 수의 <b>순서를 바꾸어도 곱은 같아요</b>. 초록 대각선을 따라 접으면 두 칸이 만나요.`
        : `같은 두 수를 곱한 곱: ${range(1, 9).map(k => k * k).join(', ')} — 이 선을 기준으로 곱셈표가 <b>양쪽이 똑같이</b> 놓여 있어요.`;
    }
    $in(el, '#to').innerHTML = o; };
  el.querySelectorAll('[data-m]').forEach(bn => bn.addEventListener('click', () => { mode = bn.dataset.m; press(el, '[data-m]', bn); draw(); }));
  draw();
} });

// 1 m 알아보기
const meterLab = { title: '길이를 늘이며 m와 cm로 나타내기', init(el){
  const OB = [['☂️ 우산', 85], ['🪑 책상 긴 쪽', 120], ['🧒 내 키', 132], ['🚪 문 높이', 210], ['🛏️ 침대', 196]];
  el.innerHTML = `<div class="ctrl">${OB.map((o, i) => `<button class="tbtn" type="button" data-o="${i}">${o[0]}</button>`).join('')}</div><div class="ctrl"><label>길이</label><input type="range" min="30" max="300" value="135" id="mv"><span class="v" id="mvv"></span></div><div class="figc" id="mf"></div><div class="out" id="mo"></div>`;
  const draw = () => { const v = +$in(el, '#mv').value; $in(el, '#mvv').textContent = v + ' cm';
    const s = 1.04, X = 12; let g = `<rect x="${X}" y="18" width="${v * s}" height="22" rx="4" fill="#9CC7EE" stroke="${INK}" stroke-width="1.6"/>`;
    for (let k = 0; k <= 300; k += 10){ const big = k % 100 === 0; g += line(X + k * s, 48, X + k * s, big ? 66 : k % 50 ? 54 : 60, { w: big ? 2.2 : 1 }); if (big) g += txt(X + k * s, 78, k ? `${k / 100} m` : '0', { size: 12, bold: true }); }
    for (let k = 1; k <= Math.floor(v / 100); k++) g += `<rect x="${X + (k - 1) * 100 * s}" y="14" width="${100 * s}" height="30" fill="none" stroke="${RED}" stroke-width="2.4" stroke-dasharray="6 3"/>`;
    $in(el, '#mf').innerHTML = svg(340, 86, g);
    const m = Math.floor(v / 100), c = v % 100;
    $in(el, '#mo').innerHTML = `<b style="font-size:24px">${v} cm${m ? ` = ${m} m${c ? ` ${c} cm` : ''}` : ''}</b>${m ? `<br>읽기: ${m} 미터${c ? ` ${c} 센티미터` : ''}<br>${v} cm 안에는 100 cm가 <b>${m}번</b>(빨간 점선) 들어 있어요. <span style="color:${GRAY}">100 cm = 1 m</span>` : `<br><span style="color:${GRAY}">100 cm가 되면 1 m가 돼요.</span>`}`; };
  el.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => { $in(el, '#mv').value = OB[+b.dataset.o][1]; draw(); }));
  $in(el, '#mv').addEventListener('input', draw); draw();
} };

// 길이의 합과 차
const mcmLab = op => ({ title: op === '+' ? 'm는 m끼리, cm는 cm끼리 더하기' : 'm는 m끼리, cm는 cm끼리 빼기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cn">🎲 새 문제</button><button class="tbtn" type="button" id="cs">① cm끼리 ▶</button></div><div class="tscroll" id="ct"></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  let a, b, st;
  const fresh = () => { if (op === '+'){ a = [ri(1, 4), ri(10, 60)]; b = [ri(1, 3), ri(10, 99 - a[1])]; } else { a = [ri(3, 6), ri(30, 90)]; b = [ri(1, a[0] - 1), ri(10, a[1])]; } st = 0; draw(); };
  const draw = () => { const r = op === '+' ? [a[0] + b[0], a[1] + b[1]] : [a[0] - b[0], a[1] - b[1]];
    const cell = (v, show, u) => `<td style="font-family:Fredoka;font-size:22px;padding:2px 12px">${show ? v : '□'} <small>${u}</small></td>`;
    $in(el, '#ct').innerHTML = `<table class="qt" style="margin:auto"><tr><th></th><th>m</th><th>cm</th></tr><tr><th></th>${cell(a[0], 1, 'm')}${cell(a[1], 1, 'cm')}</tr><tr><th>${op === '+' ? '+' : '−'}</th>${cell(b[0], 1, 'm')}${cell(b[1], 1, 'cm')}</tr><tr style="border-top:3px solid ${INK}"><th></th>${cell(r[0], st >= 2, 'm')}${cell(r[1], st >= 1, 'cm')}</tr></table>`;
    const A_ = a[0] * 100 + a[1], B_ = b[0] * 100 + b[1], R_ = r[0] * 100 + r[1], s = 300 / Math.max(A_, op === '+' ? R_ : A_), X = 14;
    let g = `<rect x="${X}" y="8" width="${A_ * s}" height="18" rx="4" fill="#9CC7EE" stroke="${INK}"/>` + txt(X + A_ * s / 2, 17, mcm(A_), { size: 11, bold: true });
    g += op === '+' ? `<rect x="${X + A_ * s}" y="8" width="${B_ * s}" height="18" rx="4" fill="#FFD27A" stroke="${INK}"/>` + txt(X + A_ * s + B_ * s / 2, 17, mcm(B_), { size: 11, bold: true })
      : `<rect x="${X}" y="34" width="${B_ * s}" height="18" rx="4" fill="#FFD27A" stroke="${INK}"/>` + txt(X + B_ * s / 2, 43, mcm(B_), { size: 11, bold: true }) + `<rect x="${X + B_ * s}" y="34" width="${R_ * s}" height="18" rx="4" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="5 3"/>` + (st >= 2 ? txt(X + B_ * s + R_ * s / 2, 43, mcm(R_), { size: 11, bold: true, fill: RED }) : '');
    $in(el, '#cf').innerHTML = svg(330, 60, g);
    $in(el, '#cs').textContent = st === 0 ? '① cm끼리 ▶' : st === 1 ? '② m끼리 ▶' : '다 했어요 ✔';
    $in(el, '#co').innerHTML = st === 0 ? `<b>cm</b>끼리 먼저 ${op === '+' ? '더해' : '빼'} 보세요.` : st === 1 ? `${a[1]} ${op === '+' ? '+' : '−'} ${b[1]} = <b>${r[1]}</b> (cm) · 이제 m끼리!`
      : `${a[0]} m ${a[1]} cm ${op === '+' ? '+' : '−'} ${b[0]} m ${b[1]} cm = <b style="font-size:22px">${r[0]} m ${r[1]} cm</b><br><span style="color:${GRAY}">단위가 같은 것끼리 계산해요.</span>`; };
  $in(el, '#cn').addEventListener('click', fresh); $in(el, '#cs').addEventListener('click', () => { st = Math.min(2, st + 1); draw(); }); fresh();
} });

// 몸으로 어림하기
const bodyLab = { title: '몸의 부분으로 길이 어림하기', init(el){
  const U = [['✋', '한 뼘', 15], ['👣', '한 걸음', 50], ['🙆', '양팔을 벌린 길이', 100]], OB = [['🚪 교실 문 높이', 200], ['🧑‍🏫 칠판 긴 쪽', 400], ['🚌 버스 길이', 1000], ['🏫 교실 긴 쪽', 900]];
  let ui = 2, oi = 1;
  el.innerHTML = `<div class="ctrl">${U.map((u, i) => `<button class="tbtn" type="button" data-u="${i}" aria-pressed="${i === ui}">${u[0]} ${u[1]}</button>`).join('')}</div><div class="ctrl">${OB.map((o, i) => `<button class="tbtn" type="button" data-o="${i}" aria-pressed="${i === oi}">${o[0]}</button>`).join('')}</div><div class="figc" id="bf"></div><div class="out" id="bo"></div>`;
  const draw = () => { const [ic, nm, u] = U[ui], [on, len] = OB[oi], n = Math.round(len / u), s = 300 / len, X = 14;
    let g = `<rect x="${X}" y="10" width="${len * s}" height="20" rx="5" fill="#C9D3E0" stroke="${INK}"/>` + txt(X + len * s / 2, 20, on.slice(on.indexOf(' ') + 1), { size: 11, bold: true });
    for (let k = 0; k < n; k++) g += `<rect x="${X + k * u * s}" y="36" width="${u * s}" height="14" fill="${k % 2 ? '#FFD27A' : '#FFE7A8'}" stroke="${INK}" stroke-width=".8"/>`;
    $in(el, '#bf').innerHTML = svg(330, 58, g);
    $in(el, '#bo').innerHTML = `${ic} ${nm}${P(nm, '이', '가')} 약 <b>${mcm(u)}</b>라면 → ${nm}${P(nm, '으로', '로')} 약 <b>${n}번</b><br>→ ${on.slice(on.indexOf(' ') + 1)}${P(on, '은', '는')} 약 <b style="font-size:22px">${mcm(n * u)}</b><br><span style="color:${GRAY}">긴 길이는 ${U[2][1]}(약 1 m)처럼 긴 단위로 어림하면 편해요. 어림한 길이 앞에는 "약"을 붙여요.</span>`; };
  el.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => { ui = +b.dataset.u; press(el, '[data-u]', b); draw(); }));
  el.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => { oi = +b.dataset.o; press(el, '[data-o]', b); draw(); }));
  draw();
} };

// 걸린 시간
const durLab = { title: '시작 시각과 걸린 시간으로 끝난 시각 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시작</label><input type="range" min="480" max="1020" step="10" value="560" id="ds"><span class="v" id="dsv"></span></div><div class="ctrl"><label>걸린 시간</label><input type="range" min="10" max="180" step="10" value="70" id="dd"><span class="v" id="ddv"></span></div><div class="figc" id="dc" style="display:flex;gap:18px;justify-content:center;align-items:center;flex-wrap:wrap"></div><div class="figc" id="df"></div><div class="out" id="do"></div>`;
  const draw = () => { const a = +$in(el, '#ds').value, d = +$in(el, '#dd').value, b = a + d; $in(el, '#dsv').textContent = fmt(a); $in(el, '#ddv').textContent = dur(d);
    const hm = t => [(Math.floor(t / 60) + 11) % 12 + 1, t % 60];
    $in(el, '#dc').innerHTML = `<div style="text-align:center">${clock(...hm(a), 120)}<div>시작 <b>${fmt(a)}</b></div></div><div style="font-size:26px">➜</div><div style="text-align:center">${clock(...hm(b), 120)}<div>끝 <b>${fmt(b)}</b></div></div>`;
    const H0 = Math.floor(a / 60), H1 = Math.ceil(b / 60), w = 300 / (H1 - H0), X = 16; let g = '';
    for (let h = H0; h < H1; h++) for (let k = 0; k < 6; k++){ const x = X + (h - H0) * w + k * w / 6; g += `<rect x="${x}" y="16" width="${w / 6}" height="20" fill="${(h * 60 + k * 10) >= a && (h * 60 + k * 10) < b ? '#FFB86B' : '#fff'}" stroke="${INK}" stroke-width=".7"/>`; }
    for (let h = H0; h <= H1; h++) g += line(X + (h - H0) * w, 10, X + (h - H0) * w, 42, { w: 2.4 }) + txt(X + (h - H0) * w, 54, `${(h + 11) % 12 + 1}시`, { size: 11, bold: true });
    $in(el, '#df').innerHTML = svg(332, 60, g);
    $in(el, '#do').innerHTML = `${fmt(a)}부터 ${fmt(b)}까지 → 걸린 시간 <b style="font-size:22px">${dur(d)}</b>${d >= 60 ? ` = <b>${d}분</b>` : ''}<br><span style="color:${GRAY}">시간 띠 한 칸은 10분, 6칸(60분)이 모이면 <b>1시간</b>이에요. 긴바늘이 한 바퀴 돌면 1시간이 지나요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

// 하루의 시간
const ACT = h => h < 7 ? '😴 잠' : h < 8 ? '🍚 아침 식사' : h < 9 ? '🎒 등교' : h < 12 ? '🏫 공부' : h < 13 ? '🍱 점심' : h < 15 ? '🏫 공부' : h < 18 ? '⚽ 놀이' : h < 19 ? '🍽️ 저녁 식사' : h < 21 ? '📖 책 읽기' : '😴 잠';
const dayLab = { title: '하루 24시간 띠에서 오전·오후 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시각</label><input type="range" min="0" max="23" value="15" id="hv"><span class="v" id="hvv"></span></div><div class="figc" id="hf"></div><div class="figc" id="hc"></div><div class="out" id="ho"></div>`;
  const name = h => h === 0 ? '밤 12시' : h === 12 ? '낮 12시' : `${h < 12 ? '오전' : '오후'} ${h % 12}시`;
  const draw = () => { const h = +$in(el, '#hv').value; $in(el, '#hvv').textContent = name(h);
    const w = 13, X = 10; let g = `<rect x="${X}" y="16" width="${12 * w}" height="24" fill="#FFF3C4"/><rect x="${X + 12 * w}" y="16" width="${12 * w}" height="24" fill="#DCEBFB"/>` + txt(X + 6 * w, 8, '오전', { size: 12, bold: true }) + txt(X + 18 * w, 8, '오후', { size: 12, bold: true });
    for (let k = 0; k <= 24; k++) g += line(X + k * w, 16, X + k * w, k % 6 ? 34 : 44, { w: k % 6 ? .7 : 1.8 });
    [[0, '0'], [6, '6'], [12, '12'], [18, '6'], [24, '12']].forEach(([k, s]) => { g += txt(X + k * w, 54, s, { size: 11, bold: true }); });
    g += `<rect x="${X + h * w}" y="16" width="${w}" height="24" fill="${OR}" stroke="${INK}"/>`;
    $in(el, '#hf').innerHTML = svg(334, 60, g);
    $in(el, '#hc').innerHTML = clock(h % 12 || 12, 0, 120);
    $in(el, '#ho').innerHTML = `<b style="font-size:24px">${name(h)}</b> · ${ACT(h)}<br><span style="color:${GRAY}">전날 밤 12시부터 낮 12시까지를 <b>오전</b>, 낮 12시부터 밤 12시까지를 <b>오후</b>라고 해요. 하루는 <b>24시간</b>이고, 짧은바늘은 하루에 시계를 <b>2바퀴</b> 돌아요.</span>`; };
  $in(el, '#hv').addEventListener('input', draw); draw();
} };

// 달력
const calLab = { title: '달력에서 날짜를 눌러 요일과 규칙 알아보기', init(el){
  let m = 9, sel = 12;
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cp">◀ 이전 달</button><b id="cm" style="font-family:Jua;font-size:20px;min-width:110px;text-align:center"></b><button class="tbtn" type="button" id="cx">다음 달 ▶</button></div><div class="tscroll" id="ct"></div><div class="out" id="co"></div>`;
  const draw = () => { const f = new Date(2026, m, 1).getDay(), n = new Date(2026, m + 1, 0).getDate(); if (sel > n) sel = n;
    $in(el, '#cm').textContent = `2026년 ${m + 1}월`;
    const col = (sel - 1 + f) % 7; let h = `<table class="qt" style="margin:auto"><tr>${DAY.map((d, i) => `<th style="color:${i === 0 ? RED : i === 6 ? BL : INK}">${d}</th>`).join('')}</tr><tr>`;
    for (let i = 0; i < f; i++) h += '<td></td>';
    for (let d = 1; d <= n; d++){ const c = (d - 1 + f) % 7; if (c === 0 && d > 1) h += '</tr><tr>';
      h += `<td data-d="${d}" style="cursor:pointer;font-family:Fredoka;padding:4px 7px;color:${c === 0 ? RED : c === 6 ? BL : INK};background:${d === sel ? '#FF9F43' : c === col ? '#FFF0C2' : ''}">${d}</td>`; }
    $in(el, '#ct').innerHTML = h + '</tr></table>';
    el.querySelectorAll('[data-d]').forEach(td => td.addEventListener('click', () => { sel = +td.dataset.d; draw(); }));
    const same = range(0, 5).map(k => sel - 7 * 5 + 7 * k).concat(range(0, 5).map(k => sel + 7 * k)).filter((v, i, a) => v >= 1 && v <= n && a.indexOf(v) === i).sort((x, y) => x - y);
    $in(el, '#co').innerHTML = `<b style="font-size:20px">${m + 1}월 ${sel}일은 ${DAY[col]}요일</b><br>같은 ${DAY[col]}요일: ${same.join(', ')}일 → 아래로 한 칸 갈 때마다 <b>7씩</b> 커져요 (1주일 = 7일).<br>${sel + 7 <= n ? `1주일 후는 ${sel + 7}일, ` : ''}${m + 1}월은 <b>${n}일</b>까지 있어요.<br><span style="color:${GRAY}">1년 = 12개월 · 날수가 31일인 달: 1, 3, 5, 7, 8, 10, 12월</span>`; };
  $in(el, '#cp').addEventListener('click', () => { m = (m + 11) % 12; draw(); }); $in(el, '#cx').addEventListener('click', () => { m = (m + 1) % 12; draw(); }); draw();
} };

// 조사하여 표와 그래프로
const surveyLab = { title: '친구들의 투표를 표와 그래프로 나타내기', init(el){
  const IT = [['🍎', '사과'], ['🍌', '바나나'], ['🍇', '포도'], ['🍓', '딸기']], MX = 8, MK = { o: '○', x: '×', s: '/' };
  let c = [4, 2, 5, 3], mk = 'o';
  el.innerHTML = `<div class="out">좋아하는 과일에 한 표씩! (한 과일에 최대 ${MX}표)</div><div class="ctrl">${IT.map((t, i) => `<button class="tbtn" type="button" data-v="${i}">${t[0]} ${t[1]} +1</button>`).join('')}</div><div class="ctrl"><button class="tbtn" type="button" id="sr">🎲 다른 반</button><button class="tbtn" type="button" id="s0">↺ 모두 지우기</button>${Object.keys(MK).map(k => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${k === mk}">${MK[k]}로 그리기</button>`).join('')}</div><div class="tscroll" id="st"></div><div class="tscroll" id="sg" style="margin-top:8px"></div><div class="out" id="so"></div>`;
  const draw = () => { const tot = c.reduce((a, b) => a + b, 0);
    $in(el, '#st').innerHTML = `<table class="qt" style="margin:auto"><tr><th>과일</th>${IT.map(t => `<th>${t[0]} ${t[1]}</th>`).join('')}<th>합계</th></tr><tr><th>학생 수(명)</th>${c.map(v => `<td style="font-family:Fredoka;font-size:18px">${v}</td>`).join('')}<td style="font-family:Fredoka;font-size:18px"><b>${tot}</b></td></tr></table>`;
    let g = `<table class="qt" style="margin:auto"><caption style="font-family:Jua;padding:4px">좋아하는 과일별 학생 수</caption>`;
    for (let r = MX; r >= 1; r--) g += `<tr><th style="font-size:12px">${r}</th>${c.map(v => `<td style="width:52px;height:24px;font-size:18px;color:${BL}">${v >= r ? MK[mk] : ''}</td>`).join('')}</tr>`;
    $in(el, '#sg').innerHTML = g + `<tr><th style="font-size:11px">학생 수<br>(명) / 과일</th>${IT.map(t => `<th>${t[0]}<br>${t[1]}</th>`).join('')}</tr></table>`;
    const mx = Math.max(...c), mn = Math.min(...c), big = IT.filter((t, i) => c[i] === mx).map(t => t[1]), sm = IT.filter((t, i) => c[i] === mn).map(t => t[1]);
    $in(el, '#so').innerHTML = tot ? `가장 많은 학생이 좋아하는 과일: <b>${big.join(', ')}</b> (${mx}명) · 가장 적은: <b>${sm.join(', ')}</b> (${mn}명)<br>조사한 학생은 모두 <b>${tot}명</b> — 합계는 <b>표</b>에서, 많고 적음은 <b>그래프</b>에서 한눈에 알 수 있어요.` : '투표를 시작해 보세요!'; };
  el.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.v; if (c[i] < MX) c[i]++; draw(); }));
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { mk = b.dataset.k; press(el, '[data-k]', b); draw(); }));
  $in(el, '#sr').addEventListener('click', () => { c = c.map(() => ri(1, MX)); draw(); }); $in(el, '#s0').addEventListener('click', () => { c = [0, 0, 0, 0]; draw(); }); draw();
} };

// 무늬 규칙
const tileLab = { title: '색깔 규칙을 골라 무늬 만들기', init(el){
  const PC = ['#FF8A8A', '#6FB1F0', '#FFD45E', '#7FD08E'], RU = [['col', '세로줄마다'], ['d2', '↙ 방향 같은 색'], ['d1', '↘ 방향 같은 색']];
  let k = 3, ru = 'd2';
  el.innerHTML = `<div class="ctrl">${[2, 3, 4].map(n => `<button class="tbtn" type="button" data-n="${n}" aria-pressed="${n === k}">${n}가지 색</button>`).join('')}</div><div class="ctrl">${RU.map(r => `<button class="tbtn" type="button" data-r="${r[0]}" aria-pressed="${r[0] === ru}">${r[1]}</button>`).join('')}</div><div class="figc" id="tf"></div><div class="out" id="to"></div>`;
  const draw = () => { const s = 36, C = 8, R = 4; let g = '';
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){ const i = ru === 'col' ? c % k : ru === 'd2' ? (c + r) % k : (c - r + 40) % k; g += `<rect x="${4 + c * s}" y="${4 + r * s}" width="${s}" height="${s}" fill="${PC[i]}" stroke="${INK}" stroke-width="1.4"/>`; }
    $in(el, '#tf').innerHTML = svg(C * s + 8, R * s + 8, g);
    const nm = ['빨간색', '파란색', '노란색', '초록색'].slice(0, k).join(', ');
    $in(el, '#to').innerHTML = `규칙: <b>${nm}</b>이 반복돼요.<br>${ru === 'col' ? '세로줄은 같은 색이고, 오른쪽으로 갈 때마다 다음 색이 와요.' : ru === 'd2' ? '첫째 줄의 색을 <b>한 칸씩 왼쪽으로 밀어서</b> 다음 줄을 만들었어요 → ↙ 방향으로 같은 색이 놓여요.' : '첫째 줄의 색을 <b>한 칸씩 오른쪽으로 밀어서</b> 다음 줄을 만들었어요 → ↘ 방향으로 같은 색이 놓여요.'}`; };
  el.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { k = +b.dataset.n; press(el, '[data-n]', b); draw(); }));
  el.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { ru = b.dataset.r; press(el, '[data-r]', b); draw(); }));
  draw();
} };

// 쌓은 모양의 규칙
const stairLab = { title: '쌓기나무가 늘어나는 규칙 찾기', init(el){
  const SH = { s: ['계단 모양', n => [range(1, n)], n => n * (n + 1) / 2], l: ['ㄴ 모양', n => range(1, n).map((_, r) => range(1, n).map((_, c) => (c === 0 || r === n - 1) ? 1 : 0)), n => 2 * n - 1], t: ['한 층씩 위로', n => [[n]], n => n] };
  let sh = 'l';
  el.innerHTML = `<div class="ctrl">${Object.keys(SH).map(k => `<button class="tbtn" type="button" data-s="${k}" aria-pressed="${k === sh}">${SH[k][0]}</button>`).join('')}</div><div class="ctrl"><label>순서</label><input type="range" min="1" max="5" value="3" id="sn"><span class="v" id="snv"></span></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  const draw = () => { const n = +$in(el, '#sn').value, [nm, Hf, cnt] = SH[sh]; $in(el, '#snv').textContent = `${n}째`;
    $in(el, '#sf').innerHTML = window.TM_Q6 ? window.TM_Q6.iso(Hf(n), 24) : '';
    const seq = range(1, 6).map(cnt), d = seq[1] - seq[0], same = seq.every((v, i) => !i || v - seq[i - 1] === d);
    $in(el, '#so').innerHTML = `${n}째: 쌓기나무 <b style="font-size:22px">${cnt(n)}개</b><br>순서대로: ${seq.slice(0, 5).map((v, i) => i + 1 === n ? `<b style="background:#FFE38A">${v}</b>` : v).join(', ')}, <b>?</b><br>${same ? `쌓기나무가 <b>${d}개씩</b> 늘어나요 → 6째에는 <b>${seq[5]}개</b>` : `늘어나는 개수가 2개, 3개, 4개, …로 <b>1개씩 더</b> 많아져요 → 6째에는 <b>${seq[5]}개</b>`}`; };
  el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { sh = b.dataset.s; press(el, '[data-s]', b); draw(); }));
  $in(el, '#sn').addEventListener('input', draw); draw();
} };

// 자리 번호
const seatLab = { title: '공연장 자리 번호의 규칙 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>한 줄의 자리 수</label><input type="range" min="5" max="9" value="7" id="sc"><span class="v" id="scv"></span></div><div class="figc" id="sf" style="overflow-x:auto"></div><div class="out" id="so"></div>`;
  let sel = 10;
  const draw = () => { const C = +$in(el, '#sc').value, R = 5, ROW = ['가', '나', '다', '라', '마']; $in(el, '#scv').textContent = C; if (sel > C * R) sel = C * R;
    const sr = Math.floor((sel - 1) / C), sc = (sel - 1) % C;
    let h = `<div style="display:inline-block"><div style="background:#22314A;color:#fff;border-radius:6px;padding:2px;margin:0 auto 6px;width:${C * 40}px;font-family:Jua">🎭 무대</div>`;
    for (let r = 0; r < R; r++) h += `<div style="white-space:nowrap"><b style="display:inline-block;width:22px">${ROW[r]}</b>${range(0, C - 1).map(c => { const v = r * C + c + 1; return `<button type="button" class="tbtn" data-v="${v}" style="width:36px;height:32px;padding:0;margin:2px;font-family:Fredoka;${v === sel ? 'background:#FF9F43' : r === sr || c === sc ? 'background:#FFF0C2' : ''}">${v}</button>`; }).join('')}</div>`;
    $in(el, '#sf').innerHTML = h + '</div>';
    el.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { sel = +b.dataset.v; draw(); }));
    $in(el, '#so').innerHTML = `<b style="font-size:20px">${ROW[sr]}열 ${sel}번</b><br>오른쪽으로 한 칸 갈 때마다 <b>1씩</b>, 뒤로 한 줄 갈 때마다 <b>${C}씩</b> 커져요 (한 줄에 ${C}자리).${sr < R - 1 ? `<br>바로 뒷자리는 ${sel} + ${C} = <b>${sel + C}번</b>` : ''}`; };
  $in(el, '#sc').addEventListener('input', draw); draw();
} };

/* ═════════════ 1. 네 자리 수 ═════════════ */
add({ key:'2-2-1', title:'네 자리 수', intro:'1000이 몇 개인 수를 알고, 네 자리 수를 읽고 쓰며 자릿값·뛰어 세기·크기 비교를 해요.',
  prev:'[2-1] 세 자리 수', lessons:[
  { title:'천을 알아볼까요', std:['2수01-02'], key:'100이 <b>10개</b>이면 <b>1000</b>이에요. 1000은 "천"이라고 읽어요.',
    body:`${E('900보다 100 큰 수 = 990보다 10 큰 수 = 999보다 1 큰 수 = 1000')}`,
    lab: moneyLab, ex:`<p>100원짜리 동전 10개 → <b>1000원</b></p>`, quiz:[['k-1000', 1]] },
  { title:'몇천을 알아볼까요', std:['2수01-02'], key:'1000이 3개이면 <b>3000</b>(삼천)이에요.',
    body:`<p>1000이 ■개이면 ■000 — 천 원짜리 지폐 5장은 5000원이에요.</p>`,
    lab: L2.placeLab(4, 3000), ex:`<p>1000이 7개 → <b>7000</b> (칠천)</p>`, quiz:[['k-th', 1]] },
  { title:'네 자리 수를 알아볼까요', std:['2수01-01', '2수01-02'], key:'1000이 2개, 100이 3개, 10이 5개, 1이 4개이면 <b>2354</b>예요.',
    body:`${E('2354 → 이천삼백오십사')}<p>숫자가 0인 자리는 읽지 않아요: 4062 → 사천육십이</p>`,
    lab: moneyLab, ex:`<p>천 원 3장, 백 원 2개, 십 원 7개 → <b>3270원</b></p>`, quiz:[['k-make', 1], ['k-read', 2]] },
  { title:'각 자리의 숫자는 얼마를 나타낼까요', std:['2수01-02'], key:'5824에서 5는 <b>천의 자리</b> 숫자이고 <b>5000</b>을 나타내요.',
    body:`${E('5824 = 5000 + 800 + 20 + 4')}`,
    lab: L2.placeLab(4, 5824), ex:`<p>7373에서 앞의 7은 7000, 뒤의 7은 <b>70</b>을 나타내요.</p>`, quiz:[['k-digit', 2], ['k-digit', 3]] },
  { title:'뛰어 세어 볼까요', std:['2수01-03'], key:'1000씩 뛰어 세면 <b>천의 자리</b>, 100씩은 백의 자리, 10씩은 십의 자리 숫자가 1씩 커져요.',
    body:`${E('4250 → 4350 → 4450 → 4550 (100씩)')}`,
    lab: L2.skipLab(4, 6250), ex:`<p>9990보다 10 큰 수 → <b>10000</b> (만)</p>`, quiz:[['k-skip', 2], ['k-money', 3]] },
  { title:'수의 크기를 비교해 볼까요', std:['2수01-03'], key:'<b>천의 자리</b>부터 차례로 비교하고, 같으면 다음 자리를 비교해요.',
    body:`${E('3587 &lt; 3612 (천의 자리가 같으니 백의 자리 5 &lt; 6)')}`,
    lab: L2.cmpLab(4), ex:`<p>45□8 &gt; 4567에서 □에 들어갈 수 있는 수 → 6, 7, 8, 9</p>`, quiz:[['k-cmp', 2], ['k-missing', 4], ['k-cards', 5]] }
]});

/* ═════════════ 2. 곱셈구구 ═════════════ */
add({ key:'2-2-2', title:'곱셈구구', intro:'2단부터 9단, 1단과 0의 곱까지 곱셈구구를 만들고, 곱셈표에서 규칙을 찾아 문제를 해결해요.',
  prev:'[2-1] 곱셈', lessons:[
  { title:'2단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'2단 곱셈구구에서 곱하는 수가 1 커지면 곱은 <b>2씩</b> 커져요.',
    body:`${E('2 × 1 = 2, 2 × 2 = 4, 2 × 3 = 6, … , 2 × 9 = 18')}`,
    lab: danLab(2), ex:`<p>자전거 한 대의 바퀴 2개, 6대 → 2 × 6 = <b>12</b></p>`, quiz:[['gg-25', 1], ['gg-fig', 1]] },
  { title:'5단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'5단의 곱은 <b>5씩</b> 커지고, 일의 자리 숫자가 5, 0으로 반복돼요.',
    body:`${E('5, 10, 15, 20, 25, 30, 35, 40, 45')}`,
    lab: danLab(5), ex:`<p>한 손에 손가락 5개, 7명의 한 손 → 5 × 7 = <b>35</b></p>`, quiz:[['gg-25', 1]] },
  { title:'3단, 6단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'3단은 3씩, 6단은 6씩 커져요. 6단의 곱은 3단의 곱의 <b>2배</b>예요.',
    body:`${E('3 × 4 = 12 → 6 × 4 = 24 (12의 2배)')}`,
    lab: danLab(3), ex:`<p>세발자전거 5대의 바퀴 → 3 × 5 = <b>15</b></p>`, quiz:[['gg-3648', 1], ['gg-3648', 2]] },
  { title:'4단, 8단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'4단은 4씩, 8단은 8씩 커져요. 8단의 곱은 4단의 곱의 <b>2배</b>예요.',
    body:`${E('4 × 6 = 24 → 8 × 6 = 48')}`,
    lab: danLab(4), ex:`<p>문어 다리 8개, 3마리 → 8 × 3 = <b>24</b></p>`, quiz:[['gg-3648', 2]] },
  { title:'7단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'7단 곱셈구구에서 곱은 <b>7씩</b> 커져요.',
    body:`${E('7, 14, 21, 28, 35, 42, 49, 56, 63')}`,
    lab: danLab(7), ex:`<p>1주일은 7일, 4주일 → 7 × 4 = <b>28일</b></p>`, quiz:[['gg-79', 2]] },
  { title:'9단 곱셈구구를 알아볼까요', std:['2수01-11'], key:'9단의 곱은 <b>9씩</b> 커지고, 십의 자리 숫자와 일의 자리 숫자의 합이 9예요.',
    body:`${E('9 × 6 = 54 → 5 + 4 = 9')}`,
    lab: danLab(9), ex:`<p>9 × 8은 9 × 9 = 81보다 9 작은 <b>72</b></p>`, quiz:[['gg-79', 2]] },
  { title:'1단 곱셈구구와 0의 곱을 알아볼까요', std:['2수01-11'], key:'1 × (어떤 수) = <b>어떤 수</b>, 0 × (어떤 수) = (어떤 수) × 0 = <b>0</b>',
    body:`<p>꽃병 한 개에 꽃 1송이씩 5개 → 1 × 5 = 5<br>과녁에서 0점을 3번 → 0 × 3 = 0</p>`,
    lab: danLab(1), ex:`<p>7 × 0 = <b>0</b>, 1 × 8 = <b>8</b></p>`, quiz:[['gg-01', 2]] },
  { title:'곱셈표를 만들어 볼까요', std:['2수01-11', '2수02-01'], key:'곱셈표에서 <b>곱하는 두 수의 순서를 바꾸어도 곱은 같아요</b>.',
    body:`${E('3 × 6 = 18 = 6 × 3')}`,
    lab: tableLab('×'), ex:`<p>곱셈표에서 곱이 12인 칸: 2 × 6, 3 × 4, 4 × 3, 6 × 2</p>`, quiz:[['gg-swap', 2], ['gg-table', 3], ['gg-cmp', 3]] },
  { title:'곱셈구구로 문제를 해결해 볼까요', std:['2수01-11'], key:'"<b>몇씩 몇 묶음</b>"을 찾아 곱셈구구를 이용해요.',
    body:`<p>한 줄에 6개씩 4줄과 남은 3개 → 6 × 4 + 3 = 27</p>`,
    lab: L2.arrLab, ex:`<p>□ × 7 = 56 → 7단에서 56을 찾으면 <b>8</b></p>`, quiz:[['gg-word', 2], ['gg-missing', 3], ['gg-two', 4]] }
]});

/* ═════════════ 3. 길이 재기 ═════════════ */
add({ key:'2-2-3', title:'길이 재기', intro:'cm보다 큰 단위 m를 알고, 길이를 더하고 빼며 몸을 이용해 길이를 어림해요.',
  prev:'[2-1] 길이 재기 (cm)', lessons:[
  { title:'cm보다 더 큰 단위를 알아볼까요', std:['2수03-11'], key:'<b>100 cm = 1 m</b> (1 미터)',
    body:`${E('130 cm = 1 m 30 cm ("1 미터 30 센티미터")')}`,
    lab: meterLab, ex:`<p>2 m 5 cm = <b>205 cm</b> (5 cm는 십의 자리가 0)</p>`, quiz:[['m-conv', 1], ['m-unit', 1]] },
  { title:'자로 길이를 재어 볼까요', std:['2수03-11'], key:'긴 물건은 <b>줄자</b>나 1 m 자로 재요. 물건의 한끝을 눈금 <b>0</b>에 맞춰요.',
    body:`<p>책상의 긴 쪽 끝이 120에 있으면 120 cm = 1 m 20 cm</p>`,
    lab: meterLab, ex:`<p>문의 높이 210 cm → <b>2 m 10 cm</b></p>`, quiz:[['m-conv', 2]] },
  { title:'길이의 합을 구해 볼까요', std:['2수03-13'], key:'<b>m는 m끼리, cm는 cm끼리</b> 더해요.',
    body:`${E('1 m 30 cm + 2 m 45 cm = 3 m 75 cm')}`,
    lab: mcmLab('+'), ex:`<p>2 m 10 cm 끈에 1 m 50 cm를 이으면 <b>3 m 60 cm</b></p>`, quiz:[['m-add', 2], ['m-word', 3]] },
  { title:'길이의 차를 구해 볼까요', std:['2수03-13'], key:'<b>m는 m끼리, cm는 cm끼리</b> 빼요.',
    body:`${E('4 m 80 cm − 1 m 50 cm = 3 m 30 cm')}`,
    lab: mcmLab('-'), ex:`<p>3 m 60 cm와 360 cm는 같은 길이예요.</p>`, quiz:[['m-sub', 2], ['m-cmp', 2]] },
  { title:'길이를 어림해 볼까요 (1)', std:['2수03-12'], key:'내 몸의 부분(뼘, 걸음, 양팔)의 길이를 알면 긴 길이를 <b>어림</b>할 수 있어요.',
    body:`<p>양팔을 벌린 길이가 약 1 m이면, 칠판 긴 쪽은 양팔로 4번 → 약 4 m</p>`,
    lab: bodyLab, ex:`<p>한 걸음이 약 50 cm, 6걸음 → 약 <b>3 m</b></p>`, quiz:[['m-est', 3]] },
  { title:'길이를 어림해 볼까요 (2)', std:['2수03-12', '2수03-13'], key:'1 m가 몇 번쯤 들어가는지 생각해 길이를 어림하고, 자로 재어 확인해요.',
    body:`<p>어림한 길이와 잰 길이의 차가 작을수록 잘 어림한 거예요.</p>`,
    lab: bodyLab, ex:`<p>1 m 20 cm 막대 두 개를 20 cm 겹쳐 이으면 <b>2 m 20 cm</b></p>`, quiz:[['m-word', 4], ['m-overlap', 4]] }
]});

/* ═════════════ 4. 시각과 시간 ═════════════ */
add({ key:'2-2-4', title:'시각과 시간', intro:'몇 시 몇 분을 읽고, 1시간 = 60분, 하루, 1주일, 달력의 관계를 알아요.',
  prev:'[1-2] 모양과 시각 (몇 시, 몇 시 30분)', lessons:[
  { title:'몇 시 몇 분을 읽어 볼까요 (1)', std:['2수03-07'], key:'긴바늘이 가리키는 숫자가 1이면 <b>5분</b>, 2이면 10분, 3이면 15분 … 이에요.',
    body:`<p>짧은바늘이 4와 5 사이, 긴바늘이 7 → <b>4시 35분</b></p>`,
    lab: K.clockLab('min5'), ex:`<p>긴바늘이 11 → <b>55분</b></p>`, quiz:[['tk-5', 1]] },
  { title:'몇 시 몇 분을 읽어 볼까요 (2)', std:['2수03-07'], key:'긴바늘이 작은 눈금 <b>한 칸</b>을 가는 데 <b>1분</b>이 걸려요.',
    body:`<p>긴바늘이 4에서 작은 눈금 2칸 더 → 20 + 2 = <b>22분</b></p>`,
    lab: K.clockLab('min1'), ex:`<p>짧은바늘이 9와 10 사이, 긴바늘이 8에서 3칸 더 → <b>9시 43분</b></p>`, quiz:[['tk-1', 2]] },
  { title:'여러 가지 방법으로 시각을 읽어 볼까요', std:['2수03-07'], key:'2시 55분은 3시가 되기 <b>5분 전</b>이에요 → "<b>3시 5분 전</b>"',
    body:`${E('7시 50분 = 8시 10분 전')}`,
    lab: K.clockLab('min5'), ex:`<p>11시 45분 → <b>12시 15분 전</b></p>`, quiz:[['tk-before', 2]] },
  { title:'1시간을 알아볼까요', std:['2수03-08'], key:'긴바늘이 한 바퀴 도는 데 걸리는 시간은 <b>60분 = 1시간</b>이에요.',
    body:`${E('1시간 20분 = 60분 + 20분 = 80분')}`,
    lab: durLab, ex:`<p>100분 = 60분 + 40분 → <b>1시간 40분</b></p>`, quiz:[['tk-60', 2]] },
  { title:'걸린 시간을 알아볼까요', std:['2수03-08'], key:'시작한 시각부터 끝난 시각까지를 <b>시간 띠</b>에 색칠해 걸린 시간을 구해요.',
    body:`<p>9시 10분 → 10시 30분: 1시간 + 20분 = <b>1시간 20분</b></p>`,
    lab: durLab, ex:`<p>2시 40분에 시작해 50분 동안 → 끝난 시각 <b>3시 30분</b></p>`, quiz:[['tk-dur', 3], ['tk-after', 4]] },
  { title:'하루의 시간을 알아볼까요', std:['2수03-09'], key:'<b>하루 = 24시간</b>. 낮 12시 전은 <b>오전</b>, 낮 12시 후는 <b>오후</b>예요.',
    body:`<p>오전 8시에 등교해 오후 2시에 하교 → 학교에 있는 시간 6시간</p>`,
    lab: dayLab, ex:`<p>오후 9시에 자서 다음날 오전 7시에 일어나면 → <b>10시간</b> 동안 자요.</p>`, quiz:[['tk-ampm', 3]] },
  { title:'달력을 알아볼까요', std:['2수03-09'], key:'<b>1주일 = 7일</b>, <b>1년 = 12개월</b>. 달마다 날수가 달라요 (28·29·30·31일).',
    body:`<p>달력에서 같은 요일은 아래로 7일씩 커져요.</p>`,
    lab: calLab, ex:`<p>3주일 = 7 + 7 + 7 = <b>21일</b></p>`, quiz:[['tk-week', 2], ['tk-month', 3], ['tk-cal', 4]] }
]});

/* ═════════════ 5. 표와 그래프 ═════════════ */
add({ key:'2-2-5', title:'표와 그래프', intro:'자료를 분류하여 표로 나타내고, ○, ×, / 를 이용해 그래프로 나타내며 알 수 있는 것을 말해요.',
  prev:'[2-1] 분류하기', lessons:[
  { title:'자료를 분류하여 표로 나타내 볼까요', std:['2수04-02'], key:'자료를 <b>종류별로 세어 표</b>로 나타내면 각각의 수와 <b>합계</b>를 쉽게 알 수 있어요.',
    body:`<p>센 자료에 ✓ 표시를 하면 빠뜨리거나 두 번 세지 않아요.</p>`,
    lab: surveyLab, ex:`<p>사과 4, 바나나 2, 포도 5, 딸기 3 → 합계 <b>14명</b></p>`, quiz:[['tg-count', 1], ['tg-total', 1]] },
  { title:'자료를 조사하여 표로 나타내 볼까요', std:['2수04-02'], key:'<b>무엇을, 누구에게, 어떻게</b> 조사할지 정하고, 조사한 결과를 표로 나타내요.',
    body:`<p>손 들기, 붙임 딱지 붙이기, 이름 쓰기 등 여러 방법으로 조사할 수 있어요.</p>`,
    lab: surveyLab, ex:`<p>"좋아하는 계절" 조사 → 봄, 여름, 가을, 겨울별로 학생 수를 세어 표로</p>`, quiz:[['tg-count', 2], ['tg-total', 2]] },
  { title:'표를 보고 그래프로 나타내 볼까요', std:['2수04-03'], key:'가로와 세로를 정하고, 아래에서부터 <b>한 칸에 하나씩 빈칸 없이</b> ○를 그려요.',
    body:`<p>○ 대신 ×, / 로 나타내도 돼요.</p>`,
    lab: surveyLab, ex:`<p>포도 5명 → 포도 칸에 아래에서 위로 ○ <b>5개</b></p>`, quiz:[['tg-graph', 1], ['tg-rows', 4]] },
  { title:'표와 그래프를 보고 알 수 있는 것', std:['2수04-02', '2수04-03'], key:'<b>표</b>는 각각의 수와 합계를, <b>그래프</b>는 가장 많은 것과 적은 것을 한눈에 알기 편해요.',
    body:`<p>그래프에서 ○가 가장 높이 올라간 것이 가장 많아요.</p>`,
    lab: surveyLab, ex:`<p>포도(5명)는 바나나(2명)보다 <b>3명</b> 더 많아요.</p>`, quiz:[['tg-most', 2], ['tg-diff', 2], ['tg-good', 2]] },
  { title:'표와 그래프로 나타내 해결해 볼까요', std:['2수04-02', '2수04-03'], key:'표의 <b>합계</b>와 그래프를 함께 보면 모르는 수를 구하고 계획을 세울 수 있어요.',
    body:`${E('합계 20명, 나머지 합 14명 → 모르는 수 = 20 − 14 = 6')}`,
    lab: surveyLab, ex:`<p>가장 많은 학생이 좋아하는 과일을 간식으로 준비해요.</p>`, quiz:[['tg-missing', 3], ['tg-plan', 4]] }
]});

/* ═════════════ 6. 규칙 찾기 ═════════════ */
add({ key:'2-2-6', title:'규칙 찾기', intro:'무늬, 쌓은 모양, 덧셈표와 곱셈표, 달력과 생활 속에서 규칙을 찾고 나만의 규칙을 만들어요.',
  prev:'[1-2] 규칙 찾기', lessons:[
  { title:'무늬에서 색깔과 모양의 규칙을 찾아볼까요', std:['2수02-01', '2수02-02'], key:'반복되는 부분(<b>규칙</b>)을 찾으면 다음에 올 것을 알 수 있어요.',
    body:`<p>🔴🔵🔵 🔴🔵🔵 🔴 ? → 반복되는 부분은 🔴🔵🔵, 다음은 🔵</p>`,
    lab: K.patMakeLab, ex:`<p>▲■●▲■●… 10째 → 3개씩 반복, 10 = 3 + 3 + 3 + 1 → <b>▲</b></p>`, quiz:[['r-next', 1], ['r-next', 2]] },
  { title:'무늬에서 규칙을 찾아볼까요 (2)', std:['2수02-01', '2수02-02'], key:'줄마다 색이 <b>한 칸씩 밀리면</b> 대각선 방향으로 같은 색이 놓여요.',
    body:`<p>규칙을 말로 설명하고, 나만의 무늬를 꾸며 보세요.</p>`,
    lab: tileLab, ex:`<p>빨강·파랑·노랑이 반복되는 무늬의 다음 줄은 한 칸 밀려 파랑부터!</p>`, quiz:[['r-nth', 3]] },
  { title:'쌓은 모양에서 규칙을 찾아볼까요', std:['2수02-01'], key:'쌓기나무가 <b>몇 개씩 늘어나는지</b> 찾으면 다음 모양의 개수를 알 수 있어요.',
    body:`<p>1개, 3개, 5개, 7개 → 2개씩 늘어나요 → 다음은 9개</p>`,
    lab: stairLab, ex:`<p>ㄴ 모양 5째 → 5 + 4 = <b>9개</b></p>`, quiz:[['r-stack', 2], ['r-stack', 3]] },
  { title:'덧셈표에서 규칙을 찾아볼까요', std:['2수02-01'], key:'덧셈표에서 오른쪽(아래쪽)으로 갈수록 <b>1씩</b>, ↘ 방향으로 <b>2씩</b> 커져요.',
    body:`<p>↙ 방향에 있는 수는 모두 같아요.</p>`,
    lab: tableLab('+'), ex:`<p>3 + 5 = 8 = 4 + 4 = 5 + 3 (↙ 방향)</p>`, quiz:[['r-addtab', 2], ['r-rule', 3]] },
  { title:'곱셈표에서 규칙을 찾아볼까요', std:['2수02-01'], key:'■단 곱셈구구는 오른쪽(아래쪽)으로 갈수록 <b>■씩</b> 커지고, 대각선을 기준으로 접으면 같은 수끼리 만나요.',
    body:`<p>5단은 일의 자리가 5, 0 반복 · 2, 4, 6, 8단의 곱은 모두 짝수</p>`,
    lab: tableLab('×'), ex:`<p>4 × 7 = 7 × 4 = <b>28</b></p>`, quiz:[['r-multab', 2], ['r-rule', 4]] },
  { title:'달력에서 규칙을 찾아볼까요', std:['2수02-01'], key:'달력에서 오른쪽으로 <b>1씩</b>, 아래쪽으로 <b>7씩</b> 커져요.',
    body:`<p>같은 요일은 7일마다 돌아와요.</p>`,
    lab: calLab, ex:`<p>5일이 목요일이면 12일, 19일, 26일도 <b>목요일</b></p>`, quiz:[['r-cal', 3]] },
  { title:'생활에서 규칙을 찾아볼까요', std:['2수02-01', '2수02-02'], key:'공연장 자리, 엘리베이터 버튼, 신호등처럼 <b>생활 속에도 규칙</b>이 있어요.',
    body:`<p>신호등: 초록 → 노랑 → 빨강이 반복돼요.</p>`,
    lab: seatLab, ex:`<p>한 줄에 8자리 → 뒷자리 번호는 앞자리 번호보다 <b>8</b> 커요.</p>`, quiz:[['r-life', 4], ['r-seat', 4]] }
]});
})();
