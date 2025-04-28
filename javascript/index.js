// document.addEventListener("DOMContentLoaded", async function() {
//     try {
//       const recipeContainer = document.getElementById("recipe-container");
//       recipeContainer.innerHTML = '<div class="loading">Loading popular recipes...</div>';
      
//       const data = await loadRecipes();
//       const popularRecipes = data.recipes.filter(recipe => recipe.isPopular);
//       displayRecipes(popularRecipes);
//     } catch (error) {
//       console.error("Error loading popular recipes:", error);
//       document.getElementById("recipe-container").innerHTML = 
//         `<div class="error">Error loading recipes: ${error.message}</div>`;
//     }
//   });