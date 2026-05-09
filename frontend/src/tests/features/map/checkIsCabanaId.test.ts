import { describe, it, expect } from 'vitest';

import { checkIsCabanaId } from '@features/map/checkIsCabanaId';

describe('isCabanaId', () => {
  it('returns true for valid cabana IDs', () => {
    expect(checkIsCabanaId('cabana-1:1')).toBe(true);
    expect(checkIsCabanaId('cabana-12:34')).toBe(true);
    expect(checkIsCabanaId('cabana-0:0')).toBe(true);
  });

  it('returns false for null or empty values', () => {
    expect(checkIsCabanaId(null)).toBe(false);
    expect(checkIsCabanaId('')).toBe(false);
  });

  it('returns false for wrong prefix', () => {
    expect(checkIsCabanaId('room-1:1')).toBe(false);
    expect(checkIsCabanaId('cabanas-1:1')).toBe(false);
  });

  it('returns false for wrong format', () => {
    expect(checkIsCabanaId('cabana-1')).toBe(false);
    expect(checkIsCabanaId('cabana-1-1')).toBe(false);
    expect(checkIsCabanaId('cabana:1:1')).toBe(false);
    expect(checkIsCabanaId('cabana-1:')).toBe(false);
    expect(checkIsCabanaId('cabana-:1')).toBe(false);
  });

  it('returns false for non-numeric coordinates', () => {
    expect(checkIsCabanaId('cabana-x:y')).toBe(false);
    expect(checkIsCabanaId('cabana-1:y')).toBe(false);
    expect(checkIsCabanaId('cabana-x:1')).toBe(false);
  });
});
