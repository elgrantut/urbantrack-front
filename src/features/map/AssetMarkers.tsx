import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { useZoneMap } from "@/hooks/useZones";
import type { UrbanAsset } from "@/types";
import { ASSET_STATUS_HEX } from "@/utils/statusColors";

function makeAssetIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const ASSET_ICONS: Record<string, L.DivIcon> = Object.fromEntries(
  Object.entries(ASSET_STATUS_HEX).map(([status, hex]) => [status, makeAssetIcon(hex)]),
);

type Props = {
  assets: UrbanAsset[];
};

export function AssetMarkers({ assets }: Props) {
  const zoneMap = useZoneMap();

  return (
    <MarkerClusterGroup chunkedLoading>
      {assets.map((asset) => (
        <Marker
          key={asset.id}
          position={[asset.lat, asset.lng]}
          icon={ASSET_ICONS[asset.status]}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{asset.type}</p>
              <p>
                <span className="text-muted-foreground">Status: </span>
                <span style={{ color: ASSET_STATUS_HEX[asset.status] }}>{asset.status}</span>
              </p>
              <p className="text-muted-foreground text-xs">{asset.address}</p>
              <p className="text-muted-foreground text-xs">
                Zone: {zoneMap[asset.zoneId] ?? asset.zoneId}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
