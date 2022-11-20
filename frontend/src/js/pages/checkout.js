var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { getCookie } from "../utils/functions.js";
const token = (_a = document.querySelector("[data-token]")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-token");
if (token == null) {
    throw new Error("stripe api token is undefined");
}
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = Stripe(token);
const itemsJson = getCookie("productsToBasket");
const deliveryOption = getCookie("deliveryOption");
function warnUserAboutRedirection(message, request_uri, errorMessage) {
    var _a;
    const baseUrl = (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.baseURI;
    alert(message);
    window.location.replace(baseUrl + request_uri);
    throw new Error(errorMessage);
}
// si l'utilisateur a un panier vide, on le redirige vers la page des produits
if (itemsJson === null || itemsJson === '' || itemsJson === '[]') {
    warnUserAboutRedirection("Votre panier est vide. Vous allez être redirigé vers les créations Jegwell !", "/creations", "productsToBasket cookie missing");
    throw new Error("The user basket is undefined/empty");
}
// // si l'utilisateur n'a pas de méthode de récupération, on le redirige vers la page de livraison
if (deliveryOption === null || deliveryOption === '') {
    warnUserAboutRedirection("Nous ne trouvons pas votre méthode de récupération. Vous allez être redirigé vers la page de livraison !", "/panier/livraison", "deliveryOption cookie missing");
    throw new Error("The user delivery option is undefined/empty");
}
// The items the customer wants to buy
const items = JSON.parse(itemsJson);
const order = { products: items, deliveryOption: deliveryOption };
const orderStringified = JSON.stringify(order);
let elements;
initialize();
checkStatus();
(_b = document.querySelector("#payment-form")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handleSubmit);
// Fetches a payment intent and captures the client secret
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        let responseClone;
        const { clientSecret, totalPriceInCents, error } = yield fetch("./src/components/create.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: orderStringified,
        }).then((r) => {
            responseClone = r.clone();
            return r.json();
        }).then((data) => { return data; }, (rejectionReason) => {
            console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
            responseClone.text() // 5
                .then(function (bodyText) {
                console.log('Received the following instead of valid JSON:', bodyText); // 6
            });
        }); // retourner la reponseJson parsed pour pouvoir récupérer clientSecret et totalPriceInCents /!\
        if (error || totalPriceInCents == null || (totalPriceInCents != null && totalPriceInCents < 100)) {
            console.error(error);
            alert("Oups, une erreur est survenue !");
            throw new Error("error || (totalPriceInCents != null && totalPriceInCents < 100)");
        }
        // @ts-ignore
        elements = stripe.elements({ clientSecret });
        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element");
        const payButton = document.querySelector('#button-text');
        const totalPriceInEuros = totalPriceInCents / 100;
        if (payButton) {
            payButton.textContent = `Payer ${totalPriceInEuros} € TTC`;
        }
    });
}
function handleSubmit(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        const success_url = (_a = document.querySelector('[data-success-url')) === null || _a === void 0 ? void 0 : _a.getAttribute("data-success-url");
        // @ts-ignore
        const { error } = yield stripe.confirmPayment({
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
        }
        else {
            showMessage("An unexpected error occurred.");
        }
        setLoading(false);
    });
}
// Fetches the payment intent status after payment submission
function checkStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) {
            return;
        }
        const { paymentIntent } = yield stripe.retrievePaymentIntent(clientSecret);
        switch (paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.status) {
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
    });
}
// ------- UI helpers -------
function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    if (messageContainer) {
        messageContainer.classList.remove("hidden");
        messageContainer.textContent = messageText;
        setTimeout(function () {
            messageContainer.classList.add("hidden");
            messageContainer.textContent = "";
        }, 4000);
    }
    else {
        console.error("messageContainer is undefined");
    }
}
// Show a spinner on payment submission
function setLoading(isLoading) {
    var _a, _b, _c, _d;
    if (isLoading) {
        // Disable the button and show a spinner
        const submit = document.querySelector("#submit");
        if (submit) {
            submit.disabled = true;
        }
        (_a = document.querySelector("#spinner")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document.querySelector("#button-text")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
    }
    else {
        const submit = document.querySelector("#submit");
        if (submit) {
            submit.disabled = false;
        }
        (_c = document.querySelector("#spinner")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        (_d = document.querySelector("#button-text")) === null || _d === void 0 ? void 0 : _d.classList.remove("hidden");
    }
}
