import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCrossTabChannel } from '@/lib/cross-tab/channel';
import { CHANNEL_NAME, type CrossTabMessage } from '@/lib/cross-tab/messages';

const open: Array<{ close: () => void }> = [];
function channel(senderId: string) {
  const created = createCrossTabChannel({ senderId });
  open.push(created);
  return created;
}

afterEach(() => {
  open.splice(0).forEach((c) => c.close());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('cross-tab channel', () => {
  it('a message posted by A reaches B but not A', async () => {
    const a = channel('tab-a');
    const b = channel('tab-b');
    const receivedByA = vi.fn();
    const receivedByB = vi.fn();
    a.subscribe(receivedByA);
    b.subscribe(receivedByB);

    a.post({ type: 'query:invalidate', queryKey: ['events', 'detail', 'e1'] });

    await vi.waitFor(() => expect(receivedByB).toHaveBeenCalledTimes(1));
    expect(receivedByB).toHaveBeenCalledWith({
      v: 1,
      type: 'query:invalidate',
      queryKey: ['events', 'detail', 'e1'],
      senderId: 'tab-a',
      sentAt: expect.any(Number),
    });
    expect(receivedByA).not.toHaveBeenCalled();
  });

  it('ignores invalid messages: wrong shape, other version, unknown type, junk', async () => {
    const b = channel('tab-b');
    const received = vi.fn<(message: CrossTabMessage) => void>();
    b.subscribe(received);

    // A raw sender that bypasses our validation, like a stale tab on an older build.
    const raw = new BroadcastChannel(CHANNEL_NAME);
    const base = { senderId: 'old-tab', sentAt: Date.now() };
    raw.postMessage({ type: 'auth:signed-out' }); // no envelope
    raw.postMessage({ ...base, v: 2, type: 'auth:signed-out' }); // other version
    raw.postMessage({ ...base, v: 1, type: 'auth:something-new' }); // unknown type
    raw.postMessage({ ...base, v: 1, type: 'query:invalidate', queryKey: 'events' }); // bad key
    raw.postMessage({ ...base, v: 1, type: 'query:invalidate', queryKey: [undefined] }); // not JSON
    raw.postMessage('garbage');
    raw.postMessage(null);
    // A valid one last: once it arrives, everything before it has been processed.
    raw.postMessage({ ...base, v: 1, type: 'auth:signed-in' });

    await vi.waitFor(() => expect(received).toHaveBeenCalledTimes(1));
    expect(received.mock.calls[0]?.[0]).toMatchObject({ type: 'auth:signed-in' });
    raw.close();
  });

  it('refuses to send a query key that is not plain JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const a = channel('tab-a');
    const spy = vi.spyOn(BroadcastChannel.prototype, 'postMessage');

    a.post({ type: 'query:invalidate', queryKey: ['events', () => {}] });

    expect(spy).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });

  it('subscribe returns an unsubscribe function', async () => {
    const a = channel('tab-a');
    const b = channel('tab-b');
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = b.subscribe(first);
    b.subscribe(second);

    unsubscribeFirst();
    a.post({ type: 'auth:signed-out' });

    await vi.waitFor(() => expect(second).toHaveBeenCalledTimes(1));
    expect(first).not.toHaveBeenCalled();
  });

  it('a throwing handler does not stop the others', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const a = channel('tab-a');
    const b = channel('tab-b');
    const healthy = vi.fn();
    b.subscribe(() => {
      throw new Error('boom');
    });
    b.subscribe(healthy);

    a.post({ type: 'auth:signed-out' });

    await vi.waitFor(() => expect(healthy).toHaveBeenCalledTimes(1));
  });
});

describe('cross-tab channel without BroadcastChannel (localStorage fallback)', () => {
  it('sends through a storage write and receives storage events, validated', () => {
    vi.stubGlobal('BroadcastChannel', undefined);
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const a = channel('tab-a');
    const b = channel('tab-b');
    const received = vi.fn();
    b.subscribe(received);

    a.post({ type: 'auth:signed-out' });

    expect(setItem).toHaveBeenCalledTimes(1);
    const [key, value] = setItem.mock.calls[0] as [string, string];
    expect(JSON.parse(value)).toMatchObject({ type: 'auth:signed-out', senderId: 'tab-a' });

    // Browsers fire `storage` in the *other* tabs; jsdom does not, so do it by hand.
    const deliver = (newValue: string | null) =>
      window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

    deliver(value);
    expect(received).toHaveBeenCalledTimes(1);

    deliver(null); // the removeItem that follows every write
    deliver('not json');
    deliver(JSON.stringify({ type: 'auth:signed-out' })); // invalid shape
    expect(received).toHaveBeenCalledTimes(1);
  });
});
