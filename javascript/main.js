document.addEventListener('DOMContentLoaded', function() {
    loadPopularRecipes();
});

async function loadPopularRecipes() {
    try {
        // Show loading state
        const recipeContainer = document.getElementById('recipe-container');
        recipeContainer.innerHTML = '<div class="loading">Loading popular recipes...</div>';
        
        // Fetch the recipes data from JSON file
        const response = await fetch('json/recipes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Display popular recipes instead of featured
        displayPopularRecipes(data);
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.getElementById('recipe-container').innerHTML = 
            `<div class="error">Error loading recipes: ${error.message}</div>`;
    }
}

function displayPopularRecipes(data) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';
    
    if (!data.popular || data.popular.length === 0) {
        recipeContainer.innerHTML = '<div class="loading">No popular recipes found.</div>';
        return;
    }
    
    // Create a map for quick recipe lookup by ID
    const recipeMap = {};
    data.recipes.forEach(recipe => {
        recipeMap[recipe.id] = recipe;
    });
    
    // Display each popular recipe
    data.popular.forEach(recipeId => {
        const recipe = recipeMap[recipeId];
        if (recipe) {
            const recipeCard = createRecipeCard(recipe);
            recipeContainer.appendChild(recipeCard);
        }
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <div class="time-details">
            <span class="time-item"><i class="fa fa-clock-o"></i> ${recipe.time.total} min</span>
            <span class="time-item">${recipe.category}</span>
        </div>
        <div class="rating">
            <span class="fa fa-star checked"></span> ${recipe.rating}
        </div>
    `;
    
    return card;
}