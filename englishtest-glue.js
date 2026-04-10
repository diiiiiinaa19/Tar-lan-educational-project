(function(){
  function mapType(t){
    t = String(t || '').toLowerCase();
    if(t === 'theory') return 'english_theory';
    if(t === 'practice') return 'english_practice';
    return 'english_mixed';
  }
  function getParamType(){ try { const p = new URLSearchParams(location.search); return p.get('type') || 'mixed'; } catch(e){ return 'mixed'; } }
  function doStart(attempts){
    const t = getParamType(); const cat = mapType(t);
    if(typeof window.startQuiz === 'function'){ window.selectedCategoryGlobal = cat; window.startQuiz(cat); return; }
    if(attempts>0) setTimeout(()=>doStart(attempts-1), 120);
    else document.getElementById('quizResult').innerHTML = '<div class="alert alert-warning">Quiz engine not loaded.</div>';
  }
  document.addEventListener('DOMContentLoaded', ()=>doStart(40));
})();
