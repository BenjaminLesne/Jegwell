import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const GETALL_INPUT_SCHEMA = z
  .object({
    select: z.record(z.string(), z.boolean()),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.input(GETALL_INPUT_SCHEMA).query(({ ctx, input }) => {
    return ctx.prisma.product.findMany(input);
  }),
});
