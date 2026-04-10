(function(){
  function getAuth(){
    try {
      const raw = localStorage.getItem('authUser') || localStorage.getItem('edu_current');
      return raw ? JSON.parse(raw) : null;
    } catch(e){
      return null;
    }
  }
  function ensureProfileLink(){
    const navs = document.querySelectorAll('#navLinks, .nav-links, #navLinksSmall, #mainNav, .navbar-nav');
    navs.forEach(nav => {
      if(!nav) return;
      if(nav.querySelector('[href="profile.html"], [href*="profile.html"]')) return;
      if(nav.querySelector('.nav-profile-link')) return;
      const a = document.createElement('a');
      a.className = 'nav-profile-link' + (nav.tagName.toLowerCase()==='ul' ? ' nav-link' : '');
      a.href = 'profile.html';
      a.textContent = 'Profile';
      a.style.marginLeft = '8px';
      if(nav.tagName.toLowerCase()==='ul'){
        const li = document.createElement('li'); li.className='nav-item'; li.appendChild(a); nav.appendChild(li);
      } else {
        nav.appendChild(a);
      }
    });
  }
  function removeProfileLink(){ document.querySelectorAll('.nav-profile-link').forEach(n=>n.remove()); }
  function updateUI(){
    const u = getAuth();
    if(u){ document.body.classList.add('auth'); ensureProfileLink(); }
    else { document.body.classList.remove('auth'); removeProfileLink(); }
  }
  window.addEventListener('storage', updateUI);
  document.addEventListener('DOMContentLoaded', updateUI);
})();