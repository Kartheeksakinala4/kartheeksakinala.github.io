// Smooth scroll to footer contact
document.addEventListener("DOMContentLoaded", function() {
  const contactLinks = document.querySelectorAll(".contact-link");

  contactLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById("footer-contact").scrollIntoView({
        behavior: "smooth"
      });
    });
  });
});
