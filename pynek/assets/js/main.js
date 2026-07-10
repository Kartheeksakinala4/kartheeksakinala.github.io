// Pynek — shared interactions

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Scroll-reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// Animated counters
const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => cio.observe(el));
}

// Contact form → opens the visitor's mail client with the message pre-filled
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('[Pynek] ' + (data.get('service') || 'General enquiry') + ' — ' + (data.get('name') || ''));
    const body = encodeURIComponent(
      'Name: ' + data.get('name') + '\n' +
      'Email: ' + data.get('email') + '\n' +
      'Phone: ' + (data.get('phone') || '-') + '\n' +
      'Service: ' + (data.get('service') || '-') + '\n\n' +
      data.get('message')
    );
    window.location.href = 'mailto:info@pynek.com?subject=' + subject + '&body=' + body;
  });
}

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
