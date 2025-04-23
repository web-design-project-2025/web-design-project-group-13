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
  
      // Add search functionality
      document.getElementById("search").addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".recipe-card");
        
        cards.forEach(card => {
          const title = card.querySelector("h3").textContent.toLowerCase();
          const description = card.querySelector("p").textContent.toLowerCase();
          
          if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    } catch (error) {
      console.error("Error loading favorite recipes:", error);
      document.getElementById("recipe-container").innerHTML = 
        `<div class="error">Error loading favorites: ${error.message}</div>`;
    }
  });