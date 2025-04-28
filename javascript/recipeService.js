// Generic recipe loading and display functions
async function loadRecipes() {
  try {
    const response = await fetch("json/recipes.json");
    if (!response.ok) {
      console.error("Failed to fetch recipes:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Loaded recipes:", data); // Debug log
    return data;
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

// Modify toggleLike to use the new function
export function toggleLike(recipeId, buttonElement) {
  const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || [];
  const isCurrentlyLiked = likedRecipes.includes(recipeId);
  
  if (isCurrentlyLiked) {
    // Unlike - remove from array
    const index = likedRecipes.indexOf(recipeId);
    likedRecipes.splice(index, 1);
    
    // If we're on favorites page, remove the card immediately
    if (document.body.dataset.page === "favorites") {
      const card = buttonElement.closest('.recipe-card');
      if (card) {
        card.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => card.remove(), 300);
      }
      
      // Show empty state if no more favorites
      if (likedRecipes.length === 0) {
        document.getElementById('recipe-container').innerHTML = 
          '<div class="loading">You haven\'t liked any recipes yet.</div>';
      }
    }
  } else {
    // Like - add to array
    likedRecipes.push(recipeId);
  }
  
  // Update localStorage
  localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
  
  // Update button appearance
  const icon = buttonElement.querySelector('i');
  buttonElement.classList.toggle('liked', !isCurrentlyLiked);
  icon.classList.toggle('fa-regular', isCurrentlyLiked);
  icon.classList.toggle('fa-solid', !isCurrentlyLiked);
  
  // Dispatch event to notify other components
  document.dispatchEvent(new CustomEvent('likesUpdated', {
    detail: { recipeId, isLiked: !isCurrentlyLiked }
  }));
}

export function updateLikeStatus(recipeId, isLiked) {
  const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || [];
  const index = likedRecipes.indexOf(recipeId);
  
  if (isLiked && index === -1) {
    likedRecipes.push(recipeId);
  } else if (!isLiked && index > -1) {
    likedRecipes.splice(index, 1);
  }
  
  localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
  return likedRecipes;
}



export { loadRecipes, displayRecipes, createRecipeCard };