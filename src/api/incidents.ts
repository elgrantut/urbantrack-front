import type {
  Incident,
  IncidentStatus,
  IncidentType,
} from "@/types";
import { fetcher, fetcherOrNull } from "./client";

export type IncidentFilters = {
  status?: IncidentStatus;
  type?: IncidentType;
  zoneId?: string;
};

// createdAt is server-generated — intentionally excluded from the payload
export type CreateIncidentPayload = {
  type: IncidentType;
  description: string;
  lat: number;
  lng: number;
  zoneId: string;
  status?: IncidentStatus;
};

export function getIncidents(
  filters: IncidentFilters = {},
): Promise<Incident[]> {
  return fetcher<Incident[]>("/incidents", { params: filters });
}

export function getIncidentById(id: string): Promise<Incident | null> {
  return fetcherOrNull<Incident>(`/incidents/${id}`);
}

export function createIncident(
  data: CreateIncidentPayload,
): Promise<Incident> {
  return fetcher<Incident>("/incidents", { method: "POST", body: data });
}
