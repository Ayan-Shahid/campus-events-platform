import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { crossTab } from '@/lib/cross-tab/channel';

export function invalidateEverywhere(queryClient: QueryClient, queryKey: QueryKey): Promise<void> {
  crossTab.post({ type: 'query:invalidate', queryKey });
  return queryClient.invalidateQueries({ queryKey });
}
