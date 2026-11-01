import React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all select-none focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      size: {
        default: 'h-9 px-4 py-1.5',
        sm: 'h-8 px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface FilterChipProps
  extends React.ComponentProps<'button'>, VariantProps<typeof chipVariants> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

function FilterChip({
  className,
  size,
  pressed,
  defaultChecked,
  onPressedChange,
  onClick,
  children,
  ...props
}: FilterChipProps) {
  const [isPressed, setIsPressed] = React.useState(Boolean(pressed ?? defaultChecked ?? false));
  const active = pressed !== undefined ? pressed : isPressed;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      const next = !active;
      if (pressed === undefined) {
        setIsPressed(next);
      }
      onPressedChange?.(next);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      data-slot="filter-chip"
      data-state={active ? 'on' : 'off'}
      onClick={handleClick}
      className={cn(
        chipVariants({ size }),
        'border border-border-strong bg-secondary text-muted-foreground',
        'hover:border-foreground/30 hover:text-foreground',
        'aria-pressed:border-transparent aria-pressed:bg-foreground',
        'dark:bg-secondary dark:font-light',
        'dark:aria-pressed:border-transparent dark:aria-pressed:bg-foreground dark:aria-pressed:font-bold dark:aria-pressed:text-background',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface RemovableChipProps
  extends React.ComponentProps<'span'>, VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  removeLabel?: string;
}

function RemovableChip({
  className,
  removeLabel = 'Remove Filter',
  onRemove,
  size,
  children,
  ...props
}: RemovableChipProps) {
  return (
    <span
      data-slot="removable-chip"
      className={cn(
        chipVariants({ size }),
        'dark:bg-foreground dark:font-bold dark:text-background',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {!onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            'rounded-full p-0.5 transition-colors',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid',
          )}
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  );
}

export { FilterChip, RemovableChip };
