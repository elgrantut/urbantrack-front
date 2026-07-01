import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFilterStore } from "@/store/filterStore";

import { VehicleFilters } from "./VehicleFilters";

// Mock useZones so ZoneSelector renders without making any HTTP calls.
// The mock returns one zone to verify the selector works, plus the loading
// flag so the trigger is not disabled.
vi.mock("@/hooks/useZones", () => ({
  useZones: () => ({
    data: [{ id: "zone-1", name: "Zone North" }],
    isLoading: false,
  }),
  useZoneById: () => ({ data: null, isLoading: false }),
}));

// Provide a fresh QueryClient for each test (zones hook is mocked so no real
// queries fire, but QueryClientProvider is still required by the component tree).
function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  // Reset all filters before each test to keep tests independent.
  useFilterStore.setState({ vehicleFilters: {}, assetFilters: {}, incidentFilters: {} });
});

// ── rendering ─────────────────────────────────────────────────────────────────

describe("VehicleFilters — rendering", () => {
  it("renders the status, type and zone selector placeholders", () => {
    render(<VehicleFilters />, { wrapper: createWrapper() });

    expect(screen.getByText("All statuses")).toBeInTheDocument();
    expect(screen.getByText("All types")).toBeInTheDocument();
    expect(screen.getByText("All zones")).toBeInTheDocument();
  });

  it("does not render the clear button when no filters are active", () => {
    render(<VehicleFilters />, { wrapper: createWrapper() });

    expect(screen.queryByRole("button", { name: /clear filters/i })).not.toBeInTheDocument();
  });
});

// ── clear button visibility ───────────────────────────────────────────────────

describe("VehicleFilters — clear button", () => {
  it("shows the clear button when a status filter is active", () => {
    useFilterStore.setState({ vehicleFilters: { status: "ACTIVE" } });

    render(<VehicleFilters />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /clear filters/i })).toBeInTheDocument();
  });

  it("shows the clear button when a type filter is active", () => {
    useFilterStore.setState({ vehicleFilters: { type: "TRUCK" } });

    render(<VehicleFilters />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /clear filters/i })).toBeInTheDocument();
  });

  it("shows the clear button when a zone filter is active", () => {
    useFilterStore.setState({ vehicleFilters: { zoneId: "zone-1" } });

    render(<VehicleFilters />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /clear filters/i })).toBeInTheDocument();
  });
});

// ── filter interaction ────────────────────────────────────────────────────────

describe("VehicleFilters — filter interaction", () => {
  it("resets vehicle filters when the clear button is clicked", async () => {
    useFilterStore.setState({
      vehicleFilters: { status: "ACTIVE", type: "TRUCK", zoneId: "zone-1" },
    });

    render(<VehicleFilters />, { wrapper: createWrapper() });

    await userEvent.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(useFilterStore.getState().vehicleFilters).toEqual({});
  });

  it("does not affect asset or incident filters when clearing vehicle filters", async () => {
    useFilterStore.setState({
      vehicleFilters: { status: "ACTIVE" },
      assetFilters: { status: "OK" },
      incidentFilters: { status: "REPORTED" },
    });

    render(<VehicleFilters />, { wrapper: createWrapper() });

    await userEvent.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(useFilterStore.getState().vehicleFilters).toEqual({});
    // Other filter groups must remain untouched
    expect(useFilterStore.getState().assetFilters).toEqual({ status: "OK" });
    expect(useFilterStore.getState().incidentFilters).toEqual({ status: "REPORTED" });
  });

  it("opens the status dropdown and selects a status", async () => {
    const user = userEvent.setup();
    render(<VehicleFilters />, { wrapper: createWrapper() });

    // The SelectTrigger renders as a button; find by its visible placeholder text.
    const statusTrigger = screen.getByText("All statuses").closest("button")!;
    await user.click(statusTrigger);

    // Radix portals the listbox to <body>; wait for the option to appear.
    const activeOption = await screen.findByRole("option", { name: /^active$/i });
    await user.click(activeOption);

    expect(useFilterStore.getState().vehicleFilters.status).toBe("ACTIVE");
  });
});
