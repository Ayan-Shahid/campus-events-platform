'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, User, Calendar, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/layout/theme-toggle';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface TopNavItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface TopNavProps extends React.ComponentProps<'header'> {
  items?: TopNavItem[];
  unreadCount?: number;
  userName?: string;
  userAvatarSrc?: string;
  onNotificationsClick?: () => void;
  onSignOut?: () => void;
}

const defaultNavItems: TopNavItem[] = [
  { label: 'Discover', href: '/discover', current: true },
  { label: 'My registrations', href: '/registrations' },
  { label: 'Calendar', href: '/calendar' },
];

export function TopNav({
  items = defaultNavItems,
  unreadCount = 2,
  userName = 'Ayan Shahid',
  userAvatarSrc,
  onNotificationsClick,
  onSignOut,
  className,
  ...props
}: TopNavProps) {
  const notificationLabel =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications';

  return (
    <header
      data-slot="top-nav"
      className={cn('w-full border-b border-border bg-card/90 backdrop-blur-md', className)}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4',
          'sm:px-6',
        )}
      >
        <div className={cn('flex items-center gap-8')}>
          <Link
            href="/"
            className={cn(
              'inline-flex items-center gap-2.5 rounded-lg font-display text-lg font-bold text-foreground',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('size-6 rounded-lg bg-mesh-primary shadow-sm')}
            />
            <span>Gather</span>
          </Link>

          <nav aria-label="Main" className={cn('hidden items-center gap-1', 'md:flex')}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center rounded-md px-3 py-2 text-sm font-normal text-muted-foreground transition-colors',
                  'hover:text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none',
                  'aria-[current=page]:font-semibold aria-[current=page]:text-foreground',
                  'aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-[13px] aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={cn('flex items-center gap-2.5')}>
          <ThemeToggle />

          <button
            type="button"
            aria-label={notificationLabel}
            onClick={onNotificationsClick}
            className={cn(
              'relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none',
            )}
          >
            <Bell className={cn('size-4')} aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card',
                )}
              />
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Account menu for ${userName}`}
              className={cn(
                'rounded-full border-0 bg-transparent p-0',
                'hover:bg-transparent',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
              )}
            >
              <Avatar name={userName} src={userAvatarSrc} size="md" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8}>
              <div className={cn('px-2.5 py-1.5 text-xs text-muted-foreground')}>
                Signed in as <span className={cn('font-semibold text-foreground')}>{userName}</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User /> Profile &amp; preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar /> My registrations
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onSignOut}>
                <LogOut /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
