import styles from '@ui/notification/notification.module.css';

export function getNotificationContainer(): HTMLElement {
  const existingContainer = document.querySelector(`.${styles.notificationContainer}`);

  if (existingContainer instanceof HTMLElement) {
    return existingContainer;
  }

  const container = document.createElement('div');
  container.className = styles.notificationContainer;
  document.body.appendChild(container);

  return container;
}
