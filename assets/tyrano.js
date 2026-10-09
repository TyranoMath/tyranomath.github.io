/* =========================================================
   TyranoMath 공통 기능 (index.html · gamezone.html 함께 사용)
   ※ 게임 목록·설정은 data.js 에서 고쳐요. 이 파일은 고치지 않아도 돼요.
   ========================================================= */
(function(){
'use strict';

// data.js 의 CONFIG · GAMES · CHECKS 를 읽어요 (없어도 오류 없이 동작)
const CFG = Object.assign({ bugReportUrl:'', latestCount:3, newDays:14 }, typeof CONFIG !== 'undefined' ? CONFIG : {});
const GAME_LIST  = typeof GAMES  !== 'undefined' && Array.isArray(GAMES)  ? GAMES  : [];
const UNIT_LIST  = typeof UNITS  !== 'undefined' && Array.isArray(UNITS)  ? UNITS  : [];
const LISTS = { games: GAME_LIST };
// 2022 개정 교육과정 4개 영역
const AREAS = [
  { name:'수와 연산',     icon:'🔢', color:'#FFE7CC', desc:'수 · 사칙계산 · 분수와 소수' },
  { name:'변화와 관계',   icon:'🔁', color:'#E4F5D6', desc:'규칙 · 식 · 비와 비례' },
  { name:'도형과 측정',   icon:'🔺', color:'#DDF0FF', desc:'도형 · 길이 · 시간 · 넓이' },
  { name:'자료와 가능성', icon:'📊', color:'#FFE3EA', desc:'분류 · 표와 그래프 · 가능성' }
];

/* ---------- 도우미 ---------- */
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg){
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}
function isNew(item){
  if (!item.date) return false;
  const d = new Date(item.date + 'T00:00:00');
  if (isNaN(d)) return false;
  const days = (Date.now() - d.getTime()) / 86400000;
  return days >= -1 && days <= CFG.newDays;
}
function gradeRange(g){
  const nums = String(g || '').match(/\d+/g);
  if (!nums) return [1, 6];
  const a = Number(nums[0]), b = Number(nums[nums.length - 1]);
  return [Math.min(a, b), Math.max(a, b)];
}
const byLatest = (a, b) => (b.item.date || '').localeCompare(a.item.date || '') || b.i - a.i;

/* =========================================================
   1. 번역 기능 (Google 번역)
   ========================================================= */
const LANGS = [
  ['ko','한국어'],['en','English'],['ja','日本語'],['zh-CN','中文(简体)'],['zh-TW','中文(繁體)'],
  ['vi','Tiếng Việt'],['th','ไทย'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],['tl','Filipino'],
  ['mn','Монгол'],['uz','Oʻzbek'],['kk','Қазақ'],['ru','Русский'],['uk','Українська'],
  ['hi','हिन्दी'],['bn','বাংলা'],['ne','नेपाली'],['ur','اردو'],['ar','العربية'],
  ['fa','فارسی'],['tr','Türkçe'],['km','ខ្មែរ'],['lo','ລາວ'],['my','မြန်မာ'],
  ['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],
  ['nl','Nederlands'],['pl','Polski'],['sv','Svenska'],['el','Ελληνικά'],['he','עברית'],
  ['sw','Kiswahili'],['am','አማርኛ'],['si','සිංහල'],['ta','தமிழ்']
];
function currentLang(){
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : 'ko';
}
function setCookie(val, clear){
  const host = location.hostname;
  const exp = clear ? ';expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
  document.cookie = 'googtrans=' + val + ';path=/' + exp;
  if (host && host.includes('.')) document.cookie = 'googtrans=' + val + ';path=/;domain=' + host + exp;
}
function setLang(code){
  if (code === 'ko'){ setCookie('', true); location.reload(); return; }
  setCookie('/ko/' + code);
  const combo = document.querySelector('.goog-te-combo');
  if (combo){ combo.value = code; combo.dispatchEvent(new Event('change')); renderLangUI(); closeLang(); }
  else location.reload();
}
function renderLangUI(filter=''){
  const cur = currentLang();
  const found = LANGS.find(l => l[0] === cur);
  $('#langCurrent').textContent = found ? found[1] : cur;
  const list = $('#langList'); list.innerHTML = '';
  const f = filter.trim().toLowerCase();
  LANGS.filter(([c,n]) => !f || n.toLowerCase().includes(f) || c.toLowerCase().includes(f)).forEach(([c,n]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = n; b.lang = c;
    b.setAttribute('aria-current', c === cur ? 'true' : 'false');
    b.addEventListener('click', () => setLang(c));
    list.appendChild(b);
  });
}
function openLang(){ $('#langPanel').classList.add('open'); $('#langBtn').setAttribute('aria-expanded','true'); $('#langSearch').focus(); }
function closeLang(){ $('#langPanel').classList.remove('open'); $('#langBtn').setAttribute('aria-expanded','false'); }
if ($('#langBtn')){
  $('#langBtn').addEventListener('click', e => { e.stopPropagation(); $('#langPanel').classList.contains('open') ? closeLang() : openLang(); });
  $('#langPanel').addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', closeLang);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLang(); });
  $('#langSearch').addEventListener('input', e => renderLangUI(e.target.value));
  renderLangUI();
  window.googleTranslateElementInit = function(){
    new google.translate.TranslateElement({ pageLanguage:'ko', autoDisplay:false }, 'google_translate_element');
  };
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true; document.body.appendChild(s);
}

/* =========================================================
   2. 기기별 화면 설정 (모든 페이지가 같은 설정을 기억해요)
   ========================================================= */
const MODE_NAMES = { pc:'컴퓨터', phone:'스마트폰', pad:'패드', board:'전자칠판' };
const SCALES = [0.85, 1, 1.15, 1.3, 1.5];
let modeChoice = store.get('tm-mode') || 'auto';
let scaleIdx = Number(store.get('tm-scale') ?? 1);
if (!(scaleIdx >= 0 && scaleIdx < SCALES.length)) scaleIdx = 1;

function detectDevice(){
  const w = window.innerWidth;
  const touch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  if (w < 640) return 'phone';
  if (touch && w >= 1600) return 'board';
  if (touch) return 'pad';
  return 'pc';
}
function applyMode(){
  const actual = modeChoice === 'auto' ? detectDevice() : modeChoice;
  document.documentElement.dataset.device = actual;
  $$('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.mode === modeChoice ? 'true' : 'false'));
  if ($('#autoHint')) $('#autoHint').textContent = modeChoice === 'auto' ? '(감지됨: ' + MODE_NAMES[actual] + ')' : '';
  document.documentElement.style.setProperty('--scale', SCALES[scaleIdx]);
}
$$('.tab').forEach(t => t.addEventListener('click', () => { modeChoice = t.dataset.mode; store.set('tm-mode', modeChoice); applyMode(); }));
$('#fontUp')?.addEventListener('click', () => { scaleIdx = Math.min(SCALES.length-1, scaleIdx+1); store.set('tm-scale', scaleIdx); applyMode(); });
$('#fontDown')?.addEventListener('click', () => { scaleIdx = Math.max(0, scaleIdx-1); store.set('tm-scale', scaleIdx); applyMode(); });
$('#fullBtn')?.addEventListener('click', () => {
  const d = document;
  if (!d.fullscreenElement){ (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen || (()=>{})).call(d.documentElement); }
  else { (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
});
document.addEventListener('fullscreenchange', () => {
  if ($('#fullBtn')) $('#fullBtn').textContent = document.fullscreenElement ? '⛶ 전체 화면 끄기' : '⛶ 전체 화면';
});
let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (modeChoice === 'auto') applyMode(); }, 150); });
applyMode();

/* =========================================================
   3. 버그 제보 탭
   ========================================================= */
const bugTab = $('#bugTab');
if (bugTab){
  if (CFG.bugReportUrl) bugTab.href = CFG.bugReportUrl;
  else bugTab.addEventListener('click', e => { e.preventDefault(); toast('버그 제보방 링크를 준비하고 있어요 🦖'); });
}

/* =========================================================
   4. 카드 그리기
   ========================================================= */
function cardHTML(key, i, opts={}){
  const g = LISTS[key][i];
  const verb = '▶ 시작하기';
  const newBadge = g.file && isNew(g) ? '<span class="badge-new">NEW</span>' : '';
  return `
    <button type="button" class="game${g.file ? '' : ' soon'}" data-list="${key}" data-i="${i}" ${g.file ? '' : 'aria-disabled="true"'}>
      ${newBadge}
      <div class="thumb" style="background:${esc(g.color || '#E4F5D6')}">
        ${g.image ? `<img src="${esc(g.image)}" alt="" loading="lazy">` : `<span aria-hidden="true">${esc(g.icon || '🎲')}</span>`}
      </div>
      <div class="body">
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.desc)}</p>
        <div class="chips">
          ${g.grade ? `<span class="chip">${esc(g.grade)}</span>` : ''}
          ${g.area && opts.showArea !== false ? `<span class="chip area">${esc(g.area)}</span>` : ''}
        </div>
        <span class="play">${g.file ? verb : '준비 중'}</span>
      </div>
    </button>`;
}
function renderInto(el, key, indexes){
  el.innerHTML = indexes.map(i => cardHTML(key, i)).join('');
}
document.addEventListener('click', e => {
  const b = e.target.closest('.game[data-list]');
  if (b) openItem(b.dataset.list, Number(b.dataset.i));
});

/* =========================================================
   5. 게임 플레이어 (홈페이지 안에서 크게 열기)
   ========================================================= */
let lastFocus = null, returnHash = '';
function openItem(key, i){ openEntry(LISTS[key] && LISTS[key][i]); }
// entry = { title, icon, file, newTab }
function openEntry(g){
  if (!g || !g.file){ toast('곧 만나요! 열심히 만들고 있어요 🛠️'); return; }
  if (g.newTab){ window.open(g.file, '_blank', 'noopener'); return; }
  lastFocus = document.activeElement;
  returnHash = location.hash.startsWith('#game=') ? '' : location.hash;
  $('#playerTitle').innerHTML = `<span aria-hidden="true">${esc(g.icon || '🎮')}</span><span>${esc(g.title)}</span>`;
  $('#playerFrame').src = g.file;
  $('#playerNew').href = g.file;
  $('#player').classList.add('open');
  document.body.classList.add('no-scroll');
  $('#playerClose').focus();
  try { history.replaceState(null, '', '#game=' + encodeURIComponent(g.file)); } catch(e){}
}
function closeItem(){
  if (!$('#player') || !$('#player').classList.contains('open')) return;
  if (document.fullscreenElement) document.exitFullscreen?.();
  $('#player').classList.remove('open');
  $('#playerFrame').src = 'about:blank';
  document.body.classList.remove('no-scroll');
  try { history.replaceState(null, '', location.pathname + location.search + returnHash); } catch(e){}
  lastFocus?.focus();
}
if ($('#player')){
  $('#playerClose').addEventListener('click', closeItem);
  $('#player').addEventListener('click', e => { if (e.target.id === 'player') closeItem(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeItem(); });
  // 게임 화면 안에서 Esc 를 눌러도 닫히게 (같은 사이트의 게임일 때)
  $('#playerFrame').addEventListener('load', () => {
    try { $('#playerFrame').contentWindow.addEventListener('keydown', e => { if (e.key === 'Escape') closeItem(); }); } catch(e){}
  });
  $('#playerReload').addEventListener('click', () => { const f = $('#playerFrame'); const src = f.src; f.src = 'about:blank'; setTimeout(() => f.src = src, 50); });
  $('#playerFull').addEventListener('click', () => {
    const box = $('.player-box');
    if (!document.fullscreenElement) (box.requestFullscreen || box.webkitRequestFullscreen || (()=>toast('이 기기에서는 크게 보기를 지원하지 않아요'))).call(box);
    else document.exitFullscreen();
  });
}

/* =========================================================
   6. 메인 화면: 실력 진단소 + 최신 게임
   ========================================================= */
const KINDS = {
  learn: { field:'learn', board:'#learnBoard', icon:'🦖', go:'▶ 배우기',  label:'개념 탐험대' },
  check: { field:'check', board:'#checkBoard', icon:'🎯', go:'▶ 진단하기', label:'실력 진단소' }
};
function unitEntry(kind, i){
  const u = UNIT_LIST[i], k = KINDS[kind];
  return { title: `${u.grade}학년 · ${u.title}`, icon: k.icon, file: u[k.field], newTab: u.newTab };
}
function renderBoard(kind, grade){
  const k = KINDS[kind], board = $(k.board); if (!board) return;
  board.innerHTML = AREAS.map(a => {
    const rows = UNIT_LIST.map((u, i) => ({ u, i })).filter(r => Number(r.u.grade) === grade && r.u.area === a.name);
    const ready = rows.filter(r => r.u[k.field]).length;
    const list = rows.length
      ? `<ul class="unit-list">${rows.map(r => {
          const has = !!r.u[k.field];
          return `<li><button type="button" class="unit${has ? '' : ' soon'}" data-kind="${kind}" data-u="${r.i}" ${has ? '' : 'aria-disabled="true"'}>
            <span class="t">${esc(r.u.title)}</span><span class="go">${has ? k.go : '준비 중'}</span></button></li>`;
        }).join('')}</ul>`
      : '<p class="unit-empty">이 학년에는 아직 단원이 없어요.</p>';
    return `<div class="area-box">
      <div class="area-head" style="background:${a.color}"><span class="ic" aria-hidden="true">${a.icon}</span>
        <div><h3>${esc(a.name)}</h3><small>${rows.length}개 단원${ready ? ` · ${ready}개 열림` : ''}</small></div></div>
      ${list}</div>`;
  }).join('');
}
$$('.grade-tabs').forEach(tabs => {
  const kind = tabs.dataset.for, key = 'tm-grade-' + kind;
  let grade = Number(store.get(key)) || 1;
  tabs.innerHTML = [1,2,3,4,5,6].map(g => `<button type="button" role="tab" data-g="${g}" aria-selected="${g === grade}"><span class="n">${g}</span>학년</button>`).join('');
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    grade = Number(b.dataset.g); store.set(key, grade);
    $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
    renderBoard(kind, grade);
  });
  renderBoard(kind, grade);
});
document.addEventListener('click', e => {
  const b = e.target.closest('.unit[data-kind]');
  if (b) openEntry(unitEntry(b.dataset.kind, Number(b.dataset.u)));
});
if ($('#latestGrid')){
  const latest = GAME_LIST.map((item, i) => ({ item, i })).filter(x => x.item.file).sort(byLatest).slice(0, CFG.latestCount).map(x => x.i);
  renderInto($('#latestGrid'), 'games', latest);
  $$('.game-total').forEach(el => el.textContent = GAME_LIST.filter(g => g.file).length);
}

/* =========================================================
   7. 티라노 게임존 페이지: 영역·학년·검색·정렬
   ========================================================= */
if ($('#zoneGrid')){
  const state = { area: '전체', grade: '0', q: '', sort: 'new' };
  const ready = GAME_LIST.filter(g => g.file);
  $('#statTotal').textContent = ready.length;
  $('#statNew').textContent = ready.filter(isNew).length;

  // 영역 버튼
  const chips = [{ name:'전체', icon:'🎮' }, ...AREAS];
  $('#areaChips').innerHTML = chips.map(a => {
    const n = a.name === '전체' ? GAME_LIST.length : GAME_LIST.filter(g => g.area === a.name).length;
    return `<button type="button" data-area="${esc(a.name)}" aria-pressed="${a.name === '전체'}"><span aria-hidden="true">${a.icon}</span>${esc(a.name)}<small>${n}</small></button>`;
  }).join('');
  $('#areaChips').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.area = b.dataset.area;
    $$('#areaChips button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    renderZone();
  });
  $('#gradeSel').addEventListener('change', e => { state.grade = e.target.value; renderZone(); });
  $('#sortSel').addEventListener('change', e => { state.sort = e.target.value; renderZone(); });
  $('#searchBox').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); renderZone(); });

  // 주소에 ?area=도형과 측정 이 있으면 그 영역부터 보여 줘요
  const qa = new URLSearchParams(location.search).get('area');
  if (qa && chips.some(c => c.name === qa)){
    state.area = qa;
    $$('#areaChips button').forEach(x => x.setAttribute('aria-pressed', x.dataset.area === qa ? 'true' : 'false'));
  }

  function renderZone(){
    let rows = GAME_LIST.map((item, i) => ({ item, i }));
    if (state.area !== '전체') rows = rows.filter(r => r.item.area === state.area);
    if (state.grade !== '0'){
      const g = Number(state.grade);
      rows = rows.filter(r => { const [a, b] = gradeRange(r.item.grade); return g >= a && g <= b; });
    }
    if (state.q) rows = rows.filter(r => [r.item.title, r.item.desc, r.item.area, r.item.grade].join(' ').toLowerCase().includes(state.q));
    if (state.sort === 'name') rows.sort((a, b) => a.item.title.localeCompare(b.item.title, 'ko'));
    else if (state.sort === 'grade') rows.sort((a, b) => gradeRange(a.item.grade)[0] - gradeRange(b.item.grade)[0] || byLatest(a, b));
    else rows.sort(byLatest);
    // 준비 중인 게임은 항상 뒤로
    rows.sort((a, b) => (!a.item.file) - (!b.item.file));

    $('#zoneCount').textContent = `${rows.length}개의 게임`;
    $('#zoneEmpty').hidden = rows.length > 0;
    renderInto($('#zoneGrid'), 'games', rows.map(r => r.i));
  }
  renderZone();
}

/* =========================================================
   8. 주소에 #game=파일 이 있으면 바로 열기 (수업용 바로가기 링크)
   ========================================================= */
(function openFromHash(){
  const m = location.hash.match(/^#game=(.+)$/);
  if (!m || !$('#player')) return;
  const file = decodeURIComponent(m[1]);
  const gi = GAME_LIST.findIndex(g => g.file === file);
  if (gi >= 0) return openItem('games', gi);
  for (const kind of ['learn', 'check']){
    const ui = UNIT_LIST.findIndex(u => u[KINDS[kind].field] === file);
    if (ui >= 0) return openEntry(unitEntry(kind, ui));
  }
})();

window.TyranoMath = { toast, openItem, openEntry, closeItem };
})();
