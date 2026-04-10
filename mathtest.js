// mathtest.js — Math quiz with types: mixed / geometry / algebra.
document.addEventListener("DOMContentLoaded", () => {
  const quizMount = document.getElementById("quizMount");
  const quizForm = document.getElementById("quizForm");
  const quizResult = document.getElementById("quizResult");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const selectedTypeSpan = document.querySelector('#selectedType span');

  // Small helpers
  function shuffle(a){ const r=a.slice(); for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]] } return r; }
  function _esc(s){ return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

  // Bank of questions (MCQ). Each has a type: geometry or algebra. 'mixed' draws from both.
  const allQuestions = [
    // GEOMETRY
    {
      q: "Which angles are corresponding angles?",
      img: "geometry_test2.png",
      options: [
        "$\\angle A ,\\ \\angle E$  \\\\ $\\angle C ,\\ \\angle F$  \\\\ $\\angle B ,\\ \\angle G$  \\\\ $\\angle D ,\\ \\angle H$",
        "$\\angle A ,\\ \\angle G$  \\\\ $\\angle C ,\\ \\angle E$  \\\\ $\\angle B ,\\ \\angle H$  \\\\ $\\angle D ,\\ \\angle F$",
        "$\\angle A ,\\ \\angle E$  \\\\ $\\angle C ,\\ \\angle G$  \\\\ $\\angle B ,\\ \\angle F$  \\\\ $\\angle D ,\\ \\angle H$",
        "$\\angle A ,\\ \\angle F$  \\\\ $\\angle C ,\\ \\angle H$  \\\\ $\\angle B ,\\ \\angle E$  \\\\ $\\angle D ,\\ \\angle G$"
      ],
      answer: 3,
      type: "geometry"
    },
    { q: "Sum of interior angles in a triangle", options:["$90^{\\circ}$","$180^{\\circ}$","$270^{\\circ}$","$360^{\\circ}$"], answer: 1, type:"geometry" },
    { q: "Area of a circle with radius $r$", options:["$2\\pi r$","$\\pi r^2$","$\\pi d$","$r^2$"], answer: 1, type:"geometry" },
    { q: "Length of diagonal of a square with side $a$", options:["$a$","$a\\sqrt{2}$","$2a$","$a^2$"], answer: 1, type:"geometry" },
    { q: "Volume of a sphere with radius $r$", options:["$\\tfrac{4}{3}\\pi r^3$","$2\\pi r$","$\\pi r^2$","$4\\pi r$"], answer: 0, type:"geometry" },
    { q: "Pythagorean theorem", options:["$a^2+b^2=c^2$","$a^2=b^2+c^2$","$a=b+c$","$a+b=c$"], answer: 0, type:"geometry" },
    { q: "Circumference of a circle", options:["$\\pi r^2$","$2\\pi r$","$\\pi d^2$","$r^2\\pi$"], answer: 1, type:"geometry" },
    { q: "Area of a triangle with base $b$ and height $h$", options:["$bh$","$\\tfrac{1}{2}bh$","$b+h$","$\\tfrac{b}{2h}$"], answer: 1, type:"geometry" },
    { q: "Number of diagonals in a hexagon", options:["$6$","$8$","$9$","$12$"], answer: 2, type:"geometry" },
    { q: "Sum of interior angles in an $n$-gon", options:["$n\\cdot180^{\\circ}$","$(n-2)\\cdot180^{\\circ}$","$(n+2)\\cdot180^{\\circ}$","$(n/2)\\cdot180^{\\circ}$"], answer: 1, type:"geometry" },
    { q: "Exterior angle of a regular pentagon", options:["$60^{\\circ}$","$72^{\\circ}$","$90^{\\circ}$","$108^{\\circ}$"], answer: 1, type:"geometry" },

    // ALGEBRA
    { q: "Simplify: $(x^2)(x^3)$", options:["$x^5$","$x^6$","$x^9$","$x^{12}$"], answer: 0, type:"algebra" },
    { q: "Derivative of $x^3$", options:["$x^2$","$2x$","$3x^2$","$3x$"], answer: 2, type:"algebra" },
    { q: "Solve for $x$: $3x + 6 = 12$", options:["$x=1$","$x=2$","$x=3$","$x=4$"], answer: 1, type:"algebra" },
    { q: "Evaluate $\\int x\\,dx$", options:["$x^2$","$\\tfrac{x^2}{2}+C$","$2x+C$","$\\ln x$"], answer: 1, type:"algebra" },
    { q: "If $a^2=9$, find $a$", options:["$3$","$-3$","$\\pm3$","$0$"], answer: 2, type:"algebra" },
    { q: "Solve for $x$: $e^{x}=5$", options:["$x=5$","$x=\\ln 5$","$x=5\\ln e$","$x=1/5$"], answer: 1, type:"algebra" },
    { q: "Compute \\( i^{15} \\)", options:["$i$","$-1$","$-i$","$1$"], answer: 2, type:"algebra" },
    { q: "Solve: $x^2 - 9 = 0$", options:["$x=9$","$x=3$","$x=\\pm3$","$x=-3$"], answer: 2, type:"algebra" },
    { q: "Simplify: $\\frac{2x}{4x}$", options:["$1$","$\\tfrac{1}{2}$","$2$","$x$"], answer: 1, type:"algebra" },
    { q: "Find roots of $x^2 + 4x + 4 = 0$", options:["$x=-4$","$x=-2$","$x=2$","$x=0$"], answer: 1, type:"algebra" },
    { q: "Derivative of $\\sin x$", options:["$\\cos x$","$-\\cos x$","$-\\sin x$","$\\tan x$"], answer: 0, type:"algebra" },
    { q: "Value of $\\log_{10}(100)$", options:["$1$","$2$","$10$","$0$"], answer: 1, type:"algebra" }
  ];

  // Grade scale mapping percent -> fun feedback.
  const gradeScale = [
    { letter:'A', min:90, emoji:'🔥', headline:"You're a geometry master!", message:"Einstein would be proud of those proofs.", tip:"Keep challenging yourself with olympiad-level puzzles.", theme:'result-a' },
    { letter:'B', min:80, emoji:'👏', headline:"Solid work!", message:"A little more practice and you’ll crush it.", tip:"Revisit a few tricky algebra steps to push into A-range.", theme:'result-b' },
    { letter:'C', min:70, emoji:'😅', headline:"Not bad at all!", message:"Those integrals just need another look.", tip:"Review the topics you missed and run another mixed test.", theme:'result-c' },
    { letter:'D', min:60, emoji:'💪', headline:"You're close!", message:"Basics just need a quick refresh.", tip:"Focus on core formulas, then retry the quiz tomorrow.", theme:'result-d' },
    { letter:'F', min:0, emoji:'💀', headline:"Uh oh… time to regroup!", message:"Let’s dust off that math notebook.", tip:"Start with foundation exercises before retaking the quiz.", theme:'result-f' }
  ];

  // Returns the grade bucket for a given percent.
  function getGradeInfo(percent){
    return gradeScale.find(g => percent >= g.min) || gradeScale[gradeScale.length - 1];
  }

  // State
  let currentType = 'mixed';

  // UI setup for type buttons
  const btns = [
    document.getElementById('btnMixed'),
    document.getElementById('btnGeometry'),
    document.getElementById('btnAlgebra')
  ].filter(Boolean);

  function normalizeType(raw){
    if(raw === 'theory') return 'geometry';
    if(raw === 'practice') return 'algebra';
    return raw;
  }

  function setActiveTypeButton(t){
    const normalized = normalizeType(t);
    currentType = (normalized === 'geometry' || normalized === 'algebra') ? normalized : 'mixed';
    if(selectedTypeSpan){
      const label = currentType.charAt(0).toUpperCase() + currentType.slice(1);
      selectedTypeSpan.textContent = label;
    }
    btns.forEach(b=> b.classList.remove('active'));
    const map = { mixed:'btnMixed', geometry:'btnGeometry', algebra:'btnAlgebra' };
    const el = document.getElementById(map[currentType]); if(el) el.classList.add('active');
  }

  btns.forEach(b => b.addEventListener('click', ()=>{
    const t = b.dataset.type;
    setActiveTypeButton(t);
  }));

  // Render one question
  function renderQuestion(q, i){
    const imgHtml = q.img
      ? `<div class="quiz-img mb-2"><img src="${_esc(q.img)}" alt="Diagram for question ${i+1}"></div>`
      : '';
    const opts = q.options.map((opt, idx)=>{
      return `<div class="form-check">
        <input class="form-check-input" type="radio" name="q${i}" id="q${i}_${idx}" value="${idx}">
        <label class="form-check-label" for="q${i}_${idx}">${_esc(opt)}</label>
      </div>`;
    }).join('');
    return `<div class="card quiz-card"><div class="card-body">
      <div class="fw-bold mb-2">Q${i+1}. ${_esc(q.q)}</div>
      ${imgHtml}
      ${opts}
    </div></div>`;
  }

  // Start test for given type
  function startTest(t){
    setActiveTypeButton(t || currentType);
    // filter
    const pool = (currentType === 'mixed') ? allQuestions : allQuestions.filter(q => q.type === currentType);
    const chosen = shuffle(pool).slice(0, Math.min(10, pool.length));
    quizForm._questions = chosen;
    quizMount.innerHTML = chosen.map((q,i)=> renderQuestion(q,i)).join('');
    quizForm.classList.remove('d-none');
    quizResult.innerHTML = '';
    restartBtn.classList.add('d-none');
    if(window.MathJax && typeof MathJax.typesetPromise === 'function'){
      MathJax.typesetPromise([quizMount]).catch(err => console.warn('MathJax render failed', err));
    }
    setTimeout(()=>{ const f = quizMount.querySelector('input'); if(f) f.focus(); }, 50);
  }

  if(startBtn) startBtn.addEventListener('click', ()=> startTest(currentType));
  if(restartBtn) restartBtn.addEventListener('click', ()=> startTest(currentType));

  // Submit handler
  quizForm.addEventListener('submit', function(e){
    e.preventDefault();
    const questions = quizForm._questions || [];
    let score = 0;
    const feedback = [];
    questions.forEach((q,i) => {
      const chosen = quizForm.querySelector(`input[name="q${i}"]:checked`);
      const val = chosen ? parseInt(chosen.value, 10) : null;
      const ok = val !== null && val === q.answer;
      if(ok) score++;
      feedback.push({ ok, i: i+1, chosen: val, correct: q.answer });
    });

    const percent = Math.round((score / Math.max(1, questions.length)) * 100);

    // Render feedback
    const gradeInfo = getGradeInfo(percent);
    // Build question-by-question review list.
    const detailList = feedback.map(f => {
      const qText = questions[f.i-1];
      const your = f.chosen==null ? 'no answer' : _esc(qText.options[f.chosen]);
      const correct = _esc(qText.options[f.correct]);
      const statusClass = f.ok ? 'is-correct' : 'is-wrong';
      const msg = f.ok ? 'Correct 🎯' : `Incorrect (your: ${your}; correct: ${correct})`;
      return `<li class="q-chip ${statusClass}">
        <div class="q-chip__label">Q${f.i}</div>
        <div class="q-chip__text">${msg}</div>
      </li>`;
    }).join('');

    // Animated result panel with emoji, grade copy, and recommendations.
    let fbHtml = `
      <div class="result-panel ${gradeInfo.theme}">
        <div class="grade-badge">
          <span class="grade-letter">${gradeInfo.letter}</span>
          <span class="grade-percent">${percent}% (${score}/${questions.length})</span>
        </div>
        <div class="grade-emoji" aria-hidden="true">${gradeInfo.emoji}</div>
        <p class="grade-headline">${gradeInfo.headline}</p>
        <p class="grade-message">${gradeInfo.message}</p>
        <p class="grade-advice"><strong>Pro tip:</strong> ${gradeInfo.tip}</p>
        <div class="result-details">
          <h4>Question review</h4>
          <ul>${detailList}</ul>
        </div>
        <div class="result-actions">
          <button id="nextTypeBtn" class="btn btn-primary btn-sm">Next type</button>
          <a class="btn btn-outline-secondary btn-sm" href="index.html">Back to Home</a>
        </div>
      </div>`;
    quizResult.innerHTML = fbHtml;
    if(window.MathJax && typeof MathJax.typesetPromise === 'function'){
      MathJax.typesetPromise([quizResult]).catch(err => console.warn('MathJax render failed', err));
    }

    // Save to local storage — category: math_<type>
    const entry = {
      ts: (new Date()).toISOString(),
      user: (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
      category: `math_${currentType}`,
      score: `${score}/${questions.length}`,
      percent: percent,
      topicBreakdown: {}
    };

    try {
      const key = 'quiz_history_v1';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(entry);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(e){ console.warn('save quiz_history_v1 failed', e); }

    try {
      const oldKey = 'edu_history';
      const arr2 = JSON.parse(localStorage.getItem(oldKey) || '[]');
      arr2.push({ timestamp: entry.ts, user: entry.user, category: entry.category, score: entry.score, percent: entry.percent });
      localStorage.setItem(oldKey, JSON.stringify(arr2));
    } catch(e){ console.warn('save edu_history failed', e); }

    // Show restart and wire next type
    restartBtn.classList.remove('d-none');
    const nextBtn = document.getElementById('nextTypeBtn');
    if(nextBtn){
      nextBtn.addEventListener('click', ()=>{
        const order = ['mixed','geometry','algebra'];
        const idx = order.indexOf(currentType);
        const next = order[(idx + 1) % order.length];
        setActiveTypeButton(next);
        startTest(next);
        quizResult.innerHTML = '';
      }, { once: true });
    }
  });

  // Handle URL param ?type= (mixed/geometry/algebra) and optional autostart=1
  const urlType = new URLSearchParams(location.search).get('type');
  if(urlType) setActiveTypeButton(urlType);
  // auto-start always, similar to inftest glue
  startTest(currentType);
});
