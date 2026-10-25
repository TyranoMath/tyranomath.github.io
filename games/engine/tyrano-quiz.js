/* =========================================================
   TyranoMath 게임 엔진 — "문제 + 고르기" 게임을 쉽게 만드는 도구
   사용법 (게임 HTML 안에서):
     TyranoQuiz.start({
       title:'게임 이름', emoji:'🎮', intro:'설명',
       time:60,                 // 제한 시간(초)
       goal:20,                 // (선택) 이 점수에 도달하면 성공!
       levels:[{label:'쉬움', value:1, rankKey:'1'}, ...],   // rankKey: (선택) 랭킹 단계 이름
       make(level){ return { q:'문제 HTML', answer:'정답키', choices:[{key:'정답키', html:'보기'}, ...] }; }
     });
   문제를 맞히면 티라노가 꼬리 흔들기 · 점프 · 불 뿜기 · 빙글 춤 · 크앙! 등으로 기뻐해요.
   ========================================================= */
(function(){
'use strict';
const LOGO = `<svg viewBox="0 0 220 200" aria-hidden="true"><path d="M58 142 Q18 142 6 106 Q30 126 62 118 Z" fill="#4CB963"/><path d="M86 88 L80 68 L98 82 Z M71 98 L60 80 L81 92 Z M59 112 L44 98 L67 106 Z M108 34 L110 14 L126 28 Z M128 28 L136 9 L146 26 Z" fill="#FF9F43"/><rect x="68" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><rect x="106" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><ellipse cx="96" cy="128" rx="47" ry="44" fill="#5CC46F"/><ellipse cx="108" cy="134" rx="26" ry="32" fill="#E8F7C8"/><rect x="92" y="26" width="112" height="80" rx="38" fill="#5CC46F"/><circle cx="150" cy="56" r="15" fill="#fff" stroke="#2E6B3A" stroke-width="2"/><circle cx="154" cy="58" r="8.5" fill="#22314A"/><circle cx="157.5" cy="54" r="3" fill="#fff"/><ellipse cx="174" cy="76" rx="10" ry="5.5" fill="#FF8FA3" opacity=".65"/><path d="M140 84 Q166 104 194 82" stroke="#2E6B3A" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M136 118 q16 -4 20 8 q-3 5 -9 2 q-4 -4 -11 -1 Z" fill="#3A9D51"/></svg>`;
// 부위마다 따로 움직이는 큰 티라노
const REX = `<svg class="rex" viewBox="-6 -10 300 214" aria-hidden="true">
<ellipse class="shadow" cx="100" cy="194" rx="62" ry="8" fill="#22314A" opacity=".16"/>
<g class="all">
  <g class="tail"><path d="M58 142 Q18 142 6 106 Q30 126 62 118 Z" fill="#4CB963"/></g>
  <path d="M86 88 L80 68 L98 82 Z M71 98 L60 80 L81 92 Z M59 112 L44 98 L67 106 Z M108 34 L110 14 L126 28 Z M128 28 L136 9 L146 26 Z" fill="#FF9F43"/>
  <rect class="l1" x="68" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><rect class="l2" x="106" y="156" width="25" height="32" rx="11" fill="#3A9D51"/>
  <ellipse cx="96" cy="128" rx="47" ry="44" fill="#5CC46F"/><ellipse cx="108" cy="134" rx="26" ry="32" fill="#E8F7C8"/>
  <g class="head">
    <rect x="92" y="26" width="112" height="80" rx="38" fill="#5CC46F"/>
    <g class="eye"><circle cx="150" cy="56" r="15" fill="#fff" stroke="#2E6B3A" stroke-width="2"/><circle cx="154" cy="58" r="8.5" fill="#22314A"/><circle cx="157.5" cy="54" r="3" fill="#fff"/></g>
    <ellipse cx="174" cy="76" rx="10" ry="5.5" fill="#FF8FA3" opacity=".65"/>
    <path class="mouth" d="M140 84 Q166 104 194 82" stroke="#2E6B3A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path class="jaw" d="M138 82 Q166 124 200 80 Q170 94 138 82 Z" fill="#B23A4E" stroke="#2E6B3A" stroke-width="3" stroke-linejoin="round"/>
    <path class="sweat" d="M118 22 q-7 10 0 14 q7 -4 0 -14 Z" fill="#6CC4F5" stroke="#3B8FD9" stroke-width="1.5"/>
  </g>
  <path class="arm" d="M136 118 q16 -4 20 8 q-3 5 -9 2 q-4 -4 -11 -1 Z" fill="#3A9D51"/>
</g>
<g class="fire"><path class="f1" d="M198 78 Q232 54 266 70 Q296 86 266 100 Q234 116 198 94 Q210 86 198 78 Z" fill="#FF6B3D"/><path class="f2" d="M200 82 Q228 70 252 78 Q270 86 252 94 Q228 102 200 90 Q208 86 200 82 Z" fill="#FFD43B"/></g>
</svg>`;

/* 🏆 랭킹 (assets/rank.js 를 불러와서 써요) */
function withRank(fn){
  if (window.TMRank) return fn(window.TMRank);
  const q = (withRank.q = withRank.q || []); q.push(fn);
  if (q.length > 1) return;
  const sc = document.createElement('script');
  sc.src = new URL('../../assets/rank.js', ENGINE_SRC || location.href).href;
  sc.onload = () => { q.splice(0).forEach(f => f(window.TMRank)); };
  document.head.appendChild(sc);
}
const ENGINE_SRC = document.currentScript ? document.currentScript.src : '';
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
// 정답 숫자 + 그럴듯한 오답 숫자로 보기 만들기
function numChoices(answer, n = 4, spread = 4, min = 0, extra = []){
  const set = new Set([answer]);
  extra.forEach(v => { if (set.size < n && v !== answer && v >= min && Number.isInteger(v)) set.add(v); });
  let guard = 0;
  while (set.size < n && guard++ < 200){ const v = answer + rnd(-spread, spread); if (v >= min) set.add(v); }
  return shuffle([...set]).map(v => ({ key: String(v), html: String(v), cls: 'num' }));
}

/* ---------- 소리 ---------- */
let actx = null, soundOn = true;
try { soundOn = localStorage.getItem('tq-sound') !== '0'; } catch(e){}
function tone(f, d = .1, type = 'triangle', vol = .07, when = 0, f2){
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when;
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02);
  } catch(e){}
}
const sfx = {
  ok(){ tone(660, .1); tone(880, .14, 'triangle', .07, .08); },
  bad(){ tone(220, .22, 'sine', .08); tone(170, .25, 'sine', .07, .12); },
  fire(){ tone(140, .7, 'sawtooth', .05, 0, 520); tone(90, .7, 'square', .03, .05, 300); },
  roar(){ tone(180, .5, 'sawtooth', .06, 0, 90); },
  jump(){ tone(400, .25, 'triangle', .07, 0, 900); },
  beep(){ tone(520, .12, 'square', .05); }, go(){ tone(880, .3, 'square', .06); },
  win(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, .2, 'triangle', .08, i * .12)); }
};

function start(cfg){
  const C = Object.assign({ time: 60, levels: [{ label: '시작', value: 1 }], emoji: '🦖', cheers: ['정답! 크앙~', '최고예요! 🦖', '훌륭해요! ✨', '대단해요! 👏'] }, cfg);
  document.title = C.title + ' · TyranoMath';
  if (C.accent) document.documentElement.style.setProperty('--accent', C.accent);
  if (C.bg) { document.documentElement.style.setProperty('--bg1', C.bg[0]); document.documentElement.style.setProperty('--bg2', C.bg[1]); }
  if (!document.querySelector('link[href*="Gowun+Dodum"]')){
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&family=Fredoka:wght@500;700&display=swap'; document.head.appendChild(l);
  }
  const rk = i => String(C.levels[i].rankKey != null ? C.levels[i].rankKey : i);
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.max(0, s) % 60).padStart(2, '0');

  document.body.innerHTML = `
  <div class="tq-app">
    <div class="topbar">
      <div class="brand"><span class="logo">${LOGO}</span><span>Tyrano<b>Math</b></span><small>${C.emoji} ${C.title}</small></div>
      <div class="tools">
        <a class="tool zone" id="btnZone" href="../gamezone.html" hidden>←<span class="txt"> 게임존</span></a>
        <button class="tool" id="tqSound" aria-pressed="${soundOn}" aria-label="소리">🔊<span class="txt"> 소리</span></button>
        <button class="tool" id="btnFull" aria-label="전체 화면">⛶<span class="txt"> 전체 화면</span></button>
        <button class="tool" id="tqPause" aria-label="일시정지" disabled>⏸<span class="txt"> 일시정지</span></button>
        <button class="tool set" id="tqSet" aria-label="설정">⚙️<span class="txt"> 설정</span></button>
      </div>
    </div>
    <div class="tq-board">
      <div class="sc"><span class="nm">${C.scoreIcon || '⭐'} 점수</span><b id="tqScore">0</b>${C.goal ? `<small>/ ${C.goal}</small>` : ''}<span class="combo" id="tqCombo"></span></div>
      <div class="mid"><span class="lv" id="tqLv"></span><span class="clock" id="tqTime">${fmt(C.time)}</span>${C.goal ? `<div class="tq-progress" title="${C.goalText || '목표'}"><i id="tqBar"></i></div>` : ''}</div>
      <div class="sc best"><b id="tqBestNow">-</b><span class="nm">최고 기록</span></div>
    </div>
    <main class="tq-stage" id="tqStage">
      <div class="tq-qrow"><div class="tq-dino" id="tqDino">${REX}<div class="fxl" id="tqFx"></div></div><div class="tq-q" id="tqQ"></div></div>
      <div class="tq-choices" id="tqChoices"></div>
      <div class="tq-msg" id="tqMsg"></div>
    </main>
    <footer class="copy">© 2026 TyranoMath 백태진 All rights reserved.</footer>
  </div>
  <div class="tq-overlay" id="tqStart">
    <div class="sheet">
      <header><span class="logo">${LOGO}</span><div><h2>크앙! <b>${C.title}</b></h2><p class="lead">${C.intro || ''}</p></div></header>
      <h3>단계 고르기</h3>
      <div class="tq-levels" id="tqLevels">${C.levels.map((l, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${l.label}<small id="tqLvBest${i}"></small></button>`).join('')}</div>
      <div class="info"><span>⏱ ${C.time >= 60 ? Math.floor(C.time / 60) + '분' + (C.time % 60 ? ' ' + C.time % 60 + '초' : '') : C.time + '초'}</span>${C.goal ? `<span>🎯 ${C.goal}문제 맞히면 성공</span>` : '<span>🎯 많이 맞힐수록 좋아요</span>'}<span>🔥 연속 정답이면 티라노가 불을 뿜어요</span></div>
      <div class="row"><button class="tq-btn alt" id="tqResume" hidden>▶ 이어 하기</button><button class="tq-btn" id="tqGo">시작하기 🦖</button></div>
    </div>
  </div>
  <div class="tq-overlay" id="tqCount" hidden><div id="tqCountNum">3</div></div>
  <div class="tq-overlay" id="tqPauseOv" hidden>
    <div class="sheet"><div class="endbig">⏸</div><h2>잠깐 쉬어요</h2><div class="row"><button class="tq-btn" id="tqCont">▶ 계속하기</button><button class="tq-btn alt" id="tqPSet">⚙️ 설정</button></div></div>
  </div>
  <div class="tq-overlay" id="tqEnd" hidden>
    <div class="sheet">
      <div class="endbig" id="tqEndEmoji">${LOGO}</div>
      <h2 id="tqEndTitle"></h2>
      <p class="lead" id="tqEndText"></p>
      <div class="stats"><div><b id="tqSRight">0</b><span>맞힌 문제</span></div><div><b id="tqSAcc">-</b><span>정답률</span></div><div><b id="tqSCombo">0</b><span>최고 연속</span></div></div>
      <p class="newrec" id="tqBest"></p>
      <div class="row"><button class="tq-btn" id="tqAgain">다시 하기 🦖</button><button class="tq-btn alt" id="tqToSet">⚙️ 단계 바꾸기</button></div>
    </div>
  </div>
  <canvas id="tqConfetti" hidden></canvas>`;

  const $ = s => document.querySelector(s);
  if (window.top === window) $('#btnZone').hidden = false;   // 따로 열렸을 때만 '게임존' 링크 표시
  if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) $('#btnFull').hidden = true;

  let levelIdx = 0, score = 0, time = C.time, timer = null, cur = null, busy = false, tries = 0, combo = 0, bestCombo = 0, phase = 'setup', later = [];
  const gameId = C.rankId || location.pathname.split('/').pop().replace(/\.html?$/, '');
  withRank(R => R.setup({ game: gameId, title: C.title, kind: 'score', levels: C.levels.map((l, i) => [rk(i), l.label]), level: () => rk(levelIdx), mount: ['.topbar .tools', '#tqStart header'], onOpen: () => { if (phase === 'play') pause(); } }));

  const bestKey = i => 'tq-best-' + C.title + '-' + i;
  const getBest = i => { try { return Number(localStorage.getItem(bestKey(i)) || 0); } catch(e){ return 0; } };
  function showBests(){
    C.levels.forEach((l, i) => { const b = getBest(i), el = $('#tqLvBest' + i); if (el) el.textContent = b ? `🏆 ${b}문제` : ''; });
    $('#tqBestNow').textContent = getBest(levelIdx) || '-';
    $('#tqLv').textContent = C.levels[levelIdx].label;
  }

  /* ---------- 🦖 티라노 움직임 ---------- */
  const dino = $('#tqDino'), fxl = $('#tqFx');
  const ACTS = { wag: 1100, jump: 820, fire: 1250, spin: 920, roar: 920, dance: 1050, no: 1150 };
  let actT = 0;
  function act(name){
    clearTimeout(actT);
    dino.className = 'tq-dino'; void dino.offsetWidth; dino.classList.add('a-' + name);
    actT = setTimeout(() => dino.className = 'tq-dino', ACTS[name] || 900);
    if (name === 'fire'){ sfx.fire(); const st = $('#tqStage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake'); }
    if (name === 'roar'){ sfx.roar(); bubble('크앙!'); }
    if (name === 'jump') sfx.jump();
  }
  function fx(chars, n = 5){
    for (let k = 0; k < n; k++){
      const s = document.createElement('span'); s.className = 'fx'; s.textContent = pick(chars);
      s.style.left = (20 + Math.random() * 60) + '%'; s.style.top = (10 + Math.random() * 40) + '%';
      s.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px'); s.style.animationDelay = (k * .08) + 's';
      fxl.appendChild(s); setTimeout(() => s.remove(), 1400);
    }
  }
  function bubble(t){ const b = document.createElement('span'); b.className = 'bubble'; b.textContent = t; fxl.appendChild(b); setTimeout(() => b.remove(), 1050); }
  const HAPPY = ['wag', 'jump', 'spin', 'roar', 'dance'];
  let lastHappy = '';
  function celebrate(){
    let a;
    if (combo >= 3 && combo % 3 === 0) a = 'fire';
    else { do { a = pick(HAPPY); } while (a === lastHappy); }
    lastHappy = a; act(a);
    if (a === 'fire') fx(['🔥', '✨'], 4);
    else if (a === 'dance') fx(['🎵', '🎶'], 4);
    else if (a === 'wag') fx(['💚', '💛'], 4);
    else if (a === 'jump' || a === 'spin') fx(['⭐', '✨'], 5);
  }

  /* ---------- 진행 ---------- */
  function next(){
    cur = C.make(C.levels[levelIdx].value);
    const q = $('#tqQ'); q.innerHTML = cur.q; q.classList.remove('pop'); void q.offsetWidth; q.classList.add('pop');
    const ch = cur.choices;
    $('#tqChoices').style.setProperty('--n', ch.length);
    $('#tqChoices').innerHTML = ch.map(c => `<button type="button" class="tq-choice ${c.cls || ''}" data-k="${String(c.key).replace(/"/g, '&quot;')}">${c.html}</button>`).join('');
    busy = false;
  }
  const wait = (fn, ms) => later.push(setTimeout(fn, ms));
  function choose(btn){
    if (busy || phase !== 'play') return;
    busy = true; tries++;
    const right = btn.dataset.k === String(cur.answer), msg = $('#tqMsg');
    if (right){
      score++; combo++; bestCombo = Math.max(bestCombo, combo);
      $('#tqScore').textContent = score;
      if (C.goal) $('#tqBar').style.width = Math.min(100, score / C.goal * 100) + '%';
      btn.classList.add('ok'); sfx.ok(); celebrate();
      const qm = $('#tqQ .qm'); if (qm && cur.answerText != null){ qm.textContent = cur.answerText; qm.classList.add('solved'); }
      else if (qm && /^-?\d+(\.\d+)?$/.test(String(cur.answer))){ qm.textContent = cur.answer; qm.classList.add('solved'); }
      msg.className = 'tq-msg good'; msg.textContent = combo >= 3 ? `🔥 ${combo}연속 정답! ${pick(C.cheers)}` : pick(C.cheers);
      const cb = $('#tqCombo'); cb.textContent = combo >= 2 ? `🔥 ${combo}연속` : ''; cb.classList.toggle('on', combo >= 2);
      if (C.goal && score >= C.goal){ wait(() => end(true), 900); return; }
      wait(next, combo % 3 === 0 ? 1150 : 820);
    } else {
      combo = 0; $('#tqCombo').classList.remove('on');
      btn.classList.add('bad'); sfx.bad(); act('no');
      const okBtn = [...document.querySelectorAll('.tq-choice')].find(b => b.dataset.k === String(cur.answer));
      okBtn && okBtn.classList.add('ok');
      msg.className = 'tq-msg bad'; msg.textContent = cur.explain ? '앗! ' + cur.explain : '앗, 아쉬워요! 초록색이 정답이에요.';
      wait(next, cur.explain ? 2000 : 1400);
    }
  }
  $('#tqChoices').addEventListener('click', e => { const b = e.target.closest('.tq-choice'); if (b) choose(b); });

  function tick(){
    if (phase !== 'play') return;
    time--; $('#tqTime').textContent = fmt(time);
    $('#tqTime').classList.toggle('hurry', time <= 10);
    if (time <= 0) end(false);
  }
  function clearLater(){ later.forEach(clearTimeout); later = []; }
  function begin(){
    clearInterval(timer); clearLater();
    score = 0; tries = 0; combo = 0; bestCombo = 0; time = C.time;
    $('#tqScore').textContent = 0; $('#tqTime').textContent = fmt(time); $('#tqTime').classList.remove('hurry');
    $('#tqCombo').classList.remove('on');
    if (C.goal) $('#tqBar').style.width = '0%';
    ['#tqStart', '#tqEnd', '#tqPauseOv'].forEach(s => $(s).hidden = true);
    showBests();
    $('#tqMsg').className = 'tq-msg'; $('#tqMsg').textContent = C.startMsg || '정답을 골라 보세요!';
    next(); busy = true; phase = 'count'; $('#tqPause').disabled = true;
    const ov = $('#tqCount'), n = $('#tqCountNum'); ov.hidden = false;
    const show = (t, go) => { n.textContent = t; n.className = go ? 'go' : ''; n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; };
    [3, 2, 1].forEach((k, i) => wait(() => { show(k); sfx.beep(); }, i * 650));
    wait(() => { show('크앙! 시작!', true); sfx.go(); act('roar'); }, 1950);
    wait(() => {
      ov.hidden = true; phase = 'play'; busy = false; $('#tqPause').disabled = false;
      timer = setInterval(tick, 1000);
      withRank(R => R.start(rk(levelIdx), C.levels[levelIdx].label));
    }, 2500);
  }
  function pause(){ if (phase !== 'play') return; phase = 'paused'; $('#tqPauseOv').hidden = false; }
  function resume(){ if (phase !== 'paused') return; ['#tqPauseOv', '#tqStart'].forEach(s => $(s).hidden = true); phase = 'play'; }
  function openSettings(){
    if (phase === 'play') pause();
    $('#tqPauseOv').hidden = true;
    $('#tqResume').hidden = phase !== 'paused';
    $('#tqGo').textContent = phase === 'paused' ? '새로 시작 🦖' : '시작하기 🦖';
    showBests(); $('#tqStart').hidden = false;
  }
  function end(win){
    clearInterval(timer); timer = null; clearLater(); phase = 'over'; $('#tqPause').disabled = true;
    const old = getBest(levelIdx), isNew = score > old;
    try { if (isNew) localStorage.setItem(bestKey(levelIdx), score); } catch(e){}
    $('#tqSRight').textContent = score;
    $('#tqSAcc').textContent = tries ? Math.round(score / tries * 100) + '%' : '-';
    $('#tqSCombo').textContent = bestCombo;
    if (win){
      $('#tqEndTitle').textContent = (C.winEmoji ? C.winEmoji + ' ' : '') + (C.winTitle || '성공!');
      $('#tqEndText').textContent = `${C.time - time}초 만에 ${score}문제를 맞혔어요!`;
    } else {
      $('#tqEndTitle').textContent = C.goal ? '⏰ 시간이 다 됐어요!' : (C.endTitle || '크앙~ 잘했어요!');
      $('#tqEndText').textContent = `${tries}문제 중 ${score}문제를 맞혔어요.` + (C.goal ? ' 다시 도전해 볼까요?' : '');
    }
    $('#tqBest').textContent = isNew && score ? `🎉 새 최고 기록! ${score}문제` : `🏆 최고 기록: ${Math.max(old, score)}문제`;
    showBests();
    setTimeout(() => { $('#tqEnd').hidden = false; if (win || isNew) { sfx.win(); confetti(); } }, win ? 200 : 600);
    act(win ? 'fire' : 'wag');
    const lv = levelIdx, sc = score, used = C.time - time;
    withRank(R => R.finish({ level: rk(lv), name: C.levels[lv].label, value: sc, t: C.goal ? used : 0 }));
  }
  function confetti(){
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = $('#tqConfetti'), x = c.getContext('2d'); c.hidden = false; c.width = innerWidth; c.height = innerHeight;
    const cols = ['#4CB963', '#FF9F43', '#FFD43B', '#3B8FD9', '#FF8FA3', '#8E5BD6'];
    const ps = Array.from({ length: 150 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .5, y: innerHeight * .3, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 3, s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: pick(cols) }));
    const t0 = performance.now();
    (function f(now){
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
      if (now - t0 < 1600) requestAnimationFrame(f); else { x.clearRect(0, 0, c.width, c.height); c.hidden = true; }
    })(t0);
  }

  /* ---------- 버튼 ---------- */
  $('#tqLevels').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    levelIdx = Number(b.dataset.i);
    document.querySelectorAll('#tqLevels button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    showBests();
  });
  $('#tqGo').addEventListener('click', begin);
  $('#tqResume').addEventListener('click', resume);
  $('#tqAgain').addEventListener('click', begin);
  $('#tqToSet').addEventListener('click', openSettings);
  $('#tqSet').addEventListener('click', openSettings);
  $('#tqPSet').addEventListener('click', openSettings);
  $('#tqPause').addEventListener('click', pause);
  $('#tqCont').addEventListener('click', resume);
  $('#tqSound').addEventListener('click', () => { soundOn = !soundOn; $('#tqSound').setAttribute('aria-pressed', soundOn); try { localStorage.setItem('tq-sound', soundOn ? '1' : '0'); } catch(e){} if (soundOn) sfx.ok(); });
  $('#btnFull').addEventListener('click', () => { try { if (document.fullscreenElement) document.exitFullscreen(); else { const r = document.documentElement.requestFullscreen(); r && r.catch && r.catch(() => {}); } } catch(e){} });
  $('#tqDino').addEventListener('click', () => { if (phase !== 'count') act(pick(HAPPY)); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P'){ if (phase === 'play'){ e.preventDefault(); pause(); } else if (phase === 'paused' && e.key !== 'Escape') resume(); return; }
    if (phase !== 'play') return;
    const n = Number(e.key); if (n >= 1 && n <= 9){ const b = document.querySelectorAll('.tq-choice')[n - 1]; if (b) choose(b); }
  });
  showBests();
  // 테스트·디버그용
  window.__tq = { get answer(){ return cur && cur.answer; }, act };
}

window.TyranoQuiz = { start, rnd, shuffle, pick, numChoices };
})();
