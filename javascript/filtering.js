// filtering.js
import { fetchRecipes } from "./recipeAPI.js";
import { createRecipeCard } from "./recipeCard.js";
import { filterRecipes } from "./recipeUtils.js";
import { RecipeSorter } from "./recipeSorter.js";

let allRecipes = [];
let activeFilters = {
  diet: [],
  ingredients: [],
  searchTerm: "",
};

const elements = {
  search: document.getElementById("search"),
  sortSelect: document.getElementById("sort-select"),
  filterPopup: document.getElementById("filter-popup"),
  dietFilters: document.getElementById("diet-filters"),
  ingredientsFilters: document.getElementById("ingredients-filters"),
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { recipes } = await fetchRecipes();
    allRecipes = recipes;
    setupEventListeners();
    applyFiltersAndRender();
  } catch (error) {
    console.error("Error loading recipes:", error);
    showError("Failed to load recipes. Please try again later.");
  }
});

function setupEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => toggleFilter(button));
  });

  elements.search?.addEventListener("input", (e) => {
    activeFilters.searchTerm = e.target.value.toLowerCase();
    applyFiltersAndRender();
  });

  elements.sortSelect?.addEventListener("change", applyFiltersAndRender);
  document.querySelector(".close-btn")?.addEventListener("click", toggleFilterPopup);

  document.getElementById("show-all-recipes")?.addEventListener("click", () => {
    window.location.href = "allmealspage.html";
  });
}

function toggleFilter(button) {
  const filterType = button.closest(".filter-buttons").id.includes("diet")
    ? "diet"
    : "ingredients";
  const filterValue = button.dataset.filter;

  if (button.classList.contains("active")) {
    button.classList.remove("active");
    activeFilters[filterType] = activeFilters[filterType].filter((f) => f !== filterValue);
  } else {
    button.classList.add("active");
    activeFilters[filterType].push(filterValue);
  }

  applyFiltersAndRender();
}

window.toggleFilterPopup = function () {
  elements.filterPopup?.classList.toggle("show");
};

function applyFiltersAndRender() {
  let filtered = filterRecipes(allRecipes, activeFilters);

  const pageType = document.body.dataset.page;
  let containerId;
  let showPopularBadge = false;

  if (pageType === "home") {
    filtered = filtered.filter((r) => r.isPopular);
    containerId = "popular-container";
    showPopularBadge = true;
  } else if (pageType === "all") {
    containerId = "all-meals-container";
  } else if (pageType === "dinner") {
    filtered = filtered.filter((r) =>
      r.categories?.toLowerCase().split(",").map((c) => c.trim()).includes("dinner")
    );
    containerId = "dinner-recipes-container";
  }

  const sorted = elements.sortSelect ? RecipeSorter.sortRecipes(filtered, elements.sortSelect.value) : filtered;
  displayRecipes(sorted, containerId, showPopularBadge);
  toggleNoResultsMessage(sorted.length === 0);
}

function displayRecipes(recipes, containerId, showBadge) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  recipes.forEach((recipe) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.innerHTML = createRecipeCard(recipe, { showPopularBadge: showBadge });
    fragment.appendChild(cardWrapper.firstElementChild);
  });

  container.appendChild(fragment);
}

function toggleNoResultsMessage(show) {
  let message = document.getElementById("no-results-message");

  if (show && !message) {
    message = document.createElement("div");
    message.id = "no-results-message";
    message.className = "no-results";
    message.innerHTML = `<h3>No recipes found</h3>`;
    document.querySelector("main")?.appendChild(message);
  } else if (!show && message) {
    message.remove();
  }
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}
