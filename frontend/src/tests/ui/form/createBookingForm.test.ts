import { describe, it, expect, beforeEach, vi } from "vitest";

import { createBookingForm } from "@ui/form/createBookingForm";
import { BookingFormSubmitHandler, BookingFormSubmitPayload } from "@models/reservation.types";

describe('createBookingForm()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('basic structure', () => {
    it('returns object with element and onSubmit', () => {
      const form = createBookingForm();

      expect(form.element).toBeInstanceOf(HTMLFormElement);
      expect(typeof form.onSubmit).toBe('function');
    });

    it('returned form element contains class "booking-form"', () => {
      const form = createBookingForm();

      expect(form.element.classList.contains('booking-form')).toBe(true);
    });

    it('renders title, inputs, labels and button', () => {
      const form = createBookingForm();

      const formTitle = form.element.querySelector('h2');
      const roomInput = form.element.querySelector('input[name="room"]');
      const guestNameInput = form.element.querySelector('input[name="guestName"]');

      const roomInputLabel = form.element.querySelector(`label[for="${roomInput?.id}"]`);
      const guestNameInputLabel = form.element.querySelector(`label[for="${guestNameInput?.id}"]`);

      const submitBtn = form.element.querySelector('button[type="submit"]');

      expect(formTitle?.textContent).toBe('Reserve a cabana');
      expect(roomInput).toBeInstanceOf(HTMLInputElement);
      expect(guestNameInput).toBeInstanceOf(HTMLInputElement);
      expect(roomInputLabel?.textContent).toBe('Room number');
      expect(guestNameInputLabel?.textContent).toBe('Guest name');
      expect(submitBtn?.textContent).toBe('Reserve cabana');
    });

    it('sets correct placeholders on inputs', () => {
      const form = createBookingForm();

      const roomInput = form.element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = form.element.querySelector('input[name="guestName"]') as HTMLInputElement;

      expect(roomInput?.placeholder).toBe('Enter the room number (e.g. 237)');
      expect(guestInput?.placeholder).toBe('Enter guest name (e.g. Jack Torrance)');
    });

    it('sets the same IDs for inputs and their labels, input.id === label.htmlFor', () => {
      const form = createBookingForm();

      const roomInput = form.element.querySelector('input[name="room"]');
      const guestInput = form.element.querySelector('input[name="guestName"]');

      const roomInputLabel = form.element.querySelector(`label[for="${roomInput?.id}"]`) as HTMLLabelElement;
      const guestNameInputLabel = form.element.querySelector(`label[for="${guestInput?.id}"]`) as HTMLLabelElement;

      expect(roomInput?.id === roomInputLabel.htmlFor).toBe(true);
      expect(guestInput?.id === guestNameInputLabel.htmlFor).toBe(true);
    });
  });

  describe('validation behavior', () => {
    it('emits validation error when room is empty', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      guestInput.value = 'Jack Torrance';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        isOk: false,
        error: {
          type: 'validation',
          message: 'Invalid input. All form fields are required',
        }
      })
    });

    it('emits validation error when guestName is empty', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      roomInput.value = '237';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        isOk: false,
        error: {
          type: 'validation',
          message: 'Invalid input. All form fields are required',
        }
      })
    });

    it('emits validation error when both fields are empty', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        isOk: false,
        error: {
          type: 'validation',
          message: 'Invalid input. All form fields are required',
        }
      })
    });

    it('does not throw when submitHandler is not set and validation fails', () => {
      const { element } = createBookingForm();

      // onSubmit() hasn't called here!

      const event = new Event('submit', { bubbles: true, cancelable: true });

      expect(() => {
        element.dispatchEvent(event);
      }).not.toThrow();
    });
  });

  describe('success behavior', () => {
    it('emits success payload when both fields filled', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      roomInput.value = '237';
      guestInput.value = 'Jack Torrance';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        isOk: true,
        payload: { room: '237', guestName: 'Jack Torrance' }
      });
    });

    it('trims values before emitting', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      roomInput.value = '237';
      guestInput.value = '   Jack Torrance    ';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        isOk: true,
        payload: { room: '237', guestName: 'Jack Torrance' }
      });
    });
  });

  describe('handler registration behavior', () => {
    it('does not call handler if onSubmit was never called', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      roomInput.value = '237';
      guestInput.value = '   Jack Torrance    ';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });
    it('replaces handler when onSubmit is called twice', () => {
      const { element, onSubmit } = createBookingForm();

      const handler1 = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      const handler2 = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler1);
      onSubmit(handler2);

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      roomInput.value = '237';
      guestInput.value = 'Jack Torrance';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledWith({
        isOk: true,
        payload: {
          room: '237',
          guestName: 'Jack Torrance'
        }
      })
    });
  });

  describe('submit mechanics', () => {
    it('prevents default browser submit behavior', () => {
      const { element, onSubmit } = createBookingForm();

      const handler = vi.fn<(payload: BookingFormSubmitPayload) => void>();
      onSubmit(handler);

      const roomInput = element.querySelector('input[name="room"]') as HTMLInputElement;
      const guestInput = element.querySelector('input[name="guestName"]') as HTMLInputElement;
      roomInput.value = '237';
      guestInput.value = 'Jack Torrance';

      const event = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });
  });
});
