import { create } from "zustand";

import type { AssetFilters } from "@/api/assets";
import type { IncidentFilters } from "@/api/incidents";
import type { VehicleFilters } from "@/api/vehicles";

type FilterStore = {
  assetFilters: AssetFilters;
  incidentFilters: IncidentFilters;
  vehicleFilters: VehicleFilters;

  setAssetFilters: (filters: AssetFilters) => void;
  setIncidentFilters: (filters: IncidentFilters) => void;
  setVehicleFilters: (filters: VehicleFilters) => void;

  resetAssetFilters: () => void;
  resetIncidentFilters: () => void;
  resetVehicleFilters: () => void;
  resetAllFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  assetFilters: {},
  incidentFilters: {},
  vehicleFilters: {},

  setAssetFilters: (filters) => set({ assetFilters: filters }),
  setIncidentFilters: (filters) => set({ incidentFilters: filters }),
  setVehicleFilters: (filters) => set({ vehicleFilters: filters }),

  resetAssetFilters: () => set({ assetFilters: {} }),
  resetIncidentFilters: () => set({ incidentFilters: {} }),
  resetVehicleFilters: () => set({ vehicleFilters: {} }),
  resetAllFilters: () => set({ assetFilters: {}, incidentFilters: {}, vehicleFilters: {} }),
}));
