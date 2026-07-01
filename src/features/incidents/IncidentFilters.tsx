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
import { IncidentStatus, IncidentType } from "@/types";

export function IncidentFilters() {
  const { incidentFilters, setIncidentFilters, resetIncidentFilters } = useFilterStore();

  const hasFilters = !!(incidentFilters.status ?? incidentFilters.type ?? incidentFilters.zoneId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={incidentFilters.status ?? ""}
        onValueChange={(v) =>
          setIncidentFilters({
            ...incidentFilters,
            status: v === "" ? undefined : (v as IncidentStatus),
          })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          {Object.values(IncidentStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={incidentFilters.type ?? ""}
        onValueChange={(v) =>
          setIncidentFilters({
            ...incidentFilters,
            type: v === "" ? undefined : (v as IncidentType),
          })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          {Object.values(IncidentType).map((t) => (
            <SelectItem key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ZoneSelector
        value={incidentFilters.zoneId}
        onChange={(v) => setIncidentFilters({ ...incidentFilters, zoneId: v })}
        className="w-36"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetIncidentFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
