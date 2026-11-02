import { describe, expect, it } from 'vitest';
import { buildCsp, cspHeaderName, generateNonce } from '@/lib/security/csp';

const base = { nonce: 'abc123', apiOrigin: 'https://api.example.com' };

const directive = (csp: string, name: string) =>
  csp
    .split('; ')
    .find((part) => part === name || part.startsWith(`${name} `))
    ?.split(' ')
    .slice(1) ?? [];

describe('generateNonce', () => {
  it('is base64 and different every time', () => {
    const nonces = new Set(Array.from({ length: 50 }, generateNonce));

    expect(nonces.size).toBe(50);
    for (const nonce of nonces) expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });
});

describe('buildCsp (production)', () => {
  const csp = buildCsp({ ...base, isDev: false });

  it('only allows scripts from our origin, with the nonce and strict-dynamic', () => {
    expect(directive(csp, 'script-src')).toEqual(["'self'", "'nonce-abc123'", "'strict-dynamic'"]);
  });

  it('never allows eval or inline scripts', () => {
    expect(csp).not.toContain("'unsafe-eval'");
    expect(directive(csp, 'script-src')).not.toContain("'unsafe-inline'");
  });

  it('allows the API origin in connect-src, and no websockets', () => {
    expect(directive(csp, 'connect-src')).toEqual(["'self'", 'https://api.example.com']);
  });

  it('locks down everything else', () => {
    expect(directive(csp, 'default-src')).toEqual(["'self'"]);
    expect(directive(csp, 'style-src')).toEqual(["'self'", "'unsafe-inline'"]);
    expect(directive(csp, 'img-src')).toEqual(["'self'", 'data:', 'blob:']);
    expect(directive(csp, 'font-src')).toEqual(["'self'"]);
    expect(directive(csp, 'worker-src')).toEqual(["'self'", 'blob:']);
    expect(directive(csp, 'object-src')).toEqual(["'none'"]);
    expect(directive(csp, 'base-uri')).toEqual(["'self'"]);
    expect(directive(csp, 'form-action')).toEqual(["'self'"]);
    expect(directive(csp, 'frame-ancestors')).toEqual(["'none'"]);
  });

  it('upgrades insecure requests', () => {
    expect(csp.split('; ')).toContain('upgrade-insecure-requests');
  });
});

describe('buildCsp (development)', () => {
  const csp = buildCsp({ ...base, isDev: true });

  it('adds only what React Refresh and hot reload need', () => {
    expect(directive(csp, 'script-src')).toContain("'unsafe-eval'");
    expect(directive(csp, 'connect-src')).toContain('ws:');
  });

  it('does not upgrade insecure requests (it breaks plain-http localhost)', () => {
    expect(csp).not.toContain('upgrade-insecure-requests');
  });
});

describe('cspHeaderName', () => {
  it('switches between enforcing and report-only', () => {
    expect(cspHeaderName(false)).toBe('Content-Security-Policy');
    expect(cspHeaderName(true)).toBe('Content-Security-Policy-Report-Only');
  });
});
