import { test, expect } from "@playwright/test";
import { testPageScreenshotMatch, waitLoadingEnds } from "e2e/utils";
import { CATEGORY, CATEGORY_TEST_ID, HOME_ROUTE } from "~/lib/constants";

test.describe("the home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_ROUTE);
    await page.waitForURL(HOME_ROUTE, { waitUntil: "domcontentloaded" });
    await waitLoadingEnds({ page });
  });
  test("home match snapshot", async ({ page }) => {
    await testPageScreenshotMatch({ page });
  });

  test("categories cards have right links", async ({ page, context }) => {
    await expect(page.getByTestId(CATEGORY_TEST_ID).first()).toBeVisible();
    const links = await page.getByTestId(CATEGORY_TEST_ID).all();
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      const pagePromise = context.waitForEvent("page");
      const categoryWanted = await link.innerText();
      await link.click({ modifiers: ["Control"] });

      const newPage = await pagePromise;
      await newPage.waitForLoadState();
      await newPage.bringToFront();

      const regex = new RegExp(encodeURIComponent(CATEGORY));
      await expect(newPage).toHaveURL(regex);

      const categorySelected = newPage.getByText(categoryWanted);

      await expect(categorySelected).toBeVisible();
      await newPage.close();
    }
  });
});
