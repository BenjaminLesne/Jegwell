import { expect, type Locator, type Page } from "@playwright/test";

type TestArgs = {
  page: Page;
};
export const waitLoadingEnds = async ({ page }: TestArgs) => {
  let progressBar: Locator | undefined = page.getByRole("progressbar").first();
  while (progressBar) {
    await progressBar.waitFor({ state: "hidden" });
    await expect(progressBar).toBeHidden();

    const newProgressBar = page.getByRole("progressbar").first();
    const newProgressBarIsVisble = await newProgressBar.isVisible();
    progressBar = newProgressBarIsVisble ? newProgressBar : undefined;
  }
};

export async function testPageScreenshotMatch({ page }: TestArgs) {
  await expect(page).toHaveScreenshot({ fullPage: true });
}
