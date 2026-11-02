import * as React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Show query errors immediately without waiting on retries
        gcTime: 0, // No garbage-collection timers so test runs don't hang
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: string;
  searchParams?: Record<string, string>;
}

export interface CustomRenderResult extends RenderResult {
  user: UserEvent;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {},
): CustomRenderResult {
  const {
    queryClient = createTestQueryClient(),
    theme = 'dark',
    searchParams = {},
    ...renderOptions
  } = options;

  const user = userEvent.setup();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NuqsTestingAdapter searchParams={searchParams}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </NuqsTestingAdapter>
    );
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    user,
    ...result,
  };
}
