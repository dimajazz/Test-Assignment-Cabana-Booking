import { createMapTile } from "@ui/mapTile/createMapTile";
import { getAssetForTile } from "@features/map/getAssetForTile";
import { createCoordId } from "@features/map/createCoordId";
import { MAP_ASSETS } from "@constants/api.constants";
import type { ParsedMap, TileAsset } from "@models/map.types";

export function createMap(mapData: ParsedMap): HTMLElement {
  const map = document.createElement('div');
  map.className = 'map';

  const { grid } = mapData;

  if (grid.length === 0) {
    return map;
  }

  const firstRowLength = grid[0].length;

  for (let y = 0; y < grid.length; y++) {
    if (grid[y].length !== firstRowLength) {
      console.warn('[!] Non-rectangular grid detected. Map rendering aborted.');
      return map;
    }
  }

  // set CSS variable for grid columns
  map.style.setProperty('--grid-columns-num', firstRowLength.toString());

  grid.forEach((row, y) => {
    row.forEach((tileChar, x) => {
      let tileAsset: TileAsset | null = null;
      let isAvailable = true;

      if (tileChar === '#') {
        const roadId = createCoordId('road', x, y);
        const road = mapData.roads.get(roadId);

        if (road) {
          tileAsset = { asset: road.asset, rotation: road?.rotation };
        };
      }
      else if (tileChar === 'W') {
        const cabanaId = createCoordId('cabana', x, y);
        const cabana = mapData.cabanas.get(cabanaId);

        if (cabana) {
          tileAsset = { asset: MAP_ASSETS.CABANA };
          isAvailable = !cabana.isReserved;
        };
      }
      else {
        const tileAssetType = getAssetForTile(tileChar);

        if (tileAssetType) {
          tileAsset = { asset: tileAssetType };
        };
      };

      if (!tileAsset) {
        tileAsset = { asset: MAP_ASSETS.EMPTY_SPACE };
      };

      const tileElement = createMapTile(tileAsset, x, y, isAvailable);

      map.appendChild(tileElement);
    });
  });

  return map;
}
