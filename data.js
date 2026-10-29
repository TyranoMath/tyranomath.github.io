/* =========================================================
   ⚙️ TyranoMath 관리 파일 — 앞으로는 이 파일만 고치면 돼요!
   (index.html · gamezone.html · puzzlezone.html 이 함께 사용해요)
   ========================================================= */

const CONFIG = {
  // 🐞 버그 제보방 링크 (구글 설문, 패들렛, GitHub Issues 등 원하는 주소)
  bugReportUrl: '',        // 예: 'https://forms.gle/xxxxxxxx'

  // 🏠 메인 화면에 보여 줄 최신 게임 개수
  latestCount: 4,

  // 🆕 올린 날짜(date)로부터 며칠 동안 NEW 표시를 붙일지
  newDays: 14,

  // 📈 구글 시트 플레이 수 집계 주소 (Apps Script 웹 앱 URL, .../exec 로 끝나요)
  //    넣으면 모든 학생의 플레이 수로 인기 게임 BEST 10 이 정해져요. 비우면 기기별 집계.
  statsUrl: 'https://script.google.com/macros/s/AKfycbzXiOkpy83QWP7IH5TtvasGvP7D4ftbgGplOq9LghoUJ9lo7V01O3MnFmMIsKfWRJLjcw/exec'
};

/* ---------------------------------------------------------
   🔥 인기 게임 BEST 10 (게임존 맨 위)
   - 아래 BEST 에 게임 파일 경로를 1등부터 순서대로 적으면 그 순서로 보여요.
     예: const BEST = ['games/egg-graph.html', 'games/gugudan-volcano.html'];
   - 비워 두면 [] → 플레이 수 순서로 자동 정렬돼요.
       · CONFIG.statsUrl 을 넣었으면: 구글 시트에 모인 '모든 학생'의 플레이 수
       · 안 넣었으면: 이 기기에서 플레이한 수 (교실 전자칠판이면 우리 반 순위)
   --------------------------------------------------------- */
const BEST = [];

/* ---------------------------------------------------------
   📚 단원 목록 — 🦖 개념 탐험대 · 🎯 실력 진단소가 함께 사용해요
   학년 → 학기 → 단원 순서로 보여요 (2022 개정 교육과정 교과서 기준)
   grade : 학년 (1~6)          sem : 학기 (1 또는 2)
   no    : 단원 번호            title : 단원 이름
   area  : 영역 — '수와 연산' / '변화와 관계' / '도형과 측정' / '자료와 가능성' (단원 옆 작은 표시)
   learn : 🦖 개념 탐험대에서 열 파일 (예: 'learn/learn.html?u=5-1-2')
   check : 🎯 실력 진단소에서 열 파일 (예: 'checks/3-1-2.html' 또는 구글 설문 주소)
           → 비워 두면 '준비 중'으로 보여요
   newTab: true 를 붙이면 새 창으로 열려요 (구글 설문처럼 창 안에서 안 열리는 사이트용)
   ※ 3~6학년은 검정 교과서라 출판사마다 단원 이름이 조금 다를 수 있어요. 우리 학교 교과서에 맞게 고쳐 쓰세요.
   ※ 줄 끝의 쉼표(,)를 꼭 확인하세요!
   --------------------------------------------------------- */
const UNITS = [
  // ── 1학년 1학기 ─────────────────────
  { grade:1, sem:1, no:1, area:'수와 연산', title:'9까지의 수', learn:'learn/learn.html?u=1-1-1', check:'checks/assess.html?u=1-1-1' },
  { grade:1, sem:1, no:2, area:'도형과 측정', title:'여러 가지 모양', learn:'learn/learn.html?u=1-1-2', check:'checks/assess.html?u=1-1-2' },
  { grade:1, sem:1, no:3, area:'수와 연산', title:'덧셈과 뺄셈', learn:'learn/learn.html?u=1-1-3', check:'checks/assess.html?u=1-1-3' },
  { grade:1, sem:1, no:4, area:'도형과 측정', title:'비교하기', learn:'learn/learn.html?u=1-1-4', check:'checks/assess.html?u=1-1-4' },
  { grade:1, sem:1, no:5, area:'수와 연산', title:'50까지의 수', learn:'learn/learn.html?u=1-1-5', check:'checks/assess.html?u=1-1-5' },
  // ── 1학년 2학기 ─────────────────────
  { grade:1, sem:2, no:1, area:'수와 연산', title:'100까지의 수', learn:'learn/learn.html?u=1-2-1', check:'checks/assess.html?u=1-2-1' },
  { grade:1, sem:2, no:2, area:'수와 연산', title:'덧셈과 뺄셈(1)', learn:'learn/learn.html?u=1-2-2', check:'checks/assess.html?u=1-2-2' },
  { grade:1, sem:2, no:3, area:'도형과 측정', title:'모양과 시각', learn:'learn/learn.html?u=1-2-3', check:'checks/assess.html?u=1-2-3' },
  { grade:1, sem:2, no:4, area:'수와 연산', title:'덧셈과 뺄셈(2)', learn:'learn/learn.html?u=1-2-4', check:'checks/assess.html?u=1-2-4' },
  { grade:1, sem:2, no:5, area:'변화와 관계', title:'규칙 찾기', learn:'learn/learn.html?u=1-2-5', check:'checks/assess.html?u=1-2-5' },
  { grade:1, sem:2, no:6, area:'수와 연산', title:'덧셈과 뺄셈(3)', learn:'learn/learn.html?u=1-2-6', check:'checks/assess.html?u=1-2-6' },
  // ── 2학년 1학기 ─────────────────────
  { grade:2, sem:1, no:1, area:'수와 연산', title:'세 자리 수', learn:'learn/learn.html?u=2-1-1', check:'checks/assess.html?u=2-1-1' },
  { grade:2, sem:1, no:2, area:'도형과 측정', title:'여러 가지 도형', learn:'learn/learn.html?u=2-1-2', check:'checks/assess.html?u=2-1-2' },
  { grade:2, sem:1, no:3, area:'수와 연산', title:'덧셈과 뺄셈', learn:'learn/learn.html?u=2-1-3', check:'checks/assess.html?u=2-1-3' },
  { grade:2, sem:1, no:4, area:'도형과 측정', title:'길이 재기', learn:'learn/learn.html?u=2-1-4', check:'checks/assess.html?u=2-1-4' },
  { grade:2, sem:1, no:5, area:'자료와 가능성', title:'분류하기', learn:'learn/learn.html?u=2-1-5', check:'checks/assess.html?u=2-1-5' },
  { grade:2, sem:1, no:6, area:'수와 연산', title:'곱셈', learn:'learn/learn.html?u=2-1-6', check:'checks/assess.html?u=2-1-6' },
  // ── 2학년 2학기 ─────────────────────
  { grade:2, sem:2, no:1, area:'수와 연산', title:'네 자리 수', learn:'learn/learn.html?u=2-2-1', check:'checks/assess.html?u=2-2-1' },
  { grade:2, sem:2, no:2, area:'수와 연산', title:'곱셈구구', learn:'learn/learn.html?u=2-2-2', check:'checks/assess.html?u=2-2-2' },
  { grade:2, sem:2, no:3, area:'도형과 측정', title:'길이 재기', learn:'learn/learn.html?u=2-2-3', check:'checks/assess.html?u=2-2-3' },
  { grade:2, sem:2, no:4, area:'도형과 측정', title:'시각과 시간', learn:'learn/learn.html?u=2-2-4', check:'checks/assess.html?u=2-2-4' },
  { grade:2, sem:2, no:5, area:'자료와 가능성', title:'표와 그래프', learn:'learn/learn.html?u=2-2-5', check:'checks/assess.html?u=2-2-5' },
  { grade:2, sem:2, no:6, area:'변화와 관계', title:'규칙 찾기', learn:'learn/learn.html?u=2-2-6', check:'checks/assess.html?u=2-2-6' },
  // ── 3학년 1학기 ─────────────────────
  { grade:3, sem:1, no:1, area:'도형과 측정', title:'평면도형', learn:'learn/learn.html?u=3-1-1', check:'checks/assess.html?u=3-1-1' },
  { grade:3, sem:1, no:2, area:'수와 연산', title:'덧셈과 뺄셈', learn:'learn/learn.html?u=3-1-2', check:'checks/assess.html?u=3-1-2' },
  { grade:3, sem:1, no:3, area:'도형과 측정', title:'길이와 시간', learn:'learn/learn.html?u=3-1-3', check:'checks/assess.html?u=3-1-3' },
  { grade:3, sem:1, no:4, area:'수와 연산', title:'나눗셈', learn:'learn/learn.html?u=3-1-4', check:'checks/assess.html?u=3-1-4' },
  { grade:3, sem:1, no:5, area:'수와 연산', title:'곱셈', learn:'learn/learn.html?u=3-1-5', check:'checks/assess.html?u=3-1-5' },
  { grade:3, sem:1, no:6, area:'수와 연산', title:'분수와 소수', learn:'learn/learn.html?u=3-1-6', check:'checks/assess.html?u=3-1-6' },
  // ── 3학년 2학기 ─────────────────────
  { grade:3, sem:2, no:1, area:'수와 연산', title:'곱셈', learn:'learn/learn.html?u=3-2-1', check:'checks/assess.html?u=3-2-1' },
  { grade:3, sem:2, no:2, area:'수와 연산', title:'나눗셈', learn:'learn/learn.html?u=3-2-2', check:'checks/assess.html?u=3-2-2' },
  { grade:3, sem:2, no:3, area:'도형과 측정', title:'원', learn:'learn/learn.html?u=3-2-3', check:'checks/assess.html?u=3-2-3' },
  { grade:3, sem:2, no:4, area:'도형과 측정', title:'들이와 무게', learn:'learn/learn.html?u=3-2-4', check:'checks/assess.html?u=3-2-4' },
  { grade:3, sem:2, no:5, area:'수와 연산', title:'분수', learn:'learn/learn.html?u=3-2-5', check:'checks/assess.html?u=3-2-5' },
  { grade:3, sem:2, no:6, area:'자료와 가능성', title:'그림그래프', learn:'learn/learn.html?u=3-2-6', check:'checks/assess.html?u=3-2-6' },
  // ── 4학년 1학기 ─────────────────────
  { grade:4, sem:1, no:1, area:'도형과 측정', title:'각도', learn:'learn/learn.html?u=4-1-1', check:'checks/assess.html?u=4-1-1' },
  { grade:4, sem:1, no:2, area:'수와 연산', title:'큰 수', learn:'learn/learn.html?u=4-1-2', check:'checks/assess.html?u=4-1-2' },
  { grade:4, sem:1, no:3, area:'도형과 측정', title:'평면도형의 이동', learn:'learn/learn.html?u=4-1-3', check:'checks/assess.html?u=4-1-3' },
  { grade:4, sem:1, no:4, area:'수와 연산', title:'곱셈과 나눗셈', learn:'learn/learn.html?u=4-1-4', check:'checks/assess.html?u=4-1-4' },
  { grade:4, sem:1, no:5, area:'변화와 관계', title:'규칙 찾기', learn:'learn/learn.html?u=4-1-5', check:'checks/assess.html?u=4-1-5' },
  { grade:4, sem:1, no:6, area:'자료와 가능성', title:'막대그래프', learn:'learn/learn.html?u=4-1-6', check:'checks/assess.html?u=4-1-6' },
  // ── 4학년 2학기 ─────────────────────
  { grade:4, sem:2, no:1, area:'도형과 측정', title:'삼각형', learn:'learn/learn.html?u=4-2-1', check:'checks/assess.html?u=4-2-1' },
  { grade:4, sem:2, no:2, area:'수와 연산', title:'분수의 덧셈과 뺄셈', learn:'learn/learn.html?u=4-2-2', check:'checks/assess.html?u=4-2-2' },
  { grade:4, sem:2, no:3, area:'도형과 측정', title:'사각형', learn:'learn/learn.html?u=4-2-3', check:'checks/assess.html?u=4-2-3' },
  { grade:4, sem:2, no:4, area:'수와 연산', title:'소수의 덧셈과 뺄셈', learn:'learn/learn.html?u=4-2-4', check:'checks/assess.html?u=4-2-4' },
  { grade:4, sem:2, no:5, area:'도형과 측정', title:'다각형', learn:'learn/learn.html?u=4-2-5', check:'checks/assess.html?u=4-2-5' },
  { grade:4, sem:2, no:6, area:'자료와 가능성', title:'꺾은선그래프', learn:'learn/learn.html?u=4-2-6', check:'checks/assess.html?u=4-2-6' },
  // ── 5학년 1학기 ─────────────────────
  { grade:5, sem:1, no:1, area:'수와 연산', title:'자연수의 혼합 계산', learn:'learn/learn.html?u=5-1-1', check:'checks/assess.html?u=5-1-1' },
  { grade:5, sem:1, no:2, area:'수와 연산', title:'약수와 배수', learn:'learn/learn.html?u=5-1-2', check:'checks/assess.html?u=5-1-2' },
  { grade:5, sem:1, no:3, area:'변화와 관계', title:'대응 관계', learn:'learn/learn.html?u=5-1-3', check:'checks/assess.html?u=5-1-3' },
  { grade:5, sem:1, no:4, area:'수와 연산', title:'약분과 통분', learn:'learn/learn.html?u=5-1-4', check:'checks/assess.html?u=5-1-4' },
  { grade:5, sem:1, no:5, area:'수와 연산', title:'분수의 덧셈과 뺄셈', learn:'learn/learn.html?u=5-1-5', check:'checks/assess.html?u=5-1-5' },
  { grade:5, sem:1, no:6, area:'도형과 측정', title:'다각형의 둘레와 넓이', learn:'learn/learn.html?u=5-1-6', check:'checks/assess.html?u=5-1-6' },
  // ── 5학년 2학기 ─────────────────────
  { grade:5, sem:2, no:1, area:'수와 연산', title:'수의 범위와 어림하기', learn:'learn/learn.html?u=5-2-1', check:'checks/assess.html?u=5-2-1' },
  { grade:5, sem:2, no:2, area:'수와 연산', title:'분수의 곱셈', learn:'learn/learn.html?u=5-2-2', check:'checks/assess.html?u=5-2-2' },
  { grade:5, sem:2, no:3, area:'도형과 측정', title:'합동과 대칭', learn:'learn/learn.html?u=5-2-3', check:'checks/assess.html?u=5-2-3' },
  { grade:5, sem:2, no:4, area:'수와 연산', title:'소수의 곱셈', learn:'learn/learn.html?u=5-2-4', check:'checks/assess.html?u=5-2-4' },
  { grade:5, sem:2, no:5, area:'도형과 측정', title:'직육면체', learn:'learn/learn.html?u=5-2-5', check:'checks/assess.html?u=5-2-5' },
  { grade:5, sem:2, no:6, area:'자료와 가능성', title:'평균과 가능성', learn:'learn/learn.html?u=5-2-6', check:'checks/assess.html?u=5-2-6' },
  // ── 6학년 1학기 ─────────────────────
  { grade:6, sem:1, no:1, area:'수와 연산', title:'분수의 나눗셈', learn:'learn/learn.html?u=6-1-1', check:'checks/assess.html?u=6-1-1' },
  { grade:6, sem:1, no:2, area:'도형과 측정', title:'각기둥과 각뿔', learn:'learn/learn.html?u=6-1-2', check:'checks/assess.html?u=6-1-2' },
  { grade:6, sem:1, no:3, area:'수와 연산', title:'소수의 나눗셈', learn:'learn/learn.html?u=6-1-3', check:'checks/assess.html?u=6-1-3' },
  { grade:6, sem:1, no:4, area:'변화와 관계', title:'비와 비율', learn:'learn/learn.html?u=6-1-4', check:'checks/assess.html?u=6-1-4' },
  { grade:6, sem:1, no:5, area:'도형과 측정', title:'직육면체의 겉넓이와 부피', learn:'learn/learn.html?u=6-1-5', check:'checks/assess.html?u=6-1-5' },
  { grade:6, sem:1, no:6, area:'자료와 가능성', title:'여러 가지 그래프', learn:'learn/learn.html?u=6-1-6', check:'checks/assess.html?u=6-1-6' },
  // ── 6학년 2학기 ─────────────────────
  { grade:6, sem:2, no:1, area:'수와 연산', title:'분수의 나눗셈', learn:'learn/learn.html?u=6-2-1', check:'checks/assess.html?u=6-2-1' },
  { grade:6, sem:2, no:2, area:'도형과 측정', title:'공간과 입체', learn:'learn/learn.html?u=6-2-2', check:'checks/assess.html?u=6-2-2' },
  { grade:6, sem:2, no:3, area:'수와 연산', title:'소수의 나눗셈', learn:'learn/learn.html?u=6-2-3', check:'checks/assess.html?u=6-2-3' },
  { grade:6, sem:2, no:4, area:'변화와 관계', title:'비례식과 비례배분', learn:'learn/learn.html?u=6-2-4', check:'checks/assess.html?u=6-2-4' },
  { grade:6, sem:2, no:5, area:'도형과 측정', title:'원의 둘레와 넓이', learn:'learn/learn.html?u=6-2-5', check:'checks/assess.html?u=6-2-5' },
  { grade:6, sem:2, no:6, area:'도형과 측정', title:'원기둥, 원뿔, 구', learn:'learn/learn.html?u=6-2-6', check:'checks/assess.html?u=6-2-6' }
];

/* ---------------------------------------------------------
   🎮 게임 카드 한 줄 작성법
   title · desc : 이름 · 한 줄 설명      grade : 학년 (예: '1~2학년')
   area  : 영역                         icon  : 이모지 (image : 썸네일 그림 경로, 선택)
   color : 카드 윗부분 배경색            date  : 올린 날짜 'YYYY-MM-DD' (최신순·NEW 표시에 사용)
   file  : games 폴더 안 HTML 경로 (비워 두면 '준비 중')
   --------------------------------------------------------- */

/* 🎮 티라노 게임존 — 새 게임은 맨 아래에 추가하세요 */
const GAMES = [
  { title:'티라노 덧셈 먹이 주기', desc:'정답 고기를 골라 배고픈 티라노에게 먹여요!',     grade:'1~2학년', area:'수와 연산',     icon:'🍖', color:'#FFE7CC', date:'2026-10-01', file:'games/tyrano-plus.html' },
  { title:'구구단 화산 탈출',      desc:'구구단을 맞히며 부글부글 화산을 빠져나가요.',     grade:'2~3학년', area:'수와 연산',     icon:'🌋', color:'#FFE3EA', date:'2026-10-03', file:'games/gugudan-volcano.html' },
  { title:'도형 화석 발굴',        desc:'땅속에서 나온 도형 화석의 이름과 특징을 맞혀요.', grade:'1~4학년', area:'도형과 측정',   icon:'🦴', color:'#F3E6D3', date:'2026-10-05', file:'games/shape-fossil.html' },
  { title:'티라노 시계 읽기',      desc:'티라노의 하루! 시계를 보고 몇 시인지 맞혀요.',    grade:'1~2학년', area:'도형과 측정',   icon:'⏰', color:'#DDF0FF', date:'2026-10-07', file:'games/tyrano-clock.html' },
  { title:'발자국 규칙 찾기',      desc:'공룡 발자국에 숨은 규칙을 찾아 다음을 맞혀요.',   grade:'1~4학년', area:'변화와 관계',   icon:'🐾', color:'#E4F5D6', date:'2026-10-08', file:'games/pattern-footprint.html' },
  { title:'공룡 알 그래프',        desc:'그림그래프와 막대그래프를 읽고 질문에 답해요.',   grade:'2~4학년', area:'자료와 가능성', icon:'📊', color:'#FFF3C4', date:'2026-10-09', file:'games/egg-graph.html' },
  { title:'줄다리기 연산 대결',    desc:'문제를 맞힐 때마다 티라노들이 줄을 당겨요! 친구나 컴퓨터와 대결해요.', grade:'1~6학년', area:'수와 연산', icon:'🦖', image:'games/thumbs/tug-of-war.svg', color:'#DDF0FF', date:'2026-10-09', file:'games/tug-of-war.html' },
  { title:'풍선 활쏘기 연산 대결', desc:'문제의 답이 적힌 풍선을 활로 맞혀요! 혼자 기록 도전 또는 친구와 대결.', grade:'1~6학년', area:'수와 연산', icon:'🎈', image:'games/thumbs/balloon-archery.svg', color:'#DDF0FF', date:'2026-10-10', file:'games/balloon-archery.html' },
  { title:'티라노 징검다리',       desc:'더 큰 수(또는 더 작은 수)가 적힌 돌만 밟고 강을 건너요! 혼자 기록 도전 또는 친구와 대결.', grade:'1~4학년', area:'수와 연산', icon:'🪨', image:'games/thumbs/stepping-stones.svg', color:'#CDEBFF', date:'2026-10-18', file:'games/stepping-stones.html' },
  { title:'티라노 로켓 어림하기',   desc:'올림·버림·반올림한 수를 찾아 로켓을 발사해요! 혼자 기록 도전 또는 친구와 대결.', grade:'4~6학년', area:'수와 연산', icon:'🚀', image:'games/thumbs/rocket-rounding.svg', color:'#2B2F5C', date:'2026-10-18', file:'games/rocket-rounding.html' },
  { title:'티라노 코코넛 맞히기',   desc:'짝수·홀수·배수·약수… 조건에 맞는 수가 적힌 코코넛만 골라 맞혀요! 혼자 기록 도전 또는 친구와 대결.', grade:'1~5학년', area:'수와 연산', icon:'🥥', image:'games/thumbs/coconut-shy.svg', color:'#FFF1C9', date:'2026-10-18', file:'games/coconut-shy.html' },
  { title:'티라노 달리기 연산 대회', desc:'문제를 맞힐 때마다 티라노가 달려요! 컴퓨터 티라노와 경주하거나 친구와 대결해 결승선까지 먼저 도착해요.', grade:'1~6학년', area:'수와 연산', icon:'🏃', image:'games/thumbs/tyrano-race.svg', color:'#E4F5D6', date:'2026-10-19', file:'games/tyrano-race.html' },
  { title:'티라노 분수 줄다리기',   desc:'분수 문제를 맞힐 때마다 줄을 당겨요! 분수 알아보기부터 분수의 덧셈·뺄셈까지, 컴퓨터나 친구와 대결해요.', grade:'3~4학년', area:'수와 연산', icon:'🪢', image:'games/thumbs/fraction-tug.svg', color:'#FFE3EA', date:'2026-10-20', file:'games/fraction-tug.html' },
  { title:'티라노 크기 비교 양궁',   desc:'두 수의 크기를 비교해 알맞은 기호(>, =, <) 과녁에 화살을 쏴요! 가운데에 맞힐수록 점수가 높아요.', grade:'1~4학년', area:'수와 연산', icon:'🏹', image:'games/thumbs/compare-archery.svg', color:'#DDF0FF', date:'2026-10-20', file:'games/compare-archery.html' },
  { title:'티라노 숫자 카드 로켓',   desc:'숫자 카드로 미션에 맞는 수(가장 큰 수, 가장 작은 짝수…)를 만들어 로켓을 달까지 쏘아 올려요!', grade:'1~4학년', area:'수와 연산', icon:'🚀', image:'games/thumbs/digit-rocket.svg', color:'#1F2552', date:'2026-10-20', file:'games/digit-rocket.html' },
  { title:'티라노 스케이트보드 어림하기 레이스', desc:'올림·버림·반올림한 수를 골라 스케이트보드를 달려요! 컴퓨터 티라노와 경주하거나 친구와 대결해요.', grade:'4~6학년', area:'수와 연산', icon:'🛹', image:'games/thumbs/rounding-skate.svg', color:'#DDF0FF', date:'2026-10-20', file:'games/rounding-skate.html' },
  { title:'곱셈 비행 레이스',       desc:'곱셈 문제의 정답이 적힌 문으로 비행기를 몰아 통과해요! 바다와 도시 하늘을 3D로 날며 혼자 기록 도전 또는 최대 3명이 한 화면에서 대결.', grade:'2~3학년', area:'수와 연산', icon:'✈️', image:'games/thumbs/multiply-race.svg', color:'#CDEBFF', date:'2026-10-29', file:'games/multiply-race.html' },
  { title:'자릿값 공장',            desc:'천·백·십·일 모형을 모아 화면에 나온 수를 만들어요! 숫자나 읽는 말을 보고 자릿값을 익혀요. 혼자 기록 도전 또는 최대 3명이 한 화면에서 대결.', grade:'1~3학년', area:'수와 연산', icon:'🏭', image:'games/thumbs/place-factory.svg', color:'#D5F3EE', date:'2026-10-29', file:'games/place-factory.html' }
];

/* ---------------------------------------------------------
   🧩 티라노 퍼즐존 — 게임 카드와 같은 방법으로 써요 (새 퍼즐은 맨 아래에 추가)
   area : 퍼즐 분류 — '수 퍼즐' / '전략 퍼즐' / '논리 퍼즐' / '도형 퍼즐'
   file : puzzles 폴더 안 HTML 경로
   --------------------------------------------------------- */
/* =========================================================
   🧰 수학 도구존 — 수업 시간에 쓰는 수학 도구 (홈 3단계)
   file 을 넣으면 '▶ 시작하기', 비워 두면 '준비 중'으로 보여요.
   ========================================================= */
const TOOLS = [
  { title:'수 모형',       desc:'천·백·십·일 모형을 놓고 묶고 풀며 자릿값과 받아올림을 보여 줘요.', grade:'1~3학년', area:'수와 연산',   icon:'🧊', color:'#DDF0FF', date:'2026-10-16', file:'tools/base-ten.html' },
  { title:'수직선',        desc:'눈금 간격을 바꿔 가며 자연수·분수·소수를 수직선에 나타내요.',       grade:'1~6학년', area:'수와 연산',   icon:'📏', color:'#FFE7CC', date:'2026-10-16', file:'tools/number-line.html' },
  { title:'분수 막대',     desc:'막대를 똑같이 나누고 겹쳐 보며 분수의 크기를 비교해요.',             grade:'3~6학년', area:'수와 연산',   icon:'🍫', color:'#FFE3EA', date:'2026-10-16', file:'tools/fraction-bars.html' },
  { title:'곱셈 배열판',   desc:'가로·세로 칸 수를 정해 곱셈과 나눗셈을 배열로 보여 줘요.',           grade:'2~4학년', area:'수와 연산',   icon:'🔢', color:'#FFF3C4', date:'2026-10-16', file:'tools/array.html' },
  { title:'모형 시계',     desc:'시곗바늘을 돌리며 시각과 걸린 시간을 함께 알아봐요.',               grade:'1~3학년', area:'도형과 측정', icon:'⏰', color:'#DDF0FF', date:'2026-10-16', file:'tools/clock.html' },
  { title:'각도기와 자',   desc:'화면 위 각도기와 자로 각과 길이를 직접 재어 봐요.',                 grade:'2~4학년', area:'도형과 측정', icon:'📐', color:'#E4F5D6', date:'2026-10-16', file:'tools/protractor.html' },
  { title:'기하판',        desc:'못에 고무줄을 걸어 여러 가지 도형을 만들고 넓이를 세어 봐요.',       grade:'2~6학년', area:'도형과 측정', icon:'🔷', color:'#EFE6FF', date:'2026-10-16', file:'tools/geoboard.html' },
  { title:'쌓기나무',      desc:'쌓기나무를 쌓고 위·앞·옆에서 본 모양을 알아봐요.',                  grade:'2~6학년', area:'도형과 측정', icon:'🧱', color:'#F3E6D3', date:'2026-10-16', file:'tools/cubes.html' },
  { title:'그래프 만들기', desc:'자료를 넣으면 그림그래프·막대그래프·꺾은선그래프·띠그래프·원그래프로 바꿔 줘요.',      grade:'2~6학년', area:'자료와 가능성', icon:'📊', color:'#FFF3C4', date:'2026-10-16', file:'tools/graph-maker.html' },
  { title:'주사위와 회전판', desc:'주사위를 던지고 회전판을 돌려 일이 일어날 가능성을 알아봐요.',     grade:'5~6학년', area:'자료와 가능성', icon:'🎲', color:'#FFE3EA', date:'2026-10-16', file:'tools/chance.html' },
  { title:'분수 수학 도구', pin:2, desc:'분수 막대와 분수 원을 꺼내 색칠하고, 겹치고, 비교 자로 재며 분수의 크기와 계산을 함께 알아봐요. 수업 활동도 바로 꺼낼 수 있어요.', grade:'3~6학년', area:'수와 연산', icon:'🥧', color:'#FFE3EA', date:'2026-10-21', file:'tools/fraction-tools.html' },
  { title:'2D 기하도구', pin:1, desc:'모눈 위에 점·선·도형을 그리고, 각도기·자·컴퍼스로 재고, 넓이를 자르고 붙여 봐요. 주사위·모래시계 같은 수업 도구도 함께 있어요.', grade:'1~6학년', area:'도형과 측정', icon:'🔺', color:'#E4F5D6', date:'2026-10-25', file:'tools/geometry-2d.html' },
  { title:'빙고', desc:'숫자나 낱말로 빙고판을 만들고, 번호를 뽑아 표시하며 반 친구들과 함께 빙고 놀이를 해요.', grade:'1~6학년', area:'수와 연산', icon:'🎱', color:'#FFF3C4', date:'2026-10-25', file:'tools/bingo.html' }
];

const PUZZLES = [
  { title:'티라노 스도쿠', desc:'가로·세로·상자에 같은 숫자가 겹치지 않게 빈칸을 채워요. 4×4부터 9×9까지!', grade:'1~6학년', area:'수 퍼즐',   icon:'🔢', image:'puzzles/thumbs/sudoku.svg', color:'#EFE6FF', date:'2026-10-09', file:'puzzles/sudoku.html' },
  { title:'티라노 오목',   desc:'공룡 알 5개를 먼저 한 줄로 이으면 승리! 친구나 컴퓨터 티라노와 겨뤄요.',     grade:'1~6학년', area:'전략 퍼즐', icon:'🥚', image:'puzzles/thumbs/omok.svg',   color:'#F6E3C0', date:'2026-10-09', file:'puzzles/omok.html' },
  { title:'티라노 블록 쌓기', desc:'떨어지는 블록을 돌리고 옮겨서 가로줄을 꽉 채워 없애요! 공간 감각이 쑥쑥.', grade:'1~6학년', area:'도형 퍼즐', icon:'🧱', image:'puzzles/thumbs/block-stack.svg',   color:'#E6EEFB', date:'2026-10-10', file:'puzzles/block-stack.html' },
  { title:'티라노 그림 로직',  desc:'줄마다 적힌 숫자 단서로 칸을 칠하면 숨은 공룡 그림이 나타나요!',          grade:'2~6학년', area:'논리 퍼즐', icon:'🖼️', image:'puzzles/thumbs/picture-logic.svg', color:'#F3ECFF', date:'2026-10-10', file:'puzzles/picture-logic.html' },
  { title:'티라노 지뢰 찾기',  desc:'숫자 단서로 잔디 밑에 숨은 화산을 피해 안전한 칸을 모두 열어요.',          grade:'3~6학년', area:'논리 퍼즐', icon:'🌋', image:'puzzles/thumbs/minesweeper.svg',  color:'#E4F5D6', date:'2026-10-10', file:'puzzles/minesweeper.html' },
  { title:'티라노 픽셀 아트',  desc:'네모 칸을 칠해 나만의 픽셀 그림을 만들어요. 대칭 그리기와 그림 저장도 돼요!', grade:'1~6학년', area:'도형 퍼즐', icon:'🎨', image:'puzzles/thumbs/pixel-art.svg',     color:'#FFF3C4', date:'2026-10-10', file:'puzzles/pixel-art.html' },
  { title:'티라노 사무라이 스도쿠', desc:'9×9 스도쿠 판 5개가 겹쳐 있어요! 겹친 상자는 두 판의 규칙을 모두 지켜야 하는 최강 도전.', grade:'3~6학년', area:'수 퍼즐', icon:'🏯', image:'puzzles/thumbs/samurai-sudoku.svg', color:'#EFE6FF', date:'2026-10-11', file:'puzzles/samurai-sudoku.html' },
  { title:'티라노 슬라이딩 퍼즐', desc:'빈칸으로 조각을 밀어 숫자 순서나 공룡·우주·바다 그림을 완성해요. 내 사진으로도 할 수 있어요!', grade:'1~6학년', area:'논리 퍼즐', icon:'🧩', image:'puzzles/thumbs/sliding.svg', color:'#EFE6FF', date:'2026-10-11', file:'puzzles/sliding.html' },
  { title:'티라노 타일 매칭', desc:'1층·2층으로 쌓인 타일에서 같은 짝 3개를 모아 없애요. 과일·동물부터 연산·수 세기·도형까지!', grade:'1~4학년', area:'수 퍼즐', icon:'🀄', image:'puzzles/thumbs/tile-match.svg', color:'#EFE6FF', date:'2026-10-12', file:'puzzles/tile-match.html' },
  { title:'티라노 크로스 매스', desc:'빈칸에 숫자 화석을 놓아 가로식과 세로식을 모두 맞혀요! 덧셈·뺄셈부터 혼합 계산까지 4단계.', grade:'1~6학년', area:'수 퍼즐', icon:'➕', image:'puzzles/thumbs/crossmath.svg', color:'#FFE7CC', date:'2026-10-12', file:'puzzles/crossmath.html' },
  { title:'티라노 2048', desc:'판을 밀어 같은 수끼리 합쳐요! 2, 4, 8, 16… 두 배씩 커지는 수로 2048에 도전해요.', grade:'1~6학년', area:'수 퍼즐', icon:'🔢', image:'puzzles/thumbs/2048.svg', color:'#FFF1C9', date:'2026-10-17', file:'puzzles/2048.html' },
  { title:'티라노 드랍더넘버', desc:'숫자 블록을 떨어뜨려 같은 수끼리 합쳐요! 연달아 합치면 콤보 점수가 쑥쑥.', grade:'1~6학년', area:'수 퍼즐', icon:'⬇️', image:'puzzles/thumbs/drop-number.svg', color:'#DDF0FF', date:'2026-10-17', file:'puzzles/drop-number.html' },
  { title:'티라노 켄켄', desc:'줄마다 같은 수 없이, 묶음 칸의 계산 결과를 맞춰 칸을 채워요. 3×3부터 7×7까지.', grade:'2~6학년', area:'수 퍼즐', icon:'🧮', image:'puzzles/thumbs/kenken.svg', color:'#E4F5D6', date:'2026-10-17', file:'puzzles/kenken.html' },
  { title:'티라노 장기', desc:'친구와 둘이서, 또는 컴퓨터 티라노와 장기를 둬요. 외통수로 왕을 잡으면 승리!', grade:'3~6학년', area:'전략 퍼즐', icon:'🀄', image:'puzzles/thumbs/janggi.svg', color:'#F6E3C6', date:'2026-10-17', file:'puzzles/janggi.html' },
  { title:'티라노 체스', desc:'친구와 둘이서, 또는 컴퓨터 티라노와 체스를 둬요. 체크메이트로 킹을 잡으면 승리!', grade:'3~6학년', area:'전략 퍼즐', icon:'♟️', image:'puzzles/thumbs/chess.svg', color:'#EFE6FF', date:'2026-10-17', file:'puzzles/chess.html' },
  { title:'티라노 도형퍼즐', desc:'칠교판·패턴블록·펜토미노 등 여러 조각으로 그림자 모양을 맞춰요! 돌리고 뒤집어 작품을 완성해요.', grade:'1~6학년', area:'도형 퍼즐', icon:'🧩', image:'puzzles/thumbs/shape-puzzle.svg', color:'#EFE6FF', date:'2026-10-25', file:'puzzles/shape-puzzle.html' }
];
