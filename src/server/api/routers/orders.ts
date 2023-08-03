import { type Prisma } from "@prisma/client";
import { deliveryFormSchema, orderSchema } from "~/lib/constants";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const partialCreateOrderSchema = orderSchema.pick({
  price: true,
  productsToBasket: true,
});
const createOrderSchema = deliveryFormSchema.merge(partialCreateOrderSchema);
export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        price: input.price,
        productsToBasket: {
          create: input.productsToBasket.map((item) => ({
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
