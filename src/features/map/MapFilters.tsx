import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { ZoneSelector } from "@/components/common/ZoneSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore } from "@/store/filterStore";
import type { AssetStatus } from "@/types";
import { AssetStatus as AssetStatusValues } from "@/types";

export function MapFilters() {
  const [open, setOpen] = useState(false);

  const { assetFilters, incidentFilters, setAssetFilters, setIncidentFilters } = useFilterStore();

  // Both asset and incident queries use the same zone
  const activeZone = assetFilters.zoneId ?? incidentFilters.zoneId;
  const hasFilters = !!(assetFilters.status ?? activeZone);

  function handleZoneChange(zoneId: string | undefined) {
    setAssetFilters({ ...assetFilters, zoneId });
    setIncidentFilters({ ...incidentFilters, zoneId });
  }

  function handleStatusChange(status: string) {
    setAssetFilters({
      ...assetFilters,
      status: status === "" ? undefined : (status as AssetStatus),
    });
  }

  function clearAll() {
    setAssetFilters({ ...assetFilters, status: undefined, zoneId: undefined });
    setIncidentFilters({ ...incidentFilters, zoneId: undefined });
    setOpen(false);
  }

  return (
    <div className="absolute top-14 right-2 z-[1001] flex flex-col items-end gap-1.5">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border bg-white/90 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur dark:bg-gray-900/90"
      >
        <SlidersHorizontal className="size-3" />
        Filters
        {hasFilters && (
          <span className="bg-primary text-primary-foreground ml-1 inline-flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-bold">
            {[assetFilters.status, activeZone].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="w-52 rounded-lg border bg-white/95 p-3 shadow-md backdrop-blur dark:bg-gray-900/95">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold">Map Filters</span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-[11px]"
              >
                <X className="size-2.5" />
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Zone — applies to both assets and incidents */}
            <div className="grid gap-1">
              <span className="text-muted-foreground text-[11px] font-medium">Zone</span>
              <ZoneSelector
                value={activeZone}
                onChange={handleZoneChange}
                includeAll
                placeholder="All zones"
                className="h-8 text-xs"
                contentClassName="z-[1100]"
              />
            </div>

            {/* Asset status */}
            <div className="grid gap-1">
              <span className="text-muted-foreground text-[11px] font-medium">Asset Status</span>
              <Select value={assetFilters.status ?? ""} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="z-[1100]">
                  <SelectItem value="">All statuses</SelectItem>
                  {Object.values(AssetStatusValues).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s === "OUT_OF_SERVICE"
                        ? "Out of Service"
                        : s.charAt(0) + s.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
