import { type Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { ADMIN_SINGLE_ORDER_ROUTE } from "~/lib/constants";
import { formatPrice } from "~/lib/helpers/client";
import { type ProductAdminGetAllArg, type OrderGetAllArg } from "~/lib/types";

type Option = Prisma.OptionGetPayload<{
  include: {
    image: true;
  };
}>;

export const optionColumns = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image.url;

      return (
        <div>
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt={row.original.name}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
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
] satisfies ColumnDef<Option>[];

type MyProduct = Prisma.ProductGetPayload<ProductAdminGetAllArg>;

export const productColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "image",
    header: "Images",
    cell: ({ row }) => {
      const imageUrl = row.original.image.url;

      return (
        <div>
          <Image
            src={imageUrl}
            width={150}
            height={150}
            alt={row.original.name}
          />
        </div>
      );
    },
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
    cell: ({ row }) => {
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
            <DropdownMenuItem
              onClick={row.getToggleExpandedHandler()}
              disabled={row.original.options.length === 0}
            >
              {row.getIsExpanded() ? "Cacher les options" : "Voir les options"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
] satisfies ColumnDef<MyProduct>[];

type Order = Prisma.OrderGetPayload<OrderGetAllArg>;

export const orderColumns = [
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
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem disabled={order.paymentIntentId == null}>
              {order.paymentIntentId != null ? (
                <a
                  href={`https://dashboard.stripe.com/test/payments/${order.paymentIntentId}`}
                >
                  Voir le paiement
                </a>
              ) : (
                "Voir le paiement"
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={ADMIN_SINGLE_ORDER_ROUTE + order.id.toString()}>
                Voir le détails
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
] satisfies ColumnDef<Order>[];
