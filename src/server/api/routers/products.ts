import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES, DEFAULT_SORT, SORT_OPTIONS } from "~/lib/constants";
import { type Prisma } from "@prisma/client";

const getAllInputSchema = z
  .object({
    category: z.number().optional(),
    sortType: z
      .enum(Object.keys(SORT_OPTIONS) as [keyof typeof SORT_OPTIONS])
      .optional(),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getAllInputSchema)
    .query(({ ctx, input = {} }) => {
      const { category = ALL_CATEGORIES, sortType = DEFAULT_SORT } = input;

      const arg = {
        where: {
          categories: {
            some: {
              id: category === ALL_CATEGORIES ? undefined : category,
            },
          },
        },
        select: {
          name: true,
          image: {
            select: {
              url: true,
            },
          },
          imageId: true,
          id: true,
          price: true,
          options: {
            select: {
              price: true,
            },
          },
        },
        orderBy: SORT_OPTIONS[sortType],
      } satisfies Prisma.ProductFindManyArgs;

      return ctx.prisma.product.findMany(arg);
    }),
});
