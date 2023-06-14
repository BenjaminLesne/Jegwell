import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Cross } from "~/assets/svg/Cross";
import { OrderItemModifier } from "~/components/Button/OrderItemModifier";
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
import { DELIVERY_ROUTE, PRODUCTS_ROUTE } from "~/lib/constants";
import { cn } from "~/lib/helpers/helpers";

const BasketPage: NextPage = () => {
  const orderedProducts = [1];
  return (
    <main>
      <Section className="mx-auto max-w-[60ch]">
        <Title>VOTRE PANIER</Title>
        {orderedProducts.length > 0 ? (
          <>
            <ul className="flex flex-col gap-10">
              <li>
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
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-light">Bruz</h3>
                        <button className="justify-end">
                          <Cross className="h-4 w-4 fill-red-400" />
                        </button>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <OrderItemModifier name="option" value="Vert" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="mb-5 text-center">
                              Choisissez votre quantité :
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
                      </AlertDialog>

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
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span>Vous n'avez pas d'article dans votre panier.</span>
            <Link href={PRODUCTS_ROUTE}>
              Cliquez-ici pour voir nos créations !
            </Link>
          </div>
        )}
      </Section>
    </main>
  );
};

export default BasketPage;
