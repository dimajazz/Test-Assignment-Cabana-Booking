import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from 'vitest';

import { createMapTile } from "@ui/mapTile/createMapTile";
import { createTileSvg } from "@ui/mapTile/createTileSvg";
import { MAP_ASSETS } from "@constants/api.constants";
import type { TileAsset } from "@models/map.types";

vi.mock('@ui/mapTile/createTileSvg.ts', () => ({
  createTileSvg: vi.fn()
}));

const mockedCreateTileSvg = vi.mocked(createTileSvg);

describe('createMapTile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  });

  describe('wrapper element behavior', () => {
    it('always returns a div with class "tile"', () => {
      const tileAsset: TileAsset = { asset: MAP_ASSETS.POOL };

      const result = createMapTile(tileAsset, 0, 0);

      expect(result.tagName).toBe('DIV');
      expect(result.classList.contains('tile')).toBe(true);
    });

    it('returns wrapper without SVG for EMPTY_SPACE', () => {
      const tileAsset: TileAsset = { asset: MAP_ASSETS.EMPTY_SPACE };

      mockedCreateTileSvg.mockReturnValue(null);

      const result = createMapTile(tileAsset, 0, 0);

      expect(result.children.length).toBe(0);
    });
  });

  describe('non-empty tiles', () => {
    it('inserts SVG returned by createTileSvg', () => {
      const mockSvg = document.createElementNS('http://www.w3.org/1999/xhtml', 'svg');

      (createTileSvg as Mock).mockReturnValue(mockSvg);

      const tileAsset: TileAsset = { asset: MAP_ASSETS.ROAD_VERTICAL };

      const result = createMapTile(tileAsset, 0, 0);

      expect(result.firstChild).toBe(mockSvg);
    });

    it('if createTileSvg returns null, wrapper still returned without children', () => {
      mockedCreateTileSvg.mockReturnValue(null);

      const tileAsset: TileAsset = { asset: MAP_ASSETS.ROAD_VERTICAL };

      const result = createMapTile(tileAsset, 0, 0);

      expect(result.tagName).toBe('DIV');
      expect(result.children.length).toBe(0);
    });

    describe('cabana tiles', () => {
      const tileAsset: TileAsset = { asset: MAP_ASSETS.CABANA };
      const x = 3;
      const y = 5;
      const cabanaId = `cabana-${x}:${y}`;

      it('adds data-type="cabana" and data-id="cabana-x:y"', () => {
        mockedCreateTileSvg.mockReturnValue(null);

        const result = createMapTile(tileAsset, x, y);

        expect(result.dataset.type).toBe('cabana');
        expect(result.dataset.id).toBe(cabanaId);
      });

      it('does not add "available" class when isAvailable=false', () => {
        mockedCreateTileSvg.mockReturnValue(null);

        const result = createMapTile(tileAsset, x, y, false);

        expect(result.classList.contains('available')).toBe(false);
      });

      it('adds "available" class when isAvailable=true by default', () => {
        mockedCreateTileSvg.mockReturnValue(null);

        const result = createMapTile(tileAsset, x, y);

        expect(result.classList.contains('available')).toBe(true);
      });

      it('does not add "available" class when TileAsset is not a Cabana', () => {
        mockedCreateTileSvg.mockReturnValue(null);

        const notCabanaAsset: TileAsset = { asset: MAP_ASSETS.POOL };

        const result = createMapTile(notCabanaAsset, x, y);

        expect(result.classList.contains('available')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('x and y are NOT used for DOM positioning', () => {
        mockedCreateTileSvg.mockReturnValue(null);

        const tileAsset: TileAsset = { asset: MAP_ASSETS.CABANA };

        const result = createMapTile(tileAsset, 10, 20);

        expect(result.style.left).toBe('');
        expect(result.style.top).toBe('');
      });
    });
  });
});
