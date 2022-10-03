import { closeMainMenu } from "./utils/functions.js";

// ** HEADER **
const currentRequestUri =
  location.pathname === "/" ? "/accueil" : location.pathname;
const linkToActivate = document.querySelector(
  `[data-request-uri="${currentRequestUri}"]`
);
const burgerButton = document.getElementById("burger-button");
const mainMenuCloseButton = document.getElementById("main-menu-close-button");
const mainMenuLinks = document.querySelectorAll(".main-menu__link");

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


