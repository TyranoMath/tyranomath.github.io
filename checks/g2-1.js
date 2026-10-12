/* =========================================================
   2학년 1학기 문제 만들기 — 수학익힘 2-1 문제 유형을 바탕으로 (2022 개정 교육과정)
   단원: 1 세 자리 수 · 2 여러 가지 도형 · 3 덧셈과 뺄셈 · 4 길이 재기 · 5 분류하기 · 6 곱셈
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS, H = window.TM_G12;
const { ri, pick, shuffle, range, svg, txt, line, tableH } = A;
const { E, MC, N, P, RO, CMP, CMPC, NAMES, sino, emo, shp, COLS, blocks } = H;
const INK = '#22314A';
const wa = a => a + P(a, '과', '와');
const card = c => c.map(x => `<span class="card">${x}</span>`).join('');

/* ─────────────── 1. 세 자리 수 ─────────────── */
const PV = ['일', '십', '백'];
A.addUnit({ key:'2-1-1', title:'세 자리 수', items:[
  { id:'b-100', name:'백 알아보기', std:'2수01-02', lv:[1,1], t:'both',
    g(){ const t = ri(0, 2), k = pick([90, 99, 80, 60]);
      if (t === 0) return N(`${k}보다 ${100 - k} 큰 수는?`, 100, `${k} + ${100 - k} = <b>100</b> (백)`, [99, 110, 101]);
      if (t === 1){ const u = pick([10, 1]); return N(`100은 ${u}이 몇 개인 수일까요?`, 100 / u, `${u} × ${100 / u} = 100 → <b>${100 / u}개</b>`, [100 / u / 10 || 1, 100 / u * 10, 10 + 100 / u], '개'); }
      return N(`10개씩 묶음 10개는 얼마일까요?`, 100, `10이 10개 → <b>100</b>`, [10, 110, 1000]); } },
  { id:'b-hund', name:'몇백 알아보기', std:'2수01-02', lv:[1,1], t:'both',
    g(){ const h = ri(2, 9); return N(`100이 ${h}개인 수는?${blocks(h * 100)}`, h * 100, `100이 ${h}개 → <b>${h * 100}</b> (${sino(h * 100)})`, [h * 10, h, h * 100 + 100]); } },
  { id:'b-make', name:'세 자리 수 만들기', std:'2수01-02', lv:[1,2], t:'both',
    g(L){ const h = ri(1, 9), t = L > 1 ? ri(0, 9) : ri(1, 9), o = L > 1 ? ri(0, 9) : ri(1, 9), v = h * 100 + t * 10 + o;
      return N(`100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수는?${L === 1 ? blocks(v) : ''}`, v, `${h * 100} + ${t * 10} + ${o} = <b>${v}</b>`, [h * 100 + o * 10 + t, h * 10 + t * 100 + o, v + 100]); } },
  { id:'b-read', name:'세 자리 수 읽기', std:'2수01-02', lv:[1,2], t:'mc',
    g(L){ const v = L > 1 ? pick([ri(1, 9) * 100 + ri(1, 9), ri(1, 9) * 100 + ri(1, 9) * 10]) : ri(101, 999);
      const bad = [sino(+String(v).split('').reverse().join('') || v + 1), sino(v + 10), sino(v - 1)].filter(x => x !== sino(v));
      return MC(`<b style="font-size:24px">${v}</b>${P(v, '을', '를')} 바르게 읽은 것은?`, [sino(v), ...bad], `자리의 숫자가 0이면 그 자리는 읽지 않아요 → <b>${sino(v)}</b>`); } },
  { id:'b-write', name:'읽은 수를 수로 쓰기', std:'2수01-02', lv:[2,2], t:'both',
    g(){ const v = pick([ri(1, 9) * 100 + ri(1, 9), ri(1, 9) * 100 + ri(1, 9) * 10, ri(101, 999)]); return N(`<b>${sino(v)}</b>${P(sino(v), '을', '를')} 수로 쓰면?`, v, `읽지 않은 자리에는 0을 써요 → <b>${v}</b>`, [+String(v).replace(/0/g, '') || v + 1, v + 100, v * 10 > 999 ? v - 1 : v * 10]); } },
  { id:'b-digit', name:'자리의 숫자가 나타내는 값', std:'2수01-02', lv:[2,3], t:'both',
    g(){ const v = ri(111, 999), s = String(v), k = ri(0, 2), d = +s[2 - k]; if (!d) return this.g();
      return N(`${v}에서 숫자 ${d}${P(d, '이', '가')} 나타내는 값은? (${PV[k]}의 자리)`, d * Math.pow(10, k), `${PV[k]}의 자리 숫자 ${d} → <b>${d * Math.pow(10, k)}</b>`, [d, d * Math.pow(10, k + 1), d * 10 === d * Math.pow(10, k) ? d * 100 : d * 10]); } },
  { id:'b-skip', name:'뛰어 세기', std:'2수01-03', lv:[2,3], t:'both',
    g(L){ const d = pick(L > 2 ? [100, 10, 1, -10, -100] : [100, 10, 1]), s = d > 0 ? ri(101, 999 - 5 * Math.abs(d)) : ri(100 + 5 * Math.abs(d), 999), seq = range(0, 4).map(i => s + d * i), h = ri(2, 4);
      return N(`${Math.abs(d)}씩 ${d > 0 ? '뛰어 세었어요' : '거꾸로 뛰어 세었어요'}. □ 안에 알맞은 수는? ${E(seq.map((x, i) => i === h ? '□' : x).join(' — '))}`, seq[h], `${PV[String(Math.abs(d)).length - 1]}의 자리 숫자가 1씩 ${d > 0 ? '커져요' : '작아져요'} → <b>${seq[h]}</b>`, [seq[h] + d, seq[h] - d, seq[h] + (Math.abs(d) === 1 ? 10 : 1)]); } },
  { id:'b-cmp', name:'세 자리 수의 크기 비교', std:'2수01-03', lv:[2,3], t:'mc',
    g(L){ if (L > 2){ const s = new Set(); const b = ri(2, 8) * 100; while (s.size < 4) s.add(b + ri(0, 99)); const a = [...s], mx = ri(0, 1), t = mx ? Math.max(...a) : Math.min(...a); return MC(`<b>가장 ${mx ? '큰' : '작은'}</b> 수는? ${E(a.join(', '))}`, [String(t), ...a.filter(x => x !== t).map(String)], `백의 자리가 같으면 십의 자리, 그다음 일의 자리를 비교해요 → <b>${t}</b>`); }
      const a = ri(101, 999); let b = pick([a + 10, a - 10, a + 1, a - 1, a + 100 > 999 ? a - 100 : a + 100]); const c = CMP(a, b);
      return MC(`○ 안에 &gt;, &lt;를 알맞게 써넣으세요. ${E(`${a} ○ ${b}`)}`, [c, c === '&gt;' ? '&lt;' : '&gt;'], `높은 자리부터 차례로 비교해요 → <b>${a} ${c} ${b}</b>`); } },
  { id:'b-coin', name:'동전으로 알아보는 세 자리 수', std:'2수01-02', lv:[3,4], t:'both',
    g(L){ const h = ri(1, 6), t = L > 3 ? ri(10, 18) : ri(1, 9), o = ri(0, 9), v = h * 100 + t * 10 + o;
      return N(`100원짜리 동전 ${h}개, 10원짜리 동전 ${t}개, 1원짜리 동전 ${o}개는 모두 얼마일까요?`, v, `${h * 100} + ${t * 10} + ${o} = <b>${v}원</b>${t >= 10 ? ' (10원짜리 10개 = 100원!)' : ''}`, [h * 100 + (t % 10) * 10 + o, v + 100, h + t + o], '원'); } },
  { id:'b-missing', name:'□ 안에 들어갈 수 있는 숫자', std:'2수01-03', lv:[4,5], t:'both',
    g(){ const h = ri(2, 8), t = ri(2, 7), o = ri(1, 8), big = ri(0, 1), x = h * 100 + t * 10 + o, oo = ri(0, 9);
      const cnt = range(0, 9).filter(d => { const v = h * 100 + d * 10 + oo; return big ? v > x : v < x; }).length; if (!cnt || cnt === 10) return this.g();
      return N(`0부터 9까지의 숫자 중 □ 안에 들어갈 수 있는 숫자는 모두 몇 개일까요? ${E(`${h}□${oo} ${big ? '&gt;' : '&lt;'} ${x}`)}`, cnt, `백의 자리가 같으므로 □(십의 자리)와 일의 자리를 비교해요. 0부터 9까지 넣어 보면 <b>${cnt}개</b>`, [cnt + 1, cnt - 1, 10 - cnt], '개'); } },
  { id:'b-cards', name:'수 카드로 세 자리 수 만들기', std:'2수01-03', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(0, 9)).slice(0, 3); if (!c.some(x => x)) return this.g(); const d = c.slice().sort((a, b) => b - a), as = c.slice().sort((a, b) => a - b), nz = as.find(x => x > 0), small = +[nz, ...as.filter(x => x !== nz)].join(''), big = +d.join(''), t = ri(0, 1);
      return N(`수 카드 ${card(c)}를 한 번씩만 사용하여 세 자리 수를 만들려고 해요. 가장 ${t ? '큰' : '작은'} 수는?`, t ? big : small, `${t ? '큰 수부터 차례로' : '0이 아닌 가장 작은 수를 백의 자리에 놓고 작은 수부터'} 놓아요 → <b>${t ? big : small}</b>`, [t ? +[d[0], d[2], d[1]].join('') : +as.join('') || small + 1, t ? small : big, (t ? big : small) + 1]); } }
]});

/* ─────────────── 2. 여러 가지 도형 ─────────────── */
const GN = { t: '삼각형', r: '사각형', c: '원' };
const polyFig = (n, col = '#BFE3FF') => { const pts = range(0, n - 1).map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / n + Math.sin(i * 1.9) * .3, r = 52 + Math.cos(i * 2.7) * 12; return [70 + r * Math.cos(a), 66 + r * Math.sin(a)]; });
  return svg(140, 130, `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${col}" stroke="${INK}" stroke-width="2.4"/>` + pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#E0464A"/>`).join('')); };
A.addUnit({ key:'2-1-2', title:'여러 가지 도형', items:[
  { id:'g-name', name:'삼각형, 사각형, 원 알기', std:'2수03-04', lv:[1,1], t:'mc',
    g(){ const k = pick(['t', 'r', 'c']); const f = k === 'c' ? svg(140, 130, `<circle cx="70" cy="65" r="52" fill="#FFE38A" stroke="${INK}" stroke-width="2.4"/>`) : polyFig(k === 't' ? 3 : 4, pick(COLS));
      return MC(`이 도형의 이름은?${f}`, [GN[k], ...['t', 'r', 'c'].filter(x => x !== k).map(x => GN[x]), '오각형'], k === 'c' ? '곧은 선이 없고 동그란 모양 → <b>원</b>' : `곧은 선(변) ${k === 't' ? 3 : 4}개로 둘러싸인 도형 → <b>${GN[k]}</b>`); } },
  { id:'g-parts', name:'변과 꼭짓점의 수', std:'2수03-04', lv:[1,2], t:'both',
    g(){ const n = pick([3, 4]), k = ri(0, 1); return N(`${n === 3 ? '삼각형' : '사각형'}의 ${k ? '꼭짓점' : '변'}은 몇 개일까요?${polyFig(n, pick(COLS))}`, n, `${n === 3 ? '삼각형' : '사각형'}은 변 ${n}개, 꼭짓점 ${n}개 → <b>${n}개</b>`, [7 - n, n + 1, n * 2], '개'); } },
  { id:'g-sum', name:'변·꼭짓점 수의 합', std:'2수03-05', lv:[3,4], t:'both',
    g(){ const a = ri(1, 4), b = ri(1, 4), c = ri(0, 3), k = ri(0, 1); return N(`삼각형 ${a}개, 사각형 ${b}개, 원 ${c}개가 있어요. ${k ? '꼭짓점' : '변'}은 모두 몇 개일까요?`, 3 * a + 4 * b, `삼각형 3개씩, 사각형 4개씩, 원은 0개 → ${3 * a} + ${4 * b} = <b>${3 * a + 4 * b}개</b>`, [3 * a + 4 * b + c, 4 * a + 3 * b, a + b + c], '개'); } },
  { id:'g-circle', name:'원의 특징', std:'2수03-04', lv:[2,2], t:'mc',
    g(){ const ok = pick(['곧은 선이 없어요.', '꼭짓점이 없어요.', '어느 쪽에서 보아도 똑같이 동그란 모양이에요.']);
      return MC('<b>원</b>에 대한 설명으로 옳은 것은?', [ok, '꼭짓점이 1개 있어요.', '변이 2개 있어요.', '뾰족한 부분이 있어요.'], `원은 곧은 선(변)과 꼭짓점이 없고, 어느 쪽에서 보아도 똑같이 동그래요 → <b>${ok}</b>`); } },
  { id:'g-isnot', name:'삼각형·사각형이 아닌 까닭', std:'2수03-05', lv:[2,3], t:'mc',
    g(){ return MC('삼각형에 대해 <b>바르게</b> 말한 것은?', [pick(['곧은 선 3개로 둘러싸여 있어요.', '꼭짓점이 3개 있어요.']), '굽은 선이 있어도 돼요.', '선이 끊어져 있어도 돼요.', '변이 4개 있어요.'], '삼각형은 <b>곧은 선 3개로 둘러싸인</b> 도형이에요. 굽은 선이 있거나 끊어져 있으면 삼각형이 아니에요.'); } },
  { id:'g-tangram', name:'칠교판 조각', std:'2수03-05', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2), Q0 = [['칠교판 조각 7개 중에서 삼각형 조각은 몇 개일까요?', 5, '삼각형 5개, 사각형 2개'], ['칠교판 조각 7개 중에서 사각형 조각은 몇 개일까요?', 2, '삼각형 5개, 사각형 2개(정사각형 1개, 평행사변형 모양 1개)'], ['칠교판에서 가장 작은 삼각형 조각 2개를 이어 붙여 만들 수 있는 사각형은 몇 가지일까요? (정사각형, 평행사변형 모양)', 2, '가장 작은 삼각형 2개로 정사각형, 평행사변형 모양 사각형을 만들 수 있어요']][t];
      return N(Q0[0], Q0[1], `${Q0[2]} → <b>${Q0[1]}</b>`, [Q0[1] + 1, 7 - Q0[1], 3], t < 2 ? '개' : '가지'); } },
  { id:'g-cut', name:'도형을 잘라 생기는 도형', std:'2수03-05', lv:[3,4], t:'both',
    g(){ const t = ri(0, 2), Q0 = [['사각형 모양 종이에 꼭짓점과 꼭짓점을 잇는 곧은 선을 1개 긋고 자르면 삼각형이 몇 개 생길까요?', 2], ['사각형 모양 종이에 마주 보는 꼭짓점끼리 잇는 곧은 선 2개를 긋고 자르면 삼각형이 몇 개 생길까요?', 4], ['삼각형 모양 종이를 한 꼭짓점에서 마주 보는 변까지 곧은 선을 1개 긋고 자르면 삼각형이 몇 개 생길까요?', 2]][t];
      const fig = t === 0 ? svg(140, 110, `<rect x="20" y="15" width="100" height="80" fill="#E8F7EA" stroke="${INK}" stroke-width="2.4"/>` + line(20, 15, 120, 95, { stroke: '#E0464A', w: 2, dash: '6 4' })) : t === 1 ? svg(140, 110, `<rect x="20" y="15" width="100" height="80" fill="#E8F7EA" stroke="${INK}" stroke-width="2.4"/>` + line(20, 15, 120, 95, { stroke: '#E0464A', w: 2, dash: '6 4' }) + line(120, 15, 20, 95, { stroke: '#E0464A', w: 2, dash: '6 4' })) : svg(140, 110, `<polygon points="70,10 125,100 15,100" fill="#FFF1DE" stroke="${INK}" stroke-width="2.4"/>` + line(70, 10, 80, 100, { stroke: '#E0464A', w: 2, dash: '6 4' }));
      return N(Q0[0] + fig, Q0[1], `점선을 따라 자르면 <b>${Q0[1]}개</b>의 삼각형이 생겨요.`, [Q0[1] + 1, Q0[1] - 1, Q0[1] * 2], '개'); } },
  { id:'g-stack', name:'쌓기나무의 수', std:'2수03-02', lv:[2,3], t:'both',
    g(){ const R = ri(1, 2), C = ri(2, 3); let Hm = range(0, R - 1).map(() => range(0, C - 1).map(() => ri(1, 2))); const v = Hm.flat().reduce((a, b) => a + b, 0); if (!window.TM_Q6) return N(`쌓기나무 ${v}개로 만든 모양이에요. 몇 개일까요?`, v, `<b>${v}개</b>`, [v + 1, v - 1, v + 2], '개');
      return N(`똑같은 모양으로 쌓으려면 쌓기나무가 몇 개 필요할까요? (뒤에 숨은 쌓기나무는 없어요)<div class="figc">${window.TM_Q6.iso(Hm, 26)}</div>`, v, `층별로 세어요: 1층 ${Hm.flat().length}개${Hm.flat().some(x => x > 1) ? `, 2층 ${Hm.flat().filter(x => x > 1).length}개` : ''} → <b>${v}개</b>`, [v + 1, v - 1, Hm.flat().length], '개'); } },
  { id:'g-stackdesc', name:'쌓은 모양 설명하기', std:'2수03-02', lv:[3,4], t:'both',
    g(){ const a = ri(2, 4), b = ri(1, a - 1), c = ri(0, 1); const desc = `1층에 쌓기나무 ${a}개가 옆으로 나란히 있고, 2층에 ${b}개${c ? `, 3층에 1개` : ''}가 있어요.`;
      return N(`${desc} 쌓기나무는 모두 몇 개일까요?`, a + b + c, `${a} + ${b}${c ? ' + 1' : ''} = <b>${a + b + c}개</b>`, [a + b, a * 2, a + b + c + 1], '개'); } },
  { id:'g-dir', name:'위치와 방향으로 말하기', std:'2수03-02', lv:[4,5], t:'mc',
    g(){ const cols = shuffle(['빨간색', '파란색', '노란색']), mid = cols[1];
      return MC(`쌓기나무 3개가 옆으로 나란히 있어요. 왼쪽부터 ${cols.join(', ')}이에요. ${mid} 쌓기나무 <b>${pick(['위', '앞'])}</b>에 쌓기나무 1개를 더 놓았어요. 바르게 설명한 것은?`.replace(/(위|앞)<\/b>에/, (m, d) => `${d}</b>에`), [`${mid} 쌓기나무는 ${cols[0]} 쌓기나무의 오른쪽에 있어요.`, `${mid} 쌓기나무는 ${cols[0]} 쌓기나무의 왼쪽에 있어요.`, `${cols[2]} 쌓기나무는 ${mid} 쌓기나무의 왼쪽에 있어요.`, `${cols[0]} 쌓기나무는 ${cols[2]} 쌓기나무의 오른쪽에 있어요.`], `왼쪽부터 ${cols.join(' → ')} 순서예요 → ${mid}은 ${cols[0]}의 <b>오른쪽</b>`); } }
]});

/* ─────────────── 3. 덧셈과 뺄셈 ─────────────── */
const carry = () => { let a, b; do { a = ri(15, 79); b = ri(12, 69); } while (a % 10 + b % 10 < 10 || a + b > 99); return [a, b]; };
const borrow = () => { let a, b; do { a = ri(30, 98); b = ri(12, a - 5); } while (a % 10 >= b % 10); return [a, b]; };
A.addUnit({ key:'2-1-3', title:'덧셈과 뺄셈', items:[
  { id:'a-1', name:'(두 자리 수) + (한 자리 수)', std:'2수01-06', lv:[1,1], t:'both',
    g(){ let a, b; do { a = ri(15, 89); b = ri(3, 9); } while (a % 10 + b < 10 || a + b > 99); return N(`${a} + ${b}의 값은?`, a + b, `일의 자리 ${a % 10} + ${b} = ${a % 10 + b} → 10을 십의 자리로 받아올림 → <b>${a + b}</b>`, [a + b - 10, a + b + 1, a + b - 1]); } },
  { id:'a-2', name:'(두 자리 수) + (두 자리 수)', std:'2수01-06', lv:[1,2], t:'both',
    g(L){ let a, b; if (L > 1){ do { a = ri(25, 89); b = ri(25, 89); } while (a % 10 + b % 10 < 10 || a + b < 100 || a + b > 198); } else [a, b] = carry();
      return N(`${a} + ${b}의 값은?`, a + b, `일의 자리부터 더하고 받아올림한 1을 십의 자리에 더해요 → <b>${a + b}</b>`, [a + b - 10, a + b + 10, a + b - 100 > 0 ? a + b - 100 : a + b + 1]); } },
  { id:'s-1', name:'(두 자리 수) - (한 자리 수)', std:'2수01-06', lv:[1,1], t:'both',
    g(){ let a, b; do { a = ri(21, 98); b = ri(2, 9); } while (a % 10 >= b); return N(`${a} - ${b}의 값은?`, a - b, `일의 자리끼리 뺄 수 없으면 십의 자리에서 10을 받아내림 → <b>${a - b}</b>`, [a - b + 10, a - b - 1, a + b]); } },
  { id:'s-2', name:'(두 자리 수) - (두 자리 수)', std:'2수01-06', lv:[1,2], t:'both',
    g(L){ let a, b; if (L > 1) [a, b] = borrow(); else { a = ri(3, 9) * 10; b = ri(11, a - 2); if (b % 10 === 0) b++; }
      return N(`${a} - ${b}의 값은?`, a - b, `받아내림에 주의하며 일의 자리부터 빼요 → <b>${a - b}</b>`, [a - b + 10, a - b - 10 > 0 ? a - b - 10 : a - b + 1, a - b + 2]); } },
  { id:'t3', name:'세 수의 계산', std:'2수01-08', lv:[2,3], t:'both',
    g(){ const a = ri(20, 60), b = ri(10, 30), c = ri(5, a + b - 5), t = ri(0, 2), e = [[`${a} + ${b} - ${c}`, a + b - c], [`${a + b} - ${b} + ${c}`, a + c], [`${a} + ${b} + ${Math.min(c, 99 - a - b) > 0 ? Math.min(c, 99 - a - b) : 1}`, a + b + (Math.min(c, 99 - a - b) > 0 ? Math.min(c, 99 - a - b) : 1)]][t];
      if (e[1] <= 0) return this.g(); return N(`${e[0]}의 값은?`, e[1], `세 수의 계산은 <b>앞에서부터 차례로</b> 해요 → <b>${e[1]}</b>`, [e[1] + 10, e[1] - 10 > 0 ? e[1] - 10 : e[1] + 1, t === 1 ? a + b - b - c > 0 ? a - c : e[1] + 2 : e[1] + 2]); } },
  { id:'rel', name:'덧셈과 뺄셈의 관계', std:'2수01-07', lv:[2,2], t:'mc',
    g(){ const [a, b] = carry(), c = a + b, t = ri(0, 1);
      return t ? MC(`덧셈식 ${a} + ${b} = ${c}${P(c, '을', '를')} 뺄셈식으로 <b>바르게</b> 나타낸 것은?`, [`${c} - ${b} = ${a}`, `${a} - ${b} = ${c}`, `${b} - ${c} = ${a}`, `${c} - ${a} = ${c}`], `전체(${c})에서 한 부분을 빼면 다른 부분 → <b>${c} - ${b} = ${a}</b>`)
        : MC(`뺄셈식 ${c} - ${a} = ${b}${P(b, '을', '를')} 덧셈식으로 <b>바르게</b> 나타낸 것은?`, [`${a} + ${b} = ${c}`, `${c} + ${a} = ${b}`, `${b} + ${c} = ${a}`, `${c} + ${b} = ${a}`], `부분 + 부분 = 전체 → <b>${a} + ${b} = ${c}</b>`); } },
  { id:'box', name:'□의 값 구하기', std:'2수01-09', lv:[3,3], t:'both',
    g(){ const [a, b] = carry(), t = ri(0, 3), e = [[`□ + ${b} = ${a + b}`, a], [`${a} + □ = ${a + b}`, b], [`□ - ${b} = ${a}`, a + b], [`${a + b} - □ = ${a}`, b]][t];
      return N(`□ 안에 알맞은 수는? ${E(e[0])}`, e[1], `덧셈과 뺄셈의 관계를 이용해요 → □ = <b>${e[1]}</b>`, [e[1] + 10, a + b === e[1] ? a : a + b, e[1] - 1]); } },
  { id:'word', name:'덧셈·뺄셈 생활 문제', std:'2수01-05', lv:[2,3], t:'both',
    g(){ const t = ri(0, 2);
      if (t === 0){ const [a, b] = carry(); return N(`우리 반 학생들이 어제 책을 ${a}권, 오늘 ${b}권 읽었어요. 이틀 동안 읽은 책은 모두 몇 권일까요?`, a + b, `${a} + ${b} = <b>${a + b}권</b>`, [a + b - 10, a - b > 0 ? a - b : a + b + 1, a + b + 10], '권'); }
      if (t === 1){ const [a, b] = borrow(); return N(`색종이 ${a}장 중에서 ${b}장을 사용했어요. 남은 색종이는 몇 장일까요?`, a - b, `${a} - ${b} = <b>${a - b}장</b>`, [a - b + 10, a + b > 99 ? a - b + 1 : a + b, a - b - 1], '장'); }
      const [a, b] = borrow(), n1 = pick(NAMES); return N(`줄넘기를 ${n1}는 ${a}번, 동생은 ${b}번 넘었어요. ${n1}는 동생보다 몇 번 더 많이 넘었나요?`, a - b, `${a} - ${b} = <b>${a - b}번</b>`, [a - b + 10, a - b - 1, b], '번'); } },
  { id:'box-word', name:'어떤 수 구하기', std:'2수01-09', lv:[4,4], t:'both',
    g(){ const [a, b] = carry(), t = ri(0, 1);
      return t ? N(`어떤 수에 ${b}${P(b, '을', '를')} 더했더니 ${a + b}${P(a + b, '이', '가')} 되었어요. 어떤 수는?`, a, `□ + ${b} = ${a + b} → □ = ${a + b} - ${b} = <b>${a}</b>`, [a + 2 * b > 99 ? a + 10 : a + 2 * b, a + 10, a - 1])
        : N(`어떤 수에서 ${b}${P(b, '을', '를')} 뺐더니 ${a}${P(a, '이', '가')} 되었어요. 어떤 수는?`, a + b, `□ - ${b} = ${a} → □ = ${a} + ${b} = <b>${a + b}</b>`, [a - b > 0 ? a - b : a + 1, a + b - 10, a + b + 1]); } },
  { id:'range', name:'□ 안에 들어갈 수 있는 수', std:'2수01-09', lv:[5,5], t:'both',
    g(){ const a = ri(25, 59), lim = ri(a + 12, 95), mx = lim - a - 1;
      return N(`${a} + □ &lt; ${lim}에서 □ 안에 들어갈 수 있는 수 중에서 가장 큰 두 자리 수는?`, mx, `${a} + □ = ${lim}이면 □ = ${lim - a} → 이보다 작아야 하므로 <b>${mx}</b>`, [mx + 1, mx + 2, lim - a + 10]); } },
  { id:'cards', name:'수 카드로 덧셈식 만들기', std:'2수01-06', lv:[4,5], t:'both',
    g(){ const c = shuffle(range(1, 9)).slice(0, 4), s = c.slice().sort((a, b) => b - a), plus = ri(0, 1), big = s[0] * 10 + s[1], small = s[3] * 10 + s[2], v = plus ? (s[0] + s[1]) * 10 + s[2] + s[3] : big - small;
      return N(`수 카드 ${card(c)}를 한 번씩만 사용하여 두 자리 수 2개를 만들었어요. ${plus ? '두 수의 합이 가장 클 때의 합은' : '가장 큰 두 자리 수와 남은 카드로 만든 가장 작은 두 자리 수의 차는'}?`, v, plus ? `큰 수 두 개를 십의 자리에 놓아요: ${s[0]}${s[2]} + ${s[1]}${s[3]} = <b>${v}</b>` : `${big} - ${small} = <b>${v}</b>`, [v + 9, v - 10, v + 1]); } }
]});

/* ─────────────── 4. 길이 재기 ─────────────── */
const ruler = (s, e, cm = 12, obj = '✏️') => { const u = 30, X = 14; let g = `<rect x="${X + s * u}" y="12" width="${(e - s) * u}" height="20" rx="6" fill="#FFC48A" stroke="${INK}" stroke-width="1.6"/>` + txt(X + (s + e) / 2 * u, 22, obj, { size: 14 });
  g += `<rect x="${X - 8}" y="40" width="${cm * u + 16}" height="40" rx="4" fill="#FFF4D0" stroke="${INK}" stroke-width="1.5"/>`;
  for (let k = 0; k <= cm * 10; k++) g += line(X + k * u / 10, 40, X + k * u / 10, 40 + (k % 10 ? (k % 5 ? 6 : 10) : 15), { w: k % 10 ? .7 : 1.6 });
  for (let c = 0; c <= cm; c++) g += txt(X + c * u, 66, c, { size: 12, bold: true });
  g += line(X + s * u, 32, X + s * u, 40, { stroke: '#E0464A', w: 1.4, dash: '3 2' }) + line(X + e * u, 32, X + e * u, 40, { stroke: '#E0464A', w: 1.4, dash: '3 2' });
  return svg(cm * u + 32, 86, g); };
A.addUnit({ key:'2-1-4', title:'길이 재기', items:[
  { id:'l-cmp', name:'길이를 비교하는 방법', std:'2수03-10', lv:[1,1], t:'mc',
    g(){ return MC('직접 맞대어 비교하기 어려운 두 물건의 길이를 비교하는 방법으로 알맞은 것은?', [pick(['종이띠나 털실 등으로 길이를 본뜬 다음 비교해요.', '같은 단위로 몇 번인지 재어 비교해요.']), '눈으로만 보고 정해요.', '더 무거운 쪽이 더 길어요.', '색깔이 진한 쪽이 더 길어요.'], '움직일 수 없는 물건은 종이띠 등으로 본뜨거나, 같은 단위로 재어 비교해요.'); } },
  { id:'l-unit', name:'여러 가지 단위로 재기', std:'2수03-10', lv:[1,2], t:'mc',
    g(){ const a = ri(3, 6), b = a + ri(2, 5), u1 = pick(['연필', '지우개', '클립', '뼘']), u2 = pick(['클립', '지우개', '공깃돌'].filter(x => x !== u1));
      return MC(`책상의 길이를 ${u1}${RO(u1)} 재면 ${a}번, ${u2}${RO(u2)} 재면 ${b}번이에요. 길이가 <b>더 긴</b> 단위는?`, [u1, u2], `같은 길이를 잴 때 단위가 길수록 잰 횟수가 적어요 → <b>${u1}</b>`); } },
  { id:'l-cm', name:'1 cm 알아보기', std:'2수03-10', lv:[1,1], t:'both',
    g(){ const n = ri(3, 15); return N(`1 cm가 ${n}번이면 몇 cm일까요?`, n, `1 cm가 ${n}번 → <b>${n} cm</b> (${n} 센티미터)`, [n + 1, n * 10, n - 1], 'cm'); } },
  { id:'l-ruler', name:'자로 길이 재기', std:'2수03-10', lv:[1,2], t:'both',
    g(L){ const s = L > 1 ? ri(1, 4) : 0, e = s + ri(3, 7); return N(`물건의 길이는 몇 cm일까요?${ruler(s, e)}`, e - s, s ? `눈금 ${s}에서 ${e}까지 1 cm가 ${e - s}번 → <b>${e - s} cm</b>` : `한쪽 끝을 0에 맞추었으니 다른 쪽 끝의 눈금을 읽어요 → <b>${e} cm</b>`, [e, e - s + 1, s], 'cm'); } },
  { id:'l-about', name:'약 몇 cm 읽기', std:'2수03-10', lv:[3,3], t:'both',
    g(){ const n = ri(4, 10), d = pick([-0.3, -0.2, 0.2, 0.3]); return N(`물건의 끝이 눈금 사이에 있어요. 물건의 길이는 <b>약</b> 몇 cm일까요?${ruler(0, n + d)}`, n, `${n} cm에 가까우므로 약 <b>${n} cm</b>`, [n + 1, n - 1, n + 2], 'cm'); } },
  { id:'l-est', name:'길이 어림하기', std:'2수03-12', lv:[2,2], t:'mc',
    g(){ const Q0 = pick([['연필', '약 15 cm', ['약 1 cm', '약 50 cm', '약 100 cm']], ['지우개', '약 5 cm', ['약 50 cm', '약 20 cm', '약 1 cm']], ['클립', '약 3 cm', ['약 30 cm', '약 10 cm', '약 1 cm']], ['교과서 긴 쪽', '약 26 cm', ['약 6 cm', '약 60 cm', '약 2 cm']], ['내 손 한 뼘', '약 12 cm', ['약 2 cm', '약 50 cm', '약 100 cm']]]);
      return MC(`<b>${Q0[0]}</b>의 길이를 어림한 것으로 가장 알맞은 것은?`, [Q0[1], ...Q0[2]], `1 cm(손톱 너비쯤), 한 뼘 등을 떠올리며 어림해요 → <b>${Q0[1]}</b>`); } },
  { id:'l-closest', name:'가장 가깝게 어림한 사람', std:'2수03-12', lv:[3,4], t:'mc',
    g(){ const real = ri(10, 30), p = shuffle(NAMES).slice(0, 3), ds = shuffle([1, 3, 5]).map(x => x * pick([1, -1])), guess = ds.map(d => real + d), i = ds.findIndex(d => Math.abs(d) === 1);
      return MC(`끈의 실제 길이는 ${real} cm예요. ${p.map((n, k) => `${n}: 약 ${guess[k]} cm`).join(', ')}라고 어림했어요. <b>가장 가깝게</b> 어림한 사람은?`, [p[i], ...p.filter((_, k) => k !== i)], `실제 길이와의 차: ${p.map((n, k) => `${n} ${Math.abs(ds[k])} cm`).join(', ')} → <b>${p[i]}</b>`); } },
  { id:'l-sum', name:'길이 더하기', std:'2수03-10', lv:[4,4], t:'both',
    g(){ const a = ri(3, 12), b = ri(3, 12), c = ri(0, 1) ? ri(2, 8) : 0;
      return N(`길이가 ${a} cm, ${b} cm${c ? `, ${c} cm` : ''}인 막대를 겹치지 않게 한 줄로 이어 놓았어요. 전체 길이는 몇 cm일까요?`, a + b + c, `${a} + ${b}${c ? ` + ${c}` : ''} = <b>${a + b + c} cm</b>`, [a + b, a + b + c + 1, Math.abs(a - b)], 'cm'); } },
  { id:'l-units2', name:'단위에 따른 횟수 비교', std:'2수03-10', lv:[4,5], t:'both',
    g(){ const u = pick([2, 3, 4, 5]), k = ri(3, 6), L = u * k, u2 = pick([2, 3, 4, 5, 6].filter(x => x !== u && L % x === 0)); if (!u2) return this.g();
      return N(`길이가 ${u} cm인 클립으로 ${k}번 잰 끈이 있어요. 이 끈을 길이가 ${u2} cm인 막대로 재면 몇 번일까요?`, L / u2, `끈의 길이 = ${u} cm × ${k}번 = ${L} cm → ${u2} cm씩 ${L / u2}번 → <b>${L / u2}번</b>`, [k, L, L / u2 + 1], '번'); } }
]});

/* ─────────────── 5. 분류하기 ─────────────── */
const CL = [['#E0464A', '빨간색'], ['#3B8FD9', '파란색'], ['#F2C94C', '노란색']], SH = [['t', '삼각형'], ['r', '사각형'], ['c', '원']];
const mkItems = () => range(1, ri(9, 12)).map(() => [pick(CL), pick(SH)]);
const itemsFig = it => { let g = ''; it.forEach(([c, s], i) => { g += shp(s[0], 32 + (i % 6) * 54, 32 + Math.floor(i / 6) * 56, 38, c[0], 0); g += txt(32 + (i % 6) * 54, 32 + Math.floor(i / 6) * 56 + 30, i + 1, { size: 10, fill: '#5D6C83' }); }); return svg(6 * 54 + 10, Math.ceil(it.length / 6) * 56 + 18, g); };
A.addUnit({ key:'2-1-5', title:'분류하기', items:[
  { id:'cl-crit', name:'분류 기준 정하기', std:'2수04-01', lv:[1,1], t:'mc',
    g(){ const ok = pick(['색깔', '모양', '다리의 수', '구멍의 수']);
      return MC('분류 기준으로 <b>알맞은</b> 것은?', [ok, '좋아하는 것과 싫어하는 것', '예쁜 것과 예쁘지 않은 것', '멋진 것과 멋지지 않은 것'], `누가 분류해도 결과가 <b>같은</b> 분명한 기준을 정해야 해요 → <b>${ok}</b>`); } },
  { id:'cl-count', name:'기준에 따라 분류하고 세기', std:'2수04-01', lv:[1,2], t:'both',
    g(){ const it = mkItems(), byCol = ri(0, 1), key = byCol ? pick(CL) : pick(SH), v = it.filter(x => byCol ? x[0] === key : x[1] === key).length; if (!v) return this.g();
      return N(`<b>${key[1]}</b>인 것은 모두 몇 개일까요?${itemsFig(it)}`, v, `${byCol ? '색깔' : '모양'}을 기준으로 분류해서 세면 <b>${v}개</b>`, [v + 1, it.length - v, v - 1], '개'); } },
  { id:'cl-two', name:'두 가지 기준으로 세기', std:'2수04-01', lv:[3,3], t:'both',
    g(){ const it = mkItems(), c = pick(CL), s = pick(SH), v = it.filter(x => x[0] === c && x[1] === s).length; if (!v) return this.g();
      return N(`<b>${c[1]}이면서 ${s[1]}</b>인 것은 몇 개일까요?${itemsFig(it)}`, v, `${c[1]}인 것 중에서 ${s[1]}만 세면 <b>${v}개</b>`, [it.filter(x => x[0] === c).length, it.filter(x => x[1] === s).length, v + 1].filter(x => x !== v), '개'); } },
  { id:'cl-most', name:'가장 많은 것 찾기', std:'2수04-01', lv:[2,2], t:'mc',
    g(){ const it = mkItems(), byCol = ri(0, 1), groups = (byCol ? CL : SH).map(k => [k[1], it.filter(x => (byCol ? x[0] : x[1]) === k).length]), mx = Math.max(...groups.map(g => g[1])); if (groups.filter(g => g[1] === mx).length > 1) return this.g();
      const best = groups.find(g => g[1] === mx)[0];
      return MC(`${byCol ? '색깔' : '모양'}에 따라 분류했을 때 <b>가장 많은</b> 것은?${itemsFig(it)}`, [best, ...groups.map(g => g[0]).filter(x => x !== best)], `${groups.map(g => `${g[0]} ${g[1]}개`).join(', ')} → <b>${best}</b>`); } },
  { id:'cl-table', name:'분류하여 센 결과', std:'2수04-01', lv:[2,3], t:'both',
    g(){ const k = shuffle(['🍎 사과', '🍌 바나나', '🍇 포도', '🍓 딸기']).slice(0, 3), v = k.map(() => ri(2, 8)), tot = v.reduce((a, b) => a + b, 0), i = ri(0, 2);
      return N(`반 친구들이 좋아하는 과일을 분류하여 센 결과예요. 조사한 친구가 모두 ${tot}명일 때, <b>${k[i]}</b>를 좋아하는 친구는 몇 명일까요?${tableH([['과일', ...k], ['친구 수(명)', ...v.map((x, j) => j === i ? '?' : x)]])}`, v[i], `${tot} - ${v.filter((_, j) => j !== i).join(' - ')} = <b>${v[i]}명</b>`, [v[i] + 1, tot - v[i], v[i] - 1], '명'); } },
  { id:'cl-diff', name:'분류한 결과 비교하기', std:'2수04-01', lv:[3,3], t:'both',
    g(){ const it = mkItems(), [a, b] = shuffle(CL).slice(0, 2), x = it.filter(z => z[0] === a).length, y = it.filter(z => z[0] === b).length; if (x === y) return this.g(); const [hi, lo, hv, lv] = x > y ? [a, b, x, y] : [b, a, y, x];
      return N(`<b>${hi[1]}</b>인 것은 <b>${lo[1]}</b>인 것보다 몇 개 더 많을까요?${itemsFig(it)}`, hv - lv, `${hi[1]} ${hv}개, ${lo[1]} ${lv}개 → ${hv} - ${lv} = <b>${hv - lv}개</b>`, [hv, lv, hv + lv], '개'); } },
  { id:'cl-wrong', name:'잘못 분류된 것 찾기', std:'2수04-01', lv:[3,4], t:'mc',
    g(){ const G = pick([[['🐶', '🐱', '🐷', '🐔'], '다리가 4개인 동물', '🐔', '닭은 다리가 2개예요'], [['🍎', '🍓', '🍒', '🍋'], '빨간색 과일', '🍋', '레몬은 노란색이에요'], [['⚽', '🏀', '🎾', '📦'], '공 모양', '📦', '상자는 공 모양이 아니에요'], [['🚗', '🚌', '🚲', '⛵'], '바퀴가 있는 것', '⛵', '배는 바퀴가 없어요']]);
      return MC(`<b>${G[1]}</b>끼리 모았어요. 잘못 분류된 것은? <div style="font-size:36px;text-align:center;letter-spacing:8px">${shuffle(G[0]).join('')}</div>`, [G[2], ...G[0].filter(x => x !== G[2])], `${G[3]} → <b>${G[2]}</b>`); } },
  { id:'cl-use', name:'분류한 결과 활용하기', std:'2수04-01', lv:[4,4], t:'mc',
    g(){ const k = ['딸기 우유', '초코 우유', '바나나 우유'], v = shuffle([ri(9, 12), ri(5, 8), ri(1, 4)]), mx = Math.max(...v), best = k[v.indexOf(mx)];
      return MC(`반 친구들이 좋아하는 우유를 분류했어요. ${k.map((x, i) => `${x} ${v[i]}명`).join(', ')}이에요. 우유를 한 가지만 많이 준비한다면 어떤 우유가 좋을까요?`, [best, ...k.filter(x => x !== best)], `가장 많은 친구가 좋아하는 우유 → <b>${best}</b>`); } }
]});

/* ─────────────── 6. 곱셈 ─────────────── */
const GI = ['🍪', '🍓', '🐟', '🍬', '🌷', '🍎', '🐞'];
const groupsFig = (ic, k, n) => `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0">${range(1, n).map(() => `<span style="border:2.5px solid #4CB963;border-radius:14px;padding:3px 6px;font-size:22px">${ic.repeat(k)}</span>`).join('')}</div>`;
A.addUnit({ key:'2-1-6', title:'곱셈', items:[
  { id:'x-count', name:'묶어 세기', std:'2수01-10', lv:[1,1], t:'both',
    g(){ const k = ri(2, 5), n = ri(2, 5), ic = pick(GI); return N(`${k}개씩 묶어 세어 보세요. 모두 몇 개일까요?${groupsFig(ic, k, n)}`, k * n, `${k}씩 ${n}묶음 → ${range(1, n).map(i => k * i).join(', ')} → <b>${k * n}개</b>`, [k + n, k * n + k, k * n - 1], '개'); } },
  { id:'x-group', name:'몇씩 몇 묶음', std:'2수01-10', lv:[1,2], t:'both',
    g(){ const k = ri(2, 6), n = ri(2, 6), ic = pick(GI); return N(`${ic} ${k * n}개를 ${k}개씩 묶으면 몇 묶음일까요?${emo(ic, k * n, k, 22)}`, n, `${k}씩 ${n}번 세면 ${k * n} → <b>${n}묶음</b>`, [n + 1, k, n - 1], '묶음'); } },
  { id:'x-times', name:'몇의 몇 배', std:'2수01-10', lv:[1,2], t:'both',
    g(){ const k = ri(2, 9), n = ri(2, 6); return N(`${k}의 ${n}배는 얼마일까요?`, k * n, `${k}의 ${n}배 = ${range(1, n).map(() => k).join(' + ')} = <b>${k * n}</b>`, [k + n, k * n + k, k * (n - 1)]); } },
  { id:'x-times2', name:'몇 배인지 알기', std:'2수01-10', lv:[2,3], t:'both',
    g(){ const k = ri(2, 5), n = ri(2, 5), a = pick(['파란색', '빨간색']); return N(`초록색 막대는 ${k}칸이에요. ${a} 막대는 ${k * n}칸이에요. ${a} 막대의 길이는 초록색 막대의 몇 배일까요?${svg(30 + k * n * 22, 80, `<rect x="10" y="10" width="${k * 22}" height="22" fill="#9BE0A6" stroke="${INK}"/>` + range(0, k * n - 1).map(i => `<rect x="${10 + i * 22}" y="44" width="22" height="22" fill="${a === '파란색' ? '#9CC7EE' : '#FFB3B3'}" stroke="${INK}"/>`).join(''))}`, n, `${k}칸씩 ${n}번 → <b>${n}배</b>`, [n + 1, k * n, k], '배'); } },
  { id:'x-expr', name:'덧셈식을 곱셈식으로', std:'2수01-10', lv:[2,2], t:'mc',
    g(){ const k = ri(2, 9), n = ri(3, 6); return MC(`${range(1, n).map(() => k).join(' + ')}${P(k, '을', '를')} 곱셈식으로 바르게 나타낸 것은?`, [`${k} × ${n} = ${k * n}`, `${k} × ${n + 1} = ${k * (n + 1)}`, `${k} + ${n} = ${k + n}`, `${n} × ${n} = ${n * n}`], `${k}를 ${n}번 더했으므로 ${k}의 ${n}배 → <b>${k} × ${n} = ${k * n}</b>`); } },
  { id:'x-read', name:'곱셈식 읽기', std:'2수01-10', lv:[2,2], t:'mc',
    g(){ const k = ri(2, 9), n = ri(2, 9); return MC(`곱셈식 ${k} × ${n} = ${k * n}을(를) 바르게 읽은 것은?`.replace('을(를)', P(k * n, '을', '를')), [`${sino(k)} 곱하기 ${sino(n)}은(는) ${sino(k * n)}과(와) 같습니다.`.replace('은(는)', P(sino(n), '은', '는')).replace('과(와)', P(sino(k * n), '과', '와')), `${sino(k)} 더하기 ${sino(n)}은(는) ${sino(k * n)}과(와) 같습니다.`.replace('은(는)', P(sino(n), '은', '는')).replace('과(와)', P(sino(k * n), '과', '와')), `${sino(n)} 곱하기 ${sino(k * n)}은(는) ${sino(k)}과(와) 같습니다.`.replace('은(는)', P(sino(k * n), '은', '는')).replace('과(와)', P(sino(k), '과', '와'))], `× 는 "곱하기"라고 읽어요.`); } },
  { id:'x-word', name:'곱셈 생활 문제', std:'2수01-10', lv:[2,3], t:'both',
    g(){ const k = ri(2, 9), n = ri(2, 6), S = pick([['자동차 한 대에 바퀴가 4개씩 있어요. 자동차', 4, '대', '바퀴'], ['한 접시에 쿠키가 K개씩 있어요. 접시', 0, '개', '쿠키'], ['꽃 한 송이에 꽃잎이 5장씩 있어요. 꽃', 5, '송이', '꽃잎'], ['문어 한 마리의 다리는 8개예요. 문어', 8, '마리', '다리']]), kk = S[1] || k;
      return N(`${S[0].replace('K', kk)} ${n}${S[2]}에는 ${S[3]}${P(S[3], '이', '가')} 모두 몇 개일까요?`.replace(/개(이|가) 모두 몇 개/, '모두 몇 개'), kk * n, `${kk}의 ${n}배 → ${kk} × ${n} = <b>${kk * n}</b>`, [kk + n, kk * n + kk, kk * (n - 1)], S[3] === '꽃잎' ? '장' : '개'); } },
  { id:'x-cmp', name:'곱의 크기 비교', std:'2수01-10', lv:[3,3], t:'mc',
    g(){ const a = ri(2, 9), b = ri(2, 6), c = ri(2, 9), d = ri(2, 6), cc = CMP(a * b, c * d);
      return MC(`○ 안에 알맞은 것은? ${E(`${a}의 ${b}배 ○ ${c}의 ${d}배`)}`, [cc, ...CMPC.filter(z => z !== cc)], `${a} × ${b} = ${a * b}, ${c} × ${d} = ${c * d} → <b>${cc}</b>`); } },
  { id:'x-mix', name:'곱셈과 덧셈·뺄셈', std:'2수01-10', lv:[4,4], t:'both',
    g(){ const k = ri(2, 6), n = ri(2, 5), e = ri(1, 5), plus = ri(0, 1);
      return plus ? N(`사탕을 ${k}개씩 ${n}봉지 사고, ${e}개를 더 받았어요. 사탕은 모두 몇 개일까요?`, k * n + e, `${k} × ${n} = ${k * n}, ${k * n} + ${e} = <b>${k * n + e}개</b>`, [k * n, k + n + e, k * (n + e)], '개')
        : N(`구슬을 ${k}개씩 ${n}줄 놓았어요. 그중 ${Math.min(e, k * n - 1)}개를 동생에게 주었다면 남은 구슬은 몇 개일까요?`, k * n - Math.min(e, k * n - 1), `${k} × ${n} = ${k * n}, ${k * n} - ${Math.min(e, k * n - 1)} = <b>${k * n - Math.min(e, k * n - 1)}개</b>`, [k * n, k * n + e, k + n], '개'); } },
  { id:'x-ways', name:'몇의 몇 배로 나타내기', std:'2수01-10', lv:[5,5], t:'both',
    g(){ const n = pick([12, 18, 20, 24, 16]), ways = range(2, n / 2).filter(k => n % k === 0 && n / k >= 2).length;
      return N(`${n}을(를) "□의 △배"로 나타내려고 해요. □와 △가 모두 2 이상일 때, 나타낼 수 있는 방법은 모두 몇 가지일까요?`.replace('을(를)', P(n, '을', '를')), ways, `${range(2, n / 2).filter(k => n % k === 0 && n / k >= 2).map(k => `${k}의 ${n / k}배`).join(', ')} → <b>${ways}가지</b>`, [ways + 1, ways - 1, ways + 2], '가지'); } }
]});
})();
