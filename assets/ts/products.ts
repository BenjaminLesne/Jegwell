import TomSelect from "tom-select";

const buttonsTriggeringModals = document.querySelectorAll(".input-wrapper");

buttonsTriggeringModals?.forEach((button) => {
  button?.addEventListener("click", () => {
    const modalId = button?.getAttribute("data-modal");
    const modalToOpen = document.getElementById(
      modalId || "could not find the modal"
    );
    (<HTMLDialogElement>modalToOpen)?.showModal();
  });
});

const addFormToCollection = (e: Event) => {
  const button = e.currentTarget;

  if (!(button instanceof HTMLButtonElement)) return;

  const collectionHolder = document.querySelector(
    "." + button?.dataset.collectionHolderClass
  );

  if (!(collectionHolder instanceof HTMLElement)) return;

  const item = document.createElement("li");
  const dataSetPrototype = collectionHolder.dataset.prototype;
  let dataSetIndex = collectionHolder.dataset.index;

  if (dataSetPrototype == null || dataSetIndex == null) return;

  item.innerHTML = dataSetPrototype.replace(/__name__/g, dataSetIndex);

  collectionHolder.appendChild(item);
  const newIndex = parseInt(dataSetIndex) + 1;

  dataSetIndex = newIndex.toString();
};

document.querySelectorAll(".add_item_link").forEach((btn) => {
  btn.addEventListener("click", addFormToCollection);
});

const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const inputs = [categorySelect, sortSelect];

inputs.forEach((input) => {
  input?.addEventListener("change", (event) => {
    const currentTarget = event.currentTarget;

    if (currentTarget instanceof HTMLElement) {
      currentTarget?.closest("form")?.submit();
    }
  });
  if (input?.id == null) return;

  new TomSelect("#" + input.id, {
    hideSelected: true,
    closeAfterSelect: true,
    allowEmptyOption: true,
  });
});
