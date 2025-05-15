document.addEventListener("DOMContentLoaded", () => {
  const ingredientToggle = document.getElementById("ingredients-toggle");
  const stepToggle = document.getElementById("steps-toggle");

  const sections = document.querySelectorAll(".recipe-section");
  const ingredientSection = sections[0];
  const stepSection = sections[1];

  if (innerWidth <= 768) {
    ingredientToggle.addEventListener("click", () => {
      ingredientSection.classList.toggle("hidden");
    });

    stepToggle.addEventListener("click", () => {
      stepSection.classList.toggle("hidden");
    });
  }
});
