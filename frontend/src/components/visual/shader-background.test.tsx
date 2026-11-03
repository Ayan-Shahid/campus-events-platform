import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ShaderBackground } from './shader-background';

// Decorative layers are aria-hidden with no role, so Testing Library has no query for them.
/* eslint-disable testing-library/no-node-access */
const layer = () => document.querySelector('[data-slot="shader-background"]');
const fallback = () => layer()?.firstElementChild;
/* eslint-enable testing-library/no-node-access */

const mocks = vi.hoisted(() => ({
  registerRenderTarget: vi.fn(() => () => undefined),
}));

vi.mock('@/lib/webgl/renderer', () => ({ registerRenderTarget: mocks.registerRenderTarget }));
vi.mock('@/lib/webgl/support', () => ({
  shouldAnimate: () => true,
  onAnimationPreferenceChange: () => () => undefined,
}));

describe('ShaderBackground', () => {
  it('is a decorative, non-interactive, fixed layer behind everything', () => {
    render(<ShaderBackground />);

    expect(layer()).toHaveAttribute('aria-hidden', 'true');
    expect(layer()).toHaveClass('fixed', 'inset-0', '-z-10', 'pointer-events-none');
  });

  it('draws the static CSS fallback straight away, before the engine loads', () => {
    render(<ShaderBackground />);

    expect(fallback()).toHaveClass('bg-shader-fallback');
    expect(mocks.registerRenderTarget).not.toHaveBeenCalled();
  });

  it('then loads the engine and registers one background canvas', async () => {
    render(<ShaderBackground seed={7} />);

    await waitFor(() => {
      expect(mocks.registerRenderTarget).toHaveBeenCalledTimes(1);
    });
    expect(mocks.registerRenderTarget).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'background', seed: 7 }),
    );
  });
});
