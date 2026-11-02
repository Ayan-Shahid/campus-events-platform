import type { z } from 'zod';
import { env } from '@/config/env';
import { ApiError, clientErrorCodes } from '@/lib/api/api-error';
import { errorEnvelopeSchema } from '@/lib/api/error-envelope';

export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
export const REQUEST_ID_HEADER = 'x-request-id';
export const DEFAULT_TIMEOUT_MS = 15_000;

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions<TSchema extends z.ZodType> {
  path: string;
  schema: TSchema;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
  idempotencyKey?: string;
}

export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}

function buildUrl(path: string, query?: QueryParams): URL {
  const base = new URL(env.NEXT_PUBLIC_API_URL);
  base.pathname = base.pathname.replace(/\/*$/, '/');

  const url = new URL(path.replace(/^\/+/, ''), base);
  if (url.origin !== base.origin) {
    throw new Error(`API path must be relative to NEXT_PUBLIC_API_URL, got "${path}"`);
  }

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

function parseJson(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

export async function request<TSchema extends z.ZodType>({
  path,
  schema,
  method = 'GET',
  body,
  query,
  signal,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  idempotencyKey,
}: RequestOptions<TSchema>): Promise<z.output<TSchema>> {
  const url = buildUrl(path, query);

  const headers = new Headers({ Accept: 'application/json' });
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  if (idempotencyKey) headers.set(IDEMPOTENCY_KEY_HEADER, idempotencyKey);

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  let text: string;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'include',
      signal: combinedSignal,
    });
    text = await response.text();
  } catch (error) {
    if (signal?.aborted) throw signal.reason ?? error;
    if (timeoutSignal.aborted) throw ApiError.network(error, clientErrorCodes.timeout);
    throw ApiError.network(error);
  }

  const requestId = response.headers.get(REQUEST_ID_HEADER) ?? undefined;
  const json = text === '' ? { ok: true as const, value: undefined } : parseJson(text);

  if (!response.ok) {
    const envelope = json.ok ? errorEnvelopeSchema.safeParse(json.value) : undefined;
    if (envelope?.success) throw ApiError.fromEnvelope(response.status, envelope.data);

    throw new ApiError({
      status: response.status,
      code: `HTTP_${response.status}`,
      message: response.statusText || 'The request failed.',
      requestId,
    });
  }

  if (!json.ok) throw ApiError.invalidResponse(response.status, requestId);

  const parsed = schema.safeParse(json.value);
  if (!parsed.success) throw ApiError.invalidResponse(response.status, requestId, parsed.error);

  return parsed.data;
}
