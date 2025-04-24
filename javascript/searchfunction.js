document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".recipe-card");
        
        cards.forEach(card => {
          const title = card.querySelector("h3").textContent.toLowerCase();
          const description = card.querySelector("p").textContent.toLowerCase();
          
          if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  }); 

  