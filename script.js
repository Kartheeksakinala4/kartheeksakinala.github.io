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

// -----------------------------
// Contact form -> Google Sheets
// -----------------------------

// IMPORTANT: paste your Google Apps Script Web App URL below:
const SCRIPT_URL = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec";

(function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = document.getElementById('sendBtn');
  const statusEl = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!SCRIPT_URL || SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYMENT_ID')){
      statusEl.textContent = 'Setup required: Add your Google Apps Script URL in script.js (SCRIPT_URL).';
      return;
    }

    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    statusEl.textContent = '';

    // Use FormData (no custom headers) to avoid CORS preflight
    const fd = new FormData();
    fd.append('name', document.getElementById('name')?.value.trim() || '');
    fd.append('email', document.getElementById('email')?.value.trim() || '');
    fd.append('phone', document.getElementById('phone')?.value.trim() || '');
    fd.append('message', document.getElementById('message')?.value.trim() || '');
    fd.append('honey', document.getElementById('company')?.value.trim() || '');
    fd.append('page', window.location.href);
    fd.append('ua', navigator.userAgent);

    try {
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
      let ok = res.ok;
      let data = {};
      try { data = await res.json(); } catch(e){ /* ignore parse errors */ }

      if (ok && (data.status === undefined || data.status === 'success' || data.status === 'ok')){
        form.reset();
        statusEl.textContent = "Thanks! I'll get back to you within 1 business day.";
      } else {
        throw new Error((data && data.message) || 'Submission failed');
      }
    } catch (err){
      statusEl.textContent = 'Sorry—something went wrong. Please email me at hello@kartheeksakinala.me.';
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
})();
