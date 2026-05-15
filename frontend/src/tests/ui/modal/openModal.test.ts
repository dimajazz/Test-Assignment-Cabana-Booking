import { describe, it, expect, beforeEach, vi } from 'vitest';

import { openModal } from '@ui/modal/openModal';
import { ACCESSIBILITY } from '@constants/api.constants';
import { removeElement } from '@ui/dom/removeElement';

vi.mock('@ui/dom/removeElement', () => ({
  removeElement: vi.fn((el: HTMLElement) => {
    el.remove();
  })
}));

vi.mock('@ui/button/createButton', () => ({
  createButton: vi.fn(({ content, ariaLabel, title }) => {
    const btn = document.createElement('button');
    btn.innerHTML = content;
    btn.setAttribute('aria-label', ariaLabel);
    btn.setAttribute('title', title);
    return btn;
  })
}));

describe('openModal()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id='app-root'></div>
    `;
    document.body.style.overflow = '';
    vi.clearAllMocks();
  });

  it('creates modal container and appends to body', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    expect(document.body.contains(modalHandler.element)).toBe(true);
  });

  it('modal has correct accessibility attributes', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modal = modalHandler.element.querySelector('div > div');

    expect(modal?.getAttribute(ACCESSIBILITY.ROLE)).toBe('dialog');
    expect(modal?.getAttribute(ACCESSIBILITY.ARIA_MODAL)).toBe('true');
  });

  it('modal contains header with close button', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modal = modalHandler.element.querySelector('div > div');
    const header = modal?.firstElementChild;
    const closeBtn = header?.querySelector('button');

    expect(header).toBeInstanceOf(HTMLElement);
    expect(closeBtn).toBeInstanceOf(HTMLButtonElement);
    expect(closeBtn?.innerHTML).toBe('×');
  });

  it('modal body contains provided content', () => {
    const content = document.createElement('p');
    content.textContent = 'Hello';

    const modalHandler = openModal(content);
    const modal = modalHandler.element.querySelector('div > div');
    const modalBody = modal?.querySelector('div:last-child');

    expect(modalBody?.contains(content)).toBe(true);
  });

  it('sets body overflow to hidden when opened', () => {
    const content = document.createElement('div');
    openModal(content);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('applies inert to #app-root', () => {
    const content = document.createElement('div');
    openModal(content);

    const root = document.querySelector('#app-root');
    expect(root?.hasAttribute('inert')).toBe(true);
  });

  it('close button closes modal and restores overflow + inert', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modalContainer = modalHandler.element;
    const closeBtn = modalContainer.querySelector('button')!;

    closeBtn.click();

    expect(removeElement).toHaveBeenCalledWith(modalContainer);
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('#app-root')?.hasAttribute('inert')).toBe(false);
  });

  it('clicking outside modal closes it', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modalContainer = modalHandler.element;

    modalContainer.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(removeElement).toHaveBeenCalledWith(modalContainer);
  });

  it('clicking inside modal does NOT close it', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modalContainer = modalHandler.element;
    const modal = modalContainer.querySelector('div > div')!;

    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(removeElement).not.toHaveBeenCalled();
  });

  it('Escape key closes modal', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modalContainer = modalHandler.element;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(removeElement).toHaveBeenCalledWith(modalContainer);
  });

  it('non-Escape key does NOT close modal', () => {
    const content = document.createElement('div');
    openModal(content);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(removeElement).not.toHaveBeenCalled();
  });

  it('programmatic close removes modal and restores state', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    const modalContainer = modalHandler.element;

    modalHandler.close();

    expect(removeElement).toHaveBeenCalledWith(modalContainer);
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('#app-root')?.hasAttribute('inert')).toBe(false);
  });

  it('calling close() twice does nothing extra', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    modalHandler.close();
    modalHandler.close();

    expect(removeElement).toHaveBeenCalledTimes(1);
  });

  it('returns handler with element + close()', () => {
    const content = document.createElement('div');
    const modalHandler = openModal(content);

    expect(modalHandler.element).toBeInstanceOf(HTMLElement);
    expect(typeof modalHandler.close).toBe('function');
  });
});
