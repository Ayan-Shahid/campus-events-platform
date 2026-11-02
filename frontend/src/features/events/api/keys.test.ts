import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { eventKeys } from './keys';

describe('eventKeys', () => {
  it('each level starts with the level above it', () => {
    expect(eventKeys.lists().slice(0, eventKeys.all.length)).toEqual(eventKeys.all);
    expect(eventKeys.list({ search: 'jazz' }).slice(0, eventKeys.lists().length)).toEqual(
      eventKeys.lists(),
    );
    expect(eventKeys.details().slice(0, eventKeys.all.length)).toEqual(eventKeys.all);
    expect(eventKeys.detail('e1').slice(0, eventKeys.details().length)).toEqual(
      eventKeys.details(),
    );
  });

  it('keys for different filters or ids are different', () => {
    expect(eventKeys.list({ page: 1 })).not.toEqual(eventKeys.list({ page: 2 }));
    expect(eventKeys.detail('e1')).not.toEqual(eventKeys.detail('e2'));
  });

  it('invalidating `all` refreshes every event query and nothing else', async () => {
    const client = new QueryClient();
    const unrelated = ['registrations', 'list'] as const;

    client.setQueryData(eventKeys.list({ search: 'jazz' }), []);
    client.setQueryData(eventKeys.detail('e1'), {});
    client.setQueryData(unrelated, []);

    await client.invalidateQueries({ queryKey: eventKeys.all });

    expect(client.getQueryState(eventKeys.list({ search: 'jazz' }))?.isInvalidated).toBe(true);
    expect(client.getQueryState(eventKeys.detail('e1'))?.isInvalidated).toBe(true);
    expect(client.getQueryState(unrelated)?.isInvalidated).toBe(false);
  });

  it('invalidating `lists()` leaves details alone', async () => {
    const client = new QueryClient();

    client.setQueryData(eventKeys.list({}), []);
    client.setQueryData(eventKeys.detail('e1'), {});

    await client.invalidateQueries({ queryKey: eventKeys.lists() });

    expect(client.getQueryState(eventKeys.list({}))?.isInvalidated).toBe(true);
    expect(client.getQueryState(eventKeys.detail('e1'))?.isInvalidated).toBe(false);
  });
});
