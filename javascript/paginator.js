import { createRecipeCard } from "./recipeCard.js";

export class RecipePaginator {
  constructor(recipes, containerId, itemsPerPage = 4) {
    // Reduced initial load
    this.recipes = recipes;
    this.container = document.getElementById(containerId);
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 0;
  }

  displayPage(pageNumber) {
    const start = pageNumber * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageRecipes = this.recipes.slice(start, end);

    // Use document fragment for batch insertion
    const fragment = document.createDocumentFragment();

    pageRecipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.innerHTML = createRecipeCard(recipe);
      fragment.appendChild(card.firstElementChild);
    });

    this.container.appendChild(fragment);
    this.currentPage = pageNumber;

    return end < this.recipes.length;
  }
}
