// filtering.js
import { fetchRecipes } from './recipeAPI.js';
import { createRecipeCard } from './recipeCard.js';


let allRecipes = [];
let activeFilters = {
    diet: [],
    ingredients: []
};


// DOM Elements
const elements = {
    search: document.getElementById('search'),
    sortSelect: document.getElementById('sort-select'),
    popularContainer: document.getElementById('popular-container'),
    otherContainer: document.getElementById('other-recipes-container'),
    popularSection: document.getElementById('popular-recipes'),
    otherSection: document.getElementById('other-recipes'),
    loadMoreBtn: document.getElementById('load-more'),
    filterPopup: document.getElementById('filter-popup'),
    dietFilters: document.getElementById('diet-filters'),
    ingredientsFilters: document.getElementById('ingredients-filters')
};


// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { recipes } = await fetchRecipes();
        allRecipes = recipes;
       
        setupEventListeners();
        applyFilters();
    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes. Please try again later.');
    }
});


function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => toggleFilter(button));
    });


    // Search input
    elements.search.addEventListener('input', () => applyFilters());


    // Sort select
    elements.sortSelect.addEventListener('change', () => applyFilters());


    // Filter popup close button
    document.querySelector('.close-btn').addEventListener('click', toggleFilterPopup);


    // Load more button
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', loadMoreRecipes);
    }
}


function toggleFilter(button) {
    const filterType = button.closest('.filter-buttons').id.includes('diet') ? 'diet' : 'ingredients';
    const filterValue = button.dataset.filter;
   
    // Toggle filter
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        activeFilters[filterType] = activeFilters[filterType].filter(f => f !== filterValue);
    } else {
        button.classList.add('active');
        activeFilters[filterType].push(filterValue);
    }
   
    applyFilters();
}


function toggleFilterPopup() {
    elements.filterPopup.classList.toggle('show');
}


function applyFilters() {
    const searchTerm = elements.search.value.toLowerCase();
    const sortValue = elements.sortSelect.value;
   
    let filteredRecipes = filterRecipes(allRecipes, searchTerm);
    filteredRecipes = sortRecipes(filteredRecipes, sortValue);
   
    displayFilteredRecipes(filteredRecipes);
}


function filterRecipes(recipes, searchTerm) {
    return recipes.filter(recipe => {
        
        if (activeFilters.diet.length > 0) {
            const matchesDiet = activeFilters.diet.some(diet => {
                return recipe.categories.toLowerCase().includes(diet.toLowerCase());
            });
            if (!matchesDiet) return false;
        }
       
        if (activeFilters.ingredients.length > 0) {
            const matchesIngredients = activeFilters.ingredients.some(ingredient => {
                return recipe.categories.toLowerCase().includes(ingredient.toLowerCase());
            });
            if (!matchesIngredients) return false;
        }
       
        if (searchTerm) {
            const matchesSearch =
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
       
        return true;
    });
}


function sortRecipes(recipes, sortBy) {
    switch(sortBy) {
        case 'popular':
            return [...recipes].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        case 'rating':
            return [...recipes].sort((a, b) => b.rating - a.rating);
        case 'time':
            return [...recipes].sort((a, b) => a.time - b.time);
        case 'title':
            return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        default:
            return recipes;
    }
}


function displayFilteredRecipes(filteredRecipes) {
    // Clear existing recipes
    elements.popularContainer.innerHTML = '';
    elements.otherContainer.innerHTML = '';
   
    // Separate popular and other recipes
    const popularRecipes = filteredRecipes.filter(recipe => recipe.isPopular);
    const otherRecipes = filteredRecipes.filter(recipe => !recipe.isPopular);
   
    // Display popular recipes
    if (popularRecipes.length > 0) {
        popularRecipes.forEach(recipe => {
            elements.popularContainer.innerHTML += createRecipeCard(recipe, { showPopularBadge: true });
        });
        elements.popularSection.classList.remove('hidden');
    } else {
        elements.popularSection.classList.add('hidden');
    }
   
    displayOtherRecipesPage(otherRecipes, 0);
   
    toggleNoResultsMessage(filteredRecipes.length === 0);
   
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.style.display =
            otherRecipes.length > 8 ? 'block' : 'none';
    }
}


let currentPage = 0;
const recipesPerPage = 8;


function displayOtherRecipesPage(recipes, page) {
    const startIdx = page * recipesPerPage;
    const endIdx = startIdx + recipesPerPage;
    const pageRecipes = recipes.slice(startIdx, endIdx);
   
    pageRecipes.forEach(recipe => {
        elements.otherContainer.innerHTML += createRecipeCard(recipe);
    });
   
    elements.otherSection.classList.remove('hidden');
}


function loadMoreRecipes() {
    currentPage++;
    const otherRecipes = allRecipes.filter(recipe => !recipe.isPopular);
    displayOtherRecipesPage(otherRecipes, currentPage);
   
    const remainingRecipes = otherRecipes.length - ((currentPage + 1) * recipesPerPage);
    if (remainingRecipes <= 0) {
        elements.loadMoreBtn.style.display = 'none';
    }
}


function toggleNoResultsMessage(show) {
    let message = document.getElementById('no-results-message');
   
    if (show && !message) {
        message = document.createElement('div');
        message.id = 'no-results-message';
        message.className = 'no-results';
        message.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No recipes found</h3>
            <p>Try adjusting your filters or search term</p>
        `;
        document.querySelector('main').appendChild(message);
    } else if (!show && message) {
        message.remove();
    }
}


function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}
