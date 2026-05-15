import { describe, it, expect, beforeEach, vi } from 'vitest';

import { notify } from '@ui/notification/notify';
import { getNotificationContainer } from '@ui/notification/getNotificationContainer';
import { removeElement } from '@ui/dom/removeElement';

vi.mock('@ui/notification/notification.module.css', () => ({
  default: {
    notification: 'notification',
    notificationError: 'notification-error'
  }
}));

vi.mock('@ui/dom/removeElement', () => ({
  removeElement: vi.fn((el: HTMLElement) => {
    el.remove();
  })
}));

vi.mock('@ui/button/createButton', () => ({
  createButton: vi.fn(({ content, ariaLabel, title, className }) => {
    const btn = document.createElement('button');
    btn.innerHTML = content;
    btn.setAttribute('aria-label', ariaLabel);
    btn.title = title;
    btn.className = className;
    return btn;
  })
}));

vi.mock('@ui/notification/notification.module.css', () => ({
  default: {
    notification: 'notification',
    notificationError: 'notification-error',
    notificationContainer: 'notification-container'
  }
}));

describe('notify with container', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it('appends notification into the container, not directly to body', () => {
    const el = notify('hello', false);
    const container = getNotificationContainer();

    expect(container.contains(el)).toBe(true);
    expect(document.body.children).not.toContain(el);
  });

  it('creates container automatically if missing', () => {
    expect(document.querySelector('.notification-container')).toBeNull();

    const el = notify('hello', false);
    const container = getNotificationContainer();

    expect(container.contains(el)).toBe(true);
  });

  it('applies error class when isError is true', () => {
    const el = notify('oops', true);
    expect(el.className).toBe('notification notification-error');
  });

  it('applies normal class when isError is false', () => {
    const el = notify('ok', false);
    expect(el.className).toBe('notification');
  });

  it('multiple notifications stack inside container', () => {
    notify('one', false);
    notify('two', false);

    const container = getNotificationContainer();
    expect(container.children.length).toBe(2);
  });

  it('auto-removal still works inside container', () => {
    const el = notify('bye', false, 3000);
    const container = getNotificationContainer();

    vi.advanceTimersByTime(3000);

    expect(container.contains(el)).toBe(false);
    expect(removeElement).toHaveBeenCalledWith(el);
  });

  it('manual close still removes element from container', () => {
    const el = notify('bye', false, 3000);
    const btn = el.querySelector('button')!;
    const container = getNotificationContainer();

    btn.click();

    expect(container.contains(el)).toBe(false);
    expect(removeElement).toHaveBeenCalledWith(el);
  });

  it('close button contains the correct symbol', () => {
    const el = notify('hello', false);
    const btn = el.querySelector('button');

    expect(btn).not.toBeNull();
    expect(btn?.innerHTML).toBe('×');
  });

  it('sets correct accessibility role for normal notification', () => {
    const el = notify('hello', false);
    expect(el.getAttribute('role')).toBe('status');
  });

  it('sets correct accessibility role for error notification', () => {
    const el = notify('oops', true);
    expect(el.getAttribute('role')).toBe('alert');
  });
});
