import { describe, it, expect, beforeEach, vi } from 'vitest';

import { injectSpriteOnce } from '@ui/sprite/injectSpriteOnce';
import { loadSvgSprite } from '@ui/sprite/loadSvgSprite';

vi.mock('@ui/sprite/loadSvgSprite', () => ({
  loadSvgSprite: vi.fn()
}));

const mockedLoadSvgSprite = vi.mocked(loadSvgSprite);

describe('injectSpriteOnce', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('successful injection', () => {
    it('injects a valid parsed SVG into the DOM', async () => {
      mockedLoadSvgSprite.mockResolvedValue(
        '<svg xmlns="http://www.w3.org/2000/svg"><symbol id="x"></symbol></svg>'
      );

      await injectSpriteOnce('/sprite.svg');

      const container = document.body.querySelector('[data-sprite="true"]');
      expect(container).not.toBeNull();

      const svg = container?.querySelector('svg');
      expect(svg).not.toBeNull();
    });
  });

  describe('double injection prevention', () => {
    it('injects only once even if called multiple times', async () => {
      mockedLoadSvgSprite.mockResolvedValue(
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
      );

      await injectSpriteOnce('/sprite.svg');
      await injectSpriteOnce('/sprite.svg');

      const containers = document.body.querySelectorAll('[data-sprite="true"]');
      expect(containers.length).toBe(1);
    });
  });

  describe('empty svgText', () => {
    it('logs error and injects nothing', async () => {
      mockedLoadSvgSprite.mockResolvedValue('');

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      await injectSpriteOnce('/sprite.svg');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('[data-sprite="true"]')).toBeNull();
    });
  });

  describe('invalid XML', () => {
    it('logs error and injects nothing', async () => {
      mockedLoadSvgSprite.mockResolvedValue('<svg><invalid');

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      await injectSpriteOnce('/sprite.svg');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('[data-sprite="true"]')).toBeNull();
    });
  });

  describe('non-svg root', () => {
    it('logs error and injects nothing', async () => {
      mockedLoadSvgSprite.mockResolvedValue('<html></html>');

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      await injectSpriteOnce('/sprite.svg');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('[data-sprite="true"]')).toBeNull();
    });
  });
});

