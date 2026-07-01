import type { AssetStatus, IncidentStatus, VehicleStatus } from "@/types";

// ─── Asset status colors ──────────────────────────────────────────────────────

export const ASSET_STATUS_BADGE: Record<AssetStatus, string> = {
  OK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  FULL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  DAMAGED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  OUT_OF_SERVICE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

/** Hex colors for Leaflet marker icons */
export const ASSET_STATUS_HEX: Record<AssetStatus, string> = {
  OK: "#22c55e",
  FULL: "#eab308",
  DAMAGED: "#f97316",
  OUT_OF_SERVICE: "#ef4444",
};

// ─── Incident status colors ───────────────────────────────────────────────────

export const INCIDENT_STATUS_BADGE: Record<IncidentStatus, string> = {
  REPORTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

/** Hex colors for Leaflet marker icons */
export const INCIDENT_STATUS_HEX: Record<IncidentStatus, string> = {
  REPORTED: "#ef4444",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#22c55e",
};

// ─── Vehicle status colors ────────────────────────────────────────────────────

export const VEHICLE_STATUS_BADGE: Record<VehicleStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  OUT_OF_SERVICE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};
