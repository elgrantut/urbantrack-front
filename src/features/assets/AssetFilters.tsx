import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore } from "@/store/filterStore";
import { AssetStatus, AssetType } from "@/types";

export function AssetFilters() {
  const { assetFilters, setAssetFilters, resetAssetFilters } = useFilterStore();

  const hasFilters = !!(assetFilters.status ?? assetFilters.type);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status filter */}
      <Select
        value={assetFilters.status ?? ""}
        onValueChange={(v) =>
          setAssetFilters({
            ...assetFilters,
            status: v === "" ? undefined : (v as AssetStatus),
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          {Object.values(AssetStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s === "OUT_OF_SERVICE" ? "Out of Service" : s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type filter */}
      <Select
        value={assetFilters.type ?? ""}
        onValueChange={(v) =>
          setAssetFilters({
            ...assetFilters,
            type: v === "" ? undefined : (v as AssetType),
          })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          {Object.values(AssetType).map((t) => (
            <SelectItem key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetAssetFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
