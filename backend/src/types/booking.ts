import { CabanaCoordinates } from './map';

export type Guest = {
  room: string;
  guestName: string;
};

export type Reservation = {
  cabana: CabanaCoordinates;
  guest: Guest;
};

export type BookingMap = Map<Guest['room'], Guest>
export type ReservationSet = Set<Guest['room']>;
