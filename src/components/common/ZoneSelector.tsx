import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useZones } from "@/hooks/useZones";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  includeAll?: boolean;
  className?: string;
  contentClassName?: string;
};

export function ZoneSelector({
  value,
  onChange,
  placeholder = "All zones",
  includeAll = true,
  className,
  contentClassName,
}: Props) {
  const { data: zones = [], isLoading } = useZones();

  return (
    <Select value={value ?? ""} onValueChange={(v) => onChange(v === "" ? undefined : v)}>
      <SelectTrigger className={className} disabled={isLoading}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {includeAll && <SelectItem value="">All zones</SelectItem>}
        {zones.map((zone) => (
          <SelectItem key={zone.id} value={zone.id}>
            {zone.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
