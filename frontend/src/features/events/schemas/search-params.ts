import {
  createParser,
  createSearchParamsCache,
  debounce,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs/server';

export const EVENT_CATEGORIES = [
  'academic',
  'arts',
  'career',
  'music',
  'social',
  'sports',
  'tech',
  'volunteering',
] as const;
export const EVENT_WHEN = ['today', 'week', 'month'] as const;
export const EVENT_TIME = ['any', 'morning', 'afternoon', 'evening'] as const;
export const EVENT_FORMAT = ['any', 'campus', 'online'] as const;

export const MAX_QUERY_LENGTH = 100;
export const MAX_PAGE = 10_000;

const parseAsSearchText = createParser<string>({
  parse: (value) => (value.length <= MAX_QUERY_LENGTH ? value : null),
  serialize: (value) => value,
});

const parseAsPage = createParser<number>({
  parse: (value) => {
    if (!/^\d+$/.test(value)) return null;
    const page = Number(value);
    return page >= 1 && page <= MAX_PAGE ? page : null;
  },
  serialize: (value) => String(value),
});

const options = { shallow: false, clearOnDefault: true } as const;

export const eventSearchParams = {
  q: parseAsSearchText.withDefault('').withOptions({ ...options, limitUrlUpdates: debounce(300) }),
  category: parseAsStringLiteral(EVENT_CATEGORIES).withOptions(options),
  when: parseAsStringLiteral(EVENT_WHEN).withOptions(options),
  time: parseAsStringLiteral(EVENT_TIME).withDefault('any').withOptions(options),
  format: parseAsStringLiteral(EVENT_FORMAT).withDefault('any').withOptions(options),
  page: parseAsPage.withDefault(1).withOptions(options),
};

export type EventSearchParams = inferParserType<typeof eventSearchParams>;

export const eventSearchParamsCache = createSearchParamsCache(eventSearchParams);
