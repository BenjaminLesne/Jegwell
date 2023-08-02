import { useEffect, useReducer, useRef, useState } from "react";
import {
  BASKET_REDUCER_TYPE,
  DEVELOPMENT,
  LOCALE_STORAGE_BASKET_KEY,
  NO_OPTION,
} from "../constants";
import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Stripe, loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";

export async function fetchGetJSON(url: string) {
  try {
    const data: unknown = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

type Address = {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
};

type StripeCustomer = {
  address: Address;
  email: string;
  name: string;
  phone: string;
};

type CheckoutSessionProps = {
  basket: BasketState;
  customer: StripeCustomer;
};

export async function fetchPostJSON(url: string, data: CheckoutSessionProps) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data || {}),
    });
    return (await response.json()) as unknown;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

let stripePromise: Promise<Stripe | null>;
export const getStripe = () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};


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
type OptionId = string;

type UpdateQuantityAction = {
  type: (typeof BASKET_REDUCER_TYPE)["UPDATE_QUANTITY"];
  productId: ProductId;
  optionId: OptionId;
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
  optionId: OptionId;
};

type UpdateOptionAction = {
  type: (typeof BASKET_REDUCER_TYPE)["UPDATE_OPTION"];
  productId: ProductId;
  optionId: OptionId;
  newOptionId: OptionId;
};

type IncrementAction = {
  type: (typeof BASKET_REDUCER_TYPE)["INCREMENT"];
  productId: ProductId;
};

type ResetAction = {
  type: (typeof BASKET_REDUCER_TYPE)["RESET"];
};
export type BasketAction =
  | UpdateQuantityAction
  | SetAction
  | AddAction
  | RemoveAction
  | UpdateOptionAction
  | IncrementAction
  | ResetAction;

export type OrderedProduct = {
  id: string;
  quantity: number;
  optionId: string;
};

function reportUndefinedOrNullVars(...variables: unknown[]) {
  const undefinedOrNullVariables = [];

  for (let i = 0; i < variables.length; i++) {
    if (variables[i] == null) {
      undefinedOrNullVariables.push(`Variable ${String.fromCharCode(65 + i)}`);
    }
  }

  if (undefinedOrNullVariables.length > 0) {
    const message = `The ${undefinedOrNullVariables.join(", ")} ${
      undefinedOrNullVariables.length > 1 ? "are" : "is"
    } undefined or null.`;
    consoleError(message);
  }
}

const basketReducer = (state: BasketState, action: BasketAction) => {
  const { ADD, REMOVE, SET, UPDATE_QUANTITY, UPDATE_OPTION, INCREMENT, RESET } =
    BASKET_REDUCER_TYPE;

  type RemoveFromBasketProps = {
    state: BasketState;
    productId: RemoveAction["productId"];
    optionId: RemoveAction["optionId"];
  };

  function removeFromBasket({
    state,
    productId,
    optionId,
  }: RemoveFromBasketProps) {
    return state.filter(
      (product) => product.id !== productId && product.optionId !== optionId
    );
  }

  switch (action.type) {
    case ADD:
      if (action.product) {
        const optionId = action.product.optionId;
        const productId = action.product.id;
        const targetProduct = state.find(
          (product) => product.id === productId && product.optionId === optionId
        );
        if (targetProduct === undefined) return [...state, action.product];

        const newState = removeFromBasket({ state, productId, optionId });
        const newProduct = {
          ...action.product,
          quantity: action.product.quantity + targetProduct.quantity,
        };
        return [...newState, newProduct];
      }

      consoleError("action.product is undefined");
      break;

    case INCREMENT: {
      const product = state.find((item) => item.id === action.productId);
      if (product?.quantity) {
        const partialState = state.filter((item) => item.id !== product.id);
        return [
          ...partialState,
          { ...product, quantity: product?.quantity + 1 },
        ];
      } else {
        const newProduct = {
          id: action.productId,
          quantity: 1,
          optionId: NO_OPTION,
        };
        return [...state, newProduct];
      }
    }

    case UPDATE_OPTION:
      if (action.optionId && action.productId && action.newOptionId) {
        const updatedState = state.map((product) => {
          if (
            product.id === action.productId &&
            product.optionId === action.optionId
          ) {
            return { ...product, optionId: action.newOptionId };
          }

          return product;
        });

        return updatedState;
      }

      reportUndefinedOrNullVars(
        action.optionId,
        action.productId,
        action.newOptionId
      );
      break;

    case UPDATE_QUANTITY:
      if (
        typeof action.quantity === "number" &&
        action.quantity > 0 &&
        action.productId &&
        action.optionId
      ) {
        let didChange = false;
        const updatedState = state.map((product) => {
          if (
            action.quantity != null &&
            product.id === action.productId &&
            product.optionId === action.optionId
          ) {
            didChange = true;

            return { ...product, quantity: action.quantity };
          }

          return product;
        });

        if (didChange) return updatedState;

        consoleError("Could not find the product to update the quantity");
        return [];
      }
      if (action.quantity === 0) {
        const { productId, optionId } = action;
        return removeFromBasket({ state, productId, optionId });
      }

      reportUndefinedOrNullVars(
        action.quantity,
        action.productId,
        action.optionId
      );
      break;

    case REMOVE:
      if (action.productId) {
        const { optionId, productId } = action;
        return removeFromBasket({ state, productId, optionId });
      }
      consoleError("action.productId is undefined");
      break;

    case RESET:
      return [];

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
