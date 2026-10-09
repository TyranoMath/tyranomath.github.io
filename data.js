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
  statsUrl: ''
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
   grade : 학년 (1~6)
   area  : 영역 — '수와 연산' / '변화와 관계' / '도형과 측정' / '자료와 가능성'
   title : 단원 이름 (2022 개정 교육과정 내용을 바탕으로 넣어 둔 예시예요. 자유롭게 고치세요)
   learn : 🦖 개념 탐험대에서 열 파일 (예: 'learn/1-number-9.html')
   check : 🎯 실력 진단소에서 열 파일 (예: 'checks/1-number-9.html' 또는 구글 설문 주소)
           → 비워 두면 '준비 중'으로 보여요
   newTab: true 를 붙이면 새 창으로 열려요 (구글 설문처럼 창 안에서 안 열리는 사이트용)
   ※ 줄 끝의 쉼표(,)를 꼭 확인하세요!
   --------------------------------------------------------- */
const UNITS = [
  // ── 1학년 ─────────────────────────────
  { grade:1, area:'수와 연산', title:'9까지의 수', learn:'', check:'' },
  { grade:1, area:'수와 연산', title:'50까지의 수', learn:'', check:'' },
  { grade:1, area:'수와 연산', title:'100까지의 수', learn:'', check:'' },
  { grade:1, area:'수와 연산', title:'덧셈과 뺄셈', learn:'', check:'' },
  { grade:1, area:'변화와 관계', title:'규칙 찾기', learn:'', check:'' },
  { grade:1, area:'도형과 측정', title:'여러 가지 모양', learn:'', check:'' },
  { grade:1, area:'도형과 측정', title:'비교하기', learn:'', check:'' },
  { grade:1, area:'도형과 측정', title:'시계 보기', learn:'', check:'' },
  { grade:1, area:'자료와 가능성', title:'분류하기', learn:'', check:'' },
  // ── 2학년 ─────────────────────────────
  { grade:2, area:'수와 연산', title:'세 자리 수', learn:'', check:'' },
  { grade:2, area:'수와 연산', title:'네 자리 수', learn:'', check:'' },
  { grade:2, area:'수와 연산', title:'두 자리 수의 덧셈과 뺄셈', learn:'', check:'' },
  { grade:2, area:'수와 연산', title:'곱셈', learn:'', check:'' },
  { grade:2, area:'수와 연산', title:'곱셈구구', learn:'', check:'' },
  { grade:2, area:'변화와 관계', title:'규칙 찾기', learn:'', check:'' },
  { grade:2, area:'도형과 측정', title:'여러 가지 도형', learn:'', check:'' },
  { grade:2, area:'도형과 측정', title:'길이 재기', learn:'', check:'' },
  { grade:2, area:'도형과 측정', title:'시각과 시간', learn:'', check:'' },
  { grade:2, area:'자료와 가능성', title:'분류하기', learn:'', check:'' },
  { grade:2, area:'자료와 가능성', title:'표와 그래프', learn:'', check:'' },
  // ── 3학년 ─────────────────────────────
  { grade:3, area:'수와 연산', title:'세 자리 수의 덧셈과 뺄셈', learn:'', check:'' },
  { grade:3, area:'수와 연산', title:'나눗셈', learn:'', check:'' },
  { grade:3, area:'수와 연산', title:'곱셈', learn:'', check:'' },
  { grade:3, area:'수와 연산', title:'분수와 소수', learn:'', check:'' },
  { grade:3, area:'변화와 관계', title:'규칙 탐구', learn:'', check:'' },
  { grade:3, area:'변화와 관계', title:'등호와 식', learn:'', check:'' },
  { grade:3, area:'도형과 측정', title:'평면도형', learn:'', check:'' },
  { grade:3, area:'도형과 측정', title:'원', learn:'', check:'' },
  { grade:3, area:'도형과 측정', title:'길이와 시간', learn:'', check:'' },
  { grade:3, area:'도형과 측정', title:'들이와 무게', learn:'', check:'' },
  { grade:3, area:'자료와 가능성', title:'그림그래프', learn:'', check:'' },
  // ── 4학년 ─────────────────────────────
  { grade:4, area:'수와 연산', title:'큰 수', learn:'', check:'' },
  { grade:4, area:'수와 연산', title:'곱셈과 나눗셈', learn:'', check:'' },
  { grade:4, area:'수와 연산', title:'분수의 덧셈과 뺄셈', learn:'', check:'' },
  { grade:4, area:'수와 연산', title:'소수의 덧셈과 뺄셈', learn:'', check:'' },
  { grade:4, area:'변화와 관계', title:'규칙 찾기', learn:'', check:'' },
  { grade:4, area:'변화와 관계', title:'규칙을 식으로 나타내기', learn:'', check:'' },
  { grade:4, area:'도형과 측정', title:'각도', learn:'', check:'' },
  { grade:4, area:'도형과 측정', title:'평면도형의 이동', learn:'', check:'' },
  { grade:4, area:'도형과 측정', title:'삼각형', learn:'', check:'' },
  { grade:4, area:'도형과 측정', title:'사각형', learn:'', check:'' },
  { grade:4, area:'도형과 측정', title:'다각형', learn:'', check:'' },
  { grade:4, area:'자료와 가능성', title:'막대그래프', learn:'', check:'' },
  { grade:4, area:'자료와 가능성', title:'꺾은선그래프', learn:'', check:'' },
  // ── 5학년 ─────────────────────────────
  { grade:5, area:'수와 연산', title:'자연수의 혼합 계산', learn:'', check:'' },
  { grade:5, area:'수와 연산', title:'약수와 배수', learn:'', check:'' },
  { grade:5, area:'수와 연산', title:'약분과 통분', learn:'', check:'' },
  { grade:5, area:'수와 연산', title:'분수의 덧셈과 뺄셈', learn:'', check:'' },
  { grade:5, area:'수와 연산', title:'분수의 곱셈', learn:'', check:'' },
  { grade:5, area:'수와 연산', title:'소수의 곱셈', learn:'', check:'' },
  { grade:5, area:'변화와 관계', title:'규칙과 대응', learn:'', check:'' },
  { grade:5, area:'도형과 측정', title:'다각형의 둘레와 넓이', learn:'', check:'' },
  { grade:5, area:'도형과 측정', title:'합동과 대칭', learn:'', check:'' },
  { grade:5, area:'도형과 측정', title:'직육면체', learn:'', check:'' },
  { grade:5, area:'자료와 가능성', title:'평균과 가능성', learn:'', check:'' },
  // ── 6학년 ─────────────────────────────
  { grade:6, area:'수와 연산', title:'분수의 나눗셈', learn:'', check:'' },
  { grade:6, area:'수와 연산', title:'소수의 나눗셈', learn:'', check:'' },
  { grade:6, area:'변화와 관계', title:'비와 비율', learn:'', check:'' },
  { grade:6, area:'변화와 관계', title:'비례식과 비례배분', learn:'', check:'' },
  { grade:6, area:'도형과 측정', title:'각기둥과 각뿔', learn:'', check:'' },
  { grade:6, area:'도형과 측정', title:'직육면체의 부피와 겉넓이', learn:'', check:'' },
  { grade:6, area:'도형과 측정', title:'원의 넓이', learn:'', check:'' },
  { grade:6, area:'도형과 측정', title:'원기둥, 원뿔, 구', learn:'', check:'' },
  { grade:6, area:'도형과 측정', title:'공간과 입체', learn:'', check:'' },
  { grade:6, area:'자료와 가능성', title:'여러 가지 그래프', learn:'', check:'' }
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
  { title:'줄다리기 연산 대결',    desc:'문제를 맞힐 때마다 티라노들이 줄을 당겨요! 친구나 컴퓨터와 대결해요.', grade:'1~6학년', area:'수와 연산', icon:'🦖', image:'games/thumbs/tug-of-war.svg', color:'#DDF0FF', date:'2026-10-09', file:'games/tug-of-war.html' }
];

/* ---------------------------------------------------------
   🧩 티라노 퍼즐존 — 게임 카드와 같은 방법으로 써요 (새 퍼즐은 맨 아래에 추가)
   area : 퍼즐 분류 — '수 퍼즐' / '전략 퍼즐' / '논리 퍼즐' / '도형 퍼즐'
   file : puzzles 폴더 안 HTML 경로
   --------------------------------------------------------- */
const PUZZLES = [
  { title:'티라노 스도쿠', desc:'가로·세로·상자에 같은 숫자가 겹치지 않게 빈칸을 채워요. 4×4부터 9×9까지!', grade:'1~6학년', area:'수 퍼즐',   icon:'🔢', image:'puzzles/thumbs/sudoku.svg', color:'#EFE6FF', date:'2026-10-09', file:'puzzles/sudoku.html' },
  { title:'티라노 오목',   desc:'공룡 알 5개를 먼저 한 줄로 이으면 승리! 친구나 컴퓨터 티라노와 겨뤄요.',     grade:'1~6학년', area:'전략 퍼즐', icon:'🥚', image:'puzzles/thumbs/omok.svg',   color:'#F6E3C0', date:'2026-10-09', file:'puzzles/omok.html' }
];
