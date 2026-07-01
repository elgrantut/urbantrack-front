import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createVehicle, getVehicleById, getVehicles } from "@/api/vehicles";
import type { CreateVehiclePayload, VehicleFilters } from "@/api/vehicles";

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => getVehicles(filters),
  });
}

export function useVehicleById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicleById(id!),
    enabled: id != null,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehiclePayload) => createVehicle(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
