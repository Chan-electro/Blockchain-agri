import { useState } from "react";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TxHashChip } from "@/components/common/TxHashChip";
import { EmptyState } from "@/components/common/EmptyState";
import type { Batch } from "@/lib/api";

interface BatchTableProps {
  batches: Batch[] | undefined;
  loading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (batch: Batch) => void;
  rowAction?: (batch: Batch) => ReactNode;
}

export function BatchTable({
  batches,
  loading,
  emptyTitle = "No batches yet",
  emptyDescription = "Batches will appear here once they are created on-chain.",
  emptyAction,
  onRowClick,
  rowAction,
}: BatchTableProps) {
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }
  if (!batches || batches.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  const q = search.trim().toLowerCase();
  const filtered = q
    ? batches.filter((b) =>
        b.crop.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        String(b.id).includes(q),
      )
    : batches;

  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by crop, ID, location"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>On-chain</TableHead>
              {(onRowClick || rowAction) && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id} className={onRowClick ? "cursor-pointer" : ""} onClick={() => onRowClick?.(b)}>
                <TableCell className="font-mono text-xs">#{b.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{b.crop}</div>
                  <div className="text-xs text-muted-foreground">{b.weight}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{b.location}</TableCell>
                <TableCell><StatusBadge status={b.status} /></TableCell>
                <TableCell className="font-semibold">₹{b.total_price}</TableCell>
                <TableCell>
                  <TxHashChip
                    txHash={b.tx_hash}
                    blockNumber={b.block_number ?? null}
                    contractAddress={b.contractAddress}
                  />
                </TableCell>
                {(onRowClick || rowAction) && (
                  <TableCell className="text-right">
                    {rowAction
                      ? rowAction(b)
                      : <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onRowClick?.(b); }}>View</Button>}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
