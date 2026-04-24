import { Grid, RoadTilesMap, RoadTile, TileAssetType, TileRotation, RoadTopologyError } from "@models/map.types";
import { createCoordId } from "@features/map/createCoordId";
import { MAP_ERROR_TYPES, ROAD_TILE_ASSETS } from "@constants/api.constants";

export function getRoadTiles(grid: Grid): RoadTilesMap {
  const roadMap: RoadTilesMap = new Map();

  grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === '#') {
        const up = grid[y - 1]?.[x] === '#';
        const down = grid[y + 1]?.[x] === '#';
        const left = grid[y]?.[x - 1] === '#';
        const right = grid[y]?.[x + 1] === '#';

        let asset: TileAssetType | null = null;
        let rotation: TileRotation = 0;

        const id = createCoordId('road', x, y);

        if (!up && !down && !left && !right) {
          // None neighbors
          asset = ROAD_TILE_ASSETS.ROAD_DEAD_END;
        }

        if (!up && down && !left && !right) {
          // up
          asset = ROAD_TILE_ASSETS.ROAD_DEAD_END;
        }

        if (up && !down && !left && !right) {
          // down
          asset = ROAD_TILE_ASSETS.ROAD_DEAD_END;
          rotation = 180;
        }

        if (!up && !down && left && !right) {
          // right
          asset = ROAD_TILE_ASSETS.ROAD_DEAD_END;
          rotation = 90;
        }

        if (!up && !down && !left && right) {
          // left
          asset = ROAD_TILE_ASSETS.ROAD_DEAD_END;
          rotation = 270;
        }

        if (up && down && !left && !right) {
          // vertical
          asset = ROAD_TILE_ASSETS.ROAD_VERTICAL;
        }

        if (!up && !down && left && right) {
          // vertical rotation 90
          asset = ROAD_TILE_ASSETS.ROAD_VERTICAL;
          rotation = 90;
        }

        if (up && !down && !left && right) {
          // corner rotation 0
          asset = ROAD_TILE_ASSETS.ROAD_CORNER;
          rotation = 0;
        }

        if (!up && down && !left && right) {
          // corner rotation 90
          asset = ROAD_TILE_ASSETS.ROAD_CORNER;
          rotation = 90;
        }

        if (!up && down && left && !right) {
          // corner rotation 180
          asset = ROAD_TILE_ASSETS.ROAD_CORNER;
          rotation = 180;
        }

        if (up && !down && left && !right) {
          // corner rotation 270
          asset = ROAD_TILE_ASSETS.ROAD_CORNER;
          rotation = 270;
        }

        if (up && down && !left && right) {
          // t-junction rotation 0
          asset = ROAD_TILE_ASSETS.ROAD_T_JUNCTION;
        }

        if (!up && down && left && right) {
          // t-junction rotation 90
          asset = ROAD_TILE_ASSETS.ROAD_T_JUNCTION;
          rotation = 90;
        }

        if (up && down && left && !right) {
          // t-junction rotation 180
          asset = ROAD_TILE_ASSETS.ROAD_T_JUNCTION;
          rotation = 180;
        }

        if (up && !down && left && right) {
          // t-junction rotation 270
          asset = ROAD_TILE_ASSETS.ROAD_T_JUNCTION;
          rotation = 270;
        }

        if (up && down && left && right) {
          // crossroad
          asset = ROAD_TILE_ASSETS.ROAD_CROSSROAD;
        }

        if (!asset) {
          // Safeguard. unreachable branch if everything is ok.
          const roadTopologyError: RoadTopologyError = {
            type: MAP_ERROR_TYPES.ROAD_TOPOLOGY,
            message: 'Invalid map topology!',
            x,
            y,
            neighbors: { up, down, left, right }
          };

          throw roadTopologyError;
        }

        const roadTile: RoadTile = {
          id, x, y, asset, rotation
        };

        roadMap.set(id, roadTile);
      }
    })
  });

  return roadMap;
};
