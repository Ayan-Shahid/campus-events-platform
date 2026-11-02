import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Button, ButtonLink } from '@/components/ui/button';
import { renderWithProviders } from '@tests/utils/render';
import { screen } from '@testing-library/react';

describe('Button', () => {
  it('renders the label as its accessible name', () => {
    renderWithProviders(<Button>Reserve seat</Button>);

    expect(screen.getByRole('button', { name: 'Reserve seat' })).toBeInTheDocument();
  });

  it('with loading: has aria-busy="true", keeps the label text, and a click does not call onClick', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <Button loading onClick={handleClick}>
        Reserve seat
      </Button>,
    );

    const button = screen.getByRole('button', { name: /reserve seat/i });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveTextContent('Reserve seat');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('with disabled: not clickable', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <Button disabled onClick={handleClick}>
        Reserve seat
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Reserve seat' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('with asChild + a link inside: renders an <a> with the href (role link, not button)', () => {
    renderWithProviders(<ButtonLink href="/tickets/123">View ticket</ButtonLink>);

    const link = screen.getByRole('link', { name: 'View ticket' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/tickets/123');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
