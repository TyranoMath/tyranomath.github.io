/* =========================================================
   🦖 개념 탐험대 — 5학년 1학기 (2022 개정 교육과정)
   단원마다 탐험(차시): title · key(핵심 한 줄) · body(설명) · lab(직접 해 보기) · ex(예시) · quiz(확인 문제)
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS;
const { fr, frH, F, svg, txt, line } = A;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };

/* ---------- 직접 해 보기 도구 ---------- */
// 1) 계산 순서 따라가기
const stepperLab = (title, pats, rng) => ({ title, init(el){
  el.innerHTML = `<div class="step-expr" id="sx"></div><div class="step-log" id="sl"></div>
    <div class="ctrl"><button class="tbtn" id="sStep" type="button">한 단계 계산 ▶</button><button class="tbtn" id="sNew" type="button">새 식 🔄</button></div>`;
  let t = [], log = [];
  const nextK = () => {
    let lo = 0, hi = t.length, open = -1;
    for (let i = 0; i < t.length; i++){ if (t[i] === '(') open = i; else if (t[i] === ')'){ lo = open + 1; hi = i; break; } }
    for (let i = lo; i < hi; i++) if (t[i] === '×' || t[i] === '÷') return i;
    for (let i = lo; i < hi; i++) if (t[i] === '+' || t[i] === '-') return i;
    return -1;
  };
  const draw = () => {
    const k = t.length > 1 ? nextK() : -1;
    el.querySelector('#sx').innerHTML = t.map((x, i) => (i === k - 1 ? '<span class="hl">' : '') + x + (i === k + 1 ? '</span>' : '')).join(' ');
    el.querySelector('#sl').innerHTML = log.length ? log.map(s => '= ' + s).join('<br>') : (t.length > 1 ? '노란 부분을 먼저 계산해요!' : '');
    el.querySelector('#sStep').disabled = t.length <= 1;
    if (t.length === 1) el.querySelector('#sl').innerHTML += '<br>🎉 계산 끝!';
  };
  const step = () => {
    const k = nextK(); if (k < 0) return;
    const a = +t[k - 1], b = +t[k + 1], v = t[k] === '+' ? a + b : t[k] === '-' ? a - b : t[k] === '×' ? a * b : a / b;
    t.splice(k - 1, 3, String(v));
    for (let i = 0; i + 2 < t.length; i++) if (t[i] === '(' && t[i + 2] === ')'){ t.splice(i + 2, 1); t.splice(i, 1); i = -1; }
    log.push(t.join(' ')); log = log.slice(-1 * 6); draw();
  };
  const fresh = () => { const e = A.makeExpr(A.pick(pats), rng, (v, x) => v > 0 && v <= 200 && new Set(Object.values(x)).size === Object.keys(x).length); t = e.s.match(/\d+|[+\-×÷()]/g); log = []; draw(); };
  el.querySelector('#sStep').addEventListener('click', step);
  el.querySelector('#sNew').addEventListener('click', fresh);
  fresh();
} });
// 2) 점 배열로 약수 찾기
const dotsLab = { title: '점을 직사각형 모양으로 늘어놓아 약수 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>점의 수</label><input type="range" min="2" max="36" value="12" id="dn"><span class="v" id="dv">12</span></div><div class="figc" id="dfig"></div><div class="out" id="dout"></div>`;
  const draw = () => {
    const n = +el.querySelector('#dn').value; el.querySelector('#dv').textContent = n;
    const pairs = A.divisors(n).filter(d => d * d <= n).map(d => [d, n / d]);
    let x = 10, s = '', H = 0;
    pairs.forEach(([r, c]) => { const sz = 9, w = c * sz, h = r * sz;
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) s += `<circle cx="${x + j * sz + 4}" cy="${30 + i * sz + 4}" r="3.3" fill="#4CB963"/>`;
      s += A.txt(x + w / 2, 18, `${r} × ${c}`, { size: 13, bold: true }); x += w + 22; H = Math.max(H, h); });
    el.querySelector('#dfig').innerHTML = A.svg(Math.max(x, 120), H + 44, s);
    el.querySelector('#dout').innerHTML = `${n}의 약수: <b>${A.divisors(n).join(', ')}</b> (${A.divisors(n).length}개)`;
  };
  el.querySelector('#dn').addEventListener('input', draw); draw();
} };
// 3) 수 배열판으로 배수·공배수 찾기
const boardLab = two => ({ title: two ? '두 수의 공배수 찾기' : '배수를 수 배열판에 색칠하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>${two ? '가' : '수'}</label><input type="range" min="2" max="12" value="${two ? 4 : 3}" id="ba"><span class="v" id="bav"></span>
    ${two ? `<label>나</label><input type="range" min="2" max="12" value="6" id="bb"><span class="v" id="bbv"></span>` : ''}</div>
    <div class="board" id="bd"></div>${two ? '<div class="legend"><span><i style="background:#BFE3FF"></i>가의 배수</span><span><i style="background:#FFD7A8"></i>나의 배수</span><span><i style="background:#9BE0A6"></i>공배수</span></div>' : ''}<div class="out" id="bo"></div>`;
  const draw = () => {
    const a = +el.querySelector('#ba').value, b = two ? +el.querySelector('#bb').value : 0;
    el.querySelector('#bav').textContent = a; if (two) el.querySelector('#bbv').textContent = b;
    const L2 = two ? A.lcm(a, b) : 0;
    el.querySelector('#bd').innerHTML = A.range(1, 60).map(n => { const ia = n % a === 0, ib = two && n % b === 0; return `<span class="${ia && ib ? 'ab' : ia ? 'a' : ib ? 'b' : ''}${two && n === L2 ? ' first' : ''}">${n}</span>`; }).join('');
    el.querySelector('#bo').innerHTML = two ? `${a}와(과) ${b}의 공배수: <b>${A.range(1, 60).filter(n => n % L2 === 0).join(', ') || '60보다 커요'}</b> … → 최소공배수 <b>${L2}</b>` : `${a}의 배수: <b>${A.range(1, 60).filter(n => n % a === 0).join(', ')}</b> …`;
  };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
// 4) 두 수의 약수로 공약수 찾기
const gcdLab = { title: '두 수의 공약수와 최대공약수 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가</label><input type="range" min="4" max="60" value="18" id="ga"><span class="v" id="gav"></span><label>나</label><input type="range" min="4" max="60" value="24" id="gb"><span class="v" id="gbv"></span></div><div class="out" id="go"></div>`;
  const draw = () => {
    const a = +el.querySelector('#ga').value, b = +el.querySelector('#gb').value; el.querySelector('#gav').textContent = a; el.querySelector('#gbv').textContent = b;
    const da = A.divisors(a), db = A.divisors(b), G = A.gcd(a, b), mk = (arr, other) => arr.map(d => other.includes(d) ? `<b style="color:#2F8A47;background:#E4F5D6;border-radius:6px;padding:0 4px">${d}</b>` : d).join(', ');
    el.querySelector('#go').innerHTML = `${a}의 약수: ${mk(da, db)}<br>${b}의 약수: ${mk(db, da)}<br>공약수: <b>${A.divisors(G).join(', ')}</b> → 최대공약수 <b>${G}</b>`;
  };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
// 5) 대응 관계 관찰
const CORR = [{ e:'🦆', a:'오리 수', b:'다리 수', k:2 }, { e:'🪑', a:'의자 수', b:'의자 다리 수', k:4 }, { e:'🌸', a:'꽃 수', b:'꽃잎 수', k:5 }, { e:'🐙', a:'문어 수', b:'문어 다리 수', k:8 }];
const corrLab = { title: '수가 늘어날 때 함께 변하는 양 살펴보기', init(el){
  el.innerHTML = `<div class="ctrl">${CORR.map((c, i) => `<button class="tbtn" type="button" data-c="${i}" aria-pressed="${i === 0}">${c.e} ${c.a.replace(' 수', '')}</button>`).join('')}</div>
    <div class="ctrl"><label>수</label><input type="range" min="1" max="8" value="3" id="cn"><span class="v" id="cv"></span></div><div class="emojis" id="ce"></div><div id="ct"></div><div class="out" id="co"></div>`;
  let ci = 0;
  const draw = () => { const c = CORR[ci], n = +el.querySelector('#cn').value; el.querySelector('#cv').textContent = n;
    el.querySelector('#ce').textContent = c.e.repeat(n);
    el.querySelector('#ct').innerHTML = A.tableH([[c.a, ...A.range(1, n)], [c.b, ...A.range(1, n).map(x => x * c.k)]]);
    el.querySelector('#co').innerHTML = `${c.a}가 1씩 늘면 ${c.b}는 <b>${c.k}</b>씩 늘어요 → <b>○ × ${c.k} = △</b> (○: ${c.a}, △: ${c.b})`; };
  el.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { ci = +b.dataset.c; el.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
  el.querySelector('#cn').addEventListener('input', draw); draw();
} };
// 6) 통나무 자르기
const cutLab = { title: '통나무를 자르는 횟수와 도막 수', init(el){
  el.innerHTML = `<div class="ctrl"><label>자른 횟수</label><input type="range" min="0" max="9" value="3" id="kn"><span class="v" id="kv"></span></div><div class="figc" id="kf"></div><div class="out" id="ko"></div>`;
  const draw = () => { const k = +el.querySelector('#kn').value, W = 460, pieces = k + 1, gap = 6, pw = (W - gap * k) / pieces; el.querySelector('#kv').textContent = k;
    let s = ''; for (let i = 0; i < pieces; i++) s += `<rect x="${10 + i * (pw + gap)}" y="20" width="${pw}" height="40" rx="8" fill="#C8955A" stroke="#7A5230" stroke-width="2"/>`;
    for (let i = 1; i <= k; i++) s += A.txt(10 + i * (pw + gap) - gap / 2, 76, '✂', { size: 14 });
    el.querySelector('#kf').innerHTML = A.svg(480, 90, s);
    el.querySelector('#ko').innerHTML = `자른 횟수 <b>${k}</b>번 → 도막 <b>${pieces}</b>개 &nbsp; (도막 수) = (자른 횟수) + 1`; };
  el.querySelector('#kn').addEventListener('input', draw); draw();
} };
// 7) 분수 막대
const barSVG = (rows, W = 440) => {   // rows: [{n, d, label, color}] (n이 d보다 크면 여러 줄)
  let s = '', y = 6;
  rows.forEach(r => { const wholes = Math.max(1, Math.ceil(r.n / r.d));
    for (let w = 0; w < wholes; w++){ const pw = W / r.d;
      for (let i = 0; i < r.d; i++){ const filled = w * r.d + i < r.n, two = r.split !== undefined && w * r.d + i >= r.split && filled;
        s += `<rect x="${70 + i * pw}" y="${y}" width="${pw}" height="30" fill="${filled ? (two ? r.color2 : r.color) : '#fff'}" stroke="#22314A" stroke-width="1.6"/>`; }
      if (w === 0) s += A.txt(34, y + 15, r.label, { size: 15, bold: true });
      y += 36; }
    y += 6; });
  return A.svg(W + 80, y, s);
};
const fracEqLab = { title: '분모와 분자에 같은 수를 곱해 보기', init(el){
  const base = [[1, 2], [2, 3], [3, 4], [2, 5], [5, 6]];
  el.innerHTML = `<div class="ctrl">${base.map((f, i) => `<button class="tbtn" type="button" data-b="${i}" aria-pressed="${i === 1}">${fr(f[0], f[1])}</button>`).join('')}</div>
    <div class="ctrl"><label>곱하는 수</label><input type="range" min="1" max="5" value="2" id="fk"><span class="v" id="fkv"></span></div><div class="figc" id="ff"></div><div class="out" id="fo"></div>`;
  let bi = 1;
  const draw = () => { const [n, d] = base[bi], k = +el.querySelector('#fk').value; el.querySelector('#fkv').textContent = k;
    el.querySelector('#ff').innerHTML = barSVG([{ n, d, label: `${n}/${d}`, color: '#8FD19E' }, { n: n * k, d: d * k, label: `${n * k}/${d * k}`, color: '#FFC56B' }]);
    el.querySelector('#fo').innerHTML = `${fr(n, d)} = ${fr(`${n} × ${k}`, `${d} × ${k}`)} = ${fr(n * k, d * k)} → 색칠한 길이가 똑같아요!`; };
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => { bi = +b.dataset.b; el.querySelectorAll('[data-b]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
  el.querySelector('#fk').addEventListener('input', draw); draw();
} };
const PAIRS = [[[1, 2], [1, 3]], [[2, 3], [3, 4]], [[3, 4], [5, 6]], [[2, 5], [1, 4]], [[5, 6], [4, 9]], [[3, 8], [5, 12]]];
const commonLab = (cmp) => ({ title: cmp ? '통분하여 크기 비교하기' : '두 분수를 통분해 보기', init(el){
  el.innerHTML = `<div class="ctrl">${PAIRS.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 1}">${fr(...p[0])}, ${fr(...p[1])}</button>`).join('')}</div>
    <div class="ctrl"><button class="tbtn" id="cm" type="button" aria-pressed="false">통분하기 🔀</button></div><div class="figc" id="cf"></div><div class="out" id="cot"></div>`;
  let pi = 1, on = false;
  const draw = () => { const [[a, b], [c, d]] = PAIRS[pi], Lm = A.lcm(b, d);
    const r = on ? [{ n: a * Lm / b, d: Lm, label: `${a * Lm / b}/${Lm}`, color: '#8FD19E' }, { n: c * Lm / d, d: Lm, label: `${c * Lm / d}/${Lm}`, color: '#FFC56B' }]
                 : [{ n: a, d: b, label: `${a}/${b}`, color: '#8FD19E' }, { n: c, d, label: `${c}/${d}`, color: '#FFC56B' }];
    el.querySelector('#cf').innerHTML = barSVG(r);
    const x = F(a, b), y = F(c, d), s = x.cmp(y) > 0 ? '&gt;' : x.cmp(y) < 0 ? '&lt;' : '=';
    el.querySelector('#cot').innerHTML = on ? `두 분모 ${b}, ${d}의 최소공배수 <b>${Lm}</b>을(를) 공통분모로: (${fr(a, b)}, ${fr(c, d)}) → (${fr(a * Lm / b, Lm)}, ${fr(c * Lm / d, Lm)})${cmp ? `<br>분자를 비교하면 ${a * Lm / b} ${s} ${c * Lm / d} → <b>${fr(a, b)} ${s} ${fr(c, d)}</b>` : ''}` : '분모가 달라서 한 칸의 크기가 달라요. "통분하기"를 눌러 보세요!';
    el.querySelector('#cm').setAttribute('aria-pressed', on); };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; on = false; el.querySelectorAll('[data-p]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
  el.querySelector('#cm').addEventListener('click', () => { on = !on; draw(); }); draw();
} });
const addLab = (sub) => ({ title: sub ? '막대로 분수의 뺄셈 보기' : '막대로 분수의 덧셈 보기', init(el){
  const P = sub ? [[[3, 4], [1, 3]], [[5, 6], [1, 4]], [[2, 3], [1, 2]], [[7, 10], [2, 5]]] : [[[1, 2], [1, 3]], [[1, 4], [1, 6]], [[2, 3], [3, 4]], [[3, 5], [1, 2]]];
  el.innerHTML = `<div class="ctrl">${P.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${i === 0}">${fr(...p[0])} ${sub ? '-' : '+'} ${fr(...p[1])}</button>`).join('')}</div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  let pi = 0;
  const draw = () => { const [[a, b], [c, d]] = P[pi], Lm = A.lcm(b, d), x = a * Lm / b, y = c * Lm / d, r = sub ? x - y : x + y, res = F(r, Lm);
    el.querySelector('#af').innerHTML = barSVG(sub ? [{ n: x, d: Lm, label: `${x}/${Lm}`, color: '#8FD19E' }, { n: y, d: Lm, label: `${y}/${Lm}`, color: '#FF9FA8' }, { n: r, d: Lm, label: '차', color: '#FFC56B' }]
      : [{ n: x, d: Lm, label: `${x}/${Lm}`, color: '#8FD19E' }, { n: y, d: Lm, label: `${y}/${Lm}`, color: '#FFC56B' }, { n: r, d: Lm, label: '합', color: '#8FD19E', split: x, color2: '#FFC56B' }]);
    el.querySelector('#ao').innerHTML = `${fr(a, b)} ${sub ? '-' : '+'} ${fr(c, d)} = ${fr(x, Lm)} ${sub ? '-' : '+'} ${fr(y, Lm)} = ${fr(r, Lm)}${res.d !== Lm || r > Lm ? ` = ${frH(res)}` : ''}`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { pi = +b.dataset.p; el.querySelectorAll('[data-p]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); })); draw();
} });
// 8) 넓이 실험
const U = 26, poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => `${(p[0] * U + 20).toFixed(1)},${(p[1] * U + 20).toFixed(1)}`).join(' ')}" fill="${fill}" stroke="#22314A" stroke-width="2.2" ${extra}/>`;
const P = (x, y) => [x * U + 20, y * U + 20];
const gridLab = { title: '가로, 세로를 바꾸며 직사각형의 넓이 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="1" max="12" value="5" id="gw"><span class="v" id="gwv"></span><label>세로</label><input type="range" min="1" max="7" value="3" id="gh"><span class="v" id="ghv"></span></div><div class="figc" id="gf"></div><div class="out" id="go"></div>`;
  const draw = () => { const w = +el.querySelector('#gw').value, h = +el.querySelector('#gh').value; el.querySelector('#gwv').textContent = w; el.querySelector('#ghv').textContent = h;
    let s = ''; for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) s += `<rect x="${20 + j * U}" y="${20 + i * U}" width="${U}" height="${U}" fill="#DFF3E3" stroke="#7CCB85"/>`;
    s += `<rect x="20" y="20" width="${w * U}" height="${h * U}" fill="none" stroke="#22314A" stroke-width="2.4"/>` + A.txt(20 + w * U / 2, 12 + h * U + 24, `${w} cm`, { size: 14, fill: '#2a6fae', bold: true }) + A.txt(20 + w * U + 24, 20 + h * U / 2, `${h} cm`, { size: 14, fill: '#2a6fae', bold: true });
    el.querySelector('#gf').innerHTML = A.svg(w * U + 80, h * U + 48, s);
    el.querySelector('#go').innerHTML = `1 cm²가 <b>${w} × ${h} = ${w * h}</b>개 → 넓이 <b>${w * h} cm²</b> &nbsp;|&nbsp; 둘레 (${w} + ${h}) × 2 = <b>${2 * (w + h)} cm</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const paraLab = { title: '평행사변형을 잘라서 직사각형으로 바꾸기', init(el){
  const b = 8, h = 5, s = 3;
  el.innerHTML = `<div class="ctrl"><label>잘라서 옮기기</label><input type="range" min="0" max="100" value="0" id="pt"></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  const draw = () => { const t = +el.querySelector('#pt').value / 100, dx = t * b;
    let g = poly([[s, 0], [s + b, 0], [b, h], [s, h]], '#DFF3E3') + poly([[s + dx, 0], [s + dx, h], [dx, h]], '#FFD7A8');
    const c1 = P(s, 0), c2 = P(s, h); g += line(c1[0], c1[1], c2[0], c2[1], { dash: '6 5', stroke: '#E5546B' });
    g += A.txt(P(b / 2, h)[0], P(0, h)[1] + 18, `밑변 ${b} cm`, { size: 14, fill: '#2a6fae', bold: true }) + A.txt(P(s, 0)[0] + 8, P(0, h / 2)[1], `높이 ${h} cm`, { size: 14, fill: '#E5546B', bold: true, anchor: 'start' });
    el.querySelector('#pf').innerHTML = A.svg((s + b) * U + 60, h * U + 50, g);
    el.querySelector('#po').innerHTML = t < 1 ? '슬라이더를 끝까지 밀어 왼쪽 삼각형을 오른쪽으로 옮겨 보세요.' : `직사각형이 되었어요! 넓이 = (밑변) × (높이) = ${b} × ${h} = <b>${b * h} cm²</b>`; };
  el.querySelector('#pt').addEventListener('input', draw); draw();
} };
const copyLab = (kind) => ({ title: kind === 'tri' ? '똑같은 삼각형 2개로 평행사변형 만들기' : kind === 'trap' ? '똑같은 사다리꼴 2개로 평행사변형 만들기' : '마름모를 둘러싼 직사각형과 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" id="cp" type="button" aria-pressed="false">${kind === 'rh' ? '직사각형 그리기' : '똑같은 도형 하나 더 붙이기'} ➕</button></div><div class="figc" id="cpf"></div><div class="out" id="cpo"></div>`;
  let on = false;
  const draw = () => { let g = '', W = 0, H = 0, msg = '';
    if (kind === 'tri'){ g = poly([[3, 0], [8, 5], [0, 5]], '#DFF3E3'); if (on) g += poly([[3, 0], [11, 0], [8, 5]], '#FFD7A8', 'stroke-dasharray="6 4"');
      const a = P(3, 0), f = P(3, 5); g += line(a[0], a[1], f[0], f[1], { dash: '5 4', stroke: '#E5546B' }); W = 11; H = 5;
      msg = on ? '평행사변형 넓이는 8 × 5 = 40 cm², 삼각형은 그 절반 → 8 × 5 ÷ 2 = <b>20 cm²</b>' : '밑변 8 cm, 높이 5 cm인 삼각형이에요. 같은 삼각형을 하나 더 붙여 보세요.'; }
    else if (kind === 'trap'){ g = poly([[2, 0], [6, 0], [9, 4], [0, 4]], '#DFF3E3'); if (on) g += poly([[6, 0], [15, 0], [13, 4], [9, 4]], '#FFD7A8', 'stroke-dasharray="6 4"'); W = 15; H = 4;
      msg = on ? '밑변이 (윗변 4 + 아랫변 9) = 13 cm인 평행사변형! 13 × 4 ÷ 2 = <b>26 cm²</b>' : '윗변 4 cm, 아랫변 9 cm, 높이 4 cm인 사다리꼴이에요.'; }
    else { if (on) g = `<rect x="${P(0, 0)[0]}" y="${P(0, 0)[1]}" width="${8 * U}" height="${6 * U}" fill="#FFF2DC" stroke="#FF9F43" stroke-width="2" stroke-dasharray="6 4"/>`;
      g += poly([[4, 0], [8, 3], [4, 6], [0, 3]], '#DFF3E3'); const a = P(4, 0), b = P(4, 6), c = P(0, 3), d = P(8, 3); g += line(a[0], a[1], b[0], b[1], { dash: '5 4', stroke: '#E5546B' }) + line(c[0], c[1], d[0], d[1], { dash: '5 4', stroke: '#E5546B' }); W = 8; H = 6;
      msg = on ? '직사각형(8 × 6 = 48 cm²)의 딱 절반이 마름모예요 → 8 × 6 ÷ 2 = <b>24 cm²</b>' : '두 대각선이 8 cm, 6 cm인 마름모예요.'; }
    el.querySelector('#cpf').innerHTML = A.svg(W * U + 50, H * U + 44, g); el.querySelector('#cpo').innerHTML = msg; el.querySelector('#cp').setAttribute('aria-pressed', on); };
  el.querySelector('#cp').addEventListener('click', () => { on = !on; draw(); }); draw();
} });

/* ═════════════ 1. 자연수의 혼합 계산 ═════════════ */
add({ key:'5-1-1', title:'자연수의 혼합 계산', intro:'덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산하는 순서를 알아보고, 생활 속 문제를 하나의 식으로 나타내어 해결해요.',
  prev:'[3-1] 덧셈과 뺄셈 · [3-2] 곱셈, 나눗셈 · [4-1] 곱셈과 나눗셈', lessons:[
  { title:'덧셈과 뺄셈이 섞인 식', std:['6수01-01'], key:'덧셈과 뺄셈이 섞여 있는 식은 <b>앞에서부터 차례대로</b> 계산해요.',
    body:`<p>버스에 25명이 타고 있었어요. 정류장에서 8명이 내리고 6명이 탔어요. 지금 버스에 탄 사람은?</p>${E('25 - 8 + 6 = 17 + 6 = 23')}
      <div class="warn">⚠️ 뒤의 8 + 6을 먼저 계산하면 25 - 14 = 11이 되어 틀려요!</div>`,
    lab: stepperLab('앞에서부터 차례대로 계산하기', ['a-b+c', 'a+b-c', 'a-b-c+d', 'a+b-c+d'], { a:[30,90], b:[5,30], c:[5,30], d:[3,20] }),
    ex:`<ol><li>${'45 - 17 + 9'} → 앞에서부터: 45 - 17 = 28</li><li>28 + 9 = <b>37</b></li></ol>`, quiz:[['mix-pm', 1]] },
  { title:'곱셈과 나눗셈이 섞인 식', std:['6수01-01'], key:'곱셈과 나눗셈이 섞여 있는 식도 <b>앞에서부터 차례대로</b> 계산해요.',
    body:`<p>사탕 48개를 6명이 똑같이 나누었어요. 한 명이 받은 사탕의 2배는?</p>${E('48 ÷ 6 × 2 = 8 × 2 = 16')}<div class="warn">⚠️ 6 × 2를 먼저 하면 48 ÷ 12 = 4가 되어 틀려요!</div>`,
    lab: stepperLab('곱셈·나눗셈 순서대로 계산하기', ['a÷b×c', 'a×b÷c', 'a÷b×c÷d'], { a:[12,96], b:[2,9], c:[2,9], d:[2,6] }),
    ex:`<ol><li>72 ÷ 8 × 3 → 72 ÷ 8 = 9</li><li>9 × 3 = <b>27</b></li></ol>`, quiz:[['mix-md', 1]] },
  { title:'( )가 있는 식', std:['6수01-01'], key:'( )가 있는 식은 <b>( ) 안을 가장 먼저</b> 계산해요.',
    body:`<p>( )는 "이 부분을 먼저 계산하세요!"라는 약속이에요.</p>${E('35 - (12 + 8) = 35 - 20 = 15')}${E('48 ÷ (6 × 2) = 48 ÷ 12 = 4')}
      <div class="note">💡 같은 수, 같은 기호라도 ( )의 위치에 따라 결과가 달라져요. 35 - 12 + 8 = 31이지만 35 - (12 + 8) = 15예요.</div>`,
    lab: stepperLab('( ) 안부터 계산하기', ['a-(b+c)', 'a÷(b×c)', '(a+b)×c', 'a-(b-c)+d'], { a:[20,96], b:[2,20], c:[2,12], d:[2,20] }),
    ex:`<ol><li>60 - (15 + 25) → ( ) 안: 15 + 25 = 40</li><li>60 - 40 = <b>20</b></li></ol>`, quiz:[['mix-pm', 2], ['mix-md', 2], ['mix-cmp', 2]] },
  { title:'덧셈, 뺄셈, 곱셈(나눗셈)이 섞인 식', std:['6수01-01'], key:'<b>곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저</b> 계산해요.',
    body:`<p>공책 1권은 700원, 연필 1자루는 300원이에요. 공책 1권과 연필 4자루의 값은?</p>${E('700 + 300 × 4 = 700 + 1200 = 1900')}
      <div class="warn">⚠️ 앞에서부터 계산하면 (700 + 300) × 4 = 4000이 되어 틀려요. 연필만 4자루니까 곱셈을 먼저 해야 해요.</div>`,
    lab: stepperLab('곱셈·나눗셈 먼저 계산하기', ['a+b×c-d', 'a-b÷c+d', 'a×b-c+d', 'a+b÷c-d'], { a:[10,60], b:[12,48], c:[2,9], d:[2,20] }),
    ex:`<ol><li>50 - 36 ÷ 4 + 7 → 나눗셈 먼저: 36 ÷ 4 = 9</li><li>50 - 9 = 41</li><li>41 + 7 = <b>48</b></li></ol>`, quiz:[['mix-pmx', 2], ['mix-pmd', 2], ['mix-first', 1]] },
  { title:'+, -, ×, ÷와 ( )가 모두 섞인 식', std:['6수01-01'], key:'계산 순서: <b>① ( ) 안 → ② 곱셈·나눗셈 → ③ 덧셈·뺄셈</b>. 순서가 같으면 앞에서부터!',
    body:`<p>복잡해 보여도 순서만 지키면 쉬워요. 먼저 식 위에 ①②③… 계산 순서를 표시하고 차례대로 계산해 보세요.</p>${E('32 - (4 + 2) × 3 ÷ 2')}
      <ul><li>① ( ) 안: 4 + 2 = 6</li><li>② 곱셈: 6 × 3 = 18</li><li>③ 나눗셈: 18 ÷ 2 = 9</li><li>④ 뺄셈: 32 - 9 = <b>23</b></li></ul>`,
    lab: stepperLab('계산 순서 따라가기', ['a×(b+c)-d÷e', '(a+b)÷c×d-e', 'a+(b-c)×d÷e', 'a×b-c÷d+e'], { a:[2,30], b:[2,12], c:[2,12], d:[2,48], e:[2,9] }),
    ex:`<ol><li>8 × (7 - 2) + 24 ÷ 6 → ( ) 안: 7 - 2 = 5</li><li>8 × 5 = 40, 24 ÷ 6 = 4</li><li>40 + 4 = <b>44</b></li></ol>`, quiz:[['mix-all', 3]] },
  { title:'생활 문제를 하나의 식으로 나타내기', std:['6수01-01'], key:'문제 상황을 <b>하나의 식</b>으로 쓸 때, 먼저 계산해야 하는 부분이 뒤에 있으면 <b>( )로 묶어요</b>.',
    body:`<p>민수는 5000원을 가지고 한 개에 800원인 빵 3개와 1200원짜리 우유를 샀어요. 남은 돈은?</p>${E('5000 - (800 × 3 + 1200) = 5000 - 3600 = 1400(원)')}
      <div class="note">💡 "사용한 돈 전체"를 먼저 구해야 하므로 ( )로 묶었어요. ( ) 없이 5000 - 800 × 3 + 1200이라고 쓰면 3800원이 되어 틀려요.</div>`,
    ex:`<p>"42와 16의 차를 2배 한 수와 88을 4로 나눈 몫의 합"</p><ol><li>하나의 식: (42 - 16) × 2 + 88 ÷ 4</li><li>= 26 × 2 + 22 = 52 + 22 = <b>74</b></li></ol>`, quiz:[['mix-word', 3], ['mix-sentence', 3]] }
]});

/* ═════════════ 2. 약수와 배수 ═════════════ */
add({ key:'5-1-2', title:'약수와 배수', intro:'약수와 배수의 뜻을 알고, 두 수의 공약수·최대공약수, 공배수·최소공배수를 구해 생활 속 문제를 해결해요.',
  prev:'[3-1] 나눗셈 · [3-2] 곱셈, 나눗셈 · 곱셈구구', lessons:[
  { title:'약수', std:['6수01-04'], key:'어떤 수를 <b>나누어떨어지게 하는 수</b>를 그 수의 <b>약수</b>라고 해요.',
    body:`<p>12를 나누어떨어지게 하는 수를 찾아보세요.</p>${E('12 ÷ 1 = 12　12 ÷ 2 = 6　12 ÷ 3 = 4　12 ÷ 4 = 3　12 ÷ 6 = 2　12 ÷ 12 = 1')}
      <p>→ 12의 약수: <b>1, 2, 3, 4, 6, 12</b> (12 ÷ 5, 12 ÷ 7 …은 나누어떨어지지 않아요)</p>
      <div class="note">💡 <b>1</b>은 모든 수의 약수이고, <b>자기 자신</b>도 약수예요. 곱해서 그 수가 되는 짝(1×12, 2×6, 3×4)을 찾으면 빠짐없이 찾을 수 있어요.</div>`,
    lab: dotsLab, ex:`<p>18의 약수 → 1×18, 2×9, 3×6 → <b>1, 2, 3, 6, 9, 18</b></p>`, quiz:[['div-all', 1], ['div-not', 1], ['div-count', 2]] },
  { title:'배수', std:['6수01-05'], key:'어떤 수를 <b>1배, 2배, 3배, …</b> 한 수를 그 수의 <b>배수</b>라고 해요.',
    body:`<p>4의 배수: 4×1 = 4, 4×2 = 8, 4×3 = 12, 4×4 = 16 … → <b>4, 8, 12, 16, 20, …</b></p>
      <div class="note">💡 배수는 끝없이 많아요. 가장 작은 배수는 자기 자신이에요.</div>`,
    lab: boardLab(false), ex:`<p>7의 배수를 작은 수부터 5개: <b>7, 14, 21, 28, 35</b></p>`, quiz:[['mul-kth', 1], ['mul-count', 3]] },
  { title:'약수와 배수의 관계', std:['6수01-04', '6수01-05'], key:'■ = ▲ × ● 이면 <b>■는 ▲와 ●의 배수</b>이고, <b>▲와 ●는 ■의 약수</b>예요.',
    body:`${E('12 = 3 × 4')}<ul><li>12는 3의 배수, 12는 4의 배수</li><li>3은 12의 약수, 4는 12의 약수</li></ul>
      <div class="note">💡 두 수 중 큰 수가 작은 수로 나누어떨어지면 두 수는 약수와 배수의 관계예요. 예) (6, 30) → 30 ÷ 6 = 5</div>`,
    ex:`<p>(8, 40), (6, 28) 중 약수와 배수의 관계인 것은? → 40 ÷ 8 = 5로 나누어떨어지므로 <b>(8, 40)</b></p>`, quiz:[['div-rel', 2]] },
  { title:'공약수와 최대공약수', std:['6수01-04'], key:'두 수의 공통인 약수를 <b>공약수</b>, 공약수 중 가장 큰 수를 <b>최대공약수</b>라고 해요.',
    body:`<p>18의 약수: 1, 2, 3, 6, 9, 18 / 24의 약수: 1, 2, 3, 4, 6, 8, 12, 24</p><p>→ 공약수: <b>1, 2, 3, 6</b> → 최대공약수: <b>6</b></p>
      <p><b>공약수로 나누어 구하기</b></p>${E('2 ) 18　24<br>3 )　9　12<br>　　 3　 4')}<p>더 나눌 수 없을 때까지 나눈 뒤 <b>왼쪽 수들을 곱해요</b>: 2 × 3 = 6</p>
      <div class="note">💡 두 수의 공약수는 최대공약수의 약수와 같아요. (6의 약수: 1, 2, 3, 6)</div>`,
    lab: gcdLab, ex:`<p>귤 24개와 사과 36개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려면? → 24와 36의 최대공약수 <b>12명</b></p>`, quiz:[['gcd', 2], ['gcd-common', 3], ['gcd-word', 4]] },
  { title:'공배수와 최소공배수', std:['6수01-05'], key:'두 수의 공통인 배수를 <b>공배수</b>, 공배수 중 가장 작은 수를 <b>최소공배수</b>라고 해요.',
    body:`<p>4의 배수: 4, 8, <b>12</b>, 16, 20, <b>24</b>, … / 6의 배수: 6, <b>12</b>, 18, <b>24</b>, …</p><p>→ 공배수: <b>12, 24, 36, …</b> → 최소공배수: <b>12</b></p>
      <p><b>공약수로 나누어 구하기</b></p>${E('2 ) 18　24<br>3 )　9　12<br>　　 3　 4')}<p>왼쪽 수들과 아래 수들을 <b>모두 곱해요</b>: 2 × 3 × 3 × 4 = 72</p>
      <div class="note">💡 두 수의 공배수는 최소공배수의 배수와 같아요. "가장 큰 공배수"는 없어요!</div>`,
    lab: boardLab(true), ex:`<p>버스가 6분, 8분마다 출발해요. 9시에 함께 출발했다면 다음에 함께 출발하는 때는? → 6과 8의 최소공배수 24분 후, <b>9시 24분</b></p>`, quiz:[['lcm', 2], ['lcm-cond', 3], ['lcm-word', 4]] }
]});

/* ═════════════ 3. 대응 관계 ═════════════ */
add({ key:'5-1-3', title:'대응 관계', intro:'한 양이 변할 때 다른 양이 그에 따라 변하는 대응 관계를 표로 정리하고, ○, △ 같은 기호를 사용해 식으로 나타내요.',
  prev:'[4-1] 규칙 찾기 · [4-2] 규칙과 식', lessons:[
  { title:'두 양 사이의 관계 알아보기', std:['6수02-01'], key:'한 양이 변할 때 다른 양이 <b>일정하게 따라 변하는 관계</b>를 <b>대응 관계</b>라고 해요.',
    body:`<p>오리가 1마리면 다리는 2개, 2마리면 4개, 3마리면 6개… 오리 수가 늘어나면 다리 수도 일정하게 늘어나요.</p>
      <div class="note">💡 오리의 나이와 다리 수처럼 함께 변하지 않는 두 양은 대응 관계가 아니에요.</div>`,
    lab: corrLab, ex:`<p>의자 수와 의자 다리 수 → "의자 다리 수는 의자 수의 <b>4배</b>예요."</p>`, quiz:[['cor-say', 1], ['cor-table', 1]] },
  { title:'표에서 규칙 찾기', std:['6수02-01'], key:'두 양을 <b>표로 정리</b>하면 대응 규칙을 찾기 쉬워요. 찾은 규칙이 <b>모든 칸</b>에서 맞는지 확인해요.',
    body:`${A.tableH([['사각형 수', 1, 2, 3, 4, 5], ['꼭짓점 수', 4, 8, 12, 16, 20]])}<p>규칙: 꼭짓점 수는 사각형 수의 <b>4배</b> → 사각형이 10개면 꼭짓점은 40개</p>
      <div class="warn">⚠️ 2 → 4만 보고 "2를 더한다"고 하면 안 돼요. 3 → 12에서는 맞지 않거든요.</div>`,
    ex:`<p>꼭짓점이 36개라면 사각형은? → 36 ÷ 4 = <b>9개</b> (거꾸로도 구할 수 있어요)</p>`, quiz:[['cor-table', 2], ['cor-rev', 2]] },
  { title:'대응 관계를 기호로 식에 나타내기', std:['6수02-01'], key:'두 양을 <b>○, △ 같은 기호</b>로 나타내면 대응 관계를 간단한 식으로 쓸 수 있어요.',
    body:`<p>사각형 수를 ○, 꼭짓점 수를 △라고 하면</p>${E('○ × 4 = △　또는　△ ÷ 4 = ○')}<p>두 식은 <b>같은 대응 관계</b>를 나타내요.</p>
      <p>형이 동생보다 3살 많을 때 (동생 나이 ○, 형 나이 △)</p>${E('○ + 3 = △　또는　△ - 3 = ○')}`,
    ex:`<p>한 상자에 6개씩 든 테니스공 — 상자 수 ○, 공 수 △ → <b>○ × 6 = △</b></p>`, quiz:[['cor-formula', 2], ['cor-wrong', 3]] },
  { title:'생활 속 대응 관계', std:['6수02-01'], key:'자르는 횟수와 도막 수처럼 <b>1만큼 차이 나는 관계</b>도 대응 관계예요. (도막 수) = (자른 횟수) + 1',
    body:`<p>통나무를 1번 자르면 2도막, 2번 자르면 3도막, 3번 자르면 4도막…</p>
      <div class="note">💡 곧은 길에 처음부터 끝까지 나무를 심을 때도 (나무 수) = (간격 수) + 1이에요.</div>`,
    lab: cutLab, ex:`<p>통나무를 8도막으로 자르려면? → 8 - 1 = <b>7번</b></p>`, quiz:[['cor-cut', 3], ['cor-life', 3]] },
  { title:'대응 관계로 예상하기', std:['6수02-01'], key:'대응 관계를 식으로 나타내면 <b>큰 수일 때도 직접 세지 않고</b> 구할 수 있어요.',
    body:`<p>성냥개비로 정삼각형을 한 줄로 이어 만들어요.</p>${A.tableH([['삼각형 수(○)', 1, 2, 3, 4], ['성냥개비 수(△)', 3, 5, 7, 9]])}
      <p>삼각형이 1개 늘 때마다 성냥개비는 2개씩 늘어요 → <b>○ × 2 + 1 = △</b></p><p>삼각형이 20개면? 20 × 2 + 1 = <b>41개</b></p>`,
    ex:`<p>넣은 수 3 → 나온 수 11, 넣은 수 5 → 나온 수 17 → 규칙 ○ × 3 + 2 = △ → 10을 넣으면 <b>32</b></p>`, quiz:[['cor-pattern', 4], ['cor-machine', 3]] }
]});

/* ═════════════ 4. 약분과 통분 ═════════════ */
add({ key:'5-1-4', title:'약분과 통분', intro:'크기가 같은 분수를 만드는 방법을 알고, 분수를 약분·통분하여 분모가 다른 분수와 소수의 크기를 비교해요.',
  prev:'[3-1] 분수와 소수 · [4-2] 분수의 덧셈과 뺄셈 · 5-1 약수와 배수', lessons:[
  { title:'크기가 같은 분수', std:['6수01-06'], key:'분모와 분자에 <b>0이 아닌 같은 수를 곱하거나 나누면</b> 크기가 같은 분수가 돼요.',
    body:`${E(`${fr(2, 3)} = ${fr('2 × 2', '3 × 2')} = ${fr(4, 6)} = ${fr(6, 9)}　　${fr(12, 16)} = ${fr('12 ÷ 4', '16 ÷ 4')} = ${fr(3, 4)}`)}
      <div class="warn">⚠️ 분모와 분자에 같은 수를 <b>더하거나 빼면</b> 크기가 달라져요. ${fr(1, 2)} → ${fr(2, 3)}(×)</div>`,
    lab: fracEqLab, ex:`<p>${fr(3, 5)} = ${fr('□', 20)} → 분모에 4를 곱했으니 분자에도 4를 곱해요 → □ = <b>12</b></p>`, quiz:[['eq-frac', 1]] },
  { title:'약분과 기약분수', std:['6수01-06'], key:'분모와 분자를 <b>공약수로 나누어</b> 간단하게 하는 것이 <b>약분</b>, 더 이상 약분할 수 없는 분수가 <b>기약분수</b>예요.',
    body:`<p>${fr(18, 24)}을 약분하면 (18과 24의 공약수: 1, 2, 3, 6)</p>${E(`${fr(18, 24)} = ${fr(9, 12)} (÷2)　 = ${fr(6, 8)} (÷3)　 = ${fr(3, 4)} (÷6)`)}
      <div class="note">💡 <b>최대공약수로 나누면</b> 한 번에 기약분수가 돼요: 18과 24의 최대공약수 6 → ${fr(3, 4)}</div>`,
    ex:`<p>${fr(20, 28)}을 기약분수로 → 최대공약수 4로 나누면 <b>${fr(5, 7)}</b></p>`, quiz:[['reduce', 1], ['red-cannot', 2], ['irred-pick', 2]] },
  { title:'통분', std:['6수01-06'], key:'분수의 <b>분모를 같게 하는 것</b>을 <b>통분</b>, 같게 한 분모를 <b>공통분모</b>라고 해요.',
    body:`<p>${fr(5, 6)}와 ${fr(3, 4)}를 통분하는 두 가지 방법</p>
      <ul><li><b>두 분모의 곱</b>(24)을 공통분모로: (${fr(20, 24)}, ${fr(18, 24)})</li><li><b>두 분모의 최소공배수</b>(12)를 공통분모로: (${fr(10, 12)}, ${fr(9, 12)}) ← 수가 작아 계산이 편해요</li></ul>`,
    lab: commonLab(false), ex:`<p>(${fr(3, 8)}, ${fr(5, 12)}) → 8과 12의 최소공배수 24 → (<b>${fr(9, 24)}</b>, <b>${fr(10, 24)}</b>)</p>`, quiz:[['common-den', 2], ['common-den', 3]] },
  { title:'분모가 다른 분수의 크기 비교', std:['6수01-07'], key:'분모가 다른 분수는 <b>통분하여 분모를 같게 한 다음 분자를 비교</b>해요.',
    body:`${E(`${fr(3, 4)} ○ ${fr(5, 6)} → ${fr(9, 12)} &lt; ${fr(10, 12)} → ${fr(3, 4)} &lt; ${fr(5, 6)}`)}<p>세 분수는 두 개씩 차례로 비교하거나, 세 분수를 한꺼번에 통분해서 비교해요.</p>`,
    lab: commonLab(true), ex:`<p>${fr(2, 5)}와 ${fr(3, 8)} → (${fr(16, 40)}, ${fr(15, 40)}) → <b>${fr(2, 5)}가 더 커요</b></p>`, quiz:[['cmp2', 2], ['cmp3', 3]] },
  { title:'분수와 소수의 크기 비교', std:['6수01-12'], key:'<b>분수를 소수로</b>(분모를 10, 100, 1000으로) 또는 <b>소수를 분수로</b> 바꾸어 같은 형태로 비교해요.',
    body:`${E(`${fr(3, 5)} = ${fr(6, 10)} = 0.6　　${fr(3, 4)} = ${fr(75, 100)} = 0.75`)}<p>${fr(3, 5)}와 0.65 → 0.6 &lt; 0.65 이므로 <b>${fr(3, 5)} &lt; 0.65</b></p>
      <div class="note">💡 0.7 = ${fr(7, 10)}, 0.35 = ${fr(35, 100)}처럼 소수를 분수로 바꿔 비교해도 돼요.</div>`,
    ex:`<p>물을 지아는 ${fr(4, 5)} L, 민수는 0.75 L 마셨어요 → ${fr(4, 5)} = 0.8 &gt; 0.75 → <b>지아</b>가 더 많이 마셨어요.</p>`, quiz:[['frac-dec', 2], ['frac-dec-cmp', 3]] }
]});

/* ═════════════ 5. 분수의 덧셈과 뺄셈 ═════════════ */
add({ key:'5-1-5', title:'분수의 덧셈과 뺄셈', intro:'분모가 다른 진분수와 대분수의 덧셈과 뺄셈을 통분을 이용하여 계산하고, 생활 속 문제를 해결해요.',
  prev:'[4-2] 분모가 같은 분수의 덧셈과 뺄셈 · 5-1 약분과 통분', lessons:[
  { title:'분모가 다른 진분수의 덧셈', std:['6수01-08'], key:'분모가 다른 분수는 <b>통분한 다음 분자끼리 더해요</b>. 결과는 약분하고, 가분수면 대분수로 나타내요.',
    body:`${E(`${fr(1, 2)} + ${fr(1, 3)} = ${fr(3, 6)} + ${fr(2, 6)} = ${fr(5, 6)}`)}${E(`${fr(2, 3)} + ${fr(3, 4)} = ${fr(8, 12)} + ${fr(9, 12)} = ${fr(17, 12)} = ${fr(5, 12, 1)}`)}
      <div class="warn">⚠️ 분모끼리, 분자끼리 더하면 안 돼요! ${fr(1, 2)} + ${fr(1, 3)} ≠ ${fr(2, 5)}</div>`,
    lab: addLab(false), ex:`<p>${fr(3, 10)} + ${fr(7, 15)} → 공통분모 30 → ${fr(9, 30)} + ${fr(14, 30)} = <b>${fr(23, 30)}</b></p>`, quiz:[['add-pp', 1], ['add-pp', 2]] },
  { title:'분모가 다른 진분수의 뺄셈', std:['6수01-08'], key:'<b>통분한 다음 분자끼리 빼요</b>. 결과를 약분할 수 있으면 약분해요.',
    body:`${E(`${fr(5, 6)} - ${fr(1, 4)} = ${fr(10, 12)} - ${fr(3, 12)} = ${fr(7, 12)}`)}${E(`${fr(2, 3)} - ${fr(4, 15)} = ${fr(10, 15)} - ${fr(4, 15)} = ${fr(6, 15)} = ${fr(2, 5)}`)}`,
    lab: addLab(true), ex:`<p>${fr(7, 8)} - ${fr(1, 6)} → 공통분모 24 → ${fr(21, 24)} - ${fr(4, 24)} = <b>${fr(17, 24)}</b></p>`, quiz:[['sub-pp', 1], ['sub-pp', 2]] },
  { title:'대분수의 덧셈', std:['6수01-08'], key:'방법 ① <b>자연수끼리, 분수끼리</b> 더해요. 방법 ② <b>가분수로 바꾸어</b> 더해요.',
    body:`<p>${fr(3, 4, 1)} + ${fr(1, 6, 2)}</p><ul><li>방법 ①: 자연수 1 + 2 = 3, 분수 ${fr(9, 12)} + ${fr(2, 12)} = ${fr(11, 12)} → <b>${fr(11, 12, 3)}</b></li>
      <li>방법 ②: ${fr(7, 4)} + ${fr(13, 6)} = ${fr(21, 12)} + ${fr(26, 12)} = ${fr(47, 12)} = <b>${fr(11, 12, 3)}</b></li></ul>
      <div class="note">💡 분수 부분의 합이 1보다 크면 자연수 부분으로 1을 올려요. ${fr(5, 4, 3)} = ${fr(1, 4, 4)}</div>`,
    ex:`<p>${fr(2, 3, 2)} + ${fr(1, 2, 1)} → 자연수 3, 분수 ${fr(4, 6)} + ${fr(3, 6)} = ${fr(7, 6)} = ${fr(1, 6, 1)} → <b>${fr(1, 6, 4)}</b></p>`, quiz:[['add-mm', 2], ['add-mm', 3]] },
  { title:'대분수의 뺄셈', std:['6수01-08'], key:'분수끼리 뺄 수 없으면 <b>자연수에서 1을 받아내려</b> 분수로 바꾼 다음 빼요.',
    body:`<p>${fr(1, 4, 3)} - ${fr(2, 3, 1)} → 통분하면 ${fr(3, 12, 3)} - ${fr(8, 12, 1)}</p><p>${fr(3, 12)}에서 ${fr(8, 12)}를 뺄 수 없으니 3에서 1을 받아내려요: ${fr(3, 12, 3)} = ${fr(15, 12, 2)}</p>
      ${E(`${fr(15, 12, 2)} - ${fr(8, 12, 1)} = ${fr(7, 12, 1)}`)}<div class="note">💡 가분수로 바꾸어 빼도 돼요: ${fr(39, 12)} - ${fr(20, 12)} = ${fr(19, 12)} = ${fr(7, 12, 1)}</div>`,
    ex:`<p>${fr(1, 5, 4)} - ${fr(1, 2, 2)} → ${fr(2, 10, 4)} - ${fr(5, 10, 2)} → ${fr(12, 10, 3)} - ${fr(5, 10, 2)} = <b>${fr(7, 10, 1)}</b></p>`, quiz:[['sub-mm', 3], ['sub-borrow', 3]] },
  { title:'생활 속 분수의 덧셈과 뺄셈', std:['6수01-08'], key:'"모두, 합쳐서"는 <b>덧셈</b>, "남은, 더 많이, 차이"는 <b>뺄셈</b>으로 식을 세워요.',
    body:`<p>밀가루 ${fr(3, 4, 2)} kg 중에서 ${fr(1, 3, 1)} kg을 사용했어요. 남은 밀가루는?</p>${E(`${fr(3, 4, 2)} - ${fr(1, 3, 1)} = ${fr(9, 12, 2)} - ${fr(4, 12, 1)} = ${fr(5, 12, 1)} (kg)`)}`,
    ex:`<p>□ + ${fr(2, 5)} = ${fr(9, 10)} → □ = ${fr(9, 10)} - ${fr(2, 5)} = ${fr(9, 10)} - ${fr(4, 10)} = ${fr(5, 10)} = <b>${fr(1, 2)}</b></p>`, quiz:[['word1', 3], ['missing', 4]] }
]});

/* ═════════════ 6. 다각형의 둘레와 넓이 ═════════════ */
add({ key:'5-1-6', title:'다각형의 둘레와 넓이', intro:'여러 가지 다각형의 둘레를 구하고, 넓이 단위를 알아본 다음 직사각형, 평행사변형, 삼각형, 사다리꼴, 마름모의 넓이를 구하는 방법을 탐구해요.',
  prev:'[3-1] 평면도형 · [4-2] 삼각형, 사각형, 다각형', lessons:[
  { title:'다각형의 둘레', std:['6수03-11'], key:'<b>둘레</b>는 도형을 한 바퀴 둘러싼 길이, 즉 <b>모든 변의 길이의 합</b>이에요.',
    body:`<ul><li><b>정다각형</b>: (한 변의 길이) × (변의 수) — 정오각형 한 변 6 cm → 6 × 5 = 30 cm</li><li><b>직사각형</b>: (가로 + 세로) × 2</li><li><b>평행사변형</b>: (이웃한 두 변의 합) × 2</li><li><b>마름모</b>: (한 변의 길이) × 4</li></ul>`,
    ex:`<p>가로 9 cm, 세로 4 cm인 직사각형의 둘레 → (9 + 4) × 2 = <b>26 cm</b></p>`, quiz:[['reg-peri', 1], ['quad-peri', 2]] },
  { title:'넓이의 단위', std:['6수03-12'], key:'한 변이 1 cm인 정사각형의 넓이가 <b>1 cm²</b>예요. <b>1 m² = 10000 cm²</b>, <b>1 km² = 1000000 m²</b>',
    body:`<div class="figc">${svg(420, 130, `<rect x="20" y="40" width="38" height="38" fill="#DFF3E3" stroke="#22314A" stroke-width="2"/>${txt(39, 59, '1cm²', { size: 11, bold: true })}${txt(39, 96, '1 cm × 1 cm', { size: 12 })}
      <rect x="150" y="10" width="110" height="110" fill="#FFF2DC" stroke="#22314A" stroke-width="2"/>${txt(205, 60, '1 m²', { size: 18, bold: true })}${txt(205, 84, '100 cm × 100 cm', { size: 12 })}
      ${txt(340, 55, '1 km²', { size: 18, bold: true })}${txt(340, 80, '1000 m × 1000 m', { size: 12 })}`)}</div>
      <p>1 m = 100 cm이므로 1 m² 안에는 1 cm²가 100 × 100 = <b>10000개</b> 들어가요.</p><div class="warn">⚠️ 1 m² = 100 cm²가 아니에요! 길이의 관계(100배)와 넓이의 관계(10000배)는 달라요.</div>
      <p>알맞은 단위: 공책 → cm², 교실 바닥 → m², 서울시 → km²</p>`,
    ex:`<p>3 m² = <b>30000</b> cm²　　5000000 m² = <b>5</b> km²</p>`, quiz:[['unit-conv', 2], ['unit-pick', 1]] },
  { title:'직사각형과 정사각형의 넓이', std:['6수03-13'], key:'(직사각형의 넓이) = <b>(가로) × (세로)</b>, (정사각형의 넓이) = <b>(한 변) × (한 변)</b>',
    body:`<p>직사각형 안에 1 cm²가 가로로 몇 개, 세로로 몇 줄 있는지 세면 곱셈으로 넓이를 구할 수 있어요.</p>`,
    lab: gridLab, ex:`<p>둘레가 24 cm이고 가로가 8 cm인 직사각형 → 세로 = 24 ÷ 2 - 8 = 4 cm → 넓이 8 × 4 = <b>32 cm²</b></p>`, quiz:[['rect-area', 1], ['peri-area', 4]] },
  { title:'평행사변형의 넓이', std:['6수03-14'], key:'(평행사변형의 넓이) = <b>(밑변) × (높이)</b>. 높이는 밑변에 <b>수직인</b> 길이예요.',
    body:`<p>평행사변형을 잘라 옮기면 직사각형이 돼요. 직사각형의 가로 = 밑변, 세로 = 높이!</p><div class="warn">⚠️ 비스듬한 변의 길이는 높이가 아니에요.</div>
      <div class="note">💡 밑변과 높이가 같으면 모양이 달라도 넓이가 같아요.</div>`,
    lab: paraLab, ex:`<p>밑변 12 cm, 높이 7 cm인 평행사변형 → 12 × 7 = <b>84 cm²</b></p>`, quiz:[['para-area', 2]] },
  { title:'삼각형의 넓이', std:['6수03-14'], key:'(삼각형의 넓이) = <b>(밑변) × (높이) ÷ 2</b>',
    body:`<p>똑같은 삼각형 2개를 붙이면 평행사변형이 돼요. 그러니까 삼각형의 넓이는 평행사변형의 <b>절반</b>이에요.</p>`,
    lab: copyLab('tri'), ex:`<p>밑변 10 cm, 높이 6 cm인 삼각형 → 10 × 6 ÷ 2 = <b>30 cm²</b></p>`, quiz:[['tri-area', 2]] },
  { title:'사다리꼴의 넓이', std:['6수03-14'], key:'(사다리꼴의 넓이) = <b>(윗변 + 아랫변) × (높이) ÷ 2</b>',
    body:`<p>똑같은 사다리꼴 2개를 거꾸로 붙이면 밑변이 (윗변 + 아랫변)인 평행사변형이 돼요. 그 절반이 사다리꼴!</p>`,
    lab: copyLab('trap'), ex:`<p>윗변 5 cm, 아랫변 9 cm, 높이 6 cm → (5 + 9) × 6 ÷ 2 = <b>42 cm²</b></p>`, quiz:[['trap-area', 2]] },
  { title:'마름모의 넓이', std:['6수03-14'], key:'(마름모의 넓이) = <b>(한 대각선) × (다른 대각선) ÷ 2</b>',
    body:`<p>마름모를 둘러싼 직사각형의 가로와 세로는 두 대각선의 길이와 같아요. 마름모는 그 직사각형의 <b>절반</b>이에요.</p>`,
    lab: copyLab('rh'), ex:`<p>두 대각선이 12 cm, 9 cm인 마름모 → 12 × 9 ÷ 2 = <b>54 cm²</b></p><p>넓이가 40 cm²인 마름모의 한 대각선이 10 cm → 다른 대각선 = 40 × 2 ÷ 10 = <b>8 cm</b></p>`, quiz:[['rhomb-area', 2], ['area-rev', 3]] }
]});
})();
