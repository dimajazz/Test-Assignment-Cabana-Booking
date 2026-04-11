import { loadGuests } from "../utils/loadFiles";
import { parseAsciiMap } from "../utils/parseMap";
import { Store } from "./store";
import { BookingMap } from "../types/booking";

export function createStore() {
  const { grid, cabanas } = parseAsciiMap();
  const guests = loadGuests();
  const bookings: BookingMap = new Map(guests.map(guest => [guest.room, guest]));
  return new Store(grid, cabanas, bookings);
}
