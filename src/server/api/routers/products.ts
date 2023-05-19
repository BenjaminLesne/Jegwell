import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES } from "~/utils/constants";

const authorizedFields = ["id"] as const;

export const GETALL_INPUT_SCHEMA = z
  .object({
    category: z.string(),
    fields: z.array(z.enum(authorizedFields)).optional(),
  })
  .optional();

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(GETALL_INPUT_SCHEMA)
    .query(({ ctx, input = {} }) => {
      const { category = ALL_CATEGORIES, fields = [] } = input;

      const selectFields = {
        name: true,
        image: { select: { url: true } },
        id: false,
      };

      authorizedFields.forEach((field) => {
        if (fields.includes(field)) selectFields[field] = true;
      });

      type Where = {
        categories?: {
          some: {
            name: string;
          };
        };
      };
      const where: Where = {
        categories: {
          some: {
            name: category,
          },
        },
      };

      if (where.categories?.some.name === ALL_CATEGORIES) {
        delete where.categories;
      }

      const inputSchema = {
        where,
        select: selectFields,
      };

      return ctx.prisma.product.findMany(inputSchema);
    }),
});
