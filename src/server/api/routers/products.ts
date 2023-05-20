import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ALL_CATEGORIES } from "~/utils/constants";

const authorizedFields = ["id"] as const;

export const GETALL_INPUT_SCHEMA = z
  .object({
    category: z.number(),
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
        id: true,
        options: {
          select: {
            price: true,
          },
        },
      };

      authorizedFields.forEach((field) => {
        if (fields.includes(field)) selectFields[field] = true;
      });

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
