'use client';

import { useRef } from 'react';
import { useShaderTarget } from '@/lib/webgl/use-shader-target';
import type { SurfaceKind } from '@/lib/webgl/types';
import { cn } from '@/lib/utils';

export interface ShaderCanvasProps {
  kind: SurfaceKind;
  seed: number;
}

export default function ShaderCanvas({ kind, seed }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useShaderTarget(canvasRef, { kind, seed });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden={true}
      data-slot="shader-canvas"
      className={cn(
        'absolute inset-0 size-full',
        'opacity-0 transition-opacity duration-300 ease-out',
        'data-[shader-ready=true]:opacity-100',
        'motion-reduce:transition-none',
      )}
    />
  );
}
