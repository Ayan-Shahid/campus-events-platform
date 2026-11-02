import { headers } from 'next/headers';
import '@/config/zod';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import QueryProvider from '@/app/providers/query-provider';
import ThemeProvider from '@/app/providers/theme-provider';

export default async function AppProviders({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <ThemeProvider nonce={nonce}>
      <NuqsAdapter>
        <QueryProvider>{children}</QueryProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
