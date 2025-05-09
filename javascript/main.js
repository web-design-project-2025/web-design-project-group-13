// javascript/main.js
import {
  fetchRecipes,
  getPopularRecipes,
  getRegularRecipes,
} from "/javascript/recipeApi.js";
import { createRecipeCard } from "/javascript/recipeCard.js";
import { RecipeSorter } from "/javascript/recipeSorter.js";
import { RecipeSearch } from "/javascript/searchbar.js";

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
    this.searchInput = document.getElementById("search");

    // New: Scroll to Top Button
    this.scrollToTopBtn = document.getElementById("scrollToTopBtn"); // Ensure this ID matches your HTML button

    // State Management
    this.currentPage = 0;
    this.recipesPerPage = 8;
    this.allRecipes = [];
    this.popularIds = [];
    this.displayedRecipes = [];
    this.regularRecipes = [];
    this.currentSort = "popular";

    // Initialize modules
    this.recipeSearch = new RecipeSearch(this.searchInput, this);

    // Event Listeners
    this.initializeEventListeners();
    // New: Add scroll event listener for the "scroll to top" button visibility
    window.addEventListener("scroll", () => this.handleScroll());
  }

  initializeEventListeners() {
    this.loadMoreBtn?.addEventListener("click", () => this.loadMoreRecipes());
    this.sortSelect?.addEventListener("change", (e) =>
      this.handleSortChange(e)
    );

    // New: Add click listener for scroll to top button
    this.scrollToTopBtn?.addEventListener("click", () => this.scrollToTop());
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

      this.applyFiltersAndSort();
    } catch (error) {
      console.error("Recipe loading failed:", error);
      this.showError("Failed to load recipes. Please try again later.");
    } finally {
      this.hideLoading();
    }
  }

  applyFiltersAndSort() {
    // Filter recipes based on search term
    let filteredRecipes = this.recipeSearch.filterRecipes(this.allRecipes);

    // Sort the filtered recipes
    this.displayedRecipes = RecipeSorter.sortRecipes(
      filteredRecipes,
      this.currentSort,
      this.popularIds
    );

    // Update UI
    this.updateRecipeDisplay();
  }

  updateRecipeDisplay() {
    // Clear containers
    this.clearContainers();

    if (this.recipeSearch.searchTerm) {
      // When searching - show ALL matching recipes in the main container
      this.displayRecipes(this.displayedRecipes, this.popularContainer);
      this.hideLoadMoreSection(); // Hide pagination when searching
    } else {
      // Normal view - separate popular and regular recipes
      const popularRecipes = this.displayedRecipes.filter((recipe) =>
        this.popularIds.includes(recipe.id)
      );
      const regularRecipes = this.displayedRecipes.filter(
        (recipe) => !this.popularIds.includes(recipe.id)
      );

      this.displayRecipes(popularRecipes, this.popularContainer, true);
      this.handleRegularRecipesDisplay(regularRecipes);
    }

    this.handleDisplayMessages();
  }

  clearContainers() {
    this.popularContainer.innerHTML = "";
    this.otherContainer.innerHTML = "";
  }

  handleRegularRecipesDisplay(regularRecipes) {
    if (this.currentSort !== "popular" || this.recipeSearch.searchTerm) {
      // Show all regular recipes when sorting or searching
      this.displayRecipes(regularRecipes, this.otherContainer);
      this.hideLoadMoreButton();
    } else {
      // Paginate regular recipes in default view
      this.currentPage = 0;
      this.regularRecipes = regularRecipes;
      if (this.regularRecipes.length > 0) {
        this.showLoadMoreSection();
        this.loadMoreRecipes(); // Load first page immediately
      }
    }
  }

  handleDisplayMessages() {
    if (this.recipeSearch.searchTerm && this.displayedRecipes.length === 0) {
      this.showNoResultsMessage();
    } else {
      this.hideError();
    }
  }

  handleSortChange(event) {
    this.currentSort = event.target.value;
    this.applyFiltersAndSort();
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
    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.innerHTML = createRecipeCard(recipe, {
        showPopularBadge: showBadge,
      });
      fragment.appendChild(card.firstElementChild);
    });
    container.appendChild(fragment);
  }

  showNoResultsMessage() {
    const message = `No recipes found for "${this.recipeSearch.searchTerm}"`;
    this.showError(message);
  }

  // UI State Methods
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
      this.errorMessage.classList.remove("hidden");
      setTimeout(() => this.hideError(), 5000);
    }
  }

  hideError() {
    if (this.errorMessage) {
      this.errorMessage.classList.add("hidden");
    }
  }

  // NEW: Handle scroll event to show/hide the "scroll to top" button
  handleScroll() {
    if (this.scrollToTopBtn) {
      // Show button if scrolled down more than 200px from the top
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        this.scrollToTopBtn.style.display = "block";
      } else {
        this.scrollToTopBtn.style.display = "none";
      }
    }
  }

  // NEW: Function to smoothly scroll to the top of the page
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // This provides a smooth scrolling animation
    });
  }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  const app = new RecipeApp();
  app.initialize();
});