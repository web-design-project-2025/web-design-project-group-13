// favorites.js
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
export function updateFavoritesCounter() {
  const counter = document.getElementById("favorites-counter");
  if (counter) {
    const count = getFavorites().length;
    counter.textContent = `❤️ ${count} Favorite${count !== 1 ? "s" : ""}`;
  }
}

// Heart Click Handler
export function handleFavoriteClick(recipe, iconElement) {
  const favorited = isFavorite(recipe.id);

  // Special case for favorites page - only allow unliking
  if (window.location.pathname.includes('favoritespage')) {
    if (!favorited) return; // Shouldn't happen since only favorites should be shown
    
    removeFavorite(recipe.id);
    iconElement?.classList.remove("active");
    showFavoriteToast(`${recipe.title} removed from favorites.`);
    removeRecipeCardFromDOM(recipe.id);
  } 
  // Normal behavior for other pages
  else {
    if (favorited) {
      removeFavorite(recipe.id);
      iconElement?.classList.remove("active");
      showFavoriteToast(`${recipe.title} removed from favorites.`);
    } else {
      saveFavorite(recipe);
      iconElement?.classList.add("active");
      showFavoriteToast(`${recipe.title} added to favorites!`);
    }
  }

  updateFavoritesCounter();
}

// Global Heart Handler Setup
export function setupGlobalHeartHandler() {
  document.addEventListener("click", (e) => {
    const heart = e.target.closest("[data-heart]");
    const card = e.target.closest(".recipe-card");

    if (heart) {
      e.stopPropagation();
      const icon = heart.querySelector("i");
      const recipeData = heart.getAttribute("data-recipe");
      
      try {
        const recipe = JSON.parse(decodeURIComponent(recipeData));
        handleFavoriteClick(recipe, icon);
        
        // Special handling for favorites page
        if (window.location.pathname.includes('favoritespage')) {
          const container = document.getElementById("favorites-container");
          if (container) {
            const favorites = getFavorites();
            if (favorites.length === 0) {
              container.innerHTML = "<p>No favorites yet.</p>";
            }
          }
        }
      } catch (err) {
        console.error("Error handling favorite click:", err);
      }
      return;
    }

    if (card && card.dataset.id) {
      window.location.href = `chosenrecipe.html?id=${card.dataset.id}`;
    }
  });
}

// Remove Recipe Card from DOM
export function removeRecipeCardFromDOM(recipeId) {
  const card = document.querySelector(`.recipe-card[data-id="${recipeId}"]`);
  if (card) {
    card.classList.add("fade-out");
    setTimeout(() => {
      card.remove();
      updateFavoritesCounter();
    }, 1000);
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateFavoritesCounter();
  setupGlobalHeartHandler();
});