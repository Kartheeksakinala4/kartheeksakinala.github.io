/* ==========================================================
   MOBILE NAVIGATION MENU
========================================================== */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}


/* ==========================================================
   ROTATING HERO TEXT
========================================================== */
const rotatingItems = document.querySelectorAll(".rotating-text span");
let rotateIndex = 0;

function rotateHeroText() {
  rotatingItems.forEach(i => i.classList.remove("show"));
  rotatingItems[rotateIndex].classList.add("show");
  rotateIndex = (rotateIndex + 1) % rotatingItems.length;
}

if (rotatingItems.length > 0) {
  rotateHeroText();
  setInterval(rotateHeroText, 2000);
}


/* ==========================================================
   CONTACT TAB SWITCHING
========================================================== */
const contactTabs = document.querySelectorAll(".contact-options div");
const contactPanels = document.querySelectorAll(".contact-panel");

if (contactTabs.length > 0) {
  contactTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      contactTabs.forEach(t => t.classList.remove("active"));
      contactPanels.forEach(p => p.style.display = "none");

      tab.classList.add("active");
      contactPanels[idx].style.display = "block";
    });
  });

  // default state
  contactPanels.forEach((p, i) => {
    p.style.display = i === 0 ? "block" : "none";
  });
}


/* ==========================================================
   SERVICE PAGE — CAROUSEL AUTO ROTATION
========================================================== */
document.querySelectorAll(".carousel").forEach(carousel => {
  const slides = carousel.querySelectorAll("img");
  if (slides.length === 0) return;

  let index = 0;
  slides[0].classList.add("active");

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000);
});


/* ==========================================================
   FADE-UP ANIMATIONS (IntersectionObserver)
========================================================== */
const faders = document.querySelectorAll(".fade-up");

const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -40px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(el => appearOnScroll.observe(el));


/* ==========================================================
   OPTIONAL (If service tabs are added later)
========================================================== */
// const serviceTabs = document.querySelectorAll(".service-tab");
// const serviceSections = document.querySelectorAll(".service-section");

// if (serviceTabs.length > 0) {
//   serviceTabs.forEach(tab => {
//     tab.addEventListener("click", () => {
//       serviceTabs.forEach(t => t.classList.remove("active"));
//       serviceSections.forEach(s => s.style.display = "none");

//       tab.classList.add("active");
//       document.getElementById(tab.dataset.target).style.display = "block";
//     });
//   });

//   // default
//   serviceSections.forEach((s, i) => {
//     s.style.display = i === 0 ? "block" : "none";
//   });
// }
/* ==========================================================
   SERVICE TABS → SMOOTH SCROLL TO SECTIONS
========================================================== */
const svcTabs = document.querySelectorAll(".service-tab");

svcTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    // Activate tab UI change
    svcTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Smooth scroll to section
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ==========================================================
   SERVICE PAGE — FILTER TABS (SHOW/HIDE)
========================================================== */

/* SERVICE FILTER TABS */
const tabs = document.querySelectorAll(".service-tab");
const sections = document.querySelectorAll(".service-category");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    const selected = tab.dataset.filter;

    // Switch active tab
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Show only matching category
    sections.forEach(sec => {
      if (sec.dataset.category === selected) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });

    // Scroll to top of services content
    window.scrollTo({ top: 200, behavior: "smooth" });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  if (!service) return;

  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".service-content");

  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.service === service);
  });

  contents.forEach(content => {
    content.classList.toggle("active", content.id === service);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".service-content");

  function activateService(id) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.service === id));
    contents.forEach(c => c.classList.toggle("active", c.id === id));
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      activateService(tab.dataset.service);
    });
  });

  if (service) activateService(service);
});


/* ==========================================================
   END OF FINAL OPTIMIZED JS
========================================================== */
