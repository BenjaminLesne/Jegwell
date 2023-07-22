import { useReducer, useState } from "react";
import { CLOSE_TYPE, OPEN_TYPE } from "../constants";

const PRODUCT_INFO = "orderedProduct";
const initialModalProps = {
  [PRODUCT_INFO]: {
    id: "-1",
    optionId: "-1",
    quantity: -1,
  },
  open: false,
};

type QuantityModalPropsState = {
  [PRODUCT_INFO]: {
    id: string;
    optionId: string;
    quantity: number;
  };
  open: boolean;
};

type QuantityModalPropsAction = {
  type: typeof OPEN_TYPE | typeof CLOSE_TYPE;
  value?: QuantityModalPropsState[typeof PRODUCT_INFO];
};

type OptionModalPropsAction = QuantityModalPropsAction;
type OptionModalPropsState = QuantityModalPropsState;

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
    initialModalProps
  );

  return { optionModal, dispatchOptionModal };
};
