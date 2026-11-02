import type React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from 'cn';

interface MeterProps extends React.ComponentProps<typeof Progress> {
  value: number;
  max?: number;
  label: string;
  tone?: 'default' | 'success' | 'danger';
  segmented?: boolean;
  segmentsCount?: number;
}

const toneFillClasses = {
  default: 'bg-gradient-meter-default',
  success: 'bg-gradient-meter-success',
  danger: 'bg-gradient-meter-danger',
};

const toneIndicatorClasses = {
  default: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-default',
  success: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-success',
  danger: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-danger',
};

function Meter({
  value,
  segmented = false,
  segmentsCount = 4,
  max = 100,
  label,
  tone = 'default',
  className,
  ...props
}: MeterProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (segmented) {
    const activeSegmentIndex = Math.round((percentage / 100) * segmentsCount);

    return (
      <div
        data-slot="meter"
        role="meter"
        aria-label={props['aria-label'] ?? label}
        aria-valuetext={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('flex w-full flex-col gap-2', className)}
      >
        {/* Decorative segments: plain divs, not nested progressbars. */}
        <div aria-hidden="true" className="grid w-full grid-flow-col gap-1.5">
          {Array.from({ length: segmentsCount }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full',
                index < activeSegmentIndex ? toneFillClasses[tone] : 'bg-muted',
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Progress
      value={value}
      max={max}
      aria-label={props['aria-label'] ?? label}
      aria-valuetext={label}
      data-slot="meter"
      className={cn('w-full', toneIndicatorClasses[tone], className)}
      {...props}
    />
  );
}

export default Meter;
