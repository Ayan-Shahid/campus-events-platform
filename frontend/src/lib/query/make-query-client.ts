import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  type Query,
} from '@tanstack/react-query';
import { isApiError, type ApiError } from '@/lib/api/api-error';

interface AppQueryMeta extends Record<string, unknown> {
  refreshErrorMessage?: string;
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: AppQueryMeta;
  }
}

export const staleTimes = {
  default: 30_000,
  seats: 10_000,
} as const;

export const MAX_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 8_000;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (!isApiError(error)) return false;
  return error.kind === 'network' || (error.kind === 'server' && error.status >= 500);
}

export function retryDelay(attemptIndex: number): number {
  return Math.min(1_000 * 2 ** attemptIndex, MAX_RETRY_DELAY_MS);
}

export interface QueryClientHandlers {
  onUnauthorized?: (error: ApiError, client: QueryClient) => void;
  onBackgroundRefreshError?: (error: Error, query: Query<unknown, unknown>) => void;
}

export function makeQueryClient(handlers: QueryClientHandlers = {}): QueryClient {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isApiError(error) && error.kind === 'unauthorized') {
          handlers.onUnauthorized?.(error, client);
          return;
        }
        if (query.state.data !== undefined) handlers.onBackgroundRefreshError?.(error, query);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: staleTimes.default,
        refetchOnWindowFocus: true,
        retry: shouldRetry,
        retryDelay,
      },
      mutations: {
        retry: 0,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });

  return client;
}
