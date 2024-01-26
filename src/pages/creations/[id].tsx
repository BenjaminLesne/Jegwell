import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useReducer, useRef } from "react";
import { Loading } from "~/components/Loading/Loading";
import { Section } from "~/components/Section/Section";
import { Button } from "~/components/ui/Button/button";

import { api } from "~/lib/api";
import {
  BASKET_REDUCER_TYPE,
  CLOSE_TYPE,
  NO_OPTION,
  NO_OPTION_TEXT,
  OPEN_TYPE,
  PRODUCTS_ROUTE,
  QUANTITY_TESTID,
  TAB_BASE_TITLE,
  mergedProductSchema,
} from "~/lib/constants";
import {
  type BasketAction,
  type OrderedProduct,
  cn,
  useBasket,
  consoleError,
} from "~/lib/helpers/helpers";
import Slider, { type Settings } from "react-slick";
import { OrderItemModifier } from "~/components/Buttons/OrderItemModifier";
import { useOptionModal, useQuantityModal } from "~/lib/hooks/hooks";
import { OptionModal } from "~/components/Modals/Modal/OptionModal";
import { QuantityModal } from "~/components/Modals/Modal/QuantityModal";
import { type z } from "zod";
import { Product3d } from "~/components/Product3d";

const { RESET, ADD } = BASKET_REDUCER_TYPE;

type PartialOrderState = Pick<OrderedProduct, "quantity" | "optionId">;

const initialPartialOrder: PartialOrderState = {
  quantity: 1,
  optionId: NO_OPTION,
};

const UPDATE_OPTION = "update option";
const UPDATE_QUANTITY = "update quantity";
const SET = "set";

type UpdateOption = {
  type: typeof UPDATE_OPTION;
  value: PartialOrderState["optionId"];
};

type UpdateQuantity = {
  type: typeof UPDATE_QUANTITY;
  value: PartialOrderState["quantity"];
};

type Set = { type: typeof SET; value: PartialOrderState };

type PartialOrderAction = UpdateOption | UpdateQuantity | Set;

const partialOrderReducer = (
  state: PartialOrderState,
  action: PartialOrderAction
) => {
  switch (action.type) {
    case SET:
      return action.value;

    case UPDATE_OPTION:
      return { ...state, optionId: action.value };

    case UPDATE_QUANTITY:
      if (action.value < 0) {
        return { ...state, quantity: 0 };
      } else {
        return { ...state, quantity: action.value };
      }

    default:
      return state;
  }
};

let didRun = false;

const SingleProductPage: NextPage = () => {
  const ref = useRef();
  const [animationKey, incrementAnimationKey] = useReducer(
    (prev: number) => prev + 1,
    0
  );
  const { optionModal, dispatchOptionModal } = useOptionModal();
  const { quantityModal, dispatchQuantityModal } = useQuantityModal();
  const { basket, dispatchBasket } = useBasket();
  const [partialOrder, dispatchPartialOrder] = useReducer(
    partialOrderReducer,
    initialPartialOrder
  );
  const router = useRouter();
  const { id } = router.query;
  const idIsNumber = !isNaN(Number(id));
  const productNotFoundJSX = (
    <main>
      <p>Nous n&apos;avons pas trouvé votre produit.</p>
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

  const mergedProductRaw = {
    ...product,
    productId: product.id,
    quantity: 1,
    optionId: NO_OPTION,
  };

  let mergedProduct: z.infer<typeof mergedProductSchema>;

  try {
    mergedProduct = mergedProductSchema.parse(mergedProductRaw);
    const data = {
      optionId: mergedProduct.optionId,
      quantity: mergedProduct.quantity,
    };

    if (didRun === false) {
      dispatchPartialOrder({
        type: SET,
        value: {
          optionId: data.optionId,
          quantity: data.quantity,
        },
      });

      didRun = true;
    }
  } catch (error) {
    consoleError(error);
    if (basket.length > 0) dispatchBasket({ type: RESET });
  }

  const addToBasket = () => {
    const cleanProduct = {
      productId: product.id,
      ...partialOrder,
    };
    dispatchBasket({ type: ADD, product: cleanProduct });
    incrementAnimationKey();
  };
  const settings: Settings = {
    infinite: true,
    dots: true,
    arrows: false,
    centerPadding: "0",
    className: cn("h-full"),
  };

  const onOptionConfirm = (
    dispatchBasketArgs: Extract<
      BasketAction,
      { type: (typeof BASKET_REDUCER_TYPE)["UPDATE_OPTION"] }
    >
  ) => {
    const { newOptionId } = dispatchBasketArgs;
    dispatchPartialOrder({ type: UPDATE_OPTION, value: newOptionId });
  };

  const onQuantityConfirm = (
    dispatchBasketArgs: Extract<
      BasketAction,
      { type: (typeof BASKET_REDUCER_TYPE)["UPDATE_QUANTITY"] }
    >
  ) => {
    const { quantity } = dispatchBasketArgs;
    dispatchPartialOrder({ type: UPDATE_QUANTITY, value: quantity });
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
        <Section>
          <h1 className="sr-only">{product.name}</h1>
          <div className="flex flex-col lg:flex-row lg:gap-20">
            <div>
              <Product3d eventSource={ref} eventPrefix="client" />
            </div>
            <div className="mx-auto w-[400px] max-w-full lg:mx-0 lg:mt-5">
              <div className="h-full">
                <Slider {...settings}>
                  <div>
                    <Image
                      src={product.image.url}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="mx-auto h-[400px] max-h-[400px] w-[400px] max-w-full object-cover lg:mt-5"
                    />
                  </div>
                  {product.options.map((option, index) => (
                    <div key={index}>
                      <Image
                        src={option.image.url}
                        alt={product.name + " " + option.name}
                        width={400}
                        height={400}
                        className="mx-auto h-[400px] max-h-[400px] w-[400px] max-w-full object-cover lg:mt-5"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div>
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
                    the industry&apos;s standard dummy text ever since the
                    1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book. It has survived
                    not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was
                    popularised in the 1960s with the release of Letraset sheets
                    containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                  </p>
                </div>

                <div className="mb-10 mt-4">
                  {product.options.length > 0 && (
                    <OrderItemModifier
                      name="option"
                      value={
                        product.options.find(
                          (option) => option.id === partialOrder?.optionId
                        )?.name ?? NO_OPTION_TEXT
                      }
                      onClick={() =>
                        dispatchOptionModal({
                          type: OPEN_TYPE,
                          value: { ...mergedProduct, ...partialOrder },
                        })
                      }
                      testid="OPTION_ID"
                    />
                  )}

                  <div className="bottom-[-4px] left-0 my-1 h-[1.5px] w-full bg-gray-500 bg-opacity-25"></div>
                  <OrderItemModifier
                    name="quantité"
                    value={partialOrder.quantity}
                    onClick={() =>
                      dispatchQuantityModal({
                        type: OPEN_TYPE,
                        value: { ...mergedProduct, ...partialOrder },
                      })
                    }
                    testid={QUANTITY_TESTID}
                  />
                </div>

                <Button
                  variant="secondary"
                  className="relative h-12 w-full overflow-hidden border-[1px] border-solid bg-secondary px-2 py-[10px] text-lg font-medium text-primary"
                  onClick={addToBasket}
                >
                  <span>Ajouter au panier</span>
                  <span
                    key={animationKey}
                    className={cn(
                      "absolute",
                      "inset-0",
                      "opacity-0",
                      "flex",
                      "items-center",
                      "justify-center",
                      "bg-secondary",
                      animationKey ? "animate-fadeIn" : ""
                    )}
                  >
                    Ajouté &#10003;
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <QuantityModal
        {...quantityModal}
        closeModal={() =>
          dispatchQuantityModal({
            type: CLOSE_TYPE,
          })
        }
        onConfirmation={onQuantityConfirm}
      />
      <OptionModal
        {...optionModal}
        closeModal={() =>
          dispatchOptionModal({
            type: CLOSE_TYPE,
          })
        }
        onConfirmation={onOptionConfirm}
      />
    </>
  );
};

export default SingleProductPage;
