'use client';

import '@/config/zod';
import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { getQueryClient } from '@/lib/query/get-query-client';
import CrossTabSync from '@/app/providers/cross-tab-sync';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
        { ssr: false },
      )
    : () => null;

export default function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CrossTabSync />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
