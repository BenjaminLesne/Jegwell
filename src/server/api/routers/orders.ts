import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const ProductToBasketSchema = z.object({
  id: z.number().int(),
  quantity: z.number().int(),
  optionId: z.number().int(),
  productId: z.number().int(),
});

const OrderSchema = z.object({
  isPaid: z.boolean(),
  isEmailSent: z.boolean(),
  paymentIntentId: z.string(),
  price: z.number().int(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  deliveryOptionId: z.number().int(),
  address1: z.string(),
  address2: z.string().optional(),
  country: z.string(),
  postalCode: z.string(),
  city: z.string(),
  comment: z.string().optional(),
  productsToBasket: z.object({
    create: z.array(ProductToBasketSchema),
  }),
});

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(OrderSchema)
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.create({
        data: input,
      });

      return order;
    }),
});
