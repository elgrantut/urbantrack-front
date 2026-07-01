import { ZoneSelector } from "@/components/common/ZoneSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore } from "@/store/filterStore";
import { VehicleStatus, VehicleType } from "@/types";

export function VehicleFilters() {
  const { vehicleFilters, setVehicleFilters, resetVehicleFilters } = useFilterStore();

  const hasFilters = !!(vehicleFilters.status ?? vehicleFilters.type ?? vehicleFilters.zoneId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={vehicleFilters.status ?? ""}
        onValueChange={(v) =>
          setVehicleFilters({
            ...vehicleFilters,
            status: v === "" ? undefined : (v as VehicleStatus),
          })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          {Object.values(VehicleStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s === "OUT_OF_SERVICE" ? "Out of Service" : s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={vehicleFilters.type ?? ""}
        onValueChange={(v) =>
          setVehicleFilters({
            ...vehicleFilters,
            type: v === "" ? undefined : (v as VehicleType),
          })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          {Object.values(VehicleType).map((t) => (
            <SelectItem key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ZoneSelector
        value={vehicleFilters.zoneId}
        onChange={(v) => setVehicleFilters({ ...vehicleFilters, zoneId: v })}
        className="w-36"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetVehicleFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
