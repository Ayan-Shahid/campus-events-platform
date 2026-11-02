import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CrossTabSync from '@/app/providers/cross-tab-sync';
import { createCrossTabChannel } from '@/lib/cross-tab/channel';
import { sessionQueryKey } from '@/lib/query/session-key';

function setup() {
  const client = new QueryClient();
  const navigate = vi.fn();
  const invalidateQueries = vi.spyOn(client, 'invalidateQueries');
  const clear = vi.spyOn(client, 'clear');

  render(
    <QueryClientProvider client={client}>
      <CrossTabSync navigate={navigate} />
    </QueryClientProvider>,
  );

  // Another tab: a separate channel with its own sender id.
  const otherTab = createCrossTabChannel({ senderId: 'other-tab' });
  return { client, navigate, invalidateQueries, clear, otherTab };
}

afterEach(() => {
  window.history.pushState({}, '', '/');
  vi.restoreAllMocks();
});

describe('CrossTabSync', () => {
  it('query:invalidate invalidates exactly that key', async () => {
    const { invalidateQueries, otherTab } = setup();

    otherTab.post({ type: 'query:invalidate', queryKey: ['events', 'detail', 'e1'] });

    await vi.waitFor(() =>
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['events', 'detail', 'e1'] }),
    );
    otherTab.close();
  });

  it('auth:signed-out clears the cache and goes to sign-in', async () => {
    const { clear, navigate, otherTab } = setup();

    otherTab.post({ type: 'auth:signed-out' });

    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/sign-in'));
    expect(clear).toHaveBeenCalled();
    otherTab.close();
  });

  it('auth:signed-out does not navigate when already on the sign-in page', async () => {
    window.history.pushState({}, '', '/sign-in');
    const { clear, navigate, otherTab } = setup();

    otherTab.post({ type: 'auth:signed-out' });

    await vi.waitFor(() => expect(clear).toHaveBeenCalled());
    expect(navigate).not.toHaveBeenCalled();
    otherTab.close();
  });

  it('auth:signed-in refetches the session and leaves the sign-in page via a safe returnTo', async () => {
    window.history.pushState({}, '', '/sign-in?returnTo=%2Fevents%3Fpage%3D2');
    const { invalidateQueries, navigate, otherTab } = setup();

    otherTab.post({ type: 'auth:signed-in' });

    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/events?page=2'));
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: sessionQueryKey });
    otherTab.close();
  });

  it('auth:signed-in ignores an unsafe returnTo', async () => {
    window.history.pushState({}, '', '/sign-in?returnTo=%2F%2Fevil.com');
    const { navigate, otherTab } = setup();

    otherTab.post({ type: 'auth:signed-in' });

    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/events'));
    otherTab.close();
  });

  it('auth:signed-in elsewhere only refetches the session', async () => {
    const { invalidateQueries, navigate, otherTab } = setup();

    otherTab.post({ type: 'auth:signed-in' });

    await vi.waitFor(() =>
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: sessionQueryKey }),
    );
    expect(navigate).not.toHaveBeenCalled();
    otherTab.close();
  });
});
