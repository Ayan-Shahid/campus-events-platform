import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { z } from 'zod';
import { env } from '@/config/env';
import { isApiError } from '@/lib/api/api-error';
import { request } from '@/lib/api/http-client';

const api = (path: string) => new URL(path, env.NEXT_PUBLIC_API_URL).href;

const eventSchema = z.object({ id: z.string(), title: z.string(), seatsLeft: z.number() });

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const errorBody = (code: string, message: string, fields?: Record<string, string>) => ({
  error: { code, message, fields, requestId: 'req_123' },
});

async function catchError(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Expected the request to fail');
}

describe('request', () => {
  it('success + valid schema -> returns typed data, sending the session cookie', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    server.use(
      http.get(api('/events/e1'), ({ request: req }) => {
        expect(req.headers.get('authorization')).toBeNull();
        return HttpResponse.json({ id: 'e1', title: 'Hack Night', seatsLeft: 12 });
      }),
    );

    const event = await request({ path: '/events/e1', schema: eventSchema });

    expect(event).toEqual({ id: 'e1', title: 'Hack Night', seatsLeft: 12 });
    expect(event.seatsLeft).toBe(12);
    expect(fetchSpy.mock.calls[0]?.[1]).toMatchObject({ credentials: 'include' });
  });

  it('success + wrong shape -> invalid_response', async () => {
    server.use(http.get(api('/events/e1'), () => HttpResponse.json({ id: 'e1', title: 42 })));

    const error = await catchError(request({ path: '/events/e1', schema: eventSchema }));

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({
      kind: 'invalid_response',
      code: 'INVALID_RESPONSE',
      status: 200,
    });
  });

  it('409 with envelope -> conflict with the right code', async () => {
    server.use(
      http.post(api('/events/e1/registrations'), ({ request: req }) => {
        expect(req.headers.get('idempotency-key')).toBe('key-1');
        return HttpResponse.json(errorBody('EVENT_FULL', 'This event is full.'), { status: 409 });
      }),
    );

    const error = await catchError(
      request({
        path: '/events/e1/registrations',
        method: 'POST',
        body: {},
        schema: z.object({ id: z.string() }),
        idempotencyKey: 'key-1',
      }),
    );

    expect(error).toMatchObject({
      kind: 'conflict',
      status: 409,
      code: 'EVENT_FULL',
      message: 'This event is full.',
      requestId: 'req_123',
    });
  });

  it('422 with fields -> fieldErrors populated', async () => {
    server.use(
      http.post(api('/events'), () =>
        HttpResponse.json(
          errorBody('VALIDATION_FAILED', 'Check the highlighted fields.', {
            title: 'Title is required.',
            capacity: 'Must be at least 1.',
          }),
          { status: 422 },
        ),
      ),
    );

    const error = await catchError(
      request({ path: '/events', method: 'POST', body: {}, schema: z.object({ id: z.string() }) }),
    );

    expect(error).toMatchObject({
      kind: 'validation',
      code: 'VALIDATION_FAILED',
      fieldErrors: { title: 'Title is required.', capacity: 'Must be at least 1.' },
    });
  });

  it('401 -> unauthorized', async () => {
    server.use(
      http.get(api('/me'), () =>
        HttpResponse.json(errorBody('UNAUTHENTICATED', 'Please sign in.'), { status: 401 }),
      ),
    );

    const error = await catchError(request({ path: '/me', schema: z.object({ id: z.string() }) }));

    expect(error).toMatchObject({ kind: 'unauthorized', status: 401, code: 'UNAUTHENTICATED' });
  });

  it('network error -> network, status 0', async () => {
    server.use(http.get(api('/events'), () => HttpResponse.error()));

    const error = await catchError(request({ path: '/events', schema: z.array(eventSchema) }));

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({ kind: 'network', status: 0, code: 'NETWORK_ERROR' });
  });

  it('the abort signal actually cancels the request', async () => {
    let serverSawAbort = false;
    let handlerStarted: () => void = () => {};
    const started = new Promise<void>((resolve) => (handlerStarted = resolve));

    server.use(
      http.get(api('/events'), async ({ request: req }) => {
        req.signal.addEventListener('abort', () => (serverSawAbort = true));
        handlerStarted();
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const controller = new AbortController();
    const pending = request({
      path: '/events',
      schema: z.array(eventSchema),
      signal: controller.signal,
    });
    const outcome = catchError(pending);

    await started;
    controller.abort();

    const error = await outcome;
    expect(error).toMatchObject({ name: 'AbortError' });
    expect(isApiError(error)).toBe(false);
    await expect.poll(() => serverSawAbort).toBe(true);
  });
});
