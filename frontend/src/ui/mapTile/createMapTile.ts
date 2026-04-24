import { MAP_ASSETS } from "@constants/api.constants";
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
    }
  }

  return tile;
}
