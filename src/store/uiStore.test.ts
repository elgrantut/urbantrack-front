import { beforeEach, describe, expect, it } from "vitest";

import { useUiStore } from "./uiStore";

// Reset the store before every test to prevent state leakage between tests.
beforeEach(() => {
  useUiStore.setState({
    selectedMarkerId: null,
    selectedZoneId: null,
    sheetOpen: false,
  });
});

// ── initial state ─────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("has null selections and a closed sheet", () => {
    const { selectedMarkerId, selectedZoneId, sheetOpen } = useUiStore.getState();
    expect(selectedMarkerId).toBeNull();
    expect(selectedZoneId).toBeNull();
    expect(sheetOpen).toBe(false);
  });
});

// ── selectedMarkerId ──────────────────────────────────────────────────────────

describe("selectedMarkerId", () => {
  it("selects a marker by id", () => {
    useUiStore.getState().setSelectedMarkerId("marker-abc");
    expect(useUiStore.getState().selectedMarkerId).toBe("marker-abc");
  });

  it("clears the selected marker", () => {
    useUiStore.setState({ selectedMarkerId: "marker-abc" });
    useUiStore.getState().setSelectedMarkerId(null);
    expect(useUiStore.getState().selectedMarkerId).toBeNull();
  });

  it("replaces the selected marker when a new one is set", () => {
    useUiStore.setState({ selectedMarkerId: "marker-1" });
    useUiStore.getState().setSelectedMarkerId("marker-2");
    expect(useUiStore.getState().selectedMarkerId).toBe("marker-2");
  });
});

// ── selectedZoneId ────────────────────────────────────────────────────────────

describe("selectedZoneId", () => {
  it("selects a zone by id", () => {
    useUiStore.getState().setSelectedZoneId("zone-north");
    expect(useUiStore.getState().selectedZoneId).toBe("zone-north");
  });

  it("clears the selected zone", () => {
    useUiStore.setState({ selectedZoneId: "zone-north" });
    useUiStore.getState().setSelectedZoneId(null);
    expect(useUiStore.getState().selectedZoneId).toBeNull();
  });
});

// ── sheetOpen ─────────────────────────────────────────────────────────────────

describe("sheetOpen", () => {
  it("opens the sheet", () => {
    useUiStore.getState().setSheetOpen(true);
    expect(useUiStore.getState().sheetOpen).toBe(true);
  });

  it("closes the sheet", () => {
    useUiStore.setState({ sheetOpen: true });
    useUiStore.getState().setSheetOpen(false);
    expect(useUiStore.getState().sheetOpen).toBe(false);
  });

  it("does not change other state when toggling the sheet", () => {
    useUiStore.setState({ selectedMarkerId: "marker-1", selectedZoneId: "zone-1" });
    useUiStore.getState().setSheetOpen(true);
    expect(useUiStore.getState().selectedMarkerId).toBe("marker-1");
    expect(useUiStore.getState().selectedZoneId).toBe("zone-1");
  });
});
