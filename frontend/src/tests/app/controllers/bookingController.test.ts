import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { bookingController } from "@app/controllers/bookingController";
import { cabanaStore } from "@app/store/cabanaStore";
import { notify } from "@ui/notification/notify";
import { reserveCabana } from "@api/reserveCabana";
import { removeElement } from "@ui/dom/removeElement";
import { createCoordId } from "@features/map/createCoordId";

vi.mock('@app/store/cabanaStore');
vi.mock('@ui/notification/notify');
vi.mock('@api/reserveCabana');
vi.mock('@ui/dom/removeElement');

describe('bookingController', () => {
  let disableMap: () => void;
  let enableMap: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    disableMap = vi.fn();
    enableMap = vi.fn();
    bookingController.reset();
    bookingController.registerMapControls(disableMap, enableMap);
  });

  describe('initBooking', () => {
    it('stores cabanaId and modalElement', () => {
      const modal = document.createElement('div');
      const cabanaId = createCoordId('cabana', 2, 3);

      bookingController.initBooking(cabanaId, modal);

      expect(bookingController.selectedCabanaId).toBe(cabanaId);
    });
  });

  describe('reset', () => {
    it('resets selectedCabanaId to null', () => {
      const modal = document.createElement('div');
      const cabanaId = createCoordId('cabana', 2, 3);

      bookingController.initBooking(cabanaId, modal);

      bookingController.reset();

      expect(bookingController.selectedCabanaId).toBeNull();
    });

    it('resets modalElement to null', async () => {
      const modal = document.createElement('div');
      const cabanaId = createCoordId('cabana', 2, 3);

      bookingController.initBooking(cabanaId, modal);

      bookingController.reset();

      await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

      expect(removeElement).not.toHaveBeenCalled();
    });

    it('resets isProcessing to false', () => {
      // Simulate internal state change
      (bookingController as any)._state = {
        ...(bookingController as any)._state,
        isProcessing: true
      };

      bookingController.reset();

      expect(bookingController.isProcessing).toBeFalsy();
    });

    it('does not remove modal element when modalElement is null', async () => {
      (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

      // No initBooking() call -> modalElement stays null

      (reserveCabana as Mock).mockResolvedValue({
        message: 'OK',
        reservation: {
          cabana: { x: 1, y: 2 },
          guest: { room: '237', guestName: 'Jack Torrance' }
        }
      });

      await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

      expect(removeElement).not.toHaveBeenCalled();
    });

    it('resets disableMap and enableMap to no-op functions', async () => {
      const disableMock = vi.fn();
      const enableMock = vi.fn();

      bookingController.registerMapControls(disableMock, enableMock);

      bookingController.reset();

      // Trigger a flow that would normally call disableMap
      await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

      expect(disableMock).not.toHaveBeenCalled();
      expect(enableMock).not.toHaveBeenCalled();
    });

    it('reset does not throw when state was never initialized', () => {
      expect(() => bookingController.reset()).not.toThrow();
    });
  });

  describe('handleFormSubmit', () => {
    describe('Successfull request', () => {
      it('notifies error when no cabana selected', async () => {
        await bookingController.handleFormSubmit({ room: '000', guestName: 'Jack Torrance' });

        expect(notify).toHaveBeenCalledWith('No cabana selected!', true);
        expect(reserveCabana).not.toHaveBeenCalled();
      });

      it('notifies error when cabana not found', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);
        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue(null);

        await bookingController.handleFormSubmit({ room: '404', guestName: 'Jack Torrance' });

        expect(notify).toHaveBeenCalledWith('Cabana not found!', true);
        expect(reserveCabana).not.toHaveBeenCalled();
      });

      it('disables map, notifies error, does not update store, enables map, closes modal', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);
        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        const guest = { room: '237', guestName: 'Jack Torrance' };

        (reserveCabana as Mock).mockRejectedValue(new Error('fail'));

        await bookingController.handleFormSubmit(guest);

        expect(disableMap).toHaveBeenCalled();
        expect(removeElement).toHaveBeenCalledWith(modal);
        expect(notify).toHaveBeenCalledWith('fail', true);
        expect(cabanaStore.updateCabana).not.toHaveBeenCalled();
        expect(enableMap).toHaveBeenCalled();
      });

      it('notifies default error message when error has no message', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        // Error without message
        (reserveCabana as Mock).mockRejectedValue({});

        await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

        expect(notify).toHaveBeenCalledWith('Reservation failed!', true);
      });
    });

    describe('Successfull request', () => {
      it('removes modal element before sending request', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });
        (reserveCabana as Mock).mockResolvedValue({
          message: 'OK',
          reservation: {
            cabana: { x: 1, y: 2 },
            guest: { room: '237', guestName: 'Jack Torrance' }
          }
        });

        await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

        expect(removeElement).toHaveBeenCalledWith(modal);
      });

      it('notifies that reservation request is being sent', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });
        (reserveCabana as Mock).mockResolvedValue({
          message: 'OK',
          reservation: {
            cabana: { x: 1, y: 2 },
            guest: { room: '237', guestName: 'Jack Torrance' }
          }
        });

        await bookingController.handleFormSubmit({ room: '237', guestName: 'Jack Torrance' });

        expect(notify).toHaveBeenCalledWith('Sending reservation request...', false);
      });

      it('disables map, calls API, updates store, enables map, closes modal', async () => {
        const modal = document.createElement('div');
        const cabanaId = createCoordId('cabana', 2, 3);
        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        const guest = { room: '237', guestName: 'Jack Torrance' };
        const reservation = {
          cabana: { x: 1, y: 2 },
          guest
        };

        (reserveCabana as Mock).mockResolvedValue({
          message: 'OK',
          reservation
        });

        await bookingController.handleFormSubmit(guest);

        expect(disableMap).toHaveBeenCalled();
        expect(removeElement).toHaveBeenCalledWith(modal);
        expect(reserveCabana).toHaveBeenCalled();
        expect(reserveCabana).toHaveBeenCalledWith(reservation);
        expect(cabanaStore.updateCabana).toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith('OK', false);
        expect(enableMap).toHaveBeenCalled();
        expect(bookingController.selectedCabanaId).toBeNull();
      });

      it('handles success when modalElement is null', async () => {
        const cabanaId = createCoordId('cabana', 2, 3);
        bookingController.initBooking(cabanaId, null);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        const guest = { room: '237', guestName: 'Jack Torrance' };
        const reservation = {
          cabana: { x: 1, y: 2 },
          guest
        };

        (reserveCabana as Mock).mockResolvedValue({
          message: 'OK',
          reservation
        });

        await bookingController.handleFormSubmit(guest);

        expect(removeElement).not.toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith('OK', false);
        expect(cabanaStore.updateCabana).toHaveBeenCalled();
      });
    });
  });
});
