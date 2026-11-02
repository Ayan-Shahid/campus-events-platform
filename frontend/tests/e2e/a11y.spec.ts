import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { DEV_UI, setTheme, type Theme } from './helpers';

const WCAG_A_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const themes: Theme[] = ['dark', 'light'];

test.describe('accessibility: /dev/ui', () => {
  // axe's colour-contrast rule is part of the WCAG AA tag set, so running the same scan in
  // each theme is what proves contrast holds in both. Separate tests keep a failure in one
  // theme from hiding the result for the other.
  for (const theme of themes) {
    test(`has no WCAG 2.1 A/AA violations in the ${theme} theme`, async ({ page }) => {
      await page.goto(DEV_UI);
      await setTheme(page, theme);

      const results = await new AxeBuilder({ page }).withTags(WCAG_A_AA_TAGS).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
