/* script.js — главный скрипт проекта
   Содержит:
   - UI glue для index.html (scroll, i18n, test type buttons)
   - Auth modal + dropdown
   - Profile renderer (renderUserProgressChart) — использует Chart.js if present
   - Небольшие утилиты
*/

/* ====== УТИЛИТЫ ====== */
function $$(sel, ctx){ return (ctx||document).querySelectorAll(sel); }
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function nowISO(){ return (new Date()).toISOString(); }
function safeParse(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){ return []; } }
function _esc(s){ return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

/* ====== NAV / HERO / SCROLL ====== */
const nav = document.getElementById('nav');
const onScroll = () => { if(nav) nav.classList.toggle('scrolled', window.scrollY > 10); };
document.addEventListener('scroll', onScroll, { passive:true });
onScroll();

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior:'smooth' });
    }
  });
});

/* ====== Theme toggle with localStorage ====== */
(function setupThemeToggle(){
  const root = document.documentElement;
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  const THEME_KEY = 'tar_lan_theme';
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const stored = readTheme();
  let manualChoice = !!stored;
  const initialTheme = stored || (media && media.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if(btn){
    btn.addEventListener('click', ()=>{
      const current = root.dataset.theme === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      manualChoice = true;
      try { localStorage.setItem(THEME_KEY, next); } catch(e){}
      applyTheme(next);
    });
  }

  if(media){
    const mediaHandler = (e)=>{
      if(manualChoice) return;
      applyTheme(e.matches ? 'dark' : 'light');
    };
    if(typeof media.addEventListener === 'function') media.addEventListener('change', mediaHandler);
    else if(typeof media.addListener === 'function') media.addListener(mediaHandler);
  }

  function readTheme(){
    try {
      return localStorage.getItem(THEME_KEY);
    } catch(e){
      return null;
    }
  }

  function applyTheme(theme){
    if(!theme) return;
    root.dataset.theme = theme;
    if(body) body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    if(btn) updateButton(theme);
  }

  function updateButton(theme){
    const isDark = theme === 'dark';
    const icon = isDark ? '🌙' : '☀️';
    const label = isDark ? 'Dark mode' : 'Light mode';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    btn.innerHTML = `<span class="theme-toggle__icon" aria-hidden="true">${icon}</span><span class="theme-toggle__text">${label}</span>`;
  }
})();

/* ====== Mobile hamburger for custom .nav ====== */
(function setupHamburger(){
  const toggles = document.querySelectorAll('.nav-toggle');
  if(!toggles.length) return;

  function anyMenuOpen(){ return document.querySelector('.nav-links.open'); }

  toggles.forEach(toggle => {
    const controls = toggle.getAttribute('aria-controls');
    const nav = toggle.closest('.nav') || document.body;
    const links = controls ? document.getElementById(controls) : nav.querySelector('.nav-links');
    if(!links) return;

    let backdrop;
    let prevFocus = null;
    let trapHandler = null;

    function ensureBackdrop(){
      if(backdrop) return;
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', closeMenu);
    }

    function getFocusable(){
      const sel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
      return Array.from(links.querySelectorAll(sel)).filter(el => {
        const style = getComputedStyle(el);
        return style.visibility !== 'hidden' && style.display !== 'none';
      });
    }

    function openMenu(){
      document.dispatchEvent(new CustomEvent('nav:close-all', { detail:{ except: links } }));
      ensureBackdrop();
      prevFocus = document.activeElement;
      links.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      backdrop.classList.add('show');
      document.body.classList.add('menu-open');

      const focusables = getFocusable();
      (focusables[0] || links).focus({ preventScroll:true });

      trapHandler = (e)=>{
        if(e.key === 'Tab'){
          const els = getFocusable();
          if(!els.length){ e.preventDefault(); return; }
          const first = els[0], last = els[els.length-1];
          if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', trapHandler);
    }

    function closeMenu(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      if(backdrop) backdrop.classList.remove('show');
      if(!anyMenuOpen()) document.body.classList.remove('menu-open');
      if(trapHandler){ document.removeEventListener('keydown', trapHandler); trapHandler = null; }
      if(prevFocus && typeof prevFocus.focus === 'function'){ prevFocus.focus({ preventScroll:true }); }
    }

    toggle.addEventListener('click', ()=>{
      (links.classList.contains('open') ? closeMenu : openMenu)();
    });
    links.querySelectorAll('a, button').forEach(el => el.addEventListener('click', closeMenu));
    window.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', ()=>{ if(window.innerWidth > 820) closeMenu(); });
    document.addEventListener('nav:close-all', e=>{ if(e.detail?.except !== links) closeMenu(); });
  });
})();

/* ====== START TESTS button on index ====== */
document.getElementById('start-tests')?.addEventListener('click', ()=>{
  document.getElementById('tests')?.scrollIntoView({ behavior:'smooth' });
});

/* ====== i18n strings + language switch ====== */
const i18nStrings = {
  ru:{ kicker:'Социально-образовательный проект', subtitle:'Диагностические тесты по математике и английскому языку. Пройдите короткие задания и получите мгновенный фидбэк с подсказками.', btn:'Пройти тест' },
  kk:{ kicker:'Әлеуметтік-білім беру жобасы', subtitle:'Математика және ағылшыннан диагностикалық тесттер. Қысқа тапсырмалардан кейін бірден фидбэк пен ұсыныстар аласыз.', btn:'Тесттен өту' },
  en:{ kicker:'Social-education project', subtitle:'Diagnostic tests in Math & English. Short tasks, instant feedback, and personal tips to progress.', btn:'Start test' },
};
const langButtons = document.querySelectorAll('.lang button');
const elKicker = document.querySelector('.kicker');
const elSubtitle = document.querySelector('.subtitle');
const elBtn = document.getElementById('start-tests');
langButtons.forEach(b => b.addEventListener('click', ()=>{
  langButtons.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const s = i18nStrings[b.dataset.lang];
  if(!s) return;
  if(elKicker) elKicker.textContent = s.kicker;
  if(elSubtitle) elSubtitle.textContent = s.subtitle;
  if(elBtn) elBtn.textContent = s.btn;
}));

/* ====== test-types UI on index: toggles and updates link query param ====== */
document.querySelectorAll('.card').forEach(card=>{
  const typeBtns = card.querySelectorAll('.test-type');
  const startLink = card.querySelector('.start-link');
  if(!startLink) return;
  const subject = (card.dataset.subject || '').toLowerCase();
  typeBtns.forEach(b => b.addEventListener('click', ()=>{
    typeBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const t = b.dataset.type || 'mixed';
    try {
      const href = new URL(startLink.href, location.href);
      if(subject === 'english') href.searchParams.set('level', t);
      else href.searchParams.set('type', t);
      startLink.href = href.toString();
    } catch(e){
      const base = startLink.href.split('?')[0];
      const qp = subject === 'english' ? 'level' : 'type';
      startLink.href = base + '?' + qp + '=' + encodeURIComponent(t);
    }
  }));
});

/* ====== AUTH: modal + dropdown (simple localStorage based) ====== */
const Auth = {
  key: 'authUser',
  get(){ try{ return JSON.parse(localStorage.getItem(this.key) || 'null'); }catch{ return null; } },
  set(u){ localStorage.setItem(this.key, JSON.stringify(u)); window.dispatchEvent(new Event('storage')); },
  clear(){ localStorage.removeItem(this.key); window.dispatchEvent(new Event('storage')); }
};

let overlay, modal;
function buildAuthModal(){
  if(overlay && modal) return;
  overlay = document.createElement('div'); overlay.className = 'auth-overlay';
  overlay.addEventListener('click', closeAuthModal);
  modal = document.createElement('div'); modal.className = 'auth-modal';
  document.body.append(overlay, modal);
}
function openAuthModal(mode='login'){
  buildAuthModal();
  renderAuth(mode);
  overlay.classList.add('show'); modal.classList.add('show');
}
function closeAuthModal(){ overlay?.classList.remove('show'); modal?.classList.remove('show'); }

function renderAuth(mode){
  const isLogin = mode === 'login';
  modal.innerHTML = `
    <h3>${isLogin ? 'Войти' : 'Зарегистрироваться'}</h3>
    <form id="auth-form">
      ${isLogin ? '' : `<label>Имя<input type="text" name="name" placeholder="Ваше имя" required/></label>`}
      <label>Email<input type="email" name="email" placeholder="you@example.com" required/></label>
      <label>Пароль<input type="password" name="password" placeholder="••••••••" required/></label>
      ${isLogin ? '' : `<label>Повторите пароль<input type="password" name="password2" placeholder="••••••••" required/></label>`}
      <div class="row" style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
        <button type="button" class="btn btn-ghost" id="auth-cancel">Отмена</button>
        <button type="submit" class="btn btn-primary">${isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </div>
      <div class="auth-switch" style="margin-top:8px;">
        ${isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
        <button type="button" id="auth-switch" style="background:none; border:0; color:#bfdbfe; font-weight:700; cursor:pointer;">${isLogin ? 'Зарегистрироваться' : 'Войти'}</button>
      </div>
    </form>
  `;
  modal.querySelector('#auth-cancel').onclick = closeAuthModal;
  modal.querySelector('#auth-switch').onclick = ()=> renderAuth(isLogin ? 'register' : 'login');

  modal.querySelector('#auth-form').onsubmit = (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get('email') || '').trim().toLowerCase();
    const password = String(fd.get('password') || '');
    if(!email || !password) return;
    if(isLogin){
      // For demo: accept any email/password and save name as part before @
      const name = email.split('@')[0] || 'User';
      Auth.set({ name, email });
      closeAuthModal();
      alert('Вы вошли.');
      // update UI by firing storage event
      window.dispatchEvent(new Event('storage'));
    } else {
      const password2 = String(fd.get('password2') || '');
      const name = String(fd.get('name') || '').trim() || email.split('@')[0] || 'User';
      if(password !== password2){ alert('Пароли не совпадают'); return; }
      // store in 'users' (simple demo)
      const users = safeParse('users');
      if(users.some(u => u.email === email)){ alert('Этот email уже зарегистрирован'); return; }
      users.push({ name, email });
      localStorage.setItem('users', JSON.stringify(users));
      Auth.set({ name, email });
      closeAuthModal();
      alert('Регистрация успешна.');
      window.dispatchEvent(new Event('storage'));
    }
  };
}

/* setup login dropdown (small menu attached to .login element) */
(function setupLoginDropdown(){
  const loginIcon = document.querySelector('.login');
  if(!loginIcon) return;
  loginIcon.removeAttribute('title');
  loginIcon.setAttribute('aria-label','Аутентификация');
  loginIcon.style.position = 'relative';

  let menu = document.createElement('div');
  menu.className = 'auth-menu';
  menu.innerHTML = `<button type="button" data-act="login">Войти</button><button type="button" data-act="register">Зарегистрироваться</button>`;
  loginIcon.appendChild(menu);

  loginIcon.addEventListener('click', (e)=>{ e.stopPropagation(); menu.classList.toggle('open'); });
  menu.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const act = btn.dataset.act;
    if(act === 'login') openAuthModal('login');
    if(act === 'register') openAuthModal('register');
    menu.classList.remove('open');
  });
  document.addEventListener('click', ()=> menu.classList.remove('open'));
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') menu.classList.remove('open'); });
})();

/* ====== renderUserProgressChart (profile renderer) ======
   Accepts opts: { progressCanvasId, topicCanvasId, attemptsCountId, bestId, lastId, tableBodyId, subject }
   subject optional: 'all' | 'informatics' | 'english' | 'math'
   This function reads both quiz_history_v1 and edu_history and unifies.
*/
function renderUserProgressChart(opts){
  opts = opts || {};
  const progressId = opts.progressCanvasId || 'progressLineChart';
  const topicId = opts.topicCanvasId || 'topicBarChart';
  const attemptsId = opts.attemptsCountId || 'profileAttempts';
  const bestId = opts.bestId || 'profileBest';
  const lastId = opts.lastId || 'profileLast';
  const tableBodyId = opts.tableBodyId || 'historyTableBody';
  const subjectFilter = (opts.subject || 'all').toLowerCase(); // 'all' or prefix

  // load stored arrays
  let dataNew = safeParse('quiz_history_v1');
  let dataOld = safeParse('edu_history');

  // unify
  const unified = [];
  dataNew.forEach(r=>{
    unified.push({
      ts: r.ts || r.timestamp || nowISO(),
      user: r.user || (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
      category: r.category || 'undef',
      score: r.score || '',
      percent: (r.percent == null) ? null : Number(r.percent),
      topicBreakdown: r.topicBreakdown || {}
    });
  });
  dataOld.forEach(r=>{
    unified.push({
      ts: r.ts || r.timestamp || nowISO(),
      user: r.user || (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
      category: r.category || 'undef',
      score: r.score || '',
      percent: (r.percent == null) ? null : Number(r.percent),
      topicBreakdown: r.topicBreakdown || {}
    });
  });

  // optionally filter by subject prefix
  const filtered = unified.filter(u=>{
    if(subjectFilter === 'all') return true;
    try {
      // categories look like 'informatics_theory' or 'english_mixed'
      return String(u.category || '').toLowerCase().startsWith(subjectFilter);
    } catch(e){ return true; }
  });

  // sort ascending
  filtered.sort((a,b)=> new Date(a.ts) - new Date(b.ts));

  // summary
  const attemptsEl = document.getElementById(attemptsId);
  const bestEl = document.getElementById(bestId);
  const lastEl = document.getElementById(lastId);
  if(attemptsEl) attemptsEl.textContent = filtered.length;
  if(filtered.length === 0){
    if(bestEl) bestEl.textContent = '—';
    if(lastEl) lastEl.textContent = '—';
  } else {
    const pvals = filtered.map(x=> (x.percent == null ? 0 : Number(x.percent)));
    const best = Math.max(...pvals);
    if(bestEl) bestEl.textContent = best + '%';
    if(lastEl) lastEl.textContent = new Date(filtered[filtered.length-1].ts).toLocaleString();
  }

  // progress line (Chart.js required)
  try {
    const labels = filtered.map(r => new Date(r.ts).toLocaleString());
    const scores = filtered.map(r => r.percent == null ? 0 : Number(r.percent));
    if(window._profileProgressChart) try{ window._profileProgressChart.destroy(); }catch(e){}
    if(document.getElementById(progressId) && typeof Chart !== 'undefined'){
      const ctx = document.getElementById(progressId).getContext('2d');
      window._profileProgressChart = new Chart(ctx, {
        type:'line',
        data:{ labels, datasets:[{ label:'Score (%)', data: scores, tension:0.25, fill:false, pointRadius:4 }] },
        options:{ responsive:true, scales:{ y:{ suggestedMin:0, suggestedMax:100 } } }
      });
    }
  } catch(e){ console.warn('progress chart failed', e); }

  // topic averages
  try {
    const agg = {};
    filtered.forEach(r=>{
      const tb = r.topicBreakdown || {};
      Object.keys(tb).forEach(t=>{
        const rec = agg[t] || { sum:0, n:0 };
        const pct = (tb[t].total && tb[t].correct) ? Math.round( (tb[t].correct / tb[t].total) * 100 ) : 0;
        rec.sum += pct; rec.n++; agg[t] = rec;
      });
    });
    const labels = Object.keys(agg);
    const values = labels.map(k => Math.round(agg[k].sum / Math.max(1, agg[k].n)));
    if(window._profileTopicChart) try{ window._profileTopicChart.destroy(); }catch(e){}
    if(document.getElementById(topicId) && typeof Chart !== 'undefined'){
      const ctx2 = document.getElementById(topicId).getContext('2d');
      window._profileTopicChart = new Chart(ctx2, {
        type:'bar',
        data:{ labels, datasets:[{ label:'Average % by topic', data: values, borderWidth:1 }] },
        options:{ responsive:true, scales:{ y:{ suggestedMin:0, suggestedMax:100 } } }
      });
    }
  } catch(e){ console.warn('topic chart failed', e); }

  // fill table
  try {
    const tbody = document.getElementById(tableBodyId);
    if(tbody){
      const rows = filtered.slice().reverse().map((r,i)=>{
        const idx = filtered.length - i;
        const when = new Date(r.ts).toLocaleString();
        const pct = (r.percent == null ? '—' : r.percent + '%');
        return `<tr><td>${idx}</td><td>${_esc(r.user)}</td><td>${_esc(r.category)}</td><td>${_esc(r.score||'')}</td><td>${_esc(pct)}</td><td>${_esc(when)}</td></tr>`;
      }).join('');
      tbody.innerHTML = rows || '<tr><td colspan="6" class="text-muted">No attempts yet</td></tr>';
    }
  } catch(e){ console.warn('fill table failed', e); }
} // renderUserProgressChart

// export to global
window.renderUserProgressChart = renderUserProgressChart;

/* ====== helper to open profile with subject switcher (optional) ======
   If profile.html wants per-subject charts, it can create small nav and call:
   window.renderUserProgressChart({ subject: 'informatics' })
*/

/* ====== Misc: put current year in #y / #year placeholders ====== */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('#y, #year').forEach(el => el.textContent = new Date().getFullYear());
});
