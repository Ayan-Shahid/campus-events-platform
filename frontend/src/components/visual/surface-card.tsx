import React from 'react';
import { cn } from '@/lib/utils';

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'shader' | 'plain';
  as?: 'article' | 'section' | 'div';
  shaderGraphic?: React.ReactNode;
}

export function SurfaceCard({
  surface = 'plain',
  as: Component = 'article',
  shaderGraphic,
  className,
  children,
  ...props
}: SurfaceCardProps) {
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
        {surface === 'shader' ? (
          (shaderGraphic ?? <div className="h-36 w-full bg-card" />)
        ) : (
          <div className="h-full w-full bg-card" />
        )}
      </div>
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Component>
  );
}
