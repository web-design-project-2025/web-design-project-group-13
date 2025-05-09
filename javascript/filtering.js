// filtering.js
import { fetchRecipes } from "./recipeAPI.js";
import { createRecipeCard } from "./recipeCard.js";

let allRecipes = [];
let activeFilters = {
  diet: [],
  ingredients: [],
};

// DOM Elements
const elements = {
  search: document.getElementById("search"),
  sortSelect: document.getElementById("sort-select"),
  popularContainer: document.getElementById("popular-container"),
  popularSection: document.getElementById("popular-recipes"),
  filterPopup: document.getElementById("filter-popup"),
  dietFilters: document.getElementById("diet-filters"),
  ingredientsFilters: document.getElementById("ingredients-filters"),
};

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { recipes } = await fetchRecipes();
    allRecipes = recipes;

    setupEventListeners();
    applyFilters();
  } catch (error) {
    console.error("Error loading recipes:", error);
    showError("Failed to load recipes. Please try again later.");
  }
});

function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => toggleFilter(button));
  });

  // Search input
  elements.search.addEventListener("input", () => applyFilters());

  // Sort select
  elements.sortSelect.addEventListener("change", () => applyFilters());

  // Filter popup close button
  document
    .querySelector(".close-btn")
    .addEventListener("click", toggleFilterPopup);
}

function toggleFilter(button) {
  const filterType = button.closest(".filter-buttons").id.includes("diet")
    ? "diet"
    : "ingredients";
  const filterValue = button.dataset.filter;

  // Toggle filter
  if (button.classList.contains("active")) {
    button.classList.remove("active");
    activeFilters[filterType] = activeFilters[filterType].filter(
      (f) => f !== filterValue
    );
  } else {
    button.classList.add("active");
    activeFilters[filterType].push(filterValue);
  }

  applyFilters();
}

// Make this function available globally
window.toggleFilterPopup = function () {
  elements.filterPopup.classList.toggle("show");
};

function applyFilters() {
  const searchTerm = elements.search.value.toLowerCase();
  const sortValue = elements.sortSelect.value;

  let filteredRecipes = filterRecipes(allRecipes, searchTerm);
  filteredRecipes = sortRecipes(filteredRecipes, sortValue);

  displayFilteredRecipes(filteredRecipes);
  toggleNoResultsMessage(filteredRecipes.length === 0);
}

function filterRecipes(recipes, searchTerm) {
  return recipes.filter((recipe) => {
    if (activeFilters.diet.length > 0) {
      const matchesDiet = activeFilters.diet.some((diet) => {
        return recipe.categories.toLowerCase().includes(diet.toLowerCase());
      });
      if (!matchesDiet) return false;
    }

    if (activeFilters.ingredients.length > 0) {
      const matchesIngredients = activeFilters.ingredients.some(
        (ingredient) => {
          return recipe.categories
            .toLowerCase()
            .includes(ingredient.toLowerCase());
        }
      );
      if (!matchesIngredients) return false;
    }

    if (searchTerm) {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });
}

function sortRecipes(recipes, sortBy) {
  switch (sortBy) {
    case "popular":
      return [...recipes].sort(
        (a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
      );
    case "rating":
      return [...recipes].sort((a, b) => b.rating - a.rating);
    case "time":
      return [...recipes].sort((a, b) => a.time - b.time);
    case "title":
      return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
    default:
      return recipes;
  }
}

function displayFilteredRecipes(filteredRecipes) {
  // Clear existing recipes
  if (elements.popularContainer) {
    elements.popularContainer.innerHTML = ""; // Clear popular container
    const popularRecipes = filteredRecipes.filter((recipe) => recipe.isPopular);
    if (popularRecipes.length > 0) {
      popularRecipes.forEach((recipe) => {
        const card = createRecipeCard(recipe, { showPopularBadge: true });
        elements.popularContainer.innerHTML += card;
      });
      elements.popularSection.classList.remove("hidden");
    } else {
      elements.popularSection.classList.add("hidden");
    }
  }
}

function toggleNoResultsMessage(show) {
  let message = document.getElementById("no-results-message");

  if (show && !message) {
    message = document.createElement("div");
    message.id = "no-results-message";
    message.className = "no-results";
    message.innerHTML = `
            <h3>No recipes found</h3>
        `;
    document.querySelector("main").appendChild(message);
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
