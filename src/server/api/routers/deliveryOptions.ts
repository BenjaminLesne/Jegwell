import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getOrThrowDeliveryOption } from "~/lib/helpers/client";

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

    return ctx.db.deliveryOption.findMany(arg);
  }),
  getOrThrow: publicProcedure
    .input(getDeliveryOptionSchema)
    .mutation(getOrThrowDeliveryOption),
});
