import type { BookingControllerState, DisableFn, EnableFn, Guest, Reservation } from "@models/reservation.types";
import type { CabanaId } from "@models/map.types";
import { BOOKING_CONTROLLER_INITIAL_STATE } from "@constants/app.constants";

import { notify } from "@ui/notification/notify";
import { cabanaStore } from "@app/store/cabanaStore";
import { reserveCabana } from "@api/reserveCabana";
import { ModalHandler } from "@models/modal.types";

let _state: BookingControllerState = { ...BOOKING_CONTROLLER_INITIAL_STATE };

export const bookingController = {
  get selectedCabanaId() {
    return _state.selectedCabanaId;
  },

  get isProcessing() {
    return _state.isProcessing;
  },

  reset() {
    const { disableMap, enableMap } = _state;

    _state = { ...BOOKING_CONTROLLER_INITIAL_STATE };

    // restore registered callbacks
    this.registerMapControls(disableMap, enableMap);
  },

  registerMapControls(disableMap: DisableFn, enableMap: EnableFn): void {
    _state.disableMap = disableMap;
    _state.enableMap = enableMap;
  },

  initBooking(cabanaId: CabanaId, modal: ModalHandler): void {
    _state.selectedCabanaId = cabanaId;
    _state.modalElement = modal.element;
    _state.modalClose = modal.close;
  },

  async handleFormSubmit(payload: Guest): Promise<void> {
    const cabanaId = _state.selectedCabanaId;
    if (!cabanaId) {
      notify('No cabana selected!', true);
      return;
    }

    const cabana = cabanaStore.getCabanaById(cabanaId);
    if (!cabana) {
      notify('Cabana not found!', true);
      return;
    }

    const reservation: Reservation = {
      cabana: { x: cabana.x, y: cabana.y },
      guest: payload
    };

    _state.isProcessing = true;
    _state.disableMap();

    if (_state.modalElement) {
      _state.modalClose();
    }
    notify('Sending reservation request...', false, 2500);

    try {
      const response = await reserveCabana(reservation);
      cabanaStore.updateCabana(response.reservation);
      notify(response.message, false);
    }
    catch (error: any) {
      const message = error?.message || 'Reservation failed!';
      notify(message, true);
    }
    finally {
      _state.enableMap();
      this.reset();
    }
  }
};
