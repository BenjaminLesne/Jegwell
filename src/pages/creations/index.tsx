import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { ALL_CATEGORIES, CATEGORY, TAB_BASE_TITLE } from "~/utils/constants";

import heroImage from "../../assets/images/hero.webp";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import {
  MenuItem,
  Select,
  capitalize,
  type SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { type NextRouter, useRouter } from "next/router";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const categoryQuery = router.query[CATEGORY];
  const category =
    categoryQuery == null || Array.isArray(categoryQuery)
      ? ALL_CATEGORIES
      : parseInt(categoryQuery);
  const [chosenCategory, setChosenCategory] = useState(category);

  const { data: categories, isLoading: categoriesAreLoading } =
    api.categories.getAll.useQuery({
      select: { name: true, id: true },
    });

  const { data: products, isLoading: productsAreLoading } =
    api.products.getAll.useQuery({ category: chosenCategory });

  if (categoriesAreLoading || productsAreLoading) {
    return <div>Chargement...</div>;
  }
  if (!categories || !products) return <div>Une erreur est survenue.</div>;
  console.log(products);
  const categoryLabelId = "categoryLabelId";

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
    event: SelectChangeEvent<string | number>;
    key: "catégorie" | "trie";
  };

  function handleFilter({ event, key }: HandleFilterProps) {
    const value = event.target.value;
    const props = {
      key,
      value,
      nextRouter: router,
    };
    updateQueryParams(props);

    const newChosenCategory =
      typeof value === "number" ? value : parseInt(value);

    if (key === CATEGORY) setChosenCategory(newChosenCategory);
  }

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}créations</title>
      </Head>
      <main>
        <Section>
          <Title>NOS CRÉATIONS</Title>
          <FormControl>
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
          </FormControl>
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

          <ul className="mb-10 grid grid-cols-3 gap-4">
            {products?.length > 0 ? (
              products.map((product) => (
                <li key={product.id}>
                  <article className="mx-auto flex max-w-[250px] flex-col">
                    <Link
                      className="relative m-0 aspect-square w-full overflow-hidden rounded-md object-cover shadow-md"
                      href={product.image?.url ?? "#"}
                      data-options={
                        product.options.length > 1
                          ? product.options.length
                          : undefined
                      }
                    >
                      <Image
                        className="product__image"
                        src={heroImage}
                        alt={product.name}
                      />
                    </Link>
                    <div className="product__information">
                      <Link className="product__name" href="{{ productUrl }}">
                        <span data-testid="p.name">{product.name}</span>
                      </Link>
                      <span className="product__price" data-testid="price">
                        {
                          product.options.find((option) => option != null)
                            ?.price
                        }
                        €
                      </span>
                      <button className="product__call-to-action-wrapper">
                        <span className="product__call-to-action">
                          Ajouter au panier
                          <span className="product__success-message">
                            Ajouté &#10003;
                          </span>
                        </span>
                      </button>
                    </div>
                    {product.options.length > 2 && (
                      <div className="border-1 absolute bottom-1 left-1/2 translate-x-1/2 whitespace-nowrap rounded-md border-solid bg-black bg-opacity-25 px-[2px] py-[10px] text-[10px] font-extralight text-white ">
                        {product.options.length} options
                      </div>
                    )}
                  </article>
                </li>
              ))
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
