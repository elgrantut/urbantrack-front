import { Package } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { AssetFilters } from "@/features/assets/AssetFilters";
import { AssetTable } from "@/features/assets/AssetTable";
import { AssetTableSkeleton } from "@/features/assets/AssetTableSkeleton";
import { CreateAssetForm } from "@/features/assets/CreateAssetForm";
import { useAssets } from "@/hooks/useAssets";
import { useFilterStore } from "@/store/filterStore";

export function AssetsPage() {
  const { assetFilters } = useFilterStore();
  const { data: assets, isPending, isError } = useAssets(assetFilters);

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

      {/* Count */}
      {assets && (
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="text-foreground font-medium">{assets.length.toLocaleString()}</span>{" "}
          asset{assets.length === 1 ? "" : "s"}
        </p>
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
      {assets && assets.length > 0 && <AssetTable assets={assets} />}
    </div>
  );
}
