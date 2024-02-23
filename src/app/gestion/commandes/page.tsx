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
import { orderColumns } from "~/components/columns";
import { AdminHeader } from "~/components/Header/AdminHeader";

const Home: NextPage = () => {
  const { data: orders, isLoading } = api.orders.getAll.useQuery();

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!orders && !isLoading) return <Error />;

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}gestion</title>
      </Head>
      <AdminHeader />
      <main>
        <Section>
          <Title>Commandes :</Title>
          <DataTable columns={orderColumns} data={orders} />
        </Section>
      </main>
    </>
  );
};

export default Home;
