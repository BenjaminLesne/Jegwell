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

const getByIdsInputSchema = z
  .object({
    ids: z.array(z.string()),
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
  getByIds: publicProcedure
    .input(getByIdsInputSchema)
    .query(({ ctx, input = {} }) => {
      const { ids = [] } = input;

      if (ids?.length === 0) return [];

      const idsAsNumbers = ids
        .map((id: string) => parseInt(id))
        .filter((id: number) => !isNaN(id));

      const arg = {
        where: {
          id: {
            in: idsAsNumbers,
          },
        },
        select: {
          name: true,
          image: {
            select: {
              url: true,
            },
          },
          id: true,
          price: true,
          options: {
            select: {
              id: true,
              name: true,
              price: true,
              image: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      } satisfies Prisma.ProductFindManyArgs;

      const result = ctx.prisma.product.findMany(arg);
      return result;
    }),
});
