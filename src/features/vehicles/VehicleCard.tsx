import { Car, Truck, TruckIcon } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useZones } from "@/hooks/useZones";
import type { Vehicle, VehicleType } from "@/types";
import { formatCapacity } from "@/utils/formatters";

const TYPE_ICON: Record<VehicleType, React.ElementType> = {
  TRUCK: TruckIcon,
  VAN: Car,
  PICKUP: Truck,
};

type Props = {
  vehicle: Vehicle;
  onSelect: (id: string) => void;
};

export function VehicleCard({ vehicle, onSelect }: Props) {
  const { data: zones = [] } = useZones();
  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.name]));

  const Icon = TYPE_ICON[vehicle.type];

  return (
    <Card
      size="sm"
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect(vehicle.id)}
    >
      <CardHeader className="flex-row items-start gap-3">
        <div className="bg-muted mt-0.5 rounded-md p-1.5">
          <Icon className="text-muted-foreground size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono font-medium">{vehicle.plate}</p>
            <StatusBadge variant="vehicle" status={vehicle.status} />
          </div>
          <p className="text-muted-foreground text-xs">
            {vehicle.type} · {zoneMap[vehicle.zoneId] ?? vehicle.zoneId}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Capacity: {formatCapacity(vehicle.capacity)}
        </p>
      </CardContent>
    </Card>
  );
}
