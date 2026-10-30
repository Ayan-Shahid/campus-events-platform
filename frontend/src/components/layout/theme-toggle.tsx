'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useHydrated } from '@/hooks/use-hydrated';

function ThemeToggle() {
  const hydrated = useHydrated();
  const { resolvedTheme, setTheme } = useTheme();

  if (!hydrated) return <div aria-hidden={true} className="size-9 rounded-xl border bg-card" />;

  const isDark = resolvedTheme === 'dark';

  const nextTheme = isDark ? 'light' : 'dark';

  const ariaLabel = `Switch to ${nextTheme} theme`;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      aria-label={ariaLabel}
      className="relative flex size-9 items-center justify-center rounded-xl border bg-card text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {' '}
      {isDark ? (
        <Sun className="size-4 text-primary transition-transform hover:scale-110" />
      ) : (
        <Moon className="size-4 text-primary transition-transform hover:scale-110" />
      )}
    </button>
  );
}

export default ThemeToggle;
