// favoritespage.js
import {
  getFavorites,
  removeFavorite,
  removeRecipeCardFromDOM,
} from "./favorites.js";
import { createRecipeCard } from "./recipeCard.js";
import { RecipePaginator } from "./paginator.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("favorites-container");
  const loadingPlaceholder = document.getElementById("loading-placeholder");
  const errorMessage = document.getElementById("error-message");
  const loadMoreButton = document.getElementById("load-more"); // Add this button to your HTML

  if (!container || !loadingPlaceholder) return;

  // Show loading indicator
  loadingPlaceholder.classList.remove("hidden");
  container.innerHTML = "";

  try {    
    const favorites = getFavorites();

    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites yet.</p>";
      return;
    }

    // Initialize paginator
    const paginator = new RecipePaginator(favorites, "favorites-container", 8, loadMoreButton);
    
    // Display first page
    paginator.displayPage(0);

    // Set up load more button click handler
    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", () => {
        const hasMore = paginator.displayPage(paginator.currentPage + 1);
        if (!hasMore) {
          loadMoreButton.style.display = "none";
        }
      });
    }

    // Update heart icon handlers for the displayed recipes
    container.addEventListener("click", (event) => {
      const heartIcon = event.target.closest(".heart-icon");
      if (heartIcon) {
        event.stopPropagation();
        const card = heartIcon.closest(".recipe-card");
        const recipeId = card.dataset.recipeId;
        removeFavorite(recipeId);
        removeRecipeCardFromDOM(recipeId);
        
        // Update the paginator's recipes after removal
        paginator.recipes = getFavorites();
        
        // If we're now on a page that's beyond the available recipes after removal,
        // go back to the previous page
        const totalPages = Math.ceil(paginator.recipes.length / paginator.itemsPerPage);
        if (paginator.currentPage >= totalPages && paginator.currentPage > 0) {
          paginator.displayPage(paginator.currentPage - 1);
        } else {
          // Otherwise, just refresh the current page
          paginator.displayPage(paginator.currentPage);
        }
        
        // Show/hide load more button based on remaining items
        const hasMore = (paginator.currentPage + 1) * paginator.itemsPerPage < paginator.recipes.length;
        if (hasMore) {
          paginator.showLoadMoreButton();
        } else {
          paginator.hideLoadMoreButton();
        }
        
        // If no more favorites, show empty message
        if (paginator.recipes.length === 0) {
          container.innerHTML = "<p>No favorites yet.</p>";
        }
      }
    });

  } catch (error) {
    console.error("Error loading favorites:", error);
    errorMessage.textContent = "Failed to load favorites. Please try again.";
    errorMessage.classList.remove("hidden");
  } finally {
    // Hide loading indicator
    loadingPlaceholder.classList.add("hidden");
  }
});