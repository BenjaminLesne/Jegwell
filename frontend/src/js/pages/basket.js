import { removeProductFromBasket } from "../utils/functions.js";
const removeProductButtons = document.querySelectorAll(".item__remove");
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
