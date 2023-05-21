import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES, DEFAULT_SORT, SORT_OPTIONS } from "~/utils/constants";

const getAllInputSchema = z
  .object({
    category: z.number(),
    sortType: z.enum(Object.keys(SORT_OPTIONS) as [keyof typeof SORT_OPTIONS]),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllInputSchema).query(({ ctx, input }) => {
    const { category = ALL_CATEGORIES, sortType = DEFAULT_SORT } = input ?? {};

    type Arg = {
      where?: {
        categories: {
          some: {
            id: number;
          };
        };
      };
      select: {
        name: boolean;
        image: {
          select: {
            url: boolean;
          };
        };
        id: boolean;
        options: {
          select: {
            price: boolean;
          };
        };
      };
      orderBy?: (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
    };
    const arg: Arg = {
      where: {
        categories: {
          some: {
            id: category,
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
        id: true,
        options: {
          select: {
            price: true,
          },
        },
      },
      orderBy: SORT_OPTIONS[sortType],
    };

    if (category === ALL_CATEGORIES) {
      delete arg.where;
    }
    console.log("arg", arg);

    return ctx.prisma.product.findMany(arg);
  }),
});
