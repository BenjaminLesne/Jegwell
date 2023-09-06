import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import { Cross } from "~/assets/svg/Cross";
import { OrderItemModifier } from "~/components/Buttons/OrderItemModifier";
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
  NO_OPTION_TEXT,
  OPEN_TYPE,
  PRODUCTS_ROUTE,
  QUANTITY_TESTID,
  SUBTOTAL_TESTID,
  mergedProductsSchema,
} from "~/lib/constants";
import {
  cn,
  consoleError,
  getSubtotalPrice,
  useBasket,
} from "~/lib/helpers/helpers";
import { useOptionModal, useQuantityModal } from "~/lib/hooks/hooks";
import { type MergedProduct } from "~/lib/types";

const BasketPage: NextPage = () => {
  const {
    quantityModal: quantityModalProps,
    dispatchQuantityModal: dispatchQuantityModalProps,
  } = useQuantityModal();
  const {
    optionModal: optionModalProps,
    dispatchOptionModal: dispatchOptionModalProps,
  } = useOptionModal();
  const { basket, dispatchBasket } = useBasket();

  const { data: products, isLoading: productsAreLoading } =
    api.products.getByIds.useQuery({
      ids: basket.map((item) => item.productId.toString()),
    });

  if (productsAreLoading)
    return (
      <main>
        <Loading />
      </main>
    );

  const mergedProductsRaw = basket.map((item) => {
    const product = products?.find((element) => element.id === item.productId);

    const mergedProduct = { ...product, ...item };
    return mergedProduct;
  });

  let mergedProducts: z.infer<typeof mergedProductsSchema> = [];

  try {
    mergedProducts = mergedProductsSchema.parse(mergedProductsRaw);
  } catch (error) {
    const { RESET } = BASKET_REDUCER_TYPE;
    dispatchBasket({ type: RESET });
    consoleError("Failed to parse mergedProductsRaw : ", error);
  }

  if (mergedProducts.length === 0) {
    return (
      <main className="">
        <div className="mt-[15%] flex flex-col items-center justify-center">
          <span>Vous n&apos;avez pas d&apos;article dans votre panier.</span>
          <Link href={PRODUCTS_ROUTE} className="text-primary">
            Cliquez-ici pour voir nos créations !
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = getSubtotalPrice(mergedProducts);
  const totalQuantity = getTotalQuantity(mergedProducts);

  function getTotalQuantity(products: typeof mergedProducts): number {
    let totalQuantity = 0;
    for (const product of products) {
      totalQuantity += product.quantity;
    }
    return totalQuantity;
  }

  return (
    <main>
      <Section className="mx-auto max-w-[50ch]  px-2">
        <Title>VOTRE PANIER</Title>
        <ul className="flex flex-col gap-10">
          {mergedProducts.map((product) => (
            <li key={product.id + (product.optionId ?? 0)}>
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
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-light">{product.name}</h3>
                      <button
                        className="justify-end"
                        onClick={() =>
                          dispatchBasket({
                            type: "remove",
                            productId: product.productId,
                            optionId: product.optionId,
                          })
                        }
                      >
                        <Cross className="h-4 w-4 fill-red-400" />
                      </button>
                    </div>
                    <OrderItemModifier
                      name="option"
                      value={
                        product.options.find(
                          (option) => option.id === product.optionId
                        )?.name ?? NO_OPTION_TEXT
                      }
                      onClick={() =>
                        dispatchOptionModalProps({
                          type: OPEN_TYPE,
                          value: product,
                        })
                      }
                      testid="OPTION_ID"
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
                      testid={QUANTITY_TESTID}
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
          onConfirmation={dispatchBasket}
        />
        <OptionModal
          {...optionModalProps}
          closeModal={() =>
            dispatchOptionModalProps({
              type: CLOSE_TYPE,
            })
          }
          onConfirmation={dispatchBasket}
        />
        <section className="my-10 flex flex-col gap-7">
          <div className="relative flex h-[1px] justify-between pt-[10px] before:absolute before:left-0 before:top-0 before:h-[1px] before:w-full before:bg-black before:content-['']">
            <h2 className="text-xl font-normal">sous-total</h2>
            <Price priceInCents={subtotal} data-testid={SUBTOTAL_TESTID} />
          </div>
          <div className="w-full text-right text-sm">
            ({totalQuantity} {totalQuantity > 1 ? "bijoux" : "bijou"})
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