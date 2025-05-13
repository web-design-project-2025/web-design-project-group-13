import { createRecipeCard } from "./recipeCard.js";

export class RecipePaginator {
  constructor(recipes, containerId, itemsPerPage = 8, loadMoreButton) {
    this.recipes = recipes;
    this.container = document.getElementById(containerId);
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 0;
    this.loadMoreButton = loadMoreButton; // Store the load more button reference
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

    // Clear the container only when starting from page 0
    if (pageNumber === 0) {
      this.container.innerHTML = ''; // Clear the container before adding new items
    }

    this.container.appendChild(fragment);
    this.currentPage = pageNumber;

    // Check if there are more recipes to load, and hide the "Load More" button if not
    if (end >= this.recipes.length) {
      this.hideLoadMoreButton();
      return false; // No more recipes to load
    } else {
      return true; // More recipes to load
    }
  }

  hideLoadMoreButton() {
    if (this.loadMoreButton) {
      this.loadMoreButton.style.display = "none"; // Hide the load more button
    }
  }

  showLoadMoreButton() {
    if (this.loadMoreButton) {
      this.loadMoreButton.style.display = "block"; // Show the load more button
    }
  }
}
