import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCanvasWith, createFakeGl } from '@tests/utils/fake-gl';
import {
  detectWebGL2,
  onAnimationPreferenceChange,
  resetWebGL2Detection,
  shouldAnimate,
} from './support';

function mockMatchMedia(matches: boolean) {
  const query = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn(() => query),
  });
  return query;
}

function mockSaveData(saveData: boolean | undefined) {
  const connection = Object.assign(new EventTarget(), { saveData });
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  return connection;
}

describe('detectWebGL2', () => {
  beforeEach(() => {
    resetWebGL2Detection();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('probes once, caches the answer, and frees the probe context', () => {
    const fake = createFakeGl();
    const { canvas, getContext } = createCanvasWith({ webgl2: fake.gl });
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(canvas);

    expect(detectWebGL2()).toBe(true);
    expect(detectWebGL2()).toBe(true);

    expect(createElement).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(fake.loseContext).toHaveBeenCalledTimes(1);
  });

  it('is false when no context can be made, and remembers that', () => {
    const { canvas, getContext } = createCanvasWith({});
    vi.spyOn(document, 'createElement').mockReturnValue(canvas);

    expect(detectWebGL2()).toBe(false);
    expect(detectWebGL2()).toBe(false);
    expect(getContext).toHaveBeenCalledTimes(1);
  });

  it('is false when the browser throws', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(detectWebGL2()).toBe(false);
  });
});

describe('shouldAnimate', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('is true by default', () => {
    mockMatchMedia(false);
    expect(shouldAnimate()).toBe(true);
  });

  it('is false under prefers-reduced-motion: reduce', () => {
    mockMatchMedia(true);
    expect(shouldAnimate()).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('is false when the data saver is on', () => {
    mockMatchMedia(false);
    mockSaveData(true);
    expect(shouldAnimate()).toBe(false);
  });

  it('stays true when the connection reports saveData off', () => {
    mockMatchMedia(false);
    mockSaveData(false);
    expect(shouldAnimate()).toBe(true);
  });
});

describe('onAnimationPreferenceChange', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('listens to both preferences and unsubscribes cleanly', () => {
    const query = mockMatchMedia(false);
    const connection = mockSaveData(false);
    const onChange = vi.fn();

    const stop = onAnimationPreferenceChange(onChange);
    expect(query.addEventListener).toHaveBeenCalledWith('change', onChange);

    connection.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledTimes(1);

    stop();
    expect(query.removeEventListener).toHaveBeenCalledWith('change', onChange);
    connection.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
