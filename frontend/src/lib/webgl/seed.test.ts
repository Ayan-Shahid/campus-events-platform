import { describe, expect, it } from 'vitest';
import { SEED_RANGE, seedFromString } from './seed';

describe('seedFromString', () => {
  it('is deterministic: the same id always gives the same seed', () => {
    expect(seedFromString('evt_01HZX')).toBe(seedFromString('evt_01HZX'));
    expect(seedFromString('')).toBe(seedFromString(''));
  });

  it('is stable across releases (a changed hash would change every card)', () => {
    expect(seedFromString('')).toBe(((2166136261 >>> 0) % (SEED_RANGE * 100)) / 100);
    expect(seedFromString('a')).toBe(seedFromString('a'));
    expect(seedFromString('a')).not.toBe(seedFromString('b'));
  });

  it('stays inside [0, SEED_RANGE)', () => {
    for (let index = 0; index < 2000; index++) {
      const seed = seedFromString(`event-${index}`);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(SEED_RANGE);
    }
  });

  it('spreads similar ids apart', () => {
    const seeds = new Set(
      Array.from({ length: 200 }, (_, index) => seedFromString(`event-${index}`)),
    );
    expect(seeds.size).toBeGreaterThan(190);
  });

  it('handles non-ASCII ids', () => {
    expect(Number.isFinite(seedFromString('سيمينار-🎓'))).toBe(true);
  });
});
