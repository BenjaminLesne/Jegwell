import { type NextPage } from "next";
import Image from "next/image";
import React from "react";
import { Cross } from "~/assets/svg/Cross";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import { cn } from "~/lib/helpers/helpers";

const BasketPage: NextPage = () => {
  return (
    <main>
      <Section className="mx-auto max-w-[60ch]">
        <Title>VOTRE PANIER</Title>
        <section>
          <h2 className="sr-only">VOS ITEMS</h2>
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
                  $price_html
                </span>
              </article>
            </li>
          </ul>
        </section>
      </Section>
    </main>
  );
};

export default BasketPage;
