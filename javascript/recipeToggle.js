document.addEventListener("recipeContentLoaded", () => {
  console.log("Running recipetoggle.js");

  const ingredientToggle = document.getElementById("ingredients-toggle");
  const stepToggle = document.getElementById("steps-toggle");
  const sections = document.querySelectorAll(".recipe-section");
  const ingredientSection = sections[0];
  const stepSection = sections[1];

  // Function to show only one section
  function showOnly(targetSection, hideSection) {
    targetSection.classList.remove("hidden");
    hideSection.classList.add("hidden");
  }

  // Function to handle toggle behavior
  function handleToggleBehavior() {
    if (window.innerWidth <= 768) {
      // Mobile behavior - enable toggling
      ingredientToggle.addEventListener("click", mobileToggleHandler);
      stepToggle.addEventListener("click", mobileToggleHandler);
      
      // Ensure only one section is visible initially
      if (ingredientSection.classList.contains("hidden") && 
          stepSection.classList.contains("hidden")) {
        ingredientSection.classList.remove("hidden");
      }
    } else {
      // Desktop behavior - disable toggling
      ingredientToggle.removeEventListener("click", mobileToggleHandler);
      stepToggle.removeEventListener("click", mobileToggleHandler);
      
      // Show both sections
      ingredientSection.classList.remove("hidden");
      stepSection.classList.remove("hidden");
    }
  }

  // Mobile toggle handler function
  function mobileToggleHandler(e) {
    if (e.currentTarget === ingredientToggle) {
      showOnly(ingredientSection, stepSection);
    } else {
      showOnly(stepSection, ingredientSection);
    }
  }

  // Initial setup
  handleToggleBehavior();

  // Update on window resize with debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleToggleBehavior, 100);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const images = document.querySelectorAll(".recipe-image-mini");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  
  if (!carousel || !images.length) return;

  // Create indicators
  images.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => scrollToImage(index));
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = document.querySelectorAll(".carousel-indicator");
  
  function updateIndicators() {
    const scrollPosition = carousel.scrollLeft;
    const imageWidth = images[0].offsetWidth + 20; 
    const activeIndex = Math.round(scrollPosition / imageWidth);
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === activeIndex);
    });
  }

  function scrollToImage(index) {
    const imageWidth = images[0].offsetWidth + 20;
    carousel.scrollTo({
      left: index * imageWidth,
      behavior: "smooth"
    });
  }

  carousel.addEventListener("scroll", updateIndicators);
  
  leftArrow.addEventListener("click", () => {
    carousel.scrollBy({
      left: - (images[0].offsetWidth + 20),
      behavior: "smooth"
    });
  });

  rightArrow.addEventListener("click", () => {
    carousel.scrollBy({
      left: images[0].offsetWidth + 20,
      behavior: "smooth"
    });
  });

  // Handle touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      carousel.scrollBy({
        left: images[0].offsetWidth + 20,
        behavior: "smooth"
      });
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right
      carousel.scrollBy({
        left: - (images[0].offsetWidth + 20),
        behavior: "smooth"
      });
    }
  }
});
