"use client";

import { type NextPage } from "next";
import Head from "next/head";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/trpc/react";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";
import { DataTable } from "~/components/data-table";
import { productColumns } from "~/components/columns";
import { AdminHeader } from "~/components/Header/AdminHeader";
import { CreateProductDialog } from "~/components/Modals/CreateProductDialog";

const AdminProductsPage: NextPage = () => {
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
      <AdminHeader />
      <main>
        <Section>
          <Title>Produits :</Title>
          <CreateProductDialog />
          <DataTable columns={productColumns} data={products} />
        </Section>
      </main>
    </>
  );
};

export default AdminProductsPage;
