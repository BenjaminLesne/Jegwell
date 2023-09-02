import { type NextPage } from "next";
import Head from "next/head";

import {
  NO_OPTION_TEXT,
  TAB_BASE_TITLE,
  mergedProductsSchema,
} from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";

import { useRouter } from "next/router";
import { z } from "zod";
import { cn, consoleError } from "~/lib/helpers/helpers";
import Image from "next/image";
import { type MergedProduct } from "~/lib/types";
import { Price } from "~/components/Price/Price";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idIsNumber = !isNaN(Number(id));
  const orderNotFoundJSX = (
    <main>
      <p>J&apos;ai pas trouvé la commande avec l&apos;id: {id}</p>
    </main>
  );

  const usableId = id != null || idIsNumber || typeof id === "string";
  const { data: order, isLoading } = api.orders.get.useQuery(
    {
      id: z.number().parse(parseInt(typeof id === "string" ? id : "-1")),
    },
    { enabled: idIsNumber }
  );

  const { data: products, isLoading: productsAreLoading } =
    api.products.getByIds.useQuery(
      {
        ids: order?.productsToBasket.map((item) =>
          item.productId.toString()
        ) ?? ["-1"],
      },
      { enabled: !!order }
    );

  if (isLoading || productsAreLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!order && !isLoading && !productsAreLoading) return <Error />;

  if (order == null || !usableId) return orderNotFoundJSX;
  const mergedProductsRaw = order.productsToBasket.map((item) => {
    const product = products?.find((element) => element.id === item.productId);

    const mergedProduct = { ...product, ...item };
    return mergedProduct;
  });

  let mergedProducts: MergedProduct[] = [];

  try {
    mergedProducts = mergedProductsSchema.parse(mergedProductsRaw);
  } catch (error) {
    consoleError("Failed to parse mergedProductsRaw : ", error);
    return (
      <main>
        <Error />
      </main>
    );
  }
  console.log(mergedProducts);
  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}gestion</title>
      </Head>
      <main>
        <Section>
          <Title>Commande n°{order?.id} : </Title>
          <div>
            <Title>Livraison : </Title>
            <div>
              <div className={cn("flex")}>
                <div>Ville : </div>
                <div>{order.address.city}</div>
              </div>
              <div className={cn("flex")}>
                <div>Adresse : </div>
                <div>
                  {order.address.line1} | {order.address.line2}
                </div>
              </div>
              <div className={cn("flex")}>
                <div>Pays : </div>
                <div>{order.address.country}</div>
              </div>
              <div className={cn("flex")}>
                <div>Livraison : </div>
                <div>{order.deliveryOption.name}</div>
              </div>
              <div className={cn("flex")}>
                <div>Commentaire client : </div>
                <div>
                  {order.comment != null && order.comment.length > 0
                    ? order.comment
                    : "Aucun"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Title>Client : </Title>
            <div>
              <div className={cn("flex")}>
                <div>Prénom : </div>
                <div>{order.customer.firstname}</div>
              </div>
              <div className={cn("flex")}>
                <div>Nom : </div>
                <div>{order.customer.lastname}</div>
              </div>
              <div className={cn("flex")}>
                <div>Email : </div>
                <div>{order.customer.email}</div>
              </div>
              <div className={cn("flex")}>
                <div>Téléphone : </div>
                <div>{order.customer.phone}</div>
              </div>
            </div>
          </div>
          <br />
          <div className={cn("mx-auto", "max-w-[50ch]", "px-2")}>
            <Title>Panier commandé : </Title>
            <div>
              {mergedProducts.map((product) => {
                const isDefaultOption = product.optionId === null;
                const possibleOption =
                  isDefaultOption === false &&
                  product.options.find((item) => item.id === product.optionId);
                const imageUrl = possibleOption
                  ? possibleOption.image.url
                  : product.image.url;

                const option = product.options.find(
                  (option) => option.id === product.optionId
                );

                const optionName =
                  option !== undefined
                    ? option.name
                    : product.optionId === null
                    ? NO_OPTION_TEXT
                    : "inconnu";

                return (
                  <li key={product.id + (product.optionId ?? -1)}>
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
                            src={imageUrl}
                            alt={product.name}
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-light">
                              {product.name}
                            </h3>
                          </div>

                          <div
                            className={cn(
                              "relative",
                              "m-0",
                              "flex h-12",
                              "w-full",
                              "items-center",
                              "justify-between",
                              "text-sm"
                            )}
                          >
                            option: {optionName}
                          </div>
                          <div className="bottom-[-4px] left-0 my-1 h-[1.5px] w-full bg-gray-500 bg-opacity-25"></div>
                          <div
                            className={cn(
                              "relative",
                              "m-0",
                              "flex h-12",
                              "w-full",
                              "items-center",
                              "justify-between",
                              "text-sm"
                            )}
                          >
                            quantité : {product.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="inline-block w-full text-right text-xl font-bold">
                        <Price priceInCents={product.price} />
                      </span>
                    </article>
                  </li>
                );
              })}
            </div>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Home;
