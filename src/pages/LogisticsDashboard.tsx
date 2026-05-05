import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CheckCircle2, Inbox, Truck } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/batches/StatCard";
import { BatchTable } from "@/components/batches/BatchTable";
import { BatchDetailsSheet } from "@/components/batches/BatchDetailsSheet";
import { BatchActionDialog } from "@/components/batches/BatchActionDialog";
import { Button } from "@/components/ui/button";
import { useBatches } from "@/hooks/useBatches";
import type { Batch } from "@/lib/api";
import SettingsPage from "./SettingsPage";
import AllBatchesPage from "./AllBatchesPage";

function Overview() {
  const { data: allBatches, isLoading } = useBatches();
  const [selected, setSelected] = useState<Batch | null>(null);
  const [acting, setActing] = useState<Batch | null>(null);

  const queue = useMemo(() => (allBatches ?? []).filter((b) => b.status === "PROCESSED"), [allBatches]);
  const inTransit = (allBatches ?? []).filter((b) => b.status === "IN_TRANSIT").length;
  const delivered = (allBatches ?? []).filter((b) => b.status === "RETAIL" || b.status === "SOLD").length;

  return (
    <DashboardShell title="Logistics workspace" subtitle="Move PROCESSED batches into transit">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ready to ship" value={queue.length} icon={Inbox} />
        <StatCard label="In transit" value={inTransit} icon={Truck} />
        <StatCard label="Delivered" value={delivered} icon={CheckCircle2} />
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-semibold">Queue — ready to ship</h2>
        <BatchTable
          batches={queue}
          loading={isLoading}
          emptyTitle="Nothing to ship"
          emptyDescription="All PROCESSED batches are already in transit or delivered."
          onRowClick={setSelected}
          rowAction={(b) => (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); setActing(b); }}>Ship</Button>
          )}
        />
      </div>

      <BatchDetailsSheet batch={selected} onOpenChange={(o) => !o && setSelected(null)} />
      <BatchActionDialog action="ship" batch={acting} onOpenChange={(o) => !o && setActing(null)} />
    </DashboardShell>
  );
}

export default function LogisticsDashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="batches" element={<AllBatchesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
