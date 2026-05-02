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

export type BookingFormSubmitHandler = (payload: BookingFormSubmitPayload) => void;

export type BookingForm = {
  element: HTMLElement;
  onSubmit: (
    handler: BookingFormSubmitHandler
  ) => void;
};

export type BookingFormSubmitPayload =
  | { isOk: true; payload: Guest }
  | { isOk: false; error: FormValidationError };

export type FormValidationError = {
  type: 'validation';
  message: string;
};
