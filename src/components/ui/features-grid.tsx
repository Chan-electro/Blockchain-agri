import { motion } from "framer-motion";
import { Shield, QrCode, Zap, Globe, LineChart, Link as LinkIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* Aceternity-style bento grid inspired by 21st.dev */

interface BentoItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  span: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  visual?: React.ReactNode;
}

const ChainVisual = () => (
  <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-hidden">
    {["Harvest", "Process", "Ship", "Retail", "Scan"].map((stage, i) => (
      <span key={stage} className="flex items-center gap-1.5">
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
          {stage}
        </span>
        {i < 4 && <span className="text-[10px] text-emerald-500/30">→</span>}
      </span>
    ))}
  </div>
);

const QRVisual = () => (
  <div className="mt-4 flex items-center gap-3">
    <div className="grid h-14 w-14 shrink-0 grid-cols-3 grid-rows-3 gap-0.5 rounded-lg border border-white/10 bg-white/5 p-1.5">
      {[1,1,0,1,0,1,0,1,1].map((filled, i) => (
        <div
          key={i}
          className={cn("rounded-[2px]", filled ? "bg-[#E1E0CC]/60" : "bg-transparent")}
        />
      ))}
    </div>
    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(225,224,204,0.5)" }}>
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
      <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
        <p className="text-base font-bold" style={{ color: "#E1E0CC" }}>{s.val}</p>
        <p className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(225,224,204,0.45)" }}>{s.label}</p>
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
    gradient: "from-emerald-950/80 via-black/60 to-black/80",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    visual: <ChainVisual />,
  },
  {
    title: "QR Code Traceability",
    desc: "One scan reveals the full provenance — farm, processor, logistics, retail. No account or app required.",
    icon: QrCode,
    span: "md:col-span-1",
    gradient: "from-blue-950/80 via-black/60 to-black/80",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    visual: <QRVisual />,
  },
  {
    title: "Real-Time Tracking",
    desc: "Live status updates — pickup, in-transit, delivered. Every stage timestamped and instantly visible to all authorised stakeholders.",
    icon: Zap,
    span: "md:col-span-1",
    gradient: "from-amber-950/80 via-black/60 to-black/80",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    visual: <StatsBadges />,
  },
  {
    title: "Smart Contract Automation",
    desc: "Role-based access via Ethereum smart contracts means each participant can only write to their own stage — automated handoffs, zero disputes.",
    icon: LinkIcon,
    span: "md:col-span-2",
    gradient: "from-violet-950/80 via-black/60 to-black/80",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
  {
    title: "Multi-Stakeholder Network",
    desc: "Five distinct roles — Farmer, Processor, Logistics, Retailer, Consumer — each with a tailored dashboard and cryptographically enforced permissions.",
    icon: Globe,
    span: "md:col-span-1",
    gradient: "from-emerald-950/80 via-black/60 to-black/80",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    title: "Admin Analytics",
    desc: "Bird's-eye metrics across all batches, stages, and stakeholders. Identify bottlenecks and generate audit reports instantly.",
    icon: LineChart,
    span: "md:col-span-3",
    gradient: "from-rose-950/80 via-black/60 to-black/80",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden py-24 px-5">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-violet-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{
              borderColor: "rgba(52,211,153,0.3)",
              backgroundColor: "rgba(52,211,153,0.08)",
              color: "#34d399",
            }}
          >
            Platform Capabilities
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: "#E1E0CC" }}>
            Why{" "}
            <span style={{ background: "linear-gradient(90deg, #34d399, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AgriChain?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: "rgba(225,224,204,0.6)" }}>
            Built on Ethereum, designed for real agricultural workflows. Six core capabilities that set AgriChain apart.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
            <motion.div
              key={item.title}
              className={cn(
                "group relative overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl",
                `bg-gradient-to-br ${item.gradient}`,
                item.span
              )}
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              {/* Subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%)" }}
              />

              <div className={cn("mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl", item.iconBg, item.iconColor)}>
                <Icon className="h-5 w-5" />
              </div>

              <h3
                className="mb-2 text-lg font-bold tracking-tight"
                style={{ color: "#E1E0CC" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(225,224,204,0.55)" }}>
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
