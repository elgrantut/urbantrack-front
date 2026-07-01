import { useNavigate } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssets } from "@/hooks/useAssets";
import { useIncidents } from "@/hooks/useIncidents";
import { useZones } from "@/hooks/useZones";
import { useFilterStore } from "@/store/filterStore";

export function ZoneOverviewPanel() {
  const navigate = useNavigate();
  const { setIncidentFilters, setAssetFilters } = useFilterStore();

  const { data: zones = [], isLoading: zonesLoading } = useZones();
  const { data: allAssets = [], isPending: assetsPending } = useAssets();
  const { data: allIncidents = [], isPending: incidentsPending } = useIncidents();

  const isLoading = zonesLoading || assetsPending || incidentsPending;

  function handleZoneClick(zoneId: string) {
    setIncidentFilters({ zoneId });
    setAssetFilters({ zoneId });
    void navigate("/incidents");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Zone Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {zones.map((zone) => {
              const assetCount = allAssets.filter((a) => a.zoneId === zone.id).length;
              const incidentCount = allIncidents.filter((inc) => inc.zoneId === zone.id).length;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleZoneClick(zone.id)}
                  className="hover:bg-accent rounded-md border p-3 text-left transition-colors"
                >
                  <p className="mb-1 truncate text-sm font-medium">{zone.name}</p>
                  <div className="text-muted-foreground flex flex-col gap-3 text-xs">
                    <p>{assetCount} assets</p>
                    <p>{incidentCount} incidents</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
