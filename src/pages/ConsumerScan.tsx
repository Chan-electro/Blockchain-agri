import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Camera, QrCode, Scan, X, History, Shield, Leaf, AlertTriangle, LogOut,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuth } from "@/hooks/useAuth";

const RECENT_KEY = "agri_recent_scans";
const MAX_RECENT = 5;

function loadRecent(): number[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function saveRecent(list: number[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT))); } catch { /* ignore */ }
}

function extractBatchId(raw: string): number | null {
  const urlMatch = raw.match(/\/product\/(\d+)/);
  const source = urlMatch ? urlMatch[1] : raw.trim();
  const n = Number(source);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function ConsumerScan() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [batchId, setBatchId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState("");
  const [recent, setRecent] = useState<number[]>(() => loadRecent());

  useEffect(() => saveRecent(recent), [recent]);

  function go(id: number) {
    const next = [id, ...recent.filter((n) => n !== id)].slice(0, MAX_RECENT);
    setRecent(next);
    navigate(`/product/${id}`);
  }

  function handleSignOut() {
    localStorage.removeItem(RECENT_KEY);
    if (token) {
      logout();
      navigate("/login", { replace: true });
    } else {
      navigate("/");
    }
  }

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault();
    const id = extractBatchId(batchId);
    if (id == null) {
      setScanError("Enter a positive number or a valid /product/:id URL");
      return;
    }
    go(id);
  }

  function handleScanResult(result: Array<{ rawValue: string }>) {
    if (!result?.length) return;
    const id = extractBatchId(result[0].rawValue);
    if (id == null) {
      setScanError("Unrecognised QR payload");
      return;
    }
    setShowScanner(false);
    go(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/30">
      <header className="flex items-center justify-between px-4 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
          <Leaf className="size-4 text-primary" />
          AgriChain
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Exit
        </button>
      </header>
      <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pt-4 sm:p-8 sm:pt-4">
        <Card>
          <CardHeader className="items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <QrCode className="size-6" />
            </div>
            <CardTitle>Scan a product QR</CardTitle>
            <CardDescription>See every handoff, on-chain, from farm to shelf.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              size="lg"
              className="h-14 w-full gap-2 text-base"
              onClick={() => { setScanError(""); setShowScanner(true); }}
            >
              <Camera className="size-5" /> Open camera scanner
            </Button>

            <div className="relative flex items-center justify-center py-1">
              <div className="h-px w-full bg-border" />
              <span className="absolute bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground">Or enter manually</span>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Batch ID (e.g. 1)"
                value={batchId}
                onChange={(e) => { setBatchId(e.target.value); setScanError(""); }}
                className="h-12"
              />
              <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
                <ArrowRight className="size-5" />
              </Button>
            </form>
            {scanError && <p className="text-center text-xs text-destructive">{scanError}</p>}

            <div className="grid grid-cols-3 border-t pt-4 text-center text-[11px] text-muted-foreground">
              <div className="flex items-center justify-center gap-1"><Leaf className="size-3" /> Provenance</div>
              <div className="flex items-center justify-center gap-1"><Shield className="size-3" /> Verified</div>
              <div className="flex items-center justify-center gap-1"><QrCode className="size-3" /> Transparent</div>
            </div>
          </CardContent>
        </Card>

        {recent.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <History className="size-4" /> Recent scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {recent.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => go(id)}
                      className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition hover:bg-muted"
                    >
                      <span>Batch #{id}</span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md overflow-hidden rounded-xl bg-background"
            >
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <Scan className="size-5 text-primary" />
                  <span className="font-semibold">Scan QR</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowScanner(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              <div className="relative aspect-square bg-black">
                <Scanner
                  onScan={handleScanResult}
                  onError={(err) => {
                    setScanError(err instanceof Error ? err.message : "Camera error");
                  }}
                  constraints={{ facingMode: "environment" }}
                  styles={{ container: { width: "100%", height: "100%" } }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative size-64 rounded-lg border-2 border-primary">
                    <div className="absolute left-0 top-0 size-8 rounded-tl-lg border-l-4 border-t-4 border-primary" />
                    <div className="absolute right-0 top-0 size-8 rounded-tr-lg border-r-4 border-t-4 border-primary" />
                    <div className="absolute bottom-0 left-0 size-8 rounded-bl-lg border-b-4 border-l-4 border-primary" />
                    <div className="absolute bottom-0 right-0 size-8 rounded-br-lg border-b-4 border-r-4 border-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {scanError ? (
                  <EmptyState
                    icon={<AlertTriangle className="size-5 text-destructive" />}
                    title="Camera unavailable"
                    description={scanError + " — use manual entry instead."}
                    className="py-6"
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground">Align the QR inside the frame.</p>
                )}
                <Button variant="outline" className="w-full" onClick={() => setShowScanner(false)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
