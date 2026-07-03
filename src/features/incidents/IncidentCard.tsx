import { AlertCircle, AlertTriangle, HelpCircle, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useZoneMap } from "@/hooks/useZones";
import { useUiStore } from "@/store/uiStore";
import type { Incident, IncidentType } from "@/types";
import { formatRelativeTime, truncate } from "@/utils/formatters";

const TYPE_ICON: Record<IncidentType, React.ElementType> = {
  OVERFLOW: Trash2,
  DAMAGE: AlertTriangle,
  LITTERING: AlertCircle,
  OTHER: HelpCircle,
};

type Props = {
  incident: Incident;
};

export function IncidentCard({ incident }: Props) {
  const { setSelectedMarkerId, setSheetOpen } = useUiStore();
  const zoneMap = useZoneMap();

  const Icon = TYPE_ICON[incident.type];

  function handleClick() {
    setSelectedMarkerId(incident.id);
    setSheetOpen(true);
  }

  return (
    <Card
      size="sm"
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="flex-row items-start gap-3">
        <div className="bg-muted mt-0.5 rounded-md p-1.5">
          <Icon className="text-muted-foreground size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">
              {incident.type.charAt(0) + incident.type.slice(1).toLowerCase()}
            </p>
            <StatusBadge variant="incident" status={incident.status} />
          </div>
          <p className="text-muted-foreground text-xs">
            {zoneMap[incident.zoneId] ?? incident.zoneId} · {formatRelativeTime(incident.createdAt)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{truncate(incident.description, 80)}</p>
      </CardContent>
    </Card>
  );
}
