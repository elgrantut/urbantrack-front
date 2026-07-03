import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X } from "lucide-react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIncidentById } from "@/hooks/useIncidents";
import { useZoneMap } from "@/hooks/useZones";
import { useUiStore } from "@/store/uiStore";
import { formatDateTime } from "@/utils/formatters";
import { INCIDENT_STATUS_HEX } from "@/utils/statusColors";

function makeIncidentIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);transform:rotate(45deg);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function IncidentDetail() {
  const { selectedMarkerId, sheetOpen, setSheetOpen, setSelectedMarkerId } = useUiStore();

  const {
    data: incident,
    isPending,
    isError,
  } = useIncidentById(sheetOpen ? selectedMarkerId : null);

  const zoneMap = useZoneMap();

  function handleClose() {
    setSheetOpen(false);
    setSelectedMarkerId(null);
  }

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle className="text-base">Incident Detail</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {isPending && <LoadingSpinner />}
          {isError || incident === null ? (
            <div className="p-6 text-center">
              <p className="font-medium">Incident not found</p>
              <p className="text-muted-foreground text-sm">
                This incident may have been removed or the ID is invalid.
              </p>
            </div>
          ) : null}
          {incident && (
            <div className="flex flex-col gap-4 p-4">
              {/* Type + Status */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {incident.type.charAt(0) + incident.type.slice(1).toLowerCase()}
                </p>
                <StatusBadge variant="incident" status={incident.status} />
              </div>

              {/* Description */}
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                  Description
                </p>
                <p className="text-sm">{incident.description}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Zone
                  </p>
                  <p>{zoneMap[incident.zoneId] ?? incident.zoneId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Created
                  </p>
                  <p>{formatDateTime(incident.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Latitude
                  </p>
                  <p className="font-mono">{incident.lat.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Longitude
                  </p>
                  <p className="font-mono">{incident.lng.toFixed(5)}</p>
                </div>
              </div>

              {/* Mini map */}
              <div className="h-52 overflow-hidden rounded-lg border">
                <MapContainer
                  center={[incident.lat, incident.lng]}
                  zoom={15}
                  zoomControl={false}
                  attributionControl={false}
                  className="h-full w-full"
                  style={{ zIndex: 0 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[incident.lat, incident.lng]}
                    icon={makeIncidentIcon(INCIDENT_STATUS_HEX[incident.status])}
                  />
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
