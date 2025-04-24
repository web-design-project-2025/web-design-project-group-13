let allRecipes = [];
let filteredRecipes = [];
let currentDisplayIndex = 0;
const recipesPerPage = 8;

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");

  // Load recipes on page load
  loadRecipes().then(data => {
    allRecipes = data.recipes;
    applyFilters(true);
  });

  if (searchInput) {
    const savedSearch = localStorage.getItem("searchTerm") || "";
    searchInput.value = savedSearch;

    searchInput.addEventListener("input", function (e) {
      localStorage.setItem("searchTerm", e.target.value.toLowerCase());
      applyFilters(true); // Reset 
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      applyFilters(true); // Reset 
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      applyFilters(false); // Load more, don’t reset
    });
  }
});

function applyFilters(reset = false) {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-select");

  const searchTerm = searchInput.value.toLowerCase();

  // Filter
  filteredRecipes = allRecipes.filter(recipe =>
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