import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const getDeliveryOptionSchema = z.object({
  id: z.number(),
});

export const deliveryOptionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    const arg = {
      select: {
        name: true,
        id: true,
        description: true,
        price: true,
      },
    } satisfies Prisma.DeliveryOptionFindManyArgs;

    return ctx.prisma.deliveryOption.findMany(arg);
  }),
  getOrThrow: publicProcedure
    .input(getDeliveryOptionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const arg = {
        where: {
          id,
        },
        select: {
          price: true,
        },
      } satisfies Prisma.DeliveryOptionFindUniqueArgs;

      const deliveryOption = ctx.prisma.deliveryOption.findUniqueOrThrow(arg);
      return deliveryOption;
    }),
});
