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
import { type BasketAction, cn } from "~/lib/helpers/helpers";
import { BASKET_REDUCER_TYPE, NO_OPTION } from "~/lib/constants";
import Image from "next/image";
import { type ProductForModal } from "~/lib/types";

type OnOptionConfirm = (
  dispatchBasketArgs: Extract<
    BasketAction,
    {
      type: (typeof BASKET_REDUCER_TYPE)["UPDATE_OPTION"];
    }
  >
) => void;

type Props = {
  open: boolean;
  closeModal: () => void;
  orderedProduct: ProductForModal;
  onConfirmation: React.Dispatch<BasketAction> | OnOptionConfirm;
};

const { UPDATE_OPTION } = BASKET_REDUCER_TYPE;
const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = IMAGE_WIDTH;

export const OptionModal = ({
  open,
  closeModal,
  orderedProduct,
  onConfirmation,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    orderedProduct && setSelectedOption(orderedProduct.optionId);
  }, [orderedProduct]);

  const onConfirm = () => {
    onConfirmation({
      type: UPDATE_OPTION,
      newOptionId: selectedOption,
      productId: orderedProduct.productId,
      optionId: orderedProduct.optionId,
    });
    closeModal();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-5 text-center">
            Choisissez votre option :
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="my-9">
            <ul className="mb-10 flex gap-2">
              <li>
                <button
                  className={cn(
                    selectedOption === NO_OPTION ? "border-2" : "border-0",
                    "border-solid",
                    "border-black",
                    "rounded"
                  )}
                  onClick={() => setSelectedOption(NO_OPTION)}
                >
                  <article className="flex max-w-[250px] flex-col items-center justify-center gap-1 p-4">
                    <div className="aspect-square overflow-hidden rounded">
                      <Image
                        className="h-full w-full object-cover"
                        src="/hero.webp"
                        alt="Défaut"
                        width={IMAGE_WIDTH}
                        height={IMAGE_HEIGHT}
                      />
                    </div>
                    <span>Original</span>
                  </article>
                </button>
              </li>
              {orderedProduct.options?.map((option) => (
                <li key={option.id}>
                  <button
                    className={cn(
                      selectedOption === option.id ? "border-2" : "border-0",
                      "border-solid",
                      "border-black",
                      "rounded"
                    )}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <article className="flex max-w-[250px] flex-col items-center justify-center gap-1 p-4">
                      <div className="aspect-square overflow-hidden rounded">
                        <Image
                          className="h-full w-full object-cover"
                          src="/hero.webp"
                          alt="Défaut"
                          width={IMAGE_WIDTH}
                          height={IMAGE_HEIGHT}
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
  );
};
