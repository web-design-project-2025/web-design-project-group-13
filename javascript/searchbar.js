// search.js
export class RecipeSearch {
    constructor(searchInput, recipeApp) {
      this.searchInput = searchInput;
      this.recipeApp = recipeApp;
      this.searchTerm = '';
      this.debounceTimeout = null;
      
      this.initialize();
    }
  
    initialize() {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }
  
    handleSearch(event) {
      clearTimeout(this.debounceTimeout);
      
      // Debounce to avoid too many rapid searches
      this.debounceTimeout = setTimeout(() => {
        this.searchTerm = event.target.value.toLowerCase().trim();
        this.recipeApp.applyFiltersAndSort();
      }, 300);
    }
  
    filterRecipes(recipes) {
      if (!this.searchTerm) return recipes;
      
      return recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(this.searchTerm)
      );
    }
  }