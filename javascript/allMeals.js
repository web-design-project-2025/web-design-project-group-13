// allmeals.js
import { fetchRecipes } from "/javascript/recipeAPI.js";
import { AllDinnerView } from "/javascript/allDinnerView.js";
import { filterRecipes } from "/javascript/recipeUtils.js";

const activeFilters = {
  diet: [],
  ingredients: [],
  searchTerm: "",
};

document.addEventListener("DOMContentLoaded", async () => {
  const containerId = "all-recipes-container";
  const loadMoreBtnId = "load-more";
  const allDinnerView = new AllDinnerView(containerId, loadMoreBtnId);

  try {
    const { recipes } = await fetchRecipes();
    const filtered = filterRecipes(recipes, activeFilters);
    allDinnerView.initialize(filtered);
  } catch (error) {
    console.error("Failed to load recipes:", error);
  }
});