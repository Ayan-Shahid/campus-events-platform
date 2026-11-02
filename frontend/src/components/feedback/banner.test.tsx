import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Banner from '@/components/feedback/banner';
import { Button } from '@/components/ui/button';
import { renderWithProviders } from '@tests/utils/render';

describe('Banner', () => {
  it('error variant -> role="alert"; info -> role="status"', () => {
    const { getByRole, rerender } = renderWithProviders(
      <Banner variant="error" title="We couldn't sign you in." />,
    );

    expect(getByRole('alert')).toBeInTheDocument();

    rerender(<Banner variant="info" description="Free cancellation until Thu 12 Nov." />);

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('the action button calls its handler', async () => {
    const handleAction = vi.fn();
    const { user, getByRole } = renderWithProviders(
      <Banner
        variant="warning"
        title="Seat counts may be out of date."
        action={<Button onClick={handleAction}>Retry</Button>}
      />,
    );

    await user.click(getByRole('button', { name: 'Retry' }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('dismiss button: has an accessible name and calls onDismiss', async () => {
    const handleDismiss = vi.fn();
    const { user, getByRole } = renderWithProviders(
      <Banner variant="success" title="You're registered." onDismiss={handleDismiss} />,
    );

    const dismissButton = getByRole('button', { name: /dismiss/i });
    expect(dismissButton).toHaveAccessibleName();

    await user.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
