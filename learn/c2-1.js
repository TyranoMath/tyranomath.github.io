/* =========================================================
   🦖 개념 탐험대 — 2학년 1학기 (2022 개정 교육과정)
   단원: 1 세 자리 수 · 2 여러 가지 도형 · 3 덧셈과 뺄셈 · 4 길이 재기 · 5 분류하기 · 6 곱셈
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, H = window.TM_G12, K = window.TM_L12, T3 = window.TM_L3;
const { svg, txt, line, range, tableH, ri, pick, shuffle } = A;
const { P, sino, native, emo, shp, COLS, blocks } = H;
const { $in, press } = K;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', GRAY = '#5D6C83', RED = '#E0464A';
const PV = ['일', '십', '백', '천'];

/* ═════════════ 2학년 공통 실험실 ═════════════ */
// 자리마다 숫자를 바꾸며 수 모형 보기
const placeLab = (n, start) => ({ title: `자리마다 숫자를 바꾸며 ${n === 3 ? '세' : '네'} 자리 수 알아보기`, init(el){
  let dg = String(start).padStart(n, '0').split('').map(Number);
  el.innerHTML = `<div id="pt"></div><div class="figc" id="pb" style="overflow-x:auto"></div><div class="out" id="po"></div>`;
  const draw = () => { let h = '<table class="qt"><tr>' + range(0, n - 1).map(i => `<th>${PV[n - 1 - i]}의 자리</th>`).join('') + '</tr><tr>';
    dg.forEach((d, i) => { h += `<td style="padding:2px"><button class="tbtn" type="button" data-i="${i}" style="min-width:52px;font-family:Fredoka;font-size:26px">${d}</button></td>`; });
    $in(el, '#pt').innerHTML = h + '</tr><tr>' + dg.map((d, i) => `<td style="font-size:14px;color:${GRAY}">${d * Math.pow(10, n - 1 - i)}</td>`).join('') + '</tr></table>';
    el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; dg[i] = (dg[i] + 1) % 10; if (i === 0 && dg[0] === 0) dg[0] = 1; draw(); }));
    const v = +dg.join(''); $in(el, '#pb').innerHTML = blocks(v);
    $in(el, '#po').innerHTML = `<b style="font-family:Fredoka;font-size:28px">${v}</b> → 읽기: <b>${sino(v)}</b><br>${dg.map((d, i) => d ? `${d * Math.pow(10, n - 1 - i)}` : '').filter(Boolean).join(' + ')} = ${v}<br><span style="color:${GRAY}">칸을 누르면 숫자가 1씩 커져요. 0인 자리는 읽지 않아요.</span>`; };
  draw();
} });
// 뛰어 세기
const skipLab = (n, start) => ({ title: '뛰어 세며 어느 자리가 바뀌는지 보기', init(el){
  const S = n === 3 ? [1, 10, 100] : [10, 100, 1000];
  el.innerHTML = `<div class="ctrl">${S.map((k, i) => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${i === 1}">${k}씩</button>`).join('')}<button class="tbtn" type="button" id="sd" aria-pressed="false">거꾸로</button></div><div class="ctrl"><button class="tbtn" type="button" id="sg">🦖 뛰어 세기 ▶</button><button class="tbtn" type="button" id="sr">↺ 처음</button></div><div class="out" id="sv" style="font-family:Fredoka;font-size:22px;line-height:1.7"></div><div class="out" id="so"></div>`;
  let k = S[1], down = false, seq = [start];
  const hl = (v, p) => { const s = String(v), q = String(p ?? '').padStart(s.length, ' '); return s.split('').map((c, i) => p != null && c !== q[i] ? `<span style="background:#FFE38A;border-radius:4px">${c}</span>` : c).join(''); };
  const draw = () => { $in(el, '#sv').innerHTML = seq.map((v, i) => hl(v, seq[i - 1])).join(' → '); $in(el, '#so').innerHTML = `${k}씩 ${down ? '거꾸로 ' : ''}뛰어 세면 <b>${PV[String(k).length - 1]}의 자리</b> 숫자가 1씩 ${down ? '작아져요' : '커져요'}.`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { k = +b.dataset.k; press(el, '[data-k]', b); seq = [seq[seq.length - 1]]; draw(); }));
  $in(el, '#sd').addEventListener('click', e => { down = !down; e.target.setAttribute('aria-pressed', down); seq = [seq[seq.length - 1]]; draw(); });
  $in(el, '#sg').addEventListener('click', () => { const nx = seq[seq.length - 1] + (down ? -k : k); if (nx >= 0 && nx < Math.pow(10, n) && seq.length < 7) seq.push(nx); draw(); });
  $in(el, '#sr').addEventListener('click', () => { seq = [start]; draw(); }); draw();
} });
const cmpLab = n => ({ title: '자리를 맞추어 두 수 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cn">🎲 새 두 수</button></div><div id="ct"></div><div class="out" id="co"></div>`;
  const fresh = () => { const lo = Math.pow(10, n - 1), a = ri(lo, lo * 10 - 1); let b = String(a).split(''); const j = ri(0, n - 1); b[j] = String((+b[j] + ri(1, 9)) % 10 || 1); b = +b.join('');
    let first = -1; const sa = String(a), sb = String(b); for (let i = 0; i < n; i++) if (sa[i] !== sb[i]){ first = i; break; }
    const row = s => s.split('').map((c, i) => `<td style="font-family:Fredoka;font-size:26px;padding:2px 10px;${i === first ? 'background:#FFE38A' : ''}">${c}</td>`).join('');
    $in(el, '#ct').innerHTML = `<table class="qt"><tr><th></th>${range(0, n - 1).map(i => `<th>${PV[n - 1 - i]}</th>`).join('')}</tr><tr><th>가</th>${row(sa)}</tr><tr><th>나</th>${row(sb)}</tr></table>`;
    const c = a > b ? '&gt;' : a < b ? '&lt;' : '='; $in(el, '#co').innerHTML = a === b ? '두 수가 같아요.' : `<b style="font-size:24px">${a} ${c} ${b}</b><br><span style="color:${GRAY}">${PV[n - 1]}의 자리부터 비교해요. 노란 칸(${PV[n - 1 - first]}의 자리)에서 처음 달라져요.</span>`; };
  $in(el, '#cn').addEventListener('click', fresh); fresh();
} });
window.TM_L2 = { placeLab, skipLab, cmpLab };

/* ═════════════ 2-1 실험실 ═════════════ */
const dotPolyLab = { title: '점을 이어 도형 그리기', init(el){
  const u = 44, C = 6, R = 4, NM = ['삼각형', '사각형', '오각형', '육각형'];
  el.innerHTML = `<div class="figc" id="df"></div><div class="ctrl"><button class="tbtn" type="button" id="dc">↺ 다시</button><button class="tbtn" type="button" id="dz">✔ 닫기 (도형 완성)</button></div><div class="out" id="do">점을 차례로 눌러 곧은 선으로 이어 보세요.</div>`;
  let pts = [], closed = false;
  const draw = () => { let g = '';
    if (pts.length > 1) g += closed ? `<polygon points="${pts.map(p => [p[0] * u + 20, p[1] * u + 20].join(',')).join(' ')}" fill="#DFF5E1" stroke="${INK}" stroke-width="2.6"/>` : `<polyline points="${pts.map(p => [p[0] * u + 20, p[1] * u + 20].join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
    for (let y = 0; y <= R; y++) for (let x = 0; x <= C; x++){ const on = pts.some(p => p[0] === x && p[1] === y); g += `<circle cx="${x * u + 20}" cy="${y * u + 20}" r="${on ? 7 : 4}" fill="${on ? RED : '#9AA6B6'}"/><circle cx="${x * u + 20}" cy="${y * u + 20}" r="16" fill="transparent" data-x="${x}" data-y="${y}" style="cursor:pointer"/>`; }
    $in(el, '#df').innerHTML = svg(C * u + 40, R * u + 40, g);
    el.querySelectorAll('circle[data-x]').forEach(c => c.addEventListener('click', () => { if (closed){ pts = []; closed = false; } const p = [+c.dataset.x, +c.dataset.y]; if (pts.length >= 3 && p[0] === pts[0][0] && p[1] === pts[0][1]){ closed = true; } else if (!pts.some(q => q[0] === p[0] && q[1] === p[1]) && pts.length < 6) pts.push(p); draw(); }));
    if (closed) $in(el, '#do').innerHTML = `곧은 선(변) <b>${pts.length}개</b>, 꼭짓점 <b>${pts.length}개</b> → <b>${NM[pts.length - 3]}</b>${pts.length <= 4 ? '' : ' (2학년에서는 삼각형, 사각형을 배워요)'}`; else $in(el, '#do').innerHTML = pts.length ? `점 ${pts.length}개를 이었어요. 첫 점을 누르거나 "닫기"를 눌러 도형을 완성해요.` : '점을 차례로 눌러 곧은 선으로 이어 보세요.'; };
  $in(el, '#dc').addEventListener('click', () => { pts = []; closed = false; draw(); }); $in(el, '#dz').addEventListener('click', () => { if (pts.length >= 3) closed = true; draw(); }); draw();
} };
const circleLab = { title: '여러 가지 물건으로 원 그리기', init(el){
  el.innerHTML = `<div class="ctrl">${[['🪙', '동전', 20], ['🥤', '컵', 36], ['🥫', '통조림', 48], ['💿', 'CD', 60]].map((o, i) => `<button class="tbtn" type="button" data-r="${o[2]}" data-n="${o[1]}">${o[0]} ${o[1]}</button>`).join('')}<button class="tbtn" type="button" id="cc">↺</button></div><div class="figc" id="cf"></div><div class="out" id="co">물건을 눌러 본을 떠 보세요.</div>`;
  let cs = [];
  const draw = () => { $in(el, '#cf').innerHTML = svg(320, 160, cs.map(([x, r], i) => `<circle cx="${x}" cy="80" r="${r}" fill="${COLS[i % 6]}" opacity=".7" stroke="${INK}" stroke-width="2"/>`).join('')); };
  el.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { const r = +b.dataset.r; cs.push([ri(r + 4, 316 - r), r]); if (cs.length > 6) cs.shift(); draw(); $in(el, '#co').innerHTML = `${b.dataset.n}의 본을 뜨면 <b>원</b>이 돼요. 크기는 달라도 모두 원! 원은 곧은 선과 꼭짓점이 없고 어느 쪽에서 보아도 똑같이 동그래요.`; }));
  $in(el, '#cc').addEventListener('click', () => { cs = []; draw(); }); draw();
} };
const tangramLab = { title: '칠교판 조각 알아보기', init(el){
  const S = 220, P = [ // 칠교판 조각 (정사각형 220)
    [[[0, 0], [S, 0], [S / 2, S / 2]], '큰 삼각형', 't'], [[[0, 0], [S / 2, S / 2], [0, S]], '큰 삼각형', 't'], [[[S, 0], [S, S / 2], [3 * S / 4, S / 4]], '작은 삼각형', 't'], [[[S / 2, S / 2], [3 * S / 4, S / 4], [3 * S / 4, 3 * S / 4], [S / 4, 3 * S / 4]].slice(0, 4), '정사각형', 'r'],
    [[[S, S / 2], [S, S], [S / 2, S]], '중간 삼각형', 't'], [[[S / 4, 3 * S / 4], [S / 2, S], [0, S]], '작은 삼각형', 't'], [[[3 * S / 4, S / 4], [S, S / 2], [3 * S / 4, 3 * S / 4], [S / 2, S]].slice(0, 4), '평행사변형 모양', 'r']];
  // 정확한 칠교판: 아래 조각으로 고정
  const pieces = [[[[0, 0], [220, 0], [110, 110]], '큰 삼각형', 't'], [[[0, 0], [110, 110], [0, 220]], '큰 삼각형', 't'], [[[220, 0], [220, 110], [165, 55]], '작은 삼각형', 't'], [[[110, 110], [165, 55], [220, 110], [165, 165]], '정사각형', 'r'], [[[220, 110], [220, 220], [110, 220]], '중간 삼각형', 't'], [[[110, 110], [165, 165], [55, 165]], '작은 삼각형', 't'], [[[0, 220], [55, 165], [165, 165], [110, 220]], '평행사변형 모양', 'r']]; void P;
  el.innerHTML = `<div class="figc" id="tf"></div><div class="out" id="to">조각을 눌러 보세요.</div>`;
  let sel = new Set();
  const draw = () => { $in(el, '#tf').innerHTML = svg(240, 240, `<g transform="translate(10 10)">${pieces.map(([pt, nm, k], i) => `<polygon data-i="${i}" points="${pt.map(p => p.join(',')).join(' ')}" fill="${sel.has(i) ? '#FFE38A' : COLS[i % 6]}" stroke="${INK}" stroke-width="2.4" style="cursor:pointer"/>`).join('')}</g>`);
    el.querySelectorAll('polygon[data-i]').forEach(p => p.addEventListener('click', () => { const i = +p.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); draw();
      $in(el, '#to').innerHTML = `${pieces[i][1]} → <b>${pieces[i][2] === 't' ? '삼각형' : '사각형'}</b> 조각 · 칠교판 7조각: 삼각형 <b>5개</b>, 사각형 <b>2개</b><br><span style="color:${GRAY}">고른 조각: 삼각형 ${[...sel].filter(j => pieces[j][2] === 't').length}개, 사각형 ${[...sel].filter(j => pieces[j][2] === 'r').length}개</span>`; })); };
  draw();
} };
const stackLab = { title: '칸을 눌러 쌓기나무 쌓기', init(el){
  el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center"><div style="text-align:center"><div style="font-family:Jua;color:#2F8A47">위에서 본 자리 (누르면 +1)</div><div id="sg" style="display:grid;grid-template-columns:repeat(3,52px);gap:4px;margin:6px auto;width:max-content"></div><div style="font-size:13px;color:${GRAY}">↓ 앞</div></div><div id="si"></div></div><div class="ctrl"><button class="tbtn" type="button" id="sc">모두 지우기</button></div><div class="out" id="so"></div>`;
  let Hh = [[0, 0, 0], [0, 1, 0], [1, 2, 1]];
  const draw = () => { $in(el, '#sg').innerHTML = Hh.map((r, i) => r.map((h, j) => `<button class="tbtn" type="button" data-r="${i}" data-c="${j}" style="width:52px;height:52px;padding:0;font-family:Fredoka;font-size:22px;${h ? 'background:#FFE7A8' : ''}">${h || ''}</button>`).join('')).join('');
    el.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.r, j = +b.dataset.c; Hh[i][j] = (Hh[i][j] + 1) % 4; draw(); }));
    const tot = Hh.flat().reduce((a, b) => a + b, 0), f1 = Hh.flat().filter(x => x >= 1).length, f2 = Hh.flat().filter(x => x >= 2).length, f3 = Hh.flat().filter(x => x >= 3).length;
    $in(el, '#si').innerHTML = tot && window.TM_Q6 ? window.TM_Q6.iso(Hh, 26) : '<div class="out">칸을 눌러 쌓아 보세요!</div>';
    $in(el, '#so').innerHTML = `쌓기나무 <b>${tot}개</b> · 1층 ${f1}개${f2 ? `, 2층 ${f2}개` : ''}${f3 ? `, 3층 ${f3}개` : ''}<br><span style="color:${GRAY}">"1층에 3개가 옆으로 나란히 있고, 가운데 쌓기나무 위에 1개가 있어요."처럼 위치와 방향을 이용해 설명해 보세요.</span>`; };
  $in(el, '#sc').addEventListener('click', () => { Hh = Hh.map(r => r.map(() => 0)); draw(); }); draw();
} };
const relLab = { title: '전체와 부분으로 덧셈식과 뺄셈식 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>부분 ①</label><input type="range" min="5" max="60" value="27" id="ra"><span class="v" id="rav"></span><label>부분 ②</label><input type="range" min="5" max="39" value="15" id="rb"><span class="v" id="rbv"></span></div><div class="figc" id="rf"></div><div class="out" id="ro" style="font-size:20px"></div>`;
  const draw = () => { const a = +$in(el, '#ra').value, b = +$in(el, '#rb').value, c = a + b, W = 380, s = W / 100; $in(el, '#rav').textContent = a; $in(el, '#rbv').textContent = b;
    $in(el, '#rf').innerHTML = svg(W + 20, 80, `<rect x="10" y="10" width="${c * s}" height="24" fill="#E6F0FF" stroke="${INK}"/>` + txt(10 + c * s / 2, 22, `전체 ${c}`, { size: 12, bold: true }) + `<rect x="10" y="42" width="${a * s}" height="24" fill="#9BE0A6" stroke="${INK}"/>` + txt(10 + a * s / 2, 54, a, { size: 12, bold: true }) + `<rect x="${10 + a * s}" y="42" width="${b * s}" height="24" fill="#FFC48A" stroke="${INK}"/>` + txt(10 + (a + b / 2) * s, 54, b, { size: 12, bold: true }));
    $in(el, '#ro').innerHTML = `덧셈식: <b>${a} + ${b} = ${c}</b> · <b>${b} + ${a} = ${c}</b><br>뺄셈식: <b>${c} - ${a} = ${b}</b> · <b>${c} - ${b} = ${a}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const boxLab = { title: '□의 값을 넣어 보며 식 맞추기', init(el){
  el.innerHTML = `<div class="out" id="bx" style="font-size:26px;font-family:Fredoka"></div><div class="ctrl"><label>□</label><input type="range" min="0" max="60" value="10" id="bv"><span class="v" id="bvv"></span><button class="tbtn" type="button" id="bn">🎲 다른 식</button></div><div class="out" id="bo"></div>`;
  let a, b, t;
  const fresh = () => { a = ri(15, 45); b = ri(8, 30); t = ri(0, 1); draw(); };
  const draw = () => { const x = +$in(el, '#bv').value; $in(el, '#bvv').textContent = x;
    const left = t ? a + x : a + b - x, right = t ? a + b : a;
    $in(el, '#bx').innerHTML = t ? `${a} + □ = ${a + b}` : `${a + b} - □ = ${a}`;
    $in(el, '#bo').innerHTML = left === right ? `🎉 □ = <b>${x}</b>일 때 맞아요! (${t ? `${a + b} - ${a} = ${b}` : `${a + b} - ${a} = ${b}`}로 바로 구할 수도 있어요)` : `□ = ${x} → ${t ? `${a} + ${x} = ${left}` : `${a + b} - ${x} = ${left}`} ${left > right ? '— 너무 커요' : '— 너무 작아요'}`; };
  $in(el, '#bv').addEventListener('input', draw); $in(el, '#bn').addEventListener('click', fresh); fresh();
} };
const unitLab = { title: '여러 가지 단위로 길이 재기', init(el){
  const U = [['📎', '클립', 3], ['🧽', '지우개', 5], ['✏️', '연필', 15], ['✋', '뼘', 10]];
  el.innerHTML = `<div class="ctrl">${U.map((u, i) => `<button class="tbtn" type="button" data-u="${i}" aria-pressed="${!i}">${u[0]} ${u[1]}</button>`).join('')}</div><div class="figc" id="uf"></div><div class="out" id="uo"></div>`;
  let ui = 0; const len = 30;
  const draw = () => { const [ic, nm, w] = U[ui], s = 11, n = Math.round(len / w); let g = `<rect x="10" y="10" width="${len * s}" height="22" rx="6" fill="#C9D3E0" stroke="${INK}"/>` + txt(10 + len * s / 2, 21, '책상의 긴 쪽 (30 cm)', { size: 11, bold: true });
    for (let i = 0; i < n; i++) g += `<rect x="${10 + i * w * s}" y="40" width="${w * s}" height="24" rx="5" fill="${i % 2 ? '#FFE7A8' : '#DFF5E1'}" stroke="${INK}"/>` + txt(10 + (i + .5) * w * s, 52, ic, { size: 13 });
    $in(el, '#uf').innerHTML = svg(len * s + 30, 72, g);
    $in(el, '#uo').innerHTML = `${nm}${{ '클립': '으로', '지우개': '로', '연필': '로', '뼘': '으로' }[nm]} <b>${n}번</b><br><span style="color:${GRAY}">단위가 짧을수록 잰 횟수가 많아요. 사람마다 뼘이 달라서 cm처럼 모두가 같은 단위가 필요해요.</span>`; };
  el.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => { ui = +b.dataset.u; press(el, '[data-u]', b); draw(); })); draw();
} };
const cmRuler = (s, e, cm = 12) => { const u = 30, X = 14; let g = `<rect x="${X + s * u}" y="12" width="${(e - s) * u}" height="20" rx="6" fill="#FFC48A" stroke="${INK}" stroke-width="1.6"/>`;
  g += `<rect x="${X - 8}" y="40" width="${cm * u + 16}" height="40" rx="4" fill="#FFF4D0" stroke="${INK}" stroke-width="1.5"/>`;
  for (let k = 0; k <= cm * 10; k++) g += line(X + k * u / 10, 40, X + k * u / 10, 40 + (k % 10 ? (k % 5 ? 6 : 10) : 15), { w: k % 10 ? .7 : 1.6 });
  for (let c = 0; c <= cm; c++) g += txt(X + c * u, 66, c, { size: 12, bold: true });
  return svg(cm * u + 32, 86, g); };
const rulerLab = { title: '자로 길이 재기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시작 눈금</label><input type="range" min="0" max="5" step="1" value="0" id="rs"><label>끝</label><input type="range" min="1" max="12" step="0.5" value="7" id="re"></div><div class="figc" id="rf" style="overflow-x:auto"></div><div class="out" id="ro"></div>`;
  const draw = () => { const s = +$in(el, '#rs').value, eI = $in(el, '#re'); if (+eI.value <= s) eI.value = s + 1; const e = +eI.value, d = e - s;
    $in(el, '#rf').innerHTML = cmRuler(s, e);
    $in(el, '#ro').innerHTML = s === 0 ? `한쪽 끝을 눈금 <b>0</b>에 맞추었어요 → 다른 쪽 끝의 눈금 ${e} → ${Number.isInteger(d) ? `<b>${d} cm</b>` : `약 <b>${Math.round(d)} cm</b> (눈금 사이에 있으면 가까운 쪽을 읽어요)`}` : `눈금 ${s}부터 ${e}까지 → 1 cm가 ${Math.floor(d)}번${Number.isInteger(d) ? '' : ' 조금 넘게'} → ${Number.isInteger(d) ? `<b>${d} cm</b>` : `약 <b>${Math.round(d)} cm</b>`}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const guessLab = { title: '길이를 어림하고 자로 확인하기', init(el){
  el.innerHTML = `<div class="figc" id="gf" style="overflow-x:auto"></div><div class="ctrl"><label>내 어림</label><input type="range" min="1" max="12" value="6" id="gg"><span class="v" id="ggv"></span><button class="tbtn" type="button" id="gc">📏 자 대 보기</button><button class="tbtn" type="button" id="gn">🎲 다른 막대</button></div><div class="out" id="go"></div>`;
  let n, shown = false;
  const fresh = () => { n = ri(2, 11); shown = false; draw(); };
  const draw = () => { $in(el, '#ggv').textContent = $in(el, '#gg').value + ' cm';
    $in(el, '#gf').innerHTML = shown ? cmRuler(0, n) : svg(400, 40, `<rect x="14" y="10" width="${n * 30}" height="20" rx="6" fill="#FFC48A" stroke="${INK}" stroke-width="1.6"/>` + line(14, 36, 44, 36, { w: 3 }) + txt(29, 30, '1 cm', { size: 9 }));
    const g = +$in(el, '#gg').value; $in(el, '#go').innerHTML = shown ? `실제 길이 <b>${n} cm</b> · 내 어림 약 ${g} cm → 차이 ${Math.abs(n - g)} cm ${Math.abs(n - g) <= 1 ? '🎉 아주 잘 어림했어요!' : ''}` : '1 cm(아래 굵은 선)를 기준으로 막대의 길이를 어림해 보세요. "약 ○ cm"'; };
  $in(el, '#gg').addEventListener('input', draw); $in(el, '#gc').addEventListener('click', () => { shown = true; draw(); }); $in(el, '#gn').addEventListener('click', fresh); fresh();
} };
const CLR = [['#E0464A', '빨간색'], ['#3B8FD9', '파란색'], ['#F2C94C', '노란색']], SHP = [['t', '삼각형'], ['r', '사각형'], ['c', '원']];
const sortLab = { title: '기준을 정해 분류하고 세기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" data-b="c" aria-pressed="true">색깔로 분류</button><button class="tbtn" type="button" data-b="s">모양으로 분류</button><button class="tbtn" type="button" id="sn">🎲 새 물건</button></div><div class="figc" id="sa"></div><div id="sg" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"></div><div id="st"></div><div class="out" id="so"></div>`;
  let items, by = 'c';
  const fresh = () => { items = range(1, ri(10, 14)).map(() => [pick(CLR), pick(SHP)]); draw(); };
  const draw = () => { $in(el, '#sa').innerHTML = svg(items.length * 34 + 10, 44, items.map(([c, s], i) => shp(s[0], 22 + i * 34, 22, 26, c[0])).join(''));
    const keys = by === 'c' ? CLR : SHP, groups = keys.map(k => items.filter(it => (by === 'c' ? it[0] : it[1]) === k));
    $in(el, '#sg').innerHTML = groups.map((g, i) => `<div style="border:3px solid #BFE6C2;border-radius:14px;padding:6px;background:#fff;text-align:center;min-width:90px"><div style="font-family:Jua">${keys[i][1]}</div>${svg(Math.max(1, g.length) * 28 + 4, 32, g.map(([c, s], j) => shp(s[0], 16 + j * 28, 16, 22, c[0])).join(''))}<div><b>${g.length}개</b></div></div>`).join('');
    $in(el, '#st').innerHTML = tableH([[by === 'c' ? '색깔' : '모양', ...keys.map(k => k[1]), '합계'], ['수(개)', ...groups.map(g => g.length), items.length]]);
    const mx = Math.max(...groups.map(g => g.length));
    $in(el, '#so').innerHTML = `가장 많은 것: <b>${keys.filter((_, i) => groups[i].length === mx).map(k => k[1]).join(', ')}</b><br><span style="color:${GRAY}">기준이 분명해야 누가 분류해도 결과가 같아요.</span>`; };
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => { by = b.dataset.b; press(el, '[data-b]', b); draw(); }));
  $in(el, '#sn').addEventListener('click', fresh); fresh();
} };
const groupLab = { title: '몇씩 묶어 세기', init(el){
  el.innerHTML = `<div class="ctrl"><label>몇씩 묶을까요?</label>${[2, 3, 4, 6].map((k, i) => `<button class="tbtn" type="button" data-k="${k}" aria-pressed="${i === 1}">${k}씩</button>`).join('')}</div><div id="gf"></div><div class="out" id="go"></div>`;
  let k = 3; const n = 12;
  const draw = () => { $in(el, '#gf').innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${range(1, Math.floor(n / k)).map(i => `<span style="border:2.5px solid ${i % 2 ? GR : OR};border-radius:14px;padding:3px 6px;font-size:24px">${'🍓'.repeat(k)}</span>`).join('')}</div>`;
    $in(el, '#go').innerHTML = `딸기 ${n}개를 ${k}씩 묶으면 <b>${n / k}묶음</b> → ${range(1, n / k).map(i => k * i).join(', ')} → ${k}씩 ${n / k}묶음 = <b>${k}의 ${n / k}배</b> = ${n}<br><span style="color:${GRAY}">하나씩 세는 것보다 묶어 세면 빠르고 편리해요.</span>`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { k = +b.dataset.k; press(el, '[data-k]', b); draw(); })); draw();
} };
const timesLab = { title: '막대로 몇의 몇 배 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>몇</label><input type="range" min="2" max="9" value="3" id="tk"><span class="v" id="tkv"></span><label>몇 배</label><input type="range" min="1" max="6" value="4" id="tn"><span class="v" id="tnv"></span></div><div class="figc" id="tf"></div><div class="out" id="to" style="font-size:20px"></div>`;
  const draw = () => { const k = +$in(el, '#tk').value, n = +$in(el, '#tn').value, u = Math.min(20, 380 / (k * n)); $in(el, '#tkv').textContent = k; $in(el, '#tnv').textContent = n + '배';
    let g = range(0, k - 1).map(i => `<rect x="${10 + i * u}" y="10" width="${u}" height="20" fill="#9BE0A6" stroke="${INK}"/>`).join('');
    for (let j = 0; j < n; j++) for (let i = 0; i < k; i++) g += `<rect x="${10 + (j * k + i) * u}" y="44" width="${u}" height="20" fill="${j % 2 ? '#FFC48A' : '#9CC7EE'}" stroke="${INK}"/>`;
    $in(el, '#tf').innerHTML = svg(k * n * u + 20, 72, g);
    $in(el, '#to').innerHTML = `${k}의 ${n}배 = ${range(1, n).map(() => k).join(' + ')} = <b>${k * n}</b><br>곱셈식: <b>${k} × ${n} = ${k * n}</b> <span style="color:${GRAY}">("${sino(k)} 곱하기 ${sino(n)}")</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const arrLab = { title: '줄 맞추어 놓은 물건을 곱셈식으로', init(el){
  el.innerHTML = `<div class="ctrl"><label>한 줄에</label><input type="range" min="2" max="9" value="5" id="ac"><span class="v" id="acv"></span><label>줄 수</label><input type="range" min="2" max="6" value="3" id="ar"><span class="v" id="arv"></span></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  const draw = () => { const c = +$in(el, '#ac').value, r = +$in(el, '#ar').value; $in(el, '#acv').textContent = c; $in(el, '#arv').textContent = r;
    $in(el, '#af').innerHTML = `<div style="font-size:26px;line-height:1.2;text-align:center">${range(1, r).map(() => '🍪'.repeat(c)).join('<br>')}</div>`;
    $in(el, '#ao').innerHTML = `${c}개씩 ${r}줄 → 덧셈식 ${range(1, r).map(() => c).join(' + ')} = ${c * r} → 곱셈식 <b>${c} × ${r} = ${c * r}</b><br><span style="color:${GRAY}">${r}개씩 ${c}줄로 보면 ${r} × ${c} = ${c * r}이에요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
Object.assign(window.TM_L2, { stackLab, arrLab });
const c2 = () => { let a, b; do { a = ri(15, 79); b = ri(12, 69); } while (a % 10 + b % 10 < 10 || a + b > 99); return [a, b]; };
const c21 = () => { let a, b; do { a = ri(15, 89); b = ri(3, 9); } while (a % 10 + b < 10 || a + b > 99); return [a, b]; };
const b2 = () => { let a, b; do { a = ri(30, 98); b = ri(12, a - 5); } while (a % 10 >= b % 10); return [a, b]; };
const b21 = () => { let a, b; do { a = ri(21, 98); b = ri(2, 9); } while (a % 10 >= b); return [a, b]; };

/* ═════════════ 1. 세 자리 수 ═════════════ */
add({ key:'2-1-1', title:'세 자리 수', intro:'100과 몇백, 세 자리 수를 알고, 각 자리의 숫자가 나타내는 값과 뛰어 세기, 수의 크기 비교를 해요.',
  prev:'[1-2] 100까지의 수', lessons:[
  { title:'백을 알아볼까요', std:['2수01-02'], key:'10이 10개인 수 = <b>100</b> (백). 99보다 1 큰 수, 90보다 10 큰 수예요.',
    body:`<div class="figc">${blocks(100)}</div>`,
    lab: K.bundleLab(100, 90), ex:`<p>10원짜리 동전 10개 = <b>100원</b></p>`, quiz:[['b-100', 1]] },
  { title:'몇백을 알아볼까요', std:['2수01-02'], key:'100이 3개 = <b>300</b> (삼백), 100이 5개 = <b>500</b> (오백)',
    body:`<div class="figc">${blocks(300)}</div>`,
    lab: placeLab(3, 300), ex:`<p>100이 7개 → <b>700</b></p>`, quiz:[['b-hund', 1]] },
  { title:'세 자리 수를 알아볼까요', std:['2수01-02'], key:'100이 2개, 10이 4개, 1이 6개 → <b>246</b> (이백사십육)',
    body:`<div class="figc">${blocks(246)}</div><div class="warn">⚠️ 405는 "사백영오"가 아니라 <b>사백오</b>로 읽어요.</div>`,
    lab: placeLab(3, 246), ex:`<p>육백칠 → <b>607</b></p>`, quiz:[['b-make', 1], ['b-read', 1], ['b-write', 2]] },
  { title:'각 자리의 숫자는 얼마를 나타낼까요', std:['2수01-02'], key:'같은 숫자라도 <b>자리</b>에 따라 나타내는 값이 달라요.',
    body:`${tableH([['', '백의 자리', '십의 자리', '일의 자리'], ['숫자', '3', '3', '3'], ['나타내는 값', '300', '30', '3']])}${E('333 = 300 + 30 + 3')}`,
    lab: placeLab(3, 352), ex:`<p>584에서 8은 <b>80</b>을 나타내요.</p>`, quiz:[['b-digit', 2], ['b-coin', 3]] },
  { title:'뛰어 세어 볼까요', std:['2수01-03'], key:'100씩 뛰어 세면 <b>백의 자리</b>, 10씩은 <b>십의 자리</b>, 1씩은 <b>일의 자리</b> 숫자가 1씩 커져요.',
    body:`${E('243 — 343 — 443 — 543 (100씩)')}<div class="note">💡 999보다 1 큰 수는 1000(천)이에요.</div>`,
    lab: skipLab(3, 243), ex:`<p>570 — 580 — □ → <b>590</b></p>`, quiz:[['b-skip', 2], ['b-skip', 3]] },
  { title:'수의 크기를 비교해 볼까요', std:['2수01-03'], key:'<b>백의 자리</b>부터 비교하고, 같으면 십의 자리, 일의 자리 순서로 비교해요.',
    body:`${E('427 &lt; 513 · 362 &gt; 358')}`,
    lab: cmpLab(3), ex:`<p>수 카드 5, 0, 8로 만든 가장 작은 세 자리 수 → <b>508</b></p>`, quiz:[['b-cmp', 2], ['b-cmp', 3], ['b-missing', 4], ['b-cards', 5]] }
]});

/* ═════════════ 2. 여러 가지 도형 ═════════════ */
add({ key:'2-1-2', title:'여러 가지 도형', intro:'삼각형, 사각형, 원을 알고 그려 보며, 칠교판으로 모양을 만들고 쌓기나무로 쌓은 모양을 설명해요.',
  prev:'[1-2] 모양과 시각 (□, △, ○ 모양)', lessons:[
  { title:'삼각형을 알아보고 찾아볼까요', std:['2수03-04', '2수03-05'], key:'곧은 선 <b>3개</b>로 둘러싸인 도형 = <b>삼각형</b>. 곧은 선은 변, 두 변이 만나는 점은 꼭짓점이에요.',
    body:`<p>삼각형은 변이 3개, 꼭짓점이 3개예요.</p><div class="warn">⚠️ 굽은 선이 있거나 선이 끊어져 있으면 삼각형이 아니에요.</div>`,
    lab: dotPolyLab, ex:`<p>점 3개를 곧은 선으로 이으면 <b>삼각형</b></p>`, quiz:[['g-name', 1], ['g-parts', 1], ['g-isnot', 2]] },
  { title:'사각형을 알아보고 찾아볼까요', std:['2수03-04', '2수03-05'], key:'곧은 선 <b>4개</b>로 둘러싸인 도형 = <b>사각형</b>. 변 4개, 꼭짓점 4개',
    body:`<p>모양이 달라도 곧은 선 4개로 둘러싸여 있으면 모두 사각형이에요.</p>`,
    lab: dotPolyLab, ex:`<p>삼각형 2개와 사각형 1개의 꼭짓점 → 6 + 4 = <b>10개</b></p>`, quiz:[['g-parts', 2], ['g-sum', 3]] },
  { title:'원을 알아보고 찾아볼까요', std:['2수03-04'], key:'어느 쪽에서 보아도 <b>똑같이 동그란</b> 모양 = <b>원</b>',
    body:`<p>원은 곧은 선(변)과 꼭짓점이 없어요. 컵, 동전, 통조림의 본을 떠서 원을 그릴 수 있어요.</p>`,
    lab: circleLab, ex:`<p>원은 크기는 달라도 모양이 모두 같아요.</p>`, quiz:[['g-circle', 2], ['g-name', 1]] },
  { title:'칠교판으로 모양을 만들어 볼까요', std:['2수03-05'], key:'칠교판은 <b>삼각형 5개</b>와 <b>사각형 2개</b>, 모두 7조각이에요.',
    body:`<p>작은 삼각형 2개를 붙이면 사각형이나 더 큰 삼각형을 만들 수 있어요.</p>`,
    lab: tangramLab, ex:`<p>사각형 종이를 대각선으로 자르면 삼각형 <b>2개</b></p>`, quiz:[['g-tangram', 2], ['g-cut', 3]] },
  { title:'쌓은 모양을 알아볼까요', std:['2수03-02'], key:'쌓기나무의 <b>위치</b>(위, 아래, 앞, 뒤, 왼쪽, 오른쪽)와 <b>층</b>을 이용해 설명해요.',
    body:`<p>"빨간 쌓기나무의 오른쪽에 1개, 위에 1개가 있어요."</p>`,
    lab: stackLab, ex:`<p>1층에 3개, 2층에 1개 → 모두 <b>4개</b></p>`, quiz:[['g-stack', 2], ['g-stackdesc', 3], ['g-dir', 4]] },
  { title:'여러 가지 모양으로 쌓아 볼까요', std:['2수03-02'], key:'설명을 듣고 똑같이 쌓거나, 쌓은 모양을 보고 <b>설명</b>해요.',
    body:`<p>보이지 않는 뒤쪽에 숨은 쌓기나무가 있을 수 있어요. 여러 방향에서 살펴봐요.</p>`,
    lab: stackLab, ex:`<p>쌓기나무 5개로 서로 다른 모양을 여러 가지 만들 수 있어요.</p>`, quiz:[['g-stack', 3], ['g-stackdesc', 4]] }
]});

/* ═════════════ 3. 덧셈과 뺄셈 ═════════════ */
add({ key:'2-1-3', title:'덧셈과 뺄셈', intro:'받아올림이 있는 두 자리 수의 덧셈, 받아내림이 있는 뺄셈을 여러 가지 방법으로 하고, 세 수의 계산, 덧셈과 뺄셈의 관계, □가 있는 식을 알아봐요.',
  prev:'[1-2] 덧셈과 뺄셈(1)(2)(3)', lessons:[
  { title:'여러 가지 방법으로 덧셈을 해 볼까요', std:['2수01-06'], key:'<b>10을 만들거나</b> 십의 자리와 일의 자리를 나누어 더해요.',
    body:`${E('27 + 5 = 27 + 3 + 2 = 30 + 2 = 32')}`,
    lab: T3.colLab('받아올림이 있는 (두 자리 수) + (한 자리 수)', '+', c21), ex:`<p>48 + 6 = <b>54</b></p>`, quiz:[['a-1', 1]] },
  { title:'덧셈을 해 볼까요', std:['2수01-06'], key:'일의 자리끼리 더해 10이 넘으면 <b>십의 자리로 1을 받아올림</b>해요.',
    body:`${E('38 + 27 = 65 · 74 + 58 = 132')}`,
    lab: T3.colLab('받아올림이 있는 (두 자리 수) + (두 자리 수)', '+', c2), ex:`<p>어제 46권, 오늘 37권 → <b>83권</b></p>`, quiz:[['a-2', 1], ['a-2', 2], ['word', 2]] },
  { title:'여러 가지 방법으로 뺄셈을 해 볼까요', std:['2수01-06'], key:'뺄 수를 갈라 <b>몇십</b>을 만들어 빼거나, 십의 자리에서 받아내려 빼요.',
    body:`${E('32 - 5 = 32 - 2 - 3 = 30 - 3 = 27')}`,
    lab: T3.colLab('받아내림이 있는 (두 자리 수) - (한 자리 수)', '-', b21), ex:`<p>41 - 7 = <b>34</b></p>`, quiz:[['s-1', 1]] },
  { title:'뺄셈을 해 볼까요', std:['2수01-06'], key:'일의 자리끼리 뺄 수 없으면 <b>십의 자리에서 10을 받아내림</b>해요.',
    body:`${E('52 - 27 = 25 · 70 - 34 = 36')}`,
    lab: T3.colLab('받아내림이 있는 (두 자리 수) - (두 자리 수)', '-', b2), ex:`<p>색종이 63장 중 28장 사용 → <b>35장</b></p>`, quiz:[['s-2', 1], ['s-2', 2], ['word', 3]] },
  { title:'세 수의 계산을 해 볼까요', std:['2수01-08'], key:'세 수의 계산은 <b>앞에서부터 차례로</b> 해요.',
    body:`${E('35 + 18 - 24 = 53 - 24 = 29')}<div class="warn">⚠️ 뺄셈이 있으면 순서를 바꾸면 안 돼요!</div>`,
    lab: T3.colLab('두 수씩 차례로 계산하기', '+', c2), ex:`<p>62 - 25 + 13 = 37 + 13 = <b>50</b></p>`, quiz:[['t3', 2], ['t3', 3]] },
  { title:'덧셈과 뺄셈의 관계를 식으로 나타내 볼까요', std:['2수01-07'], key:'덧셈식 하나로 <b>뺄셈식 2개</b>, 뺄셈식 하나로 <b>덧셈식 2개</b>를 만들 수 있어요.',
    body:`${E('27 + 15 = 42 ⇄ 42 - 15 = 27, 42 - 27 = 15')}`,
    lab: relLab, ex:`<p>56 - 19 = 37 → 덧셈식 <b>37 + 19 = 56</b></p>`, quiz:[['rel', 2]] },
  { title:'□가 사용된 식을 만들고 □의 값을 구해 볼까요', std:['2수01-09'], key:'모르는 수를 <b>□</b>로 놓고 식을 만든 다음, 덧셈과 뺄셈의 관계로 □를 구해요.',
    body:`${E('□ + 16 = 34 → □ = 34 - 16 = 18')}`,
    lab: boxLab, ex:`<p>어떤 수에서 24를 뺐더니 39 → □ - 24 = 39 → □ = <b>63</b></p>`, quiz:[['box', 3], ['box-word', 4], ['range', 5], ['cards', 5]] }
]});

/* ═════════════ 4. 길이 재기 ═════════════ */
add({ key:'2-1-4', title:'길이 재기', intro:'여러 가지 단위로 길이를 재어 보고 1 cm를 알며, 자로 길이를 재고 어림해요.',
  prev:'[1-1] 비교하기', lessons:[
  { title:'길이를 비교하는 방법을 알아볼까요', std:['2수03-10'], key:'직접 맞대어 비교하기 어려우면 <b>종이띠나 털실</b>로 길이를 본떠서 비교해요.',
    body:`<p>움직일 수 없는 물건(책상, 문)도 종이띠로 길이를 옮겨 비교할 수 있어요.</p>`,
    lab: K.lenLab, ex:`<p>책상 긴 쪽과 사물함 높이 → 종이띠로 본떠 비교</p>`, quiz:[['l-cmp', 1]] },
  { title:'여러 가지 단위로 길이를 재어 볼까요', std:['2수03-10'], key:'클립, 지우개, 뼘 등 <b>단위</b>로 몇 번인지 재요. 단위가 짧을수록 잰 횟수가 많아요.',
    body:`<div class="warn">⚠️ 사람마다 뼘의 길이가 달라서 같은 물건도 잰 횟수가 달라질 수 있어요.</div>`,
    lab: unitLab, ex:`<p>클립으로 10번, 연필로 2번 → 더 긴 단위는 <b>연필</b></p>`, quiz:[['l-unit', 1], ['l-unit', 2], ['l-units2', 4]] },
  { title:'1 cm를 알아볼까요', std:['2수03-10'], key:'자의 큰 눈금 한 칸의 길이 = <b>1 cm</b> (1 센티미터). 누가 재어도 같은 <b>표준 단위</b>예요.',
    body:`${E('1 cm가 5번 → 5 cm')}`,
    lab: rulerLab, ex:`<p>1 cm가 12번 → <b>12 cm</b></p>`, quiz:[['l-cm', 1]] },
  { title:'자로 길이를 재는 방법을 알아볼까요', std:['2수03-10'], key:'물건의 한쪽 끝을 자의 <b>눈금 0</b>에 맞추고, 다른 쪽 끝의 눈금을 읽어요.',
    body:`<p>0이 아닌 눈금에 맞추었다면 1 cm가 몇 번인지 세어요.</p>`,
    lab: rulerLab, ex:`<p>눈금 2부터 9까지 → 1 cm가 7번 → <b>7 cm</b></p>`, quiz:[['l-ruler', 1], ['l-ruler', 2]] },
  { title:'자로 길이를 재어 볼까요', std:['2수03-10'], key:'길이가 눈금 사이에 있으면 <b>가까운 쪽 눈금</b>을 읽고 "약 ○ cm"라고 말해요.',
    body:`<p>6 cm에 더 가까우면 약 6 cm, 7 cm에 더 가까우면 약 7 cm</p>`,
    lab: rulerLab, ex:`<p>막대 3개(4 cm, 5 cm, 3 cm)를 이으면 <b>12 cm</b></p>`, quiz:[['l-about', 3], ['l-sum', 4]] },
  { title:'길이를 어림하고 어떻게 어림했는지 말해 볼까요', std:['2수03-12'], key:'1 cm, 한 뼘(약 12 cm) 등을 기준으로 <b>어림</b>하고 "약 ○ cm"라고 말해요.',
    body:`<p>어림한 길이와 자로 잰 길이의 차가 작을수록 잘 어림한 거예요.</p>`,
    lab: guessLab, ex:`<p>연필의 길이 → 약 <b>15 cm</b></p>`, quiz:[['l-est', 2], ['l-closest', 3]] }
]});

/* ═════════════ 5. 분류하기 ═════════════ */
add({ key:'2-1-5', title:'분류하기', intro:'분명한 기준을 정해 물건을 분류하고, 분류한 결과를 세어 말하며 생활에 활용해요.',
  prev:'[1-1] 여러 가지 모양', lessons:[
  { title:'분류는 어떻게 할까요', std:['2수04-01'], key:'누가 분류해도 결과가 같은 <b>분명한 기준</b>을 정해야 해요.',
    body:`<p>"예쁜 것", "좋아하는 것"은 사람마다 달라서 분류 기준이 될 수 없어요. "색깔", "모양", "다리의 수"는 좋은 기준이에요.</p>`,
    lab: sortLab, ex:`<p>분류 기준: 색깔 → 빨간색, 파란색, 노란색</p>`, quiz:[['cl-crit', 1]] },
  { title:'기준에 따라 분류해 볼까요', std:['2수04-01'], key:'같은 물건도 <b>기준</b>에 따라 다르게 분류할 수 있어요.',
    body:`<p>단추를 색깔로, 구멍 수로, 모양으로 각각 분류해 보아요.</p>`,
    lab: sortLab, ex:`<p>다리가 4개인 동물: 강아지, 고양이 / 다리가 2개인 동물: 닭, 오리</p>`, quiz:[['cl-count', 1], ['cl-wrong', 3]] },
  { title:'분류하고 세어 볼까요', std:['2수04-01'], key:'분류한 것을 세어 <b>표</b>로 정리하면 한눈에 알 수 있어요.',
    body:`<div class="note">💡 하나씩 세며 ✓ 표시를 하면 빠뜨리거나 두 번 세지 않아요.</div>`,
    lab: sortLab, ex:`<p>빨간색이면서 삼각형인 것처럼 <b>두 가지 기준</b>으로도 세어 보아요.</p>`, quiz:[['cl-count', 2], ['cl-two', 3], ['cl-table', 2]] },
  { title:'분류한 결과를 말해 볼까요', std:['2수04-01'], key:'분류한 결과로 <b>가장 많은 것, 가장 적은 것</b>을 알고 생활에 활용해요.',
    body:`<p>우리 반이 좋아하는 우유를 분류해 세면 어떤 우유를 많이 준비할지 정할 수 있어요.</p>`,
    lab: sortLab, ex:`<p>딸기 우유 12명, 초코 우유 5명 → <b>딸기 우유</b>를 많이 준비해요.</p>`, quiz:[['cl-most', 2], ['cl-diff', 3], ['cl-use', 4]] }
]});

/* ═════════════ 6. 곱셈 ═════════════ */
add({ key:'2-1-6', title:'곱셈', intro:'여러 가지 방법으로 세어 보고, 묶어 세기와 몇의 몇 배를 알아 곱셈식으로 나타내요.',
  prev:'[2-1] 덧셈과 뺄셈 · 세 자리 수', lessons:[
  { title:'여러 가지 방법으로 세어 볼까요', std:['2수01-10'], key:'하나씩 세기, <b>뛰어 세기</b>, <b>묶어 세기</b> 등 여러 방법으로 셀 수 있어요.',
    body:`<p>2씩, 5씩 뛰어 세면 빠르게 셀 수 있어요: 5, 10, 15, 20</p>`,
    lab: groupLab, ex:`<p>🍓 12개 → 3씩 뛰어 세면 3, 6, 9, 12</p>`, quiz:[['x-count', 1]] },
  { title:'묶어 세어 볼까요', std:['2수01-10'], key:'<b>몇씩 몇 묶음</b>인지 세어요.',
    body:`${E('4씩 3묶음 → 4, 8, 12 → 12개')}`,
    lab: groupLab, ex:`<p>사탕 20개를 5개씩 묶으면 <b>4묶음</b></p>`, quiz:[['x-group', 1], ['x-count', 1]] },
  { title:'몇의 몇 배를 알아볼까요', std:['2수01-10'], key:'3씩 4묶음은 <b>3의 4배</b>예요.',
    body:`${E('3의 4배 = 3 + 3 + 3 + 3 = 12')}`,
    lab: timesLab, ex:`<p>5의 3배 → <b>15</b></p>`, quiz:[['x-times', 1], ['x-times2', 2]] },
  { title:'몇의 몇 배로 나타내 볼까요', std:['2수01-10'], key:'막대나 물건의 수를 다른 것의 <b>몇 배</b>로 나타낼 수 있어요.',
    body:`<p>빨간 막대가 초록 막대 2칸짜리를 4번 놓은 길이 → 2의 4배</p>`,
    lab: timesLab, ex:`<p>12는 2의 6배, 3의 4배, 4의 3배, 6의 2배</p>`, quiz:[['x-times2', 3], ['x-ways', 5]] },
  { title:'곱셈을 알아볼까요', std:['2수01-10'], key:'4의 3배를 <b>4 × 3</b>이라 쓰고 "4 <b>곱하기</b> 3"이라고 읽어요.',
    body:`${E('4 × 3 = 12 ("4 곱하기 3은 12와 같습니다")')}<p>4 + 4 + 4 = 12와 같아요.</p>`,
    lab: arrLab, ex:`<p>6 + 6 + 6 + 6 → <b>6 × 4 = 24</b></p>`, quiz:[['x-expr', 2], ['x-read', 2]] },
  { title:'곱셈식으로 나타내 볼까요', std:['2수01-10'], key:'"<b>몇씩 몇 묶음</b>"인 상황을 곱셈식으로 나타내요.',
    body:`<p>자동차 한 대에 바퀴 4개, 5대 → 4 × 5 = 20</p>`,
    lab: arrLab, ex:`<p>사탕 3개씩 4봉지와 2개 더 → 3 × 4 + 2 = <b>14개</b></p>`, quiz:[['x-word', 2], ['x-cmp', 3], ['x-mix', 4]] }
]});
})();
