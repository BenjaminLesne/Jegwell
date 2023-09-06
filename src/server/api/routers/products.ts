import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import {
  ALL_CATEGORIES,
  DEFAULT_SORT,
  GET_BY_IDS,
  SORT_OPTIONS,
  productAdminGetAllArg,
} from "~/lib/constants";
import { type Prisma } from "@prisma/client";
import { getProductsByIds } from "~/lib/helpers/helpers";

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
    ids: z.array(z.string().optional()),
  })
  .optional();

const getBySingleIdInputSchema = z.object({
  id: z.string().optional(),
});

export const productsRouter = createTRPCRouter({
  // AdminGetAll: adminProcedure.query(({ ctx }) => {
  AdminGetAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany(productAdminGetAllArg);
  }),
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
  [GET_BY_IDS]: publicProcedure
    .input(getByIdsInputSchema)
    .query(getProductsByIds),
  getBySingleId: publicProcedure
    .input(getBySingleIdInputSchema)
    .query(({ ctx, input = {} }) => {
      const { id } = input;

      if (id == null) return;

      const arg = {
        where: {
          id: parseInt(id),
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
          description: true,
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
      } satisfies Prisma.ProductFindUniqueArgs;

      const result = ctx.prisma.product.findUnique(arg);
      return result;
    }),
});
