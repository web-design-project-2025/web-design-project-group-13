import { createRecipeCard } from "javascript/recipeCard.js";

export class PopularRecipesView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(recipes) {
        if (!this.container) return;

        this.container.innerHTML = recipes
            .map(recipe => createRecipeCard(recipe, { showPopularBadge: true }))
            .join('');
    }
} 