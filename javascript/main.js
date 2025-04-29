import {
  fetchRecipes,
  getPopularRecipes,
  getRegularRecipes,
} from "/javascript/recipeApi.js";
import { createRecipeCard } from "/javascript/recipeCard.js";

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
  window.requestIdleCallback = (callback) => {
    return setTimeout(() => {
      callback({ didTimeout: false });
    }, 0);
  };
}

class RecipeApp {
  constructor() {
    // DOM Elements
    this.popularContainer = document.getElementById("popular-container");
    this.otherContainer = document.getElementById("other-recipes-container");
    this.loadMoreBtn = document.getElementById("load-more");
    this.otherRecipesSection = document.getElementById("other-recipes");
    this.loadingPlaceholder = document.getElementById("loading-placeholder");
    this.errorMessage = document.getElementById("error-message");

    // State Management
    this.currentPage = 0;
    this.recipesPerPage = 8;
    this.regularRecipes = [];

    // Event Listeners
    this.loadMoreBtn?.addEventListener("click", () => this.loadMoreRecipes());
  }

  async initialize() {
    try {
      this.showLoading();
      this.hideError();

      const { recipes, popularIds } = await fetchRecipes();
      
      if (!recipes?.length) {
        throw new Error("No recipes found in the data");
      }

      // Display popular recipes immediately
      const popularRecipes = getPopularRecipes(recipes, popularIds);
      this.displayRecipes(popularRecipes, this.popularContainer, true);

      // Store regular recipes for lazy loading
      this.regularRecipes = getRegularRecipes(recipes, popularIds);

      // Initialize lazy loading if there are regular recipes
      if (this.regularRecipes.length > 0) {
        this.showLoadMoreSection();
      } else {
        this.hideLoadMoreSection();
      }

    } catch (error) {
      console.error("Recipe loading failed:", error);
      this.showError("Failed to load recipes. Please try again later.");
    } finally {
      this.hideLoading();
    }
  }

  loadMoreRecipes() {
    try {
      const start = this.currentPage * this.recipesPerPage;
      const end = start + this.recipesPerPage;
      const recipesToShow = this.regularRecipes.slice(start, end);

      this.displayRecipes(recipesToShow, this.otherContainer);
      this.currentPage++;

      // Hide button if we've loaded all recipes
      if (end >= this.regularRecipes.length) {
        this.hideLoadMoreButton();
      }
    } catch (error) {
      console.error("Error loading more recipes:", error);
      this.showError("Failed to load more recipes");
    }
  }

  // DOM Helper Methods
  displayRecipes(recipes, container, showBadge = false) {
    if (!container) return;

    const fragment = document.createDocumentFragment();
    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.innerHTML = createRecipeCard(recipe, { 
        showPopularBadge: showBadge 
      });
      fragment.appendChild(card.firstElementChild);
    });
    container.appendChild(fragment);
  }

  showLoadMoreSection() {
    if (this.otherRecipesSection) {
      this.otherRecipesSection.classList.remove("hidden");
    }
    if (this.loadMoreBtn) {
      this.loadMoreBtn.classList.remove("block");
    }
  }

  hideLoadMoreSection() {
    if (this.otherRecipesSection) {
      this.otherRecipesSection.classList.add("hidden");
    }
  }

  hideLoadMoreButton() {
    if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display = "none";
    }
  }

  // UI State Methods
  showLoading() {
    if (this.loadingPlaceholder) {
      this.loadingPlaceholder.style.display = "flex";
    }
  }

  hideLoading() {
    if (this.loadingPlaceholder) {
      this.loadingPlaceholder.style.display = "none";
    }
  }

  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.style.display = "block";
      setTimeout(() => this.hideError(), 5000);
    }
  }

  hideError() {
    if (this.errorMessage) {
      this.errorMessage.style.display = "none";
    }
  }
}

// Global Error Handling
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error);
  const loading = document.getElementById("loading-placeholder");
  if (loading) loading.style.display = "none";
});

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  try {
    const app = new RecipeApp();
    app.initialize();
  } catch (error) {
    console.error("Application failed to initialize:", error);
    const errorDisplay = document.getElementById("error-message") || 
                        document.createElement("div");
    errorDisplay.textContent = "Application error. Please refresh.";
    errorDisplay.style.color = "red";
    document.body.prepend(errorDisplay);
  }
});