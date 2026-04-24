/* ============================================================
   NAV — scroll class + mobile burger
============================================================ */
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   FADE-UP — IntersectionObserver
============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;

    // Stagger siblings within the same parent grid
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
    const idx = siblings.indexOf(entry.target);
    const delay = (idx % 6) * 80;

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));
