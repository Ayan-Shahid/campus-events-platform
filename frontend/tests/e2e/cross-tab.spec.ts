import { test } from '@playwright/test';

test.describe('cross-tab sync', () => {
  // Tracked placeholder. Un-fixme it once /my-registrations, the cancel flow and the mock API
  // (phase 3) exist.
  test.fixme('cancelling a registration in one tab updates the other tab without a reload', async ({
    context,
  }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();

    void tab1;
    void tab2;
  });

  test.fixme('signing out in one tab sends the other tab to sign-in', async ({ context }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();

    void tab1;
    void tab2;
  });
});
