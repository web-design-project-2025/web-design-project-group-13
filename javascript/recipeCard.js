export function createRecipeCard(recipe, options = {}) {
  const { showPopularBadge = false } = options;

  return `
        <div class="recipe-card" data-id="${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.title}" 
                 class="recipe-image"
                 loading="lazy"
                 width="250"
                 height="188">
            <div class="recipe-info">
                <h3 class="recipe-title">
                    ${recipe.title}
                    ${
                      showPopularBadge
                        ? '<span class="popular-badge">Popular</span>'
                        : ""
                    }
                </h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <span>⏱ ${recipe.time} min</span>
                    <span>⭐ ${recipe.rating}</span>
                </div>
            </div>
        </div>
    `;
}
