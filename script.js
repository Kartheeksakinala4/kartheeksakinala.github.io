// Mobile nav toggle & smooth scroll
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');

if (toggle && nav){
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open');
  });
}

// Close nav when clicking a link (mobile)
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (getComputedStyle(document.querySelector('.nav-toggle')).display !== 'none'){
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
}));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});

// Add open styles for mobile nav
const style = document.createElement('style');
style.innerHTML = `
  @media (max-width: 899px){
    .primary-nav { position: fixed; top: 60px; right: 4%; left: 4%; display: none; flex-direction: column; gap: 12px; padding: 16px; background: linear-gradient(180deg, #13244A, #182B53); border:1px solid rgba(255,255,255,.08); border-radius:16px; box-shadow: 0 20px 40px rgba(0,0,0,.35); }
    .primary-nav.open { display: flex; }
    .primary-nav ul { flex-direction: column; gap: 8px; }
    .only-desktop { display: none !important; }
  }
`;
document.head.appendChild(style);
