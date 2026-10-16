/* =========================================================
   🐞 TyranoMath 버그 제보 게시판 (bugboard.html)
   글은 data.js 의 statsUrl(구글 시트 Apps Script) '버그제보' 탭에 모여요.
   선생님은 시트에서 [상태]와 [선생님 답변]을 고치면 게시판에 바로 보여요.
   ========================================================= */
(function(){
'use strict';
const $ = s => document.querySelector(s);
const CFGx = typeof CONFIG !== 'undefined' ? CONFIG : {};
const URL_ = (() => { try { const o = localStorage.getItem('tm-rank-url'); if (o) return o; } catch(e){} return CFGx.statsUrl || ''; })();
const ls = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
let DEV = ls.get('tm-rank-dev');
if (!DEV){ DEV = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); ls.set('tm-rank-dev', DEV); }
const CATS = [['개념 탐험대', '🦖'], ['실력 진단소', '🎯'], ['수학 도구존', '🧰'], ['티라노 게임존', '🎮'], ['티라노 퍼즐존', '🧩'], ['기타', '💬']];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const BAN = ['시발','씨발','씨바','시바','씹','쉬발','병신','븅신','좆','존나','개새','새끼','섹스','미친','지랄','니애미','애미','등신','찐따','또라이','야동','일베','운영자','관리자','선생님','admin','fuck','shit','bitch','sex','tlqkf'];
const norm = s => String(s || '').toLowerCase().replace(/[^a-z가-힣ㄱ-ㅎ]/g, '');
let cat = '', filter = '', page = 1, busy = false;

/* ---------- 기기 정보 (자동) ---------- */
function deviceInfo(){
  const ua = navigator.userAgent, w = screen.width, h = screen.height;
  const os = /iPad|Macintosh.*Mobile|Macintosh.*touch/i.test(ua) && 'ontouchend' in document ? 'iPad' : /iPhone/.test(ua) ? 'iPhone' : /Android/.test(ua) ? (/Mobile/.test(ua) ? '안드로이드폰' : '안드로이드 태블릿') : /Windows/.test(ua) ? 'Windows' : /CrOS/.test(ua) ? '크롬북' : /Mac/.test(ua) ? 'Mac' : '기타';
  const br = /Whale/.test(ua) ? '웨일' : /Edg\//.test(ua) ? '엣지' : /SamsungBrowser/.test(ua) ? '삼성 인터넷' : /Chrome/.test(ua) ? '크롬' : /Firefox/.test(ua) ? '파이어폭스' : /Safari/.test(ua) ? '사파리' : '기타';
  const mode = document.documentElement.dataset.device || '';
  const MODE = { pc:'컴퓨터 화면', pad:'패드 화면', phone:'스마트폰 화면', board:'전자칠판 화면' };
  return `${os} · ${br} · ${w}×${h}${MODE[mode] ? ' · ' + MODE[mode] : ''}`;
}

/* ---------- 어디에서 왔는지 (게임 창의 🐞 버튼) ---------- */
const LISTS = [['티라노 게임존', typeof GAMES !== 'undefined' ? GAMES : []], ['티라노 퍼즐존', typeof PUZZLES !== 'undefined' ? PUZZLES : []], ['수학 도구존', typeof TOOLS !== 'undefined' ? TOOLS : []]];
function lookup(file){
  for (const [c, list] of LISTS){ const g = list.find(x => x.file === file); if (g) return [c, g.title]; }
  if (typeof UNITS !== 'undefined'){
    const u = UNITS.find(x => x.learn === file || x.check === file);
    if (u) return [u.check === file ? '실력 진단소' : '개념 탐험대', `${u.grade}학년 ${u.sem}학기 ${u.no}. ${u.title}`];
  }
  return null;
}

/* ---------- 글쓰기 ---------- */
function renderCats(){
  $('#bbCats').innerHTML = CATS.map(([c, ic]) => `<button type="button" data-c="${esc(c)}" aria-pressed="${c === cat}"><span aria-hidden="true">${ic}</span>${esc(c)}</button>`).join('');
}
$('#bbCats').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ cat = b.dataset.c; renderCats(); } });
$('#bbTxt').addEventListener('input', e => $('#bbCount').textContent = `${e.target.value.length} / 300`);
$('#bbNick').value = ls.get('tm-rank-nick') || '';
$('#bbInfo').textContent = '📱 자동으로 함께 보내요: ' + deviceInfo();
// 위치 자동 완성 목록
(() => {
  const names = [];
  LISTS.forEach(([, list]) => list.forEach(g => g.file && names.push(g.title)));
  if (typeof UNITS !== 'undefined') UNITS.forEach(u => u.learn && names.push(`${u.grade}학년 ${u.sem}학기 ${u.no}. ${u.title}`));
  $('#bbLocList').innerHTML = [...new Set(names)].map(n => `<option value="${esc(n)}">`).join('');
})();
const from = new URLSearchParams(location.search).get('from');
if (from){ const f = lookup(from); if (f){ cat = f[0]; $('#bbLoc').value = f[1]; } }
renderCats();

function checkNick(n){
  if (n.length < 2 || n.length > 8) return '닉네임은 2~8글자로 써요.';
  if (!/^[가-힣A-Za-z0-9 _]+$/.test(n)) return '닉네임은 한글(완성된 글자)·영어·숫자만 쓸 수 있어요.';
  if (BAN.some(w => norm(n).includes(norm(w)))) return '닉네임에 쓸 수 없는 말이 있어요.';
  return '';
}
async function api(params, post){
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const q = new URLSearchParams(Object.assign({ d: DEV }, params));
    const r = post ? await fetch(URL_, { method:'POST', body: JSON.stringify(Object.assign({ d: DEV }, params)), signal: ctrl.signal })
                   : await fetch(URL_ + (URL_.includes('?') ? '&' : '?') + q, { signal: ctrl.signal });
    return await r.json();
  } finally { clearTimeout(t); }
}
$('#bbForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (busy) return;
  const err = $('#bbErr'), nick = $('#bbNick').value.replace(/\s+/g, ' ').trim(), txt = $('#bbTxt').value.trim(), loc = $('#bbLoc').value.trim();
  const ne = checkNick(nick);
  if (ne){ err.textContent = ne; $('#bbNick').focus(); return; }
  if (!cat){ err.textContent = '어디에서 생긴 문제인지 골라 주세요.'; return; }
  if (txt.length < 5){ err.textContent = '어떤 문제인지 5글자 이상 써 주세요.'; $('#bbTxt').focus(); return; }
  if (!URL_){ err.textContent = '아직 게시판이 연결되지 않았어요. 선생님께 알려 주세요!'; return; }
  busy = true; err.textContent = ''; const btn = $('#bbSend'); btn.disabled = true; btn.textContent = '올리는 중…';
  try {
    const d = await api({ action: 'bug_put', n: nick, cat, loc, txt, info: deviceInfo() + (from ? ' · ' + from : '') }, true);
    if (!d || !d.ok){ err.textContent = (d && d.msg) || '올리지 못했어요.'; return; }
    ls.set('tm-rank-nick', nick);
    $('#bbTxt').value = ''; $('#bbCount').textContent = '0 / 300';
    err.innerHTML = `<span style="color:var(--green-d)">🎉 ${d.no}번 제보가 올라갔어요. 고마워요!</span>`;
    filter = ''; page = 1; load();
  } catch(ex){ err.textContent = '인터넷 연결을 확인하고 다시 눌러 주세요.'; }
  finally { busy = false; btn.disabled = false; btn.textContent = '🐞 제보 올리기'; }
});

/* ---------- 목록 ---------- */
const stCls = s => /해결/.test(s) && !/안/.test(s) ? 'done' : /확인|중/.test(s) ? 'doing' : /안|보류/.test(s) ? 'no' : 'new';
function renderFilter(){
  $('#bbFilter').innerHTML = [['', '🐞', '전체']].concat(CATS.map(([c, ic]) => [c, ic, c])).map(([v, ic, nm]) => `<button type="button" data-f="${esc(v)}" aria-pressed="${v === filter}"><span aria-hidden="true">${ic}</span>${esc(nm)}</button>`).join('');
}
$('#bbFilter').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ filter = b.dataset.f; page = 1; renderFilter(); load(); } });
async function load(){
  renderFilter();
  const list = $('#bbList');
  if (!URL_){
    list.innerHTML = `<li class="bb-empty">🦖 아직 게시판이 연결되지 않았어요.<br><small>선생님: data.js 의 statsUrl 에 구글 시트 주소를 넣으면 열려요.${CFGx.bugReportUrl ? `<br>지금은 <a href="${esc(CFGx.bugReportUrl)}" target="_blank" rel="noopener">제보 설문지</a>로 알려 주세요.` : ''}</small></li>`;
    $('#bbPages').innerHTML = ''; return;
  }
  list.innerHTML = '<li class="bb-empty">불러오는 중… 🦖</li>';
  try {
    const d = await api({ action: 'bug_list', cat: filter, page });
    if (!d || !d.ok) throw 0;
    $('#statTotal').textContent = d.total; $('#statDone').textContent = d.done;
    list.innerHTML = d.rows.length ? d.rows.map(r => `<li class="bb-item">
        <div class="bb-meta"><b>#${r.no}</b><span class="bb-tag">${esc(r.cat)}</span><span class="bb-st ${stCls(r.st)}">${esc(r.st)}</span><span class="bb-who">${esc(r.n)} · ${esc(r.at)}</span></div>
        ${r.loc ? `<div class="bb-loc">📍 ${esc(r.loc)}</div>` : ''}
        <p class="bb-txt">${esc(r.txt)}</p>
        ${r.ans ? `<div class="bb-ans"><b>🦖 선생님 답변</b>${esc(r.ans)}</div>` : ''}
        ${r.mine && !r.ans ? `<button class="bb-del" type="button" data-del="${r.no}">내 글 지우기</button>` : ''}
      </li>`).join('') : `<li class="bb-empty">${filter ? '이 분류에는 아직 제보가 없어요.' : '아직 제보가 없어요. 고장 난 곳이 없다는 뜻이에요! 🎉'}</li>`;
    const P = d.pages;
    $('#bbPages').innerHTML = P > 1 ? Array.from({ length: P }, (_, i) => `<button type="button" data-p="${i + 1}" aria-current="${i + 1 === d.page ? 'page' : 'false'}">${i + 1}</button>`).join('') : '';
  } catch(e){
    list.innerHTML = '<li class="bb-empty">😢 목록을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</li>';
  }
}
$('#bbPages').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b){ page = +b.dataset.p; load(); $('.bb-listcard').scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
$('#bbList').addEventListener('click', async e => {
  const b = e.target.closest('[data-del]'); if (!b) return;
  if (!confirm(`${b.dataset.del}번 글을 지울까요?`)) return;
  try { const d = await api({ action: 'bug_del', no: b.dataset.del }); if (!d.ok) alert(d.msg); load(); } catch(ex){ alert('인터넷 연결을 확인해 주세요.'); }
});
$('#bbReload').addEventListener('click', load);
load();
})();
