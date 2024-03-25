"use client";

import { api } from "~/trpc/react";
import { Loading } from "~/components/Loading/Loading";
import { Error } from "~/components/Error/Error";
import { DataTable } from "~/components/data-table";
import { productColumns } from "~/components/columns";

export const metadata = {
  title: "gestion",
};

export const ProductsTable = () => {
  const { data: products, isLoading } = api.products.AdminGetAll.useQuery();

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!products && !isLoading) return <Error />;

  return <DataTable columns={productColumns} data={products} />;
};
