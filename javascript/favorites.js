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
function showFavoriteToast(message, recipe) {
  const toast = document.getElementById("favorite-toast");
  if (!toast) return;

  // Clear previous content
  toast.innerHTML = "";

  // Create image element if recipe has an image
  if (recipe.image) {
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    toast.appendChild(img);
  }

  // Create content container
  const content = document.createElement("div");
  content.className = "favorite-toast-content";

  // Add message text
  const text = document.createElement("span");
  text.textContent = message;
  content.appendChild(text);

  // Add recipe title (optional)
  const title = document.createElement("strong");
  title.textContent = recipe.title;
  content.appendChild(title);

  toast.appendChild(content);

  // Show toast
  toast.classList.remove("hidden");
  toast.classList.add("show");

 setTimeout(() => {
  toast.classList.add("hiding");
  setTimeout(() => {
    toast.classList.remove("show", "hiding");
    toast.classList.add("hidden");
  }, 300);
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

  // Check current state from DOM rather than localStorage
  const isCurrentlySolid = iconElement.classList.contains("fas");

  if (window.location.pathname.includes("favoritespage")) {
    if (!favorited) return;

    removeFavorite(recipe.id);
    iconElement.classList.remove("fas");
    iconElement.classList.add("far");
    showFavoriteToast(`Removed from favorites`, recipe);
    removeRecipeCardFromDOM(recipe.id);
  } else {
    if (isCurrentlySolid) {
      removeFavorite(recipe.id);
      iconElement.classList.remove("fas");
      iconElement.classList.add("far");
      showFavoriteToast(`Removed from favorites`, recipe);
    } else {
      saveFavorite(recipe);
      iconElement.classList.remove("far");
      iconElement.classList.add("fas");
      showFavoriteToast(`Added to favorites!`, recipe);
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
        if (window.location.pathname.includes("favoritespage")) {
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

  // Initialize heart icons based on favorites
  document.querySelectorAll(".heart-icon i").forEach((icon) => {
    const recipeId = icon
      .closest("[data-recipe-id]")
      ?.getAttribute("data-recipe-id");
    if (recipeId && isFavorite(recipeId)) {
      // If favorited, make it solid red
      icon.classList.add("fas");
      icon.style.color = "red";
      icon.style.webkitTextStroke = "0";
    } else {
      // If not favorited, make it outline
      icon.classList.add("far");
      icon.style.color = "transparent";
      icon.style.webkitTextStroke = "1.5px black";
    }
  });
});
