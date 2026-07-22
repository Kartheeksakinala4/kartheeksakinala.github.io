// Pynek — shared interactions

/* ============================================================
   API CONFIGURATION (cPanel backend)
   ------------------------------------------------------------
   1. Upload the /server folder to your hosting (see server/README.md)
      and set the two endpoint URLs below.
   2. Register a reCAPTCHA v3 site at google.com/recaptcha/admin and put
      the SITE key below (the SECRET key goes only in server/config.php).
   Until configured, forms show their success state but nothing is
   stored (the contact form falls back to opening the mail client).
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
  const map = {
    network: 'Could not reach the server — the request was blocked or the API is unreachable.',
    captcha_missing: 'Security check did not load. Please refresh the page and try again.',
    captcha_failed: 'Security check failed. Please refresh the page and try again.',
    invalid_input: 'Please check the details you entered and try again.',
    server_error: 'The server could not save your details (database error).',
    http_403: 'The server refused the request (403).',
    http_404: 'The API was not found on the server (404).',
  };
  return (map[code] || 'Something went wrong. Please try again in a moment.') + ' [' + code + ']';
}

// ---------- Mobile nav toggle ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ---------- Dropdown menus ----------
const mobileNav = window.matchMedia('(max-width: 940px)');
document.querySelectorAll('.has-dropdown > a').forEach((parent) => {
  parent.addEventListener('click', (e) => {
    const li = parent.parentElement;
    if (mobileNav.matches) {
      // On mobile the parent row expands the sub-list; the "All …"
      // link inside the dropdown navigates to the page itself.
      e.preventDefault();
      const wasOpen = li.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach((o) => o.classList.remove('open'));
      if (!wasOpen) li.classList.add('open');
    }
    // On desktop hover/focus opens the dropdown and a click follows the link.
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-links')) {
    document.querySelectorAll('.has-dropdown.open').forEach((o) => o.classList.remove('open'));
  }
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

// ---------- Newsletter modal ----------
const nlModal = document.getElementById('newsletter-modal');
if (nlModal) {
  const openBtns = document.querySelectorAll('[data-open-newsletter]');
  const closeBtn = nlModal.querySelector('.modal-close');
  const nlForm = document.getElementById('newsletter-form');
  const nlThanks = document.getElementById('newsletter-thanks');
  const nlIntro = nlModal.querySelector('.modal > p');
  const nlTitle = document.getElementById('nl-title');

  const resetModal = () => {
    nlForm.hidden = false;
    if (nlIntro) nlIntro.hidden = false;
    if (nlTitle) nlTitle.hidden = false;
    if (nlThanks) nlThanks.hidden = true;
    nlForm.reset();
  };
  const openModal = () => {
    resetModal();
    nlModal.hidden = false;
    document.body.style.overflow = 'hidden';
    const first = nlModal.querySelector('input');
    if (first) first.focus();
  };
  const closeModal = () => {
    nlModal.hidden = true;
    document.body.style.overflow = '';
  };

  openBtns.forEach((b) => b.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  nlModal.querySelectorAll('[data-close-newsletter]').forEach((b) => b.addEventListener('click', closeModal));
  nlModal.addEventListener('click', (e) => { if (e.target === nlModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !nlModal.hidden) closeModal(); });

  const nlStatus = document.getElementById('newsletter-status');
  const nlButton = nlForm.querySelector('button[type=submit]');

  nlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(nlForm);
    if (nlStatus) nlStatus.className = 'form-status';
    if (apiConfigured(API.subscribe)) {
      try {
        if (nlButton) { nlButton.disabled = true; nlButton.textContent = 'Subscribing…'; }
        await postForm(API.subscribe, {
          name: data.get('name'),
          email: data.get('email'),
          mobile: data.get('mobile'),
          captcha_token: await captchaToken('subscribe'),
        });
      } catch (err) {
        if (nlStatus) {
          nlStatus.textContent = formErrorMessage(err);
          nlStatus.classList.add('err');
        }
        if (nlButton) { nlButton.disabled = false; nlButton.textContent = 'Subscribe'; }
        return;
      }
      if (nlButton) { nlButton.disabled = false; nlButton.textContent = 'Subscribe'; }
    }
    // swap the form for the thank-you panel
    nlForm.hidden = true;
    if (nlIntro) nlIntro.hidden = true;
    if (nlTitle) nlTitle.hidden = true;
    if (nlThanks) nlThanks.hidden = false;
  });
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
      phone: data.get('phone') || '',
      service: data.get('service') || '',
      message: data.get('message'),
    };
    if (!apiConfigured(API.contact)) {
      // Fallback until the backend is configured: open the visitor's
      // mail client with the message pre-filled.
      const subject = encodeURIComponent('[Pynek] ' + (values.service || 'General enquiry') + ' — ' + values.name);
      const body = encodeURIComponent(
        'Name: ' + values.name + '\nEmail: ' + values.email + '\nPhone: ' + (values.phone || '-') +
        '\nService: ' + (values.service || '-') + '\n\n' + values.message
      );
      window.location.href = 'mailto:contact@pynek.com?subject=' + subject + '&body=' + body;
      return;
    }
    if (status) status.className = 'form-status';
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
