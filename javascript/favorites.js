const FAVORITES_KEY = "favoriteRecipes";

// Core LocalStorage Functions
export function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFavorite(recipe) {
  const favorites = getFavorites();
  if (!favorites.some((fav) => fav.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  console.log("Saving favorite:", recipe);

}

export function removeFavorite(id) {
  const favorites = getFavorites().filter((fav) => fav.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
  return getFavorites().some((fav) => fav.id === id);
}

// Toast Notification
function showFavoriteToast(message) {
  const toast = document.getElementById("favorite-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}

// Counter
function updateFavoritesCounter() {
  const counter = document.getElementById("favorites-counter");
  if (counter) {
    const count = getFavorites().length;
    counter.textContent = `❤️ ${count} Favorite${count !== 1 ? "s" : ""}`;
  }
}

// Heart Click Handler (called from UI)
export function handleFavoriteClick(recipeJSON, iconElement) {
  const recipe = JSON.parse(decodeURIComponent(recipeJSON));
  const favorited = isFavorite(recipe.id);

  if (favorited) {
    removeFavorite(recipe.id);
    iconElement.classList.remove("active");
    showFavoriteToast(`${recipe.title} removed from favorites.`);
  } else {
    saveFavorite(recipe);
    iconElement.classList.add("active");
    showFavoriteToast(`${recipe.title} added to favorites!`);
  }

  updateFavoritesCounter();
  console.log("Handling favorite click for:", recipe);
}

// Initial Counter Update
document.addEventListener("DOMContentLoaded", () => {
  updateFavoritesCounter();
});

// Global Click Handler (heart icons & card navigation)
document.addEventListener("click", (e) => {
  const heart = e.target.closest("[data-heart]");
  const card = e.target.closest(".recipe-card");

  if (heart) {
    e.stopPropagation();
    const icon = heart.querySelector("i");
    const recipeData = heart.getAttribute("data-recipe");
    handleFavoriteClick(recipeData, icon);
    return;
  }

  if (card && card.dataset.id) {
    window.location.href = `chosenrecipe.html?id=${card.dataset.id}`;
  }
});

// Remove Recipe Card after clicking "Remove from Favorites" (no refresh)
export function removeRecipeCardFromDOM(recipeId) {
  const card = document.querySelector(`.recipe-card[data-id="${recipeId}"]`);

  if (card) {
    // Add fade-out effect before removal
    card.classList.add("fade-out");

    // After fade-out completes, remove the card
    setTimeout(() => {
      card.remove();
      updateFavoritesCounter(); // Update the counter after the removal
    }, 1000); // Adjust the delay based on your fade-out duration
  }
}
