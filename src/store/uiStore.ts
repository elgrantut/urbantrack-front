import { create } from "zustand";

type UiStore = {
  selectedMarkerId: string | null;
  selectedZoneId: string | null;
  sheetOpen: boolean;

  setSelectedMarkerId: (id: string | null) => void;
  setSelectedZoneId: (id: string | null) => void;
  setSheetOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  selectedMarkerId: null,
  selectedZoneId: null,
  sheetOpen: false,

  setSelectedMarkerId: (id) => set({ selectedMarkerId: id }),
  setSelectedZoneId: (id) => set({ selectedZoneId: id }),
  setSheetOpen: (open) => set({ sheetOpen: open }),
}));
