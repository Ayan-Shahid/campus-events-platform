import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RenderTarget, SurfaceKind } from './types';
import { useShaderTarget } from './use-shader-target';

const mocks = vi.hoisted(() => ({
  registerRenderTarget: vi.fn(),
  shouldAnimate: vi.fn(() => true),
  onAnimationPreferenceChange: vi.fn(),
}));

vi.mock('./renderer', () => ({ registerRenderTarget: mocks.registerRenderTarget }));
vi.mock('./support', () => ({
  shouldAnimate: mocks.shouldAnimate,
  onAnimationPreferenceChange: mocks.onAnimationPreferenceChange,
}));

function Probe({ seed = 5, kind = 'surface' }: { seed?: number; kind?: SurfaceKind }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  useShaderTarget(ref, { kind, seed });
  return <canvas ref={ref} data-testid="canvas" />;
}

describe('useShaderTarget', () => {
  const unregister = vi.fn();
  const stopWatching = vi.fn();
  let lastTarget: RenderTarget;
  let preferenceChanged: () => void;

  beforeEach(() => {
    mocks.shouldAnimate.mockReturnValue(true);
    mocks.registerRenderTarget.mockImplementation((target: RenderTarget) => {
      lastTarget = target;
      return unregister;
    });
    mocks.onAnimationPreferenceChange.mockImplementation((callback: () => void) => {
      preferenceChanged = callback;
      return stopWatching;
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('registers the canvas with its kind and seed on mount', () => {
    render(<Probe kind="background" seed={42} />);

    expect(mocks.registerRenderTarget).toHaveBeenCalledTimes(1);
    expect(mocks.registerRenderTarget).toHaveBeenCalledWith(
      expect.objectContaining({
        canvas: screen.getByTestId('canvas'),
        kind: 'background',
        seed: 42,
      }),
    );
  });

  it('unregisters on unmount and clears its attributes', () => {
    const { unmount } = render(<Probe />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveAttribute('data-shader-state', 'running');

    unmount();

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(stopWatching).toHaveBeenCalledTimes(1);
    expect(canvas).not.toHaveAttribute('data-shader-state');
  });

  it('reports "running" when animating and "static" under reduced motion or data saver', () => {
    mocks.shouldAnimate.mockReturnValue(false);
    render(<Probe />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-shader-state', 'static');
  });

  it('follows the animation preference while mounted', () => {
    render(<Probe />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveAttribute('data-shader-state', 'running');

    mocks.shouldAnimate.mockReturnValue(false);
    preferenceChanged();

    expect(canvas).toHaveAttribute('data-shader-state', 'static');
  });

  it('marks the canvas ready after the first frame', () => {
    render(<Probe />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).not.toHaveAttribute('data-shader-ready');

    lastTarget.onFirstFrame?.();

    expect(canvas).toHaveAttribute('data-shader-ready', 'true');
  });

  it('switches to "fallback" and un-readies the canvas when the renderer gives up', () => {
    render(<Probe />);
    const canvas = screen.getByTestId('canvas');
    lastTarget.onFirstFrame?.();

    lastTarget.onFallback?.();

    expect(canvas).toHaveAttribute('data-shader-state', 'fallback');
    expect(canvas).not.toHaveAttribute('data-shader-ready');

    mocks.shouldAnimate.mockReturnValue(false);
    preferenceChanged(); // a preference change must not undo the fallback
    expect(canvas).toHaveAttribute('data-shader-state', 'fallback');
  });

  it('is already "fallback" if the renderer falls back during registration', () => {
    mocks.registerRenderTarget.mockImplementation((target: RenderTarget) => {
      target.onFallback?.();
      return unregister;
    });

    render(<Probe />);

    expect(screen.getByTestId('canvas')).toHaveAttribute('data-shader-state', 'fallback');
  });

  it('re-registers when the seed changes', () => {
    const { rerender } = render(<Probe seed={1} />);
    rerender(<Probe seed={2} />);

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(mocks.registerRenderTarget).toHaveBeenCalledTimes(2);
    expect(mocks.registerRenderTarget).toHaveBeenLastCalledWith(
      expect.objectContaining({ seed: 2 }),
    );
  });
});
