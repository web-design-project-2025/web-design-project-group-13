// main.js
import {
  fetchRecipes,
  getPopularRecipes,
  getRegularRecipes,
} from "/javascript/recipeApi.js";
import { createRecipeCard } from "/javascript/recipeCard.js";
import { RecipeSorter } from "/javascript/recipeSorter.js";

class RecipeApp {
  constructor() {
    // DOM Elements
    this.popularContainer = document.getElementById("popular-container");
    this.otherContainer = document.getElementById("other-recipes-container");
    this.loadMoreBtn = document.getElementById("load-more");
    this.otherRecipesSection = document.getElementById("other-recipes");
    this.loadingPlaceholder = document.getElementById("loading-placeholder");
    this.errorMessage = document.getElementById("error-message");
    this.sortSelect = document.getElementById("sort-select");

    // State Management
    this.currentPage = 0;
    this.recipesPerPage = 8;
    this.allRecipes = [];
    this.popularIds = [];
    this.displayedRecipes = [];
    this.regularRecipes = [];
    this.currentSort = 'popular';

    // Event Listeners
    this.loadMoreBtn?.addEventListener("click", () => this.loadMoreRecipes());
    this.sortSelect?.addEventListener("change", (e) => this.handleSortChange(e));
  }

  async initialize() {
    try {
      this.showLoading();
      this.hideError();

      const { recipes, popularIds } = await fetchRecipes();
      
      if (!recipes?.length) {
        throw new Error("No recipes found in the data");
      }

      this.allRecipes = recipes;
      this.popularIds = popularIds;

      // Initial display - only popular recipes
      const popularRecipes = getPopularRecipes(this.allRecipes, this.popularIds);
      this.displayRecipes(popularRecipes, this.popularContainer, true);

      // Store regular recipes for later
      this.regularRecipes = getRegularRecipes(this.allRecipes, this.popularIds);

      // Show load more button if there are regular recipes
      if (this.regularRecipes.length > 0) {
        this.showLoadMoreSection();
      }

    } catch (error) {
      console.error("Recipe loading failed:", error);
      this.showError("Failed to load recipes. Please try again later.");
    } finally {
      this.hideLoading();
    }
  }

  handleSortChange(event) {
    this.currentSort = event.target.value;
    this.applySorting();
  }

  applySorting() {
    // Sort all recipes according to current sort method
    this.displayedRecipes = RecipeSorter.sortRecipes(
      this.allRecipes,
      this.currentSort,
      this.popularIds
    );

    // Clear containers
    this.popularContainer.innerHTML = '';
    this.otherContainer.innerHTML = '';

    // Separate popular and regular after sorting
    const popularRecipes = this.displayedRecipes.filter(recipe => 
      this.popularIds.includes(recipe.id)
    );
    const regularRecipes = this.displayedRecipes.filter(recipe => 
      !this.popularIds.includes(recipe.id)
    );

    // Always show popular recipes
    this.displayRecipes(popularRecipes, this.popularContainer, true);

    // Only show regular recipes if not in default 'popular' sort
    if (this.currentSort !== 'popular') {
      this.displayRecipes(regularRecipes, this.otherContainer);
      this.hideLoadMoreButton(); // Hide button when showing all sorted recipes
    } else {
      // Reset pagination for regular recipes
      this.currentPage = 0;
      this.regularRecipes = regularRecipes;
      if (this.regularRecipes.length > 0) {
        this.showLoadMoreSection();
      }
    }
  }

  loadMoreRecipes() {
    const start = this.currentPage * this.recipesPerPage;
    const end = start + this.recipesPerPage;
    const recipesToShow = this.regularRecipes.slice(start, end);

    this.displayRecipes(recipesToShow, this.otherContainer);
    this.currentPage++;

    if (end >= this.regularRecipes.length) {
      this.hideLoadMoreButton();
    }
  }

  // DOM Helper Methods
  displayRecipes(recipes, container, showBadge = false) {
    if (!container || !recipes?.length) return;

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
      this.loadMoreBtn.style.display = "block";
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

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  const app = new RecipeApp();
  app.initialize();
});