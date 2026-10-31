import * as React from 'react';
import { cn } from 'cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
        'dark:border-border-strong dark:bg-input dark:placeholder-faint/50',
        'dark:focus-visible:border-ring dark:focus-visible:ring-3 dark:focus-visible:ring-ring/20',
        'dark:aria-invalid:border-destructive dark:aria-invalid:bg-destructive-subtle/60 dark:aria-invalid:ring-3 dark:aria-invalid:ring-destructive-subtle',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
