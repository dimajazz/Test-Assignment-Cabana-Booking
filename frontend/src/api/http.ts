import { API_ERROR_TYPES, BASE_URL } from "@constants/api.constants";
import type { ApiError } from "@models/api.types";

export async function http<T>(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<T> {
  const fullUrl = url.startsWith('http')
    ? url
    : BASE_URL + url;

  if (options?.body) {
    options.headers = {
      'content-type': 'application/json',
      ...(options?.headers ?? {})
    };
  }

  options = options ?? {};

  const controller = new AbortController();
  const timeout = options.timeout ?? 1000;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  options.signal = controller.signal;

  let response: Response;

  try {
    response = await fetch(fullUrl, options);
  } catch (error) {
    if (
      error instanceof DOMException
      && error.name === 'AbortError'
    ) {
      const timeoutError = {
        type: API_ERROR_TYPES.TIMEOUT,
        message: 'Request timed out',
        cause: error
      };

      throw timeoutError;
    };

    const networkError: ApiError = {
      type: API_ERROR_TYPES.NETWORK,
      message: 'Network request failed',
      cause: error
    };

    throw networkError;

  } finally {
    clearTimeout(timeoutId);
  };

  if (!response.ok) {
    let body: unknown = null;

    try {
      body = await response.json();
    } catch { }

    // ValidationError (400)
    if (
      (response.status === 400 || response.status === 409)
      && body
      && (typeof body === 'object')
      && ('error' in body)
    ) {
      const errorBody = body as { error: string };

      const validationError: ApiError = {
        type: API_ERROR_TYPES.VALIDATION,
        message: errorBody.error,
        cause: errorBody
      };

      throw validationError;
    }

    // ServerError (500+)
    if (response.status >= 500) {
      const serverError: ApiError = {
        type: API_ERROR_TYPES.SERVER,
        message: 'Internal server error',
        cause: body ?? response
      };

      throw serverError;
    }

    // Generic HttpError
    const httpError: ApiError = {
      type: API_ERROR_TYPES.HTTP,
      message: `HTTP error: ${response.status}`,
      status: response.status,
      cause: response
    }

    throw httpError;
  }

  try {
    const data = await response.json();

    return data as T;

  } catch (error) {
    const parseJsonError: ApiError = {
      type: API_ERROR_TYPES.PARSE,
      message: 'Failed to parse JSON response',
      cause: error
    }

    throw parseJsonError;
  }
}
