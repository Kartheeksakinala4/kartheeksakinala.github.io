/* ================= NAVBAR MOBILE ================= */

const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("active");
  });
}

/* ================= SERVICES SCROLL ================= */

function scrollServices(direction) {
  const container = document.getElementById("servicesWrapper");
  if (!container) return;

  const scrollAmount = 300;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}

/* ================= ABOUT COUNTER (FORCE FIX) ================= */


document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  let started = false;

  function startCounters() {
    if (started) return;
    started = true;

    counters.forEach(counter => {
      const target = Number(counter.getAttribute("data-target"));
      const suffix = counter.getAttribute("data-suffix") || "";
      let current = 0;

      const step = Math.max(1, Math.floor(target / 80));

      function update() {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
        } else {
          counter.textContent = current;
          requestAnimationFrame(update);
        }
      }

      update();
    });
  }

  // Run when visible OR after load (failsafe)
  setTimeout(startCounters, 500);
  window.addEventListener("scroll", startCounters);
});


function openLocationModal() {
  document.getElementById("locationModal").classList.add("active");
}

function closeLocationModal() {
  document.getElementById("locationModal").classList.remove("active");
}
