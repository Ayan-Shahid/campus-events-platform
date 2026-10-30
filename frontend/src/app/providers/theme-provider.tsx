'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
