import { describe, it, expect } from 'vitest';
import { assertNonEmptyButtonField } from '@ui/assert/assertNonEmptyButtonField';

describe('assertNonEmptyButtonField()', () => {
  it('throws when value is empty string', () => {
    expect(() => {
      assertNonEmptyButtonField('', 'content');
    }).toThrow('Button content cannot be empty');
  });

  it('throws when value is whitespace only', () => {
    expect(() => {
      assertNonEmptyButtonField('   ', 'ariaLabel');
    }).toThrow('Button ariaLabel cannot be empty');
  });

  it('throws when value is null', () => {
    expect(() => {
      assertNonEmptyButtonField(null as unknown as string, 'title');
    }).toThrow('Button title cannot be empty');
  });

  it('throws when value is undefined', () => {
    expect(() => {
      assertNonEmptyButtonField(undefined as unknown as string, 'title');
    }).toThrow('Button title cannot be empty');
  });

  it('does not throw when value is a valid non-empty string', () => {
    expect(() => {
      assertNonEmptyButtonField('Hello', 'content');
    }).not.toThrow();
  });
});
