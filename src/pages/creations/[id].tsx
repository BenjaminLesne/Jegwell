import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { Loading } from "~/components/Loading/Loading";
import { Section } from "~/components/Section/Section";
import { Button } from "~/components/ui/Button/button";

import { api } from "~/lib/api";
import {
  BASKET_REDUCER_TYPE,
  PRODUCTS_ROUTE,
  TAB_BASE_TITLE,
  mergedProductSchema,
} from "~/lib/constants";
import { consoleError, useBasket } from "~/lib/helpers/helpers";
import { type MergedProduct } from "~/lib/types";

const { RESET, INCREMENT } = BASKET_REDUCER_TYPE;

const SingleProductPage: NextPage = () => {
  const [animationKey, incrementAnimationKey] = useReducer(
    (prev: number) => prev + 1,
    0
  );
  const { basket, dispatchBasket } = useBasket();
  const router = useRouter();
  const { id } = router.query;
  const idIsNumber = !isNaN(Number(id));
  const productNotFoundJSX = (
    <main>
      <p>Nous n'avons pas trouvé votre produit.</p>
      <br />
      <Link href={PRODUCTS_ROUTE}>Voir nos créations</Link>
    </main>
  );
  const usableId = id != null || idIsNumber || typeof id === "string";

  const { data: product, isLoading } = api.products.getBySingleId.useQuery(
    {
      id: Array.isArray(id) ? undefined : id,
    },
    { enabled: usableId }
  );

  if (isLoading && usableId)
    return (
      <main>
        <Loading />
      </main>
    );

  if (product == null || !usableId) return productNotFoundJSX;

  const productFromBasket = basket.find((item) => item.id.toString() === id);
  const mergedProductRaw = { ...product, ...productFromBasket };

  let mergedProduct: MergedProduct;

  try {
    mergedProduct = mergedProductSchema.parse(mergedProductRaw);
  } catch (error) {
    dispatchBasket({ type: RESET });
    consoleError("Parsing mergedProductsRaw gave : ", error);
  }

  type AddToBasketProps = {
    productId: string;
  };
  const addToBasket = ({ productId }: AddToBasketProps) => {
    dispatchBasket({ type: INCREMENT, productId });
    incrementAnimationKey();
  };

  return (
    <>
      <Head>
        <title>
          {TAB_BASE_TITLE}
          {product.name}
        </title>
      </Head>
      <main>
        <div className="media-scroller snaps-inline w-60"></div>
        <Section>
          <h1 className="sr-only">{product.name}</h1>
          <div className="lg:flex lg:gap-20">
            <div className="media-scroller-wrapper">
              <div className="media-scroller snaps-inline w-60"></div>
              {/* <div className="media-scroller snaps-inline">
                <div className="media-element">
                <Image
                src={product.image.url}
                    alt="$main_image_alt"
                    width={200}
                    height={200}
                  />
                </div>
                $option_images_html;
              </div> */}
              <div className="media-scroller-wrapper__buttons">
                <button className="media-scroller-wrapper__button media-scroller-wrapper__button--left">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                  </svg>
                </button>
                <button className="media-scroller-wrapper__button media-scroller-wrapper__button--right">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-3">
              <div className="mx-auto max-w-prose">
                <div className="my-4 flex justify-between">
                  <span className="grid items-center text-xl">
                    {product.name}
                  </span>
                  <span className="grid items-center text-xl font-bold">
                    13,99 €
                  </span>
                </div>
                <div className="relative min-h-[100px]">
                  <p>
                    {product.description} Lorem Ipsum is simply dummy text of
                    the printing and typesetting industry. Lorem Ipsum has been
                    the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only
                    five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was
                    popularised in the 1960s with the release of Letraset sheets
                    containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                  </p>
                  {/* <div className="aboslute before:to-rgb-primary-background-color bottom-0 left-0 w-full before:block before:h-3 before:w-full before:bg-gradient-to-b before:from-transparent before:content-[''] ">
                    <div className="flex w-full flex-col items-center justify-center bg-white">
                      <button className="m-0">
                        <span className="rounded border-2 border-solid px-1 py-3 text-center text-xs">
                          VOIR PLUS
                        </span>
                      </button>
                    </div>
                  </div> */}
                </div>

                <div className="mb-10 mt-4">
                  <button className="relative m-0 flex h-12 w-full items-center justify-between text-base after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:w-full after:content-['']">
                    <span>Option:</span>
                    <div className="flex gap-3">
                      <span>Vert</span>
                      <div className="my-auto mb-2 h-2 w-2 rotate-45 border-b-2 border-r-2 border-solid border-black"></div>
                    </div>
                  </button>
                  <div className="bottom-[-4px] left-0 my-1 h-[1.5px] w-full bg-gray-500 bg-opacity-25"></div>
                  <button className="relative m-0 flex h-12 w-full items-center justify-between text-base">
                    <span>Quantité:</span>
                    <div className="flex gap-3">
                      <span>1</span>
                      <div className="my-auto mb-2 h-2 w-2 rotate-45 border-b-2 border-r-2 border-solid border-black"></div>
                    </div>
                  </button>
                </div>

                <Button
                  variant="secondary"
                  className="relative h-12 w-full overflow-hidden border-[1px] border-solid bg-secondary px-2 py-[10px] text-lg font-medium text-primary"
                  onClick={() =>
                    addToBasket({
                      productId: product.id.toString(),
                    })
                  }
                >
                  <span>Ajouter au panier</span>
                  <span
                    key={animationKey}
                    className={
                      "absolute inset-0 flex items-center justify-center bg-secondary opacity-0 " +
                      (animationKey ? "animate-fadeIn" : "")
                    }
                  >
                    Ajouté &#10003;
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
};

export default SingleProductPage;
