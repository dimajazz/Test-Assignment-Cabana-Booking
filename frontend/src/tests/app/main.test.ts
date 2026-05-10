import { describe, it, expect, beforeEach, vi } from "vitest";

import { main } from "@app/main";
import { mapPage } from "@ui/pages/mapPage";

vi.mock('@ui/pages/mapPage', () => ({
  mapPage: {
    init: vi.fn()
  }
}));

describe('main', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app-root"></div>';
    vi.clearAllMocks();
  });

  describe('root selection', () => {
    it('initializes mapPage with existing root', () => {
      main();

      const root = document.querySelector('#app-root');
      expect(mapPage.init).toHaveBeenCalledWith(root);
    });

    it('logs error if root is missing', () => {
      document.body.innerHTML = '';

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      main();

      expect(errorSpy).toHaveBeenCalled();

      const logged = errorSpy.mock.calls[0][0];
      expect(logged).toBeInstanceOf(Error);
      expect(logged.message).toBe('[!] Root element #app-root not found!');
    });
  });

  describe('DOMContentLoaded behavior', () => {
    it('waits for DOMContentLoaded when document is loading', () => {
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
        configurable: true
      });

      main();

      expect(mapPage.init).not.toHaveBeenCalled();

      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect(mapPage.init).toHaveBeenCalledTimes(1);
    });

    it('initializes immediately when DOM is already ready', () => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        configurable: true
      });

      main();

      expect(mapPage.init).toHaveBeenCalledTimes(1);
    });
  });
});
