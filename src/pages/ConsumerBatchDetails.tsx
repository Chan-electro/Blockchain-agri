import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle, Truck, ShoppingBag, Leaf, MapPin,
  Loader2, AlertCircle, Factory,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TxHashChip } from "@/components/common/TxHashChip";
import { EmptyState } from "@/components/common/EmptyState";
import { api, CHAIN_NAME, type Batch, type ApiError } from "@/lib/api";

function roleIcon(role: string) {
  switch (role.toUpperCase()) {
    case "FARMER": return Leaf;
    case "PROCESSOR": return Factory;
    case "LOGISTICS": return Truck;
    case "RETAILER": return ShoppingBag;
    default: return CheckCircle;
  }
}
function roleAccent(role: string) {
  switch (role.toUpperCase()) {
    case "FARMER": return "text-green-600 bg-green-500/10";
    case "PROCESSOR": return "text-blue-600 bg-blue-500/10";
    case "LOGISTICS": return "text-amber-600 bg-amber-500/10";
    case "RETAILER": return "text-purple-600 bg-purple-500/10";
    default: return "text-muted-foreground bg-muted";
  }
}

export default function ConsumerBatchDetails() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(batchId);
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid batch ID");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.getBatch(id)
      .then((data) => { if (!cancelled) setBatch(data); })
      .catch((err: ApiError) => { if (!cancelled) setError(err.message || "Batch not found"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [batchId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading batch from chain…</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <EmptyState
          icon={<AlertCircle className="size-6 text-destructive" />}
          title="Batch not found"
          description={error || "We couldn't load that batch."}
          action={<Button asChild><Link to="/scan"><ArrowLeft className="mr-2 size-4" /> Back to scan</Link></Button>}
        />
      </div>
    );
  }

  const total = batch.total_price;
  const handoffCount = batch.priceBreakdown?.length ?? 0;
  const verified = handoffCount >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background p-4 pb-16 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" className="gap-2 pl-0 transition hover:pl-2" onClick={() => navigate("/scan")}>
          <ArrowLeft className="size-4" /> Back to scan
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero */}
          <Card>
            <CardHeader className="items-center gap-2 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="size-7" />
              </div>
              <CardTitle className="text-2xl">{batch.crop}</CardTitle>
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {batch.location} · {batch.weight}
              </p>
              <p className="text-xs text-muted-foreground">Batch #{batch.id}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <StatusBadge status={batch.status} />
                {verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <CheckCircle className="size-3.5" />
                    Verified on {CHAIN_NAME} · {handoffCount}/4 handoffs
                  </span>
                )}
              </div>
              <TxHashChip
                txHash={batch.tx_hash ?? batch.priceBreakdown?.[0]?.tx_hash}
                blockNumber={batch.block_number ?? batch.priceBreakdown?.[0]?.block_number ?? null}
                contractAddress={batch.contractAddress}
                className="mt-3"
              />
            </CardHeader>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supply chain journey</CardTitle>
            </CardHeader>
            <CardContent>
              {handoffCount === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No handoffs recorded.</p>
              ) : (
                <ol className="space-y-4">
                  {batch.priceBreakdown.map((item, i) => {
                    const Icon = roleIcon(item.role);
                    const accent = roleAccent(item.role);
                    const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : "0";
                    return (
                      <li key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex size-9 items-center justify-center rounded-full ${accent}`}>
                            <Icon className="size-4" />
                          </div>
                          {i < batch.priceBreakdown.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="text-sm font-medium">{item.role}</div>
                              {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">₹{item.amount}</div>
                              <div className="text-[10px] text-muted-foreground">{pct}% of total</div>
                            </div>
                          </div>
                          {item.tx_hash && (
                            <TxHashChip
                              txHash={item.tx_hash}
                              blockNumber={item.block_number ?? null}
                              contractAddress={batch.contractAddress}
                              className="mt-2"
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}

              <div className="mt-6 flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-3">
                <span className="text-sm font-medium">Consumer price</span>
                <span className="text-2xl font-bold text-primary">₹{total}</span>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Every entry above was committed on-chain and cannot be altered retroactively.
              </p>
            </CardContent>
          </Card>

          {/* Provenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Provenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Farmer address" value={shortAddr(batch.farmer_address)} mono />
              <Row label="Contract" value={batch.contractAddress ? shortAddr(batch.contractAddress) : "—"} mono />
              <Row label="Created" value={new Date(batch.created_at).toLocaleString()} />
              <Row label="Updated" value={new Date(batch.updated_at).toLocaleString()} />
              <Row label="Network" value={CHAIN_NAME} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface RowProps { label: string; value: string; mono?: boolean }
function Row({ label, value, mono }: RowProps) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  );
}

function shortAddr(addr: string) {
  if (!addr) return "—";
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}
