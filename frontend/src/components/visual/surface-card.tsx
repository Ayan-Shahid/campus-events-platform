'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWebGLSupported } from '@/lib/webgl/use-webgl-support';
import { cn } from '@/lib/utils';

const ShaderCanvas = dynamic(() => import('./shader-canvas'), { ssr: false });

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'shader' | 'plain';
  as?: 'article' | 'section' | 'div';
  shaderGraphic?: React.ReactNode;
  seed?: number;
}

export function SurfaceCard({
  surface = 'plain',
  as: Component = 'article',
  shaderGraphic,
  seed = 0,
  className,
  children,
  ...props
}: SurfaceCardProps) {
  const webglSupported = useWebGLSupported();
  const showShader = surface === 'shader' && webglSupported;

  return (
    <Component
      data-slot="surface-card"
      data-surface={surface}
      className={cn(
        'group/surface-card relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all',
        'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring focus-within:outline-solid',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
      {...props}
    >
      <div aria-hidden={true} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="h-full w-full bg-card" />
        {showShader ? <ShaderCanvas kind="surface" seed={seed} /> : null}
        {surface === 'shader' ? shaderGraphic : null}
      </div>
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Component>
  );
}
