import type { Vehicle, VehicleStatus, VehicleType } from "@/types";

import { fetcher, fetcherOrNull } from "./client";

export type VehicleFilters = {
  status?: VehicleStatus;
  type?: VehicleType;
  zoneId?: string;
};

// status is optional — server defaults to ACTIVE
export type CreateVehiclePayload = {
  plate: string;
  type: VehicleType;
  capacity: number;
  zoneId: string;
  status?: VehicleStatus;
};

export function getVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  return fetcher<Vehicle[]>("/vehicles", { params: filters });
}

export function getVehicleById(id: string): Promise<Vehicle | null> {
  return fetcherOrNull<Vehicle>(`/vehicles/${id}`);
}

export function createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
  return fetcher<Vehicle>("/vehicles", { method: "POST", body: data });
}
