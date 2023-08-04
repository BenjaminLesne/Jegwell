import type { NextApiResponse, NextApiRequest } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { consoleError } from "~/lib/helpers/helpers";
import { z } from "zod";
import { api } from "~/lib/api";
import { Order } from "@prisma/client";
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
    const buf = await buffer(req);
    const sigSchema = z.union([
      z.string(),
      z.array(z.string()),
      z.instanceof(Buffer),
    ]);
    const sig = sigSchema.parse(req.headers["stripe-signature"]);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const result = event.data.object as {
          metadata: { orderId: string };
          id: string;
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

        break;
      default:
        consoleError(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;
