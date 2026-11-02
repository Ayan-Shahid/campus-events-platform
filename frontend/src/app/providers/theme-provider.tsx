'use client';
import { Toaster as SonnerToaster } from 'sonner';
import type { ReactNode } from 'react';
import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

function ThemeProvider({ children, nonce }: { children: ReactNode; nonce?: string }) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <NextThemeProvider
      nonce={nonce}
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <div className="sr-only">
        <div id="a11y-announcer-polite" role="status" aria-live="polite" aria-atomic="true" />
        <div id="a11y-announcer-assertive" role="alert" aria-live="assertive" aria-atomic="true" />
      </div>
      <SonnerToaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        toastOptions={{
          className:
            '!bg-card !text-foreground !text-sm !gap-2 !border !border-success/60 !rounded-lg !px-5 py-3 !shadow-lg font-sans',
          descriptionClassName: '!text-faint',
          actionButtonStyle: {
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            fontSize: 'var(--text-base)',
            textDecoration: 'underline',
            fontWeight: 600,
          },
        }}
      />
    </NextThemeProvider>
  );
}

export default ThemeProvider;
