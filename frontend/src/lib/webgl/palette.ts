export type Rgb = readonly [number, number, number];

export interface ShaderPalette {
  colors: readonly [Rgb, Rgb, Rgb, Rgb];
  accent: Rgb;
  grain: number;
}

const FALLBACK: ShaderPalette = {
  colors: [
    [0.039, 0.067, 0.141],
    [0.106, 0.169, 0.369],
    [0.086, 0.541, 0.502],
    [1, 0.541, 0.298],
  ],
  accent: [0.561, 0.851, 0.949],
  grain: 0.05,
};

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_FUNCTION = /^rgba?\(\s*([^)]*?)\s*\)$/i;
const CHANNEL = /^[+-]?(?:\d+\.?\d*|\.\d+)%?$/;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function parseCssColor(input: string): Rgb | null {
  const value = input.trim();

  const hex = HEX.exec(value)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex;
    return [0, 2, 4].map(
      (start) => Number.parseInt(full.slice(start, start + 2), 16) / 255,
    ) as unknown as Rgb;
  }

  const inner = RGB_FUNCTION.exec(value)?.[1];
  if (inner === undefined) return null;

  const parts = inner.split(/[\s,/]+/).filter(Boolean);
  if (parts.length !== 3 && parts.length !== 4) return null;

  const channels: number[] = [];
  for (const part of parts.slice(0, 3)) {
    if (!CHANNEL.test(part)) return null;
    const number = Number.parseFloat(part);
    channels.push(clamp01(part.endsWith('%') ? number / 100 : number / 255));
  }
  return channels as unknown as Rgb;
}

export function flattenColors(colors: readonly Rgb[]): Float32Array {
  return Float32Array.from(colors.flat());
}

function readColor(styles: CSSStyleDeclaration, name: string, fallback: Rgb): Rgb {
  const parsed = parseCssColor(styles.getPropertyValue(name));
  if (parsed) return parsed;
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[webgl] ${name} is missing or not a hex/rgb() colour; using the fallback.`);
  }
  return fallback;
}

export function readShaderPalette(root: HTMLElement = document.documentElement): ShaderPalette {
  const styles = getComputedStyle(root);
  const grain = Number.parseFloat(styles.getPropertyValue('--shader-grain'));

  return {
    colors: [
      readColor(styles, '--shader-0', FALLBACK.colors[0]),
      readColor(styles, '--shader-1', FALLBACK.colors[1]),
      readColor(styles, '--shader-2', FALLBACK.colors[2]),
      readColor(styles, '--shader-3', FALLBACK.colors[3]),
    ],
    accent: readColor(styles, '--shader-accent', FALLBACK.accent),
    grain: Number.isFinite(grain) && grain >= 0 ? grain : FALLBACK.grain,
  };
}

export function subscribeToPalette(
  onChange: (palette: ShaderPalette) => void,
  root: HTMLElement = document.documentElement,
): () => void {
  const emit = () => onChange(readShaderPalette(root));
  const observer = new MutationObserver(emit);
  observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  emit();
  return () => observer.disconnect();
}
