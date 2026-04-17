import { describe, it, vi, expect, beforeEach } from 'vitest';

import { http } from '@api/http';
import { reserveCabana } from '@api/reserveCabana';
import type { ReservationResponse, Reservation } from '@models/reservation.types';

vi.mock('@api/http', () => ({
  http: vi.fn()
}));

describe('reserveCabana', () => {
  const PAYLOAD: Reservation = {
    cabana: { x: 1, y: 2 },
    guest: { room: '237', guestName: 'Jack Torrance' }
  };

  const MOCK_RESPONSE: ReservationResponse = {
    message: 'Cabana reserved successfully',
    reservation: PAYLOAD
  };

  beforeEach(() => {
    vi.mocked(http).mockReset();
  });

  it('calls http(/api/reserve), POST method, body payload, returns raw response', async () => {
    vi.mocked(http).mockResolvedValue(MOCK_RESPONSE);

    const result = await reserveCabana(PAYLOAD);

    expect(http).toHaveBeenCalledWith('/api/reserve', {
      method: 'POST',
      body: JSON.stringify(PAYLOAD)
    });

    expect(result).toEqual(MOCK_RESPONSE);
  });

  it('propagates http() errors unchanged', async () => {
    const error = new Error('No one is able to leave the hotel!')

    vi.mocked(http).mockRejectedValue(error);

    await expect(reserveCabana(PAYLOAD)).rejects.toBe(error);
  });
});
