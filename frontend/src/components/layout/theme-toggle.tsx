'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHydrated } from '@/hooks/use-hydrated';

export type ThemeToggleProps = React.ComponentProps<'button'>;

export default function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        data-slot="theme-toggle-placeholder"
        className={cn('size-9 rounded-lg border border-border bg-muted/30', className)}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light' : 'Switch to dark';

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      data-slot="theme-toggle"
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-sm border border-border bg-card text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {isDark ? (
        <Sun className={cn('size-4')} aria-hidden="true" />
      ) : (
        <Moon className={cn('size-4')} aria-hidden="true" />
      )}
    </button>
  );
}

export { ThemeToggle };
