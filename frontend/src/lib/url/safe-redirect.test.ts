import { describe, expect, it } from 'vitest';
import { getSafeRedirectPath, getSignInPath } from '@/lib/url/safe-redirect';

const FALLBACK = '/events';

describe('getSafeRedirectPath', () => {
  it.each([
    ['another origin', 'https://evil.com'],
    ['protocol-relative', '//evil.com'],
    ['slash + backslash', '/\\evil.com'],
    ['double backslash', '\\\\evil.com'],
    ['encoded protocol-relative', '/%2F%2Fevil.com'],
    ['encoded backslash', '/%5Cevil.com'],
    ['javascript: URL', 'javascript:alert(1)'],
    ['single-slash scheme', 'http:/evil.com'],
    ['leading space', ' /events'],
    ['trailing newline', '/events\n'],
    ['encoded newline', '/events%0d%0aSet-Cookie:x=1'],
    ['embedded tab', '/\t/evil.com'],
    ['empty string', ''],
    ['undefined', undefined],
    ['null', null],
    ['an array', ['/events']],
    ['too long', `/events?q=${'a'.repeat(2000)}`],
    ['broken percent-encoding', '/events%E0%A4%A'],
    ['dot-segments that leave the known routes', '/events/../../evil'],
    ['an encoded dot-segment', '/events/..%2f..%2fadmin'],
    ['a path outside the known routes', '/admin'],
    ['a prefix that is not a whole segment', '/eventsevil'],
    ['the sign-in page (redirect loop)', '/sign-in'],
  ])('rejects %s', (_name, input) => {
    expect(getSafeRedirectPath(input, FALLBACK)).toBe(FALLBACK);
  });

  it.each([
    '/events',
    '/events?page=2&q=data',
    '/events?q=data%20science',
    '/events/3f2b8c1e-5d4a-4c8e-9a47-1b2c3d4e5f60#register',
    '/organizer/events/new',
    '/my-registrations',
  ])('passes %s through unchanged', (input) => {
    expect(getSafeRedirectPath(input, FALLBACK)).toBe(input);
  });

  it('uses the fallback you pass, and defaults to the home page', () => {
    expect(getSafeRedirectPath('https://evil.com', '/my-registrations')).toBe('/my-registrations');
    expect(getSafeRedirectPath('https://evil.com')).toBe('/');
  });
});

describe('getSignInPath', () => {
  it('puts a safe return path in ?returnTo, encoded', () => {
    expect(getSignInPath('/events?page=2')).toBe('/sign-in?returnTo=%2Fevents%3Fpage%3D2');
  });

  it('never carries an unsafe return path', () => {
    expect(getSignInPath('//evil.com')).toBe('/sign-in?returnTo=%2Fevents');
  });
});
