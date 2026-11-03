export type ShaderStage = 'vertex' | 'fragment' | 'link';

const MAX_QUOTED_LINES = 5;

function quoteOffendingLines(source: string, infoLog: string): string {
  const lines = source.split('\n');
  const numbers = new Set<number>();
  for (const match of infoLog.matchAll(/^(?:ERROR|WARNING):\s*\d+:(\d+):/gm)) {
    numbers.add(Number(match[1]));
  }
  const quoted = [...numbers]
    .slice(0, MAX_QUOTED_LINES)
    .filter((number) => number >= 1 && number <= lines.length)
    .map((number) => `  ${String(number).padStart(4)} | ${lines[number - 1] ?? ''}`);
  return quoted.length > 0
    ? `\nOffending source (line numbers count the composed source: header, noise chunk, shader):\n${quoted.join('\n')}`
    : '';
}

export class ShaderCompileError extends Error {
  readonly shaderName: string;
  readonly stage: ShaderStage;
  readonly infoLog: string;

  constructor(shaderName: string, stage: ShaderStage, infoLog: string, source?: string) {
    const cleaned = infoLog.replace(/\0/g, '').trim() || '(the driver gave no details)';
    const what = stage === 'link' ? 'link' : `compile (${stage} shader)`;
    super(
      `Shader "${shaderName}" failed to ${what}:\n${cleaned}${
        source ? quoteOffendingLines(source, cleaned) : ''
      }`,
    );
    this.name = 'ShaderCompileError';
    this.shaderName = shaderName;
    this.stage = stage;
    this.infoLog = cleaned;
  }
}

export interface GlProgram {
  readonly name: string;
  readonly program: WebGLProgram;
  uniform(name: string): WebGLUniformLocation | null;
  dispose(): void;
}

function compileShader(
  gl: WebGL2RenderingContext,
  name: string,
  stage: 'vertex' | 'fragment',
  source: string,
): WebGLShader {
  const shader = gl.createShader(stage === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
  if (!shader) {
    throw new ShaderCompileError(
      name,
      stage,
      'gl.createShader returned null (is the context lost?)',
    );
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? '';
    gl.deleteShader(shader);
    throw new ShaderCompileError(name, stage, log, source);
  }
  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  name: string,
  vertexSource: string,
  fragmentSource: string,
): GlProgram {
  const vertex = compileShader(gl, name, 'vertex', vertexSource);
  let fragment: WebGLShader;
  try {
    fragment = compileShader(gl, name, 'fragment', fragmentSource);
  } catch (error) {
    gl.deleteShader(vertex);
    throw error;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  const linkLog = linked ? '' : (gl.getProgramInfoLog(program) ?? '');

  gl.detachShader(program, vertex);
  gl.detachShader(program, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!linked) {
    gl.deleteProgram(program);
    throw new ShaderCompileError(name, 'link', linkLog);
  }

  const locations = new Map<string, WebGLUniformLocation | null>();
  return {
    name,
    program,
    uniform(uniformName) {
      if (!locations.has(uniformName)) {
        locations.set(uniformName, gl.getUniformLocation(program, uniformName));
      }
      return locations.get(uniformName) ?? null;
    },
    dispose() {
      locations.clear();
      gl.deleteProgram(program);
    },
  };
}
