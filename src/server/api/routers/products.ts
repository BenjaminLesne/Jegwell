import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES } from "~/utils/constants";

const getAllInputSchema = z
  .object({
    category: z.number(),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllInputSchema).query(({ ctx, input }) => {
    const { category = ALL_CATEGORIES } = input ?? {};

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
    };

    if (category === ALL_CATEGORIES) {
      delete arg.where;
    }

    return ctx.prisma.product.findMany(arg);
  }),
});
