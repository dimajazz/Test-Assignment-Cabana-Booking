import { Store } from '../../src/store/store';
import { Cabana, CabanaId, CabanasMap, Grid } from '../../src/types/map';
import { BookingMap } from '../../src/types/booking';

describe('Store', () => {
  let grid: Grid;
  let cabanas: CabanasMap;
  let bookings: BookingMap;

  beforeEach(() => {
    grid = [
      ['A', 'B'],
      ['C', 'D']
    ];

    cabanas = new Map<CabanaId, Cabana>([
      ['cabana-0:0', { id: 'cabana-0:0', x: 0, y: 0, isReserved: false, guestName: null }],
      ['cabana-1:1', { id: 'cabana-1:1', x: 1, y: 1, isReserved: false, guestName: null }]
    ]);

    bookings = new Map([
      ['237', { room: '237', guestName: 'Jack Torrance' }],
      ['102', { room: '102', guestName: 'Danny' }]
    ]);
  });

  describe('constructor', () => {
    it('initializes with provided data', () => {
      const store = new Store(grid, cabanas, bookings);

      expect(store.grid).toEqual(grid);
      expect(store.bookings.size).toBe(2);
      expect(store.cabanas.size).toBe(2);
      expect(store.isRoomAlreadyReserved('237')).toBe(false);
    });
  });

  describe('grid getter', () => {
    it('returns a clone, not the original', () => {
      const store = new Store(grid, cabanas, bookings);
      const returned = store.grid;

      returned[0][0] = 'X';

      expect(store.grid[0][0]).toBe('A');
    });
  });

  describe('bookings getter', () => {
    it('returns a shallow copy of the map', () => {
      const store = new Store(grid, cabanas, bookings);
      const returned = store.bookings;

      returned.set('999', { room: '999', guestName: 'Fake' });

      expect(store.bookings.has('999')).toBe(false);
    });
  });

  describe('cabanas getter', () => {
    it('returns a shallow copy of the map', () => {
      const store = new Store(grid, cabanas, bookings);
      const returned = store.cabanas;

      returned.delete('cabana-0:0');

      expect(store.cabanas.has('cabana-0:0')).toBe(true);
    });
  });

  describe('isRoomAlreadyReserved', () => {
    it('returns false for new rooms', () => {
      const store = new Store(grid, cabanas, bookings);
      expect(store.isRoomAlreadyReserved('237')).toBe(false);
    });

    it('returns true after reservation', () => {
      const store = new Store(grid, cabanas, bookings);
      const cabana = cabanas.get('cabana-0:0')!;

      store.reserveCabana(cabana, '237');

      expect(store.isRoomAlreadyReserved('237')).toBe(true);
    });
  });

  describe('reserveCabana', () => {
    it('stores cabana and marks room reserved', () => {
      const store = new Store(grid, cabanas, bookings);
      const cabana: Cabana = { id: 'cabana-0:0', x: 0, y: 0, isReserved: true, guestName: 'Jack Torrance' };

      store.reserveCabana(cabana, '237');

      expect(store.cabanas.get('cabana-0:0')).toEqual(cabana);
      expect(store.isRoomAlreadyReserved('237')).toBe(true);
    });

    it('allows reserving the same room twice (store is dumb. it manages CRUD operation only)', () => {
      const store = new Store(grid, cabanas, bookings);
      const cabana = cabanas.get('cabana-0:0')!;

      store.reserveCabana(cabana, '237');
      store.reserveCabana(cabana, '237');

      expect(store.isRoomAlreadyReserved('237')).toBe(true);
    });
  });
});
