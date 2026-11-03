import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SurfaceCard } from './surface-card';

const mocks = vi.hoisted(() => ({
  detectWebGL2: vi.fn(() => false),
  registerRenderTarget: vi.fn(() => () => undefined),
}));

vi.mock('@/lib/webgl/support', () => ({
  detectWebGL2: mocks.detectWebGL2,
  shouldAnimate: () => true,
  onAnimationPreferenceChange: () => () => undefined,
}));
vi.mock('@/lib/webgl/renderer', () => ({ registerRenderTarget: mocks.registerRenderTarget }));

function shaderCanvas(): HTMLCanvasElement | null {
  return screen.getByTestId('card').querySelector('canvas');
}

describe('SurfaceCard', () => {
  beforeEach(() => {
    mocks.detectWebGL2.mockReturnValue(false);
  });

  it('renders the plain card colour for surface="plain"', () => {
    mocks.detectWebGL2.mockReturnValue(true);
    render(<SurfaceCard data-testid="card">content</SurfaceCard>);

    expect(screen.getByTestId('card')).toHaveAttribute('data-surface', 'plain');
    expect(shaderCanvas()).toBeNull();
    expect(mocks.registerRenderTarget).not.toHaveBeenCalled();
  });

  it('falls back to the plain card colour when WebGL is not supported', () => {
    render(
      <SurfaceCard surface="shader" data-testid="card">
        content
      </SurfaceCard>,
    );

    expect(shaderCanvas()).toBeNull();
    expect(mocks.registerRenderTarget).not.toHaveBeenCalled();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders the decorative canvas and registers it when WebGL is supported', async () => {
    mocks.detectWebGL2.mockReturnValue(true);
    render(
      <SurfaceCard surface="shader" seed={12.5} data-testid="card">
        content
      </SurfaceCard>,
    );

    await waitFor(() => {
      expect(shaderCanvas()).not.toBeNull();
    });
    expect(shaderCanvas()).toHaveAttribute('aria-hidden', 'true');
    expect(mocks.registerRenderTarget).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'surface', seed: 12.5, canvas: shaderCanvas() }),
    );
  });

  it('keeps content readable above the decorative layer', async () => {
    mocks.detectWebGL2.mockReturnValue(true);
    render(<SurfaceCard surface="shader">Evening talk</SurfaceCard>);

    expect(screen.getByText('Evening talk')).toBeVisible();
  });

  it('still draws shaderGraphic over the card for shader surfaces only', () => {
    const graphic = <div data-testid="graphic" />;
    const { rerender } = render(<SurfaceCard surface="shader" shaderGraphic={graphic} />);
    expect(screen.getByTestId('graphic')).toBeInTheDocument();

    rerender(<SurfaceCard surface="plain" shaderGraphic={graphic} />);
    expect(screen.queryByTestId('graphic')).not.toBeInTheDocument();
  });
});
