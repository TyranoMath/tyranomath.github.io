/* =========================================================
   2학년 2학기 문제 만들기 — 수학익힘 2-2 문제 유형을 바탕으로 (2022 개정 교육과정)
   단원: 1 네 자리 수 · 2 곱셈구구 · 3 길이 재기 · 4 시각과 시간 · 5 표와 그래프 · 6 규칙 찾기
   ========================================================= */
(function(){
'use strict';
const A = window.TM_ASSESS, H = window.TM_G12;
const { ri, pick, shuffle, range, svg, txt, line, tableH } = A;
const { E, MC, N, P, RO, CMP, CMPC, NAMES, sino, emo, clock, blocks } = H;
const INK = '#22314A';
const card = c => c.map(x => `<span class="card">${x}</span>`).join('');
const PV = ['일', '십', '백', '천'];
const ordK = n => { const T = ['', '열', '스물', '서른'], U = ['', '한', '두', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉']; if (n === 1) return '첫째'; if (n === 2) return '둘째'; if (n === 20) return '스무째'; return T[Math.floor(n / 10)] + U[n % 10] + '째'; };

/* ─────────────── 1. 네 자리 수 ─────────────── */
A.addUnit({ key:'2-2-1', title:'네 자리 수', items:[
  { id:'k-1000', name:'천 알아보기', std:'2수01-02', lv:[1,1], t:'both',
    g(){ const t = ri(0, 2), k = pick([900, 990, 999, 800]);
      if (t === 0) return N(`${k}보다 ${1000 - k} 큰 수는?`, 1000, `${k} + ${1000 - k} = <b>1000</b> (천)`, [999, 1100, 1010]);
      if (t === 1){ const u = pick([100, 10]); return N(`1000은 ${u}이 몇 개인 수일까요?`, 1000 / u, `${u} × ${1000 / u} = 1000 → <b>${1000 / u}개</b>`, [1000 / u / 10, 1000 / u * 10, 1000 / u + 1], '개'); }
      return N(`100이 10개인 수는?`, 1000, `100이 10개 → <b>1000</b>`, [100, 110, 10000]); } },
  { id:'k-th', name:'몇천 알아보기', std:'2수01-02', lv:[1,1], t:'both',
    g(){ const t = ri(2, 9); return N(`1000이 ${t}개인 수는?`, t * 1000, `1000이 ${t}개 → <b>${t * 1000}</b> (${sino(t * 1000)})`, [t * 100, t, t * 1000 + 1000]); } },
  { id:'k-make', name:'네 자리 수 만들기', std:'2수01-02', lv:[1,2], t:'both',
    g(L){ const a = ri(1, 9), b = ri(0, 9), c = ri(0, 9), d = ri(L > 1 ? 0 : 1, 9), v = a * 1000 + b * 100 + c * 10 + d;
      return N(`1000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${d}개인 수는?${L === 1 ? blocks(v) : ''}`, v, `${a * 1000} + ${b * 100} + ${c * 10} + ${d} = <b>${v}</b>`, [a * 1000 + c * 100 + b * 10 + d, v + 1000, a * 100 + b * 10 + c + d]); } },
  { id:'k-read', name:'네 자리 수 읽기', std:'2수01-02', lv:[1,2], t:'mc',
    g(){ const v = pick([ri(1, 9) * 1000 + ri(1, 9) * 10 + ri(1, 9), ri(1, 9) * 1000 + ri(1, 9) * 100, ri(1001, 9999)]), bad = [sino(v + 100 > 9999 ? v - 100 : v + 100), sino(v + 1), sino(+String(v).split('').reverse().join('') || v + 2)].filter(x => x !== sino(v));
      return MC(`<b style="font-size:24px">${v}</b>${P(v, '을', '를')} 바르게 읽은 것은?`, [sino(v), ...bad], `자리의 숫자가 0이면 그 자리는 읽지 않아요 → <b>${sino(v)}</b>`); } },
  { id:'k-digit', name:'자리의 숫자가 나타내는 값', std:'2수01-02', lv:[2,3], t:'both',
    g(){ const v = ri(1111, 9999), s = String(v), k = ri(0, 3), d = +s[3 - k]; if (!d) return this.g();
      return N(`${v}에서 숫자 ${d}${P(d, '이', '가')} 나타내는 값은? (${PV[k]}의 자리)`, d * Math.pow(10, k), `${PV[k]}의 자리 숫자 ${d} → <b>${d * Math.pow(10, k)}</b>`, [d, d * Math.pow(10, (k + 1) % 4), d * Math.pow(10, (k + 2) % 4)].filter(x => x !== d * Math.pow(10, k))); } },
  { id:'k-skip', name:'뛰어 세기', std:'2수01-03', lv:[2,3], t:'both',
    g(L){ const d = pick(L > 2 ? [1000, 100, 10, -1000, -100] : [1000, 100, 10]), s = d > 0 ? ri(1001, 9999 - 5 * Math.abs(d)) : ri(1000 + 5 * Math.abs(d), 9999), seq = range(0, 4).map(i => s + d * i), h = ri(2, 4);
      return N(`${Math.abs(d)}씩 ${d > 0 ? '뛰어 세었어요' : '거꾸로 뛰어 세었어요'}. □ 안에 알맞은 수는? ${E(seq.map((x, i) => i === h ? '□' : x).join(' — '))}`, seq[h], `${PV[String(Math.abs(d)).length - 1]}의 자리 숫자가 1씩 ${d > 0 ? '커져요' : '작아져요'} → <b>${seq[h]}</b>`, [seq[h] + d, seq[h] - d, seq[h] + (Math.abs(d) === 10 ? 100 : 10)]); } },
  { id:'k-cmp', name:'네 자리 수의 크기 비교', std:'2수01-03', lv:[2,3], t:'mc',
    g(L){ if (L > 2){ const b = ri(2, 8) * 1000 + ri(1, 8) * 100, s = new Set(); while (s.size < 4) s.add(b + ri(0, 99) + pick([0, 100])); const a = [...s], mx = ri(0, 1), t = mx ? Math.max(...a) : Math.min(...a); return MC(`<b>가장 ${mx ? '큰' : '작은'}</b> 수는? ${E(a.join(', '))}`, [String(t), ...a.filter(x => x !== t).map(String)], `천의 자리부터 차례로 비교해요 → <b>${t}</b>`); }
      const a = ri(1001, 9999), b = pick([a + 10, a - 10, a + 100 > 9999 ? a - 100 : a + 100, a + 1, a - 1]), c = CMP(a, b);
      return MC(`○ 안에 &gt;, &lt;를 알맞게 써넣으세요. ${E(`${a} ○ ${b}`)}`, [c, c === '&gt;' ? '&lt;' : '&gt;'], `높은 자리부터 차례로 비교해요 → <b>${a} ${c} ${b}</b>`); } },
  { id:'k-money', name:'돈으로 알아보는 네 자리 수', std:'2수01-02', lv:[3,4], t:'both',
    g(L){ const a = ri(1, 5), b = L > 3 ? ri(10, 15) : ri(0, 9), c = ri(0, 9), v = a * 1000 + b * 100 + c * 10;
      return N(`1000원짜리 지폐 ${a}장, 100원짜리 동전 ${b}개, 10원짜리 동전 ${c}개는 모두 얼마일까요?`, v, `${a * 1000} + ${b * 100} + ${c * 10} = <b>${v}원</b>${b >= 10 ? ' (100원짜리 10개 = 1000원!)' : ''}`, [a * 1000 + (b % 10) * 100 + c * 10, v + 1000, a * 100 + b * 10 + c], '원'); } },
  { id:'k-save', name:'모은 돈 계산하기', std:'2수01-03', lv:[4,4], t:'both',
    g(){ const s = ri(2, 6) * 1000, d = pick([1000, 500, 100]) === 500 ? 1000 : pick([1000, 100]), n = ri(2, 5);
      return N(`저금통에 ${s}원이 있어요. 한 달에 ${d}원씩 ${n}달 동안 더 모으면 모두 얼마가 될까요?`, s + d * n, `${s}에서 ${d}씩 ${n}번 뛰어 세요: ${range(0, n).map(i => s + d * i).join(' → ')} → <b>${s + d * n}원</b>`, [s + d * (n - 1), s + d * (n + 1), s + d], '원'); } },
  { id:'k-missing', name:'□ 안에 들어갈 수 있는 숫자', std:'2수01-03', lv:[4,5], t:'both',
    g(){ const a = ri(2, 8), b = ri(2, 7), c = ri(0, 9), d = ri(0, 9), x = a * 1000 + b * 100 + c * 10 + d, big = ri(0, 1), cc = ri(0, 9), dd = ri(0, 9);
      const cnt = range(0, 9).filter(q => { const v = a * 1000 + q * 100 + cc * 10 + dd; return big ? v > x : v < x; }).length; if (!cnt || cnt === 10) return this.g();
      return N(`0부터 9까지의 숫자 중 □ 안에 들어갈 수 있는 숫자는 모두 몇 개일까요? ${E(`${a}□${cc}${dd} ${big ? '&gt;' : '&lt;'} ${x}`)}`, cnt, `천의 자리가 같으므로 백의 자리부터 비교해요. 0부터 9까지 넣어 보면 <b>${cnt}개</b>`, [cnt + 1, cnt - 1, 10 - cnt], '개'); } },
  { id:'k-cards', name:'수 카드로 네 자리 수 만들기', std:'2수01-03', lv:[5,5], t:'both',
    g(){ const c = shuffle(range(0, 9)).slice(0, 4); if (!c.some(x => x)) return this.g(); const d = c.slice().sort((a, b) => b - a), as = c.slice().sort((a, b) => a - b), nz = as.find(x => x > 0), small = +[nz, ...as.filter(x => x !== nz)].join(''), big = +d.join(''), t = ri(0, 2), v = [big, small, big - small][t];
      return N(`수 카드 ${card(c)}를 한 번씩만 사용하여 네 자리 수를 만들려고 해요. ${['가장 큰 수는', '가장 작은 수는', '가장 큰 수와 가장 작은 수의 차는'][t]}?`, v, `가장 큰 수 ${big}, 가장 작은 수 ${small}(0은 천의 자리에 올 수 없어요) → <b>${v}</b>`, [t === 1 ? +as.join('') || v + 1 : v + 9, v + 1, t === 2 ? big + small : v - 9]); } }
]});

/* ─────────────── 2. 곱셈구구 ─────────────── */
const GI = ['🍪', '🍓', '🐟', '🍬', '🌷', '🍎'];
const groupsFig = (ic, k, n) => `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0">${range(1, n).map(() => `<span style="border:2.5px solid #4CB963;border-radius:14px;padding:3px 6px;font-size:20px">${ic.repeat(k)}</span>`).join('')}</div>`;
const mulTable = (rows, cols, hide) => `<table class="qt"><tr><th>×</th>${cols.map(c => `<th>${c}</th>`).join('')}</tr>${rows.map(r => `<tr><th>${r}</th>${cols.map(c => `<td style="${hide && hide[0] === r && hide[1] === c ? 'background:#FFF4D0' : ''}">${hide && hide[0] === r && hide[1] === c ? '□' : r * c}</td>`).join('')}</tr>`).join('')}</table>`;
A.addUnit({ key:'2-2-2', title:'곱셈구구', items:[
  { id:'gg-25', name:'2단, 5단 곱셈구구', std:'2수01-11', lv:[1,1], t:'both',
    g(){ const a = pick([2, 5]), b = ri(1, 9); return N(`${a} × ${b}의 값은?`, a * b, `${a}단 곱셈구구: ${a} × ${b} = <b>${a * b}</b> (${a}씩 ${b}번)`, [a * b + a, a * b - a, a + b]); } },
  { id:'gg-3648', name:'3단, 6단, 4단, 8단 곱셈구구', std:'2수01-11', lv:[1,2], t:'both',
    g(){ const a = pick([3, 6, 4, 8]), b = ri(2, 9); return N(`${a} × ${b}의 값은?`, a * b, `${a}단 곱셈구구 → <b>${a * b}</b>${a === 6 ? ` (3 × ${b}의 2배)` : a === 8 ? ` (4 × ${b}의 2배)` : ''}`, [a * b + a, a * b - a, a * (b + 2)]); } },
  { id:'gg-79', name:'7단, 9단 곱셈구구', std:'2수01-11', lv:[2,2], t:'both',
    g(){ const a = pick([7, 9]), b = ri(2, 9); return N(`${a} × ${b}의 값은?`, a * b, `${a}단 곱셈구구 → <b>${a * b}</b>${a === 9 ? ` (9 × ${b} = 10 × ${b} - ${b})` : ''}`, [a * b + a, a * b - a, a * b + 1]); } },
  { id:'gg-fig', name:'그림을 보고 곱셈식 쓰기', std:'2수01-11', lv:[1,1], t:'both',
    g(){ const k = ri(2, 6), n = ri(2, 5), ic = pick(GI); return N(`그림을 보고 곱셈식으로 나타내면 ${k} × ${n} = □예요. □ 안에 알맞은 수는?${groupsFig(ic, k, n)}`, k * n, `${k}씩 ${n}묶음 → ${k} × ${n} = <b>${k * n}</b>`, [k + n, k * n + k, k * (n - 1)]); } },
  { id:'gg-01', name:'1단 곱셈구구와 0의 곱', std:'2수01-11', lv:[2,2], t:'both',
    g(){ const b = ri(1, 9), t = ri(0, 2), e = [[`1 × ${b}`, b], [`${b} × 0`, 0], [`0 × ${b}`, 0]][t]; return N(`${e[0]}의 값은?`, e[1], t ? `0과 어떤 수의 곱은 항상 <b>0</b>이에요.` : `1과 어떤 수의 곱은 항상 그 수 → <b>${b}</b>`, [t ? b : 1, b + 1, 1]); } },
  { id:'gg-swap', name:'곱하는 순서 바꾸기', std:'2수01-11', lv:[2,3], t:'both',
    g(){ const a = ri(2, 9), b = ri(2, 9); return N(`□ 안에 알맞은 수는? ${E(`${a} × ${b} = ${b} × □`)}`, a, `곱하는 두 수의 순서를 바꾸어도 곱은 같아요 → <b>${a}</b>`, [b, a * b, a + 1]); } },
  { id:'gg-word', name:'곱셈구구 생활 문제', std:'2수01-11', lv:[2,3], t:'both',
    g(){ const S = pick([['한 상자에 도넛이 6개씩', 6, '상자', '도넛', '개'], ['세발자전거 한 대에 바퀴가 3개', 3, '대', '바퀴', '개'], ['꽃 한 송이에 꽃잎이 5장', 5, '송이', '꽃잎', '장'], ['한 팩에 우유가 4개씩', 4, '팩', '우유', '개'], ['거미 한 마리의 다리가 8개', 8, '마리', '거미 다리', '개'], ['일주일은 7일', 7, '주일', '날', '일']]), n = ri(2, 9);
      return N(`${S[0]} 있어요. ${n}${S[2]}${S[2] === '주일' ? '은 모두 며칠일까요?' : `에 있는 ${S[3]}${P(S[3], '은', '는')} 모두 몇 ${S[4]}일까요?`}`.replace('일주일은 7일 있어요.', '일주일은 7일이에요.'), S[1] * n, `${S[1]} × ${n} = <b>${S[1] * n}${S[4]}</b>`, [S[1] + n, S[1] * (n + 1), S[1] * (n - 1)], S[4]); } },
  { id:'gg-missing', name:'□가 있는 곱셈', std:'2수01-11', lv:[3,3], t:'both',
    g(){ const a = ri(2, 9), b = ri(2, 9), t = ri(0, 1); return N(`□ 안에 알맞은 수는? ${E(t ? `${a} × □ = ${a * b}` : `□ × ${b} = ${a * b}`)}`, t ? b : a, `${t ? a : b}단 곱셈구구에서 곱이 ${a * b}인 것을 찾아요 → <b>${t ? b : a}</b>`, [t ? b + 1 : a + 1, a * b - (t ? a : b), t ? a : b]); } },
  { id:'gg-table', name:'곱셈표', std:'2수01-11', lv:[3,4], t:'both',
    g(L){ if (L > 3){ const p = pick([12, 18, 24, 36, 16, 8, 6]), cnt = range(1, 9).filter(i => p % i === 0 && p / i <= 9).length; return N(`1단부터 9단까지의 곱셈표에서 곱이 <b>${p}</b>인 칸은 모두 몇 개일까요?`, cnt, `${range(1, 9).filter(i => p % i === 0 && p / i <= 9).map(i => `${i} × ${p / i}`).join(', ')} → <b>${cnt}개</b>`, [cnt + 1, cnt - 1, cnt + 2], '개'); }
      const rows = shuffle(range(2, 9)).slice(0, 3).sort((a, b) => a - b), cols = shuffle(range(2, 9)).slice(0, 4).sort((a, b) => a - b), h = [pick(rows), pick(cols)];
      return N(`곱셈표에서 □ 안에 알맞은 수는?${mulTable(rows, cols, h)}`, h[0] * h[1], `${h[0]} × ${h[1]} = <b>${h[0] * h[1]}</b>`, [h[0] * h[1] + h[0], h[0] * h[1] - h[1], h[0] + h[1]]); } },
  { id:'gg-cmp', name:'곱의 크기 비교', std:'2수01-11', lv:[3,3], t:'mc',
    g(){ const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9), d = ri(2, 9), cc = CMP(a * b, c * d);
      return MC(`○ 안에 알맞은 것은? ${E(`${a} × ${b} ○ ${c} × ${d}`)}`, [cc, ...CMPC.filter(z => z !== cc)], `${a * b} ${cc} ${c * d} → <b>${cc}</b>`); } },
  { id:'gg-two', name:'곱셈구구를 두 번 사용하기', std:'2수01-11', lv:[4,5], t:'both',
    g(L){ if (L > 4){ const a = ri(2, 5), b = ri(2, 5), c = ri(1, 4); return N(`과녁 맞히기 놀이에서 3점짜리를 ${a}번, 2점짜리를 ${b}번, 0점짜리를 ${c}번 맞혔어요. 얻은 점수는 모두 몇 점일까요?`, 3 * a + 2 * b, `3 × ${a} = ${3 * a}, 2 × ${b} = ${2 * b}, 0 × ${c} = 0 → ${3 * a} + ${2 * b} + 0 = <b>${3 * a + 2 * b}점</b>`, [3 * a + 2 * b + c, a + b + c, 3 * a + 2 * b + 1], '점'); }
      const a = ri(2, 5), b = ri(2, 6), c = ri(2, 5), d = ri(2, 6); return N(`빨간 구슬은 ${a}개씩 ${b}묶음, 파란 구슬은 ${c}개씩 ${d}묶음 있어요. 구슬은 모두 몇 개일까요?`, a * b + c * d, `${a} × ${b} = ${a * b}, ${c} × ${d} = ${c * d} → ${a * b} + ${c * d} = <b>${a * b + c * d}개</b>`, [a * b, a * b + c * d + 1, (a + c) * (b + d)], '개'); } }
]});

/* ─────────────── 3. 길이 재기 ─────────────── */
const mcm = v => Math.floor(v / 100) ? `${Math.floor(v / 100)} m${v % 100 ? ` ${v % 100} cm` : ''}` : `${v} cm`;
A.addUnit({ key:'2-2-3', title:'길이 재기', items:[
  { id:'m-conv', name:'1 m와 cm의 관계', std:'2수03-11', lv:[1,2], t:'both',
    g(L){ const m = ri(1, 4), c = ri(L > 1 ? 1 : 10, 99), v = m * 100 + c, t = L > 1 ? ri(0, 1) : 1;
      return t ? N(`${m} m ${c} cm는 몇 cm일까요?`, v, `1 m = 100 cm → ${m} m ${c} cm = ${m * 100} cm + ${c} cm = <b>${v} cm</b>`, [m * 10 + c, m + c, v + 100], 'cm')
        : N(`${v} cm는 몇 m 몇 cm일까요? <b>cm 부분</b>의 수를 구하세요.`, c, `${v} cm = ${m * 100} cm + ${c} cm = ${m} m <b>${c} cm</b>`, [m, v, c + 10], 'cm'); } },
  { id:'m-unit', name:'알맞은 단위 고르기', std:'2수03-10', lv:[1,1], t:'mc',
    g(){ const Q0 = pick([['교실 칠판의 긴 쪽의 길이', 'm'], ['연필의 길이', 'cm'], ['기차의 길이', 'm'], ['지우개의 길이', 'cm'], ['운동장 긴 쪽의 길이', 'm'], ['색연필의 길이', 'cm']]);
      return MC(`<b>${Q0[0]}</b>를 나타내기에 알맞은 단위는?`.replace('이를', '이를'), [Q0[1], Q0[1] === 'm' ? 'cm' : 'm'], `짧은 길이는 cm, 긴 길이는 m로 나타내면 편리해요 → <b>${Q0[1]}</b>`); } },
  { id:'m-add', name:'길이의 합', std:'2수03-13', lv:[2,3], t:'mc',
    g(L){ const a = ri(1, 3) * 100 + ri(10, 60), b = ri(1, 3) * 100 + ri(10, L > 2 ? 89 : 39); const r = a + b;
      return MC(`${mcm(a)} + ${mcm(b)}의 값은?`, [mcm(r), mcm(r + 100), mcm(r - 10), mcm(r + 10)], `m는 m끼리, cm는 cm끼리 더해요${(a % 100) + (b % 100) >= 100 ? ' (100 cm = 1 m로 받아올림)' : ''} → <b>${mcm(r)}</b>`); } },
  { id:'m-sub', name:'길이의 차', std:'2수03-13', lv:[2,3], t:'mc',
    g(){ const a = ri(3, 6) * 100 + ri(40, 90), b = ri(1, 2) * 100 + ri(10, 39), r = a - b;
      return MC(`${mcm(a)} - ${mcm(b)}의 값은?`, [mcm(r), mcm(r + 100), mcm(r - 100), mcm(r + 10)], `m는 m끼리, cm는 cm끼리 빼요 → <b>${mcm(r)}</b>`); } },
  { id:'m-word', name:'길이의 덧셈과 뺄셈 문제', std:'2수03-13', lv:[3,4], t:'both',
    g(){ const t = ri(0, 1), a = ri(1, 2) * 100 + ri(10, 49), b = ri(1, 2) * 100 + ri(10, 49);
      const n1 = pick(NAMES);
      return t ? N(`${n1}의 키는 ${mcm(a)}이고, 아버지는 ${n1}보다 ${b - 100} cm 더 커요. 아버지의 키는 몇 cm일까요?`, a + b - 100, `${a} cm + ${b - 100} cm = <b>${a + b - 100} cm</b> (${mcm(a + b - 100)})`, [a + b, a - b + 100, a + b - 90], 'cm')
        : N(`길이가 ${mcm(a + b)}인 리본에서 ${mcm(b)}를 잘라 썼어요. 남은 리본은 몇 cm일까요?`, a, `${mcm(a + b)} - ${mcm(b)} = ${mcm(a)} = <b>${a} cm</b>`, [a + b, a + 100, a - 10], 'cm'); } },
  { id:'m-est', name:'몸으로 길이 어림하기', std:'2수03-12', lv:[3,3], t:'both',
    g(){ const n = ri(2, 6), body = pick([['양팔을 벌린 길이', 1, '약 1 m'], ['걸음 2번', 1, '약 1 m']]);
      return N(`${body[0]}가 ${body[2]}예요. 칠판의 길이가 ${body[0]}로 ${n}번이면 칠판의 길이는 약 몇 m일까요?`.replace('가 약', '이(가) 약').replace('이(가)', P(body[0], '이', '가')), n, `약 1 m가 ${n}번 → 약 <b>${n} m</b>`, [n + 1, n * 2, n * 10], 'm'); } },
  { id:'m-cmp', name:'길이 비교하기', std:'2수03-11', lv:[2,3], t:'mc',
    g(){ const v = shuffle(range(1, 3).map(m => m * 100 + ri(5, 95))).slice(0, 3), mx = ri(0, 1), t = mx ? Math.max(...v) : Math.min(...v), show = x => ri(0, 1) ? `${x} cm` : mcm(x);
      const labs = v.map(x => [x, show(x)]); const best = labs.find(z => z[0] === t)[1];
      return MC(`<b>가장 ${mx ? '긴' : '짧은'}</b> 길이는?`, [best, ...labs.filter(z => z[0] !== t).map(z => z[1])], `모두 cm로 바꾸어 비교해요: ${v.map(x => `${x} cm`).join(', ')} → <b>${best}</b>`); } },
  { id:'m-overlap', name:'겹쳐서 이은 길이', std:'2수03-13', lv:[4,5], t:'both',
    g(){ const a = ri(1, 2) * 100 + ri(10, 80), o = ri(1, 4) * 10, tot = 2 * a - o;
      return N(`길이가 ${mcm(a)}인 색 테이프 2장을 ${o} cm만큼 겹쳐서 이어 붙였어요. 이어 붙인 색 테이프의 전체 길이는 몇 cm일까요?`, tot, `${a} + ${a} = ${2 * a} cm, 겹친 부분을 빼면 ${2 * a} - ${o} = <b>${tot} cm</b>`, [2 * a, 2 * a + o, a - o], 'cm'); } }
]});

/* ─────────────── 4. 시각과 시간 ─────────────── */
const hm = (h, m) => `${h}시${m ? ` ${m}분` : ''}`;
A.addUnit({ key:'2-2-4', title:'시각과 시간', items:[
  { id:'tk-5', name:'몇 시 몇 분 읽기 (5분 단위)', std:'2수03-07', lv:[1,1], t:'mc',
    g(){ const h = ri(1, 12), m = ri(1, 11) * 5; return MC(`시계가 나타내는 시각은?${clock(h, m)}`, [hm(h, m), hm(h, m / 5), hm(h % 12 + 1, m), hm(h, (60 - m) % 60 || 30)], `긴바늘이 ${m / 5}${P(m / 5, '을', '를')} 가리키면 ${m}분, 짧은바늘은 ${h}와(과) ${h % 12 + 1} 사이 → <b>${hm(h, m)}</b>`.replace('와(과)', P(h, '과', '와'))); } },
  { id:'tk-1', name:'몇 시 몇 분 읽기 (1분 단위)', std:'2수03-07', lv:[2,2], t:'mc',
    g(){ const h = ri(1, 11), m = ri(1, 58); if (m % 5 === 0) return this.g(); return MC(`시계가 나타내는 시각은?${clock(h, m)}`, [hm(h, m), hm(h, m + 1), hm(h, m - 1 || 2), hm(h + 1, m)], `긴바늘이 가리키는 작은 눈금을 세어요. 숫자 한 칸 = 5분, 작은 눈금 한 칸 = 1분 → <b>${hm(h, m)}</b>`); } },
  { id:'tk-before', name:'몇 시 몇 분 전', std:'2수03-07', lv:[2,3], t:'mc',
    g(){ const h = ri(2, 12), b = pick([5, 10, 15]); return MC(`${h - 1}시 ${60 - b}분을 다르게 읽은 것은?`, [`${h}시 ${b}분 전`, `${h - 1}시 ${b}분 전`, `${h}시 ${60 - b}분 전`, `${h + 1 > 12 ? 1 : h + 1}시 ${b}분 전`], `${h - 1}시 ${60 - b}분에서 ${b}분이 지나면 ${h}시 → <b>${h}시 ${b}분 전</b>`); } },
  { id:'tk-60', name:'1시간 = 60분', std:'2수03-08', lv:[2,2], t:'both',
    g(){ const t = ri(0, 1), h = ri(1, 3), m = ri(1, 5) * 10;
      return t ? N(`${h}시간 ${m}분은 몇 분일까요?`, h * 60 + m, `1시간 = 60분 → ${h * 60}분 + ${m}분 = <b>${h * 60 + m}분</b>`, [h * 100 + m, h + m, h * 60], '분')
        : N(`${h * 60 + m}분은 몇 시간 몇 분일까요? <b>분 부분</b>의 수를 구하세요.`, m, `${h * 60 + m}분 = ${h * 60}분 + ${m}분 = ${h}시간 <b>${m}분</b>`, [h, m + 10, h * 60 + m - 100 > 0 ? h * 60 + m - 100 : m + 20], '분'); } },
  { id:'tk-dur', name:'걸린 시간 구하기', std:'2수03-08', lv:[3,3], t:'both',
    g(){ const h = ri(1, 10), m = ri(0, 5) * 10, d = ri(2, 11) * 10, e = h * 60 + m + d;
      return N(`${pick(NAMES)}는 ${hm(h, m)}에 책을 읽기 시작해서 ${hm(Math.floor(e / 60), e % 60)}에 끝냈어요. 책을 읽은 시간은 몇 분일까요?`, d, `${hm(h, m)} → ${hm(Math.floor(e / 60), e % 60)}: 시간 띠에서 ${d / 10}칸(10분씩) → <b>${d}분</b>`, [d + 10, d - 10, d + 60], '분'); } },
  { id:'tk-ampm', name:'오전과 오후, 하루', std:'2수03-09', lv:[3,4], t:'both',
    g(L){ if (L > 3){ const a = ri(7, 11), b = ri(1, 6); return N(`오전 ${a}시부터 오후 ${b}시까지는 몇 시간일까요?`, 12 - a + b, `오전 ${a}시 → 낮 12시: ${12 - a}시간, 낮 12시 → 오후 ${b}시: ${b}시간 → <b>${12 - a + b}시간</b>`, [b - a + 12 + 1, a + b, Math.abs(b - a)], '시간'); }
      const t = ri(0, 1); return t ? N(`하루는 몇 시간일까요?`, 24, `오전 12시간 + 오후 12시간 = <b>24시간</b>`, [12, 60, 7], '시간') : N(`2일은 몇 시간일까요?`, 48, `1일 = 24시간 → 24 + 24 = <b>48시간</b>`, [24, 36, 60], '시간'); } },
  { id:'tk-week', name:'1주일과 날수', std:'2수03-09', lv:[2,3], t:'both',
    g(L){ if (L > 2){ const w = ri(1, 4), d = ri(1, 6); return N(`${w * 7 + d}일은 몇 주일 며칠일까요? <b>주일 부분</b>의 수를 구하세요.`, w, `1주일 = 7일 → ${w * 7 + d}일 = ${w * 7}일 + ${d}일 = <b>${w}주일</b> ${d}일`, [w + 1, d, w * 7], '주일'); }
      const w = ri(2, 5); return N(`${w}주일은 며칠일까요?`, w * 7, `1주일 = 7일 → 7 × ${w} = <b>${w * 7}일</b>`, [w * 7 + 7, w + 7, w * 5], '일'); } },
  { id:'tk-month', name:'달력과 1년', std:'2수03-09', lv:[3,3], t:'mc',
    g(){ const t = ri(0, 2);
      if (t === 0){ const m = pick([1, 3, 5, 7, 8, 10, 12, 4, 6, 9, 11]), d = [4, 6, 9, 11].includes(m) ? 30 : 31; return MC(`${m}월은 며칠까지 있을까요?`, [`${d}일`, `${d === 30 ? 31 : 30}일`, '28일', '29일'], `날수가 31일인 달: 1, 3, 5, 7, 8, 10, 12월 · 30일인 달: 4, 6, 9, 11월 → <b>${d}일</b>`); }
      if (t === 1){ const y = ri(1, 2), mo = ri(1, 11); return MC(`${y}년 ${mo}개월은 몇 개월일까요?`, [`${y * 12 + mo}개월`, `${y * 10 + mo}개월`, `${y + mo}개월`, `${y * 12 + mo + 1}개월`], `1년 = 12개월 → ${y * 12} + ${mo} = <b>${y * 12 + mo}개월</b>`); }
      return MC('날수가 <b>30일</b>인 달은?', [pick(['4월', '6월', '9월', '11월']), pick(['1월', '3월']), pick(['5월', '7월']), pick(['8월', '10월', '12월'])], '30일까지 있는 달은 4월, 6월, 9월, 11월이에요.'); } },
  { id:'tk-cal', name:'달력에서 날짜와 요일', std:'2수03-09', lv:[4,5], t:'mc',
    g(){ const D = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], m = ri(3, 11), d0 = ri(1, 9), w0 = ri(0, 6), add = pick([7, 14, 21, 10, 12, 16]), d1 = d0 + add, w1 = D[(w0 + add) % 7];
      return MC(`${m}월 ${d0}일은 ${D[w0]}이에요. 같은 달 ${d1}일은 무슨 요일일까요?`, [w1, D[(w0 + add + 1) % 7], D[(w0 + add + 6) % 7], D[(w0 + add + 3) % 7]], `${add}일 뒤 = ${Math.floor(add / 7)}주일${add % 7 ? ` ${add % 7}일` : ''} 뒤 → ${add % 7 ? `${D[w0]}에서 ${add % 7}일 뒤` : '같은 요일'} → <b>${w1}</b>`); } },
  { id:'tk-after', name:'몇 분 후의 시각', std:'2수03-08', lv:[4,5], t:'mc',
    g(){ const h = ri(1, 10), m = ri(1, 5) * 10, d = ri(3, 8) * 10, e = h * 60 + m + d, H2 = Math.floor(e / 60), M2 = e % 60;
      return MC(`${hm(h, m)}에서 ${d}분 후의 시각은?`, [hm(H2, M2), hm(H2 + 1, M2), hm(h, (m + d) % 100), hm(H2, (M2 + 10) % 60)], `${m}분 + ${d}분 = ${m + d}분 = 1시간${m + d - 60 ? ` ${m + d - 60}분` : ''} → <b>${hm(H2, M2)}</b>`); } }
]});

/* ─────────────── 5. 표와 그래프 ─────────────── */
const TOP = [['🍓', '딸기'], ['🍎', '사과'], ['🍇', '포도'], ['🍌', '바나나'], ['🍑', '복숭아']];
const mkData = () => { const k = shuffle(TOP).slice(0, 4); let v; do { v = k.map(() => ri(1, 7)); } while (new Set(v).size < 3); return [k, v]; };
const oGraph = (k, v, mark = '○') => { const mx = Math.max(...v, 5); let h = '<table class="qt" style="font-size:15px">';
  for (let r = mx; r >= 1; r--) h += `<tr><th style="font-size:12px">${r}</th>${v.map(x => `<td style="width:52px;color:#E0464A;font-weight:700">${x >= r ? mark : ''}</td>`).join('')}</tr>`;
  return h + `<tr><th>학생 수(명)<br>／과일</th>${k.map(x => `<th>${x[1]}</th>`).join('')}</tr></table>`; };
const rawData = (k, v) => { const list = shuffle(k.flatMap((x, i) => range(1, v[i]).map(() => x))); return `<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:420px;margin:6px auto">${list.map((x, i) => `<span style="border:1.5px solid #D5DDE8;border-radius:8px;padding:2px 6px;font-size:13px;background:#fff">${NAMES[i % NAMES.length]} ${x[0]}</span>`).join('')}</div>`; };
A.addUnit({ key:'2-2-5', title:'표와 그래프', items:[
  { id:'tg-count', name:'자료를 분류하여 표로 나타내기', std:'2수04-02', lv:[1,2], t:'both',
    g(){ const [k, v] = mkData(), i = ri(0, 3); return N(`친구들이 좋아하는 과일을 조사했어요. <b>${k[i][1]}</b>를 좋아하는 친구는 몇 명일까요?${rawData(k, v)}`, v[i], `${k[i][0]}를 세면 <b>${v[i]}명</b>`, [v[i] + 1, v[i] - 1, v.reduce((a, b) => a + b, 0) - v[i]], '명'); } },
  { id:'tg-total', name:'표의 합계', std:'2수04-02', lv:[1,2], t:'both',
    g(){ const [k, v] = mkData(), s = v.reduce((a, b) => a + b, 0); return N(`조사한 친구는 모두 몇 명일까요?${A.tableH([['과일', ...k.map(x => x[1]), '합계'], ['학생 수(명)', ...v, '?']])}`, s, `${v.join(' + ')} = <b>${s}명</b>`, [s + 1, s - 1, Math.max(...v)], '명'); } },
  { id:'tg-graph', name:'그래프 읽기', std:'2수04-03', lv:[1,2], t:'both',
    g(){ const [k, v] = mkData(), i = ri(0, 3); return N(`그래프를 보고 <b>${k[i][1]}</b>를 좋아하는 학생은 몇 명인지 구하세요.${oGraph(k, v)}`, v[i], `${k[i][1]} 칸의 ○를 세면 <b>${v[i]}명</b>`, [v[i] + 1, v[i] - 1, Math.max(...v)], '명'); } },
  { id:'tg-most', name:'가장 많은 것 찾기', std:'2수04-03', lv:[2,2], t:'mc',
    g(){ const [k, v] = mkData(), mx = ri(0, 1), t = mx ? Math.max(...v) : Math.min(...v); if (v.filter(x => x === t).length > 1) return this.g(); const i = v.indexOf(t);
      return MC(`그래프에서 <b>가장 ${mx ? '많은' : '적은'}</b> 학생이 좋아하는 과일은?${oGraph(k, v)}`, [k[i][1], ...k.filter((_, j) => j !== i).map(x => x[1])], `○가 가장 ${mx ? '많이' : '적게'} 그려진 것 → <b>${k[i][1]}</b>`); } },
  { id:'tg-diff', name:'두 항목의 차', std:'2수04-03', lv:[2,3], t:'both',
    g(){ const [k, v] = mkData(), [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2); if (v[i] === v[j]) return this.g(); const [a, b] = v[i] > v[j] ? [i, j] : [j, i];
      return N(`<b>${k[a][1]}</b>를 좋아하는 학생은 <b>${k[b][1]}</b>를 좋아하는 학생보다 몇 명 더 많을까요?${oGraph(k, v)}`, v[a] - v[b], `${v[a]} - ${v[b]} = <b>${v[a] - v[b]}명</b>`, [v[a] + v[b], v[a], v[a] - v[b] + 1], '명'); } },
  { id:'tg-missing', name:'표와 그래프에서 모르는 수 구하기', std:'2수04-02', lv:[3,4], t:'both',
    g(){ const [k, v] = mkData(), s = v.reduce((a, b) => a + b, 0), i = ri(0, 3);
      return N(`조사한 학생은 모두 ${s}명이에요. <b>${k[i][1]}</b>를 좋아하는 학생은 몇 명일까요?${A.tableH([['과일', ...k.map(x => x[1]), '합계'], ['학생 수(명)', ...v.map((x, j) => j === i ? '?' : x), s]])}`, v[i], `${s} - (${v.filter((_, j) => j !== i).join(' + ')}) = <b>${v[i]}명</b>`, [v[i] + 1, s - v[i], v[i] - 1], '명'); } },
  { id:'tg-good', name:'표와 그래프의 편리한 점', std:'2수04-03', lv:[2,3], t:'mc',
    g(){ const t = ri(0, 1);
      return t ? MC('<b>표</b>로 나타내면 편리한 점은?', ['종류별 수와 전체 수(합계)를 쉽게 알 수 있어요.', '누가 무엇을 좋아하는지 알 수 있어요.', '가장 많은 것을 그림으로 한눈에 볼 수 있어요.', '조사한 날짜를 알 수 있어요.'], '표는 종류별 수와 <b>합계</b>를 한눈에 알 수 있어요. 누가 무엇을 좋아하는지는 자료(조사한 내용)에서 알 수 있어요.')
        : MC('<b>그래프</b>로 나타내면 편리한 점은?', ['가장 많은 것과 가장 적은 것을 한눈에 알 수 있어요.', '전체 학생 수를 바로 알 수 있어요.', '누가 무엇을 좋아하는지 알 수 있어요.', '조사한 사람의 이름을 알 수 있어요.'], '그래프는 ○의 높이로 <b>많고 적음을 한눈에</b> 비교할 수 있어요.'); } },
  { id:'tg-rows', name:'그래프 그리기', std:'2수04-03', lv:[4,4], t:'both',
    g(){ const [k, v] = mkData(), mx = Math.max(...v); return N(`표를 보고 ○를 사용하여 그래프로 나타내려고 해요. 세로 칸은 <b>적어도</b> 몇 칸이 있어야 할까요?${A.tableH([['과일', ...k.map(x => x[1])], ['학생 수(명)', ...v]])}`, mx, `가장 많은 학생 수(${mx}명)만큼 칸이 있어야 모두 나타낼 수 있어요 → <b>${mx}칸</b>`, [mx + 1, v.reduce((a, b) => a + b, 0), Math.min(...v)], '칸'); } },
  { id:'tg-plan', name:'표와 그래프로 계획하기', std:'2수04-03', lv:[4,5], t:'both',
    g(){ const [k, v] = mkData(), s = v.reduce((a, b) => a + b, 0), mx = Math.max(...v), ix = v.indexOf(mx), need = ri(2, 3);
      return N(`반 친구들이 좋아하는 과일을 조사했어요. 가장 많은 친구가 좋아하는 과일을 한 사람에게 ${need}개씩 나누어 주려면 그 과일은 몇 개 필요할까요?${oGraph(k, v)}`, mx * need, `가장 많은 과일: ${k[ix][1]} ${mx}명 → ${mx} × ${need} = <b>${mx * need}개</b>`, [mx, s * need, mx * need + need], '개'); } }
]});

/* ─────────────── 6. 규칙 찾기 ─────────────── */
const PAT = [['AB', 2], ['ABB', 3], ['ABC', 3], ['AABB', 4], ['ABCB', 4]], ICS = [['🔴', '🔵', '🟡'], ['🟥', '🟦', '🟩'], ['⭐', '❤️', '🔷'], ['🌸', '🍀', '🌼']];
const seqOf = (p, ic, n) => range(0, n - 1).map(i => ic['ABC'.indexOf(p[i % p.length])]);
A.addUnit({ key:'2-2-6', title:'규칙 찾기', items:[
  { id:'r-next', name:'무늬에서 규칙 찾기', std:'2수02-01', lv:[1,2], t:'mc',
    g(){ const [p] = pick(PAT), ic = pick(ICS), n = p.length * 2 + ri(1, p.length - 1), s = seqOf(p, ic, n + 1);
      return MC(`규칙에 따라 다음에 올 것은?<div style="font-size:30px;text-align:center;letter-spacing:4px">${s.slice(0, n).join('')}❓</div>`, [s[n], ...ic.filter(x => x !== s[n])], `반복되는 부분: ${seqOf(p, ic, p.length).join('')} → <b>${s[n]}</b>`); } },
  { id:'r-nth', name:'몇째에 올 것 찾기', std:'2수02-01', lv:[3,4], t:'mc',
    g(){ const [p] = pick(PAT), ic = pick(ICS), n = ri(13, 25), s = seqOf(p, ic, n);
      return MC(`${seqOf(p, ic, p.length).join('')} 모양을 규칙적으로 되풀이하여 늘어놓았어요. <b>${ordK(n)}</b>에 놓이는 것은?<div style="font-size:26px;text-align:center;letter-spacing:3px">${seqOf(p, ic, p.length * 2).join('')}…</div>`, [s[n - 1], ...ic.filter(x => x !== s[n - 1])], `${p.length}개씩 되풀이돼요. ${n} = ${p.length} × ${Math.floor((n - 1) / p.length)} + ${(n - 1) % p.length + 1} → 묶음의 ${ordK((n - 1) % p.length + 1)} → <b>${s[n - 1]}</b>`); } },
  { id:'r-stack', name:'쌓은 모양의 규칙', std:'2수02-01', lv:[2,3], t:'both',
    g(){ const t = ri(0, 1), k = ri(4, 6);
      if (t){ const f = n => 2 * n - 1; return N(`쌓기나무를 1개, 3개, 5개, …처럼 2개씩 늘어나도록 쌓았어요. <b>${ordK(k)}</b>에 쌓을 쌓기나무는 몇 개일까요?`, f(k), `1, 3, 5, 7, … 2개씩 늘어나요 → <b>${f(k)}개</b>`, [f(k) + 2, f(k) - 2, 2 * k], '개'); }
      const f = n => n * (n + 1) / 2; return N(`쌓기나무를 계단 모양으로 1층, 2층, 3층, …으로 쌓아요. 첫째 1개, 둘째 3개, 셋째 6개예요. <b>${ordK(k)}</b>에 필요한 쌓기나무는 몇 개일까요?`, f(k), `1, 3, 6, 10, … 2, 3, 4, …씩 늘어나요 → <b>${f(k)}개</b>`, [f(k - 1), f(k) + k, f(k) + 1], '개'); } },
  { id:'r-addtab', name:'덧셈표에서 규칙 찾기', std:'2수02-01', lv:[2,3], t:'both',
    g(){ const rs = shuffle(range(1, 9)).slice(0, 3).sort((a, b) => a - b), cs = shuffle(range(1, 9)).slice(0, 4).sort((a, b) => a - b), h = [pick(rs), pick(cs)];
      return N(`덧셈표에서 □ 안에 알맞은 수는?<table class="qt"><tr><th>+</th>${cs.map(c => `<th>${c}</th>`).join('')}</tr>${rs.map(r => `<tr><th>${r}</th>${cs.map(c => `<td style="${r === h[0] && c === h[1] ? 'background:#FFF4D0' : ''}">${r === h[0] && c === h[1] ? '□' : r + c}</td>`).join('')}</tr>`).join('')}</table>`, h[0] + h[1], `${h[0]} + ${h[1]} = <b>${h[0] + h[1]}</b> (오른쪽으로 갈수록, 아래로 갈수록 커져요)`, [h[0] * h[1], h[0] + h[1] + 1, h[0] + h[1] - 1]); } },
  { id:'r-rule', name:'덧셈표·곱셈표의 규칙', std:'2수02-01', lv:[3,4], t:'mc',
    g(){ const Q0 = pick([['덧셈표에서 오른쪽으로 한 칸 갈 때마다 수가 어떻게 변할까요?', '1씩 커져요.', ['2씩 커져요.', '1씩 작아져요.', '변하지 않아요.']], ['곱셈표에서 5단의 곱의 일의 자리 숫자는 어떤 규칙이 있을까요?', '5와 0이 되풀이돼요.', ['1씩 커져요.', '모두 짝수예요.', '모두 5예요.']], ['곱셈표에서 2단, 4단, 6단, 8단의 곱은 모두 어떤 수일까요?', '짝수', ['홀수', '10보다 작은 수', '5의 배수']], ['곱셈표에서 3단은 아래로(또는 오른쪽으로) 갈수록 몇씩 커질까요?', '3씩 커져요.', ['1씩 커져요.', '2씩 커져요.', '6씩 커져요.']], ['덧셈표에서 ↘ 방향으로 갈 때마다 수가 어떻게 변할까요?', '2씩 커져요.', ['1씩 커져요.', '변하지 않아요.', '10씩 커져요.']]]);
      return MC(Q0[0], [Q0[1], ...Q0[2]], `표를 직접 써 보며 확인해요 → <b>${Q0[1]}</b>`); } },
  { id:'r-multab', name:'곱셈표에서 규칙 찾기', std:'2수02-01', lv:[2,3], t:'both',
    g(){ const a = ri(2, 9), seq = range(1, 9).map(i => a * i), h = ri(3, 8); return N(`곱셈표의 ${a}단에서 수가 ${a}씩 커지는 규칙이 있어요. □ 안에 알맞은 수는? ${E(seq.map((x, i) => i === h ? '□' : x).join(', '))}`, seq[h], `${a} × ${h + 1} = <b>${seq[h]}</b>`, [seq[h] + a, seq[h] - a, seq[h] + 1]); } },
  { id:'r-cal', name:'달력에서 규칙 찾기', std:'2수02-01', lv:[3,4], t:'both',
    g(){ const d = ri(1, 9), k = ri(2, 3), t = ri(0, 1);
      return t ? N(`어느 달 ${d}일은 수요일이에요. 같은 달의 <b>${k + 1}번째 수요일</b>은 며칠일까요?`, d + 7 * k, `같은 요일은 7일마다 돌아와요 → ${d} + 7 × ${k} = <b>${d + 7 * k}일</b>`, [d + 7 * (k + 1), d + 7 * k - 1, d + k], '일')
        : N(`달력에서 ↓ 방향(아래로)으로 수가 몇씩 커질까요?`, 7, `아래 칸은 1주일 뒤 같은 요일 → <b>7씩</b> 커져요`, [1, 6, 8]); } },
  { id:'r-life', name:'생활에서 규칙 찾기', std:'2수02-01', lv:[4,5], t:'mc',
    g(){ const h = ri(7, 9), step = pick([10, 15, 20]), k = 3, times = range(0, k).map(i => h * 60 + step * i), nx = h * 60 + step * (k + 1), f = x => hm(Math.floor(x / 60), x % 60);
      return MC(`버스가 ${times.map(f).join(', ')}, …에 출발해요. 규칙에 따라 다음 버스는 몇 시 몇 분에 출발할까요?`, [f(nx), f(nx + 5), f(nx - step), f(nx + step)], `${step}분마다 출발해요 → <b>${f(nx)}</b>`); } },
  { id:'r-seat', name:'자리 번호의 규칙', std:'2수02-01', lv:[4,5], t:'both',
    g(){ const per = pick([6, 8, 10]), row = ri(3, 6), col = ri(2, per - 1); const v = (row - 1) * per + col;
      return N(`극장 의자에 번호를 붙였어요. 한 줄에 ${per}개씩, 첫째 줄은 1번부터 ${per}번까지, 둘째 줄은 ${per + 1}번부터예요. <b>${ordK(row)} 줄 왼쪽에서 ${ordK(col)}</b> 의자는 몇 번일까요?`, v, `한 줄에 ${per}번씩 커져요: ${row - 1}줄 × ${per} = ${(row - 1) * per}, 그다음 ${ordK(col)} → <b>${v}번</b>`, [v + per, v - per, row * per + col], '번'); } }
]});
})();
