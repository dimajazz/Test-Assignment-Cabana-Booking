import {
  BookingForm,
  BookingFormSubmitPayload,
  BookingFormSubmitHandler,
  Guest
} from "@models/reservation.types";
import { createButton } from "@ui/button/createButton";
import styles from '@ui/form/form.module.css';

export function createBookingForm(): BookingForm {
  const form = document.createElement('form');
  form.className = styles.bookingForm;

  const formTitle = document.createElement('h2');
  formTitle.textContent = 'Reserve a cabana';

  const uniqueId = crypto.randomUUID();
  const roomInput = document.createElement('input');
  roomInput.id = `booking-room-${uniqueId}`;
  roomInput.name = 'room';
  roomInput.type = 'number';
  roomInput.placeholder = 'Enter the room number (e.g. 237)';
  roomInput.setAttribute('required', '');
  const roomInputLabel = document.createElement('label');
  roomInputLabel.htmlFor = roomInput.id;
  roomInputLabel.textContent = 'Room number';

  const guestNameInput = document.createElement('input');
  guestNameInput.id = `booking-guest-${uniqueId}`;
  guestNameInput.name = 'guestName';
  guestNameInput.type = 'text';
  guestNameInput.placeholder = 'Enter guest name (e.g. Jack Torrance)';
  guestNameInput.setAttribute('required', '');
  const guestNameInputLabel = document.createElement('label');
  guestNameInputLabel.htmlFor = guestNameInput.id;
  guestNameInputLabel.textContent = 'Guest name';

  const submitButton = createButton({
    content: 'Reserve cabana',
    ariaLabel: 'Reserve cabana button',
    title: 'Reserve cabana button',
    type: 'submit',
    className: styles.bookingFormButton
  });

  form.append(
    formTitle,
    roomInputLabel,
    roomInput,
    guestNameInputLabel,
    guestNameInput,
    submitButton
  );

  let submitHandler: BookingFormSubmitHandler | null = null;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const room = roomInput.value.trim();
    const guestName = guestNameInput.value.trim();

    if (!room || !guestName) {
      if (submitHandler) {
        submitHandler({
          isOk: false,
          error: {
            type: 'validation',
            message: 'Invalid input. All form fields are required'
          }
        })
      }
      return;
    }

    const payload: Guest = { room, guestName };

    if (submitHandler) {
      submitHandler({
        isOk: true,
        payload
      })
    }
  });

  return {
    element: form,
    onSubmit(handler: (payload: BookingFormSubmitPayload) => void) {
      submitHandler = handler;
    }
  };
}
