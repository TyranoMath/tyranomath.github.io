/**
 * 🦖 TyranoMath 플레이 수 집계 + 🏆 실시간 랭킹 (Google Apps Script)
 *
 * 사용법: 구글 시트 → 확장 프로그램 → Apps Script 에 이 코드를 통째로 붙여 넣고
 *        '웹 앱'으로 배포한 뒤, 나온 주소(.../exec)를 data.js 의 statsUrl 에 넣어요.
 *        (이미 배포해 두었다면: 배포 → 배포 관리 → ✏️ 수정 → 버전 '새 버전' → 배포. 주소는 그대로예요.)
 *
 * 시트에는 이런 탭이 자동으로 생겨요:
 *   플레이수   : 게임 파일 | 플레이 수 | 마지막 플레이
 *   랭킹_전체  : 게임·단계·닉네임·반 코드별 가장 좋은 기록 (전체 랭킹)
 *   랭킹_일별  : 날짜별 가장 좋은 기록 (오늘 / 이번 주 랭킹, 15일 지나면 자동 정리)
 *   금칙어     : 닉네임에 쓰면 안 되는 말 (A열에 한 줄씩 더 적으면 바로 적용돼요)
 *
 * 👩‍🏫 선생님 도움말
 *   - 이상한 기록은 '랭킹_전체'·'랭킹_일별'에서 그 줄을 지우면 랭킹에서 사라져요.
 *   - 닉네임을 '금칙어' 탭에 적으면 그 닉네임은 랭킹에서 숨겨지고 다시 올릴 수도 없어요.
 */

const SHEET_NAME = '플레이수';
const SH_ALL = '랭킹_전체', SH_DAY = '랭킹_일별', SH_BAN = '금칙어';
const TZ = 'Asia/Seoul';
const KEEP_DAYS = 15;          // 일별 기록을 남겨 두는 날 수
const TOP_N = 10;              // 랭킹에 보여 줄 수

// 게임 파일 주소처럼 생긴 것만 받아요 (엉뚱한 값이 쌓이지 않게)
const FILE_RULE = /^(games|puzzles|tools)\/[A-Za-z0-9_\-\/]+\.html$/;

/* ---------------------------------------------------------
   게임별 랭킹 규칙
   kind : 'time'  빨리 푼 시간(초)이 좋아요   (작을수록 1등)
          'low'   적은 수가 좋아요             (작을수록 1등, 예: 오목 수)
          'score' 높은 점수가 좋아요           (클수록 1등, 같으면 걸린 시간이 짧은 쪽)
   level: 단계 이름 규칙 · min: 단계별 가장 빠른 시간(이보다 빠르면 장난 기록으로 봐요)
   rate : 1초에 얻을 수 있는 가장 많은 점수 (점수 게임) · max: 가장 높은 점수
   resume: 저장했다가 이어 하는 퍼즐 (시작 후 지난 시간 검사를 하지 않아요)
   --------------------------------------------------------- */
const DYN = /^[0-9A-Za-z가-힣+\-−×÷|.,:_ ]{1,60}$/;
const QUIZ = { kind:'score', level:/^[0-2]$/, max:200, rate:1.7 };
const RULES = {
  // 퍼즐존
  'sudoku':         { kind:'time',  level:/^(4|6|9)-[0-2]$/, min:l => ({ 4:6, 6:15, 9:40 })[l.split('-')[0]] },
  'samurai-sudoku': { kind:'time',  level:/^(easy|medium|hard)$/, min:() => 300, resume:true },
  'minesweeper':    { kind:'time',  level:/^[0-2]$/, min:l => [1, 5, 15][l] },
  'picture-logic':  { kind:'time',  level:/^(5|10|15)-\d{1,2}$/, min:l => ({ 5:4, 10:15, 15:40 })[l.split('-')[0]] },
  'sliding':        { kind:'time',  level:/^[3-5]$/, min:l => ({ 3:2, 4:8, 5:25 })[l] },
  'crossmath':      { kind:'time',  level:/^[0-3]$/, min:l => [3, 5, 8, 15][l] },
  'omok':           { kind:'low',   level:/^[0-2]$/, min:() => 5, max:200 },
  'block-stack':    { kind:'score', level:/^(1|4|8)$/, max:5000000, rate:4000 },
  'tile-match':     { kind:'score', level:/^(1|2)$/, max:2000000 },
  // 게임존
  'tyrano-plus':       { kind:'score', level:/^(10|20|100)$/, max:200, rate:1.7 },
  'gugudan-volcano':   QUIZ, 'shape-fossil': QUIZ, 'tyrano-clock': QUIZ, 'pattern-footprint': QUIZ, 'egg-graph': QUIZ,
  'balloon-archery':   { kind:'score', level:DYN, max:1000, rate:3 },
  'tug-of-war':        { kind:'time',  level:DYN, min:() => 3 }
};
// 게임 엔진(tyrano-quiz.js)으로 새로 만든 게임은 따로 적지 않아도 '문제 맞히기' 규칙을 써요
const ruleOf_ = g => RULES[g] || (/^[a-z0-9][a-z0-9\-]{2,39}$/.test(g) ? QUIZ : null);

// 닉네임 금칙어 (기본) — 띄어쓰기·숫자·기호를 빼고 검사해요
const BAN_BASE = ['시발','씨발','씨바','시바','씹','쉬발','슈발','십새','십세','병신','븅신','빙신','좆','존나','졸라','개새','개색','개세','새끼','섹스','미친','미쳤','꺼져','닥쳐','지랄',
  '느금','니애미','니엄','애미','애비','엠창','등신','찐따','또라이','뒤져','뒤질','죽어','자살','살인','야동','변태','보지','자지','성기','일베','한남','한녀','틀딱','장애인',
  '운영자','관리자','선생님','admin','fuck','shit','bitch','sex','porn','dick','damn','asshole','nigger','nigga','sibal','ssibal','tlqkf','qudtls'];

/* ========================================================= */
function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  try {
    if (p.action === 'rank_start') out = rankStart_(p);
    else if (p.action === 'rank_put') out = rankPut_(p);
    else if (p.action === 'rank_get') out = rankGet_(p);
    else out = plays_(p);
  } catch (err) {
    out = { ok: false, msg: '잠시 후 다시 해 주세요.' };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- 플레이 수 ---------- */
function plays_(p) {
  const sheet = getSheet_();
  if (p.action === 'hit' && p.file && FILE_RULE.test(p.file) && p.file.length < 120) {
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);                       // 여러 학생이 동시에 눌러도 숫자가 꼬이지 않게
    try {
      const last = sheet.getLastRow();
      const files = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues().map(r => r[0]) : [];
      const idx = files.indexOf(p.file);
      if (idx >= 0) {
        const cell = sheet.getRange(idx + 2, 2);
        cell.setValue((Number(cell.getValue()) || 0) + 1);
        sheet.getRange(idx + 2, 3).setValue(new Date());
      } else {
        sheet.appendRow([p.file, 1, new Date()]);
      }
    } finally {
      lock.releaseLock();
    }
  }
  // 모든 게임의 플레이 수를 돌려줘요
  const counts = {};
  const last = sheet.getLastRow();
  if (last > 1) {
    sheet.getRange(2, 1, last - 1, 2).getValues().forEach(r => {
      if (r[0]) counts[r[0]] = Number(r[1]) || 0;
    });
  }
  return { ok: true, counts: counts };
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['게임 파일', '플레이 수', '마지막 플레이']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:C1').setFontWeight('bold').setBackground('#E4F5D6');
    sheet.setColumnWidth(1, 260);
  }
  return sheet;
}

/* =========================================================
   🏆 랭킹
   ========================================================= */
const HEAD_ALL = ['게임', '단계', '단계 이름', '닉네임', '반 코드', '기록', '걸린 시간(초)', '날짜', '올린 시각', '기기'];
const HEAD_DAY = ['날짜', '주(월요일)', '게임', '단계', '단계 이름', '닉네임', '반 코드', '기록', '걸린 시간(초)', '올린 시각', '기기'];

function rankSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    const head = name === SH_ALL ? HEAD_ALL : name === SH_DAY ? HEAD_DAY : ['닉네임에 쓰면 안 되는 말 (한 줄에 하나씩)'];
    sh.appendRow(head);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#FFE7CC');
    if (name === SH_BAN) sh.setColumnWidth(1, 320);
  }
  return sh;
}
function rows_(sh, cols) {
  const last = sh.getLastRow();
  return last > 1 ? sh.getRange(2, 1, last - 1, cols).getValues() : [];
}
const today_ = () => Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
function weekOf_(dateStr) {               // 그 날이 들어 있는 주의 월요일
  const d = new Date(dateStr + 'T12:00:00+09:00');
  const dow = Number(Utilities.formatDate(d, TZ, 'u'));   // 1=월 … 7=일
  return Utilities.formatDate(new Date(d.getTime() - (dow - 1) * 86400000), TZ, 'yyyy-MM-dd');
}
const T_ = s => "'" + s;      // 시트가 숫자·날짜로 바꾸지 않게 글자로 저장
const str_ = v => v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : String(v);
const norm_ = s => String(s || '').toLowerCase().replace(/[^a-z가-힣ㄱ-ㅎ]/g, '');

function banList_() {
  const cache = CacheService.getScriptCache(), hit = cache.get('ban');
  if (hit) return JSON.parse(hit);
  const extra = rows_(rankSheet_(SH_BAN), 1).map(r => norm_(r[0])).filter(Boolean);
  const list = BAN_BASE.map(norm_).concat(extra);
  cache.put('ban', JSON.stringify(list), 120);
  return list;
}
function badNick_(nick, list) {
  const n = norm_(nick);
  return (list || banList_()).some(w => w && n.indexOf(w) >= 0);
}
function cleanNick_(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
function cleanClass_(s) { return String(s || '').replace(/\s+/g, '').toUpperCase().slice(0, 12); }

/* ---------- 게임 시작: 기록을 올릴 때 쓰는 표를 받아요 ---------- */
function rankStart_(p) {
  const rule = ruleOf_(String(p.g || ''));
  if (!rule || !rule.level.test(String(p.l || ''))) return { ok: false, msg: '알 수 없는 게임이에요.' };
  const cache = CacheService.getScriptCache();
  const dev = String(p.d || '').slice(0, 40);
  if (dev && cache.get('st_' + dev)) return { ok: false, msg: 'busy' };   // 2초 안에 또 시작하면 무시
  if (dev) cache.put('st_' + dev, '1', 2);
  const token = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
  cache.put('tk_' + token, JSON.stringify({ g: p.g, l: String(p.l), s: Date.now() }), 21600);   // 6시간
  return { ok: true, token: token };
}

/* ---------- 기록 올리기 ---------- */
function rankPut_(p) {
  const g = String(p.g || ''), l = String(p.l || ''), rule = ruleOf_(g);
  if (!rule || !rule.level.test(l)) return { ok: false, msg: '알 수 없는 게임이에요.' };
  const nick = cleanNick_(p.n), cls = cleanClass_(p.c), lname = String(p.ln || l).slice(0, 40);
  if (nick.length < 2 || nick.length > 8 || !/^[가-힣A-Za-z0-9 _]+$/.test(nick)) return { ok: false, msg: '닉네임은 한글·영어·숫자 2~8글자로 써요.' };
  if (badNick_(nick)) return { ok: false, msg: '쓸 수 없는 말이 들어 있어요. 다른 닉네임을 써 주세요.' };
  if (cls && !/^[가-힣A-Z0-9\-]{2,12}$/.test(cls)) return { ok: false, msg: '반 코드는 한글·영어·숫자 2~12글자예요.' };
  if (cls && badNick_(cls)) return { ok: false, msg: '반 코드에 쓸 수 없는 말이 있어요.' };

  let v = Number(p.v), t = Math.max(0, Math.round(Number(p.t) || 0));
  if (!isFinite(v) || v < 0) return { ok: false, msg: '기록이 이상해요.' };
  v = rule.kind === 'time' ? Math.round(v * 10) / 10 : Math.round(v);

  // 시작할 때 받은 표 확인 (한 번 쓰면 없어져요)
  const cache = CacheService.getScriptCache();
  const tkRaw = p.k ? cache.get('tk_' + p.k) : null;
  if (!tkRaw) return { ok: false, msg: '게임을 시작할 때 인터넷이 연결되어 있어야 기록을 올릴 수 있어요.' };
  const tk = JSON.parse(tkRaw);
  if (tk.g !== g || tk.l !== l) return { ok: false, msg: '게임 정보가 맞지 않아요.' };
  const real = (Date.now() - tk.s) / 1000;           // 시작하고 실제로 지난 시간(초)

  // 장난 기록 막기
  if (rule.kind === 'time') {
    if (v < rule.min(l)) return { ok: false, msg: '너무 빠른 기록이라 올릴 수 없어요.' };
    if (v > 6 * 3600) return { ok: false, msg: '기록이 너무 길어요.' };
    if (!rule.resume && v > real + 5) return { ok: false, msg: '기록이 이상해요.' };
  } else if (rule.kind === 'low') {
    if (v < rule.min(l) || v > rule.max) return { ok: false, msg: '기록이 이상해요.' };
    if (real < v * 0.3) return { ok: false, msg: '기록이 이상해요.' };
  } else {
    if (v > rule.max) return { ok: false, msg: '점수가 너무 높아요.' };
    if (rule.rate && v > rule.rate * real + 3) return { ok: false, msg: '점수가 너무 빨리 올랐어요.' };
    if (v === 0) return { ok: false, msg: '0점은 올리지 않아요.' };
  }
  // 같은 기기에서 너무 자주 올리지 않게
  const dev = String(p.d || '').slice(0, 40) || 'x';
  if (cache.get('put_' + dev)) return { ok: false, msg: '조금 뒤에 다시 올려 주세요.' };
  cache.remove('tk_' + p.k);
  cache.put('put_' + dev, '1', 5);

  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const now = new Date(), day = today_(), week = weekOf_(day);
    const better = (a, at, b, bt) => rule.kind === 'score' ? (a > b || (a === b && at < bt)) : a < b;
    // 전체 최고
    const shA = rankSheet_(SH_ALL), A = rows_(shA, 10);
    const ia = A.findIndex(r => String(r[0]) === g && String(r[1]) === l && String(r[3]) === nick && String(r[4]) === cls);
    let improvedAll = false;
    if (ia < 0) { shA.appendRow([g, T_(l), T_(lname), T_(nick), T_(cls), v, t, T_(day), now, dev]); improvedAll = true; }
    else if (better(v, t, Number(A[ia][5]), Number(A[ia][6]))) { shA.getRange(ia + 2, 3, 1, 8).setValues([[T_(lname), T_(nick), T_(cls), v, t, T_(day), now, dev]]); improvedAll = true; }
    // 오늘 최고
    const shD = rankSheet_(SH_DAY), D = rows_(shD, 11);
    const id = D.findIndex(r => str_(r[0]) === day && String(r[2]) === g && String(r[3]) === l && String(r[5]) === nick && String(r[6]) === cls);
    if (id < 0) shD.appendRow([T_(day), T_(week), g, T_(l), T_(lname), T_(nick), T_(cls), v, t, now, dev]);
    else if (better(v, t, Number(D[id][7]), Number(D[id][8]))) shD.getRange(id + 2, 5, 1, 7).setValues([[T_(lname), T_(nick), T_(cls), v, t, now, dev]]);
    cleanup_(shD, D);
    ['day', 'week', 'all'].forEach(per => { cache.remove(['rk', g, l, per, ''].join('|')); if (cls) cache.remove(['rk', g, l, per, cls].join('|')); });
    cache.remove('lv_' + g);
    const res = rankGet_({ g: g, l: l, p: 'day', n: nick, c: '' }, true);
    return { ok: true, improved: improvedAll, today: res.me, rows: res.rows };
  } finally {
    lock.releaseLock();
  }
}
// 오래된 일별 기록 정리 (하루에 한 번만)
function cleanup_(shD, D) {
  const cache = CacheService.getScriptCache();
  if (cache.get('cleaned')) return;
  cache.put('cleaned', '1', 21600);
  const cut = Utilities.formatDate(new Date(Date.now() - KEEP_DAYS * 86400000), TZ, 'yyyy-MM-dd');
  let n = 0;
  while (n < D.length && str_(D[n][0]) < cut) n++;
  if (n > 0) shD.deleteRows(2, n);
}

/* ---------- 랭킹 보기 ---------- */
function rankGet_(p, fresh) {
  const g = String(p.g || ''), l = String(p.l || ''), rule = ruleOf_(g);
  if (!rule) return { ok: false, msg: '알 수 없는 게임이에요.' };
  const per = ['day', 'week', 'all'].indexOf(p.p) >= 0 ? p.p : 'day';
  const cls = cleanClass_(p.c), nick = cleanNick_(p.n);
  const cache = CacheService.getScriptCache(), key = ['rk', g, l, per, cls].join('|');
  let list = null;
  const hit = !fresh && cache.get(key);
  if (hit) list = JSON.parse(hit);
  else {
    const ban = banList_();
    let src;
    if (per === 'all') src = rows_(rankSheet_(SH_ALL), 7).filter(r => String(r[0]) === g && String(r[1]) === l).map(r => [String(r[3]), String(r[4]), Number(r[5]), Number(r[6])]);
    else {
      const day = today_(), week = weekOf_(day);
      const D = rows_(rankSheet_(SH_DAY), 9).filter(r => String(r[2]) === g && String(r[3]) === l && (per === 'day' ? str_(r[0]) === day : str_(r[1]) === week));
      const best = {};      // 이번 주: 사람마다 가장 좋은 날의 기록
      D.forEach(r => {
        const k = r[5] + '\u0001' + r[6], v = Number(r[7]), t = Number(r[8]), o = best[k];
        if (!o || (rule.kind === 'score' ? (v > o[2] || (v === o[2] && t < o[3])) : v < o[2])) best[k] = [String(r[5]), String(r[6]), v, t];
      });
      src = Object.keys(best).map(k => best[k]);
    }
    src = src.filter(r => r[0] && !badNick_(r[0], ban) && (!cls || r[1] === cls));
    src.sort((a, b) => rule.kind === 'score' ? (b[2] - a[2] || a[3] - b[3]) : (a[2] - b[2] || a[3] - b[3]));
    list = src;
    cache.put(key, JSON.stringify(list).slice(0, 95000), 15);       // 15초 동안 같은 결과를 나눠 써요
  }
  // 같은 기록은 같은 등수
  const ranked = [];
  list.forEach((r, i) => {
    const prev = ranked[i - 1];
    const same = prev && prev.v === r[2] && (rule.kind !== 'score' || prev.t === r[3]);
    ranked.push({ r: same ? prev.r : i + 1, n: r[0], c: r[1], v: r[2], t: r[3] });
  });
  let me = null;
  if (nick) { const m = ranked.find(x => x.n === nick && (!p.mc || x.c === cleanClass_(p.mc))); if (m) me = m; }
  return { ok: true, kind: rule.kind, per: per, total: ranked.length, rows: ranked.slice(0, TOP_N), me: me, levels: levels_(g) };
}
// 이 게임에 기록이 있는 단계 목록 (설정을 골라 하는 게임용)
function levels_(g) {
  const cache = CacheService.getScriptCache(), hit = cache.get('lv_' + g);
  if (hit) return JSON.parse(hit);
  const seen = {}, out = [];
  rows_(rankSheet_(SH_ALL), 3).forEach(r => { if (String(r[0]) === g && !seen[r[1]]) { seen[r[1]] = 1; out.push([String(r[1]), String(r[2])]); } });
  cache.put('lv_' + g, JSON.stringify(out.slice(0, 60)), 60);
  return out.slice(0, 60);
}

/** (선택) Apps Script 편집기에서 이 함수를 한 번 실행하면 탭이 미리 만들어지고 권한 승인도 끝나요. */
function setup() {
  getSheet_();
  rankSheet_(SH_ALL); rankSheet_(SH_DAY); rankSheet_(SH_BAN);
}
