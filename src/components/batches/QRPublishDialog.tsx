import { useRef } from "react";
import QRCode from "react-qr-code";
import { Download, Printer } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Batch } from "@/lib/api";

interface QRPublishDialogProps {
  batch: Batch | null;
  onOpenChange: (open: boolean) => void;
}

export function QRPublishDialog({ batch, onOpenChange }: QRPublishDialogProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const productUrl = batch ? `${window.location.origin}/product/${batch.id}` : "";

  function download() {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 32, 32, size - 64, size - 64);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `agrichain-batch-${batch?.id}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(source)));
  }

  function printQR() {
    window.print();
  }

  return (
    <Dialog open={!!batch} onOpenChange={onOpenChange}>
      <DialogContent>
        {batch && (
          <>
            <DialogHeader>
              <DialogTitle>Publish QR for batch #{batch.id}</DialogTitle>
              <DialogDescription>Print or stick this QR on the product. Any consumer can scan it to see the full on-chain journey.</DialogDescription>
            </DialogHeader>
            <div ref={wrapperRef} className="flex flex-col items-center gap-3 rounded-lg border bg-white p-6 text-center text-slate-900 print:shadow-none">
              <div className="text-lg font-bold">{batch.crop}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Batch #{batch.id} · {batch.weight}</div>
              <QRCode value={productUrl} size={192} />
              <div className="text-[10px] text-slate-500">{productUrl}</div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={printQR}>
                <Printer className="mr-2 size-4" /> Print
              </Button>
              <Button onClick={download}>
                <Download className="mr-2 size-4" /> Download PNG
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
