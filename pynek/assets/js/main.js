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
          ctx.strokeStyle = 'rgba(125, 190, 232, ' + ((1 - d / LINK) * 0.2).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(150, 208, 242, 0.5)';
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
