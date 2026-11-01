import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.ComponentProps<'div'> {
  icon?: React.ComponentType<{ className?: string }>;
  heading: React.ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description?: React.ReactNode;
  actions: React.ReactNode;
}

function EmptyState({
  icon: Icon,
  heading,
  headingLevel: HeadingTag = 'h3',
  description,
  actions,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-transparent p-8 text-center sm:p-12',
        className,
      )}
      {...props}
    >
      {Icon && (
        <div
          className={cn(
            'mb-4 flex items-center justify-center rounded-lg bg-muted p-5 text-muted-foreground',
          )}
        >
          <Icon className="size-6 text-primary" />
        </div>
      )}
      <HeadingTag className="font-display text-lg font-semibold text-foreground">
        {heading}
      </HeadingTag>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}

      {actions && <div className="mt-6 flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default EmptyState;
