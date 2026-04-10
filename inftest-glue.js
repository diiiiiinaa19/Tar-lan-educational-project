// inftest-glue.js — вызывает startQuiz for Informatics based on ?type param
(function(){
  function mapType(t){
    t = String(t || '').toLowerCase();
    if(t === 'theory') return 'informatics_theory';
    if(t === 'practice') return 'informatics_practice';
    return 'informatics_mixed';
  }

  function getParamType(){
    try { const p = new URLSearchParams(location.search); return p.get('type') || 'mixed'; } catch(e){ return 'mixed'; }
  }

  function setIntro(type){
    const el = document.getElementById('testIntro');
    if(el) el.textContent = 'Subject: Informatics — ' + (type.charAt(0).toUpperCase()+type.slice(1));
  }

  function doStart(attempts){
    const type = getParamType();
    const cat = mapType(type);
    setIntro(type);
    // wait for startQuiz to be defined by inftest.js (bank/engine)
    if(typeof window.startQuiz === 'function'){
      window.selectedCategoryGlobal = cat;
      window.startQuiz(cat);
      return;
    }
    if(attempts > 0) setTimeout(()=>doStart(attempts-1), 120);
    else {
      const r = document.getElementById('quizResult');
      if(r) r.innerHTML = '<div class="alert alert-warning">Quiz engine not loaded (startQuiz not found).</div>';
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>doStart(40));
})();
