document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", function () {
    menu.classList.toggle("open");
  });

  // Close the menu when clicking outside of it
  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
      menu.classList.remove("open");
    }
  });
});

// This script handles the logo click event to redirect to the index page
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logo").addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
  