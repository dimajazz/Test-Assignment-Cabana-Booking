import { ACCESSIBILITY } from "@constants/api.constants";
import type { ModalHandler } from "@models/modal.types";
import { removeElement } from "@ui/dom/removeElement";
import { createButton } from "@ui/button/createButton";

export function openModal(content: HTMLElement): ModalHandler {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute(ACCESSIBILITY.ROLE, 'dialog');
  modal.setAttribute(ACCESSIBILITY.ARIA_MODAL, 'true');
  modalContainer.appendChild(modal);

  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modal.appendChild(modalHeader);

  const closeButton = createButton({
    content: '&times;',
    ariaLabel: 'Close modal',
    title: 'Close modal'
  });
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.appendChild(content);
  modal.appendChild(modalBody);

  document.body.appendChild(modalContainer);

  // close logic
  let isModalClosed = false;

  const closeModal = () => {
    if (isModalClosed) {
      return;
    }

    isModalClosed = true;

    modalContainer.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onEscape);

    removeElement(modalContainer);
  };

  const onOverlayClick = (event: PointerEvent) => {
    if (!modal.contains(event.target as Node)) {
      closeModal();
    }
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  modalContainer.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onEscape);
  closeButton.addEventListener('click', closeModal);

  return { element: modalContainer, close: closeModal };
}
