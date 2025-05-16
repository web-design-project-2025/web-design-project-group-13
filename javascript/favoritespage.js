import {
  getFavorites,
  setupGlobalHeartHandler,
  updateFavoritesCounter,
  isFavorite
} from "javascript/favorites.js";
import { createRecipeCard } from "javascript/recipeCard.js";
import { RecipePaginator } from "javascript/paginator.js";
import { filterRecipes } from "javascript/recipeUtils.js";
import { RecipeSorter } from "javascript/recipeSorter.js";

// Filter popup toggle
function toggleFilterPopup() {
  const filterPopup = document.getElementById("filter-popup");
  if (filterPopup) {
    filterPopup.classList.toggle("show");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  setupGlobalHeartHandler();
  const container = document.getElementById("favorites-container");
  const loadingPlaceholder = document.getElementById("loading-placeholder");
  const errorMessage = document.getElementById("error-message");
  const loadMoreButton = document.getElementById("load-more");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const filterButton = document.querySelector(".filter-button");
  const closeBtn = document.querySelector(".close-btn");
  const showAllRecipesBtn = document.getElementById("show-all-recipes");

  if (!container || !loadingPlaceholder) return;

  filterButton?.addEventListener("click", toggleFilterPopup);
  closeBtn?.addEventListener("click", toggleFilterPopup);

  // Show loading indicator
  loadingPlaceholder.classList.remove("hidden");
  container.innerHTML = "";

  try {
    let favorites = getFavorites();

    // Ensure all displayed recipes are actually favorited
    favorites = favorites.filter(recipe => isFavorite(recipe.id));

    let activeFilters = {
      diet: [],
      ingredients: [],
      searchTerm: "",
    };

    // Track how many recipes are currently loaded
    let currentLoadedCount = 8;

    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites yet.</p>";
      return;
    }

    // Initialize paginator
    let paginator = new RecipePaginator(
      favorites,
      "favorites-container",
      8,
      loadMoreButton
    );

    // Filter and render function
    const applyFiltersAndRender = (resetLoadedCount = false) => {
      if (resetLoadedCount) {
        currentLoadedCount = 8;
      }

      // Reset and collect active filters
      activeFilters.diet = [];
      activeFilters.ingredients = [];

      document.querySelectorAll(".filter-btn.active").forEach((button) => {
        const filterValue = button.dataset.filter;
        const filterType = button.closest("#diet-filters")
          ? "diet"
          : "ingredients";
        activeFilters[filterType].push(filterValue);
      });

      let filtered = filterRecipes(favorites, activeFilters);
      const sorted = RecipeSorter.sortRecipes(filtered, sortSelect.value);

      // Create new paginator with filtered results
      paginator = new RecipePaginator(
        sorted,
        "favorites-container",
        8,
        loadMoreButton
      );
 
      // Show all recipes up to current count
      const pagesToShow = Math.ceil(currentLoadedCount / 8);
      let allLoaded = false;

      for (let i = 0; i < pagesToShow; i++) {
        const hasMore = paginator.displayPage(i);
        if (!hasMore) {
          allLoaded = true;
          break;
        }
      }

      // Update load more button visibility
      if (loadMoreButton) {
        loadMoreButton.style.display = allLoaded ? "none" : "block";
      }
    };

    // Show all recipes handler
    showAllRecipesBtn?.addEventListener("click", () => {
      // Reset all filters
      activeFilters = {
        diet: [],
        ingredients: [],
        searchTerm: "",
      };

      // Clear search input
      if (searchInput) searchInput.value = "";

      // Remove active class from all filter buttons
      filterButtons?.forEach((button) => {
        button.classList.remove("active");
      });

      // Reset to default sort
      if (sortSelect) sortSelect.value = "popular";

      // Reset loaded count and re-render
      currentLoadedCount = 8;
      applyFiltersAndRender(true);
    });

    // Event listeners
    searchInput?.addEventListener("input", (e) => {
      activeFilters.searchTerm = e.target.value.toLowerCase();
      applyFiltersAndRender(true); 
    });

    sortSelect?.addEventListener("change", () => {
      applyFiltersAndRender(true); 
    });

    filterButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        applyFiltersAndRender(); 
      });
    });

    // Load more button handler
    loadMoreButton?.addEventListener("click", () => {
      const hasMore = paginator.displayPage(paginator.currentPage + 1);
      currentLoadedCount += 8;
      if (!hasMore) {
        loadMoreButton.style.display = "none";
      }
    });

    // Initial render
    applyFiltersAndRender(true);
  } catch (error) {
    console.error("Error loading favorites:", error);
    errorMessage.textContent = "Failed to load favorites. Please try again.";
    errorMessage.classList.remove("hidden");
  } finally {
    loadingPlaceholder.classList.add("hidden");
  }
});
