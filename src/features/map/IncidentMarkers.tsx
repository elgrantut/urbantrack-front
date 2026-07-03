import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import { useZoneMap } from "@/hooks/useZones";
import type { Incident } from "@/types";
import { formatRelativeTime, truncate } from "@/utils/formatters";
import { INCIDENT_STATUS_HEX } from "@/utils/statusColors";

function makeIncidentIcon(color: string): L.DivIcon {
  // Diamond shape to distinguish from asset circles
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);transform:rotate(45deg);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

type Props = {
  incidents: Incident[];
};

export function IncidentMarkers({ incidents }: Props) {
  const zoneMap = useZoneMap();

  return (
    <>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={makeIncidentIcon(INCIDENT_STATUS_HEX[incident.status])}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{incident.type}</p>
              <p>
                <span className="text-muted-foreground">Status: </span>
                <span style={{ color: INCIDENT_STATUS_HEX[incident.status] }}>
                  {incident.status}
                </span>
              </p>
              <p className="text-xs">{truncate(incident.description, 80)}</p>
              <p className="text-muted-foreground text-xs">
                Zone: {zoneMap[incident.zoneId] ?? incident.zoneId}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatRelativeTime(incident.createdAt)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
