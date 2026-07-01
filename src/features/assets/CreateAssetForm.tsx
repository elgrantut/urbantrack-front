import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ZoneSelector } from "@/components/common/ZoneSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAsset } from "@/hooks/useAssets";
import { AssetStatus, AssetType } from "@/types";

const schema = z.object({
  type: z.enum(["BIN", "CONTAINER", "BENCH"]),
  status: z.enum(["OK", "DAMAGED", "FULL", "OUT_OF_SERVICE"]),
  address: z.string().min(1, "Address is required"),
  zoneId: z.string().min(1, "Zone is required"),
  lat: z.number({ message: "Latitude must be a number" }),
  lng: z.number({ message: "Longitude must be a number" }),
});

type FormValues = z.infer<typeof schema>;

export function CreateAssetForm() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateAsset();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Asset created");
        setOpen(false);
        reset();
      },
      onError: () => {
        // error shown inline
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Asset</DialogTitle>
        </DialogHeader>

        <form id="create-asset-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Type */}
          <div className="grid gap-1.5">
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-destructive text-xs">{errors.type.message}</p>}
          </div>

          {/* Status */}
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-destructive text-xs">{errors.status.message}</p>}
          </div>

          {/* Address */}
          <div className="grid gap-1.5">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="Av. Corrientes 1234" />
            {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
          </div>

          {/* Zone */}
          <div className="grid gap-1.5">
            <Label>Zone</Label>
            <Controller
              name="zoneId"
              control={control}
              render={({ field }) => (
                <ZoneSelector
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? "")}
                  includeAll={false}
                  placeholder="Select zone"
                />
              )}
            />
            {errors.zoneId && <p className="text-destructive text-xs">{errors.zoneId.message}</p>}
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Latitude</Label>
              <Input
                {...register("lat", { valueAsNumber: true })}
                type="number"
                step="any"
                placeholder="-34.61"
              />
              {errors.lat && <p className="text-destructive text-xs">{errors.lat.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label>Longitude</Label>
              <Input
                {...register("lng", { valueAsNumber: true })}
                type="number"
                step="any"
                placeholder="-58.43"
              />
              {errors.lng && <p className="text-destructive text-xs">{errors.lng.message}</p>}
            </div>
          </div>

          {mutation.isError && (
            <p className="text-destructive text-xs">Failed to create asset. Please try again.</p>
          )}
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="create-asset-form" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
