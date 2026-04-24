import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";

export default function FarmerDashboard() {
  return (
    <DashboardShell title="Farmer workspace" subtitle="Create batches and track the on-chain journey">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="size-5 text-primary" /> Welcome, farmer
          </CardTitle>
          <CardDescription>
            Foundation is in place. The full farmer experience — stat cards, batch table, create dialog,
            tx drawer — lands in the next phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Once Phase 4 ships, this page will show your batches with live tx hashes, status badges,
          and a Create Batch flow backed by <span className="font-mono">POST /api/batch/create</span>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
