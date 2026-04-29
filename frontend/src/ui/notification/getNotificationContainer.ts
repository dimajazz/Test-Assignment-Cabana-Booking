export function getNotificationContainer(): HTMLElement {
  const existingContainer = document.querySelector('.notification-container');

  if (existingContainer instanceof HTMLElement) {
    return existingContainer;
  }

  const container = document.createElement('div');
  container.className = 'notification-container';
  document.body.appendChild(container);

  return container;
}
