import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api/api-error';
import {
  MAX_RETRIES,
  makeQueryClient,
  retryDelay,
  shouldRetry,
} from '@/lib/query/make-query-client';

const httpError = (status: number) =>
  new ApiError({ status, code: `HTTP_${status}`, message: 'Failed' });

describe('shouldRetry', () => {
  it.each([400, 401, 403, 404, 409, 422, 429])('never retries a %i', (status) => {
    expect(shouldRetry(0, httpError(status))).toBe(false);
  });

  it('retries network failures and 5xx, up to the limit', () => {
    for (const error of [ApiError.network(new Error('offline')), httpError(500), httpError(503)]) {
      for (let failureCount = 0; failureCount < MAX_RETRIES; failureCount++) {
        expect(shouldRetry(failureCount, error)).toBe(true);
      }
      expect(shouldRetry(MAX_RETRIES, error)).toBe(false);
    }
  });

  it('does not retry a response with the wrong shape or an unexpected error', () => {
    expect(shouldRetry(0, ApiError.invalidResponse(200))).toBe(false);
    expect(shouldRetry(0, new TypeError('bug in a queryFn'))).toBe(false);
  });
});

describe('retryDelay', () => {
  it('doubles each attempt and is capped at 8 seconds', () => {
    expect([0, 1, 2, 3, 4, 10].map(retryDelay)).toEqual([1000, 2000, 4000, 8000, 8000, 8000]);
  });
});

describe('makeQueryClient', () => {
  const fail = (error: Error) => () => Promise.reject(error);

  it('sets the agreed defaults, with no automatic mutation retries', () => {
    const { queries, mutations } = makeQueryClient().getDefaultOptions();

    expect(queries).toMatchObject({ staleTime: 30_000, refetchOnWindowFocus: true });
    expect(mutations?.retry).toBe(0);
  });

  it('a 401 calls onUnauthorized once and is never toasted', async () => {
    const onUnauthorized = vi.fn();
    const onBackgroundRefreshError = vi.fn();
    const client = makeQueryClient({ onUnauthorized, onBackgroundRefreshError });
    client.setQueryData(['me'], { id: 'u1' });

    await client
      .query({ queryKey: ['me'], queryFn: fail(httpError(401)), staleTime: 0, retry: false })
      .catch(() => undefined);

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(onUnauthorized).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }), client);
    expect(onBackgroundRefreshError).not.toHaveBeenCalled();
  });

  it('a failed refetch with data on screen reports a background error', async () => {
    const onBackgroundRefreshError = vi.fn();
    const client = makeQueryClient({ onBackgroundRefreshError });
    client.setQueryData(['seats'], 12);

    await client
      .query({
        queryKey: ['seats'],
        queryFn: fail(httpError(500)),
        staleTime: 0,
        retry: false,
      })
      .catch(() => undefined);

    expect(onBackgroundRefreshError).toHaveBeenCalledTimes(1);
  });

  it('a first-load failure is not a background error (the inline QueryError handles it)', async () => {
    const onBackgroundRefreshError = vi.fn();
    const client = makeQueryClient({ onBackgroundRefreshError });

    await client
      .query({ queryKey: ['seats'], queryFn: fail(httpError(500)), retry: false })
      .catch(() => undefined);

    expect(onBackgroundRefreshError).not.toHaveBeenCalled();
  });
});
