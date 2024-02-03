import Link from "next/link";
import React from "react";
import {
  ADMIN_CATEGORIES,
  ADMIN_DELIVERY_OPTIONS,
  ADMIN_ORDERS_ROUTE,
  ADMIN_PRODUCTS,
} from "~/lib/constants";
import { cn } from "~/lib/helpers/client";

export const AdminHeader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header>
      {children}
      <ul
        className={cn(
          "flex",
          "justify-around",
          "py-3",
          "bg-slate-300",
          "max-w-6xl",
          "m-auto"
        )}
      >
        <li>
          <Link href={ADMIN_ORDERS_ROUTE}>Commandes</Link>
        </li>
        <li>
          <Link href={ADMIN_CATEGORIES}>Catégories</Link>
        </li>
        <li>
          <Link href={ADMIN_PRODUCTS}>Produits</Link>
        </li>
        <li>
          <Link href={ADMIN_DELIVERY_OPTIONS}>Livraisons</Link>
        </li>
        <li>
          <Link href="/">Voir le site</Link>
        </li>
      </ul>
    </header>
  );
};
