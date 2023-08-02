import { type NextApiRequest, type NextApiResponse } from "next";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";
import { NO_OPTION, PAYMENT_SUCCEEDED_ROUTE } from "~/lib/constants";
import { consoleError } from "~/lib/helpers/helpers";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

const productToBasketSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  optionId: z.string(),
});

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

const bodySchema = z.object({
  basket: z.array(productToBasketSchema),
  customer: customerSchema,
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const body = bodySchema.parse(req.body);
      const ids = body.basket.map((product) => product.id);
      const caller = appRouter.createCaller({ prisma });
      const products = await caller.products.getByIds({ ids });

      if (products === undefined) {
        throw Error("No products returned from database");
      }

      const lineItemsRaw = body.basket.map((orderedProduct) => {
        const { id, optionId, quantity } = orderedProduct;
        const product = products.find((item) => item.id.toString() === id);
        if (!product) {
          consoleError("could not find product with id : " + id);
          return undefined;
        }

        const option = product.options.find(
          (option) => option.id.toString() === optionId
        );

        if (option === undefined && option !== NO_OPTION) {
          consoleError(
            "could not find option with id : " +
              optionId +
              " of product with id " +
              id
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

      const lineItemsWithoutUndefined = lineItemsRaw.filter(
        (item) => item !== undefined
      );
      // since typescript sucks to infer the right type after filtering the undefined...
      const line_items = z
        .array(lineItemSchema)
        .parse(lineItemsWithoutUndefined);

      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["paypal", "card"],
        line_items: line_items,
        success_url: `${
          req.headers.origin ?? "https://jegwell.fr"
        }${PAYMENT_SUCCEEDED_ROUTE}?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
