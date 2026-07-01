import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createAsset, getAssets } from "@/api/assets";
import type { AssetFilters, CreateAssetPayload } from "@/api/assets";

export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: () => getAssets(filters),
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetPayload) => createAsset(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
