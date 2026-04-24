import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CheckCircle2, Factory, Inbox } from "lucide-react";

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

  const queue = useMemo(() => (allBatches ?? []).filter((b) => b.status === "CREATED"), [allBatches]);
  const processedCount = (allBatches ?? []).filter((b) => b.status === "PROCESSED").length;
  const handledByMe = (allBatches ?? []).filter((b) =>
    b.priceBreakdown?.some((c) => c.role === "PROCESSOR"),
  ).length;

  return (
    <DashboardShell title="Processor workspace" subtitle="Add fees to CREATED batches and move them forward">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting processing" value={queue.length} icon={Inbox} />
        <StatCard label="Total processed" value={processedCount} icon={CheckCircle2} />
        <StatCard label="Handled by processors" value={handledByMe} icon={Factory} />
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-semibold">Queue — waiting for processing</h2>
        <BatchTable
          batches={queue}
          loading={isLoading}
          emptyTitle="Queue is empty"
          emptyDescription="Every CREATED batch has already been processed."
          onRowClick={setSelected}
          rowAction={(b) => (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); setActing(b); }}>Process</Button>
          )}
        />
      </div>

      <BatchDetailsSheet batch={selected} onOpenChange={(o) => !o && setSelected(null)} />
      <BatchActionDialog action="process" batch={acting} onOpenChange={(o) => !o && setActing(null)} />
    </DashboardShell>
  );
}

export default function ProcessorDashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="batches" element={<AllBatchesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
