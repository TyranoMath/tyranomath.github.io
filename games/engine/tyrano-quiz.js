/* =========================================================
   TyranoMath 게임 엔진 — "문제 + 고르기" 게임을 쉽게 만드는 도구
   사용법 (게임 HTML 안에서):
     TyranoQuiz.start({
       title:'게임 이름', emoji:'🎮', intro:'설명',
       time:60,                 // 제한 시간(초)
       goal:20,                 // (선택) 이 점수에 도달하면 성공!
       levels:[{label:'쉬움', value:1}, ...],
       make(level){ return { q:'문제 HTML', answer:'정답키', choices:[{key:'정답키', html:'보기'}, ...] }; }
     });
   ========================================================= */
(function(){
'use strict';
const DINO = `<svg viewBox="0 0 220 200" aria-hidden="true">
<path d="M58 142 Q18 142 6 106 Q30 126 62 118 Z" fill="#4CB963"/>
<path d="M86 88 L80 68 L98 82 Z M71 98 L60 80 L81 92 Z M59 112 L44 98 L67 106 Z M108 34 L110 14 L126 28 Z M128 28 L136 9 L146 26 Z" fill="#FF9F43"/>
<rect x="68" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><rect x="106" y="156" width="25" height="32" rx="11" fill="#3A9D51"/>
<ellipse cx="96" cy="128" rx="47" ry="44" fill="#5CC46F"/><ellipse cx="108" cy="134" rx="26" ry="32" fill="#E8F7C8"/>
<rect x="92" y="26" width="112" height="80" rx="38" fill="#5CC46F"/>
<circle cx="150" cy="56" r="15" fill="#fff" stroke="#2E6B3A" stroke-width="2"/><circle cx="154" cy="58" r="8.5" fill="#22314A"/><circle cx="157.5" cy="54" r="3" fill="#fff"/>
<ellipse cx="174" cy="76" rx="10" ry="5.5" fill="#FF8FA3" opacity=".65"/>
<path d="M140 84 Q166 104 194 82" stroke="#2E6B3A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M136 118 q16 -4 20 8 q-3 5 -9 2 q-4 -4 -11 -1 Z" fill="#3A9D51"/></svg>`;

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

function start(cfg){
  const C = Object.assign({ time: 60, levels: [{ label: '시작', value: 1 }], emoji: '🦖', cheers: ['정답! 크앙~', '최고예요! 🦖', '냠냠, 맛있어요!', '대단해요! 👏'] }, cfg);
  document.title = C.title + ' · TyranoMath';
  if (C.accent) document.documentElement.style.setProperty('--accent', C.accent);
  if (C.bg) { document.documentElement.style.setProperty('--bg1', C.bg[0]); document.documentElement.style.setProperty('--bg2', C.bg[1]); }

  document.body.innerHTML = `
    <div class="tq-top">
      <a class="tq-back" id="tqBack" href="../gamezone.html" hidden>← 게임존</a>
      <span class="tq-pill">⏱ <b id="tqTime">${C.time}</b>초</span>
      ${C.goal ? `<div class="tq-progress" title="${C.goalText || '목표'}"><i id="tqBar"></i></div>` : '<span class="sp"></span>'}
      <span class="tq-pill">${C.scoreIcon || '⭐'} <b id="tqScore">0</b>${C.goal ? ' / ' + C.goal : '점'}</span>
    </div>
    <div class="tq-stage">
      <div class="tq-qrow"><div class="tq-dino" id="tqDino">${DINO}</div><div class="tq-q" id="tqQ"></div></div>
      <div class="tq-choices" id="tqChoices"></div>
      <div class="tq-msg" id="tqMsg"></div>
    </div>
    <div class="tq-overlay" id="tqStart">
      <div class="emoji">${C.emoji}</div>
      <h1>${C.title}</h1>
      <p>${C.intro || ''}</p>
      <div class="tq-levels" id="tqLevels">${C.levels.map((l, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${l.label}</button>`).join('')}</div>
      <button class="tq-btn" id="tqGo">시작하기</button>
    </div>
    <div class="tq-overlay" id="tqEnd" hidden>
      <div class="emoji" id="tqEndEmoji">🦖</div>
      <h1 id="tqEndTitle"></h1>
      <p id="tqEndText"></p>
      <p id="tqBest"></p>
      <button class="tq-btn" id="tqAgain">다시 하기</button>
    </div>`;

  const $ = s => document.querySelector(s);
  if (window.top === window) $('#tqBack').hidden = false;   // 따로 열렸을 때만 '게임존' 링크 표시

  let levelIdx = 0, score = 0, time = C.time, timer = null, cur = null, busy = false, tries = 0;

  function next(){
    cur = C.make(C.levels[levelIdx].value);
    $('#tqQ').innerHTML = cur.q;
    const ch = cur.choices;
    $('#tqChoices').style.setProperty('--n', ch.length);
    $('#tqChoices').innerHTML = ch.map(c => `<button type="button" class="tq-choice ${c.cls || ''}" data-k="${String(c.key).replace(/"/g, '&quot;')}">${c.html}</button>`).join('');
    busy = false;
  }
  function choose(btn){
    if (busy || !timer) return;
    busy = true; tries++;
    const dino = $('#tqDino'); dino.classList.remove('eat', 'no'); void dino.offsetWidth;
    const right = btn.dataset.k === String(cur.answer);
    if (right){
      score++; $('#tqScore').textContent = score;
      if (C.goal) $('#tqBar').style.width = Math.min(100, score / C.goal * 100) + '%';
      btn.classList.add('ok'); dino.classList.add('eat');
      $('#tqMsg').textContent = pick(C.cheers);
      if (C.goal && score >= C.goal){ setTimeout(() => end(true), 600); return; }
      setTimeout(next, 650);
    } else {
      btn.classList.add('bad'); dino.classList.add('no');
      const okBtn = [...document.querySelectorAll('.tq-choice')].find(b => b.dataset.k === String(cur.answer));
      okBtn && okBtn.classList.add('ok');
      $('#tqMsg').textContent = cur.explain ? '앗! ' + cur.explain : '앗, 아쉬워요! 초록색이 정답이에요.';
      setTimeout(next, cur.explain ? 1900 : 1300);
    }
  }
  $('#tqChoices').addEventListener('click', e => { const b = e.target.closest('.tq-choice'); if (b) choose(b); });

  function begin(){
    score = 0; tries = 0; time = C.time;
    $('#tqScore').textContent = 0; $('#tqTime').textContent = time;
    if (C.goal) $('#tqBar').style.width = '0%';
    $('#tqStart').hidden = true; $('#tqEnd').hidden = true;
    $('#tqMsg').textContent = C.startMsg || '정답을 골라 보세요!';
    clearInterval(timer);
    timer = setInterval(() => { time--; $('#tqTime').textContent = time; if (time <= 0) end(false); }, 1000);
    next();
  }
  function end(win){
    clearInterval(timer); timer = null;
    let best = score;
    const key = 'tq-best-' + C.title + '-' + levelIdx;
    try { const old = Number(localStorage.getItem(key) || 0); if (score > old) localStorage.setItem(key, score); best = Math.max(old, score); } catch(e){}
    if (win){
      $('#tqEndEmoji').textContent = C.winEmoji || '🎉';
      $('#tqEndTitle').textContent = C.winTitle || '성공!';
      $('#tqEndText').textContent = `${C.time - time}초 만에 ${score}문제를 맞혔어요!`;
    } else {
      $('#tqEndEmoji').textContent = C.goal ? '⏰' : '🦖';
      $('#tqEndTitle').textContent = C.goal ? '시간이 다 됐어요!' : (C.endTitle || '크앙~ 잘했어요!');
      $('#tqEndText').textContent = `${tries}문제 중 ${score}문제를 맞혔어요.` + (C.goal ? ' 다시 도전해 볼까요?' : '');
    }
    $('#tqBest').textContent = `🏆 최고 기록: ${best}문제`;
    $('#tqEnd').hidden = false;
  }
  $('#tqLevels').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    levelIdx = Number(b.dataset.i);
    document.querySelectorAll('#tqLevels button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  });
  $('#tqGo').addEventListener('click', begin);
  $('#tqAgain').addEventListener('click', () => { $('#tqEnd').hidden = true; $('#tqStart').hidden = false; });
  // 테스트·디버그용
  window.__tq = { get answer(){ return cur && cur.answer; } };
}

window.TyranoQuiz = { start, rnd, shuffle, pick, numChoices };
})();
