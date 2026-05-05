import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { QrCode, ShoppingBag, Truck } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/batches/StatCard";
import { BatchTable } from "@/components/batches/BatchTable";
import { BatchDetailsSheet } from "@/components/batches/BatchDetailsSheet";
import { BatchActionDialog } from "@/components/batches/BatchActionDialog";
import { QRPublishDialog } from "@/components/batches/QRPublishDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useBatches } from "@/hooks/useBatches";
import type { Batch } from "@/lib/api";
import SettingsPage from "./SettingsPage";
import AllBatchesPage from "./AllBatchesPage";

function Overview() {
  const { data: allBatches, isLoading } = useBatches();
  const [selected, setSelected] = useState<Batch | null>(null);
  const [receiving, setReceiving] = useState<Batch | null>(null);
  const [qrBatch, setQrBatch] = useState<Batch | null>(null);

  const incoming = useMemo(() => (allBatches ?? []).filter((b) => b.status === "IN_TRANSIT"), [allBatches]);
  const inStock = useMemo(() => (allBatches ?? []).filter((b) => b.status === "RETAIL"), [allBatches]);
  const shelfValue = inStock.reduce((n, b) => n + b.total_price, 0);

  return (
    <DashboardShell title="Retailer workspace" subtitle="Receive shipments and publish QR codes">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Incoming" value={incoming.length} icon={Truck} />
        <StatCard label="In stock" value={inStock.length} icon={ShoppingBag} />
        <StatCard label="Shelf value" value={`₹${shelfValue}`} icon={QrCode} />
      </div>

      <Tabs defaultValue="incoming" className="mt-6">
        <TabsList>
          <TabsTrigger value="incoming">Incoming ({incoming.length})</TabsTrigger>
          <TabsTrigger value="stock">In stock ({inStock.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming">
          <BatchTable
            batches={incoming}
            loading={isLoading}
            emptyTitle="Nothing incoming"
            emptyDescription="Batches marked IN_TRANSIT will show up here."
            onRowClick={setSelected}
            rowAction={(b) => (
              <Button size="sm" onClick={(e) => { e.stopPropagation(); setReceiving(b); }}>Receive</Button>
            )}
          />
        </TabsContent>
        <TabsContent value="stock">
          <BatchTable
            batches={inStock}
            loading={isLoading}
            emptyTitle="No products on shelf"
            emptyDescription="Receive an incoming batch to put it on the shelf."
            onRowClick={setSelected}
            rowAction={(b) => (
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setQrBatch(b); }}>
                <QrCode className="mr-2 size-4" /> QR
              </Button>
            )}
          />
        </TabsContent>
      </Tabs>

      <BatchDetailsSheet batch={selected} onOpenChange={(o) => !o && setSelected(null)} />
      <BatchActionDialog action="receive" batch={receiving} onOpenChange={(o) => !o && setReceiving(null)} />
      <QRPublishDialog batch={qrBatch} onOpenChange={(o) => !o && setQrBatch(null)} />
    </DashboardShell>
  );
}

export default function RetailerDashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="batches" element={<AllBatchesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
