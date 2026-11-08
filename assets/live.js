/* =========================================================
   🌐 TyranoMath 온라인 실시간 대결 (Firebase 실시간 데이터베이스)
   - 서버 주소는 data.js 의 CONFIG.liveUrl 에 넣어요.
     예: 'https://tyranomath-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app'
   - 주소가 비어 있으면 온라인 대회 버튼이 "준비 중"으로 보여요.
   - 로그인 없이 '방 코드(숫자 4자리) + 닉네임'으로만 들어와요. 개인정보는 받지 않아요.
   - 설정 방법: google-sheet/온라인-대결-설정-방법.md
   ========================================================= */
(function () {
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } } };
  const SRC = document.currentScript && document.currentScript.src;
  let urlP = null;

  /* 서버 주소 찾기: (시험용) localStorage tm-live-url → data.js 의 liveUrl */
  function getUrl() {
    if (urlP) return urlP;
    urlP = (async () => {
      const over = ls.get('tm-live-url'); if (over) return over.replace(/\/+$/, '');
      try {
        const base = SRC ? new URL('../data.js', SRC).href : '../data.js';
        const txt = await (await fetch(base, { cache: 'no-cache' })).text();
        const m = txt.match(/liveUrl\s*:\s*['"]([^'"]*)['"]/);
        return m ? m[1].trim().replace(/\/+$/, '') : '';
      } catch (e) { return ''; }
    })();
    return urlP;
  }

  const err = (kind, msg) => Object.assign(new Error(msg || kind), { kind });
  async function req(method, path, body) {
    const u = await getUrl(); if (!u) throw err('nourl');
    let r;
    try { r = await fetch(`${u}/${path}.json`, { method, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' }); }
    catch (e) { throw err('net'); }
    if (r.status === 401 || r.status === 403) throw err('perm');
    if (!r.ok) throw err('http', 'HTTP ' + r.status);
    return r.json();
  }
  const get = p => req('GET', p);
  const put = (p, v) => req('PUT', p, v);
  const patch = (p, v) => req('PATCH', p, v);
  const del = p => req('DELETE', p);

  /* 경로의 값을 실시간으로 받아요. cb(값) 이 바뀔 때마다 불려요. 반환값: 끄기 함수 */
  function setAt(root, path, val, merge) {
    const keys = path.split('/').filter(Boolean);
    if (!keys.length) {
      if (merge && root && typeof root === 'object' && val && typeof val === 'object') { for (const k in val) { if (val[k] === null) delete root[k]; else root[k] = val[k]; } return root; }
      return val;
    }
    if (!root || typeof root !== 'object') root = {};
    let o = root;
    for (let i = 0; i < keys.length - 1; i++) { if (!o[keys[i]] || typeof o[keys[i]] !== 'object') o[keys[i]] = {}; o = o[keys[i]]; }
    const last = keys[keys.length - 1];
    if (merge) { const cur = (o[last] && typeof o[last] === 'object') ? o[last] : {}; for (const k in val) { if (val[k] === null) delete cur[k]; else cur[k] = val[k]; } o[last] = cur; }
    else if (val === null) delete o[last];
    else o[last] = val;
    return root;
  }
  function listen(path, cb, onState) {
    let es = null, data = null, closed = false, timer = null;
    const open = async () => {
      const u = await getUrl(); if (!u || closed) { onState && onState('nourl'); return; }
      es = new EventSource(`${u}/${path}.json`);
      const on = (ev, merge) => es.addEventListener(ev, e => {
        let m; try { m = JSON.parse(e.data); } catch (x) { return; }
        if (!m) return;
        data = setAt(data, m.path || '/', m.data, merge);
        onState && onState('ok');
        cb(data);
      });
      on('put', false); on('patch', true);
      es.addEventListener('cancel', () => { onState && onState('perm'); });
      es.onerror = () => { onState && onState('retry'); };   // EventSource 가 스스로 다시 연결해요
    };
    open();
    return () => { closed = true; clearTimeout(timer); if (es) es.close(); };
  }

  /* 빈 방 코드(숫자 4자리) 만들기 */
  async function newCode() {
    for (let i = 0; i < 12; i++) {
      const c = String(1000 + Math.floor(Math.random() * 9000));
      const v = await get('rooms/' + c);
      if (v == null || (v.created && Date.now() - v.created > 6 * 3600e3)) return c;   // 6시간 넘은 방은 다시 써요
    }
    throw err('busy');
  }
  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

  /* 같은 문제를 같은 순서로 내기 위한 씨앗 난수 */
  function seeded(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  function msg(e) {
    const k = e && e.kind;
    if (k === 'nourl') return '온라인 대회 서버가 아직 연결되지 않았어요. (선생님: data.js 의 liveUrl 을 확인해 주세요)';
    if (k === 'perm') return '온라인 대회 서버가 쓰기를 막고 있어요. (선생님: Firebase 규칙을 확인해 주세요)';
    if (k === 'net') return '인터넷 연결을 확인해 주세요. 온라인 대회 서버에 연결하지 못했어요.';
    if (k === 'busy') return '빈 방 코드를 찾지 못했어요. 잠시 뒤 다시 해 보세요.';
    return '온라인 대회 서버에 문제가 생겼어요. 잠시 뒤 다시 해 보세요.';
  }

  window.TMLive = { ready: getUrl, get, put, patch, del, listen, newCode, uid, seeded, msg };
})();
