import { environmentManager, type QueryClient } from '@tanstack/react-query';
import { browserHandlers } from '@/lib/query/browser-handlers';
import { makeQueryClient } from '@/lib/query/make-query-client';

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient();

  browserQueryClient ??= makeQueryClient(browserHandlers);
  return browserQueryClient;
}
