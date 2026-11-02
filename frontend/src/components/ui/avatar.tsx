'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cn } from 'cn';

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export type AvatarSize = 'default' | 'sm' | 'md' | 'lg';

export interface AvatarProps extends AvatarPrimitive.Root.Props {
  size?: AvatarSize;
  /** Optional full name for automatic initials fallback and image alt text */
  name?: string;
  /** Optional image URL when using shorthand props */
  src?: string;
}

function Avatar({ className, size = 'default', name, src, children, ...props }: AvatarProps) {
  // Normalize 'md' to 'default' so both size="md" and size="default" map to 36px
  const normalizedSize = size === 'md' ? 'default' : size;

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={normalizedSize}
      className={cn(
        'group/avatar relative inline-flex size-9 shrink-0 items-center justify-center rounded-full font-mono font-semibold select-none',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken',
        'dark:after:mix-blend-lighten',
        'data-[size=sm]:size-7',
        'data-[size=default]:size-9',
        'data-[size=lg]:size-11',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {src && <AvatarImage src={src} alt={name ?? ''} />}
          {name && <AvatarFallback aria-label={name}>{getInitials(name)}</AvatarFallback>}
        </>
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full rounded-full object-cover', className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold text-secondary-foreground',
        'group-data-[size=sm]/avatar:text-[10px]',
        'group-data-[size=default]/avatar:text-xs',
        'group-data-[size=lg]/avatar:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
        'group-data-[size=sm]/avatar:size-2',
        'group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5',
        'group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3',
        'group-data-[size=lg]/avatar:[&>svg]:size-2',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'group/avatar-group flex -space-x-2',
        '*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-muted-foreground ring-2 ring-background',
        '[&>svg]:size-4',
        'group-has-data-[size=sm]/avatar-group:size-7 group-has-data-[size=sm]/avatar-group:text-[10px]',
        'group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        'group-has-data-[size=lg]/avatar-group:size-11 group-has-data-[size=lg]/avatar-group:text-sm',
        'group-has-data-[size=lg]/avatar-group:[&>svg]:size-5',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge };
