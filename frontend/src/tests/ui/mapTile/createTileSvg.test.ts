import { describe, it, expect, beforeEach } from 'vitest';

import { createTileSvg } from '@ui/mapTile/createTileSvg';
import { MAP_ASSETS } from '@constants/api.constants';
import type { TileAsset } from '@models/map.types';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSymbol(id: string) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const tileSymbol = document.createElementNS(SVG_NS, 'symbol');
  tileSymbol.setAttribute('id', id);
  svg.appendChild(tileSymbol);
  document.body.appendChild(svg);
}

describe('createTileSvg()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns null for EMPTY_SPACE asset', () => {
    const tile: TileAsset = {
      asset: MAP_ASSETS.EMPTY_SPACE,
    };

    const result = createTileSvg(tile);

    expect(result).toBeNull();
  });

  it('returns null if symbol with given asset id does not exist', () => {
    const tile: TileAsset = {
      asset: MAP_ASSETS.ROAD_VERTICAL,
      rotation: 0
    };

    const result = createTileSvg(tile);

    expect(result).toBeNull();
  });

  it('creates an SVG with <use> referencing the symbol id when symbol exists', () => {
    createSymbol(MAP_ASSETS.ROAD_VERTICAL);

    const tile: TileAsset = {
      asset: MAP_ASSETS.ROAD_VERTICAL,
    };

    const svg = createTileSvg(tile);

    expect(svg).not.toBeNull();
    expect(svg?.namespaceURI).toBe(SVG_NS);

    const use = svg?.querySelector('use');
    expect(use).not.toBeNull();

    const href = use?.getAttribute('href') || use?.getAttribute('xlink:href');
    expect(href).toBe(`#${MAP_ASSETS.ROAD_VERTICAL}`);
  });

  it('applies rotation as empty string ("") when rotation is undefined', () => {
    createSymbol(MAP_ASSETS.ROAD_VERTICAL);

    const tile: TileAsset = {
      asset: MAP_ASSETS.ROAD_VERTICAL,
    };

    const svg = createTileSvg(tile);

    expect(svg).not.toBeNull();
    expect(svg?.style.transform).toBe('');
  });

  it('applies rotation from tile.rotation when provided', () => {
    createSymbol(MAP_ASSETS.ROAD_VERTICAL);

    const tile: TileAsset = {
      asset: MAP_ASSETS.ROAD_VERTICAL,
      rotation: 90
    };

    const svg = createTileSvg(tile);

    expect(svg).not.toBeNull();
    expect(svg?.style.transform).toBe('rotate(90deg)');
  });
});
