// recipeUtils.js
export function filterRecipes(recipes, { diet = [], ingredients = [], searchTerm = "" }) {
  return recipes.filter((recipe) => {
    const categories = recipe.categories.toLowerCase();

    const matchesDiet =
      diet.length === 0 || diet.some((d) => categories.includes(d.toLowerCase()));
    const matchesIngredients =
      ingredients.length === 0 ||
      ingredients.some((i) => categories.includes(i.toLowerCase()));
    const matchesSearch =
      !searchTerm ||
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm);

    return matchesDiet && matchesIngredients && matchesSearch;
  });
}