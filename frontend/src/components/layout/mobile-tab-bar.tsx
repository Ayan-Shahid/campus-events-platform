'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Ticket, Calendar, User, Home, QrCode, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MobileTabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export const studentMobileTabs: MobileTabItem[] = [
  { label: 'Discover', href: '/discover', icon: Search, current: true },
  { label: 'My events', href: '/registrations', icon: Ticket },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Profile', href: '/profile', icon: User },
];

export const organizerMobileTabs: MobileTabItem[] = [
  { label: 'Overview', href: '/organizer', icon: Home, current: true },
  { label: 'Events', href: '/organizer/events', icon: Calendar },
  { label: 'Check-in', href: '/organizer/attendance', icon: QrCode },
  { label: 'Reports', href: '/organizer/reports', icon: BarChart3 },
];

export interface MobileTabBarProps extends React.ComponentProps<'nav'> {
  variant?: 'student' | 'organizer';
  items?: MobileTabItem[];
  showFab?: boolean;
  fabLabel?: string;
  onFabClick?: () => void;
  fixed?: boolean;
}

export function MobileTabBar({
  variant = 'student',
  items,
  showFab,
  fabLabel = 'New event',
  onFabClick,
  fixed = true,
  className,
  ...props
}: MobileTabBarProps) {
  const tabs = items ?? (variant === 'organizer' ? organizerMobileTabs : studentMobileTabs);
  const displayFab = showFab ?? variant === 'organizer';

  return (
    <div
      data-slot="mobile-tab-bar-wrapper"
      className={cn(
        'pointer-events-none flex flex-col',
        fixed ? cn('fixed inset-x-0 bottom-0 z-40', 'md:hidden') : cn('relative w-full'),
      )}
    >
      {displayFab && (
        <div className={cn('pointer-events-auto flex justify-end px-4 pb-3')}>
          <Button type="button" onClick={onFabClick}>
            <Plus className={cn('size-4')} aria-hidden="true" />
            <span>{fabLabel}</span>
          </Button>
        </div>
      )}

      <nav
        aria-label={`${variant === 'organizer' ? 'Organizer' : 'Student'} mobile`}
        data-slot="mobile-tab-bar"
        className={cn(
          'pointer-events-auto w-full border-t border-border bg-transparent px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] backdrop-blur-md',
          className,
        )}
        {...props}
      >
        <div className={cn('mx-auto grid max-w-md grid-cols-4 gap-1')}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[11px] font-medium text-muted-foreground transition-colors',
                  'hover:text-foreground',
                  'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:outline-solid',
                  'aria-[current=page]:font-semibold aria-[current=page]:text-primary',
                )}
              >
                <Icon className={cn('size-4 shrink-0')} aria-hidden="true" />
                <span className={cn('leading-none')}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
