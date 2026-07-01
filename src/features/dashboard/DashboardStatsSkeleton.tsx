import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the 4-card grid in DashboardPage.
// Each card keeps the same chrome (border, padding) — only the value area pulses.
function StatCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between">
        {/* Label */}
        <Skeleton className="h-4 w-28" />
        {/* Icon */}
        <Skeleton className="size-4 rounded" />
      </CardHeader>
      <CardContent>
        {/* Big number */}
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
