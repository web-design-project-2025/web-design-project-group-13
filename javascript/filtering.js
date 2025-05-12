// filtering.js
import { fetchRecipes } from "./recipeAPI.js";
import { createRecipeCard } from "./recipeCard.js";
import { filterRecipes } from "./recipeUtils.js";
import { RecipeSorter } from "./recipeSorter.js";
import { RecipePaginator } from "./paginator.js";
import {
  showLoadingIndicator,
  hideLoadingIndicator,
  showErrorMessage,
  hideErrorMessage,
} from "./loadingErrorDisplay.js";

let allRecipes = [];
let activeFilters = {
  diet: [],
  ingredients: [],
  searchTerm: "",
};

let currentPage = 0;
const itemsPerPage = 8;

const elements = {
  search: document.getElementById("search"),
  sortSelect: document.getElementById("sort-select"),
  filterPopup: document.getElementById("filter-popup"),
  dietFilters: document.getElementById("diet-filters"),
  ingredientsFilters: document.getElementById("ingredients-filters"),
  loadMoreBtn: document.getElementById("load-more"),
};

let paginator;

document.addEventListener("DOMContentLoaded", async () => {
  showLoadingIndicator(); // Show the loading indicator

  try {
    const { recipes } = await fetchRecipes();
    allRecipes = recipes;
    setupEventListeners();
    applyFiltersAndRender(true); // Initial render
  } catch (error) {
    console.error("Error loading recipes:", error);
    showErrorMessage("Failed to load recipes. Please try again later."); // Show error message
  } finally {
    hideLoadingIndicator(); // Hide the loading indicator when done
  }
});

function setupEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => toggleFilter(button));
  });

  elements.search?.addEventListener("input", (e) => {
    activeFilters.searchTerm = e.target.value.toLowerCase();
    applyFiltersAndRender(true);
  });

  elements.sortSelect?.addEventListener("change", () =>
    applyFiltersAndRender(true)
  );

  document
    .querySelector(".close-btn")
    ?.addEventListener("click", toggleFilterPopup);

  document.getElementById("show-all-recipes")?.addEventListener("click", () => {
    window.location.href = "allmealspage.html";
  });

  // Attach click event listener to the "Load More" button
  elements.loadMoreBtn?.addEventListener("click", () => {
    if (paginator) {
      const moreAvailable = paginator.displayPage(paginator.currentPage + 1); // Increment page number and display next page
      if (!moreAvailable) {
        paginator.hideLoadMoreButton(); // Hide the button if no more pages
      }
    }
  });
}

function toggleFilter(button) {
  const filterType = button.closest(".filter-buttons").id.includes("diet")
    ? "diet"
    : "ingredients";
  const filterValue = button.dataset.filter;

  if (button.classList.contains("active")) {
    button.classList.remove("active");
    activeFilters[filterType] = activeFilters[filterType].filter(
      (f) => f !== filterValue
    );
  } else {
    button.classList.add("active");
    activeFilters[filterType].push(filterValue);
  }

  applyFiltersAndRender(true);
}

window.toggleFilterPopup = function () {
  elements.filterPopup?.classList.toggle("show");
};

function applyFiltersAndRender(resetPage = false) {
  console.log("Applying filters and rendering recipes...");
  if (resetPage) currentPage = 0;

  let filtered = filterRecipes(allRecipes, activeFilters);
  console.log("Filtered recipes:", filtered);

  const pageType = document.body.dataset.page;
  let containerId;
  let showPopularBadge = false;

  if (pageType === "home") {
    filtered = filtered.filter((r) => r.isPopular);
    containerId = "popular-container";
    showPopularBadge = true;
  } else if (pageType === "allmeals") {
    containerId = "all-meals-container";
  } else if (pageType === "dinner") {
    filtered = filtered.filter((r) =>
      r.categories
        ?.toLowerCase()
        .split(",")
        .map((c) => c.trim())
        .includes("dinner")
    );
    containerId = "dinner-recipes-container";
  }

  // Initialize the paginator with filtered recipes
  paginator = new RecipePaginator(
    filtered,
    containerId,
    itemsPerPage,
    elements.loadMoreBtn
  );
  paginator.displayPage(0); // Always display the first page initially

  const sorted = elements.sortSelect
    ? RecipeSorter.sortRecipes(filtered, elements.sortSelect.value)
    : filtered;
  const paginated = sorted.slice(0, (currentPage + 1) * itemsPerPage);

  console.log("Dinner recipes:", pageType === "dinner", filtered);

  console.log("Paginated recipes:", paginated);

  displayRecipes(paginated, containerId, showPopularBadge, resetPage);
  toggleNoResultsMessage(sorted.length === 0);
  toggleLoadMoreButton(sorted.length > paginated.length);
}

function displayRecipes(recipes, containerId, showBadge, replace = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (replace) container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  recipes.forEach((recipe) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.innerHTML = createRecipeCard(recipe, {
      showPopularBadge: showBadge,
    });
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

function toggleLoadMoreButton(show) {
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = show ? "block" : "none";
  }
}
