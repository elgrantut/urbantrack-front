import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createIncident, getIncidentById, getIncidents } from "@/api/incidents";
import type { CreateIncidentPayload, IncidentFilters } from "@/api/incidents";

export function useIncidents(filters: IncidentFilters = {}) {
  return useQuery({
    queryKey: ["incidents", filters],
    queryFn: () => getIncidents(filters),
  });
}

export function useIncidentById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => getIncidentById(id!),
    enabled: id != null,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidentPayload) => createIncident(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}
