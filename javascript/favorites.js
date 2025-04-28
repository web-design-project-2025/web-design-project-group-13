import { loadRecipes, displayRecipes, toggleLike, getLikedRecipes } from './recipeService.js';

// Add animation styles
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-out {
      animation: fadeOut 0.3s forwards;
    }
    @keyframes fadeOut {
      to { opacity: 0; transform: scale(0.9); }
    }
    .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `;
  document.head.appendChild(style);
}

// Load and display favorite recipes
async function loadFavorites() {
  const container = document.getElementById('recipe-container');
  if (!container) return;
  
  container.innerHTML = '<div class="loading">Loading favorites...</div>';
  
  try {
    const data = await loadRecipes();
    const favorites = data.recipes.filter(recipe => 
      getLikedRecipes().includes(recipe.id)
    );
    
    displayRecipes(favorites);
    
    if (favorites.length === 0) {
      container.innerHTML = '<div class="empty">No favorites yet!</div>';
    }
  } catch (error) {
    container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
}

// Handle unlike with animation
async function handleUnlike(button) {
  const card = button.closest('.recipe-card');
  if (!card) return;
  
  const recipeId = button.dataset.recipeId;
  
  // Start removal animation
  card.classList.add('fade-out');
  
  // Wait for animation to complete
  await new Promise(resolve => {
    card.addEventListener('animationend', resolve, { once: true });
  });
  
  // Remove card from DOM
  card.remove();
  
  // Check if container is now empty
  const container = document.getElementById('recipe-container');
  if (container && container.children.length === 0) {
    container.innerHTML = '<div class="empty">No favorites left!</div>';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Heart button clicks
  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.heart-button');
    if (!button) return;
    
    const recipeId = button.dataset.recipeId;
    const wasLiked = button.classList.contains('liked');
    
    // Immediately update UI
    button.classList.toggle('liked');
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    }
    
    // Process the unlike
    if (wasLiked) {
      await handleUnlike(button);
    }
    
    // Update storage
    toggleLike(recipeId, button);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  addAnimationStyles();
  loadFavorites();
  setupEventListeners();
});