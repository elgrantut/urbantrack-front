import { beforeEach, describe, expect, it } from "vitest";

import { useFilterStore } from "./filterStore";

// Reset the store to a clean state before every test so tests don't bleed into
// each other (Zustand stores are module-level singletons).
beforeEach(() => {
  useFilterStore.setState({
    assetFilters: {},
    incidentFilters: {},
    vehicleFilters: {},
  });
});

// ── assetFilters ──────────────────────────────────────────────────────────────

describe("assetFilters", () => {
  it("starts with empty filters", () => {
    expect(useFilterStore.getState().assetFilters).toEqual({});
  });

  it("updates asset filters", () => {
    useFilterStore.getState().setAssetFilters({ status: "OK", type: "BIN" });
    expect(useFilterStore.getState().assetFilters).toEqual({ status: "OK", type: "BIN" });
  });

  it("resets asset filters independently", () => {
    useFilterStore.setState({ assetFilters: { status: "DAMAGED" } });
    useFilterStore.getState().resetAssetFilters();
    expect(useFilterStore.getState().assetFilters).toEqual({});
  });

  it("preserves other filters when resetting asset filters", () => {
    useFilterStore.setState({
      assetFilters: { status: "OK" },
      vehicleFilters: { status: "ACTIVE" },
    });
    useFilterStore.getState().resetAssetFilters();
    expect(useFilterStore.getState().vehicleFilters).toEqual({ status: "ACTIVE" });
  });
});

// ── incidentFilters ───────────────────────────────────────────────────────────

describe("incidentFilters", () => {
  it("starts with empty filters", () => {
    expect(useFilterStore.getState().incidentFilters).toEqual({});
  });

  it("updates incident filters", () => {
    useFilterStore.getState().setIncidentFilters({ status: "REPORTED", zoneId: "zone-1" });
    expect(useFilterStore.getState().incidentFilters).toEqual({
      status: "REPORTED",
      zoneId: "zone-1",
    });
  });

  it("resets incident filters independently", () => {
    useFilterStore.setState({ incidentFilters: { status: "IN_PROGRESS", zoneId: "zone-2" } });
    useFilterStore.getState().resetIncidentFilters();
    expect(useFilterStore.getState().incidentFilters).toEqual({});
  });
});

// ── vehicleFilters ────────────────────────────────────────────────────────────

describe("vehicleFilters", () => {
  it("starts with empty filters", () => {
    expect(useFilterStore.getState().vehicleFilters).toEqual({});
  });

  it("updates vehicle filters", () => {
    useFilterStore.getState().setVehicleFilters({ status: "ACTIVE", type: "TRUCK" });
    expect(useFilterStore.getState().vehicleFilters).toEqual({
      status: "ACTIVE",
      type: "TRUCK",
    });
  });

  it("updates vehicle zoneId filter", () => {
    useFilterStore.getState().setVehicleFilters({ zoneId: "zone-3" });
    expect(useFilterStore.getState().vehicleFilters.zoneId).toBe("zone-3");
  });

  it("resets vehicle filters independently", () => {
    useFilterStore.setState({
      vehicleFilters: { status: "MAINTENANCE", type: "VAN", zoneId: "z1" },
    });
    useFilterStore.getState().resetVehicleFilters();
    expect(useFilterStore.getState().vehicleFilters).toEqual({});
  });
});

// ── resetAllFilters ───────────────────────────────────────────────────────────

describe("resetAllFilters", () => {
  it("clears all three filter groups simultaneously", () => {
    useFilterStore.setState({
      assetFilters: { status: "OK" },
      incidentFilters: { status: "REPORTED", zoneId: "z1" },
      vehicleFilters: { type: "TRUCK" },
    });

    useFilterStore.getState().resetAllFilters();

    const { assetFilters, incidentFilters, vehicleFilters } = useFilterStore.getState();
    expect(assetFilters).toEqual({});
    expect(incidentFilters).toEqual({});
    expect(vehicleFilters).toEqual({});
  });
});
