// loadingErrorDisplay.js
export function showLoadingIndicator() {
  const loadingElement = document.getElementById("loading-placeholder");
  if (loadingElement) {
    loadingElement.classList.remove("hidden");
  }
}

export function hideLoadingIndicator() {
  const loadingElement = document.getElementById("loading-placeholder");
  if (loadingElement) {
    loadingElement.classList.add("hidden");
  } 
}

export function showErrorMessage(message) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    errorElement.classList.add("show");
  }
}

export function hideErrorMessage() {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.classList.add("hidden");
    errorElement.classList.remove("show");
  }
}
