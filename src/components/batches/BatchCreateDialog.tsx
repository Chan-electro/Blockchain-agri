import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type ApiError, type Batch } from "@/lib/api";
import { TxHashChip } from "@/components/common/TxHashChip";

const schema = z.object({
  crop: z.string().min(1, "Required").max(64),
  weight: z.string().min(1, "Required").max(32),
  location: z.string().min(1, "Required").max(128),
  basePrice: z.number({ message: "Enter a number" }).int().positive("Must be > 0"),
});

type FormValues = z.infer<typeof schema>;

export function BatchCreateDialog() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<Batch | null>(null);
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { crop: "", weight: "", location: "", basePrice: 100 },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => api.createBatch(values),
    onSuccess: (batch) => {
      setCreated(batch);
      qc.invalidateQueries({ queryKey: ["batches"] });
      toast.success(`Batch #${batch.id} created on-chain`);
      reset();
    },
    onError: (err: ApiError) => toast.error(err.message || "Failed to create batch"),
  });

  function onOpenChange(next: boolean) {
    if (!next) {
      setCreated(null);
      reset();
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" /> Create batch
        </Button>
      </DialogTrigger>
      <DialogContent>
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Batch #{created.id} created</DialogTitle>
              <DialogDescription>Signed and committed on-chain.</DialogDescription>
            </DialogHeader>
            <dl className="space-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Crop</dt><dd className="font-medium">{created.crop}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Total price</dt><dd className="font-semibold text-primary">₹{created.total_price}</dd></div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">Transaction</dt>
                <dd><TxHashChip txHash={created.txHash ?? created.tx_hash} blockNumber={created.blockNumber ?? created.block_number ?? null} contractAddress={created.contractAddress} /></dd>
              </div>
            </dl>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Create a new batch</DialogTitle>
              <DialogDescription>Your farmer wallet will sign the transaction on-chain.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="crop">Crop</Label>
              <Input id="crop" {...register("crop")} placeholder="e.g. Basmati Rice" />
              {errors.crop && <p className="text-xs text-destructive">{errors.crop.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" {...register("weight")} placeholder="e.g. 500kg" />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="basePrice">Base price (₹)</Label>
                <Input id="basePrice" type="number" {...register("basePrice", { valueAsNumber: true })} />
                {errors.basePrice && <p className="text-xs text-destructive">{errors.basePrice.message}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="e.g. Punjab, IN" />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Signing…</> : "Create on-chain"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
