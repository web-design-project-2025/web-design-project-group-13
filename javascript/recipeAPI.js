const API_URL = '/json/recipes.json';

export async function fetchRecipes() {
    console.log('Starting fetch...');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetch completed successfully', data);
        return {
            recipes: data.recipes || [],
            popularIds: data.popular || []
        };
    } catch (error) {
        console.error('Error in fetchRecipes:', error);
        throw error; // Re-throw to be caught by the caller
    } 
}



export function getPopularRecipes(allRecipes, popularIds) {
    return allRecipes.filter(recipe => popularIds.includes(recipe.id));
}

export function getRegularRecipes(allRecipes, popularIds) { 
    return allRecipes.filter(recipe => !popularIds.includes(recipe.id));
}