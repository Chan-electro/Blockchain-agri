import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type ApiError, type Batch } from "@/lib/api";

type Action = "process" | "ship" | "receive";

const TITLES: Record<Action, string> = {
  process: "Add processing fee",
  ship: "Record transport fee",
  receive: "Apply retail markup",
};
const DESCRIPTIONS: Record<Action, string> = {
  process: "Adds your fee, advances the batch to PROCESSED.",
  ship: "Adds transport cost, advances the batch to IN_TRANSIT.",
  receive: "Adds retail markup, advances the batch to RETAIL.",
};
const FEE_LABEL: Record<Action, string> = {
  process: "Processing fee (₹)",
  ship: "Transport fee (₹)",
  receive: "Retail markup (₹)",
};
const CTA: Record<Action, string> = {
  process: "Commit processing fee",
  ship: "Commit transport fee",
  receive: "Commit retail markup",
};
const DEFAULT_DESC: Record<Action, string> = {
  process: "Cleaning & grading",
  ship: "Refrigerated transit",
  receive: "Retail markup",
};

const schema = z.object({
  fee: z.number({ message: "Enter a number" }).int().positive("Must be > 0"),
  description: z.string().max(256).optional(),
});

type FormValues = z.infer<typeof schema>;

interface BatchActionDialogProps {
  action: Action;
  batch: Batch | null;
  onOpenChange: (open: boolean) => void;
}

export function BatchActionDialog({ action, batch, onOpenChange }: BatchActionDialogProps) {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fee: 20, description: DEFAULT_DESC[action] },
  });

  useEffect(() => {
    reset({ fee: 20, description: DEFAULT_DESC[action] });
  }, [action, batch?.id, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!batch) throw new Error("No batch selected");
      const payload = { batchId: batch.id, fee: values.fee, description: values.description };
      if (action === "process") return api.processBatch(payload);
      if (action === "ship") return api.shipBatch(payload);
      return api.receiveBatch(payload);
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["batches"] });
      toast.success(`Batch #${updated.id} → ${updated.status}`);
      onOpenChange(false);
    },
    onError: (err: ApiError) => toast.error(err.message || "Chain call failed"),
  });

  return (
    <Dialog open={!!batch} onOpenChange={onOpenChange}>
      <DialogContent>
        {batch && (
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{TITLES[action]}</DialogTitle>
              <DialogDescription>{DESCRIPTIONS[action]}</DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="font-medium">Batch #{batch.id} — {batch.crop}</div>
              <div className="text-xs text-muted-foreground">Current total: ₹{batch.total_price} · {batch.weight} · {batch.location}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fee">{FEE_LABEL[action]}</Label>
              <Input id="fee" type="number" {...register("fee", { valueAsNumber: true })} />
              {errors.fee && <p className="text-xs text-destructive">{errors.fee.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" {...register("description")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Signing…</> : CTA[action]}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
