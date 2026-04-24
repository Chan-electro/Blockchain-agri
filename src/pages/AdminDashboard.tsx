import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardShell title="Admin overview" subtitle="Platform-wide analytics and activity">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" /> Admin
          </CardTitle>
          <CardDescription>Charts + activity feed land in the next phase.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Data stream is ready at <span className="font-mono">GET /api/admin/overview</span>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
