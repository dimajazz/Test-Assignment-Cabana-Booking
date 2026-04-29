import { MAP_ASSETS, ACCESSIBILITY } from "@constants/api.constants";
import { createTileSvg } from "@ui/mapTile/createTileSvg";
import { createCoordId } from "@features/map/createCoordId";
import type { TileAsset } from "@models/map.types";

export function createMapTile(
  tileAsset: TileAsset,
  x: number,
  y: number,
  isAvailable: boolean = true
): HTMLElement {

  const tile = document.createElement('div');
  tile.className = 'tile';

  const svg = createTileSvg(tileAsset);

  if (svg) {
    tile.appendChild(svg);
  }

  if (tileAsset.asset === MAP_ASSETS.CABANA) {
    tile.dataset.type = 'cabana';
    tile.dataset.id = createCoordId('cabana', x, y);

    if (isAvailable) {
      tile.classList.add('available');

      // accessibility for available cabanas
      tile.setAttribute(ACCESSIBILITY.ROLE, 'button');
      tile.setAttribute(ACCESSIBILITY.TABINDEX, '0');
      tile.setAttribute(ACCESSIBILITY.ARIA_LABEL, 'Cabana available');
      tile.setAttribute(ACCESSIBILITY.TITLE, 'Cabana available');
    }
  }

  return tile;
}
