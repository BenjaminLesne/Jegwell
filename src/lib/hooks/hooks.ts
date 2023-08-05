import { useReducer, useState } from "react";
import { CLOSE_TYPE, OPEN_TYPE } from "../constants";
import { OrderedProduct } from "../helpers/helpers";
import { OptionOrderedProduct, ProductForModal } from "../types";
import { Prisma } from "@prisma/client";

const PRODUCT_INFO = "orderedProduct";
// const initialModalProps = {
//   [PRODUCT_INFO]: {
//     // id: -1,
//     productId: -1,
//     optionId: -1,
//     quantity: -1,
//   } satisfies ProductForModal,
//   open: false,
// };

const initialQuantityModalProps = {
  [PRODUCT_INFO]: {
    // id: -1,
    productId: -1,
    optionId: -1,
    quantity: -1,
  } satisfies QuantityModalPropsState["orderedProduct"],
  open: false,
};

const initialOptionModalProps = {
  [PRODUCT_INFO]: {
    id: -1,
    productId: -1,
    optionId: -1,
    quantity: -1,
    options: [],
    image: { url: "" },
  } satisfies OptionModalPropsState["orderedProduct"],
  open: false,
};

type OptionModalPropsAction = {
  type: typeof OPEN_TYPE | typeof CLOSE_TYPE;
  value?: OptionModalPropsState[typeof PRODUCT_INFO];
};

// type OptionModalPropsState = QuantityModalPropsState;
type OptionModalPropsState = {
  [PRODUCT_INFO]: OptionOrderedProduct;
  open: boolean;
};

const optionReducer = (
  state: OptionModalPropsState,
  action: OptionModalPropsAction
) => {
  switch (action.type) {
    case OPEN_TYPE:
      if (action.value)
        return {
          open: true,
          [PRODUCT_INFO]: action.value,
        };
      break;

    case CLOSE_TYPE:
      return { ...state, open: false };

    default:
      return state;
  }

  return state;
};

export const useOptionModal = () => {
  const [optionModal, dispatchOptionModal] = useReducer(
    optionReducer,
    initialOptionModalProps
  );

  return { optionModal, dispatchOptionModal };
};

type QuantityModalPropsState = {
  [PRODUCT_INFO]: ProductForModal;
  open: boolean;
};

// Prisma.FactionGetPayload<{
//   include: { owner: true }
// }>
// type QuantityModalPropsState = {
//   [PRODUCT_INFO]: Prisma.ProductGetPayload<{
//     include: {
//       options: {
//         select: {
//           id: true;
//           name: true;
//           price: true;
//         };
//       };
//       image: {
//         select: {
//           url: true;
//         };
//       };
//     };
//   }>;
//   open: boolean;
// };

type QuantityModalPropsAction = {
  type: typeof OPEN_TYPE | typeof CLOSE_TYPE;
  value?: QuantityModalPropsState[typeof PRODUCT_INFO];
};

const quantityReducer = (
  state: QuantityModalPropsState,
  action: QuantityModalPropsAction
) => {
  switch (action.type) {
    case OPEN_TYPE:
      if (action.value)
        return {
          open: true,
          [PRODUCT_INFO]: action.value,
        };
      break;

    case CLOSE_TYPE:
      return { ...state, open: false };

    default:
      return state;
  }

  return state;
};

export const useQuantityModal = () => {
  const [quantityModal, dispatchQuantityModal] = useReducer(
    quantityReducer,
    initialQuantityModalProps
  );

  return { quantityModal, dispatchQuantityModal };
};