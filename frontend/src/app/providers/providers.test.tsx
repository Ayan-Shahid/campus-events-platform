import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import Providers from '@/app/providers/providers';
import { announce } from '@/lib/a11y/announcer';
import { getQueryClient } from '@/lib/query/get-query-client';

function Probe() {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  return (
    <p>
      {queryClient === getQueryClient() ? 'browser-singleton' : 'other-client'} / theme:{theme}
    </p>
  );
}

describe('Providers', () => {
  it('gives children the theme and the browser singleton query client', () => {
    render(
      <Providers nonce="test-nonce">
        <Probe />
      </Providers>,
    );

    expect(screen.getByText('browser-singleton / theme:dark')).toBeInTheDocument();
  });

  it('renders the live regions announce() writes into', async () => {
    render(
      <Providers>
        <p>page</p>
      </Providers>,
    );

    announce('Seats updated');

    expect(await screen.findByText('Seats updated')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Seats updated');
  });
});
