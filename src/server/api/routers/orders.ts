import { type Prisma } from "@prisma/client";
import {
  deliveryFormSchema,
  lightMergedProductSchema,
  orderSchema,
} from "~/lib/constants";
import { getSubtotalPrice } from "~/lib/helpers/helpers";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { appRouter } from "../root";
import { prisma } from "~/server/db";
import { z } from "zod";

const partialCreateOrderSchema = orderSchema.pick({
  productsToBasket: true,
});
const createOrderSchema = deliveryFormSchema.merge(partialCreateOrderSchema);

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { productsToBasket, deliveryOptionId } = input;

      const ids = productsToBasket.map((product) => product.id.toString());
      const caller = appRouter.createCaller({ prisma });
      const deliveryOption = await caller.deliveryOptions.getOrThrow({
        id: deliveryOptionId,
      });
      const products = await caller.products.getByIds({ ids });

      const mergedProductsRaw = productsToBasket.map((item) => {
        const product = products.find((element) => element.id === item.id);

        const mergedProduct = {
          ...product,
          ...item,
          optionId: item.optionId.toString(),
        };
        return mergedProduct;
      });

      const mergedProducts = z
        .array(lightMergedProductSchema)
        .parse(mergedProductsRaw);

      const subTotalPrice = getSubtotalPrice(mergedProducts);
      const deliveryPrice = z.number().parse(deliveryOption.price); // eslint@typescript-eslint/no-unsafe-assignment was crying for no reason otherwise

      const totalPrice = subTotalPrice + deliveryPrice;

      const data = {
        price: totalPrice,
        productsToBasket: {
          create: productsToBasket.map((item) => ({
            quantity: item.quantity,
            option: {
              connect: {
                id: item.optionId,
              },
            },
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
        customer: {
          create: {
            email: input.email,
            firstname: input.firstname,
            lastname: input.lastname,
            phone: input.phone,
          },
        },
        address: {
          create: {
            line1: input.line1,
            line2: input.line2,
            country: "France",
            postalCode: input.postalCode,
            city: input.city,
          },
        },
        deliveryOption: {
          connect: {
            id: parseInt(input.deliveryOptionId),
          },
        },
        comment: input.comment,
      } satisfies Prisma.OrderCreateArgs["data"];

      const order = await ctx.prisma.order.create({
        data,
      });

      return order;
    }),
});
