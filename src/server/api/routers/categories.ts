import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const GETALL_INPUT_SCHEMA = z
  .object({
    select: z.object({
      name: z.boolean(),
      image: z.object({
        select: z
          .object({
            url: z.boolean().optional(),
          })
          .optional(),
      }),
    }),
  })
  .optional();

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.input(GETALL_INPUT_SCHEMA).query(({ ctx, input }) => {
    return ctx.prisma.category.findMany(input);
  }),
});
