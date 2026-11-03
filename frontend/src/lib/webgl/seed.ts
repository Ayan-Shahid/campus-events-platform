/** Seeds land in [0, SEED_RANGE), the range the shaders' per-instance offset is tuned for. */
export const SEED_RANGE = 100;

/**
 * A stable shader seed from a string such as an event id: the same id gives the same pattern
 * on every visit, on every device. FNV-1a, mapped to two decimal places so that near seeds
 * are not just the same noise shifted by whole cells.
 */
export function seedFromString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % (SEED_RANGE * 100)) / 100;
}
