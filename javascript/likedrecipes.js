document.addEventListener("DOMContentLoaded", async function() {
  try {
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
  } catch (error) {
    console.error("Error loading favorite recipes:", error);
    document.getElementById("recipe-container").innerHTML = 
      `<div class="error">Error loading favorites: ${error.message}</div>`;
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // This will handle clicks on existing heart buttons
  document.addEventListener("click", function(e) {
    if (e.target.closest(".heart-button")) {
      const button = e.target.closest(".heart-button");
      const recipeId = button.dataset.recipeId;
      toggleLike(recipeId, button);
    }
  });
});