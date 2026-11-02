import * as React from 'react';
import { describe, it, expect } from 'vitest';
import Meter from '@/components/ui/meter';
import { renderWithProviders } from '@tests/utils/render';

describe('Meter', () => {
  it('exposes role="progressbar" with the right aria-valuenow', () => {
    const { getByRole } = renderWithProviders(
      <Meter value={54} max={60} label="54 of 60 seats taken" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '54');
  });

  it('aria-valuetext equals the label prop, e.g. "54 of 60 seats taken"', () => {
    const { getByRole } = renderWithProviders(
      <Meter value={54} max={60} label="54 of 60 seats taken" />,
    );

    const progressbar = getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuetext', '54 of 60 seats taken');
  });
});
