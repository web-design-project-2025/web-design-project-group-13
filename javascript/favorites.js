import { loadRecipes, displayRecipes, toggleLike } from './recipeService.js';

document.addEventListener("DOMContentLoaded", async function() {
  try {
    await loadAndDisplayFavorites();
    
    // Add fade animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
      .recipe-card {
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("recipe-container").innerHTML = 
      `<div class="error">Error: ${error.message}</div>`;
  }
});

async function loadAndDisplayFavorites() {
  const recipeContainer = document.getElementById("recipe-container");
  recipeContainer.innerHTML = '<div class="loading">Loading your favorites...</div>';
  
  const data = await loadRecipes();
  const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || [];
  const favoriteRecipes = data.recipes.filter(recipe => likedRecipes.includes(recipe.id));
  
  if (favoriteRecipes.length === 0) {
    recipeContainer.innerHTML = '<div class="loading">You haven\'t liked any recipes yet.</div>';
  } else {
    displayRecipes(favoriteRecipes);
  }
}

// Handle click events for unlike
document.addEventListener("click", function(e) {
  if (e.target.closest(".heart-button")) {
    const button = e.target.closest(".heart-button");
    const recipeId = button.dataset.recipeId;
    toggleLike(recipeId, button);
  }
});