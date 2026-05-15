import { describe, it, expect, beforeEach, vi } from "vitest";

import { getNotificationContainer } from "@ui/notification/getNotificationContainer";

vi.mock("@ui/notification/notification.module.css", () => ({
  default: {
    notificationContainer: "notification-container"
  }
}));

describe("getNotificationContainer()", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a new container when none exists", () => {
    const container = getNotificationContainer();

    expect(document.body.contains(container)).toBe(true);
    expect(container.classList.contains("notification-container")).toBe(true);
  });

  it("returns the same container when called multiple times", () => {
    const container1 = getNotificationContainer();
    const container2 = getNotificationContainer();

    expect(container1 === container2).toBe(true);
  });

  it("reuses existing container from DOM", () => {
    const existingContainer = document.createElement("div");
    existingContainer.className = "notification-container";
    document.body.appendChild(existingContainer);

    const container = getNotificationContainer();

    expect(existingContainer === container).toBe(true);
  });

  it("container is appended to body only once", () => {
    getNotificationContainer();
    getNotificationContainer();
    getNotificationContainer();

    const allContainers = document.body.querySelectorAll(".notification-container");
    expect(allContainers.length).toBe(1);
  });
});
