// javascript/main.js

import { populateSplitSection } from "./split-section.js";

fetch("json/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    // const cleanup = populateSplitSection(data);
    //   cleanup();

    populateSplitSection(data);
  })
  .catch((error) => { 
    console.error("Error loading recipes:", error);
    document.getElementById("error-message").textContent =
      "Failed to load recipes.";
    document.getElementById("error-message").classList.remove("hidden");
  });

// scroll to top button
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
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
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollTop > 400) {
        goBackBtn.style.display = "none";
      } else {
        goBackBtn.style.display = "block";
      }
    });
  }
});
