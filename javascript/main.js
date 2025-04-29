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

    // Load recipes
    const data = await loadRecipes();
    allRecipes.length = 0;
    allRecipes.push(...data.recipes);

    // Initialize view
    updateRecipeDisplay();

    // Setup event listeners
    if (searchInput) {
      searchInput.value = localStorage.getItem("searchTerm") || "";
      searchInput.addEventListener("input", () => updateRecipeDisplay(true));
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => updateRecipeDisplay(true));
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => updateRecipeDisplay(false));
    }

  } catch (error) {
    console.error("Error initializing:", error);
    document.getElementById("recipe-container").innerHTML = 
      `<div class="error">Error loading recipes: ${error.message}</div>`;
  }
});

function updateRecipeDisplay(reset = true) {
  const pageType = document.body.dataset.page;
  let baseRecipes = [...allRecipes];
  
  if (pageType === "favorites") {
    const likedIds = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    baseRecipes = allRecipes.filter(recipe => likedIds.includes(recipe.id));
  } 
  
  if (pageType === "category") {
    const category = document.body.dataset.category;
    baseRecipes = allRecipes.filter(recipe => 
      recipe.category.toLowerCase() === category.toLowerCase());
  }

  applyFilters(reset, baseRecipes);
}

// Listen for like updates
document.addEventListener('likeUpdated', () => {
  if (document.body.dataset.page === "favorites") {
    updateRecipeDisplay(true);
  }
});