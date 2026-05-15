import { fetchMap } from "@api/fetchMap";
import { bookingController } from "@app/controllers/bookingController";
import { cabanaStore } from "@app/store/cabanaStore";
import { parseMap } from "@features/map/parseMap";
import { createBookingForm } from "@ui/form/createBookingForm";
import { createMap } from "@ui/map/createMap";
import { createMapTile } from "@ui/mapTile/createMapTile";
import { openModal } from "@ui/modal/openModal";
import { checkIsCabanaId } from "@features/map/checkIsCabanaId";
import { injectSpriteOnce } from '@ui/sprite/injectSpriteOnce';
import { notify } from "@ui/notification/notify";
import { MAP_ASSETS } from "@constants/api.constants";
import type { CabanaMapEvent } from "@models/map.types";
import styles from '@ui/pages/mapPage.module.css';

export const mapPage = {
  root: null as HTMLElement | null,
  mapElem: null as HTMLElement | null,

  async init(root: HTMLElement): Promise<void> {
    this.root = root;

    await injectSpriteOnce('/assets.svg');

    const title = document.createElement('h1');
    title.textContent = 'Welcome to the Overlook Hotel';

    const description = document.createElement('p');
    description.textContent = 'Reserve a cabana for your booked room';

    const container = document.createElement('div');
    container.className = styles.mapContainer;

    const mapPageContainer = document.createElement('div');
    mapPageContainer.className = styles.mapPageContainer;

    mapPageContainer.append(title, description, container);
    root.appendChild(mapPageContainer);

    const response = await fetchMap();
    const parsedData = parseMap(response);

    this.mapElem = createMap(parsedData);
    container.appendChild(this.mapElem);

    this.mapElem.addEventListener('click', this.onTileClick.bind(this));
    this.mapElem.addEventListener('keydown', this.onTileKeyDown.bind(this));

    cabanaStore.init(parsedData.cabanas);
    cabanaStore.subscribe(this.onCabanaUpdate.bind(this));

    bookingController.registerMapControls(
      () => this.setProcessing(true),
      () => this.setProcessing(false)
    );
  },

  onTileClick(event: Event): void {
    if (bookingController.isProcessing) {
      return;
    }

    const target = event.target as HTMLElement;

    const tile: HTMLElement | null = target?.closest('[data-id]');

    if (!tile) {
      return;
    }

    const tileId = tile.getAttribute('data-id');
    if (!checkIsCabanaId(tileId)) {
      return;
    }

    const cabanaId = tileId;

    const cabana = cabanaStore.getCabanaById(cabanaId);
    if (!cabana) {
      notify('Cabana not found!', true);
    }
    if (cabana?.isReserved) {
      return;
    }

    const form = createBookingForm();
    const modal = openModal(form.element);

    form.onSubmit((result) => {
      if (!result.isOk) {
        notify(result.error.message, true);
        return;
      }

      bookingController.handleFormSubmit(result.payload);
    });

    bookingController.initBooking(cabanaId, modal);
  },

  onTileKeyDown(event: KeyboardEvent): void {
    if (bookingController.isProcessing) {
      return;
    }

    // Only act on Enter or Space
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    this.onTileClick(event);
  },

  onCabanaUpdate(event: CabanaMapEvent): void {
    if (!this.mapElem) {
      return;
    }

    if (event.type !== 'cabanaUpdated') {
      return;
    }

    const cabana = cabanaStore.getCabanaById(event.cabanaId);
    if (!cabana) {
      return;
    }

    const oldTile = this.mapElem.querySelector(`[data-id="${cabana.id}"]`);
    if (!oldTile) {
      return;
    }

    const newTile = createMapTile(
      { asset: MAP_ASSETS.CABANA },
      cabana.x,
      cabana.y,
      !cabana.isReserved
    );

    oldTile.replaceWith(newTile);
  },

  setProcessing(isProcessing: boolean): void {
    if (!this.mapElem) {
      return;
    }

    this.mapElem.classList.toggle(styles.disabled, isProcessing);
  }
};
