/* =========================================================
   5학년 2학기 문제 만들기 — 수학익힘(3종) 문제 유형을 바탕으로
   수와 상황을 바꾸어 새로 만들어요.
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS;
const { ri, pick, shuffle, sample, gcd, lcm, range, divisors, dz, nf, won, sum, KO, josa,
  F, M, toF, frH, fr, svg, txt, line, polyFig, fitPts, rotPts, flipPts, rightMark, numberLine, cuboidFig, netFig, foldNet, CUBE_NETS, NON_NETS,
  spinnerFig, barsFig, table, tableH } = A;
const NAMES = ['민수','지아','수아','지호','유나','시우','하나','서아','도희','예나','주아','태호'];
const E = s => `<div class="expr">${s}</div>`;
const MC = (q, opts, ex, extra = {}) => {
  opts = opts.filter((o, i) => opts.indexOf(o) === i);
  const order = shuffle(opts.map((_, i) => i));
  return Object.assign({ q, choices: order.map(i => opts[i]), correct: order.indexOf(0), ans: { k: 'text', v: opts[0] }, ex }, extra);
};

/* ─────────────── 1. 수의 범위와 어림하기 ─────────────── */
const RW = { ge:'이상', le:'이하', gt:'초과', lt:'미만' };
const inR = (x, t, n) => t === 'ge' ? x >= n : t === 'le' ? x <= n : t === 'gt' ? x > n : x < n;
const PLACE = { 1:'일의 자리', 10:'십의 자리', 100:'백의 자리', 1000:'천의 자리', 10000:'만의 자리', 0.1:'소수 첫째 자리', 0.01:'소수 둘째 자리' };
const MW = { up:'올림', down:'버림', half:'반올림' };
const roundTo = (x, p, m) => { const q = dz(x / p); const r = m === 'up' ? Math.ceil(q) : m === 'down' ? Math.floor(q) : Math.floor(q + 0.5); return dz(r * p); };
A.addUnit({ key:'5-2-1', title:'수의 범위와 어림하기', items:[
  { id:'rg-count', name:'이상, 이하, 초과, 미만인 수 찾기', std:'6수01-02', lv:[1,1], t:'both',
    g(){ const t = pick(Object.keys(RW)), n = ri(10, 60), list = shuffle([n, n - 1, n + 1, dz(n + .5), dz(n - .5), ri(n + 2, n + 20), ri(Math.max(1, n - 20), n - 2), ri(n + 2, n + 30)]);
      const v = list.filter(x => inR(x, t, n)).length, flip = list.filter(x => inR(x, { ge:'gt', gt:'ge', le:'lt', lt:'le' }[t], n)).length;
      return { q: `다음 수 중에서 <b>${n} ${RW[t]}</b>인 수는 모두 몇 개인가요?<div class="expr nums">${list.join('　')}</div>`, ans: { k:'int', v, unit:'개' }, wrong: [flip, v + 1, v - 1].filter(x => x !== v && x >= 0),
        ex: `${n} ${RW[t]}: ${list.filter(x => inR(x, t, n)).join(', ')} → ${v}개 (${n}은(는) ${t === 'ge' || t === 'le' ? '포함돼요' : '포함되지 않아요'})` }; } },
  { id:'rg-line', name:'수직선에 나타낸 수의 범위 읽기', std:'6수01-02', lv:[1,2], t:'mc',
    g(lv){ const a = ri(3, 12) * (lv === 1 ? 1 : 1), st = 1, from = a - 2, to = a + 6;
      if (lv === 1){ const t = pick(Object.keys(RW)), closed = t === 'ge' || t === 'le', right = t === 'ge' || t === 'gt';
        const fig = numberLine(from, to, st, right ? [a, null, closed, false] : [null, a, false, closed]);
        const opts = [`${a} ${RW[t]}인 수`, ...Object.keys(RW).filter(x => x !== t).map(x => `${a} ${RW[x]}인 수`)];
        return MC('수직선에 나타낸 수의 범위를 바르게 읽은 것은 어느 것인가요?', opts, `${closed ? '●는 기준 수를 포함해요' : '○는 기준 수를 포함하지 않아요'}. → ${a} ${RW[t]}`, { fig }); }
      const b = a + ri(2, 5), ac = Math.random() < .5, bc = Math.random() < .5, fig = numberLine(from, to, st, [a, b, ac, bc]);
      const say = (x, y) => `${a} ${x ? '이상' : '초과'} ${b} ${y ? '이하' : '미만'}인 수`;
      return MC('수직선에 나타낸 수의 범위를 바르게 읽은 것은 어느 것인가요?', [say(ac, bc), say(!ac, bc), say(ac, !bc), say(!ac, !bc)], `왼쪽 ${ac ? '●' : '○'}, 오른쪽 ${bc ? '●' : '○'} → ${say(ac, bc)}`, { fig }); } },
  { id:'rg-nat', name:'범위에 속하는 자연수의 개수 구하기', std:'6수01-02', lv:[2,3], t:'both',
    g(lv){ const a = ri(10, 60), b = a + ri(4, 15), ta = pick(['ge', 'gt']), tb = pick(['le', 'lt']);
      const list = range(a - 1, b + 1).filter(x => inR(x, ta, a) && inR(x, tb, b));
      if (lv === 2 && Math.random() < .5){ const n = ri(6, 20), t = pick(['lt', 'le']), v = t === 'lt' ? n - 1 : n;
        return { q: `${n} ${RW[t]}인 자연수는 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [t === 'lt' ? n : n - 1, v + 1, n + 1].filter(x => x !== v), ex: `1부터 ${t === 'lt' ? n - 1 : n}까지 ${v}개예요.` }; }
      return { q: `${a} ${RW[ta]} ${b} ${RW[tb]}인 자연수는 모두 몇 개인가요?`, ans: { k:'int', v: list.length, unit:'개' }, wrong: [b - a + 1, b - a, b - a - 1].filter(x => x !== list.length && x > 0), ex: `${list[0]}부터 ${list[list.length - 1]}까지 ${list.length}개` }; } },
  { id:'rg-include', name:'주어진 수를 포함하는 범위 찾기', std:'6수01-02', lv:[2,3], t:'mc',
    g(){ const x = ri(15, 80), w = ri(3, 8);
      const good = pick([`${x} 이상 ${x + w} 미만`, `${x - w} 초과 ${x} 이하`, `${x - w} 이상 ${x + 1} 미만`, `${x - 1} 초과 ${x + w} 이하`]);
      const bad = shuffle([`${x} 초과 ${x + w} 이하`, `${x - w} 이상 ${x} 미만`, `${x + 1} 이상 ${x + w} 이하`, `${x - w} 초과 ${x - 1} 이하`]).slice(0, 3);
      return MC(`${x}이(가) 포함되는 수의 범위는 어느 것인가요?`, [good, ...bad], `이상·이하는 경계의 수를 포함하고, 초과·미만은 포함하지 않아요. ${x}은(는) "${good}"에 들어가요.`); } },
  { id:'rg-life', name:'생활 속 기준에 맞는 경우 찾기', std:'6수01-02', lv:[2,3], t:'both',
    g(lv){ const S = pick([
        { what:'키', u:'cm', n: ri(13, 15) * 10, t: pick(['ge', 'gt']), say: (n, t) => `키가 ${n} cm ${RW[t]}인 사람만 탈 수 있는 놀이 기구`, gen: n => n + ri(-12, 12) },
        { what:'나이', u:'세', n: pick([12, 15, 18]), t: pick(['ge']), say: (n, t) => `${n}세 ${RW[t]}만 볼 수 있는 영화`, gen: n => n + ri(-5, 6) },
        { what:'50 m 달리기 기록', u:'초', n: ri(9, 11), t: pick(['lt', 'le']), say: (n, t) => `50 m 달리기 기록이 ${n}초 ${RW[t]}인 학생을 이어달리기 선수로 뽑으려는 경우`, gen: n => dz(n + ri(-12, 12) / 10) }
      ]);
      const who = sample(NAMES, lv === 2 ? 5 : 6), vals = who.map(() => S.gen(S.n)); vals[ri(0, vals.length - 1)] = S.n;
      const v = vals.filter(x => inR(x, S.t, S.n)).length;
      return { q: `${S.say(S.n, S.t)}에 해당하는 사람은 모두 몇 명인가요?${tableH([['이름', ...who], [`${S.what}(${S.u})`, ...vals]])}`, ans: { k:'int', v, unit:'명' },
        wrong: [vals.filter(x => inR(x, { ge:'gt', gt:'ge', le:'lt', lt:'le' }[S.t], S.n)).length, v + 1, v - 1].filter(x => x !== v && x >= 0), ex: `${S.n}${S.u} ${RW[S.t]}: ${who.filter((_, i) => inR(vals[i], S.t, S.n)).join(', ')} → ${v}명` }; } },
  { id:'rd-int', name:'올림, 버림, 반올림하여 나타내기 (자연수)', std:'6수01-03', lv:[1,2], t:'both',
    g(lv){ const p = pick(lv === 1 ? [10, 100] : [100, 1000, 10000]), n = ri(p * 2 + 1, p * 99) + (lv === 2 ? ri(1, 9) : 0), m = pick(['up', 'down', 'half']); if (n % p === 0) return this.g(lv);
      const v = roundTo(n, p, m);
      return { q: `${nf(n)}을(를) <b>${MW[m]}</b>하여 ${PLACE[p]}까지 나타내세요.`, ans: { k:'int', v }, wrong: ['up', 'down', 'half'].map(x => roundTo(n, p, x)).concat([roundTo(n, p * 10, m), roundTo(n, p / 10 >= 1 ? p / 10 : 1, m)]).filter(x => x !== v),
        ex: `${PLACE[p]} 아래 수를 ${m === 'up' ? '올려요' : m === 'down' ? '버려요' : `보고 바로 아래 자리 숫자가 ${Math.floor(n / (p / 10)) % 10}이므로 ${Math.floor(n / (p / 10)) % 10 >= 5 ? '올려요' : '버려요'}`} → ${nf(v)}` }; } },
  { id:'rd-dec', name:'올림, 버림, 반올림하여 나타내기 (소수)', std:'6수01-03', lv:[2,2], t:'both',
    g(){ const p = pick([1, 0.1, 0.01]), x = dz(ri(1001, 9999) / (p === 0.01 ? 1000 : p === 0.1 ? 1000 : 100)), m = pick(['up', 'down', 'half']); if (dz(x / p) === Math.round(x / p)) return this.g();
      const v = roundTo(x, p, m);
      return { q: `${x}을(를) <b>${MW[m]}</b>하여 ${PLACE[p]}까지 나타내세요.`, ans: { k: p === 1 ? 'int' : 'dec', v }, wrong: ['up', 'down', 'half'].map(z => roundTo(x, p, z)).concat([roundTo(x, p * 10 > 1 ? 1 : p * 10, m)]).filter(z => z !== v && z > 0), ex: `${PLACE[p]} 아래를 ${MW[m]}하면 ${v}` }; } },
  { id:'rd-which', name:'어림한 결과가 주어진 수가 되는 수 찾기', std:'6수01-03', lv:[3,3], t:'mc',
    g(){ const p = pick([10, 100]), m = pick(['up', 'down', 'half']), X = ri(12, 89) * p;
      const cands = range(X - p * 2, X + p * 2).filter(n => n > 0); const good = shuffle(cands.filter(n => roundTo(n, p, m) === X && n !== X)), bad = shuffle(cands.filter(n => roundTo(n, p, m) !== X));
      const traps = bad.filter(n => Math.abs(n - X) <= p).concat(bad); const opts = [good[0], ...[...new Set(traps)].slice(0, 3)];
      return MC(`${MW[m]}하여 ${PLACE[p]}까지 나타내면 ${nf(X)}이(가) 되는 수는 어느 것인가요?`, opts.map(nf), `${nf(good[0])}을(를) ${MW[m]}하면 ${nf(X)}. 나머지는 ${opts.slice(1).map(n => `${nf(n)}→${nf(roundTo(n, p, m))}`).join(', ')}`); } },
  { id:'rd-life', name:'생활 속에서 올림, 버림, 반올림 활용하기', std:'6수01-03', lv:[3,4], t:'both',
    g(lv){ const S = pick([
        () => { const n = ri(121, 989); if (n % 10 === 0) return null; return { q: `학생 ${n}명에게 공책을 한 권씩 나누어 주려고 합니다. 공책을 10권씩 묶음으로만 판다면 최소 몇 권을 사야 하나요?`, v: roundTo(n, 10, 'up'), u: '권', w: [roundTo(n, 10, 'down'), roundTo(n, 10, 'half')], ex: `모자라면 안 되므로 올림: ${n} → ${roundTo(n, 10, 'up')}(권)` }; },
        () => { const n = ri(1210, 9890); if (n % 100 === 0) return null; return { q: `귤 ${nf(n)}개를 한 상자에 100개씩 담아서 팔려고 합니다. 상자에 담아 팔 수 있는 귤은 최대 몇 개인가요?`, v: roundTo(n, 100, 'down'), u: '개', w: [roundTo(n, 100, 'up'), roundTo(n, 100, 'half')], ex: `100개가 안 되는 나머지는 팔 수 없으므로 버림: ${nf(roundTo(n, 100, 'down'))}(개)` }; },
        () => { const n = ri(12, 95) * 1000 + ri(1, 9) * 100; return { q: `${won(n)}원짜리 물건을 사려고 합니다. 10000원짜리 지폐로만 낸다면 최소 얼마를 내야 하나요?`, v: roundTo(n, 10000, 'up'), u: '원', w: [roundTo(n, 10000, 'down'), roundTo(n, 1000, 'up')].filter(x => x > 0), ex: `모자라면 안 되므로 올림하여 만의 자리까지: ${won(roundTo(n, 10000, 'up'))}(원)` }; },
        () => { const n = ri(12, 99) * 100 + ri(10, 90); return { q: `저금통에 동전으로 ${won(n)}원이 있습니다. 이 돈을 1000원짜리 지폐로 바꾸면 최대 얼마까지 바꿀 수 있나요?`, v: roundTo(n, 1000, 'down'), u: '원', w: [roundTo(n, 1000, 'up'), roundTo(n, 1000, 'half'), roundTo(n, 100, 'down')], ex: `1000원이 안 되는 돈은 바꿀 수 없으므로 버림: ${won(roundTo(n, 1000, 'down'))}(원)` }; },
        () => { const n = ri(31, 97) * 10 + ri(1, 9), per = 10; return { q: `사과 ${n}개를 한 상자에 ${per}개씩 담으려고 합니다. 사과를 모두 담으려면 상자는 최소 몇 개 필요한가요?`, v: Math.ceil(n / per), u: '개', w: [Math.floor(n / per), Math.round(n / per)], ex: `남는 사과도 담아야 하므로 올림: ${Math.ceil(n / per)}(개)` }; },
        () => { const L = ri(3, 9) * 100 + ri(5, 95), per = 100; return { q: `리본 ${L} cm로 한 개에 ${per} cm씩 사용하여 선물 상자를 묶으려고 합니다. 선물 상자를 최대 몇 개 묶을 수 있나요?`, v: Math.floor(L / per), u: '개', w: [Math.ceil(L / per), L % 100 >= 50 ? Math.floor(L / per) + 1 : Math.floor(L / per) + 2], ex: `100 cm가 안 되는 리본으로는 묶을 수 없으므로 버림: ${Math.floor(L / per)}(개)` }; }
      ]); const r = S(); if (!r) return this.g(lv); return { q: r.q, ans: { k:'int', v: r.v, unit: r.u }, wrong: r.w, ex: r.ex }; } },
  { id:'rd-method', name:'상황에 알맞은 어림 방법 고르기', std:'6수01-03', lv:[3,4], t:'mc',
    g(){ const [s, m] = pick([
        ['학생 수만큼 필요한 물건을 10개 묶음으로만 살 때', 'up'], ['지폐로만 물건값을 낼 때 내야 하는 최소 금액', 'up'], ['짐을 모두 옮기는 데 필요한 트럭 수', 'up'], ['모든 사람이 앉을 수 있는 긴 의자의 최소 개수', 'up'],
        ['동전을 1000원짜리 지폐로 바꿀 때 바꿀 수 있는 최대 금액', 'down'], ['100개씩 상자에 담아 팔 수 있는 최대 개수', 'down'], ['리본으로 만들 수 있는 꽃의 최대 개수', 'down'],
        ['경기장 관람객 수를 대략 나타낼 때', 'half'], ['키를 가장 가까운 cm로 나타낼 때', 'half']
      ]); return MC(`다음 상황에 알맞은 어림 방법은 어느 것인가요?<div class="say">${s}</div>`, [MW[m], ...Object.keys(MW).filter(x => x !== m).map(x => MW[x])], m === 'up' ? '모자라면 안 되는 상황이므로 올림을 해요.' : m === 'down' ? '남는 것은 셀 수 없는 상황이므로 버림을 해요.' : '가장 가까운 값으로 나타내는 상황이므로 반올림을 해요.'); } },
  { id:'rd-digit', name:'어림한 결과로 □ 안에 들어갈 수 있는 숫자 구하기', std:'6수01-03', lv:[3,4], t:'both',
    g(lv){ const base = ri(10, 99) * 10 + ri(1, 8), m = pick(lv === 3 ? ['half'] : ['half', 'up']);
      const X = m === 'half' ? (Math.random() < .5 ? base * 10 : (base + 1) * 10) : (base + 1) * 10;
      const ok = range(0, 9).filter(d => roundTo(base * 10 + d, 10, m) === X);
      if (!ok.length) return this.g(lv);
      return { q: `${nf(base)}□을(를) ${MW[m]}하여 십의 자리까지 나타내면 ${nf(X)}입니다. □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가요?`, ans: { k:'int', v: ok.length, unit:'개' }, wrong: [ok.length + 1, ok.length - 1, 10 - ok.length].filter(x => x !== ok.length && x >= 0),
        ex: `□에 ${ok.join(', ')}이(가) 들어가면 ${nf(X)}이(가) 돼요 → ${ok.length}개` }; } },
  { id:'rd-extreme', name:'어림하여 주어진 수가 되는 가장 큰(작은) 자연수 구하기', std:'6수01-03', lv:[4,4], t:'both',
    g(){ const p = pick([10, 100]), m = pick(['up', 'down', 'half']), X = ri(12, 89) * p, big = Math.random() < .5;
      const cand = range(X - 2 * p, X + 2 * p).filter(n => roundTo(n, p, m) === X), v = big ? Math.max(...cand) : Math.min(...cand);
      return { q: `${MW[m]}하여 ${PLACE[p]}까지 나타내면 ${nf(X)}이(가) 되는 자연수 중에서 가장 ${big ? '큰' : '작은'} 수를 구하세요.`, ans: { k:'int', v }, wrong: [X - p + 1, X + p - 1, X - p / 2, X + p / 2 - 1, X].filter(x => x !== v && x > 0),
        ex: `${MW[m]}하여 ${nf(X)}이(가) 되는 수의 범위: ${nf(Math.min(...cand))} ~ ${nf(Math.max(...cand))} → ${nf(v)}` }; } },
  { id:'rd-two', name:'두 가지 어림 조건을 이용한 문제 해결', std:'6수01-03', lv:[5,5], t:'both',
    g(){ const X = ri(12, 89) * 10, Y = ri(12, 89) * 100, small = roundTo(X - 9, 10, 'up') === X ? X - 9 : X - 9, big = Y + 99;
      return { q: `올림하여 십의 자리까지 나타내면 ${nf(X)}이(가) 되는 가장 작은 자연수와, 버림하여 백의 자리까지 나타내면 ${nf(Y)}이(가) 되는 가장 큰 자연수의 합을 구하세요.`, ans: { k:'int', v: small + big }, wrong: [X - 10 + Y + 99, small + Y, X + Y + 99], ex: `가장 작은 수 ${small}, 가장 큰 수 ${big} → ${small} + ${big} = ${small + big}` }; } },
  { id:'rd-cards', name:'수 카드로 만든 수를 어림하기', std:'6수01-03', lv:[5,5], t:'both',
    g(){ const c = sample(range(1, 9), 4), big = Math.random() < .5, s = c.slice().sort((a, b) => big ? b - a : a - b), n = +s.join(''), p = pick([10, 100, 1000]), m = pick(['up', 'down', 'half']), v = roundTo(n, p, m);
      if (n % p === 0) return this.g();
      return { q: `수 카드 ${c.map(x => `<span class="card">${x}</span>`).join(' ')}을 한 번씩 모두 사용하여 만들 수 있는 가장 ${big ? '큰' : '작은'} 네 자리 수를 ${MW[m]}하여 ${PLACE[p]}까지 나타내세요.`, ans: { k:'int', v }, wrong: ['up', 'down', 'half'].filter(x => x !== m).map(x => roundTo(n, p, x)).concat([roundTo(+s.slice().reverse().join(''), p, m)]).filter(x => x !== v),
        ex: `가장 ${big ? '큰' : '작은'} 수 ${n} → ${MW[m]}하여 ${PLACE[p]}까지: ${nf(v)}` }; } },
  { id:'rg-fee', name:'수의 범위로 나눈 표를 보고 문제 해결하기', std:'6수01-02', lv:[4,5], t:'both',
    g(lv){ const fees = [0, 2000, 4000, 6000], bounds = [20, 21, 22];
      const tb = tableH([['무게(kg)', '20 이하', '20 초과 21 이하', '21 초과 22 이하', '22 초과 23 이하'], ['추가 요금(원)', '0', '2,000', '4,000', '6,000']]);
      const feeOf = w => w <= 20 ? 0 : w <= 21 ? 2000 : w <= 22 ? 4000 : 6000;
      if (lv === 4){ const w = pick([20, 21, 22, dz(20 + ri(1, 9) / 10), dz(21 + ri(1, 9) / 10), dz(22 + ri(1, 9) / 10)]);
        return { q: `비행기에 싣는 짐의 무게에 따른 추가 요금표입니다. 짐의 무게가 ${w} kg일 때 추가 요금은 얼마인가요?${tb}`, ans: { k:'int', v: feeOf(w), unit:'원' }, wrong: [0, 2000, 4000, 6000].filter(x => x !== feeOf(w)), ex: `${w} kg은 "${w <= 20 ? '20 이하' : w <= 21 ? '20 초과 21 이하' : w <= 22 ? '21 초과 22 이하' : '22 초과 23 이하'}"에 속해요 → ${won(feeOf(w))}원` }; }
      const ws = [pick([20, 21, 22]), dz(20 + ri(1, 9) / 10), dz(21 + ri(1, 9) / 10), dz(22 + ri(1, 9) / 10), dz(19 + ri(0, 9) / 10)].slice(0, 3); const tot = sum(ws.map(feeOf));
      return { q: `비행기에 싣는 짐의 무게에 따른 추가 요금표입니다. 무게가 ${ws.join(' kg, ')} kg인 짐 3개를 실을 때 추가 요금은 모두 얼마인가요?${tb}`, ans: { k:'int', v: tot, unit:'원' }, wrong: [tot + 2000, tot - 2000, sum(ws.map(w => feeOf(w + 0.0001)))].filter(x => x >= 0 && x !== tot), ex: `${ws.map(w => `${w} kg → ${won(feeOf(w))}원`).join(', ')} → 합 ${won(tot)}원` }; } },
  { id:'rg-mult', name:'수의 범위와 배수를 함께 이용하기', std:'6수01-02', lv:[5,5], t:'both',
    g(){ const a = ri(20, 60), b = a + ri(20, 50), k = ri(3, 9), ta = pick(['ge', 'gt']), tb = pick(['le', 'lt']);
      const sol = range(a, b).filter(x => inR(x, ta, a) && inR(x, tb, b) && x % k === 0); if (!sol.length) return this.g();
      return { q: `${a} ${RW[ta]} ${b} ${RW[tb]}인 자연수 중에서 ${k}의 배수는 모두 몇 개인가요?`, ans: { k:'int', v: sol.length, unit:'개' }, wrong: [sol.length + 1, sol.length - 1, range(a, b).filter(x => x % k === 0).length].filter(x => x !== sol.length && x >= 0), ex: `${sol.join(', ')} → ${sol.length}개` }; } }
]});

/* ─────────────── 2. 분수의 곱셈 ─────────────── */
const pf = d => pick(range(1, d - 1).filter(n => gcd(n, d) === 1));
const pfr = (maxD = 12) => { const d = ri(2, maxD); return F(pf(d), d); };
const mix = (maxW = 3, maxD = 9) => { const d = ri(2, maxD); return M(ri(1, maxW), pf(d), d); };
const mulWrong = (x, y) => { const a = toF(x), b = toF(y); const out = [];
  if (b.isInt()) out.push(F(a.n * b.n, a.d * b.n));                  // 분모에도 곱함
  if (a.isInt()) out.push(F(a.n * b.n, b.d * a.n));
  if (!a.isInt() && a.v > 1 && b.isInt()){ const w = Math.floor(a.v); out.push(a.sub(w).add(w * b.n)); }  // 자연수 부분만 곱함
  out.push(a.add(b)); return out.filter(z => z.n > 0); };
A.addUnit({ key:'5-2-2', title:'분수의 곱셈', items:[
  { id:'pn', name:'(진분수) × (자연수)', std:'6수01-09', lv:[1,1], t:'both',
    g(){ const x = pfr(12), n = ri(2, 12), v = x.mul(n); return { q: `계산해 보세요.${E(`${frH(x)} × ${n}`)}`, ans: { k:'frac', v }, wrong: mulWrong(x, n), ex: `분자에만 곱해요: ${fr(x.n + ' × ' + n, x.d)} = ${frH(v)}` }; } },
  { id:'np', name:'(자연수) × (진분수)', std:'6수01-09', lv:[1,2], t:'both',
    g(){ const x = pfr(12), n = ri(2, 30), v = x.mul(n); return { q: `계산해 보세요.${E(`${n} × ${frH(x)}`)}`, ans: { k:'frac', v }, wrong: mulWrong(n, x), ex: `${fr(n + ' × ' + x.n, x.d)} = ${frH(v)}` }; } },
  { id:'mn', name:'(대분수) × (자연수)', std:'6수01-09', lv:[2,2], t:'both',
    g(){ const x = mix(4, 9), n = ri(2, 9), v = x.mul(n); return { q: `계산해 보세요.${E(Math.random() < .5 ? `${frH(x)} × ${n}` : `${n} × ${frH(x)}`)}`, ans: { k:'frac', v }, wrong: mulWrong(x, n), ex: `대분수를 가분수로: ${frH(x, { improper: true })} × ${n} = ${frH(v)}` }; } },
  { id:'pp', name:'(분수) × (분수)', std:'6수01-09', lv:[2,3], t:'both',
    g(lv){ const x = lv === 2 ? F(1, ri(2, 9)) : pfr(12), y = lv === 2 ? F(1, ri(2, 9)) : pfr(12), v = x.mul(y);
      return { q: `계산해 보세요.${E(`${frH(x)} × ${frH(y)}`)}`, ans: { k:'frac', v }, wrong: [F(x.n * y.n, x.d + y.d), F(x.n + y.n, x.d * y.d), x.add(y)].filter(z => z.n > 0), ex: `분자끼리, 분모끼리 곱해요: ${fr(`${x.n} × ${y.n}`, `${x.d} × ${y.d}`)} = ${frH(v)}` }; } },
  { id:'mm', name:'(대분수) × (대분수)', std:'6수01-09', lv:[3,3], t:'both',
    g(){ const x = mix(3, 7), y = mix(2, 7), v = x.mul(y), wx = Math.floor(x.v), wy = Math.floor(y.v);
      return { q: `계산해 보세요.${E(`${frH(x)} × ${frH(y)}`)}`, ans: { k:'frac', v }, wrong: [x.sub(wx).mul(y.sub(wy)).add(wx * wy), v.add(1)].filter(z => z.n > 0), ex: `가분수로 바꾸어 곱해요: ${frH(x, { improper: true })} × ${frH(y, { improper: true })} = ${frH(v)}` }; } },
  { id:'unit-of', name:'단위의 분수만큼 구하기 (시간, 길이, 들이, 무게)', std:'6수01-09', lv:[2,3], t:'both',
    g(){ const [whole, u, sub, k] = pick([['1시간', '분', 60, '분'], ['1 m', 'cm', 100, 'cm'], ['1 kg', 'g', 1000, 'g'], ['1 L', 'mL', 1000, 'mL'], ['하루', '시간', 24, '시간']]);
      const d = pick(divisors(sub).filter(x => x > 1 && x <= 12)), n = pf(d), v = sub / d * n;
      return { q: `${whole}의 ${fr(n, d)}은(는) 몇 ${u}인가요?`, ans: { k:'int', v, unit: u }, wrong: [sub / d, n * 10, v + sub / d, Math.round(sub * n / 10)].filter(x => x !== v && Number.isInteger(x)), ex: `${whole} = ${sub}${u} → ${sub} × ${fr(n, d)} = ${v}(${u})` }; } },
  { id:'estimate', name:'곱의 크기 어림하기', std:'6수01-09', lv:[3,3], t:'mc',
    g(){ const n = ri(4, 15), small = Math.random() < .5, p = pfr(9), m = mix(2, 9);
      const lt = `${n} × ${frH(p)}`, gt1 = `${n} × ${frH(m)}`, gt2 = `${frH(M(1, 1, ri(2, 9)))} × ${n}`, eq = `${n} × 1`;
      return small ? MC(`계산 결과가 ${n}보다 <b>작은</b> 것은 어느 것인가요?`, [lt, gt1, gt2, eq], `1보다 작은 수를 곱하면 처음 수보다 작아져요.`)
        : MC(`계산 결과가 ${n}보다 <b>큰</b> 것은 어느 것인가요?`, [gt1, lt, (() => { let q; do { q = pfr(9); } while (q.eq(p)); return `${n} × ${frH(q)}`; })(), eq], `1보다 큰 수를 곱하면 처음 수보다 커져요.`); } },
  { id:'word', name:'분수의 곱셈 문장제 해결하기', std:'6수01-09', lv:[3,3], t:'both',
    g(){ const S = pick([
        () => { const x = pfr(9), n = ri(3, 9); return [`한 병에 ${frH(x)} kg씩 담긴 꿀이 ${n}병 있습니다. 꿀은 모두 몇 kg인가요?`, x.mul(n), 'kg', `${frH(x)} × ${n}`]; },
        () => { const x = mix(2, 6), n = ri(3, 8); return [`매일 ${frH(x)} km씩 ${n}일 동안 걸었습니다. 걸은 거리는 모두 몇 km인가요?`, x.mul(n), 'km', `${frH(x)} × ${n}`]; },
        () => { const a = ri(3, 12), x = pfr(9); return [`가로가 ${a} m, 세로가 ${frH(x)} m인 직사각형 모양 꽃밭의 넓이는 몇 m²인가요?`, x.mul(a), 'm²', `${a} × ${frH(x)}`]; },
        () => { const x = pfr(8), y = pfr(8); return [`버터 ${frH(x)} kg 중에서 ${frH(y)}만큼을 빵을 만드는 데 사용했습니다. 사용한 버터는 몇 kg인가요?`, x.mul(y), 'kg', `${frH(x)} × ${frH(y)}`]; }
      ])(); return { q: S[0], ans: { k:'frac', v: S[1], unit: S[2] }, wrong: [S[1].add(1), S[1].mul(2)], ex: `${S[3]} = ${frH(S[1])}(${S[2]})` }; } },
  { id:'chain', name:'여러 번 분수만큼 구하기', std:'6수01-09', lv:[4,4], t:'both',
    g(){ for (;;){ const x = pfr(8), y = pfr(6), N = pick([24, 30, 32, 36, 40, 48, 60, 72, 80, 120, 160]); const a = x.mul(N); if (!a.isInt()) continue; const b = y.mul(a); if (!b.isInt() || b.n === 0) continue;
        if (Math.random() < .5) return { q: `학생 ${N}명 중에서 ${frH(x)}는 남학생이고, 남학생 중에서 ${frH(y)}는 축구를 좋아합니다. 축구를 좋아하는 남학생은 몇 명인가요?`, ans: { k:'int', v: b.n, unit:'명' }, wrong: [a.n, N - b.n, y.mul(N).isInt() ? y.mul(N).n : a.n + 1].filter(z => z !== b.n), ex: `${N} × ${frH(x)} × ${frH(y)} = ${b.n}(명)` };
        const used = x, rest = F(1).sub(x), used2 = rest.mul(y), left = rest.sub(used2);
        return { q: `텃밭 전체의 ${frH(used)}에는 상추를 심고, 나머지의 ${frH(y)}에는 고추를 심었습니다. 아무것도 심지 않은 부분은 텃밭 전체의 몇 분의 몇인가요?`, ans: { k:'frac', v: left }, wrong: [F(1).sub(x).sub(y).n > 0 ? F(1).sub(x).sub(y) : left.add(F(1, 2)), used2, rest].filter(z => z.n > 0 && !z.eq(left)), ex: `나머지 ${frH(rest)}의 ${frH(y)} = ${frH(used2)} → 남은 부분 ${frH(rest)} - ${frH(used2)} = ${frH(left)}` }; } } },
  { id:'three', name:'세 분수의 곱셈', std:'6수01-09', lv:[4,4], t:'both',
    g(){ const a = pfr(9), b = pfr(9), c = pfr(9), v = a.mul(b).mul(c); return { q: `계산해 보세요.${E(`${frH(a)} × ${frH(b)} × ${frH(c)}`)}`, ans: { k:'frac', v }, wrong: [a.mul(b), v.mul(2)], ex: `${frH(a.mul(b))} × ${frH(c)} = ${frH(v)}` }; } },
  { id:'area', name:'분수가 있는 도형의 넓이 구하기', std:'6수01-09', lv:[4,4], t:'both',
    g(){ const a = mix(3, 6), b = mix(2, 6), v = a.mul(b); return { q: `가로가 ${frH(a)} m, 세로가 ${frH(b)} m인 직사각형의 넓이는 몇 m²인가요?`, ans: { k:'frac', v, unit:'m²' }, wrong: [a.add(b).mul(2), a.sub(Math.floor(a.v)).mul(b.sub(Math.floor(b.v))).add(Math.floor(a.v) * Math.floor(b.v))].filter(z => z.n > 0), ex: `${frH(a, { improper: true })} × ${frH(b, { improper: true })} = ${frH(v)}(m²)` }; } },
  { id:'ineq', name:'곱셈 결과로 □ 안에 들어갈 자연수 구하기', std:'6수01-09', lv:[4,5], t:'both',
    g(){ for (;;){ const n = ri(2, 9), x = mix(4, 9), v = x.mul(n); if (v.isInt()) continue; const c = Math.floor(v.v);
        if (Math.random() < .5) return { q: `□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?${E(`${n} × ${frH(x)} &gt; □`)}`, ans: { k:'int', v: c, unit:'개' }, wrong: [c + 1, c - 1], ex: `${n} × ${frH(x)} = ${frH(v)}이므로 □는 1부터 ${c}까지 ${c}개` };
        return { q: `□ 안에 들어갈 수 있는 가장 작은 자연수를 구하세요.${E(`${frH(x)} × ${n} &lt; □`)}`, ans: { k:'int', v: c + 1 }, wrong: [c, c + 2], ex: `${frH(x)} × ${n} = ${frH(v)}이므로 □는 ${c + 1}부터 가능해요.` }; } } },
  { id:'cards', name:'수 카드로 곱이 가장 큰(작은) 식 만들기', std:'6수01-09', lv:[5,5], t:'both',
    g(){ const c = sample(range(2, 9), 3).sort((a, b) => a - b), big = M(c[2], c[0], c[1]), small = M(c[0], c[1], c[2]);
      if (Math.random() < .5) return { q: `수 카드 ${c.map(x => `<span class="card">${x}</span>`).join(' ')}을 한 번씩 모두 사용하여 대분수를 만들려고 합니다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 곱을 구하세요.`, ans: { k:'frac', v: big.mul(small) }, wrong: [big.add(small), big.mul(small).add(1)], ex: `가장 큰 대분수 ${frH(big)} × 가장 작은 대분수 ${frH(small)} = ${frH(big.mul(small))}` };
      const d = sample(range(2, 9), 4).sort((a, b) => a - b); return { q: `수 카드 ${d.map(x => `<span class="card">${x}</span>`).join(' ')} 중에서 2장을 골라 □ 안에 넣어 곱이 가장 작은 곱셈식을 만들려고 합니다. 그때의 곱을 구하세요.${E(`${fr(1, '□')} × ${fr(1, '□')}`)}`, ans: { k:'frac', v: F(1, d[2] * d[3]) }, wrong: [F(1, d[0] * d[1]), F(2, d[2] + d[3]), F(1, d[2] + d[3])], ex: `분모가 클수록 작으므로 ${fr(1, d[3])} × ${fr(1, d[2])} = ${fr(1, d[2] * d[3])}` }; } },
  { id:'time', name:'시간을 분수로 바꾸어 곱하기', std:'6수01-09', lv:[5,5], t:'both',
    g(){ const x = mix(5, 5), m = ri(2, 8), s = pick([15, 20, 30, 40, 45]), t = M(m, s / gcd(s, 60), 60 / gcd(s, 60)), v = x.mul(t);
      return { q: `1분에 ${frH(x)} L씩 물이 나오는 수도가 있습니다. ${m}분 ${s}초 동안 나오는 물은 몇 L인가요?`, ans: { k:'frac', v, unit:'L' }, wrong: [x.mul(F(m * 100 + s, 100)), x.mul(m)].filter(z => z.n > 0 && !z.eq(v)), ex: `${m}분 ${s}초 = ${frH(t)}분 → ${frH(x)} × ${frH(t)} = ${frH(v)}(L)` }; } }
]});

/* ─────────────── 3. 합동과 대칭 ─────────────── */
const TRI = ['ㄱ', 'ㄴ', 'ㄷ'], TRI2 = ['ㄹ', 'ㅁ', 'ㅂ'];
function makeTri(){
  for (;;){ const B = ri(40, 85), C = ri(35, 80), Aa = 180 - B - C; if (Aa < 35 || Aa > 100 || Math.abs(B - C) < 6) continue;
    const r = d => d * Math.PI / 180, d0 = Math.sin(r(C)) / Math.sin(r(Aa));
    const P0 = [0, 0], P1 = [1, 0], apex = [Math.cos(r(B)) * d0, -Math.sin(r(B)) * d0];
    const pts = [apex, P0, P1];                                    // ㄱ(꼭대기) ㄴ(왼쪽) ㄷ(오른쪽)
    const L = ri(6, 12), len = (p, q) => Math.round(Math.hypot(p[0] - q[0], p[1] - q[1]) * L);
    const sides = [len(pts[0], pts[1]), len(pts[1], pts[2]), len(pts[2], pts[0])];  // ㄱㄴ ㄴㄷ ㄷㄱ
    if (new Set(sides).size < 3 || sides.some(x => x < 3)) continue;
    return { pts, ang: [Aa, B, C], sides };
  }
}
const SIDE = (n, i) => `${n[i]}${n[(i + 1) % n.length]}`;
function twoFigs(pts, o1, o2, how){
  let q = pts.map(p => p.slice());
  if (how === 'flip') q = flipPts(q); else q = rotPts(q, how);
  const p1 = fitPts(pts, 30, 28, 160, 130), p2 = fitPts(q, 250, 28, 160, 130);
  return svg(440, 190, polyFig(p1, o1) + polyFig(p2, Object.assign({ fill: '#FFF2DC' }, o2)), 'wide');
}
// 선대칭도형(육각형): ㄱ 위, ㄴ ㄷ 왼쪽, ㄹ 아래, ㅁ ㅂ 오른쪽
function symHex(){
  for (;;){ const a = ri(3, 7), b = ri(3, 7), h1 = ri(2, 4), h2 = h1 + ri(2, 4), h3 = h2 + ri(2, 3);
    const half = [[0, 0], [-a, h1], [-b, h2], [0, h3]], pts = [half[0], half[1], half[2], half[3], [b, h2], [a, h1]];
    const len = (p, q) => Math.round(Math.hypot(p[0] - q[0], p[1] - q[1]) * 2);
    const sides = [len(pts[0], pts[1]), len(pts[1], pts[2]), len(pts[2], pts[3])];
    const angAt = i => { const p = pts[i], u = pts[(i + 5) % 6], v = pts[(i + 1) % 6]; const a1 = Math.atan2(u[1] - p[1], u[0] - p[0]), a2 = Math.atan2(v[1] - p[1], v[0] - p[0]); let d = Math.abs(a1 - a2) * 180 / Math.PI; if (d > 180) d = 360 - d; return Math.round(d); };
    if (new Set(sides).size < 3) continue;
    // 오목한 곳이 없도록
    const cross = i => { const p = pts[i], u = pts[(i + 5) % 6], v = pts[(i + 1) % 6]; return (p[0] - u[0]) * (v[1] - p[1]) - (p[1] - u[1]) * (v[0] - p[0]); };
    const cs = range(0, 5).map(cross); if (!(cs.every(c => c > 0) || cs.every(c => c < 0))) continue;
    return { pts, sides, ang: range(0, 5).map(angAt) };
  }
}
const N6 = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
const axisLine = (pts) => { const xs = pts.filter(p => Math.abs(p[0] - pts[0][0]) < .01); return line(pts[0][0], pts[0][1] - 18, pts[3][0], pts[3][1] + 18, { stroke: '#E5546B', dash: '6 5', w: 2 }); };
const SHAPES = [
  { n:'정삼각형', ax:3, pt:false }, { n:'정사각형', ax:4, pt:true }, { n:'직사각형', ax:2, pt:true }, { n:'마름모', ax:2, pt:true },
  { n:'이등변삼각형', ax:1, pt:false }, { n:'정오각형', ax:5, pt:false }, { n:'정육각형', ax:6, pt:true }, { n:'정팔각형', ax:8, pt:true },
  { n:'평행사변형', ax:0, pt:true }
];
A.addUnit({ key:'5-2-3', title:'합동과 대칭', items:[
  { id:'cong-mean', name:'합동의 뜻 알기', std:'6수03-01', lv:[1,1], t:'mc',
    g(){ const k = Math.random() < .5;
      return k ? MC('모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 무엇이라고 하나요?', ['합동', '선대칭', '점대칭', '대응'], '모양과 크기가 같아 완전히 겹치는 두 도형은 서로 합동이에요.')
        : MC('서로 합동인 두 도형에 대한 설명으로 옳은 것은 어느 것인가요?', ['대응변의 길이가 서로 같습니다.', '모양은 같지만 크기는 다를 수 있습니다.', '대응각의 크기는 서로 다릅니다.', '뒤집어서 겹치는 도형은 합동이 아닙니다.'], '합동인 두 도형에서 대응변의 길이와 대응각의 크기는 각각 같아요.'); } },
  { id:'cong-corr', name:'합동인 도형의 대응변, 대응각 찾기', std:'6수03-01', lv:[2,2], t:'mc',
    g(){ const T = makeTri(), how = pick([90, 180, 270, 'flip']), fig = twoFigs(T.pts, { v: TRI }, { v: TRI2 }, how);
      const i = ri(0, 2), angle = Math.random() < .5;
      if (angle){ const nm = j => `각 ${TRI2[(j + 2) % 3]}${TRI2[j]}${TRI2[(j + 1) % 3]}`, base = `각 ${TRI[(i + 2) % 3]}${TRI[i]}${TRI[(i + 1) % 3]}`;
        return MC(`삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. ${base}의 대응각은 어느 것인가요?`, [nm(i), nm((i + 1) % 3), nm((i + 2) % 3)], `점 ${TRI[i]}의 대응점은 점 ${TRI2[i]}이므로 ${base}의 대응각은 ${nm(i)}`, { fig }); }
      const sd = j => `변 ${SIDE(TRI2, j)}`;
      return MC(`삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 변 ${SIDE(TRI, i)}의 대응변은 어느 것인가요?`, [sd(i), sd((i + 1) % 3), sd((i + 2) % 3)], `ㄱ↔ㄹ, ㄴ↔ㅁ, ㄷ↔ㅂ이므로 변 ${SIDE(TRI, i)}의 대응변은 변 ${SIDE(TRI2, i)}`, { fig }); } },
  { id:'cong-side', name:'합동인 도형에서 변의 길이 구하기', std:'6수03-01', lv:[2,3], t:'both',
    g(lv){ const T = makeTri(), how = pick([90, 180, 270, 'flip']), i = ri(0, 2);
      const e1 = {}; [0, 1, 2].forEach(j => e1[j] = `${T.sides[j]} cm`); const e2 = { [i]: '?' };
      return { q: `삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 변 ${SIDE(TRI2, i)}은(는) 몇 cm인가요?`, fig: twoFigs(T.pts, { v: TRI, e: e1 }, { v: TRI2, e: e2 }, how), ans: { k:'int', v: T.sides[i], unit:'cm' }, wrong: T.sides.filter((_, j) => j !== i), ex: `변 ${SIDE(TRI2, i)}의 대응변은 변 ${SIDE(TRI, i)}이므로 ${T.sides[i]} cm` }; } },
  { id:'cong-angle', name:'합동인 삼각형에서 각의 크기 구하기', std:'6수03-01', lv:[3,4], t:'both',
    g(lv){ const T = makeTri(), how = pick([90, 180, 270, 'flip']), ask = ri(0, 2), [i, j] = [0, 1, 2].filter(x => x !== ask);
      const a1 = lv === 3 ? { [i]: `${T.ang[i]}°`, [j]: `${T.ang[j]}°` } : { [i]: `${T.ang[i]}°` }, a2 = lv === 3 ? { [ask]: '?' } : { [j]: `${T.ang[j]}°`, [ask]: '?' };
      const nm = `각 ${TRI2[(ask + 2) % 3]}${TRI2[ask]}${TRI2[(ask + 1) % 3]}`;
      return { q: `삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. ${nm}은(는) 몇 도인가요?`, fig: twoFigs(T.pts, { v: TRI, ang: a1 }, { v: TRI2, ang: a2 }, how), ans: { k:'int', v: T.ang[ask], unit:'°' }, wrong: [T.ang[i], T.ang[j], 180 - T.ang[ask]],
        ex: `대응각의 크기는 같아요. 삼각형의 세 각의 합은 180°이므로 180° - ${T.ang[i]}° - ${T.ang[j]}° = ${T.ang[ask]}°` }; } },
  { id:'cong-peri', name:'합동인 도형의 둘레 구하기', std:'6수03-01', lv:[3,4], t:'both',
    g(){ const T = makeTri(), how = pick([90, 180, 270, 'flip']), k = ri(0, 2), others = [0, 1, 2].filter(x => x !== k);
      const e1 = { [others[0]]: `${T.sides[others[0]]} cm`, [others[1]]: `${T.sides[others[1]]} cm` }, e2 = { [k]: `${T.sides[k]} cm` }, P = sum(T.sides);
      return { q: '삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 삼각형 ㄱㄴㄷ의 둘레는 몇 cm인가요?', fig: twoFigs(T.pts, { v: TRI, e: e1 }, { v: TRI2, e: e2 }, how), ans: { k:'int', v: P, unit:'cm' }, wrong: [P - T.sides[k], P + T.sides[k], 2 * P],
        ex: `변 ${SIDE(TRI, k)} = 변 ${SIDE(TRI2, k)} = ${T.sides[k]} cm → ${T.sides.join(' + ')} = ${P}(cm)` }; } },
  { id:'cong-quad', name:'합동인 사각형에서 각의 크기 구하기', std:'6수03-01', lv:[4,5], t:'both',
    g(){ for (;;){ const pts = [[ri(0, 2), 0], [ri(6, 9), ri(-1, 1)], [ri(7, 10), ri(5, 8)], [ri(-1, 1), ri(4, 7)]];
        const angAt = i => { const p = pts[i], u = pts[(i + 3) % 4], v = pts[(i + 1) % 4]; let d = Math.abs(Math.atan2(u[1] - p[1], u[0] - p[0]) - Math.atan2(v[1] - p[1], v[0] - p[0])) * 180 / Math.PI; if (d > 180) d = 360 - d; return Math.round(d); };
        const ang = [0, 1, 2].map(angAt); ang.push(360 - sum(ang)); if (ang.some(a => a < 55 || a > 140) || new Set(ang).size < 4) continue;
        const Q1 = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], Q2 = ['ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'], ask = ri(0, 3), rest = [0, 1, 2, 3].filter(x => x !== ask);
        const a1 = { [rest[0]]: `${ang[rest[0]]}°`, [rest[1]]: `${ang[rest[1]]}°` }, a2 = { [rest[2]]: `${ang[rest[2]]}°`, [ask]: '?' };
        const nm = `각 ${Q2[(ask + 3) % 4]}${Q2[ask]}${Q2[(ask + 1) % 4]}`;
        return { q: `사각형 ㄱㄴㄷㄹ과 사각형 ㅁㅂㅅㅇ은 서로 합동입니다. ${nm}은(는) 몇 도인가요?`, fig: twoFigs(pts, { v: Q1, ang: a1 }, { v: Q2, ang: a2 }, pick([180, 'flip'])), ans: { k:'int', v: ang[ask], unit:'°' }, wrong: [180 - ang[rest[2]], ang[rest[0]], 360 - ang[rest[0]] - ang[rest[1]]].filter(x => x !== ang[ask] && x > 0),
          ex: `대응각을 옮겨 모으면 ${rest.map(r => ang[r] + '°').join(', ')} → 사각형의 네 각의 합 360°에서 빼면 ${ang[ask]}°` }; } } },
  { id:'axes', name:'대칭축의 개수 알기', std:'6수03-02', lv:[1,2], t:'both',
    g(){ const s = pick(SHAPES.filter(x => x.ax > 0)); return { q: `${s.n}의 대칭축은 모두 몇 개인가요?`, ans: { k:'int', v: s.ax, unit:'개' }, wrong: [s.ax + 1, s.ax - 1, s.ax * 2].filter(x => x !== s.ax && x >= 0), ex: `${s.n}은(는) 대칭축이 ${s.ax}개인 선대칭도형이에요.` }; } },
  { id:'sym-class', name:'선대칭도형과 점대칭도형 분류하기', std:'6수03-02', lv:[2,3], t:'mc',
    g(lv){ const k = pick(['both', 'pointOnly', 'lineOnly']);
      if (k === 'both'){ const good = pick(SHAPES.filter(x => x.ax > 0 && x.pt)), bad = sample(SHAPES.filter(x => !(x.ax > 0 && x.pt)), 3);
        return MC('선대칭도형이면서 점대칭도형인 것은 어느 것인가요?', [good.n, ...bad.map(x => x.n)], `${good.n}은(는) 대칭축이 있고, 180° 돌려도 겹쳐요.`); }
      if (k === 'pointOnly') return MC('점대칭도형이지만 선대칭도형이 <b>아닌</b> 것은 어느 것인가요?', ['평행사변형', ...sample(SHAPES.filter(x => x.n !== '평행사변형'), 3).map(x => x.n)], '평행사변형은 180° 돌리면 겹치지만, 어떤 선으로 접어도 완전히 겹치지 않아요.');
      const good = pick(SHAPES.filter(x => x.ax > 0 && !x.pt)), bad = sample(SHAPES.filter(x => x.pt), 3);
      return MC('선대칭도형이지만 점대칭도형이 <b>아닌</b> 것은 어느 것인가요?', [good.n, ...bad.map(x => x.n)], `${good.n}은(는) 대칭축은 있지만 180° 돌리면 겹치지 않아요.`); } },
  { id:'sym-side', name:'선대칭도형의 성질로 길이와 각도 구하기', std:'6수03-02', lv:[3,3], t:'both',
    g(){ const H = symHex(), pts = fitPts(H.pts, 70, 22, 220, 150), angle = Math.random() < .5;
      if (angle){ const i = pick([1, 2]), j = 6 - i; const lab = { [i]: `${H.ang[i]}°`, [j]: '?' };
        return { q: `직선 ㄱㄹ을 대칭축으로 하는 선대칭도형입니다. 각 ${N6[j - 1]}${N6[j]}${N6[(j + 1) % 6]}은(는) 몇 도인가요?`, fig: svg(360, 200, polyFig(pts, { v: N6, ang: lab, extra: [axisLine(pts)] })), ans: { k:'int', v: H.ang[i], unit:'°' }, wrong: [180 - H.ang[i], H.ang[i === 1 ? 2 : 1], H.ang[0]].filter(x => x !== H.ang[i] && x > 0), ex: `점 ${N6[i]}의 대응점은 점 ${N6[j]}이에요. 대응각의 크기는 같으므로 ${H.ang[i]}°` }; }
      const e = ri(0, 2), lab = { 0: `${H.sides[0]} cm`, 1: `${H.sides[1]} cm`, 2: `${H.sides[2]} cm` }; lab[5 - e] = '?';
      return { q: `직선 ㄱㄹ을 대칭축으로 하는 선대칭도형입니다. 변 ${SIDE(N6, 5 - e)}은(는) 몇 cm인가요?`, fig: svg(360, 200, polyFig(pts, { v: N6, e: lab, extra: [axisLine(pts)] })), ans: { k:'int', v: H.sides[e], unit:'cm' }, wrong: H.sides.filter((_, k) => k !== e), ex: `변 ${SIDE(N6, 5 - e)}의 대응변은 변 ${SIDE(N6, e)}이므로 ${H.sides[e]} cm` }; } },
  { id:'sym-peri', name:'선대칭도형의 둘레 구하기', std:'6수03-02', lv:[4,4], t:'both',
    g(){ const H = symHex(), pts = fitPts(H.pts, 70, 22, 220, 150), P = 2 * sum(H.sides);
      return { q: '직선 ㄱㄹ을 대칭축으로 하는 선대칭도형입니다. 이 도형의 둘레는 몇 cm인가요?', fig: svg(360, 200, polyFig(pts, { v: N6, e: { 0: `${H.sides[0]} cm`, 1: `${H.sides[1]} cm`, 2: `${H.sides[2]} cm` }, extra: [axisLine(pts)] })), ans: { k:'int', v: P, unit:'cm' }, wrong: [P / 2, P + 2, P - H.sides[0]], ex: `대응변의 길이가 같으므로 (${H.sides.join(' + ')}) × 2 = ${P}(cm)` }; } },
  { id:'sym-kite', name:'선대칭도형에서 각의 크기 추론하기', std:'6수03-02', lv:[5,5], t:'both',
    g(){ for (;;){ const w = ri(3, 6), h1 = ri(2, 4), h2 = h1 + ri(3, 7), pts = [[0, 0], [-w, h1], [0, h2], [w, h1]];
        const angAt = i => { const p = pts[i], u = pts[(i + 3) % 4], v = pts[(i + 1) % 4]; let d = Math.abs(Math.atan2(u[1] - p[1], u[0] - p[0]) - Math.atan2(v[1] - p[1], v[0] - p[0])) * 180 / Math.PI; if (d > 180) d = 360 - d; return Math.round(d); };
        const y = angAt(0), x = angAt(1), v = 360 - y - 2 * x; if (v <= 20) continue;
        const p = fitPts(pts, 110, 20, 140, 160), Q = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
        return { q: '직선 ㄱㄷ을 대칭축으로 하는 선대칭도형입니다. 각 ㄴㄷㄹ은(는) 몇 도인가요?', fig: svg(360, 200, polyFig(p, { v: Q, ang: { 0: `${y}°`, 1: `${x}°`, 2: '?' }, angShift: { 0: [16, 4], 2: [12, -4] }, extra: [line(p[0][0], p[0][1] - 16, p[2][0], p[2][1] + 16, { stroke: '#E5546B', dash: '6 5' })] })),
          ans: { k:'int', v, unit:'°' }, wrong: [360 - y - x, 180 - x, 180 - y].filter(z => z !== v && z > 0), ex: `각 ㄱㄹㄷ = 각 ㄱㄴㄷ = ${x}° (대응각) → 360° - ${y}° - ${x}° - ${x}° = ${v}°` }; } } },
  { id:'pt-seg', name:'점대칭도형의 성질 활용하기', std:'6수03-02', lv:[3,4], t:'both',
    g(lv){ if (lv === 3){ const a = ri(3, 12); return { q: `점대칭도형에서 대칭의 중심 ㅇ부터 점 ㄱ까지의 거리가 ${a} cm입니다. 점 ㄱ과 점 ㄱ의 대응점을 이은 선분의 길이는 몇 cm인가요?`, ans: { k:'int', v: 2 * a, unit:'cm' }, wrong: [a, a + 2, a * 4], ex: `대칭의 중심은 대응점을 이은 선분을 똑같이 둘로 나누므로 ${a} × 2 = ${2 * a}(cm)` }; }
      const a = ri(5, 14), b = ri(3, a - 1), s = ri(0, 3);
      const pts = fitPts([[s, 0], [s + a, 0], [a, b * .8], [0, b * .8]], 60, 30, 240, 120), c = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2];
      return { q: '점 ㅇ을 대칭의 중심으로 하는 점대칭도형(평행사변형)입니다. 이 도형의 둘레는 몇 cm인가요?', fig: svg(360, 190, polyFig(pts, { v: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], e: { 0: `${a} cm`, 3: `${b} cm` }, extra: [`<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#E5546B"/>`, txt(c[0] + 12, c[1] - 8, 'ㅇ', { size: 13, fill: '#E5546B', bold: true })] })),
        ans: { k:'int', v: 2 * (a + b), unit:'cm' }, wrong: [a + b, a * b, 2 * a + b], ex: `대응변의 길이가 같아요: (${a} + ${b}) × 2 = ${2 * (a + b)}(cm)` }; } },
  { id:'sym-true', name:'선대칭도형과 점대칭도형의 성질 판단하기', std:'6수03-02', lv:[2,3], t:'mc',
    g(){ const T = ['선대칭도형에서 대응변의 길이는 서로 같습니다.', '대칭축은 대응점을 이은 선분을 수직으로 이등분합니다.', '점대칭도형에서 대칭의 중심은 1개입니다.', '점대칭도형에서 대칭의 중심은 대응점을 이은 선분을 이등분합니다.', '원은 대칭축이 셀 수 없이 많습니다.'];
      const Fa = ['점대칭도형에서 대칭의 중심은 여러 개일 수 있습니다.', '선대칭도형에서 대칭축은 항상 1개입니다.', '대칭축과 대응점을 이은 선분은 서로 평행합니다.', '정사각형의 대칭축은 2개입니다.', '평행사변형은 선대칭도형입니다.'];
      const f = pick(Fa); return MC('설명으로 <b>옳지 않은</b> 것은 어느 것인가요?', [f, ...sample(T, 3)], `"${f}"는 옳지 않아요.`); } },
  { id:'sym-area', name:'선대칭도형을 완성하여 넓이 구하기', std:'6수03-02', lv:[5,5], t:'both',
    g(){ const w = ri(3, 8), h = ri(4, 10), t = ri(3, 7);
      const P = fitPts([[0, 0], [w, t], [w, t + h], [0, t + h], [0, t]], 120, 18, 150, 160), half = P.slice(0, 4), roof = P[4];
      const fig = svg(360, 200, polyFig(half, { v: ['ㄱ', '', '', 'ㄴ'], e: { 1: `${h} cm`, 2: `${w} cm` }, extra: [line(half[0][0], half[0][1] - 14, half[3][0], half[3][1] + 14, { stroke: '#E5546B', dash: '6 5' }), line(roof[0], roof[1], half[1][0], half[1][1], { stroke: '#5D6C83', dash: '3 4', w: 1.4 })] })
        + txt(half[0][0] - 30, (half[0][1] + roof[1]) / 2, `${t} cm`, { size: 14, fill: '#2a6fae', bold: true }));
      const v = 2 * w * h + w * t;
      return { q: '직선 ㄱㄴ을 대칭축으로 하는 선대칭도형의 한쪽 부분입니다. 선대칭도형을 완성했을 때, 완성한 도형의 넓이는 몇 cm²인가요?', fig,
        ans: { k:'int', v, unit:'cm²' }, wrong: [w * h + w * t / 2, 2 * w * h, v + w * t].filter(x => Number.isInteger(x) && x !== v), ex: `한쪽 넓이: 직사각형 ${w} × ${h} = ${w * h}, 삼각형 ${w} × ${t} ÷ 2 = ${w * t / 2} → 전체는 2배: ${v}(cm²)` }; } }
]});

/* ─────────────── 4. 소수의 곱셈 ─────────────── */
const nz = (lo, hi) => { let x; do { x = ri(lo, hi); } while (x % 10 === 0); return x; };
const d1 = () => dz(ri(1, 9) / 10), d2 = () => dz(nz(11, 99) / 100);
const decW = (v) => [dz(v * 10), dz(v / 10), dz(v * 100)];
const mulD = (a, b) => dz(a * b);
const decs = x => (String(x).split('.')[1] || '').length;
A.addUnit({ key:'5-2-4', title:'소수의 곱셈', items:[
  { id:'dn1', name:'(1보다 작은 소수) × (자연수)', std:'6수01-13', lv:[1,1], t:'both',
    g(){ const a = Math.random() < .6 ? d1() : d2(), n = ri(2, 9), v = mulD(a, n); return { q: `계산해 보세요.${E(`${a} × ${n}`)}`, ans: { k:'dec', v }, wrong: decW(v), ex: `자연수처럼 곱한 다음 소수점 아래 자리 수만큼 소수점을 찍어요: ${a} × ${n} = ${v}` }; } },
  { id:'dn2', name:'(1보다 큰 소수) × (자연수), (자연수) × (소수)', std:'6수01-13', lv:[1,2], t:'both',
    g(lv){ const a = lv === 1 ? dz(nz(11, 99) / 10) : dz(nz(101, 999) / 100), n = ri(2, lv === 1 ? 9 : 25), v = mulD(a, n), rev = Math.random() < .5;
      return { q: `계산해 보세요.${E(rev ? `${n} × ${a}` : `${a} × ${n}`)}`, ans: { k:'dec', v }, wrong: decW(v), ex: `${rev ? `${n} × ${a}` : `${a} × ${n}`} = ${v} (곱하는 소수의 소수점 아래 자리 수만큼 소수점을 찍어요)` }; } },
  { id:'dd1', name:'1보다 작은 소수끼리의 곱셈', std:'6수01-13', lv:[2,2], t:'both',
    g(){ const a = d1(), b = Math.random() < .5 ? d1() : d2(), v = mulD(a, b); if (v === 0) return this.g();
      return { q: `계산해 보세요.${E(`${a} × ${b}`)}`, ans: { k:'dec', v }, wrong: decW(v), ex: `${a} × ${b} = ${v} (소수점 아래 자리 수: ${decs(a)} + ${decs(b)} = ${decs(a) + decs(b)}개)` }; } },
  { id:'dd2', name:'1보다 큰 소수끼리의 곱셈', std:'6수01-13', lv:[3,3], t:'both',
    g(){ const a = dz(nz(11, 99) / 10), b = Math.random() < .5 ? dz(nz(11, 99) / 10) : dz(nz(101, 599) / 100), v = mulD(a, b);
      return { q: `계산해 보세요.${E(`${a} × ${b}`)}`, ans: { k:'dec', v }, wrong: decW(v), ex: `${a} × ${b} = ${v}` }; } },
  { id:'pow10', name:'10, 100, 1000 또는 0.1, 0.01, 0.001을 곱할 때 소수점의 위치', std:'6수01-13', lv:[2,3], t:'both',
    g(lv){ const a = pick([dz(nz(101, 9999) / 100), dz(nz(11, 999) / 10)]), k = pick([10, 100, 1000, 0.1, 0.01, 0.001]), v = mulD(a, k);
      if (lv === 2) return { q: `계산해 보세요.${E(`${a} × ${k}`)}`, ans: { k: Number.isInteger(v) ? 'int' : 'dec', v }, wrong: [mulD(a, k * 10), mulD(a, k / 10), mulD(a, 1 / k)].filter(x => x > 0), ex: `${k >= 10 ? `${k}을 곱하면 소수점이 오른쪽으로 ${String(k).length - 1}칸` : `${k}를 곱하면 소수점이 왼쪽으로 ${String(k).length - 2}칸`} 옮겨져요 → ${v}` };
      return { q: `□ 안에 알맞은 수를 구하세요.${E(`${a} × □ = ${v}`)}`, ans: { k: Number.isInteger(k) ? 'int' : 'dec', v: k }, wrong: [k * 10, k / 10, 1 / k].map(dz).filter(x => x !== k), ex: `소수점이 ${k >= 10 ? '오른쪽' : '왼쪽'}으로 옮겨졌으므로 □ = ${k}` }; } },
  { id:'use-int', name:'자연수의 곱셈을 이용하여 소수의 곱셈하기', std:'6수01-13', lv:[3,4], t:'both',
    g(lv){ const x = nz(12, 99), y = nz(12, 99), p = x * y, sa = pick([1, 2]), sb = pick([1, 2]), a = dz(x / 10 ** sa), b = dz(y / 10 ** sb), v = dz(a * b);
      if (lv === 3) return { q: `${x} × ${y} = ${nf(p)}입니다. 이를 이용하여 다음을 계산하세요.${E(`${a} × ${b}`)}`, ans: { k: Number.isInteger(v) ? 'int' : 'dec', v }, wrong: decW(v), ex: `소수점 아래 자리 수가 모두 ${sa + sb}개이므로 ${nf(p)}에서 소수점을 왼쪽으로 ${sa + sb}칸 → ${v}` };
      return { q: `${x} × ${y} = ${nf(p)}입니다. □ 안에 알맞은 수를 구하세요.${E(`${a} × □ = ${v}`)}`, ans: { k: Number.isInteger(b) ? 'int' : 'dec', v: b }, wrong: [dz(b * 10), dz(b / 10), dz(b * 100)].filter(z => z !== b), ex: `${a}의 소수점 아래 자리 수는 ${sa}개, 곱 ${v}는 ${sa + sb}개 → □는 소수 ${sb}자리 수 ${b}` }; } },
  { id:'est', name:'곱의 크기 어림하기', std:'6수01-13', lv:[3,3], t:'mc',
    g(){ const n = ri(3, 12), small = Math.random() < .5;
      const lt = `${n} × ${d1()}`, lt2 = `${dz(ri(1, 9) / 10)} × ${n}`, gt = `${n} × ${dz(ri(11, 29) / 10)}`, gt2 = `${dz(1 + ri(1, 9) / 10)} × ${n}`;
      return small ? MC(`계산 결과가 ${n}보다 <b>작은</b> 것은 어느 것인가요?`, [lt, gt, gt2, `${n} × 1`], '1보다 작은 소수를 곱하면 처음 수보다 작아져요.')
        : MC(`계산 결과가 ${n}보다 <b>큰</b> 것은 어느 것인가요?`, [gt, lt, lt2, `${n} × 1`], '1보다 큰 소수를 곱하면 처음 수보다 커져요.'); } },
  { id:'cmp', name:'소수의 곱셈 결과 비교하기', std:'6수01-13', lv:[2,3], t:'mc',
    g(){ for (;;){ const a = dz(nz(11, 99) / 10), b = d1(), c = dz(nz(11, 99) / 10), d = d1(); const x = mulD(a, b), y = mulD(c, d); if (x === y) continue;
        const s = x > y ? '>' : '<'; return MC(`계산 결과를 비교하여 ○ 안에 알맞은 것을 고르세요.${E(`${a} × ${b} ○ ${c} × ${d}`)}`, [s, ...['>', '<', '='].filter(z => z !== s)], `${a} × ${b} = ${x}, ${c} × ${d} = ${y} → ${x} ${s} ${y}`); } } },
  { id:'word1', name:'소수의 곱셈 문장제 해결하기', std:'6수01-13', lv:[3,3], t:'both',
    g(){ const S = pick([
        () => { const s = dz(ri(21, 99) / 10); return [`한 변의 길이가 ${s} cm인 정사각형의 둘레는 몇 cm인가요?`, mulD(s, 4), 'cm', `${s} × 4`]; },
        () => { const a = dz(ri(21, 99) / 10), b = dz(ri(21, 99) / 10); return [`가로 ${a} m, 세로 ${b} m인 직사각형 모양 텃밭의 넓이는 몇 m²인가요?`, mulD(a, b), 'm²', `${a} × ${b}`]; },
        () => { const a = dz(ri(11, 39) / 10), n = ri(3, 9); return [`1 m의 무게가 ${a} kg인 철근이 있습니다. 이 철근 ${n} m의 무게는 몇 kg인가요?`, mulD(a, n), 'kg', `${a} × ${n}`]; },
        () => { const h = pick([100, 120, 150, 180, 200]), r = dz(ri(51, 89) / 100); return [`${h} cm 높이에서 떨어뜨린 공이 떨어진 높이의 ${r}배만큼 튀어 올랐습니다. 공이 튀어 오른 높이는 몇 cm인가요?`, mulD(h, r), 'cm', `${h} × ${r}`]; }
      ])(); return { q: S[0], ans: { k: Number.isInteger(S[1]) ? 'int' : 'dec', v: S[1], unit: S[2] }, wrong: decW(S[1]), ex: `${S[3]} = ${S[1]}(${S[2]})` }; } },
  { id:'word2', name:'여러 단계의 소수 문장제 해결하기', std:'6수01-13', lv:[4,4], t:'both',
    g(){ const S = pick([
        () => { const L = pick([20, 30, 40, 50]), r = pick([0.8, 0.6, 0.9, 0.7]); return [`높이가 ${L} cm인 인형 안에서 꺼낸 인형의 높이는 바깥 인형 높이의 ${r}배입니다. 두 번째로 꺼낸 인형의 높이는 몇 cm인가요?`, dz(L * r * r), 'cm', `${L} × ${r} × ${r} = ${dz(L * r * r)}`]; },
        () => { const v = dz(ri(601, 899) / 10), h = pick([1.5, 2.5, 3.5]); return [`한 시간에 ${v} km를 가는 자동차가 같은 빠르기로 ${Math.floor(h)}시간 30분 동안 간 거리는 몇 km인가요?`, mulD(v, h), 'km', `${Math.floor(h)}시간 30분 = ${h}시간 → ${v} × ${h} = ${mulD(v, h)}`]; },
        () => { const a = dz(ri(21, 69) / 100), k = ri(2, 4); return [`집에서 학교까지의 거리는 ${a} km이고, 학교에서 공원까지의 거리는 집에서 학교까지 거리의 ${k}배입니다. 집에서 학교를 거쳐 공원까지 가는 거리는 몇 km인가요?`, dz(a + a * k), 'km', `${a} + ${a} × ${k} = ${dz(a + a * k)}`]; },
        () => { const w = dz(ri(81, 129) / 10), h = ri(6, 10), r = 1.2; return [`가로 ${w} cm, 세로 ${h} cm인 직사각형의 가로와 세로를 각각 ${r}배로 늘였습니다. 늘인 직사각형의 넓이는 몇 cm²인가요?`, dz(w * r * h * r), 'cm²', `${dz(w * r)} × ${dz(h * r)} = ${dz(w * r * h * r)}`]; }
      ])(); return { q: S[0], ans: { k: Number.isInteger(S[1]) ? 'int' : 'dec', v: S[1], unit: S[2] }, wrong: decW(S[1]), ex: S[3] + `(${S[2]})` }; } },
  { id:'trees', name:'간격과 소수의 곱셈', std:'6수01-13', lv:[4,4], t:'both',
    g(){ const d = dz(ri(151, 495) / 100), n = ri(4, 9), v = mulD(d, n - 1);
      return { q: `곧은 길에 나무 ${n}그루를 ${d} m 간격으로 한 줄로 심었습니다. 처음 나무부터 마지막 나무까지의 거리는 몇 m인가요? (나무의 굵기는 생각하지 않습니다.)`, ans: { k:'dec', v, unit:'m' }, wrong: [mulD(d, n), mulD(d, n + 1)], ex: `간격 수 = ${n} - 1 = ${n - 1} → ${d} × ${n - 1} = ${v}(m)` }; } },
  { id:'ineq', name:'곱셈 결과로 □ 안에 들어갈 자연수 구하기', std:'6수01-13', lv:[4,5], t:'both',
    g(){ for (;;){ const a = dz(ri(11, 99) / 100), n = ri(6, 30), v = mulD(a, n); if (Number.isInteger(v)) continue; const c = Math.floor(v);
        if (Math.random() < .5) return { q: `□ 안에 들어갈 수 있는 가장 작은 자연수를 구하세요.${E(`${a} × ${n} &lt; □`)}`, ans: { k:'int', v: c + 1 }, wrong: [c, c + 2], ex: `${a} × ${n} = ${v}이므로 □는 ${c + 1}부터 가능해요.` };
        if (c < 1) continue; return { q: `□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?${E(`□ &lt; ${a} × ${n}`)}`, ans: { k:'int', v: c, unit:'개' }, wrong: [c + 1, c - 1].filter(x => x >= 0), ex: `${a} × ${n} = ${v}이므로 1부터 ${c}까지 ${c}개` }; } } },
  { id:'cards', name:'수 카드로 곱이 가장 큰 곱셈식 만들기', std:'6수01-13', lv:[5,5], t:'both',
    g(){ const c = sample(range(1, 9), 4).sort((a, b) => b - a); let best = 0, bestS = '';
      const perms = []; const P = (arr, cur) => { if (!arr.length){ perms.push(cur); return; } arr.forEach((x, i) => P(arr.filter((_, j) => j !== i), [...cur, x])); }; P(c, []);
      perms.forEach(p => { const a = dz(p[0] + p[1] / 10), b = dz(p[2] + p[3] / 10), v = mulD(a, b); if (v > best){ best = v; bestS = `${a} × ${b}`; } });
      return { q: `수 카드 ${c.map(x => `<span class="card">${x}</span>`).join(' ')}을 한 번씩 모두 사용하여 (소수 한 자리 수) × (소수 한 자리 수)를 만들려고 합니다. 곱이 가장 클 때의 곱을 구하세요.${E('□.□ × □.□')}`, ans: { k:'dec', v: best }, wrong: [mulD(dz(c[0] + c[1] / 10), dz(c[2] + c[3] / 10)), dz(best * 10)].filter(z => z !== best), ex: `큰 수를 일의 자리에 나누어 놓아요: ${bestS} = ${best}` }; } },
  { id:'reverse', name:'곱셈식의 □를 거꾸로 구하기', std:'6수01-13', lv:[5,5], t:'both',
    g(){ const x = nz(101, 999), y = nz(11, 99), p = x * y, a = dz(x / 100), b = dz(y / 10), v = dz(a * b);
      return { q: `${x} × ${y} = ${nf(p)}입니다. ㉠과 ㉡에 알맞은 수의 합을 구하세요.${E(`㉠ × ${b} = ${v}　　${a} × ㉡ = ${dz(a * y / 100)}`)}`, ans: { k:'dec', v: dz(a + y / 100) }, wrong: [dz(a + b), dz(a * 10 + y / 100), dz(a + y / 10)].filter(z => z !== dz(a + y / 100)), ex: `㉠ = ${a}, ㉡ = ${dz(y / 100)} → ${a} + ${dz(y / 100)} = ${dz(a + y / 100)}` }; } }
]});

/* ─────────────── 5. 직육면체 ─────────────── */
const FACES = { top:'ㄱㄴㄷㄹ', bottom:'ㅁㅂㅅㅇ', front:'ㄱㄴㅂㅁ', back:'ㄹㄷㅅㅇ', left:'ㄱㄹㅇㅁ', right:'ㄴㄷㅅㅂ' };
const OPP = { top:'bottom', bottom:'top', front:'back', back:'front', left:'right', right:'left' };
const LETTERS = ['가', '나', '다', '라', '마', '바'];
A.addUnit({ key:'5-2-5', title:'직육면체', items:[
  { id:'count', name:'직육면체의 면, 모서리, 꼭짓점의 수 알기', std:'6수03-03', lv:[1,1], t:'both',
    g(){ const [w, v] = pick([['면', 6], ['모서리', 12], ['꼭짓점', 8]]), sh = pick(['직육면체', '정육면체']);
      return { q: `${sh}의 ${w}은(는) 모두 몇 개인가요?`, ans: { k:'int', v, unit:'개' }, wrong: [6, 8, 12, 4].filter(x => x !== v), ex: `${sh}: 면 6개, 모서리 12개, 꼭짓점 8개` }; } },
  { id:'visible', name:'겨냥도에서 보이는 것과 보이지 않는 것', std:'6수03-04', lv:[1,2], t:'both',
    g(){ const [w, s, v] = pick([['모서리', '보이지 않는', 3], ['모서리', '보이는', 9], ['꼭짓점', '보이는', 7], ['꼭짓점', '보이지 않는', 1], ['면', '보이는', 3], ['면', '보이지 않는', 3]]);
      return { q: `직육면체의 겨냥도에서 ${s} ${w}은(는) 몇 개인가요?`, fig: cuboidFig(ri(5, 9), ri(3, 6), ri(3, 6), { names: false }), ans: { k:'int', v, unit:'개' }, wrong: [3, 9, 7, 1, 4, 12].filter(x => x !== v), ex: '겨냥도에서 보이지 않는 모서리 3개는 점선으로 그려요. 보이는 모서리 9개, 보이는 꼭짓점 7개, 보이는 면 3개예요.' }; } },
  { id:'true', name:'직육면체와 정육면체의 성질 판단하기', std:'6수03-03', lv:[2,3], t:'mc',
    g(){ const T = ['정육면체는 직육면체라고 할 수 있습니다.', '직육면체에서 평행한 면은 모두 3쌍입니다.', '직육면체에서 한 면과 수직인 면은 4개입니다.', '직육면체의 한 꼭짓점에서 만나는 모서리는 3개입니다.', '정육면체는 모든 모서리의 길이가 같습니다.'];
      const Fa = ['직육면체는 정육면체라고 할 수 있습니다.', '직육면체에서 평행한 면은 모두 6쌍입니다.', '직육면체에서 한 면과 수직인 면은 2개입니다.', '정육면체의 꼭짓점은 12개입니다.', '직육면체는 모든 모서리의 길이가 같습니다.'];
      const f = pick(Fa); return MC('설명으로 <b>옳지 않은</b> 것은 어느 것인가요?', [f, ...sample(T, 3)], `"${f}"는 옳지 않아요.`); } },
  { id:'edge-sum', name:'모서리의 길이의 합 구하기', std:'6수03-03', lv:[2,3], t:'both',
    g(lv){ if (lv === 2 && Math.random() < .5){ const a = ri(3, 15); return { q: `한 모서리의 길이가 ${a} cm인 정육면체의 모든 모서리의 길이의 합은 몇 cm인가요?`, ans: { k:'int', v: 12 * a, unit:'cm' }, wrong: [6 * a, 8 * a, 4 * a], ex: `모서리 12개 → ${a} × 12 = ${12 * a}(cm)` }; }
      const a = ri(4, 12), b = ri(3, 9), c = ri(3, 9); return { q: '직육면체의 모든 모서리의 길이의 합은 몇 cm인가요?', fig: cuboidFig(a, b, c, { names: false, dims: [`${a} cm`, `${b} cm`, `${c} cm`] }), ans: { k:'int', v: 4 * (a + b + c), unit:'cm' }, wrong: [2 * (a + b + c), a + b + c, 3 * (a + b + c)], ex: `길이가 같은 모서리가 4개씩 → (${a} + ${b} + ${c}) × 4 = ${4 * (a + b + c)}(cm)` }; } },
  { id:'hidden-sum', name:'보이지 않는 모서리의 길이의 합 구하기', std:'6수03-04', lv:[3,3], t:'both',
    g(){ const a = ri(4, 12), b = ri(3, 9), c = ri(3, 9); return { q: '직육면체의 겨냥도에서 보이지 않는 모서리의 길이의 합은 몇 cm인가요?', fig: cuboidFig(a, b, c, { names: false, dims: [`${a} cm`, `${b} cm`, `${c} cm`] }), ans: { k:'int', v: a + b + c, unit:'cm' }, wrong: [4 * (a + b + c), 3 * (a + b + c), 2 * (a + b + c)], ex: `보이지 않는 모서리는 가로, 세로, 높이 하나씩 3개 → ${a} + ${b} + ${c} = ${a + b + c}(cm)` }; } },
  { id:'cube-from-sum', name:'모서리의 길이의 합으로 정육면체의 한 모서리 구하기', std:'6수03-03', lv:[3,3], t:'both',
    g(){ const a = ri(3, 15); if (Math.random() < .5) return { q: `모든 모서리의 길이의 합이 ${12 * a} cm인 정육면체의 한 모서리는 몇 cm인가요?`, ans: { k:'int', v: a, unit:'cm' }, wrong: [12 * a / 6, 12 * a / 8, 12 * a / 4], ex: `${12 * a} ÷ 12 = ${a}(cm)` };
      return { q: `정육면체의 한 면의 네 모서리의 길이의 합이 ${4 * a} cm입니다. 이 정육면체의 모든 모서리의 길이의 합은 몇 cm인가요?`, ans: { k:'int', v: 12 * a, unit:'cm' }, wrong: [24 * a, 8 * a, 6 * a], ex: `한 모서리 ${4 * a} ÷ 4 = ${a}(cm) → ${a} × 12 = ${12 * a}(cm)` }; } },
  { id:'par-face', name:'직육면체에서 평행한 면, 수직인 면 찾기', std:'6수03-03', lv:[2,3], t:'mc',
    g(lv){ const f = pick(Object.keys(FACES)), fig = cuboidFig(ri(6, 9), ri(4, 6), ri(4, 6), { shade: FACES[f].split('') });
      if (lv === 2 || Math.random() < .5) return MC(`색칠한 면(면 ${FACES[f]})과 평행한 면은 어느 것인가요?`, [`면 ${FACES[OPP[f]]}`, ...sample(Object.keys(FACES).filter(x => x !== f && x !== OPP[f]), 3).map(x => `면 ${FACES[x]}`)], `마주 보는 면이 평행해요: 면 ${FACES[OPP[f]]}`, { fig });
      return MC(`색칠한 면(면 ${FACES[f]})과 수직인 면이 <b>아닌</b> 것은 어느 것인가요?`, [`면 ${FACES[OPP[f]]}`, ...sample(Object.keys(FACES).filter(x => x !== f && x !== OPP[f]), 3).map(x => `면 ${FACES[x]}`)], `한 면과 수직인 면은 이웃한 4개이고, 마주 보는 면 ${FACES[OPP[f]]}은(는) 평행해요.`, { fig }); } },
  { id:'rel-count', name:'평행한 면, 수직인 면의 수 알기', std:'6수03-03', lv:[2,3], t:'both',
    g(){ const [q, v, w] = pick([['직육면체에서 한 면과 수직인 면은 몇 개인가요?', 4, [2, 5, 1]], ['직육면체에서 서로 평행한 면은 모두 몇 쌍인가요?', 3, [6, 2, 4]], ['직육면체에서 한 꼭짓점에서 만나는 면은 몇 개인가요?', 3, [4, 2, 6]], ['직육면체에서 한 면과 평행한 면은 몇 개인가요?', 1, [2, 3, 4]]]);
      return { q, ans: { k:'int', v, unit: q.includes('쌍') ? '쌍' : '개' }, wrong: w, ex: '직육면체: 평행한 면 3쌍, 한 면과 수직인 면 4개, 한 꼭짓점에서 만나는 면 3개' }; } },
  { id:'dice', name:'주사위의 마주 보는 면 활용하기', std:'6수03-03', lv:[3,4], t:'both',
    g(lv){ const a = ri(1, 6); if (lv === 3) return { q: `주사위에서 마주 보는 면의 눈의 수의 합은 7입니다. 눈의 수가 ${a}인 면과 평행한 면의 눈의 수는 얼마인가요?`, ans: { k:'int', v: 7 - a }, wrong: [a, 6 - a, 8 - a].filter(x => x > 0 && x <= 6 && x !== 7 - a), ex: `평행한 면 = 마주 보는 면 → 7 - ${a} = ${7 - a}` };
      return { q: `주사위에서 마주 보는 면의 눈의 수의 합은 7입니다. 눈의 수가 ${a}인 면과 수직인 면들의 눈의 수를 모두 더하면 얼마인가요?`, ans: { k:'int', v: 14 }, wrong: [21 - a, 7, 21], ex: `전체 합 21에서 ${a}와 마주 보는 ${7 - a}를 빼요: 21 - 7 = 14` }; } },
  { id:'shade-peri', name:'평행한 면의 둘레 구하기', std:'6수03-03', lv:[3,4], t:'both',
    g(){ const a = ri(5, 12), b = ri(3, 8), c = ri(3, 8), f = pick(['top', 'front', 'right']), dims = { top: [a, b], front: [a, c], right: [b, c] }[f];
      return { q: `색칠한 면과 평행한 면의 둘레는 몇 cm인가요?`, fig: cuboidFig(a, b, c, { names: false, dims: [`${a} cm`, `${b} cm`, `${c} cm`], shade: FACES[f].split('') }), ans: { k:'int', v: 2 * (dims[0] + dims[1]), unit:'cm' }, wrong: [dims[0] * dims[1], dims[0] + dims[1], 2 * (a + b + c)], ex: `평행한 면은 색칠한 면과 크기가 같아요: (${dims[0]} + ${dims[1]}) × 2 = ${2 * (dims[0] + dims[1])}(cm)` }; } },
  { id:'net-par', name:'정육면체 전개도에서 평행한 면 찾기', std:'6수03-04', lv:[3,4], t:'mc',
    g(){ const cells = pick(CUBE_NETS), lab = shuffle(LETTERS), fn = foldNet(cells), i = ri(0, 5), o = fn.opposite(i);
      const others = sample(range(0, 5).filter(j => j !== i && j !== o), 3).map(j => `면 ${lab[j]}`);
      return MC(`정육면체의 전개도를 접었을 때 면 ${lab[i]}와(과) 평행한 면은 어느 것인가요?`, [`면 ${lab[o]}`, ...others], `전개도를 접으면 면 ${lab[i]}와(과) 마주 보는 면은 면 ${lab[o]}예요.`, { fig: netFig(cells, lab) }); } },
  { id:'net-perp', name:'정육면체 전개도에서 수직인 면 찾기', std:'6수03-04', lv:[4,5], t:'mc',
    g(){ const cells = pick(CUBE_NETS), lab = shuffle(LETTERS), fn = foldNet(cells), i = ri(0, 5), o = fn.opposite(i);
      const perp = sample(range(0, 5).filter(j => j !== i && j !== o), 3).map(j => `면 ${lab[j]}`);
      return MC(`정육면체의 전개도를 접었을 때 면 ${lab[i]}와(과) 수직인 면이 <b>아닌</b> 것은 어느 것인가요?`, [`면 ${lab[o]}`, ...perp], `면 ${lab[i]}와(과) 마주 보는 면 ${lab[o]}는 평행하고, 나머지 4개 면은 수직이에요.`, { fig: netFig(cells, lab) }); } },
  { id:'net-valid', name:'정육면체의 전개도가 될 수 있는 것 찾기', std:'6수03-04', lv:[4,4], t:'mc',
    g(){ const good = netFig(pick(CUBE_NETS), [], 26), bad = sample(NON_NETS, 3).map(c => netFig(c, [], 26));
      return MC('정육면체의 전개도가 될 수 있는 것은 어느 것인가요?', [good, ...bad], '접었을 때 겹치는 면이 없고 6개의 면이 모두 만나는 것이 전개도예요.', { gridChoices: true }); } },
  { id:'painted', name:'쌓은 정육면체의 겉면 칠하기 추론', std:'6수03-03', lv:[5,5], t:'both',
    g(){ const n = ri(3, 5), k = pick([3, 2, 1, 0]), v = k === 3 ? 8 : k === 2 ? 12 * (n - 2) : k === 1 ? 6 * (n - 2) ** 2 : (n - 2) ** 3;
      return { q: `크기가 같은 작은 정육면체 ${n ** 3}개를 쌓아 가로, 세로, 높이가 각각 ${n}칸인 큰 정육면체를 만들고 겉면에 모두 색을 칠했습니다. 작은 정육면체 중 ${k === 0 ? '어느 면에도 색이 칠해지지 않은' : `${k}개의 면에만 색이 칠해진`} 것은 몇 개인가요?`, ans: { k:'int', v, unit:'개' },
        wrong: [8, 12 * (n - 2), 6 * (n - 2) ** 2, (n - 2) ** 3, 12, 6].filter(x => x !== v), ex: k === 3 ? '꼭짓점에 있는 8개' : k === 2 ? `모서리 12개마다 가운데 ${n - 2}개 → ${12 * (n - 2)}개` : k === 1 ? `면 6개마다 가운데 ${(n - 2) ** 2}개 → ${6 * (n - 2) ** 2}개` : `안쪽 ${n - 2} × ${n - 2} × ${n - 2} = ${(n - 2) ** 3}개` }; } },
  { id:'max-cube', name:'직육면체를 잘라 만들 수 있는 가장 큰 정육면체', std:'6수03-03', lv:[2,3], t:'both',
    g(){ const d = sample(range(4, 16), 3); return { q: `가로 ${d[0]} cm, 세로 ${d[1]} cm, 높이 ${d[2]} cm인 직육면체 모양 나무토막을 잘라서 가장 큰 정육면체를 만들려고 합니다. 정육면체의 한 모서리는 몇 cm로 해야 하나요?`, ans: { k:'int', v: Math.min(...d), unit:'cm' }, wrong: [Math.max(...d), d.slice().sort((a, b) => a - b)[1], Math.round(sum(d) / 3)].filter(x => x !== Math.min(...d)), ex: `가장 짧은 모서리 ${Math.min(...d)} cm보다 길 수 없어요.` }; } }
]});

/* ─────────────── 6. 평균과 가능성 ─────────────── */
const meanSet = (n, lo, hi) => { for (;;){ const v = range(1, n).map(() => ri(lo, hi)); if (sum(v) % n === 0) return v; } };
const WORDS = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'];
const wordOf = (num, den) => num === 0 ? 0 : num === den ? 4 : num * 2 === den ? 2 : num * 2 < den ? 1 : 3;
const EVENTS = () => pick([
  () => { const k = ri(1, 7); const opts = [
      [`주사위를 한 번 굴릴 때 나온 눈의 수가 ${k} 이상일 가능성`, range(1, 6).filter(x => x >= k).length, 6],
      ['주사위를 한 번 굴릴 때 나온 눈의 수가 짝수일 가능성', 3, 6], ['주사위를 한 번 굴릴 때 나온 눈의 수가 7일 가능성', 0, 6],
      ['주사위를 한 번 굴릴 때 나온 눈의 수가 6 이하일 가능성', 6, 6], [`주사위를 한 번 굴릴 때 나온 눈의 수가 ${k <= 6 ? k : 6}일 가능성`, 1, 6],
      ['주사위를 한 번 굴릴 때 나온 눈의 수가 6의 약수일 가능성', 4, 6]]; return pick(opts); },
  () => { const n = pick([8, 10, 12]); const opts = [
      [`1부터 ${n}까지의 수 카드 중 한 장을 뽑을 때 홀수가 나올 가능성`, n / 2, n], [`1부터 ${n}까지의 수 카드 중 한 장을 뽑을 때 ${n + 1}이 나올 가능성`, 0, n],
      [`1부터 ${n}까지의 수 카드 중 한 장을 뽑을 때 ${n} 이하인 수가 나올 가능성`, n, n], [`1부터 ${n}까지의 수 카드 중 한 장을 뽑을 때 3 이상인 수가 나올 가능성`, n - 2, n],
      [`1부터 ${n}까지의 수 카드 중 한 장을 뽑을 때 4의 배수가 나올 가능성`, Math.floor(n / 4), n]]; return pick(opts); },
  () => { const r = ri(0, 6), b = 6 - r; return [`빨간 구슬 ${r}개와 파란 구슬 ${b}개가 들어 있는 주머니에서 구슬 1개를 꺼낼 때 빨간 구슬이 나올 가능성`, r, 6]; },
  () => pick([['동전 1개를 던질 때 그림 면이 나올 가능성', 1, 2], ['내일 해가 동쪽에서 뜰 가능성', 1, 1], ['12월 다음에 1월이 올 가능성', 1, 1], ['계산기에 1+1을 눌렀을 때 3이 나올 가능성', 0, 1]])
])();
A.addUnit({ key:'5-2-6', title:'평균과 가능성', items:[
  { id:'mean', name:'평균 구하기', std:'6수04-01', lv:[1,2], t:'both',
    g(lv){ const n = lv === 1 ? ri(3, 4) : ri(4, 6), [what, u, lo, hi] = pick([['줄넘기 기록', '회', 40, 90], ['읽은 책 수', '권', 2, 15], ['제자리멀리뛰기 기록', 'cm', 120, 170], ['사과의 무게', 'g', 240, 330]]);
      const v = meanSet(n, lo, hi), who = sample(NAMES, n); if (lv === 2 && u === '권' && Math.random() < .5){ v[ri(0, n - 1)] = 0; if (sum(v) % n) return this.g(lv); }
      const m = sum(v) / n;
      return { q: `${what}의 평균은 몇 ${u}인가요?${tableH([['이름', ...who], [`${what}(${u})`, ...v]])}`, ans: { k:'int', v: m, unit: u }, wrong: [Math.round(sum(v) / (n - 1)) | 0, sum(v), m + 1].filter(x => x !== m && Number.isInteger(x)), ex: `(${v.join(' + ')}) ÷ ${n} = ${sum(v)} ÷ ${n} = ${m}(${u})${v.includes(0) ? ' — 0도 자료의 수에 넣어요.' : ''}` }; } },
  { id:'unknown', name:'평균을 이용하여 모르는 자료 값 구하기', std:'6수04-01', lv:[2,3], t:'both',
    g(){ const n = ri(4, 5), m = ri(20, 60), v = range(1, n).map(() => m + ri(-12, 12)); const s = m * n - sum(v.slice(0, -1)); if (s <= 0) return this.g(); v[n - 1] = s;
      const who = sample(NAMES, n);
      return { q: `${n}명이 접은 종이학 수의 평균이 ${m}개입니다. ${who[n - 1]}가 접은 종이학은 몇 개인가요?${tableH([['이름', ...who], ['종이학 수(개)', ...v.slice(0, -1), '?']])}`, ans: { k:'int', v: s, unit:'개' }, wrong: [m, m * n - sum(v.slice(0, -1)) + m, Math.round(sum(v.slice(0, -1)) / (n - 1))].filter(x => x !== s), ex: `합계 = ${m} × ${n} = ${m * n} → ${m * n} - ${sum(v.slice(0, -1))} = ${s}(개)` }; } },
  { id:'total', name:'평균을 이용하여 전체 양 구하기', std:'6수04-01', lv:[2,2], t:'both',
    g(){ const m = ri(15, 120), d = pick([5, 6, 7, 10]); return { q: `${pick(NAMES)}는 하루에 평균 ${m}번씩 줄넘기를 합니다. ${d}일 동안 한 줄넘기는 모두 몇 번인가요?`, ans: { k:'int', v: m * d, unit:'번' }, wrong: [m + d, m * (d - 1), m], ex: `${m} × ${d} = ${m * d}(번)` }; } },
  { id:'compare', name:'자료의 수가 다른 두 모둠의 평균 비교하기', std:'6수04-01', lv:[3,3], t:'mc',
    g(){ for (;;){ const a = meanSet(4, 3, 12), b = meanSet(5, 3, 12), ma = sum(a) / 4, mb = sum(b) / 5; if (ma === mb || sum(a) === sum(b)) continue;
        const better = ma > mb ? '가 모둠' : '나 모둠';
        return MC(`모둠별로 고리 던지기를 하여 넣은 고리의 수입니다. 한 사람당 넣은 고리 수가 더 많은 모둠은 어느 모둠인가요?${tableH([['가 모둠(4명)', ...a, ''], ['나 모둠(5명)', ...b]])}`, [better, better === '가 모둠' ? '나 모둠' : '가 모둠', '두 모둠이 같습니다'], `가 모둠 평균 ${sum(a)} ÷ 4 = ${ma}, 나 모둠 평균 ${sum(b)} ÷ 5 = ${mb} → ${better} (모둠원 수가 다르면 합이 아니라 평균으로 비교해요)`); } } },
  { id:'same-mean', name:'두 모둠의 평균이 같을 때 모르는 값 구하기', std:'6수04-01', lv:[4,4], t:'both',
    g(){ for (;;){ const a = meanSet(4, 2, 9), m = sum(a) / 4, b = range(1, 4).map(() => ri(2, 9)), x = m * 5 - sum(b); if (x <= 0 || x > 15) continue;
        return { q: `가 모둠과 나 모둠의 평균이 같습니다. 나 모둠의 ${NAMES[ri(0, 11)]}가 캔 감자는 몇 kg인가요?${tableH([['가 모둠(kg)', ...a, ''], ['나 모둠(kg)', ...b, '?']])}`, ans: { k:'int', v: x, unit:'kg' }, wrong: [m, m * 4 - sum(b), x + 1].filter(z => z !== x && z > 0), ex: `가 모둠 평균 ${sum(a)} ÷ 4 = ${m} → 나 모둠 합계 ${m} × 5 = ${m * 5} → ${m * 5} - ${sum(b)} = ${x}(kg)` }; } } },
  { id:'weekday', name:'조건에 맞는 자료만 골라 평균 구하기', std:'6수04-01', lv:[4,4], t:'both',
    g(){ const wk = meanSet(5, 15, 35), we = [ri(40, 70), ri(40, 70)], days = ['월', '화', '수', '목', '금', '토', '일'];
      return { q: `도서관의 요일별 방문자 수입니다. <b>평일(월~금)</b> 방문자 수의 평균은 몇 명인가요?${tableH([['요일', ...days], ['방문자 수(명)', ...wk, ...we]])}`, ans: { k:'int', v: sum(wk) / 5, unit:'명' }, wrong: [Math.round((sum(wk) + sum(we)) / 7), Math.round(sum(wk) / 7), sum(wk) / 5 + 1], ex: `평일 5일만: (${wk.join(' + ')}) ÷ 5 = ${sum(wk) / 5}(명)` }; } },
  { id:'need', name:'목표 평균을 위해 필요한 점수 구하기', std:'6수04-01', lv:[4,5], t:'both',
    g(lv){ for (;;){ const k = ri(3, 4), m = ri(70, 90), target = m + ri(1, 3), need = target * (k + 1) - m * k; if (need > 100 || need <= target) continue;
        return { q: `${pick(NAMES)}의 수학 시험 ${k}회까지의 점수 평균은 ${m}점입니다. ${k + 1}회까지의 평균이 ${target}점이 되려면 ${k + 1}회에 몇 점을 받아야 하나요?`, ans: { k:'int', v: need, unit:'점' }, wrong: [target, target + (target - m), 100].filter(z => z !== need), ex: `${k + 1}회까지 합계 ${target} × ${k + 1} = ${target * (k + 1)}, ${k}회까지 합계 ${m} × ${k} = ${m * k} → ${need}점` }; } } },
  { id:'graph', name:'평균을 구하여 그래프 해석하기', std:'6수04-01', lv:[5,5], t:'both',
    g(){ const n = 5, v = meanSet(n, 4, 20), m = sum(v) / n, who = sample(NAMES, n); if (v.every(x => x === m)) return this.g();
      const above = v.filter(x => x > m).length;
      return { q: `학생들이 한 달 동안 읽은 책 수를 나타낸 막대그래프입니다. 읽은 책 수가 평균보다 <b>많은</b> 학생은 몇 명인가요?`, fig: barsFig(v, who, '권'), ans: { k:'int', v: above, unit:'명' }, wrong: [v.filter(x => x >= m).length, n - above, above + 1].filter(z => z !== above && z >= 0), ex: `평균 = (${v.join(' + ')}) ÷ ${n} = ${m}(권) → 평균보다 많은 학생: ${who.filter((_, i) => v[i] > m).join(', ') || '없음'}` }; } },
  { id:'mean-true', name:'평균에 대한 설명 판단하기', std:'6수04-01', lv:[3,3], t:'mc',
    g(){ const m = ri(6, 9), n = ri(20, 30);
      return MC(`우리 반 ${n}명이 퀴즈 10문제를 풀었는데 맞힌 문제 수의 평균이 ${m}개입니다. 옳은 설명은 어느 것인가요?`, [`반 전체가 맞힌 문제는 모두 ${m * n}개입니다.`, `모든 학생이 ${m}개씩 맞혔습니다.`, `${m}개를 맞힌 학생이 가장 많습니다.`, `${m}개보다 적게 맞힌 학생은 없습니다.`], `평균 × 자료의 수 = 전체 합계 → ${m} × ${n} = ${m * n}. 평균이 ${m}이라고 모두 ${m}개를 맞힌 것은 아니에요.`); } },
  { id:'word', name:'일이 일어날 가능성을 말로 나타내기', std:'6수04-04', lv:[1,2], t:'mc',
    g(){ const [s, a, b] = EVENTS(), w = wordOf(a, b);
      return MC(`다음 일이 일어날 가능성을 말로 나타낸 것으로 알맞은 것은 어느 것인가요?<div class="say">${s}</div>`, [WORDS[w], ...sample(WORDS.filter((_, i) => i !== w), 3)], `전체 ${b}가지 중 ${a}가지 → "${WORDS[w]}"`); } },
  { id:'num', name:'일이 일어날 가능성을 수로 나타내기', std:'6수04-05', lv:[2,2], t:'mc',
    g(){ for (;;){ const [s, a, b] = EVENTS(); if (!(a === 0 || a === b || a * 2 === b)) continue; const v = a === 0 ? '0' : a === b ? '1' : '1/2';
        return MC(`다음 일이 일어날 가능성을 수로 나타내면 얼마인가요?<div class="say">${s}</div>`, [v === '1/2' ? fr(1, 2) : v, ...['0', fr(1, 2), '1'].filter(x => x !== (v === '1/2' ? fr(1, 2) : v))], `불가능하면 0, 반반이면 ${fr(1, 2)}, 확실하면 1 → ${v === '1/2' ? fr(1, 2) : v}`); } } },
  { id:'spin', name:'회전판에서 가능성 비교하기', std:'6수04-04', lv:[3,3], t:'mc',
    g(){ const reds = sample([1, 2, 3, 4, 5, 6, 7], 3), names = ['가', '나', '다'];
      const figs = reds.map((r, i) => spinnerFig([{ w: r, color: '#F28B9B' }, { w: 8 - r, color: '#BFE3FF' }], 52).replace('class="fig ', `class="fig spin `) + `<div class="cap">${names[i]}</div>`);
      const best = reds.indexOf(Math.max(...reds));
      return MC(`화살을 돌렸을 때 화살이 <b>빨간색</b>에 멈출 가능성이 가장 높은 회전판은 어느 것인가요?<div class="figrow">${figs.map(f => `<div>${f}</div>`).join('')}</div>`, [`회전판 ${names[best]}`, ...names.filter((_, i) => i !== best).map(n => `회전판 ${n}`)], `빨간색 부분이 가장 넓은 회전판 ${names[best]}에서 가능성이 가장 높아요.`); } },
  { id:'reverse', name:'가능성을 보고 구슬의 수 구하기', std:'6수04-05', lv:[3,4], t:'both',
    g(){ const n = pick([4, 6, 8, 10, 12]), k = pick(['half', 'one', 'zero']);
      if (k === 'half') return { q: `주머니에 구슬이 ${n}개 들어 있습니다. 이 주머니에서 구슬 1개를 꺼낼 때 빨간 구슬일 가능성이 ${fr(1, 2)}입니다. 빨간 구슬은 몇 개인가요?`, ans: { k:'int', v: n / 2, unit:'개' }, wrong: [n, 1, 2, n / 2 + 1].filter(x => x !== n / 2), ex: `가능성 ${fr(1, 2)} = 반반 → ${n}개의 절반 ${n / 2}개` };
      if (k === 'one') return { q: `주머니에 구슬이 ${n}개 들어 있습니다. 이 주머니에서 구슬 1개를 꺼낼 때 빨간 구슬일 가능성이 1입니다. 빨간 구슬은 몇 개인가요?`, ans: { k:'int', v: n, unit:'개' }, wrong: [1, n / 2, n - 1], ex: `가능성 1 = 확실하다 → 모두 빨간 구슬 ${n}개` };
      return { q: `주머니에 구슬이 ${n}개 들어 있습니다. 이 주머니에서 구슬 1개를 꺼낼 때 빨간 구슬일 가능성이 0입니다. 빨간 구슬은 몇 개인가요?`, ans: { k:'int', v: 0, unit:'개' }, wrong: [1, n / 2, n], ex: '가능성 0 = 불가능하다 → 빨간 구슬은 없어요(0개).' }; } },
  { id:'experiment', name:'실험 결과로 가능성 예상하기', std:'6수04-06', lv:[4,5], t:'mc',
    g(){ const cols = ['빨강', '노랑', '파랑'], w = shuffle([ri(50, 70), ri(10, 25), ri(10, 25)]), tot = sum(w), big = w.indexOf(Math.max(...w));
      return MC(`회전판을 ${tot}번 돌려 화살이 멈춘 색깔을 기록했습니다. 이 회전판을 한 번 더 돌릴 때 화살이 멈출 가능성이 가장 높은 색깔은 무엇인가요?${tableH([['색깔', ...cols], ['멈춘 횟수(번)', ...w]])}`, [cols[big], ...cols.filter((_, i) => i !== big), '모두 같습니다'], `${cols[big]}에 ${w[big]}번으로 가장 많이 멈췄으므로 ${cols[big]} 부분이 가장 넓을 것으로 예상해요.`); } },
  { id:'order', name:'일이 일어날 가능성의 순서 정하기', std:'6수04-04', lv:[4,4], t:'mc',
    g(){ for (;;){ const ev = [EVENTS(), EVENTS(), EVENTS()]; const p = ev.map(e => e[1] / e[2]); if (new Set(p).size < 3 || new Set(ev.map(e => e[0])).size < 3) continue;
        const big = p.indexOf(Math.max(...p));
        return MC(`일이 일어날 가능성이 가장 <b>높은</b> 것은 어느 것인가요?`, [ev[big][0], ...ev.filter((_, i) => i !== big).map(e => e[0])], ev.map(e => `${e[0]}: ${WORDS[wordOf(e[1], e[2])]}`).join(' / ')); } } }
]});
})();
