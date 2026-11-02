import type * as React from 'react';
import { cn } from '@/lib/utils';

interface ShowcaseSheetProps {
  number: number;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}

/** One design-reference sheet. Sections inside it follow the order of the reference image. */
export function ShowcaseSheet({ number, title, description, children }: ShowcaseSheetProps) {
  const headingId = `sheet-${number}-title`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-12">
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <span className="font-mono text-xs tracking-wider text-primary uppercase">
          Gather · Component library · Sheet {number} of 5
        </span>
        <h2
          id={headingId}
          className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

interface BlockProps {
  title: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** A titled section inside a sheet, with the reference's right-aligned "where it lives" hint. */
export function Block({ title, hint, className, children }: BlockProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-4', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-2">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        {hint && <span className="font-mono text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function Panel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-card p-5 sm:p-6', className)}
      {...props}
    />
  );
}

/** Mono implementation note, the "blue hints" in the reference. */
export function Hint({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('font-mono text-xs text-muted-foreground', className)} {...props} />;
}

/** Small uppercase label above a group of examples. */
export function Eyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'font-mono text-[11px] tracking-wider text-muted-foreground uppercase',
        className,
      )}
      {...props}
    />
  );
}
