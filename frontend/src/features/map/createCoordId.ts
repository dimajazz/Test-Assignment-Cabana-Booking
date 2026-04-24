import { TileIdPrefix } from "@models/map.types";

export function createCoordId<P extends TileIdPrefix>(
  prefix: P,
  x: number,
  y: number
): `${P}-${number}:${number}` {
  return `${prefix}-${x}:${y}`;
}
