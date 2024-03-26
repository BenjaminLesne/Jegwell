import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    const arg = {
      select: {
        name: true,
        id: true,
        image: {
          select: {
            id: true,
          },
        },
      },
    } satisfies Prisma.CategoryFindManyArgs;

    return ctx.db.category.findMany(arg);
  }),
});
