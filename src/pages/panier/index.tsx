import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useReducer } from "react";
import { z } from "zod";
import { Cross } from "~/assets/svg/Cross";
import { OrderItemModifier } from "~/components/Button/OrderItemModifier";
import { Loading } from "~/components/Loading/Loading";
import { OptionModal } from "~/components/Modals/Modal/OptionModal";
import { QuantityModal } from "~/components/Modals/Modal/QuantityModal";
import { Price } from "~/components/Price/Price";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import { Button } from "~/components/ui/Button/button";
import { api } from "~/lib/api";
import {
  BASKET_REDUCER_TYPE,
  CLOSE_TYPE,
  DELIVERY_ROUTE,
  LOCALE_STORAGE_BASKET_KEY,
  OPEN_TYPE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";
import { cn, consoleError, useBasket } from "~/lib/helpers/helpers";

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

const optionReducer = (
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

export type MergedProduct = {
  quantity: number;
  optionId: string;
  image: {
    url: string;
  };
  options: {
    image: {
      url: string;
    };
    id: number;
    price: number;
    name: string;
  }[];
  id: string;
  price: number;
  name: string;
};

const BasketPage: NextPage = () => {
  const [quantityModalProps, dispatchQuantityModalProps] = useReducer(
    quantityReducer,
    initialModalProps
  );
  const [optionModalProps, dispatchOptionModalProps] = useReducer(
    optionReducer,
    initialModalProps
  );
  const { basket, dispatchBasket } = useBasket();

  const { data: products, isLoading: productsAreLoading } =
    api.products.getByIds.useQuery({
      ids: basket.map((item) => item.id),
    });

  if (productsAreLoading)
    return (
      <main>
        <Loading />
      </main>
    );

  const mergedProductsSchema = z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      optionId: z.string(),
      image: z.object({
        url: z.string(),
      }),
      options: z.array(
        z.object({
          image: z.object({
            url: z.string(),
          }),
          id: z.number(),
          price: z.number(),
          name: z.string(),
        })
      ),
      price: z.number(),
      name: z.string(),
    })
  );

  const mergedProductsRaw = basket.map((item) => {
    const product = products?.find(
      (element) => element.id.toString() === item.id
    );

    const mergedProduct = { ...product, ...item };
    return mergedProduct;
  });

  let mergedProducts: MergedProduct[] = [];

  try {
    mergedProducts = mergedProductsSchema.parse(mergedProductsRaw);
  } catch (error) {
    const { RESET } = BASKET_REDUCER_TYPE;
    dispatchBasket({ type: RESET });
    consoleError("Parsing mergedProductsRaw gave : ", error);
  }

  if (mergedProducts.length === 0) {
    return (
      <main className="">
        <div className="mt-[15%] flex flex-col items-center justify-center">
          <span>Vous n'avez pas d'article dans votre panier.</span>
          <Link href={PRODUCTS_ROUTE} className="text-primary">
            Cliquez-ici pour voir nos créations !
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = 10;
  const totalQuantity = 10;

  return (
    <main>
      <Section className="mx-auto max-w-[50ch]  px-2">
        <Title>VOTRE PANIER</Title>
        <ul className="flex flex-col gap-10">
          {mergedProducts.map((product) => (
            <li key={product.id + product.optionId}>
              <h1>#{product.id}</h1>
              <article>
                <div className="flex gap-5">
                  <div
                    className={cn(
                      "overflow-hidden",
                      "h-[125px]",
                      "flex",
                      "items-center",
                      "rounded-md",
                      "shadow-md"
                    )}
                  >
                    <Image
                      className="rounded object-cover"
                      width={125}
                      height={125}
                      src={product.image.url}
                      alt="nameofproduct"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-light">{product.name}</h3>
                      <button className="justify-end">
                        <Cross className="h-4 w-4 fill-red-400" />
                      </button>
                    </div>
                    <OrderItemModifier
                      name="option"
                      value={product.optionId}
                      onClick={() =>
                        dispatchOptionModalProps({
                          type: OPEN_TYPE,
                          value: product,
                        })
                      }
                    />
                    <div className="bottom-[-4px] left-0 my-1 h-[1.5px] w-full bg-gray-500 bg-opacity-25"></div>
                    <OrderItemModifier
                      name="quantité"
                      value={product.quantity}
                      onClick={() =>
                        dispatchQuantityModalProps({
                          type: OPEN_TYPE,
                          value: product,
                        })
                      }
                    />
                  </div>
                </div>
                <span className="inline-block w-full text-right text-xl font-bold">
                  <Price priceInCents={product.price} />
                </span>
              </article>
            </li>
          ))}
        </ul>
        <QuantityModal
          {...quantityModalProps}
          closeModal={() =>
            dispatchQuantityModalProps({
              type: CLOSE_TYPE,
            })
          }
          dispatchBasket={dispatchBasket}
        />
        <OptionModal
          {...optionModalProps}
          closeModal={() =>
            dispatchOptionModalProps({
              type: CLOSE_TYPE,
            })
          }
          dispatchBasket={dispatchBasket}
        />
        <section className="my-10 flex flex-col gap-7">
          <div className="relative flex h-[1px] justify-between pt-[10px] before:absolute before:left-0 before:top-0 before:h-[1px] before:w-full before:bg-black before:content-['']">
            <h2 className="text-xl font-normal">sous-total</h2>
            <Price priceInCents={subtotal} />
          </div>
          <div className="w-full text-right text-sm">
            ({totalQuantity} {totalQuantity > 1 ? "articles" : "article"})
          </div>
        </section>
        <Button asChild variant="secondary" className="mx-auto block w-fit">
          <Link href={DELIVERY_ROUTE}>Passer la commande</Link>
        </Button>
      </Section>
    </main>
  );
};

export default BasketPage;
