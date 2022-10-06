const categoriesButton = document.getElementById("categoriesButton");
const categoriesModal = document.getElementById("categoriesModal");
const modalCloseButtons = document.querySelectorAll(".close-button--modal");

const buttonsTriggeringModals = document.querySelectorAll(".input-wrapper");

modalCloseButtons?.forEach(button => {
  button?.addEventListener("click", () => {
    (<HTMLDialogElement>button?.parentElement)?.close();
  });

});

buttonsTriggeringModals?.forEach(button => {
  button?.addEventListener("click", () => {
    const modalId = button?.getAttribute("data-modal");
    const modalToOpen = document.getElementById(modalId || "could not find the modal");
    (<HTMLDialogElement>modalToOpen)?.showModal();
  });

});