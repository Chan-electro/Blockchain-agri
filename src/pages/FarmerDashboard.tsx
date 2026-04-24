import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Package, Sprout, Truck, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/batches/StatCard";
import { BatchTable } from "@/components/batches/BatchTable";
import { BatchDetailsSheet } from "@/components/batches/BatchDetailsSheet";
import { BatchCreateDialog } from "@/components/batches/BatchCreateDialog";
import { useBatches } from "@/hooks/useBatches";
import type { Batch } from "@/lib/api";
import SettingsPage from "./SettingsPage";
import AllBatchesPage from "./AllBatchesPage";

function Overview() {
  const { data: batches, isLoading } = useBatches();
  const [selected, setSelected] = useState<Batch | null>(null);

  const stats = useMemo(() => {
    const counts = { CREATED: 0, PROCESSED: 0, IN_TRANSIT: 0, RETAIL: 0, SOLD: 0 };
    let revenue = 0;
    for (const b of batches ?? []) {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
      if (b.status === "RETAIL" || b.status === "SOLD") revenue += b.total_price;
    }
    return { counts, revenue };
  }, [batches]);

  return (
    <DashboardShell
      title="Farmer workspace"
      subtitle="Create batches and track every handoff on-chain"
      actions={<BatchCreateDialog />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="On farm" value={stats.counts.CREATED} icon={Sprout} />
        <StatCard label="Processed" value={stats.counts.PROCESSED} icon={Package} />
        <StatCard label="In transit" value={stats.counts.IN_TRANSIT} icon={Truck} />
        <StatCard label="Revenue (at retail)" value={`₹${stats.revenue}`} icon={Wallet} />
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-semibold">Recent batches</h2>
        <BatchTable
          batches={batches}
          loading={isLoading}
          emptyTitle="No batches yet"
          emptyDescription="Use “Create batch” to register your first harvest on-chain."
          emptyAction={<BatchCreateDialog />}
          onRowClick={setSelected}
        />
      </div>

      <BatchDetailsSheet batch={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </DashboardShell>
  );
}

export default function FarmerDashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="batches" element={<AllBatchesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
