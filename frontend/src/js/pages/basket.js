import { removeProductFromBasket, handleBasketQuantityConfirmation, handleOptionConfirm, } from "../utils/functions.js";
const removeProductButtons = document.querySelectorAll(".item__remove");
const quantityModalConfirmButton = document.querySelector('#quantityModal .main-call-to-action');
const optionsModalConfirmButtons = document.querySelectorAll(".optionsModal .main-call-to-action");
removeProductButtons.forEach(button => {
    const productId = button.getAttribute('data-product-id');
    const productOption = button.getAttribute('data-product-option');
    if (productId != null && productOption != null) {
        button.addEventListener("click", () => {
            removeProductFromBasket(productId, productOption);
            window.location.reload();
        });
    }
    else {
        const message = "removeProductButtons.forEach -> button doesn't have a filled 'data-product-id' attribute or 'data-product-option'";
        console.error(message);
        console.info("productId :", productId, "productOption :", productOption);
        alert("Aïe, une erreur est survenue :(");
        throw new Error(message);
    }
});
quantityModalConfirmButton === null || quantityModalConfirmButton === void 0 ? void 0 : quantityModalConfirmButton.addEventListener('click', () => handleBasketQuantityConfirmation(quantityModalConfirmButton));
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
