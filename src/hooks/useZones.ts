import { useQuery } from "@tanstack/react-query";

import { getZones, getZoneById } from "@/api/zones";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
    staleTime: Infinity, // zones never change
  });
}

export function useZoneById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["zones", id],
    queryFn: () => getZoneById(id!),
    enabled: id != null,
    staleTime: Infinity,
  });
}
