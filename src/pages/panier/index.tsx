import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useReducer, useState } from "react";
import { Cross } from "~/assets/svg/Cross";
import { OrderItemModifier } from "~/components/Button/OrderItemModifier";
import { Modal } from "~/components/Modals/Modal/Modal";
import { QuantityModal } from "~/components/Modals/Modal/QuantityModal";
import { Price } from "~/components/Price/Price";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/AlertDialog/alert-dialog";
import { Button } from "~/components/ui/Button/button";
import {
  CLOSE_TYPE,
  DELIVERY_ROUTE,
  OPEN_TYPE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";
import { cn } from "~/lib/helpers/helpers";

const quantityContent = (
  <div className="mx-auto my-10 flex items-center justify-center gap-10 text-4xl">
    <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
      <div className="bg-red h-1 w-4 bg-primary"></div>
    </button>
    <span className="text-4xl">1</span>
    <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
      <div className="flex h-4 w-4 items-center justify-center text-4xl text-primary">
        +
      </div>
    </button>
  </div>
);

const optionContent = (
  <div className="mx-auto my-10 flex items-center justify-center gap-10 text-4xl">
    <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
      <div className="bg-red h-1 w-4 bg-primary"></div>
    </button>
    <span className="text-4xl">1</span>
    <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
      <div className="flex h-4 w-4 items-center justify-center text-4xl text-primary">
        +
      </div>
    </button>
  </div>
);
const PRODUCT_INFO = "orderedProduct";
const initialQuantityModalProps = {
  [PRODUCT_INFO]: {
    id: "-1",
    optionId: "-1",
    quantity: -1,
  },
  open: false,
};

const optionModalProps = {
  content: optionContent,
  title: "Choisissez votre option : ",
  open: true,
};

// fixtures for development :
const orderedProducts = [
  { id: "0", optionId: "1", quantity: 2 },
  { id: "1", optionId: "0", quantity: 3 },
  { id: "2", optionId: "3", quantity: 4 },
];

const BasketPage: NextPage = () => {
  // const [quantityModalProps, setQuantityModalProps] = useState({
  //   ...initialQuantityModalProps,
  //   open: false,
  // });
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

  const [quantityModalProps, dispatchQuantityModalProps] = useReducer(
    quantityReducer,
    initialQuantityModalProps
  );

  return (
    <main>
      <Section className="mx-auto max-w-[50ch]  px-2">
        <Title>VOTRE PANIER</Title>
        <>
          <ul className="flex flex-col gap-10">
            <QuantityModal
              {...quantityModalProps}
              closeModal={() =>
                dispatchQuantityModalProps({
                  type: CLOSE_TYPE,
                })
              }
            />
            {orderedProducts?.length > 0 ? (
              orderedProducts.map((product) => (
                <li key={product.id}>
                  <h1>#{product.id}</h1>
                  <article>
                    <div className="flex gap-5">
                      <div
                        className={cn(
                          "overflow-hidden",
                          "h-[160px]",
                          "flex",
                          "items-center",
                          "rounded-md",
                          "shadow-md"
                        )}
                      >
                        <Image
                          className="rounded object-cover"
                          width={160}
                          height={160}
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
                          value="Vert"
                          onClick={() =>
                            dispatchQuantityModalProps({
                              type: OPEN_TYPE,
                              value: product,
                            })
                          }
                        />

                        {/* <AlertDialog open={false}>
                          <AlertDialogTrigger asChild>
                            <OrderItemModifier name="option" value="Vert" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="mb-5 text-center">
                                {true ? "Choisissez votre quantité :" : ""}
                              </AlertDialogTitle>
                              <AlertDialogDescription asChild className="my-9">
                                <div className="mx-auto my-10 flex items-center justify-center gap-10 text-4xl">
                                  <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
                                    <div className="bg-red h-1 w-4 bg-primary"></div>
                                  </button>
                                  <span className="text-4xl">1</span>
                                  <button className="flex h-8 w-8 items-center justify-center rounded border-[1px] border-solid border-primary bg-secondary">
                                    <div className="flex h-4 w-4 items-center justify-center text-4xl text-primary">
                                      +
                                    </div>
                                  </button>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-center">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-secondary text-primary">
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog> */}
                        <div className="bottom-[-4px] left-0 my-1 h-[1.5px] w-full bg-gray-500 bg-opacity-25"></div>

                        <button
                          className="setting setting--quantity"
                          data-quantity="{{product.quantity}}"
                          data-product-id="$product[id]"
                          data-product-option="$option_selected[name]"
                        >
                          <div>Quantité:</div>
                          <div className="setting__value">
                            <span>$quantity</span>
                            <div className="caret caret--basket"></div>
                          </div>
                        </button>
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
        </>
      </Section>
    </main>
  );
};

export default BasketPage;
