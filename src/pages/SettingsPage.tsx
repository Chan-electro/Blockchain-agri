import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { CHAIN_NAME, CONTRACT_ADDRESS } from "@/lib/api";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <DashboardShell title="Settings" subtitle="Your account and network details">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Current session details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Email" value={user.email} mono />
            <Row label="Role" value={user.role} />
            <Row label="Wallet index" value={user.walletIndex == null ? "—" : String(user.walletIndex)} />
            <Row label="Created" value={new Date(user.createdAt).toLocaleString()} />
            <Button variant="outline" className="mt-3 w-full" onClick={logout}>
              <LogOut className="mr-2 size-4" /> Sign out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network</CardTitle>
            <CardDescription>Where your writes land.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Chain" value={CHAIN_NAME} />
            <Row label="Contract" value={CONTRACT_ADDRESS || "—"} mono />
            <p className="text-xs text-muted-foreground">
              In this demo the backend custodies your role wallet. In production each stakeholder would
              connect their own wallet.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

interface RowProps { label: string; value: string; mono?: boolean }
function Row({ label, value, mono }: RowProps) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  );
}
