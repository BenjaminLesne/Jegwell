import { test, expect } from "@playwright/test";
import { waitLoadingEnds } from "e2e/utils";
import { ADMIN_ORDERS_ROUTE } from "~/lib/constants";

test.describe("admin orders page", () => {
  test.skip(
    ({ browserName, channel }) =>
      browserName !== "chromium" || channel !== "chrome",
    "This test is for Google Chrome on the desktop only"
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_ORDERS_ROUTE);
  });

  test("see details action redirect to single order page with right price", async ({
    page,
  }) => {
    const headerRow = page.getByRole("row").first();
    const headerRowCells = await headerRow.getByRole("cell").all();
    let priceCellIndex = -1;

    for (const [index, item] of headerRowCells.entries()) {
      const isVisible = await item.getByText("Montant").isVisible();
      if (isVisible) {
        priceCellIndex = index;
        break; // Exit the loop if the condition is met
      }
    }

    expect(priceCellIndex).toBeGreaterThan(-1);

    const secondRow = page.getByRole("row").nth(1);
    const secondRowPrice = await secondRow
      .getByRole("cell")
      .nth(priceCellIndex)
      .innerText();
    const secondRowMenuItem = secondRow.getByRole("button");

    await secondRowMenuItem.click();
    await page.getByRole("menuitem", { name: "Voir le détails" }).click();
    await waitLoadingEnds({ page });
    await expect(page.getByText("Commandes :")).toBeVisible();
    await expect(page.getByText(secondRowPrice).first()).toBeVisible();
  });
});
