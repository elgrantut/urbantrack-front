import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { IncidentDetail } from "@/features/incidents/IncidentDetail";
import { IncidentFilters } from "@/features/incidents/IncidentFilters";
import { IncidentList } from "@/features/incidents/IncidentList";
import { ReportIncidentForm } from "@/features/incidents/ReportIncidentForm";
import { useIncidents } from "@/hooks/useIncidents";
import { useFilterStore } from "@/store/filterStore";

export function IncidentsPage() {
  const { incidentFilters } = useFilterStore();
  const { data: incidents, isPending, isError } = useIncidents(incidentFilters);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Incidents
            {incidents && (
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                ({incidents.length})
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            Active and resolved incidents across all zones
          </p>
        </div>
        <ReportIncidentForm />
      </div>

      {/* Filters */}
      <IncidentFilters />

      {/* Content */}
      {isPending && <LoadingSpinner />}
      {isError && (
        <EmptyState
          title="Failed to load incidents"
          message="Could not connect to the server. Make sure it is running at http://localhost:3000."
        />
      )}
      {incidents && incidents.length === 0 && (
        <EmptyState
          icon={AlertTriangle}
          title="No incidents found"
          message="No incidents match the current filters. Try clearing them."
        />
      )}
      {incidents && incidents.length > 0 && <IncidentList incidents={incidents} />}

      {/* Detail sheet */}
      <IncidentDetail />
    </div>
  );
}
