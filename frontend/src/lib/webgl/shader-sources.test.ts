import { describe, expect, it } from 'vitest';
import { FRAGMENT_SOURCES, GLSL_HEADER, VERTEX_SOURCE } from './shader-sources';

describe('shader sources', () => {
  it.each([
    ['vertex', VERTEX_SOURCE],
    ['background', FRAGMENT_SOURCES.background],
    ['surface', FRAGMENT_SOURCES.surface],
  ])('%s starts with the version line and has exactly one', (_name, source) => {
    expect(source.startsWith('#version 300 es\n')).toBe(true);
    expect(source.match(/^#version/gm)).toHaveLength(1);
    expect(source.startsWith(GLSL_HEADER)).toBe(true);
  });

  it.each(['background', 'surface'] as const)(
    '%s fragment includes the noise chunk before main',
    (kind) => {
      const source = FRAGMENT_SOURCES[kind];
      expect(source.indexOf('float fbm(')).toBeGreaterThan(-1);
      expect(source.indexOf('float fbm(')).toBeLessThan(source.indexOf('void main'));
    },
  );
});
