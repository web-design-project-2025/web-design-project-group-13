// chosenRecipe.js
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Running chosenRecipe.js");
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    console.error("Recipe ID is missing in the URL.");
    window.location.href = "/"; // Redirect to homepage or fallback
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

    // Fix for categories being a string
    const currentCategories = recipe.categories
      ? recipe.categories.split(", ")
      : [];

    const similarRecipes = data.recipes
      .filter((r) => {
        const recipeCategories = r.categories ? r.categories.split(", ") : [];
        return (
          r.id != recipeId &&
          recipeCategories.some((cat) => currentCategories.includes(cat))
        );
      })
      .slice(0, 4);

    console.log("Recipe Categories:", recipe.categories);
    data.recipes.forEach((r) => {
      console.log(`Recipe ID: ${r.id}, Categories:`, r.categories);
    });

    if (similarRecipes.length === 0) {
      console.warn("No similar recipes found for recipe ID:", recipeId);
    } else {
      console.log("Similar recipes found:", similarRecipes);
    }

    updateSimilarRecipes(similarRecipes, recipe);
    displayReviews(recipe);
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/"; // Redirect to homepage or fallback
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
  document.getElementById("recipe-time").textContent = formatTime(recipe.time);
  document.getElementById("recipe-description").textContent =
    recipe.description;

  const ratingStars =
    "★".repeat(Math.round(recipe.rating)) +
    "☆".repeat(5 - Math.round(recipe.rating));
  document.getElementById(
    "recipe-rating"
  ).innerHTML = `${ratingStars} <a href="#" id="see-more-btn">See more</a>`;

  // see more - reviews
  const seeMoreBtn = document.getElementById("see-more-btn");
  seeMoreBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const reviewsTitle = document.getElementById("reviews-title");
    if (reviewsTitle) {
      reviewsTitle.scrollIntoView({ behavior: "smooth" });
    }
  });

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

  document.dispatchEvent(new Event("recipeContentLoaded"));
}

function updateSimilarRecipes(recipes, currentRecipe) {
  const similarRecipesContainer = document.querySelector(".recipe-images");
  if (!similarRecipesContainer) {
    console.error("Similar recipes container not found.");
    return;
  }

  similarRecipesContainer.innerHTML = "";

  // Ensure currentRecipe.categories exists and is a string
  const currentCategories = currentRecipe.categories
    ? currentRecipe.categories.split(", ")
    : [];

  const similarRecipes = recipes.filter((recipe) => {
    // Ensure recipe.categories exists and is a string
    const recipeCategories = recipe.categories
      ? recipe.categories.split(", ")
      : [];
    return (
      recipe.id !== currentRecipe.id &&
      recipeCategories.some((cat) => currentCategories.includes(cat))
    );
  });

  if (similarRecipes.length === 0) {
    similarRecipesContainer.innerHTML = "<p>No similar recipes found.</p>";
    return;
  }

  similarRecipes.forEach((recipe) => {
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.classList.add("similar-recipe-image");
    img.onclick = () =>
      (window.location.href = `chosenrecipe.html?id=${recipe.id}`);
    similarRecipesContainer.appendChild(img);
  });
}

function displayReviews(recipe) {
  const reviewsContainer = document.getElementById("reviews-container");
  const reviewStars = document.getElementById("review-stars");
  const reviewRating = document.getElementById("review-rating");

  // Check if recipe has reviews
  if (!recipe.reviews || !Array.isArray(recipe.reviews)) {
    reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    reviewStars.textContent =
      "★".repeat(Math.round(recipe.rating)) +
      "☆".repeat(5 - Math.round(recipe.rating));
    reviewRating.textContent = `${recipe.rating}/5`;
    return;
  }

  // Calculate average rating from reviews if available
  const averageRating =
    recipe.reviews.length > 0
      ? recipe.reviews.reduce((sum, review) => sum + review.rating, 0) /
        recipe.reviews.length
      : recipe.rating;

  // Display average rating
  const roundedRating = Math.round(averageRating * 10) / 10;
  reviewStars.textContent =
    "★".repeat(Math.round(averageRating)) +
    "☆".repeat(5 - Math.round(averageRating));
  reviewRating.textContent = `${roundedRating}/5`;

  // Clear previous reviews
  reviewsContainer.innerHTML = "";

  // Display each review
  if (recipe.reviews.length === 0) {
    reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  recipe.reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.className = "review";

    reviewElement.innerHTML = `
      <img src="images/ProfilePicture.jpeg" alt="Avatar" />
      
      <div class="review-content">
        <div class="name-rating">
          <span>${review.username || "Anonymous"}</span>

          <div class="stars-rating">
          <span class="stars">${"★".repeat(review.rating)}${"☆".repeat(
      5 - review.rating
    )}</span>
          <span>${review.rating}/5</span>
          </div>
        </div>
        <p>${review.comment}</p>
        ${
          review.date ? `<small class="review-date">${review.date}</small>` : ""
        }
      </div>
    `;

    reviewsContainer.appendChild(reviewElement);
  });
}

function formatTime(minutes) { 
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + " min" : ""}`;
  }
}
