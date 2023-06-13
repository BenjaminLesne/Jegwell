import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Cross } from "~/assets/svg/Cross";
import { Price } from "~/components/Price/Price";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
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
                    <div className={cn(`h-[160px]`, "flex", "items-center")}>
                      <Image
                        className="rounded object-cover"
                        width={160}
                        height={160}
                        src="/hero.webp"
                        alt="nameOfProduct"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-light">product.name</h3>
                        <button
                          className="justify-end"
                          data-product-id="{{product.id}}"
                          data-product-option="{{product.selected_option}}"
                        >
                          <Cross className="h-4 w-4 fill-neutral-50" />
                        </button>
                      </div>
                      <button
                        className="relative m-0 flex w-full justify-between text-sm after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:w-full after:bg-neutral-50 after:bg-opacity-25 after:content-['']"
                        data-product-id="{{product.id}}"
                        data-product-option="{{product.selected_option}}"
                      >
                        <span>Option:</span>
                        <div className="flex gap-3">
                          <span>product.selected_option</span>
                          <div className="my-auto mr-1 h-1 w-1 rotate-45 border-x-2 border-solid border-black"></div>
                        </div>
                      </button>
                      <button
                        className="setting setting--quantity"
                        data-quantity="{{product.quantity}}"
                        data-product-id="$product[id]"
                        data-product-option="$option_selected[name]"
                      >
                        <span>Quantité:</span>
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
              <div className="relative flex h-[1px] justify-between pt-[10px] before:absolute before:left-0 before:top-0 before:w-full before:bg-opacity-100 before:content-['']">
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
