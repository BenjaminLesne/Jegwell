export function closeMainMenu() {
    var _a;
    (_a = document.getElementById("main-menu")) === null || _a === void 0 ? void 0 : _a.removeAttribute("open");
    document.body.style.overflow = "auto";
}
export function handleAddToBasket(button) {
    var _a;
    const product_id = button.getAttribute("data-product-id");
    const product_option = (_a = button.getAttribute("data-product-option")) !== null && _a !== void 0 ? _a : "default";
    const product_quantity_stringified = button.getAttribute("data-product-quantity");
    if (product_id == null) {
        // Ca prenait trop de temps, solution court terme alert(), a l'avenir faire que le code commenté fonctionne:
        // const header = document.querySelector(".primary-header-wrapper");
        // header ? header.innerHTML += '<div class="error-banner">L\'ajout au panier n\'a pas fonctionné :(</div>' : null;
        // ajoute au DOM une bannière informant de l'erreur à l'utilisateur
        // const div = document.createElement("div");
        // div.classList.add("error-banner")
        // const text = document.createTextNode("L'ajout au panier n'a pas fonctionné :(");
        // div.appendChild(text);
        // document.body.appendChild(div);
        console.error("product_id == null || product_quantity_stringified == null - this is true");
        alert("L'ajout au panier n'a pas fonctionné :(");
    }
    else {
        const product_quantity = parseInt(product_quantity_stringified !== null && product_quantity_stringified !== void 0 ? product_quantity_stringified : "-1");
        const currentProductsAddedJson = getCookie("productsToBasket");
        let newProductsAddedJson;
        button.classList.remove('success');
        if (currentProductsAddedJson != null) {
            // != null signifie que un/des produits ont été ajouté au panier
            const currentProductsAdded = JSON.parse(currentProductsAddedJson);
            const productIndex = currentProductsAdded.findIndex((product) => (product === null || product === void 0 ? void 0 : product.id) === product_id && (product === null || product === void 0 ? void 0 : product.option) === product_option);
            // si le produit ajouté est déjà dans la panier...
            if (productIndex > (-1)) {
                // le produit exist déjà,
                // on update sa quantité
                if (product_quantity === (-1)) {
                    currentProductsAdded[productIndex]['quantity'] += 1;
                }
                else {
                    currentProductsAdded[productIndex]['quantity'] += product_quantity;
                }
                newProductsAddedJson = JSON.stringify(currentProductsAdded);
            }
            else {
                const quantity = product_quantity === (-1) ? 1 : product_quantity;
                // ajout du produit au panier/cookie sous forme de json
                currentProductsAdded.push({ id: product_id, option: product_option, quantity: quantity });
                newProductsAddedJson = JSON.stringify(currentProductsAdded);
            }
        }
        else {
            const quantity = product_quantity === (-1) ? 1 : product_quantity;
            // les cookies ne contiennent aucun produit, on crée le tableau, contenant le produit a ajouté, sous forme de json
            newProductsAddedJson = JSON.stringify([{ id: product_id, option: product_option, quantity: quantity }]);
        }
        addToCookies('productsToBasket', newProductsAddedJson, 365);
        void button.offsetWidth; // déclenche un 'reflow' du navigateur, nécessaire pour relancer l'animation, voir: https://css-tricks.com/restart-css-animation/
        button.classList.add('success');
    }
}
export function removeProductFromBasket(productId, productOption) {
    const currentProductsAddedJson = getCookie("productsToBasket");
    if (currentProductsAddedJson) {
        const currentProductsAdded = JSON.parse(currentProductsAddedJson);
        const productIndex = currentProductsAdded.findIndex((product) => (product === null || product === void 0 ? void 0 : product.id) === productId && (product === null || product === void 0 ? void 0 : product.option) === productOption);
        currentProductsAdded.splice(productIndex, 1);
        addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365);
    }
    else {
        console.error("removeProductFromBasket() -> cookie productsToBasket is empty. We can't remove a product that doesn't exist in the basket");
    }
}
export function openQuantityModal(button) {
    const productId = button.getAttribute('data-product-id');
    const productOption = button.getAttribute('data-product-option');
    const quantity = button.getAttribute('data-quantity');
    const quantityModal = document.querySelector('#quantityModal');
    const quantityValueModal = quantityModal === null || quantityModal === void 0 ? void 0 : quantityModal.querySelector('.quantity-setter__value');
    const condition = productId != null &&
        quantity != null &&
        parseInt(quantity) > 0 &&
        quantityModal != null &&
        quantityValueModal != null &&
        productOption != null;
    if (condition) {
        quantityModal.setAttribute('data-product-id', productId);
        quantityModal.setAttribute('data-product-option', productOption);
        quantityModal.setAttribute('data-quantity', quantity);
        quantityValueModal.textContent = quantity;
        quantityModal.showModal();
    }
    else {
        console.error("button doesn't have a filled 'data-product-id' attribute or 'data-quantity' > 0");
        alert("Aïe, une erreur est survenue :(");
        throw new Error("button doesn't have a filled 'data-product-id' attribute or 'data-quantity' > 0");
    }
}
export function handleQuantity(isAddition, button) {
    var _a;
    const modal = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.closest('dialog');
    const modalQuantityValueElement = modal === null || modal === void 0 ? void 0 : modal.querySelector('.quantity-setter__value');
    const currentQuantity = (modal === null || modal === void 0 ? void 0 : modal.getAttribute('data-quantity')) ? modal.getAttribute('data-quantity') : modalQuantityValueElement === null || modalQuantityValueElement === void 0 ? void 0 : modalQuantityValueElement.textContent;
    let newQuantity;
    if (currentQuantity != null && modal != null && modalQuantityValueElement != null) {
        newQuantity = parseInt(currentQuantity);
        if (isAddition) {
            newQuantity += 1;
        }
        else {
            newQuantity - 1 < 0 ? 0 : newQuantity -= 1;
        }
        const newQuantityStringified = newQuantity.toString();
        modal.setAttribute('data-quantity', newQuantityStringified);
        modalQuantityValueElement.textContent = newQuantityStringified;
    }
}
export function handleBasketQuantityConfirmation(button) {
    var _a;
    const modal = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.closest("dialog");
    const productId = modal === null || modal === void 0 ? void 0 : modal.getAttribute('data-product-id');
    const productOption = modal === null || modal === void 0 ? void 0 : modal.getAttribute('data-product-option');
    const quantity = modal === null || modal === void 0 ? void 0 : modal.getAttribute('data-quantity');
    if (modal != null && productId != null && quantity != null && productOption != null) {
        updateBasket(productId, productOption, 'quantity', parseInt(quantity));
    }
    else {
        const message = "handleBasketConfirmation -> modal or productId or quantity or productOption is undefined/null";
        console.error(message);
        throw new Error(message);
    }
}
export function handleSinglePageQuantityConfirmation(button) {
    var _a;
    const modal = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.closest("dialog");
    // const productId = modal?.getAttribute('data-product-id');
    // const productOption = modal?.getAttribute('data-product-option');
    const quantity = modal === null || modal === void 0 ? void 0 : modal.getAttribute('data-quantity');
    const quantitySettingButton = document.querySelector(".setting--quantity");
    const quantityValueElement = quantitySettingButton === null || quantitySettingButton === void 0 ? void 0 : quantitySettingButton.querySelector(".setting__value-span");
    const addToBasketButton = document.querySelector(".information__add-to-basket");
    if ((quantityValueElement === null || quantityValueElement === void 0 ? void 0 : quantityValueElement.textContent) != null && quantity != null && modal != null && addToBasketButton != null) {
        addToBasketButton.setAttribute("data-product-quantity", quantity);
        quantityValueElement.textContent = quantity;
        modal.close();
    }
    else {
        console.log("quantityValueElement", quantityValueElement, quantityValueElement === null || quantityValueElement === void 0 ? void 0 : quantityValueElement.textContent);
        console.log("quantity", quantity);
        console.error("quantityValueElement?.textContent != null && quantity != null && modal != null - this condition is false");
        alert("Oups, une erreur est survenue !");
    }
}
export function openOptionsModal(button) {
    const productId = button.getAttribute('data-product-id');
    const productOption = button.getAttribute('data-product-option');
    const optionsModal = document.querySelector(`.optionsModal[data-product-id="${productId}"]`);
    const condition = productId != null && optionsModal != null && productOption != null;
    if (condition) {
        // ceci nous permet d'utiliser une seule modal html pour tous les produits plutôt que 1 modal par produit
        optionsModal.setAttribute('data-product-id', productId);
        optionsModal.setAttribute('data-product-option', productOption);
        showSelectedOption(productId, productOption, optionsModal);
        optionsModal.showModal();
    }
    else {
        const message = "button doesn't have a filled 'data-product-id' attribute or 'data-option'";
        console.error(message);
        alert("Aïe, une erreur est survenue :(");
        throw new Error(message);
    }
}
export function showSelectedOption(productId, productOption, optionsModal) {
    const currentOption = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.querySelector(`.product-option-wrapper.selected`);
    const newOption = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.querySelector(`.product-option-wrapper[data-product-option='${productOption}']`);
    currentOption === null || currentOption === void 0 ? void 0 : currentOption.classList.remove("selected");
    if (newOption) {
        newOption.classList.add("selected");
    }
    else {
        const message = "currentOption, newOption or optionsModal is undefined/null";
        console.error(message);
        const variables = {
            "optionsModal null ?": optionsModal == null,
            "currentOption null ?": currentOption == null,
            "newOption null ?": newOption == null,
            "productId": productId,
            "productOption": productOption,
        };
        console.table(variables);
        throw new Error(message);
    }
}
export function handleOptionConfirm(optionsModal) {
    const optionElementSelected = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.querySelector('.product-option-wrapper.selected');
    const optionSelected = optionElementSelected === null || optionElementSelected === void 0 ? void 0 : optionElementSelected.getAttribute('data-product-option');
    const previousOption = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.getAttribute('data-product-option');
    const productId = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.getAttribute('data-product-id');
    const condition = optionElementSelected != null &&
        optionSelected != null &&
        previousOption != null &&
        productId != null &&
        optionsModal != null;
    if (condition) {
        updateBasket(productId, previousOption, "option", optionSelected);
    }
    else {
        const message = "optionSelected or previousOption or productId is undefined";
        console.table([optionSelected, previousOption, productId]);
        throw new Error(message);
    }
}
export function handleSingleProductOptionConfirm(optionsModal) {
    const optionElementSelected = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.querySelector('.product-option-wrapper.selected');
    const optionSelected = optionElementSelected === null || optionElementSelected === void 0 ? void 0 : optionElementSelected.getAttribute('data-product-option');
    const addToBasketButton = document.querySelector(".information__add-to-basket");
    const settingOptionButton = document.querySelector(".setting--option");
    const valueContainer = settingOptionButton === null || settingOptionButton === void 0 ? void 0 : settingOptionButton.querySelector(".setting__value-span");
    const mediaScroller = document.querySelector(".media-scroller");
    const targetMediaElement = document.querySelector(`.media-element[data-product-option="${optionSelected}"]`);
    const condition = optionElementSelected != null &&
        optionSelected != null &&
        optionsModal != null &&
        addToBasketButton != null &&
        valueContainer != null &&
        mediaScroller != null &&
        targetMediaElement != null;
    if (condition) {
        addToBasketButton.setAttribute("data-product-option", optionSelected);
        valueContainer.textContent = optionSelected;
        targetMediaElement.scrollIntoView({ block: "end" });
        optionsModal.close();
    }
    else {
        const message = "could not update single product button attributes";
        console.error(message);
        console.log(optionElementSelected, optionSelected, optionsModal, addToBasketButton, valueContainer, mediaScroller, targetMediaElement);
        alert('Oups, une erreur est survenue');
        throw new Error(message);
    }
}
export function getCookie(cookieWanted) {
    let cookies = {};
    document.cookie.split(';').forEach(cookie => {
        let [key, value] = cookie.split('=');
        cookies[key.trim()] = value;
    });
    return cookies[cookieWanted] || null;
}
function updateBasket(productId, productOption, key, value) {
    const currentProductsAddedJson = getCookie("productsToBasket");
    if (currentProductsAddedJson) {
        const currentProductsAdded = JSON.parse(currentProductsAddedJson);
        const productIndex = currentProductsAdded.findIndex((product) => {
            const result = (product === null || product === void 0 ? void 0 : product.id) === productId && (product === null || product === void 0 ? void 0 : product.option) === productOption;
            if ((product === null || product === void 0 ? void 0 : product.id) != null && (product === null || product === void 0 ? void 0 : product.option) != null && result != false) {
                return result;
            }
        });
        switch (true) {
            case key === 'quantity' && value === 0:
                removeProductFromBasket(productId, productOption);
                window.location.reload();
                break;
            case key === 'option':
                const targetedProductIndex = currentProductsAdded.findIndex((product) => {
                    const result = (product === null || product === void 0 ? void 0 : product.id) === productId && (product === null || product === void 0 ? void 0 : product.option) === value;
                    return result;
                });
                if (targetedProductIndex > (-1)) {
                    alert(`Vous avez déjà l'option ${value} dans votre panier !`);
                }
                else {
                    if (currentProductsAdded[productIndex] != null) {
                        currentProductsAdded[productIndex][key] = value;
                        addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365);
                        window.location.reload();
                    }
                    else {
                        const message = "currentProductsAdded[productIndex] is undefined";
                        console.table(currentProductsAdded);
                        console.log(productIndex);
                        throw new Error(message);
                    }
                }
                break;
            default:
                currentProductsAdded[productIndex][key] = value;
                addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365);
                window.location.reload();
                break;
        }
    }
    else {
        console.error("updateQuantity() -> cookie productsToBasket is empty. We can't update a product that doesn't exist in the basket");
    }
}
export function handleFormSubmit(event) {
    var _a, _b;
    const form = document.querySelector(".form");
    let isFormValid = null;
    // checks all inputs value
    if (form != null) {
        const data = new FormData(form);
        // @ts-ignore
        for (const entry of data) {
            let newRegex = null;
            switch (entry[0]) {
                case "phoneNumber":
                    newRegex = /^[0-9]{10,}$/;
                case "addressLine1":
                case "addressLine2":
                    newRegex = newRegex !== null && newRegex !== void 0 ? newRegex : /[a-z0-9]+/i;
                case "postalCode":
                    newRegex = newRegex !== null && newRegex !== void 0 ? newRegex : /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
                case "email":
                    newRegex = newRegex !== null && newRegex !== void 0 ? newRegex : /^[a-z0-9!-~]+(?:\.[a-z0-9!-~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
                case "firstname":
                case "lastname":
                case "city":
                    const regex = newRegex !== null && newRegex !== void 0 ? newRegex : /^[a-z]+$/i;
                    const result = handleInputValidation(entry, regex);
                    isFormValid = isFormValid !== false ? result : isFormValid;
                    break;
                default:
                    break;
            }
        }
        ;
        const deliveryChosen = document.querySelector(".form__input--radio:checked");
        const deliveryChosenInvalid = (_b = (_a = document.querySelector(".form__input--radio")) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.closest(".form__fieldset--radio.invalid");
        if (deliveryChosen === null) {
            const radioInputs = document.querySelectorAll(".form__input--radio");
            radioInputs.forEach(input => {
                var _a, _b;
                (_b = (_a = input === null || input === void 0 ? void 0 : input.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".form__fieldset--radio")) === null || _b === void 0 ? void 0 : _b.classList.add("invalid");
            });
            isFormValid = false;
        }
        else if (deliveryChosen != null && deliveryChosenInvalid != null) {
            // si une option de livraison est choisi ET que les inputs affichés sont rouge (précédemment invalide)
            const radioInputs = document.querySelectorAll(".form__input--radio");
            radioInputs.forEach(input => {
                var _a, _b;
                // on retire la classe invalid
                (_b = (_a = input === null || input === void 0 ? void 0 : input.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".form__fieldset--radio")) === null || _b === void 0 ? void 0 : _b.classList.remove("invalid");
            });
            isFormValid = isFormValid ? true : isFormValid;
        }
        if (isFormValid === false) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            const firstInvalidInput = document.querySelector(".invalid");
            firstInvalidInput === null || firstInvalidInput === void 0 ? void 0 : firstInvalidInput.scrollIntoView();
        }
    }
    else {
        alert("On ne trouve pas de formulaire sur cette page !");
    }
    function handleInputValidation(entry, regexValue) {
        var _a;
        const input = document.querySelector(`input[name="${entry[0]}"`);
        const required = input === null || input === void 0 ? void 0 : input.hasAttribute("required");
        const additionalCondition = required ? false : entry[1] === "";
        const isRegexFollowed = entry[1].match(regexValue) || additionalCondition;
        const inputLabelWrapper = (_a = input === null || input === void 0 ? void 0 : input.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".form__input-label-wrapper");
        //  trigger invalid class if false
        if (isRegexFollowed === false) {
            inputLabelWrapper === null || inputLabelWrapper === void 0 ? void 0 : inputLabelWrapper.classList.add("invalid");
        }
        else {
            inputLabelWrapper === null || inputLabelWrapper === void 0 ? void 0 : inputLabelWrapper.classList.remove("invalid");
        }
        return isRegexFollowed;
    }
}
export function deleteCookie(name) {
    addToCookies(name, "", 0);
}
export function handleAfterPaymentSucceeded() {
    // delete productsToBasket and deliveryOption cookie
    deleteCookie("productsToBasket");
    deleteCookie("deliveryOption");
}
function addToCookies(key, value, days) {
    var _a, _b;
    const HOME_PATH = (_b = (_a = document.querySelector(".primary-header-wrapper")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-home-path")) !== null && _b !== void 0 ? _b : "/";
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // crée une date d'expiration d'un an (365j * 24h * 60min etc.)
    const expiriringDate = ";expires=" + date.toUTCString();
    // ajout du json du/des produits avec une date d'expiration
    document.cookie = key + '=' + value + expiriringDate + ';SameSite=Strict' + `;path=${HOME_PATH}`;
}
