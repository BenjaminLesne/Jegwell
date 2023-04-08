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

// const addFormToCollection = (e: Event) => {
//   if (e.currentTarget instanceof HTMLElement) {
//     const collectionHolder = document.querySelector(
//       "." + e.currentTarget?.dataset.collectionHolderClass
//     );

//     const item = document.createElement("li");
//     if (
//       collectionHolder != null &&
//       collectionHolder instanceof HTMLElement &&
//       typeof collectionHolder.dataset.index === "number"
//     ) {
//       const value = collectionHolder?.dataset.prototype?.replace(
//         /__name__/g,
//         collectionHolder.dataset.index
//       );
//       if (typeof value === "string") {
//         item.innerHTML = value;
//         collectionHolder.appendChild(item);

//         collectionHolder.dataset.index++;
//       }
//     }
//   }

// };

const addFormToCollection = (e: Event) => {
  const button = e.currentTarget;

  if (button instanceof HTMLButtonElement) {
    const collectionHolder = document.querySelector(
      "." + button?.dataset.collectionHolderClass
    );
    if (collectionHolder instanceof HTMLElement) {
      const item = document.createElement("li");
      const dataSetPrototype = collectionHolder.dataset.prototype;
      let dataSetIndex = collectionHolder.dataset.index;
      if (dataSetPrototype != null && dataSetIndex != null) {
        item.innerHTML = dataSetPrototype.replace(/__name__/g, dataSetIndex);

        collectionHolder.appendChild(item);
        const newIndex = parseInt(dataSetIndex) + 1;

        dataSetIndex = newIndex.toString();
      }
    }
  }
};

document.querySelectorAll(".add_item_link").forEach((btn) => {
  btn.addEventListener("click", addFormToCollection);
});

document.querySelectorAll(".add_item_link").forEach((btn) => {
  btn.addEventListener("click", addFormToCollection);
});
