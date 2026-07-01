import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CARDS = 6;

// Mirrors IncidentCard: icon box + two text lines in header, one line in content.
function IncidentCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-start gap-3">
        {/* Icon box */}
        <Skeleton className="mt-0.5 size-7 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          {/* Title row: name + badge */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          {/* Meta: zone · relative time */}
          <Skeleton className="h-3 w-36" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-3/4" />
      </CardContent>
    </Card>
  );
}

export function IncidentListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: CARDS }).map((_, i) => (
        <IncidentCardSkeleton key={i} />
      ))}
    </div>
  );
}
