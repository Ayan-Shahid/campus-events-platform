'use client';

import { useEffect, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
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
  );
}
