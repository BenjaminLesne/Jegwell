import { z } from "zod";
import { orderSchema } from "~/lib/constants";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const inputSchema = orderSchema.omit({
  id: true,
  datetime: true,
  addressId: true,
  customerId: true,
  deliveryOption: true,
});

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(inputSchema)
    .mutation(async ({ ctx, input }) => {
      input;
      const order = await ctx.prisma.order.create({
        data: {
          // address: {
          //   city: "Paris"
          // }
        },
      });

      return order;
    }),
});
