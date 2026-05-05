import { Copy, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CHAIN_NAME } from "@/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TxHashChipProps {
  txHash?: string | null;
  blockNumber?: number | null;
  contractAddress?: string;
  className?: string;
}

export function TxHashChip({ txHash, blockNumber, contractAddress, className }: TxHashChipProps) {
  const [copied, setCopied] = useState(false);
  if (!txHash) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
        <Link2 className="size-3" /> no tx recorded
      </span>
    );
  }
  const short = `${txHash.slice(0, 10)}…${txHash.slice(-6)}`;

  async function onCopy() {
    try {
      if (txHash) {
        await navigator.clipboard.writeText(txHash);
        setCopied(true);
        toast.success("Tx hash copied");
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 font-mono text-xs text-foreground",
            "hover:bg-muted transition",
            className,
          )}
        >
          <span className="size-1.5 rounded-full bg-success" />
          <span>{short}</span>
          {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3 text-muted-foreground" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="space-y-1">
        <div className="font-medium">On-chain proof</div>
        <div className="font-mono text-[10px] leading-relaxed">
          <div>Network: {CHAIN_NAME}</div>
          {blockNumber != null && <div>Block: {blockNumber}</div>}
          {contractAddress && <div>Contract: {contractAddress.slice(0, 10)}…{contractAddress.slice(-6)}</div>}
          <div>Tx: {txHash}</div>
        </div>
        <div className="text-[10px] text-muted-foreground">Click to copy hash</div>
      </TooltipContent>
    </Tooltip>
  );
}
