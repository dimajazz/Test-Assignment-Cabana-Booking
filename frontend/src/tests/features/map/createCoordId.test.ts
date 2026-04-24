import { describe, it, expect } from 'vitest';

import { createCoordId } from '@features/map/createCoordId';

describe('getCabanaId()', () => {
  it('generates correct cabana ID format', () => {
    expect(createCoordId('cabana', 1, 2)).toBe('cabana-1:2');
    expect(createCoordId('road', 3, 4)).toBe('road-3:4');
  });
});
