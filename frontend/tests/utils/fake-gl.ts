import { vi } from 'vitest';

export interface FakeGlOptions {
  compileError?: (stage: 'vertex' | 'fragment', source: string) => string | null | undefined;
  linkError?: () => string | null | undefined;
}

const VERTEX_SHADER = 0x8b31;
const FRAGMENT_SHADER = 0x8b30;
const COMPILE_STATUS = 0x8b81;
const LINK_STATUS = 0x8b82;

export function createFakeGl(options: FakeGlOptions = {}) {
  let lost = false;
  const stages = new Map<object, { stage: 'vertex' | 'fragment'; source: string }>();
  const compileLogs = new Map<object, string | null>();
  const linkLogs = new Map<object, string | null>();
  const loseContext = vi.fn();

  const gl = {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
    COMPILE_STATUS,
    LINK_STATUS,
    TRIANGLES: 4,
    createShader: vi.fn((type: number) => {
      const shader = { type };
      stages.set(shader, { stage: type === VERTEX_SHADER ? 'vertex' : 'fragment', source: '' });
      return shader;
    }),
    shaderSource: vi.fn((shader: object, source: string) => {
      const entry = stages.get(shader);
      if (entry) entry.source = source;
    }),
    compileShader: vi.fn((shader: object) => {
      const entry = stages.get(shader);
      compileLogs.set(
        shader,
        entry ? (options.compileError?.(entry.stage, entry.source) ?? null) : null,
      );
    }),
    getShaderParameter: vi.fn((shader: object, parameter: number) =>
      parameter === COMPILE_STATUS ? compileLogs.get(shader) == null : null,
    ),
    getShaderInfoLog: vi.fn((shader: object) => compileLogs.get(shader) ?? ''),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => {
      const program = {};
      linkLogs.set(program, null);
      return program;
    }),
    attachShader: vi.fn(),
    detachShader: vi.fn(),
    linkProgram: vi.fn((program: object) => {
      linkLogs.set(program, options.linkError?.() ?? null);
    }),
    getProgramParameter: vi.fn((program: object, parameter: number) =>
      parameter === LINK_STATUS ? linkLogs.get(program) == null : null,
    ),
    getProgramInfoLog: vi.fn((program: object) => linkLogs.get(program) ?? ''),
    deleteProgram: vi.fn(),
    getUniformLocation: vi.fn((_program: object, name: string) => ({ uniform: name })),
    useProgram: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform3f: vi.fn(),
    uniform3fv: vi.fn(),
    viewport: vi.fn(),
    drawArrays: vi.fn(),
    isContextLost: vi.fn(() => lost),
    getExtension: vi.fn((name: string) => (name === 'WEBGL_lose_context' ? { loseContext } : null)),
  };

  return {
    gl: gl as unknown as WebGL2RenderingContext,
    spies: gl,
    loseContext,
    setContextLost(value: boolean) {
      lost = value;
    },
  };
}

export function createCanvasWith(contexts: { webgl2?: unknown; '2d'?: unknown }) {
  const canvas = document.createElement('canvas');
  const getContext = vi.fn((type: string) => (contexts as Record<string, unknown>)[type] ?? null);
  canvas.getContext = getContext as unknown as HTMLCanvasElement['getContext'];
  return { canvas, getContext };
}
