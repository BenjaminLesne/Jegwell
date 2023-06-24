import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useReducer } from "react";
import { Cross } from "~/assets/svg/Cross";
import { OrderItemModifier } from "~/components/Button/OrderItemModifier";
import { Loading } from "~/components/Loading/Loading";
import { OptionModal } from "~/components/Modals/Modal/OptionModal";
import { QuantityModal } from "~/components/Modals/Modal/QuantityModal";
import { Price } from "~/components/Price/Price";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import { Button } from "~/components/ui/Button/button";
import {
  CLOSE_TYPE,
  DELIVERY_ROUTE,
  OPEN_TYPE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";
import { cn, useBasket } from "~/lib/helpers/helpers";

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
    api.products.getById.useQuery({
      id: basket.map((item) => item.id),
    });

  if (productsAreLoading)
    return (
      <main>
        <Loading />
      </main>
    );

  return (
    <main>
      <Section className="mx-auto max-w-[50ch]  px-2">
        <Title>VOTRE PANIER</Title>
        <ul className="flex flex-col gap-10">
          {basket?.length > 0 ? (
            basket.map((product) => (
              <li key={product.id}>
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
                        src="/hero.webp"
                        alt="nameofproduct"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-light">Bruz</h3>
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
                    <Price value={10} />
                  </span>
                </article>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span>Vous n'avez pas d'article dans votre panier.</span>
              <Link href={PRODUCTS_ROUTE}>
                Cliquez-ici pour voir nos créations !
              </Link>
            </div>
          )}
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
            <Price value={19.99} />
          </div>
          <div className="w-full text-right text-sm">
            ({10} {10 > 1 ? "articles" : "article"})
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
