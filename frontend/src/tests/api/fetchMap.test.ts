import { vi, describe, it, expect, beforeEach } from 'vitest';

import { fetchMap } from '@api/fetchMap';
import { http } from '@api/http';
import type { MapApiResponse } from '@models/map.types';

vi.mock('@api/http', () => ({
  http: vi.fn()
}));

describe('fetchMap()', () => {
  const MOCK_MAP: MapApiResponse = {
    grid: [
      ['.', '#'],
      ['#', '.']
    ],
    cabanas: [
      { x: 1, y: 2, isReserved: false, guestName: null }
    ]
  };

  beforeEach(() => {
    vi.mocked(http).mockReset();
  });

  it('calls http() with /api/map and returns the raw map data', async () => {
    vi.mocked(http).mockResolvedValue(MOCK_MAP);

    const result = await fetchMap();

    expect(http).toHaveBeenCalledWith('/api/map');
    expect(result).toEqual(MOCK_MAP);
  });

  it('propagates http() errors', async () => {
    const error = new Error('No one is able to leave the hotel!');

    vi.mocked(http).mockRejectedValue(error);

    await expect(fetchMap()).rejects.toBe(error);
  });
});
