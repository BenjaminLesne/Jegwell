import { handleFormSubmit } from "../utils/functions.js";
const submitButton = document.querySelector(".form__submit-button");
submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', (event) => handleFormSubmit(event));
