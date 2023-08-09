import { expect, test } from "@playwright/test";
import { deliveryBeforeEach, submitDeliveryForm } from "./utils";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { stripe } from "~/server/api/routers/payments";
import { env } from "~/env.mjs";

test.describe("the payment process", () => {
  test.skip(() => env.NODE_ENV !== "test", "in test environment only");
  test.beforeEach(async ({ page }) => {
    await deliveryBeforeEach({ page });
  });

  test("on payment success it update the order", async ({ page }) => {
    const caller = appRouter.createCaller({ prisma });
    const lastOrder = await caller.orders.getLast();

    expect(lastOrder).toBeDefined();
    if (lastOrder == null) throw Error("last order is null");

    await submitDeliveryForm({ page });

    await page.getByLabel("Email").click();
    await page.keyboard.type("jegwell@exemple.fr");

    await page.getByPlaceholder("1234 1234 1234 1234").click();
    await page.keyboard.type("4242 4242 4242 42422");

    await page.getByPlaceholder("MM / YY").click();
    await page.keyboard.type("05 / 25");

    await page.getByPlaceholder("CVC").click();
    await page.keyboard.type("111");

    await page.getByLabel("Name on card").click();
    await page.keyboard.type("Jegwell Bot");

    await page.getByTestId("hosted-payment-submit-button").click();

    await page.waitForTimeout(5000); // we have to wait for the webhook to get triggered after payment
    const order = await caller.orders.get({ id: lastOrder.id + 1 });

    expect(order).toBeDefined();
    if (order == null) throw Error("order is null");

    const { isPaid } = order;
    expect(isPaid).toBe(true);

    try {
      const lastPaymentIntentId = order.paymentIntentId;
      if (lastPaymentIntentId == null) throw Error("payment intent id is null");

      const paymentIntent = await stripe.paymentIntents.retrieve(
        lastPaymentIntentId
      );
      const { amount } = paymentIntent;

      expect(amount).toBe(order.price);
    } catch (error) {
      console.error("Error fetching payment intent:", error);
    }
  });
});
