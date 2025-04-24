// Generic recipe loading and display functions
async function loadRecipes() {
    try {
      const response = await fetch("json/recipes.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error loading recipes:", error);
      throw error;
    }
  }
  
  function displayRecipes(recipes, containerId = "recipe-container") {
    const recipeContainer = document.getElementById(containerId);
    recipeContainer.innerHTML = "";
  
    if (!recipes || recipes.length === 0) {
      recipeContainer.innerHTML = '<div class="loading">No recipes found.</div>';
      return;
    }
  
    recipes.forEach(recipe => {
      const recipeCard = createRecipeCard(recipe);
      recipeContainer.appendChild(recipeCard);
    });
  }
  
  function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";
  
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    const isLiked = likedRecipes.includes(recipe.id);
  
    card.innerHTML = `
      <button class="heart-button ${isLiked ? 'liked' : ''}" data-recipe-id="${recipe.id}">
        <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
      <div class="recipe-title">
        <h3>${recipe.title}</h3>
        <div class="rating">
          <span class="fa fa-star checked"></span> ${recipe.rating}
        </div>
      </div>
      <div class="time-details">
        <span class="time-item"><i class="fa fa-clock-o"></i> ${recipe.time.total} min</span>
      </div>
      <p>${recipe.description}</p>
    `;
  
    const heartButton = card.querySelector(".heart-button");
    heartButton.addEventListener("click", function() {
      toggleLike(recipe.id, this);
    });
  
    return card;
  }
  
  function toggleLike(recipeId, buttonElement) {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    const icon = buttonElement.querySelector("i");
    
    if (buttonElement.classList.contains("liked")) {
      // Unlike
      const index = likedRecipes.indexOf(recipeId);
      if (index > -1) likedRecipes.splice(index, 1);
      buttonElement.classList.remove("liked");
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    } else {
      // Like
      likedRecipes.push(recipeId);
      buttonElement.classList.add("liked");
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
    
    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
  }

