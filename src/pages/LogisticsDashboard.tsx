import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function LogisticsDashboard() {
  return (
    <DashboardShell title="Logistics workspace" subtitle="Move PROCESSED batches into transit">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5 text-primary" /> Logistics
          </CardTitle>
          <CardDescription>Shipment queue + transport logging land in the next phase.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pick up PROCESSED batches and record the transport fee with
          <span className="font-mono"> POST /api/batch/ship</span>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
