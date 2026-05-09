import { describe, it, beforeEach, expect, vi } from 'vitest';

import { mapPage } from '@ui/pages/mapPage';
import { fetchMap } from '@api/fetchMap';
import { parseMap } from '@features/map/parseMap';
import { createMap } from '@ui/map/createMap';
import { createMapTile } from '@ui/mapTile/createMapTile';
import { bookingController } from '@app/controllers/bookingController';
import { cabanaStore } from '@app/store/cabanaStore';
import { openModal } from '@ui/modal/openModal';
import { createBookingForm } from '@ui/form/createBookingForm';
import { createCoordId } from '@features/map/createCoordId';
import { MAP_ASSETS } from '@constants/api.constants';

vi.mock('@api/fetchMap');
vi.mock('@features/map/parseMap');
vi.mock('@ui/map/createMap');
vi.mock('@ui/mapTile/createMapTile');
vi.mock('@app/controllers/bookingController');
vi.mock('@app/store/cabanaStore');
vi.mock('@ui/modal/openModal');
vi.mock('@ui/form/createBookingForm');

const mockedFetchMap = vi.mocked(fetchMap);
const mockedParseMap = vi.mocked(parseMap);
const mockedCreateMap = vi.mocked(createMap);
const mockedCreateMapTile = vi.mocked(createMapTile);
const mockedOpenModal = vi.mocked(openModal);
const mockedCreateBookingForm = vi.mocked(createBookingForm);
const mockedCabanaStore = vi.mocked(cabanaStore);

describe('mapPage', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('initial rendering', () => {
    it('renders static layout', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      expect(root.querySelector('h1')).toBeTruthy();
      expect(root.querySelector('p')?.textContent).toBe('Reserve a cabana for your booked room');
      expect(root.querySelector('.map-container')).toBeTruthy();
    });
  });

  describe('map loading', () => {
    it('fetches map data, parses it, and renders map', async () => {
      const response = { grid: [], cabanas: [] };
      const parsedData = { grid: [], cabanas: new Map(), roads: new Map() };
      const map = document.createElement('div');

      mockedFetchMap.mockResolvedValue(response);
      mockedParseMap.mockReturnValue(parsedData);
      mockedCreateMap.mockReturnValue(map);

      await mapPage.init(root);

      expect(fetchMap).toHaveBeenCalledTimes(1);
      expect(parseMap).toHaveBeenCalledWith(response);
      expect(createMap).toHaveBeenCalledWith(parsedData);
      expect(root.contains(map)).toBe(true);
    });
  });

  describe('tile click behavior', () => {
    it('opens modal and initializes booking when clicking a cabana tile', async () => {
      const mapElem = document.createElement('div');
      mapElem.className = 'map-container';

      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 2, 3);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });
      mockedCreateMap.mockReturnValue(mapElem);

      const modal = document.createElement('div');
      mockedOpenModal.mockReturnValue({ element: modal, close: vi.fn() });

      const form = document.createElement('form');
      mockedCreateBookingForm.mockReturnValue({ element: form, onSubmit: vi.fn() });

      await mapPage.init(root);

      tile.click();

      expect(openModal).toHaveBeenCalledTimes(1);
      expect(createBookingForm).toHaveBeenCalledTimes(1);
      expect(bookingController.initBooking).toHaveBeenCalledWith(tile.dataset.id, modal);
    });

    it('ignores clicks outside tiles', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      const event = new PointerEvent('click');
      mapPage.mapElem!.dispatchEvent(event);

      expect(createBookingForm).not.toHaveBeenCalled();
      expect(openModal).not.toHaveBeenCalled();
    });

    it('ignores tiles with invalid IDs', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = 'invalid-id';
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      tile.click();

      expect(createBookingForm).not.toHaveBeenCalled();
      expect(openModal).not.toHaveBeenCalled();
    });
  });

  describe('store updates', () => {
    it('rerenders only the changed cabana tile', async () => {
      const mapElem = document.createElement('div');
      mapElem.className = 'map-container';

      const oldTile = document.createElement('div');
      const cabanaId = createCoordId('cabana', 2, 3);
      oldTile.dataset.id = cabanaId;
      mapElem.appendChild(oldTile);

      const untouchedTile = document.createElement('div');
      untouchedTile.dataset.id = createCoordId('cabana', 5, 5);
      mapElem.appendChild(untouchedTile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });

      const cabana = {
        id: cabanaId,
        x: 2,
        y: 3,
        isReserved: true,
        guestName: null
      };

      const cabanasMap = new Map();
      cabanasMap.set(cabana.id, cabana);

      mockedParseMap.mockReturnValue({ grid: [], cabanas: cabanasMap, roads: new Map() });
      mockedCreateMap.mockReturnValue(mapElem);

      const newTile = document.createElement('div');
      mockedCreateMapTile.mockReturnValue(newTile);

      mockedCabanaStore.getCabanaById.mockReturnValue(cabana);
      mockedCabanaStore.subscribe.mockImplementation(storeCallback => {
        storeCallback({ type: 'cabanaUpdated', cabanaId });
        return () => { }; // unsubscribe
      });

      await mapPage.init(root);

      expect(createMapTile).toHaveBeenCalledTimes(1);
      expect(createMapTile).toHaveBeenCalledWith(
        { asset: MAP_ASSETS.CABANA },
        2,
        3,
        false
      );
      expect(mapElem.contains(oldTile)).toBe(false);
      expect(mapElem.contains(newTile)).toBe(true);
      expect(mapElem.contains(untouchedTile)).toBe(true);
    });

    it('ignores store updates when mapElem is missing', () => {
      mapPage.mapElem = null;

      mapPage.onCabanaUpdate({ type: 'cabanaUpdated', cabanaId: 'cabana-1:1' });

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores non-cabanaUpdated events', () => {
      mapPage.mapElem = document.createElement('div');

      mapPage.onCabanaUpdate({ type: 'somethingElse', cabanaId: 'cabana-1:1' } as any);

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores updates for unknown cabanas', () => {
      mapPage.mapElem = document.createElement('div');

      mockedCabanaStore.getCabanaById.mockReturnValue(null);

      mapPage.onCabanaUpdate({ type: 'cabanaUpdated', cabanaId: 'cabana-1:1' });

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores updates when tile does not exist in DOM', () => {
      mapPage.mapElem = document.createElement('div');
      const cabanaId = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id: cabanaId,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      mapPage.onCabanaUpdate({ type: 'cabanaUpdated', cabanaId });

      expect(createMapTile).not.toHaveBeenCalled();
    });
  });

  describe('processing state', () => {
    it('ignores setProcessing when mapElem is missing', () => {
      mapPage.mapElem = null;

      mapPage.setProcessing(true);

      expect(() => mapPage.setProcessing(true)).not.toThrow();
    });

    it('adds disabled class when isProcessing is true', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });

      const mapElem = document.createElement('div');
      mapElem.className = 'map-container';

      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      mapPage.setProcessing(true);

      expect(mapElem.classList.contains('disabled')).toBe(true);
    });

    it('removes disabled class when isProcessing is false', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({ grid: [], cabanas: new Map(), roads: new Map() });

      const mapElem = document.createElement('div');
      mapElem.className = 'map-container';

      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      mapPage.setProcessing(true);

      mapPage.setProcessing(false);

      expect(mapElem.classList.contains('disabled')).toBe(false);
    });
  });
});
