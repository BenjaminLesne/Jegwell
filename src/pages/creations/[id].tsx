import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ProductCard } from "~/components/ProductCard/ProductCard";

import { api } from "~/utils/api";
import { TAB_BASE_TITLE } from "~/utils/constants";

const Products: NextPage = () => {
  const {data: products} = api.products.getAll.useQuery({select: {name: true}});

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}Bruz</title>
      </Head>
      <main className="">
      Création: Bruz
      {products?.map(product => <ProductCard key={crypto.randomUUID()} {...product} />)}
      </main>
    </>
  );
};

export default Products;
