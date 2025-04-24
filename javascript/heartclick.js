document.addEventListener("DOMContentLoaded", function() {
    // This will handle clicks on existing heart buttons
    document.addEventListener("click", function(e) {
      if (e.target.closest(".heart-button")) {
        const button = e.target.closest(".heart-button");
        const recipeId = button.dataset.recipeId;
        toggleLike(recipeId, button);
      }
    });
  });