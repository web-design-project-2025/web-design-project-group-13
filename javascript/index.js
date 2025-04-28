import { loadRecipes, displayRecipes, toggleLike } from './recipeService.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadRecipes();
    displayRecipes(data.recipes);
    
    // Handle like button clicks
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.heart-button');
      if (button) {
        const recipeId = button.dataset.recipeId;
        toggleLike(recipeId, button);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('recipe-container').innerHTML = 
      `<div class="error">Error loading recipes: ${error.message}</div>`;
  }
});