import { assertNonEmptyButtonField } from "@ui/assert/assertNonEmptyButtonField";
import { ACCESSIBILITY } from "@constants/api.constants";
import { ButtonOptions } from "@models/button.types";

export function createButton(options: ButtonOptions): HTMLButtonElement {
  assertNonEmptyButtonField(options.content, 'content');
  assertNonEmptyButtonField(options.ariaLabel, ACCESSIBILITY.ARIA_LABEL);
  assertNonEmptyButtonField(options.title, ACCESSIBILITY.TITLE);

  const button = document.createElement('button');

  button.innerHTML = options.content;

  button.setAttribute(ACCESSIBILITY.ARIA_LABEL, options.ariaLabel);
  button.setAttribute(ACCESSIBILITY.TITLE, options.title);
  button.tabIndex = options.tabIndex ?? 0;

  button.type = options.type ?? 'button';

  if (options.className) {
    button.className = options.className;
  }

  if (options.disabled) {
    button.disabled = options.disabled;
  }

  if (options.onClick) {
    button.addEventListener('click', options?.onClick);
  }

  if (options.dataset) {
    for (const key in options?.dataset) {
      button.dataset[key] = options.dataset[key];
    }
  }

  return button;
}
