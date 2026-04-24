/* ============================================================
   NAV — scroll class + mobile burger
============================================================ */
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   FADE-UP — IntersectionObserver
============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
      const idx = siblings.indexOf(entry.target);
      const delay = (idx % 6) * 90;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => observer.observe(el));
} else {
  // Fallback: show everything immediately if IntersectionObserver unavailable
  fadeEls.forEach(el => el.classList.add('visible'));
}
