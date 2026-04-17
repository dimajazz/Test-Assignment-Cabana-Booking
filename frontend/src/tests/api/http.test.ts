import { describe, it, expect, vi, beforeEach } from 'vitest';

import { http } from '@api/http';
import { API_ERROR_TYPES, BASE_URL } from '@constants/api.constants';

const TEST_API_URL = `${BASE_URL}/api/test`;

describe('http()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON when the response is ok', async () => {
    const mockData = { message: 'ok' };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockData)
    }));

    const result = await http<typeof mockData>(TEST_API_URL);

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(TEST_API_URL, expect.any(Object));
  });

  it('throws NetworkError when fetch throws', async () => {
    const networkFailure = new Error('Network down');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkFailure));

    await expect(http(TEST_API_URL)).rejects.toMatchObject({
      type: API_ERROR_TYPES.NETWORK,
      message: 'Network request failed',
      cause: networkFailure
    });
  });

  it('throws HttpError when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: vi.fn()
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(http(TEST_API_URL)).rejects.toMatchObject({
      type: API_ERROR_TYPES.HTTP,
      message: 'HTTP error: 404',
      status: 404,
      cause: mockResponse
    });
  });

  it('throws ParseError when JSON parsing fails', async () => {
    const parseFailure = new Error('Unexpected token < in JSON');

    const mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(parseFailure)
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(http(TEST_API_URL)).rejects.toMatchObject({
      type: API_ERROR_TYPES.PARSE,
      message: 'Failed to parse JSON response',
      cause: parseFailure
    });
  });

  it('throws ValidationError when server returns validation errors', async () => {
    const validationBody = {
      error: 'Invalid credentials'
    };

    const mockResponse = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue(validationBody)
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(http(TEST_API_URL)).rejects.toMatchObject({
      type: API_ERROR_TYPES.VALIDATION,
      message: validationBody.error,
      cause: validationBody
    });
  });

  it('throws ServerError when server returns 500', async () => {
    const errorBody = { error: 'Internal server error' };

    const mockResponse = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(errorBody)
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(http(TEST_API_URL)).rejects.toMatchObject({
      type: API_ERROR_TYPES.SERVER,
      message: errorBody.error,
      cause: errorBody
    });
  });

  it('sets JSON headers when body is present', async () => {
    const body = { room: '237' };

    const mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true })
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await http(TEST_API_URL, { method: 'POST', body: JSON.stringify(body) });

    expect(fetch).toHaveBeenCalledWith(
      TEST_API_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          'content-type': 'application/json'
        })
      })
    );
  });

  it('throws TimeoutError when request exceeds timeout', async () => {
    vi.stubGlobal('fetch', vi.fn((_, options: any) => {
      return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    }));

    await expect(
      http(TEST_API_URL, { timeout: 100 })
    ).rejects.toMatchObject({
      type: API_ERROR_TYPES.TIMEOUT,
      message: 'Request timed out'
    })
  });
});
