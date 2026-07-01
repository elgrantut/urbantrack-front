import type { AssetStatus, AssetType, UrbanAsset } from "@/types";

import { fetcher } from "./client";

export type AssetFilters = {
  status?: AssetStatus;
  type?: AssetType;
  zoneId?: string;
};

export type CreateAssetPayload = Omit<UrbanAsset, "id">;

export function getAssets(filters: AssetFilters = {}): Promise<UrbanAsset[]> {
  return fetcher<UrbanAsset[]>("/assets", { params: filters });
}

export function createAsset(data: CreateAssetPayload): Promise<UrbanAsset> {
  return fetcher<UrbanAsset>("/assets", { method: "POST", body: data });
}
