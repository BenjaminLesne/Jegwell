import { type PrismaClient, type Option, type Prisma } from "@prisma/client";
import { type OrderedProduct } from "./client";
import { z } from "zod";

export type GetSubtotalPriceProps = {
  quantity: OrderedProduct["quantity"];
  optionId: OrderedProduct["optionId"];
  options: {
    id: Option["id"];
    price: Option["price"];
  }[];
  price: Option["price"];
};

export function getSubtotalPrice(items: GetSubtotalPriceProps[]): number {
  let totalPrice = 0;
  for (const item of items) {
    const chosenOption = item.options.find(
      (option) => option.id === item.optionId,
    );
    const optionPrice = chosenOption ? chosenOption.price : item.price;
    totalPrice += optionPrice * item.quantity;
  }
  return totalPrice;
}

const getByIdsInputSchema = z
  .object({
    ids: z.array(z.number()),
  })
  .optional();

type GetProductsByIdsProps = {
  ctx: {
    db: PrismaClient<Prisma.PrismaClientOptions, never>;
  };
  input: z.infer<typeof getByIdsInputSchema>;
};

export const getProductsByIds = async ({
  ctx,
  input = { ids: [] },
}: GetProductsByIdsProps) => {
  try {
    const { ids } = input;

    if (ids?.length === 0) return [];

    const arg = {
      where: {
        id: {
          in: ids,
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

    const result = await ctx.db.product.findMany(arg);
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};
