"use strict";
const buttonsTriggeringModals = document.querySelectorAll(".input-wrapper");
buttonsTriggeringModals === null || buttonsTriggeringModals === void 0 ? void 0 : buttonsTriggeringModals.forEach(button => {
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
        const modalId = button === null || button === void 0 ? void 0 : button.getAttribute("data-modal");
        const modalToOpen = document.getElementById(modalId || "could not find the modal");
        modalToOpen === null || modalToOpen === void 0 ? void 0 : modalToOpen.showModal();
    });
});
