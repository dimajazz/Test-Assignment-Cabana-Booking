import { describe, it, expect, beforeEach } from "vitest";

import { openModal } from "@ui/modal/openModal";
import { ACCESSIBILITY } from "@constants/api.constants";

describe('openModal()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates modal-container and appends to body', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const container = modalHandler.element;

    expect(container).toBeInstanceOf(HTMLElement);
    expect(container.classList.contains('modal-container')).toBe(true);
    expect(document.body.contains(container)).toBe(true);
  });

  it('modal contains .modal element with correct attributes', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const container = modalHandler.element;
    const modal = container.querySelector('.modal');

    expect(modal).toBeInstanceOf(HTMLElement);
    expect(modal?.getAttribute(ACCESSIBILITY.ROLE)).toBe('dialog');
    expect(modal?.getAttribute(ACCESSIBILITY.ARIA_MODAL)).toBe('true');
  });

  it('modal contains .modal-head with close button', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const container = modalHandler.element;
    const modalHeader = container.querySelector('.modal-header');
    const closeBtn = modalHeader?.querySelector('button');

    expect(modalHeader).toBeInstanceOf(HTMLElement);
    expect(closeBtn).toBeInstanceOf(HTMLButtonElement);
  });

  it('close button contains correct attributes', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const container = modalHandler.element;
    const modalHeader = container.querySelector('.modal-header');
    const closeBtn = modalHeader?.querySelector('button');

    expect(closeBtn).toBeInstanceOf(HTMLButtonElement);
    expect(closeBtn?.textContent).toBe('×');
    expect(closeBtn?.getAttribute(ACCESSIBILITY.ARIA_LABEL)).toBe('Close modal');
    expect(closeBtn?.getAttribute(ACCESSIBILITY.TITLE)).toBe('Close modal');
    expect(closeBtn?.getAttribute(ACCESSIBILITY.TABINDEX)).toBe('0');
  });

  it('modal-body contains provided content element', () => {
    const content = document.createElement('p');
    content.textContent = 'Welcome';

    const modalHandler = openModal(content);
    const container = modalHandler.element;

    const modalBody = container.querySelector('.modal-body');

    expect(modalBody).toBeInstanceOf(HTMLElement);
    expect(modalBody?.contains(content)).toBe(true);
  });

  it('close button removes modal-container from DOM', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    const closeBtn = modalContainer.querySelector('button');
    closeBtn?.click();

    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('click outside modal closes modal', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    // simulate click on overlay (container)
    const event = new MouseEvent('click', { bubbles: true });
    modalContainer.dispatchEvent(event);

    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('click inside modal does NOT close modal', () => {
    const content = document.createElement('p');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;
    const modal = modalContainer.querySelector('.modal');
    const modalHeader = modal?.querySelector('.modal-header');
    const modalBody = modal?.querySelector('.modal-body');
    const modalContent = modalBody?.querySelector('p');

    const event = new MouseEvent('click', { bubbles: true });
    modal?.dispatchEvent(event);
    modalHeader?.dispatchEvent(event);
    modalBody?.dispatchEvent(event);
    modalContent?.dispatchEvent(event);

    expect(document.body.contains(modalContainer)).toBe(true);
  });

  it('Escape key closes modal', () => {
    const content = document.createElement('p');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);

    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('Escape key listener removed after close', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    // close programmatically
    modalHandler.close();

    // dispatch Escape again
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);

    // still closed, no errors
    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('programmatic close removes modal-container', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    modalHandler.close();

    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('close() calling twice does nothing', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    modalHandler.close();
    modalHandler.close();

    expect(document.body.contains(modalContainer)).toBe(false);
  });

  it('openModal returns a handle with close() and element', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    expect(typeof modalHandler.close).toBe('function');
    expect(modalHandler.element).toBeInstanceOf(HTMLElement);
  });

  it('non-Escape key does not close modal', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);
    const modalContainer = modalHandler.element;

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    document.dispatchEvent(event);

    expect(document.body.contains(modalContainer)).toBe(true);
  });
});
