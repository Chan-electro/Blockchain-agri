import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TxHashChip } from "@/components/common/TxHashChip";
import { Separator } from "@/components/ui/separator";
import type { Batch } from "@/lib/api";

interface BatchDetailsSheetProps {
  batch: Batch | null;
  onOpenChange: (open: boolean) => void;
}

export function BatchDetailsSheet({ batch, onOpenChange }: BatchDetailsSheetProps) {
  return (
    <Sheet open={!!batch} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        {batch && (
          <div className="space-y-5">
            <SheetHeader>
              <SheetTitle>Batch #{batch.id} — {batch.crop}</SheetTitle>
              <SheetDescription>{batch.location} · {batch.weight}</SheetDescription>
              <div className="pt-1"><StatusBadge status={batch.status} /></div>
            </SheetHeader>

            <Separator />

            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total price</div>
              <div className="text-3xl font-bold text-primary">₹{batch.total_price}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Price breakdown ({batch.priceBreakdown?.length ?? 0})
              </div>
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                {batch.priceBreakdown?.length ? batch.priceBreakdown.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{c.role}</div>
                        {c.description && <div className="text-xs text-muted-foreground">{c.description}</div>}
                      </div>
                      <div className="text-sm font-semibold">₹{c.amount}</div>
                    </div>
                    {c.tx_hash && (
                      <TxHashChip
                        txHash={c.tx_hash}
                        blockNumber={c.block_number ?? null}
                        contractAddress={batch.contractAddress}
                      />
                    )}
                  </div>
                )) : <div className="text-xs text-muted-foreground">No components logged</div>}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Provenance</div>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Farmer</dt><dd className="font-mono text-xs">{batch.farmer_address.slice(0, 8)}…{batch.farmer_address.slice(-6)}</dd></div>
                {batch.contractAddress && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Contract</dt><dd className="font-mono text-xs">{batch.contractAddress.slice(0, 8)}…{batch.contractAddress.slice(-6)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd>{new Date(batch.created_at).toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Updated</dt><dd>{new Date(batch.updated_at).toLocaleString()}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
