import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted/70', className)}
      {...props}
    />
  );
}

export function EventCardSkeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      aria-busy={true}
      aria-label="Loading event card"
      className={cn('flex flex-col gap-4 rounded-xl border border-border bg-card p-5', className)}
      {...props}
    >
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-8 w-1/2 rounded-xl" />
      <Skeleton className="h-6 w-10/12 rounded-xl" />
      <Skeleton className="h-3 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({
  columns = 4,
  className,
  ...props
}: React.ComponentProps<'tr'> & { columns?: number }) {
  return (
    <tr
      aria-busy={true}
      className={cn('border-b border-border transition-colors', className)}
      {...props}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full max-w-30" />
        </td>
      ))}
    </tr>
  );
}

export function KPITileSkeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      aria-busy={true}
      aria-label="Loading metric"
      className={cn(
        'flex flex-col gap-3 rounded-[18px] border border-border bg-card p-5',
        className,
      )}
      {...props}
    >
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-14 w-2/6" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
