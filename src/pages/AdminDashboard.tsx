import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, Layers, ShieldCheck, Users,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip as ReTooltip, XAxis, YAxis,
} from "recharts";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/batches/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/lib/api";
import SettingsPage from "./SettingsPage";
import AllBatchesPage from "./AllBatchesPage";

function Overview() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => api.adminOverview(),
  });

  if (isError) {
    return (
      <DashboardShell title="Admin overview" subtitle="Platform-wide analytics">
        <EmptyState
          title="Couldn't load admin overview"
          description={(error as Error).message}
        />
      </DashboardShell>
    );
  }

  const totalBatches = data?.batchesByStatus.reduce((n, s) => n + s.n, 0) ?? 0;
  const retailedRevenue = (data?.batchesByStatus.find((s) => s.status === "RETAIL")?.n ?? 0);

  return (
    <DashboardShell title="Admin overview" subtitle="Platform-wide analytics and activity">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </>
        ) : (
          <>
            <StatCard label="Total users" value={data?.users ?? 0} icon={Users} />
            <StatCard label="Total batches" value={totalBatches} icon={Layers} />
            <StatCard label="At retail" value={retailedRevenue} icon={ShieldCheck} />
            <StatCard label="Activity events" value={data?.recentActivity.length ?? 0} icon={Activity} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Batches by status</CardTitle>
            <CardDescription>Distribution across the supply chain</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.batchesByStatus ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                  <ReTooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="n" name="Batches" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">30-day volume</CardTitle>
            <CardDescription>Total ₹ value per day (from price breakdown)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : !data?.volumeByDay.length ? (
              <EmptyState title="No volume yet" description="Create batches to see trend lines." className="py-8" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.volumeByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <ReTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="volume" name="₹ volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="batches" name="# batches" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Latest stakeholder handoffs</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
              </div>
            ) : !data?.recentActivity.length ? (
              <EmptyState title="No activity yet" description="Activity shows up as batches move through the chain." className="py-8" />
            ) : (
              <ul className="space-y-2 text-sm">
                {data.recentActivity.map((evt, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
                    <div>
                      <span className="font-medium">{evt.role}</span>
                      <span className="text-muted-foreground"> added ₹{evt.amount} to </span>
                      <span className="font-medium">{evt.crop ?? `batch #${evt.batch_id}`}</span>
                      {evt.description && <span className="text-muted-foreground"> — {evt.description}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="batches" element={<AllBatchesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
