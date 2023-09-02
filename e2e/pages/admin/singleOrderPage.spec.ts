import { test, expect } from "@playwright/test";
import { testPageScreenshotMatch } from "e2e/utils";
import { ADMIN_SINGLE_ORDER_ROUTE } from "~/lib/constants";

test.describe("single product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_SINGLE_ORDER_ROUTE);
  });

  test("snapshot", async ({ page }) => {
    await testPageScreenshotMatch({ page });
  });

  test("actions button work", async ({ page }) => {
    await page.pause();
  });
});
