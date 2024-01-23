import { test } from "@playwright/test";
import { testPageScreenshotMatch, waitLoadingEnds } from "e2e/utils";
import { ADMIN_SINGLE_ORDER_ROUTE } from "~/lib/constants";

test.describe("admin single order page", () => {
  test.skip(
    ({ browserName, channel }) =>
      browserName !== "chromium" || channel !== "chrome",
    "This test is for Google Chrome on the desktop only"
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_SINGLE_ORDER_ROUTE + "1");
    await waitLoadingEnds({ page });
  });

  test.only("match snapshot", async ({ page }) => {
    await testPageScreenshotMatch({ page });
  });
});
