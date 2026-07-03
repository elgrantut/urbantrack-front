import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getZoneById, getZones } from "@/api/zones";

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

/** Returns a stable id→name lookup map derived from the zones cache. */
export function useZoneMap(): Record<string, string> {
  const { data: zones = [] } = useZones();
  return useMemo(() => Object.fromEntries(zones.map((z) => [z.id, z.name])), [zones]);
}
