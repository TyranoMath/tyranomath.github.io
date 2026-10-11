/* =========================================================
   5학년 1학기 문제 만들기 — 수학익힘(3종) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요.
   각 문항: id · name(평가 요소) · std(성취기준) · lv[최소,최대] · t('both'|'mc'|'sa') · g(lv)
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, sample, gcd, lcm, range, divisors, dz, nf, won, sum, KO, josa,
  F, M, toF, frH, fr, makeExpr, evalExpr, showExpr, exprSteps, svg, txt, line, polyFig, fitPts, rightMark, table, tableH, blank } = A;
const NAMES = ['민수','지아','수아','지호','유나','시우','하나','서아','도희','예나','주아','태호'];
const E = s => `<div class="expr">${s}</div>`;
// 직접 만든 보기 (opts[0]이 정답)
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};
// 식의 오개념 값 (앞에서부터 계산 / 괄호 무시)
const exprWrongs = s => {
  const out = [], a = evalExpr(s, true), b = evalExpr(String(s).replace(/[()]/g, ''));
  if (a.ok) out.push(a.v); if (b.ok) out.push(b.v); return out;
};
const calcItem = (pats, rng, test) => lv => {
  const p = pick(pats[lv] || pats[Object.keys(pats)[0]]), e = makeExpr(p, rng, test || ((v, x) => v <= 300 && v > 0 && new Set(Object.values(x)).size === Object.keys(x).length));
  return { q: `다음을 계산해 보세요.${E(showExpr(e.s))}`, ans: { k: 'int', v: e.v }, wrong: exprWrongs(e.s), ex: `계산 순서에 따라: ${exprSteps(e.s).text}` };
};

/* ─────────────── 1. 자연수의 혼합 계산 ─────────────── */
A.addUnit({ key:'5-1-1', title:'자연수의 혼합 계산', items:[
  { id:'mix-pm', name:'덧셈과 뺄셈이 섞인 식 계산하기', std:'6수01-01', lv:[1,2], t:'both',
    g: calcItem({ 1:['a+b-c','a-b+c'], 2:['a-(b+c)','a-(b-c)','a+b-c-d','a-(b+c)+d'] }, { a:[30,99], b:[5,40], c:[5,40], d:[3,30] }) },
  { id:'mix-md', name:'곱셈과 나눗셈이 섞인 식 계산하기', std:'6수01-01', lv:[1,2], t:'both',
    g: calcItem({ 1:['a×b÷c','a÷b×c'], 2:['a÷(b×c)','a×(b÷c)','a÷b×c'] }, { a:[12,96], b:[2,9], c:[2,9] }, (v, x) => v <= 200 && v > 1 && x.b !== x.c && v !== x.a) },
  { id:'mix-pmx', name:'덧셈, 뺄셈, 곱셈이 섞인 식 계산하기', std:'6수01-01', lv:[2,3], t:'both',
    g: calcItem({ 2:['a+b×c','a-b×c','a×b-c'], 3:['a+b×c-d','(a+b)×c-d','a-(b-c)×d','a×(b+c)-d','a-b×c+d'] }, { a:[10,60], b:[2,12], c:[2,12], d:[2,30] }) },
  { id:'mix-pmd', name:'덧셈, 뺄셈, 나눗셈이 섞인 식 계산하기', std:'6수01-01', lv:[2,3], t:'both',
    g: calcItem({ 2:['a+b÷c','a-b÷c'], 3:['a-b÷c+d','(a+b)÷c-d','a+(b-c)÷d','a+b÷(c-d)'] }, { a:[10,60], b:[12,96], c:[2,9], d:[2,20] }) },
  { id:'mix-all', name:'+, -, ×, ÷와 ( )가 섞인 식 계산하기', std:'6수01-01', lv:[3,4], t:'both',
    g: calcItem({ 3:['a×b-c÷d+e','a+b×c-d÷e','a-b÷c×d+e'], 4:['a×(b+c)-d÷e','a-b×(c+d)÷e','(a+b)÷c×d-e','a+(b-c)×d÷e','a÷(b-c)+d×e'] },
      { a:[10,60], b:[2,12], c:[2,12], d:[2,48], e:[2,9] }) },
  { id:'mix-first', name:'가장 먼저 계산할 부분 찾기', std:'6수01-01', lv:[1,2], t:'mc',
    g(lv){
      const p = pick(lv === 1 ? ['a+b×c-d','a-b÷c+d','a×b-c+d'] : ['a+(b-c)×d','a×(b+c)-d','a-b×(c+d)','(a+b)÷c-d']);
      const e = makeExpr(p, { a:[10,60], b:[2,12], c:[2,12], d:[2,20] }, v => v <= 300);
      const t = e.s.match(/\d+|[+\-×÷()]/g).filter(x => x !== '(' && x !== ')');
      const pairs = []; for (let i = 1; i < t.length; i += 2) pairs.push(`${t[i - 1]} ${t[i]} ${t[i + 1]}`);
      const first = exprSteps(e.s).first, opts = [first, ...pairs.filter(x => x !== first)];
      return MC(`다음 식에서 <b>가장 먼저</b> 계산해야 하는 부분은 어느 것인가요?${E(showExpr(e.s))}`, opts, `( ) 안 → 곱셈·나눗셈 → 덧셈·뺄셈 순서예요. 먼저 ${first}을(를) 계산해요.`);
    } },
  { id:'mix-cmp', name:'( )의 위치에 따른 계산 결과 비교하기', std:'6수01-01', lv:[2,3], t:'mc',
    g(lv){
      for (;;){
        const [p1, p2] = pick([['a-b+c','a-(b+c)'], ['a×b-c','a×(b-c)'], ['a+b×c','(a+b)×c'], ['a÷b×c','a÷(b×c)'], ['a-b×c','(a-b)×c'], ['a+b÷c','(a+b)÷c']]);
        const vals = { a: ri(lv === 2 ? 20 : 30, 90), b: ri(2, 9), c: ri(2, 9) };
        const s1 = p1.replace(/[abc]/g, ch => vals[ch]), s2 = p2.replace(/[abc]/g, ch => vals[ch]);
        const e1 = evalExpr(s1), e2 = evalExpr(s2); if (!e1.ok || !e2.ok) continue;
        const sign = e1.v > e2.v ? '>' : e1.v < e2.v ? '<' : '=';
        return MC(`두 식의 계산 결과를 비교하여 ○ 안에 알맞은 것을 고르세요.${E(`${showExpr(s1)} ○ ${showExpr(s2)}`)}`,
          [sign, ...['>', '<', '='].filter(x => x !== sign)], `${showExpr(s1)} = ${e1.v}, ${showExpr(s2)} = ${e2.v} 이므로 ${e1.v} ${sign} ${e2.v}`);
      }
    } },
  { id:'mix-word', name:'생활 속 문제를 하나의 식으로 나타내어 해결하기', std:'6수01-01', lv:[3,4], t:'both',
    g(lv){
      const who = pick(NAMES);
      const S = lv === 3 ? [
        () => { const p = pick([300,400,500,600,700,800]), n = ri(2, 6), q = pick([500,800,1000,1200,1500]), m = pick([5000,10000]);
          if (p * n + q >= m) return null;
          return { q: `${who}는 한 개에 ${won(p)}원인 지우개 ${n}개와 ${won(q)}원짜리 공책 1권을 사고 ${won(m)}원을 냈습니다. 거스름돈은 얼마인가요?`,
            v: m - (p * n + q), u: '원', w: [m - p * n + q, p * n + q, m - p - q], ex: `${won(m)} - (${p} × ${n} + ${q}) = ${won(m - (p * n + q))}(원)` }; },
        () => { const c = ri(3, 8), each = ri(4, 12), a = ri(5, 30), tot = c * each, b = tot - a; if (b < 3) return null;
          return { q: `사탕이 ${a}개 있었는데 ${b}개를 더 사 왔습니다. 이 사탕을 ${c}명이 똑같이 나누어 가지면 한 명이 몇 개씩 가지게 되나요?`,
            v: each, u: '개', w: [a + b / c, a + b - c].filter(Number.isInteger), ex: `(${a} + ${b}) ÷ ${c} = ${each}(개)` }; },
        () => { const n = ri(3, 6), k = ri(2, 6), tot = ri(n * k + 3, n * k + 40);
          return { q: `색종이 ${tot}장 중에서 친구 ${n}명에게 ${k}장씩 나누어 주었습니다. 남은 색종이는 몇 장인가요?`,
            v: tot - n * k, u: '장', w: [(tot - n) * k, tot - n - k], ex: `${tot} - ${n} × ${k} = ${tot - n * k}(장)` }; },
        () => { const b = ri(3, 8), per = ri(6, 15), k = pick([2,3,4,5,6]); if ((b * per) % k) return null;
          return { q: `한 봉지에 ${per}개씩 들어 있는 과자 ${b}봉지를 ${k}명이 똑같이 나누어 먹으려고 합니다. 한 명이 몇 개씩 먹을 수 있나요?`,
            v: b * per / k, u: '개', w: [per * (b / k), b + per - k].filter(Number.isInteger), ex: `${per} × ${b} ÷ ${k} = ${b * per / k}(개)` }; }
      ] : [
        () => { const n = pick([3,4,5]), price = pick([1200,1500,2000,2400,3000]), k = ri(2, 8), q = pick([500,700,900,1200]), m = pick([10000,20000]);
          if (price % n || price / n * k + q >= m) return null;
          return { q: `연필 ${n}자루에 ${won(price)}원입니다. ${who}는 연필 ${k}자루와 ${won(q)}원짜리 자를 사고 ${won(m)}원을 냈습니다. 거스름돈은 얼마인가요?`,
            v: m - (price / n * k + q), u: '원', w: [m - price / n * k + q, m - price * k + q].filter(x => x > 0), ex: `${won(m)} - (${won(price)} ÷ ${n} × ${k} + ${q}) = ${won(m - (price / n * k + q))}(원)` }; },
        () => { const a = ri(11, 16), b = ri(2, 5), c = 3, d = ri(1, 8);
          return { q: `형은 ${a}살이고 동생은 형보다 ${b}살 적습니다. 어머니의 나이는 동생 나이의 ${c}배보다 ${d}살 많습니다. 어머니는 몇 살인가요?`,
            v: (a - b) * c + d, u: '살', w: [a - b * c + d, (a + b) * c + d], ex: `(${a} - ${b}) × ${c} + ${d} = ${(a - b) * c + d}(살)` }; },
        () => { const box = ri(3, 6), per = ri(8, 20), eat = ri(2, 4), days = ri(3, 7), left = box * per - eat * days; if (left < 1) return null;
          return { q: `한 상자에 ${per}개씩 들어 있는 귤 ${box}상자가 있습니다. 하루에 ${eat}개씩 ${days}일 동안 먹었다면 남은 귤은 몇 개인가요?`,
            v: left, u: '개', w: [box * per - eat + days, (box * per - eat) * days].filter(x => x > 0), ex: `${per} × ${box} - ${eat} × ${days} = ${left}(개)` }; }
      ];
      for (;;){ const r = pick(S)(); if (!r || r.v == null || r.v <= 0 || !Number.isInteger(r.v)) continue;
        return { q: r.q, ans: { k:'int', v: r.v, unit: r.u }, wrong: r.w, ex: r.ex }; }
    } },
  { id:'mix-sentence', name:'문장을 하나의 식으로 나타내어 계산하기', std:'6수01-01', lv:[3,4], t:'both',
    g(lv){
      const wa = n => josa(n, '과', '와'), ul = n => josa(n, '을', '를'), ro = n => n + (/[036]$/.test(String(n)) ? '으로' : '로');
      const L3 = [
        ['(a+b)×c', (a,b,c) => `${wa(a)} ${b}의 합에 ${ul(c)} 곱한 수`],
        ['a-b×c', (a,b,c) => `${a}에서 ${wa(b)} ${c}의 곱을 뺀 수`],
        ['a÷b+c', (a,b,c) => `${ul(a)} ${ro(b)} 나눈 몫에 ${ul(c)} 더한 수`],
        ['a÷(b×c)', (a,b,c) => `${ul(a)} ${wa(b)} ${c}의 곱으로 나눈 몫`]
      ], L4 = [
        ['(a-b)×c+d÷e', (a,b,c,d,e) => `${wa(a)} ${b}의 차를 ${c}배 한 수와 ${ul(d)} ${ro(e)} 나눈 몫의 합`],
        ['a-(b-c)×d', (a,b,c,d) => `${a}에서 ${wa(b)} ${c}의 차에 ${ul(d)} 곱한 수를 뺀 수`],
        ['(a+b)÷c-d', (a,b,c,d) => `${wa(a)} ${b}의 합을 ${ro(c)} 나눈 몫에서 ${ul(d)} 뺀 수`]
      ];
      const [p, f] = pick(lv === 3 ? L3 : L4);
      const e = makeExpr(p, { a:[12,96], b:[2,40], c:[2,9], d:[2,60], e:[2,9] }, v => v <= 300 && v > 0);
      const v = e.vals;
      return { q: `다음을 하나의 식으로 나타내어 계산한 값을 구하세요.<div class="say">${f(v.a, v.b, v.c, v.d, v.e)}</div>`,
        ans: { k:'int', v: e.v }, wrong: exprWrongs(e.s), ex: `${showExpr(e.s)} = ${e.v}` };
    } },
  { id:'mix-box', name:'식 속의 □ 구하기', std:'6수01-01', lv:[4,5], t:'both',
    g(lv){
      const p = pick(lv === 4 ? ['a+x×b-c','a×x-b÷c','(a+x)÷b+c'] : ['a-x×(b-c)+d','a+x×(b÷c)-d','(a-x)×b÷c+d']);
      const e = makeExpr(p, { a:[8,60], b:[2,12], c:[2,12], d:[2,30], x:[2,12] }, (v, vals) => { if (v > 300) return false; const s2 = p.replace(/[a-hx]/g, ch => ch === 'x' ? vals.x + 1 : vals[ch]); const e2 = evalExpr(s2); return !e2.ok || e2.v !== v; });
      const shown = e.s.replace(new RegExp(`(^|[^0-9])${e.vals.x}(?=[^0-9]|$)`), `$1□`);
      if (!shown.includes('□')) return this.g(lv);
      // □가 한 번만 나오도록 (같은 수가 여러 번이면 다시)
      if ((e.s.match(new RegExp(`(^|[^0-9])${e.vals.x}(?=[^0-9]|$)`, 'g')) || []).length > 1) return this.g(lv);
      return { q: `□ 안에 알맞은 수를 구하세요.${E(showExpr(shown) + ' = ' + e.v)}`, ans: { k:'int', v: e.vals.x },
        ex: `□ = ${e.vals.x}을(를) 넣으면 ${exprSteps(e.s).text} 이 되어 식이 성립해요.` };
    } },
  { id:'mix-mistake', name:'잘못 계산한 식을 바르게 계산하기', std:'6수01-01', lv:[3,4], t:'both',
    g(lv){
      for (;;){
        const e = makeExpr(pick(['a-b÷c+d','a+b×c-d','a-b×c+d','a×b-c÷d','a+b÷c×d']), { a:[20,80], b:[2,40], c:[2,9], d:[2,12] }, v => v <= 300);
        const w = evalExpr(e.s, true); if (!w.ok || w.v === e.v) continue;
        const who = pick(NAMES);
        return { q: `${who}는 다음 식을 앞에서부터 차례대로 계산하여 ${w.v}이(가) 나왔습니다. 바르게 계산한 값을 구하세요.${E(showExpr(e.s))}`,
          ans: { k:'int', v: e.v }, wrong: [w.v], ex: `곱셈·나눗셈을 먼저 해요: ${exprSteps(e.s).text}` };
      }
    } },
  { id:'mix-paren', name:'식이 성립하도록 ( )로 묶을 부분 찾기', std:'6수01-01', lv:[5,5], t:'mc',
    g(){
      for (;;){
        const e = makeExpr(pick(['a-b×c+d','a+b×c-d','a×b-c+d','a-b+c×d','a÷b+c×d']), { a:[6,60], b:[2,12], c:[2,12], d:[2,12] }, v => v <= 300);
        const t = e.s.match(/\d+|[+\-×÷]/g), cands = [];
        for (let i = 0; i + 2 < t.length; i += 2) for (let j = i + 2; j < t.length; j += 2){
          if (i === 0 && j === t.length - 1) continue;
          const s = [...t.slice(0, i), '(', ...t.slice(i, j + 1), ')', ...t.slice(j + 1)].join('');
          const r = evalExpr(s), raw = Function('return ' + s.replace(/×/g, '*').replace(/÷/g, '/'))(); cands.push({ part: t.slice(i, j + 1).join(' '), s, v: r.ok ? r.v : null, raw });
        }
        const good = cands.filter(c => c.v !== null && c.v !== e.v);
        const target = pick(good); if (!target) continue;
        if (cands.filter(c => Math.abs(c.raw - target.v) < 1e-9).length > 1 || Math.abs(evalExpr(e.s).v - target.v) < 1e-9) continue;
        const others = shuffle(cands.filter(c => c !== target)).slice(0, 3).map(c => c.part);
        if (others.length < 2) continue;
        return MC(`식이 성립하도록 ( )로 묶어야 하는 부분은 어디인가요?${E(showExpr(e.s) + ' = ' + target.v)}`, [target.part, ...others],
          `${showExpr(target.s)} → ${exprSteps(target.s).text}`);
      }
    } },
  { id:'mix-card', name:'수 카드로 계산 결과가 가장 큰(작은) 식 만들기', std:'6수01-01', lv:[5,5], t:'both',
    g(){
      const cards = sample(range(2, 9), 3), big = Math.random() < .6;
      const pat = pick(['(k+□)×□-□', 'k+□×□-□', '□×□-□+k']), k = ri(2, 9);
      let best = null, bestS = '';
      const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
      perms.forEach(pm => { let i = 0; const s = pat.replace('k', k).replace(/□/g, () => cards[pm[i++]]); const r = evalExpr(s);
        if (r.ok && (best === null || (big ? r.v > best : r.v < best))){ best = r.v; bestS = s; } });
      return { q: `수 카드 ${cards.map(c => `<span class="card">${c}</span>`).join(' ')}을 □ 안에 한 번씩만 넣어 계산 결과가 가장 <b>${big ? '큰' : '작은'}</b> 식을 만들려고 합니다. 그때의 계산 결과를 구하세요.${E(showExpr(pat.replace('k', k)))}`,
        ans: { k:'int', v: best }, ex: `${showExpr(bestS)} = ${best}일 때 가장 ${big ? '커요' : '작아요'}.` };
    } },
  { id:'mix-ineq', name:'혼합 계산 결과로 □ 안에 들어갈 수 있는 수 구하기', std:'6수01-01', lv:[5,5], t:'both',
    g(){
      const e = makeExpr(pick(['a-b+c÷d','a+b×c-d','a÷b+c×d','(a+b)÷c+d']), { a:[6,40], b:[2,12], c:[2,24], d:[2,9] }, v => v >= 5 && v <= 60);
      if (Math.random() < .5) return { q: `□ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수를 구하세요.${E(showExpr(e.s) + ' &lt; □')}`, ans: { k:'int', v: e.v + 1 }, wrong: [e.v, e.v + 2], ex: `${showExpr(e.s)} = ${e.v}이므로 □는 ${e.v}보다 커야 해요. 가장 작은 자연수는 ${e.v + 1}이에요.` };
      return { q: `□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?${E(showExpr(e.s) + ' &gt; □')}`, ans: { k:'int', v: e.v - 1, unit:'개' }, wrong: [e.v, e.v + 1], ex: `${showExpr(e.s)} = ${e.v}이므로 □는 1부터 ${e.v - 1}까지 ${e.v - 1}개예요.` };
    } },
  { id:'mix-rule', name:'약속에 따라 계산하기', std:'6수01-01', lv:[4,4], t:'both',
    g(){
      const R = pick([['가×나-가+나', (a, b) => a * b - a + b], ['가+가×나-나', (a, b) => a + a * b - b], ['(가+나)×가-나', (a, b) => (a + b) * a - b], ['가×가-나×2', (a, b) => a * a - b * 2]]);
      const a = ri(3, 9), b = ri(2, 8), v = R[1](a, b);
      if (v <= 0) return this.g();
      return { q: `기호 ◎를 다음과 같이 약속할 때, ${a}◎${b}의 값을 구하세요.<div class="say">가◎나 = ${showExpr(R[0])}</div>`, ans: { k:'int', v },
        ex: `가 = ${a}, 나 = ${b}를 넣으면 ${showExpr(R[0].replace(/가/g, a).replace(/나/g, b))} = ${v}` };
    } }
]});

/* ─────────────── 2. 약수와 배수 ─────────────── */
const COMP = [12,15,16,18,20,21,24,27,28,30,32,36,40,42,45,48,50,54,56,60,63,64,72,80,84,90,96];
A.addUnit({ key:'5-1-2', title:'약수와 배수', items:[
  { id:'div-all', name:'약수 모두 구하기', std:'6수01-04', lv:[1,2], t:'both',
    g(lv){
      const n = pick(COMP.filter(x => lv === 1 ? x <= 36 : x > 30)), d = divisors(n);
      const mid = d[Math.floor(d.length / 2)], fake = pick(range(2, n - 1).filter(x => n % x));
      return { q: `${n}의 약수를 모두 쓰세요. <small>(쉼표로 구분)</small>`, ans: { k:'set', v: d },
        wrong: [d.slice(1, -1), d.filter(x => x !== mid), [...d, fake].sort((a, b) => a - b)], ex: `${n}을(를) 나누어떨어지게 하는 수: ${d.join(', ')}` };
    } },
  { id:'div-not', name:'약수가 아닌 수 찾기', std:'6수01-04', lv:[1,2], t:'mc',
    g(){
      const n = pick(COMP.filter(x => divisors(x).length >= 6)), d = divisors(n);
      const fake = pick(range(3, n - 1).filter(x => n % x && x < n / 1.5));
      const opts = [fake, ...sample(d.filter(x => x > 1 && x < n), 3)];
      return MC(`${n}의 약수가 <b>아닌</b> 수는 어느 것인가요?`, opts.map(String), `${n}의 약수는 ${d.join(', ')}예요. ${fake}(으)로 나누면 나누어떨어지지 않아요.`);
    } },
  { id:'mul-kth', name:'배수 구하기', std:'6수01-05', lv:[1,1], t:'both',
    g(){ const n = ri(4, 19), k = ri(4, 9);
      return { q: `${n}의 배수를 가장 작은 수부터 차례대로 쓸 때, ${k}번째 수를 구하세요.`, ans: { k:'int', v: n * k }, wrong: [n * (k - 1), n * (k + 1), n + k], ex: `${n}의 ${k}배: ${n} × ${k} = ${n * k}` }; } },
  { id:'div-count', name:'약수의 개수 구하기', std:'6수01-04', lv:[2,2], t:'both',
    g(){ const n = pick(COMP), d = divisors(n);
      return { q: `${n}의 약수는 모두 몇 개인가요?`, ans: { k:'int', v: d.length, unit:'개' }, wrong: [d.length - 1, d.length - 2, d.length + 1], ex: `${n}의 약수: ${d.join(', ')} → ${d.length}개` }; } },
  { id:'div-rel', name:'약수와 배수의 관계인 두 수 찾기', std:'6수01-05', lv:[2,3], t:'mc',
    g(){
      const a = ri(3, 12), b = a * ri(3, 8), good = `(${a}, ${b})`;
      const bad = []; while (bad.length < 3){ const x = ri(3, 15), y = ri(20, 90); if (y % x && x % y && !bad.includes(`(${x}, ${y})`)) bad.push(`(${x}, ${y})`); }
      return MC('두 수가 약수와 배수의 관계인 것은 어느 것인가요?', [good, ...bad], `${b} = ${a} × ${b / a}이므로 ${b}는 ${a}의 배수이고, ${a}는 ${b}의 약수예요.`);
    } },
  { id:'gcd', name:'최대공약수 구하기', std:'6수01-04', lv:[2,3], t:'both',
    g(lv){
      for (;;){ const g = ri(2, lv === 2 ? 9 : 18), p = ri(2, 9), q = ri(2, 9); if (p === q || gcd(p, q) !== 1) continue;
        const a = g * p, b = g * q; if (a > 100 || b > 100) continue;
        const sm = divisors(g).filter(x => x < g);
        return { q: `${a}와(과) ${b}의 최대공약수를 구하세요.`, ans: { k:'int', v: g }, wrong: [g * p * q, sm[sm.length - 1] || 1, 1, a * b], ex: `${a} = ${g} × ${p}, ${b} = ${g} × ${q} → 최대공약수는 ${g}` }; }
    } },
  { id:'lcm', name:'최소공배수 구하기', std:'6수01-05', lv:[2,3], t:'both',
    g(lv){
      for (;;){ const g = ri(lv === 2 ? 1 : 2, lv === 2 ? 6 : 12), p = ri(2, 9), q = ri(2, 9); if (p === q || gcd(p, q) !== 1) continue;
        const a = g * p, b = g * q; if (a > 60 || b > 60 || a === b) continue;
        const L = g * p * q; if (L === a * b && lv === 3) continue;
        return { q: `${a}와(과) ${b}의 최소공배수를 구하세요.`, ans: { k:'int', v: L }, wrong: [a * b, g, L * 2, L / 2].filter(x => Number.isInteger(x) && x !== L), ex: `${a}와(과) ${b}의 공배수 중 가장 작은 수: ${L} (= 최대공약수 ${g} × ${p} × ${q})` }; }
    } },
  { id:'mul-count', name:'범위 안에 있는 배수의 개수 구하기', std:'6수01-05', lv:[3,3], t:'both',
    g(){
      if (Math.random() < .5){ const k = ri(6, 19), v = Math.floor(99 / k) - Math.floor(9 / k);
        return { q: `${k}의 배수 중에서 두 자리 수는 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [v + 1, v - 1, Math.floor(99 / k)], ex: `${k} × ${Math.ceil(10 / k)} = ${k * Math.ceil(10 / k)}부터 ${k} × ${Math.floor(99 / k)} = ${k * Math.floor(99 / k)}까지 ${v}개예요.` }; }
      const k = ri(4, 13), a = ri(20, 80), b = a + ri(40, 120), v = Math.floor(b / k) - Math.floor((a - 1) / k);
      return { q: `${a}부터 ${b}까지의 수 중에서 ${k}의 배수는 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [v + 1, v - 1, Math.floor(b / k)], ex: `${b}까지 ${k}의 배수 ${Math.floor(b / k)}개 - ${a - 1}까지 ${Math.floor((a - 1) / k)}개 = ${v}개` };
    } },
  { id:'gcd-common', name:'최대공약수를 이용하여 공약수 구하기', std:'6수01-04', lv:[3,3], t:'both',
    g(){ const G = pick([12,15,16,18,20,24,28,30,36]), d = divisors(G);
      if (Math.random() < .5) return { q: `어떤 두 수의 최대공약수가 ${G}일 때, 두 수의 공약수를 모두 쓰세요. <small>(쉼표로 구분)</small>`, ans: { k:'set', v: d }, wrong: [d.slice(1), d.slice(0, -1), [1, G]], ex: `두 수의 공약수는 최대공약수 ${G}의 약수예요: ${d.join(', ')}` };
      return { q: `어떤 두 수의 최대공약수가 ${G}일 때, 두 수의 공약수는 모두 몇 개인가요?`, ans: { k:'int', v: d.length, unit:'개' }, wrong: [d.length - 1, d.length + 1, 2], ex: `공약수 = ${G}의 약수: ${d.join(', ')} → ${d.length}개` }; } },
  { id:'lcm-cond', name:'조건에 맞는 공배수 구하기', std:'6수01-05', lv:[3,4], t:'both',
    g(lv){
      for (;;){ const a = ri(3, 12), b = ri(3, 15); if (a === b) continue; const L = lcm(a, b); if (L < 12 || L > 45) continue;
        const r = Math.random();
        if (r < .4){ const v = Math.floor(99 / L) * L; return { q: `${a}와(과) ${b}의 공배수 중에서 가장 큰 두 자리 수를 구하세요.`, ans: { k:'int', v }, wrong: [v - L, a * b < 100 ? a * b : v + 1, L], ex: `최소공배수 ${L}의 배수 중 가장 큰 두 자리 수: ${v}` }; }
        if (r < .7){ const v = Math.ceil(100 / L) * L; return { q: `${a}와(과) ${b}의 공배수 중에서 가장 작은 세 자리 수를 구하세요.`, ans: { k:'int', v }, wrong: [v + L, v - L, 100], ex: `최소공배수 ${L}의 배수 중 100보다 크거나 같은 가장 작은 수: ${v}` }; }
        const m = ri(2, 5), lo = L * m - ri(1, L - 1), hi = L * m + ri(1, L - 1);
        return { q: `${a}와(과) ${b}의 공배수 중에서 ${lo}보다 크고 ${hi}보다 작은 수를 구하세요.`, ans: { k:'int', v: L * m }, wrong: [L * (m - 1), L * (m + 1), a * b], ex: `공배수는 최소공배수 ${L}의 배수예요. ${lo}와 ${hi} 사이에는 ${L * m}이 있어요.` }; }
    } },
  { id:'gcd-word', name:'최대공약수를 활용하여 문제 해결하기', std:'6수01-04', lv:[4,5], t:'both',
    g(lv){
      for (;;){ const g = ri(3, 16), p = ri(2, 7), q = ri(2, 7); if (p === q || gcd(p, q) !== 1) continue; const A1 = g * p, B1 = g * q; if (A1 > 96 || B1 > 96) continue;
        const [x, y] = sample([['사과','배'], ['연필','지우개'], ['초콜릿','사탕'], ['공책','색연필'], ['귤','감']], 1)[0];
        const k = Math.random();
        if (lv === 4 && k < .5) return { q: `${x} ${A1}개와 ${y} ${B1}개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있나요?`, ans: { k:'int', v: g, unit:'명' }, wrong: [g * p * q, Math.max(1, g / 2) | 0, A1 + B1], ex: `${A1}와(과) ${B1}의 최대공약수 ${g}명에게 나누어 줄 수 있어요.` };
        if (lv === 4) return { q: `가로 ${A1} cm, 세로 ${B1} cm인 직사각형 모양 종이를 남는 부분 없이 크기가 같은 가장 큰 정사각형 여러 장으로 자르려고 합니다. 정사각형의 한 변을 몇 cm로 해야 하나요?`, ans: { k:'int', v: g, unit:'cm' }, wrong: [g * p * q, A1 - B1 > 0 ? A1 - B1 : B1 - A1, 1], ex: `${A1}와(과) ${B1}의 최대공약수인 ${g} cm` };
        if (k < .5) return { q: `${x} ${A1}개와 ${y} ${B1}개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 합니다. 한 명이 받는 ${x}와(과) ${y}는 모두 몇 개인가요?`, ans: { k:'int', v: p + q, unit:'개' }, wrong: [g, p, q, p * q], ex: `최대 ${g}명에게 나누어 주므로 한 명이 ${x} ${p}개, ${y} ${q}개 → ${p + q}개` };
        return { q: `가로 ${A1} cm, 세로 ${B1} cm인 직사각형 모양 종이를 남는 부분 없이 크기가 같은 가장 큰 정사각형 여러 장으로 자르면 정사각형은 모두 몇 장이 되나요?`, ans: { k:'int', v: p * q, unit:'장' }, wrong: [p + q, g, p * q * 2], ex: `한 변은 최대공약수 ${g} cm → 가로 ${p}장 × 세로 ${q}장 = ${p * q}장` };
      }
    } },
  { id:'lcm-word', name:'최소공배수를 활용하여 문제 해결하기', std:'6수01-05', lv:[4,5], t:'both',
    g(lv){
      for (;;){ const a = ri(3, 15), b = ri(4, 20); if (a === b || a % b === 0 || b % a === 0) continue; const L = lcm(a, b); if (L > 60) continue;
        if (lv === 4){
          if (Math.random() < .5) return { q: `가 버스는 ${a}분마다, 나 버스는 ${b}분마다 출발합니다. 오전 9시에 두 버스가 동시에 출발했다면, 다음번에 동시에 출발하는 때는 몇 분 후인가요?`, ans: { k:'int', v: L, unit:'분' }, wrong: [a * b === L ? L * 2 : a * b, a + b, gcd(a, b)], ex: `${a}와(과) ${b}의 최소공배수인 ${L}분 후` };
          return { q: `가로 ${a} cm, 세로 ${b} cm인 직사각형 모양 카드를 겹치지 않게 빈틈없이 이어 붙여서 가장 작은 정사각형을 만들려고 합니다. 정사각형의 한 변은 몇 cm인가요?`, ans: { k:'int', v: L, unit:'cm' }, wrong: [a * b === L ? L * 2 : a * b, a + b, gcd(a, b)], ex: `${a}와(과) ${b}의 최소공배수인 ${L} cm` };
        }
        if (Math.random() < .5){ const T = pick([60, 90, 120, 180]); if (T % L === T) continue; const v = Math.floor(T / L) + 1;
          return { q: `가 분수는 ${a}분마다, 나 분수는 ${b}분마다 물을 뿜습니다. 오후 1시에 두 분수가 동시에 물을 뿜었다면 오후 1시부터 ${T}분 동안(오후 1시 포함) 두 분수가 동시에 물을 뿜는 것은 모두 몇 번인가요?`, ans: { k:'int', v, unit:'번' }, wrong: [v - 1, v + 1], ex: `${L}분마다 동시에 뿜어요. 0, ${L}, ${L * 2}… 중 ${T}분 이내: ${v}번` }; }
        return { q: `가로 ${a} cm, 세로 ${b} cm인 직사각형 모양 카드를 겹치지 않게 빈틈없이 이어 붙여서 가장 작은 정사각형을 만들려고 합니다. 카드는 모두 몇 장 필요한가요?`, ans: { k:'int', v: (L / a) * (L / b), unit:'장' }, wrong: [L / a + L / b, L], ex: `한 변 ${L} cm → 가로 ${L / a}장 × 세로 ${L / b}장 = ${(L / a) * (L / b)}장` };
      }
    } },
  { id:'gcd-lcm-rel', name:'최대공약수와 최소공배수의 관계 활용하기', std:'6수01-05', lv:[5,5], t:'both',
    g(){
      for (;;){ const g = ri(2, 9), p = ri(2, 7), q = ri(2, 7); if (p === q || gcd(p, q) !== 1) continue; const a = g * p, b = g * q, L = g * p * q; if (L > 200) continue;
        return { q: `두 수 ㉠과 ㉡의 최대공약수는 ${g}이고, 최소공배수는 ${L}입니다. ㉠이 ${a}일 때 ㉡을 구하세요.`, ans: { k:'int', v: b }, wrong: [L / a * 1, L - a, g * q * 2].filter(x => Number.isInteger(x) && x !== b), ex: `(두 수의 곱) = (최대공약수) × (최소공배수)이므로 ㉡ = ${g} × ${L} ÷ ${a} = ${b}` }; }
    } },
  { id:'num-cond', name:'조건을 모두 만족하는 수 찾기', std:'6수01-04', lv:[5,5], t:'both',
    g(){
      for (let k = 0; k < 400; k++){
        const a = pick(COMP), b = pick(COMP); if (a === b) continue;
        const conds = [[`${a}의 약수입니다.`, x => a % x === 0], [`${b}의 약수가 아닙니다.`, x => b % x !== 0]];
        const extra = pick([['한 자리 수입니다.', x => x < 10], ['두 자리 수입니다.', x => x >= 10 && x < 100], ['홀수입니다.', x => x % 2 === 1], ['짝수입니다.', x => x % 2 === 0]]);
        conds.push(extra);
        const sol = range(1, 100).filter(x => conds.every(c => c[1](x)));
        if (sol.length !== 1) continue;
        return { q: `다음 조건을 모두 만족하는 수를 구하세요.<ul class="conds">${conds.map(c => `<li>${c[0]}</li>`).join('')}</ul>`, ans: { k:'int', v: sol[0] }, ex: `${a}의 약수 ${divisors(a).join(', ')} 중에서 조건을 모두 만족하는 수는 ${sol[0]}이에요.` };
      }
      return { q: `다음 조건을 모두 만족하는 수를 구하세요.<ul class="conds"><li>12의 배수입니다.</li><li>모든 약수의 합이 28입니다.</li></ul>`, ans: { k:'int', v: 12 }, ex: '12의 약수: 1, 2, 3, 4, 6, 12 → 합 28' };
    } },
  { id:'mul-light', name:'배수를 활용하여 겹치는 경우의 수 구하기', std:'6수01-05', lv:[4,5], t:'both',
    g(){ for (;;){ const a = ri(2, 6), b = ri(3, 8); if (a === b || a % b === 0 || b % a === 0) continue; const L = lcm(a, b), n = pick([40, 50, 60, 80, 100]), v = Math.floor(n / L);
        return { q: `전구 ${n}개를 한 줄로 놓았습니다. 왼쪽부터 ${a}번째마다 빨간 스티커를, ${b}번째마다 파란 스티커를 붙였습니다. 두 스티커가 모두 붙은 전구는 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [Math.floor(n / (a * b)), Math.floor(n / a) + Math.floor(n / b), v + 1].filter(x => x !== v), ex: `${a}와(과) ${b}의 공배수(${L}의 배수) 번째: ${n} ÷ ${L} → ${v}개` }; } } },
  { id:'div-concept', name:'약수와 배수에 대한 설명 판단하기', std:'6수01-04', lv:[3,3], t:'mc',
    g(){
      const T = ['1은 모든 자연수의 약수입니다.', '어떤 수의 약수 중 가장 큰 수는 그 수 자신입니다.', '두 수의 공배수는 두 수의 최소공배수의 배수입니다.', '두 수의 공약수는 두 수의 최대공약수의 약수입니다.', '어떤 수의 가장 작은 배수는 그 수 자신입니다.'];
      const Fa = ['수가 클수록 약수의 개수가 많습니다.', '두 수의 공배수 중 가장 큰 수를 최소공배수라고 합니다.', '두 수의 최소공배수는 항상 두 수의 곱과 같습니다.', '두 수의 공약수 중 가장 작은 수를 최대공약수라고 합니다.', '어떤 수의 배수는 모두 그 수보다 큽니다.'];
      const f = pick(Fa);
      return MC('약수와 배수에 대한 설명으로 <b>옳지 않은</b> 것은 어느 것인가요?', [f, ...sample(T, 3)], `"${f}"는 옳지 않아요. 예를 들어 ${f.includes('클수록') ? '16(약수 5개)보다 작은 12(약수 6개)가 약수가 더 많아요' : f.includes('가장 큰 수를 최소') ? '공배수는 끝없이 많아서 가장 큰 공배수는 없어요' : f.includes('항상 두 수의 곱') ? '4와 6의 최소공배수는 24가 아니라 12예요' : f.includes('가장 작은 수를 최대') ? '공약수 중 가장 큰 수가 최대공약수예요' : '어떤 수의 1배는 그 수 자신이에요'}.`);
    } }
]});

/* ─────────────── 3. 대응 관계 ─────────────── */
const NOTE = c => c.note ? c.note + ' ' : '';
const CTX = [
  { a:'세발자전거 수', b:'바퀴 수', k:3 }, { a:'오리 수', b:'오리 다리 수', k:2 }, { a:'문어 수', b:'문어 다리 수', k:8 },
  { a:'정오각형 수', b:'정오각형의 변의 수', k:5 }, { a:'연필 묶음 수', b:'연필 수', k:12, note:'연필은 한 묶음에 12자루씩 있습니다.' }, { a:'의자 수', b:'의자 다리 수', k:4 },
  { a:'거미 수', b:'거미 다리 수', k:8 }, { a:'삼각대 수', b:'삼각대 다리 수', k:3 }, { a:'달걀판 수', b:'달걀 수', k:30, note:'달걀은 한 판에 30개씩 있습니다.' },
  { a:'꽃 수', b:'꽃잎 수', k:5, note:'꽃 한 송이에 꽃잎이 5장씩 있습니다.' }, { a:'상자 수', b:'테니스공 수', k:6, note:'테니스공은 한 상자에 6개씩 들어 있습니다.' }, { a:'우쿨렐레 수', b:'우쿨렐레 줄 수', k:4 }
];
const ADD = [
  { a:'동생의 나이', b:'형의 나이', d:3, s:'형은 동생보다 3살 많습니다.' }, { a:'시작한 쪽수', b:'마친 쪽수', d:12, s:'매일 12쪽씩 더 읽습니다.' },
  { a:'민지가 접은 학 수', b:'은우가 접은 학 수', d:5, s:'은우는 항상 민지보다 5개 더 접습니다.' }
];
A.addUnit({ key:'5-1-3', title:'대응 관계', items:[
  { id:'cor-say', name:'두 양 사이의 대응 관계를 말로 나타내기', std:'6수02-01', lv:[1,2], t:'mc',
    g(){ const c = pick(CTX);
      return MC(`${NOTE(c)}${c.a}와 ${c.b} 사이의 대응 관계를 바르게 나타낸 것은 어느 것인가요?`, [`${c.b}는 ${c.a}의 ${c.k}배입니다.`, `${c.b}는 ${c.a}보다 ${c.k} 큽니다.`, `${c.a}는 ${c.b}의 ${c.k}배입니다.`, `${c.b}는 ${c.a}보다 ${c.k} 작습니다.`],
        `${c.a}가 1씩 늘면 ${c.b}는 ${c.k}씩 늘어나요. → ${c.b}는 ${c.a}의 ${c.k}배`); } },
  { id:'cor-table', name:'대응표를 보고 값 구하기', std:'6수02-01', lv:[1,2], t:'both',
    g(lv){
      const mul = Math.random() < .7, c = mul ? pick(CTX) : pick(ADD), f = x => mul ? x * c.k : x + c.d;
      const xs = [1, 2, 3, 4, 5], hide = lv === 1 ? -1 : ri(2, 4), N = lv === 1 ? ri(6, 10) : ri(11, 20);
      const t = tableH([[c.a, ...xs], [c.b, ...xs.map((x, i) => i === hide ? '?' : f(x))]]);
      return { q: `${mul ? NOTE(c) : ''}표를 보고 ${c.a}가 ${N}일 때 ${c.b}를 구하세요.${t}`, ans: { k:'int', v: f(N) }, wrong: mul ? [N + c.k, f(N) - c.k, N * (c.k + 1)] : [N * c.d, f(N) + 1, N + c.d - 1],
        ex: mul ? `${c.b} = ${c.a} × ${c.k} → ${N} × ${c.k} = ${f(N)}` : `${c.b} = ${c.a} + ${c.d} → ${N} + ${c.d} = ${f(N)}` };
    } },
  { id:'cor-rev', name:'대응 관계를 이용하여 거꾸로 구하기', std:'6수02-01', lv:[2,3], t:'both',
    g(){ const c = pick(CTX), x = ri(7, 25), y = x * c.k;
      return { q: `${NOTE(c)}${c.b}가 ${y}일 때, ${c.a}는 얼마인가요?`, ans: { k:'int', v: x }, wrong: [y - c.k, y * c.k, x + 1], ex: `${c.a} = ${c.b} ÷ ${c.k} → ${y} ÷ ${c.k} = ${x}` }; } },
  { id:'cor-formula', name:'대응 관계를 기호를 사용하여 식으로 나타내기', std:'6수02-01', lv:[2,3], t:'mc',
    g(){
      if (Math.random() < .65){ const c = pick(CTX);
        return MC(`${NOTE(c)}${c.a}를 ○, ${c.b}를 △라고 할 때, 두 양 사이의 대응 관계를 바르게 나타낸 식은 어느 것인가요?`, [`○ × ${c.k} = △`, `○ + ${c.k} = △`, `△ × ${c.k} = ○`, `○ ÷ ${c.k} = △`], `${c.b}는 ${c.a}의 ${c.k}배이므로 ○ × ${c.k} = △ (또는 △ ÷ ${c.k} = ○)`); }
      const c = pick(ADD);
      return MC(`${c.s} ${c.a}를 ○, ${c.b}를 △라고 할 때, 대응 관계를 바르게 나타낸 식은 어느 것인가요?`, [`○ + ${c.d} = △`, `○ × ${c.d} = △`, `△ + ${c.d} = ○`, `○ - ${c.d} = △`], `${c.b}는 ${c.a}보다 ${c.d} 크므로 ○ + ${c.d} = △ (또는 △ - ${c.d} = ○)`);
    } },
  { id:'cor-cut', name:'자르는 횟수, 간격 수의 대응 관계 활용하기', std:'6수02-01', lv:[3,5], t:'both',
    g(lv){
      if (lv === 3){ if (Math.random() < .5){ const n = ri(5, 15); return { q: `통나무를 똑같이 ${n}도막으로 자르려고 합니다. 몇 번 잘라야 하나요?`, ans: { k:'int', v: n - 1, unit:'번' }, wrong: [n, n + 1], ex: `자른 횟수 = 도막 수 - 1 = ${n - 1}(번)` }; }
        const k = ri(4, 14); return { q: `리본을 한 번 자를 때마다 도막이 하나씩 늘어납니다. 리본을 ${k}번 자르면 몇 도막이 되나요?`, ans: { k:'int', v: k + 1, unit:'도막' }, wrong: [k, k - 1, k * 2], ex: `도막 수 = 자른 횟수 + 1 = ${k + 1}(도막)` }; }
      const d = pick([2, 3, 4, 5, 6, 8, 10]), n = ri(6, 15), L = d * n;
      if (lv === 4) return { q: `길이가 ${L} m인 곧은 길의 처음부터 끝까지 ${d} m 간격으로 가로등을 세우려고 합니다. 가로등은 모두 몇 개 필요한가요? (길의 처음과 끝에도 세웁니다.)`, ans: { k:'int', v: n + 1, unit:'개' }, wrong: [n, n - 1, n + 2], ex: `간격 수 = ${L} ÷ ${d} = ${n}, 가로등 수 = 간격 수 + 1 = ${n + 1}(개)` };
      return { q: `둘레가 ${L} m인 원 모양 호수 둘레에 ${d} m 간격으로 나무를 심으려고 합니다. 나무는 모두 몇 그루 필요한가요? (나무의 굵기는 생각하지 않습니다.)`, ans: { k:'int', v: n, unit:'그루' }, wrong: [n + 1, n - 1, L * d > 999 ? n + 2 : L * d], ex: `원 모양은 처음과 끝이 만나므로 나무 수 = 간격 수 = ${L} ÷ ${d} = ${n}(그루)` };
    } },
  { id:'cor-life', name:'생활 속 대응 관계로 값 구하기', std:'6수02-01', lv:[3,4], t:'both',
    g(lv){
      const r = pick([
        () => { const v = pick([60, 70, 80, 90]), h = ri(2, 7); return lv === 3 ? { q: `한 시간에 ${v} km를 가는 자동차가 있습니다. 같은 빠르기로 ${h}시간 동안 가면 몇 km를 갈 수 있나요?`, v: v * h, u: 'km', ex: `(거리) = ${v} × (시간) → ${v} × ${h} = ${v * h}(km)` }
          : { q: `한 시간에 ${v} km를 가는 자동차가 같은 빠르기로 ${v * h} km를 갔습니다. 몇 시간 동안 갔나요?`, v: h, u: '시간', ex: `(시간) = (거리) ÷ ${v} → ${v * h} ÷ ${v} = ${h}(시간)` }; },
        () => { const c = ri(2, 5), n = ri(4, 12); return lv === 3 ? { q: `추를 1개 달 때마다 ${c} cm씩 늘어나는 용수철이 있습니다. 추를 ${n}개 달면 용수철은 처음보다 몇 cm 늘어나나요?`, v: c * n, u: 'cm', ex: `${c} × ${n} = ${c * n}(cm)` }
          : { q: `추를 1개 달 때마다 ${c} cm씩 늘어나는 용수철이 처음보다 ${c * n} cm 늘어났습니다. 추를 몇 개 달았나요?`, v: n, u: '개', ex: `${c * n} ÷ ${c} = ${n}(개)` }; },
        () => { const p = pick([2000, 3000, 4000, 5000]), w = ri(4, 12); return lv === 3 ? { q: `매주 ${won(p)}원씩 저금합니다. ${w}주 동안 저금한 돈은 모두 얼마인가요?`, v: p * w, u: '원', ex: `${won(p)} × ${w} = ${won(p * w)}(원)` }
          : { q: `매주 ${won(p)}원씩 저금하여 모은 돈이 ${won(p * w)}원이 되었습니다. 몇 주 동안 저금했나요?`, v: w, u: '주', ex: `${won(p * w)} ÷ ${won(p)} = ${w}(주)` }; }
      ])();
      return { q: r.q, ans: { k:'int', v: r.v, unit: r.u }, ex: r.ex };
    } },
  { id:'cor-machine', name:'규칙을 찾아 대응 관계 추론하기', std:'6수02-01', lv:[3,5], t:'both',
    g(lv){
      const kind = lv === 3 ? pick(['add', 'mul']) : lv === 4 ? pick(['add', 'mul', 'lin']) : 'lin';
      const k = ri(3, 9), b = ri(1, 9), f = x => kind === 'add' ? x + k * 2 : kind === 'mul' ? x * k : x * k + b;
      const xs = sample(range(2, 9), 2).sort((p, q) => p - q), X = ri(10, 20), rev = lv === 5 && Math.random() < .5;
      const t = tableH([['넣은 수(○)', ...xs, rev ? '?' : X], ['나온 수(△)', ...xs.map(f), rev ? f(X) : '?']]);
      const rule = kind === 'add' ? `○ + ${k * 2} = △` : kind === 'mul' ? `○ × ${k} = △` : `○ × ${k} + ${b} = △`;
      return { q: `어떤 상자에 수를 넣으면 일정한 규칙에 따라 수가 나옵니다. ${rev ? '?에 알맞은 넣은 수' : '?에 알맞은 나온 수'}를 구하세요.${t}`, ans: { k:'int', v: rev ? X : f(X) },
        wrong: rev ? [X + 1, X - 1, f(X) - b] : [X * k, X + k, f(X) + k], ex: `규칙: ${rule} → ${X}을(를) 넣으면 ${f(X)}이(가) 나와요.` };
    } },
  { id:'cor-pattern', name:'배열 규칙에서 대응 관계 찾기', std:'6수02-01', lv:[4,5], t:'both',
    g(lv){
      const P = pick([
        { s:'성냥개비로 정삼각형을 한 줄로 이어 만듭니다. (삼각형 1개: 3개, 2개: 5개, 3개: 7개)', a:'삼각형 수', b:'성냥개비 수', f: n => 2 * n + 1, r:'△ = ○ × 2 + 1' },
        { s:'성냥개비로 정사각형을 한 줄로 이어 만듭니다. (사각형 1개: 4개, 2개: 7개, 3개: 10개)', a:'사각형 수', b:'성냥개비 수', f: n => 3 * n + 1, r:'△ = ○ × 3 + 1' },
        { s:'식탁을 한 줄로 이어 붙이고 둘레에 의자를 놓습니다. (식탁 1개: 4개, 2개: 6개, 3개: 8개)', a:'식탁 수', b:'의자 수', f: n => 2 * n + 2, r:'△ = ○ × 2 + 2' },
        { s:'정육각형 모양 타일을 한 줄로 이어 붙입니다. 맞닿은 변을 빼고 둘레의 변을 셉니다. (타일 1개: 6개, 2개: 10개, 3개: 14개)', a:'타일 수', b:'둘레의 변의 수', f: n => 4 * n + 2, r:'△ = ○ × 4 + 2' }
      ]);
      const n = lv === 4 ? ri(8, 12) : ri(15, 30);
      if (lv === 5 && Math.random() < .5){ const y = P.f(n); return { q: `${P.s}<br>${P.b}가 ${y}일 때 ${P.a}는 몇 개인가요?`, ans: { k:'int', v: n, unit:'개' }, wrong: [n + 1, n - 1, Math.round(y / 3)], ex: `대응 관계: ${P.r} → ${P.b}가 ${y}이면 ${P.a}는 ${n}` }; }
      return { q: `${P.s}<br>${P.a}가 ${n}개일 때 ${P.b}는 몇 개인가요?`, ans: { k:'int', v: P.f(n), unit:'개' }, wrong: [P.f(n) - 1, P.f(n) + 1, P.f(1) * n], ex: `대응 관계: ${P.r} → ${P.f(n)}` };
    } },
  { id:'cor-polygon', name:'다각형의 꼭짓점 수와 삼각형 수의 대응 관계', std:'6수02-01', lv:[4,5], t:'both',
    g(lv){ const n = lv === 4 ? ri(7, 12) : ri(13, 20), names = { 7:'칠', 8:'팔', 9:'구', 10:'십', 11:'십일', 12:'십이', 13:'십삼', 14:'십사', 15:'십오', 16:'십육', 17:'십칠', 18:'십팔', 19:'십구', 20:'이십' };
      if (Math.random() < .5) return { q: `다각형의 한 꼭짓점에서 그을 수 있는 대각선을 모두 그어 삼각형으로 나누려고 합니다. ${names[n]}각형은 삼각형 몇 개로 나누어지나요? (사각형 → 2개, 오각형 → 3개, 육각형 → 4개)`, ans: { k:'int', v: n - 2, unit:'개' }, wrong: [n - 3, n - 1, n], ex: `삼각형 수 = 꼭짓점 수 - 2 = ${n} - 2 = ${n - 2}(개)` };
      return { q: `다각형의 한 꼭짓점에서 그을 수 있는 대각선의 수를 알아보려고 합니다. 사각형은 1개, 오각형은 2개, 육각형은 3개입니다. ${names[n]}각형은 몇 개인가요?`, ans: { k:'int', v: n - 3, unit:'개' }, wrong: [n - 2, n - 1, n], ex: `대각선 수 = 꼭짓점 수 - 3 = ${n - 3}(개)` }; } },
  { id:'cor-tape', name:'겹쳐 이어 붙인 색 테이프의 대응 관계', std:'6수02-01', lv:[4,5], t:'both',
    g(lv){ const a = pick([10, 12, 15, 20, 25]), b = pick([2, 3, 4, 5]), n = ri(5, 12), L = a * n - b * (n - 1);
      if (lv === 4) return { q: `길이가 ${a} cm인 색 테이프 ${n}장을 ${b} cm씩 겹쳐서 한 줄로 이어 붙였습니다. 이어 붙인 색 테이프의 전체 길이는 몇 cm인가요?`, ans: { k:'int', v: L, unit:'cm' }, wrong: [a * n - b * n, a * n, a * n - b * (n + 1)], ex: `겹친 부분 = 장수 - 1 = ${n - 1}군데 → ${a} × ${n} - ${b} × ${n - 1} = ${L}(cm)` };
      return { q: `길이가 ${a} cm인 색 테이프를 ${b} cm씩 겹쳐서 한 줄로 이어 붙였더니 전체 길이가 ${L} cm가 되었습니다. 색 테이프를 몇 장 이어 붙였나요?`, ans: { k:'int', v: n, unit:'장' }, wrong: [n + 1, n - 1], ex: `색 테이프 1장을 더할 때마다 ${a - b} cm씩 늘어나요. (${L} - ${a}) ÷ ${a - b} + 1 = ${n}(장)` }; } },
  { id:'cor-wrong', name:'대응 관계를 잘못 설명한 것 찾기', std:'6수02-01', lv:[3,3], t:'mc',
    g(){ const c = pick(CTX);
      return MC(`${NOTE(c)}${c.a}를 ○, ${c.b}를 △라고 할 때, 두 양 사이의 대응 관계를 <b>잘못</b> 설명한 것은 어느 것인가요?`, [`○ + ${c.k} = △`, `○ × ${c.k} = △`, `△ ÷ ${c.k} = ○`, `${c.b}는 ${c.a}의 ${c.k}배입니다.`], `${c.b}는 ${c.a}의 ${c.k}배이므로 덧셈식(○ + ${c.k} = △)은 맞지 않아요.`); } },
  { id:'cor-two', name:'대응 관계를 두 번 이용하여 해결하기', std:'6수02-01', lv:[5,5], t:'both',
    g(){ for (;;){ const c = ri(2, 6), p = pick([10, 12, 15, 20, 24, 30]), n = ri(5, 30); if ((n * c) % p) continue;
        return { q: `쿠키 1개를 만들 때 초콜릿 칩이 ${c}개 필요합니다. 초콜릿 칩은 한 봉지에 ${p}개씩 들어 있습니다. 쿠키 ${n}개를 만들려면 초콜릿 칩은 몇 봉지 필요한가요?`, ans: { k:'int', v: n * c / p, unit:'봉지' }, wrong: [n * c, n / c | 0, n * c / p + 1], ex: `필요한 칩: ${n} × ${c} = ${n * c}(개) → 봉지: ${n * c} ÷ ${p} = ${n * c / p}(봉지)` }; } } }
]});

/* ─────────────── 4. 약분과 통분 ─────────────── */
const DEN = [2,3,4,5,6,7,8,9,10,11,12,14,15,16,18,20];
const redFrac = (maxD = 12) => { for (;;){ const d = ri(2, maxD), n = ri(1, d - 1); if (gcd(n, d) === 1) return [n, d]; } };
A.addUnit({ key:'5-1-4', title:'약분과 통분', items:[
  { id:'eq-frac', name:'크기가 같은 분수 만들기', std:'6수01-06', lv:[1,1], t:'both',
    g(){ const [n, d] = redFrac(9), k = ri(2, 7);
      if (Math.random() < .5) return { q: `□ 안에 알맞은 수를 구하세요.${E(`${fr(n, d)} = ${fr('□', d * k)}`)}`, ans: { k:'int', v: n * k }, wrong: [n + k, n * k + 1, d * k - n], ex: `분모에 ${k}를 곱했으므로 분자에도 ${k}를 곱해요: ${n} × ${k} = ${n * k}` };
      return { q: `□ 안에 알맞은 수를 구하세요.${E(`${fr(n * k, d * k)} = ${fr('□', d)}`)}`, ans: { k:'int', v: n }, wrong: [n * k - k, n + 1, n * k / gcd(n * k, d) | 0].filter(x => x > 0), ex: `분모를 ${k}로 나누었으므로 분자도 ${k}로 나눠요: ${n * k} ÷ ${k} = ${n}` }; } },
  { id:'reduce', name:'기약분수로 나타내기', std:'6수01-06', lv:[1,2], t:'both',
    g(lv){ const [n, d] = redFrac(lv === 1 ? 9 : 15), k = ri(2, lv === 1 ? 5 : 9);
      return { q: `${fr(n * k, d * k)}을(를) 기약분수로 나타내세요.`, ans: { k:'frac', v: F(n, d) }, wrong: [F(n, d * k), F(n * k, d), F(n + 1, d)], ex: `분모와 분자를 최대공약수 ${k}(으)로 나누면 ${fr(n, d)}` }; } },
  { id:'red-cannot', name:'약분할 때 나눌 수 없는 수 찾기', std:'6수01-06', lv:[2,2], t:'mc',
    g(){ for (;;){ const g = pick([6, 8, 10, 12, 18, 20, 24]), [n, d] = redFrac(7); const N = n * g, D = d * g; if (D > 99) continue;
        const cd = divisors(g).filter(x => x > 1), bad = pick(range(2, 12).filter(x => N % x || D % x)); if (cd.length < 3) continue;
        return MC(`${fr(N, D)}을(를) 약분하려고 합니다. 분모와 분자를 나눌 수 <b>없는</b> 수는 어느 것인가요?`, [bad, ...sample(cd, 3)].map(String), `분모와 분자의 공약수(1 제외) ${cd.join(', ')}(으)로만 나눌 수 있어요.`); } } },
  { id:'irred-pick', name:'기약분수 찾기', std:'6수01-06', lv:[2,2], t:'mc',
    g(){ const [n, d] = redFrac(15), others = [];
      while (others.length < 3){ const [a, b] = redFrac(9), k = ri(2, 4); const s = fr(a * k, b * k); if (!others.includes(s)) others.push(s); }
      return MC('기약분수는 어느 것인가요?', [fr(n, d), ...others], `분모와 분자의 공약수가 1뿐인 분수가 기약분수예요. ${fr(n, d)}는 더 이상 약분할 수 없어요.`); } },
  { id:'common-den', name:'두 분모의 최소공배수로 통분하기', std:'6수01-06', lv:[2,3], t:'both',
    g(lv){ for (;;){ const [a, b] = redFrac(12), [c, d] = redFrac(12); if (b === d) continue; const L = lcm(b, d); if (L === b * d && lv === 3) continue; if (L > 60) continue;
        if (lv === 2) return { q: `${fr(a, b)}와(과) ${fr(c, d)}를 두 분모의 최소공배수를 공통분모로 하여 통분하려고 합니다. 공통분모를 구하세요.`, ans: { k:'int', v: L }, wrong: [b * d === L ? L * 2 : b * d, b + d, Math.max(b, d)], ex: `${b}와(과) ${d}의 최소공배수: ${L}` };
        return { q: `두 분수를 분모의 최소공배수를 공통분모로 하여 통분하였습니다. □ 안에 알맞은 수를 구하세요.${E(`(${fr(a, b)}, ${fr(c, d)}) → (${fr('□', L)}, ${fr(c * L / d, L)})`)}`, ans: { k:'int', v: a * L / b }, wrong: [a * d, a + L / b, a * L / d].filter(Number.isInteger), ex: `${L} ÷ ${b} = ${L / b}이므로 ${a} × ${L / b} = ${a * L / b}` }; } } },
  { id:'cmp2', name:'분모가 다른 두 분수의 크기 비교하기', std:'6수01-07', lv:[2,3], t:'mc',
    g(lv){ for (;;){ const [a, b] = redFrac(lv === 2 ? 10 : 16), [c, d] = redFrac(lv === 2 ? 10 : 16); if (b === d) continue; const x = F(a, b), y = F(c, d);
        if (lv === 3 && Math.abs(x.v - y.v) > .15) continue;
        const s = x.cmp(y) > 0 ? '>' : x.cmp(y) < 0 ? '<' : '=';
        const L = lcm(b, d);
        return MC(`두 분수의 크기를 비교하여 ○ 안에 알맞은 것을 고르세요.${E(`${fr(a, b)} ○ ${fr(c, d)}`)}`, [s, ...['>', '<', '='].filter(z => z !== s)], `통분하면 ${fr(a * L / b, L)} ${s} ${fr(c * L / d, L)}`); } } },
  { id:'cmp3', name:'세 분수 중 가장 큰(작은) 분수 찾기', std:'6수01-07', lv:[3,4], t:'mc',
    g(lv){ for (;;){ const fs = []; while (fs.length < (lv === 3 ? 3 : 4)){ const [a, b] = redFrac(12); if (!fs.some(f => f[1] === b || F(f[0], f[1]).eq(F(a, b)))) fs.push([a, b]); }
        const big = Math.random() < .5, sorted = fs.slice().sort((p, q) => F(p[0], p[1]).cmp(F(q[0], q[1])));
        const ans = big ? sorted[sorted.length - 1] : sorted[0];
        if (Math.abs(F(sorted[1][0], sorted[1][1]).v - F(ans[0], ans[1]).v) < .02) continue;
        return MC(`가장 ${big ? '큰' : '작은'} 분수는 어느 것인가요?`, [fr(...ans), ...fs.filter(f => f !== ans).map(f => fr(...f))], `통분하여 비교하면 ${sorted.map(f => fr(...f)).join(' &lt; ')}`); } } },
  { id:'frac-dec', name:'분수를 소수로 나타내기', std:'6수01-12', lv:[2,3], t:'both',
    g(lv){ const d = pick(lv === 2 ? [2, 4, 5, 10] : [4, 5, 8, 20, 25, 50]), n = pick(range(1, d - 1).filter(x => gcd(x, d) === 1)), w = lv === 3 && Math.random() < .4 ? ri(1, 3) : 0;
      const v = dz(w + n / d); return { q: `${w ? fr(n, d, w) : fr(n, d)}을(를) 소수로 나타내세요.`, ans: { k:'dec', v }, wrong: [dz(n / 10), dz(w + n / 100), dz(v * 10)], ex: (() => { const m = [10, 100, 1000].find(z => z % d === 0); return `분모를 ${m}(으)로 만들면 ${fr(n * m / d, m)} = ${dz(n / d)}${w ? ` → ${w} + ${dz(n / d)} = ${v}` : ''}`; })() }; } },
  { id:'frac-dec-cmp', name:'분수와 소수의 크기 비교하기', std:'6수01-12', lv:[3,3], t:'mc',
    g(){ for (;;){ const d = pick([4, 5, 8, 20, 25]), n = ri(1, d - 1), x = n / d, y = dz(Math.round((x + pick([-.08, -.05, -.03, .03, .05, .08])) * 100) / 100); if (y <= 0 || y >= 1 || y === dz(x)) continue;
        const s = x > y ? '>' : '<';
        return MC(`두 수의 크기를 비교하여 ○ 안에 알맞은 것을 고르세요.${E(`${fr(n, d)} ○ ${y}`)}`, [s, ...['>', '<', '='].filter(z => z !== s)], `${fr(n, d)} = ${dz(x)}이므로 ${dz(x)} ${s} ${y}`); } } },
  { id:'ratio-life', name:'생활 속 양을 기약분수로 나타내기', std:'6수01-06', lv:[3,3], t:'both',
    g(){ const C = pick([
        () => { const h = pick([3, 4, 6, 8, 9, 10, 12, 15, 16, 18, 20]); return [`하루는 24시간입니다. 하루 중 ${h}시간은 하루의 몇 분의 몇인가요? (기약분수)`, h, 24]; },
        () => { const m = pick([5, 10, 12, 15, 20, 24, 25, 30, 36, 40, 45, 48, 50]); return [`1시간은 60분입니다. ${m}분은 1시간의 몇 분의 몇인가요? (기약분수)`, m, 60]; },
        () => { const c = pick([4, 8, 12, 15, 25, 35, 45, 60, 75, 80]); return [`1 m는 100 cm입니다. ${c} cm는 1 m의 몇 분의 몇인가요? (기약분수)`, c, 100]; },
        () => { const n = pick([20, 24, 25, 28, 30, 32]), k = pick(range(2, n - 2).filter(x => gcd(x, n) > 1)); return [`우리 반 학생 ${n}명 중 ${k}명이 안경을 썼습니다. 안경을 쓴 학생은 반 전체의 몇 분의 몇인가요? (기약분수)`, k, n]; }
      ])(); return { q: C[0], ans: { k:'frac', v: F(C[1], C[2]) }, wrong: [F(C[1] + 1, C[2]), F(C[2] - C[1], C[2])], ex: `${fr(C[1], C[2])} = ${frH(F(C[1], C[2]))}` }; } },
  { id:'cd-count', name:'공통분모가 될 수 있는 수 찾기', std:'6수01-06', lv:[3,4], t:'both',
    g(){ for (;;){ const b = ri(3, 12), d = ri(3, 16); if (b === d) continue; const L = lcm(b, d); if (L > 48 || L < 10) continue; const v = Math.floor(99 / L);
        return { q: `${fr(1, b)}와(과) ${fr(1, d)}를 통분할 때, 공통분모가 될 수 있는 수 중에서 100보다 작은 수는 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [v + 1, v - 1, Math.floor(99 / (b * d))].filter(x => x !== v), ex: `공통분모는 ${b}와(과) ${d}의 공배수 = 최소공배수 ${L}의 배수: ${range(1, v).map(i => i * L).join(', ')} → ${v}개` }; } } },
  { id:'eq-cond', name:'조건에 맞는 크기가 같은 분수 찾기', std:'6수01-06', lv:[4,4], t:'both',
    g(){ const [n, d] = redFrac(9), k = ri(3, 9);
      if (Math.random() < .5) return { q: `${fr(n, d)}와(과) 크기가 같은 분수 중에서 분모와 분자의 합이 ${(n + d) * k}인 분수가 있습니다. 이 분수의 분모를 구하세요.`, ans: { k:'int', v: d * k }, wrong: [n * k, d * k + 1, (n + d) * k - n], ex: `${fr(n * k, d * k)}: 분자 + 분모 = ${n * k} + ${d * k} = ${(n + d) * k}` };
      return { q: `${fr(n, d)}와(과) 크기가 같은 분수 중에서 분모와 분자의 차가 ${(d - n) * k}인 분수가 있습니다. 이 분수의 분자를 구하세요.`, ans: { k:'int', v: n * k }, wrong: [d * k, n * k + k, (d - n) * k], ex: `${fr(n * k, d * k)}: ${d * k} - ${n * k} = ${(d - n) * k}` }; } },
  { id:'irred-count', name:'분모가 같은 기약분수의 개수 구하기', std:'6수01-06', lv:[4,5], t:'both',
    g(){ const n = pick([8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24]), v = range(1, n - 1).filter(x => gcd(x, n) === 1).length;
      return { q: `분모가 ${n}인 진분수 중에서 기약분수는 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [n - 1, v + 1, v - 1], ex: `분자가 ${n}과(와) 공약수가 1뿐인 수: ${range(1, n - 1).filter(x => gcd(x, n) === 1).join(', ')} → ${v}개` }; } },
  { id:'between', name:'두 분수 사이에 있는 기약분수의 개수 구하기', std:'6수01-07', lv:[5,5], t:'both',
    g(){ for (;;){ const m = pick([12, 15, 18, 20, 24, 30, 36, 40]), [a, b] = redFrac(8), [c, d] = redFrac(8); const x = F(a, b), y = F(c, d); if (x.cmp(y) >= 0) continue;
        const sol = range(1, m - 1).filter(k => gcd(k, m) === 1 && F(k, m).cmp(x) > 0 && F(k, m).cmp(y) < 0); if (sol.length < 1 || sol.length > 5) continue;
        return { q: `${fr(a, b)}보다 크고 ${fr(c, d)}보다 작은 분수 중에서 분모가 ${m}인 기약분수는 모두 몇 개인가요?`, ans: { k:'int', v: sol.length, unit:'개' }, wrong: [sol.length + 1, sol.length - 1, range(1, m - 1).filter(k => F(k, m).cmp(x) > 0 && F(k, m).cmp(y) < 0).length].filter(z => z !== sol.length && z >= 0), ex: `${sol.map(k => fr(k, m)).join(', ')} → ${sol.length}개` }; } } },
  { id:'box-dec', name:'분수와 소수의 크기 비교로 □ 안의 수 구하기', std:'6수01-12', lv:[5,5], t:'both',
    g(){ for (;;){ const n = pick([4, 5, 8, 20, 25]), x = dz(ri(15, 85) / 100); const sol = range(1, n - 1).filter(k => k / n < x); if (!sol.length || sol.length === n - 1 || dz(sol.length / n) === x) continue;
        return { q: `□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?${E(`${fr('□', n)} &lt; ${x}`)}`, ans: { k:'int', v: sol.length, unit:'개' }, wrong: [sol.length + 1, sol.length - 1, Math.floor(x * 10)].filter(z => z !== sol.length && z >= 0), ex: `${sol.map(k => `${fr(k, n)} = ${dz(k / n)}`).join(', ')}이(가) ${x}보다 작아요 → ${sol.length}개` }; } } },
  { id:'life-cmp', name:'분수와 소수로 나타낸 양 비교하기', std:'6수01-12', lv:[4,4], t:'mc',
    g(){ for (;;){ const who = sample(NAMES, 3), d = pick([4, 5, 8, 20, 25]), n = ri(1, d - 1), x = n / d, ys = [dz(Math.round((x + .07) * 100) / 100), dz(Math.round((x - .06) * 100) / 100)]; if (ys.some(y => y <= 0 || y >= 1)) continue;
        const vals = [x, ...ys], disp = [fr(n, d) + ' L', ys[0] + ' L', ys[1] + ' L'], order = shuffle([0, 1, 2]), big = Math.random() < .5;
        const target = big ? 1 : 2;   // ys[0]이 가장 크고 ys[1]이 가장 작아요
        return MC(`${order.map(i => `${who[i]}는 물을 ${disp[i]}`).join(', ')} 마셨습니다. 물을 가장 ${big ? '많이' : '적게'} 마신 사람은 누구인가요?`, [who[target], ...who.filter((_, i) => i !== target)], `${fr(n, d)} = ${dz(x)}이므로 ${big ? `${ys[0]} > ${dz(x)} > ${ys[1]}` : `${ys[1]} < ${dz(x)} < ${ys[0]}`}`); } } }
]});

/* ─────────────── 5. 분수의 덧셈과 뺄셈 ─────────────── */
const twoDen = (maxL = 60) => { for (;;){ const b = ri(2, 12), d = ri(2, 12); if (b !== d && lcm(b, d) <= maxL) return [b, d]; } };
const pf = d => pick(range(1, d - 1).filter(n => gcd(n, d) === 1));
const fsh = (x) => frH(x);
const steps2 = (x, y, op) => { const L = lcm(x.d, y.d); return `통분하면 ${fr(x.n * L / x.d, L)} ${op} ${fr(y.n * L / y.d, L)}`; };
const mixedF = (w, n, d) => M(w, n, d);
A.addUnit({ key:'5-1-5', title:'분수의 덧셈과 뺄셈', items:[
  { id:'add-pp', name:'(진분수) + (진분수) 계산하기', std:'6수01-08', lv:[1,2], t:'both',
    g(lv){ for (;;){ const [b, d] = twoDen(lv === 1 ? 30 : 48), x = F(pf(b), b), y = F(pf(d), d), s = x.add(y); if (lv === 1 ? s.v >= 1 : s.v <= 1) continue;
        return { q: `계산해 보세요.${E(`${frH(x)} + ${frH(y)}`)}`, ans: { k:'frac', v: s }, wrong: [F(x.n + y.n, x.d + y.d), F(x.n + y.n, lcm(x.d, y.d)), s.add(F(1, lcm(x.d, y.d)))], ex: `${steps2(x, y, '+')} = ${frH(s)}` }; } } },
  { id:'sub-pp', name:'(진분수) - (진분수) 계산하기', std:'6수01-08', lv:[1,2], t:'both',
    g(lv){ for (;;){ const [b, d] = twoDen(lv === 1 ? 30 : 60), x = F(pf(b), b), y = F(pf(d), d); if (x.cmp(y) <= 0) continue; const s = x.sub(y);
        const w = x.n - y.n > 0 && x.d !== y.d ? [F(x.n - y.n, Math.abs(x.d - y.d) || 1)] : [];
        return { q: `계산해 보세요.${E(`${frH(x)} - ${frH(y)}`)}`, ans: { k:'frac', v: s }, wrong: [...w, s.add(F(1, lcm(x.d, y.d)))], ex: `${steps2(x, y, '-')} = ${frH(s)}` }; } } },
  { id:'add-mm', name:'(대분수) + (대분수) 계산하기', std:'6수01-08', lv:[2,3], t:'both',
    g(lv){ for (;;){ const [b, d] = twoDen(48), x = M(ri(1, 4), pf(b), b), y = M(ri(1, 4), pf(d), d), s = x.add(y);
        const carry = (x.n % x.d) / x.d + (y.n % y.d) / y.d >= 1; if (lv === 2 ? carry : !carry) continue;
        const wx = Math.floor(x.v), wy = Math.floor(y.v), fx = x.sub(wx), fy = y.sub(wy);
        return { q: `계산해 보세요.${E(`${frH(x)} + ${frH(y)}`)}`, ans: { k:'frac', v: s }, wrong: [F(fx.n + fy.n, fx.d + fy.d).add(wx + wy), s.sub(1), s.add(1)], ex: `자연수끼리 ${wx} + ${wy} = ${wx + wy}, 분수끼리 ${frH(fx)} + ${frH(fy)} = ${frH(fx.add(fy))} → ${frH(s)}` }; } } },
  { id:'sub-mm', name:'(대분수) - (대분수) 계산하기 (받아내림 없음)', std:'6수01-08', lv:[3,3], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(48), x = M(ri(3, 7), pf(b), b), y = M(ri(1, 2), pf(d), d); const fx = x.sub(Math.floor(x.v)), fy = y.sub(Math.floor(y.v)); if (fx.cmp(fy) <= 0) continue; const s = x.sub(y);
        return { q: `계산해 보세요.${E(`${frH(x)} - ${frH(y)}`)}`, ans: { k:'frac', v: s }, wrong: [s.add(1), s.sub(1), F(fx.n - fy.n > 0 ? fx.n - fy.n : 1, Math.abs(fx.d - fy.d) || 2).add(Math.floor(s.v))], ex: `자연수끼리 ${Math.floor(x.v)} - ${Math.floor(y.v)}, 분수끼리 ${frH(fx)} - ${frH(fy)} = ${frH(fx.sub(fy))} → ${frH(s)}` }; } } },
  { id:'sub-borrow', name:'(대분수) - (대분수) 계산하기 (받아내림 있음)', std:'6수01-08', lv:[3,4], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(48), x = M(ri(3, 7), pf(b), b), y = M(ri(1, 2), pf(d), d); const wx = Math.floor(x.v), wy = Math.floor(y.v), fx = x.sub(wx), fy = y.sub(wy); if (fx.cmp(fy) >= 0) continue; const s = x.sub(y);
        return { q: `계산해 보세요.${E(`${frH(x)} - ${frH(y)}`)}`, ans: { k:'frac', v: s }, wrong: [fy.sub(fx).add(wx - wy), s.add(1), fy.sub(fx).add(wx - wy - 1)].filter(z => z.n > 0), ex: `분수 부분 ${frH(fx)}이(가) ${frH(fy)}보다 작으므로 자연수 1을 받아내려요. → ${frH(s)}` }; } } },
  { id:'word1', name:'분수의 덧셈과 뺄셈 문장제 해결하기', std:'6수01-08', lv:[3,3], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(40), x = Math.random() < .5 ? F(pf(b), b) : M(ri(1, 3), pf(b), b), y = Math.random() < .5 ? F(pf(d), d) : M(ri(1, 2), pf(d), d);
        const S = pick([
          { op:'+', q:`물을 오전에 ${frH(x)} L, 오후에 ${frH(y)} L 마셨습니다. 오늘 마신 물은 모두 몇 L인가요?`, u:'L' },
          { op:'+', q:`빨간 끈 ${frH(x)} m와 파란 끈 ${frH(y)} m를 겹치지 않게 이었습니다. 이은 끈의 길이는 몇 m인가요?`, u:'m' },
          { op:'-', q:`밀가루 ${frH(x)} kg 중에서 ${frH(y)} kg을 빵을 만드는 데 사용했습니다. 남은 밀가루는 몇 kg인가요?`, u:'kg' },
          { op:'-', q:`고구마는 ${frH(x)} kg, 감자는 ${frH(y)} kg 캤습니다. 고구마를 감자보다 몇 kg 더 많이 캤나요?`, u:'kg' }
        ]);
        if (S.op === '-' && x.cmp(y) <= 0) continue;
        const v = S.op === '+' ? x.add(y) : x.sub(y);
        return { q: S.q, ans: { k:'frac', v, unit: S.u }, wrong: [S.op === '+' ? x.sub(y).n > 0 ? x.sub(y) : v.add(1) : x.add(y), v.add(F(1, v.d))], ex: `${frH(x)} ${S.op} ${frH(y)} = ${frH(v)}(${S.u})` }; } } },
  { id:'word2', name:'여러 단계의 분수 문장제 해결하기', std:'6수01-08', lv:[4,4], t:'both',
    g(){ for (;;){ const ds = [ri(2, 9), ri(2, 9), ri(2, 9)]; if (new Set(ds).size < 2 || ds.reduce((a, c) => lcm(a, c)) > 72) continue;
        const a = M(ri(2, 4), pf(ds[0]), ds[0]), b = M(1, pf(ds[1]), ds[1]), c = F(pf(ds[2]), ds[2]);
        if (Math.random() < .5){ const v = a.sub(b).add(c); if (v.n <= 0 || a.cmp(b) <= 0) continue;
          return { q: `바구니에 사과가 ${frH(a)} kg 있었습니다. 그중 ${frH(b)} kg을 먹고, ${frH(c)} kg을 더 사 왔습니다. 지금 바구니에 있는 사과는 몇 kg인가요?`, ans: { k:'frac', v, unit:'kg' }, wrong: [a.sub(b).sub(c).n > 0 ? a.sub(b).sub(c) : v.add(1), a.add(b).add(c)], ex: `${frH(a)} - ${frH(b)} + ${frH(c)} = ${frH(v)}(kg)` }; }
        const p1 = [F(pf(ds[0]), ds[0]), F(pf(ds[1]), ds[1])], p2 = [F(pf(ds[2]), ds[2]), F(pf(ds[0] + 1 > 12 ? 3 : ds[0] + 1), ds[0] + 1 > 12 ? 3 : ds[0] + 1)];
        const s1 = p1[0].add(p1[1]), s2 = p2[0].add(p2[1]); if (s1.eq(s2)) continue; const diff = s1.cmp(s2) > 0 ? s1.sub(s2) : s2.sub(s1);
        return { q: `집에서 학교까지 가는 길이 두 가지 있습니다. 공원을 지나가면 ${frH(p1[0])} km와 ${frH(p1[1])} km를 걷고, 도서관을 지나가면 ${frH(p2[0])} km와 ${frH(p2[1])} km를 걷습니다. 더 가까운 길은 다른 길보다 몇 km 더 가까운가요?`, ans: { k:'frac', v: diff, unit:'km' }, wrong: [s1, s2, diff.add(F(1, diff.d))], ex: `공원: ${frH(s1)} km, 도서관: ${frH(s2)} km → 차: ${frH(diff)} km` }; } } },
  { id:'gt1', name:'계산 결과가 1보다 큰 식 찾기', std:'6수01-08', lv:[3,4], t:'mc',
    g(){ for (;;){ const exps = []; let big = null;
        for (let i = 0; i < 40 && exps.length < 4; i++){ const [b, d] = twoDen(40), x = F(pf(b), b), y = F(pf(d), d); if (exps.some(e => e[0].eq(x) && e[1].eq(y))) continue; exps.push([x, y, x.add(y)]); } if (exps.length < 4) continue;
        const g1 = exps.filter(e => e[2].v > 1); if (g1.length !== 1 || exps.some(e => Math.abs(e[2].v - 1) < 1e-9)) continue; big = g1[0];
        return MC('계산 결과가 1보다 큰 것은 어느 것인가요?', [big, ...exps.filter(e => e !== big)].map(e => `${frH(e[0])} + ${frH(e[1])}`), `${exps.map(e => `${frH(e[0])} + ${frH(e[1])} = ${frH(e[2])}`).join(', ')}`); } } },
  { id:'maxmin', name:'가장 큰 분수와 가장 작은 분수의 합(차) 구하기', std:'6수01-08', lv:[4,4], t:'both',
    g(){ for (;;){ const fs = []; while (fs.length < 3){ const d = ri(3, 12), n = pf(d), f = F(n, d); if (!fs.some(g => g.eq(f) || g.d === d)) fs.push(f); }
        const s = fs.slice().sort((p, q) => p.cmp(q)), add = Math.random() < .5, v = add ? s[2].add(s[0]) : s[2].sub(s[0]); if (lcm(lcm(fs[0].d, fs[1].d), fs[2].d) > 120) continue;
        return { q: `세 분수 중에서 가장 큰 수와 가장 작은 수의 ${add ? '합을' : '차를'} 구하세요.<div class="expr">${fs.map(frH).join('　 ')}</div>`, ans: { k:'frac', v }, wrong: [add ? s[2].add(s[1]) : s[2].sub(s[1]), add ? s[1].add(s[0]) : s[1].sub(s[0])].filter(z => z.n > 0), ex: `가장 큰 수 ${frH(s[2])}, 가장 작은 수 ${frH(s[0])} → ${frH(v)}` }; } } },
  { id:'missing', name:'□ 안에 알맞은 분수 구하기', std:'6수01-08', lv:[4,4], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(48), x = M(ri(1, 3), pf(b), b), y = M(ri(3, 6), pf(d), d); if (y.cmp(x) <= 0) continue; const v = y.sub(x);
        if (Math.random() < .5) return { q: `□ 안에 알맞은 분수를 구하세요.${E(`${frH(x)} + □ = ${frH(y)}`)}`, ans: { k:'frac', v }, wrong: [x.add(y), v.add(1)], ex: `□ = ${frH(y)} - ${frH(x)} = ${frH(v)}` };
        return { q: `□ 안에 알맞은 분수를 구하세요.${E(`${frH(y)} - □ = ${frH(x)}`)}`, ans: { k:'frac', v }, wrong: [x.add(y), v.sub(F(1, 2)).n > 0 ? v.sub(F(1, 2)) : v.add(2)], ex: `□ = ${frH(y)} - ${frH(x)} = ${frH(v)}` }; } } },
  { id:'wrong-op', name:'잘못 계산한 어떤 수 문제 해결하기', std:'6수01-08', lv:[5,5], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(40), k = M(ri(1, 2), pf(b), b), x = M(ri(3, 6), pf(d), d); const wrongRes = x.add(k), right = x.sub(k); if (right.n <= 0) continue;
        return { q: `어떤 수에서 ${frH(k)}을(를) 빼야 할 것을 잘못하여 더했더니 ${frH(wrongRes)}이(가) 되었습니다. 바르게 계산한 값을 구하세요.`, ans: { k:'frac', v: right }, wrong: [x, wrongRes.sub(k).n > 0 ? wrongRes.add(k) : x.add(1)], ex: `어떤 수 = ${frH(wrongRes)} - ${frH(k)} = ${frH(x)}, 바른 계산: ${frH(x)} - ${frH(k)} = ${frH(right)}` }; } } },
  { id:'ineq', name:'분수의 계산 결과로 □ 안에 들어갈 자연수 구하기', std:'6수01-08', lv:[5,5], t:'both',
    g(){ for (;;){ const [b, d] = twoDen(40), x = F(pf(b), b), y = F(pf(d), d), L = lcm(b, d), s = x.add(y); const num = s.n * L / s.d; if (!Number.isInteger(num) || num < 3) continue;
        return { q: `□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수를 구하세요.${E(`${frH(x)} + ${frH(y)} &gt; ${fr('□', L)}`)}`, ans: { k:'int', v: num - 1 }, wrong: [num, num + 1, num - 2], ex: `${frH(x)} + ${frH(y)} = ${fr(num, L)}이므로 □ &lt; ${num} → 가장 큰 자연수는 ${num - 1}` }; } } },
  { id:'cards', name:'수 카드로 만든 대분수의 합(차) 구하기', std:'6수01-08', lv:[5,5], t:'both',
    g(){ const c = sample(range(2, 9), 3).sort((a, b) => a - b), big = M(c[2], c[0], c[1]), small = M(c[0], c[1], c[2]), add = Math.random() < .5, v = add ? big.add(small) : big.sub(small);
      return { q: `수 카드 ${c.map(x => `<span class="card">${x}</span>`).join(' ')}을 한 번씩 모두 사용하여 대분수를 만들려고 합니다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 ${add ? '합을' : '차를'} 구하세요.`, ans: { k:'frac', v },
        wrong: [add ? big.sub(small) : big.add(small), add ? M(c[2], c[1], c[0] + 10).add(small) : big.sub(M(c[0], c[1], c[2] + 1))].filter(z => z.n > 0), ex: `가장 큰 대분수 ${frH(big)}, 가장 작은 대분수 ${frH(small)} → ${frH(v)}` }; } }
]});

/* ─────────────── 6. 다각형의 둘레와 넓이 ─────────────── */
const POLY_N = { 3:'정삼각형', 4:'정사각형', 5:'정오각형', 6:'정육각형', 7:'정칠각형', 8:'정팔각형', 9:'정구각형', 10:'정십각형' };
const box = (pts, extra) => fitPts(pts.concat(extra || []), 40, 26, 250, 130);
function rectFig(w, h, lw, lh){ const p = box([[0, 0], [w, 0], [w, h], [0, h]]); return svg(330, 190, polyFig(p, { e: { 0: lw, 1: lh } }) + rightMark(p[3], p[0], p[2])); }
function paraFig(b, h, s, lb, lh, ls){
  const all = box([[s, 0], [s + b, 0], [b, h], [0, h]], [[s, h]]), p = all.slice(0, 4), foot = all[4];
  if (lh === null) return svg(330, 190, polyFig(p, { e: Object.assign({ 2: lb }, ls ? { 1: ls } : {}) }));
  return svg(330, 190, polyFig(p, { e: Object.assign({ 2: lb }, ls ? { 1: ls } : {}), extra: [line(p[0][0], p[0][1], foot[0], foot[1], { dash: '5 4', stroke: '#E5546B' }), rightMark(foot, p[0], p[3], 8)] }) + txt(p[0][0] + 14, (p[0][1] + foot[1]) / 2, lh, { size: 14, fill: '#E5546B', anchor: 'start', bold: true }));
}
function triFig(b, h, s, lb, lh){
  const all = box([[s, 0], [b, h], [0, h]], [[s, h]]), p = all.slice(0, 3), foot = all[3];
  return svg(330, 190, polyFig(p, { e: { 1: lb }, extra: [line(p[0][0], p[0][1], foot[0], foot[1], { dash: '5 4', stroke: '#E5546B' }), rightMark(foot, p[0], p[1], 8)] }) + txt(foot[0] + 8, (p[0][1] + foot[1]) / 2, lh, { size: 14, fill: '#E5546B', anchor: 'start', bold: true }));
}
function trapFig(a, b, h, s, la, lb, lh){
  const all = box([[s, 0], [s + a, 0], [b, h], [0, h]], [[s, h]]), p = all.slice(0, 4), foot = all[4];
  return svg(330, 190, polyFig(p, { e: { 0: la, 2: lb }, extra: [line(p[0][0], p[0][1], foot[0], foot[1], { dash: '5 4', stroke: '#E5546B' }), rightMark(foot, p[0], p[3], 8)] }) + txt(p[0][0] + 10, (p[0][1] + foot[1]) / 2 + 6, lh, { size: 14, fill: '#E5546B', anchor: 'start', bold: true }));
}
function rhombFig(p1, q1, lp, lq){
  const p = box([[q1 / 2, 0], [q1, p1 / 2], [q1 / 2, p1], [0, p1 / 2]]);
  return svg(330, 190, polyFig(p, { extra: [line(p[0][0], p[0][1], p[2][0], p[2][1], { dash: '5 4', stroke: '#E5546B' }), line(p[1][0], p[1][1], p[3][0], p[3][1], { dash: '5 4', stroke: '#E5546B' })] })
    + txt(p[0][0] + 22, (p[0][1] + p[2][1]) / 2 - 28, lp, { size: 14, fill: '#E5546B', bold: true }) + txt((p[1][0] + p[3][0]) / 2 + 40, p[1][1] + 14, lq, { size: 14, fill: '#E5546B', bold: true }));
}
A.addUnit({ key:'5-1-6', title:'다각형의 둘레와 넓이', items:[
  { id:'reg-peri', name:'정다각형의 둘레 구하기', std:'6수03-11', lv:[1,1], t:'both',
    g(){ const n = ri(3, 10), s = ri(3, 15); return { q: `한 변의 길이가 ${s} cm인 ${POLY_N[n]}의 둘레는 몇 cm인가요?`, ans: { k:'int', v: s * n, unit:'cm' }, wrong: [s * (n - 1), s + n, s * (n + 1)], ex: `(한 변) × (변의 수) = ${s} × ${n} = ${s * n}(cm)` }; } },
  { id:'quad-peri', name:'직사각형, 평행사변형, 마름모의 둘레 구하기', std:'6수03-11', lv:[1,2], t:'both',
    g(lv){
      const k = pick(['rect', 'para', 'rhomb']);
      if (k === 'rect'){ const w = ri(5, 16), h = ri(3, w - 1); return { q: '직사각형의 둘레는 몇 cm인가요?', fig: rectFig(w, h, `${w} cm`, `${h} cm`), ans: { k:'int', v: 2 * (w + h), unit:'cm' }, wrong: [w + h, w * h, 2 * w + h], ex: `(가로 + 세로) × 2 = (${w} + ${h}) × 2 = ${2 * (w + h)}(cm)` }; }
      if (k === 'para'){ const b = ri(6, 14), s = ri(4, 10), h = s - 1; return { q: '평행사변형의 둘레는 몇 cm인가요?', fig: paraFig(b, h, Math.sqrt(s * s - h * h), `${b} cm`, null, `${s} cm`), ans: { k:'int', v: 2 * (b + s), unit:'cm' }, wrong: [b + s, b * s, 2 * b + s], ex: `(이웃한 두 변의 합) × 2 = (${b} + ${s}) × 2 = ${2 * (b + s)}(cm)` }; }
      const s = ri(4, 15); return { q: `한 변의 길이가 ${s} cm인 마름모의 둘레는 몇 cm인가요?`, ans: { k:'int', v: 4 * s, unit:'cm' }, wrong: [2 * s, s * s, 3 * s], ex: `마름모는 네 변의 길이가 같아요: ${s} × 4 = ${4 * s}(cm)` };
    } },
  { id:'rect-area', name:'직사각형과 정사각형의 넓이 구하기', std:'6수03-13', lv:[1,2], t:'both',
    g(lv){ if (Math.random() < .35){ const s = ri(4, 15); return { q: `한 변의 길이가 ${s} cm인 정사각형의 넓이는 몇 cm²인가요?`, ans: { k:'int', v: s * s, unit:'cm²' }, wrong: [4 * s, 2 * s, s * s + s], ex: `${s} × ${s} = ${s * s}(cm²)` }; }
      const w = ri(5, lv === 1 ? 12 : 25), h = ri(3, Math.min(w - 1, 18)); return { q: '직사각형의 넓이는 몇 cm²인가요?', fig: rectFig(w, h, `${w} cm`, `${h} cm`), ans: { k:'int', v: w * h, unit:'cm²' }, wrong: [2 * (w + h), w + h, w * h + w], ex: `(가로) × (세로) = ${w} × ${h} = ${w * h}(cm²)` }; } },
  { id:'para-area', name:'평행사변형의 넓이 구하기', std:'6수03-14', lv:[2,2], t:'both',
    g(){ const b = ri(6, 16), h = ri(4, 10), s = h + ri(1, 3); return { q: '평행사변형의 넓이는 몇 cm²인가요?', fig: paraFig(b, h, Math.sqrt(s * s - h * h), `${b} cm`, `${h} cm`, `${s} cm`), ans: { k:'int', v: b * h, unit:'cm²' }, wrong: [b * s, b * h / 2 | 0, 2 * (b + s)], ex: `(밑변) × (높이) = ${b} × ${h} = ${b * h}(cm²) — 비스듬한 변 ${s} cm는 높이가 아니에요.` }; } },
  { id:'tri-area', name:'삼각형의 넓이 구하기', std:'6수03-14', lv:[2,2], t:'both',
    g(){ let b, h; do { b = ri(6, 18); h = ri(4, 14); } while ((b * h) % 2); return { q: '삼각형의 넓이는 몇 cm²인가요?', fig: triFig(b, h, b * .35, `${b} cm`, `${h} cm`), ans: { k:'int', v: b * h / 2, unit:'cm²' }, wrong: [b * h, b + h, b * h / 2 + b], ex: `(밑변) × (높이) ÷ 2 = ${b} × ${h} ÷ 2 = ${b * h / 2}(cm²)` }; } },
  { id:'trap-area', name:'사다리꼴의 넓이 구하기', std:'6수03-14', lv:[2,3], t:'both',
    g(){ let a, b, h; do { a = ri(3, 10); b = a + ri(2, 8); h = ri(3, 10); } while (((a + b) * h) % 2); return { q: '사다리꼴의 넓이는 몇 cm²인가요?', fig: trapFig(a, b, h, (b - a) * .4, `${a} cm`, `${b} cm`, `${h} cm`), ans: { k:'int', v: (a + b) * h / 2, unit:'cm²' }, wrong: [(a + b) * h, a * b * h / 2 | 0, (a + b + h)], ex: `(윗변 + 아랫변) × (높이) ÷ 2 = (${a} + ${b}) × ${h} ÷ 2 = ${(a + b) * h / 2}(cm²)` }; } },
  { id:'rhomb-area', name:'마름모의 넓이 구하기', std:'6수03-14', lv:[2,3], t:'both',
    g(){ let p, q; do { p = ri(6, 16); q = ri(6, 18); } while ((p * q) % 2 || p === q); return { q: '두 대각선의 길이가 다음과 같은 마름모의 넓이는 몇 cm²인가요?', fig: rhombFig(p, q, `${p} cm`, `${q} cm`), ans: { k:'int', v: p * q / 2, unit:'cm²' }, wrong: [p * q, 2 * (p + q), p + q], ex: `(한 대각선) × (다른 대각선) ÷ 2 = ${p} × ${q} ÷ 2 = ${p * q / 2}(cm²)` }; } },
  { id:'unit-conv', name:'넓이 단위 사이의 관계 알기', std:'6수03-12', lv:[2,3], t:'both',
    g(lv){ const r = pick([
        () => { const x = ri(2, 30); return [`${x} m² = □ cm²`, x * 10000, [x * 100, x * 1000, x * 100000], `1 m² = 10000 cm²이므로 ${x} m² = ${nf(x * 10000)} cm²`]; },
        () => { const x = ri(2, 30); return [`${nf(x * 10000)} cm² = □ m²`, x, [x * 10, x * 100, x * 1000], `10000 cm² = 1 m²이므로 ${x} m²`]; },
        () => { const x = ri(2, 20); return [`${x} km² = □ m²`, x * 1000000, [x * 1000, x * 10000, x * 100000], `1 km² = 1000000 m²이므로 ${x} km² = ${nf(x * 1000000)} m²`]; },
        () => { const x = ri(2, 60); return [`${nf(x * 1000000)} m² = □ km²`, x, [x * 10, x * 100, x * 1000], `1000000 m² = 1 km²이므로 ${x} km²`]; }
      ])(); return { q: `□ 안에 알맞은 수를 구하세요.${E(r[0])}`, ans: { k:'int', v: r[1] }, wrong: r[2], ex: r[3] }; } },
  { id:'unit-pick', name:'넓이를 나타내기에 알맞은 단위 고르기', std:'6수03-12', lv:[1,1], t:'mc',
    g(){ const [o, u] = pick([['교실 바닥의 넓이', 'm²'], ['공책 표지의 넓이', 'cm²'], ['서울특별시의 넓이', 'km²'], ['우표의 넓이', 'cm²'], ['학교 운동장의 넓이', 'm²'], ['제주도의 넓이', 'km²'], ['스마트폰 화면의 넓이', 'cm²'], ['우리 집 거실 바닥의 넓이', 'm²']]);
      return MC(`${o}를 나타내기에 가장 알맞은 단위는 어느 것인가요?`, [u, ...['cm²', 'm²', 'km²'].filter(x => x !== u)], `${o}는 ${u}로 나타내는 것이 알맞아요.`); } },
  { id:'peri-rev', name:'둘레를 알 때 변의 길이 구하기', std:'6수03-11', lv:[3,3], t:'both',
    g(){ if (Math.random() < .5){ const w = ri(6, 20), h = ri(3, 15), P = 2 * (w + h); return { q: `둘레가 ${P} cm인 직사각형이 있습니다. 가로가 ${w} cm일 때 세로는 몇 cm인가요?`, ans: { k:'int', v: h, unit:'cm' }, wrong: [P - w, P / 2, P / 2 + w].filter(Number.isInteger), ex: `가로 + 세로 = ${P} ÷ 2 = ${P / 2} → 세로 = ${P / 2} - ${w} = ${h}(cm)` }; }
      const n = ri(5, 10), s = ri(3, 14); return { q: `둘레가 ${n * s} cm인 ${POLY_N[n]}의 한 변의 길이는 몇 cm인가요?`, ans: { k:'int', v: s, unit:'cm' }, wrong: [s + 1, n * s - n, s * 2], ex: `${n * s} ÷ ${n} = ${s}(cm)` }; } },
  { id:'area-rev', name:'넓이를 알 때 밑변, 높이, 대각선 구하기', std:'6수03-14', lv:[3,4], t:'both',
    g(lv){ const r = pick([
        () => { const b = ri(4, 15), h = ri(3, 12); return [`넓이가 ${b * h} cm²인 평행사변형의 밑변이 ${b} cm일 때, 높이는 몇 cm인가요?`, h, [b * h - b, h * 2], `(높이) = ${b * h} ÷ ${b} = ${h}(cm)`]; },
        () => { let b, h; do { b = ri(4, 16); h = ri(3, 14); } while ((b * h) % 2); return [`넓이가 ${b * h / 2} cm²인 삼각형의 밑변이 ${b} cm일 때, 높이는 몇 cm인가요?`, h, [h / 2, b * h / 2 / b].filter(Number.isInteger).filter(x => x !== h), `(높이) = ${b * h / 2} × 2 ÷ ${b} = ${h}(cm)`]; },
        () => { let p, q; do { p = ri(4, 16); q = ri(4, 18); } while ((p * q) % 2); return [`넓이가 ${p * q / 2} cm²인 마름모의 한 대각선이 ${p} cm일 때, 다른 대각선은 몇 cm인가요?`, q, [q / 2, p * q / 2 - p].filter(Number.isInteger), `${p * q / 2} × 2 ÷ ${p} = ${q}(cm)`]; },
        () => { let a, b, h; do { a = ri(3, 10); b = a + ri(2, 8); h = ri(3, 12); } while (((a + b) * h) % 2); return [`넓이가 ${(a + b) * h / 2} cm²인 사다리꼴의 윗변이 ${a} cm, 아랫변이 ${b} cm일 때, 높이는 몇 cm인가요?`, h, [h * 2, (a + b) * h / 2 / (a + b)].filter(x => x !== h && Number.isInteger(x)), `(높이) = ${(a + b) * h / 2} × 2 ÷ (${a} + ${b}) = ${h}(cm)`]; }
      ])(); return { q: r[0], ans: { k:'int', v: r[1], unit:'cm' }, wrong: r[2], ex: r[3] }; } },
  { id:'peri-area', name:'둘레를 이용하여 넓이 구하기', std:'6수03-13', lv:[4,4], t:'both',
    g(){ if (Math.random() < .4){ const s = ri(5, 16); return { q: `둘레가 ${4 * s} cm인 정사각형의 넓이는 몇 cm²인가요?`, ans: { k:'int', v: s * s, unit:'cm²' }, wrong: [4 * s * s, 4 * s, s * 2], ex: `한 변 = ${4 * s} ÷ 4 = ${s}(cm) → 넓이 = ${s} × ${s} = ${s * s}(cm²)` }; }
      const w = ri(6, 18), h = ri(3, w - 1), P = 2 * (w + h); return { q: `둘레가 ${P} cm이고 가로가 ${w} cm인 직사각형의 넓이는 몇 cm²인가요?`, ans: { k:'int', v: w * h, unit:'cm²' }, wrong: [w * (P - w), w * P / 2, P * w], ex: `세로 = ${P} ÷ 2 - ${w} = ${h}(cm) → 넓이 = ${w} × ${h} = ${w * h}(cm²)` }; } },
  { id:'mixed-unit', name:'단위가 다른 길이로 넓이 구하기', std:'6수03-12', lv:[4,4], t:'both',
    g(){ if (Math.random() < .5){ const a = ri(2, 9), b = ri(2, 9); return { q: `가로가 ${a * 100} cm, 세로가 ${b} m인 직사각형 모양 게시판의 넓이는 몇 m²인가요?`, ans: { k:'int', v: a * b, unit:'m²' }, wrong: [a * 100 * b, a * b * 100, a * b * 10000], ex: `${a * 100} cm = ${a} m → ${a} × ${b} = ${a * b}(m²)` }; }
      const a = ri(2, 9), b = ri(2, 9); return { q: `가로가 ${a} km, 세로가 ${b * 1000} m인 직사각형 모양 마을의 넓이는 몇 km²인가요?`, ans: { k:'int', v: a * b, unit:'km²' }, wrong: [a * b * 1000, a * b * 1000000, a + b], ex: `${b * 1000} m = ${b} km → ${a} × ${b} = ${a * b}(km²)` }; } },
  { id:'same-area', name:'넓이가 같은 두 도형으로 길이 구하기', std:'6수03-14', lv:[4,5], t:'both',
    g(){ for (;;){ const p = ri(4, 16), q = ri(4, 16), A1 = p * q / 2; if (!Number.isInteger(A1)) continue; const b = pick(divisors(A1 * 2).filter(x => x > 2 && x < 20 && x !== p && x !== q)); if (!b) continue;
        return { q: `두 대각선이 ${p} cm, ${q} cm인 마름모와 넓이가 같은 삼각형이 있습니다. 이 삼각형의 밑변이 ${b} cm일 때 높이는 몇 cm인가요?`, ans: { k:'int', v: A1 * 2 / b, unit:'cm' }, wrong: [A1 / b, A1 * 2 / b * 2].filter(x => Number.isInteger(x) && x !== A1 * 2 / b), ex: `마름모 넓이 ${p} × ${q} ÷ 2 = ${A1}(cm²) → 삼각형 높이 = ${A1} × 2 ÷ ${b} = ${A1 * 2 / b}(cm)` }; } } },
  { id:'L-shape', name:'여러 가지 다각형의 둘레와 넓이 구하기 (복합 도형)', std:'6수03-13', lv:[4,5], t:'both',
    g(lv){ const W = ri(9, 16), H = ri(7, 12), w = ri(3, W - 4), h = ri(2, H - 3);
      const pts = box([[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]]);
      const fig = svg(330, 190, polyFig(pts, { e: { 0: `${W} cm`, 5: `${H} cm`, 2: `${w} cm`, 3: `${h} cm` } }));
      if (lv === 4) return { q: '도형의 둘레는 몇 cm인가요? (모든 각은 직각입니다.)', fig, ans: { k:'int', v: 2 * (W + H), unit:'cm' }, wrong: [2 * (W + H) - w - h, W + H + w + h, W * H - w * h], ex: `변을 옮기면 가로 ${W} cm, 세로 ${H} cm인 직사각형의 둘레와 같아요: (${W} + ${H}) × 2 = ${2 * (W + H)}(cm)` };
      return { q: '도형의 넓이는 몇 cm²인가요? (모든 각은 직각입니다.)', fig, ans: { k:'int', v: W * H - w * h, unit:'cm²' }, wrong: [W * H, W * H - w * h * 2, 2 * (W + H)], ex: `큰 직사각형 ${W} × ${H} = ${W * H}에서 빈 부분 ${w} × ${h} = ${w * h}를 빼요: ${W * H - w * h}(cm²)` }; } },
  { id:'mid-rhomb', name:'도형 안의 마름모, 삼각형 넓이 추론하기', std:'6수03-14', lv:[5,5], t:'both',
    g(){ if (Math.random() < .5){ let a, b; do { a = ri(6, 20); b = ri(6, 16); } while ((a * b) % 2);
        return { q: `가로 ${a} cm, 세로 ${b} cm인 직사각형의 각 변의 한가운데 점을 차례로 이어 마름모를 만들었습니다. 마름모의 넓이는 몇 cm²인가요?`, ans: { k:'int', v: a * b / 2, unit:'cm²' }, wrong: [a * b, a * b / 4, 2 * (a + b)].filter(Number.isInteger), ex: `마름모의 두 대각선은 ${a} cm, ${b} cm → ${a} × ${b} ÷ 2 = ${a * b / 2}(cm²)` }; }
      const b = ri(4, 12), h1 = ri(3, 9), h2 = h1 + ri(2, 6), A1 = b * h1 / 2; if (!Number.isInteger(A1) || !Number.isInteger(b * h2 / 2)) return this.g();
      return { q: `밑변의 길이가 같은 두 삼각형 가와 나가 있습니다. 가의 높이는 ${h1} cm이고 넓이는 ${A1} cm²입니다. 나의 높이가 ${h2} cm일 때 나의 넓이는 몇 cm²인가요?`, ans: { k:'int', v: b * h2 / 2, unit:'cm²' }, wrong: [b * h2, A1 + h2 - h1, A1 * h2], ex: `가에서 밑변 = ${A1} × 2 ÷ ${h1} = ${b}(cm) → 나의 넓이 = ${b} × ${h2} ÷ 2 = ${b * h2 / 2}(cm²)` }; } }
]});
})();
