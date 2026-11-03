import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FRAME_RATE,
  FRAME_WORK_BUDGET_MS,
  Scheduler,
  STILL_TIME_SECONDS,
  type SchedulerDeps,
} from './scheduler';
import type { SurfaceKind, TargetState } from './types';

const FRAME_MS = 1000 / 60;

function createHarness() {
  let time = 0;
  let nextId = 1;
  const frames = new Map<number, FrameRequestCallback>();
  let intersect: IntersectionObserverCallback = () => undefined;
  let resize: ResizeObserverCallback = () => undefined;
  const preferenceListeners = new Set<() => void>();
  const docListeners = new Set<() => void>();
  const doc = {
    hidden: false,
    addEventListener: vi.fn((_type: string, listener: () => void) => docListeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: () => void) =>
      docListeners.delete(listener),
    ),
  };
  const intersectionObserver = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
  const resizeObserver = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
  const state = { animate: true, workCostMs: 0 };

  const deps: SchedulerDeps = {
    requestFrame: (callback) => {
      const id = nextId++;
      frames.set(id, callback);
      return id;
    },
    cancelFrame: (id) => {
      frames.delete(id);
    },
    now: () => time,
    doc,
    isAnimationEnabled: () => state.animate,
    onAnimationPreferenceChange: (callback) => {
      preferenceListeners.add(callback);
      return () => preferenceListeners.delete(callback);
    },
    createIntersectionObserver: (callback) => {
      intersect = callback;
      return intersectionObserver as unknown as IntersectionObserver;
    },
    createResizeObserver: (callback) => {
      resize = callback;
      return resizeObserver as unknown as ResizeObserver;
    },
  };

  const rendered: { target: TargetState; time: number }[] = [];
  const render = vi.fn((target: TargetState, seconds: number) => {
    rendered.push({ target, time: seconds });
    time += state.workCostMs;
    return true;
  });

  return {
    deps,
    render,
    rendered,
    state,
    doc,
    intersectionObserver,
    resizeObserver,
    docListeners,
    preferenceListeners,
    get pendingFrames() {
      return frames.size;
    },
    frame(ms = FRAME_MS) {
      time += ms;
      const queued = [...frames.entries()];
      frames.clear();
      for (const [, callback] of queued) callback(time);
    },
    frames(count: number) {
      for (let i = 0; i < count; i++) this.frame();
    },
    setVisible(target: TargetState, isIntersecting: boolean) {
      intersect(
        [{ target: target.canvas, isIntersecting } as unknown as IntersectionObserverEntry],
        intersectionObserver as unknown as IntersectionObserver,
      );
    },
    setSize(target: TargetState, width: number, height: number) {
      resize(
        [
          {
            target: target.canvas,
            contentBoxSize: [{ inlineSize: width, blockSize: height }],
            contentRect: { width, height },
          } as unknown as ResizeObserverEntry,
        ],
        resizeObserver as unknown as ResizeObserver,
      );
    },
  };
}

type Harness = ReturnType<typeof createHarness>;

function makeTarget(kind: SurfaceKind = 'surface'): TargetState {
  return {
    canvas: document.createElement('canvas'),
    kind,
    seed: 1,
    visible: false,
    dirty: true,
    lastRender: -Infinity,
    cssWidth: 0,
    cssHeight: 0,
    context2d: null,
  };
}

function addVisible(harness: Harness, scheduler: Scheduler, kind: SurfaceKind = 'surface') {
  const target = makeTarget(kind);
  scheduler.add(target);
  harness.setVisible(target, true);
  harness.setSize(target, 300, 200);
  return target;
}

function countFor(harness: Harness, target: TargetState): number {
  return harness.rendered.filter((entry) => entry.target === target).length;
}

describe('Scheduler', () => {
  let harness: Harness;
  let scheduler: Scheduler;

  beforeEach(() => {
    harness = createHarness();
    scheduler = new Scheduler(harness.render, harness.deps);
  });

  it('draws nothing until a target is both on screen and sized', () => {
    const target = makeTarget();
    scheduler.add(target);
    harness.frames(3);
    expect(harness.render).not.toHaveBeenCalled();
    expect(harness.pendingFrames).toBe(0);

    harness.setVisible(target, true);
    harness.frames(2);
    expect(harness.render).not.toHaveBeenCalled(); // still zero-sized

    harness.setSize(target, 300, 200);
    harness.frame();
    expect(countFor(harness, target)).toBe(1);
    expect(target.dirty).toBe(false);
  });

  it('skips off-screen targets and goes idle when none are visible', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(10);
    const before = countFor(harness, target);
    expect(before).toBeGreaterThan(0);

    harness.setVisible(target, false);
    harness.frames(30);
    expect(countFor(harness, target)).toBe(before);
    expect(scheduler.isRunning).toBe(false);
  });

  it('redraws a target that scrolls back into view', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(10);
    harness.setVisible(target, false);
    harness.frames(5);
    const before = countFor(harness, target);

    harness.setVisible(target, true);
    harness.frame();
    expect(countFor(harness, target)).toBe(before + 1);
  });

  it('draws backgrounds at about 24 fps and surfaces at about 12 fps', () => {
    const background = addVisible(harness, scheduler, 'background');
    const surface = addVisible(harness, scheduler, 'surface');

    harness.frames(60); // one second at 60 Hz

    const backgroundFps = countFor(harness, background);
    const surfaceFps = countFor(harness, surface);
    expect(backgroundFps).toBeGreaterThanOrEqual(FRAME_RATE.background - 3);
    expect(backgroundFps).toBeLessThanOrEqual(FRAME_RATE.background + 2);
    expect(surfaceFps).toBeGreaterThanOrEqual(FRAME_RATE.surface - 2);
    expect(surfaceFps).toBeLessThanOrEqual(FRAME_RATE.surface + 2);
  });

  it('runs no frames while the tab is hidden and resumes when it is shown', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(5);

    harness.doc.hidden = true;
    harness.docListeners.forEach((listener) => {
      listener();
    });
    expect(harness.pendingFrames).toBe(0);
    const before = countFor(harness, target);
    harness.frames(60);
    expect(countFor(harness, target)).toBe(before);

    harness.doc.hidden = false;
    harness.docListeners.forEach((listener) => {
      listener();
    });
    expect(harness.pendingFrames).toBe(1);
    harness.frames(10);
    expect(countFor(harness, target)).toBeGreaterThan(before);
  });

  it('stops entirely with no targets: no frame, observers disconnected, listeners removed', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(3);
    expect(scheduler.isRunning).toBe(true);
    expect(harness.docListeners.size).toBe(1);

    scheduler.remove(target);

    expect(scheduler.size).toBe(0);
    expect(harness.pendingFrames).toBe(0);
    expect(harness.intersectionObserver.disconnect).toHaveBeenCalled();
    expect(harness.resizeObserver.disconnect).toHaveBeenCalled();
    expect(harness.docListeners.size).toBe(0);
    expect(harness.preferenceListeners.size).toBe(0);
  });

  it('marks a target dirty on resize and draws it straight away, even mid-interval', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(10);
    const before = countFor(harness, target);

    harness.setSize(target, 500, 300);
    expect(target.dirty).toBe(true);
    harness.frame();

    expect(countFor(harness, target)).toBe(before + 1);
    expect(target.cssWidth).toBe(500);
  });

  it('ignores a resize report that changes nothing', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(10);
    harness.setSize(target, 300, 200);
    expect(target.dirty).toBe(false);
  });

  it('draws one still frame, then idles, when animation is off', () => {
    harness.state.animate = false;
    const target = addVisible(harness, scheduler);

    harness.frames(30);

    expect(countFor(harness, target)).toBe(1);
    expect(harness.rendered[0]?.time).toBe(STILL_TIME_SECONDS);
    expect(scheduler.isRunning).toBe(false);

    harness.setSize(target, 400, 250); // resizing still redraws
    harness.frames(3);
    expect(countFor(harness, target)).toBe(2);
  });

  it('resumes animating when the preference flips back on', () => {
    harness.state.animate = false;
    const target = addVisible(harness, scheduler);
    harness.frames(5);
    expect(scheduler.isRunning).toBe(false);

    harness.state.animate = true;
    harness.preferenceListeners.forEach((listener) => {
      listener();
    });
    harness.frames(30);
    expect(countFor(harness, target)).toBeGreaterThan(2);
  });

  it('passes slowly increasing time to the renderer', () => {
    addVisible(harness, scheduler);
    harness.frames(60);
    const times = harness.rendered.map((entry) => entry.time);
    expect(times.every((value, index) => index === 0 || value >= (times[index - 1] ?? 0))).toBe(
      true,
    );
    expect(times.at(-1)).toBeGreaterThan(0.8);
  });

  it('spreads many due targets over frames instead of drawing them all at once', () => {
    harness.state.workCostMs = 5; // each draw "costs" 5 ms of the 8 ms budget
    const targets = Array.from({ length: 10 }, () => addVisible(harness, scheduler));

    harness.frame();
    expect(harness.render).toHaveBeenCalledTimes(2);
    expect(FRAME_WORK_BUDGET_MS).toBe(8);

    harness.frames(10);
    for (const target of targets) expect(countFor(harness, target)).toBeGreaterThanOrEqual(1);
  });

  it('draws the stalest target first', () => {
    harness.state.workCostMs = 20; // one draw per frame
    const first = addVisible(harness, scheduler);
    const second = addVisible(harness, scheduler);

    harness.frames(2);

    expect(harness.rendered.map((entry) => entry.target)).toEqual([first, second]);
  });

  it('stops while paused (lost context) and resumes with a redraw', () => {
    const target = addVisible(harness, scheduler);
    harness.frames(5);

    scheduler.setPaused(true);
    expect(harness.pendingFrames).toBe(0);
    const before = countFor(harness, target);
    harness.frames(30);
    expect(countFor(harness, target)).toBe(before);

    scheduler.markAllDirty();
    scheduler.setPaused(false);
    harness.frame();
    expect(countFor(harness, target)).toBe(before + 1);
  });

  it('leaves a target dirty when the renderer could not draw it', () => {
    const target = makeTarget();
    harness.render.mockReturnValueOnce(false);
    scheduler.add(target);
    harness.setVisible(target, true);
    harness.setSize(target, 300, 200);

    harness.frame();

    expect(target.dirty).toBe(true);
  });

  it('destroy removes every target and stops', () => {
    addVisible(harness, scheduler);
    addVisible(harness, scheduler);
    scheduler.destroy();
    expect(scheduler.size).toBe(0);
    expect(harness.pendingFrames).toBe(0);
  });
});
