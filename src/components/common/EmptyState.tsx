import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon = PackageSearch,
  title = "No results",
  message = "No items match the current filters.",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center",
        className,
      )}
    >
      <Icon className="text-muted-foreground/50 size-10" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{message}</p>
      </div>
    </div>
  );
}
