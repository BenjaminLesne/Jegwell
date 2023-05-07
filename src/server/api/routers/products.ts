import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PARAMS_QUERY_SCHEMA } from "~/utils/constants";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(PARAMS_QUERY_SCHEMA)
    .query(({ ctx, input = {} }) => {
      return ctx.prisma.product.findMany(input);
    }),
});
