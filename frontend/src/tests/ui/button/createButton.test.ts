import { describe, it, expect, beforeEach, vi } from "vitest";

import { createButton } from "@ui/button/createButton";
import { ACCESSIBILITY } from "@constants/api.constants";

describe('createButton()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a button element', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn).toBeInstanceOf(HTMLButtonElement);
  });

  it('sets textContent from content', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.textContent).toBe('Click');
  });

  it('applies className when provided', () => {
    const btn = createButton({
      content: 'Click',
      className: 'default-btn',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.classList.contains('default-btn')).toBe(true);
  });

  it('sets default type to button', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.type).toBe('button');
  });

  it('sets provided type', () => {
    const btn = createButton({
      content: 'Click',
      type: 'submit',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.type).toBe('submit');
  });

  it('sets disabled attribute when provided', () => {
    const btn = createButton({
      content: 'Click',
      disabled: true,
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.disabled).toBe(true);
  });

  it('sets aria-label and title', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.getAttribute(ACCESSIBILITY.ARIA_LABEL)).toBe('label');
    expect(btn.getAttribute(ACCESSIBILITY.TITLE)).toBe('title');
  });

  it('sets default tabIndex to 0', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title'
    });

    expect(btn.tabIndex).toBe(0);
  });

  it('applies provided tabIndex', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title',
      tabIndex: 5
    });

    expect(btn.tabIndex).toBe(5);
  });

  it('attaches onClick handler when provided', () => {
    const handler = vi.fn();

    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title',
      onClick: handler
    });

    const event = new PointerEvent('click', { bubbles: true });
    btn.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('applies dataset attributes when provided', () => {
    const btn = createButton({
      content: 'Click',
      ariaLabel: 'label',
      title: 'title',
      dataset: {
        id: '237',
        role: 'test'
      }
    });

    expect(btn.dataset?.id).toBe('237');
    expect(btn.dataset?.role).toBe('test');
  });

  it('throws when content is empty', () => {
    expect(() => {
      createButton({
        content: '',
        ariaLabel: 'label',
        title: 'title'
      });
    }).toThrow('Button content cannot be empty');

    expect(() => {
      createButton({
        content: '   ',
        ariaLabel: 'label',
        title: 'title'
      });
    }).toThrow('Button content cannot be empty');
  });

  it('throws when ariaLabel is empty', () => {
    expect(() => {
      createButton({
        content: 'Hello',
        ariaLabel: '',
        title: 'title'
      });
    }).toThrow('Button aria-label cannot be empty');

    expect(() => {
      createButton({
        content: 'Hello',
        ariaLabel: '   ',
        title: 'title'
      });
    }).toThrow('Button aria-label cannot be empty');
  });

  it('throws when title is empty', () => {
    expect(() => {
      createButton({
        content: 'Hello',
        ariaLabel: 'label',
        title: ''
      });
    }).toThrow('Button title cannot be empty');

    expect(() => {
      createButton({
        content: 'Hello',
        ariaLabel: 'label',
        title: '   '
      });
    }).toThrow('Button title cannot be empty');
  });
});
