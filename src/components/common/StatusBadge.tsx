import { cn } from "@/lib/utils";
import type { AssetStatus, IncidentStatus, VehicleStatus } from "@/types";
import {
  ASSET_STATUS_BADGE,
  INCIDENT_STATUS_BADGE,
  VEHICLE_STATUS_BADGE,
} from "@/utils/statusColors";

type Props =
  | { variant: "asset"; status: AssetStatus }
  | { variant: "incident"; status: IncidentStatus }
  | { variant: "vehicle"; status: VehicleStatus };

const LABEL_MAP = {
  // asset
  OK: "OK",
  FULL: "Full",
  DAMAGED: "Damaged",
  // incident
  REPORTED: "Reported",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  // vehicle
  ACTIVE: "Active",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
} as const;

export function StatusBadge(props: Props) {
  let colorClass: string;

  if (props.variant === "asset") {
    colorClass = ASSET_STATUS_BADGE[props.status];
  } else if (props.variant === "incident") {
    colorClass = INCIDENT_STATUS_BADGE[props.status];
  } else {
    colorClass = VEHICLE_STATUS_BADGE[props.status];
  }

  const label = LABEL_MAP[props.status as keyof typeof LABEL_MAP] ?? props.status;

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        colorClass,
      )}
    >
      {label}
    </span>
  );
}
