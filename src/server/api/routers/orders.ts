import { type Prisma } from "@prisma/client";
import {
  deliveryFormSchema,
  orderGetAllArg,
  lightMergedProductSchema,
  orderSchema,
} from "~/lib/constants";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getSubtotalPrice, getProductsByIds } from "~/lib/helpers/server";

const partialCreateOrderSchema = orderSchema.pick({
  productsToBasket: true,
});
const createOrderSchema = deliveryFormSchema.merge(partialCreateOrderSchema);

const paymentSucceededSchema = z.object({
  orderId: z.number(),
  paymentIntentId: z.string(),
});

const getSchema = z.object({
  id: z.number(),
});

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { productsToBasket, deliveryOptionId } = input;

      const ids = productsToBasket.map((item) => item.productId);
      const deliveryOption = await ctx.db.deliveryOption.findFirstOrThrow({
        where: {
          id: parseInt(deliveryOptionId),
        },
      });

      const products = await getProductsByIds({ ctx, input: { ids } });
      const mergedProductsRaw = productsToBasket.map((item) => {
        const product = products.find(
          (element) => element.id === item.productId,
        );

        const mergedProduct = {
          ...product,
          ...item,
          optionId: item.optionId,
        };

        return mergedProduct;
      });

      const mergedProducts = z
        .array(lightMergedProductSchema)
        .parse(mergedProductsRaw);

      const subTotalPrice = getSubtotalPrice(mergedProducts);
      const deliveryPrice = z.number().parse(deliveryOption.price); // eslint@typescript-eslint/no-unsafe-assignment was crying for no reason otherwise

      const totalPrice = subTotalPrice + deliveryPrice;

      const data = {
        price: totalPrice,
        productsToBasket: {
          create: productsToBasket.map((item) => {
            const defaultObject = {
              quantity: item.quantity,
              product: {
                connect: {
                  id: item.productId,
                },
              },
            };

            if (item.optionId != null) {
              const optionConnect = {
                option: {
                  connect: {
                    id: item.optionId,
                  },
                },
              };

              return { ...defaultObject, ...optionConnect };
            }
            return defaultObject;
          }),
        },
        customer: {
          create: {
            email: input.email,
            firstname: input.firstname,
            lastname: input.lastname,
            phone: input.phone,
          },
        },
        address: {
          create: {
            line1: input.line1,
            line2: input.line2,
            country: "France",
            postalCode: input.postalCode,
            city: input.city,
          },
        },
        deliveryOption: {
          connect: {
            id: parseInt(input.deliveryOptionId),
          },
        },
        comment: input.comment,
      } satisfies Prisma.OrderCreateArgs["data"];

      const order = await ctx.db.order.create({
        data,
      });

      return order;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany(orderGetAllArg);

    return orders;
  }),
  getAllPaid: publicProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: {
        isPaid: true,
      },
      include: {
        customer: true,
        address: true,
        deliveryOption: true,
        productsToBasket: true,
      },
    });

    return orders;
  }),
  paymentSucceeded: publicProcedure
    .input(paymentSucceededSchema)
    .mutation(async ({ ctx, input }) => {
      const { orderId, paymentIntentId } = input;

      const order = await ctx.db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          paymentIntentId,
        },
      });

      return order;
    }),
  getLast: publicProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.order.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return order;
  }),

  get: publicProcedure.input(getSchema).query(async ({ ctx, input }) => {
    const { id } = input;

    const order = await ctx.db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        address: true,
        deliveryOption: true,
        productsToBasket: true,
      },
    });

    return order;
  }),
});

export const createOrderCaller = createCallerFactory(ordersRouter);
