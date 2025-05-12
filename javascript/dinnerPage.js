// dinnerPage.js
import { fetchRecipes } from "/javascript/recipeAPI.js";
import { AllDinnerView } from "/javascript/allDinnerView.js";
import { filterRecipes } from "/javascript/recipeUtils.js";

const activeFilters = {
  diet: [],
  ingredients: [],
  searchTerm: "",
};

document.addEventListener("DOMContentLoaded", async () => {
  const containerId = "dinner-recipes-container";
  const loadMoreBtnId = "load-more";
  const allDinnerView = new AllDinnerView(containerId, loadMoreBtnId);

  try {
    const { recipes } = await fetchRecipes();
    const dinnerRecipes = recipes.filter((r) =>
      r.categories.toLowerCase().split(",").map((c) => c.trim()).includes("dinner")
    );

    const filtered = filterRecipes(dinnerRecipes, activeFilters);
    allDinnerView.initialize(filtered);
  } catch (error) {
    console.error("Failed to load recipes:", error);
  }
});