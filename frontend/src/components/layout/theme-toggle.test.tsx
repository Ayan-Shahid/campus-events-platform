import * as React from 'react';
import { describe, it, expect } from 'vitest';
import ThemeToggle from '@/components/layout/theme-toggle';
import { renderWithProviders } from '@tests/utils/render';

describe('ThemeToggle', () => {
  it('in dark mode the button’s name is "Switch to light theme"', () => {
    const { getByRole } = renderWithProviders(<ThemeToggle />, { theme: 'dark' });

    expect(getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('clicking it switches, and the name changes to "Switch to dark theme"', async () => {
    const { user, getByRole } = renderWithProviders(<ThemeToggle />, { theme: 'dark' });

    const toggleButton = getByRole('button', { name: 'Switch to light theme' });
    await user.click(toggleButton);

    expect(getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });
});
