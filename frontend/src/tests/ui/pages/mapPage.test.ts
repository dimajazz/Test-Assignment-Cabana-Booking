import { describe, it, beforeEach, expect, vi, Mock } from 'vitest';

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
import { injectSpriteOnce } from '@ui/sprite/injectSpriteOnce';
import { notify } from '@ui/notification/notify';
import { MAP_ASSETS } from '@constants/api.constants';

vi.mock('@ui/pages/mapPage.module.css', () => ({
  default: {
    mapContainer: 'mapContainer',
    mapPageContainer: 'mapPageContainer',
    disabled: 'disabled'
  }
}));

vi.mock('@api/fetchMap');
vi.mock('@features/map/parseMap');
vi.mock('@ui/map/createMap');
vi.mock('@ui/mapTile/createMapTile');
vi.mock('@app/store/cabanaStore');
vi.mock('@ui/modal/openModal');
vi.mock('@ui/form/createBookingForm');
vi.mock('@ui/sprite/injectSpriteOnce');
vi.mock('@ui/notification/notify');
vi.mock('@app/controllers/bookingController', () => ({
  bookingController: {
    registerMapControls: vi.fn(),
    initBooking: vi.fn(),
    handleFormSubmit: vi.fn(),
    // mock the getter
    get isProcessing() {
      return false;
    }
  }
}));

const mockedFetchMap = vi.mocked(fetchMap);
const mockedParseMap = vi.mocked(parseMap);
const mockedCreateMap = vi.mocked(createMap);
const mockedCreateMapTile = vi.mocked(createMapTile);
const mockedOpenModal = vi.mocked(openModal);
const mockedCreateBookingForm = vi.mocked(createBookingForm);
const mockedCabanaStore = vi.mocked(cabanaStore);
const mockedInjectSpriteOnce = vi.mocked(injectSpriteOnce);
const mockedNotify = vi.mocked(notify);

describe('mapPage', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    vi.clearAllMocks();

    vi.spyOn(bookingController, 'isProcessing', 'get').mockReturnValue(false);
  });

  describe('initial rendering', () => {
    it('renders static layout', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      expect(root.querySelector('h1')?.textContent).toBe(
        'Welcome to the Overlook Hotel'
      );
      expect(
        root.querySelector('p')?.textContent
      ).toBe('Reserve a cabana for your booked room');
      expect(root.querySelector('.mapContainer')).toBeTruthy();
    });
  });

  describe('map loading', () => {
    it('fetches map data, parses it, and renders map', async () => {
      const response = { grid: [], cabanas: [] };
      const parsedData = {
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      };
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

    it('calls injectSpriteOnce before rendering UI', async () => {
      mockedInjectSpriteOnce.mockResolvedValue(undefined);
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      expect(mockedInjectSpriteOnce).toHaveBeenCalledWith('/assets.svg');
    });
  });

  describe('tile click behavior', () => {
    it('opens modal and initializes booking when clicking a cabana tile', async () => {
      const mapElem = document.createElement('div');

      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 2, 3);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const modal = document.createElement('div');
      mockedOpenModal.mockReturnValue({ element: modal, close: vi.fn() });

      const form = {
        element: document.createElement('form'),
        onSubmit: vi.fn()
      };
      mockedCreateBookingForm.mockReturnValue(form);

      const id = createCoordId('cabana', 2, 3);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 2,
        y: 3,
        isReserved: false,
        guestName: null
      });

      await mapPage.init(root);

      tile.click();

      expect(createBookingForm).toHaveBeenCalledTimes(1);
      expect(openModal).toHaveBeenCalledTimes(1);
      expect(bookingController.initBooking).toHaveBeenCalledWith(
        tile.dataset.id,
        { element: modal, close: expect.any(Function) }
      );
    });

    it('does not open modal when bookingController.isProcessing = true', async () => {
      vi.spyOn(bookingController, 'isProcessing', 'get').mockReturnValue(true);

      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      tile.click();

      expect(openModal).not.toHaveBeenCalled();
      expect(createBookingForm).not.toHaveBeenCalled();
    });

    it('ignores clicks outside tiles', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      mapPage.mapElem!.dispatchEvent(new PointerEvent('click'));

      expect(createBookingForm).not.toHaveBeenCalled();
      expect(openModal).not.toHaveBeenCalled();
    });

    it('ignores tiles with invalid IDs', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = 'invalid-id';
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      tile.click();

      expect(createBookingForm).not.toHaveBeenCalled();
      expect(openModal).not.toHaveBeenCalled();
    });

    it('does not open modal for reserved cabanas', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const id = createCoordId('cabana', 2, 3);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 1,
        y: 1,
        isReserved: true,
        guestName: 'John'
      });

      await mapPage.init(root);

      tile.click();

      expect(openModal).not.toHaveBeenCalled();
    });

    it('notifies when cabana is missing', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      mockedCabanaStore.getCabanaById.mockReturnValue(null);

      await mapPage.init(root);

      tile.click();

      expect(mockedNotify).toHaveBeenCalledWith('Cabana not found!', true);
    });

    it('wires form.onSubmit and calls handleFormSubmit only when result.isOk', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const id = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      const modal = { element: document.createElement('div'), close: vi.fn() };
      mockedOpenModal.mockReturnValue(modal);

      let submitCallback: any = null;
      mockedCreateBookingForm.mockReturnValue({
        element: document.createElement('form'),
        onSubmit: (cb: any) => (submitCallback = cb)
      });

      await mapPage.init(root);

      tile.click();

      submitCallback({ isOk: false, error: { message: 'Bad' } });
      expect(mockedNotify).toHaveBeenCalledWith('Bad', true);
      expect(bookingController.handleFormSubmit).not.toHaveBeenCalled();

      submitCallback({ isOk: true, payload: { foo: 1 } });
      expect(bookingController.handleFormSubmit).toHaveBeenCalledWith({
        foo: 1
      });
    });
  });

  describe('keyboard behavior', () => {
    it('delegates Enter key to onTileClick', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const id = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      mockedOpenModal.mockReturnValue({
        element: document.createElement('div'),
        close: vi.fn()
      });

      mockedCreateBookingForm.mockReturnValue({
        element: document.createElement('form'),
        onSubmit: vi.fn()
      });

      await mapPage.init(root);

      tile.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(openModal).toHaveBeenCalled();
    });

    it('delegates Space key to onTileClick', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const id = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      mockedOpenModal.mockReturnValue({
        element: document.createElement('div'),
        close: vi.fn()
      });

      mockedCreateBookingForm.mockReturnValue({
        element: document.createElement('form'),
        onSubmit: vi.fn()
      });

      await mapPage.init(root);

      tile.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      );

      expect(openModal).toHaveBeenCalled();
    });

    it('ignores other keys', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      tile.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'A', bubbles: true })
      );

      expect(openModal).not.toHaveBeenCalled();
    });
  });

  describe('store updates', () => {
    it('rerenders only the changed cabana tile', async () => {
      const mapElem = document.createElement('div');

      const cabanaId = createCoordId('cabana', 2, 3);

      const oldTile = document.createElement('div');
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

      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: cabanasMap,
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const newTile = document.createElement('div');
      mockedCreateMapTile.mockReturnValue(newTile);

      mockedCabanaStore.getCabanaById.mockReturnValue(cabana);
      mockedCabanaStore.subscribe.mockImplementation((cb) => {
        cb({ type: 'cabanaUpdated', cabanaId });
        return () => { };
      });

      await mapPage.init(root);

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

    it('ignores updates when mapElem is missing', () => {
      mapPage.mapElem = null;

      mapPage.onCabanaUpdate({
        type: 'cabanaUpdated',
        cabanaId: 'cabana-1:1'
      });

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores non-cabanaUpdated events', () => {
      mapPage.mapElem = document.createElement('div');

      mapPage.onCabanaUpdate({
        type: 'somethingElse',
        cabanaId: 'cabana-1:1'
      } as any);

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores updates for unknown cabanas', () => {
      mapPage.mapElem = document.createElement('div');

      mockedCabanaStore.getCabanaById.mockReturnValue(null);

      mapPage.onCabanaUpdate({
        type: 'cabanaUpdated',
        cabanaId: 'cabana-1:1'
      });

      expect(createMapTile).not.toHaveBeenCalled();
    });

    it('ignores updates when tile does not exist', () => {
      mapPage.mapElem = document.createElement('div');

      const cabanaId = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id: cabanaId,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      mapPage.onCabanaUpdate({
        type: 'cabanaUpdated',
        cabanaId
      });

      expect(createMapTile).not.toHaveBeenCalled();
    });
  });

  describe('processing state', () => {
    it('ignores setProcessing when mapElem is missing', () => {
      mapPage.mapElem = null;

      expect(() => mapPage.setProcessing(true)).not.toThrow();
    });

    it('adds disabled class when isProcessing = true', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });

      const mapElem = document.createElement('div');
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      mapPage.setProcessing(true);

      expect(mapElem.classList.contains('disabled')).toBe(true);
    });

    it('removes disabled class when isProcessing = false', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });

      const mapElem = document.createElement('div');
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      mapPage.setProcessing(true);
      mapPage.setProcessing(false);

      expect(mapElem.classList.contains('disabled')).toBe(false);
    });

    it('processing state prevents tile interaction', async () => {
      const mapElem = document.createElement('div');
      const tile = document.createElement('div');
      tile.dataset.id = createCoordId('cabana', 1, 1);
      mapElem.appendChild(tile);

      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(mapElem);

      const id = createCoordId('cabana', 1, 1);

      mockedCabanaStore.getCabanaById.mockReturnValue({
        id,
        x: 1,
        y: 1,
        isReserved: false,
        guestName: null
      });

      await mapPage.init(root);

      vi.spyOn(bookingController, 'isProcessing', 'get').mockReturnValue(true);

      tile.click();

      expect(openModal).not.toHaveBeenCalled();
      expect(createBookingForm).not.toHaveBeenCalled();
    });
  });

  describe('registerMapControls integration', () => {
    it('registers map controls on init', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      expect(bookingController.registerMapControls).toHaveBeenCalledTimes(1);

      const registerMock = bookingController.registerMapControls as Mock;
      const [disableFn, enableFn] = registerMock.mock.calls[0];

      expect(typeof disableFn).toBe('function');
      expect(typeof enableFn).toBe('function');
    });

    it('registered disableFn calls setProcessing(true)', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });

      const mapElem = document.createElement('div');
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      const registerMock = bookingController.registerMapControls as Mock;
      const [disableFn] = registerMock.mock.calls[0];

      disableFn();

      expect(mapElem.classList.contains('disabled')).toBe(true);
    });

    it('registered enableFn calls setProcessing(false)', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });

      const mapElem = document.createElement('div');
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      const registerMock = bookingController.registerMapControls as Mock;
      const [, enableFn] = registerMock.mock.calls[0];

      mapElem.classList.add('disabled');

      enableFn();

      expect(mapElem.classList.contains('disabled')).toBe(false);
    });
  });

  describe('final sanity checks', () => {
    it('stores root and mapElem after init', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });

      const mapElem = document.createElement('div');
      mockedCreateMap.mockReturnValue(mapElem);

      await mapPage.init(root);

      expect(mapPage.root).toBe(root);
      expect(mapPage.mapElem).toBe(mapElem);
    });

    it('subscribes to cabanaStore updates', async () => {
      mockedFetchMap.mockResolvedValue({ grid: [], cabanas: [] });
      mockedParseMap.mockReturnValue({
        grid: [],
        cabanas: new Map(),
        roads: new Map()
      });
      mockedCreateMap.mockReturnValue(document.createElement('div'));

      await mapPage.init(root);

      expect(mockedCabanaStore.subscribe).toHaveBeenCalledTimes(1);
      expect(typeof mockedCabanaStore.subscribe.mock.calls[0][0]).toBe(
        'function'
      );
    });
  });
});
