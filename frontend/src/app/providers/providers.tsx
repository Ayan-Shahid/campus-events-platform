'use client';

import '@/config/zod';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import Announcer from '@/app/providers/announcer';
import CrossTabSync from '@/app/providers/cross-tab-sync';
import Devtools from '@/app/providers/devtools';
import ThemeProvider from '@/app/providers/theme-provider';
import Toaster from '@/app/providers/toaster';
import { getQueryClient } from '@/lib/query/get-query-client';

export default function Providers({ children, nonce }: { children: ReactNode; nonce?: string }) {
  return (
    <ThemeProvider nonce={nonce}>
      <NuqsAdapter>
        <QueryClientProvider client={getQueryClient()}>
          <CrossTabSync />
          {children}
          <Toaster />
          <Announcer />
          <Devtools />
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
