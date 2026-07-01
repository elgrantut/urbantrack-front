// ─── Zone ────────────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  name: string;
}

// ─── Urban Asset ─────────────────────────────────────────────────────────────

export const AssetType = {
  BIN: "BIN",
  CONTAINER: "CONTAINER",
  BENCH: "BENCH",
} as const;
export type AssetType = (typeof AssetType)[keyof typeof AssetType];

export const AssetStatus = {
  OK: "OK",
  DAMAGED: "DAMAGED",
  FULL: "FULL",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
} as const;
export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];

export interface UrbanAsset {
  id: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  address: string;
  zoneId: string;
}

// ─── Incident ────────────────────────────────────────────────────────────────

export const IncidentType = {
  OVERFLOW: "OVERFLOW",
  DAMAGE: "DAMAGE",
  LITTERING: "LITTERING",
  OTHER: "OTHER",
} as const;
export type IncidentType = (typeof IncidentType)[keyof typeof IncidentType];

export const IncidentStatus = {
  REPORTED: "REPORTED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
} as const;
export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus];

export interface Incident {
  id: string;
  type: IncidentType;
  status: IncidentStatus;
  description: string;
  lat: number;
  lng: number;
  zoneId: string;
  createdAt: string; // ISO 8601 — server-generated, never sent in POST body
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export const VehicleType = {
  TRUCK: "TRUCK",
  VAN: "VAN",
  PICKUP: "PICKUP",
} as const;
export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleStatus = {
  ACTIVE: "ACTIVE",
  MAINTENANCE: "MAINTENANCE",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
} as const;
export type VehicleStatus =
  (typeof VehicleStatus)[keyof typeof VehicleStatus];

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  status: VehicleStatus;
  capacity: number; // kilograms — must be positive
  zoneId: string;
}
