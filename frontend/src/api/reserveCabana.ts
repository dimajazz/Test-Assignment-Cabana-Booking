import { http } from "./http";
import type { Reservation, ReservationResponse } from "@models/reservation.types";

export async function reserveCabana(payload: Reservation): Promise<ReservationResponse> {
  return http<ReservationResponse>('/api/reserve', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
