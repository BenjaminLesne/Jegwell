import { info } from "console";
import { userInfo } from "os";
import { Product } from "./type";

export function closeMainMenu() {
  document.getElementById("main-menu")?.removeAttribute("open");
  document.body.style.overflow = "auto";
}

export function handleAddToBasket(button: HTMLButtonElement) {
  const product_id = button.getAttribute("data-product-id");
  const product_option = button.getAttribute("data-product-option") ?? "default";
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

    alert("L'ajout au panier n'a pas fonctionné :(")

  } else {
    const currentProductsAddedJson = getCookie("productsToBasket");
    let newProductsAddedJson;

    button.classList.remove('success');

    if (currentProductsAddedJson != null) {
      // != null signifie que un/des produits ont été ajouté au panier

      const currentProductsAdded = JSON.parse(currentProductsAddedJson);

      // si le produit ajouté est déjà dans la panier...
      if (currentProductsAddedJson.includes(product_id)) {

        // récupère l'index du produit dans le tableau trouvé dans les cookies
        const productIndex = currentProductsAdded.findIndex((product: Product) => product.id === product_id && product.option === product_option);

        // on ajoute 1 à sa quantité
        currentProductsAdded[productIndex]['quantity'] += 1;

        newProductsAddedJson = JSON.stringify(currentProductsAdded);

      } else {
        // ajout du produit au panier/cookie sous forme de json
        currentProductsAdded.push({ id: product_id, option: product_option, quantity: 1 });

        newProductsAddedJson = JSON.stringify(currentProductsAdded);
      }

    } else {
      // les cookies ne contiennent aucun produit, on crée le tableau, contenant le produit a ajouté, sous forme de json
      newProductsAddedJson = JSON.stringify([{ id: product_id, option: product_option, quantity: 1 }]);

    }

    addToCookies('productsToBasket', newProductsAddedJson, 365)

    void button.offsetWidth; // déclenche un 'reflow' du navigateur, nécessaire pour relancer l'animation, voir: https://css-tricks.com/restart-css-animation/
    button.classList.add('success');


  }



}


export function removeProductFromBasket(productId: string, productOption: string): void {

  const currentProductsAddedJson = getCookie("productsToBasket");
  if (currentProductsAddedJson) {
    const currentProductsAdded = JSON.parse(currentProductsAddedJson);
    const productIndex = currentProductsAdded.findIndex((product: Product) => product.id === productId && product.option === productOption);

    delete currentProductsAdded[productIndex];

    addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365)
  } else {
    console.error("removeProductFromBasket() -> cookie productsToBasket is empty. We can't remove a product that doesn't exist in the basket")
  }


}

export function openQuantityModal(button: HTMLButtonElement) {
  const productId = button.getAttribute('data-product-id');
  const productOption = button.getAttribute('data-product-option');
  const quantity = button.getAttribute('data-quantity');
  const quantityModal: HTMLDialogElement | null = document.querySelector('#quantityModal');
  const quantityValueModal = quantityModal?.querySelector('.quantity-setter__value');

  const condition = productId != null &&
    quantity != null &&
    parseInt(quantity) > 0 &&
    quantityModal != null &&
    quantityValueModal != null &&
    productOption != null



  if (condition) {
    quantityModal.setAttribute('data-product-id', productId);
    quantityModal.setAttribute('data-product-option', productOption);
    quantityModal.setAttribute('data-quantity', quantity);
    quantityValueModal.textContent = quantity;
    quantityModal.showModal()
  } else {
    console.error("button doesn't have a filled 'data-product-id' attribute or 'data-quantity' > 0");
    alert("Aïe, une erreur est survenue :(")
    throw new Error("button doesn't have a filled 'data-product-id' attribute or 'data-quantity' > 0");

  }
}

export function handleQuantity(isAddition: boolean, button: HTMLButtonElement) {
  const modal = button.parentElement?.closest('dialog');
  const modalQuantityValueElement = modal?.querySelector('.quantity-setter__value');
  const currentQuantity = modal?.getAttribute('data-quantity') ? modal.getAttribute('data-quantity') : modalQuantityValueElement?.textContent;
  let newQuantity;

  if (currentQuantity != null && modal != null && modalQuantityValueElement != null) {
    newQuantity = parseInt(currentQuantity);

    if (isAddition) {
      newQuantity += 1;
    } else {
      newQuantity - 1 < 0 ? 0 : newQuantity -= 1;
    }

    const newQuantityStringified = newQuantity.toString();
    modal.setAttribute('data-quantity', newQuantityStringified)
    modalQuantityValueElement.textContent = newQuantityStringified

  }

}

export function handleBasketQuantityConfirmation(button: HTMLElement) {

  const modal = button.parentElement?.closest("dialog");
  const productId = modal?.getAttribute('data-product-id');
  const productOption = modal?.getAttribute('data-product-option');
  const quantity = modal?.getAttribute('data-quantity');

  if (modal != null && productId != null && quantity != null && productOption != null) {

    updateBasket(productId, productOption, 'quantity', parseInt(quantity))
    window.location.reload()
  } else {
    const message = "handleBasketConfirmation -> modal or productId or quantity or productOption is undefined/null";
    console.error(message)
    throw new Error(message);

  }


}

export function openOptionsModal(button: HTMLButtonElement) {
  const productId = button.getAttribute('data-product-id');
  const productOption = button.getAttribute('data-product-option');
  const optionsModal: HTMLDialogElement | null = document.querySelector(`.optionsModal[data-product-id="${productId}"]`);


  const condition = productId != null && optionsModal != null && productOption != null;

  if (condition) {
    // ceci nous permet d'utiliser une seule modal html pour tous les produits plutôt que 1 modal par produit
    optionsModal.setAttribute('data-product-id', productId);
    optionsModal.setAttribute('data-product-option', productOption);

    showSelectedOption(productId, productOption, optionsModal)

    optionsModal.showModal()
  } else {
    const message = "button doesn't have a filled 'data-product-id' attribute or 'data-option'";
    console.error(message);
    alert("Aïe, une erreur est survenue :(")
    throw new Error(message);

  }
}

export function showSelectedOption(productId: string, productOption: string, optionsModal: HTMLDialogElement) {
  // const optionsModal = document.querySelector(`.optionsModal[data-product-id='${productId}'][data-product-option='${productOption}']`)
  const currentOption = optionsModal?.querySelector(`.product-option-wrapper.selected`)
  const newOption = optionsModal?.querySelector(`.product-option-wrapper[data-product-option='${productOption}']`)

  currentOption?.classList.remove("selected");

  if (newOption) {

    newOption.classList.add("selected");
  } else {
    const message = "currentOption, newOption or optionsModal is undefined/null"
    console.error(message)
    const variables = {
      "optionsModal null ?": optionsModal == null,
      "currentOption null ?": currentOption == null,
      "newOption null ?": newOption == null,
      "productId": productId,
      "productOption": productOption,
    }

    console.table(variables);

    throw new Error(message);

  }


}

export function handleOptionConfirm(optionsModal: HTMLDialogElement) {
  const optionElementSelected = optionsModal.querySelector('.product-option-wrapper.selected');
  const optionSelected = optionElementSelected?.getAttribute('data-product-option');
  const previousOption = optionsModal.getAttribute('data-product-option');
  const productId = optionsModal.getAttribute('data-product-id');

  const condition = optionElementSelected != null &&
    optionSelected != null &&
    previousOption != null &&
    productId != null;

  if (condition) {
    updateBasket(productId, previousOption, "option", optionSelected)

  } else {
    const message = "optionSelected or previousOption or productId is undefined";
    console.table([optionSelected, previousOption, productId])
    throw new Error(message);

  }
}

function getCookie(cookieWanted: string) {
  interface cookiesObject {
    [key: string]: string;
  }
  let cookies: cookiesObject = {};
  document.cookie.split(';').forEach(cookie => {
    let [key, value] = cookie.split('=');
    cookies[key.trim()] = value;
  })
  return cookies[cookieWanted] || null;
}

function updateBasket(productId: string, productOption: string, key: string, value: number | string,) {
  const currentProductsAddedJson = getCookie("productsToBasket");

  if (currentProductsAddedJson) {
    const currentProductsAdded = JSON.parse(currentProductsAddedJson);
    const productIndex = currentProductsAdded.findIndex((product: Product) => {

      const result = product.id === productId && product.option === productOption;

      if (product?.id != null && product?.option != null && result != false) {
        return result;

      } else {
        const message = `could not find index of id:${productId} option: ${productOption}`
        console.table(currentProductsAdded)
        console.table({ "productId": productId, "productOption": productOption })

        throw new Error(message);

      }



    });


    switch (true) {
      case key === 'quantity' && value === 0:
        removeProductFromBasket(productId, productOption)
        window.location.reload();
        break;
      case key === 'option':
        const targetedProductIndex = currentProductsAdded.findIndex((product: Product) => {

          const result = product.id === productId && product.option === value
          console.log(product.option, value, result)

          return result

        });
        if (targetedProductIndex > (-1)) {

          alert(`Vous avez déjà l'option ${value} dans votre panier !`)

        } else {
          if (currentProductsAdded[productIndex] != null) {
            currentProductsAdded[productIndex][key] = value;
            addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365)

            window.location.reload();
          } else {
            const message = "currentProductsAdded[productIndex] is undefined";
            console.table(currentProductsAdded)
            console.log(productIndex);

            throw new Error(message);

          }

        }
        break;

      default:
        currentProductsAdded[productIndex][key] = value;
        addToCookies('productsToBasket', JSON.stringify(currentProductsAdded), 365)
        window.location.reload();

        break;
    }



  } else {
    console.error("updateQuantity() -> cookie productsToBasket is empty. We can't update a product that doesn't exist in the basket")
  }
}

function addToCookies(key: string, value: string, days: number) {

  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // crée une date d'expiration d'un an (365j * 24h * 60min etc.)
  const expiriringDate = ";expires=" + date.toUTCString();

  // ajout du json du/des produits avec une date d'expiration
  document.cookie = key + '=' + value + expiriringDate;

}


