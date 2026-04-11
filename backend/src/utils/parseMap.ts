import { loadAsciiMap } from './loadFiles';
import { FileDataValidationAppError } from '../exceptions/exceptions';
import type { Grid, CabanaId, CabanasMap } from '../types/map';

export function parseAsciiMap(): { grid: Grid; cabanas: CabanasMap } {
  const ascii = loadAsciiMap();

  if (!ascii.trim()) {
    throw new FileDataValidationAppError('ASCII map file is empty');
  }

  const rows = ascii.split('\n');

  // Validate rectangular shape
  const width = rows[0].length;
  rows.forEach((row, index) => {
    if (row.length !== width) {
      throw new FileDataValidationAppError(
        `Invalid map: row ${index} has length ${row.length}, expected ${width}`
      );
    }
  });

  function AddCabana(rowTiles: string[], y: number) {
    rowTiles.forEach((tile, x) => {
      if (tile === 'W') {
        const id: CabanaId = `cabana-${x}:${y}`
        cabanas.set(id, { id, x, y, isReserved: false, guestName: null });
      }
    });
  }

  const cabanas: CabanasMap = new Map();

  const grid: Grid = rows.map((row, y) => {
    const rowTiles = row.split('');
    AddCabana(rowTiles, y);

    return rowTiles;
  });

  return { grid, cabanas };
}
