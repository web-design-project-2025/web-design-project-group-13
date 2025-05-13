//favoritespage.js

import { getFavorites } from './favorites.js';
import { createRecipeCard } from './recipeCard.js';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const favorites = getFavorites();

  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }
 
  favorites.forEach(recipe => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createRecipeCard(recipe);
    container.appendChild(wrapper.firstElementChild);
  });
});
