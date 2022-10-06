import { closeMainMenu, getCookie, handleAddToBasket } from "./utils/functions.js";
//import * as dotenv from "../../node_modules/dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// import * as dotenv from "http://localhost:8080/node_modules/dotenv";
// import * as Sentry from "../../node_modules/@sentry/browser";
// import { BrowserTracing } from "../../node_modules/@sentry/tracing";

// dotenv.config();
// console.log(process.env.SENTRY_JS_DSN);

// Sentry.init({
//   dsn: process.env.SENTRY_JS_DSN,
//   integrations: [new BrowserTracing()],
//   tracesSampleRate: 1.0,
// });

// ** HEADER **
const currentRequestUri =
  location.pathname === "/" ? "/accueil" : location.pathname;
const linkToActivate = document.querySelector(
  `[data-request-uri="${currentRequestUri}"]`
);
const burgerButton = document.getElementById("burger-button");
const mainMenuCloseButton = document.getElementById("main-menu-close-button");
const mainMenuLinks = document.querySelectorAll(".main-menu__link");
const addToBasketButtons = document.querySelectorAll(".product__call-to-action-wrapper");



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


