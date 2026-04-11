import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import { FileDataValidationAppError, LoadFileAppError } from '../exceptions/exceptions';
import type { Guest } from '../types/booking';

const MAP_FILE = join(__dirname, '..', 'data', 'map.ascii');
const BOOKINGS_FILE = join(__dirname, '..', 'data', 'bookings.json');

export function loadAsciiMap(): string {
  if (!existsSync(MAP_FILE)) {
    throw new LoadFileAppError(`Map file not found at: ${MAP_FILE}`);
  }

  try {
    return readFileSync(MAP_FILE, 'utf-8');
  } catch (error) {
    throw new LoadFileAppError(
      `Failed to read ASCII map file: ${(error as Error).message}`
    );
  }
}

export function loadGuests(): Guest[] {
  if (!existsSync(BOOKINGS_FILE)) {
    throw new LoadFileAppError(`Bookings file not found at: ${BOOKINGS_FILE}`);
  }

  try {
    const rawData = readFileSync(BOOKINGS_FILE, 'utf-8');
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      throw new FileDataValidationAppError('Invalid data! Bookings file must contain an array!');
    }

    parsedData.forEach((item, index) => {
      if (typeof item.room !== 'string' || typeof item.guestName !== 'string') {
        throw new FileDataValidationAppError(
          `Invalid data! Booking entry at index ${index}: expected { room: string, guestName: string }`
        );
      }
    });

    return parsedData as Guest[];

  } catch (error) {
    if (error instanceof FileDataValidationAppError) {
      throw error;
    }

    throw new LoadFileAppError(
      `Failed to load bookings: ${(error as Error).message}`
    );
  }
}
