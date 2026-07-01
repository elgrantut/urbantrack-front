import { Skeleton } from "@/components/ui/skeleton";

// Thin animated bar across the top of the map container.
// Keeps the map visible and interactive — avoids full-overlay flicker.
export function MapSkeletonOverlay() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000]">
      <Skeleton className="h-1 w-full rounded-none" />
    </div>
  );
}
