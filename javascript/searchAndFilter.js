import { loadRecipes, displayRecipes } from './recipeService.js';

let allRecipes = [];
let filteredRecipes = [];
let currentDisplayIndex = 0;
const recipesPerPage = 8;

document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");

  // Load all recipes
  const data = await loadRecipes();
  allRecipes = data.recipes;

  let baseRecipes = allRecipes; // Default
  const pageType = document.body.dataset.page; // Add a data attribute to <body> like <body data-page="favorites">

  if (pageType === "favorites") {
    const likedIds = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    baseRecipes = allRecipes.filter(recipe => likedIds.includes(recipe.id));
  } 
  
  if (pageType === "category") {
    const category = document.body.dataset.category;
    baseRecipes = allRecipes.filter(recipe => recipe.category.toLowerCase() === category.toLowerCase());
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
});

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