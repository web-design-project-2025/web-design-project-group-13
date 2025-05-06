// chosenRecipe.js
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Running chosenRecipe.js");
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    window.location.href = "/"; // or another fallback
    return;
  }

  try {
    const response = await fetch("/json/recipes.json");
    if (!response.ok) throw new Error("Failed to load recipes");
    const data = await response.json();
    console.log("Fetched recipe data:", data);
    

    const recipe = data.recipes.find((r) => r.id == recipeId);
    if (!recipe) throw new Error("Recipe not found");

    console.log("Looking for recipe ID:", recipeId);
    console.log("Found recipe:", recipe);

    updateRecipeDetails(recipe);

    const similarRecipes = data.recipes
      .filter(
        (r) =>
          r.id != recipeId &&
          r.categories
            .split(", ")
            .some((cat) => recipe.categories.includes(cat))
      )
      .slice(0, 4);

    updateSimilarRecipes(similarRecipes);
    loadReviews(recipe.rating);
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/";
  }
});

function updateRecipeDetails(recipe) {
  if (!recipe) {
    console.error("No recipe passed to updateRecipeDetails");
    return;
  }


  console.log("Updating recipe:", recipe.title);

  document.getElementById("recipe-title").textContent = recipe.title;
  document.getElementById("recipe-main-image").src = recipe.image;
  document.getElementById("recipe-main-image").alt = recipe.title;
//   document.getElementById("recipe-time").textContent = `${recipe.time} Min`;
  document.getElementById('recipe-time').textContent = formatTime(recipe.time);
  document.getElementById("recipe-description").textContent =
    recipe.description;

  const ratingStars =
    "★".repeat(Math.round(recipe.rating)) +
    "☆".repeat(5 - Math.round(recipe.rating));
  document.getElementById(
    "recipe-rating"
  ).innerHTML = `${ratingStars} <a href="#">See more</a>`;
  document.getElementById("review-stars").textContent = ratingStars;
  document.getElementById("review-rating").textContent = `${recipe.rating}/5`;

  const ingredientsTable = document.getElementById("ingredients-table");
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((ing) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td class="ingredient-name">${ing.name}</td><td class="ingredient-measure">${ing.measure}</td>`;
      ingredientsTable.appendChild(row);
    });
  } else {
    ingredientsTable.innerHTML =
      "<tr><td colspan='2'>No ingredients listed.</td></tr>";
  }

  const methodSteps = document.getElementById("method-steps");
  if (recipe.steps && Array.isArray(recipe.steps)) {
    recipe.steps.forEach((step) => {
      const stepDiv = document.createElement("div");
      stepDiv.className = "step";
      stepDiv.innerHTML = `<p>${step}</p>`;
      methodSteps.appendChild(stepDiv);
    });
  } else {
    methodSteps.innerHTML = "<p>No steps provided.</p>";
  }
}

function updateSimilarRecipes(recipes) {
  const similarRecipesContainer = document.getElementById("similar-recipes");
  recipes.forEach((recipe) => {
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.onclick = () =>
      (window.location.href = `/chosenrecipe.html?id=${recipe.id}`);
    similarRecipesContainer.appendChild(img);
  });
}

function loadReviews(rating) {
  const reviewsContainer = document.getElementById("reviews-container");
  const reviews = []; // Add real reviews here or fetch separately
  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    reviewDiv.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="Avatar" />
            <div class="review-content">
                <div class="name-rating">
                    <span>${review.name}</span>
                    <span class="stars">${stars}</span> <span>${review.rating}/5</span>
                </div>
                <p>${review.comment}</p>
            </div>
        `;
    reviewsContainer.appendChild(reviewDiv);
  });
}

function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + ' min' : ''}`;
    }
}