import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  flattenColors,
  parseCssColor,
  readShaderPalette,
  subscribeToPalette,
  type Rgb,
} from './palette';

function expectRgb(actual: Rgb | null, expected: [number, number, number]) {
  expect(actual).not.toBeNull();
  actual?.forEach((channel, index) => {
    expect(channel).toBeCloseTo(expected[index] ?? NaN, 5);
  });
}

describe('parseCssColor', () => {
  it.each([
    ['#000000', [0, 0, 0]],
    ['#ffffff', [1, 1, 1]],
    ['#FF8A4C', [1, 138 / 255, 76 / 255]],
    ['#0a1124', [10 / 255, 17 / 255, 36 / 255]],
    ['#f80', [1, 136 / 255, 0]],
    ['#F80', [1, 136 / 255, 0]],
    ['#f80c', [1, 136 / 255, 0]],
    ['#ff8800cc', [1, 136 / 255, 0]],
  ] as const)('hex %s', (input, expected) => {
    expectRgb(parseCssColor(input), [...expected]);
  });

  it.each([
    ['rgb(255, 128, 0)', [1, 128 / 255, 0]],
    ['rgb(255,128,0)', [1, 128 / 255, 0]],
    ['rgba(255, 128, 0, 0.5)', [1, 128 / 255, 0]],
    ['rgb(255 128 0)', [1, 128 / 255, 0]],
    ['rgb(255 128 0 / 50%)', [1, 128 / 255, 0]],
    ['RGB(255, 128, 0)', [1, 128 / 255, 0]],
    ['rgb(100%, 50%, 0%)', [1, 0.5, 0]],
    ['rgb(10.5, 0, 0)', [10.5 / 255, 0, 0]],
  ] as const)('function %s', (input, expected) => {
    expectRgb(parseCssColor(input), [...expected]);
  });

  it.each([
    ['  #0a1124  '],
    ['\n  #0a1124\n'],
    ['\t#0a1124'],
    ['rgb(  10 ,  17 ,  36  )'],
    ['  rgb(10   17   36)  '],
    ['rgb(\n10,\n17,\n36\n)'],
  ])('tolerates whitespace: %j', (input) => {
    expectRgb(parseCssColor(input), [10 / 255, 17 / 255, 36 / 255]);
  });

  it('clamps out-of-range channels', () => {
    expectRgb(parseCssColor('rgb(300, -5, 128)'), [1, 0, 128 / 255]);
    expectRgb(parseCssColor('rgb(150%, 0%, 0%)'), [1, 0, 0]);
  });

  it.each([
    [''],
    ['   '],
    ['red'],
    ['transparent'],
    ['#12'],
    ['#12345'],
    ['#1234567'],
    ['#ggg'],
    ['0a1124'],
    ['rgb(1, 2)'],
    ['rgb(1, 2, 3, 4, 5)'],
    ['rgb(a, b, c)'],
    ['rgb(1 2 3'],
    ['oklch(0.5 0.1 200)'],
    ['hsl(200, 50%, 50%)'],
  ])('rejects %j', (input) => {
    expect(parseCssColor(input)).toBeNull();
  });
});

describe('flattenColors', () => {
  it('lays colours out for gl.uniform3fv', () => {
    const flat = flattenColors([
      [0, 0.5, 1],
      [1, 0.25, 0],
    ]);
    expect(Array.from(flat)).toEqual([0, 0.5, 1, 1, 0.25, 0]);
  });
});

describe('readShaderPalette and subscribeToPalette', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
    document.documentElement.className = '';
    vi.restoreAllMocks();
  });

  function setTokens(root: HTMLElement, accent: string) {
    ['#0a1124', ' #1b2b5e ', 'rgb(22 138 128)', '#ff8a4c'].forEach((value, index) => {
      root.style.setProperty(`--shader-${index}`, value);
    });
    root.style.setProperty('--shader-accent', accent);
    root.style.setProperty('--shader-grain', ' 0.05 ');
  }

  it('reads the tokens, tolerating the whitespace computed styles can carry', () => {
    const root = document.documentElement;
    setTokens(root, '#8fd9f2');

    const palette = readShaderPalette(root);

    expectRgb(palette.colors[0], [10 / 255, 17 / 255, 36 / 255]);
    expectRgb(palette.colors[1], [27 / 255, 43 / 255, 94 / 255]);
    expectRgb(palette.colors[2], [22 / 255, 138 / 255, 128 / 255]);
    expectRgb(palette.colors[3], [1, 138 / 255, 76 / 255]);
    expectRgb(palette.accent, [143 / 255, 217 / 255, 242 / 255]);
    expect(palette.grain).toBeCloseTo(0.05, 5);
  });

  it('falls back (and warns) when a token is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const palette = readShaderPalette(document.documentElement);

    expect(palette.colors).toHaveLength(4);
    expect(palette.grain).toBeCloseTo(0.05, 5);
    expect(warn).toHaveBeenCalled();
  });

  it('re-reads the palette when the theme class on <html> changes', async () => {
    const root = document.documentElement;
    setTokens(root, '#8fd9f2');
    const seen: number[] = [];

    const stop = subscribeToPalette((palette) => seen.push(palette.accent[0]), root);
    expect(seen).toHaveLength(1);

    root.style.setProperty('--shader-accent', '#8a5a34');
    root.classList.add('dark');
    await vi.waitFor(() => {
      expect(seen).toHaveLength(2);
    });
    expect(seen[1]).toBeCloseTo(138 / 255, 5);

    stop();
    root.classList.remove('dark');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(seen).toHaveLength(2);
  });
});
