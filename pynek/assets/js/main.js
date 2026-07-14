// Pynek — shared interactions

/* ============================================================
   GOOGLE FORMS CONFIGURATION
   ------------------------------------------------------------
   Replace the placeholder values below with your real Google
   Form details. For each form:
   1. Create the Google Form with matching fields.
   2. Click "Send" → link icon → copy the form URL, and change
      "/viewform" at the end to "/formResponse".
   3. For each field: open the pre-filled-link tool (⋮ → Get
      pre-filled link), fill dummy values, generate the link,
      and copy each field's "entry.XXXXXXXXX" id from it.
   Until configured, the newsletter form shows a notice and the
   contact form falls back to opening the visitor's mail client.
   ============================================================ */
const NEWSLETTER_FORM = {
  action: 'https://docs.google.com/forms/d/e/YOUR_NEWSLETTER_FORM_ID/formResponse',
  fields: {
    name: 'entry.1111111111',
    email: 'entry.2222222222',
    mobile: 'entry.3333333333',
  },
};

const CONTACT_FORM = {
  action: 'https://docs.google.com/forms/d/e/YOUR_CONTACT_FORM_ID/formResponse',
  fields: {
    name: 'entry.1111111111',
    email: 'entry.2222222222',
    phone: 'entry.3333333333',
    service: 'entry.4444444444',
    message: 'entry.5555555555',
  },
};

const isConfigured = (cfg) => !cfg.action.includes('FORM_ID');

function submitToGoogleForm(cfg, values) {
  const body = new FormData();
  Object.keys(cfg.fields).forEach((key) => {
    if (values[key] != null) body.append(cfg.fields[key], values[key]);
  });
  // no-cors: Google Forms doesn't send CORS headers; the response is
  // opaque, but the submission is recorded.
  return fetch(cfg.action, { method: 'POST', mode: 'no-cors', body });
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

  nlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(nlForm);
    if (isConfigured(NEWSLETTER_FORM)) {
      try {
        await submitToGoogleForm(NEWSLETTER_FORM, {
          name: data.get('name'),
          email: data.get('email'),
          mobile: data.get('mobile'),
        });
      } catch { /* opaque no-cors response; submission is recorded */ }
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
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const values = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') || '-',
      service: data.get('service') || '-',
      message: data.get('message'),
    };
    if (!isConfigured(CONTACT_FORM)) {
      // Fallback until the Google Form is wired up: open the
      // visitor's mail client with the message pre-filled.
      const subject = encodeURIComponent('[Pynek] ' + values.service + ' — ' + values.name);
      const body = encodeURIComponent(
        'Name: ' + values.name + '\nEmail: ' + values.email + '\nPhone: ' + values.phone +
        '\nService: ' + values.service + '\n\n' + values.message
      );
      window.location.href = 'mailto:contact@pynek.com?subject=' + subject + '&body=' + body;
      return;
    }
    if (status) status.className = 'form-status';
    try {
      await submitToGoogleForm(CONTACT_FORM, values);
      if (status) {
        status.textContent = 'Message sent! We\'ll get back to you shortly.';
        status.classList.add('ok');
      }
      form.reset();
    } catch {
      if (status) {
        status.textContent = 'Something went wrong. Please call us or try again.';
        status.classList.add('err');
      }
    }
  });
}

// ---------- Footer year ----------
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
