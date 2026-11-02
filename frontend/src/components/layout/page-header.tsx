import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  backLink?: {
    label: string;
    href: string;
  };
  headingAs?: 'h1' | 'h2';
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
  backLink,
  headingAs: HeadingTag = 'h1',
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div data-slot="page-header" className={cn('flex w-full flex-col gap-3', className)} {...props}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className={cn('flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground')}>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className={cn('inline-flex items-center gap-1.5')}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className={cn(
                        'text-primary underline underline-offset-4 transition-colors',
                        'hover:text-primary-subtle',
                        'focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={cn(isLast && 'font-medium text-foreground')}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight
                      className={cn('size-3 text-muted-foreground/60')}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {backLink && (
        <div>
          <Link
            href={backLink.href}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors',
              'hover:text-foreground',
              'focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
            )}
          >
            <ChevronLeft className={cn('size-3.5')} aria-hidden="true" />
            <span>{backLink.label}</span>
          </Link>
        </div>
      )}

      <div className={cn('flex flex-col justify-between gap-4', 'sm:flex-row sm:items-end')}>
        <div className={cn('flex flex-col gap-1')}>
          {eyebrow && (
            <span
              className={cn(
                'font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase',
              )}
            >
              {eyebrow}
            </span>
          )}
          <HeadingTag
            className={cn(
              'font-display text-2xl font-bold tracking-tight text-foreground',
              'sm:text-3xl',
            )}
          >
            {title}
          </HeadingTag>
          {description && (
            <p className={cn('font-sans text-sm text-muted-foreground')}>{description}</p>
          )}
        </div>

        {actions && (
          <div className={cn('flex shrink-0 flex-wrap items-center gap-2.5')}>{actions}</div>
        )}
      </div>
    </div>
  );
}
