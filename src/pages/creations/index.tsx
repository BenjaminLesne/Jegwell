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
import { useEffect, useState } from "react";
import { type NextRouter, useRouter } from "next/router";
import { api } from "~/utils/api";

const categories = [
  { name: "Toutes", id: "Toutes" },
  { name: "Boucles d'oreilles", id: 1 },
];
const Home: NextPage = () => {
  const router = useRouter();
  const categoryQuery = router.query[CATEGORY];
  const category =
    categoryQuery == null || Array.isArray(categoryQuery)
      ? ALL_CATEGORIES
      : categoryQuery;
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
  // const products = [
  //   {
  //     name: "Bruz",
  //     options: [{ price: 9999 }],
  //     image: {
  //       url: "url/de/test",
  //     },
  //   },
  // ];

  function slugify(value: string) {
    return decodeURIComponent(encodeURIComponent(value));
  }

  type UpdateQueryParamsProps = {
    key: string;
    value: string;
    nextRouter: NextRouter;
  };

  function updateQueryParams({
    key,
    value,
    nextRouter,
  }: UpdateQueryParamsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: targetParam, ...remainingParams } = nextRouter.query;

    const queryParams = {
      ...remainingParams,
      [slugify(key)]: slugify(value),
    };

    void nextRouter.push({
      pathname: nextRouter.pathname,
      query: queryParams,
    });
  }
  type HandleFilterProps = {
    event: SelectChangeEvent;
    key: "catégorie" | "trie";
  };

  function handleFilter({ event, key }: HandleFilterProps) {
    const { target } = event;
    let { value } = target;
    value = value.toString();
    const props = {
      key,
      value,
      nextRouter: router,
    };
    updateQueryParams(props);
    setChosenCategory(value);

    // TODO: fetch products based on chosen filter
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
                {ALL_CATEGORIES}
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

          <ul className="products">
            {products?.length > 0 ? (
              products.map((product) => (
                <li key={crypto.randomUUID()}>
                  <article className="product">
                    <Link
                      className="product__image-wrapper"
                      href="{{ productUrl }}"
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
                        {product.options[0]?.price}€
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
                  </article>
                </li>
              ))
            ) : (
              <div className="no-product">
                <p className="no-product__message">
                  Il n&apos;y en a pas pour l&apos;instant mais c&apos;est pour
                  bientôt !
                </p>
              </div>
            )}
          </ul>
        </Section>
      </main>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    // https://trpc.io/docs/nextjs/ssr
    // figureout how to fetch categories with ssr then give it to client side component as props and set the chosenCategory state to "Toutes"
    // => pas besoin de fetch pour set "Toutes" ... A réfléchir

    const { data: categories } = await api.categories.getAll.useQuery({
      select: { name: true, id: true },
    });

    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        categories: null,
      },
    };
  }
};

export default Home;
