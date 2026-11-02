import { env } from '@/config/env';
import { routes } from '@/config/routes';

const MAX_LENGTH = 2000;

const KNOWN_PREFIXES: readonly string[] = [
  routes.events,
  routes.myRegistrations,
  routes.organizerEvents,
  routes.organizerRegistrations,
];

function isControl(code: number): boolean {
  return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
}

function hasUnsafeCharacter(value: string, { allowSpace }: { allowSpace: boolean }): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (char === '\\' || isControl(code)) return true;
    if (/\s/u.test(char) && !(allowSpace && char === ' ')) return true;
  }
  return false;
}

function matchesKnownPrefix(pathname: string): boolean {
  return KNOWN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function getSafeRedirectPath(raw: unknown, fallback: string = routes.home): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_LENGTH) return fallback;

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return fallback;
  }

  if (hasUnsafeCharacter(raw, { allowSpace: false })) return fallback;
  if (hasUnsafeCharacter(decoded, { allowSpace: true })) return fallback;

  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return fallback;

  const decodedPath = decoded.split(/[?#]/)[0] ?? '';
  if (decodedPath.split('/').includes('..')) return fallback;

  const appOrigin = new URL(env.NEXT_PUBLIC_APP_URL).origin;
  let url: URL;
  try {
    url = new URL(raw, appOrigin);
  } catch {
    return fallback;
  }
  if (url.origin !== appOrigin) return fallback;

  if (!matchesKnownPrefix(url.pathname)) return fallback;

  return url.pathname + url.search + url.hash;
}

export function getSignInPath(returnTo: unknown, fallback: string = routes.events): string {
  const url = new URL(routes.signIn, env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set('returnTo', getSafeRedirectPath(returnTo, fallback));
  return url.pathname + url.search;
}
