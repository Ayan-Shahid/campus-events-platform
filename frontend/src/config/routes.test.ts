import { describe, expect, it } from 'vitest';
import { routes } from '@/config/routes';

describe('routes', () => {
  it('static routes are plain paths', () => {
    expect(routes.signIn).toBe('/sign-in');
    expect(routes.events).toBe('/events');
  });

  it('dynamic routes build the expected paths', () => {
    expect(routes.event('abc-123')).toBe('/events/abc-123');
    expect(routes.organizerEditEvent('abc-123')).toBe('/organizer/events/abc-123/edit');
  });

  it('encodes every dynamic argument so it cannot escape its segment', () => {
    expect(routes.event('a/b?c=d#e')).toBe('/events/a%2Fb%3Fc%3Dd%23e');
    expect(routes.organizerEditEvent('../admin')).toBe('/organizer/events/..%2Fadmin/edit');
  });
});
