import { BookingMap, Guest, ReservationSet } from '../types/booking';
import { Grid, CabanasMap, Cabana } from '../types/map';

export class Store {
  readonly #grid: Grid;
  readonly #bookings: BookingMap;
  readonly #cabanas: CabanasMap;
  readonly #reservedRooms: ReservationSet;

  constructor(grid: Grid, cabanas: CabanasMap, bookings: BookingMap) {
    this.#grid = grid;
    this.#cabanas = cabanas;
    this.#bookings = bookings;
    this.#reservedRooms = new Set();
  }

  get grid(): Grid {
    return structuredClone(this.#grid);
  }

  get bookings(): BookingMap {
    return new Map([...this.#bookings].map(([room, guest]) => [room, structuredClone(guest)]));
  }

  get cabanas(): CabanasMap {
    return new Map([...this.#cabanas].map(([id, cabana]) => [id, structuredClone(cabana)]));
  }

  isRoomAlreadyReserved(room: Guest['room']): boolean {
    return this.#reservedRooms.has(room);
  }

  reserveCabana(cabana: Cabana, room: Guest['room']) {
    this.#cabanas.set(cabana.id, structuredClone(cabana));
    this.#reservedRooms.add(room);
  }
}
