import { displayRecipes } from './recipeService.js';

export let allRecipes = [];
let filteredRecipes = [];
let currentDisplayIndex = 0;
const recipesPerPage = 8;

function applyFilters(reset = false, baseRecipes = allRecipes) {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");

  const searchTerm = searchInput?.value.toLowerCase() || "";

  // Filter
  filteredRecipes = baseRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm) ||
    recipe.description.toLowerCase().includes(searchTerm) ||
    recipe.category.toLowerCase().includes(searchTerm)
  );

  // Sort
  const sortBy = sortSelect?.value || "";
  if (sortBy === "rating") {
    filteredRecipes.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "time") {
    filteredRecipes.sort((a, b) => b.time.total - a.time.total);
  } else if (sortBy === "title") {
    filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Pagination
  if (reset) currentDisplayIndex = 0;
  const end = currentDisplayIndex + recipesPerPage;
  const visible = filteredRecipes.slice(0, end);
  currentDisplayIndex = end;

  displayRecipes(visible);

  // Show/hide "Load More"
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentDisplayIndex < filteredRecipes.length ? "block" : "none";
  }
}

export { applyFilters, filteredRecipes };