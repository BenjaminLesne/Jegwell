import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const getDeliveryOptionSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const deliveryOptionsRouter = createTRPCRouter({
  getOrThrow: publicProcedure
    .input(getDeliveryOptionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const arg = {
        where: {
          id: parseInt(id.toString()),
        },
        select: {
          price: true,
        },
      } satisfies Prisma.DeliveryOptionFindUniqueArgs;

      const deliveryOption = ctx.prisma.deliveryOption.findUniqueOrThrow(arg);
      return deliveryOption;
    }),
});
