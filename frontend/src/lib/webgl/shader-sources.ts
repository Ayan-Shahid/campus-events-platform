import noiseChunk from '@/shaders/chunks/noise.glsl';
import backgroundFragment from '@/shaders/background.frag';
import cardSurfaceFragment from '@/shaders/card-surface.frag';
import fullscreenVertex from '@/shaders/fullscreen.vert';
import type { SurfaceKind } from './types';

export const GLSL_HEADER = '#version 300 es\nprecision highp float;\n';

const composeFragment = (fragment: string): string => `${GLSL_HEADER}${noiseChunk}\n${fragment}`;

export const VERTEX_SOURCE = `${GLSL_HEADER}${fullscreenVertex}`;

export const FRAGMENT_SOURCES: Readonly<Record<SurfaceKind, string>> = {
  background: composeFragment(backgroundFragment),
  surface: composeFragment(cardSurfaceFragment),
};
