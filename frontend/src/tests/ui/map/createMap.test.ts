import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createMap } from '@ui/map/createMap';
import { createMapTile } from '@ui/mapTile/createMapTile';
import { getAssetForTile } from '@features/map/getAssetForTile';
import { MAP_ASSETS } from '@constants/api.constants';

import type {
  ParsedMap,
  Cabana,
  RoadTile,
  Tile
} from 'models/map.types';

vi.mock('@ui/mapTile/createMapTile', () => ({
  createMapTile: vi.fn()
}));

vi.mock('@features/map/getAssetForTile', () => ({
  getAssetForTile: vi.fn()
}));

vi.mock('@ui/map/map.module.css', () => ({
  default: {
    map: 'map'
  }
}));

describe('createMap()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fakeTile = (label: string) => {
    const element = document.createElement('div');
    element.classList.add('tile');
    element.dataset.test = label;
    return element;
  };

  const minimalParsedMap = (): ParsedMap => ({
    grid: [],
    cabanas: new Map(),
    roads: new Map()
  });

  describe('basic container behavior', () => {
    it('returns a root element with class "map"', () => {
      const result = createMap(minimalParsedMap());

      expect(result.tagName).toBe('DIV');
      expect(result.classList.contains('map')).toBe(true);
    });

    it('empty grid returns empty map container', () => {
      const result = createMap(minimalParsedMap());
      expect(result.children.length).toBe(0);
    });

    it('sets CSS variable --grid-columns-num based on grid row length', () => {
      const grid: Tile[][] = [
        ['.', '.', '.'],
        ['.', '.', '.']
      ];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      vi.mocked(createMapTile).mockReturnValue(document.createElement('div'));

      const result = createMap(mapData);

      const cssVar = result.style.getPropertyValue('--grid-columns-num').trim();
      expect(cssVar).toBe('3');
    });
  });

  describe('non-rectangular grid', () => {
    it('warns and returns empty map when grid rows have inconsistent lengths', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      const mapData: ParsedMap = {
        grid: [
          ['.', '.'],
          ['.']
        ],
        cabanas: new Map(),
        roads: new Map()
      };

      const result = createMap(mapData);

      expect(warnSpy).toHaveBeenCalled();
      expect(result.children.length).toBe(0);

      warnSpy.mockRestore();
    });
  });

  describe('tile creation loop', () => {
    it('calls createMapTile for each coordinate in the grid', () => {
      const grid: Tile[][] = [
        ['.', '.'],
        ['.', '.']
      ];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      vi.mocked(createMapTile).mockReturnValue(fakeTile('x'));

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledTimes(4);
    });

    it('appends returned tile elements to the map container in correct order', () => {
      const grid: Tile[][] = [
        ['.', '.'],
        ['.', '.']
      ];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      const t1 = fakeTile('1');
      const t2 = fakeTile('2');
      const t3 = fakeTile('3');
      const t4 = fakeTile('4');

      vi.mocked(createMapTile)
        .mockReturnValueOnce(t1)
        .mockReturnValueOnce(t2)
        .mockReturnValueOnce(t3)
        .mockReturnValueOnce(t4);

      const result = createMap(mapData);

      expect(result.children.length).toBe(4);
      expect(result.children[0]).toBe(t1);
      expect(result.children[1]).toBe(t2);
      expect(result.children[2]).toBe(t3);
      expect(result.children[3]).toBe(t4);
    });
  });

  describe('cabana tiles', () => {
    it('uses cabana data from cabanas map to determine availability', () => {
      const grid: Tile[][] = [['W']];
      const id = `cabana-0:0`;

      const cabana: Cabana = {
        id,
        x: 0,
        y: 0,
        isReserved: false,
        guestName: null
      };

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map([[id, cabana]]),
        roads: new Map()
      };

      const tileElem = fakeTile('cabana');
      vi.mocked(createMapTile).mockReturnValue(tileElem);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.CABANA },
        0,
        0,
        true
      );
    });

    it('passes isAvailable=false when cabana is reserved', () => {
      const grid: Tile[][] = [['W']];
      const cabanaId = 'cabana-0:0';

      const cabana: Cabana = {
        id: cabanaId,
        x: 0,
        y: 0,
        isReserved: true,
        guestName: null
      };

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map([[cabanaId, cabana]]),
        roads: new Map()
      };

      const tileEl = fakeTile('cabana');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.CABANA },
        0,
        0,
        false
      );
    });

    it('if cabana missing in map -> empty tile', () => {
      const grid: Tile[][] = [['W']];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      const tileEl = fakeTile('empty');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.EMPTY_SPACE },
        0,
        0,
        true
      );
    });
  });

  describe('road tile', () => {
    it('uses road tile data from roads map to determine asset and rotation', () => {
      const grid: Tile[][] = [['#']];
      const roadId = 'road-0:0';

      const road: RoadTile = {
        id: roadId,
        x: 0,
        y: 0,
        asset: MAP_ASSETS.ROAD_VERTICAL,
        rotation: 90
      };

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map([[roadId, road]])
      };

      const tileEl = fakeTile('road');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: road.asset, rotation: road.rotation },
        0,
        0,
        true
      );
    });

    it('missing road tile -> empty tile', () => {
      const grid: Tile[][] = [['#']];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      const tileEl = fakeTile('empty');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.EMPTY_SPACE },
        0,
        0,
        true
      );
    });
  });

  describe('unknown tile types', () => {
    it('unknown tile type results in empty tile', () => {
      const grid: Tile[][] = [['X' as Tile]];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      const tileEl = fakeTile('empty');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.EMPTY_SPACE },
        0,
        0,
        true
      );
    });
  });

  describe('integration with getAssetForTile', () => {
    it('non-road, non-cabana tiles use getAssetForTile', () => {
      const grid: Tile[][] = [['p']];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      vi.mocked(getAssetForTile).mockReturnValue(MAP_ASSETS.POOL);

      const tileEl = fakeTile('pool');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.POOL },
        0,
        0,
        true
      );
    });

    it('if getAssetForTile returns null -> empty tile', () => {
      const grid: Tile[][] = [['p']];

      const mapData: ParsedMap = {
        grid,
        cabanas: new Map(),
        roads: new Map()
      };

      vi.mocked(getAssetForTile).mockReturnValue(null);

      const tileEl = fakeTile('empty');
      vi.mocked(createMapTile).mockReturnValue(tileEl);

      createMap(mapData);

      expect(vi.mocked(createMapTile)).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.EMPTY_SPACE },
        0,
        0,
        true
      );
    });
  });
});
