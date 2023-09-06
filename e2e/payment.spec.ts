import { expect, test } from "@playwright/test";
import {
  deliveryBeforeEach,
  submitDeliveryForm,
  waitLoadingEnds,
} from "./utils";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { stripe } from "~/server/api/routers/payments";

test.describe("the payment process", () => {
  test.beforeEach(async ({ page }) => {
    await deliveryBeforeEach({ page });
  });

  test.use({
    locale: "en-US",
  });

  test("on payment success it update the order", async ({ page }) => {
    const caller = appRouter.createCaller({ prisma });
    const lastOrder = await caller.orders.getLast();

    expect(lastOrder).toBeDefined();
    if (lastOrder == null) throw Error("last order is null");

    await submitDeliveryForm({ page });
    await waitLoadingEnds({ page });

    await page.getByLabel("Country or region").selectOption("FR"); // pipeline has USA as default country and show a form for american credit cards

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

    await page.waitForURL(/paiement-reussi/);
    await expect(page.getByText("Paiment réussi")).toBeVisible();

    const order = await caller.orders.get({ id: lastOrder.id + 1 });

    expect(order).toBeDefined();
    if (order == null) throw Error("order is null");

    const { isPaid } = order;
    expect(isPaid).toBe(true);

    try {
      const lastPaymentIntentId = order.paymentIntentId;
      expect(lastPaymentIntentId).toBeDefined();
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
