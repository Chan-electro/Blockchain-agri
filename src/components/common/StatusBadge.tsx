import { Badge } from "@/components/ui/badge";
import type { BatchStatus } from "@/lib/api";

const VARIANT_BY_STATUS: Record<BatchStatus, "default" | "secondary" | "success" | "warning" | "outline"> = {
  CREATED: "secondary",
  PROCESSED: "default",
  IN_TRANSIT: "warning",
  RETAIL: "success",
  SOLD: "outline",
};

const LABEL_BY_STATUS: Record<BatchStatus, string> = {
  CREATED: "On farm",
  PROCESSED: "Processed",
  IN_TRANSIT: "In transit",
  RETAIL: "At retail",
  SOLD: "Sold",
};

interface StatusBadgeProps {
  status: BatchStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={VARIANT_BY_STATUS[status]}>{LABEL_BY_STATUS[status]}</Badge>;
}
