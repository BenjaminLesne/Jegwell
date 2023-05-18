import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { TAB_BASE_TITLE } from "~/utils/constants";

import heroImage from "../../assets/images/hero.webp";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";

const Home: NextPage = () => {
  const products = [
    {
      name: "Bruz",
      options: [{ price: 9999 }],
      image: {
        url: "url/de/test",
      },
    },
  ];

  const category = "boucle d&apos;oreille";
  const sort = "nom A-Z";

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}créations</title>
      </Head>
      <main>
        <Section>
          <Title>NOS CRÉATIONS</Title>
          <button
            className="input-wrapper filter"
            id="categoriesButton"
            data-modal="categoriesModal"
          >
            <div
              className="input filter__content-wrapper"
              data-label="Catégories"
            >
              <span className="filter__text">{category}</span>
              <div className="caret"></div>
            </div>
          </button>

          <button
            className="input-wrapper filter"
            id="sort"
            data-modal="sortModal"
          >
            <div className="input filter__content-wrapper" data-label="Trier">
              <span className="filter__text">{sort}</span>
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

export default Home;
