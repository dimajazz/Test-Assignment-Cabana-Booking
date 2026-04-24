import { describe, it, expect } from 'vitest';

import { getAssetForTile } from '@features/map/getAssetForTile';
import { MAP_ASSETS } from '@constants/api.constants';
import type { Tile } from '@models/map.types';

describe('getAssetForTile()', () => {
  it('return null for EMPTY_SPACE "." ', () => {
    expect(getAssetForTile('.')).toBeNull();
  });

  it('maps "#" to EMPTY_SPACE (roads handled elsewhere)', () => {
    expect(getAssetForTile('#')).toBe(null);
  });

  it('maps "p" to POOL', () => {
    expect(getAssetForTile('p')).toBe(MAP_ASSETS.POOL);
  });

  it('maps "W" to CABANA', () => {
    expect(getAssetForTile('W')).toBe(MAP_ASSETS.CABANA);
  });

  it('maps "c" to CHALET', () => {
    expect(getAssetForTile('c')).toBe(MAP_ASSETS.CHALET);
  });

  it('return null for not existing tile', () => {
    expect(getAssetForTile('' as Tile)).toBeNull();
  });
});
