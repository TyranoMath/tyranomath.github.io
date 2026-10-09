/* TyranoMath 퍼즐존 공통 도우미: 티라노 그림, '← 퍼즐존' 버튼, 저장 */
(function(){
  const DINO = `<svg viewBox="0 0 220 200" aria-hidden="true"><path d="M58 142 Q18 142 6 106 Q30 126 62 118 Z" fill="#4CB963"/><path d="M86 88 L80 68 L98 82 Z M71 98 L60 80 L81 92 Z M59 112 L44 98 L67 106 Z M108 34 L110 14 L126 28 Z M128 28 L136 9 L146 26 Z" fill="#FF9F43"/><rect x="68" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><rect x="106" y="156" width="25" height="32" rx="11" fill="#3A9D51"/><ellipse cx="96" cy="128" rx="47" ry="44" fill="#5CC46F"/><ellipse cx="108" cy="134" rx="26" ry="32" fill="#E8F7C8"/><rect x="92" y="26" width="112" height="80" rx="38" fill="#5CC46F"/><circle cx="150" cy="56" r="15" fill="#fff" stroke="#2E6B3A" stroke-width="2"/><circle cx="154" cy="58" r="8.5" fill="#22314A"/><circle cx="157.5" cy="54" r="3" fill="#fff"/><ellipse cx="174" cy="76" rx="10" ry="5.5" fill="#FF8FA3" opacity=".65"/><path d="M140 84 Q166 104 194 82" stroke="#2E6B3A" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M136 118 q16 -4 20 8 q-3 5 -9 2 q-4 -4 -11 -1 Z" fill="#3A9D51"/></svg>`;
  document.querySelectorAll('.dino-logo').forEach(el => {
    el.innerHTML = el.classList.contains('big') ? DINO.replace('<svg', '<svg class="big-dino"') : DINO;
  });
  // TyranoMath 퍼즐존 창 안에서 열리면 숨기고, 따로 열렸을 때만 보여요
  const back = document.getElementById('back');
  if (back && window.top === window) back.hidden = false;
  window.TM = {
    DINO,
    store: {
      get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
      set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
    },
    fmt: s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
  };
})();
