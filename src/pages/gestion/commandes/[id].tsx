import { type NextPage } from "next";
import Head from "next/head";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";

import { useRouter } from "next/router";
import { z } from "zod";
import { cn } from "~/lib/helpers/helpers";
import Image from "next/image";

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

  const { data: products, productsAreLoading } = api.products.getByIds.useQuery(
    {
      id: z.number().parse(parseInt(typeof id === "string" ? id : "-1")),
    },
    { enabled: idIsNumber }
  );

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!order && !isLoading) return <Error />;

  if (order == null || !usableId) return orderNotFoundJSX;

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}gestion</title>
      </Head>
      <main>
        <Section>
          <Title>Commande n°{order?.id} : </Title>
          <div>
            <h2>Livraison : </h2>
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
            <h2>Client : </h2>
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
          <div>
            <h2>Client : </h2>
            <div>
              {order.productsToBasket.map((product) => (
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
            </div>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Home;
