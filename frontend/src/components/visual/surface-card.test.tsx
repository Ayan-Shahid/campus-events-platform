import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShaderCanvas from './shader-canvas';

vi.mock('@/lib/webgl/renderer', () => ({ registerRenderTarget: () => () => undefined }));
vi.mock('@/lib/webgl/support', () => ({
  shouldAnimate: () => true,
  onAnimationPreferenceChange: () => () => undefined,
}));

// Decorative canvases are aria-hidden with no role, so Testing Library has no query for them.
/* eslint-disable testing-library/no-node-access */
const canvas = () => document.querySelector('canvas');
/* eslint-enable testing-library/no-node-access */

describe('ShaderCanvas accessibility', () => {
  it.each(['background', 'surface'] as const)(
    'a %s canvas is decorative: hidden from assistive tech and inert',
    (kind) => {
      render(<ShaderCanvas kind={kind} seed={1} />);

      expect(canvas()).toHaveAttribute('aria-hidden', 'true');
      expect(canvas()).toHaveAttribute('inert');
    },
  );

  it('has no tabindex, role or accessible name', () => {
    render(<ShaderCanvas kind="surface" seed={1} />);

    expect(canvas()).not.toHaveAttribute('tabindex');
    expect(canvas()).not.toHaveAttribute('role');
    expect(canvas()).not.toHaveAttribute('aria-label');
    expect(canvas()).not.toHaveAttribute('aria-labelledby');
  });

  it('is not in the accessibility tree', () => {
    render(<ShaderCanvas kind="surface" seed={1} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('keyboard navigation skips it: Tab goes to the real control, never the canvas', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <ShaderCanvas kind="surface" seed={1} />
        <button>After</button>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(canvas()).not.toHaveFocus();
  });
});
