import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ProductCard } from "~/components/ProductCard/ProductCard";

import { PRODUCTS_ROUTE, TAB_BASE_TITLE } from "~/utils/constants";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}accueil</title>
      </Head>
      <main className="">
      <Link href={PRODUCTS_ROUTE}>
      nos créations
      </Link>
      </main>
    </>
  );
};

export default Home;
