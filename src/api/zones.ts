import type { Zone } from "@/types";
import { fetcher, fetcherOrNull } from "./client";

export function getZones(): Promise<Zone[]> {
  return fetcher<Zone[]>("/zones");
}

export function getZoneById(id: string): Promise<Zone | null> {
  return fetcherOrNull<Zone>(`/zones/${id}`);
}
