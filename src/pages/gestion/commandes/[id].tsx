import { type NextPage } from "next";
import Head from "next/head";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/lib/api";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";

import { useRouter } from "next/router";
import { z } from "zod";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idIsNumber = !isNaN(Number(id));
  const orderNotFoundJSX = (
    <main>
      <p>J&apos;ai pas trouvé la commande avec l&apos;id: {id}</p>
    </main>
  );

  const usableId = id != null || idIsNumber || typeof id === "string";
  const { data: order, isLoading } = api.orders.get.useQuery(
    {
      id: z.number().parse(parseInt(typeof id === "string" ? id : "-1")),
    },
    { enabled: idIsNumber }
  );

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!order && !isLoading) return <Error />;

  if (order == null || !usableId) return orderNotFoundJSX;

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}gestion</title>
      </Head>
      <main>
        <Section>
          <Title>Commande n°{order?.id} : </Title>
          <h1>{order?.id}</h1>
        </Section>
      </main>
    </>
  );
};

export default Home;
