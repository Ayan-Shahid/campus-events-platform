import { onAnimationPreferenceChange, shouldAnimate } from './support';
import type { SurfaceKind, TargetState } from './types';

export const FRAME_RATE: Readonly<Record<SurfaceKind, number>> = {
  background: 24,
  surface: 12,
};

const INTERVAL_TOLERANCE_MS = 4;

export const FRAME_WORK_BUDGET_MS = 8;

export const STILL_TIME_SECONDS = 8;

const INTERSECTION_ROOT_MARGIN = '120px';

const frameInterval = (kind: SurfaceKind): number => 1000 / FRAME_RATE[kind];

export interface SchedulerDeps {
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (id: number) => void;
  now: () => number;
  doc: Pick<Document, 'hidden' | 'addEventListener' | 'removeEventListener'>;
  isAnimationEnabled: () => boolean;
  onAnimationPreferenceChange: (callback: () => void) => () => void;
  createIntersectionObserver: (callback: IntersectionObserverCallback) => IntersectionObserver;
  createResizeObserver: (callback: ResizeObserverCallback) => ResizeObserver;
}

function defaultDeps(): SchedulerDeps {
  return {
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    cancelFrame: (id) => {
      window.cancelAnimationFrame(id);
    },
    now: () => performance.now(),
    doc: document,
    isAnimationEnabled: shouldAnimate,
    onAnimationPreferenceChange,
    createIntersectionObserver: (callback) =>
      new IntersectionObserver(callback, { rootMargin: INTERSECTION_ROOT_MARGIN }),
    createResizeObserver: (callback) => new ResizeObserver(callback),
  };
}

export class Scheduler {
  private readonly targets = new Set<TargetState>();
  private readonly byElement = new Map<Element, TargetState>();
  private readonly deps: SchedulerDeps;
  private frameId: number | null = null;
  private epoch: number | null = null;
  private paused = false;
  private intersectionObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private detach: (() => void) | null = null;

  constructor(
    private readonly render: (target: TargetState, timeSeconds: number) => boolean,
    deps: Partial<SchedulerDeps> = {},
  ) {
    this.deps = { ...defaultDeps(), ...deps };
  }

  get size(): number {
    return this.targets.size;
  }

  get isRunning(): boolean {
    return this.frameId !== null;
  }

  add(target: TargetState): void {
    if (this.targets.size === 0) this.attach();
    this.targets.add(target);
    this.byElement.set(target.canvas, target);
    this.intersectionObserver?.observe(target.canvas);
    this.resizeObserver?.observe(target.canvas);
  }

  remove(target: TargetState): void {
    if (!this.targets.delete(target)) return;
    this.byElement.delete(target.canvas);
    this.intersectionObserver?.unobserve(target.canvas);
    this.resizeObserver?.unobserve(target.canvas);
    if (this.targets.size === 0) this.release();
  }

  markDirty(target: TargetState): void {
    target.dirty = true;
    this.schedule();
  }

  markAllDirty(): void {
    for (const target of this.targets) target.dirty = true;
    this.schedule();
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) this.cancel();
    else this.schedule();
  }

  destroy(): void {
    for (const target of [...this.targets]) this.remove(target);
    this.release();
  }

  private attach(): void {
    this.intersectionObserver = this.deps.createIntersectionObserver((entries) => {
      for (const entry of entries) {
        const target = this.byElement.get(entry.target);
        if (!target || target.visible === entry.isIntersecting) continue;
        target.visible = entry.isIntersecting;
        if (target.visible) target.dirty = true; // it may have changed while off-screen
      }
      this.schedule();
    });

    this.resizeObserver = this.deps.createResizeObserver((entries) => {
      for (const entry of entries) {
        const target = this.byElement.get(entry.target);
        if (!target) continue;
        const box = entry.contentBoxSize[0];
        const width = box?.inlineSize ?? entry.contentRect.width;
        const height = box?.blockSize ?? entry.contentRect.height;
        if (width === target.cssWidth && height === target.cssHeight) continue;
        target.cssWidth = width;
        target.cssHeight = height;
        target.dirty = true;
      }
      this.schedule();
    });

    const onVisibilityChange = () => {
      if (this.deps.doc.hidden) this.cancel();
      else this.schedule();
    };
    this.deps.doc.addEventListener('visibilitychange', onVisibilityChange);
    const stopPreference = this.deps.onAnimationPreferenceChange(() => {
      this.schedule();
    });
    this.detach = () => {
      this.deps.doc.removeEventListener('visibilitychange', onVisibilityChange);
      stopPreference();
    };
  }

  private release(): void {
    this.cancel();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.intersectionObserver = null;
    this.resizeObserver = null;
    this.detach?.();
    this.detach = null;
    this.epoch = null;
  }

  private cancel(): void {
    if (this.frameId !== null) this.deps.cancelFrame(this.frameId);
    this.frameId = null;
  }

  private isDrawable(target: TargetState): boolean {
    return target.visible && target.cssWidth > 0 && target.cssHeight > 0;
  }

  private hasWork(animate: boolean): boolean {
    if (this.paused || this.deps.doc.hidden) return false;
    for (const target of this.targets) {
      if (this.isDrawable(target) && (animate || target.dirty)) return true;
    }
    return false;
  }

  private schedule(): void {
    if (this.frameId !== null) return;
    if (!this.hasWork(this.deps.isAnimationEnabled())) return;
    this.frameId = this.deps.requestFrame(this.tick);
  }

  private readonly tick = (now: number): void => {
    this.frameId = null;
    if (this.paused || this.deps.doc.hidden) return;

    this.epoch ??= now;
    const animate = this.deps.isAnimationEnabled();
    const started = this.deps.now();

    const due: TargetState[] = [];
    for (const target of this.targets) {
      if (!this.isDrawable(target)) continue;
      if (
        target.dirty ||
        (animate && now - target.lastRender >= frameInterval(target.kind) - INTERVAL_TOLERANCE_MS)
      ) {
        due.push(target);
      }
    }
    // Dirty targets first (a resize should not wait), then the stalest.
    due.sort((a, b) => Number(b.dirty) - Number(a.dirty) || a.lastRender - b.lastRender);

    const timeSeconds = animate ? (now - this.epoch) / 1000 : STILL_TIME_SECONDS;
    let drawn = 0;
    for (const target of due) {
      if (drawn > 0 && this.deps.now() - started > FRAME_WORK_BUDGET_MS) break;
      if (!this.render(target, timeSeconds)) break;

      if (target.dirty || !Number.isFinite(target.lastRender)) {
        target.lastRender = now;
      } else {
        const interval = frameInterval(target.kind);
        target.lastRender = Math.max(target.lastRender + interval, now - interval);
      }
      target.dirty = false;
      drawn++;
    }

    this.schedule();
  };
}
