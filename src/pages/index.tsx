import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import heroImage from "../assets/images/hero.webp";

import { PRODUCTS_ROUTE, TAB_BASE_TITLE } from "~/utils/constants";
import Image from "next/image";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { Rings } from "../assets/svg/Rings";

const Home: NextPage = () => {
  const categories = [] as const;
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
            <Link className="hero__link" href={PRODUCTS_ROUTE}>
              <span className="rounded border-2 border-solid bg-black bg-opacity-25 px-5 py-1 text-xs text-white">
                DÉCOUVRIR
              </span>
            </Link>
          </div>
        </div>
        <Section className="text-center">
          <Title component="h2">QUE FAISONS-NOUS ?</Title>
          <p className="mt-0 text-base">
            Nous créons nos bijoux à Paris avec de l&apos;acier inoxydable
            argenté, doré ou doré rose. Ils sont anti-allergéniques, ne
            noircissent pas la peau, sont insensibles à la rouille et
            l&apos;eau.
          </p>
          <p className="mb-0 text-base">
            Le dîtes à personne mais nous faisons des commandes sur-mesure
            également 😉
          </p>
          <Rings className="mx-auto" />
        </Section>
        <Section id="catégories">
          <Title component="h2">NOS CATÉGORIES</Title>
          <ul className="flex flex-col gap-6">
            {/* {% for category in categories %} */}
            {categories?.map((category) => (
              <li key={crypto.randomUUID()} className="categories__item">
                <a className="categories__link" href="{{category.name}}">
                  <figure className="aspect-w-2 flex w-full overflow-hidden rounded even:flex-row-reverse">
                    <Image
                      className="flex-1"
                      src="" /* category.imageUrl */
                      alt="" /* category.name */
                    />
                    <figcaption className="color-primary flex flex-1 items-center justify-center bg-secondary text-xl">
                      {/* {category.name} */}
                    </figcaption>
                  </figure>
                </a>
              </li>
            ))}
            {/* {% endfor %} */}
          </ul>
        </Section>
      </main>
    </>
  );
};

export default Home;
