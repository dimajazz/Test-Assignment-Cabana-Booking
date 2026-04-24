export const BASE_URL = 'http://localhost:8085';

export const API_ERROR_TYPES = {
  NETWORK: 'network',
  HTTP: 'http',
  VALIDATION: 'validation',
  SERVER: 'server',
  PARSE: 'parse',
  TIMEOUT: 'timeout'
} as const;

export const ROAD_TILE_ASSETS = {
  ROAD_VERTICAL: 'road-vertical',
  ROAD_CORNER: 'road-corner',
  ROAD_T_JUNCTION: 'road-t-junction',
  ROAD_CROSSROAD: 'road-crossroad',
  ROAD_DEAD_END: 'road-dead-end'
} as const;

export const MAP_ASSETS = {
  ...ROAD_TILE_ASSETS,
  CABANA: 'cabana',
  POOL: 'pool',
  CHALET: 'chalet',
  EMPTY_SPACE: 'empty-space'
} as const;

export const MAP_ERROR_TYPES = {
  ROAD_TOPOLOGY: 'road-topology'
} as const;
