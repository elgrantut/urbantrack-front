import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useCreateVehicle } from "@/hooks/useVehicles";
import { VehicleType } from "@/types";

const schema = z.object({
  plate: z.string().min(1, "Plate is required"),
  type: z.enum(["TRUCK", "VAN", "PICKUP"]),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .positive("Must be a positive number"),
  zoneId: z.string().min(1, "Zone is required"),
});

type FormValues = z.infer<typeof schema>;

export function CreateVehicleForm() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateVehicle();

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
        toast.success("Vehicle registered");
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
          Register Vehicle
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Vehicle</DialogTitle>
        </DialogHeader>

        <form id="create-vehicle-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Plate */}
          <div className="grid gap-1.5">
            <Label>Plate</Label>
            <Input {...register("plate")} placeholder="ABC 123" className="uppercase" />
            {errors.plate && <p className="text-destructive text-xs">{errors.plate.message}</p>}
          </div>

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
                    {Object.values(VehicleType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-destructive text-xs">{errors.type.message}</p>}
          </div>

          {/* Capacity */}
          <div className="grid gap-1.5">
            <Label>Capacity (kg)</Label>
            <Input
              {...register("capacity", { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="1000"
            />
            {errors.capacity && (
              <p className="text-destructive text-xs">{errors.capacity.message}</p>
            )}
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

          {mutation.isError && (
            <p className="text-destructive text-xs">
              Failed to register vehicle. Please try again.
            </p>
          )}
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="create-vehicle-form" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
