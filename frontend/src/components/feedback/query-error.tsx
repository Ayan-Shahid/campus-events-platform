import React from 'react';
import Banner from '@/components/feedback/banner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw } from 'lucide-react';

export interface QueryErrorProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onRetry: () => Promise<unknown> | void;
  retryLabel?: string;
}

function QueryError({
  title = "Couldn't load events.",
  description = 'Check your connection and try again.',
  onRetry,
  retryLabel = 'Retry',
  className,
  ...props
}: QueryErrorProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };
  return (
    <Banner
      variant="error"
      title={title}
      description={description}
      className={cn('w-full', className)}
      action={
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isRetrying}
          onClick={handleRetry}
          className={cn(
            'h-8 gap-1.5 border-destructive-border bg-transparent text-destructive',
            'hover:bg-destructive/10',
            'dark:text-foreground',
          )}
        >
          {isRetrying ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden={true} />
          ) : (
            <RotateCw className="size-3.5" aria-hidden={true} />
          )}
          <span>{retryLabel}</span>
        </Button>
      }
      {...props}
    />
  );
}

export default QueryError;
