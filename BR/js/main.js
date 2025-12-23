function flipCard(card){
  card.classList.toggle("flipped");
}
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    console.error("Menu toggle or nav not found");
    return;
  }

  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
});
