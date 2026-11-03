'use client';

import dynamic from 'next/dynamic';

const ShaderCanvas = dynamic(() => import('./shader-canvas'), { ssr: false });

const DEFAULT_SEED = 31;

export interface ShaderBackgroundProps {
  seed?: number;
}

export function ShaderBackground({ seed = DEFAULT_SEED }: ShaderBackgroundProps) {
  return (
    <div
      aria-hidden={true}
      data-slot="shader-background"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-shader-fallback" />
      <ShaderCanvas kind="background" seed={seed} />
    </div>
  );
}
