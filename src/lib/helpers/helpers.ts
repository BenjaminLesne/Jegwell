import { useEffect, useReducer, useRef, useState } from "react";
import {
  BASKET_REDUCER_TYPE,
  DEVELOPMENT,
  LOCALE_STORAGE_BASKET_KEY,
} from "../constants";
import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type GetSelectFieldsProps = {
  fields: string[];
  authorizedFields: readonly string[];
};

export function getSelectFields({
  fields,
  authorizedFields,
}: GetSelectFieldsProps) {
  type SelectField = { [k: string]: SelectField | boolean };
  const selectFields: SelectField = {};

  fields.forEach((field) => {
    if (!authorizedFields.includes(field)) return;

    const fieldParts = field.split(".");
    let currentField = selectFields;

    for (let i = 0; i < fieldParts.length; i++) {
      const fieldName = fieldParts[i];
      if (fieldName == null) continue;

      const isLastField = i === fieldParts.length - 1;

      if (!currentField[fieldName]) {
        if (isLastField) {
          currentField[fieldName] = true;
        } else {
          currentField[fieldName] = { select: {} };
        }
      }

      currentField = (currentField[fieldName] as Record<string, object>)
        .select as typeof selectFields;
    }
  });

  return selectFields;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(price)
    .replace(/\D00(?=\D*$)/, "");
}

export const getPrices = (pricesElement: (SVGElement | HTMLElement)[]) =>
  pricesElement.map((element) => {
    const priceAsString = element.textContent?.replace(/[\s€]/g, "");
    if (typeof priceAsString !== "string") return NaN;

    return parseFloat(priceAsString);
  });

export const getNames = (namesElement: (SVGElement | HTMLElement)[]) =>
  namesElement.map((element) => {
    const name = element.textContent;
    if (typeof name !== "string" || name === "")
      throw Error("The product name is undefined");

    return name;
  });

export type isSortedProps = {
  array: (string | number)[];
  order: "asc" | "desc";
};
export function isSorted({ array, order }: isSortedProps) {
  if (array.length < 2) return true;

  let lastItem;
  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    if (currentItem == null) continue;
    if (lastItem == null) {
      lastItem = currentItem;
      continue;
    }
    if (order === "asc" && currentItem < lastItem) return false;
    if (order === "desc" && currentItem > lastItem) return false;
  }
  return true;
}
// BASKET RELATED
const orderedProductSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
    optionId: z.string(),
  })
);
type BasketState = OrderedProduct[];

type ProductId = string;
type Quantity = number;

type UpdateQuantityAction = {
  type: (typeof BASKET_REDUCER_TYPE)["UPDATE_QUANTITY"];
  productId: ProductId;
  quantity: Quantity;
};

type SetAction = {
  type: (typeof BASKET_REDUCER_TYPE)["SET"];
  newBasket: BasketState;
};

type AddAction = {
  type: (typeof BASKET_REDUCER_TYPE)["ADD"];
  product: BasketState[0];
};

type RemoveAction = {
  type: (typeof BASKET_REDUCER_TYPE)["REMOVE"];
  productId: ProductId;
};

export type BasketAction =
  | UpdateQuantityAction
  | SetAction
  | AddAction
  | RemoveAction;

export type OrderedProduct = {
  id: string;
  quantity: number;
  optionId: string;
};
const basketReducer = (state: BasketState, action: BasketAction) => {
  const { ADD, REMOVE, SET, UPDATE_QUANTITY } = BASKET_REDUCER_TYPE;

  function removeFromBasket(
    state: BasketState,
    productId: RemoveAction["productId"]
  ) {
    return state.filter((product) => product.id !== productId);
  }

  switch (action.type) {
    case ADD:
      if (action.product) return [...state, action.product];

      consoleError("action.product is undefined");
      break;

    case UPDATE_QUANTITY:
      if (action.quantity && action.quantity > 0 && action.productId) {
        const updatedState = state.map((product) => {
          if (action.quantity != null && product.id === action.productId) {
            return { ...product, quantity: action.quantity };
          }

          return product;
        });

        return updatedState;
      }
      if (action.quantity === 0) {
        return removeFromBasket(state, action.productId);
      }

      consoleError("quantity and/or productId is undefined");
      break;

    case REMOVE:
      if (action.productId) {
        return removeFromBasket(state, action.productId);
      }
      consoleError("action.productId is undefined");
      break;

    case SET:
      if (action.newBasket) {
        return action.newBasket;
      }
      consoleError("action.newBasket is undefined");
      break;

    default:
      return state;
  }

  return state;
};

export const useBasket = () => {
  const initialState: BasketState = [];
  const [basket, dispatchBasket] = useReducer(basketReducer, initialState);

  const { SET } = BASKET_REDUCER_TYPE;
  const isFirstRender = useRef(true);

  useEffect(() => {
    const newBasketStringified = localStorage.getItem(
      LOCALE_STORAGE_BASKET_KEY
    );

    if (newBasketStringified) {
      const newBasket = orderedProductSchema.parse(
        JSON.parse(newBasketStringified)
      );
      dispatchBasket({ type: SET, newBasket });
    }
  }, []);

  useEffect(() => {
    const newBasketStringified = localStorage.getItem(
      LOCALE_STORAGE_BASKET_KEY
    );

    if (newBasketStringified) {
      try {
        const newBasket = orderedProductSchema.parse(
          JSON.parse(newBasketStringified)
        );
        dispatchBasket({ type: SET, newBasket });
      } catch (error) {
        consoleError("Failed to parse the basket from localStorage", error);
        localStorage.removeItem(LOCALE_STORAGE_BASKET_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem(LOCALE_STORAGE_BASKET_KEY, JSON.stringify(basket));
  }, [basket]);

  return { basket, dispatchBasket };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function consoleError(...values: unknown[]) {
  if (process.env.NODE_ENV === DEVELOPMENT) {
    console.error(...values);
  }
}
