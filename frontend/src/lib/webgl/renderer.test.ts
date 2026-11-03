import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCanvasWith, createFakeGl } from '@tests/utils/fake-gl';
import { ShaderCompileError } from './gl-program';
import type { ShaderPalette } from './palette';
import {
  computeBackingSize,
  MAX_CONTEXT_LOSSES,
  MAX_DIMENSION,
  WebGLRenderer,
  type RendererDeps,
} from './renderer';
import type { RenderTarget, TargetState } from './types';

const PALETTE: ShaderPalette = {
  colors: [
    [0, 0, 0],
    [0.1, 0.1, 0.1],
    [0.2, 0.2, 0.2],
    [0.3, 0.3, 0.3],
  ],
  accent: [1, 1, 1],
  grain: 0.05,
};

function setup(options: { supported?: boolean; dpr?: number; compileError?: string } = {}) {
  const fake = createFakeGl(
    options.compileError ? { compileError: () => options.compileError } : {},
  );
  const hidden = createCanvasWith({ webgl2: fake.gl });
  const scheduler = {
    add: vi.fn(),
    remove: vi.fn(),
    markAllDirty: vi.fn(),
    setPaused: vi.fn(),
    destroy: vi.fn(),
  };
  const stopPalette = vi.fn();
  let emitPalette: (palette: ShaderPalette) => void = () => undefined;
  const subscribePalette = vi.fn((onChange: (palette: ShaderPalette) => void) => {
    emitPalette = onChange;
    onChange(PALETTE);
    return stopPalette;
  });
  const createCanvas = vi.fn(() => hidden.canvas);

  const deps: RendererDeps = {
    createCanvas,
    detectSupport: () => options.supported ?? true,
    createScheduler: () => scheduler,
    subscribePalette,
    devicePixelRatio: () => options.dpr ?? 1,
  };
  const renderer = new WebGLRenderer(deps);

  /** Registers a target and returns the internal state the scheduler would hold. */
  function register(
    kind: RenderTarget['kind'] = 'surface',
    size: [number, number] = [300, 200],
    extra: Partial<RenderTarget> = {},
  ) {
    const ctx = { drawImage: vi.fn() };
    const { canvas } = createCanvasWith({ '2d': ctx });
    const onFallback = vi.fn();
    const unregister = renderer.register({ canvas, kind, seed: 7, onFallback, ...extra });
    const state = scheduler.add.mock.calls.at(-1)?.[0] as TargetState | undefined;
    if (state) {
      state.cssWidth = size[0];
      state.cssHeight = size[1];
    }
    return { canvas, ctx, onFallback, unregister, state: state as TargetState };
  }

  return {
    fake,
    hidden,
    scheduler,
    stopPalette,
    subscribePalette,
    createCanvas,
    renderer,
    register,
    emitPalette: (palette: ShaderPalette) => {
      emitPalette(palette);
    },
  };
}

function fireContextLost(canvas: HTMLCanvasElement): Event {
  const event = new Event('webglcontextlost', { cancelable: true });
  canvas.dispatchEvent(event);
  return event;
}

describe('computeBackingSize', () => {
  it('renders backgrounds at 0.5x and surfaces at 0.6x', () => {
    expect(computeBackingSize('background', 1000, 600, 1)).toEqual({ width: 500, height: 300 });
    expect(computeBackingSize('surface', 300, 200, 1)).toEqual({ width: 180, height: 120 });
  });

  it('caps the device pixel ratio at 1', () => {
    expect(computeBackingSize('background', 1000, 600, 3)).toEqual({ width: 500, height: 300 });
    expect(computeBackingSize('background', 1000, 600, 0.5)).toEqual({ width: 250, height: 150 });
  });

  it('survives a nonsense ratio, tiny sizes and zero sizes', () => {
    expect(computeBackingSize('surface', 300, 200, Number.NaN)).toEqual({
      width: 180,
      height: 120,
    });
    expect(computeBackingSize('surface', 1, 1, 1)).toEqual({ width: 1, height: 1 });
    expect(computeBackingSize('surface', 0, 200, 1)).toEqual({ width: 0, height: 120 });
  });

  it('caps each side', () => {
    expect(computeBackingSize('background', 100_000, 100_000, 1)).toEqual({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
    });
  });
});

describe('WebGLRenderer', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('lifecycle', () => {
    it('creates nothing until the first target registers', () => {
      const { createCanvas, renderer } = setup();
      expect(renderer.status).toBe('idle');
      expect(createCanvas).not.toHaveBeenCalled();
    });

    it('uses one context and compiles each program once, however many targets register', () => {
      const { createCanvas, hidden, fake, renderer, register } = setup();

      for (let i = 0; i < 30; i++) register('surface');
      register('background');

      expect(renderer.status).toBe('ready');
      expect(renderer.targetCount).toBe(31);
      expect(createCanvas).toHaveBeenCalledTimes(1);
      expect(hidden.getContext).toHaveBeenCalledTimes(1);
      expect(hidden.getContext).toHaveBeenCalledWith(
        'webgl2',
        expect.objectContaining({ powerPreference: 'low-power', preserveDrawingBuffer: false }),
      );
      expect(fake.spies.createProgram).toHaveBeenCalledTimes(2);
    });

    it('subscribes to the palette with the first target and unsubscribes after the last', () => {
      const { subscribePalette, stopPalette, register } = setup();

      const a = register();
      const b = register();
      expect(subscribePalette).toHaveBeenCalledTimes(1);

      a.unregister();
      expect(stopPalette).not.toHaveBeenCalled();
      b.unregister();
      expect(stopPalette).toHaveBeenCalledTimes(1);
    });

    it('unregister is idempotent and removes the target from the scheduler once', () => {
      const { scheduler, renderer, register } = setup();
      const target = register();

      target.unregister();
      target.unregister();

      expect(scheduler.remove).toHaveBeenCalledTimes(1);
      expect(renderer.targetCount).toBe(0);
    });
  });

  describe('fallback', () => {
    it('falls back immediately when WebGL2 is unsupported', () => {
      const { createCanvas, renderer, register } = setup({ supported: false });

      const target = register();

      expect(target.onFallback).toHaveBeenCalledTimes(1);
      expect(renderer.status).toBe('failed');
      expect(createCanvas).not.toHaveBeenCalled();
      expect(() => {
        target.unregister();
      }).not.toThrow();
    });

    it('logs the ShaderCompileError and falls back when a shader does not compile', () => {
      const { renderer, register } = setup({ compileError: "ERROR: 0:3: 'x' : bad" });

      const target = register();

      expect(renderer.status).toBe('failed');
      expect(target.onFallback).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(expect.any(ShaderCompileError));
    });

    it('falls back when no context can be created', () => {
      const hidden = createCanvasWith({});
      const renderer = new WebGLRenderer({
        createCanvas: () => hidden.canvas,
        detectSupport: () => true,
      });
      const onFallback = vi.fn();

      renderer.register({
        canvas: document.createElement('canvas'),
        kind: 'surface',
        seed: 1,
        onFallback,
      });

      expect(onFallback).toHaveBeenCalledTimes(1);
      expect(renderer.status).toBe('failed');
    });

    it('does not need onFallback', () => {
      const { register } = setup({ supported: false });
      expect(() => register('surface', [1, 1], { onFallback: undefined })).not.toThrow();
    });
  });

  describe('renderTarget', () => {
    it('sizes the viewport, sets the uniforms, draws, and copies into the 2D canvas', () => {
      const { fake, hidden, renderer, register } = setup({ dpr: 2 });
      const target = register('background', [1000, 600]);

      expect(renderer.renderTarget(target.state, 12.5)).toBe(true);

      // 0.5x of CSS size; dpr 2 is capped at 1.
      expect(fake.spies.viewport).toHaveBeenLastCalledWith(0, 0, 500, 300);
      expect(fake.spies.uniform2f).toHaveBeenLastCalledWith({ uniform: 'u_resolution' }, 500, 300);
      expect(fake.spies.uniform1f).toHaveBeenCalledWith({ uniform: 'u_time' }, 12.5);
      expect(fake.spies.uniform1f).toHaveBeenCalledWith({ uniform: 'u_seed' }, 7);
      expect(fake.spies.drawArrays).toHaveBeenCalledWith(fake.gl.TRIANGLES, 0, 3);

      expect(target.canvas.width).toBe(500);
      expect(target.canvas.height).toBe(300);
      // The hidden canvas is at least as big; we copy its bottom-left corner.
      expect(hidden.canvas.width).toBeGreaterThanOrEqual(500);
      expect(target.ctx.drawImage).toHaveBeenCalledWith(
        hidden.canvas,
        0,
        hidden.canvas.height - 300,
        500,
        300,
        0,
        0,
        500,
        300,
      );
    });

    it('uses the surface program for cards and the background program for the page', () => {
      const { fake, renderer, register } = setup();
      const card = register('surface');
      const page = register('background', [800, 600]);

      renderer.renderTarget(card.state, 0);
      renderer.renderTarget(page.state, 0);
      renderer.renderTarget(card.state, 0);

      expect(fake.spies.useProgram).toHaveBeenCalledTimes(3);
    });

    it('does not reselect a program or re-upload the palette when nothing changed', () => {
      const { fake, renderer, register, emitPalette } = setup();
      const card = register('surface');

      renderer.renderTarget(card.state, 0);
      renderer.renderTarget(card.state, 1);
      renderer.renderTarget(card.state, 2);
      expect(fake.spies.useProgram).toHaveBeenCalledTimes(1);
      expect(fake.spies.uniform3fv).toHaveBeenCalledTimes(2); // palette array + accent, once

      emitPalette({ ...PALETTE, accent: [0.5, 0.5, 0.5] }); // theme toggled
      renderer.renderTarget(card.state, 3);
      expect(fake.spies.uniform3fv).toHaveBeenCalledTimes(4);
    });

    it('marks every target dirty when the theme palette changes', () => {
      const { scheduler, register, emitPalette } = setup();
      register();
      scheduler.markAllDirty.mockClear();

      emitPalette(PALETTE);

      expect(scheduler.markAllDirty).toHaveBeenCalledTimes(1);
    });

    it('only ever grows the hidden canvas, so mixed sizes do not reallocate it', () => {
      const { hidden, renderer, register } = setup();
      const big = register('background', [1000, 600]);
      const small = register('surface', [300, 200]);

      renderer.renderTarget(big.state, 0);
      const bigWidth = hidden.canvas.width;
      const bigHeight = hidden.canvas.height;
      renderer.renderTarget(small.state, 0);

      expect(hidden.canvas.width).toBe(bigWidth);
      expect(hidden.canvas.height).toBe(bigHeight);
      expect(small.ctx.drawImage).toHaveBeenCalledWith(
        hidden.canvas,
        0,
        bigHeight - 120,
        180,
        120,
        0,
        0,
        180,
        120,
      );
    });

    it('draws nothing (but succeeds) for a zero-sized target', () => {
      const { fake, renderer, register } = setup();
      const target = register('surface', [0, 0]);

      expect(renderer.renderTarget(target.state, 0)).toBe(true);
      expect(fake.spies.drawArrays).not.toHaveBeenCalled();
    });

    it('reports failure when the context is lost', () => {
      const { fake, renderer, register } = setup();
      const target = register();
      fake.setContextLost(true);

      expect(renderer.renderTarget(target.state, 0)).toBe(false);
      expect(target.ctx.drawImage).not.toHaveBeenCalled();
    });

    it('refuses a canvas that already has a different kind of context', () => {
      const { renderer, register } = setup();
      const target = register();
      target.state.canvas = createCanvasWith({}).canvas;
      target.state.context2d = null;

      expect(() => renderer.renderTarget(target.state, 0)).toThrowError(/non-2D context/);
    });
  });

  describe('context loss', () => {
    it('calls preventDefault and pauses the scheduler', () => {
      const { hidden, scheduler, renderer, register } = setup();
      const target = register();

      const event = fireContextLost(hidden.canvas);

      expect(event.defaultPrevented).toBe(true);
      expect(renderer.status).toBe('lost');
      expect(scheduler.setPaused).toHaveBeenCalledWith(true);
      expect(renderer.renderTarget(target.state, 0)).toBe(false);
      expect(target.onFallback).not.toHaveBeenCalled();
    });

    it('rebuilds the programs on restore, resumes, and redraws everything', () => {
      const { fake, hidden, scheduler, renderer, register } = setup();
      const target = register();
      expect(fake.spies.createProgram).toHaveBeenCalledTimes(2);

      fireContextLost(hidden.canvas);
      hidden.canvas.dispatchEvent(new Event('webglcontextrestored'));

      expect(fake.spies.createProgram).toHaveBeenCalledTimes(4);
      expect(renderer.status).toBe('ready');
      expect(scheduler.setPaused).toHaveBeenLastCalledWith(false);
      expect(scheduler.markAllDirty).toHaveBeenCalled();
      expect(renderer.renderTarget(target.state, 0)).toBe(true);
      // Fresh programs need their palette uploaded again.
      expect(fake.spies.uniform3fv).toHaveBeenCalled();
    });

    it('gives up after repeated losses and switches every target to its fallback', () => {
      const { hidden, scheduler, renderer, register } = setup();
      const targets = [register(), register(), register('background')];

      for (let loss = 1; loss < MAX_CONTEXT_LOSSES; loss++) {
        fireContextLost(hidden.canvas);
        hidden.canvas.dispatchEvent(new Event('webglcontextrestored'));
        expect(renderer.status).toBe('ready');
      }
      fireContextLost(hidden.canvas);

      expect(renderer.status).toBe('failed');
      expect(scheduler.destroy).toHaveBeenCalled();
      for (const target of targets) expect(target.onFallback).toHaveBeenCalledTimes(1);
      expect(renderer.targetCount).toBe(0);
    });

    it('sends targets that register after giving up straight to the fallback', () => {
      const { hidden, register } = setup();
      register();
      for (let loss = 0; loss < MAX_CONTEXT_LOSSES; loss++) fireContextLost(hidden.canvas);

      const late = register();

      expect(late.onFallback).toHaveBeenCalledTimes(1);
    });

    it('falls back if the shaders cannot be rebuilt after a restore', () => {
      const { fake, hidden, renderer, register } = setup();
      const target = register();

      fireContextLost(hidden.canvas);
      fake.spies.createShader.mockReturnValue(null as never);
      hidden.canvas.dispatchEvent(new Event('webglcontextrestored'));

      expect(renderer.status).toBe('failed');
      expect(target.onFallback).toHaveBeenCalledTimes(1);
    });

    it('stops listening and frees the context once it has given up', () => {
      const { fake, hidden, renderer, register } = setup();
      register();
      for (let loss = 0; loss < MAX_CONTEXT_LOSSES; loss++) fireContextLost(hidden.canvas);
      expect(fake.loseContext).toHaveBeenCalled();

      const countBefore = fake.spies.createProgram.mock.calls.length;
      hidden.canvas.dispatchEvent(new Event('webglcontextrestored'));

      expect(fake.spies.createProgram).toHaveBeenCalledTimes(countBefore);
      expect(renderer.status).toBe('failed');
    });
  });
});
