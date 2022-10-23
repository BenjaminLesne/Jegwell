import { handleFormSubmit } from "../utils/functions.js"
const submitButton: HTMLButtonElement | null = document.querySelector(".form__submit-button");

submitButton?.addEventListener('click', (event) => handleFormSubmit(event))