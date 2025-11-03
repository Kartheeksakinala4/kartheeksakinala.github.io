/* (same polished stylesheet as earlier) */
:root{
  --bg:#0A0F1C; --surface:#0F1730; --surface-2:#0B1228; --card:#111A36;
  --text:#ECF2FF; --muted:#A7B0C5; --border:rgba(255,255,255,.08);
  --accent:#4DA3FF; --accent-2:#6DE2E3;
  --radius:14px; --radius-lg:18px; --shadow:0 16px 40px rgba(0,0,0,.35);
  --space-1:8px; --space-2:12px; --space-3:16px; --space-4:20px; --space-5:28px;
  --space-6:40px; --space-7:56px; --space-8:84px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:Poppins,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
 background:linear-gradient(180deg,var(--bg),var(--surface));color:var(--text);line-height:1.65}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
h1{font-size:clamp(28px,4vw,40px);line-height:1.15;margin:.1em 0 .35em}
h2{font-size:clamp(22px,3vw,30px);line-height:1.2;margin:0 0 .6em}
h3{font-size:clamp(18px,2.6vw,22px);line-height:1.25;margin:.2em 0 .5em}
p{color:var(--muted)}
.container{max-width:1100px;margin:0 auto;padding:0 var(--space-3)}
.section{padding:var(--space-7) 0}
.section.alt{background:linear-gradient(180deg,var(--surface-2),var(--surface))}
.section-title{margin:0 0 var(--space-4)}
.grid-2{display:grid;grid-template-columns:1.1fr .9fr;gap:var(--space-5)}
.cards-3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3)}
.cards-4{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-3)}
@media (max-width:960px){.grid-2{grid-template-columns:1fr}.cards-3,.cards-4{grid-template-columns:1fr}}
.site-header{position:sticky;top:0;z-index:50;backdrop-filter:blur(10px);background:rgba(10,15,28,.55);border-bottom:1px solid var(--border)}
.nav-wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{display:flex;align-items:center;gap:10px;color:var(--text)}
.logo-chip{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#001428;font-weight:800}
.primary-nav{display:flex;align-items:center;gap:18px}
.primary-nav ul{list-style:none;display:flex;gap:14px;margin:0;padding:0}
.nav-toggle{display:none;background:none;border:0;color:var(--text);cursor:pointer}
.nav-toggle .bar{display:block;width:22px;height:2px;background:var(--text);margin:4px 0;border-radius:1px}
@media (max-width:899px){.nav-toggle{display:block}.primary-nav ul{display:none}}
.btn{display:inline-block;padding:12px 18px;border-radius:10px;border:1px solid var(--border);color:var(--text);background:transparent;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
.btn:hover{transform:translateY(-1px)}
.btn:focus-visible{outline:2px solid var(--accent-2);outline-offset:2px}
.btn-primary{background:var(--accent);border-color:transparent;color:#001428;font-weight:600}
.btn-primary:hover{box-shadow:0 10px 24px rgba(77,163,255,.35)}
.btn-ghost{border-color:var(--border)}
.btn-secondary{background:var(--card)}
.small{padding:10px 14px}
.hero{position:relative}
.hero .hero-sub{color:var(--muted);font-size:14px}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0 6px}
.hero-art{position:relative}
.cyber-grid{height:260px;border-radius:var(--radius-lg);background:radial-gradient(ellipse at 20% 20%,rgba(77,163,255,.35),transparent 60%),radial-gradient(ellipse at 80% 70%,rgba(109,226,227,.25),transparent 60%),linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid var(--border)}
.orb{position:absolute;right:8%;top:20%;width:240px;height:240px;border-radius:50%;filter:blur(26px);background:radial-gradient(circle,rgba(77,163,255,.35),rgba(109,226,227,.15),transparent 70%)}
@media (max-width:900px){.orb{display:none}}
.card,.case{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-4);box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 12px 24px rgba(0,0,0,.15);transition:transform .15s ease,box-shadow .2s ease,border-color .15s ease}
.card:hover,.case:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.14)}
.card-icon{font-size:24px;margin-bottom:8px}
.bullets{margin:0;padding-left:20px}
.bullets li{margin:6px 0}
.about-art{position:relative;display:grid;place-items:center}
.about-photo{width:220px;height:220px;object-fit:cover;border-radius:50%;border:3px solid var(--border)}
.ring{position:absolute;width:260px;height:260px;border-radius:50%;border:1px dashed var(--border)}
.chip{display:inline-block;padding:8px 12px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.04)}
.badge{position:absolute;bottom:-8px}
.contact-form{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--space-4)}
.contact-form .form-row{display:flex;flex-direction:column}
.contact-form label{font-weight:600;margin-bottom:6px}
.contact-form input,.contact-form select,.contact-form textarea{background:#0b142c;color:var(--text);border:1px solid var(--border);border-radius:10px;padding:12px;outline:none;transition:border-color .15s ease,box-shadow .15s ease}
.contact-form input:focus,.contact-form select:focus,.contact-form textarea:focus{border-color:rgba(109,226,227,.5);box-shadow:0 0 0 3px rgba(109,226,227,.15)}
.contact-form textarea{resize:vertical}
.contact-form .checkbox{grid-column:1/-1}
.form-actions{grid-column:1/-1;display:flex;gap:12px;align-items:center}
.form-status{margin-top:6px;color:var(--muted)}
@media (max-width:900px){.contact-form{grid-template-columns:1fr}}
.site-footer{border-top:1px solid var(--border)}
.footer-inner{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:22px 0;flex-wrap:wrap}
.footer-inner nav a{margin-right:10px}
.muted{color:var(--muted);font-size:14px}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .5s ease,transform .5s ease}
.reveal.is-visible{opacity:1;transform:none}
