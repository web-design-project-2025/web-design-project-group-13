import { loadRecipes } from './recipeService.js';
import { applyFilters, allRecipes } from './filterService.js';

document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");

  try {
    // Show loading state
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = '<div class="loading">Loading recipes...</div>';

    // Load all recipes - using proper array modification
    const data = await loadRecipes();
    allRecipes.length = 0; // Clear existing array
    allRecipes.push(...data.recipes); // Add new items without reassignment

    let baseRecipes = [...allRecipes]; // Create a working copy
    const pageType = document.body.dataset.page;

    if (pageType === "favorites") {
      const likedIds = JSON.parse(localStorage.getItem('likedRecipes')) || [];
      baseRecipes = allRecipes.filter(recipe => likedIds.includes(recipe.id));
      
      if (baseRecipes.length === 0) {
        recipeContainer.innerHTML = '<div class="loading">No favorites yet!</div>';
      }
    } 
    
    if (pageType === "category") {
      const category = document.body.dataset.category;
      baseRecipes = allRecipes.filter(recipe => 
        recipe.category.toLowerCase() === category.toLowerCase());
    }

    // Initial render
    applyFilters(true, baseRecipes);

    // Setup event listeners
    if (searchInput) {
      const savedSearch = localStorage.getItem("searchTerm") || "";
      searchInput.value = savedSearch;

      searchInput.addEventListener("input", function (e) {
        localStorage.setItem("searchTerm", e.target.value.toLowerCase());
        applyFilters(true, baseRecipes);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        applyFilters(true, baseRecipes);
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        applyFilters(false, baseRecipes);
      });
    }
  } catch (error) {
    console.error("Error initializing:", error);
    document.getElementById("recipe-container").innerHTML = 
      `<div class="error">Error loading recipes: ${error.message}</div>`;
  }
});

// Handle likes updates across the application
document.addEventListener('likesUpdated', () => {
  if (document.body.dataset.page === "favorites") {
    const likedIds = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    const baseRecipes = allRecipes.filter(recipe => likedIds.includes(recipe.id));
    
    const recipeContainer = document.getElementById("recipe-container");
    if (baseRecipes.length === 0) {
      recipeContainer.innerHTML = '<div class="loading">No favorites yet!</div>';
    } else {
      applyFilters(true, baseRecipes);
    }
  }
});