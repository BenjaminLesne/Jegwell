"use strict";
// ** HEADER **
const currentRequestUri = location.pathname === "/" ? "/accueil" : location.pathname;
const linkToActivate = document.querySelector(`[data-request-uri="${currentRequestUri}"]`);
const burgerButton = document.getElementById("burger-button");
const mainMenuCloseButton = document.getElementById("main-menu-close-button");
// Afin de montrer sur quelle page l'utilisateur est actuellement:
linkToActivate === null || linkToActivate === void 0 ? void 0 : linkToActivate.classList.add("main-menu__item--active");
// gère l'apparition/disparition du menu de navigation
burgerButton === null || burgerButton === void 0 ? void 0 : burgerButton.addEventListener("click", () => {
    var _a;
    (_a = document.getElementById("main-menu")) === null || _a === void 0 ? void 0 : _a.setAttribute("open", "");
    document.body.style.overflow = "hidden";
});
mainMenuCloseButton === null || mainMenuCloseButton === void 0 ? void 0 : mainMenuCloseButton.addEventListener("click", () => {
    var _a;
    (_a = document.getElementById("main-menu")) === null || _a === void 0 ? void 0 : _a.removeAttribute("open");
    document.body.style.overflow = "auto";
});
