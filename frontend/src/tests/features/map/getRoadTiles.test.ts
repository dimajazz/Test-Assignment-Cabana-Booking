import { describe, it, expect } from 'vitest';

import { getRoadTiles } from '@features/map/getRoadTiles';
import { createCoordId } from '@features/map/createCoordId';
import { ROAD_TILE_ASSETS } from '@constants/api.constants';
import { Grid } from '@models/map.types';

describe('getRoadTiles()', () => {
  it('returns a dead-end (0 deg) for an isolated road tile', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['.', '#', '.'],
      ['.', '.', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result instanceof Map).toBe(true);
    expect(result.size).toBe(1);
    expect(result.has(id)).toBe(true);
    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 0
    });
  });

  it('detects a dead-end pointing UP (rotation 0 deg)', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['.', '#', '.'],
      ['.', '#', '.'],
    ];

    const id = createCoordId('road', 1, 1);

    const result = getRoadTiles(grid).get(id);

    expect(result).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 0
    });
  });

  it('detects a dead-end pointing DOWN (rotation 180 deg)', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['.', '#', '.'],
      ['.', '.', '.'],
    ];

    const id = createCoordId('road', 1, 1);

    const result = getRoadTiles(grid).get(id);

    expect(result).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 180
    });
  });

  it('detects a dead-end pointing LEFT (rotation 270 deg)', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['.', '#', '#'],
      ['.', '.', '.'],
    ];

    const id = createCoordId('road', 1, 1);

    const result = getRoadTiles(grid).get(id);

    expect(result).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 270
    });
  });

  it('detects a dead-end pointing RIGHT (rotation 90 deg)', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['#', '#', '.'],
      ['.', '.', '.'],
    ];

    const id = createCoordId('road', 1, 1);

    const result = getRoadTiles(grid).get(id);

    expect(result).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_DEAD_END,
      rotation: 90
    });
  });

  it('returns a vertical road tile (rotation 0 deg) when Up and Down neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['.', '#', '.'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_VERTICAL,
      rotation: 0
    });
  });

  it('returns a vertical road tile (rotation 90 deg) when LEFT and RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['#', '#', '#'],
      ['.', '.', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_VERTICAL,
      rotation: 90
    });
  });

  it('returns a corner road tile (rotation 0 deg) when UP and RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['.', '#', '#'],
      ['.', '.', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_CORNER,
      rotation: 0
    });
  });

  it('returns a corner road tile (rotation 90 deg) when DOWN and RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['.', '#', '#'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_CORNER,
      rotation: 90
    });
  });

  it('returns a corner road tile (rotation 180 deg) when DOWN and LEFT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['#', '#', '.'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_CORNER,
      rotation: 180
    });
  });

  it('returns a corner road tile (rotation 270 deg) when UP and LEFT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['#', '#', '.'],
      ['.', '.', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_CORNER,
      rotation: 270
    });
  });

  it('returns a T-junction road tile (rotation 0 deg) when UP, DOWN, RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['.', '#', '#'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_T_JUNCTION,
      rotation: 0
    });
  });

  it('returns a T-junction road tile (rotation 90 deg) when LEFT, DOWN, RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '.', '.'],
      ['#', '#', '#'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_T_JUNCTION,
      rotation: 90
    });
  });

  it('returns a T-junction road tile (rotation 180 deg) when UP, DOWN, LEFT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['#', '#', '.'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_T_JUNCTION,
      rotation: 180
    });
  });

  it('returns a T-junction road tile (rotation 270 deg) when UP, LEFT, RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['#', '#', '#'],
      ['.', '.', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_T_JUNCTION,
      rotation: 270
    });
  });

  it('returns a crossroad tile when UP, DOWN, LEFT, RIGHT neighbors are roads', () => {
    const grid: Grid = [
      ['.', '#', '.'],
      ['#', '#', '#'],
      ['.', '#', '.'],
    ];

    const result = getRoadTiles(grid);

    const id = createCoordId('road', 1, 1);

    expect(result.get(id)).toEqual({
      id,
      x: 1,
      y: 1,
      asset: ROAD_TILE_ASSETS.ROAD_CROSSROAD,
      rotation: 0
    });
  });
});
