import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

export default function ProcessorDashboard() {
  return (
    <DashboardShell title="Processor workspace" subtitle="Add processing fees to CREATED batches">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="size-5 text-primary" /> Processor
          </CardTitle>
          <CardDescription>Queue view + processing flow land in the next phase.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          You'll see all batches awaiting processing and be able to commit your fee on-chain via
          <span className="font-mono"> POST /api/batch/process</span>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
