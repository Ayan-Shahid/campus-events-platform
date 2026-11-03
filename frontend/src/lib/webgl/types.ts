export type SurfaceKind = 'background' | 'surface';

export interface RenderTarget {
  canvas: HTMLCanvasElement;
  kind: SurfaceKind;
  seed: number;
  onFallback?: () => void;
  onFirstFrame?: () => void;
}

export interface TargetState extends RenderTarget {
  visible: boolean;
  dirty: boolean;
  lastRender: number;
  cssWidth: number;
  cssHeight: number;
  context2d: CanvasRenderingContext2D | null;
  hasDrawn?: boolean;
}
