import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'active:not-aria-[haspopup]:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg:not([class*="size-"])]:size-4',
    'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-mesh-primary text-foreground',
          'hover:bg-primary/80 hover:text-secondary-foreground',
          'dark:text-primary-foreground',
          'focus-visible:border-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
        ],
        outline: [
          'border-border-border bg-card text-secondary-foreground',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          'aria-expanded:bg-muted aria-expanded:text-foreground',
          'dark:border-foreground/20 dark:bg-foreground/6',
          'dark:hover:border-foreground/30 dark:hover:bg-foreground/10',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]',
          'aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ],
        ghost: [
          'border-none',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:border-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          'aria-expanded:bg-muted aria-expanded:text-foreground',
          'dark:border-none',
          'dark:hover:bg-foreground/6',
        ],
        destructive: [
          'border-destructive-border bg-destructive-subtle text-destructive',
          'hover:bg-destructive/20',
          'focus-visible:border-destructive-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          'dark:bg-destructive-subtle dark:text-destructive-text',
          'dark:hover:bg-destructive/20',
        ],
        link: [
          'text-primary underline underline-offset-4',
          'hover:text-primary-subtle hover:underline',
          'focus-visible:border-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
        ],
      },
      size: {
        default: [
          'h-[44px] gap-2.5 rounded-[min(var(--radius-md),12px)] px-3.5',
          '[&_svg:not([class*="size-"])]:size-3.5',
        ],
        xs: [
          'h-6 gap-1.5 rounded-[min(var(--radius-sm),8px)] px-2 text-[10px]',
          'in-data-[slot=button-group]:rounded-lg',
          '[&_svg:not([class*="size-"])]:size-2.5',
        ],
        sm: [
          'h-[36px] gap-2 rounded-[min(var(--radius-sm),10px)] px-2.5 text-[0.8rem]',
          'in-data-[slot=button-group]:rounded-lg',
          '[&_svg:not([class*="size-"])]:size-3',
        ],
        lg: 'h-[52px] gap-3 rounded-[min(var(--radius-lg),14px)] px-4 py-2 text-lg',
        icon: 'size-[44px]',
        'icon-xs': [
          'size-6 rounded-[min(var(--radius-md),10px)]',
          'in-data-[slot=button-group]:rounded-lg',
          '[&_svg:not([class*="size-"])]:size-3',
        ],
        'icon-sm': [
          'size-7 rounded-[min(var(--radius-md),12px)]',
          'in-data-[slot=button-group]:rounded-lg',
        ],
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && <Loader2 className="shrink-0 animate-spin" />}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
