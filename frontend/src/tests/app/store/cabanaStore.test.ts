import { describe, it, expect, beforeEach, vi } from 'vitest'

import { cabanaStore } from '@app/store/cabanaStore'
import type { Cabana, CabanaId, CabanasMap } from '@models/map.types'
import type { Reservation } from '@models/reservation.types'
import { createCoordId } from '@features/map/createCoordId';

function createCabana(x: number, y: number, overrides?: Partial<Cabana>): Cabana {
  const id = createCoordId('cabana', x, y);
  return {
    id,
    x,
    y,
    isReserved: false,
    guestName: null,
    ...overrides
  };
}

describe('cabanaMap store', () => {
  beforeEach(() => {
    const empty = new Map<CabanaId, Cabana>();
    cabanaStore.init(empty);
  });

  describe('initialization', () => {
    it('init loads cabanas into store', () => {
      const cabana = createCabana(1, 1);
      const cabanasMap: CabanasMap = new Map();
      cabanasMap.set(cabana.id, cabana);

      cabanaStore.init(cabanasMap);

      const result = cabanaStore.getCabanaById(cabana.id);

      expect(result).toEqual(cabana);
    });
  });

  describe('getCabana', () => {
    it('returns null for missing cabana', () => {
      const id = createCoordId('cabana', 1, 1);
      const result = cabanaStore.getCabanaById(id);

      expect(result).toBeNull();
    });

    it('returns a copy, not internal object', () => {
      const cabana = createCabana(2, 2);
      const cabanasMap: CabanasMap = new Map();
      cabanasMap.set(cabana.id, cabana);

      cabanaStore.init(cabanasMap);

      const firstCabana = cabanaStore.getCabanaById(cabana.id);
      if (!firstCabana) {
        throw new Error('[cabanaStore Test Error] cabana missing');
      }

      firstCabana.isReserved = true;
      firstCabana.guestName = 'Danny';

      const secondCabana = cabanaStore.getCabanaById(cabana.id);

      expect(secondCabana?.isReserved).toBe(false);
      expect(secondCabana?.guestName).toBeNull();
    });
  });

  describe('updateCabana', () => {
    it('updates cabana reservation state and guestName', () => {
      const cabana = createCabana(2, 3);
      const cabanaMap = new Map();
      cabanaMap.set(cabana.id, cabana);
      cabanaStore.init(cabanaMap);

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      };

      cabanaStore.updateCabana(reservation);

      const updatedCabana = cabanaStore.getCabanaById(cabana.id);

      expect(updatedCabana).toEqual({
        id: cabana.id,
        x: 2,
        y: 3,
        isReserved: true,
        guestName: 'Jack Torrance'
      });
    });

    it('warns and ignores update for non-existing cabana', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
      const listener = vi.fn();

      cabanaStore.subscribe(listener);

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '404', guestName: 'Mr. Nobody' }
      };

      expect(() => cabanaStore.updateCabana(reservation)).not.toThrow();
      expect(listener).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledTimes(1);

      warnSpy.mockRestore();
    });
  });

  describe('subscriptions', () => {
    it('subscriber is called when cabana is updated', () => {
      const cabana = createCabana(2, 3);
      const cabanaMap = new Map();
      cabanaMap.set(cabana.id, cabana);
      cabanaStore.init(cabanaMap);

      const listener = vi.fn();
      cabanaStore.subscribe(listener);

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      };

      cabanaStore.updateCabana(reservation);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        type: 'cabanaUpdated',
        cabanaId: cabana.id
      });
    });

    it('unsubscribe stops receiving events', () => {
      const cabana = createCabana(2, 3);
      const cabanaMap = new Map();
      cabanaMap.set(cabana.id, cabana);
      cabanaStore.init(cabanaMap);

      const listener = vi.fn();
      const unsubscribe = cabanaStore.subscribe(listener);

      unsubscribe();

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      };

      cabanaStore.updateCabana(reservation);

      expect(listener).not.toHaveBeenCalled();
    });

    it('multiple subscribers all receive events', () => {
      const cabana = createCabana(2, 3);
      const cabanaMap = new Map();
      cabanaMap.set(cabana.id, cabana);
      cabanaStore.init(cabanaMap);

      const listener1 = vi.fn();
      const listener2 = vi.fn();
      cabanaStore.subscribe(listener1);
      cabanaStore.subscribe(listener2);

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      };

      cabanaStore.updateCabana(reservation);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('subscriber throwing does not break others', () => {
      const cabana = createCabana(2, 3);
      const cabanaMap = new Map();
      cabanaMap.set(cabana.id, cabana);
      cabanaStore.init(cabanaMap);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      const goodListener = vi.fn();
      const badListener = vi.fn(() => {
        throw new Error('listener failed')
      });
      cabanaStore.subscribe(goodListener);
      cabanaStore.subscribe(badListener);

      const reservation: Reservation = {
        cabana: { x: 2, y: 3 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      };

      expect(() => cabanaStore.updateCabana(reservation)).not.toThrow();

      // bad listener threw -> warn should be called
      expect(warnSpy).toHaveBeenCalledTimes(1);

      expect(goodListener).toHaveBeenCalledTimes(1);

      warnSpy.mockRestore();
    });
  });
});
