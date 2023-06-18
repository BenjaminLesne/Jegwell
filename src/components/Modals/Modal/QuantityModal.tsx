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
import { type OrderedProduct, useBasket } from "~/lib/helpers/helpers";
import { BASKET_REDUCER_TYPE } from "~/lib/constants";

type Props = {
  open: boolean;
  closeModal: () => void;
  orderedProduct: OrderedProduct;
};

const { UPDATE_QUANTITY } = BASKET_REDUCER_TYPE;

export const QuantityModal = ({ open, closeModal, orderedProduct }: Props) => {
  const { dispatchBasket } = useBasket();
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  useEffect(() => {
    orderedProduct && setSelectedQuantity(orderedProduct.quantity);
  }, [orderedProduct]);

  const onConfirm = () => {
    dispatchBasket({
      type: UPDATE_QUANTITY,
      quantity: selectedQuantity,
      productId: orderedProduct.id,
    });
    closeModal();
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-5 text-center">
            Choisissez une quantité :
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="my-9">
            <div className="mx-auto my-10 flex items-center justify-center gap-10 text-4xl">
              <button
                className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary"
                onClick={() => setSelectedQuantity((prev) => prev - 1)}
              >
                <div className="bg-red h-1 w-4 bg-primary"></div>
              </button>
              <span className="text-4xl">{selectedQuantity}</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary"
                onClick={() => setSelectedQuantity((prev) => prev + 1)}
              >
                <div className="flex h-4 w-4 items-center justify-center text-4xl text-primary">
                  +
                </div>
              </button>
            </div>
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
