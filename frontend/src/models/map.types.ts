import { MAP_ASSETS, MAP_ERROR_TYPES, ROAD_TILE_ASSETS } from "@constants/api.constants";

export type Tile = '.' | '#' | 'W' | 'p' | 'c';

export type Grid = Tile[][];

export type CabanaCoordinates = {
  x: number;
  y: number;
}

export type CabanaId = `${'cabana'}-${CabanaCoordinates['x']}:${CabanaCoordinates['y']}`;

export type Cabana = {
  id: CabanaId;
  isReserved: boolean;
  guestName: null | string;
} & CabanaCoordinates;

export type CabanaResponse = Omit<Cabana, 'id'>;

export type MapApiResponse = {
  grid: Grid;
  cabanas: CabanaResponse[];
};

export type CabanasMap = Map<CabanaId, Cabana>;

export type ParsedMap = {
  grid: Grid;
  cabanas: CabanasMap;
  roads: RoadTilesMap;
};

export type TileIdPrefix = 'cabana' | 'road';

export type RoadTileId = `${'road'}-${number}:${number}`;

export type TileAssetType = typeof MAP_ASSETS[keyof typeof MAP_ASSETS];

export type TileRotation = 0 | 90 | 180 | 270;

export type TileAsset = {
  asset: TileAssetType;
  rotation?: TileRotation;
};

export type RoadTile = {
  id: RoadTileId;
  x: number;
  y: number;
  asset: typeof ROAD_TILE_ASSETS[keyof typeof ROAD_TILE_ASSETS];
  rotation: TileRotation;
};

export type RoadTilesMap = Map<RoadTileId, RoadTile>;

export type RoadTopologyError = {
  type: typeof MAP_ERROR_TYPES.ROAD_TOPOLOGY;
  message: string;
  x: number;
  y: number;
  neighbors: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
};

export type CabanaMapEvent = {
  type: 'cabanaUpdated';
  cabanaId: CabanaId;
}

export type CabanaListener = (event: CabanaMapEvent) => void;
