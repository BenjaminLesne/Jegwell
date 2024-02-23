import { env } from "~/env";
import { consoleError } from "~/lib/helpers/client";
import { z } from "zod";
import { createOrderCaller } from "~/server/api/routers/orders";
import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { stripe } from "./stripe";

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      payload,
      signature!,
      env.STRIPE_WEBHOOK_SECRET,
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
        const orderApi = createOrderCaller({ db, headers: req.headers });
        const updatedOrder = await orderApi.paymentSucceeded({
          orderId,
          paymentIntentId,
        });

        if (updatedOrder.isPaid === false) {
          throw Error("updatedOrder.isPaid is false instead of true");
        }

        if (updatedOrder.paymentIntentId == null) {
          throw Error(
            "updatedOrder.paymentIntentId is null instead of being a string",
          );
        }

        if (updatedOrder.price !== result.amount) {
          throw Error(
            `the order price ${updatedOrder.price} is not matching the stripe payment ${result.amount}`,
          );
        }

        break;
      default:
        consoleError(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = (err as { message: "" })?.message ?? "Unknown Error";

    consoleError(message);
    return NextResponse.json({ message }, { status: 400 });
  }
}
