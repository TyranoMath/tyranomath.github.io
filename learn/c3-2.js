/* =========================================================
   🦖 개념 탐험대 — 3학년 2학기 (2022 개정 교육과정)
   단원 순서: 1 곱셈 · 2 나눗셈 · 3 원 · 4 들이와 무게 · 5 분수 · 6 그림그래프
   quiz: [실력 진단소 문항 id, 난이도] — 확인 문제는 실력 진단소(g3-2.js)와 같은 방식으로 새로 만들어져요.
   ========================================================= */
(function(){
'use strict';
const L = window.TM_LEARN = window.TM_LEARN || { units: {} };
const A = window.TM_ASSESS, T = window.TM_L3;
const { fr, svg, txt, line, range, tableH, ri } = A;
const { blocks, colLab, P, RO } = T;
const E = s => `<div class="expr">${s}</div>`;
const add = u => { L.units[u.key] = u; };
const $in = (el, s) => el.querySelector(s);
const press = (el, sel, btn) => el.querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === btn));
const INK = '#22314A', GR = '#4CB963', OR = '#FF9F43', BL = '#4A90D9';
const GRAY = '#5D6C83';

/* ═════════════ 1. 곱셈 실험실 ═════════════ */
const ds = n => String(n).split('').map(Number);
const m3Gen = mode => () => { let a, b; do { a = ri(111, 899); b = ri(2, 9);
    const c = ds(a).reverse().reduce((s, x, i, arr) => { const v = x * b + s.cr; return { cr: Math.floor(v / 10), n: s.n + (v >= 10 && i < arr.length - 1 ? 1 : 0) }; }, { cr: 0, n: 0 }).n;
    if (mode === 0 && c === 0 && a * b < 1000) break; if (mode === 1 && c === 1 && a * b < 1000) break; if (mode === 2 && c >= 2) break; } while (true); return [a, b]; };
const tensTensLab = { title: '(몇십) × (몇십)은 (몇) × (몇)에 0을 두 개', init(el){
  el.innerHTML = `<div class="ctrl"><label>첫째 수</label><input type="range" min="1" max="9" value="3" id="ta"><span class="v" id="tav"></span><label>둘째 수</label><input type="range" min="1" max="9" value="4" id="tb"><span class="v" id="tbv"></span><button class="tbtn" type="button" id="tm" aria-pressed="false">(몇십몇) × (몇십)</button></div><div class="figc" id="tf"></div><div class="out" id="to"></div>`;
  let mix = false;
  const draw = () => { const a = +$in(el, '#ta').value, b = +$in(el, '#tb').value, A1 = mix ? a * 10 + 3 : a * 10, B1 = b * 10, s = 4;
    $in(el, '#tav').textContent = A1; $in(el, '#tbv').textContent = B1;
    let g = `<rect x="10" y="10" width="${A1 * s}" height="${B1 * s}" fill="#DFF5E1" stroke="${INK}" stroke-width="2"/>`;
    for (let i = 1; i < A1 / 10; i++) g += line(10 + i * 40, 10, 10 + i * 40, 10 + B1 * s, { stroke: '#7FBF8A', w: 1.2 });
    for (let j = 1; j < b; j++) g += line(10, 10 + j * 40, 10 + A1 * s, 10 + j * 40, { stroke: '#7FBF8A', w: 1.2 });
    $in(el, '#tf').innerHTML = svg(A1 * s + 20, B1 * s + 20, g);
    $in(el, '#to').innerHTML = mix ? `${A1} × ${b} = ${A1 * b} → <b>${A1} × ${B1} = ${A1 * b}0 = ${A1 * B1}</b><br><span style="color:${GRAY}">(몇십몇) × (몇)의 곱에 0을 하나 붙여요.</span>`
      : `${a} × ${b} = ${a * b} → 10 × 10 = 100짜리 칸이 ${a * b}개 → <b>${A1} × ${B1} = ${A1 * B1}</b><br><span style="color:${GRAY}">(몇) × (몇)의 곱에 0을 <b>두 개</b> 붙여요.</span>`;
  };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#tm').addEventListener('click', e => { mix = !mix; e.target.setAttribute('aria-pressed', mix); draw(); }); draw();
} };
const areaLab = one => ({ title: one ? '(몇) × (몇십몇)을 직사각형으로 나누어 계산하기' : '(몇십몇) × (몇십몇)을 네 부분으로 나누어 계산하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>가로(곱해지는 수)</label><input type="range" min="${one ? 2 : 11}" max="${one ? 9 : 39}" value="${one ? 6 : 24}" id="aa"><span class="v" id="aav"></span><label>세로(곱하는 수)</label><input type="range" min="11" max="${one ? 49 : 29}" value="${one ? 23 : 16}" id="ab"><span class="v" id="abv"></span></div><div class="figc" id="af"></div><div class="out" id="ao"></div>`;
  const draw = () => { const a = +$in(el, '#aa').value, b = +$in(el, '#ab').value; $in(el, '#aav').textContent = a; $in(el, '#abv').textContent = b;
    const at = Math.floor(a / 10) * 10, ao = a % 10, bt = Math.floor(b / 10) * 10, bo = b % 10, s = one ? 8 : 6;
    const W = a * s, H = b * s, X = 40, Y = 30, C = ['#BFE3FF', '#D9F2DC', '#FFE7A8', '#FFD7DE'];
    let g = '', parts = [];
    const cell = (x, y, w, h, v, lab, col) => { if (!w || !h) return; g += `<rect x="${X + x * s}" y="${Y + y * s}" width="${w * s}" height="${h * s}" fill="${col}" stroke="${INK}" stroke-width="1.8"/>` + txt(X + (x + w / 2) * s, Y + (y + h / 2) * s, v, { size: 13, bold: true }); parts.push([lab, v]); };
    cell(0, 0, at, bt, at * bt, `${at} × ${bt}`, C[0]); cell(at, 0, ao, bt, ao * bt, `${ao} × ${bt}`, C[1]); cell(0, bt, at, bo, at * bo, `${at} × ${bo}`, C[2]); cell(at, bt, ao, bo, ao * bo, `${ao} × ${bo}`, C[3]);
    if (at) g += txt(X + at * s / 2, Y - 12, at, { size: 13, fill: GRAY }); if (ao) g += txt(X + (at + ao / 2) * s, Y - 12, ao, { size: 13, fill: GRAY });
    g += txt(X - 16, Y + bt * s / 2, bt, { size: 13, fill: GRAY }); if (bo) g += txt(X - 16, Y + (bt + bo / 2) * s, bo, { size: 13, fill: GRAY });
    $in(el, '#af').innerHTML = svg(W + X + 20, H + Y + 14, g);
    $in(el, '#ao').innerHTML = parts.map(p => `${p[0]} = ${p[1]}`).join(' · ') + `<br><b>${a} × ${b} = ${parts.map(p => p[1]).join(' + ')} = ${a * b}</b>` + (!one ? `<br><span style="color:${GRAY}">세로셈: ${a} × ${bo} = ${a * bo}, ${a} × ${bt} = ${a * bt} → ${a * bo} + ${a * bt} = ${a * b}</span>` : ''); };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });

/* ═════════════ 2. 나눗셈 실험실 ═════════════ */
const rod = (n, col = '#BFE3FF') => n ? svg(n * 9 + 2, 48, range(0, n - 1).map(i => `<rect x="${1 + i * 9}" y="2" width="6" height="44" fill="${col}" stroke="${INK}" stroke-width="1.2"/>`).join('')) : '';
const cubes = (n, col = '#BFE3FF') => n ? svg(Math.ceil(n / 5) * 9 + 2, 48, range(0, n - 1).map(i => `<rect x="${1 + Math.floor(i / 5) * 9}" y="${38 - (i % 5) * 9}" width="7" height="7" fill="${col}" stroke="${INK}" stroke-width="1.1"/>`).join('')) : '';
const divBlockLab = { title: '수 모형을 똑같이 나누어 몫과 나머지 구하기', init(el){
  el.innerHTML = `<div class="ctrl"><label>나누어지는 수</label><input type="range" min="10" max="99" value="52" id="dn"><span class="v" id="dnv"></span><label>나누는 수</label><input type="range" min="2" max="6" value="4" id="db"><span class="v" id="dbv"></span></div>
    <div class="ctrl"><button class="tbtn" type="button" id="ds">▶ 다음 단계</button><button class="tbtn" type="button" id="dr">↺ 처음부터</button></div><div id="dv"></div><div class="out" id="do"></div>`;
  let k = 0;
  const draw = () => { const n = +$in(el, '#dn').value, b = +$in(el, '#db').value, t = Math.floor(n / 10), o = n % 10, qt = Math.floor(t / b), lt = t % b, ones = lt * 10 + o, qo = Math.floor(ones / b), r = ones % b, q = qt * 10 + qo;
    $in(el, '#dnv').textContent = n; $in(el, '#dbv').textContent = b;
    // 단계별 상태: 0 처음, 1 십 모형 나누기, 2 남은 십 모형을 일 모형으로, 3 일 모형 나누기
    const gT = k >= 1 ? qt : 0, gO = k >= 3 ? qo : 0;
    const pileT = k >= 1 ? (k >= 2 ? 0 : lt) : t, pileO = k >= 2 ? (k >= 3 ? r : ones) : o;
    const pile = `<div style="display:flex;justify-content:center;align-items:end;gap:6px;min-height:52px">${rod(pileT)}${cubes(pileO, k >= 2 && pileO > o ? '#FFD7A8' : '#BFE3FF')}${!pileT && !pileO ? `<span style="color:${GRAY}">(남은 수 모형 없음)</span>` : ''}</div>`;
    const grp = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:6px">${range(1, b).map(i => `<div style="border:3px solid #BFE6C2;background:#fff;border-radius:14px;padding:4px 8px;min-width:60px;text-align:center"><div style="display:flex;gap:3px;align-items:end;justify-content:center;min-height:50px">${rod(gT)}${cubes(gO)}</div><div style="font-size:13px">${i}모둠</div></div>`).join('')}</div>`;
    $in(el, '#dv').innerHTML = pile + grp;
    const M = [`${n}${P(n, '을', '를')} ${b}모둠으로 똑같이 나누어요. 십 모형 ${t}개, 일 모형 ${o}개`,
      `① 십 모형 ${t}개를 ${b}모둠에 ${qt}개씩 → 몫의 십의 자리 <b>${qt}</b>${lt ? `, 십 모형 ${lt}개가 남아요.` : ''}`,
      lt ? `② 남은 십 모형 ${lt}개를 일 모형 ${lt * 10}개로 바꾸어요 → 일 모형은 모두 <b>${ones}개</b>` : '② 남은 십 모형이 없어요. 일 모형만 나누면 돼요.',
      `③ 일 모형 ${ones}개를 ${b}모둠에 ${qo}개씩 → 몫의 일의 자리 <b>${qo}</b>${r ? `, <b>${r}개가 남아요</b>` : ''}<br>🎉 <b>${n} ÷ ${b} = ${q}${r ? ` … ${r}` : ''}</b> ${r ? `(몫 ${q}, 나머지 ${r})` : '(나누어떨어져요!)'}<br><span style="color:${GRAY}">확인: ${b} × ${q}${r ? ` + ${r}` : ''} = ${n}</span>`];
    $in(el, '#do').innerHTML = M[k]; $in(el, '#ds').disabled = k >= 3; };
  $in(el, '#ds').addEventListener('click', () => { if (k < 3) k++; draw(); });
  $in(el, '#dr').addEventListener('click', () => { k = 0; draw(); });
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { k = 0; draw(); })); draw();
} };
// 나눗셈 세로셈(긴 나눗셈) 단계
const longDivLab = (title, gen) => ({ title, init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="ln">🎲 새 문제</button><button class="tbtn" type="button" id="ls">▶ 다음 단계</button><button class="tbtn" type="button" id="lr">↺ 처음부터</button></div><div id="lt"></div><div class="out" id="lo"></div>`;
  let a, b, S, k;
  const build = () => { const d = ds(a), n = d.length; S = []; let cur = 0, started = false, rows = [], q = [];
    S.push({ q: [], rows: [], hl: -1, msg: `높은 자리부터 차례로 나누어요. ${d[0] < b ? `${d[0]}${P(d[0], '은', '는')} ${b}보다 작으니 ${d[0]}${d[1]}부터 나누어요.` : ''}` });
    for (let i = 0; i < n; i++){ cur = cur * 10 + d[i]; const qd = Math.floor(cur / b);
      if (!started && qd === 0 && i < n - 1) continue;
      q[i] = qd; const p = qd * b, r = cur - p; let m;
      if (qd === 0){ m = `${cur}${P(cur, '은', '는')} ${b}보다 작아요 → 몫에 <b>0</b>을 써요.`;
        if (i < n - 1 && rows.length){ rows[rows.length - 1] = { v: cur * 10 + d[i + 1], e: i + 1 }; } }
      else { rows.push({ v: p, e: i, u: 1 }); rows.push({ v: i < n - 1 ? r * 10 + d[i + 1] : r, e: i < n - 1 ? i + 1 : i, rv: i < n - 1 && !r });
        m = `${cur} ÷ ${b} → 몫 <b>${qd}</b>, ${b} × ${qd} = ${p}, ${cur} - ${p} = ${r}${i < n - 1 ? ` → 다음 자리 ${d[i + 1]}${P(d[i + 1], '을', '를')} 내려 써요` : ''}`; }
      started = true; S.push({ q: q.slice(), rows: rows.map(x => Object.assign({}, x)), hl: i, msg: m }); cur = r;
    }
    const Q = Math.floor(a / b), R = a % b, last = S[S.length - 1];
    last.msg += `<br>🎉 <b>${a} ÷ ${b} = ${Q}${R ? ` … ${R}` : ''}</b> &nbsp; <span style="color:${GRAY}">확인: ${b} × ${Q}${R ? ` + ${R}` : ''} = ${a}</span>`; last.done = true; k = 0; draw(); };
  const draw = () => { const s = S[k], d = ds(a), n = d.length;
    const td = (v, st = '') => `<td style="width:1.1em;height:1.2em;text-align:center;${st}">${v ?? ''}</td>`;
    const rowCells = (v, e, extra = '') => { const str = String(v), st = e - str.length + 1; return range(0, n - 1).map(i => td(i >= st && i <= e ? str[i - st] : '', (i === s.hl ? 'background:#FFE38A;' : '') + extra)).join(''); };
    let h = '<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(26px,3.8vw,36px);margin:4px auto">';
    h += '<tr>' + td('') + range(0, n - 1).map(i => td(s.q[i] ?? '', 'color:#2F8A47;' + (i === s.hl ? 'background:#FFE38A;' : ''))).join('') + '</tr>';
    h += '<tr>' + td(b, `border-right:3px solid ${INK};padding-right:4px`) + range(0, n - 1).map(i => td(d[i], `border-top:3px solid ${INK};` + (i === s.hl ? 'background:#FFE38A;' : ''))).join('') + '</tr>';
    s.rows.forEach(r => { h += '<tr>' + td('') + rowCells(r.v, r.e, r.u ? `border-bottom:2px solid ${INK};` : '') + '</tr>'; });
    $in(el, '#lt').innerHTML = h + '</table>'; $in(el, '#lo').innerHTML = s.msg; $in(el, '#ls').disabled = !!s.done; };
  $in(el, '#ln').addEventListener('click', () => { [a, b] = gen(); build(); });
  $in(el, '#ls').addEventListener('click', () => { if (k < S.length - 1) k++; draw(); });
  $in(el, '#lr').addEventListener('click', () => { k = 0; draw(); });
  [a, b] = gen(); build();
} });
const remLab = { title: '나머지는 나누는 수보다 항상 작아요', init(el){
  el.innerHTML = `<div class="ctrl"><label>나누는 수</label><input type="range" min="2" max="9" value="4" id="rb"><span class="v" id="rbv"></span></div><div class="board" id="rt" style="grid-template-columns:repeat(4,1fr);max-width:520px"></div><div class="out" id="ro"></div>`;
  const draw = () => { const b = +$in(el, '#rb').value; $in(el, '#rbv').textContent = b;
    $in(el, '#rt').innerHTML = range(20, 31).map(n => `<span class="${n % b ? '' : 'ab'}" style="aspect-ratio:auto;padding:6px;font-size:15px">${n} ÷ ${b}<br>= ${Math.floor(n / b)}${n % b ? ` … <b style="color:#E0464A">${n % b}</b>` : ''}</span>`).join('');
    $in(el, '#ro').innerHTML = `${b}${RO(b)} 나누면 나머지는 0, 1, …, <b>${b - 1}</b> 중 하나예요. 나머지가 ${b}${P(b, '이', '가')} 되면 한 번 더 나눌 수 있으니까요!<br><span style="color:${GRAY}">초록 칸: 나머지가 0 → <b>나누어떨어진다</b>고 해요.</span>`; };
  $in(el, '#rb').addEventListener('input', draw); draw();
} };

T.longDivLab = longDivLab;
/* ═════════════ 3. 원 실험실 ═════════════ */
const circleLab = { title: '반지름을 돌려 보며 원의 성질 찾기', init(el){
  el.innerHTML = `<div class="ctrl"><label>반지름</label><input type="range" min="2" max="6" value="4" id="cr"><span class="v" id="crv"></span><label>돌리기</label><input type="range" min="0" max="355" step="5" value="30" id="ca"><button class="tbtn" type="button" id="cd" aria-pressed="false">지름 보기</button><button class="tbtn" type="button" id="cm" aria-pressed="false">반지름 여러 개</button></div><div class="figc" id="cf"></div><div class="out" id="co"></div>`;
  let dia = false, many = false;
  const draw = () => { const r = +$in(el, '#cr').value, a = +$in(el, '#ca').value * Math.PI / 180, u = 22, R = r * u, C = 150;
    $in(el, '#crv').textContent = r + ' cm';
    let g = `<circle cx="${C}" cy="${C}" r="${R}" fill="#EEF6FF" stroke="${INK}" stroke-width="2.6"/>`;
    if (many) for (let k = 0; k < 12; k++){ const b = k * Math.PI / 6; g += line(C, C, C + R * Math.cos(b), C + R * Math.sin(b), { stroke: '#9CC7EE', w: 1.6 }); }
    const ex = C + R * Math.cos(a), ey = C - R * Math.sin(a);
    if (dia) g += line(C - R * Math.cos(a), C + R * Math.sin(a), ex, ey, { stroke: OR, w: 4 }) + txt(C - R * Math.cos(a) * .55, C + R * Math.sin(a) * .55 - 12, '지름', { size: 13, bold: true, fill: OR });
    g += line(C, C, ex, ey, { stroke: '#E0464A', w: 3.4 }) + txt(C + (ex - C) * .5 + 12, C + (ey - C) * .5 - 12, `반지름 ${r} cm`, { size: 13, bold: true, fill: '#E0464A' });
    g += `<circle cx="${C}" cy="${C}" r="5" fill="${INK}"/>` + txt(C + 12, C + 14, 'ㅇ', { size: 14, bold: true }) + `<circle cx="${ex}" cy="${ey}" r="5" fill="#E0464A"/>`;
    $in(el, '#cf').innerHTML = svg(300, 300, g);
    $in(el, '#co').innerHTML = `점 ㅇ: <b>원의 중심</b> · 중심과 원 위의 한 점을 이은 선분: <b>반지름 ${r} cm</b>${dia ? ` · 원의 중심을 지나는 선분: <b>지름 ${2 * r} cm</b>` : ''}<br><span style="color:${GRAY}">${many ? '한 원에서 반지름은 셀 수 없이 많이 그을 수 있고, 길이가 <b>모두 같아요</b>.' : dia ? '지름은 원 안에 그을 수 있는 <b>가장 긴 선분</b>이고, 원을 똑같이 둘로 나눠요. 지름 = 반지름 × 2' : '반지름을 돌려도 길이는 그대로예요!'}</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#cd').addEventListener('click', e => { dia = !dia; e.target.setAttribute('aria-pressed', dia); draw(); });
  $in(el, '#cm').addEventListener('click', e => { many = !many; e.target.setAttribute('aria-pressed', many); draw(); }); draw();
} };
const compassLab = { title: '컴퍼스를 벌리고 돌려 원 그리기', init(el){
  el.innerHTML = `<div class="ctrl"><label>컴퍼스 벌리기</label><input type="range" min="1" max="5" value="3" id="kr"><span class="v" id="krv"></span><label>돌리기</label><input type="range" min="0" max="360" step="5" value="200" id="ka"><button class="tbtn" type="button" id="kp">▶ 한 바퀴</button></div><div class="figc" id="kf"></div><div class="out" id="ko"></div>`;
  let tm = null;
  const draw = () => { const r = +$in(el, '#kr').value, d = +$in(el, '#ka').value, u = 22, R = r * u, C = 150, CY = 180; $in(el, '#krv').textContent = r + ' cm';
    let g = '';
    const a = d * Math.PI / 180, px = C + R * Math.cos(a - Math.PI / 2 + Math.PI / 2), py = CY - R * Math.sin(a);
    if (d > 0) g += d >= 360 ? `<circle cx="${C}" cy="${CY}" r="${R}" fill="none" stroke="${BL}" stroke-width="3"/>` : `<path d="M${C + R} ${CY} A${R} ${R} 0 ${d > 180 ? 1 : 0} 0 ${px.toFixed(1)} ${py.toFixed(1)}" fill="none" stroke="${BL}" stroke-width="3"/>`;
    const hx = (C + px) / 2, hy = Math.min(CY, py) - 60;
    g += line(C, CY, px, py, { stroke: '#E0464A', w: 1.6, dash: '5 4' }) + txt((C + px) / 2 + 10, (CY + py) / 2 + 12, `${r} cm`, { size: 13, bold: true, fill: '#E0464A' });
    g += line(C, CY, hx, hy, { w: 4, stroke: '#8899AA' }) + line(px, py, hx, hy, { w: 4, stroke: '#8899AA' }) + `<circle cx="${hx}" cy="${hy}" r="7" fill="${OR}"/>` + line(hx, hy, hx, hy - 16, { w: 5, stroke: OR });
    g += `<circle cx="${C}" cy="${CY}" r="4" fill="#E0464A"/><circle cx="${px}" cy="${py}" r="4" fill="${BL}"/>`;
    $in(el, '#kf').innerHTML = svg(300, 310, g);
    $in(el, '#ko').innerHTML = `① 원의 중심이 되는 점을 정해요 → ② 컴퍼스를 <b>반지름 ${r} cm</b>만큼 벌려요 → ③ 침을 중심에 꽂고 한쪽 방향으로 돌려요.<br>${d >= 360 ? `🎉 반지름 ${r} cm, 지름 <b>${2 * r} cm</b>인 원 완성!` : `${d}° 돌렸어요.`}`; };
  $in(el, '#kp').addEventListener('click', () => { clearInterval(tm); $in(el, '#ka').value = 0; tm = setInterval(() => { if (!el.isConnected) return clearInterval(tm); const s = $in(el, '#ka'); s.value = Math.min(360, +s.value + 10); draw(); if (+s.value >= 360) clearInterval(tm); }, 40); });
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };
const patternLab = { title: '원의 중심과 반지름을 바꾸어 여러 가지 모양 그리기', init(el){
  const PT = [['중심 같게, 반지름만 늘리기', '원의 중심은 그대로, 반지름이 1칸씩 늘어나요 → 과녁 모양'], ['반지름 같게, 중심을 오른쪽으로', '반지름은 그대로, 중심이 반지름만큼씩 옮겨 가요'], ['중심과 반지름 모두 바꾸기', '중심이 오른쪽으로 옮겨 가고 반지름도 1칸씩 늘어나요'], ['꽃 모양', '큰 원 위의 점을 중심으로 같은 크기의 원을 그려요']];
  el.innerHTML = `<div class="ctrl">${PT.map((p, i) => `<button class="tbtn" type="button" data-p="${i}" aria-pressed="${!i}">${p[0]}</button>`).join('')}</div><div class="ctrl"><label>원의 수</label><input type="range" min="2" max="6" value="4" id="pn"><span class="v" id="pnv"></span></div><div class="figc" id="pf"></div><div class="out" id="po"></div>`;
  let m = 0; const C = ['#4A90D9', '#4CB963', '#FF9F43', '#FF7EB6', '#9B6BD6', '#E0464A'];
  const draw = () => { const n = +$in(el, '#pn').value, u = 14; $in(el, '#pnv').textContent = n; let g = '', W = 340, H = 200;
    for (let i = 0; i < n; i++){ let cx, cy = 100, r;
      if (m === 0){ cx = 170; r = (i + 1) * u; } else if (m === 1){ r = 2 * u; cx = 40 + i * 2 * u; } else if (m === 2){ r = (i + 1) * u * .8; cx = 40 + i * u * 2.4; } else { const b = i * 2 * Math.PI / n; r = 2.5 * u; cx = 170 + 2.5 * u * Math.cos(b); cy = 100 + 2.5 * u * Math.sin(b); }
      g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C[i]}" stroke-width="2.6"/><circle cx="${cx}" cy="${cy}" r="3" fill="${C[i]}"/>`; }
    if (m === 3) g += `<circle cx="170" cy="100" r="${2.5 * u}" fill="none" stroke="#9AA6B6" stroke-dasharray="5 4" stroke-width="1.6"/>`;
    $in(el, '#pf').innerHTML = svg(W, H, g); $in(el, '#po').innerHTML = `<b>규칙</b>: ${PT[m][1]}`; };
  el.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { m = +b.dataset.p; press(el, '[data-p]', b); draw(); }));
  $in(el, '#pn').addEventListener('input', draw); draw();
} };

/* ═════════════ 4. 들이와 무게 실험실 ═════════════ */
const beakerLab = { title: '1 L 비커에 물을 부으며 L와 mL 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>물의 양</label><input type="range" min="0" max="3900" step="50" value="1350" id="bv"><span class="v" id="bvv"></span></div><div class="figc" id="bf"></div><div class="out" id="bo"></div>`;
  const draw = () => { const v = +$in(el, '#bv').value, n = Math.max(1, Math.ceil(v / 1000)); $in(el, '#bvv').textContent = v + ' mL';
    let g = ''; for (let i = 0; i < n; i++){ const x = 14 + i * 96, f = Math.min(1000, v - i * 1000), h = 150, fy = 20 + h * (1 - f / 1000);
      g += `<rect x="${x}" y="${fy}" width="70" height="${h * f / 1000}" fill="#9CD3F5"/>`;
      for (let k = 1; k < 10; k++) g += line(x + 46, 20 + h * k / 10, x + 70, 20 + h * k / 10, { w: k === 5 ? 1.8 : 1 });
      g += txt(x + 30, 20 + h * .5, '500', { size: 10, fill: GRAY }) + `<path d="M${x} 14 L${x} ${20 + h} L${x + 70} ${20 + h} L${x + 70} 14" fill="none" stroke="${INK}" stroke-width="2.6"/>` + txt(x + 35, 188, f >= 1000 ? '1 L' : `${f} mL`, { size: 13, bold: true }); }
    $in(el, '#bf').innerHTML = svg(n * 96 + 20, 200, g);
    const Lp = Math.floor(v / 1000), m = v % 1000;
    $in(el, '#bo').innerHTML = `1 L = <b>1000 mL</b> &nbsp;·&nbsp; ${v} mL = ${Lp ? `<b>${Lp} L</b> ` : ''}${m || !Lp ? `<b>${m} mL</b>` : ''}${Lp && m ? ` <span style="color:${GRAY}">(${Lp} 리터 ${m} 밀리리터)</span>` : ''}`; };
  $in(el, '#bv').addEventListener('input', draw); draw();
} };
const scaleLab = { title: '저울 눈금 읽고 kg과 g 알아보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>올린 물건</label><input type="range" min="0" max="4000" step="50" value="1700" id="sv"><span class="v" id="svv"></span></div><div class="figc" id="sf"></div><div class="out" id="so"></div>`;
  const draw = () => { const v = +$in(el, '#sv').value, C = 130, CY = 130, R = 100; $in(el, '#svv').textContent = v + ' g';
    let g = `<rect x="40" y="18" width="180" height="16" rx="6" fill="#C9D3E0" stroke="${INK}" stroke-width="2"/><rect x="110" y="34" width="40" height="14" fill="#C9D3E0" stroke="${INK}" stroke-width="2"/><circle cx="${C}" cy="${CY}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < 40; k++){ const a = k / 40 * 2 * Math.PI - Math.PI / 2; g += line(C + (k % 10 ? 88 : 80) * Math.cos(a), CY + (k % 10 ? 88 : 80) * Math.sin(a), C + 97 * Math.cos(a), CY + 97 * Math.sin(a), { w: k % 10 ? 1 : 2.6 }); }
    for (let k = 0; k < 4; k++){ const a = k / 4 * 2 * Math.PI - Math.PI / 2; g += txt(C + 66 * Math.cos(a), CY + 66 * Math.sin(a), `${k} kg`, { size: 14, bold: true }); }
    const a = v / 4000 * 2 * Math.PI - Math.PI / 2; g += line(C, CY, C + 86 * Math.cos(a), CY + 86 * Math.sin(a), { stroke: '#E0464A', w: 3 }) + `<circle cx="${C}" cy="${CY}" r="6" fill="#E0464A"/>`;
    g += `<text x="${C}" y="16" font-size="${v ? 18 + Math.min(v / 200, 14) : 0}" text-anchor="middle">🍉</text>`;
    $in(el, '#sf').innerHTML = svg(260, 240, g);
    const k = Math.floor(v / 1000), m = v % 1000;
    $in(el, '#so').innerHTML = `작은 눈금 한 칸 = 100 g · 1 kg = <b>1000 g</b><br>${v} g = ${k ? `<b>${k} kg</b> ` : ''}${m || !k ? `<b>${m} g</b>` : ''}<br><span style="color:${GRAY}">1000 kg = <b>1 t</b> (1 톤) — 자동차, 코끼리처럼 아주 무거운 것</span>`; };
  $in(el, '#sv').addEventListener('input', draw); draw();
} };
const pickLab = (title, Q, units) => ({ title, init(el){
  let i = 0;
  el.innerHTML = `<div class="out" id="uq" style="font-size:21px"></div><div class="ctrl" id="uc"></div><div class="out" id="uo"></div><div class="ctrl"><button class="tbtn" type="button" id="un">다음 ▶</button></div>`;
  const show = () => { const [obj, ok, alts] = Q[i]; $in(el, '#uq').innerHTML = `<b>${obj}</b>에 가장 알맞은 것은?`; $in(el, '#uo').innerHTML = '';
    const opts = [ok, ...alts].sort(); $in(el, '#uc').innerHTML = opts.map(o => `<button class="tbtn" type="button" data-o="${o}">${o}</button>`).join('');
    el.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => { press(el, '[data-o]', b); $in(el, '#uo').innerHTML = b.dataset.o === ok ? `⭕ 정답! <b>${ok}</b>` : `❌ 다시 생각해 봐요. ${units}`; })); };
  $in(el, '#un').addEventListener('click', () => { i = (i + 1) % Q.length; show(); }); show();
} });
const capQ = [['🥛 우유갑(작은 것)', '약 200 mL', ['약 2 L', '약 20 mL']], ['🪣 양동이', '약 10 L', ['약 10 mL', '약 100 mL']], ['🥄 숟가락', '약 15 mL', ['약 15 L', '약 150 mL']], ['🛁 욕조', '약 200 L', ['약 200 mL', '약 2 L']], ['🧴 생수병(큰 것)', '약 2 L', ['약 2 mL', '약 20 L']], ['☕ 종이컵', '약 180 mL', ['약 18 mL', '약 18 L']]];
const wQ = [['🍎 사과 한 개', '약 300 g', ['약 3 kg', '약 30 g']], ['🎒 책가방', '약 3 kg', ['약 3 g', '약 300 kg']], ['🐘 코끼리', '약 5 t', ['약 5 kg', '약 500 g']], ['🧒 3학년 학생', '약 30 kg', ['약 3 t', '약 300 g']], ['✏️ 연필 한 자루', '약 5 g', ['약 5 kg', '약 500 g']], ['🚚 트럭', '약 8 t', ['약 8 kg', '약 80 g']]];
// 두 단위(1000 받아올림) 세로셈
const mixLab = (title, U, plus) => ({ title, init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="xn">🎲 새 문제</button><button class="tbtn" type="button" id="xs">▶ 다음 단계</button></div><div id="xt"></div><div class="out" id="xo"></div>`;
  let a, b, S, k;
  const fresh = () => { const m = () => ri(1, 19) * 50;
    if (plus){ a = [ri(100, 950), ri(1, 5)]; b = [ri(100, 950), ri(1, 4)]; if (a[0] + b[0] < 1000) a[0] = Math.min(950, 1000 - b[0] + ri(1, 9) * 50); }
    else { a = [ri(100, 600), ri(4, 9)]; b = [ri(a[0] + 50, 950), ri(1, 3)]; }
    a[0] = Math.round(a[0] / 50) * 50 || 50; b[0] = Math.round(b[0] / 50) * 50 || 50; if (!plus && b[0] <= a[0]) b[0] = Math.min(950, a[0] + 100); void m;
    S = []; const top = [], res = [];
    const snap = (hl, msg) => S.push({ top: top.slice(), res: res.slice(), hl, msg });
    snap(-1, `<b>같은 단위끼리</b> 계산해요. ${U[0]}부터!`);
    if (plus){ const s0 = a[0] + b[0]; let c = 0; if (s0 >= 1000){ res[0] = s0 - 1000; c = 1; top[1] = '+1'; } else res[0] = s0;
      snap(0, `${U[0]}: ${a[0]} + ${b[0]} = ${s0}${c ? ` → 1000 ${U[0]} = 1 ${U[1]}이므로 <b>1 ${U[1]} 받아올림</b>, ${s0 - 1000} ${U[0]}` : ''}`);
      res[1] = a[1] + b[1] + c; snap(1, `${U[1]}: ${a[1]} + ${b[1]}${c ? ' + 1' : ''} = ${res[1]}`); }
    else { let x0 = a[0], x1 = a[1], m0;
      if (x0 < b[0]){ x0 += 1000; x1 -= 1; top[0] = x0; top[1] = x1; m0 = `${U[0]}: ${a[0]}에서 ${b[0]}${P(b[0], '을', '를')} 뺄 수 없어요 → <b>1 ${U[1]} = 1000 ${U[0]}</b> 받아내림 → ${x0} - ${b[0]} = ${x0 - b[0]}`; }
      else m0 = `${U[0]}: ${x0} - ${b[0]} = ${x0 - b[0]}`;
      res[0] = x0 - b[0]; snap(0, m0); res[1] = x1 - b[1]; snap(1, `${U[1]}: ${x1} - ${b[1]} = ${res[1]}`); }
    S[S.length - 1].msg += ` &nbsp;🎉 <b>${res[1]} ${U[1]} ${res[0]} ${U[0]}</b>`; S[S.length - 1].done = true; k = 0; draw(); };
  const draw = () => { const s = S[k], hl = i => i === s.hl ? 'background:#FFE38A;' : '';
    const td = (v, st = '') => `<td style="padding:2px 12px;text-align:right;${st}">${v ?? ''}</td>`;
    let h = '<table style="border-collapse:collapse;font-family:Fredoka,sans-serif;font-weight:600;font-size:clamp(22px,3.4vw,32px);margin:4px auto">';
    h += '<tr>' + td('') + [1, 0].map(i => td(s.top[i] ?? '', `font-size:.55em;color:#E0464A;${hl(i)}`)).join('') + '</tr>';
    h += '<tr>' + td('') + [1, 0].map(i => td(`${a[i]} <small>${U[i]}</small>`, hl(i) + (!plus && s.top[i] != null ? 'text-decoration:line-through;color:#9AA6B6;' : ''))).join('') + '</tr>';
    h += '<tr>' + td(plus ? '+' : '-') + [1, 0].map(i => td(`${b[i]} <small>${U[i]}</small>`, hl(i))).join('') + '</tr>';
    h += '<tr>' + td('', `border-top:3px solid ${INK}`) + [1, 0].map(i => td(s.res[i] != null ? `${s.res[i]} <small>${U[i]}</small>` : '', `border-top:3px solid ${INK};color:#2F8A47;${hl(i)}`)).join('') + '</tr></table>';
    $in(el, '#xt').innerHTML = h; $in(el, '#xo').innerHTML = s.msg; $in(el, '#xs').disabled = !!s.done; };
  $in(el, '#xn').addEventListener('click', fresh);
  $in(el, '#xs').addEventListener('click', () => { if (k < S.length - 1) k++; draw(); }); fresh();
} });

/* ═════════════ 5. 분수 실험실 ═════════════ */
const divisors = n => range(2, n - 1).filter(d => n % d === 0);
const groupFracLab = len => ({ title: len ? '끈의 길이를 분수만큼 잘라 보기' : '사과를 똑같이 묶어 분수만큼 알아보기', init(el){
  const TOT = len ? [6, 8, 10, 12, 15, 16, 20] : [6, 8, 10, 12, 15, 16, 18, 20, 24];
  el.innerHTML = `<div class="ctrl"><label>${len ? '끈의 길이' : '전체 개수'}</label><input type="range" min="0" max="${TOT.length - 1}" value="3" id="gt"><span class="v" id="gtv"></span></div><div class="ctrl" id="gd"></div><div class="ctrl"><label>분자</label><input type="range" min="1" max="3" value="1" id="gn"><span class="v" id="gnv"></span></div><div class="figc" id="gf"></div><div class="out" id="go"></div>`;
  let d = 4;
  const draw = () => { const n = TOT[+$in(el, '#gt').value], DV = divisors(n); if (!DV.includes(d)) d = DV[Math.min(1, DV.length - 1)];
    $in(el, '#gtv').textContent = n + (len ? ' cm' : '개');
    $in(el, '#gd').innerHTML = '<label>분모(똑같이 나눌 묶음 수)</label>' + DV.map(x => `<button class="tbtn" type="button" data-d="${x}" aria-pressed="${x === d}">${x}</button>`).join('');
    el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { d = +b.dataset.d; draw(); }));
    const nI = $in(el, '#gn'); nI.max = d; if (+nI.value > d) nI.value = d; const a = +nI.value, per = n / d; $in(el, '#gnv').textContent = a;
    if (len){ const W = 440, s = W / n; let g = '';
      for (let i = 0; i < d; i++) g += `<rect x="${10 + i * per * s}" y="20" width="${per * s}" height="26" rx="4" fill="${i < a ? '#FFB347' : '#FFF4D0'}" stroke="${INK}" stroke-width="1.8"/>`;
      for (let c = 0; c <= n; c++) g += line(10 + c * s, 52, 10 + c * s, c % 5 ? 58 : 62, { w: c % 5 ? 1 : 2 }) + (c % (n > 12 ? 5 : 2) ? '' : txt(10 + c * s, 72, c, { size: 11 }));
      $in(el, '#gf').innerHTML = svg(W + 20, 80, g); }
    else $in(el, '#gf').innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${range(1, d).map(i => `<div style="border:3px solid ${i <= a ? OR : '#BFE6C2'};background:${i <= a ? '#FFF1DE' : '#fff'};border-radius:14px;padding:4px 6px;font-size:22px">${'🍎'.repeat(per)}</div>`).join('')}</div>`;
    $in(el, '#go').innerHTML = `${n}${len ? ' cm를' : P(n, '을', '를')} 똑같이 <b>${d}묶음</b>으로 나누면 1묶음은 ${per}${len ? ' cm' : '개'} → ${n}의 ${fr(1, d)}${P(1, '은', '는')} ${per}<br>${n}의 ${fr(a, d)} = ${fr(1, d)}이 ${a}묶음 = ${per} × ${a} = <b>${per * a}${len ? ' cm' : '개'}</b>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} });
const impLab = { title: '분자를 늘리며 진분수, 가분수, 대분수 살펴보기', init(el){
  el.innerHTML = `<div class="ctrl"><label>분모</label><input type="range" min="2" max="8" value="4" id="id"><span class="v" id="idv"></span><label>분자</label><input type="range" min="1" max="20" value="7" id="in"><span class="v" id="inv"></span></div><div class="figc" id="if"></div><div class="out" id="io"></div>`;
  const draw = () => { const d = +$in(el, '#id').value, nI = $in(el, '#in'); nI.max = 4 * d; if (+nI.value > 4 * d) nI.value = 4 * d; const n = +nI.value;
    $in(el, '#idv').textContent = d; $in(el, '#inv').textContent = n;
    const wholes = Math.max(1, Math.ceil(n / d)), W = 104, u = W / d; let g = '';
    for (let w = 0; w < wholes; w++){ for (let i = 0; i < d; i++){ const k = w * d + i; g += `<rect x="${8 + w * (W + 12) + i * u}" y="8" width="${u}" height="40" fill="${k < n ? (w % 2 ? '#FFC48A' : '#8FD19E') : '#fff'}" stroke="${INK}" stroke-width="1.4"/>`; }
      g += `<rect x="${8 + w * (W + 12)}" y="8" width="${W}" height="40" fill="none" stroke="${INK}" stroke-width="2.6"/>` + txt(8 + w * (W + 12) + W / 2, 62, '1', { size: 12, fill: GRAY }); }
    $in(el, '#if').innerHTML = svg(wholes * (W + 12) + 8, 72, g);
    const q = Math.floor(n / d), r = n % d;
    const kind = n < d ? '<b>진분수</b> (분자 &lt; 분모, 1보다 작아요)' : n === d ? `<b>가분수</b> (분자 = 분모) → ${fr(n, d)} = <b>1</b> (자연수)` : `<b>가분수</b> (분자 &gt; 분모)` + (r ? ` → 대분수로: ${fr(n, d)} = <b>${fr(r, d, q)}</b> (${q}과 ${fr(r, d)})` : ` → ${fr(n, d)} = <b>${q}</b> (자연수)`);
    $in(el, '#io').innerHTML = `${fr(n, d)} = ${fr(1, d)}이 ${n}개 → ${kind}`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw)); draw();
} };

/* ═════════════ 6. 그림그래프 실험실 ═════════════ */
const VIL = ['가', '나', '다', '라'];
const pictoTable = (vals, big, small, ic, unit) => tableH([['마을', `${unit} 수`], ...vals.map((v, i) => [`${VIL[i]} 마을`, `<span style="font-size:24px;letter-spacing:1px">${ic.repeat(Math.floor(v / big))}</span><span style="font-size:14px">${ic.repeat(Math.floor(v % big / small))}</span>`])]);
const pictoLab = { title: '수를 바꾸면 그림그래프가 어떻게 바뀔까?', init(el){
  el.innerHTML = `<div class="ctrl"><button class="tbtn" type="button" id="ps" aria-pressed="false">큰 그림 100 · 작은 그림 10</button></div>${VIL.map((v, i) => `<div class="ctrl"><label>${v} 마을</label><input type="range" min="0" max="59" value="${[34, 52, 27, 41][i]}" data-i="${i}"><span class="v" data-v="${i}"></span></div>`).join('')}
    <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><div id="pt"></div><div id="pg"></div></div><div class="out" id="po"></div>`;
  let big100 = false;
  const draw = () => { const k = big100 ? 10 : 1, vals = [...el.querySelectorAll('input[data-i]')].map(i => +i.value * k), B = 10 * k, S = k, u = big100 ? '그루' : '그루';
    vals.forEach((v, i) => { $in(el, `[data-v="${i}"]`).textContent = v; });
    $in(el, '#pt').innerHTML = tableH([['마을', ...VIL.map(v => v), '합계'], ['나무 수(그루)', ...vals, vals.reduce((s, x) => s + x, 0)]]);
    $in(el, '#pg').innerHTML = pictoTable(vals, B, S, '🌳', '나무') + `<div style="text-align:center;font-size:14px;color:${GRAY}"><span style="font-size:20px">🌳</span> ${B}${u} &nbsp; <span style="font-size:13px">🌳</span> ${S}${u}</div>`;
    const mx = Math.max(...vals), mn = Math.min(...vals);
    $in(el, '#po').innerHTML = `큰 그림 = ${B}${u}, 작은 그림 = ${S}${u} → 예) ${VIL[0]} 마을 ${vals[0]}그루 = 큰 그림 ${Math.floor(vals[0] / B)}개 + 작은 그림 ${Math.floor(vals[0] % B / S)}개<br>가장 많은 마을: <b>${VIL.filter((_, i) => vals[i] === mx).join(', ')} 마을</b> · 가장 적은 마을: <b>${VIL.filter((_, i) => vals[i] === mn).join(', ')} 마을</b><br><span style="color:${GRAY}">큰 그림이 많을수록 수가 커요. 큰 그림 수를 먼저 비교하고, 같으면 작은 그림 수를 비교해요.</span>`; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  $in(el, '#ps').addEventListener('click', e => { big100 = !big100; e.target.setAttribute('aria-pressed', big100); draw(); }); draw();
} };
const surveyLab = { title: '좋아하는 과일을 조사하여 표와 그림그래프로 나타내기', init(el){
  const F = [['🍓', '딸기'], ['🍎', '사과'], ['🍇', '포도'], ['🍌', '바나나']];
  el.innerHTML = `<div class="ctrl">${F.map((f, i) => `<button class="tbtn" type="button" data-f="${i}">${f[0]} ${f[1]}</button>`).join('')}</div><div class="ctrl"><button class="tbtn" type="button" id="sr">🎲 반 친구 28명 조사하기</button><button class="tbtn" type="button" id="sc">↺ 지우기</button></div><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><div id="st"></div><div id="sg"></div></div><div class="out" id="so"></div>`;
  let c = [0, 0, 0, 0];
  const draw = () => { const tot = c.reduce((s, x) => s + x, 0);
    $in(el, '#st').innerHTML = tableH([['과일', ...F.map(f => f[1]), '합계'], ['학생 수(명)', ...c, tot]]);
    $in(el, '#sg').innerHTML = tableH([['과일', '학생 수'], ...F.map((f, i) => [f[1], `<span style="font-size:24px">${'😀'.repeat(Math.floor(c[i] / 5))}</span><span style="font-size:14px">${'😀'.repeat(c[i] % 5)}</span>`])]) + `<div style="text-align:center;font-size:14px;color:${GRAY}"><span style="font-size:20px">😀</span> 5명 &nbsp; <span style="font-size:13px">😀</span> 1명</div>`;
    const mx = Math.max(...c);
    $in(el, '#so').innerHTML = tot ? `가장 많은 학생이 좋아하는 과일: <b>${F.filter((_, i) => c[i] === mx).map(f => f[1]).join(', ')}</b> → 간식으로 준비하면 좋겠어요!<br><span style="color:${GRAY}">자료 수집 → 표로 정리 → 그림의 단위 정하기 → 그림그래프 → 제목 붙이기</span>` : '과일 버튼을 눌러 조사해 보세요.'; };
  el.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { c[+b.dataset.f]++; draw(); }));
  $in(el, '#sr').addEventListener('click', () => { c = [0, 0, 0, 0]; const w = [4, 3, 2, 1].sort(() => Math.random() - .5); for (let i = 0; i < 28; i++){ let r = Math.random() * 10, j = 0; while (r > w[j]){ r -= w[j]; j++; } c[Math.min(j, 3)]++; } draw(); });
  $in(el, '#sc').addEventListener('click', () => { c = [0, 0, 0, 0]; draw(); }); $in(el, '#sr').click();
} };

/* ═════════════ 1. 곱셈 ═════════════ */
add({ key:'3-2-1', title:'곱셈', intro:'(세 자리 수) × (한 자리 수)와 (두 자리 수) × (두 자리 수)의 계산 원리를 탐구하고, 올림이 있는 곱셈을 해요.',
  prev:'[3-1] 곱셈 · [3-1] 덧셈과 뺄셈', lessons:[
  { title:'올림이 없는 (세 자리 수) × (한 자리 수)', std:['4수01-04'], key:'백, 십, 일의 자리를 각각 곱해 <b>더해요</b>.',
    body:`${E('213 × 3 = 600 + 30 + 9 = 639')}<p>수 모형으로 213을 3번 놓으면 백 모형 6개, 십 모형 3개, 일 모형 9개</p>`,
    lab: colLab('세로셈으로 (세 자리 수) × (한 자리 수)', '×', m3Gen(0), true), ex:`<p>302 × 3 = <b>906</b></p>`, quiz:[['m31-nc', 1]] },
  { title:'올림이 한 번 있는 (세 자리 수) × (한 자리 수)', std:['4수01-04'], key:'어느 자리든 곱이 10이 넘으면 <b>윗자리로 올림</b>하고, 윗자리 곱에 더해요.',
    body:`${E('216 × 4 = 864')}<p>6 × 4 = 24 → 4를 쓰고 2를 올림 · 1 × 4 = 4, 4 + 2 = 6 · 2 × 4 = 8</p>`,
    lab: colLab('올림이 한 번 있는 곱셈', '×', m3Gen(1), false), ex:`<p>152 × 3 = <b>456</b></p>`, quiz:[['m31-c', 1], ['m31-c', 2]] },
  { title:'올림이 여러 번 있는 (세 자리 수) × (한 자리 수)', std:['4수01-04'], key:'올림한 수를 <b>빠뜨리지 않고</b> 바로 윗자리 곱에 더해요. 백의 자리 곱이 10이 넘으면 천의 자리까지!',
    body:`${E('457 × 6 = 2742')}<p>7 × 6 = 42 → 2, 올림 4 · 5 × 6 = 30, 30 + 4 = 34 → 4, 올림 3 · 4 × 6 = 24, 24 + 3 = 27</p><div class="note">💡 어림하기: 457 × 6 → 약 500 × 6 = 3000쯤</div>`,
    lab: colLab('올림이 여러 번 있는 곱셈', '×', m3Gen(2), false), ex:`<p>389 × 4 = <b>1556</b></p>`, quiz:[['m31-cc', 2], ['m31-cc', 3], ['m-word', 3]] },
  { title:'(몇십) × (몇십), (몇십몇) × (몇십)', std:['4수01-04'], key:'(몇) × (몇)에 <b>0을 두 개</b>, (몇십몇) × (몇)에 <b>0을 한 개</b> 붙여요.',
    body:`${E('30 × 40 = 1200 &nbsp;&nbsp; 23 × 30 = 690')}<p>3 × 4 = 12 → 1200 · 23 × 3 = 69 → 690</p>`,
    lab: tensTensLab, ex:`<p>60 × 50 = <b>3000</b> (6 × 5 = 30에 0을 두 개)</p>`, quiz:[['m-tens', 1], ['m-tens', 2]] },
  { title:'(몇) × (몇십몇)', std:['4수01-04'], key:'곱하는 두 수의 순서를 바꾸어도 곱은 같아요: 6 × 23 = 23 × 6',
    body:`${E('6 × 23 = 6 × 20 + 6 × 3 = 120 + 18 = 138')}`,
    lab: areaLab(true), ex:`<p>8 × 47 = 320 + 56 = <b>376</b></p>`, quiz:[['m12', 2]] },
  { title:'(몇십몇) × (몇십몇)', std:['4수01-04', '4수01-08'], key:'(몇십몇) × (몇)과 (몇십몇) × (몇십)을 각각 구해 <b>더해요</b>.',
    body:`${E('24 × 16 = 24 × 6 + 24 × 10 = 144 + 240 = 384')}<div class="warn">⚠️ 세로셈에서 24 × 1은 사실 24 × <b>10</b> = 240이에요. 자리를 맞추어 써요!</div><div class="note">💡 어림: 24 × 16 → 약 20 × 20 = 400쯤</div>`,
    lab: areaLab(false), ex:`<p>35 × 27 = 245 + 700 = <b>945</b></p>`, quiz:[['m22', 2], ['m22', 3], ['m-est', 3], ['m-cmp', 3]] },
  { title:'곱셈 활용하기', std:['4수01-04'], key:'"몇씩 몇 번", 하루·시간 단위 바꾸기, 왕복 거리 → <b>곱셈</b>',
    body:`<ul><li>하루는 24시간 → 7월(31일)은 24 × 31 = 744시간</li><li>□ × 4 = 912 → □ = 228</li><li>수 카드 (두 자리) × (두 자리)의 가장 큰 곱: 큰 수 두 개를 <b>십의 자리</b>에 놓고 비교해요.</li></ul>`,
    ex:`<p>한 상자에 귤이 125개씩 6상자 → 125 × 6 = <b>750개</b></p>`, quiz:[['m-time', 4], ['m-missing', 4], ['m-cards', 5]] }
]});

/* ═════════════ 2. 나눗셈 ═════════════ */
add({ key:'3-2-2', title:'나눗셈', intro:'(두 자리 수) ÷ (한 자리 수), (세 자리 수) ÷ (한 자리 수)를 계산하고, 나머지의 뜻과 계산 결과를 확인하는 방법을 알아봐요.',
  prev:'[3-1] 나눗셈 · [3-2] 곱셈', lessons:[
  { title:'(몇십) ÷ (몇)', std:['4수01-06'], key:'60 ÷ 3 → 6 ÷ 3 = 2에 <b>0을 붙여</b> 20. 내림이 있으면 남은 십을 일로 바꾸어 나눠요.',
    body:`${E('60 ÷ 3 = 20 &nbsp;&nbsp; 70 ÷ 5 = 14')}<p>70 ÷ 5: 십 모형 7개를 5묶음에 1개씩, 남은 십 모형 2개 → 일 모형 20개 → 4개씩</p>`,
    lab: divBlockLab, ex:`<p>80 ÷ 4 = <b>20</b> · 90 ÷ 6 = <b>15</b></p>`, quiz:[['d-tens', 1]] },
  { title:'(몇십몇) ÷ (몇)', std:['4수01-06'], key:'<b>십의 자리부터</b> 나누고, 남은 십은 일의 자리로 내려 함께 나눠요.',
    body:`${E('48 ÷ 4 = 12 &nbsp;&nbsp; 52 ÷ 4 = 13')}<p>52 ÷ 4: 5 ÷ 4 = 1 … 1 → 남은 1(십) + 2 = 12 → 12 ÷ 4 = 3</p>`,
    lab: divBlockLab, ex:`<p>84 ÷ 6 = <b>14</b></p>`, quiz:[['d-nb', 1], ['d-nb', 2], ['d-carry', 2]] },
  { title:'나머지가 있는 (몇십몇) ÷ (몇)', std:['4수01-06'], key:'똑같이 나누고 남는 수 = <b>나머지</b>. 나머지가 0이면 <b>나누어떨어진다</b>고 해요.',
    body:`${E('17 ÷ 5 = 3 … 2')}<p>몫은 3, 나머지는 2. "17 나누기 5는 3이고 나머지는 2입니다."</p><div class="warn">⚠️ 나머지는 항상 <b>나누는 수보다 작아야</b> 해요.</div>`,
    lab: remLab, ex:`<p>47 ÷ 3 = <b>15 … 2</b></p>`, quiz:[['d-rem', 2], ['d-remv', 2], ['d-remmax', 4]] },
  { title:'계산 결과가 맞는지 확인하기', std:['4수01-06'], key:'(나누는 수) × (몫) + (나머지) = <b>(나누어지는 수)</b>이면 바르게 계산한 거예요.',
    body:`${E('38 ÷ 7 = 5 … 3 → 7 × 5 = 35, 35 + 3 = 38 ✔')}`,
    lab: longDivLab('세로셈으로 나누고 확인하기', () => { const b = ri(3, 9), q = ri(11, 30), r = ri(0, b - 1); return b * q + r < 100 ? [b * q + r, b] : [ri(40, 99), ri(2, 4)]; }),
    ex:`<p>어떤 수 ÷ 6 = 9 … 4 → 어떤 수 = 6 × 9 + 4 = <b>58</b></p>`, quiz:[['d-check', 3], ['d-remv', 3]] },
  { title:'(세 자리 수) ÷ (한 자리 수)', std:['4수01-06'], key:'백의 자리부터 차례로 나눠요. 백의 자리 수가 나누는 수보다 작으면 <b>앞의 두 자리</b>부터!',
    body:`${E('426 ÷ 3 = 142 &nbsp;&nbsp; 245 ÷ 7 = 35')}<div class="warn">⚠️ 중간에 나눌 수 없는 자리는 몫에 <b>0</b>을 써요: 618 ÷ 6 = 103</div>`,
    lab: longDivLab('세로셈으로 (세 자리 수) ÷ (한 자리 수)', () => { const b = ri(2, 9), n = ri(Math.max(100, b * 12), 999); return [n, b]; }),
    ex:`<p>715 ÷ 4 = <b>178 … 3</b> (확인: 4 × 178 + 3 = 715)</p>`, quiz:[['d-3', 3], ['d-3rem', 3], ['d-3rem', 4]] },
  { title:'나눗셈 활용하기', std:['4수01-06'], key:'남은 것도 모두 담아야 하면 <b>몫 + 1</b>, 남은 것은 버린다면 <b>몫</b>만!',
    body:`<ul><li>학생 29명이 4명씩 보트 → 29 ÷ 4 = 7 … 1 → 보트는 <b>8대</b> 필요</li><li>리본 50 cm로 8 cm 꽃 → 50 ÷ 8 = 6 … 2 → 꽃은 <b>6개</b></li></ul>`,
    ex:`<p>두 자리 수 7□를 4로 나누어떨어지게 → 72, 76 → <b>2개</b></p>`, quiz:[['d-word', 3], ['d-word', 4], ['d-divisible', 5]] }
]});

/* ═════════════ 3. 원 ═════════════ */
add({ key:'3-2-3', title:'원', intro:'원의 중심, 반지름, 지름을 알고 원의 성질을 탐구해요. 컴퍼스로 원을 그리고, 원을 이용해 여러 가지 모양을 그려요.',
  prev:'[2-1] 여러 가지 도형 · [3-1] 평면도형', lessons:[
  { title:'원의 중심과 반지름', std:['4수03-06'], key:'원을 그릴 때 누름 못이 꽂혔던 점 = <b>원의 중심</b>, 중심과 원 위의 한 점을 이은 선분 = <b>반지름</b>',
    body:`<p>띠 종이에 구멍을 뚫고 누름 못으로 고정한 뒤 연필을 돌리면 원이 그려져요. 이때 누름 못과 연필 사이의 거리가 반지름!</p><div class="note">💡 한 원에서 반지름은 무수히 많이 그을 수 있고, <b>길이가 모두 같아요</b>.</div>`,
    lab: circleLab, ex:`<p>원의 중심에서 원 위의 어느 점까지 재어도 같은 길이 → 반지름</p>`, quiz:[['c-term', 1], ['c-rd', 1]] },
  { title:'원의 지름과 성질', std:['4수03-06'], key:'원 위의 두 점을 이은 선분이 <b>원의 중심을 지날 때</b> = 지름. 지름 = 반지름 × 2',
    body:`<ul><li>지름은 원을 <b>똑같이 둘로</b> 나눠요.</li><li>지름은 원 안에 그을 수 있는 <b>가장 긴</b> 선분이에요.</li><li>한 원에서 지름은 모두 같고, 반지름의 <b>2배</b>예요.</li></ul>`,
    lab: circleLab, ex:`<p>반지름 7 cm → 지름 <b>14 cm</b> · 지름 18 cm → 반지름 <b>9 cm</b></p>`, quiz:[['c-prop', 2], ['c-rd', 1]] },
  { title:'컴퍼스로 원 그리기', std:['4수03-07'], key:'원의 중심을 정하고 → 컴퍼스를 <b>반지름만큼</b> 벌린 다음 → 침을 중심에 꽂고 돌려요.',
    body:`<div class="warn">⚠️ 컴퍼스는 <b>반지름</b>만큼 벌려요. 지름이 10 cm인 원을 그리려면 5 cm만 벌려야 해요!</div>`,
    lab: compassLab, ex:`<p>컴퍼스를 4 cm 벌려 그린 원 → 반지름 4 cm, 지름 <b>8 cm</b></p>`, quiz:[['c-compass', 2], ['c-compass', 3], ['c-big', 3]] },
  { title:'원을 이용하여 여러 가지 모양 그리기', std:['4수03-07'], key:'<b>원의 중심</b>을 옮기거나 <b>반지름</b>을 바꾸어 규칙적인 모양을 그려요.',
    body:`<ul><li>중심은 같고 반지름만 다르게 → 과녁 모양</li><li>반지름은 같고 중심을 옮기며 → 고리 모양</li><li>맞닿은 원: 두 중심 사이의 거리 = 두 반지름의 합</li></ul>`,
    lab: patternLab, ex:`<p>반지름 3 cm인 원 4개를 한 줄로 맞닿게 → 전체 길이 = 지름 × 4 = <b>24 cm</b></p>`, quiz:[['c-row', 3], ['c-centers', 4]] },
  { title:'원 활용하기', std:['4수03-06'], key:'그림에서 <b>반지름, 지름</b>이 어디에 숨어 있는지 찾아요.',
    body:`<ul><li>정사각형 안에 꼭 맞는 원: 정사각형의 한 변 = 원의 <b>지름</b></li><li>큰 원 안에 작은 원 두 개가 꼭 맞으면: 큰 원의 지름 = 작은 원의 지름 × 2</li></ul>`,
    ex:`<p>반지름이 4 cm인 원이 꼭 맞게 들어가는 정사각형 → 한 변 8 cm → 네 변의 합 <b>32 cm</b></p>`, quiz:[['c-inner', 4], ['c-square', 5]] }
]});

/* ═════════════ 4. 들이와 무게 ═════════════ */
add({ key:'3-2-4', title:'들이와 무게', intro:'들이의 단위 L, mL와 무게의 단위 kg, g, t을 알고 어림하고 재어 보며, 들이와 무게의 덧셈과 뺄셈을 해요.',
  prev:'[2-2] 길이 재기 · [3-1] 길이와 시간', lessons:[
  { title:'들이 비교하기와 단위', std:['4수03-17', '4수03-18'], key:'들이의 단위: <b>L</b>(리터), <b>mL</b>(밀리리터). 1 L = <b>1000 mL</b>',
    body:`<p>그릇에 물을 가득 채운 뒤 다른 그릇에 옮겨 담거나, 같은 컵으로 몇 번 들어가는지 세어 들이를 비교해요.</p>${E('1 L 300 mL = 1300 mL')}`,
    lab: beakerLab, ex:`<p>2050 mL = <b>2 L 50 mL</b></p>`, quiz:[['cap-conv', 1], ['cap-conv', 2], ['cap-cmp', 3]] },
  { title:'들이 어림하기', std:['4수03-17'], key:'익숙한 그릇(우유갑 200 mL, 생수병 2 L)을 기준으로 들이를 <b>어림</b>해요.',
    body:`<p>어림한 들이를 말할 때는 "약 ○ L" 또는 "약 ○ mL"라고 해요.</p>`,
    lab: pickLab('알맞은 들이 고르기', capQ, 'mL는 작은 들이, L는 큰 들이!'), ex:`<p>물통의 들이 → 약 <b>1 L</b>, 주스 컵 → 약 <b>200 mL</b></p>`, quiz:[['cap-unit', 1], ['cap-unit', 2]] },
  { title:'들이의 덧셈과 뺄셈', std:['4수03-19'], key:'<b>L는 L끼리, mL는 mL끼리</b>. 1000 mL가 넘으면 1 L로 받아올림, 모자라면 1 L를 1000 mL로 받아내림',
    body:`${E('2 L 700 mL + 1 L 500 mL = 4 L 200 mL')}${E('5 L 200 mL - 2 L 600 mL = 2 L 600 mL')}`,
    lab: mixLab('들이의 덧셈 세로셈', ['mL', 'L'], true), ex:`<p>물 3 L 400 mL 중 800 mL 사용 → <b>2 L 600 mL</b></p>`, quiz:[['cap-add', 2], ['cap-sub', 2], ['cap-word', 3]] },
  { title:'무게 비교하기와 단위', std:['4수03-20', '4수03-21', '4수03-22'], key:'무게의 단위: <b>kg</b>, <b>g</b>, <b>t</b>. 1 kg = <b>1000 g</b>, 1 t = <b>1000 kg</b>',
    body:`<p>양손 저울, 바둑돌·클립 같은 단위로 비교하거나 저울로 재어요.</p>${E('1 kg 200 g = 1200 g')}`,
    lab: scaleLab, ex:`<p>3070 g = <b>3 kg 70 g</b> · 4 t = <b>4000 kg</b></p>`, quiz:[['w-conv', 1], ['w-conv', 2], ['w-t', 2]] },
  { title:'무게 어림하기', std:['4수03-20'], key:'익숙한 물건(사과 약 300 g, 책가방 약 3 kg)을 기준으로 무게를 <b>어림</b>해요.',
    body:`<ul><li>가벼운 것: g (연필, 사과)</li><li>무거운 것: kg (가방, 사람)</li><li>아주 무거운 것: t (자동차, 코끼리)</li></ul>`,
    lab: pickLab('알맞은 무게 고르기', wQ, 'g → kg → t 순서로 무거워져요!'), ex:`<p>수박 한 통 → 약 <b>5 kg</b></p>`, quiz:[['w-unit', 1], ['w-unit', 2], ['w-cmp', 3]] },
  { title:'무게의 덧셈과 뺄셈', std:['4수03-23'], key:'<b>kg은 kg끼리, g은 g끼리</b>. 1000 g = 1 kg으로 받아올림·받아내림해요.',
    body:`${E('3 kg 600 g + 1 kg 800 g = 5 kg 400 g')}${E('4 kg 100 g - 1 kg 500 g = 2 kg 600 g')}`,
    lab: mixLab('무게의 뺄셈 세로셈', ['g', 'kg'], false), ex:`<p>가방 1 kg 300 g에 책을 넣었더니 3 kg 100 g → 책 <b>1 kg 800 g</b></p>`, quiz:[['w-add', 2], ['w-word', 3], ['mw-two', 4]] }
]});

/* ═════════════ 5. 분수 ═════════════ */
add({ key:'3-2-5', title:'분수', intro:'부분을 전체의 분수로 나타내고, 전체의 분수만큼은 얼마인지 구해요. 진분수, 가분수, 대분수를 알고 크기를 비교해요.',
  prev:'[3-1] 분수와 소수 · [3-2] 나눗셈', lessons:[
  { title:'분수로 나타내기', std:['4수01-09'], key:'전체를 똑같이 <b>묶어</b> 나누고, 부분이 몇 묶음인지 보면 분수로 나타낼 수 있어요.',
    body:`<p>사과 12개를 4개씩 묶으면 3묶음 → 8개는 3묶음 중 2묶음 → 12의 ${fr(2, 3)}</p>`,
    lab: groupFracLab(false), ex:`<p>구슬 15개를 3개씩 묶으면 6개는 15의 <b>${fr(2, 5)}</b></p>`, quiz:[['fo-group', 1], ['fo-group', 2]] },
  { title:'분수만큼은 얼마인지 알아보기 (1)', std:['4수01-09'], key:`■의 ${fr(1, '●')} = ■를 똑같이 ●묶음으로 나눈 것 중 1묶음 → <b>■ ÷ ●</b>`,
    body:`${E(`12의 ${fr(1, 4)} = 3 &nbsp;&nbsp; 12의 ${fr(3, 4)} = 9`)}<p>12를 똑같이 4묶음 → 1묶음은 3 → 3묶음은 9</p>`,
    lab: groupFracLab(false), ex:`<p>20의 ${fr(2, 5)} → 20 ÷ 5 = 4, 4 × 2 = <b>8</b></p>`, quiz:[['fo-part', 1], ['fo-part', 2]] },
  { title:'분수만큼은 얼마인지 알아보기 (2)', std:['4수01-09'], key:'길이, 시간처럼 이어진 양도 <b>똑같이 나누어</b> 분수만큼을 구해요.',
    body:`<ul><li>16 cm의 ${fr(3, 4)} → 16 ÷ 4 = 4, 4 × 3 = 12 cm</li><li>1시간(60분)의 ${fr(1, 3)} → 20분</li></ul>`,
    lab: groupFracLab(true), ex:`<p>1시간의 ${fr(3, 4)} → 60 ÷ 4 × 3 = <b>45분</b></p>`, quiz:[['fo-part2', 2], ['fo-len', 2], ['fo-len', 3], ['fo-word', 3]] },
  { title:'진분수와 가분수', std:['4수01-10'], key:'분자가 분모보다 작으면 <b>진분수</b>, 분자가 분모와 같거나 크면 <b>가분수</b>',
    body:`${E(`진분수 ${fr(2, 5)}, ${fr(4, 7)} &nbsp; 가분수 ${fr(5, 5)}, ${fr(7, 4)}`)}<p>${fr(5, 5)}, ${fr(6, 6)}처럼 분자와 분모가 같은 분수는 <b>1</b>과 같아요. 1, 2, 3과 같은 수를 <b>자연수</b>라고 해요.</p>`,
    lab: impLab, ex:`<p>분모가 6인 진분수 → ${fr(1, 6)}, ${fr(2, 6)}, …, ${fr(5, 6)} → <b>5개</b></p>`, quiz:[['fr-kind', 1], ['fr-kind', 2], ['fr-count', 4]] },
  { title:'대분수', std:['4수01-10'], key:'자연수와 진분수로 이루어진 분수 = <b>대분수</b>',
    body:`${E(`${fr(3, 4, 1)} = ${fr(7, 4)} &nbsp;&nbsp; ${fr(11, 3)} = ${fr(2, 3, 3)}`)}<p>대분수 → 가분수: 자연수 1 = ${fr(4, 4)}이므로 ${fr(4, 4)} + ${fr(3, 4)} = ${fr(7, 4)}<br>가분수 → 대분수: 11 ÷ 3 = 3 … 2 → ${fr(2, 3, 3)}</p>`,
    lab: impLab, ex:`<p>${fr(1, 5, 2)} = <b>${fr(11, 5)}</b> · ${fr(17, 6)} = <b>${fr(5, 6, 2)}</b></p>`, quiz:[['mix2imp', 2], ['imp2mix', 2], ['mix2imp', 3]] },
  { title:'분모가 같은 분수의 크기 비교', std:['4수01-11'], key:'가분수끼리는 <b>분자가 큰 쪽</b>, 대분수끼리는 <b>자연수 부분</b>부터 비교해요. 섞여 있으면 한 가지로 바꾸어 비교!',
    body:`${E(`${fr(9, 4)} &lt; ${fr(11, 4)} &nbsp;&nbsp; ${fr(1, 5, 3)} &gt; ${fr(4, 5, 2)} &nbsp;&nbsp; ${fr(15, 6)} &gt; ${fr(1, 6, 2)}`)}<p>세 번째는 ${fr(1, 6, 2)}${P(1, '을', '를')} 가분수로 바꾸면 ${fr(13, 6)}이에요. 분모가 같은 가분수 ${fr(15, 6)}와 비교하면 ${fr(15, 6)} &gt; ${fr(13, 6)}!</p>`,
    lab: impLab, ex:`<p>${fr(2, 7, 3)} 와 ${fr(25, 7)} → ${fr(2, 7, 3)} = ${fr(23, 7)} &lt; ${fr(25, 7)}</p>`, quiz:[['fr-cmp', 2], ['fr-cmp', 3], ['fr-big', 3]] }
]});

/* ═════════════ 6. 그림그래프 ═════════════ */
add({ key:'3-2-6', title:'그림그래프', intro:'조사한 수를 그림으로 나타낸 그림그래프를 읽고 해석하며, 자료를 수집해 그림그래프로 나타내요.',
  prev:'[2-2] 표와 그래프', lessons:[
  { title:'그림그래프 알아보기', std:['4수04-01'], key:'조사한 수를 <b>그림</b>으로 나타낸 그래프 = 그림그래프. 큰 그림과 작은 그림이 나타내는 수를 먼저 확인해요!',
    body:`${pictoTable([32, 25, 41, 18], 10, 1, '🍎', '사과')}<p style="text-align:center;font-size:15px">큰 그림 🍎 = 10상자, 작은 그림 = 1상자</p><p>가 마을: 큰 그림 3개, 작은 그림 2개 → <b>32상자</b></p>`,
    lab: pictoLab, ex:`<p>큰 그림 100명, 작은 그림 10명일 때 큰 그림 2개, 작은 그림 4개 → <b>240명</b></p>`, quiz:[['pg-read', 1], ['pg-read100', 2]] },
  { title:'그림그래프 해석하기', std:['4수04-01'], key:'큰 그림의 수를 먼저 비교하면 <b>가장 많은 것, 가장 적은 것</b>을 한눈에 알 수 있어요.',
    body:`<ul><li>가장 많은 마을: 큰 그림이 가장 많은 마을 (같으면 작은 그림 비교)</li><li>표보다 그림그래프가 좋은 점: 많고 적음을 <b>한눈에</b> 비교할 수 있어요.</li></ul>`,
    lab: pictoLab, ex:`<p>가 마을 32상자, 나 마을 25상자 → 차이 <b>7상자</b></p>`, quiz:[['pg-most', 1], ['pg-diff', 2], ['pg-total', 2]] },
  { title:'그림그래프로 나타내기', std:['4수04-01'], key:'① 그림의 종류와 <b>단위</b>(큰 그림·작은 그림)를 정하고 ② 수만큼 그리고 ③ <b>제목</b>을 써요.',
    body:`<p>나타낼 수가 크면 큰 그림을 100, 작은 그림을 10으로 정하는 것처럼 알맞게 단위를 정해요. 그림의 수를 줄이면 그래프를 더 쉽게 볼 수 있어요.</p>`,
    lab: pictoLab, ex:`<p>47 → 큰 그림(10) 4개, 작은 그림(1) 7개 = 그림 <b>11개</b></p>`, quiz:[['pg-icons', 3], ['pg-missing', 4]] },
  { title:'자료를 수집하여 그림그래프로 나타내기', std:['4수04-01'], key:'조사 → 표 → 그림그래프 → <b>해석하고 활용</b>하기',
    body:`<p>반 친구들이 좋아하는 과일을 조사해 그림그래프로 나타내면 간식을 무엇으로 정할지 쉽게 결정할 수 있어요.</p>`,
    lab: surveyLab, ex:`<p>가장 많이 팔린 마을에 우유를 더 많이 준비하면 좋아요.</p>`, quiz:[['pg-plan', 4], ['pg-missing', 5]] }
]});
})();
