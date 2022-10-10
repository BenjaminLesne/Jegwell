export function closeMainMenu() {
  document.getElementById("main-menu")?.removeAttribute("open");
  document.body.style.overflow = "auto";
}

export function getCookie(cookieWanted: string) {
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

export function handleAddToBasket(button: HTMLButtonElement) {
  const product_id = button.getAttribute("data-product-id");
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
        const productIndex = currentProductsAdded.findIndex((product: { id: string, quantity: number }) => product.id === product_id);
        // on ajoute 1 à sa quantité
        currentProductsAdded[productIndex]['quantity'] += 1;

        newProductsAddedJson = JSON.stringify(currentProductsAdded);

      } else {
        // ajout du produit au panier/cookie sous forme de json
        const newProductToAdd = { id: product_id, quantity: 1 };
        currentProductsAdded.push(newProductToAdd);
        newProductsAddedJson = JSON.stringify(currentProductsAdded);
      }

    } else {
      // les cookies ne contiennent aucun produit, on crée le tableau, contenant le produit a ajouté, sous forme de json
      newProductsAddedJson = JSON.stringify([{ id: product_id, quantity: 1 }]);

    }

    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // crée une date d'expiration d'un an (365j * 24h * 60min etc.)
    const expiriringDate = ";expires=" + date.toUTCString();

    // ajout du json du/des produits avec une date d'expiration
    document.cookie = 'productsToBasket=' + newProductsAddedJson + expiriringDate;

    void button.offsetWidth; // déclenche un 'reflow' du navigateur, nécessaire pour relancer l'animation rapidement voir: https://css-tricks.com/restart-css-animation/
    button.classList.add('success');


  }



}
