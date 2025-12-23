document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------
     MOBILE MENU
  --------------------------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {

  // -------- SERVICE CARD FLIP --------
  document.querySelectorAll(".service-card").forEach(card => {
  const learnMore = card.querySelector(".learn-more");
  const goToPage = card.querySelector(".go-to-page");
  const link = card.getAttribute("data-link");

  if (learnMore) {
    learnMore.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.add("flipped");
    });
  }

  if (goToPage && link) {
    goToPage.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = link;
    });
  }
});
