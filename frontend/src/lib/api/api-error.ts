import type { ErrorEnvelope } from '@/lib/api/error-envelope';

export const clientErrorCodes = {
  network: 'NETWORK_ERROR',
  timeout: 'TIMEOUT',
  invalidResponse: 'INVALID_RESPONSE',
} as const;

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'server'
  | 'invalid_response';

export interface ApiErrorInit {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Record<string, string>;
  readonly requestId: string | undefined;

  constructor({ status, code, message, fieldErrors, requestId, cause }: ApiErrorInit) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors ?? {};
    this.requestId = requestId;
  }

  get kind(): ApiErrorKind {
    if (this.code === clientErrorCodes.invalidResponse) return 'invalid_response';
    if (this.status === 0) return 'network';
    if (this.status === 401) return 'unauthorized';
    if (this.status === 403) return 'forbidden';
    if (this.status === 404) return 'not_found';
    if (this.status === 409) return 'conflict';
    if (this.status === 400 || this.status === 422) return 'validation';
    // 5xx, plus any other status the contract does not list (e.g. 429): treat as a server problem.
    return 'server';
  }

  static fromEnvelope(status: number, { error }: ErrorEnvelope): ApiError {
    return new ApiError({
      status,
      code: error.code,
      message: error.message,
      fieldErrors: error.fields,
      requestId: error.requestId,
    });
  }

  static network(cause: unknown, code: string = clientErrorCodes.network): ApiError {
    return new ApiError({
      status: 0,
      code,
      message:
        code === clientErrorCodes.timeout
          ? 'The request took too long. Please try again.'
          : 'Could not reach the server. Check your connection and try again.',
      cause,
    });
  }

  static invalidResponse(status: number, requestId?: string, cause?: unknown): ApiError {
    return new ApiError({
      status,
      code: clientErrorCodes.invalidResponse,
      message: 'The server sent a response we could not understand.',
      requestId,
      cause,
    });
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
