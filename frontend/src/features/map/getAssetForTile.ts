import type { Tile, TileAssetType } from '@models/map.types';
import { MAP_ASSETS } from '@constants/api.constants';

export function getAssetForTile(tile: Tile): TileAssetType | null {
  switch (tile) {
    case '#':
      // handeled by getRoadTile()
      return null;

    case 'W':
      return MAP_ASSETS.CABANA;

    case 'p':
      return MAP_ASSETS.POOL;

    case 'c':
      return MAP_ASSETS.CHALET;

    case '.':
      return null;

    default:
      // safeguard. should not be called due to Tile type.
      return null;
  }
};
