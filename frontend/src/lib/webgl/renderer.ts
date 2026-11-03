import { createProgram, type GlProgram } from './gl-program';
import { flattenColors, subscribeToPalette, type ShaderPalette } from './palette';
import { Scheduler } from './scheduler';
import { FRAGMENT_SOURCES, VERTEX_SOURCE } from './shader-sources';
import { detectWebGL2, WEBGL_CONTEXT_ATTRIBUTES } from './support';
import type { RenderTarget, SurfaceKind, TargetState } from './types';

export const RESOLUTION_SCALE: Readonly<Record<SurfaceKind, number>> = {
  background: 0.5,
  surface: 0.6,
};

export const MAX_DIMENSION = 4096;

export const MAX_CONTEXT_LOSSES = 3;

export function computeBackingSize(
  kind: SurfaceKind,
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
): { width: number; height: number } {
  const dpr = Math.min(
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1,
    1,
  );
  const scale = RESOLUTION_SCALE[kind] * dpr;
  const side = (css: number) =>
    css > 0 ? Math.min(MAX_DIMENSION, Math.max(1, Math.round(css * scale))) : 0;
  return { width: side(cssWidth), height: side(cssHeight) };
}

export type RendererStatus = 'idle' | 'ready' | 'lost' | 'failed';

interface ProgramEntry {
  program: GlProgram;
  paletteVersion: number;
}

type SchedulerLike = Pick<Scheduler, 'add' | 'remove' | 'markAllDirty' | 'setPaused' | 'destroy'>;

export interface RendererDeps {
  createCanvas: () => HTMLCanvasElement;
  detectSupport: () => boolean;
  createScheduler: (render: (target: TargetState, timeSeconds: number) => boolean) => SchedulerLike;
  subscribePalette: (onChange: (palette: ShaderPalette) => void) => () => void;
  devicePixelRatio: () => number;
}

const defaultDeps: RendererDeps = {
  createCanvas: () => document.createElement('canvas'),
  detectSupport: detectWebGL2,
  createScheduler: (render) => new Scheduler(render),
  subscribePalette: (onChange) => subscribeToPalette(onChange),
  devicePixelRatio: () => window.devicePixelRatio,
};

const noop = (): void => undefined;

export class WebGLRenderer {
  private readonly deps: RendererDeps;
  private readonly targets = new Set<TargetState>();
  private currentStatus: RendererStatus = 'idle';
  private lossCount = 0;

  private glCanvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private programs: Record<SurfaceKind, ProgramEntry> | null = null;
  private activeProgram: ProgramEntry | null = null;
  private scheduler: SchedulerLike | null = null;

  private palette: ShaderPalette | null = null;
  private paletteVersion = 0;
  private stopPalette: (() => void) | null = null;

  constructor(deps: Partial<RendererDeps> = {}) {
    this.deps = { ...defaultDeps, ...deps };
  }

  get status(): RendererStatus {
    return this.currentStatus;
  }

  get targetCount(): number {
    return this.targets.size;
  }

  register(target: RenderTarget): () => void {
    if (!this.ensureStarted()) {
      target.onFallback?.();
      return noop;
    }

    const state: TargetState = {
      ...target,
      visible: false,
      dirty: true,
      lastRender: -Infinity,
      cssWidth: 0,
      cssHeight: 0,
      context2d: null,
    };
    this.targets.add(state);
    this.scheduler?.add(state);
    if (this.targets.size === 1) this.startPalette();

    return () => {
      if (!this.targets.delete(state)) return;
      this.scheduler?.remove(state);
      if (this.targets.size === 0) this.endPalette();
    };
  }

  renderTarget = (target: TargetState, time: number): boolean => {
    const { gl, glCanvas, programs, palette } = this;
    if (this.currentStatus !== 'ready' || !gl || !glCanvas || !programs || !palette) return false;
    if (gl.isContextLost()) return false;

    const { width, height } = computeBackingSize(
      target.kind,
      target.cssWidth,
      target.cssHeight,
      this.deps.devicePixelRatio(),
    );
    if (width === 0 || height === 0) return true; // nothing to show yet

    if (glCanvas.width < width || glCanvas.height < height) {
      glCanvas.width = Math.max(glCanvas.width, width);
      glCanvas.height = Math.max(glCanvas.height, height);
    }
    gl.viewport(0, 0, width, height);

    const entry = programs[target.kind];
    if (this.activeProgram !== entry) {
      gl.useProgram(entry.program.program);
      this.activeProgram = entry;
    }
    if (entry.paletteVersion !== this.paletteVersion) {
      gl.uniform3fv(entry.program.uniform('u_palette'), flattenColors(palette.colors));
      gl.uniform3fv(entry.program.uniform('u_accent'), palette.accent);
      gl.uniform1f(entry.program.uniform('u_grain'), palette.grain);
      entry.paletteVersion = this.paletteVersion;
    }
    gl.uniform2f(entry.program.uniform('u_resolution'), width, height);
    gl.uniform1f(entry.program.uniform('u_time'), time);
    gl.uniform1f(entry.program.uniform('u_seed'), target.seed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (gl.isContextLost()) return false;

    const context2d = (target.context2d ??= target.canvas.getContext('2d', { alpha: false }));
    if (!context2d) {
      throw new Error('Render target canvas already has a non-2D context; pass a fresh <canvas>.');
    }
    if (target.canvas.width !== width || target.canvas.height !== height) {
      target.canvas.width = width;
      target.canvas.height = height;
    }
    context2d.drawImage(glCanvas, 0, glCanvas.height - height, width, height, 0, 0, width, height);
    return true;
  };

  private ensureStarted(): boolean {
    if (this.currentStatus === 'failed') return false;
    if (this.currentStatus !== 'idle') return true;
    if (typeof document === 'undefined') return false; // server: never starts, never fails

    if (!this.deps.detectSupport()) {
      this.fail('WebGL2 is not available in this browser.');
      return false;
    }
    try {
      const canvas = this.deps.createCanvas();
      const gl = canvas.getContext('webgl2', WEBGL_CONTEXT_ATTRIBUTES);
      if (!gl) throw new Error('Could not create a WebGL2 context.');
      this.glCanvas = canvas;
      this.gl = gl;
      canvas.addEventListener('webglcontextlost', this.handleContextLost);
      canvas.addEventListener('webglcontextrestored', this.handleContextRestored);
      this.buildPrograms();
    } catch (error) {
      console.error(error);
      this.fail('WebGL setup failed.');
      return false;
    }
    this.currentStatus = 'ready';
    this.scheduler = this.deps.createScheduler(this.renderTarget);
    return true;
  }

  private buildPrograms(): void {
    const { gl } = this;
    if (!gl) throw new Error('No WebGL context.');
    this.programs = {
      background: {
        program: createProgram(gl, 'background', VERTEX_SOURCE, FRAGMENT_SOURCES.background),
        paletteVersion: -1,
      },
      surface: {
        program: createProgram(gl, 'surface', VERTEX_SOURCE, FRAGMENT_SOURCES.surface),
        paletteVersion: -1,
      },
    };
    this.activeProgram = null;
  }

  private startPalette(): void {
    this.stopPalette = this.deps.subscribePalette((palette) => {
      this.palette = palette;
      this.paletteVersion++;
      this.scheduler?.markAllDirty(); // theme toggled: recolour every target
    });
  }

  private endPalette(): void {
    this.stopPalette?.();
    this.stopPalette = null;
  }

  private readonly handleContextLost = (event: Event): void => {
    event.preventDefault();
    this.lossCount++;
    this.programs = null;
    this.activeProgram = null;
    if (this.lossCount >= MAX_CONTEXT_LOSSES) {
      this.fail(`The WebGL context was lost ${this.lossCount} times; giving up.`);
      return;
    }
    this.currentStatus = 'lost';
    this.scheduler?.setPaused(true);
  };

  private readonly handleContextRestored = (): void => {
    if (this.currentStatus !== 'lost') return;
    try {
      this.buildPrograms();
    } catch (error) {
      console.error(error);
      this.fail('Could not rebuild the shaders after the context was restored.');
      return;
    }
    this.paletteVersion++;
    this.currentStatus = 'ready';
    this.scheduler?.setPaused(false);
    this.scheduler?.markAllDirty();
  };

  private fail(reason: string): void {
    if (this.currentStatus === 'failed') return;
    this.currentStatus = 'failed';
    if (process.env.NODE_ENV !== 'production') console.warn(`[webgl] ${reason} Using fallbacks.`);

    const affected = [...this.targets];
    this.targets.clear();
    this.scheduler?.destroy();
    this.scheduler = null;
    this.endPalette();
    this.releaseContext();
    for (const target of affected) target.onFallback?.();
  }

  private releaseContext(): void {
    const { gl, glCanvas } = this;
    glCanvas?.removeEventListener('webglcontextlost', this.handleContextLost);
    glCanvas?.removeEventListener('webglcontextrestored', this.handleContextRestored);
    this.programs = null;
    this.activeProgram = null;
    try {
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      // The context may already be gone; nothing left to free.
    }
    this.gl = null;
    this.glCanvas = null;
  }
}

let singleton: WebGLRenderer | null = null;

export function getRenderer(): WebGLRenderer {
  singleton ??= new WebGLRenderer();
  return singleton;
}

export function registerRenderTarget(target: RenderTarget): () => void {
  if (typeof window === 'undefined') return noop;
  return getRenderer().register(target);
}

export function resetRendererForTests(): void {
  singleton = null;
}
