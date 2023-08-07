import { expect, type Page } from "@playwright/test";

type TestArgs = {
  page: Page;
};
export const waitLoadingEnds = async ({ page }: TestArgs) => {
  const progressBar = page.getByRole("progressbar").first();
  let progressIsVisible = await progressBar.isVisible();

  while (progressIsVisible) {
    await progressBar.waitFor({ state: "hidden" });

    const newProgressBar = page.getByRole("progressbar").first();
    const newProgressBarIsVisble = await newProgressBar.isVisible();
    progressIsVisible = newProgressBarIsVisble;
  }

  await expect(progressBar).toBeHidden();
};

export async function testPageScreenshotMatch({ page }: TestArgs) {
  await expect(page).toHaveScreenshot({
    fullPage: true,
    maxDiffPixelRatio: 0.2,
  });
}
