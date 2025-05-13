// javascript/main.js

// scroll to top button
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    });

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
 
// go back button 
document.addEventListener("DOMContentLoaded", () => {
  const goBackBtn = document.getElementById("goBackBtn");

  if (goBackBtn) {
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollTop > 400) { 
        goBackBtn.style.display = "none";
      } else {
        goBackBtn.style.display = "block";
      }
    });
  }
});