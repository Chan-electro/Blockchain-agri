import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { BatchTable } from "@/components/batches/BatchTable";
import { BatchDetailsSheet } from "@/components/batches/BatchDetailsSheet";
import { useBatches } from "@/hooks/useBatches";
import type { Batch } from "@/lib/api";

export default function AllBatchesPage() {
  const { data, isLoading } = useBatches();
  const [selected, setSelected] = useState<Batch | null>(null);

  return (
    <DashboardShell title="All batches" subtitle="Every batch tracked by the network">
      <BatchTable
        batches={data}
        loading={isLoading}
        onRowClick={setSelected}
      />
      <BatchDetailsSheet batch={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </DashboardShell>
  );
}
