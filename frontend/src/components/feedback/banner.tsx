import React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'relative flex w-full items-center justify-center gap-3 rounded-lg border p-3.5 text-sm transition-all',
  {
    variants: {
      variant: {
        info: 'border-info-border bg-info-subtle text-info-foreground [&_svg]:text-info',
        success:
          'border-success-border bg-success-subtle text-success-foreground [&_svg]:text-success',
        warning:
          'border-warning-border bg-warning-subtle text-warning-foreground [&_svg]:text-warning',
        error:
          'border-destructive-border bg-destructive-subtle text-destructive-text [&_svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const bannerIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export interface BannerProps
  extends Omit<React.ComponentProps<'div'>, 'title'>, VariantProps<typeof bannerVariants> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

function Banner({
  className,
  variant = 'info',
  title,
  description,
  action,
  onDismiss,
  dismissLabel = 'Dismiss Notification',
  children,
  ...props
}: BannerProps) {
  const Icon = bannerIcons[variant];

  const role = variant === 'error' ? 'alert' : 'status';
  return (
    <div
      role={role}
      data-slot="banner"
      data-variant={variant}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2.5 leading-normal">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          {title && <span className="font-semibold text-foreground">{title} </span>}
          {description && (
            <span className="text-foreground/90 dark:text-inherit">{description}</span>
          )}
          {children}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action && <div className="shrink-0">{action}</div>}
        {onDismiss && (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className={cn(
              'rounded-md p-1 opacity-70 transition-opacity',
              'hover:opacity-100',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid',
            )}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Banner;
