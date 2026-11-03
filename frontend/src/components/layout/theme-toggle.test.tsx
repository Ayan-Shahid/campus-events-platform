import * as React from 'react';
import { describe, it, expect } from 'vitest';
import ThemeToggle from '@/components/layout/theme-toggle';
import { renderWithProviders } from '@tests/utils/render';
import { screen } from '@testing-library/react';

describe('ThemeToggle', () => {
  it('in dark mode the button’s name is "Switch to light theme"', () => {
    renderWithProviders(<ThemeToggle />, { theme: 'dark' });

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('clicking it switches, and the name changes to "Switch to dark theme"', async () => {
    const { user } = renderWithProviders(<ThemeToggle />, { theme: 'dark' });

    const toggleButton = screen.getByRole('button', { name: 'Switch to light theme' });
    await user.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });
});
