import { cn } from "@/lib/utils";

type Props = {
  title: string;
  /** Optional count shown as a muted badge beside the title */
  count?: number;
  description?: string;
  /** Right-aligned slot — pass a button or form trigger */
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, count, description, action, className }: Props) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-8", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-5xl">
          {title}
          {count !== undefined && (
            <span className="text-muted-foreground ml-2.5 text-base font-normal">
              ({count.toLocaleString()})
            </span>
          )}
        </h1>
        {description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  );
}
