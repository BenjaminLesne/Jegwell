import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loading } from "~/components/Loading/Loading";

import { api } from "~/lib/api";
import { PRODUCTS_ROUTE, TAB_BASE_TITLE } from "~/lib/constants";

const SingleProductPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idIsNumber = !isNaN(Number(id));
  const productNotFoundJSX = (
    <main>
      <p>Nous n'avons pas trouvé votre produit.</p>
      <br />
      <Link href={PRODUCTS_ROUTE}>Voir nos créations</Link>
    </main>
  );
  const usableId = id != null || idIsNumber;

  const { data: products, isLoading } = api.products.getByIds.useQuery(
    {
      ids: [id].flat(),
    },
    { enabled: usableId }
  );

  if (isLoading && usableId)
    return (
      <main>
        <Loading />
      </main>
    );

  const product = products?.find((product) => product.id != null);

  if (product == null || !usableId) return productNotFoundJSX;

  return (
    <>
      <Head>
        <title>
          {TAB_BASE_TITLE}
          {product.name}
        </title>
      </Head>
      <main>Création: {product.name}</main>
    </>
  );
};

export default SingleProductPage;
