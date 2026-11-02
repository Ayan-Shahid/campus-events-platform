import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';
import { buildCsp, cspHeaderName, generateNonce } from '@/lib/security/csp';

export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp({
    nonce,
    apiOrigin: new URL(env.NEXT_PUBLIC_API_URL).origin,
    isDev: process.env.NODE_ENV === 'development',
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(cspHeaderName(env.CSP_REPORT_ONLY === 'true'), csp);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|textures/|mockServiceWorker\\.js).*)'],
};
