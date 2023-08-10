import type { NextApiResponse, NextApiRequest } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { consoleError } from "~/lib/helpers/helpers";
import { z } from "zod";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"] as string;

      const event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          const result = event.data.object as {
            metadata: { orderId: string };
            id: string;
            amount: number;
          };
          const paymentIntentId = z.string().parse(result.id);
          const orderId = z.number().parse(parseInt(result.metadata.orderId));

          const caller = appRouter.createCaller({ prisma });
          const updatedOrder = await caller.orders.paymentSucceeded({
            orderId,
            paymentIntentId,
          });

          if (updatedOrder.isPaid === false) {
            throw Error("updatedOrder.isPaid is false instead of true");
          }

          if (updatedOrder.paymentIntentId == null) {
            throw Error(
              "updatedOrder.paymentIntentId is undefined instead of being a string"
            );
          }

          if (updatedOrder.price === result.amount) {
            throw Error(
              `the order price ${updatedOrder.price} is not matching the stripe payment ${result.amount}`
            );
          }

          break;
        default:
          consoleError(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (err) {
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;
