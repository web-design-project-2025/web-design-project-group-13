document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn = document.getElementById("mealsDropdownBtn");
  const dropdownMenu = document.getElementById("mealsDropdownMenu");

  dropdownBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  //Hides the menu if clicking outside
  document.addEventListener("click", (event) => {
    if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
});

document.getElementById('heart-icon').addEventListener('click', function() {
  window.location.href = 'favoritespage.html'; 
});