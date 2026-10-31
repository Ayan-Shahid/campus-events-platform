import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-12 w-full min-w-0 rounded-md border border-border-strong border-input bg-input px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive-subtle aria-invalid:ring-3 aria-invalid:ring-destructive-subtle md:text-sm dark:border-border-strong dark:bg-input dark:placeholder-faint/50 dark:hover:border-foreground/40 dark:focus-visible:border-ring dark:focus-visible:ring-3 dark:focus-visible:ring-ring/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive dark:aria-invalid:bg-destructive-subtle/50 dark:aria-invalid:text-foreground dark:aria-invalid:ring-3 dark:aria-invalid:ring-destructive-subtle',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
