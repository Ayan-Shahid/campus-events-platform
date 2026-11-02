'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, Calendar, Ticket, QrCode, BarChart3, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: string | number;
  current?: boolean;
}

export interface SidebarProps extends React.ComponentProps<'aside'> {
  items?: SidebarNavItem[];
  organizerName?: string;
  organizerRole?: string;
  onSignOut?: () => void;
  mode?: 'responsive' | 'full' | 'rail';
}

const defaultOrganizerItems: SidebarNavItem[] = [
  { label: 'Overview', href: '/organizer', icon: Home, current: true },
  { label: 'Events', href: '/organizer/events', icon: Calendar, count: 14 },
  {
    label: 'Registrations',
    href: '/organizer/registrations',
    icon: Ticket,
    count: '1.2k',
  },
  { label: 'Attendance', href: '/organizer/attendance', icon: QrCode },
  {
    label: 'Reports & exports',
    href: '/organizer/reports',
    icon: BarChart3,
  },
];

export function Sidebar({
  items = defaultOrganizerItems,
  organizerName = 'Hira Khan',
  organizerRole = 'Organizer',
  onSignOut,
  mode = 'responsive',
  className,
  ...props
}: SidebarProps) {
  const isRailForced = mode === 'rail';
  const isFullForced = mode === 'full';

  return (
    <aside
      data-slot="sidebar"
      data-mode={mode}
      className={cn(
        'flex flex-col justify-between rounded-xl border border-border bg-sidebar p-3 text-card-foreground',
        mode === 'responsive' && cn('hidden', 'md:flex md:w-16', 'lg:w-64 lg:p-4'),
        isFullForced && cn('flex w-64 p-4'),
        isRailForced && cn('flex w-16 items-center p-3'),
        className,
      )}
      {...props}
    >
      <div className={cn('flex w-full flex-col gap-6')}>
        <Link
          href="/organizer"
          aria-label="Gather Organizer Home"
          className={cn(
            'flex items-center gap-2.5 rounded-sm px-2 py-1 font-display text-lg font-bold text-foreground',
            'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid',
            isRailForced && cn('justify-center px-0'),
            mode === 'responsive' && cn('md:justify-center md:px-0', 'lg:justify-start lg:px-2'),
          )}
        >
          <span
            aria-hidden="true"
            className={cn('size-6 shrink-0 rounded-[8px] bg-mesh-primary')}
          />
          <span
            className={cn(
              isRailForced && cn('sr-only'),
              mode === 'responsive' && cn('md:sr-only', 'lg:not-sr-only'),
            )}
          >
            Gather
          </span>
        </Link>

        <nav aria-label="Organizer" className={cn('flex w-full flex-col gap-1')}>
          {items.map((item) => {
            const Icon = item.icon;
            const accessibleText =
              item.count !== undefined ? `${item.label}, ${item.count}` : item.label;

            return (
              <div key={item.href} className={cn('group/nav relative flex w-full')}>
                <Link
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  aria-label={accessibleText}
                  className={cn(
                    'flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm font-normal text-muted-foreground transition-colors',
                    'hover:bg-muted/60 hover:text-foreground',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid',
                    'aria-[current=page]:bg-secondary aria-[current=page]:font-semibold aria-[current=page]:text-foreground',
                    isRailForced &&
                      cn(
                        'size-10 justify-center px-0',
                        'aria-[current=page]:border-border-border aria-[current=page]:border aria-[current=page]:text-primary',
                      ),
                    mode === 'responsive' &&
                      cn(
                        'md:size-10 md:justify-center md:px-0',
                        'lg:h-auto lg:w-full lg:justify-between lg:px-3',
                      ),
                  )}
                >
                  <span className={cn('flex items-center gap-3')}>
                    <Icon className={cn('size-4 shrink-0')} aria-hidden="true" />
                    <span
                      className={cn(
                        isRailForced && cn('sr-only'),
                        mode === 'responsive' && cn('md:sr-only', 'lg:not-sr-only'),
                      )}
                    >
                      {item.label}
                      {item.count !== undefined && (
                        <span className={cn('sr-only')}>, {item.count}</span>
                      )}
                    </span>
                  </span>

                  {item.count !== undefined && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'font-mono text-xs text-muted-foreground',
                        isRailForced && cn('hidden'),
                        mode === 'responsive' && cn('md:hidden', 'lg:inline'),
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>

                <span
                  role="tooltip"
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-md border border-border bg-popover px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity',
                    'group-hover/nav:opacity-100',
                    'group-focus-within/nav:opacity-100',
                    isFullForced && cn('hidden'),
                    mode === 'responsive' && cn('lg:hidden'),
                  )}
                >
                  {accessibleText}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <div
        className={cn(
          'mt-8 flex items-center justify-between gap-2 border-t border-border pt-4',
          isRailForced && cn('flex-col justify-center'),
          mode === 'responsive' && cn('md:flex-col', 'lg:flex-row'),
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 overflow-hidden',
            isRailForced && cn('hidden'),
            mode === 'responsive' && cn('md:hidden', 'lg:flex'),
          )}
        >
          <Avatar name={organizerName} size="md" />
          <div className={cn('flex flex-col truncate')}>
            <span className={cn('truncate text-xs font-semibold text-foreground')}>
              {organizerName}
            </span>
            <span className={cn('truncate text-[11px] text-muted-foreground')}>
              {organizerRole}
            </span>
          </div>
        </div>

        <div className={cn('group/signout relative')}>
          <button
            type="button"
            aria-label="Sign out"
            onClick={onSignOut}
            className={cn(
              'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors',
              'hover:bg-destructive-subtle hover:text-destructive',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none',
            )}
          >
            <LogOut className={cn('size-4')} aria-hidden="true" />
          </button>
          <span
            role="tooltip"
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-md border border-border bg-popover px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity',
              'group-hover/signout:opacity-100',
              'group-focus-within/signout:opacity-100',
              isFullForced && cn('hidden'),
              mode === 'responsive' && cn('lg:hidden'),
            )}
          >
            Sign out
          </span>
        </div>
      </div>
    </aside>
  );
}
