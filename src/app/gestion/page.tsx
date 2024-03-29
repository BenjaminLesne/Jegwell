"use client"

import { type NextPage } from "next";
import Head from "next/head";

import { TAB_BASE_TITLE } from "~/lib/constants";
import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { api } from "~/trpc/react";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";
import { cn } from "~/lib/helpers/client";

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
          <div>
            <h2>Order Details</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Client</th>
                <th>Adresse</th>
                <th>Prix total</th>
                <th>est payé</th>
                <th>email est envoyé</th>
                <th>Commentaire</th>
              </tr>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.id}
                  </td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.createdAt.toLocaleString("fr", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >{`${order.customer.firstname} ${order.customer.lastname}`}</td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >{`${order.address.line1}, ${order.address.city}, ${order.address.country}`}</td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.price}
                  </td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.isPaid ? "Yes" : "No"}
                  </td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.isEmailSent ? "Yes" : "No"}
                  </td>
                  <td
                    className={cn(
                      "border-solid",
                      "border-2",
                      "border-gray-400",
                    )}
                  >
                    {order.comment}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Home;
