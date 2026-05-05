import { motion } from "framer-motion";
import { Shield, QrCode, Zap, Globe, LineChart, Link as LinkIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* Glassmorphic bento grid with premium typography */

interface BentoItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  span: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  visual?: React.ReactNode;
}

const ChainVisual = () => (
  <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-hidden">
    {["Harvest", "Process", "Ship", "Retail", "Scan"].map((stage, i) => (
      <span key={stage} className="flex items-center gap-1.5">
        <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-600">
          {stage}
        </span>
        {i < 4 && <span className="text-[10px] text-indigo-400/50">→</span>}
      </span>
    ))}
  </div>
);

const QRVisual = () => (
  <div className="mt-4 flex items-center gap-3">
    <div className="grid h-14 w-14 shrink-0 grid-cols-3 grid-rows-3 gap-0.5 rounded-lg border border-foreground/10 bg-foreground/5 p-1.5">
      {[1,1,0,1,0,1,0,1,1].map((filled, i) => (
        <div
          key={i}
          className={cn("rounded-[2px]", filled ? "bg-foreground/50" : "bg-transparent")}
        />
      ))}
    </div>
    <p className="text-[11px] leading-relaxed text-muted-foreground">
      Scan any product label<br />→ full farm-to-shelf history<br />No app needed
    </p>
  </div>
);

const StatsBadges = () => (
  <div className="mt-4 flex flex-wrap gap-2">
    {[
      { label: "Avg verify", val: "1.2s" },
      { label: "Batches", val: "12k+" },
      { label: "Tamper-proof", val: "100%" },
    ].map((s) => (
      <div key={s.label} className="rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-center">
        <p className="text-base font-bold text-foreground">{s.val}</p>
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
      </div>
    ))}
  </div>
);

const items: BentoItem[] = [
  {
    title: "Blockchain Immutability",
    desc: "Every harvest record, quality check, and shipment update is written to an immutable smart contract. No one — not even the admin — can alter past entries.",
    icon: Shield,
    span: "md:col-span-2",
    accentColor: "rgba(67, 97, 238, 0.12)",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-500",
    visual: <ChainVisual />,
  },
  {
    title: "QR Code Traceability",
    desc: "One scan reveals the full provenance — farm, processor, logistics, retail. No account or app required.",
    icon: QrCode,
    span: "md:col-span-1",
    accentColor: "rgba(59, 130, 246, 0.12)",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    visual: <QRVisual />,
  },
  {
    title: "Real-Time Tracking",
    desc: "Live status updates — pickup, in-transit, delivered. Every stage timestamped and instantly visible to all authorised stakeholders.",
    icon: Zap,
    span: "md:col-span-1",
    accentColor: "rgba(245, 158, 11, 0.12)",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
    visual: <StatsBadges />,
  },
  {
    title: "Smart Contract Automation",
    desc: "Role-based access via Ethereum smart contracts means each participant can only write to their own stage — automated handoffs, zero disputes.",
    icon: LinkIcon,
    span: "md:col-span-2",
    accentColor: "rgba(139, 92, 246, 0.12)",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
  },
  {
    title: "Multi-Stakeholder Network",
    desc: "Five distinct roles — Farmer, Processor, Logistics, Retailer, Consumer — each with a tailored dashboard and cryptographically enforced permissions.",
    icon: Globe,
    span: "md:col-span-1",
    accentColor: "rgba(67, 97, 238, 0.12)",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-500",
  },
  {
    title: "Admin Analytics",
    desc: "Bird's-eye metrics across all batches, stages, and stakeholders. Identify bottlenecks and generate audit reports instantly.",
    icon: LineChart,
    span: "md:col-span-3",
    accentColor: "rgba(244, 63, 94, 0.10)",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-5">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-violet-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-10 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{
              borderColor: "rgba(67,97,238,0.3)",
              backgroundColor: "rgba(67,97,238,0.08)",
              color: "#4361EE",
            }}
          >
            Platform Capabilities
          </span>
          <h2
            className="text-3xl font-black tracking-tighter md:text-5xl text-foreground uppercase"
          >
            Why{" "}
            <span style={{ background: "linear-gradient(90deg, #4361EE, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AgriChain?
            </span>
          </h2>
          <p
            className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm md:text-lg text-muted-foreground"
          >
            Built on Ethereum, designed for real agricultural workflows. Six core capabilities that set AgriChain apart.
          </p>
        </motion.div>

        {/* Glassmorphic Bento grid */}
        <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
            <motion.div
              key={item.title}
              className={cn(
                "group relative overflow-hidden rounded-[1.5rem] md:rounded-3xl border p-5 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
                item.span
              )}
              style={{
                background: `linear-gradient(135deg, ${item.accentColor}, rgba(255,255,255,0.75))`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.45)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              {/* Subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(67,97,238,0.08), transparent 60%)" }}
              />

              <div className={cn("mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl", item.iconBg, item.iconColor)}>
                <Icon className="h-5 w-5" />
              </div>

              <h3
                className="mb-1 md:mb-2 text-base md:text-lg font-bold tracking-tight text-foreground"
              >
                {item.title}
              </h3>
              <p
                className="text-xs md:text-sm leading-relaxed text-muted-foreground"
              >
                {item.desc}
              </p>

              {item.visual}
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
