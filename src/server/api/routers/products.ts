import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
          select: z.record( z.string(), z.boolean() ).optional(),
          include: z.record( z.string(), z.boolean() ).optional(),
        }).optional()
    )
    .query(({ ctx, input = {} }) => {
       return ctx.prisma.product.findMany(input);
    }),
});
