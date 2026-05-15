import { describe, it, expect, beforeEach, vi } from 'vitest';

import { loadSvgSprite } from '@ui/sprite/loadSvgSprite';

describe('loadSvgSprite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful load', () => {
    it('returns SVG text when fetch resolves with ok=true', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<svg></svg>'),
      }) as any;

      const result = await loadSvgSprite('/sprite.svg');

      expect(result).toBe('<svg></svg>');
    });
  });

  describe('failed load (non-ok)', () => {
    it('logs error and returns empty string', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as any;

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await loadSvgSprite('/missing.svg');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe('');
    });
  });

  describe('fetch throws', () => {
    it('logs error and returns empty string', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('network'));

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await loadSvgSprite('/sprite.svg');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe('');
    });
  });
});
