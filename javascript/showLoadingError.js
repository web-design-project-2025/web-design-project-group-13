//loading and error display

import {
  showLoadingIndicator,
  hideLoadingIndicator,
  showErrorMessage,
  hideErrorMessage,
} from "javascript/loadingErrorDisplay.js";

showLoadingIndicator();

try {
  hideLoadingIndicator();
} catch (error) {
  hideLoadingIndicator();
  showErrorMessage("Failed to load data. Please try again.");
  setTimeout(hideErrorMessage, 5000);
}
