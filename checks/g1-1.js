/* =========================================================
   1학년 1학기 문제 만들기 — 수학익힘 1-1 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   단원: 1 9까지의 수 · 2 여러 가지 모양 · 3 덧셈과 뺄셈 · 4 비교하기 · 5 50까지의 수
   ※ 1~2학년 공통 그림 도우미(window.TM_G12)도 여기에서 만들어요.
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, range, dz, josa, svg, txt, line, tableH } = A;
const P = (w, a, b) => josa(w, a, b).slice(String(w).length);
const RO = w => { const s = String(w), ch = s[s.length - 1]; if (/[0-9]/.test(ch)) return '036'.includes(ch) ? '으로' : '로'; const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 && c % 28 && c % 28 !== 8 ? '으로' : '로'; };
const NAMES = ['민수', '지아', '수아', '지호', '유나', '시우', '하나', '서아', '도희', '예나', '주아', '태호', '연우', '세미'];
const E = s => `<div class="expr">${s}</div>`;
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};
const N = (q, v, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: Number.isInteger(dz(v)) ? 'int' : 'dec', v: dz(v), unit }, wrong: wrong.map(dz).filter(x => x >= 0 && dz(x) !== dz(v)), ex }, extra);
const CMP = (a, b) => a > b ? '&gt;' : a < b ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];
const INK = '#22314A';

/* ---------- 수 읽기 ---------- */
const DG = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const sino = n => { if (n === 0) return '영'; const P4 = ['천', '백', '십', '']; return String(n).padStart(4, '0').split('').map((d, i) => +d ? ((+d === 1 && i < 3) ? '' : DG[+d]) + P4[i] : '').join(''); };
const NT = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'], NO = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const native = n => n === 100 ? '백' : NT[Math.floor(n / 10)] + NO[n % 10];
const ORD = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];

/* ---------- 그림 도우미 ---------- */
const emo = (ic, n, per = 5, size = 28) => `<div class="emo" style="font-size:${size}px;line-height:1.25;letter-spacing:2px;text-align:center;margin:6px 0">${range(0, Math.ceil(n / per) - 1).map(r => ic.repeat(Math.min(per, n - r * per))).join('<br>')}</div>`;
// 10개씩 묶음(상자)과 낱개
const tens = (ic, n, size = 20) => { const t = Math.floor(n / 10), o = n % 10;
  return `<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;margin:6px 0">${range(1, t).map(() => `<span style="display:inline-block;border:2.5px solid #4CB963;border-radius:10px;padding:2px 4px;font-size:${size}px;line-height:1.1;background:#F3FBF4">${ic.repeat(5)}<br>${ic.repeat(5)}</span>`).join('')}${o ? `<span style="font-size:${size}px;line-height:1.1">${ic.repeat(Math.min(5, o))}${o > 5 ? '<br>' + ic.repeat(o - 5) : ''}</span>` : ''}</div>`; };
const tenFrame = (n, col = '#FF9F43') => { const u = 30; let g = '';
  for (let i = 0; i < 10; i++){ const x = 4 + (i % 5) * u, y = 4 + Math.floor(i / 5) * u; g += `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`; if (i < n) g += `<circle cx="${x + u / 2}" cy="${y + u / 2}" r="10" fill="${col}"/>`; }
  return svg(5 * u + 8, 2 * u + 8, g); };
// 시계 (몇 시 몇 분)
const clock = (h, m, size = 150) => { const C = 75, R = 68; let s = `<circle cx="${C}" cy="${C}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  for (let k = 0; k < 60; k++){ const a = k * Math.PI / 30 - Math.PI / 2, r1 = k % 5 ? 62 : 57; s += line(C + r1 * Math.cos(a), C + r1 * Math.sin(a), C + 66 * Math.cos(a), C + 66 * Math.sin(a), { w: k % 5 ? .8 : 2 }); }
  for (let i = 1; i <= 12; i++){ const a = i * Math.PI / 6 - Math.PI / 2; s += txt(C + 47 * Math.cos(a), C + 47 * Math.sin(a), i, { size: 14, bold: true }); }
  const ah = ((h % 12) + m / 60) * Math.PI / 6 - Math.PI / 2, am = m * Math.PI / 30 - Math.PI / 2;
  s += line(C, C, C + 32 * Math.cos(ah), C + 32 * Math.sin(ah), { w: 5.5 }) + line(C, C, C + 52 * Math.cos(am), C + 52 * Math.sin(am), { w: 3, stroke: '#2a6fae' }) + `<circle cx="${C}" cy="${C}" r="4.5" fill="${INK}"/>`;
  return svg(150, 150, s).replace('width="150" height="150"', `width="${size}" height="${size}"`); };
// 평면 모양 (□ △ ○)
const COLS = ['#FFB3B3', '#9CC7EE', '#FFE38A', '#9BE0A6', '#F7A6C4', '#C7B6F2'];
const shp = (k, x, y, s, col, rot = 0) => { const st = `fill="${col}" stroke="${INK}" stroke-width="2"`;
  if (k === 'c') return `<circle cx="${x}" cy="${y}" r="${s / 2}" ${st}/>`;
  const pts = k === 't' ? [[0, -s / 2], [s / 2, s / 2.4], [-s / 2, s / 2.4]] : [[-s / 2, -s / 2.6], [s / 2, -s / 2.6], [s / 2, s / 2.6], [-s / 2, s / 2.6]];
  const r = rot * Math.PI / 180; return `<polygon points="${pts.map(([a, b]) => [x + a * Math.cos(r) - b * Math.sin(r), y + a * Math.sin(r) + b * Math.cos(r)].map(v => v.toFixed(1)).join(',')).join(' ')}" ${st}/>`; };
const SHN = { r: '□ 모양', t: '△ 모양', c: '○ 모양' };
// 막대 길이 비교
const barsCmp = (items, unit = 22) => { const W = Math.max(...items.map(it => it[1])) * unit + 90; let g = '';
  items.forEach(([nm, len, col], i) => { g += txt(40, 22 + i * 36, nm, { size: 14, bold: true, anchor: 'end' }) + `<rect x="50" y="${10 + i * 36}" width="${len * unit}" height="22" rx="8" fill="${col || COLS[i % 6]}" stroke="${INK}" stroke-width="1.6"/>`; });
  return svg(W, 12 + items.length * 36, line(50, 4, 50, 8 + items.length * 36, { stroke: '#E0464A', w: 2, dash: '4 3' }) + g); };
// 시소(저울)
const seesaw = (L, R, heavyLeft) => { const t = heavyLeft ? -12 : 12, C = 150;
  return svg(300, 130, `<polygon points="${C - 16},120 ${C + 16},120 ${C},86" fill="#C9D3E0" stroke="${INK}" stroke-width="2"/><g transform="rotate(${t} ${C} 86)">${line(C - 120, 86, C + 120, 86, { w: 6, stroke: '#8899AA' })}<text x="${C - 90}" y="74" font-size="40" text-anchor="middle">${L}</text><text x="${C + 90}" y="74" font-size="40" text-anchor="middle">${R}</text></g>`); };
// 쌓기나무, 수 모형
const blocks = (n, opt = {}) => { const th = Math.floor(n / 1000), h = Math.floor(n % 1000 / 100), t = Math.floor(n % 100 / 10), o = n % 10, col = opt.col || '#BFE3FF'; let g = '', x = 4;
  for (let i = 0; i < th; i++){ g += `<rect x="${x + 8}" y="4" width="44" height="44" fill="#D8ECFF" stroke="${INK}" stroke-width="1.4"/><rect x="${x}" y="12" width="44" height="44" fill="${col}" stroke="${INK}" stroke-width="1.6"/>` + line(x, 12, x + 8, 4, { w: 1.4 }) + line(x + 44, 12, x + 52, 4, { w: 1.4 }) + line(x + 44, 56, x + 52, 48, { w: 1.4 }) + txt(x + 22, 34, '1000', { size: 11, bold: true }); x += 60; }
  if (th) x += 6;
  for (let i = 0; i < h; i++){ g += `<rect x="${x}" y="12" width="44" height="44" fill="${col}" stroke="${INK}" stroke-width="1.4"/>`; for (let k = 1; k < 10; k++) g += line(x + k * 4.4, 12, x + k * 4.4, 56, { stroke: '#7FA6C9', w: .6 }) + line(x, 12 + k * 4.4, x + 44, 12 + k * 4.4, { stroke: '#7FA6C9', w: .6 }); x += 50; }
  if (h) x += 6;
  for (let i = 0; i < t; i++){ g += `<rect x="${x}" y="12" width="6" height="44" fill="${col}" stroke="${INK}" stroke-width="1.2"/>`; for (let k = 1; k < 10; k++) g += line(x, 12 + k * 4.4, x + 6, 12 + k * 4.4, { stroke: '#7FA6C9', w: .6 }); x += 9; }
  if (t) x += 6;
  for (let i = 0; i < o; i++) g += `<rect x="${x + (i % 2) * 8}" y="${48 - Math.floor(i / 2) * 8}" width="7" height="7" fill="${col}" stroke="${INK}" stroke-width="1.1"/>`;
  if (o) x += 18;
  return svg(Math.max(x, 20), 60, g); };

window.TM_G12 = { E, MC, N, P, RO, CMP, CMPC, NAMES, sino, native, ORD, emo, tens, tenFrame, clock, shp, SHN, COLS, barsCmp, seesaw, blocks };

/* ─────────────── 1. 9까지의 수 ─────────────── */
const IC = ['🍎', '🍓', '🐥', '🌷', '⭐', '🐟', '🍪', '🎈', '🐞', '🍋'];
const ANI = [['🐶', '강아지'], ['🐱', '고양이'], ['🐰', '토끼'], ['🐻', '곰'], ['🐼', '판다'], ['🦊', '여우'], ['🐸', '개구리'], ['🐯', '호랑이'], ['🐷', '돼지']];
A.addUnit({ key:'1-1-1', title:'9까지의 수', items:[
  { id:'n9-count', name:'수를 세어 쓰기', std:'2수01-01', lv:[1,1], t:'both',
    g(){ const n = ri(1, 9), ic = pick(IC); return N(`그림의 수를 세어 보세요.${emo(ic, n)}`, n, `하나씩 짚으며 세면 마지막 수가 <b>${n}</b>이에요.`, [n + 1, n - 1, n + 2], '개'); } },
  { id:'n9-read', name:'수 읽기', std:'2수01-01', lv:[1,1], t:'mc',
    g(){ const n = ri(1, 9), ok = `${sino(n)}, ${native(n)}`, bad = shuffle(range(1, 9).filter(x => x !== n)).slice(0, 3).map(x => pick([`${sino(x)}, ${native(x)}`, `${sino(n)}, ${native(x)}`]));
      return MC(`수 <b style="font-size:26px">${n}</b>을(를) 바르게 읽은 것은?`.replace('을(를)', P(n, '을', '를')), [ok, ...bad], `${n}${P(n, '은', '는')} <b>${sino(n)}</b> 또는 <b>${native(n)}</b>(이)라고 읽어요.`.replace('(이)', P(native(n), '이', ''))); } },
  { id:'n9-ord', name:'몇째인지 알기', std:'2수01-01', lv:[1,2], t:'mc',
    g(L){ const row = shuffle(ANI).slice(0, 7), k = ri(1, 7), fromLeft = L > 1 ? ri(0, 1) : 1, idx = fromLeft ? k - 1 : 7 - k;
      return MC(`${fromLeft ? '왼쪽' : '오른쪽'}에서 <b>${ORD[k]}</b>에 있는 동물은?<div style="font-size:34px;text-align:center;letter-spacing:4px">${row.map(r => r[0]).join('')}</div>`, [row[idx][1], ...shuffle(row.filter((_, i) => i !== idx)).slice(0, 3).map(r => r[1])], `${fromLeft ? '왼쪽' : '오른쪽'}부터 첫째, 둘째, …로 세면 ${ORD[k]}는 <b>${row[idx][1]}</b>예요.`); } },
  { id:'n9-ordcnt', name:'몇 개와 몇째 구별하기', std:'2수01-01', lv:[2,2], t:'mc',
    g(){ const k = ri(3, 7), ic = pick(['🍎', '⭐', '🌷']);
      const draw = (sel, solo) => `<span style="font-size:22px;letter-spacing:2px">${range(1, 9).map(i => (solo ? i === sel : i <= sel) ? ic : '⚪').join('')}</span>`;
      const want = ri(0, 1);
      return MC(`왼쪽에서부터 <b>${want ? `${native(k).replace(/나$/, '')} 개` : ORD[k]}</b>${want ? '' : '에만'} 색칠한 것은?`.replace('하 개', '한 개').replace('둘 개', '두 개').replace('셋 개', '세 개').replace('넷 개', '네 개'), [draw(k, !want), draw(k, !!want), draw(k + 1, !want), draw(k - 1, !want)], want ? `${native(k)}은(는) 개수 → 왼쪽부터 <b>${k}개</b>를 모두 색칠해요.` : `${ORD[k]}는 순서 → 왼쪽부터 ${k}번째 <b>하나만</b> 색칠해요.`, { gridChoices: false }); } },
  { id:'n9-seq', name:'수의 순서', std:'2수01-03', lv:[1,2], t:'both',
    g(L){ const down = L > 1 && ri(0, 1), s = down ? ri(5, 9) : ri(0, 4), seq = range(0, 4).map(i => down ? s - i : s + i), h = ri(1, 3);
      return N(`수의 순서대로 □ 안에 알맞은 수를 써 보세요. ${E(seq.map((x, i) => i === h ? '□' : x).join(' — '))}`, seq[h], `${down ? '1씩 작아지는' : '1씩 커지는'} 순서예요 → <b>${seq[h]}</b>`, [seq[h] + 1, seq[h] - 1, seq[h] + 2]); } },
  { id:'n9-pm1', name:'1만큼 더 큰 수, 1만큼 더 작은 수', std:'2수01-03', lv:[1,2], t:'both',
    g(){ const n = ri(1, 8), up = ri(0, 1), v = up ? n + 1 : n - 1;
      return N(`${n}보다 1만큼 더 ${up ? '큰' : '작은'} 수는?`, v, `수의 순서에서 ${n} 바로 ${up ? '뒤' : '앞'}의 수 → <b>${v}</b>${v === 0 ? ' (아무것도 없는 것 = 0)' : ''}`, [up ? n - 1 : n + 1, n, v + 2]); } },
  { id:'n9-zero', name:'0 알아보기', std:'2수01-01', lv:[2,2], t:'both',
    g(){ const n = ri(2, 6), ic = pick(['🍪', '🍎', '🍓']); return N(`접시에 ${ic}${P(ic, '이', '가')} ${n}개 있었어요. 하나씩 ${n}번 먹었어요. 접시에 남은 ${ic}는 몇 개일까요?`.replace(/[🍪🍎🍓](이|가)/, m => m), 0, `하나도 없으면 <b>0</b>(영)이라고 써요.`, [1, n, n - 1], '개'); } },
  { id:'n9-cmp', name:'수의 크기 비교', std:'2수01-03', lv:[1,2], t:'mc',
    g(L){ if (L > 1){ const s = shuffle(range(0, 9)).slice(0, 4), mx = ri(0, 1), t = mx ? Math.max(...s) : Math.min(...s); return MC(`<b>가장 ${mx ? '큰' : '작은'}</b> 수는? ${E(s.join(', '))}`, [String(t), ...s.filter(x => x !== t).map(String)], `수의 순서에서 ${mx ? '가장 뒤' : '가장 앞'}에 있는 수 → <b>${t}</b>`); }
      const a = ri(1, 9); let b; do b = ri(1, 9); while (b === a); const big = ri(0, 1);
      return MC(`${a}와(과) ${b} 중에서 더 ${big ? '큰' : '작은'} 수는?`.replace('와(과)', P(a, '과', '와')), [String(big ? Math.max(a, b) : Math.min(a, b)), String(big ? Math.min(a, b) : Math.max(a, b))], `수를 순서대로 셀 때 뒤에 오는 수가 더 커요 → <b>${big ? Math.max(a, b) : Math.min(a, b)}</b>`); } },
  { id:'n9-between', name:'두 수 사이의 수', std:'2수01-03', lv:[3,3], t:'both',
    g(){ const a = ri(0, 5), b = ri(a + 2, 9), v = b - a - 1; return N(`${a}와(과) ${b} 사이에 있는 수는 모두 몇 개일까요?`.replace('와(과)', P(a, '과', '와')), v, `${range(a + 1, b - 1).join(', ')} → <b>${v}개</b> (${a}와(과) ${b}는 세지 않아요)`.replace('와(과)', P(a, '과', '와')), [v + 1, v + 2, b - a], '개'); } },
  { id:'n9-cond', name:'조건에 맞는 수', std:'2수01-03', lv:[3,4], t:'both',
    g(){ const a = ri(1, 4), b = ri(a + 3, 9), mx = ri(0, 1); return N(`${a}보다 크고 ${b}보다 작은 수 중에서 가장 ${mx ? '큰' : '작은'} 수는?`, mx ? b - 1 : a + 1, `${range(a + 1, b - 1).join(', ')} 중에서 가장 ${mx ? '큰' : '작은'} 수 → <b>${mx ? b - 1 : a + 1}</b>`, [mx ? b : a, mx ? a + 1 : b - 1, mx ? b - 2 : a + 2]); } },
  { id:'n9-line', name:'줄 서기 문제', std:'2수01-01', lv:[4,5], t:'both',
    g(){ const f = ri(2, 6), b = ri(2, 6), v = f + b - 1, nm = pick(NAMES); if (v > 9) return this.g();
      return N(`학생들이 한 줄로 서 있어요. ${nm}는 앞에서 ${ORD[f]}, 뒤에서 ${ORD[b]}에 서 있어요. 줄을 선 학생은 모두 몇 명일까요?`, v, `${nm} 앞에 ${f - 1}명, 뒤에 ${b - 1}명 → ${f - 1} + 1 + ${b - 1} = <b>${v}명</b>`, [f + b, v - 1, v + 2], '명'); } }
]});

/* ─────────────── 2. 여러 가지 모양 ─────────────── */
const OBJ = { box: [['📦', '택배 상자'], ['🎁', '선물 상자'], ['🧊', '얼음'], ['🧱', '벽돌'], ['📕', '책']], cyl: [['🥫', '통조림'], ['🧻', '두루마리 휴지'], ['🔋', '건전지'], ['🥁', '북'], ['🕯️', '양초']], ball: [['⚽', '축구공'], ['🏀', '농구공'], ['🍊', '귤'], ['🔮', '구슬'], ['🎱', '당구공']] };
const SK = { box: '상자 모양', cyl: '둥근기둥 모양', ball: '공 모양' }, KEYS = ['box', 'cyl', 'ball'];
const mixObj = () => { const c = { box: ri(1, 4), cyl: ri(1, 4), ball: ri(1, 4) }, list = shuffle(KEYS.flatMap(k => range(1, c[k]).map(() => pick(OBJ[k])[0]))); return [c, list]; };
A.addUnit({ key:'1-1-2', title:'여러 가지 모양', items:[
  { id:'sh-kind', name:'물건의 모양 알기', std:'2수03-01', lv:[1,1], t:'mc',
    g(){ const k = pick(KEYS), o = pick(OBJ[k]); return MC(`<span style="font-size:44px">${o[0]}</span> ${o[1]}은(는) 어떤 모양일까요?`.replace('은(는)', P(o[1], '은', '는')), [SK[k], ...KEYS.filter(x => x !== k).map(x => SK[x])], `${o[1]} → <b>${SK[k]}</b>`); } },
  { id:'sh-odd', name:'모양이 다른 하나 찾기', std:'2수03-01', lv:[1,2], t:'mc',
    g(){ const k = pick(KEYS), other = pick(KEYS.filter(x => x !== k)), same = shuffle(OBJ[k]).slice(0, 3), odd = pick(OBJ[other]);
      return MC('모양이 <b>다른</b> 하나는?', [`${odd[0]} ${odd[1]}`, ...same.map(o => `${o[0]} ${o[1]}`)], `${same.map(o => o[1]).join(', ')}는 ${SK[k]}, ${odd[1]}는 <b>${SK[other]}</b>이에요.`); } },
  { id:'sh-count', name:'같은 모양 세기', std:'2수03-01', lv:[2,2], t:'both',
    g(){ const [c, list] = mixObj(), k = pick(KEYS); return N(`<b>${SK[k]}</b>은 몇 개일까요?<div style="font-size:34px;text-align:center;letter-spacing:6px">${list.join('')}</div>`, c[k], `${SK[k]}만 골라 세면 <b>${c[k]}개</b>예요.`, [c[k] + 1, list.length - c[k], c[k] - 1], '개'); } },
  { id:'sh-prop', name:'모양의 특징', std:'2수03-01', lv:[2,3], t:'mc',
    g(){ const Q0 = pick([['평평한 부분과 뾰족한 부분이 있어서 잘 쌓을 수 있어요.', 'box'], ['둥근 부분만 있어서 여러 방향으로 잘 굴러가요.', 'ball'], ['평평한 부분과 둥근 부분이 있어서 눕히면 잘 굴러가고, 세우면 쌓을 수 있어요.', 'cyl'], ['어느 쪽으로 쌓아도 잘 쌓을 수 없어요.', 'ball'], ['뾰족한 부분이 있어요.', 'box']]);
      return MC(`설명에 알맞은 모양은? ${E(Q0[0])}`, [SK[Q0[1]], ...KEYS.filter(x => x !== Q0[1]).map(x => SK[x])], `상자 모양: 평평하고 뾰족한 부분 · 둥근기둥 모양: 평평한 부분 + 둥근 부분 · 공 모양: 둥근 부분만 → <b>${SK[Q0[1]]}</b>`); } },
  { id:'sh-feel', name:'만져 보고 모양 맞히기', std:'2수03-01', lv:[3,3], t:'mc',
    g(){ const Q0 = pick([['상자 속 물건을 만져 보니 뾰족한 부분이 있었어요.', 'box'], ['상자 속 물건을 만져 보니 둥근 부분만 있었어요.', 'ball'], ['상자 구멍으로 보이는 부분이 동그랗고 평평했어요. 옆은 둥글었어요.', 'cyl']]), o = pick(OBJ[Q0[1]]);
      return MC(`${Q0[0]} 이 물건으로 알맞은 것은?`, [`${o[0]} ${o[1]}`, ...KEYS.filter(x => x !== Q0[1]).map(x => pick(OBJ[x])).map(z => `${z[0]} ${z[1]}`)], `${SK[Q0[1]]}의 특징이에요 → <b>${o[1]}</b>`); } },
  { id:'sh-total', name:'모양을 만드는 데 사용한 개수', std:'2수03-01', lv:[2,3], t:'both',
    g(){ const c = { box: ri(2, 6), cyl: ri(1, 5), ball: ri(1, 4) }, sum = c.box + c.cyl + c.ball;
      return N(`로봇을 만드는 데 상자 모양 ${c.box}개, 둥근기둥 모양 ${c.cyl}개, 공 모양 ${c.ball}개를 사용했어요. <b>모두</b> 몇 개를 사용했나요?`, sum, `${c.box} + ${c.cyl} + ${c.ball} = <b>${sum}개</b>`, [c.box + c.cyl, sum + 1, sum - 1], '개'); } },
  { id:'sh-most', name:'가장 많이 사용한 모양', std:'2수03-01', lv:[2,3], t:'mc',
    g(){ const [c, list] = mixObj(), mx = Math.max(c.box, c.cyl, c.ball); if (KEYS.filter(k => c[k] === mx).length > 1) return this.g(); const best = KEYS.find(k => c[k] === mx);
      return MC(`모양을 만드는 데 사용한 물건이에요. <b>가장 많이</b> 사용한 모양은?<div style="font-size:32px;text-align:center;letter-spacing:6px">${list.join('')}</div>`, [SK[best], ...KEYS.filter(x => x !== best).map(x => SK[x])], `상자 모양 ${c.box}개, 둥근기둥 모양 ${c.cyl}개, 공 모양 ${c.ball}개 → <b>${SK[best]}</b>`); } },
  { id:'sh-cmp', name:'사용한 모양의 수 비교', std:'2수03-01', lv:[4,5], t:'both',
    g(){ const [c, list] = mixObj(), [a, b] = shuffle(KEYS).slice(0, 2); if (c[a] === c[b]) return this.g(); const [hi, lo] = c[a] > c[b] ? [a, b] : [b, a];
      return N(`모양을 만드는 데 사용한 물건이에요.<div style="font-size:32px;text-align:center;letter-spacing:6px">${list.join('')}</div><b>${SK[hi]}</b>은 <b>${SK[lo]}</b>보다 몇 개 더 많이 사용했나요?`, c[hi] - c[lo], `${SK[hi]} ${c[hi]}개, ${SK[lo]} ${c[lo]}개 → ${c[hi]} - ${c[lo]} = <b>${c[hi] - c[lo]}개</b>`, [c[hi], c[lo], c[hi] + c[lo]], '개'); } }
]});

/* ─────────────── 3. 덧셈과 뺄셈 ─────────────── */
const STORY = [['🐦', '참새', '마리', '나무에', '날아왔어요', '날아갔어요'], ['🐟', '물고기', '마리', '어항에', '더 넣었어요', '꺼냈어요'], ['🍎', '사과', '개', '바구니에', '더 담았어요', '먹었어요'], ['🎈', '풍선', '개', '하늘에', '더 날렸어요', '터졌어요'], ['🚗', '자동차', '대', '주차장에', '더 들어왔어요', '나갔어요']];
A.addUnit({ key:'1-1-3', title:'덧셈과 뺄셈', items:[
  { id:'ad-join', name:'모으기', std:'2수01-04', lv:[1,1], t:'both',
    g(){ const a = ri(1, 5), b = ri(1, 9 - a), ic = pick(IC); return N(`${a}와(과) ${b}를 모으면 얼마일까요?${tenFrame(a + b)}`.replace('와(과)', P(a, '과', '와')).replace(`${b}를`, `${b}${P(b, '을', '를')}`), a + b, `${a}와(과) ${b}를 모으면 <b>${a + b}</b>`.replace('와(과)', P(a, '과', '와')).replace(`${b}를`, `${b}${P(b, '을', '를')}`), [a + b + 1, a + b - 1, Math.abs(a - b)]); } },
  { id:'ad-split', name:'가르기', std:'2수01-04', lv:[1,2], t:'both',
    g(){ const n = ri(3, 9), a = ri(1, n - 1); return N(`${n}${P(n, '은', '는')} ${a}와(과) □로 가를 수 있어요. □ 안에 알맞은 수는?`.replace('와(과)', P(a, '과', '와')), n - a, `${n}${P(n, '은', '는')} ${a}와(과) <b>${n - a}</b>로 가를 수 있어요.`.replace('와(과)', P(a, '과', '와')), [n - a + 1, n, n - a - 1]); } },
  { id:'ad-add', name:'덧셈하기', std:'2수01-05', lv:[1,1], t:'both',
    g(){ const a = ri(1, 7), b = ri(1, 9 - a); return N(`${a} + ${b}의 값은?`, a + b, `${a}에 ${b}만큼 이어 세면 <b>${a + b}</b>`, [a + b + 1, a + b - 1, Math.abs(a - b)]); } },
  { id:'ad-sub', name:'뺄셈하기', std:'2수01-05', lv:[1,1], t:'both',
    g(){ const a = ri(3, 9), b = ri(1, a - 1); return N(`${a} - ${b}의 값은?`, a - b, `${a}에서 ${b}만큼 거꾸로 세면 <b>${a - b}</b>`, [a - b + 1, a + b > 9 ? a - b + 2 : a + b, a - b - 1]); } },
  { id:'ad-pic', name:'그림을 보고 덧셈·뺄셈하기', std:'2수01-05', lv:[1,2], t:'both',
    g(){ const ic = pick(IC), a = ri(2, 5), b = ri(1, 4), plus = ri(0, 1);
      if (plus) return N(`그림을 보고 덧셈을 해 보세요. <div style="font-size:28px;text-align:center">${ic.repeat(a)} &nbsp;+&nbsp; ${ic.repeat(b)}</div>`, a + b, `${a} + ${b} = <b>${a + b}</b>`, [a + b + 1, a, b]);
      const tot = a + b; return N(`${tot}개 중에서 ✖ 표시한 것을 빼면 몇 개가 남을까요? <div style="font-size:28px;text-align:center">${ic.repeat(a)}${'❌'.repeat(b)}</div>`, a, `${tot} - ${b} = <b>${a}</b>`, [tot, b, a + 1], '개'); } },
  { id:'ad-zero', name:'0이 있는 덧셈과 뺄셈', std:'2수01-05', lv:[2,2], t:'both',
    g(){ const n = ri(1, 9), t = ri(0, 3), e = [[`${n} + 0`, n], [`0 + ${n}`, n], [`${n} - 0`, n], [`${n} - ${n}`, 0]][t];
      return N(`${e[0]}의 값은?`, e[1], t === 3 ? `전체에서 전체를 빼면 <b>0</b>이에요.` : `어떤 수에 0을 더하거나 어떤 수에서 0을 빼면 그대로 <b>${n}</b>`, [t === 3 ? n : 0, n + 1, 1]); } },
  { id:'ad-word', name:'덧셈·뺄셈 이야기 문제', std:'2수01-05', lv:[2,3], t:'both',
    g(L){ const s = pick(STORY), a = ri(2, 6), b = ri(1, 9 - a), t = L > 2 ? ri(0, 2) : ri(0, 1);
      if (t === 0) return N(`${s[3]} ${s[1]} ${a}${s[2]}${P(s[2], '이', '가')} 있어요. ${b}${s[2]}${P(s[2], '을', '를')} ${s[4]}. ${s[1]}${P(s[1], '은', '는')} 모두 몇 ${s[2]}일까요?`, a + b, `더해요: ${a} + ${b} = <b>${a + b}${s[2]}</b>`, [a, a + b + 1, Math.abs(a - b)], s[2]);
      if (t === 1){ const tot = a + b; return N(`${s[3]} ${s[1]} ${tot}${s[2]}${P(s[2], '이', '가')} 있었어요. ${b}${s[2]}${P(s[2], '이', '가')} ${s[5]}. 남은 ${s[1]}${P(s[1], '은', '는')} 몇 ${s[2]}일까요?`, a, `빼요: ${tot} - ${b} = <b>${a}${s[2]}</b>`, [tot, a + 1, b], s[2]); }
      const x = ri(4, 9), y = ri(1, x - 1), n1 = pick(NAMES), n2 = pick(NAMES.filter(z => z !== n1));
      return N(`${n1}는 구슬 ${x}개, ${n2}는 구슬 ${y}개를 가지고 있어요. ${n1}는 ${n2}보다 구슬을 몇 개 더 많이 가지고 있나요?`, x - y, `비교할 때도 빼요: ${x} - ${y} = <b>${x - y}개</b>`, [x + y > 9 ? x - y + 1 : x + y, x - y - 1, y], '개'); } },
  { id:'ad-box', name:'□ 안에 알맞은 수', std:'2수01-07', lv:[3,4], t:'both',
    g(){ const a = ri(1, 6), b = ri(1, 9 - a), t = ri(0, 2), e = [[`□ + ${b} = ${a + b}`, a], [`${a} + □ = ${a + b}`, b], [`${a + b} - □ = ${a}`, b]][t];
      return N(`□ 안에 알맞은 수는? ${E(e[0])}`, e[1], `모으기와 가르기로 생각해요: ${a + b}${P(a + b, '은', '는')} ${a}와(과) ${b}로 가를 수 있어요 → <b>${e[1]}</b>`.replace('와(과)', P(a, '과', '와')), [a + b, e[1] + 1, e[1] - 1]); } },
  { id:'ad-sign', name:'+, - 알맞게 넣기', std:'2수01-05', lv:[3,3], t:'mc',
    g(){ const a = ri(2, 8), b = ri(1, Math.min(a - 1, 9 - a)), plus = ri(0, 1), r = plus ? a + b : a - b;
      return MC(`○ 안에 알맞은 것은? ${E(`${a} ○ ${b} = ${r}`)}`, [plus ? '+' : '-', plus ? '-' : '+'], `${a} ${plus ? '+' : '-'} ${b} = ${r} → <b>${plus ? '+' : '-'}</b>`); } },
  { id:'ad-ways', name:'가르는 방법의 수', std:'2수01-04', lv:[4,4], t:'both',
    g(){ const n = ri(4, 9); return N(`구슬 ${n}개를 두 사람이 나누어 가지려고 해요. 두 사람 모두 1개 이상 가지도록 나누는 방법은 모두 몇 가지일까요?`, n - 1, `(1, ${n - 1}), (2, ${n - 2}), … , (${n - 1}, 1) → <b>${n - 1}가지</b>`, [n, n - 2, Math.floor(n / 2)], '가지'); } },
  { id:'ad-cards', name:'수 카드로 덧셈·뺄셈', std:'2수01-05', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(0, 9)).slice(0, 4), plus = ri(0, 1), s = c.slice().sort((a, b) => b - a); const v = plus ? s[0] + s[1] : s[0] - s[3]; if (plus && v > 9) return this.g();
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')} 중에서 두 장을 골라 ${plus ? '합이 가장 크게' : '차가 가장 크게'} 만들면 얼마일까요?`, v, plus ? `가장 큰 수 두 개를 더해요: ${s[0]} + ${s[1]} = <b>${v}</b>` : `가장 큰 수에서 가장 작은 수를 빼요: ${s[0]} - ${s[3]} = <b>${v}</b>`, [plus ? s[0] + s[2] : s[0] - s[2], v + 1, v - 1]); } }
]});

/* ─────────────── 4. 비교하기 ─────────────── */
const LEN = [['연필', '✏️'], ['크레파스', '🖍️'], ['붓', '🖌️'], ['리본', '🎀'], ['줄넘기', '🪢'], ['막대', '🥢']];
const HEAVY = [['🐘', '코끼리'], ['🐄', '소'], ['🐕', '강아지'], ['🐈', '고양이'], ['🐭', '생쥐'], ['🐜', '개미']];
A.addUnit({ key:'1-1-4', title:'비교하기', items:[
  { id:'cp-len', name:'길이 비교하기', std:'2수03-06', lv:[1,2], t:'mc',
    g(L){ const n = L > 1 ? 3 : 2, items = shuffle(LEN).slice(0, n), lens = shuffle(range(3, 10)).slice(0, n), long = ri(0, 1), t = long ? Math.max(...lens) : Math.min(...lens), i = lens.indexOf(t);
      return MC(`한쪽 끝을 맞추어 놓았어요. <b>가장 ${long ? '긴' : '짧은'}</b> 것은?${barsCmp(items.map((it, k) => [it[0], lens[k]]))}`, [items[i][0], ...items.filter((_, k) => k !== i).map(x => x[0])], `한쪽 끝을 맞추었을 때 다른 쪽 끝이 ${long ? '더 많이 나온' : '덜 나온'} 것 → <b>${items[i][0]}</b>`); } },
  { id:'cp-word', name:'알맞은 말 고르기', std:'2수03-06', lv:[1,2], t:'mc',
    g(){ const Q0 = pick([['코끼리는 강아지보다 더 (   ).', '무거워요', ['가벼워요', '짧아요', '좁아요']], ['개미는 고양이보다 더 (   ).', '가벼워요', ['무거워요', '길어요', '넓어요']], ['운동장은 교실보다 더 (   ).', '넓어요', ['좁아요', '가벼워요', '짧아요']], ['양동이는 컵보다 물을 더 (   ) 담을 수 있어요.', '많이', ['적게', '짧게', '가볍게']], ['기린은 토끼보다 키가 더 (   ).', '커요', ['작아요', '가벼워요', '좁아요']], ['손수건은 이불보다 더 (   ).', '좁아요', ['넓어요', '무거워요', '길어요']]]);
      return MC(`(   ) 안에 알맞은 말은? ${E(Q0[0])}`, [Q0[1], ...Q0[2]], `길이는 길다/짧다, 무게는 무겁다/가볍다, 넓이는 넓다/좁다, 담을 수 있는 양은 많다/적다 → <b>${Q0[1]}</b>`); } },
  { id:'cp-heavy', name:'무게 비교하기', std:'2수03-06', lv:[1,2], t:'mc',
    g(){ const [x, y] = shuffle(HEAVY).slice(0, 2), ix = HEAVY.indexOf(x), iy = HEAVY.indexOf(y), heavyLeft = ix < iy, want = ri(0, 1);
      const ans = want ? (heavyLeft ? x : y) : (heavyLeft ? y : x);
      return MC(`시소에 탔어요. 더 <b>${want ? '무거운' : '가벼운'}</b> 동물은?${seesaw(x[0], y[0], heavyLeft)}`, [ans[1], (ans === x ? y : x)[1]], `시소는 무거운 쪽이 아래로 내려가요 → <b>${ans[1]}</b>`); } },
  { id:'cp-heavy3', name:'세 가지 무게 비교', std:'2수03-06', lv:[3,4], t:'mc',
    g(){ const it = shuffle([['🟥', '빨간 상자'], ['🟦', '파란 상자'], ['🟨', '노란 상자'], ['🟩', '초록 상자']]).slice(0, 3); // it[0] < it[1] < it[2] (무게 순서는 문제에서 정함)
      const want = ri(0, 1);
      return MC(`${it[1][1]}${P(it[1][1], '은', '는')} ${it[0][1]}보다 무겁고, ${it[2][1]}${P(it[2][1], '은', '는')} ${it[1][1]}보다 무거워요. <b>가장 ${want ? '무거운' : '가벼운'}</b> 것은?`, [want ? it[2][1] : it[0][1], it[1][1], want ? it[0][1] : it[2][1]], `가벼운 순서: ${it[0][1]} → ${it[1][1]} → ${it[2][1]} → <b>${want ? it[2][1] : it[0][1]}</b>`); } },
  { id:'cp-area', name:'넓이 비교하기', std:'2수03-06', lv:[2,3], t:'mc',
    g(){ const s = shuffle([[3, 4], [4, 4], [2, 5], [5, 3], [3, 3], [2, 4], [4, 5]]).slice(0, 3), area = s.map(([w, h]) => w * h); if (new Set(area).size < 3) return this.g();
      const want = ri(0, 1), t = want ? Math.max(...area) : Math.min(...area), i = area.indexOf(t), u = 20; let g = '', x = 6;
      s.forEach(([w, h], k) => { for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) g += `<rect x="${x + a * u}" y="${10 + b * u}" width="${u}" height="${u}" fill="${COLS[k]}" stroke="${INK}" stroke-width="1.2"/>`; g += txt(x + w * u / 2, 10 + h * u + 16, '가나다'[k], { size: 15, bold: true }); x += w * u + 24; });
      return MC(`<b>가장 ${want ? '넓은' : '좁은'}</b> 것은? (작은 칸의 크기는 모두 같아요)${svg(x, 140, g)}`, ['가나다'[i], ...[0, 1, 2].filter(k => k !== i).map(k => '가나다'[k])], `칸 수를 세어 비교해요: ${area.map((v, k) => `${'가나다'[k]} ${v}칸`).join(', ')} → <b>${'가나다'[i]}</b>`); } },
  { id:'cp-cap', name:'담을 수 있는 양 비교하기', std:'2수03-06', lv:[2,3], t:'mc',
    g(){ const t = ri(0, 1);
      if (t){ const a = ri(3, 8); let b; do b = ri(3, 8); while (b === a); return MC(`가 그릇과 나 그릇에 물을 가득 채운 다음, 똑같은 컵으로 물을 덜어 냈어요. 가는 ${a}번, 나는 ${b}번 덜어 냈어요. 물을 더 많이 담을 수 있는 그릇은?`, [a > b ? '가' : '나', a > b ? '나' : '가'], `컵으로 덜어 낸 횟수가 많을수록 더 많이 담을 수 있어요 → <b>${a > b ? '가' : '나'}</b>`); }
      const h = shuffle([30, 50, 70]), want = ri(0, 1), t2 = want ? Math.max(...h) : Math.min(...h), i = h.indexOf(t2); let g = '';
      h.forEach((v, k) => { const x = 20 + k * 90; g += `<rect x="${x}" y="${100 - v}" width="50" height="${v}" fill="#9CD3F5"/><path d="M${x} 20 L${x} 100 L${x + 50} 100 L${x + 50} 20" fill="none" stroke="${INK}" stroke-width="2.4"/>` + txt(x + 25, 118, '가나다'[k], { size: 15, bold: true }); });
      return MC(`모양과 크기가 같은 그릇에 물이 들어 있어요. 물이 <b>가장 ${want ? '많이' : '적게'}</b> 들어 있는 그릇은?${svg(280, 128, g)}`, ['가나다'[i], ...[0, 1, 2].filter(k => k !== i).map(k => '가나다'[k])], `그릇의 모양과 크기가 같으면 물의 높이가 ${want ? '높을' : '낮을'}수록 물이 ${want ? '많아요' : '적어요'} → <b>${'가나다'[i]}</b>`); } },
  { id:'cp-span', name:'뼘으로 잰 길이 비교', std:'2수03-06', lv:[3,4], t:'both',
    g(){ const a = ri(4, 9), b = ri(3, a - 1), o1 = pick(['책상', '칠판', '사물함', '창문']), o2 = pick(['의자', '책', '필통', '액자'].filter(x => x !== o1));
      return N(`${o1}의 길이는 ${a}뼘, ${o2}의 길이는 ${b}뼘이에요. ${o1}${P(o1, '은', '는')} ${o2}보다 몇 뼘 더 길까요? (같은 사람이 재었어요)`, a - b, `${a} - ${b} = <b>${a - b}뼘</b>`, [a + b > 9 ? a - b + 1 : a + b, a - b - 1, b], '뼘'); } },
  { id:'cp-height', name:'키 순서 정하기', std:'2수03-06', lv:[4,5], t:'mc',
    g(){ const p = shuffle(NAMES).slice(0, 4); // 키: p[0] > p[1] > p[2] > p[3]
      const want = ri(0, 1);
      return MC(`${p[1]}는 ${p[2]}보다 키가 커요. ${p[0]}는 ${p[1]}보다 키가 커요. ${p[3]}는 ${p[2]}보다 키가 작아요. 키가 <b>가장 ${want ? '큰' : '작은'}</b> 사람은?`, [want ? p[0] : p[3], p[1], p[2], want ? p[3] : p[0]], `키가 큰 순서: ${p.join(' → ')} → <b>${want ? p[0] : p[3]}</b>`); } }
]});

/* ─────────────── 5. 50까지의 수 ─────────────── */
A.addUnit({ key:'1-1-5', title:'50까지의 수', items:[
  { id:'n50-ten', name:'10 알아보기', std:'2수01-01', lv:[1,1], t:'both',
    g(){ const t = ri(0, 2), a = ri(1, 9);
      if (t === 0) return N(`9보다 1만큼 더 큰 수는?`, 10, `9 다음 수는 <b>10</b>(십, 열)이에요.`, [8, 11, 9]);
      if (t === 1) return N(`${a}와(과) □를 모으면 10이 돼요. □ 안에 알맞은 수는?${tenFrame(a)}`.replace('와(과)', P(a, '과', '와')), 10 - a, `빈칸이 ${10 - a}개 → <b>${10 - a}</b>`, [10 - a + 1, a, 10 - a - 1]);
      return N(`10은 ${a}와(과) □로 가를 수 있어요. □ 안에 알맞은 수는?`.replace('와(과)', P(a, '과', '와')), 10 - a, `10 = ${a} + <b>${10 - a}</b>`, [a, 10 - a + 1, 10 - a - 1]); } },
  { id:'n50-teen', name:'십몇 알아보기', std:'2수01-01', lv:[1,1], t:'both',
    g(){ const o = ri(1, 9), ic = pick(IC); return N(`10개씩 묶음 1개와 낱개 ${o}개는 얼마일까요?${tens(ic, 10 + o)}`, 10 + o, `10과 ${o} → <b>${10 + o}</b> (${sino(10 + o)}, ${native(10 + o)})`, [o, 10 + o + 1, 10 + o - 1]); } },
  { id:'n50-split', name:'십몇 모으기와 가르기', std:'2수01-04', lv:[2,2], t:'both',
    g(){ const n = ri(11, 18), a = ri(n - 9, 9), t = ri(0, 1);
      return t ? N(`${a}와(과) ${n - a}를 모으면 얼마일까요?`.replace('와(과)', P(a, '과', '와')).replace(`${n - a}를`, `${n - a}${P(n - a, '을', '를')}`), n, `${a}와(과) ${n - a}를 모으면 <b>${n}</b>`.replace('와(과)', P(a, '과', '와')).replace(`${n - a}를`, `${n - a}${P(n - a, '을', '를')}`), [n + 1, n - 1, 10 + Math.abs(a - (n - a))])
        : N(`${n}${P(n, '은', '는')} ${a}와(과) □로 가를 수 있어요. □ 안에 알맞은 수는?`.replace('와(과)', P(a, '과', '와')), n - a, `${n} = ${a} + <b>${n - a}</b>`, [n - a + 1, n - a - 1, a]); } },
  { id:'n50-bundle', name:'10개씩 묶어 세기', std:'2수01-01', lv:[1,2], t:'both',
    g(L){ const t = ri(2, 4), o = L > 1 ? ri(0, 9) : 0, n = t * 10 + o; if (n > 50) return this.g(); const ic = pick(IC);
      return N(`10개씩 묶음 ${t}개${o ? `와 낱개 ${o}개` : ''}는 얼마일까요?${tens(ic, n, 16)}`, n, `10개씩 묶음 ${t}개 = ${t * 10}${o ? `, 낱개 ${o}개 → ${t * 10} + ${o}` : ''} = <b>${n}</b>`, [t + o, n + 10, o * 10 + t]); } },
  { id:'n50-read', name:'50까지의 수 읽기', std:'2수01-01', lv:[2,2], t:'mc',
    g(){ const n = ri(11, 50), ok = `${sino(n)}, ${native(n)}`, others = shuffle(range(11, 50).filter(x => x !== n && x % 10 !== n % 10 || Math.floor(x / 10) !== Math.floor(n / 10))).slice(0, 3);
      return MC(`수 <b style="font-size:24px">${n}</b>을(를) 바르게 읽은 것은?`.replace('을(를)', P(n, '을', '를')), [ok, ...others.map(x => pick([`${sino(x)}, ${native(x)}`, `${sino(n)}, ${native(x)}`]))], `${n} → <b>${sino(n)}</b> 또는 <b>${native(n)}</b>`); } },
  { id:'n50-count', name:'50까지의 수 세기', std:'2수01-01', lv:[2,3], t:'both',
    g(){ const n = ri(15, 50), ic = pick(IC); return N(`모두 몇 개일까요?${tens(ic, n, 15)}`, n, `10개씩 묶음 ${Math.floor(n / 10)}개와 낱개 ${n % 10}개 → <b>${n}개</b>`, [Math.floor(n / 10) + n % 10, n + 10, n - 1], '개'); } },
  { id:'n50-seq', name:'50까지 수의 순서', std:'2수01-03', lv:[2,3], t:'both',
    g(L){ const s = ri(10, 44), seq = range(0, 5).map(i => s + i), h = ri(1, 4), t = L > 2 ? ri(0, 1) : 0;
      if (t) { const a = ri(11, 40), b = a + ri(3, 9); return N(`${a}와(과) ${b} 사이에 있는 수는 모두 몇 개일까요?`.replace('와(과)', P(a, '과', '와')), b - a - 1, `${a + 1}부터 ${b - 1}까지 → <b>${b - a - 1}개</b>`, [b - a, b - a + 1, b - a - 2], '개'); }
      return N(`수의 순서대로 □ 안에 알맞은 수를 써 보세요. ${E(seq.map((x, i) => i === h ? '□' : x).join(' — '))}`, seq[h], `1씩 커지는 순서 → <b>${seq[h]}</b>`, [seq[h] + 1, seq[h] - 1, seq[h] + 10]); } },
  { id:'n50-cmp', name:'50까지 수의 크기 비교', std:'2수01-03', lv:[2,3], t:'mc',
    g(L){ if (L > 2){ const s = shuffle(range(11, 50)).slice(0, 4), mx = ri(0, 1), t = mx ? Math.max(...s) : Math.min(...s); return MC(`<b>가장 ${mx ? '큰' : '작은'}</b> 수는? ${E(s.join(', '))}`, [String(t), ...s.filter(x => x !== t).map(String)], `10개씩 묶음의 수를 먼저 비교하고, 같으면 낱개의 수를 비교해요 → <b>${t}</b>`); }
      const a = ri(11, 50); let b; do b = ri(11, 50); while (b === a); const big = ri(0, 1), v = big ? Math.max(a, b) : Math.min(a, b);
      return MC(`${a}와(과) ${b} 중에서 더 ${big ? '큰' : '작은'} 수는?`.replace('와(과)', P(a, '과', '와')), [String(v), String(v === a ? b : a)], `10개씩 묶음의 수부터 비교해요 → <b>${v}</b>`); } },
  { id:'n50-regroup', name:'낱개를 10개씩 묶기', std:'2수01-01', lv:[3,4], t:'both',
    g(){ const t = ri(1, 3), o = ri(11, 19), n = t * 10 + o; if (n > 50) return this.g();
      return N(`10개씩 묶음 ${t}개와 낱개 ${o}개인 수는 얼마일까요?`, n, `낱개 ${o}개 = 10개씩 묶음 1개와 낱개 ${o - 10}개 → 10개씩 묶음 ${t + 1}개와 낱개 ${o - 10}개 = <b>${n}</b>`, [t * 10 + o - 10, t + o, (t + 1) * 10 + o]); } },
  { id:'n50-cards', name:'수 카드로 수 만들기', std:'2수01-03', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(1, 4)).slice(0, 3).concat([ri(0, 9)]).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3); if (c.length < 3) return this.g();
      const nums = []; c.forEach(a => c.forEach(b => { if (a !== b && a > 0) nums.push(a * 10 + b); })); const ok = nums.filter(x => x <= 50), mx = ri(0, 1), v = mx ? Math.max(...ok) : Math.min(...ok);
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')} 중에서 두 장을 골라 몇십몇을 만들려고 해요. 50보다 크지 않은 수 중에서 가장 ${mx ? '큰' : '작은'} 수는?`, v, `만들 수 있는 수: ${nums.sort((a, b) => a - b).join(', ')} → 50 이하에서 가장 ${mx ? '큰' : '작은'} 수 <b>${v}</b>`, [mx ? Math.max(...nums) : v + 1, v - 1, ok[0] === v ? ok[1] || v + 2 : ok[0]]); } }
]});
})();
