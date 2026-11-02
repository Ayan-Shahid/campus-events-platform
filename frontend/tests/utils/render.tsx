import * as React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import Announcer from '@/app/providers/announcer';
import CrossTabSync from '@/app/providers/cross-tab-sync';
import ThemeProvider from '@/app/providers/theme-provider';
import Toaster from '@/app/providers/toaster';
import { makeQueryClient } from '@/lib/query/make-query-client';

export function createTestQueryClient() {
  const client = makeQueryClient();
  const { queries } = client.getDefaultOptions();

  client.setDefaultOptions({
    queries: { ...queries, retry: false, gcTime: 0 },
    mutations: { retry: false },
  });
  return client;
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: string;
  searchParams?: Record<string, string>;
  crossTabSync?: boolean | { navigate: (path: string) => void };
  announcer?: boolean;
  toaster?: boolean;
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
    crossTabSync = false,
    announcer = false,
    toaster = false,
    ...renderOptions
  } = options;

  const user = userEvent.setup();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider defaultTheme={theme} enableSystem={false}>
        <NuqsTestingAdapter searchParams={searchParams}>
          <QueryClientProvider client={queryClient}>
            {crossTabSync && (
              <CrossTabSync
                navigate={typeof crossTabSync === 'object' ? crossTabSync.navigate : undefined}
              />
            )}
            {children}
            {toaster && <Toaster />}
            {announcer && <Announcer />}
          </QueryClientProvider>
        </NuqsTestingAdapter>
      </ThemeProvider>
    );
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    user,
    ...result,
  };
}
