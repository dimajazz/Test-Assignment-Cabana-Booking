import { getNotificationContainer } from "@ui/notification/getNotificationContainer";
import { createButton } from "@ui/button/createButton";
import { removeElement } from "@ui/dom/removeElement";
import { ACCESSIBILITY } from "@constants/api.constants";

export function notify(
  message: string,
  isError: boolean,
  duration: number = 5000
): HTMLElement {
  const notification = document.createElement('div');
  notification.className = isError
    ? 'notification notification-error'
    : 'notification';

  // accessibility
  notification.setAttribute(ACCESSIBILITY.ROLE, isError ? 'alert' : 'status');

  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  notification.appendChild(messageElement);

  const closeButton = createButton({
    content: '&times;',
    ariaLabel: 'Close notification',
    title: 'Close notification'
  });
  notification.appendChild(closeButton);

  const notificationContainer = getNotificationContainer();
  notificationContainer.appendChild(notification);

  const timerId = window.setTimeout(() => {
    removeElement(notification);
  }, duration);

  closeButton.addEventListener('click', () => {
    window.clearTimeout(timerId);
    removeElement(notification);
  });

  return notification;
}
