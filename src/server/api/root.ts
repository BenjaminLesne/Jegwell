import { createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "~/server/api/routers/products";
import { categoriesRouter } from "./routers/categories";
import { ordersRouter } from "./routers/orders";
import { deliveryOptionsRouter } from "./routers/deliveryOptions";
import { paymentsRouter } from "./routers/payments";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productsRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
  deliveryOptions: deliveryOptionsRouter,
  payments: paymentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
