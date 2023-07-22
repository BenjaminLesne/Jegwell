import React, { useEffect, useReducer, useState } from "react";
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

type OnQuantityConfirm = (
  dispatchBasketArgs: Extract<
    BasketAction,
    {
      type: (typeof BASKET_REDUCER_TYPE)["UPDATE_QUANTITY"];
    }
  >
) => void;

type Props = {
  open: boolean;
  closeModal: () => void;
  orderedProduct: OrderedProduct;
  onConfirmation: React.Dispatch<BasketAction> | OnQuantityConfirm;
};

const { UPDATE_QUANTITY } = BASKET_REDUCER_TYPE;
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const SET = "SET";

type IncrementAction = {
  type: typeof INCREMENT;
};
type DecrementAction = {
  type: typeof DECREMENT;
};
type SetAction = {
  type: typeof SET;
  value: number;
};
type Action = IncrementAction | DecrementAction | SetAction;

const selectedQuantityReducer = (currentQuantity: number, action: Action) => {
  switch (action.type) {
    case INCREMENT:
      return currentQuantity + 1;
    case DECREMENT:
      const newQuantity = currentQuantity - 1;
      if (newQuantity < 0) return 0;
      return newQuantity;

    case SET:
      if (action.value < 0) return currentQuantity;

      return action.value;
  }
};

export const QuantityModal = ({
  open,
  closeModal,
  orderedProduct,
  onConfirmation,
}: Props) => {
  const [selectedQuantity, dispatchSelectedQuantity] = useReducer(
    selectedQuantityReducer,
    0
  );

  useEffect(() => {
    orderedProduct &&
      dispatchSelectedQuantity({ type: SET, value: orderedProduct.quantity });
  }, [orderedProduct]);

  const onConfirm = () => {
    onConfirmation({
      type: UPDATE_QUANTITY,
      quantity: selectedQuantity,
      productId: orderedProduct.id,
      optionId: orderedProduct.optionId,
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
                onClick={() => dispatchSelectedQuantity({ type: DECREMENT })}
              >
                <div className="bg-red h-1 w-4 bg-primary"></div>
              </button>
              <span className="text-4xl">{selectedQuantity}</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary"
                onClick={() => dispatchSelectedQuantity({ type: INCREMENT })}
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
