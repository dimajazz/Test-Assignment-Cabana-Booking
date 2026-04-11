import { parseAsciiMap } from "../../src/utils/parseMap";
import { FileDataValidationAppError } from "../../src/exceptions/exceptions";
import { loadAsciiMap } from "../../src/utils/loadFiles";

jest.mock('../../src/utils/loadFiles.ts');

const mockedLoadAsciiMap = loadAsciiMap as jest.Mock;

describe('loadAsciiMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Validation tests
  describe('parseAsciiMap', () => {
    it('throws if ASCII map is empty', () => {
      mockedLoadAsciiMap.mockReturnValue('');

      expect(() => parseAsciiMap()).toThrow(FileDataValidationAppError);
    });

    it('throws if ASCII map contains only whitespace', () => {
      mockedLoadAsciiMap.mockReturnValue('  \n  ');

      expect(() => parseAsciiMap()).toThrow(FileDataValidationAppError);
    });

    it('throws if rows have different lengths', () => {
      mockedLoadAsciiMap.mockReturnValue('WW\nW');

      expect(() => parseAsciiMap()).toThrow(FileDataValidationAppError);
    });
  });

  describe('grid parsing', () => {
    it('splits rows into tiles correctly', () => {
      mockedLoadAsciiMap.mockReturnValue('ABC\nDEF');

      const { grid } = parseAsciiMap();
      expect(grid).toEqual([
        ['A', 'B', 'C'],
        ['D', 'E', 'F']
      ]);
    });
  });

  // Cabana detection
  describe('cabana detection', () => {
    it('detects cabanas at correct coordinates', () => {
      mockedLoadAsciiMap.mockReturnValue('W..\n.W.');

      const { cabanas } = parseAsciiMap();

      expect(cabanas.size).toBe(2);
      expect(cabanas.get('cabana-0:0')).toEqual({
        id: 'cabana-0:0',
        x: 0,
        y: 0,
        isReserved: false,
        guestName: null
      });
      expect(cabanas.get('cabana-1:1')).toEqual({
        id: 'cabana-1:1',
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });
    });
  });

  // Successful result
  describe('successful result', () => {
    it('returns both grid and cabanas', () => {
      mockedLoadAsciiMap.mockReturnValue('W.\n.W');

      const result = parseAsciiMap();

      expect(result).toHaveProperty('grid');
      expect(result).toHaveProperty('cabanas');
    });
  });
});
