import { Package } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AssetFilters } from "@/features/assets/AssetFilters";
import { AssetTable } from "@/features/assets/AssetTable";
import { CreateAssetForm } from "@/features/assets/CreateAssetForm";
import { useAssets } from "@/hooks/useAssets";
import { useFilterStore } from "@/store/filterStore";

export function AssetsPage() {
  const { assetFilters } = useFilterStore();
  const { data: assets, isPending, isError } = useAssets(assetFilters);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Assets</h1>
          <p className="text-muted-foreground text-sm">
            Bins, containers and benches across all zones
          </p>
        </div>
        <CreateAssetForm />
      </div>

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
      {isPending && <LoadingSpinner />}
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
