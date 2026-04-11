import { PayloadValidationAppError, ReservationAppError } from '../exceptions/exceptions';
import { Store } from '../store/store';
import { Reservation } from '../types/booking';
import { Cabana, CabanaId } from '../types/map';

export class ReservationService {
  static async reserveCabana(reservation: Reservation, store: Store) {
    const { cabana, guest } = reservation;

    if (
      !cabana ||
      typeof cabana.x !== 'number' ||
      typeof cabana.y !== 'number' ||
      !guest ||
      typeof guest.room !== 'string' ||
      typeof guest.guestName !== 'string'
    ) {
      throw new PayloadValidationAppError('Invalid payload structure');
    }

    if (guest.guestName !== store.bookings.get(guest.room)?.guestName) {
      throw new ReservationAppError('Invalid booking credentials!');
    }

    if (store.isRoomAlreadyReserved(guest.room)) {
      throw new ReservationAppError('The room had already been reserved by the guest');
    }

    const cabanaId: CabanaId = `cabana-${cabana.x}:${cabana.y}`;
    const chosenCabana = store.cabanas.get(cabanaId);

    if (!chosenCabana) {
      throw new ReservationAppError('Invalid cabana! The chosen cabana is not exists.');
    }

    if (chosenCabana?.isReserved) {
      throw new ReservationAppError('The cabana is already reserved. Try to reserve another one');
    }

    const cabanaReservation: Cabana = {
      id: cabanaId,
      x: cabana.x,
      y: cabana.y,
      isReserved: true,
      guestName: guest.guestName
    }

    store.reserveCabana(cabanaReservation, guest.room);

    return cabanaReservation;
  }
}
