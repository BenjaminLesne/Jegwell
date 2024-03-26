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

type MyDeliveryOption = Prisma.DeliveryOptionGetPayload<{
  select: {
    id: true;
    imageId: true;
    name: true;
    createdAt: true;
  };
}>;

export const categoriesColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "imageId",
    header: "Image",
    cell: ({ row }) => {
      // const imageUrl = row.original.image.url;

      return (
        <div>
          Image to fetch
          {/* <Image
            src={imageUrl}
            width={100}
            height={100}
            alt={row.original.name}
          /> */}
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
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
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
