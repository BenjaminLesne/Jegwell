
const buttonsTriggeringModals = document.querySelectorAll(".input-wrapper");

buttonsTriggeringModals?.forEach(button => {
  button?.addEventListener("click", () => {
    const modalId = button?.getAttribute("data-modal");
    const modalToOpen = document.getElementById(modalId || "could not find the modal");
    (<HTMLDialogElement>modalToOpen)?.showModal();
  });

});