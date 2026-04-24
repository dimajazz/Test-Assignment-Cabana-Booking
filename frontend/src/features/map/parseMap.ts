import { CabanaId, CabanasMap, MapApiResponse, ParsedMap } from "@models/map.types";
import { createCoordId } from "@features/map/createCoordId";
import { getRoadTiles } from "@features/map/getRoadTiles";

export function parseMap(rawMap: MapApiResponse): ParsedMap {
  const cabanasMap: CabanasMap = new Map();

  rawMap.cabanas.forEach(cabana => {
    const id: CabanaId = createCoordId('cabana', cabana.x, cabana.y);

    cabanasMap.set(id, { id, ...cabana });
  });

  const roadsMap = getRoadTiles(rawMap.grid);

  return {
    grid: rawMap.grid,
    cabanas: cabanasMap,
    roads: roadsMap
  };
}
