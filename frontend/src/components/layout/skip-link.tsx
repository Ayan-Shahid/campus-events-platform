import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps extends React.ComponentProps<'a'> {
  targetId?: string;
}

export function SkipLink({
  targetId = 'main',
  children = 'Skip to main content',
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      data-slot="skip-link"
      className={cn(
        'sr-only',
        'focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:inline-flex focus:h-10 focus:items-center focus:justify-center focus:rounded-full focus:bg-[#f4efe6] focus:px-5 focus:font-sans focus:text-sm focus:font-semibold focus:text-[#18181b] focus:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
