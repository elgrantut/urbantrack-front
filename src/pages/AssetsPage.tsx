import { ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { AssetFilters } from "@/features/assets/AssetFilters";
import { AssetTable } from "@/features/assets/AssetTable";
import { AssetTableSkeleton } from "@/features/assets/AssetTableSkeleton";
import { CreateAssetForm } from "@/features/assets/CreateAssetForm";
import { useAssets } from "@/hooks/useAssets";
import { useFilterStore } from "@/store/filterStore";

const PAGE_SIZE = 100;

export function AssetsPage() {
  const { assetFilters } = useFilterStore();
  const { data: assets, isPending, isError, isFetching } = useAssets(assetFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [assetFilters.status, assetFilters.type, assetFilters.zoneId]);

  const total = assets?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const pageAssets = assets?.slice(start, end) ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <PageHeader
        title="Assets"
        description="Bins, containers and benches across all zones"
        action={<CreateAssetForm />}
      />

      {/* Filters */}
      <AssetFilters />

      {/* Count + fetching indicator */}
      {assets && (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="text-foreground font-medium">
              {total === 0
                ? "0"
                : `${(start + 1).toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`}
            </span>{" "}
            asset{total === 1 ? "" : "s"}
          </p>
          {isFetching && !isPending && (
            <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
          )}
        </div>
      )}

      {/* Content */}
      {isPending && <AssetTableSkeleton />}
      {isError && (
        <EmptyState
          title="Failed to load assets"
          message="Could not connect to the server. Make sure it is running at http://localhost:3000."
        />
      )}
      {assets && assets.length === 0 && (
        <EmptyState
          icon={Package}
          title="No assets found"
          message="No assets match the current filters. Try clearing them."
        />
      )}
      {assets && assets.length > 0 && <AssetTable assets={pageAssets} />}

      {/* Pagination */}
      {assets && assets.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
