import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROWS = 10;

// Column widths mirror the real AssetTable columns so nothing shifts on load.
const COLS = [
  { width: "w-14" }, // Type  (BIN / CONTAINER / BENCH)
  { width: "w-16" }, // Status badge
  { width: "w-48" }, // Address
  { width: "w-24" }, // Zone
  { width: "w-14" }, // Lat
  { width: "w-14" }, // Lng
] as const;

export function AssetTableSkeleton() {
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
          {Array.from({ length: ROWS }).map((_, i) => (
            <TableRow key={i}>
              {COLS.map((col, j) => (
                <TableCell key={j}>
                  <Skeleton className={`h-4 ${col.width}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
