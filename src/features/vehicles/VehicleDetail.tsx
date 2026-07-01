import { X } from "lucide-react";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useVehicleById } from "@/hooks/useVehicles";
import { useZones } from "@/hooks/useZones";
import { formatCapacity } from "@/utils/formatters";

type Props = {
  vehicleId: string | null;
  onClose: () => void;
};

export function VehicleDetail({ vehicleId, onClose }: Props) {
  const { data: vehicle, isPending, isError } = useVehicleById(vehicleId);
  const { data: zones = [] } = useZones();
  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.name]));

  return (
    <Sheet
      open={vehicleId !== null}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle className="text-base">Vehicle Detail</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isPending && <LoadingSpinner />}
          {(isError || vehicle === null) && !isPending && (
            <div className="text-center">
              <p className="font-medium">Vehicle not found</p>
              <p className="text-muted-foreground text-sm">
                This vehicle may have been removed or the ID is invalid.
              </p>
            </div>
          )}
          {vehicle && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-lg font-semibold">{vehicle.plate}</p>
                <StatusBadge variant="vehicle" status={vehicle.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Type
                  </p>
                  <p>{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Zone
                  </p>
                  <p>{zoneMap[vehicle.zoneId] ?? vehicle.zoneId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Capacity
                  </p>
                  <p>{formatCapacity(vehicle.capacity)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
