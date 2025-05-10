import { fetchRecipes } from "/javascript/recipeAPI.js";
import { AllDinnerView } from "/javascript/allDinnerView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const allDinnerView = new AllDinnerView("dinner-recipes-container", "load-more");

  try {
    const { recipes } = await fetchRecipes();
    console.log("Fetched recipes:", recipes); // Debugging log

    // Strict filtering for exact "dinner" category
    const dinnerRecipes = recipes.filter(recipe => {
      const categoriesArray = recipe.categories
        .split(',')
        .map(cat => cat.trim().toLowerCase());
      return categoriesArray.includes("dinner");
    });

    allDinnerView.initialize(dinnerRecipes);
  } catch (error) {
    console.error("Failed to load recipes:", error);
  }
});
