document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", function () {
    menu.classList.toggle("open");
  });

  // This script handles the logo resizing based on screen width
  // const logo = document.getElementById("logo");

  // function updateLogo() {
  //   if (window.innerWidth <= 768) {
  //     logo.src = "/images/logoPhone.svg"; // Use SVG for smaller screens
  //   } else {
  //     logo.src = "/images/LettuceCookLogo.png"; // Use PNG for larger screens
  //   }
  // }

  // // Initial check
  // updateLogo();

  // // Update logo on window resize
  // window.addEventListener("resize", updateLogo);
});

// This script handles the logo click event to redirect to the index page
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "index.html";
});
