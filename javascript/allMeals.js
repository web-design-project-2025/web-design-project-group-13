 import { fetchRecipes } from "/javascript/recipeAPI.js";
  import { AllRecipesView } from "/javascript/allRecipesView.js";
  

  document.addEventListener("DOMContentLoaded", async () => {
    const allRecipesView = new AllRecipesView("all-recipes-container", "load-more");
    try {
      const { recipes } = await fetchRecipes();
      allRecipesView.initialize(recipes);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    }
  });