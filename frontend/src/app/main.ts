import { mapPage } from "@ui/pages/mapPage";

function appInit(): void {
  try {
    const root: HTMLElement | null = document.querySelector('#app-root')

    if (!root) {
      throw new Error('[!] Root element #app-root not found!')
    }

    mapPage.init(root);
  }
  catch (error) {
    console.error(error);
  }
}

export function main(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      appInit();
    });
  }
  else {
    appInit();
  }
}
