import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import heroImage from "~/assets/images/hero.webp";

import {
  CATEGORY,
  CATEGORY_TEST_ID,
  PRODUCTS_ROUTE,
  TAB_BASE_TITLE,
} from "~/lib/constants";
import Image from "next/image";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { Rings } from "../assets/svg/Rings";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";

const Home: NextPage = () => {
  const { data: categories, isLoading } = api.categories.getAll.useQuery();

  if (!categories && !isLoading) return <Error />;

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}accueil</title>
      </Head>
      <main>
        <div className="relative sm:h-96">
          <Image
            className="sm:object-coverd h-96 w-full object-cover object-center"
            src={heroImage}
            alt=""
          />
          <div className="absolute bottom-20 left-0 flex w-full flex-col items-center text-center font-bold text-white">
            <h1 className="text-xl tracking-wider">BIJOUX FAITS-MAIN</h1>
            <Link href={PRODUCTS_ROUTE}>
              <span className="rounded border-2 border-solid bg-black bg-opacity-25 px-5 py-1 text-xs text-white">
                DÉCOUVRIR
              </span>
            </Link>
          </div>
        </div>
        <Section className="text-center">
          <Title component="h2">QUE FAISONS-NOUS ?</Title>
          <p className="m-auto mt-0 max-w-[60ch] text-base">
            Nous créons nos bijoux à Paris avec de l&apos;acier inoxydable
            argenté, doré ou doré rose. Ils sont anti-allergéniques, ne
            noircissent pas la peau, sont insensibles à la rouille et
            l&apos;eau.
          </p>
          <p className="m-auto mb-0 max-w-[60ch] text-base">
            Le dîtes à personne mais nous faisons des commandes sur-mesure
            également 😉
          </p>
          <Rings className="mx-auto mt-5" />
        </Section>
        <Section id="categories">
          <Title component="h2">NOS CATÉGORIES</Title>
          <ul className="relative grid justify-center gap-6 md:grid-cols-2">
            {isLoading ? (
              <Loading />
            ) : (
              categories?.map((category, index) => (
                <li
                  key={category.id}
                  className="max-w-[500px] flex-1"
                  data-testid={CATEGORY_TEST_ID}
                >
                  <Link
                    className="m-0 w-full"
                    href={`${PRODUCTS_ROUTE}?${CATEGORY}=${category.id}`}
                  >
                    <figure
                      className={`flex aspect-[2/1] w-full overflow-hidden rounded-md ${
                        index % 2 ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Image
                        className="w-1/2"
                        src={category.image.url}
                        alt={"Bijou " + category.name}
                        width="200"
                        height="200"
                      />
                      <figcaption className="flex w-1/2 items-center justify-center bg-secondary  text-xl text-primary">
                        <span className="first-letter:uppercase">
                          {category.name}
                        </span>
                      </figcaption>
                    </figure>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Section>
      </main>
    </>
  );
};

export default Home;
