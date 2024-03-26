"use client";

import { type Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/Button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatPrice } from "~/lib/helpers/client";

type MyDeliveryOption = Prisma.DeliveryOptionGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    price: true;
    createdAt: true;
  };
}>;

export const deliveryOptionColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Nom",
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
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const priceInCents = z.number().parse(row.getValue("price"));
      const formatted = formatPrice(priceInCents / 100);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Supprimer</DropdownMenuItem>
            <DropdownMenuItem>modifier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
] satisfies ColumnDef<MyDeliveryOption>[];
