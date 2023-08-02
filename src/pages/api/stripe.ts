import type { NextApiResponse, NextApiRequest } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { consoleError } from "~/lib/helpers/helpers";
import { z } from "zod";

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
        console.log("event", event);
        const paymentIntentSucceeded = event.data.object as {
          id: string;
          receipt_email: string;
        };
        // add a customer key to make checkoutSession so I can retrieve it from the event.data.customer variable
        // how do I link the payment intent received with an order? (customer can buy multiple times a day)
        // create the order before creating the checkout session? then give the order id in metadata? (see checkoutSessions/index.ts)

        // do shit with db
        // await client
        //   .put({
        //     TableName: env.TABLE_NAME,
        //     Item: {
        //       pk: `email|${paymentIntentSucceeded.receipt_email}`,
        //       sk: `email|${paymentIntentSucceeded.receipt_email}`,
        //       ...paymentIntentSucceeded,
        //     },
        //   })
        //   .promise();

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
