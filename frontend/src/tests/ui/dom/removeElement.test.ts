import { describe, it, expect, beforeEach } from 'vitest';
import { removeElement } from '@ui/dom/removeElement';

describe('removeElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('removes element from its parent element', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');

    parent.appendChild(el);
    document.body.appendChild(parent);

    const result = removeElement(el);

    expect(result).toBe(true);
    expect(parent.contains(el)).toBe(false);
  });

  it('returns false when element is not in the DOM', () => {
    const el = document.createElement('div');

    const result = removeElement(el);

    expect(result).toBe(false);
  });

  it('returns false when element is null or undefined', () => {
    expect(removeElement(null as any)).toBe(false);
    expect(removeElement(undefined as any)).toBe(false);
  });

  it('returns false when element is not an HTMLElement', () => {
    expect(removeElement({} as any)).toBe(false);
  });

  it('removes element even if parent is not document.body', () => {
    const wrapper = document.createElement('section');
    const el = document.createElement('div');

    wrapper.appendChild(el);
    document.body.appendChild(wrapper);

    const result = removeElement(el);

    expect(result).toBe(true);
    expect(wrapper.contains(el)).toBe(false);
  });
});
