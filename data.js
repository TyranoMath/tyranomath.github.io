/* =========================================================
   ⚙️ TyranoMath 관리 파일 — 앞으로는 이 파일만 고치면 돼요!
   (index.html · gamezone.html 이 함께 사용해요)
   ========================================================= */

const CONFIG = {
  // 🐞 버그 제보방 링크 (구글 설문, 패들렛, GitHub Issues 등 원하는 주소)
  bugReportUrl: '',        // 예: 'https://forms.gle/xxxxxxxx'

  // 🏠 메인 화면에 보여 줄 최신 게임 개수
  latestCount: 4,

  // 🆕 올린 날짜(date)로부터 며칠 동안 NEW 표시를 붙일지
  newDays: 14
};

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
  { title:'공룡 알 그래프',        desc:'그림그래프와 막대그래프를 읽고 질문에 답해요.',   grade:'2~4학년', area:'자료와 가능성', icon:'📊', color:'#FFF3C4', date:'2026-10-09', file:'games/egg-graph.html' }
];
