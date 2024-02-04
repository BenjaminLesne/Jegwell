"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  ALL_CATEGORIES,
  BASKET_REDUCER_TYPE,
  CATEGORY,
  DEFAULT_CATEGORY,
  DEFAULT_SORT,
  NO_OPTION,
  SINGLE_PRODUCT_ROUTE,
  SORT,
  SORT_OPTIONS,
  SORT_OPTIONS_NAMES,
  TAB_BASE_TITLE,
} from "~/lib/constants";

import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";

import { Dispatch, Suspense, useEffect, useReducer, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type OrderedProduct,
  formatPrice,
  useBasket,
} from "~/lib/helpers/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card/card";
import { Button } from "~/components/ui/Button/button";
import { capitalize } from "~/lib/helpers/client";
import { api } from "~/trpc/react";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";
import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";
import { type RouterOutputs } from "~/trpc/shared";

const { INCREMENT } = BASKET_REDUCER_TYPE;
const SET_CATEGORY = "SET_CATEGORY";
const SET_SORT = "SET_SORT";

function slugify(value: string) {
  return decodeURIComponent(encodeURIComponent(value));
}

type State = {
  category: number | undefined;
  sort: string | undefined;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case SET_CATEGORY:
      let newCategory: State["category"] = DEFAULT_CATEGORY;
      const parsedIntValue = parseInt(action.value ?? "");

      if (
        action.value != null &&
        typeof parsedIntValue === "number" &&
        parsedIntValue > ALL_CATEGORIES
      ) {
        newCategory = parsedIntValue;
      }

      return { ...state, category: newCategory };

    case SET_SORT:
      let newSort: State["sort"] = DEFAULT_SORT;

      if (
        action.value != null &&
        Object.keys(SORT_OPTIONS).includes(action.value)
      ) {
        newSort = action.value;
      }

      return { ...state, sort: newSort };
    default:
      return state;
  }
};

type UseQueryOptionsProps = {
  initialState: {
    category: number | undefined;
    sort: string | undefined;
  };
};
function useQueryOptions({ initialState }: UseQueryOptionsProps) {
  return useReducer(reducer, initialState);
}

type Action = {
  type: typeof SET_CATEGORY | typeof SET_SORT;
  value: string | undefined;
};

type FilterSortProps = {
  categories: RouterOutputs["categories"]["getAll"] | undefined;
  queryOptions: State;
  dispatchQueryOptions: Dispatch<Action>;
};

function FilterSort({
  categories,
  queryOptions,
  dispatchQueryOptions,
}: FilterSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsRaw = useSearchParams();
  const searchParams = new URLSearchParams(searchParamsRaw);

  type HandleFilterProps = {
    value: Action["value"];
    key: "catégorie" | "trie";
    callback?: (value: Action["value"]) => void;
  };

  function handleFilter({ value, key, callback }: HandleFilterProps) {
    const props = {
      key,
      value: value,
    };
    updateQueryParams(props);
    callback?.(value);
  }

  type UpdateQueryParamsProps = {
    key: string;
    value: string | number | undefined;
  };

  function updateQueryParams({ key, value }: UpdateQueryParamsProps) {
    if (value) {
      searchParams.set(key, slugify(value.toString()));
    } else {
      searchParams.delete(key);
    }

    router.replace(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <>
      <Select
        onValueChange={(value) =>
          handleFilter({
            value,
            key: CATEGORY,
            callback: (value) =>
              dispatchQueryOptions({ type: SET_CATEGORY, value }),
          })
        }
        defaultValue={queryOptions.category?.toString() ?? ""}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={capitalize(CATEGORY)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT_CATEGORY ?? ""}>Toutes</SelectItem>
          {categories?.map((category) => {
            if (category.id == null) return;
            return (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) =>
          handleFilter({
            value,
            key: SORT,
            callback: (value) =>
              dispatchQueryOptions({ type: SET_SORT, value }),
          })
        }
        defaultValue={DEFAULT_SORT}
        value={queryOptions.sort?.toString() ?? DEFAULT_SORT}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={"Trier"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_OPTIONS_NAMES).map(([value, name], index) => (
            <SelectItem key={index} value={value}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

const ProductsPage = ({
  params,
}: {
  params: { category: string; sort: string };
}) => {
  const { category: categoryQuery, sort: sortQuery } = params;
  const sort = typeof sortQuery === "string" ? sortQuery : undefined;
  const parsedIntCategoryQuery =
    typeof categoryQuery === "string" ? parseInt(categoryQuery) : NaN;
  const category = isNaN(parsedIntCategoryQuery)
    ? undefined
    : parsedIntCategoryQuery;

  const initialState = {
    category,
    sort,
  };

  const [queryOptions, dispatchQueryOptions] = useQueryOptions({
    initialState,
  });
  const { dispatchBasket } = useBasket();
  const [animationsKey, setAnimationsKey] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (categoryQuery) {
      dispatchQueryOptions({
        type: SET_CATEGORY,
        value: category?.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoryQuery]);

  useEffect(() => {
    if (sortQuery) {
      dispatchQueryOptions({
        type: SET_SORT,
        value: sort?.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortQuery]);

  const { data: categories, isLoading: categoriesAreLoading } =
    api.categories.getAll.useQuery();

  const { data: products, isLoading: productsAreLoading } =
    api.products.getAll.useQuery({
      category: queryOptions.category,
      sortType: queryOptions.sort,
    });

  if (categoriesAreLoading && productsAreLoading)
    return (
      <main>
        <Loading />
      </main>
    );

  const nothingIsLoading = !categoriesAreLoading && !productsAreLoading;
  if (nothingIsLoading && (!categories || !products)) {
    return <Error message="Une erreur est survenue." />;
  }

  const triggerAnimation = (key: string) => {
    setAnimationsKey((prev) => ({ ...prev, [key]: crypto.randomUUID() }));
  };

  type AddToBasketProps = {
    key: string;
    productId: OrderedProduct["productId"];
    optionId: OrderedProduct["optionId"];
  };
  const addToBasket = ({ key, productId, optionId }: AddToBasketProps) => {
    dispatchBasket({ type: INCREMENT, productId, optionId });
    triggerAnimation(key);
  };

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}créations</title>
      </Head>
      <Header />
      <main>
        <Section className="min-h-screen">
          <Title>NOS CRÉATIONS</Title>
          <div className="flex justify-center gap-5">
            {categoriesAreLoading ? (
              <Loading />
            ) : (
              <Suspense>
                <FilterSort
                  queryOptions={queryOptions}
                  dispatchQueryOptions={dispatchQueryOptions}
                  categories={categories}
                />
              </Suspense>
            )}
          </div>
          {productsAreLoading ? (
            <Loading />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products != null && products.length > 0 ? (
                products.map((product) => {
                  const priceInCents = product.price;
                  const priceInEuros = priceInCents / 100;
                  const formattedPrice = formatPrice(priceInEuros);

                  return (
                    <li key={product.id}>
                      <Card className="mx-auto max-w-[250px]">
                        <CardHeader>
                          <Link
                            href={
                              SINGLE_PRODUCT_ROUTE + product.id.toString() ??
                              "#"
                            }
                          >
                            <div className="relative m-0 aspect-square w-full overflow-hidden rounded-md object-cover shadow-md">
                              <Image
                                src={product.image?.url ?? "#"}
                                alt={product.name}
                                width={250}
                                height={250}
                              />
                              {product.options?.length > 2 && (
                                <div className="border-1 absolute bottom-1 left-1/2 translate-x-1/2 whitespace-nowrap rounded-md border-solid bg-black bg-opacity-25 px-[2px] py-[10px] text-[10px] font-extralight text-white ">
                                  {product.options.length} options
                                </div>
                              )}
                            </div>
                          </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                          <Link href={product.image?.url ?? "#"}>
                            <CardTitle>
                              <span
                                data-testid="p.name"
                                className="min-h-[28px] px-[10px] text-sm"
                              >
                                {product.name}
                              </span>
                            </CardTitle>
                          </Link>

                          <span
                            className="mt-2 text-sm font-medium"
                            data-testid="price"
                          >
                            {formattedPrice}
                          </span>
                        </CardContent>
                        <CardFooter className="flex items-center justify-center">
                          <Button
                            variant="secondary"
                            className="relative overflow-hidden border-[1px] border-solid border-black bg-secondary px-2 py-[10px] text-[12px] font-light text-black"
                            onClick={() =>
                              addToBasket({
                                key: product.id.toString(),
                                productId: product.id,
                                optionId: NO_OPTION,
                              })
                            }
                          >
                            <span>Ajouter au panier</span>
                            <span
                              key={animationsKey[product.id] ?? product.id}
                              className={
                                "absolute inset-0 flex items-center justify-center bg-secondary opacity-0 " +
                                (animationsKey[product.id] &&
                                animationsKey[product.id] !==
                                  product.id.toString()
                                  ? "animate-fadeIn"
                                  : "")
                              }
                            >
                              Ajouté &#10003;
                            </span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </li>
                  );
                })
              ) : (
                <div className="no-product">
                  <p className="no-product__message">
                    Il n&apos;y en a pas pour l&apos;instant !
                  </p>
                </div>
              )}
            </ul>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
