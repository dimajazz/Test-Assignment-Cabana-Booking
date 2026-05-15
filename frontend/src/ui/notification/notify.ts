import { getNotificationContainer } from "@ui/notification/getNotificationContainer";
import { createButton } from "@ui/button/createButton";
import { removeElement } from "@ui/dom/removeElement";
import { ACCESSIBILITY } from "@constants/api.constants";
import styles from '@ui/notification/notification.module.css';

export function notify(
  message: string,
  isError: boolean,
  duration: number = 5000
): HTMLElement {
  const notification = document.createElement('div');
  notification.className = isError
    ? `${styles.notification} ${styles.notificationError}`
    : styles.notification;

  // accessibility
  notification.setAttribute(ACCESSIBILITY.ROLE, isError ? 'alert' : 'status');

  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  notification.appendChild(messageElement);

  const closeButton = createButton({
    content: '&times;',
    ariaLabel: 'Close notification',
    title: 'Close notification',
    className: 'close-button'
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
