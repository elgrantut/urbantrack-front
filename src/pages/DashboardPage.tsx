import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatsSkeleton } from "@/features/dashboard/DashboardStatsSkeleton";
import { ZoneOverviewPanel } from "@/features/dashboard/ZoneOverviewPanel";
import { CityMap } from "@/features/map/CityMap";
import { useAssets } from "@/hooks/useAssets";
import { useIncidents } from "@/hooks/useIncidents";
import { useVehicles } from "@/hooks/useVehicles";

function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="text-muted-foreground size-4" />
          <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value?.toLocaleString() ?? "—"}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: allAssets, isPending: assetsPending } = useAssets();
  const { data: openIncidents, isPending: incidentsPending } = useIncidents({
    status: "REPORTED",
  });
  const { data: activeVehicles, isPending: vehiclesPending } = useVehicles({
    status: "ACTIVE",
  });

  const allPending = assetsPending && incidentsPending && vehiclesPending;

  const needsAttention = allAssets?.filter(
    (a) => a.status === "DAMAGED" || a.status === "FULL" || a.status === "OUT_OF_SERVICE",
  ).length;

  return (
    <div className="flex flex-col gap-4 p-4 md:h-full">
      <PageHeader title="Dashboard" description="City operations overview — Buenos Aires" />

      {/* Stat cards — full skeleton on very first load, per-card skeleton after */}
      {allPending ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Total Assets"
            value={allAssets?.length}
            icon={Package}
            isLoading={assetsPending}
          />
          <StatCard
            label="Needs Attention"
            value={needsAttention}
            icon={AlertTriangle}
            isLoading={assetsPending}
          />
          <StatCard
            label="Open Incidents"
            value={openIncidents?.length}
            icon={CheckCircle2}
            isLoading={incidentsPending}
          />
          <StatCard
            label="Active Vehicles"
            value={activeVehicles?.length}
            icon={Truck}
            isLoading={vehiclesPending}
          />
        </div>
      )}

      {/* Zone overview — click a zone to filter incidents */}
      <ZoneOverviewPanel />

      {/* Full city map — fixed height on mobile, fills rest of screen on desktop */}
      <div className="h-[50vh] overflow-hidden rounded-xl border md:min-h-0 md:flex-1">
        <CityMap className="h-full" />
      </div>
    </div>
  );
}
