// Helper function to get liked recipes from localStorage
export function getLikedRecipes() {
  try {
    return JSON.parse(localStorage.getItem('likedRecipes')) || [];
  } catch (error) {
    console.error("Error reading liked recipes:", error);
    return [];
  }
}

// Update localStorage with new liked state
function updateLikedRecipes(recipeId, shouldLike) {
  const likedRecipes = getLikedRecipes();
  const index = likedRecipes.indexOf(recipeId);
  
  if (shouldLike && index === -1) {
    likedRecipes.push(recipeId);
  } else if (!shouldLike && index > -1) {
    likedRecipes.splice(index, 1);
  }
  
  localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
  return likedRecipes;
}

// Main function to toggle like status
export function toggleLike(recipeId, buttonElement = null) {
  const likedRecipes = getLikedRecipes();
  const isLiked = likedRecipes.includes(recipeId);
  const newLikedState = !isLiked;
  
  // Update storage first
  const updatedLikes = updateLikedRecipes(recipeId, newLikedState);
  
  // Update UI if button element provided
  if (buttonElement) {
    buttonElement.classList.toggle('liked', newLikedState);
    const icon = buttonElement.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-regular', !newLikedState);
      icon.classList.toggle('fa-solid', newLikedState);
    }
  }
  
  // Dispatch event to notify other components
  document.dispatchEvent(new CustomEvent('likeUpdated', {
    detail: { recipeId, isLiked: newLikedState, updatedLikes }
  }));
  
  return newLikedState;
}

// Load recipes from JSON file
export async function loadRecipes() {
  try {
    const response = await fetch("json/recipes.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error loading recipes:", error);
    throw error;
  }
}

// Create recipe card DOM element
export function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  const isLiked = getLikedRecipes().includes(recipe.id);

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

  // Add click handler to heart button
  const heartButton = card.querySelector('.heart-button');
  heartButton.addEventListener('click', function() {
    toggleLike(recipe.id, this);
  });

  return card;
}

// Display recipes in container
export function displayRecipes(recipes, containerId = "recipe-container") {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = "";
  
  if (!recipes || recipes.length === 0) {
    container.innerHTML = '<div class="empty">No recipes found</div>';
    return;
  }
  
  recipes.forEach(recipe => {
    container.appendChild(createRecipeCard(recipe));
  });
}