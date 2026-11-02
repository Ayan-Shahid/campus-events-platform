import { expect, test } from '@playwright/test';
import { DEV_UI } from './helpers';

test.describe('responsive navigation', () => {
  test('swaps the top nav links and the bottom tab bar by viewport', async ({ page }) => {
    // Playwright projects decide the viewport, so branch on the project rather than resizing.
    const isMobile = /mobile/i.test(test.info().project.name);

    await page.goto(DEV_UI);

    // The showcase also renders demo copies of both navs inside the sheets, so target the
    // live, page-level ones: the first "Main" nav and the tab bar tagged for tests.
    const topNavLinks = page.locator('nav[aria-label="Main"]').first();
    const tabBar = page.getByTestId('app-mobile-tab-bar');

    // Guard against a vacuous pass: toBeHidden() also succeeds when nothing matches.
    await expect(topNavLinks).toBeAttached();
    await expect(tabBar).toHaveCount(1);

    if (isMobile) {
      await expect(tabBar).toBeVisible();
      await expect(topNavLinks).toBeHidden();
    } else {
      await expect(topNavLinks).toBeVisible();
      await expect(tabBar).toBeHidden();
    }
  });
});
