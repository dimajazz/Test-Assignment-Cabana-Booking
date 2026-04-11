import { loadAsciiMap, loadGuests } from '../../src/utils/loadFiles';
import { LoadFileAppError, FileDataValidationAppError } from '../../src/exceptions/exceptions';

import * as fs from 'fs';

jest.mock('fs');

const mockedExistsSync = fs.existsSync as jest.Mock;
const mockedReadFileSync = fs.readFileSync as jest.Mock;

describe('loadFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // loadAsciiMap
  describe('loadAsciiMap', () => {
    it('throws if map file does not exist', () => {
      mockedExistsSync.mockReturnValue(false);

      expect(() => loadAsciiMap()).toThrow(LoadFileAppError);
    });

    it('throws if readFileSync fails', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockImplementation(() => {
        throw new Error('read error');
      });

      expect(() => loadAsciiMap()).toThrow(LoadFileAppError);
    });

    it('returns file content on success', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockReturnValue('ASCII MAP CONTENT');

      const result = loadAsciiMap();
      expect(result).toBe('ASCII MAP CONTENT');
    });
  });

  // loadGuests
  describe('loadGuests', () => {
    it('throws if bookings file does not exist', () => {
      mockedExistsSync.mockReturnValue(false);

      expect(() => loadGuests()).toThrow(LoadFileAppError);
    });

    it('throws if readFileSync fails', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockImplementation(() => {
        throw new Error('read error');
      });

      expect(() => loadGuests()).toThrow(LoadFileAppError);
    });

    it('throws if JSON.parse fails', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockReturnValue('not-json');

      expect(() => loadGuests()).toThrow(LoadFileAppError);
    });

    it('throws if parsed data is not an array', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockReturnValue(JSON.stringify({}));

      expect(() => loadGuests()).toThrow(FileDataValidationAppError);
    });

    it('throws if any entry has invalid shape', () => {
      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockReturnValue(
        JSON.stringify([{ room: 237, guestName: 'Jack Torrance' }])
      );

      expect(() => loadGuests()).toThrow(FileDataValidationAppError);
    });

    it('returns parsed guests on success', () => {
      const data = [
        { room: '237', guestName: 'Jack Torrance' },
        { room: '102', guestName: 'Danny' }
      ];

      mockedExistsSync.mockReturnValue(true);
      mockedReadFileSync.mockReturnValue(JSON.stringify(data));

      const result = loadGuests();
      expect(result).toEqual(data);
    });
  });
});
