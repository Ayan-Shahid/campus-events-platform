import { expect, test } from '@playwright/test';
import { DEV_UI, waitForHydration } from './helpers';

test.describe('keyboard navigation', () => {
  test('the skip link is the first tab stop and moves focus into main', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');

    // `main` is focusable (tabIndex -1), so focus lands on it directly; accepting a
    // descendant keeps the test about the behaviour rather than the exact element.
    await expect
      .poll(() => page.evaluate(() => !!document.activeElement?.closest('main')))
      .toBe(true);
  });

  test('closing the dialog with Escape returns focus to its trigger', async ({ page }) => {
    await page.goto(DEV_UI);
    await waitForHydration(page);

    const trigger = page.getByRole('button', { name: /cancel event.*\(dialog\)/i });
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Cancel this event?' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
