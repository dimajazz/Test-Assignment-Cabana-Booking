import { MAP_ASSETS } from '@constants/api.constants';
import type { TileAsset } from '@models/map.types';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createTileSvg(tile: TileAsset): SVGSVGElement | null {
  const { asset } = tile;

  if (asset === MAP_ASSETS.EMPTY_SPACE) {
    return null;
  }

  const assetSymbol = document.getElementById(asset);

  if (!assetSymbol) {
    console.warn(`[Tile] SVG symbol not found for asset id='${asset}'`);
    return null;
  }

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const use = document.createElementNS(SVG_NS, 'use');

  use.setAttribute('href', `#${asset}`);
  svg.appendChild(use);

  const { rotation } = tile;
  if (rotation) {
    svg.style.transform = `rotate(${rotation}deg)`;
  }
  svg.style.transformOrigin = '50% 50%';

  return svg;
};
