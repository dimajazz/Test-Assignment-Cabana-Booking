import { describe, it, expect } from "vitest";

import { parseMap } from "@features/map/parseMap";
import type { Grid, MapApiResponse, ParsedMap } from "@models/map.types";
import { createCoordId } from "@features/map/createCoordId";
import { ROAD_TILE_ASSETS } from "@constants/api.constants";

describe('parseMap', () => {
  const rawResponse: MapApiResponse = {
    cabanas: [
      { x: 1, y: 2, isReserved: false, guestName: null },
      { x: 3, y: 4, isReserved: true, guestName: 'Jack Torrance' }
    ],
    grid: [
      ['.', '.'],
      ['.', 'W']
    ]
  };

  it('converts cabanas[] into CabanasMap with correct IDs', () => {
    const result = parseMap(rawResponse);

    expect(result.grid).toEqual(rawResponse.grid);
    expect(result.cabanas instanceof Map).toBe(true);
    expect(result.cabanas.size).toBe(2);

    const id1 = createCoordId('cabana', 1, 2);
    const id2 = createCoordId('cabana', 3, 4);

    expect(result.cabanas.has(id1)).toBe(true);
    expect(result.cabanas.has(id2)).toBe(true);
    expect(result.cabanas.get(id1)).toEqual(
      { id: id1, x: 1, y: 2, isReserved: false, guestName: null },
    );
    expect(result.cabanas.get(id2)).toEqual(
      { id: id2, x: 3, y: 4, isReserved: true, guestName: 'Jack Torrance' },
    );
  });

  it(`returns empty CabanasMap when cabanas array is empty, 
      preserves the grid structure without modifying,
      roadsMap size is 0`,
    () => {
      const rawEmptyRes: MapApiResponse = { ...rawResponse, cabanas: [] };

      const result = parseMap(rawEmptyRes);

      expect(result.cabanas instanceof Map).toBe(true);
      expect(result.cabanas.size).toBe(0);
      expect(result.grid).toEqual(rawEmptyRes.grid);
      expect(result.grid).toBe(rawEmptyRes.grid);
      expect(result.roads.size).toBe(0);
    });

  it('each W tile has a corresponding cabana; tile with coords (1, 1) is a correct road', () => {
    const grid: Grid = [
      ['.', 'W', '.'],
      ['W', '#', 'W'],
      ['W', '#', 'W']
    ];

    const rawRes: MapApiResponse = {
      grid: grid,
      cabanas: [
        { x: 1, y: 0, isReserved: false, guestName: null },
        { x: 0, y: 1, isReserved: false, guestName: null },
        { x: 0, y: 2, isReserved: false, guestName: null },
        { x: 2, y: 2, isReserved: false, guestName: null },
        { x: 2, y: 1, isReserved: true, guestName: 'Jack Torrance' }
      ]
    };

    const result = parseMap(rawRes);

    grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 'W') {
          const id = createCoordId('cabana', x, y);
          expect(result.cabanas.has(id)).toBe(true);
        }
      });
    });

    const roadId = createCoordId('road', 1, 1);

    expect(result.roads.get(roadId)).toEqual({
      id: roadId,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 0
    });
  });

  it('ensures that number of W and # tiles in grid equals number of cabanas and roads in Maps', () => {
    const grid: Grid = [
      ['.', 'W', '.'],
      ['W', '#', 'W'],
      ['W', '#', 'W']
    ];

    let cabanasNum = 0;
    let roadsNum = 0;

    grid.forEach((row) => {
      row.forEach(tile => {
        if (tile === 'W') cabanasNum++;
        if (tile === '#') roadsNum++;
      });
    });

    const rawRes: MapApiResponse = {
      grid: grid,
      cabanas: [
        { x: 1, y: 0, isReserved: false, guestName: null },
        { x: 0, y: 1, isReserved: false, guestName: null },
        { x: 0, y: 2, isReserved: false, guestName: null },
        { x: 2, y: 2, isReserved: false, guestName: null },
        { x: 2, y: 1, isReserved: true, guestName: 'Jack Torrance' }
      ]
    };

    const result = parseMap(rawRes);

    expect(result.cabanas.size).toBe(cabanasNum);
    expect(result.roads.size).toBe(roadsNum);
  });
});
