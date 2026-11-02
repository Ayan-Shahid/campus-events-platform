import { axe } from 'vitest-axe';
import { expect } from 'vitest';

export async function checkA11y(
  container: Element | string,
  options: Parameters<typeof axe>[1] = {},
) {
  const results = await axe(container, {
    rules: {
      // jsdom cannot compute true CSS colors or layout blending, which
      // triggers false negatives/positives. Contrast is verified via Playwright E2E.
      'color-contrast': { enabled: false },
      ...options.rules,
    },
    ...options,
  });

  expect(results).toHaveNoViolations();
}
