import "../../styles/pages/checkout.scss";
import { getCookie } from "../utils/functions";

const token = document
  .querySelector("[data-token]")
  ?.getAttribute("data-token");
const HOME_PATH = document
  .querySelector(".primary-header-wrapper[data-home-path]")
  ?.getAttribute("data-home-path");
const ORIGIN = window.location.origin;

if (token == null) {
  throw new Error("stripe api token is undefined");
}

const stripe = Stripe(token);

const itemsJson = getCookie("productsToBasket");
const deliveryOption = getCookie("deliveryOption");

function warnUserAboutRedirection(
  message: string,
  request_uri: string,
  errorMessage: string
) {
  const baseUrl = document.querySelector("body")?.baseURI;
  alert(message);
  window.location.replace(baseUrl + request_uri);
  throw new Error(errorMessage);
}

// si l'utilisateur a un panier vide, on le redirige vers la page des produits
if (itemsJson === null || itemsJson === "" || itemsJson === "[]") {
  warnUserAboutRedirection(
    "Votre panier est vide. Vous allez être redirigé vers les créations Jegwell !",
    "/creations",
    "productsToBasket cookie missing"
  );
  throw new Error("The user basket is undefined/empty");
}

// // si l'utilisateur n'a pas de méthode de récupération, on le redirige vers la page de livraison
if (deliveryOption === null || deliveryOption === "") {
  warnUserAboutRedirection(
    "Nous ne trouvons pas votre méthode de récupération. Vous allez être redirigé vers la page de livraison !",
    "/panier/livraison",
    "deliveryOption cookie missing"
  );
  throw new Error("The user delivery option is undefined/empty");
}

// The items the customer wants to buy
const items = JSON.parse(itemsJson);

const order = { products: items, deliveryOption: deliveryOption };
const orderStringified = JSON.stringify(order);

let elements: any;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  ?.addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  let responseClone: any;
  const {
    clientSecret,
    totalPriceInCents,
    error,
  }: { clientSecret?: any; totalPriceInCents?: number; error?: any } =
    await fetch(`${ORIGIN}${HOME_PATH}/src/components/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: orderStringified,
    })
      .then((r) => {
        responseClone = r.clone();
        return r.json();
      })
      .then(
        (data) => {
          return data;
        },
        (rejectionReason) => {
          console.log(
            "Error parsing JSON from response:",
            rejectionReason,
            responseClone
          );
          responseClone?.text().then(function (bodyText: string) {
            console.log(
              "Received the following instead of valid JSON:",
              bodyText
            );
          });
        }
      ); // retourner la reponseJson parsed pour pouvoir récupérer clientSecret et totalPriceInCents /!\

  if (
    error ||
    totalPriceInCents == null ||
    (totalPriceInCents != null && totalPriceInCents < 100)
  ) {
    console.error(error);
    alert("Oups, une erreur est survenue !");
    throw new Error(
      "error || (totalPriceInCents != null && totalPriceInCents < 100)"
    );
  }
  // @ts-ignore
  elements = stripe.elements({ clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  const payButton = document.querySelector("#button-text");
  const totalPriceInEuros = totalPriceInCents / 100;

  if (payButton) {
    payButton.textContent = `Payer ${totalPriceInEuros} € TTC`;
  }
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  setLoading(true);

  const success_url = document
    .querySelector("[data-success-url")
    ?.getAttribute("data-success-url");

  // @ts-ignore
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: success_url,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent?.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Paiement en cours.");
      break;
    case "requires_payment_method":
      showMessage("Votre paiement n'a pas abouti, veuillez réessayer.");
      break;
    default:
      showMessage("Une erreur est survenue.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText: string) {
  const messageContainer = document.querySelector("#payment-message");

  if (messageContainer) {
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 4000);
  } else {
    console.error("messageContainer is undefined");
  }
}

// Show a spinner on payment submission
function setLoading(isLoading: boolean) {
  if (isLoading) {
    // Disable the button and show a spinner
    const submit: HTMLButtonElement | null = document.querySelector("#submit");
    if (submit) {
      submit.disabled = true;
    }
    document.querySelector("#spinner")?.classList.remove("hidden");
    document.querySelector("#button-text")?.classList.add("hidden");
  } else {
    const submit: HTMLButtonElement | null = document.querySelector("#submit");
    if (submit) {
      submit.disabled = false;
    }
    document.querySelector("#spinner")?.classList.add("hidden");
    document.querySelector("#button-text")?.classList.remove("hidden");
  }
}
