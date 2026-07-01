import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useZones } from "@/hooks/useZones";
import type { UrbanAsset } from "@/types";

type Props = {
  assets: UrbanAsset[];
};

export function AssetTable({ assets }: Props) {
  const { data: zones = [] } = useZones();
  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.name]));

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead className="text-right">Lat</TableHead>
            <TableHead className="text-right">Lng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.type}</TableCell>
              <TableCell>
                <StatusBadge variant="asset" status={asset.status} />
              </TableCell>
              <TableCell className="text-muted-foreground max-w-48 truncate">
                {asset.address}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {zoneMap[asset.zoneId] ?? asset.zoneId}
              </TableCell>
              <TableCell className="text-muted-foreground text-right font-mono text-xs">
                {asset.lat.toFixed(4)}
              </TableCell>
              <TableCell className="text-muted-foreground text-right font-mono text-xs">
                {asset.lng.toFixed(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
