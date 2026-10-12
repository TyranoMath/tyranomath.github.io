/* =========================================================
   🦖 개념 탐험대 — 1학년 2학기 (2022 개정 교육과정)
   단원: 1 100까지의 수 · 2 덧셈과 뺄셈(1) · 3 모양과 시각 · 4 덧셈과 뺄셈(2) · 5 규칙 찾기 · 6 덧셈과 뺄셈(3)
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, H = window.TM_G12, K = window.TM_L12, T3 = window.TM_L3;
const { svg, txt, line, range, tableH, ri, pick, shuffle } = A;
const { P, sino, native, emo, tens, tenFrame, clock, shp, SHN, COLS } = H;
const { $in, press, big } = K;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const wa = a => a + P(a, '과', '와');

/* ═════════════ 실험실 ═════════════ */
const evenLab = { title: '둘씩 짝을 지어 짝수와 홀수 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="em">➖</button><span class="v" id="ev" style="font-size:36px;min-width:1.6em"></span><button class="tbtn" type="button" id="ep">➕</button></div><div class="figc" id="ef"></div><div class="out" id="eo"></div>`;
  let n = 7;
  const draw = () => { $in(el, '#ev').textContent = n; const pairs = Math.floor(n / 2), u = 30; let g = '';
    for (let i = 0; i < pairs; i++) g += `<rect x="${6 + i * u}" y="6" width="${u - 4}" height="56" rx="12" fill="#E8F7EA" stroke="${GR}" stroke-width="2"/><text x="${6 + i * u + 13}" y="30" font-size="18" text-anchor="middle">🧦</text><text x="${6 + i * u + 13}" y="54" font-size="18" text-anchor="middle">🧦</text>`;
    if (n % 2) g += `<rect x="${6 + pairs * u}" y="6" width="${u - 4}" height="56" rx="12" fill="#FFF1DE" stroke="${OR}" stroke-width="2" stroke-dasharray="4 3"/><text x="${6 + pairs * u + 13}" y="30" font-size="18" text-anchor="middle">🧦</text>`;
    $in(el, '#ef').innerHTML = svg(Math.max(1, pairs + 1) * u + 12, 68, g);
    $in(el, '#eo').innerHTML = n % 2 ? `양말 ${n}짝 → 둘씩 짝을 지으면 <b>하나가 남아요</b> → <b>${n}${P(n, '은', '는')} 홀수</b>` : `양말 ${n}짝 → 둘씩 짝을 지으면 <b>남는 것이 없어요</b> → <b>${n}${P(n, '은', '는')} 짝수</b>`; };
  $in(el, '#em').addEventListener('click', () => { if (n > 1) n--; draw(); }); $in(el, '#ep').addEventListener('click', () => { if (n < 20) n++; draw(); }); draw();
} };
const threeLab = minus => ({ title: minus ? '세 수의 뺄셈을 차례로 해 보기' : '세 수의 덧셈을 차례로 해 보기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="tn">🎲 새 문제</button><button class="tbtn" type="button" id="ts">▶ 다음 단계</button></div><div class="out" id="tx" style="font-size:26px;font-family:Fredoka"></div><div id="tg" style="text-align:center;font-size:28px;letter-spacing:2px;min-height:44px"></div><div class="out" id="to"></div>`;
  let a, b, c, k;
  const fresh = () => { if (minus){ a = ri(6, 9); b = ri(1, a - 2); c = ri(1, a - b - 1); } else { a = ri(1, 6); b = ri(1, 6); c = ri(1, 6); } k = 0; draw(); };
  const draw = () => { const op = minus ? '-' : '+', r1 = minus ? a - b : a + b, r2 = minus ? r1 - c : r1 + c;
    $in(el, '#tx').innerHTML = `${a} ${op} ${b} ${op} ${c} = ${k >= 2 ? `<b style="color:#2F8A47">${r2}</b>` : '?'}`;
    $in(el, '#tg').innerHTML = minus ? '🍪'.repeat(k >= 2 ? r2 : k >= 1 ? r1 : a) + `<span style="opacity:.3">${'🍪'.repeat(k >= 2 ? b + c : k >= 1 ? b : 0)}</span>` : '🔴'.repeat(a) + (k >= 1 ? '🔵'.repeat(b) : '') + (k >= 2 ? '🟡'.repeat(c) : '');
    $in(el, '#to').innerHTML = ['앞의 두 수부터 차례로 계산해요. ▶를 눌러 보세요.', `① ${a} ${op} ${b} = <b>${r1}</b>`, `② ${r1} ${op} ${c} = <b>${r2}</b> 🎉`][k]; $in(el, '#ts').disabled = k >= 2; };
  $in(el, '#tn').addEventListener('click', fresh); $in(el, '#ts').addEventListener('click', () => { k++; draw(); }); fresh();
} });
const tenPairLab = sub => ({ title: sub ? '10에서 빼기' : '더해서 10이 되는 두 수 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>${sub ? '빼는 수' : '처음 수'}</label><input type="range" min="0" max="10" value="${sub ? 4 : 6}" id="pn"><span class="v" id="pnv"></span></div><div class="figc" id="pf"></div><div class="out" id="po" style="font-size:22px"></div>`;
  const draw = () => { const n = +$in(el, '#pn').value; $in(el, '#pnv').textContent = n; const u = 34; let g = '';
    for (let i = 0; i < 10; i++){ const x = 4 + (i % 5) * u, y = 4 + Math.floor(i / 5) * u; g += `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
      if (sub){ g += `<circle cx="${x + u / 2}" cy="${y + u / 2}" r="12" fill="${i >= 10 - n ? '#FFD7DE' : OR}"/>` + (i >= 10 - n ? line(x + 6, y + 6, x + u - 6, y + u - 6, { stroke: RED, w: 2.4 }) : ''); }
      else g += `<circle cx="${x + u / 2}" cy="${y + u / 2}" r="12" fill="${i < n ? OR : '#9CC7EE'}"/>`; }
    $in(el, '#pf').innerHTML = svg(5 * u + 8, 2 * u + 8, g);
    $in(el, '#po').innerHTML = sub ? `<b>10 - ${n} = ${10 - n}</b>` : `<span style="color:${OR}">●</span> ${n} + <span style="color:${BL}">●</span> ${10 - n} = <b>10</b>`; };
  $in(el, '#pn').addEventListener('input', draw); draw();
} });
const makeTenLab = { title: '10이 되는 두 수를 먼저 더하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="mn">🎲 새 문제</button></div><div class="out" id="mx" style="font-size:28px;font-family:Fredoka"></div><div class="out" id="mo">더해서 10이 되는 두 수를 눌러 보세요.</div>`;
  let nums, picked;
  const fresh = () => { const a = ri(1, 9), c = ri(1, 9); nums = shuffle([a, 10 - a, c]); picked = []; draw(); };
  const draw = () => { $in(el, '#mx').innerHTML = nums.map((x, i) => `<button class="tbtn" type="button" data-i="${i}" style="font-size:26px;min-width:56px;${picked.includes(i) ? 'background:#FFE38A' : ''}">${x}</button>`).join(' + ') + ' = ?';
    el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; if (picked.includes(i)) picked = picked.filter(x => x !== i); else if (picked.length < 2) picked.push(i); draw(); }));
    if (picked.length === 2){ const s = nums[picked[0]] + nums[picked[1]], other = nums[3 - picked[0] - picked[1]];
      $in(el, '#mo').innerHTML = s === 10 ? `🎉 ${nums[picked[0]]} + ${nums[picked[1]]} = 10 → 10 + ${other} = <b>${10 + other}</b>` : `${nums[picked[0]]} + ${nums[picked[1]]} = ${s} — 10이 아니에요. 다른 두 수를 찾아보세요.`; } };
  $in(el, '#mn').addEventListener('click', fresh); fresh();
} };
const shapeFindLab = { title: '같은 모양을 모두 찾아 눌러 보기', init(el){
  el.innerHTML = `<div class="ctrl">${['r', 't', 'c'].map((k, i) => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${!i}">${SHN[k]} 찾기</button>`).join('')}<button class="tbtn" type="button" id="fn">🎲 새 그림</button></div><div class="figc" id="ff"></div><div class="out" id="fo"></div>`;
  let target = 'r', list, found;
  const fresh = () => { list = shuffle(range(0, 11).map(i => [pick(['r', 't', 'c']), ri(28, 42), pick(COLS), ri(-30, 30)])); found = new Set(); draw(); };
  const draw = () => { let g = ''; list.forEach(([k, s, c, r], i) => { const x = 36 + (i % 6) * 58, y = 36 + Math.floor(i / 6) * 62; g += `<g data-i="${i}" style="cursor:pointer">${shp(k, x, y, s, found.has(i) ? '#FFE38A' : c, r)}${found.has(i) ? txt(x, y, '✔', { size: 16, bold: true, fill: '#2F8A47' }) : ''}</g>`; });
    $in(el, '#ff').innerHTML = svg(6 * 58 + 14, 2 * 62 + 14, g);
    el.querySelectorAll('g[data-i]').forEach(gi => gi.addEventListener('click', () => { const i = +gi.dataset.i; if (list[i][0] === target) found.add(i); else { $in(el, '#fo').innerHTML = `그건 ${SHN[list[i][0]]}이에요! 🤔`; return; } draw(); }));
    const total = list.filter(x => x[0] === target).length;
    $in(el, '#fo').innerHTML = `${SHN[target]} ${found.size} / ${total}개 찾았어요${found.size === total ? ' 🎉' : ''}<br><span style="color:${GRAY}">${{ r: '□ 모양: 뾰족한 곳이 4군데', t: '△ 모양: 뾰족한 곳이 3군데', c: '○ 모양: 뾰족한 곳이 없고 둥글어요' }[target]}</span>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { target = b.dataset.k; press(el, '[data-k]', b); found = new Set(); draw(); }));
  $in(el, '#fn').addEventListener('click', fresh); fresh();
} };
const shapeArtLab = { title: '□, △, ○ 모양으로 그림 꾸미기', init(el){
  el.innerHTML = `<div class="ctrl">${['r', 't', 'c'].map(k => `<button class="tbtn" type="button" data-k="${k}">+ ${SHN[k]}</button>`).join('')}<button class="tbtn" type="button" id="ac">↺ 지우기</button><button class="tbtn" type="button" id="ah">🏠 집 예시</button></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  let items = [];
  const house = () => [['r', 150, 130, 110, '#FFE38A', 0], ['t', 150, 58, 120, '#FFB3B3', 0], ['r', 150, 150, 30, '#9CC7EE', 0], ['c', 260, 50, 40, '#FFC48A', 0], ['r', 112, 118, 26, '#9CC7EE', 0], ['r', 188, 118, 26, '#9CC7EE', 0]];
  const draw = () => { $in(el, '#af').innerHTML = svg(320, 200, `<rect x="0" y="0" width="320" height="200" fill="#F3FBFF"/>` + items.map(([k, x, y, s, c, r]) => shp(k, x, y, s, c, r)).join(''));
    const cnt = { r: 0, t: 0, c: 0 }; items.forEach(i => cnt[i[0]]++);
    $in(el, '#ao').innerHTML = `□ 모양 <b>${cnt.r}</b>개 · △ 모양 <b>${cnt.t}</b>개 · ○ 모양 <b>${cnt.c}</b>개 · 뾰족한 곳은 모두 <b>${cnt.r * 4 + cnt.t * 3}군데</b>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { if (items.length < 14) items.push([b.dataset.k, ri(30, 290), ri(30, 170), ri(28, 60), pick(COLS), ri(-30, 30)]); draw(); }));
  $in(el, '#ac').addEventListener('click', () => { items = []; draw(); }); $in(el, '#ah').addEventListener('click', () => { items = house(); draw(); }); items = house(); draw();
} };
const tenFrames2 = (a, b, moved) => { const u = 26; let g = ''; const fill = [Math.min(10, a + (moved ? Math.min(10 - a, b) : 0)), moved ? b - Math.min(10 - a, b) : b];
  [0, 1].forEach(f => { for (let i = 0; i < 10; i++){ const x = 4 + f * (5 * u + 16) + (i % 5) * u, y = 4 + Math.floor(i / 5) * u; g += `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`; if (i < fill[f]) g += `<circle cx="${x + u / 2}" cy="${y + u / 2}" r="9" fill="${f === 0 && i < a ? OR : BL}"/>`; } });
  return svg(10 * u + 24, 2 * u + 8, g); };
const addTenLab = { title: '10을 만들어 (몇) + (몇) 계산하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>첫째 수</label><input type="range" min="2" max="9" value="8" id="aa"><span class="v" id="aav"></span><label>둘째 수</label><input type="range" min="2" max="9" value="5" id="ab"><span class="v" id="abv"></span></div><div class="ctrl"><button class="tbtn" type="button" id="am">➡ 10 채우기</button><button class="tbtn" type="button" id="ar">↺</button></div><div class="figc" id="af"></div><div class="out" id="ao" style="font-size:20px"></div>`;
  let moved = false;
  const draw = () => { const a = +$in(el, '#aa').value, b = +$in(el, '#ab').value; $in(el, '#aav').textContent = a; $in(el, '#abv').textContent = b;
    $in(el, '#af').innerHTML = tenFrames2(a, b, moved); const need = 10 - a;
    $in(el, '#ao').innerHTML = a + b < 10 ? `${a} + ${b} = ${a + b} (10이 되지 않아요)` : moved ? `${b}${P(b, '을', '를')} ${wa(need)} ${b - need}(으)로 갈라 ${a}에 ${need}${P(need, '을', '를')} 먼저 더해요 → 10 + ${b - need} = <b>${a + b}</b>`.replace('(으)로', [0, 3, 6].includes(b - need) ? '으로' : '로') : `${a} + ${b} = ? · "10 채우기"를 눌러 보세요.`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { moved = false; draw(); }));
  $in(el, '#am').addEventListener('click', () => { moved = true; draw(); }); $in(el, '#ar').addEventListener('click', () => { moved = false; draw(); }); draw();
} };
const subTenLab = { title: '10을 이용하여 (십몇) - (몇) 계산하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>십몇</label><input type="range" min="11" max="18" value="13" id="sa"><span class="v" id="sav"></span><label>빼는 수</label><input type="range" min="2" max="9" value="5" id="sb"><span class="v" id="sbv"></span></div><div class="figc" id="sf"></div><div class="out" id="so" style="font-size:20px"></div>`;
  const draw = () => { const a = +$in(el, '#sa').value, bI = $in(el, '#sb'); bI.min = Math.max(2, a - 9); if (+bI.value < +bI.min) bI.value = bI.min; const b = +bI.value, o = a - 10; $in(el, '#sav').textContent = a; $in(el, '#sbv').textContent = b;
    const u = 26; let g = ''; const remove = new Set(); for (let i = 0; i < b; i++) remove.add(i < o ? 10 + (o - 1 - i) : 9 - (i - o));
    for (let f = 0; f < 2; f++) for (let i = 0; i < 10; i++){ const k = f * 10 + i, x = 4 + f * (5 * u + 16) + (i % 5) * u, y = 4 + Math.floor(i / 5) * u; g += `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`; if (k < a) g += `<circle cx="${x + u / 2}" cy="${y + u / 2}" r="9" fill="${remove.has(k) ? '#FFD7DE' : OR}"/>` + (remove.has(k) ? line(x + 5, y + 5, x + u - 5, y + u - 5, { stroke: RED, w: 2.2 }) : ''); }
    $in(el, '#sf').innerHTML = svg(10 * u + 24, 2 * u + 8, g);
    $in(el, '#so').innerHTML = b > o ? `${b}${P(b, '을', '를')} ${wa(o)} ${b - o}(으)로 갈라요: ${a} - ${o} = 10, 10 - ${b - o} = <b>${a - b}</b>`.replace('(으)로', [0, 3, 6].includes(b - o) ? '으로' : '로') : `${a} - ${b} = <b>${a - b}</b> (낱개에서 바로 뺄 수 있어요)`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const sumTableLab = minus => ({ title: minus ? '뺄셈표에서 규칙 찾기' : '덧셈표에서 규칙 찾기', init(el){
  const R = range(5, 9), C = minus ? range(2, 6) : range(5, 9), base = minus ? 15 : 0;
  el.innerHTML = `<div id="st"></div><div class="out" id="so">칸을 눌러 보세요.</div>`;
  let sel = null;
  const val = (r, c) => minus ? base - r + (c - c) - (c - 2) * 0 - c + 2 * 0 + (r - r) : r + c;
  const v2 = (r, c) => minus ? (10 + r) - c : r + c;
  const draw = () => { const s = sel ? v2(...sel) : null; let h = `<table class="qt"><tr><th>${minus ? '-' : '+'}</th>${C.map(c => `<th>${c}</th>`).join('')}</tr>`;
    R.forEach(r => { h += `<tr><th>${minus ? 10 + r : r}</th>${C.map(c => `<td data-r="${r}" data-c="${c}" style="cursor:pointer;${s !== null && v2(r, c) === s ? 'background:#FFE38A;font-weight:700' : ''}">${v2(r, c)}</td>`).join('')}</tr>`; });
    $in(el, '#st').innerHTML = h + '</table>'; void val;
    el.querySelectorAll('td[data-r]').forEach(td => td.addEventListener('click', () => { sel = [+td.dataset.r, +td.dataset.c]; draw();
      const same = []; R.forEach(r => C.forEach(c => { if (v2(r, c) === v2(...sel)) same.push(`${minus ? 10 + r : r} ${minus ? '-' : '+'} ${c}`); }));
      $in(el, '#so').innerHTML = `${minus ? '차' : '합'}가 <b>${v2(...sel)}</b>인 식: ${same.join(', ')}<br><span style="color:${GRAY}">${minus ? '빼지는 수와 빼는 수가 똑같이 1씩 커지면 차는 같아요(↘).' : '한 수가 1 커지고 다른 수가 1 작아지면 합은 같아요(↙).'}</span>`; })); };
  draw();
} });
const seqLab = { title: '수 배열의 규칙 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시작하는 수</label><input type="range" min="1" max="50" value="3" id="qs"><span class="v" id="qsv"></span><label>몇씩</label><input type="range" min="1" max="10" value="5" id="qd"><span class="v" id="qdv"></span><button class="tbtn" type="button" id="qr" aria-pressed="false">작아지게</button></div><div class="out" id="qq" style="font-family:Fredoka;font-size:24px"></div><div class="out" id="qo"></div>`;
  let down = false;
  const draw = () => { const s = +$in(el, '#qs').value, d = +$in(el, '#qd').value; $in(el, '#qsv').textContent = s; $in(el, '#qdv').textContent = d;
    const st = down ? Math.max(s, d * 7) : s, seq = range(0, 7).map(i => st + (down ? -d : d) * i).filter(x => x >= 0 && x <= 100);
    $in(el, '#qq').innerHTML = seq.join(', ') + ' …'; $in(el, '#qo').innerHTML = `규칙: <b>${st}</b>부터 시작하여 <b>${d}씩 ${down ? '작아져요' : '커져요'}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); $in(el, '#qr').addEventListener('click', e => { down = !down; e.target.setAttribute('aria-pressed', down); draw(); }); draw();
} };
const codeLab = { title: '규칙을 수, 소리, 몸짓으로 나타내기', init(el){
  const P1 = [['🐶', '🐱', '🐱'], ['🔺', '🟦'], ['🍎', '🍌', '🍇'], ['⭐', '⭐', '🌙']];
  el.innerHTML = `<div class="ctrl">${P1.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${!i}">${p.join('')}</button>`).join('')}</div><div class="out" id="cs" style="font-size:30px"></div><div class="ctrl"><button class="tbtn" type="button" data-m="num" aria-pressed="true">수로</button><button class="tbtn" type="button" data-m="body">몸짓으로</button><button class="tbtn" type="button" data-m="sound">소리로</button></div><div class="out" id="cc" style="font-size:24px"></div>`;
  let p = 0, m = 'num';
  const draw = () => { const u = P1[p], seq = range(0, 8).map(i => u[i % u.length]), kinds = [...new Set(u)];
    $in(el, '#cs').innerHTML = seq.join('');
    const map = { num: kinds.map((_, i) => String(i + 1)), body: ['👏', '🦶', '🙌'], sound: ['짝', '쿵', '딩'] }[m];
    $in(el, '#cc').innerHTML = seq.map(x => map[kinds.indexOf(x)]).join(' ') + `<br><span style="font-size:15px;color:${GRAY}">${kinds.map((k, i) => `${k} → ${map[i]}`).join(', ')}</span>`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { p = +b.dataset.p; press(el, '[data-p]', b); draw(); }));
  el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { m = b.dataset.m; press(el, '[data-m]', b); draw(); })); draw();
} };
const noC = () => { let a, b; do { a = ri(11, 88); b = ri(11, 88); } while (a % 10 + b % 10 > 9 || a + b > 99); return [a, b]; };
const noB = () => { let a, b; do { a = ri(21, 99); b = ri(11, a - 10); } while (a % 10 < b % 10); return [a, b]; };
const add1 = () => { let a, b; do { a = ri(11, 95); b = ri(1, 8); } while (a % 10 + b > 9); return [a, b]; };
const sub1 = () => { let a, b; do { a = ri(12, 99); b = ri(1, 8); } while (a % 10 < b); return [a, b]; };

/* ═════════════ 1. 100까지의 수 ═════════════ */
add({ key:'1-2-1', title:'100까지의 수', intro:'60, 70, 80, 90과 99까지의 수, 100을 알고 수의 순서와 크기를 비교하며, 짝수와 홀수를 알아봐요.',
  prev:'[1-1] 50까지의 수', lessons:[
  { title:'60, 70, 80, 90을 알아볼까요', std:['2수01-01'], key:'10개씩 묶음 6개 = <b>60</b>(육십, 예순), 7개 = <b>70</b>(칠십, 일흔), 8개 = <b>80</b>(팔십, 여든), 9개 = <b>90</b>(구십, 아흔)',
    body:`${tableH([['수', '60', '70', '80', '90'], ['읽기', '육십 · 예순', '칠십 · 일흔', '팔십 · 여든', '구십 · 아흔']])}`,
    lab: K.bundleLab(100, 60), ex:`<p>10개씩 묶음 8개 → <b>80</b></p>`, quiz:[['h-tens', 1], ['h-read', 1]] },
  { title:'99까지의 수를 알아볼까요', std:['2수01-01'], key:'10개씩 묶음 7개와 낱개 5개 → <b>75</b> (칠십오, 일흔다섯)',
    body:`<div class="note">💡 99보다 1만큼 더 큰 수는 <b>100</b>(백)이에요.</div>`,
    lab: K.bundleLab(100, 75), ex:`<p>10개씩 묶음 9개와 낱개 4개 → <b>94</b></p>`, quiz:[['h-make', 1], ['h-read', 2]] },
  { title:'수를 넣어 이야기를 해 볼까요', std:['2수01-01'], key:'생활 속에서 수를 <b>두 가지 방법</b>으로 읽어요: 버스 <b>육십삼</b>번, 귤 <b>예순세</b> 개',
    body:`<p>번호, 날짜는 "일, 이, 삼"으로, 물건의 개수나 나이는 "하나, 둘, 셋"으로 읽는 경우가 많아요.</p>`,
    lab: K.bundleLab(100, 63), ex:`<p>우리 할머니는 <b>일흔두</b> 살이에요.</p>`, quiz:[['h-read', 2], ['h-make', 2]] },
  { title:'수의 순서를 알아볼까요', std:['2수01-03'], key:'100까지의 수 배열판에서 오른쪽으로 <b>1씩</b>, 아래로 <b>10씩</b> 커져요.',
    body:`${E('97 — 98 — 99 — 100')}`,
    lab: K.boardLab(100), ex:`<p>73과 77 사이의 수: 74, 75, 76 → <b>3개</b></p>`, quiz:[['h-seq', 1], ['h-pm', 2], ['h-between', 3]] },
  { title:'수의 크기를 비교해 볼까요', std:['2수01-03'], key:'<b>10개씩 묶음의 수</b>를 먼저 비교하고, 같으면 <b>낱개의 수</b>를 비교해요.',
    body:`${E('68 &lt; 71 · 85 &gt; 83')}<p>&gt;, &lt;를 사용해 크기를 나타낼 수 있어요. 벌어진 쪽이 큰 수!</p>`,
    lab: K.cmpTensLab(99), ex:`<p>수 카드 4, 7, 2로 만든 가장 큰 몇십몇 → <b>74</b></p>`, quiz:[['h-cmp', 2], ['h-cmp', 3], ['h-cards', 4]] },
  { title:'짝수와 홀수를 알아볼까요', std:['2수01-01'], key:'둘씩 짝을 지을 때 남는 것이 없으면 <b>짝수</b>, 하나가 남으면 <b>홀수</b>',
    body:`<p>짝수: 2, 4, 6, 8, 10, … · 홀수: 1, 3, 5, 7, 9, …</p><div class="note">💡 낱개의 수(일의 자리)가 0, 2, 4, 6, 8이면 짝수예요.</div>`,
    lab: evenLab, ex:`<p>15부터 20까지의 짝수: 16, 18, 20 → <b>3개</b></p>`, quiz:[['h-even', 2], ['h-evcount', 3], ['h-cond', 4]] }
]});

/* ═════════════ 2. 덧셈과 뺄셈(1) ═════════════ */
add({ key:'1-2-2', title:'덧셈과 뺄셈(1)', intro:'세 수의 덧셈과 뺄셈을 하고, 10이 되는 더하기와 10에서 빼기, 10을 만들어 더하기를 해요.',
  prev:'[1-1] 덧셈과 뺄셈', lessons:[
  { title:'세 수의 덧셈을 해 볼까요', std:['2수01-08'], key:'세 수의 덧셈은 <b>앞의 두 수</b>를 먼저 더하고, 그 결과에 나머지 수를 더해요.',
    body:`${E('2 + 3 + 4 = 5 + 4 = 9')}`,
    lab: threeLab(false), ex:`<p>4 + 1 + 3 = <b>8</b></p>`, quiz:[['t3-add', 1], ['t3-add', 2]] },
  { title:'세 수의 뺄셈을 해 볼까요', std:['2수01-08'], key:'세 수의 뺄셈은 <b>앞에서부터 차례로</b> 빼요.',
    body:`${E('9 - 3 - 2 = 6 - 2 = 4')}<div class="warn">⚠️ 뺄셈은 순서를 바꾸어 계산하면 안 돼요!</div>`,
    lab: threeLab(true), ex:`<p>8 - 2 - 1 = <b>5</b></p>`, quiz:[['t3-sub', 1], ['t3-mix', 3], ['t3-word', 3]] },
  { title:'10이 되는 더하기를 해 볼까요', std:['2수01-04'], key:'더해서 10이 되는 두 수: <b>1과 9, 2와 8, 3과 7, 4와 6, 5와 5</b>',
    body:`${E('6 + □ = 10 → □ = 4')}`,
    lab: tenPairLab(false), ex:`<p>□ + 3 = 10 → <b>7</b></p>`, quiz:[['ten-add', 1], ['ten-pair', 2]] },
  { title:'10에서 빼기를 해 볼까요', std:['2수01-04'], key:'10에서 빼면 <b>10이 되는 짝</b>이 남아요: 10 - 3 = 7',
    body:`${E('10 - 6 = 4 · 10 - 9 = 1')}`,
    lab: tenPairLab(true), ex:`<p>10 - □ = 2 → <b>8</b></p>`, quiz:[['ten-sub', 1]] },
  { title:'10을 만들어 더해 볼까요', std:['2수01-08'], key:'세 수 중 <b>더해서 10이 되는 두 수</b>를 먼저 더하면 쉬워요.',
    body:`${E('7 + 3 + 5 = 10 + 5 = 15 · 4 + 8 + 6 = 4 + 6 + 8 = 18')}`,
    lab: makeTenLab, ex:`<p>2 + 9 + 8 → 2 + 8 = 10 → 10 + 9 = <b>19</b></p>`, quiz:[['ten-make', 2], ['ten-box', 4]] }
]});

/* ═════════════ 3. 모양과 시각 ═════════════ */
add({ key:'1-2-3', title:'모양과 시각', intro:'생활 속에서 □, △, ○ 모양을 찾아 특징을 알고 꾸며 보아요. 시계를 보고 몇 시, 몇 시 30분을 읽어요.',
  prev:'[1-1] 여러 가지 모양', lessons:[
  { title:'□, △, ○ 모양을 찾아볼까요', std:['2수03-03'], key:'물건의 본을 뜨거나 생활 속에서 <b>□, △, ○ 모양</b>을 찾아요.',
    body:`<p style="font-size:30px;text-align:center">🖼️📱 · 🔺🍙 · 🪙🍪</p>`,
    lab: shapeFindLab, ex:`<p>동전 → <b>○ 모양</b>, 삼각자 → <b>△ 모양</b></p>`, quiz:[['f-kind', 1], ['f-obj', 1]] },
  { title:'□, △, ○ 모양을 알아볼까요', std:['2수03-03'], key:'□ 모양은 <b>뾰족한 곳 4군데</b>, △ 모양은 <b>3군데</b>, ○ 모양은 <b>없고 둥글어요</b>.',
    body:`<div class="figc">${svg(300, 90, shp('r', 50, 45, 70, '#9CC7EE') + shp('t', 150, 45, 74, '#FFB3B3') + shp('c', 250, 45, 70, '#FFE38A'))}</div>`,
    lab: shapeFindLab, ex:`<p>곧은 선이 3개 → <b>△ 모양</b></p>`, quiz:[['f-prop', 2], ['f-count', 2]] },
  { title:'여러 가지 모양을 만들어 볼까요', std:['2수03-03'], key:'□, △, ○ 모양을 이용하여 <b>여러 가지 모양을 꾸며요</b>.',
    body:`<p>집, 자동차, 로봇… 꾸민 그림에 사용한 모양의 수를 세어 보아요.</p>`,
    lab: shapeArtLab, ex:`<p>□ 2개와 △ 3개의 뾰족한 곳 → 8 + 9 = <b>17군데</b></p>`, quiz:[['f-count', 2], ['f-corner', 3]] },
  { title:'몇 시를 알아볼까요', std:['2수03-07'], key:'긴바늘이 <b>12</b>를 가리키고 짧은바늘이 3을 가리키면 <b>3시</b>예요.',
    body:`<div class="figc">${clock(3, 0, 140)}</div>`,
    lab: K.clockLab('hour'), ex:`<p>짧은바늘이 9, 긴바늘이 12 → <b>9시</b></p>`, quiz:[['tm-oclock', 1], ['tm-hand', 2]] },
  { title:'몇 시 30분을 알아볼까요', std:['2수03-07'], key:'긴바늘이 <b>6</b>을 가리키고 짧은바늘이 숫자 4와 5 사이에 있으면 <b>4시 30분</b>이에요.',
    body:`<div class="figc">${clock(4, 30, 140)}</div>`,
    lab: K.clockLab('half'), ex:`<p>숙제 4시 30분, 줄넘기 5시 → 먼저 한 일은 <b>숙제</b></p>`, quiz:[['tm-half', 1], ['tm-hand', 3], ['tm-first', 3], ['tm-after', 4]] }
]});

/* ═════════════ 4. 덧셈과 뺄셈(2) ═════════════ */
add({ key:'1-2-4', title:'덧셈과 뺄셈(2)', intro:'10을 이용하여 (몇) + (몇) = (십몇), (십몇) - (몇)을 계산하고, 여러 가지 덧셈과 뺄셈에서 규칙을 찾아요.',
  prev:'[1-2] 덧셈과 뺄셈(1)', lessons:[
  { title:'덧셈을 알아볼까요', std:['2수01-06'], key:'이어 세기나 <b>10을 만들어</b> (몇) + (몇)을 계산해요.',
    body:`${E('8 + 3 → 8에서 9, 10, 11 → 11')}`,
    lab: addTenLab, ex:`<p>빈 병 8개에 3개를 더 모으면 <b>11개</b></p>`, quiz:[['c-add', 1], ['c-word', 2]] },
  { title:'덧셈을 해 볼까요', std:['2수01-06'], key:'뒤의 수를 갈라 앞의 수와 <b>10</b>을 만들어 더해요.',
    body:`${E('7 + 5 = 7 + 3 + 2 = 10 + 2 = 12')}`,
    lab: addTenLab, ex:`<p>9 + 6 = 9 + 1 + 5 = <b>15</b></p>`, quiz:[['c-add', 2], ['c-make10', 2]] },
  { title:'여러 가지 덧셈을 해 볼까요', std:['2수01-06'], key:'한 수가 1 커지고 다른 수가 1 작아지면 <b>합은 같아요</b>.',
    body:`${E('9 + 4 = 13 · 8 + 5 = 13 · 7 + 6 = 13')}`,
    lab: sumTableLab(false), ex:`<p>6 + 8과 합이 같은 식 → <b>7 + 7</b></p>`, quiz:[['c-pat', 3], ['c-cmp', 3]] },
  { title:'뺄셈을 알아볼까요', std:['2수01-06'], key:'거꾸로 세기나 <b>10을 이용하여</b> (십몇) - (몇)을 계산해요.',
    body:`${E('12 - 4 → 11, 10, 9, 8 → 8')}`,
    lab: subTenLab, ex:`<p>팽이 15개 중 7개를 나누어 주면 <b>8개</b></p>`, quiz:[['c-sub', 1], ['c-word', 2]] },
  { title:'뺄셈을 해 볼까요', std:['2수01-06'], key:'빼는 수를 갈라 먼저 <b>10</b>을 만들고 빼요.',
    body:`${E('14 - 6 = 14 - 4 - 2 = 10 - 2 = 8')}<p>또는 10에서 먼저 빼기: 14 - 6 → 10 - 6 = 4, 4 + 4 = 8</p>`,
    lab: subTenLab, ex:`<p>16 - 9 = 16 - 6 - 3 = <b>7</b></p>`, quiz:[['c-sub', 2], ['c-split10', 3]] },
  { title:'여러 가지 뺄셈을 해 볼까요', std:['2수01-06', '2수01-07'], key:'빼지는 수와 빼는 수가 똑같이 커지면 <b>차는 같아요</b>.',
    body:`${E('12 - 5 = 7 · 13 - 6 = 7 · 14 - 7 = 7')}`,
    lab: sumTableLab(true), ex:`<p>□ + 7 = 15 → □ = 15 - 7 = <b>8</b></p>`, quiz:[['c-pat', 3], ['c-box', 3], ['c-cards', 5]] }
]});

/* ═════════════ 5. 규칙 찾기 ═════════════ */
add({ key:'1-2-5', title:'규칙 찾기', intro:'물체, 무늬, 수의 배열에서 규칙을 찾고, 자신만의 규칙을 만들어 여러 가지 방법으로 나타내요.',
  prev:'[1-2] 100까지의 수', lessons:[
  { title:'규칙을 찾아볼까요', std:['2수02-01'], key:'<b>되풀이되는 부분</b>을 찾으면 규칙이 보여요.',
    body:`<p style="font-size:28px;text-align:center">🍎🍌🍌🍎🍌🍌🍎🍌🍌</p><p>🍎🍌🍌이 되풀이돼요.</p>`,
    lab: K.patMakeLab, ex:`<p>🔴🔵🔴🔵🔴❓ → <b>🔵</b></p>`, quiz:[['pt-next', 1], ['pt-blank', 2]] },
  { title:'규칙을 만들어 볼까요 (1)', std:['2수02-02'], key:'두 가지 이상의 모양, 색깔로 <b>나만의 규칙</b>을 만들어 늘어놓아요.',
    body:`<p>반복할 부분을 정하고 그대로 되풀이해요.</p>`,
    lab: K.patMakeLab, ex:`<p>⭐⭐🌙을 되풀이: ⭐⭐🌙⭐⭐🌙…</p>`, quiz:[['pt-next', 2]] },
  { title:'규칙을 만들어 볼까요 (2)', std:['2수02-02'], key:'만든 규칙으로 <b>무늬를 꾸미고</b> 친구에게 설명해요.',
    body:`<p>규칙에 따라 15번째, 20번째에 무엇이 올지도 예상할 수 있어요.</p>`,
    lab: K.patMakeLab, ex:`<p>🔴🔵🔵을 되풀이하여 12개 → 🔴는 <b>4개</b></p>`, quiz:[['pt-count', 4]] },
  { title:'수 배열에서 규칙을 찾아볼까요', std:['2수02-01'], key:'수가 <b>몇씩 커지는지(작아지는지)</b> 살펴봐요.',
    body:`${E('5, 10, 15, 20, … → 5씩 커져요')}`,
    lab: seqLab, ex:`<p>90, 80, 70, □ → <b>60</b></p>`, quiz:[['pt-num', 2], ['pt-num', 3]] },
  { title:'수 배열표에서 규칙을 찾아볼까요', std:['2수02-01'], key:'수 배열표에서 → 방향은 <b>1씩</b>, ↓ 방향은 <b>10씩</b>, ↘ 방향은 <b>11씩</b> 커져요.',
    body:`<p>색칠한 수를 보고 규칙을 찾아보아요.</p>`,
    lab: K.boardLab(100, 'step'), ex:`<p>23 → 34 → 45 → <b>56</b> (11씩)</p>`, quiz:[['pt-table', 3]] },
  { title:'규칙을 여러 가지 방법으로 나타내 볼까요', std:['2수02-01'], key:'같은 규칙을 <b>수, 소리, 몸짓</b> 등 여러 가지 방법으로 나타낼 수 있어요.',
    body:`<p>🐶🐱🐱🐶🐱🐱 → 1 2 2 1 2 2 → 짝 쿵 쿵 짝 쿵 쿵</p>`,
    lab: codeLab, ex:`<p>△□△□ → <b>3 4 3 4</b> (꼭짓점의 수로 나타내기)</p>`, quiz:[['pt-code', 3]] }
]});

/* ═════════════ 6. 덧셈과 뺄셈(3) ═════════════ */
add({ key:'1-2-6', title:'덧셈과 뺄셈(3)', intro:'받아올림과 받아내림이 없는 두 자리 수의 덧셈과 뺄셈을 10개씩 묶음과 낱개로 나누어 계산해요.',
  prev:'[1-2] 100까지의 수 · 덧셈과 뺄셈(2)', lessons:[
  { title:'덧셈을 알아볼까요', std:['2수01-06'], key:'<b>낱개는 낱개끼리</b>, <b>10개씩 묶음은 묶음끼리</b> 더해요.',
    body:`${E('32 + 5 = 37 · 30 + 20 = 50')}`,
    lab: T3.colLab('수 모형으로 (몇십몇) + (몇) 계산하기', '+', add1), ex:`<p>24 + 3 = <b>27</b></p>`, quiz:[['dd-add1', 1], ['dd-tens', 1]] },
  { title:'덧셈을 해 볼까요', std:['2수01-06'], key:'(몇십몇) + (몇십몇)은 낱개끼리, 묶음끼리 더해요.',
    body:`${E('23 + 14 = 37')}`,
    lab: T3.colLab('세로셈으로 (몇십몇) + (몇십몇)', '+', noC), ex:`<p>줄넘기 41번 + 35번 = <b>76번</b></p>`, quiz:[['dd-add2', 2], ['dd-word', 2]] },
  { title:'뺄셈을 알아볼까요', std:['2수01-06'], key:'<b>낱개는 낱개끼리</b>, <b>10개씩 묶음은 묶음끼리</b> 빼요.',
    body:`${E('37 - 4 = 33 · 70 - 30 = 40')}`,
    lab: T3.colLab('수 모형으로 (몇십몇) - (몇) 계산하기', '-', sub1), ex:`<p>48 - 5 = <b>43</b></p>`, quiz:[['dd-sub1', 1], ['dd-tens', 2]] },
  { title:'뺄셈을 해 볼까요', std:['2수01-06'], key:'(몇십몇) - (몇십몇)도 같은 자리끼리 빼요.',
    body:`${E('58 - 23 = 35')}`,
    lab: T3.colLab('세로셈으로 (몇십몇) - (몇십몇)', '-', noB), ex:`<p>동화책 67권, 위인전 42권 → <b>25권</b> 더 많아요</p>`, quiz:[['dd-sub2', 2], ['dd-word', 3]] },
  { title:'덧셈과 뺄셈을 해 볼까요', std:['2수01-06', '2수01-07'], key:'덧셈과 뺄셈의 <b>관계</b>를 이용하면 □를 구할 수 있어요.',
    body:`${E('25 + □ = 47 → □ = 47 - 25 = 22')}`,
    lab: T3.colLab('덧셈과 뺄셈 세로셈 연습', '+', noC), ex:`<p>합과 차를 비교: 34 + 12 = 46, 68 - 21 = 47 → 46 &lt; 47</p>`, quiz:[['dd-cmp', 3], ['dd-box', 3], ['dd-cards', 4]] }
]});
})();
