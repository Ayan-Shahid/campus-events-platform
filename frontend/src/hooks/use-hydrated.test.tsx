import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHydrated } from '@/hooks/use-hydrated';

describe('useHydrated', () => {
  it('using Testing Library’s renderHook on the client, it returns true', () => {
    const { result } = renderHook(() => useHydrated());

    expect(result.current).toBe(true);
  });
});
