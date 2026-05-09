import { fetchMap } from "@api/fetchMap";
import { bookingController } from "@app/controllers/bookingController";
import { cabanaStore } from "@app/store/cabanaStore";
import { parseMap } from "@features/map/parseMap";
import { createBookingForm } from "@ui/form/createBookingForm";
import { createMap } from "@ui/map/createMap";
import { createMapTile } from "@ui/mapTile/createMapTile";
import { openModal } from "@ui/modal/openModal";
import { checkIsCabanaId } from "@features/map/checkIsCabanaId";
import { MAP_ASSETS } from "@constants/api.constants";
import type { CabanaMapEvent } from "@models/map.types";

export const mapPage = {
  root: null as HTMLElement | null,
  mapElem: null as HTMLElement | null,

  async init(root: HTMLElement): Promise<void> {
    this.root = root;

    const title = document.createElement('h1');
    title.textContent = 'Welcome to the Overlook Hotel';

    const description = document.createElement('p');
    description.textContent = 'Reserve a cabana for your booked room';

    const container = document.createElement('div');
    container.className = 'map-container';

    root.append(title, description, container);

    const response = await fetchMap();
    const parsedData = parseMap(response);

    this.mapElem = createMap(parsedData);
    container.appendChild(this.mapElem);

    this.mapElem.addEventListener('click', this.onTileClick.bind(this));

    cabanaStore.subscribe(this.onCabanaUpdate.bind(this));
  },

  onTileClick(event: Event): void {
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

    const form = createBookingForm();
    const modal = openModal(form.element);

    bookingController.initBooking(cabanaId, modal.element);
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

    this.mapElem.classList.toggle('disabled', isProcessing);
  }
};
