import {
  closeMainMenu,
  handleAddToBasket,
  openQuantityModal,
  handleQuantity,
  handleBasketQuantityConfirmation,
  openOptionsModal,
  showSelectedOption,
  handleOptionConfirm
} from "./utils/functions.js";


// ** HEADER **
const currentRequestUri =
  location.pathname === "/" ? "/accueil" : location.pathname;
const linkToActivate = document.querySelector(
  `[data-request-uri="${currentRequestUri}"]`
);
const burgerButton = document.getElementById("burger-button");
const mainMenuCloseButton = document.getElementById("main-menu-close-button");
const mainMenuLinks = document.querySelectorAll(".main-menu__link");
const addToBasketButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".product__call-to-action-wrapper");
const modalCloseButtons = document.querySelectorAll(".close-button--modal");

const quantityButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".setting--quantity");
const quantitySetterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".quantity-setter__button");
const quantityModalConfirmButton: HTMLElement | null = document.querySelector('#quantityModal .main-call-to-action');

const optionsButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".setting--option");
const productOptionWrapperAll: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".product-option-wrapper");
const optionsModalConfirmButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".optionsModal .main-call-to-action");




// Afin de montrer sur quelle page l'utilisateur est actuellement:
linkToActivate?.classList.add("main-menu__item--active");

// gère l'apparition/disparition du menu de navigation
burgerButton?.addEventListener("click", () => {
  document.getElementById("main-menu")?.setAttribute("open", "");
  document.body.style.overflow = "hidden";
});

mainMenuCloseButton?.addEventListener("click", () => closeMainMenu());

mainMenuLinks?.forEach(linkElement => {
  linkElement?.addEventListener("click", () => closeMainMenu());
});



addToBasketButtons?.forEach(button => {
  button?.addEventListener("click", () => handleAddToBasket(button));
});


modalCloseButtons?.forEach(button => {
  button?.addEventListener("click", () => {
    (<HTMLDialogElement>button?.parentElement)?.close();
  });

});

// bouton quantité des produits
quantityButtons.forEach((button) => {
  button.addEventListener("click", () => openQuantityModal(button))
});

quantitySetterButtons.forEach(button => {
  const isAddition = button.firstElementChild?.classList.contains("plus");
  if (isAddition != null) {
    button.addEventListener("click", () => handleQuantity(isAddition, button))
  }

})

quantityModalConfirmButton?.addEventListener('click', () => handleBasketQuantityConfirmation(quantityModalConfirmButton))

// boutons option des produits
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => openOptionsModal(button))
});

productOptionWrapperAll.forEach((button) => {
  const productOption = button.getAttribute('data-product-option');
  const productId = button.getAttribute('data-product-id');
  const modal = button.parentElement?.closest("dialog");

  if (productOption != null && productId != null && modal != null) {
    button.addEventListener("click", () => showSelectedOption(productId, productOption, modal))
  }
});


optionsModalConfirmButtons.forEach((button) => {
  const modal: HTMLDialogElement | null | undefined = button.parentElement?.closest('.optionsModal');

  if (modal != null) {
    button.addEventListener("click", () => handleOptionConfirm(modal))
  } else {
    const message = "modal is undefined or null"
    console.error(message)
    throw new Error(message);

  }
});







