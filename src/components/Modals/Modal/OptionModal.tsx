import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/AlertDialog/alert-dialog";
import { type OrderedProduct, type BasketAction } from "~/lib/helpers/helpers";
import { BASKET_REDUCER_TYPE } from "~/lib/constants";
import Image from "next/image";

type Props = {
  open: boolean;
  closeModal: () => void;
  orderedProduct: OrderedProduct;
  dispatchBasket: React.Dispatch<BasketAction>;
};

const { UPDATE_QUANTITY } = BASKET_REDUCER_TYPE;

// function createOptionsModal($productId, $product_default_image_url, $productOptions, $alt, $svgs_sprite_url)
export const OptionModal = ({
  open,
  closeModal,
  orderedProduct,
  dispatchBasket,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // useEffect(() => {
  //   orderedProduct && setSelectedQuantity(orderedProduct.quantity);
  // }, [orderedProduct]);

  const onConfirm = () => {
    // dispatchBasket({
    //   type: UPDATE_QUANTITY,
    //   quantity: selectedQuantity,
    //   productId: orderedProduct.id,
    // });
    // closeModal();
  };

  // fixture for developmpent
  const options = [{ name: "Vert", id: "0" }];
  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-5 text-center">
              Choisissez votre option :
            </AlertDialogTitle>
            <AlertDialogDescription asChild className="my-9">
              <ul className="mb-10 flex gap-2">
                <li>
                  <button className="product-option-wrapper">
                    <article className="product-option">
                      <div className="product-option__image-wrapper">
                        <Image src="/hero.webp" alt="Défaut" />
                      </div>
                      <h3 className="product-option__name">Défaut</h3>
                    </article>
                  </button>
                </li>
                {options?.map((option) => (
                  <li key={option.id}>
                    <button
                      className={`${
                        selectedOption === option.id ? "border-solid" : ""
                      }`}
                    >
                      <article className="flex max-w-[250px] flex-col items-center justify-center gap-1 p-4">
                        <div className="aspect-square overflow-hidden rounded">
                          <Image
                            className="h-full w-full object-cover"
                            src="/hero.webp"
                            alt="Défaut"
                          />
                        </div>
                        <span>{option.name}</span>
                      </article>
                    </button>
                  </li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogCancel onClick={closeModal}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-secondary text-primary"
              onClick={onConfirm}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <dialog className="modal optionsModal">
        <button className="close-button close-button--modal">
          <svg className="close-button__cross-icon close-button__cross-icon--modal">
            <use href="$svgs_sprite_url#cross"></use>
          </svg>
        </button>
        <section>
          <h2 className="modal__title">Choisissez votre option :</h2>
          <ul className="product-options-wrapper">
            <li>
              <button className="product-option-wrapper">
                <article className="product-option">
                  <div className="product-option__image-wrapper">
                    <img src="$product_default_image_url" alt="Défaut">
                  </div>
                  <h3 className="product-option__name">Défaut</h3>
                </article>
              </button>
            </li>
            <li>
              <button className="product-option-wrapper">
                <article className="product-option">
                  <div className="product-option__image-wrapper">
                    <img src="$option[image_url]" alt="$alt">
                  </div>
                  <h3 className="product-option__name">$option[name]</h3>
                </article>
              </button>
            </li>
          </ul>
          <button className="main-call-to-action">Confirmer</button>
        </section>
      </dialog> */}
    </>
  );
};
