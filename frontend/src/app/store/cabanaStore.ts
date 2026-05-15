import { createCoordId } from "@features/map/createCoordId";
import { getClone } from "@utils/getClone.utils";
import type { Cabana, CabanaId, CabanaListener, CabanaMapEvent, CabanasMap } from "@models/map.types";

let cabanasMap: CabanasMap = new Map();
let listeners: CabanaListener[] = [];

export const cabanaStore = {
  init(initialCabanas: CabanasMap): void {
    const newMap: CabanasMap = new Map();

    for (const [id, cabana] of initialCabanas.entries()) {
      newMap.set(id, cabana);
    }

    cabanasMap = newMap;
    listeners = [];
  },

  getCabanaById(id: CabanaId): Cabana | null {
    const cabana = cabanasMap.get(id);

    if (!cabana) {
      return null;
    }

    return getClone(cabana);
  },

  updateCabana(reservation: Cabana): void {
    const { x, y } = reservation;
    const cabanaId = createCoordId('cabana', x, y);

    const cabana = cabanasMap.get(cabanaId);
    if (!cabana) {
      console.warn(`cabanaMap.updateCabana: no cabana at ${x}:${y}`);
      return;
    }

    const updatedCabana: Cabana = {
      ...cabana,
      isReserved: true,
      guestName: reservation.guestName
    };

    cabanasMap.set(cabanaId, updatedCabana);

    const event: CabanaMapEvent = {
      type: 'cabanaUpdated',
      cabanaId
    };

    for (const listener of listeners) {
      try {
        listener(event);
      } catch {
        console.warn('[!] Cabana event listener error!');
      }
    }
  },

  subscribe(listener: CabanaListener): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(lis => lis !== listener);
    };
  }
};
