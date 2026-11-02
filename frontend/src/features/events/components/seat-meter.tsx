import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import Meter from '@/components/ui/meter';
import { cn } from '@/lib/utils';

export type EventRegistrationStatus = 'open' | 'full' | 'closed';

export interface SeatMeterProps {
  status: EventRegistrationStatus;
  taken: number;
  capacity: number;
  waitlisted?: number;
}

export function SeatMeter({ status, taken, capacity, waitlisted = 0 }: SeatMeterProps) {
  const remaining = Math.max(capacity - taken, 0);
  const isFewSeatsLeft = status === 'open' && remaining <= Math.ceil(capacity * 0.15);

  if (status === 'closed') {
    return (
      <div className={cn('flex flex-col gap-3')}>
        <Badge variant="secondary" className={cn('w-fit')}>
          • Registration closed
        </Badge>
        <Meter
          value={taken}
          max={capacity}
          tone="default"
          label="Registration closed"
          className={cn('opacity-50')}
        />
      </div>
    );
  }

  if (status === 'full' || remaining === 0) {
    const badgeText = waitlisted > 0 ? `• Full · ${waitlisted} waitlisted` : '• Full';
    const ariaLabel =
      waitlisted > 0
        ? `${capacity} of ${capacity} capacity reached, ${waitlisted} waitlisted`
        : `${capacity} of ${capacity} capacity reached`;

    return (
      <div className={cn('flex flex-col gap-3')}>
        <Badge variant="destructive" className={cn('w-fit')}>
          {badgeText}
        </Badge>
        <Meter value={capacity} max={capacity} tone="danger" label={ariaLabel} />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3')}>
      <Badge variant={isFewSeatsLeft ? 'warning' : 'success'} className={cn('w-fit')}>
        • {remaining} of {capacity} seats left
      </Badge>
      <Meter
        value={taken}
        max={capacity}
        tone={isFewSeatsLeft ? 'default' : 'success'}
        label={`${taken} of ${capacity} seats taken`}
      />
    </div>
  );
}
