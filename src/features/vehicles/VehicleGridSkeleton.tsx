import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CARDS = 6;

// Mirrors VehicleCard: icon box + plate/badge row + type/zone line + capacity line.
function VehicleCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-start gap-3">
        {/* Icon box */}
        <Skeleton className="mt-0.5 size-7 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          {/* Plate + status badge */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24 font-mono" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          {/* Type · zone */}
          <Skeleton className="h-3 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Capacity */}
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function VehicleGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: CARDS }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
