import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { bookingController } from "@app/controllers/bookingController";
import { cabanaStore } from "@app/store/cabanaStore";
import { notify } from "@ui/notification/notify";
import { reserveCabana } from "@api/reserveCabana";
import { createCoordId } from "@features/map/createCoordId";

vi.mock("@app/store/cabanaStore");
vi.mock("@ui/notification/notify");
vi.mock("@api/reserveCabana");

describe("bookingController", () => {
  let disableMap: () => void;
  let enableMap: () => void;

  beforeEach(() => {
    vi.clearAllMocks();

    disableMap = vi.fn();
    enableMap = vi.fn();

    bookingController.reset();
    bookingController.registerMapControls(disableMap, enableMap);
  });

  describe("initBooking", () => {
    it("stores cabanaId and modal handlers", () => {
      const cabanaId = createCoordId("cabana", 2, 3);

      const modal = {
        element: document.createElement("div"),
        close: vi.fn()
      };

      bookingController.initBooking(cabanaId, modal);

      expect(bookingController.selectedCabanaId).toBe(cabanaId);
    });
  });

  describe("reset", () => {
    it("resets selectedCabanaId to null", () => {
      const cabanaId = createCoordId("cabana", 2, 3);
      const modal = { element: document.createElement("div"), close: vi.fn() };

      bookingController.initBooking(cabanaId, modal);
      bookingController.reset();

      expect(bookingController.selectedCabanaId).toBeNull();
    });

    it("restores disableMap and enableMap callbacks", async () => {
      const disableMock = vi.fn();
      const enableMock = vi.fn();

      bookingController.registerMapControls(disableMock, enableMock);
      bookingController.reset();

      // required state for handleFormSubmit()
      (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

      (reserveCabana as Mock).mockResolvedValue({
        message: "OK",
        reservation: {
          cabana: { x: 1, y: 2 },
          guest: { room: "101", guestName: "Danny" }
        }
      });

      const modalElement = document.createElement("div");
      const modalClose = vi.fn();

      bookingController.initBooking("cabana-1:2", {
        element: modalElement,
        close: modalClose
      });

      await bookingController.handleFormSubmit({ room: "101", guestName: "Danny" });

      expect(disableMock).toHaveBeenCalled();
      expect(enableMock).toHaveBeenCalled();
    });

    it("reset does not throw when state was never initialized", () => {
      expect(() => bookingController.reset()).not.toThrow();
    });
  });

  describe("handleFormSubmit", () => {
    describe("error cases", () => {
      it("notifies error when no cabana selected", async () => {
        await bookingController.handleFormSubmit({
          room: "000",
          guestName: "Jack"
        });

        expect(notify).toHaveBeenCalledWith("No cabana selected!", true);
        expect(reserveCabana).not.toHaveBeenCalled();
      });

      it("notifies error when cabana not found", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue(null);

        await bookingController.handleFormSubmit({
          room: "404",
          guestName: "Jack"
        });

        expect(notify).toHaveBeenCalledWith("Cabana not found!", true);
        expect(reserveCabana).not.toHaveBeenCalled();
      });

      it("disables map, closes modal, notifies error, enables map", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        (reserveCabana as Mock).mockRejectedValue(new Error("fail"));

        await bookingController.handleFormSubmit({
          room: "237",
          guestName: "Jack"
        });

        expect(disableMap).toHaveBeenCalled();
        expect(modal.close).toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith("fail", true);
        expect(enableMap).toHaveBeenCalled();
      });

      it("notifies default error message when error has no message", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        (reserveCabana as Mock).mockRejectedValue({});

        await bookingController.handleFormSubmit({
          room: "237",
          guestName: "Jack"
        });

        expect(notify).toHaveBeenCalledWith("Reservation failed!", true);
      });
    });

    describe("successful request", () => {
      it("closes modal before sending request", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        (reserveCabana as Mock).mockResolvedValue({
          message: "OK",
          reservation: {
            cabana: { x: 1, y: 2 },
            guest: { room: "237", guestName: "Jack" }
          }
        });

        await bookingController.handleFormSubmit({
          room: "237",
          guestName: "Jack"
        });

        expect(modal.close).toHaveBeenCalled();
      });

      it("notifies that reservation request is being sent", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        (cabanaStore.getCabanaById as Mock).mockReturnValue({ x: 1, y: 2 });

        (reserveCabana as Mock).mockResolvedValue({
          message: "OK",
          reservation: {
            cabana: { x: 1, y: 2 },
            guest: { room: "237", guestName: "Jack" }
          }
        });

        await bookingController.handleFormSubmit({
          room: "237",
          guestName: "Jack"
        });

        expect(notify).toHaveBeenCalledWith(
          "Sending reservation request...",
          false,
          2500
        );
      });

      it("disables map, calls API, updates store, enables map, resets controller", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);
        const modal = { element: document.createElement("div"), close: vi.fn() };

        bookingController.initBooking(cabanaId, modal);

        const guest = { room: "237", guestName: "Jack" };
        const reservation = {
          cabana: { x: 1, y: 2 },
          guest
        };

        (cabanaStore.getCabanaById as Mock).mockReturnValue({
          x: 1,
          y: 2
        });

        (reserveCabana as Mock).mockResolvedValue({
          message: "OK",
          reservation
        });

        await bookingController.handleFormSubmit(guest);

        expect(disableMap).toHaveBeenCalled();
        expect(modal.close).toHaveBeenCalled();
        expect(reserveCabana).toHaveBeenCalledWith(reservation);
        expect(cabanaStore.updateCabana).toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith("OK", false);
        expect(enableMap).toHaveBeenCalled();
        expect(bookingController.selectedCabanaId).toBeNull();
      });

      it("handles success when modalElement is null", async () => {
        const cabanaId = createCoordId("cabana", 2, 3);

        // modal = null
        bookingController.initBooking(cabanaId, {
          element: null as any,
          close: vi.fn()
        });

        (cabanaStore.getCabanaById as Mock).mockReturnValue({
          x: 1,
          y: 2
        });

        (reserveCabana as Mock).mockResolvedValue({
          message: "OK",
          reservation: {
            cabana: { x: 1, y: 2 },
            guest: { room: "237", guestName: "Jack" }
          }
        });

        await bookingController.handleFormSubmit({
          room: "237",
          guestName: "Jack"
        });

        expect(notify).toHaveBeenCalledWith("OK", false);
        expect(cabanaStore.updateCabana).toHaveBeenCalled();
      });
    });
  });
});
