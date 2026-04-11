import { ReservationService } from '../../src/utils/reservationService';
import { PayloadValidationAppError } from '../../src/exceptions/exceptions';

describe('ReservationService.reserveCabana', () => {
  let store: any;

  beforeEach(() => {
    store = {
      bookings: new Map(),
      cabanas: new Map(),
      isRoomAlreadyReserved: jest.fn(),
      reserveCabana: jest.fn()
    };
  });

  // Payload validation
  it('throws if payload structure is invalid', async () => {
    const invalidPayloads = [
      {},
      { cabana: null, guest: {} },
      { cabana: { x: '1', y: 2 }, guest: { room: '237', guestName: 'Jack Torrance' } },
      { cabana: { x: 1, y: 2 }, guest: { room: 237, guestName: 'Jack Torrance' } }
    ];

    for (const payload of invalidPayloads) {
      await expect(
        ReservationService.reserveCabana(payload as any, store)
      ).rejects.toThrow(PayloadValidationAppError);
    };
  });

  // Invalid booking credentials
  it('throws if guest name does not match booking record', async () => {
    store.bookings.set('237', { guestName: 'Jack Torrance' });

    const payload = {
      cabana: { x: 1, y: 2 },
      guest: { room: '237', guestName: 'Danny' }
    };

    await expect(
      ReservationService.reserveCabana(payload, store)
    ).rejects.toThrow('Invalid booking credentials!');
  });

  // Room already reserved
  it('throws if room is already reserved', async () => {
    store.bookings.set('237', { guestName: 'Jack Torrance' });
    store.isRoomAlreadyReserved.mockReturnValue(true);

    const payload = {
      cabana: { x: 1, y: 2 },
      guest: { room: '237', guestName: 'Jack Torrance' }
    };

    await expect(
      ReservationService.reserveCabana(payload, store)
    ).rejects.toThrow('The room had already been reserved by the guest');
  });

  // Cabana does not exist
  it('throws if cabana is not found in store', async () => {
    store.bookings.set('237', { room: '237', guestName: 'Jack Torrance' });
    store.isRoomAlreadyReserved.mockReturnValue(false);

    const payload = {
      cabana: { x: 200, y: 200 },
      guest: { room: '237', guestName: 'Jack Torrance' }
    };

    await expect(
      ReservationService.reserveCabana(payload, store)
    ).rejects.toThrow('Invalid cabana! The chosen cabana is not exists.');
  });

  // Cabana already reserved
  it('throws if cabana.isReserved is true', async () => {
    store.bookings.set('237', { room: '237', guestName: 'Jack Torrance' });
    store.isRoomAlreadyReserved.mockReturnValue(false);
    store.cabanas.set('cabana-1:2', { isReserved: true });

    const payload = {
      cabana: { x: 1, y: 2 },
      guest: { room: '237', guestName: 'Jack Torrance' }
    };

    await expect(
      ReservationService.reserveCabana(payload, store)
    ).rejects.toThrow('The cabana is already reserved. Try to reserve another one');
  });

  // Successful reservation
  it('reserves cabana and returns updated cabana', async () => {
    store.bookings.set('237', { room: '237', guestName: 'Jack Torrance' });
    store.isRoomAlreadyReserved.mockReturnValue(false);
    store.cabanas.set('cabana-1:2', { isReserved: false, x: 1, y: 2 });

    const payload = {
      cabana: { x: 1, y: 2 },
      guest: { room: '237', guestName: 'Jack Torrance' }
    };

    const result = await ReservationService.reserveCabana(payload, store);

    expect(result).toEqual({
      id: 'cabana-1:2',
      x: 1,
      y: 2,
      isReserved: true,
      guestName: 'Jack Torrance'
    });

    expect(store.reserveCabana).toHaveBeenCalledWith(result, '237');
  });
});
