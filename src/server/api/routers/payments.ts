import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env";
import {
  NO_OPTION,
  PAYMENT_SUCCEEDED_ROUTE,
  orderSchema,
} from "~/lib/constants";
import {
  consoleError,
  getOrThrowDeliveryOption,
  getProductsByIds,
} from "~/lib/helpers/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const addressSchema = z.object({
  city: z.string(),
  country: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  postal_code: z.string(),
});

const customerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: addressSchema,
});

const createCheckoutSchema = z
  .object({
    customer: customerSchema,
    orderId: z.number(),
    deliveryOptionId: z.number(),
  })
  .merge(orderSchema.pick({ productsToBasket: true }));

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const paymentsRouter = createTRPCRouter({
  createCheckout: publicProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ ctx, input }) => {
      const ids = input.productsToBasket.map((product) =>
        product.productId.toString(),
      );
      const orderId = input.orderId;
      const products = await getProductsByIds({ ctx, input: { ids } });
      const deliveryOption = await getOrThrowDeliveryOption({
        ctx,
        input: { id: input.deliveryOptionId },
      });

      if (products === undefined) {
        throw Error("No products returned from database");
      }

      const productsItems = input.productsToBasket.map((orderedProduct) => {
        const { productId, optionId, quantity } = orderedProduct;
        const product = products.find((item) => item.id === productId);
        if (!product) {
          consoleError(
            "could not find product with id : " + productId.toString(),
          );
          return undefined;
        }

        const option = product.options.find((option) => option.id === optionId);

        if (option === undefined && optionId !== NO_OPTION) {
          consoleError(
            "could not find option with id : " +
              (optionId ? optionId.toString() : "null") +
              " of product with id " +
              productId.toString(),
          );
        }

        if (quantity < 1) {
          consoleError("quantity or product ordered < 1");
          return undefined;
        }

        const name = option ? `${product.name} ${option.name}` : product.name;
        const lineItem = {
          price_data: {
            currency: "EUR",
            product_data: { name },
            unit_amount: option?.price ?? product?.price,
          },
          quantity,
        };

        return lineItem;
      });

      const lineItemSchema = z.object({
        price_data: z.object({
          currency: z.literal("EUR"),
          product_data: z.object({
            name: z.string(),
          }),
          unit_amount: z.number(),
        }),
        quantity: z.number(),
      });

      const deliveryFeeItem = {
        price_data: {
          currency: "EUR",
          product_data: { name: deliveryOption.name },
          unit_amount: deliveryOption.price,
        },
        quantity: 1,
      } satisfies z.infer<typeof lineItemSchema>;

      const lineItemsRaw = [...productsItems, deliveryFeeItem];

      const lineItemsWithoutUndefined = lineItemsRaw.filter(
        (item) => item !== undefined,
      );
      // since typescript sucks to infer the right type after filtering the undefined...
      const line_items = z
        .array(lineItemSchema)
        .parse(lineItemsWithoutUndefined);

      const success_url =
        env.BASE_URL +
        PAYMENT_SUCCEEDED_ROUTE +
        "?session_id={CHECKOUT_SESSION_ID}";

      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["paypal", "card"],
        line_items,
        success_url,
        payment_intent_data: {
          metadata: {
            orderId,
          },
        },
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      return checkoutSession;
    }),
});
