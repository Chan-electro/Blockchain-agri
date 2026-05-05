import { motion } from "framer-motion";
import { Shield, QrCode, Zap, Globe, LineChart, Link as LinkIcon } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Blockchain Immutability",
    desc: "Every harvest record, quality check, and shipment update is written to an immutable smart contract. No one — not even the platform admin — can alter past entries.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: QrCode,
    title: "QR Code Traceability",
    desc: "Consumers scan a single QR code on any product to get the full provenance: which farm, which batch, which processor, every temperature checkpoint along the way.",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Real-Time Tracking",
    desc: "Logistics partners push live status updates — pickup, in-transit, delivered. Every stage is timestamped and visible to all authorised stakeholders instantly.",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-500",
  },
  {
    icon: LinkIcon,
    title: "Smart Contract Automation",
    desc: "Role-based access via Ethereum smart contracts means each participant can only write to their own stage. Automated handoff rules eliminate disputes between stages.",
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-500",
  },
  {
    icon: Globe,
    title: "Multi-Stakeholder Network",
    desc: "Five distinct roles — Farmer, Processor, Logistics, Retailer, Consumer — each with a tailored dashboard and cryptographically enforced permissions.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: LineChart,
    title: "Admin Analytics",
    desc: "Platform-wide metrics, batch throughput, stage bottlenecks, and quality-check pass rates — all in one admin dashboard with exportable reports.",
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-500",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden py-24 px-5">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Platform Capabilities
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Why{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              AgriChain?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Built on Ethereum, designed for real agricultural workflows. Six core capabilities that set AgriChain apart from traditional supply-chain management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${f.color} p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 ${f.iconColor} shadow-sm`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
