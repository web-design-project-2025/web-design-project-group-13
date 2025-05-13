//favoritespage.js

import {
  getFavorites,
  removeFavorite,
  removeRecipeCardFromDOM,
} from "./favorites.js";
import { createRecipeCard } from "./recipeCard.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const favorites = getFavorites();

  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach((recipe) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createRecipeCard(recipe);
    const card = wrapper.firstElementChild;
    container.appendChild(card);

    const heartIcon = card.querySelector(".heart-icon");
    if (heartIcon) {
      heartIcon.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents triggering card click navigation
        removeFavorite(recipe.id);
        removeRecipeCardFromDOM(recipe.id);
      });
    }
  });
});
