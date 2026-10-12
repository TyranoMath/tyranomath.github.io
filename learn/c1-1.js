/* =========================================================
   🦖 개념 탐험대 — 1학년 1학기 (2022 개정 교육과정)
   단원: 1 9까지의 수 · 2 여러 가지 모양 · 3 덧셈과 뺄셈 · 4 비교하기 · 5 50까지의 수
   ※ 1~2학년 공통 실험실(window.TM_L12)도 여기에서 만들어요.
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g1-1.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, H = window.TM_G12;
const { svg, txt, line, range, tableH, ri, pick, shuffle } = A;
const { P, sino, native, ORD, emo, tens, tenFrame, clock, shp, SHN, COLS, barsCmp, seesaw, blocks } = H;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const wa = a => a + P(a, '과', '와');
const big = (s, size = 30) => `<span style="font-size:${size}px">${s}</span>`;

/* ═════════════ 1~2학년 공통 실험실 ═════════════ */
const ICONS = ['🍎', '🐥', '⭐', '🍓', '🐟', '🎈'];
// 수 세기: 그림 · 10칸 틀 · 수 · 두 가지 읽기
const countLab = (max = 9, start = 3) => ({ title: `그림을 늘리고 줄이며 ${max}까지 세어 보기`, init(el){
  el.innerHTML = `<div class="ctrl">${ICONS.map((c, i) => `<button class="tbtn" type="button" data-c="${i}" aria-pressed="${!i}">${c}</button>`).join('')}</div><div class="ctrl"><button class="tbtn" type="button" id="cm">➖</button><span class="v" id="cv" style="font-size:40px;min-width:1.5em"></span><button class="tbtn" type="button" id="cp">➕</button></div><div id="cg"></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  let n = start, ic = ICONS[0];
  const draw = () => { $in(el, '#cv').textContent = n; $in(el, '#cg').innerHTML = n ? emo(ic, n, 5, 36) : '<div class="out">아무것도 없어요</div>'; $in(el, '#cf').innerHTML = max <= 10 ? tenFrame(n) : '';
    $in(el, '#co').innerHTML = n ? `<b style="font-size:26px">${n}</b> → 읽기: <b>${sino(n)}</b>, <b>${native(n)}</b>` : `<b style="font-size:26px">0</b> → 읽기: <b>영</b> (아무것도 없을 때)`; };
  el.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { ic = ICONS[+b.dataset.c]; press(el, '[data-c]', b); draw(); }));
  $in(el, '#cm').addEventListener('click', () => { if (n > 0) n--; draw(); }); $in(el, '#cp').addEventListener('click', () => { if (n < max) n++; draw(); }); draw();
} });
// 순서 (몇째)
const ANI = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐸', '🐯', '🐷'];
const orderLab = { title: '동물을 눌러 몇째인지 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="os">🔀 줄 바꾸기</button></div><div id="or" style="text-align:center;font-size:42px;letter-spacing:6px"></div><div class="out" id="oo">동물을 눌러 보세요.</div>`;
  let row = shuffle(ANI);
  const draw = sel => { $in(el, '#or').innerHTML = row.map((a, i) => `<span data-i="${i}" style="cursor:pointer;${i === sel ? 'background:#FFE38A;border-radius:12px' : ''}">${a}</span>`).join('');
    el.querySelectorAll('[data-i]').forEach(s => s.addEventListener('click', () => { const i = +s.dataset.i; draw(i); $in(el, '#oo').innerHTML = `${row[i]}는 왼쪽에서 <b>${ORD[i + 1]}</b>, 오른쪽에서 <b>${ORD[9 - i]}</b>예요.<br><span style="color:${GRAY}">"몇째"는 순서, "몇 개"는 개수예요. 셋째는 하나만, 세 개는 셋 모두!</span>`; })); };
  $in(el, '#os').addEventListener('click', () => { row = shuffle(ANI); draw(-1); }); draw(-1);
} };
// 수직선 뛰기
const jumpLab = (max = 9) => ({ title: '개구리를 뛰게 하며 1 큰 수, 1 작은 수 알아보기', init(el){
  el.innerHTML = `<div class="figc" id="jf"></div><div class="ctrl"><button class="tbtn" type="button" id="jm">⬅ 1 작게</button><button class="tbtn" type="button" id="jp">1 크게 ➡</button></div><div class="out" id="jo"></div>`;
  let n = Math.min(4, max), prev = null;
  const draw = () => { const W = 40, X = 20; let g = line(X, 70, X + max * W, 70, { w: 2.4 });
    for (let k = 0; k <= max; k++) g += line(X + k * W, 64, X + k * W, 76, { w: 2 }) + txt(X + k * W, 92, k, { size: 15, bold: k === n });
    if (prev != null) g += `<path d="M${X + prev * W} 60 Q${X + (prev + n) / 2 * W} 22 ${X + n * W} 60" fill="none" stroke="${OR}" stroke-width="2.4" stroke-dasharray="4 3"/>`;
    g += `<text x="${X + n * W}" y="58" font-size="30" text-anchor="middle">🐸</text>`;
    $in(el, '#jf').innerHTML = svg(max * W + 40, 100, g);
    $in(el, '#jo').innerHTML = `지금 <b>${n}</b> · ${n < max ? `1 큰 수는 <b>${n + 1}</b>` : ''}${n > 0 ? ` · 1 작은 수는 <b>${n - 1}</b>` : ' · 0보다 1 작은 수는 아직 배우지 않아요'}`; };
  $in(el, '#jm').addEventListener('click', () => { if (n > 0){ prev = n; n--; } draw(); }); $in(el, '#jp').addEventListener('click', () => { if (n < max){ prev = n; n++; } draw(); }); draw();
} });
// 하나씩 짝 지어 크기 비교
const pairCmpLab = (max = 9) => ({ title: '하나씩 짝 지어 어느 쪽이 더 많은지 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>🍎</label><input type="range" min="0" max="${max}" value="5" id="pa"><span class="v" id="pav"></span><label>🍋</label><input type="range" min="0" max="${max}" value="3" id="pb"><span class="v" id="pbv"></span></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  const draw = () => { const a = +$in(el, '#pa').value, b = +$in(el, '#pb').value, u = 34; $in(el, '#pav').textContent = a; $in(el, '#pbv').textContent = b;
    let g = ''; for (let i = 0; i < Math.max(a, b); i++){ if (i < a) g += `<text x="${20 + i * u}" y="34" font-size="26">🍎</text>`; if (i < b) g += `<text x="${20 + i * u}" y="94" font-size="26">🍋</text>`; if (i < a && i < b) g += line(34 + i * u, 40, 34 + i * u, 70, { stroke: '#9AA6B6', w: 1.6, dash: '3 3' }); }
    $in(el, '#pf').innerHTML = svg(Math.max(a, b, 1) * u + 40, 110, g);
    $in(el, '#po').innerHTML = a === b ? `짝이 모두 맞아요 → <b>${a}${P(a, '과', '와')} ${b}${P(b, '은', '는')} 같아요</b>` : `짝이 없는 ${a > b ? '🍎' : '🍋'}가 남아요 → <b>${Math.max(a, b)}${P(Math.max(a, b), '은', '는')} ${Math.min(a, b)}보다 커요</b> (${Math.min(a, b)}${P(Math.min(a, b), '은', '는')} ${Math.max(a, b)}보다 작아요)`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
// 0 알아보기
const zeroLab = { title: '쿠키를 하나씩 먹어 0 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="ze">😋 하나 먹기</button><button class="tbtn" type="button" id="zr">↺ 다시 담기</button></div><div class="figc" id="zf"></div><div class="out" id="zo"></div>`;
  let n = 4;
  const draw = () => { $in(el, '#zf').innerHTML = `<div style="width:220px;height:120px;border-radius:50%;background:#F7F1E4;border:3px solid #D9CFBE;display:grid;place-items:center;font-size:34px">${'🍪'.repeat(n) || '<span style="font-size:18px;color:#5D6C83">텅 비었어요</span>'}</div>`;
    $in(el, '#zo').innerHTML = `접시 위 쿠키: <b style="font-size:28px">${n}</b>개${n ? '' : ' → 아무것도 없으면 <b>0</b>(영)이라고 써요!'}`; };
  $in(el, '#ze').addEventListener('click', () => { if (n) n--; draw(); }); $in(el, '#zr').addEventListener('click', () => { n = ri(2, 6); draw(); }); draw();
} };
// 모으기와 가르기
const joinLab = (max = 9) => ({ title: '구슬을 두 접시에 나누어 모으기와 가르기', init(el){
  el.innerHTML = `<div class="ctrl"><label>전체</label><input type="range" min="2" max="${max}" value="${Math.min(7, max)}" id="jt"><span class="v" id="jtv"></span><label>왼쪽 접시</label><input type="range" min="0" max="${max}" value="3" id="ja"><span class="v" id="jav"></span></div><div class="figc" id="jf"></div><div class="out" id="jo"></div>`;
  const draw = () => { const t = +$in(el, '#jt').value, aI = $in(el, '#ja'); aI.max = t; if (+aI.value > t) aI.value = t; const a = +aI.value, b = t - a; $in(el, '#jtv').textContent = t; $in(el, '#jav').textContent = a;
    const dots = (n, c) => range(1, n).map(() => `<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${c};margin:2px"></span>`).join('');
    $in(el, '#jf').innerHTML = `<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:center"><div style="border:3px solid #BFE6C2;border-radius:50%;width:130px;min-height:100px;display:grid;place-items:center;padding:8px;background:#fff">${dots(a, GR) || '0'}</div><div style="font-size:26px">+</div><div style="border:3px solid #FFD8A8;border-radius:50%;width:130px;min-height:100px;display:grid;place-items:center;padding:8px;background:#fff">${dots(b, OR) || '0'}</div><div style="font-size:26px">=</div><div style="font-family:Fredoka;font-size:40px">${t}</div></div>`;
    $in(el, '#jo').innerHTML = `${wa(a)} ${b}${P(b, '을', '를')} 모으면 <b>${t}</b> · ${t}${P(t, '은', '는')} ${wa(a)} <b>${b}</b>(으)로 가를 수 있어요`.replace('(으)로', b === 0 || [0, 3, 6].includes(b % 10) ? '으로' : '로'); };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
// 그림으로 덧셈·뺄셈
const picOpLab = minus => ({ title: minus ? '덜어 내며 뺄셈 알아보기' : '합쳐 보며 덧셈 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>${minus ? '처음' : '첫째'}</label><input type="range" min="${minus ? 2 : 0}" max="9" value="${minus ? 7 : 4}" id="oa"><span class="v" id="oav"></span><label>${minus ? '덜어 내기' : '더 오기'}</label><input type="range" min="0" max="9" value="3" id="ob"><span class="v" id="obv"></span></div><div id="og" style="text-align:center;font-size:34px;letter-spacing:3px;min-height:50px"></div><div class="out" id="oo" style="font-size:22px"></div>`;
  const draw = () => { const a = +$in(el, '#oa').value, bI = $in(el, '#ob'); bI.max = minus ? a : 9 - a; if (+bI.value > +bI.max) bI.value = bI.max; const b = +bI.value; $in(el, '#oav').textContent = a; $in(el, '#obv').textContent = b;
    $in(el, '#og').innerHTML = minus ? '🐥'.repeat(a - b) + '<span style="opacity:.35">' + '🐥'.repeat(b) + '</span>' : '🐥'.repeat(a) + ' <span style="color:#FF9F43">' + '🐤'.repeat(b) + '</span>';
    $in(el, '#oo').innerHTML = minus ? `병아리 ${a}마리 중 ${b}마리가 집에 갔어요 → <b>${a} - ${b} = ${a - b}</b><br><span style="font-size:16px;color:${GRAY}">"${a} 빼기 ${b}는 ${a - b}와(과) 같습니다." · ${a}와(과) ${a - b}의 차는 ${b}</span>`.replace(/(\d+)와\(과\)/g, (m, d) => d + P(+d, '과', '와')) : `병아리 ${a}마리에 ${b}마리가 더 왔어요 → <b>${a} + ${b} = ${a + b}</b><br><span style="font-size:16px;color:${GRAY}">"${a} 더하기 ${b}는 ${a + b}와(과) 같습니다." · ${wa(a)} ${b}의 합은 ${a + b}</span>`.replace(/(\d+)와\(과\)/g, (m, d) => d + P(+d, '과', '와')); };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
// 길이 비교
const LENS = [['✏️', '연필'], ['🖍️', '크레파스'], ['🖌️', '붓'], ['🥢', '젓가락']];
const lenLab = { title: '한쪽 끝을 맞추어 길이 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>연필</label><input type="range" min="2" max="10" value="6" id="la"><label>붓</label><input type="range" min="2" max="10" value="8" id="lb"><label>크레파스</label><input type="range" min="2" max="10" value="4" id="lc"><button class="tbtn" type="button" id="lx" aria-pressed="true">끝 맞추기</button></div><div class="figc" id="lf"></div><div class="out" id="lo"></div>`;
  let align = true; const off = [ri(0, 3), ri(0, 3), ri(0, 3)];
  const draw = () => { const v = ['#la', '#lb', '#lc'].map(s => +$in(el, s).value), nm = ['연필', '붓', '크레파스'], u = 26; let g = '';
    v.forEach((x, i) => { const s = align ? 0 : off[i]; g += txt(46, 22 + i * 40, nm[i], { size: 13, bold: true, anchor: 'end' }) + `<rect x="${54 + s * u}" y="${10 + i * 40}" width="${x * u}" height="24" rx="10" fill="${COLS[i]}" stroke="${INK}" stroke-width="1.6"/>`; });
    if (align) g += line(54, 4, 54, 130, { stroke: RED, w: 2, dash: '4 3' });
    $in(el, '#lf').innerHTML = svg(54 + 14 * u, 134, g);
    const mx = Math.max(...v), mn = Math.min(...v);
    $in(el, '#lo').innerHTML = align ? `가장 긴 것: <b>${nm.filter((_, i) => v[i] === mx).join(', ')}</b> · 가장 짧은 것: <b>${nm.filter((_, i) => v[i] === mn).join(', ')}</b><br><span style="color:${GRAY}">한쪽 끝을 맞추고 다른 쪽 끝을 비교해요. "더 길다", "더 짧다"</span>` : '⚠️ 끝을 맞추지 않으면 길이를 바르게 비교할 수 없어요. "끝 맞추기"를 눌러 보세요.'; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#lx').addEventListener('click', e => { align = !align; e.target.setAttribute('aria-pressed', align); draw(); }); draw();
} };
// 시소로 무게 비교
const HV = [['🐘', '코끼리', 9], ['🐻', '곰', 7], ['🐷', '돼지', 6], ['🐶', '강아지', 4], ['🐱', '고양이', 3], ['🐰', '토끼', 2], ['🐭', '생쥐', 1]];
const seeLab = { title: '시소에 태워 무게 비교하기', init(el){
  el.innerHTML = `<div class="ctrl" id="sl"></div><div class="ctrl" id="sr"></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  let a = 3, b = 1;
  const draw = () => { $in(el, '#sl').innerHTML = '<label>왼쪽</label>' + HV.map((h, i) => `<button class="tbtn" type="button" data-l="${i}" aria-pressed="${i === a}">${h[0]}</button>`).join(''); $in(el, '#sr').innerHTML = '<label>오른쪽</label>' + HV.map((h, i) => `<button class="tbtn" type="button" data-r="${i}" aria-pressed="${i === b}">${h[0]}</button>`).join('');
    el.querySelectorAll('[data-l]').forEach(x => x.addEventListener('click', () => { a = +x.dataset.l; draw(); })); el.querySelectorAll('[data-r]').forEach(x => x.addEventListener('click', () => { b = +x.dataset.r; draw(); }));
    const L1 = HV[a], R1 = HV[b];
    $in(el, '#sf').innerHTML = a === b ? seesaw(L1[0], R1[0], true).replace(/rotate\(-?12/, 'rotate(0') : seesaw(L1[0], R1[0], L1[2] > R1[2]);
    $in(el, '#so').innerHTML = a === b ? '무게가 같으면 시소가 수평이 돼요.' : `${L1[2] > R1[2] ? L1[1] : R1[1]} 쪽이 내려갔어요 → <b>${L1[2] > R1[2] ? L1[1] : R1[1]}</b>${P(L1[2] > R1[2] ? L1[1] : R1[1], '이', '가')} 더 <b>무거워요</b>. ${L1[2] > R1[2] ? R1[1] : L1[1]}${P(L1[2] > R1[2] ? R1[1] : L1[1], '은', '는')} 더 <b>가벼워요</b>.`; };
  draw();
} };
// 넓이 비교 (겹쳐 보기)
const areaLab = { title: '두 종이를 겹쳐 넓이 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가 가로</label><input type="range" min="2" max="8" value="6" id="aw"><label>가 세로</label><input type="range" min="2" max="6" value="3" id="ah"></div><div class="ctrl"><label>나 가로</label><input type="range" min="2" max="8" value="4" id="bw"><label>나 세로</label><input type="range" min="2" max="6" value="4" id="bh"></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  const draw = () => { const [aw, ah, bw, bh] = ['#aw', '#ah', '#bw', '#bh'].map(s => +$in(el, s).value), u = 28; let g = '';
    for (let x = 0; x < aw; x++) for (let y = 0; y < ah; y++) g += `<rect x="${10 + x * u}" y="${10 + y * u}" width="${u}" height="${u}" fill="#9CC7EE" opacity=".7" stroke="${INK}" stroke-width=".8"/>`;
    for (let x = 0; x < bw; x++) for (let y = 0; y < bh; y++) g += `<rect x="${10 + x * u}" y="${10 + y * u}" width="${u}" height="${u}" fill="#FFB3B3" opacity=".55" stroke="${RED}" stroke-width=".8"/>`;
    $in(el, '#af').innerHTML = svg(20 + 8 * u, 20 + 6 * u, g);
    const A1 = aw * ah, B1 = bw * bh;
    $in(el, '#ao').innerHTML = `<span style="color:${BL}">■ 가</span> ${A1}칸 · <span style="color:${RED}">■ 나</span> ${B1}칸 → ${A1 === B1 ? '두 종이의 넓이가 <b>같아요</b>' : `<b>${A1 > B1 ? '가' : '나'}</b> 종이가 더 <b>넓어요</b>`}<br><span style="color:${GRAY}">겹쳤을 때 남는 부분이 있는 쪽이 더 넓어요. 칸 수를 세어 비교할 수도 있어요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 담을 수 있는 양 비교
const cupLab = { title: '컵으로 물을 부어 담을 수 있는 양 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cg">🥛 가 그릇에 한 컵 붓기</button><button class="tbtn" type="button" id="cn">🥛 나 그릇에 한 컵 붓기</button><button class="tbtn" type="button" id="cr">↺ 비우기</button></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  const cap = shuffle([5, 7]); let f = [0, 0];
  const draw = () => { let g = ''; [0, 1].forEach(i => { const x = 30 + i * 150, H0 = 120, w = i ? 70 : 90, h = cap[i] * 120 / 7 * (i ? 90 / 70 : 1) * (i ? .78 : .78), lvl = Math.min(f[i], cap[i]) / cap[i] * h;
      g += `<rect x="${x}" y="${H0 + 10 - lvl}" width="${w}" height="${lvl}" fill="#9CD3F5"/><path d="M${x} ${H0 + 10 - h} L${x} ${H0 + 10} L${x + w} ${H0 + 10} L${x + w} ${H0 + 10 - h}" fill="none" stroke="${INK}" stroke-width="2.6"/>` + txt(x + w / 2, H0 + 28, `${'가나'[i]} (${f[i]}컵)`, { size: 14, bold: true }); if (f[i] > cap[i]) g += txt(x + w / 2, H0 + 4 - h, '💦 넘쳐요!', { size: 12, fill: RED, bold: true }); });
    $in(el, '#cf').innerHTML = svg(320, 160, g);
    const full = [f[0] >= cap[0], f[1] >= cap[1]];
    $in(el, '#co').innerHTML = full[0] && full[1] ? `가는 ${cap[0]}컵, 나는 ${cap[1]}컵 → 컵을 더 많이 부은 <b>${cap[0] > cap[1] ? '가' : '나'}</b> 그릇에 더 많이 담을 수 있어요!` : '두 그릇이 가득 찰 때까지 같은 컵으로 부어 보세요. 몇 컵이 들어갈까요?'; };
  $in(el, '#cg').addEventListener('click', () => { if (f[0] <= cap[0]) f[0]++; draw(); }); $in(el, '#cn').addEventListener('click', () => { if (f[1] <= cap[1]) f[1]++; draw(); }); $in(el, '#cr').addEventListener('click', () => { f = [0, 0]; draw(); }); draw();
} };
// 10개씩 묶음과 낱개
const bundleLab = (max = 50, start = 23) => ({ title: `10개씩 묶어 ${max}까지의 수 세기`, init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="bm10">-10</button><button class="tbtn" type="button" id="bm">-1</button><span class="v" id="bv" style="font-size:38px;min-width:2em"></span><button class="tbtn" type="button" id="bp">+1</button><button class="tbtn" type="button" id="bp10">+10</button></div><div id="bg"></div><div class="out" id="bo"></div>`;
  let n = start;
  const draw = () => { $in(el, '#bv').textContent = n; $in(el, '#bg').innerHTML = tens('🍎', n, 15);
    $in(el, '#bo').innerHTML = `10개씩 묶음 <b>${Math.floor(n / 10)}</b>개와 낱개 <b>${n % 10}</b>개 → <b>${n}</b> (${sino(n)}, ${native(n)})${n % 10 === 0 && n ? ' · 낱개가 없는 몇십이에요!' : ''}`; };
  const set = d => { n = Math.max(1, Math.min(max, n + d)); draw(); };
  $in(el, '#bm10').addEventListener('click', () => set(-10)); $in(el, '#bm').addEventListener('click', () => set(-1)); $in(el, '#bp').addEventListener('click', () => set(1)); $in(el, '#bp10').addEventListener('click', () => set(10)); draw();
} });
// 수 배열판 (1부터 max까지)
const boardLab = (max = 50, mode = 'near') => ({ title: mode === 'step' ? '수 배열판에서 뛰어 세며 규칙 찾기' : '수 배열판에서 수를 눌러 앞뒤의 수 알아보기', init(el){
  el.innerHTML = `${mode === 'step' ? `<div class="ctrl"><label>몇씩</label>${[2, 5, 10, 11].map((k, i) => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${!i}">${k === 11 ? '↘ 방향' : k + '씩'}</button>`).join('')}</div>` : ''}<div class="board" id="bb"></div><div class="out" id="bo">${mode === 'step' ? '' : '수를 눌러 보세요.'}</div>`;
  let sel = mode === 'step' ? null : 25, k = 2, start = 2;
  const draw = () => { const hl = new Set(mode === 'step' ? range(0, 20).map(i => start + k * i).filter(x => x <= max) : sel ? [sel] : []), near = mode === 'step' ? new Set() : new Set([sel - 1, sel + 1, sel - 10, sel + 10]);
    $in(el, '#bb').innerHTML = range(1, max).map(x => `<span data-x="${x}" class="${hl.has(x) ? 'ab' : near.has(x) ? 'a' : ''}" style="cursor:pointer">${x}</span>`).join('');
    el.querySelectorAll('[data-x]').forEach(s => s.addEventListener('click', () => { if (mode === 'step'){ start = +s.dataset.x; } else sel = +s.dataset.x; draw(); }));
    $in(el, '#bo').innerHTML = mode === 'step' ? `${start}부터 ${k === 11 ? '↘ 방향으로 11' : k}씩 커지는 수: ${[...hl].join(', ')}<br><span style="color:${GRAY}">수를 누르면 시작하는 수가 바뀌어요. 오른쪽으로 1씩, 아래로 10씩 커져요.</span>` : `<b>${sel}</b> → 1 작은 수 ${sel - 1 >= 1 ? sel - 1 : '-'}, 1 큰 수 ${sel + 1 <= max ? sel + 1 : '-'}${max > 50 ? ` · 10 작은 수 ${sel - 10 >= 1 ? sel - 10 : '-'}, 10 큰 수 ${sel + 10 <= max ? sel + 10 : '-'}` : ''}<br><span style="color:${GRAY}">오른쪽으로 갈수록 1씩, 아래로 갈수록 10씩 커져요.</span>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { k = +b.dataset.k; press(el, '[data-k]', b); draw(); })); draw();
} });
// 시계 (몇 시 / 몇 시 30분 / 몇 시 몇 분)
const clockLab = (mode = 'half') => ({ title: mode === 'hour' ? '시곗바늘을 돌려 몇 시 알아보기' : mode === 'half' ? '시곗바늘을 돌려 몇 시 30분 알아보기' : '긴바늘을 돌려 몇 시 몇 분 읽기', init(el){
  const step = mode === 'hour' ? 60 : mode === 'half' ? 30 : mode === 'min5' ? 5 : 1;
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="kb">⏪ ${step === 60 ? '1시간' : step + '분'}</button><button class="tbtn" type="button" id="kf">${step === 60 ? '1시간' : step + '분'} ⏩</button>${step < 30 ? '<button class="tbtn" type="button" id="kh">1시간 ⏩</button>' : ''}</div><div class="figc" id="kc"></div><div class="out" id="ko" style="font-size:20px"></div>`;
  let t = 3 * 60;
  const draw = () => { const h = (Math.floor(t / 60) + 11) % 12 + 1, m = t % 60; $in(el, '#kc').innerHTML = clock(h, m, 200);
    const nh = h % 12 + 1;
    $in(el, '#ko').innerHTML = `<b style="font-size:28px">${h}시${m ? ` ${m}분` : ''}</b><br>${m === 0 ? `긴바늘은 <b>12</b>, 짧은바늘은 <b>${h}</b>${P(h, '을', '를')} 가리켜요.` : m === 30 && mode !== 'min1' && mode !== 'min5' ? `긴바늘은 <b>6</b>, 짧은바늘은 <b>${h}${P(h, '과', '와')} ${nh} 사이</b>를 가리켜요.` : `긴바늘이 ${m % 5 ? `${Math.floor(m / 5)}에서 작은 눈금 ${m % 5}칸 더` : `<b>${m / 5}</b>`} → ${m}분 · 짧은바늘은 ${h}${P(h, '과', '와')} ${nh} 사이${m >= 40 ? `<br><span style="color:${GRAY}">= ${nh}시 ${60 - m}분 전</span>` : ''}`}`; };
  $in(el, '#kb').addEventListener('click', () => { t = (t - step + 720) % 720; draw(); }); $in(el, '#kf').addEventListener('click', () => { t = (t + step) % 720; draw(); });
  if (step < 30) $in(el, '#kh').addEventListener('click', () => { t = (t + 60) % 720; draw(); }); draw();
} });
// 규칙 만들기
const PAL = ['🔴', '🔵', '🟡', '🟢', '⭐', '❤️', '🍎', '🍌'];
const patMakeLab = { title: '나만의 규칙 만들기', init(el){
  el.innerHTML = `<div class="out">반복할 부분을 만들어 보세요 (최대 4개)</div><div class="ctrl">${PAL.map((p, i) => `<button class="tbtn" type="button" data-p="${i}">${p}</button>`).join('')}<button class="tbtn" type="button" id="pc">↺ 지우기</button></div><div class="out" id="pu" style="font-size:30px;min-height:44px"></div><div id="ps" style="text-align:center;word-break:break-all;overflow-wrap:anywhere;font-size:28px;letter-spacing:2px;line-height:1.5"></div><div class="out" id="po"></div>`;
  let unit = ['🔴', '🔵', '🔵'];
  const draw = () => { $in(el, '#pu').innerHTML = unit.length ? `<span style="border:3px dashed #4CB963;border-radius:12px;padding:2px 10px">${unit.join('')}</span>` : '';
    $in(el, '#ps').innerHTML = unit.length ? range(0, 15).map(i => unit[i % unit.length]).join('') + '…' : '';
    $in(el, '#po').innerHTML = unit.length ? `규칙: <b>${unit.join('')}</b> 부분이 계속 되풀이돼요. 16째는 <b>${unit[15 % unit.length]}</b>!<br><span style="color:${GRAY}">${unit.length}개씩 반복 → ${unit.map((u, i) => `${u}=${i + 1}`).join(', ')}처럼 수로도 나타낼 수 있어요: ${range(0, 7).map(i => (unit.indexOf(unit[i % unit.length]) + 1)).join(' ')} …</span>` : ''; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { if (unit.length >= 4) unit = []; unit.push(PAL[+b.dataset.p]); draw(); }));
  $in(el, '#pc').addEventListener('click', () => { unit = []; draw(); }); draw();
} };

// 몇십몇 크기 비교 (10개씩 묶음 그림)
const cmpTensLab = (max = 50) => ({ title: '10개씩 묶음의 수와 낱개의 수로 크기 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가</label><input type="range" min="10" max="${max}" value="${Math.min(36, max)}" id="ta"><span class="v" id="tav"></span><label>나</label><input type="range" min="10" max="${max}" value="${Math.min(34, max)}" id="tb"><span class="v" id="tbv"></span></div><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center"><div><div class="out"><b>가</b></div><div id="tga"></div></div><div><div class="out"><b>나</b></div><div id="tgb"></div></div></div><div class="out" id="to"></div>`;
  const draw = () => { const a = +$in(el, '#ta').value, b = +$in(el, '#tb').value; $in(el, '#tav').textContent = a; $in(el, '#tbv').textContent = b;
    $in(el, '#tga').innerHTML = tens('🍎', a, 11); $in(el, '#tgb').innerHTML = tens('🍋', b, 11);
    const ta = Math.floor(a / 10), tb = Math.floor(b / 10), c = a > b ? '&gt;' : a < b ? '&lt;' : '=';
    $in(el, '#to').innerHTML = `<b style="font-size:24px">${a} ${c} ${b}</b><br>${ta !== tb ? `10개씩 묶음의 수가 ${ta}개와 ${tb}개로 달라요 → 묶음이 많은 쪽이 커요.` : a === b ? '두 수가 같아요.' : `10개씩 묶음의 수가 같아서 낱개의 수(${a % 10}, ${b % 10})를 비교해요.`}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });

window.TM_L12 = { cmpTensLab, countLab, orderLab, jumpLab, pairCmpLab, zeroLab, joinLab, picOpLab, lenLab, seeLab, areaLab, cupLab, bundleLab, boardLab, clockLab, patMakeLab, $in, press, big, ICONS };

/* ═════════════ 1-1 전용 실험실 ═════════════ */
const OBJ = { box: [['📦', '택배 상자'], ['🎁', '선물 상자'], ['🧊', '얼음'], ['📕', '책']], cyl: [['🥫', '통조림'], ['🧻', '휴지'], ['🔋', '건전지'], ['🥁', '북']], ball: [['⚽', '축구공'], ['🏀', '농구공'], ['🍊', '귤'], ['🔮', '구슬']] };
const SK = { box: '상자 모양', cyl: '둥근기둥 모양', ball: '공 모양' };
const shapeSortLab = { title: '물건을 눌러 같은 모양끼리 모으기', init(el){
  el.innerHTML = `<div id="ss" style="text-align:center;font-size:40px;letter-spacing:8px"></div><div class="ctrl"><button class="tbtn" type="button" id="sn">🎲 다른 물건</button></div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center" id="sb"></div><div class="out" id="so">물건을 눌러 보세요.</div>`;
  let items, got;
  const fresh = () => { items = shuffle(Object.keys(OBJ).flatMap(k => shuffle(OBJ[k]).slice(0, 2).map(o => [k, ...o]))); got = { box: [], cyl: [], ball: [] }; draw(); };
  const draw = () => { $in(el, '#ss').innerHTML = items.map((it, i) => `<span data-i="${i}" style="cursor:pointer" title="${it[2]}">${it[1]}</span>`).join('');
    $in(el, '#sb').innerHTML = Object.keys(SK).map(k => `<div style="border:3px solid #BFE6C2;border-radius:16px;padding:6px 12px;min-width:110px;text-align:center;background:#fff"><div style="font-family:Jua">${SK[k]}</div><div style="font-size:30px;min-height:40px">${got[k].join('')}</div></div>`).join('');
    el.querySelectorAll('[data-i]').forEach(s => s.addEventListener('click', () => { const it = items[+s.dataset.i]; items.splice(+s.dataset.i, 1); got[it[0]].push(it[1]);
      $in(el, '#so').innerHTML = `${it[1]} ${it[2]} → <b>${SK[it[0]]}</b>${items.length ? '' : ' · 🎉 모두 모았어요!'}`; draw(); })); };
  $in(el, '#sn').addEventListener('click', fresh); fresh();
} };
const shapeActLab = { title: '모양을 쌓고 굴려 보기', init(el){
  el.innerHTML = `<div class="ctrl">${Object.keys(SK).map((k, i) => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${!i}">${OBJ[k][0][0]} ${SK[k]}</button>`).join('')}</div><div class="ctrl"><button class="tbtn" type="button" id="ar">🎳 굴리기</button><button class="tbtn" type="button" id="as">🧱 쌓기</button></div><div class="figc" id="af" style="min-height:120px;align-items:flex-end"></div><div class="out" id="ao"></div>`;
  let k = 'box';
  const T = { box: ['굴러가지 않아요.', '평평한 부분이 있어서 잘 쌓을 수 있어요.', '평평한 부분, 뾰족한 부분'], cyl: ['눕히면 한 방향으로 잘 굴러가요.', '세우면 평평한 부분이 있어서 쌓을 수 있어요.', '평평한 부분, 둥근 부분'], ball: ['여러 방향으로 잘 굴러가요.', '둥근 부분만 있어서 쌓을 수 없어요.', '둥근 부분'] };
  const show = act => { const ic = OBJ[k][0][0];
    $in(el, '#af').innerHTML = act === 'roll' ? `<div style="font-size:48px;transition:transform 1s;transform:translateX(${k === 'box' ? 0 : 120}px) rotate(${k === 'box' ? 0 : 360}deg)" id="rl">${ic}</div>` : act === 'stack' ? `<div style="display:flex;flex-direction:column;align-items:center;font-size:44px;line-height:.95">${k === 'ball' ? `<span style="transform:translateX(30px) rotate(40deg);display:inline-block">${ic}</span><span>${ic}</span>` : ic + '<br>' + ic + '<br>' + ic}</div>` : `<div style="font-size:60px">${ic}</div>`;
    if (act === 'roll'){ const r = $in(el, '#rl'); r.style.transform = 'none'; requestAnimationFrame(() => requestAnimationFrame(() => { r.style.transform = `translateX(${k === 'box' ? 0 : 120}px) rotate(${k === 'box' ? 0 : 360}deg)`; })); }
    $in(el, '#ao').innerHTML = `<b>${SK[k]}</b> · 특징: ${T[k][2]}<br>${act === 'roll' ? T[k][0] : act === 'stack' ? T[k][1] : '굴리기와 쌓기를 눌러 보세요.'}`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { k = b.dataset.k; press(el, '[data-k]', b); show(); }));
  $in(el, '#ar').addEventListener('click', () => show('roll')); $in(el, '#as').addEventListener('click', () => show('stack')); show();
} };
const buildLab = { title: '모양으로 만든 작품의 개수 세기', init(el){
  el.innerHTML = `${Object.keys(SK).map(k => `<div class="ctrl"><label>${OBJ[k][0][0]} ${SK[k]}</label><input type="range" min="0" max="6" value="${{ box: 4, cyl: 2, ball: 1 }[k]}" data-k="${k}"><span class="v" data-v="${k}"></span></div>`).join('')}<div class="figc" id="bf" style="font-size:34px;line-height:1.05;text-align:center"></div><div class="out" id="bo"></div>`;
  const draw = () => { const c = {}; el.querySelectorAll('input[data-k]').forEach(i => { c[i.dataset.k] = +i.value; $in(el, `[data-v="${i.dataset.k}"]`).textContent = i.value; });
    $in(el, '#bf').innerHTML = `<div>${'🔮'.repeat(c.ball)}<br>${'🥫'.repeat(c.cyl)}<br>${'📦'.repeat(c.box)}</div>`;
    const tot = c.box + c.cyl + c.ball, mx = Math.max(c.box, c.cyl, c.ball);
    $in(el, '#bo').innerHTML = `모두 <b>${tot}개</b>${tot ? ` · 가장 많이 사용한 모양: <b>${Object.keys(SK).filter(k => c[k] === mx).map(k => SK[k]).join(', ')}</b>` : ''}<br><span style="color:${GRAY}">맨 아래에는 잘 쌓을 수 있는 상자 모양을, 맨 위에는 공 모양을 놓으면 좋아요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 1. 9까지의 수 ═════════════ */
add({ key:'1-1-1', title:'9까지의 수', intro:'1부터 9까지의 수를 세고 읽고 쓰며, 수의 순서와 크기를 알아봐요. 아무것도 없는 0도 알아봐요.',
  prev:'유치원·생활에서 물건 세기', lessons:[
  { title:'1, 2, 3, 4, 5를 알아볼까요', std:['2수01-01'], key:'물건을 하나씩 세면 마지막에 센 수가 <b>전체 개수</b>예요.',
    body:`${tableH([['수', '1', '2', '3', '4', '5'], ['읽기', '일 · 하나', '이 · 둘', '삼 · 셋', '사 · 넷', '오 · 다섯']])}`,
    lab: countLab(5, 3), ex:`<p>${big('🐥🐥🐥🐥', 26)} → <b>4</b> (사, 넷)</p>`, quiz:[['n9-count', 1], ['n9-read', 1]] },
  { title:'6, 7, 8, 9를 알아볼까요', std:['2수01-01'], key:'5보다 많은 수는 <b>5와 몇</b>으로 생각하면 쉬워요.',
    body:`${tableH([['수', '6', '7', '8', '9'], ['읽기', '육 · 여섯', '칠 · 일곱', '팔 · 여덟', '구 · 아홉']])}<div class="note">💡 10칸 틀의 윗줄(5칸)을 먼저 채우고 아랫줄을 채워 보세요.</div>`,
    lab: countLab(9, 7), ex:`<p>${big('⭐⭐⭐⭐⭐⭐⭐⭐', 24)} → <b>8</b> (팔, 여덟)</p>`, quiz:[['n9-count', 1], ['n9-read', 1]] },
  { title:'순서를 알아볼까요', std:['2수01-01'], key:'순서를 나타낼 때는 <b>첫째, 둘째, 셋째, …</b>라고 해요.',
    body:`<p>왼쪽에서 셋째와 오른쪽에서 셋째는 다를 수 있어요. 어느 쪽부터 세는지 꼭 확인해요!</p><div class="warn">⚠️ "셋째"는 하나, "세 개"는 셋 모두를 말해요.</div>`,
    lab: orderLab, ex:`<p>🐶🐱🐰🐻🐼 → 왼쪽에서 넷째는 <b>🐻</b>, 오른쪽에서 넷째는 <b>🐱</b></p>`, quiz:[['n9-ord', 1], ['n9-ordcnt', 2], ['n9-line', 4]] },
  { title:'수의 순서를 알아볼까요', std:['2수01-03'], key:'1부터 9까지 수를 순서대로 쓰면 <b>1씩 커져요</b>. 거꾸로 쓰면 1씩 작아져요.',
    body:`${E('1 — 2 — 3 — 4 — 5 — 6 — 7 — 8 — 9')}`,
    lab: jumpLab(9), ex:`<p>5 — 6 — □ — 8 → <b>7</b> · 9 — 8 — □ — 6 → <b>7</b></p>`, quiz:[['n9-seq', 1], ['n9-seq', 2]] },
  { title:'1만큼 더 큰 수와 1만큼 더 작은 수', std:['2수01-03'], key:'1만큼 더 큰 수는 <b>바로 뒤의 수</b>, 1만큼 더 작은 수는 <b>바로 앞의 수</b>예요.',
    body:`${E('5보다 1만큼 더 큰 수: 6 · 5보다 1만큼 더 작은 수: 4')}`,
    lab: jumpLab(9), ex:`<p>8보다 1만큼 더 큰 수는 <b>9</b></p>`, quiz:[['n9-pm1', 1], ['n9-pm1', 2]] },
  { title:'0을 알아볼까요', std:['2수01-01'], key:'아무것도 없는 것을 <b>0</b>이라 쓰고 <b>영</b>이라고 읽어요.',
    body:`<p>1보다 1만큼 더 작은 수가 0이에요. 0 — 1 — 2 — 3 …</p>`,
    lab: zeroLab, ex:`<p>어항에 물고기가 한 마리도 없으면 <b>0마리</b></p>`, quiz:[['n9-zero', 2], ['n9-pm1', 2]] },
  { title:'수의 크기를 비교해 볼까요', std:['2수01-03'], key:'하나씩 짝을 지었을 때 남는 쪽이 <b>더 큰 수</b>예요. 수의 순서에서 뒤에 있을수록 커요.',
    body:`${E('7은 4보다 큽니다. · 4는 7보다 작습니다.')}`,
    lab: pairCmpLab(9), ex:`<p>3, 8, 5 중에서 가장 큰 수 → <b>8</b></p>`, quiz:[['n9-cmp', 1], ['n9-cmp', 2], ['n9-between', 3], ['n9-cond', 3]] }
]});

/* ═════════════ 2. 여러 가지 모양 ═════════════ */
add({ key:'1-1-2', title:'여러 가지 모양', intro:'생활 속 물건에서 상자 모양, 둥근기둥 모양, 공 모양을 찾고, 쌓고 굴려 보며 특징을 알아봐요.',
  prev:'생활 속 물건 살펴보기', lessons:[
  { title:'여러 가지 모양을 찾아볼까요', std:['2수03-01'], key:'물건을 <b>상자 모양, 둥근기둥 모양, 공 모양</b>으로 나눌 수 있어요.',
    body:`<p style="font-size:30px;text-align:center">📦🎁 · 🥫🧻 · ⚽🍊</p><p style="text-align:center">상자 모양 · 둥근기둥 모양 · 공 모양</p>`,
    lab: shapeSortLab, ex:`<p>🔋 건전지 → <b>둥근기둥 모양</b></p>`, quiz:[['sh-kind', 1], ['sh-odd', 1]] },
  { title:'여러 가지 모양을 알아볼까요', std:['2수03-01'], key:'상자 모양은 <b>평평하고 뾰족한</b> 부분, 둥근기둥 모양은 <b>평평한 부분과 둥근 부분</b>, 공 모양은 <b>둥근 부분만</b> 있어요.',
    body:`${tableH([['', '상자 모양', '둥근기둥 모양', '공 모양'], ['쌓기', '잘 쌓아요', '세우면 쌓아요', '쌓기 어려워요'], ['굴리기', '굴러가지 않아요', '눕히면 굴러가요', '잘 굴러가요']])}`,
    lab: shapeActLab, ex:`<p>어느 쪽으로도 잘 굴러가는 모양 → <b>공 모양</b></p>`, quiz:[['sh-prop', 2], ['sh-feel', 3]] },
  { title:'여러 가지 모양으로 만들어 볼까요', std:['2수03-01'], key:'모양의 특징을 생각하며 <b>쌓고 붙여</b> 여러 가지 작품을 만들어요.',
    body:`<p>잘 쌓이는 상자 모양은 아래에, 굴러가는 공 모양은 위나 장식으로 사용하면 좋아요.</p>`,
    lab: buildLab, ex:`<p>📦 3개, 🥫 2개, ⚽ 1개로 만든 로봇 → 모두 <b>6개</b></p>`, quiz:[['sh-total', 2], ['sh-most', 2]] },
  { title:'모양 찾기 놀이를 해 볼까요', std:['2수03-01'], key:'일부분만 보이거나 만져 보아도 <b>특징</b>으로 모양을 알 수 있어요.',
    body:`<p>뾰족한 부분이 만져지면 상자 모양, 동그랗고 평평한 부분이 보이면 둥근기둥 모양이에요.</p>`,
    lab: shapeSortLab, ex:`<p>사용한 모양을 세어 서로 비교해 봐요.</p>`, quiz:[['sh-count', 2], ['sh-cmp', 4]] }
]});

/* ═════════════ 3. 덧셈과 뺄셈 ═════════════ */
add({ key:'1-1-3', title:'덧셈과 뺄셈', intro:'모으기와 가르기를 하고, 이야기를 덧셈식과 뺄셈식으로 나타내며 9까지의 수의 덧셈과 뺄셈을 해요.',
  prev:'[1-1] 9까지의 수', lessons:[
  { title:'모으기와 가르기', std:['2수01-04'], key:'두 수를 <b>모으면</b> 하나의 수가 되고, 하나의 수는 두 수로 <b>가를</b> 수 있어요.',
    body:`${E('3과 4를 모으면 7 · 7은 2와 5로 가를 수 있어요')}`,
    lab: joinLab(9), ex:`<p>6은 1과 5, 2와 4, 3과 3, … 여러 가지로 가를 수 있어요.</p>`, quiz:[['ad-join', 1], ['ad-split', 1], ['ad-ways', 4]] },
  { title:'이야기를 만들어 볼까요', std:['2수01-05'], key:'그림을 보고 <b>모두 몇</b>, <b>남은 것</b>을 이야기로 만들어요.',
    body:`<p>🐦🐦🐦 + 🐦🐦 → "참새 3마리가 있었는데 2마리가 더 날아왔어요. 모두 5마리예요."</p>`,
    lab: picOpLab(false), ex:`<p>사과 6개 중 2개를 먹었어요 → 남은 사과는 4개</p>`, quiz:[['ad-pic', 1], ['ad-word', 2]] },
  { title:'덧셈을 알아볼까요', std:['2수01-05'], key:'3 + 2 = 5는 "<b>3 더하기 2는 5와 같습니다</b>"라고 읽어요.',
    body:`<p>"3과 2의 <b>합</b>은 5입니다."라고도 말해요.</p>`,
    lab: picOpLab(false), ex:`<p>4 + 3 = <b>7</b></p>`, quiz:[['ad-add', 1], ['ad-pic', 1]] },
  { title:'뺄셈을 알아볼까요', std:['2수01-05'], key:'5 - 2 = 3은 "<b>5 빼기 2는 3과 같습니다</b>"라고 읽어요.',
    body:`<p>"5와 2의 <b>차</b>는 3입니다." 덜어 낼 때, 두 수를 비교할 때 뺄셈을 해요.</p>`,
    lab: picOpLab(true), ex:`<p>8 - 3 = <b>5</b></p>`, quiz:[['ad-sub', 1], ['ad-word', 2]] },
  { title:'0이 있는 덧셈과 뺄셈', std:['2수01-05'], key:'어떤 수에 0을 더하거나 0을 빼면 <b>그대로</b>, 같은 수끼리 빼면 <b>0</b>이에요.',
    body:`${E('4 + 0 = 4 · 0 + 6 = 6 · 5 - 0 = 5 · 3 - 3 = 0')}`,
    lab: zeroLab, ex:`<p>7 - 7 = <b>0</b></p>`, quiz:[['ad-zero', 2]] },
  { title:'덧셈과 뺄셈을 해 볼까요', std:['2수01-05', '2수01-07'], key:'상황에 따라 <b>+</b>와 <b>-</b>를 알맞게 골라 식을 만들어요.',
    body:`<p>□가 있는 식은 모으기·가르기로 생각해요: □ + 3 = 7 → 7은 4와 3 → □ = 4</p>`,
    lab: joinLab(9), ex:`<p>수 카드 2, 5, 8 중 두 장으로 가장 큰 차 → 8 - 2 = <b>6</b></p>`, quiz:[['ad-box', 3], ['ad-sign', 3], ['ad-cards', 5]] }
]});

/* ═════════════ 4. 비교하기 ═════════════ */
add({ key:'1-1-4', title:'비교하기', intro:'두 가지 물건의 길이, 무게, 넓이, 담을 수 있는 양을 비교하여 알맞은 말로 나타내요.',
  prev:'생활 속에서 크기 비교하기', lessons:[
  { title:'어느 것이 더 길까요', std:['2수03-06'], key:'한쪽 끝을 맞추어 다른 쪽 끝을 비교해요. <b>더 길다 / 더 짧다</b>, 키는 <b>더 크다 / 더 작다</b>, 높이는 <b>더 높다 / 더 낮다</b>',
    body:`<p>세 가지 이상을 비교할 때는 "가장 길다", "가장 짧다"라고 해요.</p>`,
    lab: lenLab, ex:`<p>뼘으로 재어 비교할 수도 있어요: 책상 6뼘, 의자 4뼘 → 책상이 <b>2뼘</b> 더 길어요.</p>`, quiz:[['cp-len', 1], ['cp-len', 2], ['cp-span', 3], ['cp-height', 4]] },
  { title:'어느 것이 더 무거울까요', std:['2수03-06'], key:'손으로 들어 보거나 시소, 저울로 비교해요. <b>더 무겁다 / 더 가볍다</b>',
    body:`<p>시소는 무거운 쪽이 <b>아래로</b> 내려가요.</p>`,
    lab: seeLab, ex:`<p>코끼리는 강아지보다 더 <b>무거워요</b>.</p>`, quiz:[['cp-heavy', 1], ['cp-word', 1], ['cp-heavy3', 3]] },
  { title:'어느 것이 더 넓을까요', std:['2수03-06'], key:'겹쳐 보았을 때 남는 부분이 있는 쪽이 <b>더 넓어요</b>. <b>더 넓다 / 더 좁다</b>',
    body:`<p>겹치기 어려우면 같은 크기의 칸이 몇 개인지 세어 비교해요.</p>`,
    lab: areaLab, ex:`<p>운동장은 교실보다 더 <b>넓어요</b>.</p>`, quiz:[['cp-area', 2], ['cp-word', 2]] },
  { title:'어느 것에 더 많이 담을 수 있을까요', std:['2수03-06'], key:'그릇의 크기가 클수록 더 많이 담을 수 있어요. <b>더 많다 / 더 적다</b>',
    body:`<ul><li>한 그릇에 물을 가득 채워 다른 그릇에 옮겨 담아 보아요.</li><li>모양과 크기가 같은 그릇이면 물의 높이로 비교해요.</li><li>같은 컵으로 몇 번 부었는지 세어 비교해요.</li></ul>`,
    lab: cupLab, ex:`<p>가 그릇은 5컵, 나 그릇은 7컵 → <b>나</b> 그릇에 더 많이 담을 수 있어요.</p>`, quiz:[['cp-cap', 2], ['cp-cap', 3]] }
]});

/* ═════════════ 5. 50까지의 수 ═════════════ */
add({ key:'1-1-5', title:'50까지의 수', intro:'10을 알고, 10개씩 묶어 세어 50까지의 수를 세고 읽고 쓰며, 수의 순서와 크기를 비교해요.',
  prev:'[1-1] 9까지의 수 · 덧셈과 뺄셈', lessons:[
  { title:'9 다음 수를 알아볼까요', std:['2수01-01'], key:'9보다 1만큼 더 큰 수는 <b>10</b>이에요. 십 또는 열이라고 읽어요.',
    body:`<div class="figc">${tenFrame(10)}</div><p>10은 1과 9, 2와 8, 3과 7, 4와 6, 5와 5로 가를 수 있어요.</p>`,
    lab: joinLab(10), ex:`<p>7과 □를 모으면 10 → □ = <b>3</b></p>`, quiz:[['n50-ten', 1]] },
  { title:'십몇을 알아볼까요', std:['2수01-01'], key:'10개씩 묶음 1개와 낱개 3개는 <b>13</b> (십삼, 열셋)',
    body:`${tableH([['수', '11', '12', '13', '14', '15'], ['읽기', '십일 · 열하나', '십이 · 열둘', '십삼 · 열셋', '십사 · 열넷', '십오 · 열다섯']])}`,
    lab: bundleLab(19, 14), ex:`<p>10개씩 묶음 1개와 낱개 8개 → <b>18</b></p>`, quiz:[['n50-teen', 1]] },
  { title:'모으기와 가르기를 해 볼까요', std:['2수01-04'], key:'십몇도 두 수로 <b>모으고 가를</b> 수 있어요.',
    body:`${E('8과 5를 모으면 13 · 14는 6과 8로 가를 수 있어요')}`,
    lab: joinLab(18), ex:`<p>15는 9와 <b>6</b>으로 가를 수 있어요.</p>`, quiz:[['n50-split', 2]] },
  { title:'10개씩 묶어 세어 볼까요', std:['2수01-01'], key:'10개씩 묶음 2개 = <b>20</b>(이십, 스물), 3개 = <b>30</b>(삼십, 서른), 4개 = <b>40</b>(사십, 마흔), 5개 = <b>50</b>(오십, 쉰)',
    body:`<p>많은 수는 10개씩 묶어 세면 빠르고 정확해요.</p>`,
    lab: bundleLab(50, 30), ex:`<p>10개씩 묶음 4개 → <b>40</b></p>`, quiz:[['n50-bundle', 1], ['n50-bundle', 2]] },
  { title:'50까지의 수를 세어 볼까요', std:['2수01-01'], key:'10개씩 묶음 3개와 낱개 6개 → <b>36</b> (삼십육, 서른여섯)',
    body:`<div class="note">💡 낱개가 10개 이상이면 다시 10개씩 묶어요.</div>`,
    lab: bundleLab(50, 36), ex:`<p>10개씩 묶음 2개와 낱개 14개 → 10개씩 묶음 3개와 낱개 4개 → <b>34</b></p>`, quiz:[['n50-count', 2], ['n50-read', 2], ['n50-regroup', 3]] },
  { title:'50까지 수의 순서를 알아볼까요', std:['2수01-03'], key:'수 배열판에서 오른쪽으로 1씩, 아래로 <b>10씩</b> 커져요.',
    body:`<p>27과 30 사이의 수: 28, 29</p>`,
    lab: boardLab(50), ex:`<p>39보다 1만큼 더 큰 수 → <b>40</b></p>`, quiz:[['n50-seq', 2], ['n50-seq', 3]] },
  { title:'수의 크기를 비교해 볼까요', std:['2수01-03'], key:'<b>10개씩 묶음의 수</b>를 먼저 비교하고, 같으면 <b>낱개의 수</b>를 비교해요.',
    body:`${E('32 &lt; 41 (묶음 3 &lt; 4) · 36 &gt; 34 (묶음이 같아서 낱개 6 &gt; 4)')}`,
    lab: cmpTensLab(50), ex:`<p>수 카드 2, 4, 3 중 두 장으로 만든 가장 큰 몇십몇 → <b>43</b></p>`, quiz:[['n50-cmp', 2], ['n50-cmp', 3], ['n50-cards', 5]] }
]});
})();
