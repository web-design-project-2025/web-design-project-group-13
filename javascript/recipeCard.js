// recipeCard.js
export function createRecipeCard(recipe, options = {}) {
  const { showPopularBadge = false } = options;

  // Validate the recipe ID
  if (!recipe.id) {
    console.error("Recipe ID is missing or invalid:", recipe);
    return ""; // Skip rendering this card if the ID is missing
  }

  const displayTime =
    recipe.time >= 60
      ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60}m`
      : `${recipe.time}m`;

  return `
    <div class="recipe-card" 
         onclick="window.location.href='chosenrecipe.html?id=${recipe.id}'"
         data-id="${recipe.id}" 
         data-time="${recipe.time}" 
         data-rating="${recipe.rating}"
         data-title="${recipe.title.toLowerCase()}">
      <img src="${recipe.image}" alt="${recipe.title}" 
           class="recipe-image"
           loading="lazy"
           width="250"
           height="188">
           <div class="heart-icon">
          <i class="fas fa-heart"></i>
        </div>
      <div class="recipe-info">
        <h3 class="recipe-title">
          ${recipe.title}
          ${showPopularBadge ? '<span class="popular-badge">Popular</span>' : ''}
        </h3>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-meta">
          <span>⏱ ${displayTime}</span>
          <span>⭐ ${recipe.rating}</span>
        </div>
      </div>
    </div>
  `;
}