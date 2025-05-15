document.addEventListener("recipeContentLoaded", () => {
  console.log("Running recipetoggle.js");

  const ingredientToggle = document.getElementById("ingredients-toggle");
  const stepToggle = document.getElementById("steps-toggle");

  const sections = document.querySelectorAll(".recipe-section");
  const ingredientSection = sections[0];
  const stepSection = sections[1];

  if (window.innerWidth <= 768) {
    if (ingredientToggle && ingredientSection) {
      ingredientToggle.addEventListener("click", () => {
        ingredientSection.classList.toggle("hidden");
      });
    }

    if (stepToggle && stepSection) {
      stepToggle.addEventListener("click", () => {
        stepSection.classList.toggle("hidden");
      });
    }
  }
});
