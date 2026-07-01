import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAssets } from "@/hooks/useAssets";
import { useIncidents } from "@/hooks/useIncidents";
import { useFilterStore } from "@/store/filterStore";

import { AssetMarkers } from "./AssetMarkers";
import { IncidentMarkers } from "./IncidentMarkers";

const BA_CENTER: [number, number] = [-34.61, -58.43];
const DEFAULT_ZOOM = 12;

type Props = {
  className?: string;
};

export function CityMap({ className }: Props) {
  const [showAssets, setShowAssets] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  const { assetFilters, incidentFilters } = useFilterStore();

  const { data: assets = [], isPending: assetsPending } = useAssets(assetFilters);
  const { data: incidents = [], isPending: incidentsPending } = useIncidents(incidentFilters);

  const isLoading = assetsPending || incidentsPending;

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      {/* Layer toggles + counts */}
      <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1.5 rounded-lg border bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur dark:bg-gray-900/90">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showAssets}
            onChange={(e) => setShowAssets(e.target.checked)}
            className="size-3"
          />
          <span className="font-medium">Assets</span>
          <span className="text-muted-foreground">({assets.length.toLocaleString()})</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showIncidents}
            onChange={(e) => setShowIncidents(e.target.checked)}
            className="size-3"
          />
          <span className="font-medium">Incidents</span>
          <span className="text-muted-foreground">({incidents.length})</span>
        </label>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-2 z-[1000] rounded-lg border bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur dark:bg-gray-900/90">
        <p className="mb-1.5 font-semibold">Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: "#22c55e" }}
            />
            OK
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: "#eab308" }}
            />
            Full
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: "#f97316" }}
            />
            Damaged
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: "#ef4444" }}
            />
            Out of Service
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 border-t pt-1.5">
            <span className="inline-block size-2.5 rotate-45" style={{ background: "#ef4444" }} />
            Incident (reported)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rotate-45" style={{ background: "#f59e0b" }} />
            Incident (in progress)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rotate-45" style={{ background: "#22c55e" }} />
            Incident (resolved)
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/50 dark:bg-black/50">
          <LoadingSpinner />
        </div>
      )}

      <MapContainer
        center={BA_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showAssets && <AssetMarkers assets={assets} />}
        {showIncidents && <IncidentMarkers incidents={incidents} />}
      </MapContainer>
    </div>
  );
}
