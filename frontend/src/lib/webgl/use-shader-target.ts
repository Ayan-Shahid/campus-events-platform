import { useEffect, type RefObject } from 'react';
import { registerRenderTarget } from './renderer';
import { onAnimationPreferenceChange, shouldAnimate } from './support';
import type { SurfaceKind } from './types';

export interface UseShaderTargetOptions {
  kind: SurfaceKind;
  /** Per-instance noise offset; derive it from something stable (see seedFromString). */
  seed: number;
}

export function useShaderTarget(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { kind, seed }: UseShaderTargetOptions,
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionState = () => (shouldAnimate() ? 'running' : 'static');
    canvas.dataset.shaderState = motionState();

    const stopWatchingPreference = onAnimationPreferenceChange(() => {
      if (canvas.dataset.shaderState !== 'fallback') canvas.dataset.shaderState = motionState();
    });

    const unregister = registerRenderTarget({
      canvas,
      kind,
      seed,
      onFirstFrame: () => {
        canvas.dataset.shaderReady = 'true';
      },
      onFallback: () => {
        canvas.dataset.shaderState = 'fallback';
        delete canvas.dataset.shaderReady;
      },
    });

    return () => {
      unregister();
      stopWatchingPreference();
      delete canvas.dataset.shaderState;
      delete canvas.dataset.shaderReady;
    };
  }, [canvasRef, kind, seed]);
}
