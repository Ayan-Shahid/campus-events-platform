import { describe, expect, it } from 'vitest';
import backgroundFrag from './background.frag';
import cardSurfaceFrag from './card-surface.frag';
import fullscreenVert from './fullscreen.vert';

describe('shader imports', () => {
  it.each([
    ['background.frag', backgroundFrag],
    ['card-surface.frag', cardSurfaceFrag],
    ['fullscreen.vert', fullscreenVert],
  ])('%s is imported as its source text', (_name, source) => {
    expect(typeof source).toBe('string');
    expect(source).toContain('void main');
  });
});
