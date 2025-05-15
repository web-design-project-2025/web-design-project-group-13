export function populateSplitSection(recipesData) {
  try {
    if (!recipesData?.featured?.length) {
      console.warn('No featured recipes data found');
      return;
    }

    const splitSection = document.querySelector(".split-section");
    if (!splitSection) {
      console.log("No split-section element found in DOM");
      return;
    } else if (splitSection) {
        console.log("Split-section element found in DOM");
    }

    const imageHalf = splitSection.querySelector(".image-half");
    const colorHalf = splitSection.querySelector(".color-half");
    if (!imageHalf || !colorHalf) return;

    // Helper function to format time
    const formatTime = (minutes) => {
      return minutes >= 60 
        ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
        : `${minutes}m`;
    };

    // Make entire section clickable
    splitSection.style.cursor = 'pointer';
    splitSection.addEventListener('click', () => {
      const currentRecipeId = recipesData.featured[currentIndex];
      window.location.href = `chosenrecipe.html?id=${currentRecipeId}`;
    });

    let currentIndex = 0;
    const displayDuration = 10000;
    const transitionDuration = 1000;

    const showRecipe = (index) => {
      const recipeId = recipesData.featured[index];
      const recipe = recipesData.recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      splitSection.style.opacity = '0';

      setTimeout(() => {
        const imagePath = recipe.image.startsWith('images/') ? 
                         recipe.image : 
                         `images/${recipe.image}`;
        imageHalf.innerHTML = `<img src="${imagePath}" alt="${recipe.title}" loading="lazy">
        `
        ;

        colorHalf.innerHTML = `
          <div class="text-content">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <div class="recipe-meta" id="split-recipe-meta">
              <span>⏱ ${formatTime(recipe.time)}</span>
              <span>⭐ ${recipe.rating}</span>
            </div>
          </div>
        `;

        splitSection.style.opacity = '1';
      }, transitionDuration);
    };

    showRecipe(currentIndex);

    const rotateRecipes = () => {
      currentIndex = (currentIndex + 1) % recipesData.featured.length;
      showRecipe(currentIndex);
    };

    const rotationInterval = setInterval(rotateRecipes, displayDuration);

    return () => clearInterval(rotationInterval);

  } catch (error) {
    console.error("Error in recipe rotation:", error);
  }
}