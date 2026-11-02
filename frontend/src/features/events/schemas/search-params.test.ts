import { createLoader, createSerializer } from 'nuqs/server';
import { describe, expect, it } from 'vitest';
import { eventSearchParams, MAX_QUERY_LENGTH } from './search-params';

const load = createLoader(eventSearchParams);

describe('event search params', () => {
  it('an empty URL gives the defaults', () => {
    expect(load('')).toEqual({
      q: '',
      category: null,
      when: null,
      time: 'any',
      format: 'any',
      page: 1,
    });
  });

  it('valid values are parsed', () => {
    expect(load('?q=data&category=tech&when=week&time=evening&format=online&page=3')).toEqual({
      q: 'data',
      category: 'tech',
      when: 'week',
      time: 'evening',
      format: 'online',
      page: 3,
    });
  });

  it('unknown or garbage values fall back to the default', () => {
    const filters = load(
      `?category=${encodeURIComponent('<script>')}&when=yesterday&time=midnight&format=hybrid&page=-3&q=${'a'.repeat(MAX_QUERY_LENGTH + 1)}`,
    );

    expect(filters).toEqual({
      q: '',
      category: null,
      when: null,
      time: 'any',
      format: 'any',
      page: 1,
    });
  });

  it.each(['0', '-1', '1.5', '2abc', 'abc', '', '1e3', '99999999999'])(
    'page=%s falls back to 1',
    (page) => {
      expect(load(`?page=${page}`).page).toBe(1);
    },
  );

  it('clearOnDefault keeps default values out of the URL', () => {
    const serialize = createSerializer(eventSearchParams, { clearOnDefault: true });

    expect(serialize('/events', { page: 1, time: 'any', format: 'any', q: '' })).toBe('/events');
    expect(serialize('/events', { page: 2, time: 'evening' })).toBe('/events?time=evening&page=2');
  });
});
