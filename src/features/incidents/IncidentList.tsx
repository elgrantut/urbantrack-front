import type { Incident } from "@/types";

import { IncidentCard } from "./IncidentCard";

type Props = {
  incidents: Incident[];
};

export function IncidentList({ incidents }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
}
