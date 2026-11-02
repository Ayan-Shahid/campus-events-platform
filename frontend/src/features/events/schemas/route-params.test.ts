import { describe, expect, it } from 'vitest';
import { eventRouteParamsSchema } from './route-params';

describe('eventRouteParamsSchema', () => {
  it('accepts a UUID', () => {
    const eventId = '3f2b8c1e-5d4a-4c8e-9a47-1b2c3d4e5f60';
    expect(eventRouteParamsSchema.parse({ eventId })).toEqual({ eventId });
  });

  it.each(['123', 'new', '../admin', "1'; DROP TABLE events;--", '<script>', '', 'e1'])(
    'rejects %j so it never reaches the API',
    (eventId) => {
      expect(eventRouteParamsSchema.safeParse({ eventId }).success).toBe(false);
    },
  );
});
