import { type Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { formatPrice } from "~/lib/helpers/helpers";
import { type OrderGetAllArg } from "~/lib/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type Order = Prisma.OrderGetPayload<OrderGetAllArg>;

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const date = z.date().parse(row.getValue("createdAt"));

      const frenchFormattedDate = date.toLocaleDateString("fr-FR");

      return (
        <div className="text-right font-medium">{frenchFormattedDate}</div>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payé",
  },
  {
    accessorKey: "isEmailSent",
    header: "Récap envoyé",
  },
  {
    accessorKey: "price",
    header: "Montant",
    cell: ({ row }) => {
      const priceInCents = z.number().parse(row.getValue("price"));
      const formatted = formatPrice(priceInCents / 100);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "comment",
    header: "note client",
  },
];
