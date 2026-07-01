import { Truck } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { VehicleCard } from "@/features/vehicles/VehicleCard";
import { VehicleDetail } from "@/features/vehicles/VehicleDetail";
import { VehicleFilters } from "@/features/vehicles/VehicleFilters";
import { useVehicles } from "@/hooks/useVehicles";
import { useFilterStore } from "@/store/filterStore";

export function VehiclesPage() {
  const { vehicleFilters } = useFilterStore();
  const { data: vehicles, isPending, isError } = useVehicles(vehicleFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <PageHeader
        title="Vehicles"
        count={vehicles?.length}
        description="Collection fleet status and assignments"
      />

      {/* Filters */}
      <VehicleFilters />

      {/* Content */}
      {isPending && <LoadingSpinner />}
      {isError && (
        <EmptyState
          title="Failed to load vehicles"
          message="Could not connect to the server. Make sure it is running at http://localhost:3000."
        />
      )}
      {vehicles && vehicles.length === 0 && (
        <EmptyState
          icon={Truck}
          title="No vehicles found"
          message="No vehicles match the current filters. Try clearing them."
        />
      )}
      {vehicles && vehicles.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onSelect={setSelectedId} />
          ))}
        </div>
      )}

      {/* Detail sheet */}
      <VehicleDetail vehicleId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
