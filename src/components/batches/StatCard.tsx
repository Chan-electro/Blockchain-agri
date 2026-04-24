import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accentClassName?: string;
}

export function StatCard({ label, value, hint, icon: Icon, accentClassName }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn("flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary", accentClassName)}>
            <Icon className="size-4" />
          </div>
        )}
      </div>
    </Card>
  );
}
