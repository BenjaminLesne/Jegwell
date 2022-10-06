"use strict";
const categoriesButton = document.getElementById("categoriesButton");
const categoriesModal = document.getElementById("categoriesModal");
const modalCloseButtons = document.querySelectorAll(".close-button--modal");
const buttonsTriggeringModals = document.querySelectorAll(".input-wrapper");
modalCloseButtons === null || modalCloseButtons === void 0 ? void 0 : modalCloseButtons.forEach(button => {
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
        var _a;
        (_a = button === null || button === void 0 ? void 0 : button.parentElement) === null || _a === void 0 ? void 0 : _a.close();
    });
});
buttonsTriggeringModals === null || buttonsTriggeringModals === void 0 ? void 0 : buttonsTriggeringModals.forEach(button => {
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
        const modalId = button === null || button === void 0 ? void 0 : button.getAttribute("data-modal");
        const modalToOpen = document.getElementById(modalId || "could not find the modal");
        modalToOpen === null || modalToOpen === void 0 ? void 0 : modalToOpen.showModal();
    });
});
