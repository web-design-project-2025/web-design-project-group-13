document.addEventListener("recipeContentLoaded", () => {
  console.log("Running recipetoggle.js");

  const ingredientToggle = document.getElementById("ingredients-toggle");
  const stepToggle = document.getElementById("steps-toggle");

  const sections = document.querySelectorAll(".recipe-section");
  const ingredientSection = sections[0];
  const stepSection = sections[1];

  function showOnly(targetSection, hideSection) {
    targetSection.classList.remove("hidden");
    hideSection.classList.add("hidden");
  }

  if (window.innerWidth <= 768) {
    // Initially show ingredients, hide steps
    ingredientSection.classList.remove("hidden");
    stepSection.classList.add("hidden");

    if (ingredientToggle && stepToggle) {
      ingredientToggle.addEventListener("click", () => {
        showOnly(ingredientSection, stepSection);
      });

      stepToggle.addEventListener("click", () => {
        showOnly(stepSection, ingredientSection);
      });
    }
  } else {
    // On desktop/laptop: show both
    ingredientSection.classList.remove("hidden");
    stepSection.classList.remove("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const recipeImages = document.getElementById("similar-recipes");
  const images = recipeImages.querySelectorAll(".recipe-images img");
  const leftArrow = document.querySelector(".carousel .arrow.left");
  const rightArrow = document.querySelector(".carousel .arrow.right");

  const scrollAmount = recipeImages.offsetWidth * 0.6 + 40; // image width + gap

  window.addEventListener("load", () => {
    if (window.innerWidth <= 768 && images.length > 1) {
      requestAnimationFrame(() => {
        const secondImage = images[1];
        

        const containerCenter = recipeImages.offsetWidth / 2;
        const imageCenter =
          secondImage.offsetLeft + secondImage.offsetWidth / 2;

        const scrollPosition = imageCenter - containerCenter;

        recipeImages.scrollTo({
          left: scrollPosition,
          behavior: "auto",

          
        });
        console.log(images.length, images[1]);
      });
    }
  });

  if (leftArrow && rightArrow && recipeImages) {
    leftArrow.addEventListener("click", () => {
      recipeImages.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    rightArrow.addEventListener("click", () => {
      recipeImages.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  }
});
