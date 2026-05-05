import { useQuery } from "@tanstack/react-query";
import { api, type Batch, type BatchStatus } from "@/lib/api";

export function useBatches(status?: BatchStatus) {
  return useQuery<Batch[]>({
    queryKey: ["batches", status ?? "all"],
    queryFn: () => api.listBatches(status),
  });
}
