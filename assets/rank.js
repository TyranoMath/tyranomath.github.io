/* =========================================================
   🏆 TyranoMath 실시간 랭킹 (게임존 · 퍼즐존 게임 안에서 써요)
   - 기록은 data.js 의 statsUrl(구글 시트 Apps Script)로 모여요. 주소가 없으면 랭킹 버튼이 보이지 않아요.
   - 게임에서 쓰는 법:
       TMRank.setup({ game:'sudoku', title:'티라노 스도쿠', kind:'time',      // time · low · score
                      levels:[['4-0','4×4 쉬움'], …], level:() => '4-0', mount:['.top'] });
       TMRank.start('4-0', '4×4 쉬움');                       // 한 판을 시작할 때
       TMRank.finish({ level:'4-0', name:'4×4 쉬움', value:83 }); // 끝났을 때 (점수 게임은 t:걸린 초)
   ========================================================= */
(function(){
'use strict';
if (window.TMRank) return;

/* ---------- 저장 ---------- */
const ls = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
let DEV = ls.get('tm-rank-dev');
if (!DEV){ DEV = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); ls.set('tm-rank-dev', DEV); }
const getNick = () => ls.get('tm-rank-nick') || '';
const getClass = () => ls.get('tm-rank-class') || '';

/* ---------- 금칙어 (구글 시트에서도 한 번 더 검사해요) ---------- */
const BAN = ['시발','씨발','씨바','시바','씹','쉬발','슈발','십새','십세','병신','븅신','빙신','좆','존나','졸라','개새','개색','개세','새끼','섹스','미친','미쳤','꺼져','닥쳐','지랄',
  '느금','니애미','니엄','애미','애비','엠창','등신','찐따','또라이','뒤져','뒤질','죽어','자살','살인','야동','변태','보지','자지','성기','일베','한남','한녀','틀딱','장애인',
  '운영자','관리자','선생님','admin','fuck','shit','bitch','sex','porn','dick','damn','asshole','nigger','nigga','sibal','ssibal','tlqkf','qudtls'];
const norm = s => String(s || '').toLowerCase().replace(/[^a-z가-힣ㄱ-ㅎ]/g, '');
function checkNick(n){
  n = String(n || '').replace(/\s+/g, ' ').trim();
  if (n.length < 2 || n.length > 8) return '닉네임은 2~8글자로 써요.';
  if (!/^[가-힣A-Za-z0-9 _]+$/.test(n)) return '닉네임은 한글(완성된 글자)·영어·숫자만 쓸 수 있어요.';
  if (BAN.some(w => norm(n).includes(norm(w)))) return '쓸 수 없는 말이 들어 있어요. 다른 닉네임을 써 주세요.';
  return '';
}
function checkClass(c){
  c = String(c || '').replace(/\s+/g, '').toUpperCase();
  if (!c) return '';
  if (!/^[가-힣A-Z0-9\-]{2,12}$/.test(c)) return '반 코드는 한글·영어·숫자 2~12글자예요.';
  if (BAN.some(w => norm(c).includes(norm(w)))) return '반 코드에 쓸 수 없는 말이 있어요.';
  return '';
}

/* ---------- 구글 시트 주소 찾기 ---------- */
let urlP = null;
function getUrl(){
  if (urlP) return urlP;
  urlP = (async () => {
    const over = ls.get('tm-rank-url'); if (over) return over;               // (테스트용)
    try { if (window.parent !== window && window.parent.TM_STATS_URL !== undefined) return window.parent.TM_STATS_URL || ''; } catch(e){}
    const base = SCRIPT_SRC ? new URL('../data.js', SCRIPT_SRC).href : '../data.js';
    try {
      const txt = await (await fetch(base, { cache: 'no-cache' })).text();
      const m = txt.match(/statsUrl\s*:\s*['"]([^'"]*)['"]/);
      return m ? m[1].trim() : '';
    } catch(e){ return ''; }
  })();
  return urlP;
}
const SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
async function api(params, ms = 9000){
  const u = await getUrl(); if (!u) throw new Error('nourl');
  const q = new URLSearchParams(Object.assign({ d: DEV }, params)).toString();
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(u + (u.includes('?') ? '&' : '?') + q, { signal: ctrl.signal }); return await r.json(); }
  finally { clearTimeout(timer); }
}

/* ---------- 모양 ---------- */
const CSS = `
.tmr-btn{font-family:'Jua',sans-serif;font-size:clamp(14px,1.5vw,19px);background:#FFD43B;color:#5A3B00;border:3px solid #E8B500;border-radius:999px;padding:4px 14px;cursor:pointer;
  box-shadow:0 3px 0 #C99A00;white-space:nowrap;line-height:1.3;touch-action:manipulation}
.tmr-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #C99A00}
.tmr-btn[hidden]{display:none!important}
.tmr-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(34,49,74,.45);display:grid;place-items:center;padding:12px;font-family:'Gowun Dodum','Jua',system-ui,sans-serif;color:#22314A;
  -webkit-user-select:none;user-select:none;word-break:keep-all}
.tmr-ov[hidden]{display:none!important}
.tmr-box{background:#FFF8EC;border:4px solid #ECDFC8;border-radius:26px;width:min(520px,100%);max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 10px 0 rgba(0,0,0,.08)}
.tmr-head{display:flex;align-items:center;gap:8px;padding:14px 16px 8px}
.tmr-head h2{margin:0;font-family:'Jua',sans-serif;font-weight:400;font-size:clamp(20px,2.4vw,26px);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tmr-x{border:0;background:#fff;border:3px solid #ECDFC8;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer;flex:none}
.tmr-body{padding:0 16px 14px;overflow:auto;display:flex;flex-direction:column;gap:10px}
.tmr-tabs{display:flex;gap:6px;flex-wrap:wrap}
.tmr-tabs button{flex:1 1 auto;font-family:'Jua',sans-serif;font-size:16px;border:3px solid #ECDFC8;background:#fff;border-radius:14px;padding:6px 10px;cursor:pointer;color:#22314A;box-shadow:0 3px 0 #ECDFC8}
.tmr-tabs button[aria-pressed="true"]{background:#8E5BD6;border-color:#6C3FB4;color:#fff;box-shadow:0 3px 0 #6C3FB4}
.tmr-tabs.lv{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}
.tmr-tabs.lv button{flex:0 0 auto;font-size:14px;padding:5px 10px}
.tmr-tabs.per button[aria-pressed="true"]{background:#FF9F43;border-color:#D97A1F;box-shadow:0 3px 0 #D97A1F}
.tmr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;min-height:120px}
.tmr-list li{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:8px;background:#fff;border:3px solid #ECDFC8;border-radius:16px;padding:6px 12px}
.tmr-list li.me{border-color:#8E5BD6;background:#F3ECFF}
.tmr-list li.top1{background:#FFF3C4;border-color:#FFD43B}
.tmr-r{font-family:'Fredoka','Jua',sans-serif;font-weight:700;font-size:20px;text-align:center}
.tmr-n{font-family:'Jua',sans-serif;font-size:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tmr-n small{font-family:'Gowun Dodum',sans-serif;font-size:12px;color:#5D6C83;background:#EEF3F8;border-radius:8px;padding:1px 6px;margin-left:6px;vertical-align:2px}
.tmr-v{font-family:'Fredoka','Jua',sans-serif;font-weight:700;font-size:19px;color:#6C3FB4;text-align:right;white-space:nowrap}
.tmr-v small{display:block;font-size:11px;color:#5D6C83;font-weight:500}
.tmr-empty{text-align:center;color:#5D6C83;padding:24px 8px;font-size:16px;line-height:1.6}
.tmr-me{font-size:14px;color:#22314A;text-align:center;background:#F3ECFF;border-radius:12px;padding:6px}
.tmr-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:#5D6C83;border-top:2px dashed #ECDFC8;padding-top:8px}
.tmr-foot b{color:#22314A}
.tmr-link{border:0;background:none;color:#6C3FB4;font:inherit;text-decoration:underline;cursor:pointer;padding:2px}
.tmr-live{display:inline-flex;align-items:center;gap:5px}
.tmr-live i{width:8px;height:8px;border-radius:50%;background:#4CB963;display:inline-block;animation:tmrBlink 1.6s infinite}
@keyframes tmrBlink{50%{opacity:.25}}
.tmr-form{display:flex;flex-direction:column;gap:8px}
.tmr-form label{font-family:'Jua',sans-serif;font-size:16px;display:flex;flex-direction:column;gap:4px}
.tmr-form label small{font-family:'Gowun Dodum',sans-serif;font-size:12px;color:#5D6C83}
.tmr-form input{font:600 18px 'Gowun Dodum',sans-serif;padding:9px 12px;border:3px solid #ECDFC8;border-radius:12px;background:#fff;color:#22314A;width:100%;box-sizing:border-box;-webkit-user-select:text;user-select:text}
.tmr-form input:focus{outline:none;border-color:#8E5BD6}
.tmr-err{color:#E5546B;font-size:14px;min-height:1.2em;text-align:center}
.tmr-rec{text-align:center;font-family:'Jua',sans-serif;font-size:18px;background:#fff;border:3px solid #ECDFC8;border-radius:16px;padding:8px}
.tmr-rec b{font-family:'Fredoka','Jua',sans-serif;font-size:30px;color:#6C3FB4;display:block}
.tmr-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.tmr-go{font-family:'Jua',sans-serif;font-size:20px;border:0;border-radius:16px;padding:10px 22px;background:#4CB963;color:#fff;box-shadow:0 4px 0 #2F8A47;cursor:pointer}
.tmr-go.alt{background:#fff;color:#6C3FB4;border:3px solid #ECDFC8;box-shadow:0 4px 0 #ECDFC8}
.tmr-go:disabled{opacity:.6;cursor:wait}
.tmr-done{text-align:center;font-family:'Jua',sans-serif;font-size:22px;line-height:1.5}
.tmr-done small{display:block;font-family:'Gowun Dodum',sans-serif;font-size:14px;color:#5D6C83}
@media (max-width:480px){.tq-top .tmr-btn .tmr-t{display:none}.tq-top .tmr-btn{padding:4px 9px}}
@media (prefers-reduced-motion:reduce){.tmr-live i{animation:none}}
`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
function fmtV(kind, v, unit){
  if (kind === 'score') return Number(v).toLocaleString() + '점';
  if (kind === 'low') return v + (unit || '수');
  const s = Number(v), m = Math.floor(s / 60), r = s - m * 60, rs = Number.isInteger(r) ? String(r) : r.toFixed(1);
  return m ? `${m}분 ${rs.padStart(Number.isInteger(r) ? 2 : 4, '0')}초` : `${rs}초`;
}
const fmtT = t => t ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : '';

/* ---------- 상태 ---------- */
const C = { game:'', title:'', kind:'score', unit:'', levels:[], level:null, mount:[], onOpen:null, onClose:null };
let root = null, view = { lv:'', per:'day', scope:'all' }, refreshT = null, tokens = {}, lastRows = null, busy = false, cardSent = false;

let cssDone = false;
function css(){ if (cssDone) return; cssDone = true; const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); }
function build(){
  if (root) return;
  css();
  root = document.createElement('div'); root.className = 'tmr-ov'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
  root.innerHTML = `<div class="tmr-box"><div class="tmr-head"><h2 id="tmrTitle">🏆 랭킹</h2><button class="tmr-x" type="button" aria-label="닫기">✕</button></div><div class="tmr-body" id="tmrBody"></div></div>`;
  document.body.appendChild(root);
  // 랭킹 창에서 누른 키가 게임으로 가지 않게 막아요
  ['keydown', 'keyup', 'keypress'].forEach(t => root.addEventListener(t, e => e.stopPropagation()));
  root.addEventListener('click', e => { if (e.target === root) close(); });
  // 랭킹 창이 열려 있는 동안에는 키보드가 게임을 움직이지 않아요 (Esc 는 창 닫기)
  ['keydown', 'keyup', 'keypress'].forEach(t => window.addEventListener(t, e => {
    if (!root || root.hidden) return;
    if (t === 'keydown' && e.key === 'Escape'){ e.preventDefault(); close(); }
    if (!root.contains(e.target)) e.stopImmediatePropagation();
  }, true));
  root.querySelector('.tmr-x').addEventListener('click', close);
  ['pointerdown', 'mousedown', 'touchstart', 'wheel'].forEach(t => root.addEventListener(t, e => e.stopPropagation(), { passive: true }));
}
function show(title){
  build(); root.querySelector('#tmrTitle').textContent = title;
  if (root.hidden){ root.hidden = false; C.onOpen && C.onOpen(); }
}
function close(){
  if (!root || root.hidden) return;
  root.hidden = true; clearInterval(refreshT); refreshT = null; C.onClose && C.onClose();
}

/* ---------- 랭킹 보기 ---------- */
function levelList(extra){
  const out = C.levels.slice();
  (extra || []).forEach(([id, nm]) => { if (!out.some(x => x[0] === id)) out.push([id, nm]); });
  if (view.lv && !out.some(x => x[0] === view.lv)) out.unshift([view.lv, view.lvName || view.lv]);
  return out;
}
function open(lv, lvName){
  const cur = lv || (C.level && C.level()) || (C.levels[0] && C.levels[0][0]) || '';
  view.lv = String(cur); view.lvName = lvName || (C.levels.find(x => x[0] === view.lv) || [])[1] || (C.lvName && C.lvName()) || view.lv;
  if (getClass() && view.scope === 'auto') view.scope = 'class';
  show(`🏆 ${C.title} 랭킹`);
  renderBoard(null, true); load();
  clearInterval(refreshT); refreshT = setInterval(() => { if (!document.hidden) load(true); }, 15000);
}
async function load(quiet){
  const my = { lv: view.lv, per: view.per, scope: view.scope };
  if (!quiet) renderBoard(null, true);
  try {
    const cls = view.scope === 'class' ? getClass() : '';
    if (view.scope === 'class' && !cls){ renderBoard({ needClass: true }); return; }
    const d = await api({ action: 'rank_get', g: C.game, l: view.lv, p: view.per, c: cls, n: getNick(), mc: getClass() });
    if (my.lv !== view.lv || my.per !== view.per || my.scope !== view.scope) return;
    renderBoard(d && d.ok ? d : { error: (d && d.msg) || '랭킹을 불러오지 못했어요.' });
  } catch(e){ if (!quiet) renderBoard({ error: '인터넷 연결을 확인해 주세요.' }); }
}
function renderBoard(d, loading){
  if (!root || root.hidden && !loading) return;
  const body = root.querySelector('#tmrBody');
  const lvs = levelList(d && d.levels);
  const per = [['day', '오늘'], ['week', '이번 주'], ['all', '전체 기간']];
  const sc = [['all', '🌏 모두'], ['class', '🏫 우리 반']];
  let list;
  if (loading) list = `<div class="tmr-empty">랭킹을 불러오는 중… 🦖</div>`;
  else if (d.needClass) list = `<div class="tmr-empty">선생님이 알려 준 <b>반 코드</b>를 넣으면<br>우리 반 친구들끼리 순위를 볼 수 있어요.</div>
      <div class="tmr-form"><label>반 코드<input id="tmrCls" maxlength="12" placeholder="예) 햇살3-2" autocomplete="off"></label><div class="tmr-err" id="tmrErr"></div><div class="tmr-row"><button class="tmr-go" type="button" id="tmrClsGo">우리 반 랭킹 보기</button></div></div>`;
  else if (d.error) list = `<div class="tmr-empty">😢 ${esc(d.error)}<br><button class="tmr-link" type="button" id="tmrRetry">다시 불러오기</button></div>`;
  else if (!d.rows.length) list = `<div class="tmr-empty">아직 기록이 없어요.<br>첫 번째 주인공이 되어 볼까요? 🦖</div>`;
  else {
    const nick = getNick(), myc = getClass();
    list = `<ol class="tmr-list">${d.rows.map(r => {
      const me = r.n === nick && (!myc || r.c === myc || view.scope === 'class');
      const medal = ['🥇', '🥈', '🥉'][r.r - 1] || r.r;
      const sub = d.kind === 'score' && r.t ? `<small>${fmtT(r.t)}</small>` : '';
      return `<li class="${me ? 'me' : ''}${r.r === 1 ? ' top1' : ''}"><span class="tmr-r">${medal}</span><span class="tmr-n">${esc(r.n)}${r.c && view.scope !== 'class' ? `<small>${esc(r.c)}</small>` : ''}</span><span class="tmr-v">${fmtV(d.kind, r.v, C.unit)}${sub}</span></li>`;
    }).join('')}</ol>`;
    if (d.me && !d.rows.some(r => r.n === d.me.n && r.c === d.me.c)) list += `<div class="tmr-me">내 순위: <b>${d.me.r}등</b> · ${fmtV(d.kind, d.me.v, C.unit)} (모두 ${d.total}명)</div>`;
    else list += `<div class="tmr-me" style="background:none">모두 ${d.total}명이 도전했어요</div>`;
  }
  const nick = getNick(), cls = getClass();
  body.innerHTML = `${C.note ? `<div class="tmr-me" style="background:#FFF3C4">💡 ${esc(C.note)}</div>` : ''}
    ${lvs.length > 1 ? `<div class="tmr-tabs lv" role="group" aria-label="단계">${lvs.map(([id, nm]) => `<button type="button" data-lv="${esc(id)}" aria-pressed="${id === view.lv}">${esc(nm)}</button>`).join('')}</div>` : lvs.length ? `<div class="tmr-me" style="background:#fff">${esc(lvs[0][1])}</div>` : ''}
    <div class="tmr-tabs per" role="group" aria-label="기간">${per.map(([k, nm]) => `<button type="button" data-per="${k}" aria-pressed="${view.per === k}">${nm}</button>`).join('')}</div>
    <div class="tmr-tabs" role="group" aria-label="범위">${sc.map(([k, nm]) => `<button type="button" data-sc="${k}" aria-pressed="${view.scope === k}">${nm}${k === 'class' && cls ? ` <small>${esc(cls)}</small>` : ''}</button>`).join('')}</div>
    ${list}
    <div class="tmr-foot"><span>${nick ? `내 닉네임 <b>${esc(nick)}</b>` : '아직 닉네임이 없어요'}${cls ? ` · 반 코드 <b>${esc(cls)}</b>` : ''} <button class="tmr-link" type="button" id="tmrEdit">바꾸기</button></span>
      <span class="tmr-live"><i></i>15초마다 새로 고침</span></div>`;
  body.querySelectorAll('[data-lv]').forEach(b => b.addEventListener('click', () => { view.lv = b.dataset.lv; view.lvName = b.textContent; load(); }));
  body.querySelectorAll('[data-per]').forEach(b => b.addEventListener('click', () => { view.per = b.dataset.per; load(); }));
  body.querySelectorAll('[data-sc]').forEach(b => b.addEventListener('click', () => { view.scope = b.dataset.sc; load(); }));
  const sel = body.querySelector('.tmr-tabs.lv [aria-pressed="true"]'); if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'center' });
  const rt = body.querySelector('#tmrRetry'); if (rt) rt.addEventListener('click', () => load());
  body.querySelector('#tmrEdit').addEventListener('click', () => profile(() => { show(`🏆 ${C.title} 랭킹`); renderBoard(null, true); load(); }));
  const cg = body.querySelector('#tmrClsGo');
  if (cg){ const go = () => { const v = body.querySelector('#tmrCls').value, er = checkClass(v);
      if (!v.trim()) { body.querySelector('#tmrErr').textContent = '반 코드를 넣어 주세요.'; return; }
      if (er){ body.querySelector('#tmrErr').textContent = er; return; }
      ls.set('tm-rank-class', v.replace(/\s+/g, '').toUpperCase()); load(); };
    cg.addEventListener('click', go); body.querySelector('#tmrCls').addEventListener('keydown', e => { if (e.key === 'Enter') go(); }); }
}

/* ---------- 닉네임·반 코드 바꾸기 ---------- */
function profile(done){
  show('🦖 내 닉네임');
  const body = root.querySelector('#tmrBody');
  body.innerHTML = `<div class="tmr-form">
      <label>닉네임 <small>한글·영어·숫자 2~8글자 · 진짜 이름은 쓰지 않아요</small><input id="tmrNick" maxlength="8" value="${esc(getNick())}" autocomplete="off"></label>
      <label>반 코드 <small>(선택) 선생님이 알려 준 코드를 넣으면 우리 반 랭킹에 함께 나와요</small><input id="tmrCls" maxlength="12" value="${esc(getClass())}" placeholder="예) 햇살3-2" autocomplete="off"></label>
      <div class="tmr-err" id="tmrErr"></div>
      <div class="tmr-row"><button class="tmr-go" type="button" id="tmrSave">저장</button><button class="tmr-go alt" type="button" id="tmrBack">돌아가기</button></div></div>`;
  const save = () => {
    const n = body.querySelector('#tmrNick').value, c = body.querySelector('#tmrCls').value;
    const er = checkNick(n) || checkClass(c); if (er){ body.querySelector('#tmrErr').textContent = er; return; }
    ls.set('tm-rank-nick', n.replace(/\s+/g, ' ').trim()); ls.set('tm-rank-class', c.replace(/\s+/g, '').toUpperCase()); done();
  };
  body.querySelector('#tmrSave').addEventListener('click', save);
  body.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') save(); }));
  body.querySelector('#tmrBack').addEventListener('click', done);
  setTimeout(() => { try { body.querySelector('#tmrNick').focus({ preventScroll: true }); } catch(e){} }, 50);
}

/* ---------- 기록 올리기 ---------- */
async function finish(rec){
  const u = await getUrl().catch(() => ''); if (!u) return;
  const lv = String(rec.level), tk = tokens[lv];
  if (!tk){ return; }                                  // 시작할 때 인터넷이 없었으면 조용히 넘어가요
  if (C.kind === 'score' && !(rec.value > 0)) return;
  clearInterval(refreshT); refreshT = null;
  show('🏆 랭킹에 올릴까요?');
  const body = root.querySelector('#tmrBody');
  const name = rec.name || (C.levels.find(x => x[0] === lv) || [])[1] || lv;
  body.innerHTML = `<div class="tmr-rec">${esc(name)}<b>${fmtV(C.kind, rec.value, C.unit)}</b>${C.kind === 'score' && rec.t ? `<small>${fmtT(rec.t)} 동안</small>` : ''}</div>
    <div class="tmr-form">
      <label>닉네임 <small>한글·영어·숫자 2~8글자 · 진짜 이름은 쓰지 않아요</small><input id="tmrNick" maxlength="8" value="${esc(getNick())}" autocomplete="off" placeholder="예) 날쌘티라노"></label>
      <label>반 코드 <small>(선택) 선생님이 알려 준 코드</small><input id="tmrCls" maxlength="12" value="${esc(getClass())}" placeholder="예) 햇살3-2" autocomplete="off"></label>
      <div class="tmr-err" id="tmrErr"></div>
      <div class="tmr-row"><button class="tmr-go" type="button" id="tmrPut">🏆 올리기</button><button class="tmr-go alt" type="button" id="tmrNo">안 올릴래요</button></div></div>`;
  const put = async () => {
    if (busy) return;
    const n = body.querySelector('#tmrNick').value, c = body.querySelector('#tmrCls').value, err = body.querySelector('#tmrErr');
    const er = checkNick(n) || checkClass(c); if (er){ err.textContent = er; return; }
    const nick = n.replace(/\s+/g, ' ').trim(), cls = c.replace(/\s+/g, '').toUpperCase();
    ls.set('tm-rank-nick', nick); ls.set('tm-rank-class', cls);
    busy = true; const btn = body.querySelector('#tmrPut'); btn.disabled = true; btn.textContent = '올리는 중…'; err.textContent = '';
    try {
      const d = await api({ action: 'rank_put', g: C.game, l: lv, ln: name, n: nick, c: cls, v: rec.value, t: Math.round(rec.t || 0), k: tk });
      if (!d || !d.ok){ err.textContent = (d && d.msg) || '올리지 못했어요.'; btn.disabled = false; btn.textContent = '🏆 올리기'; return; }
      delete tokens[lv];
      const r = d.today;
      body.innerHTML = `<div class="tmr-done">🎉 랭킹에 올렸어요!<br>${r ? `오늘 <b>${r.r}등</b>이에요!` : ''}
        <small>${d.improved ? '내 최고 기록이 바뀌었어요 🏆' : '전체 기간에서는 예전 내 기록이 더 좋아요'}</small></div>
        <div class="tmr-row"><button class="tmr-go" type="button" id="tmrSee">랭킹 보기</button><button class="tmr-go alt" type="button" id="tmrNo">닫기</button></div>`;
      body.querySelector('#tmrSee').addEventListener('click', () => { view.per = 'day'; view.scope = cls ? 'class' : 'all'; open(lv, name); });
      body.querySelector('#tmrNo').addEventListener('click', close);
    } catch(e){ err.textContent = '인터넷 연결을 확인하고 다시 눌러 주세요.'; btn.disabled = false; btn.textContent = '🏆 올리기'; }
    finally { busy = false; }
  };
  body.querySelector('#tmrPut').addEventListener('click', put);
  body.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') put(); }));
  body.querySelector('#tmrNo').addEventListener('click', close);
}

/* ---------- 시작 ---------- */
function start(lv, name){
  lv = String(lv);
  if (name) C.lastName = name;
  getUrl().then(u => {
    if (!u) return;
    api({ action: 'rank_start', g: C.game, l: lv }, 8000).then(d => { if (d && d.ok) tokens[lv] = d.token; }).catch(() => {});
  });
}

/* ---------- 버튼 달기 ---------- */
function mountButton(target){
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el || el.querySelector(':scope > .tmr-btn')) return;
  css();
  const b = document.createElement('button'); b.type = 'button'; b.className = 'tmr-btn'; b.innerHTML = '🏆<span class="tmr-t"> 랭킹</span>'; b.setAttribute('aria-label', '랭킹 보기'); b.hidden = true;
  b.addEventListener('click', e => { e.stopPropagation(); open(); });
  el.appendChild(b);
  getUrl().then(u => { b.hidden = !u; });
}
function setup(cfg){
  Object.assign(C, cfg);
  C.levels = (cfg.levels || []).map(x => [String(x[0]), String(x[1])]);
  view.scope = getClass() ? 'class' : 'all';
  const doMount = () => (C.mount || []).forEach(mountButton);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', doMount); else doMount();
}

window.TMRank = { setup, start, finish, open, close, mountButton, checkNick, fmtV, get ready(){ return getUrl(); } };
})();
