document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("mobileMenu");
  
    hamburger.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  });
  