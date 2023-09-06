import { type NextPage } from "next";
import Head from "next/head";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";
import { DataTable } from "~/components/data-table";
import { productColumns } from "~/components/columns";
import { Button } from "~/components/ui/Button/button";
import { cn } from "~/lib/helpers/helpers";

const Home: NextPage = () => {
  const { data: products, isLoading } = api.products.AdminGetAll.useQuery();

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!products && !isLoading) return <Error />;

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}gestion</title>
      </Head>
      <main>
        <Section>
          <Title>Produits :</Title>
          <Button className={cn("flex", "ml-auto", "mb-10")}>
            Ajouter un produit
          </Button>
          <DataTable columns={productColumns} data={products} />
        </Section>
      </main>
    </>
  );
};

export default Home;
