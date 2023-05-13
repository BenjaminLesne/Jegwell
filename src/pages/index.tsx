import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import heroImage from "../assets/images/hero.webp";

import { PRODUCTS_ROUTE, TAB_BASE_TITLE } from "~/utils/constants";
import Image from "next/image";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { Rings } from "../assets/svg/Rings";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: categories, isLoading } = api.categories.getAll.useQuery({
    select: { name: true, image: { select: { url: true } } },
  });

  if (isLoading) <div>Chargement...</div>;
  if (!categories) <div>Une erreur est survenue.</div>;

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
          <ul className="flex flex-col flex-wrap items-center gap-6 md:flex-row md:justify-center">
            {categories &&
              [...categories, ...categories]?.map((category, index) => (
                <li key={crypto.randomUUID()} className="max-w-full">
                  <Link
                    className="m-0 w-full"
                    href={`${PRODUCTS_ROUTE}?category=${category.name}`}
                  >
                    <figure
                      className={`flex aspect-[2/1] w-full overflow-hidden rounded-md ${
                        index % 2 ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Image
                        className="w-1/2"
                        // src={category.image.url}
                        src={"/hero.webp"}
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
              ))}
          </ul>
        </Section>
      </main>
    </>
  );
};

export default Home;
