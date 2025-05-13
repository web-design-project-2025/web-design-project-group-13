import { isFavorite } from "./favorites.js";

export function createRecipeCard(recipe, options = {}) {
  const { showPopularBadge = false } = options;

  if (!recipe.id) {
    console.error("Recipe ID is missing or invalid:", recipe);
    return "";
  }

  const displayTime =
    recipe.time >= 60
      ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60}m`
      : `${recipe.time}m`;

  const favorited = isFavorite(recipe.id);
  const heartClass = favorited ? "fas fa-heart active" : "fas fa-heart";
  const recipeJSON = encodeURIComponent(JSON.stringify(recipe));


  return `
    <div class="recipe-card" data-id="${recipe.id}">
      <img src="${recipe.image}" alt="${recipe.title}" 
           class="recipe-image"
           loading="lazy"
           width="250"
           height="188">

      <div class="heart-icon" data-heart data-recipe="${recipeJSON}">
        <i class="${heartClass}"></i>
      </div>

      <div class="recipe-info">
        <h3 class="recipe-title">
          ${recipe.title}
          ${showPopularBadge ? '<span class="popular-badge">Popular</span>' : ""}
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
