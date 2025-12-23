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

  /* ---------------------------
     SERVICE CARD FLIP + NAV
  --------------------------- */
  document.querySelectorAll(".service-card").forEach(card => {
    const learnMore = card.querySelector(".learn-more");
    const goToPage = card.querySelector(".go-to-page");
    const link = card.dataset.link;

    // Flip when card is clicked (except buttons)
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      card.classList.add("flipped");
    });

    // Flip on Learn More
    if (learnMore) {
      learnMore.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const isMobile = window.innerWidth <= 900;

  if (isMobile && link) {
    window.location.href = link;
  } else {
    card.classList.add("flipped");
  }
});

    // Navigate on Go to Page
    if (goToPage && link) {
      goToPage.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = link;
      });
    }
  });

});
