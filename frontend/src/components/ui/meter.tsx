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

  const toneIndicatorClasses = {
    default: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-default',
    success: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-success',
    danger: '[&_[data-slot=progress-indicator]]:bg-gradient-meter-danger',
  };

  if (segmented) {
    const activeSegmentIndex = Math.round((percentage / 100) * segmentsCount);

    return (
      <div
        data-slot="meter"
        aria-valuetext={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        role="meter"
        className={cn('flex w-full flex-col gap-2', className)}
      >
        <div className={cn('grid w-full grid-flow-col gap-1.5', className)}>
          {Array.from({ length: segmentsCount }).map((_, index) => {
            const isActive = index < activeSegmentIndex;
            return (
              <Progress
                key={index}
                value={isActive ? 100 : 0}
                tabIndex={-1}
                aria-hidden={true}
                className="gap-0"
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Progress
      value={percentage}
      aria-valuetext={label}
      data-slot="meter"
      className={cn('w-full', toneIndicatorClasses[tone], className)}
      {...props}
    />
  );
}

export default Meter;
