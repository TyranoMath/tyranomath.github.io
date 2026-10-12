/* =========================================================
   1학년 2학기 문제 만들기 — 수학익힘 1-2 문제 유형을 바탕으로 (2022 개정 교육과정)
   단원: 1 100까지의 수 · 2 덧셈과 뺄셈(1) · 3 모양과 시각 · 4 덧셈과 뺄셈(2) · 5 규칙 찾기 · 6 덧셈과 뺄셈(3)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS, H = window.TM_G12;
const { ri, pick, shuffle, range, svg, txt, line } = A;
const { E, MC, N, P, CMP, CMPC, NAMES, sino, native, emo, tens, tenFrame, clock, shp, SHN, COLS } = H;
const IC = ['🍎', '🍓', '🐥', '🌷', '⭐', '🐟', '🍪', '🎈', '🐞', '🍋'];
const wa = (a, w = '와') => a + (w === '와' ? P(a, '과', '와') : P(a, '을', '를'));

/* ─────────────── 1. 100까지의 수 ─────────────── */
A.addUnit({ key:'1-2-1', title:'100까지의 수', items:[
  { id:'h-tens', name:'몇십 알아보기', std:'2수01-01', lv:[1,1], t:'both',
    g(){ const t = ri(5, 9); return N(`10개씩 묶음 ${t}개는 얼마일까요?${tens(pick(IC), t * 10, 13)}`, t * 10, `10개씩 묶음 ${t}개 = <b>${t * 10}</b> (${sino(t * 10)}, ${native(t * 10)})`, [t, t * 10 + 10, t * 10 - 10]); } },
  { id:'h-make', name:'99까지의 수 만들기', std:'2수01-01', lv:[1,2], t:'both',
    g(){ const t = ri(5, 9), o = ri(1, 9); return N(`10개씩 묶음 ${t}개와 낱개 ${o}개는 얼마일까요?`, t * 10 + o, `${t * 10} + ${o} = <b>${t * 10 + o}</b>`, [o * 10 + t, t + o, t * 10 + o + 10]); } },
  { id:'h-read', name:'수 읽기', std:'2수01-01', lv:[1,2], t:'mc',
    g(L){ const n = L > 1 ? ri(51, 99) : ri(5, 9) * 10, ok = `${sino(n)}, ${native(n)}`; const bad = shuffle(range(50, 99).filter(x => x !== n)).slice(0, 3).map(x => pick([`${sino(x)}, ${native(x)}`, `${sino(n)}, ${native(x)}`]));
      return MC(`<b style="font-size:24px">${n}</b>${P(n, '을', '를')} 바르게 읽은 것은?`, [ok, ...bad], `${n} → <b>${sino(n)}</b> 또는 <b>${native(n)}</b>`); } },
  { id:'h-seq', name:'수의 순서', std:'2수01-03', lv:[1,2], t:'both',
    g(L){ const s = L > 1 ? ri(93, 96) : ri(50, 90), seq = range(0, 4).map(i => s + i), h = ri(1, 4);
      return N(`수의 순서대로 □ 안에 알맞은 수를 써 보세요. ${E(seq.map((x, i) => i === h ? '□' : x).join(' — '))}`, seq[h], `1씩 커져요 → <b>${seq[h]}</b>${seq[h] === 100 ? ' (99보다 1만큼 더 큰 수는 100, 백!)' : ''}`, [seq[h] + 1, seq[h] - 1, seq[h] + 10]); } },
  { id:'h-pm', name:'1만큼 더 큰 수와 작은 수', std:'2수01-03', lv:[2,2], t:'both',
    g(){ const n = ri(51, 99), up = ri(0, 1); return N(`${n}보다 1만큼 더 ${up ? '큰' : '작은'} 수는?`, up ? n + 1 : n - 1, `수의 순서에서 ${n} 바로 ${up ? '뒤' : '앞'} → <b>${up ? n + 1 : n - 1}</b>`, [up ? n - 1 : n + 1, n + 10, n]); } },
  { id:'h-cmp', name:'수의 크기 비교', std:'2수01-03', lv:[2,3], t:'mc',
    g(L){ if (L > 2){ const s = shuffle(range(50, 99)).slice(0, 4), mx = ri(0, 1), t = mx ? Math.max(...s) : Math.min(...s); return MC(`<b>가장 ${mx ? '큰' : '작은'}</b> 수는? ${E(s.join(', '))}`, [String(t), ...s.filter(x => x !== t).map(String)], `10개씩 묶음의 수부터 비교해요 → <b>${t}</b>`); }
      const a = ri(50, 99); let b; do b = ri(50, 99); while (b === a); const c = CMP(a, b);
      return MC(`○ 안에 &gt;, &lt;를 알맞게 써넣으세요. ${E(`${a} ○ ${b}`)}`, [c, c === '&gt;' ? '&lt;' : '&gt;'], `10개씩 묶음의 수를 먼저, 같으면 낱개의 수를 비교해요 → <b>${a} ${c} ${b}</b>`); } },
  { id:'h-between', name:'두 수 사이의 수', std:'2수01-03', lv:[3,3], t:'both',
    g(){ const a = ri(50, 90), b = a + ri(3, 9); if (b > 100) return this.g(); return N(`${wa(a)} ${b} 사이에 있는 수는 모두 몇 개일까요?`, b - a - 1, `${a + 1}부터 ${b - 1}까지 → <b>${b - a - 1}개</b>`, [b - a, b - a + 1, b - a - 2], '개'); } },
  { id:'h-even', name:'짝수와 홀수', std:'2수01-01', lv:[2,3], t:'mc',
    g(){ const ev = ri(0, 1), s = shuffle(range(1, 30)).slice(0, 4), ok = pick(range(2, 30).filter(x => x % 2 === (ev ? 0 : 1))), others = shuffle(range(1, 30).filter(x => x % 2 === (ev ? 1 : 0))).slice(0, 3); void s;
      return MC(`<b>${ev ? '짝수' : '홀수'}</b>는 어느 것일까요?`, [String(ok), ...others.map(String)], `둘씩 짝을 지을 때 남는 것이 없으면 짝수(2, 4, 6, 8, 10, …), 하나가 남으면 홀수(1, 3, 5, 7, 9, …) → <b>${ok}</b>`); } },
  { id:'h-evcount', name:'짝수·홀수의 개수', std:'2수01-01', lv:[3,4], t:'both',
    g(){ const a = ri(1, 20), b = a + ri(5, 12), ev = ri(0, 1), v = range(a, b).filter(x => x % 2 === (ev ? 0 : 1)).length;
      return N(`${a}부터 ${b}까지의 수 중에서 <b>${ev ? '짝수' : '홀수'}</b>는 모두 몇 개일까요?`, v, `${range(a, b).filter(x => x % 2 === (ev ? 0 : 1)).join(', ')} → <b>${v}개</b>`, [b - a + 1 - v, v + 1, v - 1], '개'); } },
  { id:'h-cards', name:'수 카드로 수 만들기', std:'2수01-03', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 3), mx = ri(0, 1), s = c.slice().sort((a, b) => b - a), v = mx ? s[0] * 10 + s[1] : s[2] * 10 + s[1];
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')} 중에서 두 장을 골라 한 번씩만 사용하여 몇십몇을 만들려고 해요. 가장 ${mx ? '큰' : '작은'} 수는?`, v, `10개씩 묶음의 수(십의 자리)에 가장 ${mx ? '큰' : '작은'} 수, 낱개의 수에 그다음으로 ${mx ? '큰' : '작은'} 수 → <b>${v}</b>`, [mx ? s[1] * 10 + s[0] : s[1] * 10 + s[2], mx ? s[0] * 10 + s[2] : s[2] * 10 + s[0], v + 10]); } },
  { id:'h-cond', name:'조건에 맞는 수 찾기', std:'2수01-03', lv:[4,5], t:'both',
    g(){ const t = ri(5, 9), lo = ri(0, 4), ev = ri(0, 1), list = range(t * 10 + lo + 1, t * 10 + 9).filter(x => x % 2 === (ev ? 0 : 1)); if (!list.length) return this.g();
      return N(`조건에 맞는 수는 모두 몇 개일까요? ${E(`10개씩 묶음이 ${t}개예요. · ${t * 10 + lo}보다 커요. · ${ev ? '짝수' : '홀수'}예요.`)}`, list.length, `${t * 10 + lo + 1}부터 ${t * 10 + 9}까지의 ${ev ? '짝수' : '홀수'}: ${list.join(', ')} → <b>${list.length}개</b>`, [list.length + 1, 9 - lo, list.length - 1], '개'); } }
]});

/* ─────────────── 2. 덧셈과 뺄셈(1) ─────────────── */
A.addUnit({ key:'1-2-2', title:'덧셈과 뺄셈(1)', items:[
  { id:'t3-add', name:'세 수의 덧셈', std:'2수01-08', lv:[1,2], t:'both',
    g(){ const a = ri(1, 6), b = ri(1, 6), c = ri(1, 6); if (a + b + c > 18) return this.g(); return N(`${a} + ${b} + ${c}의 값은?`, a + b + c, `앞의 두 수부터 차례로: ${a} + ${b} = ${a + b}, ${a + b} + ${c} = <b>${a + b + c}</b>`, [a + b, a + b + c + 1, a + b + c - 1]); } },
  { id:'t3-sub', name:'세 수의 뺄셈', std:'2수01-08', lv:[1,2], t:'both',
    g(){ const a = ri(6, 9), b = ri(1, a - 2), c = ri(1, a - b - 1); return N(`${a} - ${b} - ${c}의 값은?`, a - b - c, `앞에서부터 차례로: ${a} - ${b} = ${a - b}, ${a - b} - ${c} = <b>${a - b - c}</b>`, [a - b, a - b - c + 1, a - c]); } },
  { id:'ten-add', name:'10이 되는 더하기', std:'2수01-04', lv:[1,1], t:'both',
    g(){ const a = ri(1, 9), t = ri(0, 1); return N(`□ 안에 알맞은 수는? ${E(t ? `${a} + □ = 10` : `□ + ${a} = 10`)}${tenFrame(a)}`, 10 - a, `${wa(a)} ${10 - a}${P(10 - a, '을', '를')} 모으면 10 → <b>${10 - a}</b>`, [10 - a + 1, 10 - a - 1, a]); } },
  { id:'ten-sub', name:'10에서 빼기', std:'2수01-04', lv:[1,1], t:'both',
    g(){ const a = ri(1, 9); return N(`10 - ${a}의 값은?`, 10 - a, `10에서 ${a}만큼 지우면 <b>${10 - a}</b>`, [10 - a + 1, 10 - a - 1, a]); } },
  { id:'ten-pair', name:'더해서 10이 되는 두 수', std:'2수01-04', lv:[2,2], t:'mc',
    g(){ const a = ri(1, 9), f = (x, y) => `${x}와(과) ${y}`.replace('와(과)', P(x, '과', '와'));
      return MC('더해서 <b>10</b>이 되는 두 수는?', [f(a, 10 - a), f(a, 9 - a < 1 ? 11 - a : 9 - a), f(a, 11 - a), f(a + 1 > 9 ? a - 1 : a + 1, 10 - a)], `${a} + ${10 - a} = 10 → <b>${f(a, 10 - a)}</b>`); } },
  { id:'ten-make', name:'10을 만들어 더하기', std:'2수01-08', lv:[2,3], t:'both',
    g(){ const a = ri(1, 9), c = ri(1, 9), order = ri(0, 2), e = [[a, 10 - a, c], [c, a, 10 - a], [a, c, 10 - a]][order];
      return N(`${e.join(' + ')}의 값은?`, 10 + c, `더해서 10이 되는 두 수(${wa(a)} ${10 - a})를 먼저 더하면 10 → 10 + ${c} = <b>${10 + c}</b>`, [10 + c + 1, 10 + c - 1, c + 10 - a]); } },
  { id:'t3-mix', name:'덧셈과 뺄셈이 섞인 세 수의 계산', std:'2수01-08', lv:[3,3], t:'both',
    g(){ const a = ri(2, 8), b = ri(1, 9 - a), c = ri(1, a + b - 1); return N(`${a} + ${b} - ${c}의 값은?`, a + b - c, `앞에서부터: ${a} + ${b} = ${a + b}, ${a + b} - ${c} = <b>${a + b - c}</b>`, [a + b + c, a - b + c > 0 ? a - b + c : a + b - c + 1, a + b - c - 1]); } },
  { id:'t3-word', name:'세 수의 덧셈·뺄셈 문제', std:'2수01-08', lv:[3,4], t:'both',
    g(){ const t = ri(0, 1);
      if (t){ const a = ri(1, 6), b = ri(1, 6), c = ri(1, 6), nm = pick(NAMES); if (a + b + c > 18) return this.g(); return N(`${nm}는 칭찬 붙임딱지를 월요일에 ${a}장, 화요일에 ${b}장, 수요일에 ${c}장 받았어요. 모두 몇 장을 받았나요?`, a + b + c, `${a} + ${b} + ${c} = <b>${a + b + c}장</b>`, [a + b, a + b + c + 1, a + b + c - 1], '장'); }
      const a = ri(6, 9), b = ri(1, a - 2), c = ri(1, a - b - 1); return N(`버스에 ${a}명이 타고 있었어요. 첫째 정류장에서 ${b}명, 둘째 정류장에서 ${c}명이 내렸어요. 버스에 남은 사람은 몇 명일까요?`, a - b - c, `${a} - ${b} - ${c} = <b>${a - b - c}명</b>`, [a - b, a - b - c + 1, a - c], '명'); } },
  { id:'ten-box', name:'□가 있는 세 수의 덧셈', std:'2수01-08', lv:[4,5], t:'both',
    g(){ const a = ri(1, 9), c = ri(1, 9); return N(`□ 안에 알맞은 수는? ${E(`${a} + □ + ${c} = ${10 + c}`)}`, 10 - a, `${a}와(과) □를 더해 10이 되면 10 + ${c} = ${10 + c} → □ = <b>${10 - a}</b>`.replace('와(과)', P(a, '과', '와')), [10 - a + 1, c, 10 - a - 1]); } }
]});

/* ─────────────── 3. 모양과 시각 ─────────────── */
const randShapes = () => { const cnt = { r: ri(1, 4), t: ri(1, 4), c: ri(1, 4) }, list = shuffle(['r', 't', 'c'].flatMap(k => range(1, cnt[k]).map(() => k))); return [cnt, list]; };
const shapesFig = list => { let g = ''; list.forEach((k, i) => { g += shp(k, 30 + (i % 6) * 52, 30 + Math.floor(i / 6) * 54, ri(30, 40), pick(COLS), ri(-25, 25)); }); return svg(6 * 52 + 10, Math.ceil(list.length / 6) * 54 + 10, g); };
const hm = (h, m) => m ? `${h}시 ${m}분` : `${h}시`;
A.addUnit({ key:'1-2-3', title:'모양과 시각', items:[
  { id:'f-kind', name:'□, △, ○ 모양 알기', std:'2수03-03', lv:[1,1], t:'mc',
    g(){ const k = pick(['r', 't', 'c']); return MC(`그림의 모양은 어떤 모양일까요?${svg(120, 100, shp(k, 60, 52, 70, pick(COLS), ri(-20, 20)))}`, [SHN[k], ...['r', 't', 'c'].filter(x => x !== k).map(x => SHN[x])], `${k === 'r' ? '뾰족한 곳이 4군데 있어요' : k === 't' ? '뾰족한 곳이 3군데 있어요' : '뾰족한 곳이 없고 둥글어요'} → <b>${SHN[k]}</b>`); } },
  { id:'f-obj', name:'물건에서 모양 찾기', std:'2수03-03', lv:[1,2], t:'mc',
    g(){ const O = { r: [['🖼️', '액자'], ['📱', '휴대전화'], ['🪟', '창문'], ['📒', '공책 앞면']], t: [['🔺', '삼각자'], ['⚠️', '표지판'], ['🍙', '삼각김밥'], ['⛺', '텐트 옆면']], c: [['🪙', '동전'], ['🍪', '쿠키'], ['🕛', '시계'], ['🛞', '바퀴']] }, k = pick(['r', 't', 'c']), o = pick(O[k]);
      return MC(`<span style="font-size:40px">${o[0]}</span> ${o[1]}에서 찾을 수 있는 모양은?`, [SHN[k], ...['r', 't', 'c'].filter(x => x !== k).map(x => SHN[x])], `${o[1]} → <b>${SHN[k]}</b>`); } },
  { id:'f-count', name:'같은 모양 세기', std:'2수03-03', lv:[2,2], t:'both',
    g(){ const [cnt, list] = randShapes(), k = pick(['r', 't', 'c']); return N(`<b>${SHN[k]}</b>은 몇 개일까요?${shapesFig(list)}`, cnt[k], `${SHN[k]}만 세면 <b>${cnt[k]}개</b>`, [cnt[k] + 1, list.length - cnt[k], cnt[k] - 1], '개'); } },
  { id:'f-prop', name:'모양의 특징', std:'2수03-03', lv:[2,3], t:'mc',
    g(){ const Q0 = pick([['뾰족한 곳이 3군데 있어요.', 't'], ['뾰족한 곳이 4군데 있어요.', 'r'], ['뾰족한 곳이 없고 둥근 부분만 있어요.', 'c'], ['곧은 선이 4개 있어요.', 'r'], ['곧은 선이 3개 있어요.', 't'], ['곧은 선이 없어요.', 'c']]);
      return MC(`설명에 알맞은 모양은? ${E(Q0[0])}`, [SHN[Q0[1]], ...['r', 't', 'c'].filter(x => x !== Q0[1]).map(x => SHN[x])], `□: 뾰족한 곳 4군데 · △: 3군데 · ○: 없음 → <b>${SHN[Q0[1]]}</b>`); } },
  { id:'f-corner', name:'뾰족한 곳의 수', std:'2수03-03', lv:[3,4], t:'both',
    g(){ const r = ri(1, 4), t = ri(1, 4), c = ri(0, 3); return N(`□ 모양 ${r}개, △ 모양 ${t}개, ○ 모양 ${c}개의 뾰족한 곳은 모두 몇 군데일까요?`, 4 * r + 3 * t, `□는 4군데, △는 3군데, ○는 0군데 → ${4 * r} + ${3 * t} = <b>${4 * r + 3 * t}군데</b>`, [4 * r + 3 * t + c, 3 * r + 4 * t, r + t], '군데'); } },
  { id:'tm-oclock', name:'몇 시 읽기', std:'2수03-07', lv:[1,1], t:'mc',
    g(){ const h = ri(1, 12); return MC(`시계가 나타내는 시각은?${clock(h, 0)}`, [hm(h, 0), hm(h % 12 + 1, 0), hm(h, 30), hm(12 - h || 12, 0)], `긴바늘이 12, 짧은바늘이 ${h}${P(h, '을', '를')} 가리키면 <b>${h}시</b>`); } },
  { id:'tm-half', name:'몇 시 30분 읽기', std:'2수03-07', lv:[1,2], t:'mc',
    g(){ const h = ri(1, 12); return MC(`시계가 나타내는 시각은?${clock(h, 30)}`, [hm(h, 30), hm(h % 12 + 1, 30), hm(h, 0), hm(h % 12 + 1, 0)], `긴바늘이 6을 가리키고 짧은바늘이 ${h}와(과) ${h % 12 + 1} 사이 → <b>${h}시 30분</b>`.replace('와(과)', P(h, '과', '와'))); } },
  { id:'tm-hand', name:'시곗바늘의 위치', std:'2수03-07', lv:[2,3], t:'mc',
    g(L){ const h = ri(1, 12), half = L > 2 ? 1 : ri(0, 1);
      if (!half) return MC(`${h}시를 나타낼 때 <b>짧은바늘</b>은 어느 숫자를 가리킬까요?`, [String(h), '12', String(h % 12 + 1), '6'].filter((x, i, a) => a.indexOf(x) === i), `몇 시일 때 긴바늘은 12, 짧은바늘은 <b>${h}</b>${P(h, '을', '를')} 가리켜요.`);
      const nx = h % 12 + 1; return MC(`${h}시 30분일 때 <b>짧은바늘</b>은 어디를 가리킬까요?`, [`${h}와(과) ${nx} 사이`.replace('와(과)', P(h, '과', '와')), `${h}`, `6`, `${nx}와(과) ${nx % 12 + 1} 사이`.replace('와(과)', P(nx, '과', '와'))], `몇 시 30분이면 짧은바늘은 두 숫자의 <b>가운데</b>를 가리켜요 → <b>${h}와(과) ${nx} 사이</b>`.replace('와(과)', P(h, '과', '와'))); } },
  { id:'tm-first', name:'먼저 한 일 찾기', std:'2수03-07', lv:[3,4], t:'mc',
    g(){ const acts = shuffle(['책 읽기', '줄넘기', '숙제', '피아노 연습', '그림 그리기']).slice(0, 3), ts = shuffle(range(2, 18)).slice(0, 3).sort((a, b) => a - b), tt = ts.map(x => [Math.floor(x / 2) + 1, x % 2 ? 30 : 0]), order = shuffle([0, 1, 2]);
      const want = ri(0, 1), idx = want ? 0 : 2;
      return MC(`${order.map(i => `${acts[i]}: ${hm(...tt[i])}`).join(' · ')}<br>오후에 한 일 중 <b>가장 ${want ? '먼저' : '나중에'}</b> 한 일은?`, [acts[idx], ...acts.filter((_, i) => i !== idx)], `시각이 ${want ? '빠를' : '늦을'}수록 ${want ? '먼저' : '나중에'} 한 일 → <b>${acts[idx]}</b> (${hm(...tt[idx])})`); } },
  { id:'tm-after', name:'긴바늘이 돈 다음의 시각', std:'2수03-07', lv:[4,5], t:'mc',
    g(){ const h = ri(1, 11), half = ri(0, 1), turns = half ? 1 : ri(1, 3);
      if (half) return MC(`지금 시각은 ${h}시예요. 긴바늘이 <b>반 바퀴</b> 돌면 몇 시 몇 분이 될까요?`, [hm(h, 30), hm(h + 1, 0), hm(h + 1, 30), hm(h, 0)], `긴바늘이 12에서 반 바퀴 돌면 6을 가리켜요 → <b>${h}시 30분</b>`);
      const r = (h + turns - 1) % 12 + 1; return MC(`지금 시각은 ${h}시예요. 긴바늘이 <b>${turns}바퀴</b> 돌면 몇 시가 될까요?`, [hm(r, 0), hm((r % 12) + 1, 0), hm(h, 30), hm(h, 0)], `긴바늘이 한 바퀴 돌면 짧은바늘은 숫자 한 칸을 가요 → <b>${r}시</b>`); } }
]});

/* ─────────────── 4. 덧셈과 뺄셈(2) ─────────────── */
A.addUnit({ key:'1-2-4', title:'덧셈과 뺄셈(2)', items:[
  { id:'c-add', name:'(몇) + (몇) = (십몇)', std:'2수01-06', lv:[1,2], t:'both',
    g(){ const a = ri(2, 9), b = ri(11 - a, 9); return N(`${a} + ${b}의 값은?`, a + b, `${a}에 ${10 - a}를 더해 10을 만들고, 남은 ${b - (10 - a)}를 더해요 → 10 + ${b - (10 - a)} = <b>${a + b}</b>`, [a + b - 10, a + b + 1, a + b - 1]); } },
  { id:'c-sub', name:'(십몇) - (몇)', std:'2수01-06', lv:[1,2], t:'both',
    g(){ const a = ri(11, 18), b = ri(a - 9, 9); if (b <= a % 10) return this.g(); return N(`${a} - ${b}의 값은?`, a - b, `${a}에서 ${a - 10}${P(a - 10, '을', '를')} 먼저 빼면 10, 10에서 남은 ${b - (a - 10)}를 빼요 → <b>${a - b}</b>`, [a - b + 1, a - b - 1, b - a % 10]); } },
  { id:'c-make10', name:'10을 만들어 더하기', std:'2수01-06', lv:[2,2], t:'both',
    g(){ const a = ri(6, 9), b = ri(11 - a, 9); return N(`□ 안에 알맞은 수는? ${E(`${a} + ${b} = ${a} + ${10 - a} + □`)}`, b - (10 - a), `${b}${P(b, '을', '를')} ${10 - a}와(과) ${b - (10 - a)}로 갈라요 → <b>${b - (10 - a)}</b>`.replace('와(과)', P(10 - a, '과', '와')), [10 - a, b, a + b - 10 + 1]); } },
  { id:'c-split10', name:'10을 이용하여 빼기', std:'2수01-06', lv:[2,3], t:'both',
    g(){ const a = ri(11, 17), b = ri(a - 9, 9); if (b <= a % 10) return this.g(); const r = a - 10;
      return N(`□ 안에 알맞은 수는? ${E(`${a} - ${b} = ${a} - ${r} - □`)}`, b - r, `${b}${P(b, '을', '를')} ${r}와(과) ${b - r}로 가르면 ${a} - ${r} = 10, 10 - ${b - r} = ${a - b}`.replace('와(과)', P(r, '과', '와')) + ` → <b>${b - r}</b>`, [r, b, a - b]); } },
  { id:'c-pat', name:'여러 가지 덧셈·뺄셈의 규칙', std:'2수01-06', lv:[3,3], t:'mc',
    g(){ const s = ri(11, 17), a = ri(s - 9, 9), b = s - a, plus = ri(0, 1);
      if (plus){ const ok = `${a + 1 > 9 ? a - 1 : a + 1} + ${a + 1 > 9 ? b + 1 : b - 1}`; return MC(`${a} + ${b}와(과) 합이 <b>같은</b> 식은?`.replace('와(과)', P(b, '과', '와')), [ok, `${a + 1 > 9 ? a - 1 : a + 1} + ${b}`, `${a} + ${b + 1}`, `${a + 1 > 9 ? a - 1 : a + 1} + ${a + 1 > 9 ? b - 1 : b + 1}`], `한 수가 1 커지고 다른 수가 1 작아지면 합은 같아요 → <b>${ok}</b> = ${s}`); }
      const d = ri(4, 8), ok = `${s + 1} - ${d + 1}`; return MC(`${s} - ${d}와(과) 차가 <b>같은</b> 식은?`.replace('와(과)', P(d, '과', '와')), [ok, `${s + 1} - ${d}`, `${s} - ${d + 1}`, `${s + 1} - ${d - 1}`], `빼지는 수와 빼는 수가 똑같이 1씩 커지면 차는 같아요 → <b>${ok}</b> = ${s - d}`); } },
  { id:'c-word', name:'덧셈·뺄셈 생활 문제', std:'2수01-05', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2), a = ri(5, 9), b = ri(11 - a, 9);
      if (t === 0) return N(`빈 병을 ${pick(NAMES)}는 ${a}개, 동생은 ${b}개 모았어요. 두 사람이 모은 빈 병은 모두 몇 개일까요?`, a + b, `${a} + ${b} = <b>${a + b}개</b>`, [a + b - 10, a + b + 1, Math.abs(a - b)], '개');
      if (t === 1) return N(`팽이가 ${a + b}개 있어요. 친구들에게 ${b}개를 나누어 주면 남는 팽이는 몇 개일까요?`, a, `${a + b} - ${b} = <b>${a}개</b>`, [a + 1, b, a - 1], '개');
      const n1 = pick(NAMES); return N(`색종이를 ${n1}는 ${a + b}장, 친구는 ${a}장 가지고 있어요. ${n1}는 친구보다 몇 장 더 많이 가지고 있나요?`, b, `${a + b} - ${a} = <b>${b}장</b>`, [b + 1, a, b - 1], '장'); } },
  { id:'c-cmp', name:'계산 결과 비교', std:'2수01-06', lv:[3,3], t:'mc',
    g(){ const a = ri(3, 9), b = ri(11 - a, 9), c = ri(11, 18), d = ri(c - 9, 9), L = a + b, R = c - d, cc = CMP(L, R);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${a} + ${b} ○ ${c} - ${d}`)}`, [cc, ...CMPC.filter(z => z !== cc)], `${a} + ${b} = ${L}, ${c} - ${d} = ${R} → <b>${cc}</b>`); } },
  { id:'c-box', name:'□ 안에 알맞은 수', std:'2수01-07', lv:[3,4], t:'both',
    g(){ const a = ri(2, 9), b = ri(11 - a, 9), t = ri(0, 2), e = [[`□ + ${b} = ${a + b}`, a], [`${a} + □ = ${a + b}`, b], [`${a + b} - □ = ${a}`, b]][t];
      return N(`□ 안에 알맞은 수는? ${E(e[0])}`, e[1], `덧셈과 뺄셈의 관계를 이용해요 → <b>${e[1]}</b>`, [a + b, e[1] + 1, e[1] - 1]); } },
  { id:'c-cards', name:'수 카드로 덧셈·뺄셈', std:'2수01-06', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(2, 9)).slice(0, 4), s = c.slice().sort((a, b) => b - a), v = s[0] + s[1];
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')} 중에서 두 장을 골라 합이 가장 크게 되도록 덧셈식을 만들었어요. 그 합에서 남은 두 장의 수를 차례로 빼면 얼마일까요?`, v - s[2] - s[3], `가장 큰 합: ${s[0]} + ${s[1]} = ${v} → ${v} - ${s[2]} - ${s[3]} = <b>${v - s[2] - s[3]}</b>`, [v, v - s[2], v - s[3]]); } }
]});

/* ─────────────── 5. 규칙 찾기 ─────────────── */
const PATS = [['AB', 2], ['ABB', 3], ['AAB', 3], ['ABC', 3], ['ABBC', 4]];
const ICS = [['🍎', '🍌', '🍇'], ['🔴', '🔵', '🟡'], ['⭐', '🌙', '☀️'], ['🐶', '🐱', '🐰'], ['🟥', '🟦', '🟩']];
const patSeq = (pat, ics, n) => range(0, n - 1).map(i => ics['ABC'.indexOf(pat[i % pat.length])]);
A.addUnit({ key:'1-2-5', title:'규칙 찾기', items:[
  { id:'pt-next', name:'다음에 올 것 찾기', std:'2수02-01', lv:[1,2], t:'mc',
    g(L){ const [pat] = pick(L > 1 ? PATS.slice(1) : PATS.slice(0, 2)), ics = pick(ICS), n = pat.length * 2 + ri(0, pat.length - 1), seq = patSeq(pat, ics, n + 1), ans = seq[n];
      return MC(`규칙에 따라 <b>다음</b>에 올 것은?<div style="font-size:32px;text-align:center;letter-spacing:4px">${seq.slice(0, n).join('')}❓</div>`, [ans, ...ics.filter(x => x !== ans)], `반복되는 부분: ${pat.split('').map(c => ics['ABC'.indexOf(c)]).join('')} → <b>${ans}</b>`); } },
  { id:'pt-blank', name:'빈칸에 알맞은 것', std:'2수02-01', lv:[2,2], t:'mc',
    g(){ const [pat] = pick(PATS), ics = pick(ICS), n = pat.length * 3, seq = patSeq(pat, ics, n), h = ri(pat.length, n - 2), ans = seq[h];
      return MC(`규칙에 따라 ❓에 알맞은 것은?<div style="font-size:30px;text-align:center;letter-spacing:4px">${seq.map((x, i) => i === h ? '❓' : x).join('')}</div>`, [ans, ...ics.filter(x => x !== ans)], `반복되는 부분(${pat.split('').map(c => ics['ABC'.indexOf(c)]).join('')})을 찾아요 → <b>${ans}</b>`); } },
  { id:'pt-num', name:'수 배열에서 규칙 찾기', std:'2수02-01', lv:[2,3], t:'both',
    g(L){ const d = pick(L > 2 ? [5, 10, -2, -10, 3] : [2, 10, 5]), s = d > 0 ? ri(1, 30) : ri(60, 99), seq = range(0, 5).map(i => s + d * i), h = ri(2, 5);
      return N(`규칙에 따라 □ 안에 알맞은 수는? ${E(seq.map((x, i) => i === h ? '□' : x).join(', '))}`, seq[h], `${Math.abs(d)}씩 ${d > 0 ? '커지는' : '작아지는'} 규칙 → <b>${seq[h]}</b>`, [seq[h] + d, seq[h] - d, seq[h] + 1]); } },
  { id:'pt-table', name:'수 배열표에서 규칙 찾기', std:'2수02-01', lv:[3,4], t:'both',
    g(){ const r0 = ri(1, 7), c0 = ri(1, 6), dir = pick(['↓', '→', '↘']), d = { '↓': 10, '→': 1, '↘': 11 }[dir], start = r0 * 10 + c0, k = 3, v = start + d * k;
      let h = '<table class="qt">'; for (let r = 0; r < 4; r++){ h += '<tr>'; for (let c = 0; c < 4; c++){ const x = (r0 + r) * 10 + c0 + c; const onPath = (dir === '↓' && c === 0) || (dir === '→' && r === 0) || (dir === '↘' && r === c); h += `<td style="${onPath ? 'background:#FFF4D0' : ''}">${x === v && onPath ? '□' : x}</td>`; } h += '</tr>'; }
      return N(`1부터 100까지의 수 배열표의 일부예요. 색칠한 칸은 ${dir} 방향으로 몇씩 커지는 규칙이 있어요. □ 안에 알맞은 수는?${h}</table>`, v, `${dir} 방향으로 ${d}씩 커져요 → <b>${v}</b>`, [v + 1, v - d, v + 10]); } },
  { id:'pt-code', name:'규칙을 수로 나타내기', std:'2수02-01', lv:[3,3], t:'mc',
    g(){ const [pat] = pick(PATS.slice(0, 3)), ics = pick(ICS), seq = patSeq(pat, ics, pat.length * 2), code = seq.map(x => ics.indexOf(x) + 1).join(' '), wrongs = [code.split(' ').map(x => x === '1' ? '2' : '1').join(' '), code.split(' ').reverse().join(' '), code.split(' ').map((x, i) => i % 2 ? '1' : '2').join(' ')];
      const has3 = seq.includes(ics[2]); return MC(`${ics[0]}는 1, ${ics[1]}는 2${has3 ? `, ${ics[2]}는 3으로` : '로'} 나타내면?<div style="font-size:30px;text-align:center">${seq.join('')}</div>`, [code, ...wrongs], `모양 하나하나를 차례로 수로 바꾸어요 → <b>${code}</b>`); } },
  { id:'pt-count', name:'규칙으로 개수 구하기', std:'2수02-02', lv:[4,5], t:'both',
    g(){ const [pat] = pick(PATS.slice(0, 3)), ics = pick(ICS), n = pat.length * ri(3, 5) + ri(0, pat.length - 1), seq = patSeq(pat, ics, n), x = ics[0], v = seq.filter(z => z === x).length;
      return N(`${pat.split('').map(c => ics['ABC'.indexOf(c)]).join('')} 모양을 되풀이하여 ${n}개를 늘어놓았어요. ${x}는 모두 몇 개일까요?`, v, `${pat.length}개씩 묶으면 ${Math.floor(n / pat.length)}묶음${n % pat.length ? `과 ${n % pat.length}개` : ''} → ${x}는 <b>${v}개</b>`, [v + 1, n - v, v - 1], '개'); } }
]});

/* ─────────────── 6. 덧셈과 뺄셈(3) ─────────────── */
const noCarry = () => { let a, b; do { a = ri(11, 88); b = ri(11, 88); } while (a % 10 + b % 10 > 9 || a + b > 99); return [a, b]; };
const noBorrow = () => { let a, b; do { a = ri(21, 99); b = ri(11, a - 10); } while (a % 10 < b % 10); return [a, b]; };
A.addUnit({ key:'1-2-6', title:'덧셈과 뺄셈(3)', items:[
  { id:'dd-add1', name:'(몇십몇) + (몇)', std:'2수01-06', lv:[1,1], t:'both',
    g(){ let a, b; do { a = ri(11, 95); b = ri(1, 8); } while (a % 10 + b > 9); return N(`${a} + ${b}의 값은?`, a + b, `낱개끼리 더해요: ${a % 10} + ${b} = ${a % 10 + b} → <b>${a + b}</b>`, [a + b + 10, a + b - 1, a + b * 10]); } },
  { id:'dd-sub1', name:'(몇십몇) - (몇)', std:'2수01-06', lv:[1,1], t:'both',
    g(){ let a, b; do { a = ri(12, 99); b = ri(1, 8); } while (a % 10 < b); return N(`${a} - ${b}의 값은?`, a - b, `낱개끼리 빼요: ${a % 10} - ${b} = ${a % 10 - b} → <b>${a - b}</b>`, [a - b - 10, a - b + 1, a + b]); } },
  { id:'dd-tens', name:'(몇십) ± (몇십)', std:'2수01-06', lv:[1,2], t:'both',
    g(){ const a = ri(2, 8), b = ri(1, 9 - a), plus = ri(0, 1);
      return plus ? N(`${a * 10} + ${b * 10}의 값은?`, (a + b) * 10, `10개씩 묶음끼리 ${a} + ${b} = ${a + b} → <b>${(a + b) * 10}</b>`, [a + b, (a + b) * 10 + 10, Math.abs(a - b) * 10]) : N(`${(a + b) * 10} - ${b * 10}의 값은?`, a * 10, `10개씩 묶음끼리 ${a + b} - ${b} = ${a} → <b>${a * 10}</b>`, [a, a * 10 + 10, (a + 2 * b) * 10]); } },
  { id:'dd-add2', name:'(몇십몇) + (몇십몇)', std:'2수01-06', lv:[2,2], t:'both',
    g(){ const [a, b] = noCarry(); return N(`${a} + ${b}의 값은?`, a + b, `낱개끼리 ${a % 10} + ${b % 10} = ${a % 10 + b % 10}, 10개씩 묶음끼리 ${Math.floor(a / 10)} + ${Math.floor(b / 10)} = ${Math.floor((a + b) / 10)} → <b>${a + b}</b>`, [a + b + 10, a + b - 1, a + b - 10]); } },
  { id:'dd-sub2', name:'(몇십몇) - (몇십몇)', std:'2수01-06', lv:[2,2], t:'both',
    g(){ const [a, b] = noBorrow(); return N(`${a} - ${b}의 값은?`, a - b, `낱개끼리, 10개씩 묶음끼리 빼요 → <b>${a - b}</b>`, [a - b + 10, a - b - 1, a + b > 99 ? a - b + 1 : a + b]); } },
  { id:'dd-word', name:'덧셈·뺄셈 생활 문제', std:'2수01-05', lv:[2,3], t:'both',
    g(){ const t = ri(0, 1);
      if (t){ const [a, b] = noCarry(); return N(`줄넘기를 ${pick(NAMES)}는 ${a}번, 동생은 ${b}번 했어요. 두 사람이 한 줄넘기는 모두 몇 번일까요?`, a + b, `${a} + ${b} = <b>${a + b}번</b>`, [a + b + 10, Math.abs(a - b), a + b - 1], '번'); }
      const [a, b] = noBorrow(); return N(`도서관에 동화책이 ${a}권, 위인전이 ${b}권 있어요. 동화책은 위인전보다 몇 권 더 많을까요?`, a - b, `${a} - ${b} = <b>${a - b}권</b>`, [a + b > 99 ? a - b + 10 : a + b, a - b + 10, a - b - 1], '권'); } },
  { id:'dd-cmp', name:'계산 결과 비교', std:'2수01-06', lv:[3,3], t:'mc',
    g(){ const [a, b] = noCarry(), [c, d] = noBorrow(), L = a + b, R = c - d, cc = CMP(L, R);
      return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것은? ${E(`${a} + ${b} ○ ${c} - ${d}`)}`, [cc, ...CMPC.filter(z => z !== cc)], `${a} + ${b} = ${L}, ${c} - ${d} = ${R} → <b>${cc}</b>`); } },
  { id:'dd-box', name:'□ 안에 알맞은 수', std:'2수01-07', lv:[3,4], t:'both',
    g(){ const [a, b] = noCarry(), t = ri(0, 1); return t ? N(`□ 안에 알맞은 수는? ${E(`${a} + □ = ${a + b}`)}`, b, `${a + b} - ${a} = <b>${b}</b>`, [a + b, b + 10, b + 1]) : N(`□ 안에 알맞은 수는? ${E(`${a + b} - □ = ${a}`)}`, b, `${a + b} - ${a} = <b>${b}</b>`, [a + b, b + 10, b - 1]); } },
  { id:'dd-cards', name:'수 카드로 덧셈식 만들기', std:'2수01-06', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(1, 5)).slice(0, 4); const s = c.slice().sort((a, b) => b - a), v = (s[0] + s[1]) * 10 + s[2] + s[3];
      return N(`수 카드 ${c.map(x => `<span class="card">${x}</span>`).join('')}를 한 번씩만 사용하여 (몇십몇) + (몇십몇)을 만들려고 해요. 합이 가장 클 때의 합은?`, v, `큰 수 ${s[0]}, ${s[1]}를 10개씩 묶음의 자리에 놓아요: 예) ${s[0]}${s[2]} + ${s[1]}${s[3]} = <b>${v}</b>`, [v - 9, (s[2] + s[3]) * 10 + s[0] + s[1], v + 1]); } }
]});
})();
