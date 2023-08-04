import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import heroImage from "../assets/images/hero.webp";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";

const Home: NextPage = () => {
  const { data: orders, isLoading } = api.orders.getAllPaid.useQuery();

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
      <main>
        <Section>
          <Title>Commandes :</Title>
        </Section>
      </main>
    </>
  );
};

export default Home;
