/* =========================================================
   3학년 2학기 문제 만들기 — 수학익힘 3-2(박만구 외) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요. (2022 개정 교육과정)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, gcd, range, dz, nf, josa, F, toF, frH, fr, svg, txt, line, tableH } = A;
const P = (w, a, b) => josa(w, a, b).slice(String(w).length);   // 조사만
const RO = w => { const s = String(w), ch = s[s.length - 1]; if (/[0-9]/.test(ch)) return '036'.includes(ch) ? '으로' : '로'; const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 && c % 28 && c % 28 !== 8 ? '으로' : '로'; };
const NAMES = ['민수', '지아', '수아', '지호', '유나', '시우', '하나', '서아', '도희', '예나', '주아', '태호'];
const E = s => `<div class="expr">${s}</div>`;
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};
const N = (q, v, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: Number.isInteger(dz(v)) ? 'int' : 'dec', v: dz(v), unit }, wrong: wrong.map(dz).filter(x => x > 0 && dz(x) !== dz(v)), ex }, extra);
const Q = (q, f, ex, wrong = [], unit = '', extra = {}) => Object.assign({ q, ans: { k: 'frac', v: toF(f), unit }, wrong, ex }, extra);
const QI = (q, f, ex, wrong = []) => Object.assign({ q, ans: { k: 'frac', v: toF(f), improper: true }, wrong, ex });
const CMP = (a, b) => a > b + 1e-9 ? '&gt;' : a < b - 1e-9 ? '&lt;' : '=';
const CMPC = ['&gt;', '&lt;', '='];
const qr = (q, r) => `몫 ${q}, 나머지 ${r}`;

/* ─────────────── 1. 곱셈 ─────────────── */
A.addUnit({ key:'3-2-1', title:'곱셈', items:[
  { id:'m31-nc', name:'올림이 없는 (세 자리 수) × (한 자리 수)', std:'4수01-04', lv:[1,1], t:'both',
    g(){ let a, b; do { a = ri(111, 433); b = ri(2, 3); } while (String(a).split('').some(d => d * b >= 10)); return N(`${a} × ${b}의 값은?`, a * b, `백의 자리, 십의 자리, 일의 자리를 각각 ${b}배 해요 → <b>${a * b}</b>`, [a * b + 10, a + b, a * b - 100]); } },
  { id:'m31-c', name:'올림이 한 번 있는 (세 자리 수) × (한 자리 수)', std:'4수01-04', lv:[1,2], t:'both',
    g(){ let a, b, c; do { a = ri(112, 499); b = ri(2, 4); const d = String(a).split('').map(Number).reverse(); let cr = 0; c = 0; d.forEach(x => { const v = x * b + cr; cr = v >= 10 ? Math.floor(v / 10) : 0; if (cr) c++; }); } while (c !== 1 || a * b > 999); return N(`${a} × ${b}의 값은?`, a * b, `일의 자리부터 곱하고 올림한 수를 윗자리 곱에 더해요 → <b>${a * b}</b>`, [a * b - 10, a * b + 100, a * b - 100]); } },
  { id:'m31-cc', name:'올림이 여러 번 있는 (세 자리 수) × (한 자리 수)', std:'4수01-04', lv:[2,3], t:'both',
    g(){ const a = ri(234, 899), b = ri(3, 9); return N(`${a} × ${b}의 값은?`, a * b, `올림한 수를 빠뜨리지 않고 더해요 → <b>${a * b}</b>`, [a * b - 10, a * b - 100, a * b + 1000]); } },
  { id:'m-tens', name:'(몇십) × (몇십), (몇십몇) × (몇십)', std:'4수01-04', lv:[1,2], t:'both',
    g(){ if (ri(0, 1)){ const a = ri(2, 9) * 10, b = ri(2, 9) * 10; return N(`${a} × ${b}의 값은?`, a * b, `${a / 10} × ${b / 10} = ${a * b / 100} → 뒤에 0을 2개 붙여 <b>${a * b}</b>`, [a * b / 10, a * b * 10, a + b]); }
      const a = ri(12, 89), b = ri(2, 9) * 10; return N(`${a} × ${b}의 값은?`, a * b, `${a} × ${b / 10} = ${a * b / 10} → 10배 하면 <b>${a * b}</b>`, [a * b / 10, a * b * 10, a * b + 10]); } },
  { id:'m12', name:'(한 자리 수) × (두 자리 수)', std:'4수01-04', lv:[2,2], t:'both',
    g(){ const a = ri(3, 9), b = ri(12, 89); return N(`${a} × ${b}의 값은?`, a * b, `${a} × ${Math.floor(b / 10) * 10} + ${a} × ${b % 10} = ${a * Math.floor(b / 10) * 10} + ${a * (b % 10)} = <b>${a * b}</b>`, [a * b - 10, a * b + 10, a * Math.floor(b / 10) + a * (b % 10)]); } },
  { id:'m22', name:'(두 자리 수) × (두 자리 수)', std:'4수01-04', lv:[2,3], t:'both',
    g(){ const a = ri(12, 89), b = ri(12, 89); return N(`${a} × ${b}의 값은?`, a * b, `${a} × ${b % 10} = ${a * (b % 10)}, ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10} → 더하면 <b>${a * b}</b>`, [a * (b % 10) + a * Math.floor(b / 10), a * b - 100, a * b + 10]); } },
  { id:'m-word', name:'곱셈 생활 문제', std:'4수01-04', lv:[3,3], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const a = ri(12, 48), b = ri(12, 35); return N(`한 상자에 털실이 ${a}뭉치씩 들어 있어요. ${b}상자에 들어 있는 털실은 모두 몇 뭉치일까요?`, a * b, `${a} × ${b} = <b>${a * b}뭉치</b>`, [a + b, a * b - 10], '뭉치'); }
      if (t === 1){ const a = ri(15, 40), b = ri(11, 30); return N(`놀이기구 한 번에 ${a}명이 탈 수 있어요. 하루에 ${b}번 운행하면 탈 수 있는 사람은 모두 몇 명일까요?`, a * b, `${a} × ${b} = <b>${a * b}명</b>`, [a + b, a * b + 10], '명'); }
      const a = ri(150, 450), b = ri(2, 4); return N(`집에서 우체국까지 ${a} m예요. 집에서 우체국까지 갔다가 다시 집으로 오는 것을 ${b}번 했다면 걸은 거리는 모두 몇 m일까요?`, a * 2 * b, `한 번 왕복 ${a} × 2 = ${a * 2} m → ${a * 2} × ${b} = <b>${a * 2 * b} m</b>`, [a * b, a * 2, a * 2 * b + a], 'm'); } },
  { id:'m-cmp', name:'곱의 크기 비교하기', std:'4수01-04', lv:[3,3], t:'mc',
    g(){ const x = [ri(12, 60), ri(12, 60)], y = [ri(12, 60), ri(12, 60)], c = CMP(x[0] * x[1], y[0] * y[1]);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${x[0]} × ${x[1]} ○ ${y[0]} × ${y[1]}`)}`, [c, ...CMPC.filter(z => z !== c)], `${x[0]} × ${x[1]} = ${x[0] * x[1]}, ${y[0]} × ${y[1]} = ${y[0] * y[1]} → <b>${c}</b>`); } },
  { id:'m-est', name:'곱을 어림하기', std:'4수01-08', lv:[3,4], t:'mc',
    g(){ const th = pick([1000, 2000, 1500]); let ok; do { ok = [ri(30, 99), ri(30, 99)]; } while (ok[0] * ok[1] <= th + 200);
      const bads = []; let t = 0; while (bads.length < 3 && t < 200){ t++; const b = [ri(11, 45), ri(11, 45)]; if (b[0] * b[1] < th - 100 && !bads.some(x => x.join() === b.join())) bads.push(b); }
      return MC(`어림하여 계산 결과가 <b>${th}보다 큰</b> 곱셈을 고르세요.`, [ok, ...bads].map(x => `${x[0]} × ${x[1]}`), `${ok[0]} × ${ok[1]}${P(ok[1], '은', '는')} 약 ${Math.round(ok[0] / 10) * 10} × ${Math.round(ok[1] / 10) * 10} = ${Math.round(ok[0] / 10) * 10 * Math.round(ok[1] / 10) * 10} → ${th}보다 커요.`); } },
  { id:'m-time', name:'곱셈으로 시간·날수 구하기', std:'4수01-04', lv:[4,4], t:'both',
    g(){ if (ri(0, 1)){ const m = pick([[1, 31], [3, 31], [4, 30], [6, 30], [8, 31], [9, 30]]); return N(`${m[0]}월은 모두 몇 시간일까요?`, m[1] * 24, `${m[0]}월은 ${m[1]}일, 하루는 24시간 → ${m[1]} × 24 = <b>${m[1] * 24}시간</b>`, [m[1] * 12, m[1] * 60, m[1] + 24], '시간'); }
      const w = ri(11, 25); return N(`${w}주는 모두 며칠일까요?`, w * 7, `1주 = 7일 → ${w} × 7 = <b>${w * 7}일</b>`, [w * 5, w + 7, w * 7 + 7], '일'); } },
  { id:'m-missing', name:'□ 안에 알맞은 수 구하기', std:'4수01-04', lv:[4,4], t:'both',
    g(){ const a = ri(101, 329), b = ri(2, 3); return N(`□ × ${b} = ${a * b}에서 □ 안에 알맞은 수는?`, a, `${b}${P(b, '과', '와')} 곱해서 ${a * b}${P(a * b, '이', '가')} 되는 수 → <b>${a}</b>`, [a + 1, a * b - b, a - 10]); } },
  { id:'m-cards', name:'수 카드로 곱이 가장 큰 곱셈식 만들기', std:'4수01-04', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 4); let best = 0, ex = ''; const perm = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r]));
      perm(c).forEach(([p, q, r, s]) => { const v = (p * 10 + q) * (r * 10 + s); if (v > best){ best = v; ex = `${p}${q} × ${r}${s}`; } });
      return N(`수 카드 ${c.map(x => `<b>${x}</b>`).join(', ')}${P(c[c.length - 1], '을', '를')} 한 번씩만 사용하여 (두 자리 수) × (두 자리 수)를 만들려고 해요. 곱이 가장 클 때의 곱은?`, best, `가장 큰 두 수를 십의 자리에 놓고 비교해 보면 ${ex} = <b>${best}</b>`, [best - 90, best - 9, best + 10]); } }
]});

/* ─────────────── 2. 나눗셈 ─────────────── */
A.addUnit({ key:'3-2-2', title:'나눗셈', items:[
  { id:'d-tens', name:'내림이 없는 (몇십) ÷ (몇)', std:'4수01-06', lv:[1,1], t:'both',
    g(){ const b = ri(2, 4), q = ri(1, 4) * 10; if (b * q > 90) return this.g(); return N(`${b * q} ÷ ${b}의 몫은?`, q, `${b * q / 10} ÷ ${b} = ${q / 10} → 몫은 10배인 <b>${q}</b>`, [q / 10, q + 10, b]); } },
  { id:'d-nb', name:'내림이 없는 (몇십몇) ÷ (몇)', std:'4수01-06', lv:[1,2], t:'both',
    g(){ let b, q; do { b = ri(2, 4); q = ri(11, 33); } while (Math.floor(q / 10) * b >= 10 || (q % 10) * b >= 10); return N(`${b * q} ÷ ${b}의 몫은?`, q, `십의 자리 ${Math.floor(b * q / 10)} ÷ ${b} = ${Math.floor(q / 10)}, 일의 자리 ${b * q % 10} ÷ ${b} = ${q % 10} → <b>${q}</b>`, [q + 10, q - 1, q * 10]); } },
  { id:'d-carry', name:'내림이 있는 (몇십몇) ÷ (몇)', std:'4수01-06', lv:[2,2], t:'both',
    g(){ let b, q; do { b = ri(2, 7); q = ri(12, 49); } while (b * q > 99 || Math.floor(b * q / 10) % b === 0); return N(`${b * q} ÷ ${b}의 몫은?`, q, `십의 자리에서 나누고 남은 수를 일의 자리로 내려 계산해요 → <b>${q}</b>`, [q + 10, q - 10, q + 1]); } },
  { id:'d-rem', name:'나머지가 있는 (몇십몇) ÷ (몇)', std:'4수01-06', lv:[2,3], t:'mc',
    g(){ const b = ri(3, 9), q = ri(3, Math.floor(99 / b) - 1), r = ri(1, b - 1), a = b * q + r;
      return MC(`${a} ÷ ${b}의 몫과 나머지는?`, [qr(q, r), qr(q - 1, r + b), qr(q + 1, r), qr(q, r + 1 < b ? r + 1 : r - 1)], `${b} × ${q} = ${b * q}, ${a} - ${b * q} = ${r} → <b>${qr(q, r)}</b> (나머지는 ${b}보다 작아야 해요)`); } },
  { id:'d-remv', name:'나머지 구하기', std:'4수01-06', lv:[2,3], t:'both',
    g(){ const b = ri(3, 9), q = ri(3, Math.floor(99 / b) - 1), r = ri(1, b - 1), a = b * q + r;
      return N(`${a} ÷ ${b}의 나머지는?`, r, `${a} ÷ ${b} = ${q} … ${r} → 나머지 <b>${r}</b>`, [q, r + 1, b - r === r ? r + 2 : b - r]); } },
  { id:'d-check', name:'계산 결과 확인하기 (나누어지는 수 구하기)', std:'4수01-06', lv:[3,3], t:'both',
    g(){ const b = ri(3, 9), q = ri(4, 15), r = ri(1, b - 1), a = b * q + r;
      return N(`어떤 수를 ${b}${RO(b)} 나누었더니 몫이 ${q}, 나머지가 ${r}${P(r, '이었', '였')}어요. 어떤 수는?`, a, `(나누는 수) × (몫) + (나머지) = ${b} × ${q} + ${r} = <b>${a}</b>`, [b * q, b * q - r, a + b]); } },
  { id:'d-3', name:'(세 자리 수) ÷ (한 자리 수)', std:'4수01-06', lv:[3,4], t:'both',
    g(){ const b = ri(2, 9), q = ri(Math.ceil(100 / b) + 1, Math.floor(999 / b)); return N(`${b * q} ÷ ${b}의 몫은?`, q, `높은 자리부터 차례로 나누어요 → <b>${q}</b> (확인: ${b} × ${q} = ${b * q})`, [q + 10, q - 1, q * 10 > 999 ? q + 2 : q * 10]); } },
  { id:'d-3rem', name:'나머지가 있는 (세 자리 수) ÷ (한 자리 수)', std:'4수01-06', lv:[3,4], t:'mc',
    g(){ const b = ri(3, 9), q = ri(Math.ceil(100 / b) + 1, Math.floor(990 / b)), r = ri(1, b - 1), a = b * q + r;
      if (a > 999) return this.g();
      return MC(`${a} ÷ ${b}의 몫과 나머지는?`, [qr(q, r), qr(q - 1, r + b), qr(q + 1, r), qr(q - 10, r)], `${a} ÷ ${b} = ${q} … ${r} (확인: ${b} × ${q} + ${r} = ${a})`); } },
  { id:'d-word', name:'나눗셈 생활 문제', std:'4수01-06', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const b = ri(3, 8), q = ri(5, 15), r = ri(1, b - 1); return N(`색종이 ${b * q + r}장을 한 명에게 ${b}장씩 나누어 주면 몇 명에게 줄 수 있을까요?`, q, `${b * q + r} ÷ ${b} = ${q} … ${r} → <b>${q}명</b>에게 주고 ${r}장이 남아요.`, [q + 1, r, b], '명'); }
      if (t === 1){ const b = ri(4, 9), q = ri(5, 12), r = ri(1, b - 1); return N(`사과 ${b * q + r}개를 한 바구니에 ${b}개씩 담아요. 사과를 <b>모두</b> 담으려면 바구니는 적어도 몇 개 필요할까요?`, q + 1, `${b * q + r} ÷ ${b} = ${q} … ${r} → 남은 ${r}개도 담아야 하므로 ${q} + 1 = <b>${q + 1}개</b>`, [q, q + 2, r], '개'); }
      const k = ri(2, 6), q = ri(11, 40); return N(`책 ${k * q}권을 책꽂이 ${k}칸에 똑같이 나누어 꽂으면 한 칸에 몇 권씩 꽂을 수 있을까요?`, q, `${k * q} ÷ ${k} = <b>${q}권</b>`, [q + 1, k, q - 10], '권'); } },
  { id:'d-remmax', name:'나머지가 될 수 있는 수', std:'4수01-06', lv:[4,5], t:'both',
    g(){ const b = ri(3, 9), t = ri(0, 1);
      if (t) return N(`어떤 수를 ${b}${RO(b)} 나누었을 때 나머지가 될 수 있는 수 중 가장 큰 수는?`, b - 1, `나머지는 나누는 수 ${b}보다 작아야 해요 → <b>${b - 1}</b>`, [b, b + 1, b - 2 > 0 ? b - 2 : b + 2]);
      const q = ri(4, 12); return N(`□ ÷ ${b}의 몫이 ${q}일 때, □ 안에 들어갈 수 있는 수 중 가장 큰 수는?`, b * q + b - 1, `나머지가 가장 클 때(${b - 1}) □가 가장 커요 → ${b} × ${q} + ${b - 1} = <b>${b * q + b - 1}</b>`, [b * q, b * q + b, b * (q + 1) + 1]); } },
  { id:'d-divisible', name:'나누어떨어지게 하는 수 찾기', std:'4수01-06', lv:[5,5], t:'both',
    g(){ const b = pick([3, 4, 6, 7]), t = ri(1, 9), v = range(0, 9).filter(x => (t * 10 + x) % b === 0).length;
      return N(`두 자리 수 ${t}□을(를) ${b}${RO(b)} 나누면 나누어떨어져요. □ 안에 들어갈 수 있는 숫자(0~9)는 모두 몇 개일까요?`, v, `${range(0, 9).filter(x => (t * 10 + x) % b === 0).map(x => `${t}${x}`).join(', ')} → <b>${v}개</b>`, [v + 1, v + 2, b], '개'); } }
]});

/* ─────────────── 3. 원 ─────────────── */
const circleFig = (r, lab, kind = 'r') => { const C = 75, R = 60; return svg(150, 150, `<circle cx="${C}" cy="${C}" r="${R}" fill="#EEF6FF" stroke="#22314A" stroke-width="2.2"/><circle cx="${C}" cy="${C}" r="3.5" fill="#22314A"/>` + (kind === 'r' ? line(C, C, C + R * .8, C - R * .6, { stroke: '#E5546B', w: 2.4 }) + txt(C + 28, C - 34, lab, { size: 13, bold: true, fill: '#C2410C' }) : line(C - R, C, C + R, C, { stroke: '#E5546B', w: 2.4 }) + txt(C, C - 12, lab, { size: 13, bold: true, fill: '#C2410C' }))); };
A.addUnit({ key:'3-2-3', title:'원', items:[
  { id:'c-rd', name:'반지름과 지름의 관계', std:'4수03-06', lv:[1,1], t:'both',
    g(){ const r = ri(2, 15);
      return ri(0, 1) ? N(`반지름이 ${r} cm인 원의 지름은 몇 cm일까요?`, 2 * r, `지름은 반지름의 2배 → ${r} × 2 = <b>${2 * r} cm</b>`, [r, r + 2, 4 * r], 'cm', { fig: circleFig(r, `${r} cm`) })
        : N(`지름이 ${2 * r} cm인 원의 반지름은 몇 cm일까요?`, r, `반지름은 지름의 반 → ${2 * r} ÷ 2 = <b>${r} cm</b>`, [2 * r, 4 * r, r + 1], 'cm', { fig: circleFig(r, `${2 * r} cm`, 'd') }); } },
  { id:'c-term', name:'원의 중심, 반지름, 지름 알기', std:'4수03-06', lv:[1,2], t:'mc',
    g(){ return pick([
      () => MC('원의 중심과 원 위의 한 점을 이은 선분을 무엇이라고 할까요?', ['반지름', '지름', '원의 중심', '선분의 끝'], '원의 중심과 원 위의 한 점을 이은 선분이 <b>반지름</b>이에요.'),
      () => MC('원 위의 두 점을 이은 선분이 원의 중심을 지날 때, 이 선분을 무엇이라고 할까요?', ['지름', '반지름', '직선', '반직선'], '원의 중심을 지나는 선분이 <b>지름</b>이에요.'),
      () => MC('원을 그릴 때 누름 못이 꽂혔던 점을 무엇이라고 할까요?', ['원의 중심', '꼭짓점', '반지름', '지름'], '원의 한가운데 점을 <b>원의 중심</b>이라고 해요.')])(); } },
  { id:'c-prop', name:'원의 성질', std:'4수03-06', lv:[2,2], t:'mc',
    g(){ return pick([
      () => MC('원의 지름에 대한 설명으로 옳은 것은?', ['원을 똑같이 둘로 나눠요.', '한 원에 지름은 1개뿐이에요.', '지름은 반지름보다 짧아요.', '지름은 원의 중심을 지나지 않아요.'], '지름은 원을 똑같이 둘로 나누고, 원 안에 그을 수 있는 가장 긴 선분이에요. 한 원에 지름은 셀 수 없이 많아요.'),
      () => MC('한 원에서 반지름에 대한 설명으로 옳은 것은?', ['반지름은 셀 수 없이 많고 길이가 모두 같아요.', '반지름은 2개뿐이에요.', '반지름은 지름의 2배예요.', '반지름마다 길이가 달라요.'], '한 원에서 반지름은 셀 수 없이 많이 그을 수 있고 길이가 모두 같아요.'),
      () => MC('원 안에 그을 수 있는 가장 긴 선분은?', ['지름', '반지름', '원의 중심', '모두 같아요'], '원 위의 두 점을 이은 선분 중 원의 중심을 지나는 <b>지름</b>이 가장 길어요.')])(); } },
  { id:'c-compass', name:'컴퍼스로 원 그리기', std:'4수03-07', lv:[2,3], t:'both',
    g(){ const r = ri(2, 12);
      return ri(0, 1) ? N(`컴퍼스를 ${r} cm만큼 벌려서 원을 그렸어요. 그린 원의 지름은 몇 cm일까요?`, 2 * r, `컴퍼스를 벌린 길이 = 반지름 ${r} cm → 지름 <b>${2 * r} cm</b>`, [r, 4 * r, r + 2], 'cm')
        : N(`지름이 ${2 * r} cm인 원을 그리려면 컴퍼스를 몇 cm만큼 벌려야 할까요?`, r, `컴퍼스는 반지름만큼 벌려요 → ${2 * r} ÷ 2 = <b>${r} cm</b>`, [2 * r, r + 1, 4 * r], 'cm'); } },
  { id:'c-big', name:'가장 큰 원 찾기', std:'4수03-06', lv:[3,3], t:'mc',
    g(){ const r = shuffle(range(3, 12)).slice(0, 3), lab = [`반지름이 ${r[0]} cm인 원`, `지름이 ${2 * r[1]} cm인 원`, `컴퍼스를 ${r[2]} cm 벌려 그린 원`], i = r.indexOf(Math.max(...r));
      return MC('가장 큰 원은?', [lab[i], ...lab.filter((_, k) => k !== i)], `반지름으로 비교해요: ${r[0]} cm, ${2 * r[1]} ÷ 2 = ${r[1]} cm, ${r[2]} cm → <b>${lab[i]}</b>`); } },
  { id:'c-row', name:'이어 붙인 원의 길이', std:'4수03-06', lv:[3,4], t:'both',
    g(){ const n = ri(2, 5), r = ri(2, 8);
      return N(`반지름이 ${r} cm인 원 ${n}개를 한 줄로 맞닿게 붙여 놓았어요. 양 끝 원의 바깥쪽 끝 사이의 거리는 몇 cm일까요?`, 2 * r * n, `원 하나의 지름은 ${2 * r} cm → ${2 * r} × ${n} = <b>${2 * r * n} cm</b>`, [r * n, 2 * r * n - r, 2 * r * (n + 1)], 'cm'); } },
  { id:'c-inner', name:'큰 원 안의 작은 원', std:'4수03-06', lv:[4,4], t:'both',
    g(){ const R = 2 * ri(2, 9);
      return N(`반지름이 ${R} cm인 큰 원 안에 크기가 같은 작은 원 2개를 큰 원의 지름 위에 꼭 맞게 그렸어요. 작은 원의 반지름은 몇 cm일까요?`, R / 2, `작은 원 2개의 지름의 합 = 큰 원의 지름 ${2 * R} cm → 작은 원의 지름 ${R} cm → 반지름 <b>${R / 2} cm</b>`, [R, 2 * R, R / 2 + 1], 'cm'); } },
  { id:'c-centers', name:'원의 중심을 이은 선분의 길이', std:'4수03-06', lv:[4,5], t:'both',
    g(){ const a = ri(2, 9), b = ri(2, 9);
      return N(`반지름이 ${a} cm인 원과 반지름이 ${b} cm인 원이 한 점에서 맞닿아 있어요. 두 원의 중심을 이은 선분의 길이는 몇 cm일까요?`, a + b, `맞닿은 점까지 각각 반지름 → ${a} + ${b} = <b>${a + b} cm</b>`, [2 * (a + b), a * b, Math.abs(a - b) || a + b + 1], 'cm'); } },
  { id:'c-square', name:'원과 사각형', std:'4수03-06', lv:[5,5], t:'both',
    g(){ const r = ri(2, 6), n = ri(2, 4);
      return ri(0, 1) ? N(`반지름이 ${r} cm인 원이 꼭 맞게 들어가는 정사각형의 네 변의 길이의 합은 몇 cm일까요?`, 8 * r, `정사각형의 한 변 = 원의 지름 ${2 * r} cm → ${2 * r} × 4 = <b>${8 * r} cm</b>`, [4 * r, 2 * r, 16 * r], 'cm')
        : N(`반지름이 ${r} cm인 원 ${n}개를 가로로 맞닿게 이어 붙이고, 원들이 꼭 맞게 들어가는 직사각형을 그렸어요. 직사각형의 네 변의 길이의 합은 몇 cm일까요?`, 2 * (2 * r * n + 2 * r), `가로 ${2 * r} × ${n} = ${2 * r * n} cm, 세로 ${2 * r} cm → (${2 * r * n} + ${2 * r}) × 2 = <b>${2 * (2 * r * n + 2 * r)} cm</b>`, [2 * r * n + 2 * r, 4 * r * n, 2 * (r * n + r)], 'cm'); } }
]});

/* ─────────────── 4. 들이와 무게 ─────────────── */
const LmL = v => `${Math.floor(v / 1000) ? Math.floor(v / 1000) + ' L ' : ''}${v % 1000 ? v % 1000 + ' mL' : (Math.floor(v / 1000) ? '' : '0 mL')}`.trim();
const kgg = v => `${Math.floor(v / 1000) ? Math.floor(v / 1000) + ' kg ' : ''}${v % 1000 ? v % 1000 + ' g' : (Math.floor(v / 1000) ? '' : '0 g')}`.trim();
const mix = () => ri(1, 6) * 1000 + ri(1, 19) * 50;
A.addUnit({ key:'3-2-4', title:'들이와 무게', items:[
  { id:'cap-conv', name:'L와 mL의 관계', std:'4수03-18', lv:[1,2], t:'both',
    g(){ const v = mix(); return ri(0, 1) ? N(`${LmL(v)}는 몇 mL일까요?`, v, `1 L = 1000 mL → ${Math.floor(v / 1000)} L = ${Math.floor(v / 1000) * 1000} mL → <b>${v} mL</b>`, [Math.floor(v / 1000) * 100 + v % 1000, Math.floor(v / 1000) + v % 1000, v * 10], 'mL')
      : N(`${v} mL는 몇 L 몇 mL일까요? <b>mL 부분</b>의 수를 구하세요.`, v % 1000, `${v} mL = ${Math.floor(v / 1000) * 1000} mL + ${v % 1000} mL = ${Math.floor(v / 1000)} L <b>${v % 1000} mL</b>`, [Math.floor(v / 1000), v % 100 || v % 1000 + 100, v], 'mL'); } },
  { id:'cap-unit', name:'들이의 단위 고르기와 어림하기', std:'4수03-17', lv:[1,2], t:'mc',
    g(){ const c = pick([['물병의 들이', '약 500 mL'], ['욕조의 들이', '약 200 L'], ['요구르트 병의 들이', '약 65 mL'], ['양동이의 들이', '약 8 L'], ['종이컵의 들이', '약 180 mL']]);
      const all = ['약 500 mL', '약 200 L', '약 65 mL', '약 8 L', '약 180 mL', '약 5 mL', '약 2000 L'];
      return MC(`${c[0]}${RO(c[0])} 가장 알맞은 것은?`, [c[1], ...shuffle(all.filter(x => x !== c[1])).slice(0, 3)], `${c[0]}${P(c[0], '은', '는')} <b>${c[1]}</b>쯤이에요. 큰 그릇은 L, 작은 그릇은 mL로 나타내요.`); } },
  { id:'cap-add', name:'들이의 덧셈', std:'4수03-19', lv:[2,3], t:'mc',
    g(){ const a = mix(), b = mix(), s = a + b;
      return MC(`${LmL(a)} + ${LmL(b)}는 얼마일까요?`, [LmL(s), LmL(s - 1000), LmL(s + 100), LmL(s + 1000)], `L는 L끼리, mL는 mL끼리 더하고 1000 mL는 1 L로 받아올림해요 → <b>${LmL(s)}</b>`); } },
  { id:'cap-sub', name:'들이의 뺄셈', std:'4수03-19', lv:[2,3], t:'mc',
    g(){ let a = mix(), b = mix(); if (a <= b) [a, b] = [b + 1000, a]; const d = a - b;
      return MC(`${LmL(a)} - ${LmL(b)}는 얼마일까요?`, [LmL(d), LmL(d + 1000), LmL(d > 1100 ? d - 100 : d + 200), LmL(d + 100)], `mL끼리 뺄 수 없으면 1 L를 1000 mL로 받아내려요 → <b>${LmL(d)}</b>`); } },
  { id:'cap-word', name:'들이 생활 문제', std:'4수03-19', lv:[3,4], t:'both',
    g(){ const a = mix(), b = ri(2, 9) * 100 + ri(0, 1) * 50;
      return ri(0, 1) ? N(`포도주스 ${LmL(a)} 중에서 ${b} mL를 마셨어요. 남은 포도주스는 몇 mL일까요?`, a - b, `${a} mL - ${b} mL = <b>${a - b} mL</b> (= ${LmL(a - b)})`, [a + b, a - b + 100, a - b - 1000 > 0 ? a - b - 1000 : a - b + 1000], 'mL')
        : N(`양동이에 물이 ${LmL(a)} 들어 있어요. 물을 ${b} mL 더 부으면 양동이의 물은 모두 몇 mL일까요?`, a + b, `${a} mL + ${b} mL = <b>${a + b} mL</b> (= ${LmL(a + b)})`, [a - b, a + b + 1000, a + b - 100], 'mL'); } },
  { id:'cap-cmp', name:'들이 비교하기', std:'4수03-18', lv:[3,3], t:'mc',
    g(){ const L = ri(2, 6), m = ri(1, 9) * 100, v = L * 1000 + m, alt = [`${v} mL`, `${L} L ${m} mL`, `${L} L보다 ${m} mL 더 많은 들이`], odd = pick([`${L} L ${m / 10} mL`, `${L * 100 + m} mL`, `${L} L ${m + 100} mL`]);
      return MC('들이가 <b>다른</b> 하나는?', [odd, ...alt], `${L} L ${m} mL = ${v} mL예요. 나머지는 모두 ${v} mL와 같아요.`); } },
  { id:'w-conv', name:'kg과 g의 관계', std:'4수03-21', lv:[1,2], t:'both',
    g(){ const v = mix(); return ri(0, 1) ? N(`${kgg(v)}은 몇 g일까요?`, v, `1 kg = 1000 g → <b>${v} g</b>`, [Math.floor(v / 1000) * 100 + v % 1000, Math.floor(v / 1000) + v % 1000, v * 10], 'g')
      : N(`${v} g은 몇 kg 몇 g일까요? <b>g 부분</b>의 수를 구하세요.`, v % 1000, `${v} g = ${Math.floor(v / 1000)} kg <b>${v % 1000} g</b>`, [Math.floor(v / 1000), v, v % 1000 + 100], 'g'); } },
  { id:'w-t', name:'t과 kg의 관계', std:'4수03-22', lv:[2,3], t:'both',
    g(){ if (ri(0, 1)){ const t = ri(2, 9); return N(`${t} t은 몇 kg일까요?`, t * 1000, `1 t = 1000 kg → <b>${t * 1000} kg</b>`, [t * 100, t * 10000, t + 1000], 'kg'); }
      const w = pick([20, 25, 40, 50]), n = 1000 / w * ri(1, 5); return N(`무게가 ${w} kg인 상자 ${n}개의 무게는 모두 몇 t일까요?`, w * n / 1000, `${w} × ${n} = ${w * n} kg = <b>${w * n / 1000} t</b>`, [w * n / 100, w * n, w * n / 1000 + 1], 't'); } },
  { id:'w-unit', name:'무게의 단위 고르기와 어림하기', std:'4수03-20', lv:[1,2], t:'mc',
    g(){ const c = pick([['사과 한 개의 무게', '약 300 g'], ['3학년 학생의 몸무게', '약 30 kg'], ['코끼리의 무게', '약 5 t'], ['공책 한 권의 무게', '약 100 g'], ['수박 한 통의 무게', '약 5 kg']]);
      const all = ['약 300 g', '약 30 kg', '약 5 t', '약 100 g', '약 5 kg', '약 3 g', '약 300 t'];
      return MC(`${c[0]}${RO(c[0])} 가장 알맞은 것은?`, [c[1], ...shuffle(all.filter(x => x !== c[1])).slice(0, 3)], `${c[0]}${P(c[0], '은', '는')} <b>${c[1]}</b>쯤이에요.`); } },
  { id:'w-add', name:'무게의 덧셈과 뺄셈', std:'4수03-23', lv:[2,3], t:'mc',
    g(){ const a = mix(), b = mix(), plus = ri(0, 1); let x = a, y = b; if (!plus && x <= y) [x, y] = [y + 1000, x]; const r = plus ? x + y : x - y;
      return MC(`${kgg(x)} ${plus ? '+' : '-'} ${kgg(y)}은 얼마일까요?`, [kgg(r), kgg(r + 1000), kgg(r > 1100 ? r - 100 : r + 200), kgg(r + 100)], `kg은 kg끼리, g은 g끼리 계산하고 1000 g = 1 kg으로 받아올림(받아내림)해요 → <b>${kgg(r)}</b>`); } },
  { id:'w-word', name:'무게 생활 문제', std:'4수03-23', lv:[3,4], t:'both',
    g(){ const bag = ri(1, 2) * 1000 + ri(1, 9) * 100, stuff = mix();
      return ri(0, 1) ? N(`빈 가방의 무게는 ${kgg(bag)}이에요. 물건을 넣었더니 ${kgg(bag + stuff)}이 되었어요. 넣은 물건의 무게는 몇 g일까요?`, stuff, `${bag + stuff} g - ${bag} g = <b>${stuff} g</b> (= ${kgg(stuff)})`, [bag + stuff, stuff + 1000, stuff - 100], 'g')
        : N(`저울에 밀가루 ${kgg(stuff)}이 올려져 있어요. 여기에 ${kgg(bag)}을 더 올리면 밀가루는 모두 몇 g일까요?`, bag + stuff, `${stuff} g + ${bag} g = <b>${bag + stuff} g</b> (= ${kgg(bag + stuff)})`, [stuff - bag > 0 ? stuff - bag : stuff + 1, bag + stuff + 1000, bag + stuff - 100], 'g'); } },
  { id:'mw-two', name:'들이·무게 두 단계 문제', std:'4수03-23', lv:[4,5], t:'both',
    g(){ if (ri(0, 1)){ const a = mix(), use = ri(3, 9) * 100, add = ri(2, 9) * 100 + ri(0, 1) * 50; if (a - use <= 0) return this.g(); const r = a - use + add;
        return N(`물통에 물이 ${LmL(a)} 있었어요. 그중 ${use} mL를 사용하고 다시 ${add} mL를 부었어요. 지금 물통의 물은 몇 mL일까요?`, r, `${a} - ${use} + ${add} = <b>${r} mL</b> (= ${LmL(r)})`, [a - use - add > 0 ? a - use - add : a + use, a + use + add, r + 100], 'mL'); }
      const box = ri(3, 9) * 100, one = ri(2, 8) * 100 + ri(0, 1) * 50, n = ri(2, 4), tot = box + one * n;
      return N(`무게가 ${box} g인 바구니에 무게가 ${one} g인 멜론 ${n}개를 담았어요. 바구니 전체의 무게는 몇 g일까요?`, tot, `${one} × ${n} = ${one * n} g, ${one * n} + ${box} = <b>${tot} g</b> (= ${kgg(tot)})`, [box + one, one * n, tot + one], 'g'); } },
  { id:'w-cmp', name:'무게 비교하기', std:'4수03-21', lv:[3,4], t:'mc',
    g(){ const a = mix(), b = mix(), c = mix(), d = mix(); const x = a + b, y = Math.max(c, d) - Math.min(c, d) + 2000;
      if (x === y) return this.g();
      const L1 = `${kgg(a)} + ${kgg(b)}`, L2 = `${kgg(y + Math.min(c, d))} - ${kgg(Math.min(c, d))}`;
      return MC('무게가 더 무거운 것은?', [x > y ? L1 : L2, x > y ? L2 : L1, '두 무게가 같아요'], `${L1} = ${kgg(x)}, ${L2} = ${kgg(y)} → <b>${x > y ? L1 : L2}</b>`); } }
]});

/* ─────────────── 5. 분수 ─────────────── */
A.addUnit({ key:'3-2-5', title:'분수', items:[
  { id:'fo-part', name:'전체의 분수만큼은 얼마인지 알기 (단위분수)', std:'4수01-09', lv:[1,2], t:'both',
    g(){ const d = ri(2, 8), k = ri(2, 6); return N(`${d * k}의 ${fr(1, d)}은(는) 얼마일까요?`, k, `${d * k}${P(d * k, '을', '를')} 똑같이 ${d}묶음으로 나눈 것 중 1묶음 → ${d * k} ÷ ${d} = <b>${k}</b>`, [d, k + 1, d * k - k]); } },
  { id:'fo-part2', name:'전체의 분수만큼은 얼마인지 알기', std:'4수01-09', lv:[2,3], t:'both',
    g(){ const d = ri(3, 8), n = ri(2, d - 1), k = ri(2, 6); return N(`${d * k}의 ${fr(n, d)}은(는) 얼마일까요?`, n * k, `${d * k}${P(d * k, '을', '를')} ${d}묶음으로 나누면 한 묶음 ${k} → ${n}묶음은 ${k} × ${n} = <b>${n * k}</b>`, [k, d * k - n * k, n * k + 1]); } },
  { id:'fo-group', name:'부분은 전체의 몇 분의 몇인지 알기', std:'4수01-09', lv:[1,2], t:'both',
    g(){ let d, n, k; do { d = ri(3, 8); n = ri(1, d - 1); k = ri(2, 4); } while (gcd(n, d) !== 1);
      return Q(`구슬 ${d * k}개를 ${k}개씩 묶으면 ${n * k}개는 ${d * k}개의 몇 분의 몇일까요?`, F(n, d), `${k}개씩 묶으면 ${d}묶음, ${n * k}개는 그중 ${n}묶음 → <b>${fr(n, d)}</b>`, [F(n * k, d * k + 1), F(k, d), F(d - n, d)]); } },
  { id:'fo-len', name:'길이·시간의 분수만큼', std:'4수01-09', lv:[2,3], t:'both',
    g(){ if (ri(0, 1)){ const d = pick([2, 4, 5, 10]), n = ri(1, d - 1); return N(`1 m의 ${fr(n, d)}는 몇 cm일까요?`, 100 / d * n, `1 m = 100 cm → 100 ÷ ${d} × ${n} = <b>${100 / d * n} cm</b>`, [100 / d, n * 10, 100 - 100 / d * n], 'cm'); }
      const d = pick([2, 3, 4, 5, 6, 10, 12]), n = ri(1, d - 1); return N(`1시간의 ${fr(n, d)}은(는) 몇 분일까요?`, 60 / d * n, `1시간 = 60분 → 60 ÷ ${d} × ${n} = <b>${60 / d * n}분</b>`, [60 / d, n * 10, 100 / d * n], '분'); } },
  { id:'fo-word', name:'분수만큼 생활 문제', std:'4수01-09', lv:[3,4], t:'both',
    g(){ const d = ri(3, 8), n = ri(1, d - 1), k = ri(2, 6), tot = d * k;
      return N(`사탕 ${tot}개 중 ${fr(n, d)}를 동생에게 주었어요. 남은 사탕은 몇 개일까요?`, tot - n * k, `동생에게 준 사탕 ${tot}의 ${fr(n, d)} = ${n * k}개 → 남은 사탕 ${tot} - ${n * k} = <b>${tot - n * k}개</b>`, [n * k, tot - k, tot - n], '개'); } },
  { id:'fr-kind', name:'진분수, 가분수, 대분수 알기', std:'4수01-10', lv:[1,2], t:'mc',
    g(){ const d = ri(3, 9), k = pick(['진분수', '가분수', '대분수']), mk = t => t === '진분수' ? fr(ri(1, d - 1), d) : t === '가분수' ? fr(ri(d, 2 * d + 3), d) : fr(ri(1, d - 1), d, ri(1, 4));
      return MC(`<b>${k}</b>는 어느 것일까요?`, [mk(k), ...['진분수', '가분수', '대분수'].filter(x => x !== k).map(mk), String(ri(2, 9))], '분자가 분모보다 작으면 진분수, 분자가 분모와 같거나 크면 가분수, 자연수와 진분수로 이루어진 분수는 대분수예요.'); } },
  { id:'mix2imp', name:'대분수를 가분수로 나타내기', std:'4수01-10', lv:[2,3], t:'both',
    g(){ const d = ri(2, 9), n = ri(1, d - 1), w = ri(1, 5); if (gcd(n, d) !== 1) return this.g();
      return QI(`${fr(n, d, w)}을(를) 가분수로 나타내면?`, F(w * d + n, d), `${w} = ${fr(w * d, d)}이므로 ${fr(n, d, w)} = ${fr(w * d + n, d)}`, [F(w * n + d, d), F(w + n, d), F(w * d, d + n)]); } },
  { id:'imp2mix', name:'가분수를 대분수로 나타내기', std:'4수01-10', lv:[2,3], t:'both',
    g(){ const d = ri(2, 9); let a = ri(d + 1, 5 * d); if (a % d === 0) a++; if (gcd(a, d) !== 1) return this.g();
      return Q(`${fr(a, d)}을(를) 대분수로 나타내면?`, F(a, d), `${a} ÷ ${d} = ${Math.floor(a / d)} … ${a % d} → <b>${fr(a % d, d, Math.floor(a / d))}</b>`, [F(Math.floor(a / d) * d + (a % d + 1) % d || 1, d), F(a, d + 1), F(a % d, d).add(Math.floor(a / d) + 1)]); } },
  { id:'fr-cmp', name:'분모가 같은 분수의 크기 비교 (가분수, 대분수)', std:'4수01-11', lv:[2,3], t:'mc',
    g(){ const d = ri(3, 9), w = ri(1, 4), n = ri(1, d - 1), a = w * d + n + pick([-1, 0, 1]), c = CMP(w * d + n, a);
      return MC(`분수의 크기를 비교하여 ○ 안에 알맞은 것은? ${E(`${fr(n, d, w)} ○ ${fr(a, d)}`)}`, [c, ...CMPC.filter(z => z !== c)], `대분수를 가분수로 바꾸면 ${fr(n, d, w)} = ${fr(w * d + n, d)} → 분자 ${w * d + n}${P(w * d + n, '과', '와')} ${a} 비교 → <b>${c}</b>`); } },
  { id:'fr-big', name:'가장 큰 분수 찾기', std:'4수01-11', lv:[3,4], t:'mc',
    g(){ const d = ri(3, 8), vals = shuffle(range(d + 1, 4 * d)).filter(x => x % d).slice(0, 4), mx = Math.max(...vals), show = (v, i) => i % 2 ? fr(v % d, d, Math.floor(v / d)) : fr(v, d);
      return MC('크기가 가장 큰 분수는?', [show(mx, vals.indexOf(mx)), ...vals.filter(v => v !== mx).map(v => show(v, vals.indexOf(v)))], `모두 가분수로 바꾸어 분자를 비교해요: ${vals.map(v => fr(v, d)).join(', ')} → 가장 큰 분수는 ${fr(mx, d)}`); } },
  { id:'fr-count', name:'조건에 맞는 분수의 개수', std:'4수01-10', lv:[4,5], t:'both',
    g(){ const d = ri(3, 12), t = ri(0, 2);
      if (t === 0) return N(`분모가 ${d}인 진분수는 모두 몇 개일까요?`, d - 1, `분자가 1부터 ${d - 1}까지인 분수 → <b>${d - 1}개</b>`, [d, d - 2 || d + 1, d + 1], '개');
      if (t === 1){ const k = ri(1, Math.min(3, d - 2)); return N(`□/${d}${P(d, '이', '가')} 진분수일 때, □ 안에 들어갈 수 있는 자연수 중 ${k}보다 큰 수는 모두 몇 개일까요?`, d - 1 - k, `진분수이므로 □는 ${d}보다 작아요 → ${k + 1}부터 ${d - 1}까지 <b>${d - 1 - k}개</b>`, [d - k, d - 1, d - 2 - k > 0 ? d - 2 - k : d], '개'); }
      const w = ri(1, 3); return N(`분모가 ${d}이고 자연수 부분이 ${w}인 대분수는 모두 몇 개일까요?`, d - 1, `${w}${P(w, '과', '와')} 진분수 1/${d} ~ ${d - 1}/${d}${RO(d)} 이루어진 대분수 → <b>${d - 1}개</b>`, [d, w * d, d + 1], '개'); } }
]});

/* ─────────────── 6. 그림그래프 ─────────────── */
const ICON = [['🍎', '사과', '상자'], ['🌳', '나무', '그루'], ['📚', '책', '권'], ['🐄', '소', '마리']];
const PLACES = ['가', '나', '다', '라'];
const pgTable = (vals, ic, big, small) => tableH(vals.map((v, i) => [PLACES[i] + ' 마을', `<span style="font-size:19px;letter-spacing:1px">${ic.repeat(Math.floor(v / big))}<span style="font-size:12px">${ic.repeat(Math.floor(v % big / small))}</span></span>`]));
A.addUnit({ key:'3-2-6', title:'그림그래프', items:[
  { id:'pg-read', name:'그림그래프 읽기', std:'4수04-01', lv:[1,2], t:'both',
    g(){ const [ic, nm, u] = pick(ICON), v = PLACES.map(() => ri(12, 58)), i = ri(0, 3);
      return N(`마을별 ${nm} 수를 그림그래프로 나타냈어요. (큰 그림 10${u}, 작은 그림 1${u}) <b>${PLACES[i]} 마을</b>은 몇 ${u}일까요?${pgTable(v, ic, 10, 1)}`, v[i], `큰 그림 ${Math.floor(v[i] / 10)}개 = ${Math.floor(v[i] / 10) * 10}, 작은 그림 ${v[i] % 10}개 = ${v[i] % 10} → <b>${v[i]}${u}</b>`, [Math.floor(v[i] / 10) + v[i] % 10, v[i] + 10, v[i] - 1], u); } },
  { id:'pg-read100', name:'그림그래프 읽기 (큰 그림 100)', std:'4수04-01', lv:[2,3], t:'both',
    g(){ const [ic, nm, u] = pick(ICON), v = PLACES.map(() => ri(12, 48) * 10), i = ri(0, 3);
      return N(`마을별 ${nm} 수를 그림그래프로 나타냈어요. (큰 그림 100${u}, 작은 그림 10${u}) <b>${PLACES[i]} 마을</b>은 몇 ${u}일까요?${pgTable(v, ic, 100, 10)}`, v[i], `큰 그림 ${Math.floor(v[i] / 100)}개 = ${Math.floor(v[i] / 100) * 100}, 작은 그림 ${v[i] % 100 / 10}개 = ${v[i] % 100} → <b>${v[i]}${u}</b>`, [Math.floor(v[i] / 100) + v[i] % 100 / 10, v[i] + 100, v[i] / 10], u); } },
  { id:'pg-most', name:'가장 많은(적은) 곳 찾기', std:'4수04-01', lv:[1,2], t:'mc',
    g(){ const [ic, nm, u] = pick(ICON); let v; do { v = PLACES.map(() => ri(12, 58)); } while (new Set(v).size < 4); const most = ri(0, 1), t = most ? v.indexOf(Math.max(...v)) : v.indexOf(Math.min(...v));
      return MC(`(큰 그림 10${u}, 작은 그림 1${u}) ${nm}${P(nm, '이', '가')} 가장 ${most ? '많은' : '적은'} 마을은?${pgTable(v, ic, 10, 1)}`, [`${PLACES[t]} 마을`, ...PLACES.filter((_, k) => k !== t).map(p => `${p} 마을`)], `큰 그림의 수를 먼저 비교하고, 같으면 작은 그림의 수를 비교해요 → <b>${PLACES[t]} 마을</b> (${v[t]}${u})`); } },
  { id:'pg-diff', name:'두 곳의 차 구하기', std:'4수04-01', lv:[2,3], t:'both',
    g(){ const [ic, nm, u] = pick(ICON); let v; do { v = PLACES.map(() => ri(12, 58)); } while (new Set(v).size < 4); const [a, b] = shuffle([0, 1, 2, 3]).slice(0, 2);
      return N(`(큰 그림 10${u}, 작은 그림 1${u}) <b>${PLACES[a]} 마을</b>과 <b>${PLACES[b]} 마을</b>의 ${nm} 수의 차는 몇 ${u}일까요?${pgTable(v, ic, 10, 1)}`, Math.abs(v[a] - v[b]), `${PLACES[a]} 마을 ${v[a]}${u}, ${PLACES[b]} 마을 ${v[b]}${u} → 차 <b>${Math.abs(v[a] - v[b])}${u}</b>`, [v[a] + v[b], Math.abs(v[a] - v[b]) + 10, Math.abs(v[a] - v[b]) + 1], u); } },
  { id:'pg-total', name:'전체 합 구하기', std:'4수04-01', lv:[2,3], t:'both',
    g(){ const [ic, nm, u] = pick(ICON), v = PLACES.map(() => ri(11, 39)), s = v.reduce((a, b) => a + b, 0);
      return N(`(큰 그림 10${u}, 작은 그림 1${u}) 네 마을의 ${nm} 수는 모두 몇 ${u}일까요?${pgTable(v, ic, 10, 1)}`, s, `${v.join(' + ')} = <b>${s}${u}</b>`, [s + 10, s - 1, s - 10], u); } },
  { id:'pg-icons', name:'수를 그림으로 나타내기', std:'4수04-01', lv:[3,3], t:'both',
    g(){ const v = ri(21, 98), big = ri(0, 1);
      return big ? N(`큰 그림이 10개, 작은 그림이 1개를 나타내는 그림그래프에서 ${v}개를 나타내려면 <b>큰 그림</b>을 몇 개 그려야 할까요?`, Math.floor(v / 10), `${v} = 10 × ${Math.floor(v / 10)} + ${v % 10} → 큰 그림 <b>${Math.floor(v / 10)}개</b>, 작은 그림 ${v % 10}개`, [v % 10 || 1, Math.floor(v / 10) + 1, v], '개')
        : N(`큰 그림이 10개, 작은 그림이 1개를 나타내는 그림그래프에서 ${v}개를 나타내려면 그림은 모두 몇 개 그려야 할까요?`, Math.floor(v / 10) + v % 10, `큰 그림 ${Math.floor(v / 10)}개 + 작은 그림 ${v % 10}개 = <b>${Math.floor(v / 10) + v % 10}개</b>`, [v, Math.floor(v / 10), v % 10 + 10], '개'); } },
  { id:'pg-missing', name:'모르는 값 구하기', std:'4수04-01', lv:[4,5], t:'both',
    g(){ const [ic, nm, u] = pick(ICON), v = PLACES.map(() => ri(11, 39)), s = v.reduce((a, b) => a + b, 0), i = ri(0, 3), shown = v.map((x, k) => k === i ? 0 : x);
      const tbl = tableH(shown.map((x, k) => [PLACES[k] + ' 마을', k === i ? '<b>?</b>' : `<span style="font-size:19px">${ic.repeat(Math.floor(x / 10))}<span style="font-size:12px">${ic.repeat(x % 10)}</span></span>`]));
      return N(`(큰 그림 10${u}, 작은 그림 1${u}) 네 마을의 ${nm} 수는 모두 ${s}${u}예요. <b>${PLACES[i]} 마을</b>은 몇 ${u}일까요?${tbl}`, v[i], `${s} - (${v.filter((_, k) => k !== i).join(' + ')}) = <b>${v[i]}${u}</b>`, [v[i] + 10, s - v[i], v[i] + 1], u); } },
  { id:'pg-plan', name:'그림그래프를 보고 판단하기', std:'4수04-01', lv:[4,4], t:'mc',
    g(){ let v; do { v = PLACES.map(() => ri(12, 58)); } while (new Set(v).size < 4); const mx = v.indexOf(Math.max(...v)), mn = v.indexOf(Math.min(...v));
      return MC(`마을별 우유 판매량 그림그래프예요. (큰 그림 10병, 작은 그림 1병) 알맞은 생각은?${pgTable(v, '🥛', 10, 1)}`, [`${PLACES[mx]} 마을에 우유를 가장 많이 준비해요.`, `${PLACES[mn]} 마을에 우유를 가장 많이 준비해요.`, '네 마을 모두 판매량이 같아요.', `${PLACES[mx]} 마을의 판매량이 가장 적어요.`], `${PLACES[mx]} 마을의 판매량이 ${v[mx]}병으로 가장 많아요.`); } }
]});
})();
