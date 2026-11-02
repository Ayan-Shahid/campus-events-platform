import { describe, expect, it } from 'vitest';
import backgroundFrag from './background.frag';
import cardSurfaceFrag from './card-surface.frag';
import noiseChunk from './chunks/noise.glsl';
import fullscreenVert from './fullscreen.vert';

const allSources = [
  ['fullscreen.vert', fullscreenVert],
  ['chunks/noise.glsl', noiseChunk],
  ['background.frag', backgroundFrag],
  ['card-surface.frag', cardSurfaceFrag],
] as const;

const fragments = [
  ['background.frag', backgroundFrag],
  ['card-surface.frag', cardSurfaceFrag],
] as const;

describe('shader sources', () => {
  it.each(allSources)('%s is a non-empty string', (_name, source) => {
    expect(typeof source).toBe('string');
    expect(source.length).toBeGreaterThan(0);
  });

  // The composer adds "#version 300 es" and the precision line; a second #version would not compile.
  it.each(allSources)(
    '%s has no #version or precision line (the composer adds them)',
    (_name, source) => {
      expect(source).not.toMatch(/^\s*#version/m);
      expect(source).not.toMatch(/^\s*precision\s/m);
    },
  );

  it.each(fragments)(
    '%s declares the shared uniforms and says it is composed with the noise chunk',
    (_name, source) => {
      for (const uniform of [
        'uniform vec2 u_resolution',
        'uniform float u_time',
        'uniform float u_seed',
        'uniform vec3 u_palette[4]',
        'uniform vec3 u_accent',
        'uniform float u_grain',
      ]) {
        expect(source).toContain(uniform);
      }
      expect(source.split('\n')[0]).toMatch(/composed.*noise/i);
      expect(source).toContain('void main');
    },
  );

  it('the noise chunk provides what the fragments call', () => {
    for (const fn of ['float hash21(', 'float valueNoise(', 'float fbm(']) {
      expect(noiseChunk).toContain(fn);
    }
    expect(noiseChunk).not.toContain('void main');
  });

  it('the vertex shader passes uv to the fragment shaders', () => {
    expect(fullscreenVert).toContain('out vec2 v_uv');
    for (const [, source] of fragments) {
      expect(source).toContain('in vec2 v_uv');
    }
  });
});
