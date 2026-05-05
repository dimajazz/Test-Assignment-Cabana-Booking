import { describe, it, expect } from 'vitest';
import { getClone } from '@utils/getClone.utils';

describe('getClone', () => {
  it('returns a deep cloned value', () => {
    const original = { a: 1, nested: { b: 2 } };
    const cloned = getClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(original.nested);
  });
});
