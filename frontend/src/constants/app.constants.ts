/* istanbul ignore next */
const funcPlaceholder = () => { };

export const BOOKING_CONTROLLER_INITIAL_STATE = {
  isProcessing: false,
  selectedCabanaId: null,
  modalElement: null,
  modalClose: funcPlaceholder,
  disableMap: funcPlaceholder,
  enableMap: funcPlaceholder
} as const;
