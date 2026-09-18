// Pynek — shared interactions

/* ============================================================
   API CONFIGURATION (cPanel backend)
   ------------------------------------------------------------
   The SECRET reCAPTCHA key lives only in server/config.php on the
   hosting account — never here, never in the repository.
   ============================================================ */
const API = {
  subscribe: 'https://pynek.com/api/subscribe.php',
  contact: 'https://pynek.com/api/contact.php',
};
const RECAPTCHA_SITE_KEY = '6Le8R1QtAAAAAD1VJu6AAfV7O2deX2md1y2SL3fJ';

const apiConfigured = (url) => !url.includes('YOUR-DOMAIN');
const captchaConfigured = () => !RECAPTCHA_SITE_KEY.startsWith('YOUR_');

// Lazily load the reCAPTCHA v3 script the first time a form is used.
let recaptchaLoader = null;
function recaptchaReady() {
  if (!captchaConfigured()) return Promise.resolve();
  if (!recaptchaLoader) {
    recaptchaLoader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js?render=' + RECAPTCHA_SITE_KEY;
      s.onload = () => grecaptcha.ready(resolve);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return recaptchaLoader;
}

async function captchaToken(action) {
  if (!captchaConfigured()) return '';
  await recaptchaReady();
  return grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
}

async function postForm(url, fields) {
  const body = new FormData();
  Object.keys(fields).forEach((k) => body.append(k, fields[k] == null ? '' : fields[k]));
  let res;
  try {
    res = await fetch(url, { method: 'POST', body });
  } catch {
    throw new Error('network');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || 'http_' + res.status);
  return data;
}

// Map an error code from postForm to a message that also identifies the
// cause, so failures can be diagnosed from the screen.
function formErrorMessage(err) {
  const code = (err && err.message) || 'unknown';
  if (code.startsWith('captcha_failed:')) {
    return 'Security check failed. Please refresh the page and try again. [' + code + ']';
  }
  if (code.startsWith('server_error:')) {
    const sqlstate = code.slice('server_error:'.length);
    const why = sqlstate === '42S22' ? 'a database column is missing'
      : sqlstate === '42S02' ? 'a database table is missing'
      : 'a database error occurred';
    return 'The server could not save your details — ' + why + '. [' + code + ']';
  }
  const map = {
    network: 'Could not reach the server — the request was blocked or the API is unreachable.',
    captcha_missing: 'Security check did not load. Please refresh the page and try again.',
    captcha_failed: 'Security check failed. Please refresh the page and try again.',
    invalid_input: 'Please check the details you entered and try again.',
    terms_required: 'Please accept the terms and conditions before sending.',
    server_error: 'The server could not save your details (database error).',
    http_403: 'The server refused the request (403).',
    http_404: 'The API was not found on the server (404).',
  };
  return (map[code] || 'Something went wrong. Please try again in a moment.') + ' [' + code + ']';
}

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ---------- Menus (mega + simple dropdown) ----------
const mobileNav = window.matchMedia('(max-width: 940px)');
document.querySelectorAll('.has-mega > a, .has-dropdown > a').forEach((parent) => {
  parent.addEventListener('click', (e) => {
    // On mobile the top-level row expands its panel instead of navigating;
    // the links inside go to the pages.
    if (!mobileNav.matches) return;
    e.preventDefault();
    const li = parent.parentElement;
    const wasOpen = li.classList.contains('open');
    document.querySelectorAll('.has-mega.open, .has-dropdown.open').forEach((o) => o.classList.remove('open'));
    if (!wasOpen) li.classList.add('open');
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-links')) {
    document.querySelectorAll('.has-mega.open, .has-dropdown.open').forEach((o) => o.classList.remove('open'));
  }
});

// ---------- Mega-menu category switching ----------
document.querySelectorAll('.mega').forEach((mega) => {
  const cats = mega.querySelectorAll('.mega-cat');
  const panels = mega.querySelectorAll('.mega-panel');
  const show = (key) => {
    cats.forEach((c) => c.classList.toggle('active', c.dataset.cat === key));
    panels.forEach((p) => p.classList.toggle('active', p.dataset.cat === key));
  };
  cats.forEach((cat) => {
    cat.addEventListener('mouseenter', () => show(cat.dataset.cat));
    cat.addEventListener('focus', () => show(cat.dataset.cat));
    cat.addEventListener('click', () => show(cat.dataset.cat));
  });
});

// ---------- Scroll-reveal ----------
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

// ---------- Animated counters ----------
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

// ---------- Contact form ----------
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('contact-status');
  const submitBtn = form.querySelector('button[type=submit]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const values = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      service: data.get('service'),
      message: data.get('message'),
      terms: data.get('terms') ? '1' : '',
    };
    if (status) { status.className = 'form-status'; status.textContent = ''; }

    if (!values.terms) {
      if (status) {
        status.textContent = 'Please accept the terms and conditions before sending.';
        status.classList.add('err');
      }
      return;
    }

    try {
      if (submitBtn) { submitBtn.disabled = true; }
      values.captcha_token = await captchaToken('contact');
      await postForm(API.contact, values);
      if (status) {
        status.textContent = 'Message sent! We\'ll get back to you shortly.';
        status.classList.add('ok');
      }
      form.reset();
    } catch (err) {
      if (status) {
        status.textContent = formErrorMessage(err);
        status.classList.add('err');
      }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; }
    }
  });
}

// ---------- Footer year ----------
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ---------- Hero node-network animation ----------
// Runs only on the home page, only when the canvas is on screen, and never
// when the visitor has asked for reduced motion.
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas && heroCanvas.getContext &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = heroCanvas.getContext('2d');
  const LINK = 138;
  let w = 0, h = 0, nodes = [], raf = null, running = false;

  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = heroCanvas.clientWidth;
    h = heroCanvas.clientHeight;
    heroCanvas.width = Math.round(w * dpr);
    heroCanvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const seed = () => {
    const count = Math.min(80, Math.max(24, Math.round((w * h) / 17000)));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.9,
      });
    }
  };

  const frame = () => {
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -24) n.x = w + 24; else if (n.x > w + 24) n.x = -24;
      if (n.y < -24) n.y = h + 24; else if (n.y > h + 24) n.y = -24;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(74, 168, 255, ' + ((1 - d / LINK) * 0.26).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(124, 194, 255, 0.55)';
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = null; };

  sizeCanvas();
  seed();
  start();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { sizeCanvas(); seed(); }, 200);
  });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 }
    ).observe(heroCanvas);
  }
}

// ---------- Hero slider ----------
(function () {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const slides = Array.from(track.children);
  const dots = Array.from(slider.querySelectorAll('.slider-dot'));
  const prev = slider.querySelector('[data-slider-prev]');
  const next = slider.querySelector('[data-slider-next]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DELAY = 7000;
  let index = 0;
  let timer = null;

  function render() {
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    slides.forEach(function (s, i) {
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      s.querySelectorAll('a, button').forEach(function (el) {
        if (i === index) { el.removeAttribute('tabindex'); }
        else { el.setAttribute('tabindex', '-1'); }
      });
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function go(i) { index = (i + slides.length) % slides.length; render(); }
  function start() { if (!reduced && !timer) { timer = setInterval(function () { go(index + 1); }, DELAY); } }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  if (next) next.addEventListener('click', function () { go(index + 1); restart(); });
  if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); restart(); }); });

  // Only the controls pause the carousel — hovering the slide itself must not,
  // or a pointer resting over the hero stops it advancing at all.
  const controls = slider.querySelector('.slider-nav');
  if (controls) {
    controls.addEventListener('mouseenter', stop);
    controls.addEventListener('mouseleave', start);
  }
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', function (e) {
    if (!slider.contains(e.relatedTarget)) start();
  });
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  // swipe
  let x0 = null;
  slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); }
    x0 = null;
    start();
  }, { passive: true });

  render();
  start();
})();

// ---------- Service tabs ----------
(function () {
  const tablist = document.querySelector('[data-tabs]');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('.tab-btn'));

  function select(tab) {
    tabs.forEach(function (t) {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      select(tabs[j]);
      tabs[j].focus();
    });
  });
})();
