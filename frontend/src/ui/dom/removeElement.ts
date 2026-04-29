export function removeElement(elem: HTMLElement | null | undefined): boolean {
  if (!elem || !(elem instanceof HTMLElement)) {
    return false;
  }

  const parentElem = elem.parentElement;

  if (!parentElem) {
    return false;
  }

  parentElem.removeChild(elem);
  return true;
}
