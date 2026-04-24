import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function RetailerDashboard() {
  return (
    <DashboardShell title="Retailer workspace" subtitle="Receive shipments and publish QR codes">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-5 text-primary" /> Retailer
          </CardTitle>
          <CardDescription>Receive flow + QR dialog land in the next phase.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add markup with <span className="font-mono">POST /api/batch/receive</span> then publish QR codes
          consumers can scan on <span className="font-mono">/scan</span>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
