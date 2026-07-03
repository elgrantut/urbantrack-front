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
import { useCreateIncident } from "@/hooks/useIncidents";
import { IncidentType } from "@/types";

// status and createdAt are intentionally absent
const schema = z.object({
  type: z.enum(["OVERFLOW", "DAMAGE", "LITTERING", "OTHER"]),
  description: z.string().min(1, "Description is required"),
  zoneId: z.string().min(1, "Zone is required"),
  lat: z.number({ message: "Latitude must be a number" }),
  lng: z.number({ message: "Longitude must be a number" }),
});

type FormValues = z.infer<typeof schema>;

export function ReportIncidentForm() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateIncident();

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
        toast.success("Incident reported");
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
          Report Incident
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Incident</DialogTitle>
        </DialogHeader>

        <form id="report-incident-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
                    {Object.values(IncidentType).map((t) => (
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

          {/* Description */}
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe the incident..."
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
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
            <p className="text-destructive text-xs">
              {mutation.error?.message ?? "Failed to report incident. Please try again."}
            </p>
          )}
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="report-incident-form" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
