export interface CspOptions {
  nonce: string;
  apiOrigin: string;
  isDev: boolean;
}

export function generateNonce(): string {
  return btoa(crypto.randomUUID());
}

export function buildCsp({ nonce, apiOrigin, isDev }: CspOptions): string {
  const directives: Array<[name: string, values: string[]]> = [
    ['default-src', ["'self'"]],
    [
      'script-src',
      ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDev ? ["'unsafe-eval'"] : [])],
    ],
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['img-src', ["'self'", 'data:', 'blob:']],
    ['font-src', ["'self'"]],
    ['connect-src', ["'self'", apiOrigin, ...(isDev ? ['ws:'] : [])]],
    ['worker-src', ["'self'", 'blob:']],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    ['form-action', ["'self'"]],
    ['frame-ancestors', ["'none'"]],
  ];

  if (!isDev) directives.push(['upgrade-insecure-requests', []]);

  return directives
    .map(([name, values]) => (values.length > 0 ? `${name} ${values.join(' ')}` : name))
    .join('; ');
}

export function cspHeaderName(reportOnly: boolean): string {
  return reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
}
