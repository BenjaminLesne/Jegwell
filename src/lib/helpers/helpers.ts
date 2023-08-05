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
import { type Option, type ProductToBasket } from "@prisma/client";

export type GetSubtotalPriceProps = {
  quantity: OrderedProduct["quantity"];
  optionId: OrderedProduct["optionId"];
  options: {
    id: Option["id"];
    price: Option["price"];
  }[];
  price: Option["price"];
};

export function getSubtotalPrice(items: GetSubtotalPriceProps[]): number {
  let totalPrice = 0;
  for (const item of items) {
    const chosenOption = item.options.find(
      (option) => option.id === item.optionId
    );
    const optionPrice = chosenOption ? chosenOption.price : item.price;
    totalPrice += optionPrice * item.quantity;
  }
  return totalPrice;
}

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
  productsToBasket: BasketState;
  customer: StripeCustomer;
  orderId: number;
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
    productId: z.number(),
    quantity: z.number(),
    optionId: z.number().nullable(),
  })
);
type BasketState = OrderedProduct[];

type UpdateQuantityAction = {
  type: (typeof BASKET_REDUCER_TYPE)["UPDATE_QUANTITY"];
  productId: OrderedProduct["productId"];
  optionId: OrderedProduct["optionId"];
  quantity: OrderedProduct["quantity"];
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
  productId: OrderedProduct["productId"];
  optionId: OrderedProduct["optionId"];
};

type UpdateOptionAction = {
  type: (typeof BASKET_REDUCER_TYPE)["UPDATE_OPTION"];
  productId: OrderedProduct["productId"];
  optionId: OrderedProduct["optionId"];
  newOptionId: OrderedProduct["optionId"];
};

type IncrementAction = {
  type: (typeof BASKET_REDUCER_TYPE)["INCREMENT"];
  productId: OrderedProduct["productId"];
  optionId: OrderedProduct["optionId"];
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

export type OrderedProduct = Omit<ProductToBasket, "id">;

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
  } & Pick<RemoveAction, "productId" | "optionId">;

  function removeFromBasket({
    state,
    productId,
    optionId,
  }: RemoveFromBasketProps) {
    return state.filter((product) => {
      const isSameProduct = product.productId === productId;
      const isSameOption = product.optionId === optionId;

      return !isSameProduct || (isSameProduct && !isSameOption);
    });
  }

  switch (action.type) {
    case ADD:
      if (action.product) {
        const optionId = action.product.optionId;
        const productId = action.product.productId;
        const targetProduct = state.find(
          (product) =>
            product.productId === productId && product.optionId === optionId
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
      const product = state.find(
        (item) =>
          item.productId === action.productId &&
          item.optionId === action.optionId
      );
      if (product?.quantity) {
        const partialState = removeFromBasket({
          optionId: product.optionId,
          productId: product.productId,
          state,
        });
        return [
          ...partialState,
          { ...product, quantity: product?.quantity + 1 },
        ];
      } else {
        const newProduct = {
          productId: action.productId,
          quantity: 1,
          optionId: action.optionId,
        };
        return [...state, newProduct];
      }
    }

    case UPDATE_OPTION:
      const { optionId, productId, newOptionId } = action;
      const isOptionIdGood =
        typeof optionId === "number" || optionId === NO_OPTION;
      const isNewOptionIdGood =
        typeof newOptionId === "number" || newOptionId === NO_OPTION;
      const haveRequiredVars =
        isOptionIdGood && typeof productId === "number" && isNewOptionIdGood;

      if (haveRequiredVars) {
        const updatedState = state.map((product) => {
          if (
            product.productId === productId &&
            product.optionId === optionId
          ) {
            return { ...product, optionId: newOptionId };
          }

          return product;
        });

        return updatedState;
      }

      consoleError(
        `basket reducer - ${UPDATE_OPTION} : one those vars are undefined: optionId, productId or newOptionId`
      );
      break;

    case UPDATE_QUANTITY:
      if (
        (typeof action.quantity === "number" &&
          action.quantity > 0 &&
          typeof action.productId === "number" &&
          typeof action.optionId === "number") ||
        action.optionId === NO_OPTION
      ) {
        let didChange = false;
        const updatedState = state.map((product) => {
          if (
            action.quantity != null &&
            product.productId === action.productId &&
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
      consoleError(
        "basket reducer UPDATE_QUANTITY : One of those variables from action object are undefined quantity, productId or optionId"
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

  const { SET, RESET } = BASKET_REDUCER_TYPE;
  const isFirstRender = useRef(true);

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
        dispatchBasket({ type: RESET });
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
// /BASKET RELATED

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
