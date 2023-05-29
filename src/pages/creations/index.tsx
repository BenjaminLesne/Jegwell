import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  ALL_CATEGORIES,
  CATEGORY,
  DEFAULT_SORT,
  SORT,
  TAB_BASE_TITLE,
} from "~/utils/constants";

import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";

import { useState } from "react";
import { type NextRouter, useRouter } from "next/router";
import { formatPrice } from "~/utils/helpers/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select/select";
import { fakeCategories, fakeProducts } from "~/utils/fixtures";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card/card";
import { Button } from "~/components/ui/Button/button";

const Home: NextPage = () => {
  const router = useRouter();
  const categoryQuery = router.query[CATEGORY];
  const sortQuery = router.query[SORT];
  const category = cleanQueryParam({
    queryValue: categoryQuery,
    defaultValue: ALL_CATEGORIES,
  });
  const sort = cleanQueryParam({
    queryValue: sortQuery,
    defaultValue: DEFAULT_SORT,
  });

  const [chosenCategory, setChosenCategory] = useState(category);
  const [chosenSort, setChosenSort] = useState(sort);
  const [animationKey, setAnimationKey] = useState(0);

  type CleanQueryParamProps = {
    queryValue: string | string[] | undefined;
    defaultValue: number | string;
  };
  function cleanQueryParam({ queryValue, defaultValue }: CleanQueryParamProps) {
    return queryValue == null || Array.isArray(queryValue)
      ? defaultValue
      : parseInt(queryValue);
  }
  // const { data: categories, isLoading: categoriesAreLoading } =
  //   api.categories.getAll.useQuery({
  //     select: { name: true, id: true },
  //   });

  const categories = fakeCategories;

  // const { data: products = fakeProducts, isLoading: productsAreLoading } =
  //   api.products.getAll.useQuery({
  //     category: parseInt(chosenCategory),
  //     sortType: chosenSort.toString(),
  //   });
  const products = fakeProducts;

  // if (categoriesAreLoading || productsAreLoading) {
  //   return <div>Chargement...</div>;
  // }

  if (!categories || !products) return <div>Une erreur est survenue.</div>;
  const categoryLabelId = "categoryLabelId";
  const sortLabelId = "sortLabelId";
  function slugify(value: string) {
    return decodeURIComponent(encodeURIComponent(value));
  }

  type UpdateQueryParamsProps = {
    key: string;
    value: string | number;
    nextRouter: NextRouter;
  };

  function updateQueryParams({
    key,
    value,
    nextRouter,
  }: UpdateQueryParamsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: targetParam, ...remainingParams } = nextRouter.query;

    const queryParams =
      value === ALL_CATEGORIES
        ? remainingParams
        : {
            ...remainingParams,
            [slugify(key)]: slugify(value.toString()),
          };

    void nextRouter.push({
      pathname: nextRouter.pathname,
      query: queryParams,
    });
  }
  type HandleFilterProps = {
    value: string | number;
    key: "catégorie" | "trie";
  };

  function handleFilter({ value, key }: HandleFilterProps) {
    const props = {
      key,
      value,
      nextRouter: router,
    };
    updateQueryParams(props);

    const newChosenValue = typeof value === "number" ? value : parseInt(value);

    if (key === CATEGORY) setChosenCategory(newChosenValue);
    if (key === SORT) setChosenSort(newChosenValue);
  }

  const triggerAnimation = () => {
    setAnimationKey((prevKey) => prevKey + 1);
  };
  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}créations</title>
      </Head>
      <main>
        <Section>
          <Title>NOS CRÉATIONS</Title>
          <div className="flex justify-center">
            <Select
              onValueChange={(value) => handleFilter({ value, key: CATEGORY })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={CATEGORY} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <FormControl sx={{ marginBottom: "38px" }}>
            <InputLabel id={categoryLabelId}>{capitalize(CATEGORY)}</InputLabel>
            <Select
              value={chosenCategory}
              label={CATEGORY}
              labelId={categoryLabelId}
              id="categorySelect"
              onChange={(event) => handleFilter({ event, key: CATEGORY })}
            >
              <MenuItem value={ALL_CATEGORIES} selected>
                Toutes
              </MenuItem>
              {categories.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <InputLabel id={sortLabelId}>{capitalize(CATEGORY)}</InputLabel>
            <Select
              value={chosenCategory}
              label={SORT}
              labelId={sortLabelId}
              id="sortSelect"
              onChange={(event) => handleFilter({ event, key: SORT })}
            >
              <MenuItem value={ALL_CATEGORIES} selected>
                Toutes
              </MenuItem>
              {categories.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <button
            className="input-wrapper filter"
            id="categoriesButton"
            data-modal="categoriesModal"
          >
            <div
              className="input filter__content-wrapper"
              data-label="Catégories"
            >
              <span className="filter__text">{}</span>
              <div className="caret"></div>
            </div>
          </button>

          <button
            className="input-wrapper filter"
            id="sort"
            data-modal="sortModal"
          >
            <div className="input filter__content-wrapper" data-label="Trier">
              <span className="filter__text">{}</span>
              <div className="caret"></div>
            </div>
          </button>

          <ul>
            {products?.length > 0 ? (
              [
                ...products,
                ...products,
                ...products,
                ...products,
                ...products,
                ...products,
              ].map((product) => {
                const priceInCents = product.price;
                const priceInEuros = priceInCents / 100;
                const formattedPrice = formatPrice({ price: priceInEuros });

                return (
                  <li key={product.id}>
                    <Card className="mx-auto max-w-[250px]">
                      <CardHeader>
                        <Link href={product.image.url ?? "#"}>
                          <div className="relative m-0 aspect-square w-full overflow-hidden rounded-md object-cover shadow-md">
                            <Image
                              src={product.image.url}
                              alt={product.name}
                              width={250}
                              height={250}
                            />
                            {product.options.length > 2 && (
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
                          className="relative border-[1px] border-solid border-black bg-secondary px-2 py-[10px] text-[12px] font-light text-black overflow-hidden"
                          onClick={triggerAnimation}
                        >
                          <span>
                            Ajouter au panier
                          </span>
                          <span
                              key={animationKey}
                              className={
                                "absolute inset-0 flex items-center justify-center opacity-0 bg-secondary " +
                                (animationKey > 0 ? "animate-fadeIn" : "")
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
        </Section>
      </main>
    </>
  );
};

export default Home;
