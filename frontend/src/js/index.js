import { closeMainMenu, handleAddToBasket, openQuantityModal, handleQuantity, handleBasketQuantityConfirmation, openOptionsModal, showSelectedOption, handleOptionConfirm, } from "./utils/functions.js";
// ** HEADER **
const currentRequestUri = location.pathname === "/" ? "/accueil" : location.pathname;
const linkToActivate = document.querySelector(`[data-request-uri="${currentRequestUri}"]`);
const burgerButton = document.getElementById("burger-button");
const mainMenuCloseButton = document.getElementById("main-menu-close-button");
const mainMenuLinks = document.querySelectorAll(".main-menu__link");
const addToBasketButtons = document.querySelectorAll(".product__call-to-action-wrapper");
const modalCloseButtons = document.querySelectorAll(".close-button--modal");
const quantityButtons = document.querySelectorAll(".setting--quantity");
const quantitySetterButtons = document.querySelectorAll(".quantity-setter__button");
const quantityModalConfirmButton = document.querySelector('#quantityModal .main-call-to-action');
const optionsButtons = document.querySelectorAll(".setting--option");
const productOptionWrapperAll = document.querySelectorAll(".product-option-wrapper");
const optionsModalConfirmButtons = document.querySelectorAll(".optionsModal .main-call-to-action");
// Afin de montrer sur quelle page l'utilisateur est actuellement:
linkToActivate === null || linkToActivate === void 0 ? void 0 : linkToActivate.classList.add("main-menu__item--active");
// gère l'apparition/disparition du menu de navigation
burgerButton === null || burgerButton === void 0 ? void 0 : burgerButton.addEventListener("click", () => {
    var _a;
    (_a = document.getElementById("main-menu")) === null || _a === void 0 ? void 0 : _a.setAttribute("open", "");
    document.body.style.overflow = "hidden";
});
mainMenuCloseButton === null || mainMenuCloseButton === void 0 ? void 0 : mainMenuCloseButton.addEventListener("click", () => closeMainMenu());
mainMenuLinks === null || mainMenuLinks === void 0 ? void 0 : mainMenuLinks.forEach(linkElement => {
    linkElement === null || linkElement === void 0 ? void 0 : linkElement.addEventListener("click", () => closeMainMenu());
});
addToBasketButtons === null || addToBasketButtons === void 0 ? void 0 : addToBasketButtons.forEach(button => {
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => handleAddToBasket(button));
});
modalCloseButtons === null || modalCloseButtons === void 0 ? void 0 : modalCloseButtons.forEach(button => {
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
        var _a;
        (_a = button === null || button === void 0 ? void 0 : button.parentElement) === null || _a === void 0 ? void 0 : _a.close();
    });
});
// bouton quantité des produits
quantityButtons.forEach((button) => {
    button.addEventListener("click", () => openQuantityModal(button));
});
quantitySetterButtons.forEach(button => {
    var _a;
    const isAddition = (_a = button.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.contains("plus");
    if (isAddition != null) {
        button.addEventListener("click", () => handleQuantity(isAddition, button));
    }
});
quantityModalConfirmButton === null || quantityModalConfirmButton === void 0 ? void 0 : quantityModalConfirmButton.addEventListener('click', () => handleBasketQuantityConfirmation(quantityModalConfirmButton));
// boutons option des produits
optionsButtons.forEach((button) => {
    button.addEventListener("click", () => openOptionsModal(button));
});
productOptionWrapperAll.forEach((button) => {
    var _a;
    const productOption = button.getAttribute('data-product-option');
    const productId = button.getAttribute('data-product-id');
    const modal = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.closest("dialog");
    if (productOption != null && productId != null && modal != null) {
        button.addEventListener("click", () => showSelectedOption(productId, productOption, modal));
    }
});
optionsModalConfirmButtons.forEach((button) => {
    var _a;
    const modal = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.closest('.optionsModal');
    if (modal != null) {
        button.addEventListener("click", () => handleOptionConfirm(modal));
    }
    else {
        const message = "modal is undefined or null";
        console.error(message);
        throw new Error(message);
    }
});
