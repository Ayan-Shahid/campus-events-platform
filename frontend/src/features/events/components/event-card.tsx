'use client';

import * as React from 'react';
import { SurfaceCard } from '@/components/visual/surface-card';
import { Button } from '@/components/ui/button';
import { SeatMeter, type EventRegistrationStatus } from './seat-meter';
import { cn } from '@/lib/utils';

export interface EventCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  day: string | number;
  weekday: string;
  taken: number;
  capacity: number;
  waitlisted?: number;
  status?: EventRegistrationStatus;
  closedReason?: string;
  surface?: 'shader' | 'plain';
  shaderTone?: 'default' | 'warm';
  footerNote?: string;
  onPrimaryAction?: () => void;
  onDetailsAction?: () => void;
}

export function EventCard({
  title,
  day,
  weekday,
  taken,
  capacity,
  waitlisted = 0,
  status = 'open',
  closedReason = 'Cut-off passed',
  surface = 'shader',
  shaderTone = 'default',
  footerNote,
  onPrimaryAction,
  onDetailsAction,
  className,
  ...props
}: EventCardProps) {
  const effectiveSurface = status === 'closed' ? 'plain' : surface;

  const shaderGraphic =
    shaderTone === 'warm' ? (
      <div
        className={cn(
          'h-36 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-warning/40 via-destructive/30 to-transparent opacity-90 blur-xl',
        )}
      />
    ) : undefined;

  return (
    <SurfaceCard
      surface={effectiveSurface}
      shaderGraphic={shaderGraphic}
      as="article"
      className={cn('p-4', className)}
      {...props}
    >
      <div
        className={cn(
          'mb-12 inline-flex w-fit flex-col items-center rounded-lg px-2.5 py-1 font-mono text-xs',
          effectiveSurface === 'shader'
            ? cn('bg-background/80 backdrop-blur-sm')
            : cn('border border-border bg-muted/40'),
        )}
      >
        <span className={cn('font-bold text-foreground')}>{day}</span>
        <span className={cn('text-[10px] text-muted-foreground uppercase')}>{weekday}</span>
      </div>

      <div className={cn('mt-auto flex flex-col gap-3')}>
        <SeatMeter status={status} taken={taken} capacity={capacity} waitlisted={waitlisted} />

        <h3 className={cn('font-display text-base font-bold text-foreground')}>{title}</h3>

        <div className={cn('mt-1 flex items-center gap-2')}>
          {status === 'open' && (
            <>
              <Button size="sm" className={cn('flex-1')} onClick={onPrimaryAction}>
                Register
              </Button>
              <Button size="sm" variant="outline" onClick={onDetailsAction}>
                Details
              </Button>
            </>
          )}

          {status === 'full' && (
            <Button size="sm" variant="outline" className={cn('w-full')} onClick={onPrimaryAction}>
              Join waitlist
            </Button>
          )}

          {status === 'closed' && (
            <Button size="sm" variant="outline" disabled className={cn('w-full')}>
              {closedReason}
            </Button>
          )}
        </div>

        {footerNote && (
          <span className={cn('font-mono text-[11px] text-muted-foreground')}>{footerNote}</span>
        )}
      </div>
    </SurfaceCard>
  );
}
