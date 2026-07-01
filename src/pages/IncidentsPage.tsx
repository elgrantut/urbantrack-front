import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
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
      <PageHeader
        title="Incidents"
        count={incidents?.length}
        description="Active and resolved incidents across all zones"
        action={<ReportIncidentForm />}
      />

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
