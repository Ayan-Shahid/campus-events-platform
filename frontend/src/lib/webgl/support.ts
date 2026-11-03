export const WEBGL_CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
};

let webgl2Supported: boolean | undefined;

function probeWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', WEBGL_CONTEXT_ATTRIBUTES);
    if (!gl) return false;
    // Free the probe's context slot now rather than waiting for garbage collection.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectWebGL2(): boolean {
  if (typeof document === 'undefined') return false;
  webgl2Supported ??= probeWebGL2();
  return webgl2Supported;
}

export function resetWebGL2Detection(): void {
  webgl2Supported = undefined;
}

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
}

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function shouldAnimate(): boolean {
  if (prefersReducedMotion()) return false;
  return getConnection()?.saveData !== true;
}

export function onAnimationPreferenceChange(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const query =
    typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED_MOTION_QUERY) : undefined;
  const connection = getConnection();

  query?.addEventListener('change', onChange);
  connection?.addEventListener('change', onChange);
  return () => {
    query?.removeEventListener('change', onChange);
    connection?.removeEventListener('change', onChange);
  };
}
