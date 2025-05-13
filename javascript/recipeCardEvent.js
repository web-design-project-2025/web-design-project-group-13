//recipeCardEvent.js

import { handleFavoriteClick } from "./recipeCard.js";

document.addEventListener("click", (e) => {
  const heart = e.target.closest("[data-heart]");
  const card = e.target.closest(".recipe-card");

  if (heart) {
    e.stopPropagation(); // Prevent redirect
    const icon = heart.querySelector("i");
    const recipeData = heart.getAttribute("data-recipe");
    handleFavoriteClick(recipeData, icon);
    return;
  }

  if (card && card.dataset.id) {
    window.location.href = `chosenrecipe.html?id=${card.dataset.id}`;
  }
});
