/* =========================================================
   🦖 개념 탐험대 — 3학년 1학기 (2022 개정 교육과정)
   단원 순서: 1 평면도형 · 2 덧셈과 뺄셈 · 3 길이와 시간 · 4 나눗셈 · 5 곱셈 · 6 분수와 소수
   단원마다 탐험(차시): title · key(핵심 한 줄) · body(설명) · lab(직접 해 보기) · ex(예시) · quiz(확인 문제)
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g3-1.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, G3 = window.TM_G3;
const { fr, svg, txt, line, range, tableH, ri, pick } = A;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const P = (w, a, b) => A.josa(w, a, b).slice(String(w).length);
const RO = w => '036'.includes(String(w).slice(-1)) ? '으로' : '로';
const PLACE = ['일의 자리', '십의 자리', '백의 자리', '천의 자리', '만의 자리'];
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9', PK = '#FF7EB6';

/* ═════════════ 공통 도구 ═════════════ */
// 수 모형 (백 모형 · 십 모형 · 일 모형)
const blocks = (n, color = '#BFE3FF') => { const h = Math.floor(n / 100), t = Math.floor(n % 100 / 10), o = n % 10; let g = '', x = 4;
  for (let i = 0; i < h; i++){ g += `<rect x="${x}" y="4" width="44" height="44" fill="${color}" stroke="${INK}" stroke-width="1.6"/>`; for (let k = 1; k < 10; k++) g += line(x + k * 4.4, 4, x + k * 4.4, 48, { stroke: '#7FA6C9', w: .6 }) + line(x, 4 + k * 4.4, x + 44, 4 + k * 4.4, { stroke: '#7FA6C9', w: .6 }); x += 50; }
  if (h) x += 6;
  for (let i = 0; i < t; i++){ g += `<rect x="${x}" y="4" width="6" height="44" fill="${color}" stroke="${INK}" stroke-width="1.4"/>`; for (let k = 1; k < 10; k++) g += line(x, 4 + k * 4.4, x + 6, 4 + k * 4.4, { stroke: '#7FA6C9', w: .6 }); x += 9; }
  if (t) x += 6;
  for (let i = 0; i < o; i++){ g += `<rect x="${x + (i % 2) * 8}" y="${40 - Math.floor(i / 2) * 8}" width="7" height="7" fill="${color}" stroke="${INK}" stroke-width="1.2"/>`; }
  if (o) x += 18;
  return svg(Math.max(x, 20), 52, g); };

// 세로셈 단계 만들기 (op: '+', '-', '×')
const digits = n => String(n).split('').reverse().map(Number);
function colSteps(op, a, b){
  const da = digits(a), db = op === '×' ? [] : digits(b), r = op === '+' ? a + b : op === '-' ? a - b : a * b, W = Math.max(da.length, db.length, String(r).length);
  const st = [], top = [], res = [], strike = [];
  const snap = (hl, msg) => st.push({ top: top.slice(), res: res.slice(), strike: strike.slice(), hl, msg });
  snap(-1, '<b>일의 자리</b>부터 차례로 계산해요. ▶ 다음 단계를 눌러 보세요.');
  if (op === '+'){ let c = 0; const n = Math.max(da.length, db.length);
    for (let i = 0; i < n; i++){ const x = da[i] || 0, y = db[i] || 0, s = x + y + c; res[i] = s % 10;
      let m = `${PLACE[i]}: ${x} + ${y}${c ? ' + 1(받아올린 수)' : ''} = ${s}`; c = s >= 10 ? 1 : 0;
      if (c){ top[i + 1] = 1; m += ` → ${s % 10}${P(s % 10, '을', '를')} 쓰고 <b>1을 ${PLACE[i + 1]}로 받아올림</b>`; }
      snap(i, m); }
    if (c){ res[n] = 1; snap(n, `받아올린 1을 ${PLACE[n]}에 써요.`); }
  } else if (op === '-'){ const cur = da.slice();
    for (let i = 0; i < da.length; i++){ const y = db[i] || 0; let m = '';
      if (cur[i] < y){ let j = i + 1; while (cur[j] === 0) j++; cur[j]--; top[j] = cur[j]; strike[j] = 1;
        for (let k = j - 1; k > i; k--){ cur[k] = 9; top[k] = 9; strike[k] = 1; }
        const before = cur[i]; cur[i] += 10; top[i] = cur[i]; strike[i] = 1;
        m = `${PLACE[i]}: ${before}에서 ${y}${P(y, '을', '를')} 뺄 수 없어요 → <b>${PLACE[j]}에서 받아내림</b>${j > i + 1 ? `(${PLACE[i + 1]}는 10이 되었다가 1을 내려 주어 9)` : ''} → ${cur[i]} - ${y} = ${cur[i] - y}`; }
      else m = `${PLACE[i]}: ${cur[i]} - ${y} = ${cur[i] - y}`;
      res[i] = cur[i] - y; snap(i, m); }
  } else { let c = 0;
    for (let i = 0; i < da.length; i++){ const p = da[i] * b + c, last = i === da.length - 1; let m = `${PLACE[i]}: ${da[i]} × ${b}${c ? ` + ${c}(올림)` : ''} = ${p}`;
      if (last){ res[i] = p % 10; if (p >= 10){ res[i + 1] = Math.floor(p / 10); m += ` → ${p}${P(p, '을', '를')} 그대로 써요`; } }
      else { res[i] = p % 10; c = Math.floor(p / 10); if (c){ top[i + 1] = c; m += ` → ${p % 10}${P(p % 10, '을', '를')} 쓰고 <b>${c}${P(c, '을', '를')} ${PLACE[i + 1]} 위에 올림</b>`; } else c = 0; }
      snap(i, m); }
  }
  const last = st[st.length - 1]; last.msg += ` &nbsp;🎉 <b>${a} ${op} ${b} = ${r}</b>`; last.done = true;
  return { st, W: W + 1, r };
}
function colTable(op, a, b, s, W, r){
  const da = digits(a), db = op === '×' ? [b] : digits(b), rl = String(r).length;
  const td = (v, st = '') => `<td style="width:1.15em;height:1.25em;text-align:center;${st}">${v ?? ''}</td>`;
  let h = '<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(28px,4vw,38px);line-height:1.15;margin:4px auto">';
  const hl = i => i === s.hl ? 'background:#FFE38A;border-radius:6px;' : '';
  h += '<tr>' + td('') + range(0, W - 1).reverse().map(i => td(s.top[i] != null ? s.top[i] : '', `font-size:.5em;color:#E0464A;vertical-align:bottom;${hl(i)}`)).join('') + '</tr>';
  h += '<tr>' + td('') + range(0, W - 1).reverse().map(i => td(da[i] != null ? da[i] : '', hl(i) + (s.strike[i] ? 'text-decoration:line-through;color:#9AA6B6;' : ''))).join('') + '</tr>';
  h += '<tr>' + td(op) + range(0, W - 1).reverse().map(i => td(db[i] != null ? db[i] : '', hl(i))).join('') + '</tr>';
  h += '<tr>' + td('', `border-top:3px solid ${INK}`) + range(0, W - 1).reverse().map(i => td(s.res[i] != null && (i < rl || i === 0) ? s.res[i] : '', `border-top:3px solid ${INK};color:#2F8A47;${hl(i)}`)).join('') + '</tr>';
  return h + '</table>';
}
// 세로셈 실험실: gen() → [a, b]
const colLab = (title, op, gen, showBlocks = true) => ({ title, init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="cn">🎲 새 문제</button><button class="tbtn" type="button" id="cs">▶ 다음 단계</button><button class="tbtn" type="button" id="cr">↺ 처음부터</button></div>
    ${showBlocks ? '<div class="figc" id="cb" style="gap:14px;flex-wrap:wrap;align-items:center"></div>' : ''}<div id="ct"></div><div class="out" id="co"></div>`;
  let a, b, S, k = 0;
  const draw = () => { const s = S.st[k]; $in(el, '#ct').innerHTML = colTable(op, a, b, s, S.W, S.r); $in(el, '#co').innerHTML = s.msg; $in(el, '#cs').disabled = !!s.done; };
  const fresh = () => { [a, b] = gen(); S = colSteps(op, a, b); k = 0;
    if (showBlocks) $in(el, '#cb').innerHTML = op === '×' ? range(1, b).map(() => blocks(a)).join('') : `${blocks(a)}<b style="font-size:26px">${op}</b>${blocks(b, '#FFD7A8')}`;
    draw(); };
  $in(el, '#cn').addEventListener('click', fresh);
  $in(el, '#cs').addEventListener('click', () => { if (k < S.st.length - 1) k++; draw(); });
  $in(el, '#cr').addEventListener('click', () => { k = 0; draw(); });
  fresh();
} });
const r3 = () => ri(1, 9) * 100 + ri(0, 9) * 10 + ri(0, 9);
const addGen = c => () => { let a, b, cc; do { a = ri(101, 899); b = ri(101, 899); cc = [0, 1, 2].filter(i => digits(a)[i] + digits(b)[i] + (i && digits(a)[i - 1] + digits(b)[i - 1] >= 10 ? 1 : 0) >= 10).length; } while (a + b > 999 && c < 3 || (c === 0 ? cc !== 0 : c === 1 ? cc !== 1 : cc < 2)); return [a, b]; };
const subGen = c => () => { let a, b, cc; do { a = ri(300, 999); b = ri(101, a - 50); const x = digits(a), y = digits(b); cc = (x[0] < y[0] ? 1 : 0) + ((x[1] - (x[0] < y[0] ? 1 : 0)) < y[1] ? 1 : 0); } while (c === 0 ? cc !== 0 : c === 1 ? cc !== 1 : cc !== 2); return [a, b]; };

window.TM_L3 = { blocks, colLab, colSteps, colTable, digits, P, RO, PLACE };

/* ═════════════ 1. 평면도형 실험실 ═════════════ */
const lineLab = { title: '선분, 반직선, 직선 바꾸어 보기', init(el){
  const K = [['seg', '선분 ㄱㄴ', '두 점을 곧게 이은 선 — 양쪽 끝이 있어요.'], ['ray', '반직선 ㄱㄴ', '점 ㄱ에서 시작해 점 ㄴ 쪽으로 <b>끝없이</b> 늘인 곧은 선'], ['rayb', '반직선 ㄴㄱ', '점 ㄴ에서 시작해 점 ㄱ 쪽으로 끝없이 늘인 곧은 선 — 시작점이 달라 반직선 ㄱㄴ과 <b>달라요</b>.'], ['line', '직선 ㄱㄴ (= 직선 ㄴㄱ)', '양쪽으로 <b>끝없이</b> 늘인 곧은 선']];
  el.innerHTML = `<div class="ctrl">${K.map((k, i) => `<button class="tbtn" type="button" data-k="${i}" aria-pressed="${!i}">${k[1].split(' (')[0]}</button>`).join('')}</div><div class="figc" id="lf"></div><div class="out" id="lo"></div>`;
  const draw = i => { const [k, nm, d] = K[i]; $in(el, '#lf').innerHTML = k === 'rayb' ? G3.lineFig('ray', 'ㄴ', 'ㄱ') : G3.lineFig(k); $in(el, '#lo').innerHTML = `<b>${nm}</b><br>${d}`; };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { press(el, '[data-k]', b); draw(+b.dataset.k); })); draw(0);
} };
const angFig = (deg, showSq = true) => { const vx = 70, vy = 150, Lg = 150, r = deg * Math.PI / 180, ax = vx + Lg * Math.cos(-r), ay = vy + Lg * Math.sin(-r);
  let g = '';
  if (deg === 90 && showSq) g += `<path d="M${vx + 20} ${vy} L${vx + 20} ${vy - 20} L${vx} ${vy - 20}" fill="none" stroke="#E0464A" stroke-width="2.4"/>`;
  else g += `<path d="M${vx + 30} ${vy} A30 30 0 0 0 ${(vx + 30 * Math.cos(-r)).toFixed(1)} ${(vy + 30 * Math.sin(-r)).toFixed(1)}" fill="#FFE38A" stroke="${OR}" stroke-width="2"/>`;
  g += line(vx, vy, ax, ay, { w: 3 }) + line(vx, vy, vx + Lg, vy, { w: 3 }) + G3.DOT(ax, ay, 'ㄱ', 12, -6) + G3.DOT(vx, vy, 'ㄴ', -14, 6) + G3.DOT(vx + Lg, vy, 'ㄷ', 0, 16);
  return svg(260, 180, g); };
const angleLab = { title: '각을 벌렸다 오므렸다 하며 직각과 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>벌어진 정도</label><input type="range" min="20" max="160" step="5" value="55" id="ad"><button class="tbtn" type="button" id="a90">직각 만들기</button></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  const draw = () => { const d = +$in(el, '#ad').value; $in(el, '#af').innerHTML = angFig(d);
    $in(el, '#ao').innerHTML = `꼭짓점: 점 ㄴ · 변: 변 ㄴㄱ, 변 ㄴㄷ → <b>각 ㄱㄴㄷ</b> (또는 각 ㄷㄴㄱ)<br>${d === 90 ? '📐 종이를 반듯하게 두 번 접은 모양과 꼭 맞아요 → <b>직각</b>!' : d < 90 ? '직각보다 <b>작은</b> 각이에요.' : '직각보다 <b>큰</b> 각이에요.'}`; };
  $in(el, '#ad').addEventListener('input', draw); $in(el, '#a90').addEventListener('click', () => { $in(el, '#ad').value = 90; draw(); }); draw();
} };
const clockRightLab = { title: '시계 바늘이 직각을 이루는 시각 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>시각</label><input type="range" min="1" max="12" value="3" id="ch"><span class="v" id="chv"></span></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  const draw = () => { const h = +$in(el, '#ch').value; $in(el, '#chv').textContent = h + '시'; const right = h === 3 || h === 9;
    $in(el, '#cf').innerHTML = G3.clockFig(h, 0).replace('width="120" height="120"', 'width="190" height="190"').replace('</svg>', right ? `<path d="M${h === 3 ? 72 : 48} 60 L${h === 3 ? 72 : 48} 48 L60 48" fill="none" stroke="#E0464A" stroke-width="2.4"/></svg>` : '</svg>');
    $in(el, '#co').innerHTML = right ? `${h}시: 긴바늘과 짧은바늘이 <b>직각</b>을 이루어요! 📐` : `${h}시: 두 바늘이 이루는 작은 쪽 각은 직각${Math.min(h, 12 - h) % 12 < 3 ? '보다 작아요' : '보다 커요'}.`; };
  $in(el, '#ch').addEventListener('input', draw); draw();
} };
const triGridLab = { title: '점 3개를 눌러 삼각형을 만들고 직각삼각형인지 알아보기', init(el){
  const u = 40, C = 7, R = 5, NM = ['ㄱ', 'ㄴ', 'ㄷ'];
  el.innerHTML = `<div class="figc" id="tf"></div><div class="ctrl"><button class="tbtn" type="button" id="tc">↺ 다시 찍기</button><button class="tbtn" type="button" id="te">예시: 직각삼각형</button></div><div class="out" id="to">점을 3개 눌러 보세요.</div>`;
  let pts = [];
  const isR = (a, b, c) => (b[0] - a[0]) * (c[0] - a[0]) + (b[1] - a[1]) * (c[1] - a[1]) === 0;
  const draw = () => { let g = G3.gridBG(C * u, R * u, u);
    if (pts.length === 3) g += G3.poly(pts.map(p => [p[0] * u, p[1] * u]), '#DFF5E1');
    else if (pts.length === 2) g += line(pts[0][0] * u, pts[0][1] * u, pts[1][0] * u, pts[1][1] * u, { w: 2.4 });
    let msg = '점을 3개 눌러 보세요.';
    if (pts.length === 3){ const [a, b, c] = pts, area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
      if (!area) msg = '세 점이 한 직선 위에 있으면 삼각형이 되지 않아요!';
      else { const k = [0, 1, 2].find(i => isR(pts[i], pts[(i + 1) % 3], pts[(i + 2) % 3]));
        if (k != null){ const v = pts[k], p1 = pts[(k + 1) % 3], p2 = pts[(k + 2) % 3], n1 = Math.hypot(p1[0] - v[0], p1[1] - v[1]), n2 = Math.hypot(p2[0] - v[0], p2[1] - v[1]), s = 14, ex = (p1[0] - v[0]) / n1, ey = (p1[1] - v[1]) / n1, fx = (p2[0] - v[0]) / n2, fy = (p2[1] - v[1]) / n2, X = v[0] * u, Y = v[1] * u;
          g += `<path d="M${X + ex * s} ${Y + ey * s} L${X + ex * s + fx * s} ${Y + ey * s + fy * s} L${X + fx * s} ${Y + fy * s}" fill="none" stroke="#E0464A" stroke-width="2.4"/>`;
          msg = `🎉 꼭짓점 ${NM[k]}에서 <b>직각</b>! 한 각이 직각인 삼각형 → <b>직각삼각형</b>`; }
        else msg = '직각이 없어요 → 직각삼각형이 <b>아니에요</b>. 다시 찍어 볼까요?'; } }
    pts.forEach((p, i) => { g += G3.DOT(p[0] * u, p[1] * u, NM[i], 0, -16); });
    for (let y = 0; y <= R; y++) for (let x = 0; x <= C; x++) g += `<circle cx="${x * u}" cy="${y * u}" r="${pts.some(p => p[0] === x && p[1] === y) ? 7 : 4}" fill="${pts.some(p => p[0] === x && p[1] === y) ? '#E0464A' : '#9AA6B6'}" data-x="${x}" data-y="${y}"/><circle cx="${x * u}" cy="${y * u}" r="16" fill="transparent" data-x="${x}" data-y="${y}" style="cursor:pointer"/>`;
    $in(el, '#tf').innerHTML = svg(C * u + 30, R * u + 30, `<g transform="translate(15 15)">${g}</g>`);
    $in(el, '#to').innerHTML = msg;
    el.querySelectorAll('circle[data-x]').forEach(c => c.addEventListener('click', () => { if (pts.length === 3) pts = []; const p = [+c.dataset.x, +c.dataset.y]; if (!pts.some(q => q[0] === p[0] && q[1] === p[1])) pts.push(p); draw(); })); };
  $in(el, '#tc').addEventListener('click', () => { pts = []; draw(); });
  $in(el, '#te').addEventListener('click', () => { pts = [[1, 1], [1, 4], [5, 4]]; draw(); }); draw();
} };
const rectLab = sq => ({ title: sq ? '가로와 세로를 같게 하여 정사각형 만들기' : '가로, 세로를 바꾸며 직사각형 살펴보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="1" max="10" value="${sq ? 4 : 6}" id="rw"><span class="v" id="rwv"></span><label>세로</label><input type="range" min="1" max="7" value="${sq ? 3 : 3}" id="rh"><span class="v" id="rhv"></span></div><div class="figc" id="rf"></div><div class="out" id="ro"></div>`;
  const draw = () => { const w = +$in(el, '#rw').value, h = +$in(el, '#rh').value, u = 30; $in(el, '#rwv').textContent = w + ' cm'; $in(el, '#rhv').textContent = h + ' cm';
    const X = 30, Y = 20, W = w * u, H = h * u, s = 12;
    let g = G3.gridBG(W + 60, H + 50, u / 2) + `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${w === h ? '#FFE7A8' : '#DFF5E1'}" stroke="${INK}" stroke-width="2.6"/>`;
    [[X, Y, 1, 1], [X + W, Y, -1, 1], [X, Y + H, 1, -1], [X + W, Y + H, -1, -1]].forEach(([x, y, dx, dy]) => { g += `<path d="M${x + dx * s} ${y} L${x + dx * s} ${y + dy * s} L${x} ${y + dy * s}" fill="none" stroke="#E0464A" stroke-width="2"/>`; });
    g += txt(X + W / 2, Y + H + 18, `${w} cm`, { size: 14, bold: true }) + txt(X - 16, Y + H / 2, `${h}`, { size: 14, bold: true });
    $in(el, '#rf').innerHTML = svg(W + 60, H + 50, g);
    $in(el, '#ro').innerHTML = `네 각이 모두 직각 → ${w === h ? '네 변의 길이도 모두 같아요 → <b>정사각형</b> (정사각형도 직사각형이에요!)' : '<b>직사각형</b> (마주 보는 두 변의 길이가 같아요)'}<br>네 변의 길이의 합: ${w} + ${h} + ${w} + ${h} = <b>${2 * (w + h)} cm</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
const cutLab = { title: '직사각형 종이에서 가장 큰 정사각형 잘라 내기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로</label><input type="range" min="2" max="12" value="9" id="kw"><span class="v" id="kwv"></span><label>세로</label><input type="range" min="1" max="7" value="5" id="kh"><span class="v" id="khv"></span></div><div class="figc" id="kf"></div><div class="out" id="ko"></div>`;
  const draw = () => { let w = +$in(el, '#kw').value, h = +$in(el, '#kh').value; $in(el, '#kwv').textContent = w; $in(el, '#khv').textContent = h;
    const u = 26, X = 10, Y = 10, s = Math.min(w, h);
    let g = `<rect x="${X}" y="${Y}" width="${w * u}" height="${h * u}" fill="#fff" stroke="${INK}" stroke-width="2.4"/><rect x="${X}" y="${Y}" width="${s * u}" height="${s * u}" fill="#FFE7A8" stroke="${OR}" stroke-width="2.4" stroke-dasharray="6 4"/>` + txt(X + s * u / 2, Y + s * u / 2, `정사각형 ${s} cm`, { size: 13, bold: true });
    const rw = w > h ? w - s : w, rh = w > h ? h : h - s;
    if (w !== h) g += `<rect x="${w > h ? X + s * u : X}" y="${w > h ? Y : Y + s * u}" width="${rw * u}" height="${rh * u}" fill="#DFF5E1" stroke="${GR}" stroke-width="2"/>`;
    $in(el, '#kf').innerHTML = svg(w * u + 20, h * u + 20, g);
    $in(el, '#ko').innerHTML = w === h ? '처음부터 정사각형이라 남는 부분이 없어요!' : `가장 큰 정사각형의 한 변 = 짧은 변 = <b>${s} cm</b><br>남은 직사각형: 가로 ${rw} cm, 세로 ${rh} cm → 네 변의 합 <b>${2 * (rw + rh)} cm</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 2. 덧셈과 뺄셈 실험실 ═════════════ */
const estLab = { title: '수직선에서 몇백쯤인지 어림하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>첫째 수</label><input type="range" min="101" max="899" value="287" id="ea"><span class="v" id="eav"></span></div><div class="ctrl"><label>둘째 수</label><input type="range" min="101" max="899" value="412" id="eb"><span class="v" id="ebv"></span><button class="tbtn" type="button" id="eop" aria-pressed="true">＋</button></div><div class="figc" id="ef"></div><div class="out" id="eo"></div>`;
  let plus = true;
  const nl = (n, col) => { const lo = Math.floor(n / 100) * 100, near = Math.round(n / 100) * 100, W = 300, x = 20 + (n - lo) / 100 * W;
    let g = line(20, 30, 20 + W, 30, { w: 2.4 }); for (let k = 0; k <= 10; k++) g += line(20 + k * 30, k % 5 ? 25 : 20, 20 + k * 30, k % 5 ? 35 : 40, { w: k % 5 ? 1.2 : 2 });
    g += txt(20, 52, lo, { size: 13 }) + txt(170, 52, lo + 50, { size: 12, fill: '#5D6C83' }) + txt(20 + W, 52, lo + 100, { size: 13 }) + `<circle cx="${x}" cy="30" r="7" fill="${col}"/>` + txt(x, 10, n, { size: 13, bold: true, fill: col });
    g += `<circle cx="${near === lo ? 20 : 20 + W}" cy="30" r="10" fill="none" stroke="#E0464A" stroke-width="2.4"/>`;
    return svg(340, 62, g); };
  const draw = () => { const a = +$in(el, '#ea').value, b0 = +$in(el, '#eb').value, b = plus ? b0 : Math.min(b0, a - 1); $in(el, '#eav').textContent = a; $in(el, '#ebv').textContent = b;
    const ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, est = plus ? ra + rb : ra - rb, real = plus ? a + b : a - b;
    $in(el, '#ef').innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${nl(a, BL)}${nl(b, OR)}</div>`;
    $in(el, '#eo').innerHTML = `${a}는 약 ${ra}, ${b}는 약 ${rb} → 어림한 값: ${ra} ${plus ? '+' : '-'} ${rb} = 약 <b>${est}</b><br>실제 값: ${a} ${plus ? '+' : '-'} ${b} = <b>${real}</b> (차이 ${Math.abs(real - est)})`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#eop').addEventListener('click', e => { plus = !plus; e.target.textContent = plus ? '＋' : '－'; draw(); }); draw();
} };

/* ═════════════ 3. 길이와 시간 실험실 ═════════════ */
const rulerLab = { title: '자로 재어 몇 cm 몇 mm인지 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>길이</label><input type="range" min="1" max="140" value="47" id="mm"><span class="v" id="mmv"></span></div><div class="figc" id="mf" style="overflow-x:auto"></div><div class="out" id="mo"></div>`;
  const draw = () => { const n = +$in(el, '#mm').value, u = 3.4, X = 14; $in(el, '#mmv').textContent = n + ' mm';
    let g = `<rect x="${X}" y="14" width="${n * u}" height="18" rx="4" fill="${OR}" stroke="${INK}" stroke-width="1.5"/><polygon points="${X + n * u},14 ${X + n * u + 14},23 ${X + n * u},32" fill="#FFE38A" stroke="${INK}" stroke-width="1.5"/>`;
    g += `<rect x="${X - 6}" y="40" width="${150 * u + 12}" height="44" rx="4" fill="#FFF4D0" stroke="${INK}" stroke-width="1.5"/>`;
    for (let k = 0; k <= 150; k++) g += line(X + k * u, 40, X + k * u, 40 + (k % 10 ? (k % 5 ? 8 : 13) : 18), { w: k % 10 ? .8 : 1.6 });
    for (let c = 0; c <= 15; c++) g += txt(X + c * 10 * u, 70, c, { size: 12, bold: true });
    $in(el, '#mf').innerHTML = svg(150 * u + 40, 92, g);
    const c = Math.floor(n / 10), m = n % 10;
    $in(el, '#mo').innerHTML = `1 cm를 똑같이 10칸으로 나눈 한 칸 = <b>1 mm</b><br>${c ? `${c} cm ` : ''}${m ? `${m} mm` : ''} = <b>${n} mm</b>${m && c ? ` <span style="color:#5D6C83">(${c} cm보다 ${m} mm 더 긴 길이)</span>` : ''}`; };
  $in(el, '#mm').addEventListener('input', draw); draw();
} };
const kmLab = { title: '티라노와 함께 걸으며 km와 m 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>걸은 거리</label><input type="range" min="0" max="4000" step="50" value="1300" id="km"><span class="v" id="kmv"></span></div><div class="figc" id="kf"></div><div class="out" id="ko"></div>`;
  const draw = () => { const n = +$in(el, '#km').value, W = 400, X = 20, x = X + n / 4000 * W; $in(el, '#kmv').textContent = n + ' m';
    let g = line(X, 50, X + W, 50, { w: 3 }); for (let k = 0; k <= 40; k++) g += line(X + k * 10, 50, X + k * 10, k % 10 ? 56 : 62, { w: k % 10 ? .8 : 2 });
    for (let k = 0; k <= 4; k++) g += txt(X + k * 100, 76, `${k} km`, { size: 12, bold: true });
    g += `<rect x="${X}" y="46" width="${x - X}" height="8" fill="${GR}" opacity=".6"/><text x="${x}" y="34" font-size="26" text-anchor="middle">🦖</text>`;
    $in(el, '#kf').innerHTML = svg(W + 40, 86, g);
    const k = Math.floor(n / 1000), m = n % 1000;
    $in(el, '#ko').innerHTML = `1000 m = <b>1 km</b><br>${n} m = ${k ? `<b>${k} km</b> ` : ''}${m || !k ? `<b>${m} m</b>` : ''}${k && m ? ` <span style="color:#5D6C83">(${k} 킬로미터 ${m} 미터)</span>` : ''}`; };
  $in(el, '#km').addEventListener('input', draw); draw();
} };
const unitPickLab = { title: '어떤 단위로 어림하면 좋을까?', init(el){
  const O = [['✏️ 연필의 길이', 'cm', '약 15 cm'], ['🐜 개미의 길이', 'mm', '약 5 mm'], ['🚪 교실 문의 높이', 'm', '약 2 m'], ['🚌 서울에서 대전까지', 'km', '약 140 km'], ['🪙 동전의 두께', 'mm', '약 2 mm'], ['🏫 운동장 한 바퀴', 'm', '약 200 m'], ['📱 휴대전화의 긴 쪽', 'cm', '약 15 cm'], ['🏔️ 한라산 높이', 'm', '약 1950 m']];
  let i = 0;
  el.innerHTML = `<div class="out" id="uq" style="font-size:22px"></div><div class="ctrl">${['mm', 'cm', 'm', 'km'].map(u => `<button class="tbtn" type="button" data-u="${u}">${u}</button>`).join('')}</div><div class="out" id="uo"></div><div class="ctrl"><button class="tbtn" type="button" id="un">다음 ▶</button></div>`;
  const show = () => { $in(el, '#uq').innerHTML = `<b>${O[i][0]}</b>는 어떤 단위가 알맞을까요?`; $in(el, '#uo').innerHTML = ''; press(el, '[data-u]', null); };
  el.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => { press(el, '[data-u]', b); const ok = b.dataset.u === O[i][1];
    $in(el, '#uo').innerHTML = ok ? `⭕ 정답! <b>${O[i][2]}</b>` : `❌ 다시 생각해 봐요. (짧은 것 mm → cm → m → km 먼 거리)`; }));
  $in(el, '#un').addEventListener('click', () => { i = (i + 1) % O.length; show(); }); show();
} };
const secLab = { title: '초바늘을 움직여 1분 = 60초 느끼기', init(el){
  el.innerHTML = `<div class="figc" id="sf"></div><div class="ctrl"><button class="tbtn" type="button" id="sgo">▶ 시작</button><button class="tbtn" type="button" id="sff">⏩ 10초 빨리</button><button class="tbtn" type="button" id="srs">↺ 0초로</button></div><div class="out" id="so"></div>`;
  let t = 0, tm = null;
  const draw = () => { const C = 80, R = 70, a = (t % 60) * Math.PI / 30 - Math.PI / 2; let g = `<circle cx="${C}" cy="${C}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < 60; k++){ const b = k * Math.PI / 30 - Math.PI / 2; g += line(C + (k % 5 ? 64 : 58) * Math.cos(b), C + (k % 5 ? 64 : 58) * Math.sin(b), C + 69 * Math.cos(b), C + 69 * Math.sin(b), { w: k % 5 ? 1 : 2.4 }); }
    for (let k = 1; k <= 12; k++){ const b = k * Math.PI / 6 - Math.PI / 2; g += txt(C + 47 * Math.cos(b), C + 47 * Math.sin(b), k, { size: 13, bold: true }); }
    g += `<path d="M${C} ${C - R + 3} A${R - 3} ${R - 3} 0 ${t % 60 > 30 ? 1 : 0} 1 ${(C + (R - 3) * Math.cos(a)).toFixed(1)} ${(C + (R - 3) * Math.sin(a)).toFixed(1)}" fill="none" stroke="#FFD7A8" stroke-width="6" opacity="${t % 60 ? 1 : 0}"/>`;
    g += line(C, C, C + 62 * Math.cos(a), C + 62 * Math.sin(a), { w: 2, stroke: '#E0464A' }) + `<circle cx="${C}" cy="${C}" r="4" fill="#E0464A"/>`;
    $in(el, '#sf').innerHTML = svg(160, 160, g);
    $in(el, '#so').innerHTML = `초바늘이 작은 눈금 한 칸 = <b>1초</b> · 숫자 한 칸(5칸) = 5초<br>지금까지 <b>${t}초</b>${t >= 60 ? ` = <b>${Math.floor(t / 60)}분 ${t % 60}초</b> (한 바퀴 = 60초 = 1분)` : ''}`; };
  const stop = () => { clearInterval(tm); tm = null; $in(el, '#sgo').textContent = '▶ 시작'; };
  $in(el, '#sgo').addEventListener('click', () => { if (tm) return stop(); $in(el, '#sgo').textContent = '⏸ 멈춤'; tm = setInterval(() => { if (!el.isConnected) return clearInterval(tm); t++; draw(); }, 1000); });
  $in(el, '#sff').addEventListener('click', () => { t += 10; draw(); });
  $in(el, '#srs').addEventListener('click', () => { stop(); t = 0; draw(); }); draw();
} };
// 시간의 덧셈/뺄셈 세로셈 (60 받아올림·받아내림)
const timeLab = plus => ({ title: plus ? '시간의 덧셈 — 60초는 1분으로 받아올림' : '시간의 뺄셈 — 1분을 60초로 받아내림', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="tn">🎲 새 문제</button><button class="tbtn" type="button" id="ts">▶ 다음 단계</button></div><div id="tt"></div><div class="out" id="to"></div>`;
  let a, b, k = 0, S = [];
  const U = ['초', '분', '시'];
  const fresh = () => { if (plus){ a = [ri(10, 55), ri(10, 50), ri(1, 9)]; b = [ri(10, 55), ri(10, 40), ri(0, 2)]; if (a[0] + b[0] < 60 && a[1] + b[1] < 60) a[0] = 60 - b[0] + ri(1, 9); }
    else { a = [ri(5, 30), ri(10, 40), ri(3, 10)]; b = [ri(a[0] + 5, 59), ri(a[1] + 1, 59), 0]; }
    // 단계 계산
    S = []; const top = [], res = [];
    const snap = (hl, msg) => S.push({ top: top.slice(), res: res.slice(), hl, msg });
    snap(-1, '<b>초</b>부터 차례로 계산해요. 같은 단위끼리!');
    if (plus){ let c = 0; for (let i = 0; i < 3; i++){ const s = a[i] + b[i] + c; let m = `${U[i]}: ${a[i]} + ${b[i]}${c ? ' + 1' : ''} = ${s}`;
        if (i < 2 && s >= 60){ res[i] = s - 60; c = 1; top[i + 1] = '+1'; m += ` → 60${U[i]} = 1${U[i + 1]}이므로 <b>1${U[i + 1]} 받아올림</b>, ${s - 60}${U[i]}`; } else { res[i] = s; c = 0; }
        snap(i, m); } }
    else { const cur = a.slice(); for (let i = 0; i < 3; i++){ let m = '';
        if (cur[i] < b[i]){ cur[i + 1]--; top[i + 1] = cur[i + 1]; cur[i] += 60; top[i] = cur[i]; m = `${U[i]}: ${a[i]}에서 ${b[i]}${P(b[i], '을', '를')} 뺄 수 없어요 → <b>1${U[i + 1]} = 60${U[i]}</b> 받아내림 → ${cur[i]} - ${b[i]} = ${cur[i] - b[i]}`; }
        else m = `${U[i]}: ${cur[i]} - ${b[i]} = ${cur[i] - b[i]}`;
        res[i] = cur[i] - b[i]; snap(i, m); } }
    S[S.length - 1].msg += ` &nbsp;🎉 <b>${res[2]}시 ${res[1]}분 ${res[0]}초</b>`; S[S.length - 1].done = true; k = 0; draw(); };
  const draw = () => { const s = S[k], hl = i => i === s.hl ? 'background:#FFE38A;' : '';
    const td = (v, st = '') => `<td style="padding:2px 10px;text-align:right;${st}">${v ?? ''}</td>`;
    let h = '<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(22px,3.4vw,32px);margin:4px auto">';
    h += '<tr>' + td('') + [2, 1, 0].map(i => td(s.top[i] ?? '', `font-size:.55em;color:#E0464A;${hl(i)}`)).join('') + '</tr>';
    h += '<tr>' + td('') + [2, 1, 0].map(i => td(`${a[i]}<small>${U[i]}</small>`, hl(i) + (!plus && s.top[i] != null ? 'text-decoration:line-through;color:#9AA6B6;' : ''))).join('') + '</tr>';
    h += '<tr>' + td(plus ? '+' : '-') + [2, 1, 0].map(i => td(plus ? `${b[i]}<small>${U[i]}</small>` : i === 2 ? '' : `${b[i]}<small>${U[i]}</small>`, hl(i))).join('') + '</tr>';
    h += '<tr>' + td('', `border-top:3px solid ${INK}`) + [2, 1, 0].map(i => td(s.res[i] != null ? `${s.res[i]}<small>${U[i]}</small>` : '', `border-top:3px solid ${INK};color:#2F8A47;${hl(i)}`)).join('') + '</tr></table>';
    $in(el, '#tt').innerHTML = (plus ? `<div class="out">${a[2]}시 ${a[1]}분 ${a[0]}초 + ${b[2] ? b[2] + '시간 ' : ''}${b[1]}분 ${b[0]}초</div>` : `<div class="out">${a[2]}시 ${a[1]}분 ${a[0]}초 - ${b[1]}분 ${b[0]}초</div>`) + h;
    $in(el, '#to').innerHTML = s.msg; $in(el, '#ts').disabled = !!s.done; };
  $in(el, '#tn').addEventListener('click', fresh);
  $in(el, '#ts').addEventListener('click', () => { if (k < S.length - 1) k++; draw(); });
  fresh();
} });

/* ═════════════ 4. 나눗셈 실험실 ═════════════ */
const shareLab = group => ({ title: group ? '몇 개씩 묶어 덜어 내기' : '접시에 똑같이 나누어 주기', init(el){
  el.innerHTML = `<div class="ctrl"><label>${group ? '한 묶음에' : '접시 수'}</label><input type="range" min="2" max="6" value="3" id="sb"><span class="v" id="sbv"></span><label>${group ? '묶음 수' : '한 접시에'}</label><input type="range" min="2" max="7" value="4" id="sq"><span class="v" id="sqv"></span></div>
    <div class="ctrl"><button class="tbtn" type="button" id="sgo">${group ? '🧺 한 묶음 덜어 내기' : '🍬 한 바퀴 나누어 주기'}</button><button class="tbtn" type="button" id="sall">끝까지</button><button class="tbtn" type="button" id="srs">↺ 다시</button></div>
    <div id="sv"></div><div class="out" id="so"></div>`;
  let r = 0;
  const draw = () => { const b = +$in(el, '#sb').value, q = +$in(el, '#sq').value, tot = b * q; $in(el, '#sbv').textContent = b + (group ? '개' : '개'); $in(el, '#sqv').textContent = q + (group ? '묶음' : '개');
    const left = tot - r * b, candy = n => '🍬'.repeat(n);
    const pile = `<div style="text-align:center;font-size:26px;min-height:40px;letter-spacing:2px">${candy(left) || '<span style="font-size:16px;color:#5D6C83">(남은 사탕 없음)</span>'}</div>`;
    let boxes;
    if (group) boxes = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${range(1, r).map(i => `<div style="border:3px solid ${i % 2 ? GR : OR};border-radius:16px;padding:4px 8px;font-size:22px">${candy(b)}<div style="font-size:13px;text-align:center">${i}번째</div></div>`).join('')}</div>`;
    else boxes = `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">${range(1, b).map(i => `<div style="border:3px solid #BFE6C2;background:#fff;border-radius:50%;min-width:86px;min-height:86px;display:grid;place-items:center;font-size:20px;padding:6px;text-align:center">${candy(r) || '🍽️'}<div style="font-size:13px">접시 ${i}</div></div>`).join('')}</div>`;
    $in(el, '#sv').innerHTML = pile + boxes;
    $in(el, '#so').innerHTML = left ? (group ? `사탕 ${tot}개에서 ${b}개씩 ${r}번 덜어 냈어요. 남은 사탕 ${left}개` : `사탕 ${tot}개를 ${b}접시에 ${r}개씩 나누었어요. 남은 사탕 ${left}개`)
      : (group ? `${tot}에서 ${b}씩 <b>${q}번</b> 덜어 내면 0 → <b>${tot} ÷ ${b} = ${q}</b> (${tot} - ${range(1, q).map(() => b).join(' - ')} = 0)` : `한 접시에 <b>${q}개</b>씩! → <b>${tot} ÷ ${b} = ${q}</b><br>${tot}: 나누어지는 수 · ${b}: 나누는 수 · ${q}: 몫`); };
  const step = () => { const b = +$in(el, '#sb').value, q = +$in(el, '#sq').value; if (r < q) r++; draw(); };
  $in(el, '#sgo').addEventListener('click', step);
  $in(el, '#sall').addEventListener('click', () => { r = +$in(el, '#sq').value; draw(); });
  $in(el, '#srs').addEventListener('click', () => { r = 0; draw(); });
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { r = 0; draw(); })); draw();
} });
const arrayLab = { title: '배열을 보고 곱셈식과 나눗셈식 만들기', init(el){
  el.innerHTML = `<div class="ctrl"><label>묶음 수(줄)</label><input type="range" min="2" max="9" value="4" id="ar"><span class="v" id="arv"></span><label>한 묶음(칸)</label><input type="range" min="2" max="9" value="6" id="ac"><span class="v" id="acv"></span></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  const draw = () => { const r = +$in(el, '#ar').value, c = +$in(el, '#ac').value, u = 30; $in(el, '#arv').textContent = r; $in(el, '#acv').textContent = c;
    let g = ''; for (let i = 0; i < r; i++){ g += `<rect x="4" y="${4 + i * u}" width="${c * u}" height="${u - 4}" rx="12" fill="${i % 2 ? '#FFF1DE' : '#E8F7EA'}"/>`; for (let j = 0; j < c; j++) g += `<circle cx="${4 + j * u + u / 2}" cy="${4 + i * u + u / 2 - 2}" r="10" fill="${i % 2 ? OR : GR}"/>`; }
    $in(el, '#af').innerHTML = svg(c * u + 8, r * u + 8, g);
    $in(el, '#ao').innerHTML = `곱셈식: <b>${r} × ${c} = ${r * c}</b><br>나눗셈식: <b>${r * c} ÷ ${r} = ${c}</b> · <b>${r * c} ÷ ${c} = ${r}</b><br><span style="color:#5D6C83">하나의 곱셈식으로 나눗셈식 2개를 만들 수 있어요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const gugudanLab = { title: '곱셈구구로 나눗셈의 몫 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>나누는 수</label><input type="range" min="2" max="9" value="7" id="gb"><span class="v" id="gbv"></span><label>몫(비밀)</label><input type="range" min="1" max="9" value="6" id="gq"><span class="v" id="gqv">?</span></div><div class="out" id="gx" style="font-size:24px"></div><div class="board" id="gt" style="grid-template-columns:repeat(3,1fr);max-width:420px"></div><div class="out" id="go"></div><div class="ctrl"><button class="tbtn" type="button" id="gs">🔍 구구단에서 찾기</button></div>`;
  let shown = false;
  const draw = () => { const b = +$in(el, '#gb').value, q = +$in(el, '#gq').value; $in(el, '#gbv').textContent = b; $in(el, '#gqv').textContent = shown ? q : '?';
    $in(el, '#gx').innerHTML = `<b>${b * q} ÷ ${b} = □</b>`;
    $in(el, '#gt').innerHTML = range(1, 9).map(k => `<span class="${shown && k === q ? 'ab' : ''}" style="aspect-ratio:auto;padding:6px">${b} × ${k} = ${b * k}</span>`).join('');
    $in(el, '#go').innerHTML = shown ? `${b}단에서 곱이 ${b * q}인 곱셈식 ${b} × ${q} = ${b * q} → 몫은 <b>${q}</b>` : `${b}단 곱셈구구에서 곱이 <b>${b * q}</b>인 것을 찾아보세요.`; };
  $in(el, '#gs').addEventListener('click', () => { shown = true; draw(); });
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { shown = false; draw(); })); draw();
} };

/* ═════════════ 5. 곱셈 실험실 ═════════════ */
const mulBlockLab = { title: '수 모형으로 (몇십몇) × (몇) 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>십의 자리</label><input type="range" min="1" max="9" value="2" id="mt"><span class="v" id="mtv"></span><label>일의 자리</label><input type="range" min="0" max="9" value="6" id="mo1"><span class="v" id="mov"></span><label>곱하는 수</label><input type="range" min="2" max="6" value="3" id="mb"><span class="v" id="mbv"></span></div><div id="mf" style="display:flex;flex-direction:column;align-items:center;gap:2px"></div><div class="out" id="mx"></div>`;
  const draw = () => { const t = +$in(el, '#mt').value, o = +$in(el, '#mo1').value, b = +$in(el, '#mb').value, a = t * 10 + o; $in(el, '#mtv').textContent = t; $in(el, '#mov').textContent = o; $in(el, '#mbv').textContent = b;
    $in(el, '#mf').innerHTML = range(1, b).map(i => `<div style="display:flex;align-items:center;gap:6px"><span style="font-family:Jua;color:#5D6C83;width:3em">${i}번</span>${blocks(a, i % 2 ? '#BFE3FF' : '#D9F2DC')}</div>`).join('');
    const tp = t * 10 * b, op = o * b;
    $in(el, '#mx').innerHTML = `십 모형: ${t * 10} × ${b} = <b>${tp}</b> · 일 모형: ${o} × ${b} = <b>${op}</b>${op >= 10 ? ' <span style="color:#E0464A">(일 모형 10개 → 십 모형 1개로 바꿔요!)</span>' : ''}<br>${a} × ${b} = ${tp} + ${op} = <b>${a * b}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const tensLab = { title: '(몇) × (몇)을 이용해 (몇십) × (몇) 구하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>몇십</label><input type="range" min="1" max="9" value="3" id="tt"><span class="v" id="ttv"></span><label>×</label><input type="range" min="2" max="9" value="4" id="tb"><span class="v" id="tbv"></span></div><div class="figc" id="tf" style="flex-wrap:wrap;gap:6px"></div><div class="out" id="to"></div>`;
  const draw = () => { const t = +$in(el, '#tt').value, b = +$in(el, '#tb').value; $in(el, '#ttv').textContent = t * 10; $in(el, '#tbv').textContent = b;
    $in(el, '#tf').innerHTML = range(1, b).map(() => blocks(t * 10)).join('');
    $in(el, '#to').innerHTML = `${t} × ${b} = ${t * b} → 십 모형이 ${t * b}개 → <b>${t * 10} × ${b} = ${t * b * 10}</b><br><span style="color:#5D6C83">(몇) × (몇)의 곱에 0을 하나 붙여요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 6. 분수와 소수 실험실 ═════════════ */
const pieLab = { title: '피자를 똑같이 나누고 조각 색칠하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>똑같이 나눈 조각 수</label><input type="range" min="2" max="12" value="4" id="pd"><span class="v" id="pdv"></span><button class="tbtn" type="button" id="pu" aria-pressed="false">똑같지 않게 나누기</button></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  let on = new Set([0]), uneq = false;
  const draw = () => { const d = +$in(el, '#pd').value, C = 90, R = 80; $in(el, '#pdv').textContent = d;
    const cuts = uneq ? range(0, d).map((k, i) => k / d + (i && i < d ? ((i * 37) % 7 - 3) / (d * 12) : 0)) : range(0, d).map(k => k / d);
    let g = '';
    for (let k = 0; k < d; k++){ const a1 = cuts[k] * 2 * Math.PI - Math.PI / 2, a2 = cuts[k + 1] * 2 * Math.PI - Math.PI / 2, big = cuts[k + 1] - cuts[k] > .5 ? 1 : 0;
      g += `<path d="M${C} ${C} L${(C + R * Math.cos(a1)).toFixed(1)} ${(C + R * Math.sin(a1)).toFixed(1)} A${R} ${R} 0 ${big} 1 ${(C + R * Math.cos(a2)).toFixed(1)} ${(C + R * Math.sin(a2)).toFixed(1)} Z" fill="${on.has(k) ? '#FFB347' : '#FFF4D0'}" stroke="${INK}" stroke-width="2" data-k="${k}" style="cursor:pointer"/>`; }
    $in(el, '#pf').innerHTML = svg(180, 180, g);
    el.querySelectorAll('path[data-k]').forEach(p => p.addEventListener('click', () => { const k = +p.dataset.k; on.has(k) ? on.delete(k) : on.add(k); draw(); }));
    const n = [...on].filter(k => k < d).length;
    $in(el, '#po').innerHTML = uneq ? '⚠️ 조각의 크기가 서로 달라요 → <b>똑같이 나누지 않았으므로 분수로 나타낼 수 없어요</b>.' : `조각을 눌러 색칠해 보세요. 전체를 똑같이 <b>${d}</b>${RO(d)} 나눈 것 중의 <b>${n}</b> → ${fr(n, d)} (${d}분의 ${n})${n === 1 ? ' — <b>단위분수</b>!' : n ? `<br>${fr(1, d)}이 ${n}개` : ''}`; };
  $in(el, '#pd').addEventListener('input', () => { on = new Set([0]); draw(); });
  $in(el, '#pu').addEventListener('click', e => { uneq = !uneq; e.target.setAttribute('aria-pressed', uneq); draw(); }); draw();
} };
const unitCmpLab = { title: '단위분수 막대를 나란히 놓고 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>첫째 분모</label><input type="range" min="2" max="10" value="3" id="ua"><span class="v" id="uav"></span><label>둘째 분모</label><input type="range" min="2" max="10" value="5" id="ub"><span class="v" id="ubv"></span></div><div class="ctrl"><label>분자(둘째만, 같은 분모 비교용)</label><input type="range" min="1" max="9" value="1" id="un"><span class="v" id="unv"></span></div><div class="figc" id="uf"></div><div class="out" id="uo"></div>`;
  const draw = () => { const a = +$in(el, '#ua').value, b = +$in(el, '#ub').value, nI = $in(el, '#un'); nI.max = b - 1; if (+nI.value > b - 1) nI.value = b - 1; const n = +nI.value, W = 400;
    $in(el, '#uav').textContent = a; $in(el, '#ubv').textContent = b; $in(el, '#unv').textContent = n;
    const bar = (y, d, k, col) => range(0, d - 1).map(i => `<rect x="${10 + i * W / d}" y="${y}" width="${W / d}" height="34" fill="${i < k ? col : '#fff'}" stroke="${INK}" stroke-width="1.6"/>`).join('');
    $in(el, '#uf').innerHTML = svg(W + 20, 96, bar(6, a, 1, '#8FD19E') + bar(52, b, n, '#FFC48A'));
    const va = 1 / a, vb = n / b, c = Math.abs(va - vb) < 1e-9 ? '=' : va > vb ? '&gt;' : '&lt;';
    $in(el, '#uo').innerHTML = `${fr(1, a)} <b>${c}</b> ${fr(n, b)}<br><span style="color:#5D6C83">${n === 1 ? '단위분수는 분모가 <b>작을수록</b> 커요 (적게 나눌수록 한 조각이 커요).' : a === b ? '분모가 같으면 분자가 클수록 커요.' : '막대의 색칠한 길이를 비교해요.'}</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const fracBarLab = { title: '막대를 눌러 색칠하고 분수로 나타내기', init(el){
  el.innerHTML = `<div class="ctrl"><label>똑같이 나눈 칸 수</label><input type="range" min="2" max="12" value="6" id="fd"><span class="v" id="fdv"></span></div><div class="figc" id="ff"></div><div class="out" id="fo"></div>`;
  let on = new Set([0, 1]);
  const draw = () => { const d = +$in(el, '#fd').value, W = 420; $in(el, '#fdv').textContent = d;
    $in(el, '#ff').innerHTML = svg(W + 20, 60, range(0, d - 1).map(i => `<rect x="${10 + i * W / d}" y="8" width="${W / d}" height="44" fill="${on.has(i) ? '#8FD19E' : '#fff'}" stroke="${INK}" stroke-width="2" data-i="${i}" style="cursor:pointer"/>`).join(''));
    el.querySelectorAll('rect[data-i]').forEach(r => r.addEventListener('click', () => { const i = +r.dataset.i; on.has(i) ? on.delete(i) : on.add(i); draw(); }));
    const n = [...on].filter(i => i < d).length;
    $in(el, '#fo').innerHTML = `색칠한 부분: 전체의 ${fr(n, d)} &nbsp;·&nbsp; 색칠하지 않은 부분: 전체의 ${fr(d - n, d)}<br><span style="color:#5D6C83">${fr(n, d)} + ${fr(d - n, d)} → 합치면 전체(1)</span>`; };
  $in(el, '#fd').addEventListener('input', () => { on = new Set([0]); draw(); }); draw();
} };
const decStripLab = (start = 7) => ({ title: start > 10 ? '1보다 큰 소수를 띠로 알아보기' : '0.1이 몇 개인지 띠로 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>0.1의 개수</label><input type="range" min="1" max="35" value="${start}" id="dn"><span class="v" id="dnv"></span></div><div class="figc" id="df"></div><div class="out" id="do"></div>`;
  const draw = () => { const n = +$in(el, '#dn').value, u = 30, rows = Math.ceil(n / 10) || 1; $in(el, '#dnv').textContent = n;
    let g = ''; for (let r = 0; r < Math.max(rows, 1); r++){ for (let i = 0; i < 10; i++){ const k = r * 10 + i; g += `<rect x="${8 + i * u}" y="${6 + r * (u + 10)}" width="${u}" height="${u}" fill="${k < n ? (r % 2 ? '#FFC48A' : '#8FD19E') : '#fff'}" stroke="${INK}" stroke-width="1.6"/>`; } g += txt(8 + 10 * u + 20, 6 + r * (u + 10) + u / 2, '1', { size: 14, bold: true, fill: '#5D6C83' }); }
    $in(el, '#df').innerHTML = svg(10 * u + 46, rows * (u + 10) + 6, g);
    const w = Math.floor(n / 10), d = n % 10;
    $in(el, '#do').innerHTML = `${fr(1, 10)} = <b>0.1</b> (영 점 일)<br>0.1이 ${n}개 → <b>${w}.${d}</b> ${w ? `(${w}과 0.${d} → ${w === 1 ? '일' : ['', '일', '이', '삼'][w]} 점 ${'영일이삼사오육칠팔구'[d]})` : `(영 점 ${'영일이삼사오육칠팔구'[d]})`}`; };
  $in(el, '#dn').addEventListener('input', draw); draw();
} });
const decLineLab = { title: '수직선에서 두 소수의 크기 비교하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가</label><input type="range" min="0" max="40" value="13" id="la"><span class="v" id="lav"></span><label>나</label><input type="range" min="0" max="40" value="27" id="lb"><span class="v" id="lbv"></span></div><div class="figc" id="lf"></div><div class="out" id="lo"></div>`;
  const draw = () => { const a = +$in(el, '#la').value, b = +$in(el, '#lb').value, W = 400, X = 20, s = W / 40; $in(el, '#lav').textContent = (a / 10).toFixed(1); $in(el, '#lbv').textContent = (b / 10).toFixed(1);
    let g = line(X, 50, X + W, 50, { w: 2.4 }); for (let k = 0; k <= 40; k++) g += line(X + k * s, k % 10 ? 45 : 40, X + k * s, k % 10 ? 55 : 60, { w: k % 10 ? 1 : 2 });
    for (let k = 0; k <= 4; k++) g += txt(X + k * 10 * s, 74, k, { size: 14, bold: true });
    g += `<circle cx="${X + a * s}" cy="50" r="7" fill="${BL}"/>` + txt(X + a * s, 24, '가', { size: 14, bold: true, fill: BL }) + `<circle cx="${X + b * s}" cy="50" r="7" fill="${OR}"/>` + txt(X + b * s, 10, '나', { size: 14, bold: true, fill: OR });
    $in(el, '#lf').innerHTML = svg(W + 40, 84, g);
    const c = a > b ? '&gt;' : a < b ? '&lt;' : '=';
    $in(el, '#lo').innerHTML = `<b>${(a / 10).toFixed(1)} ${c} ${(b / 10).toFixed(1)}</b> · 수직선에서 <b>오른쪽</b>에 있을수록 큰 수<br><span style="color:#5D6C83">0.1이 ${a}개 ${c} 0.1이 ${b}개</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 1. 평면도형 ═════════════ */
add({ key:'3-1-1', title:'평면도형', intro:'선분, 반직선, 직선과 각을 알아보고, 직각을 이용해 직각삼각형, 직사각형, 정사각형의 성질을 탐구해요.',
  prev:'[2-1] 여러 가지 도형 · [2-2] 길이 재기', lessons:[
  { title:'선분, 반직선, 직선', std:['4수03-01'], key:'두 점을 곧게 이은 선 = <b>선분</b>, 한쪽으로 끝없이 = <b>반직선</b>, 양쪽으로 끝없이 = <b>직선</b>',
    body:`<div class="figc" style="flex-direction:column;align-items:center">${G3.lineFig('seg')}${G3.lineFig('ray')}${G3.lineFig('line')}</div>
      <p>위에서부터 선분 ㄱㄴ, 반직선 ㄱㄴ, 직선 ㄱㄴ이에요.</p><div class="warn">⚠️ 반직선은 <b>시작하는 점을 먼저</b> 읽어요. 반직선 ㄱㄴ과 반직선 ㄴㄱ은 서로 달라요!</div><div class="note">💡 선분과 직선은 ㄱㄴ, ㄴㄱ 어느 쪽으로 읽어도 같아요.</div>`,
    lab: lineLab, ex:`<p>점 ㄷ에서 시작하여 점 ㄹ 쪽으로 끝없이 늘인 곧은 선 → <b>반직선 ㄷㄹ</b></p>`, quiz:[['ln-name', 1], ['ln-ray', 2], ['ln-count', 3]] },
  { title:'각', std:['4수03-02'], key:'한 점에서 그은 <b>두 반직선으로 이루어진 도형</b>을 각이라고 해요.',
    body:`<div class="figc">${angFig(55, false)}</div><p>점 ㄴ을 <b>꼭짓점</b>, 반직선 ㄴㄱ과 ㄴㄷ을 <b>변</b>이라고 해요. 이 각을 <b>각 ㄱㄴㄷ</b> 또는 <b>각 ㄷㄴㄱ</b>이라고 읽어요.</p>
      <div class="warn">⚠️ 각의 이름을 쓸 때 <b>꼭짓점은 반드시 가운데</b>에 써요.</div><div class="note">💡 원처럼 곧은 선이 없는 도형에는 각이 없어요. 삼각형에는 각이 3개, 사각형에는 4개!</div>`,
    lab: angleLab, ex:`<p>꼭짓점이 점 ㅁ이고 변이 ㅁㄹ, ㅁㅂ인 각 → <b>각 ㄹㅁㅂ</b> (또는 각 ㅂㅁㄹ)</p>`, quiz:[['ang-name', 1], ['ang-count', 2]] },
  { title:'직각', std:['4수03-02'], key:'종이를 반듯하게 두 번 접었을 때 생기는 각 = <b>직각</b>. 직각은 ⌐ 표시를 해요.',
    body:`<div class="figc">${angFig(90)}</div><p>각 ㄱㄴㄷ은 직각이에요. 삼각자의 직각 부분을 대어 보면 직각인지 알 수 있어요.</p>
      <div class="note">💡 생활 속 직각: 책의 모서리, 칠판의 귀퉁이, 3시와 9시의 시곗바늘</div>`,
    lab: clockRightLab, ex:`<p>시계의 긴바늘이 12, 짧은바늘이 <b>3</b> 또는 <b>9</b>를 가리킬 때 두 바늘이 직각을 이뤄요.</p>`, quiz:[['right-clock', 2], ['right-count', 2]] },
  { title:'직각삼각형', std:['4수03-09'], key:'한 각이 <b>직각</b>인 삼각형을 직각삼각형이라고 해요.',
    body:`<div class="figc" style="gap:16px">${G3.triOnGrid(true)}</div><p>직각삼각형에는 직각이 <b>1개</b> 있어요. 삼각자로 각을 하나씩 대어 확인해 봐요.</p><div class="note">💡 사각형을 대각선으로 자르면 직각삼각형 2개가 생겨요.</div>`,
    lab: triGridLab, ex:`<p>세 각 중 하나가 직각 → <b>직각삼각형</b> / 직각이 없으면 직각삼각형이 아니에요.</p>`, quiz:[['rt-tri', 1], ['rt-tri', 2]] },
  { title:'직사각형', std:['4수03-10'], key:'네 각이 모두 <b>직각</b>인 사각형을 직사각형이라고 해요.',
    body:`<p>직사각형은 <b>마주 보는 두 변의 길이가 같아요</b>.</p>${E('(네 변의 길이의 합) = (가로 + 세로) × 2')}<div class="note">💡 칠판, 교과서, 문의 모양이 직사각형이에요.</div>`,
    lab: rectLab(false), ex:`<p>가로 8 cm, 세로 5 cm인 직사각형의 네 변의 길이의 합 → 8 + 5 + 8 + 5 = <b>26 cm</b></p>`, quiz:[['rect-prop', 2], ['rect-peri', 2]] },
  { title:'정사각형', std:['4수03-10'], key:'네 각이 모두 직각이고 <b>네 변의 길이가 모두 같은</b> 사각형 = 정사각형',
    body:`${tableH([['', '네 각', '네 변'], ['직사각형', '모두 직각', '마주 보는 변끼리 같아요'], ['정사각형', '모두 직각', '<b>모두 같아요</b>']])}<div class="note">💡 정사각형은 네 각이 모두 직각이므로 <b>직사각형이라고 할 수 있어요</b>. 하지만 직사각형은 정사각형이라고 할 수 없어요.</div>`,
    lab: cutLab, ex:`<p>한 변이 7 cm인 정사각형의 네 변의 길이의 합 → 7 × 4 = <b>28 cm</b></p>`, quiz:[['rect-prop', 3], ['sq-cut', 4], ['sq-count', 4]] }
]});

/* ═════════════ 2. 덧셈과 뺄셈 ═════════════ */
add({ key:'3-1-2', title:'덧셈과 뺄셈', intro:'세 자리 수의 덧셈과 뺄셈을 어림하고, 받아올림·받아내림이 있는 계산 원리를 수 모형과 세로셈으로 탐구해요.',
  prev:'[2-1] 세 자리 수 · [2-1] 덧셈과 뺄셈', lessons:[
  { title:'덧셈과 뺄셈을 어림하기', std:['4수01-08'], key:'몇백쯤인지 <b>가까운 몇백</b>으로 어림하면 계산 결과를 쉽게 예상할 수 있어요.',
    body:`<p>298 + 412 → 298은 약 300, 412는 약 400 → 약 <b>700</b></p><div class="note">💡 계산한 뒤 어림한 값과 비교하면 계산이 맞았는지 확인할 수 있어요.</div>`,
    lab: estLab, ex:`<p>612 - 289 → 약 600 - 약 300 → 약 <b>300</b> (실제 323)</p>`, quiz:[['as-est', 1], ['as-est', 2]] },
  { title:'받아올림이 없는 (세 자리 수) + (세 자리 수)', std:['4수01-03'], key:'<b>같은 자리 숫자끼리</b> 더해요: 일은 일끼리, 십은 십끼리, 백은 백끼리',
    body:`${E('324 + 152 = 476')}<p>일의 자리 4 + 2 = 6, 십의 자리 2 + 5 = 7, 백의 자리 3 + 1 = 4</p>`,
    lab: colLab('세로셈으로 한 자리씩 더하기', '+', addGen(0)), ex:`<p>531 + 248 = <b>779</b></p>`, quiz:[['add0', 1]] },
  { title:'받아올림이 있는 (세 자리 수) + (세 자리 수)', std:['4수01-03'], key:'같은 자리의 합이 <b>10이거나 10보다 크면</b> 바로 윗자리로 1을 받아올림해요.',
    body:`${E('268 + 157 = 425')}<p>일: 8 + 7 = 15 → 5를 쓰고 1 받아올림 · 십: 1 + 6 + 5 = 12 → 2를 쓰고 1 받아올림 · 백: 1 + 2 + 1 = 4</p><div class="warn">⚠️ 받아올린 수를 빠뜨리지 않도록 작게 써 두어요.</div>`,
    lab: colLab('받아올림이 있는 덧셈 세로셈', '+', addGen(2)), ex:`<p>476 + 385 = <b>861</b></p>`, quiz:[['add1', 1], ['add2', 2], ['as-word', 2]] },
  { title:'받아내림이 없는 (세 자리 수) - (세 자리 수)', std:['4수01-03'], key:'<b>같은 자리 숫자끼리</b> 빼요.',
    body:`${E('586 - 243 = 343')}`,
    lab: colLab('세로셈으로 한 자리씩 빼기', '-', subGen(0)), ex:`<p>798 - 365 = <b>433</b></p>`, quiz:[['sub0', 1]] },
  { title:'받아내림이 있는 (세 자리 수) - (세 자리 수)', std:['4수01-03'], key:'같은 자리 수끼리 뺄 수 없으면 <b>바로 윗자리에서 10을 받아내림</b>해요.',
    body:`${E('532 - 278 = 254')}<p>일: 2 - 8 X → 십에서 받아내림 12 - 8 = 4 · 십: 2 - 7 X → 백에서 받아내림 12 - 7 = 5 · 백: 4 - 2 = 2</p><div class="warn">⚠️ 받아내림한 자리의 숫자는 1 작아져요! 800 - 145처럼 0이 있으면 백의 자리에서 십, 일까지 차례로 받아내림해요.</div>`,
    lab: colLab('받아내림이 있는 뺄셈 세로셈', '-', subGen(2)), ex:`<p>700 - 256 = <b>444</b></p>`, quiz:[['sub1', 1], ['sub2', 2], ['as-word', 3]] },
  { title:'덧셈과 뺄셈 활용하기', std:['4수01-03'], key:'덧셈과 뺄셈의 <b>관계</b>를 이용하면 □를 구할 수 있어요.',
    body:`<ul><li>□ + 245 = 600 → □ = 600 - 245 = 355</li><li>□ - 128 = 360 → □ = 360 + 128 = 488</li><li>잘못 계산한 문제: 먼저 <b>어떤 수</b>를 구한 다음 바르게 계산해요.</li></ul>`,
    ex:`<p>어떤 수에서 125를 빼야 할 것을 더했더니 540 → 어떤 수 = 540 - 125 = 415 → 바른 계산 415 - 125 = <b>290</b></p>`, quiz:[['as-cmp', 3], ['as-missing', 3], ['as-cards', 4], ['as-wrong', 4], ['as-range', 5]] }
]});

/* ═════════════ 3. 길이와 시간 ═════════════ */
add({ key:'3-1-3', title:'길이와 시간', intro:'1 cm보다 작은 단위(mm)와 1 m보다 큰 단위(km)를 알고, 1분보다 작은 단위(초)로 시간의 덧셈과 뺄셈을 해요.',
  prev:'[2-2] 길이 재기 · [2-2] 시각과 시간', lessons:[
  { title:'1 cm보다 작은 단위', std:['4수03-16'], key:'1 cm를 똑같이 10칸으로 나눈 작은 눈금 한 칸 = <b>1 mm</b> (1 cm = 10 mm)',
    body:`${E('3 cm 7 mm = 37 mm')}<p>3 cm 7 mm는 "3 센티미터 7 밀리미터"라고 읽어요.</p>`,
    lab: rulerLab, ex:`<p>52 mm = <b>5 cm 2 mm</b></p>`, quiz:[['mm-conv', 1], ['len-cmp', 2]] },
  { title:'1 m보다 큰 단위', std:['4수03-16'], key:'1000 m = <b>1 km</b> (1 킬로미터)',
    body:`${E('2 km 300 m = 2300 m')}<div class="warn">⚠️ 2 km 30 m = 2030 m예요. 2300 m와 헷갈리지 않게 자리를 맞춰요!</div>`,
    lab: kmLab, ex:`<p>4050 m = <b>4 km 50 m</b></p>`, quiz:[['km-conv', 1], ['km-conv', 2]] },
  { title:'길이 어림하고 재기', std:['4수03-15'], key:'물건의 길이에 알맞은 <b>단위</b>를 골라 어림해요: mm → cm → m → km',
    body:`<ul><li>짧고 작은 것: <b>mm</b> (개미, 동전 두께)</li><li>손으로 잴 만한 것: <b>cm</b> (연필, 공책)</li><li>몸으로 잴 만한 것: <b>m</b> (교실, 나무 높이)</li><li>먼 거리: <b>km</b> (마을과 마을 사이)</li></ul>`,
    lab: unitPickLab, ex:`<p>길이를 더하거나 뺄 때는 같은 단위끼리: 3 cm 5 mm + 4 cm 8 mm = 7 cm 13 mm = <b>8 cm 3 mm</b></p>`, quiz:[['len-unit', 1], ['len-add', 3]] },
  { title:'1분보다 작은 단위', std:['4수03-13'], key:'초바늘이 작은 눈금 한 칸을 가는 시간 = <b>1초</b>, 60초 = <b>1분</b>',
    body:`${E('2분 15초 = 120초 + 15초 = 135초')}<div class="note">💡 초바늘이 시계를 한 바퀴 도는 데 걸리는 시간 = 60초 = 1분</div>`,
    lab: secLab, ex:`<p>200초 = 180초 + 20초 = <b>3분 20초</b></p>`, quiz:[['sec-conv', 1], ['clock-read', 1], ['sec-word', 3]] },
  { title:'시간의 덧셈', std:['4수03-14'], key:'<b>같은 단위끼리</b> 더하고, 60초가 넘으면 <b>1분으로 받아올림</b>(60분은 1시간)해요.',
    body:`${E('2시 35분 40초 + 1시간 30분 30초 = 4시 6분 10초')}<p>초: 40 + 30 = 70 → 1분 10초 · 분: 1 + 35 + 30 = 66 → 1시간 6분 · 시: 1 + 2 + 1 = 4</p>`,
    lab: timeLab(true), ex:`<p>10시 20분 50초에서 25분 20초 후 → <b>10시 46분 10초</b></p>`, quiz:[['time-add', 2], ['time-dur', 3]] },
  { title:'시간의 뺄셈', std:['4수03-14'], key:'초끼리 뺄 수 없으면 <b>1분 = 60초</b>를 받아내림해요.',
    body:`${E('5시 20분 10초 - 2분 30초 = 5시 17분 40초')}<p>초: 10 - 30 X → 1분 받아내림 70 - 30 = 40 · 분: 19 - 2 = 17</p><div class="warn">⚠️ (시각) - (시각) = 시간, (시각) - (시간) = 시각이에요.</div>`,
    lab: timeLab(false), ex:`<p>3시 10분 5초에 끝난 영화가 1시간 25분 30초 동안 상영 → 시작 <b>1시 44분 35초</b></p>`, quiz:[['time-sub', 2], ['time-dur', 4], ['time-start', 4]] }
]});

/* ═════════════ 4. 나눗셈 ═════════════ */
add({ key:'3-1-4', title:'나눗셈', intro:'똑같이 나누는 상황과 똑같이 묶어 덜어 내는 상황으로 나눗셈을 이해하고, 곱셈구구로 몫을 구해요.',
  prev:'[2-2] 곱셈구구', lessons:[
  { title:'똑같이 나누기', std:['4수01-05'], key:'○를 ●명에게 <b>똑같이 나누면</b> 한 명에게 몇 개씩? → ○ ÷ ●',
    body:`${E('12 ÷ 3 = 4')}<p>"12 나누기 3은 4와 같습니다." 12는 <b>나누어지는 수</b>, 3은 <b>나누는 수</b>, 4는 12를 3으로 나눈 <b>몫</b>이에요.</p>`,
    lab: shareLab(false), ex:`<p>귤 15개를 5명에게 똑같이 → 15 ÷ 5 = <b>3개씩</b></p>`, quiz:[['dv-share', 1]] },
  { title:'똑같이 묶어 덜어 내기', std:['4수01-05'], key:'○에서 ●씩 몇 번 덜어 낼 수 있을까? → 이것도 ○ ÷ ●',
    body:`${E('12 - 4 - 4 - 4 = 0 → 12 ÷ 4 = 3')}<p>12에서 4씩 <b>3번</b> 빼면 0이 돼요. 뺄셈식을 나눗셈식으로 나타낼 수 있어요.</p>`,
    lab: shareLab(true), ex:`<p>쿠키 18개를 한 봉지에 6개씩 → 18 ÷ 6 = <b>3봉지</b></p>`, quiz:[['dv-group', 1], ['dv-group', 2]] },
  { title:'곱셈과 나눗셈의 관계', std:['4수01-05'], key:'곱셈식 하나로 <b>나눗셈식 2개</b>를 만들 수 있어요.',
    body:`${E('4 × 6 = 24 ⇄ 24 ÷ 4 = 6, 24 ÷ 6 = 4')}`,
    lab: arrayLab, ex:`<p>35 ÷ 7 = 5 → 곱셈식 <b>7 × 5 = 35</b>, <b>5 × 7 = 35</b></p>`, quiz:[['dv-rel', 2], ['dv-missing', 2]] },
  { title:'나눗셈의 몫을 곱셈식으로 구하기', std:['4수01-05'], key:'○ ÷ ● = □ 의 몫은 <b>● × □ = ○</b>에서 찾아요.',
    body:`<p>32 ÷ 8 = □ → 8 × □ = 32 → 8 × 4 = 32 → □ = <b>4</b></p>`,
    lab: gugudanLab, ex:`<p>45 ÷ 9 = □ → 9 × 5 = 45 → <b>5</b></p>`, quiz:[['dv-fact', 1], ['dv-fact', 2], ['dv-cmp', 3]] },
  { title:'곱셈구구로 몫 구하고 활용하기', std:['4수01-05'], key:'나누는 수의 단 곱셈구구에서 <b>나누어지는 수가 곱인 식</b>을 찾으면 몫을 바로 구할 수 있어요.',
    body:`<ul><li>56 ÷ 7 → 7단에서 7 × 8 = 56 → 몫 8</li><li>생활 문제: "똑같이 나누어", "몇 개씩", "며칠 동안" → 나눗셈</li></ul>`,
    ex:`<p>공책이 6권씩 4묶음, 3명에게 똑같이 → 6 × 4 = 24, 24 ÷ 3 = <b>8권</b></p>`, quiz:[['dv-word', 3], ['dv-two', 4], ['dv-missing', 3]] }
]});

/* ═════════════ 5. 곱셈 ═════════════ */
add({ key:'3-1-5', title:'곱셈', intro:'(몇십) × (몇), (몇십몇) × (몇)의 계산 원리를 수 모형으로 탐구하고, 올림이 있는 곱셈을 해요.',
  prev:'[2-2] 곱셈구구 · [3-1] 덧셈과 뺄셈', lessons:[
  { title:'(몇십) × (몇)', std:['4수01-04'], key:'(몇) × (몇)을 계산한 다음 <b>0을 하나 붙여요</b>.',
    body:`${E('30 × 4 = 120')}<p>3 × 4 = 12 → 십 모형이 12개 → 120</p>`,
    lab: tensLab, ex:`<p>50 × 6 = <b>300</b> (5 × 6 = 30에 0을 붙여요)</p>`, quiz:[['mu-tens', 1]] },
  { title:'올림이 없는 (몇십몇) × (몇)', std:['4수01-04'], key:'<b>일의 자리 곱</b>과 <b>십의 자리 곱</b>을 따로 구해 더해요.',
    body:`${E('32 × 3 = 90 + 6 = 96')}<p>2 × 3 = 6 (일), 30 × 3 = 90 (십)</p>`,
    lab: mulBlockLab, ex:`<p>21 × 4 = 80 + 4 = <b>84</b></p>`, quiz:[['mu-nc', 1]] },
  { title:'십의 자리에서 올림이 있는 (몇십몇) × (몇)', std:['4수01-04'], key:'십의 자리 곱이 10이 넘으면 <b>백의 자리</b>에 써요.',
    body:`${E('52 × 4 = 200 + 8 = 208')}<p>50 × 4 = 200, 2 × 4 = 8</p>`,
    lab: colLab('세로셈으로 (몇십몇) × (몇)', '×', () => { let a, b; do { a = ri(31, 94); b = ri(2, 5); } while ((a % 10) * b >= 10 || Math.floor(a / 10) * b < 10); return [a, b]; }, true),
    ex:`<p>73 × 3 = <b>219</b></p>`, quiz:[['mu-nc', 2], ['mu-c1', 2]] },
  { title:'일의 자리에서 올림이 있는 (몇십몇) × (몇)', std:['4수01-04'], key:'일의 자리 곱이 10이 넘으면 <b>십의 자리로 올림</b>한 수를 십의 자리 곱에 더해요.',
    body:`${E('26 × 3 = 78')}<p>6 × 3 = 18 → 8을 쓰고 1을 올림 · 2 × 3 = 6, 6 + 1 = 7</p><div class="warn">⚠️ 올림한 수를 더하는 것을 잊지 마세요!</div>`,
    lab: colLab('올림이 있는 곱셈 세로셈', '×', () => { let a, b; do { a = ri(13, 49); b = ri(2, 4); } while ((a % 10) * b < 10 || a * b > 99); return [a, b]; }, true),
    ex:`<p>18 × 5 = <b>90</b></p>`, quiz:[['mu-c1', 2], ['mu-word', 2]] },
  { title:'십, 일의 자리에서 올림이 있는 (몇십몇) × (몇)', std:['4수01-04', '4수01-08'], key:'일의 자리에서 올림한 수를 더하고, 그 결과가 10이 넘으면 <b>백의 자리</b>에 써요.',
    body:`${E('67 × 4 = 268')}<p>7 × 4 = 28 → 8 쓰고 2 올림 · 6 × 4 = 24, 24 + 2 = 26</p><div class="note">💡 어림하기: 67 × 4 → 약 70 × 4 = 280쯤</div>`,
    lab: colLab('두 번 올림이 있는 곱셈 세로셈', '×', () => { let a, b; do { a = ri(23, 99); b = ri(3, 9); } while ((a % 10) * b < 10 || Math.floor(a / 10) * b < 10); return [a, b]; }, false),
    ex:`<p>48 × 7 = <b>336</b></p>`, quiz:[['mu-c2', 2], ['mu-est', 3], ['mu-cmp', 3]] },
  { title:'곱셈 활용하기', std:['4수01-04'], key:'"몇 개씩 몇 묶음"은 곱셈! 곱셈과 나눗셈의 관계로 □도 구해요.',
    body:`<ul><li>□ × 4 = 92 → □ = 23 (23 × 4 = 92)</li><li>수 카드로 가장 큰 곱 만들기: 가장 큰 수를 <b>곱하는 수(한 자리)</b>에 놓아요.</li></ul>`,
    ex:`<p>어떤 수에 6을 곱해야 할 것을 더했더니 40 → 어떤 수 34 → 34 × 6 = <b>204</b></p>`, quiz:[['mu-missing', 3], ['mu-two', 4], ['mu-cards', 5], ['mu-wrong', 5]] }
]});

/* ═════════════ 6. 분수와 소수 ═════════════ */
add({ key:'3-1-6', title:'분수와 소수', intro:'전체를 똑같이 나누어 분수로 나타내고, 분수의 크기를 비교해요. 분모가 10인 분수를 소수로 나타내고 소수의 크기를 비교해요.',
  prev:'[2-2] 길이 재기 · [3-1] 나눗셈', lessons:[
  { title:'똑같이 나누기', std:['4수01-09'], key:'나누어진 조각의 <b>모양과 크기가 모두 같아야</b> 똑같이 나눈 거예요.',
    body:`<p>피자를 친구들과 나눌 때 조각의 크기가 다르면 공평하지 않겠죠? 분수는 <b>똑같이 나누었을 때만</b> 쓸 수 있어요.</p>`,
    lab: pieLab, ex:`<p>정사각형을 대각선 두 개로 자르면 → 크기가 같은 삼각형 4조각 → <b>똑같이 넷으로 나눈 것</b></p>`, quiz:[['fr-equal', 1]] },
  { title:'분수 알아보기', std:['4수01-09'], key:'전체를 똑같이 ●로 나눈 것 중의 ▲ = ▲/● (<b>●분의 ▲</b>)',
    body:`${E(`${fr(2, 5)} → 분모 5, 분자 2`)}<p>가로선 아래쪽 수 = <b>분모</b> (똑같이 나눈 수), 위쪽 수 = <b>분자</b> (그중 몇 개)</p>`,
    lab: fracBarLab, ex:`<p>전체를 똑같이 8로 나눈 것 중의 3 → <b>${fr(3, 8)}</b> (8분의 3)</p>`, quiz:[['fr-read', 1], ['fr-rest', 2]] },
  { title:'단위분수와 분수의 크기 비교', std:['4수01-11'], key:'분자가 1인 분수 = <b>단위분수</b>. 단위분수는 <b>분모가 작을수록</b> 커요.',
    body:`${E(`${fr(1, 3)} &gt; ${fr(1, 5)} &nbsp;&nbsp; ${fr(4, 7)} &gt; ${fr(2, 7)}`)}<p>분모가 같은 분수는 <b>분자가 클수록</b> 커요 (단위분수가 더 많이 있으니까!).</p>`,
    lab: unitCmpLab, ex:`<p>${fr(1, 4)}, ${fr(1, 9)}, ${fr(1, 6)} 중 가장 큰 분수 → <b>${fr(1, 4)}</b></p>`, quiz:[['unit-cmp', 2], ['same-cmp', 2], ['fr-order', 3], ['unit-range', 4]] },
  { title:'1보다 작은 소수', std:['4수01-12'], key:`${fr(1, 10)} = <b>0.1</b> (영 점 일). ${fr(1, 10)}, ${fr(2, 10)}, … ${fr(9, 10)} = 0.1, 0.2, … 0.9`,
    body:`<p>0.1, 0.2와 같은 수를 <b>소수</b>, "."을 <b>소수점</b>이라고 해요.</p><div class="note">💡 1 mm = 0.1 cm → 7 mm = 0.7 cm</div>`,
    lab: decStripLab(7), ex:`<p>${fr(6, 10)} = <b>0.6</b> (영 점 육)</p>`, quiz:[['dec-read', 1], ['dec-mm', 2]] },
  { title:'1보다 큰 소수', std:['4수01-12'], key:'2와 0.4만큼 = <b>2.4</b> (이 점 사). 0.1이 24개인 수예요.',
    body:`${E('4 cm 3 mm = 4.3 cm')}<p>자연수 부분 + 소수 부분으로 생각해요.</p>`,
    lab: decStripLab(24), ex:`<p>0.1이 37개 → <b>3.7</b></p>`, quiz:[['dec-count', 2], ['dec-mm', 3]] },
  { title:'소수의 크기 비교', std:['4수01-14'], key:'<b>자연수 부분</b>을 먼저 비교하고, 같으면 <b>소수 부분</b>을 비교해요.',
    body:`${E('2.7 &lt; 3.1 &nbsp;&nbsp; 4.6 &gt; 4.2')}<div class="note">💡 0.1이 몇 개인지 세어 비교해도 돼요: 2.7은 27개, 3.1은 31개</div>`,
    lab: decLineLab, ex:`<p>5.□ &gt; 5.6 → □에 들어갈 수 있는 수: <b>7, 8, 9</b></p>`, quiz:[['dec-cmp', 2], ['dec-cmp', 3], ['dec-digit', 4]] }
]});
})();
