import { CabanaCoordinates } from "@models/map.types";

export type Guest = {
  room: string;
  guestName: string;
};

export type Reservation = {
  cabana: CabanaCoordinates;
  guest: Guest;
};

export type ReservationResponse = {
  message: string;
  reservation: Reservation;
};
