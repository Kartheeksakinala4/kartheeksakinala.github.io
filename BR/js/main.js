function flipCard(card){
  card.classList.toggle("flipped");
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  // Toggle menu
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  // Close menu on any nav link click
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
});

