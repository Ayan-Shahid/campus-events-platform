import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { crossTab } from '@/lib/cross-tab/channel';
import { invalidateEverywhere } from '@/lib/cross-tab/invalidate-everywhere';

afterEach(() => vi.restoreAllMocks());

describe('invalidateEverywhere', () => {
  it('invalidates in this tab and tells the other tabs, with the key only', async () => {
    const post = vi.spyOn(crossTab, 'post').mockImplementation(() => {});
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const queryKey = ['events', 'detail', 'e1'];

    await invalidateEverywhere(client, queryKey);

    expect(invalidate).toHaveBeenCalledWith({ queryKey });
    expect(post).toHaveBeenCalledWith({ type: 'query:invalidate', queryKey });
  });
});
