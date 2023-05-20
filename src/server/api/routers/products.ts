import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES } from "~/utils/constants";
import { getSelectFields } from "~/utils/helpers/helpers";

const authorizedFields = ["name", "image.url", "id", "options.price"] as const;
const defaultFields = ["name", "image.url", "id", "options.price"];

const getAllInputSchema = z
  .object({
    category: z.number().optional(),
    fields: z.array(z.enum(authorizedFields)).optional(),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllInputSchema).query(({ ctx, input }) => {
    const { category = ALL_CATEGORIES, fields = defaultFields } = input || {};

    const selectFields = getSelectFields({ fields, authorizedFields });

    type Where = {
      categories?: {
        some: {
          id: number;
        };
      };
    };
    const where: Where = {
      categories: {
        some: {
          id: category,
        },
      },
    };

    if (category === ALL_CATEGORIES) {
      delete where.categories;
    }

    const inputSchema = {
      where,
      select: selectFields,
    };

    return ctx.prisma.product.findMany(inputSchema);
  }),
});
