// split-section.js
export function populateSplitSection(recipesData) {
  console.log("Received data:", recipesData); // Debug log

//   const displayTime =
//     recipe.time >= 60
//       ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60}m`
//       : `${recipe.time}m`;

  try {
    // 1. Check if split-section array exists
    if (!recipesData || !recipesData["split-section"]) {
      console.warn("No split-section data found in recipes", recipesData);
      return;
    }

    // 2. Get the first ID from split-section array
    const splitRecipeId = recipesData["split-section"][0];
    console.log("Looking for recipe ID:", splitRecipeId); // Debug log

    if (!splitRecipeId) {
      console.warn("No recipe ID found in split-section array");
      return;
    }

    // 3. Find the matching recipe
    const splitRecipe = recipesData.recipes.find(
      (recipe) => recipe.id === splitRecipeId
    );
    console.log("Found recipe:", splitRecipe); // Debug log

    if (!splitRecipe) {
      console.warn(`No recipe found with ID ${splitRecipeId}`);
      return;
    }

    // 4. Get DOM elements
    const splitSection = document.querySelector(".split-section");
    if (!splitSection) {
      console.warn("No split-section element found in DOM");
      return;
    }

    // 5. Update image half - ensure image path is correct
    const imageHalf = splitSection.querySelector(".image-half");
    if (imageHalf) {
      const imagePath = splitRecipe.image.startsWith("images/")
        ? splitRecipe.image
        : `images/${splitRecipe.image}`;
      imageHalf.innerHTML = `<img src="${imagePath}" alt="${splitRecipe.title}" loading="lazy">`;
    }

    // 6. Update content half
    const colorHalf = splitSection.querySelector(".color-half");
    if (colorHalf) {
      colorHalf.innerHTML = `
        <div class="text-content">
          <h3>${splitRecipe.title}</h3>
          <p>${splitRecipe.description}</p>
          <span>⏱ ${splitRecipe.displayTime}</span>
          <span>⭐ ${splitRecipe.rating}</span>
        </div>
      `;

      // Add click handler
      colorHalf
        .querySelector(".view-recipe-btn")
        ?.addEventListener("click", () => {
          window.location.href = `recipe.html?id=${splitRecipe.id}`;
        });
    }
  } catch (error) {
    console.error("Error populating split section:", error);
  }
}
