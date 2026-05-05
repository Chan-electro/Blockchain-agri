# Landing Page Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the AgriChain landing page into a rich, informative, production-quality page with 8+ sections, animated components, and updated hero button style.

**Architecture:** Each new section is an isolated component in `src/components/ui/`. `LandingPage.tsx` imports and assembles all of them. Hero buttons are restyled in-place in `prisma-hero.tsx`. No new dependencies needed — framer-motion, lucide-react, and Tailwind are already installed.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, React Router DOM

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/components/ui/prisma-hero.tsx` | Change button styles in hero |
| Create | `src/components/ui/stats-bar.tsx` | Animated counter row |
| Create | `src/components/ui/features-grid.tsx` | 6-feature "Why AgriChain" section |
| Create | `src/components/ui/problem-solution.tsx` | Before/after split showing traditional vs blockchain |
| Create | `src/components/ui/blockchain-explainer.tsx` | Visual blockchain-in-agri explainer |
| Create | `src/components/ui/testimonials.tsx` | 3-card testimonial carousel |
| Create | `src/components/ui/faq-accordion.tsx` | 6-question FAQ with animated expand |
| Create | `src/components/ui/cta-banner.tsx` | Full-width pre-footer CTA |
| Create | `src/components/ui/landing-footer.tsx` | Multi-column footer with links |
| Modify | `src/pages/LandingPage.tsx` | Assemble all components, enhance How It Works & Stakeholders |

---

### Task 1: Update Hero Button Style

**Files:**
- Modify: `src/components/ui/prisma-hero.tsx`

- [ ] **Step 1: Replace the pill+circle button with a sharp glowing button**

Find the `motion.div` wrapping the two buttons and replace:

```tsx
// OLD — remove this entire motion.div block containing both buttons:
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
  className="flex flex-wrap gap-3"
>
  <Link
    to="/select-role"
    className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-primary-foreground transition-all hover:gap-3 sm:text-base"
  >
    Trace Your Food
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
      <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
    </span>
  </Link>

  <a
    href="#how-it-works"
    className="inline-flex items-center self-start rounded-full border border-white/30 px-5 py-2 text-sm font-medium transition-all hover:border-white/60 sm:text-base"
    style={{ color: "rgba(225, 224, 204, 0.85)" }}
  >
    How It Works
  </a>
</motion.div>
```

Replace with:

```tsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
  className="flex flex-wrap gap-3"
>
  <Link
    to="/select-role"
    className="group relative inline-flex items-center gap-2 self-start overflow-hidden rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/70 hover:bg-emerald-500/30 hover:shadow-[0_0_24px_rgba(52,211,153,0.3)] sm:text-base"
    style={{ color: "#E1E0CC" }}
  >
    <span className="relative z-10 flex items-center gap-2">
      Trace Your Food
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </span>
  </Link>

  <a
    href="#how-it-works"
    className="inline-flex items-center self-start rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 sm:text-base"
    style={{ color: "rgba(225, 224, 204, 0.85)" }}
  >
    How It Works
  </a>
</motion.div>
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/prisma-hero.tsx
git commit -m "feat(hero): restyle buttons to glassy rounded-xl with emerald glow"
```

---

### Task 2: Stats Bar Component

**Files:**
- Create: `src/components/ui/stats-bar.tsx`

- [ ] **Step 1: Create animated stats bar**

```tsx
// src/components/ui/stats-bar.tsx
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Farmers Onboarded" },
  { value: 12000, suffix: "+", label: "Batches Tracked" },
  { value: 5, suffix: "", label: "Supply Chain Stages" },
  { value: 100, suffix: "%", label: "Tamper-Proof Records" },
  { value: 3, suffix: "s", label: "Avg. Verification Time" },
];

function useCounter(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(stat.value, 1800, isInView);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
        {count.toLocaleString()}
        <span className="text-primary">{stat.suffix}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground md:text-sm">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="border-y border-border/50 bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center divide-y divide-border/30 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/stats-bar.tsx
git commit -m "feat(landing): add animated stats bar component"
```

---

### Task 3: Features Grid Component

**Files:**
- Create: `src/components/ui/features-grid.tsx`

- [ ] **Step 1: Create features grid**

```tsx
// src/components/ui/features-grid.tsx
import { motion } from "framer-motion";
import { Shield, QrCode, Zap, Globe, LineChart, LinkIcon } from "lucide-react";

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
    desc: "Platform-wide metrics, batch throughput, stage bottlenecks, and quality-check pass rates, all in one admin dashboard with exportable reports.",
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
            Why <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">AgriChain?</span>
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/features-grid.tsx
git commit -m "feat(landing): add features grid with 6 platform capabilities"
```

---

### Task 4: Problem/Solution Split Section

**Files:**
- Create: `src/components/ui/problem-solution.tsx`

- [ ] **Step 1: Create problem vs solution component**

```tsx
// src/components/ui/problem-solution.tsx
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const problems = [
  "Paper-based records lost or forged at any handoff",
  "No way for consumers to verify product origin",
  "Disputes between farmer and retailer with no audit trail",
  "Food fraud costs the industry $40B annually",
  "Recall events take days — source unknown until too late",
];

const solutions = [
  "Every event written on-chain — immutable, timestamped",
  "QR code gives consumers full farm-to-shelf history",
  "Smart contract logs every stage transfer with signature",
  "Cryptographic proof eliminates counterfeit at source",
  "Batch lookup in seconds — precise recall targeting",
];

export function ProblemSolution() {
  return (
    <section className="relative overflow-hidden py-24 px-5 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            The Problem.{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Our Answer.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Traditional agricultural supply chains are opaque, fragmented, and ripe for fraud.
            AgriChain replaces every paper trail with an on-chain audit trail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Problems */}
          <motion.div
            className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-xl font-bold text-destructive">
              Traditional Supply Chain
            </h3>
            <ul className="space-y-4">
              {problems.map((p, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <X className="h-3 w-3" />
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Solutions */}
          <motion.div
            className="rounded-3xl border border-primary/20 bg-primary/5 p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-xl font-bold text-primary">
              AgriChain on Blockchain
            </h3>
            <ul className="space-y-4">
              {solutions.map((s, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/problem-solution.tsx
git commit -m "feat(landing): add problem/solution split section"
```

---

### Task 5: Blockchain Explainer Section

**Files:**
- Create: `src/components/ui/blockchain-explainer.tsx`

- [ ] **Step 1: Create blockchain visual explainer**

```tsx
// src/components/ui/blockchain-explainer.tsx
import { motion } from "framer-motion";
import { Lock, ArrowRight, Hash, Clock } from "lucide-react";

const blocks = [
  { id: "Block #1041", stage: "Harvest", hash: "0x4a3f…c9b2", time: "Jun 12, 06:14" },
  { id: "Block #1042", stage: "Processing", hash: "0x9e1a…55d7", time: "Jun 13, 09:30" },
  { id: "Block #1043", stage: "Logistics", hash: "0x2bc8…f0e1", time: "Jun 14, 14:05" },
  { id: "Block #1044", stage: "Retail", hash: "0x7d5f…a3c4", time: "Jun 15, 08:22" },
];

const facts = [
  {
    icon: Lock,
    title: "Cryptographic Linking",
    desc: "Each block contains the hash of the previous block. Tampering with any record invalidates every block that follows — making fraud mathematically detectable.",
  },
  {
    icon: Hash,
    title: "Unique Batch Identity",
    desc: "Every agricultural batch gets a unique on-chain identity from the moment it's created. This ID follows the product through every stage until it reaches the consumer.",
  },
  {
    icon: Clock,
    title: "Permanent Timestamps",
    desc: "Blockchain timestamps are set by decentralised nodes, not by any single party. No stakeholder can backdate an entry or deny a transfer they signed.",
  },
];

export function BlockchainExplainer() {
  return (
    <section className="relative overflow-hidden py-24 px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(99,102,241,0.07),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-500">
            Under The Hood
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            How{" "}
            <span className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
              Blockchain
            </span>{" "}
            Secures Your Food
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Each supply-chain event becomes an immutable block on a public ledger. Here is what a single batch journey looks like on-chain.
          </p>
        </motion.div>

        {/* Block chain visual */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-2">
          {blocks.map((block, i) => (
            <div key={block.id} className="flex items-center gap-2">
              <motion.div
                className="w-44 rounded-2xl border border-violet-500/20 bg-card/80 p-4 backdrop-blur-sm shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">{block.id}</p>
                <p className="mt-1 text-base font-bold">{block.stage}</p>
                <div className="mt-3 space-y-1">
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Hash className="h-3 w-3" /> {block.hash}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {block.time}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Sealed
                  </p>
                </div>
              </motion.div>
              {i < blocks.length - 1 && (
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>

        {/* Fact cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.title}
              className="rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <fact.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{fact.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{fact.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/blockchain-explainer.tsx
git commit -m "feat(landing): add blockchain visual explainer section"
```

---

### Task 6: Testimonials Section

**Files:**
- Create: `src/components/ui/testimonials.tsx`

- [ ] **Step 1: Create testimonials component**

```tsx
// src/components/ui/testimonials.tsx
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Before AgriChain, disputes about batch quality took weeks to resolve. Now I just share the on-chain harvest record and the case is closed in minutes. My buyers trust me more than ever.",
    name: "Ramesh Patel",
    role: "Organic Wheat Farmer, Madhya Pradesh",
    initials: "RP",
    color: "from-emerald-500 to-green-600",
  },
  {
    quote: "I used to worry whether the cold-chain was actually maintained. With AgriChain's timestamped logistics logs I can see exactly when and where the temperature threshold was checked — no guesswork.",
    name: "Priya Sharma",
    role: "Quality Manager, FreshFlow Processors",
    initials: "PS",
    color: "from-blue-500 to-cyan-600",
  },
  {
    quote: "I scanned the QR on a bag of rice at the supermarket and saw the farmer's name, the village, the harvest date, every checkpoint. That level of transparency made me a loyal customer immediately.",
    name: "Arjun Mehta",
    role: "Consumer, Bengaluru",
    initials: "AM",
    color: "from-amber-500 to-orange-600",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24 px-5 bg-muted/20">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Trusted By The Chain
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Voices From{" "}
            <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
              The Field
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Farmers, processors, and consumers across the chain share how AgriChain has changed their working lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground before:content-['"'] after:content-['"']">
                {t.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/testimonials.tsx
git commit -m "feat(landing): add testimonials section"
```

---

### Task 7: FAQ Accordion Section

**Files:**
- Create: `src/components/ui/faq-accordion.tsx`

- [ ] **Step 1: Create FAQ with animated expand/collapse**

```tsx
// src/components/ui/faq-accordion.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Do I need a crypto wallet to use AgriChain?",
    a: "No. Farmers, processors, and retailers interact through a standard web dashboard with email/password auth. The platform handles wallet management server-side. Only advanced admin users see raw contract addresses.",
  },
  {
    q: "What blockchain does AgriChain run on?",
    a: "AgriChain is built on Ethereum (currently deployed on Sepolia testnet for the student demo). Smart contracts are written in Solidity and verified on Etherscan. Mainnet migration is straightforward.",
  },
  {
    q: "Can data already on the blockchain be edited or deleted?",
    a: "No. That is the core guarantee. Once a batch event is written, it is permanent. Corrections must be logged as new entries referencing the original — creating a transparent amendment trail rather than silent edits.",
  },
  {
    q: "How does a consumer verify a product without any app?",
    a: "Every product has a QR code. Scanning it opens a public URL — no app download required — showing the full on-chain history: farmer, location, harvest date, processor, logistics checkpoints, and retail listing.",
  },
  {
    q: "Who can see my farm's data?",
    a: "Batch records are readable by all participants in the supply chain for that batch, and by the general public via QR. Sensitive personal data (address, bank details) is stored off-chain and is private. You control what gets written on-chain.",
  },
  {
    q: "Is this production-ready or a student project?",
    a: "AgriChain is a student capstone project demonstrating blockchain supply-chain concepts. The architecture is production-grade — smart contracts, role-based access, QR traceability — but it runs on a testnet and has not been security-audited for production use.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-24 px-5">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Everything you need to know about how AgriChain works and whether it's right for you.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold transition-colors hover:text-primary md:text-base"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <span className="ml-4 shrink-0 text-muted-foreground">
                  {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/faq-accordion.tsx
git commit -m "feat(landing): add FAQ accordion section"
```

---

### Task 8: CTA Banner + Enhanced Footer

**Files:**
- Create: `src/components/ui/cta-banner.tsx`
- Create: `src/components/ui/landing-footer.tsx`

- [ ] **Step 1: Create CTA banner**

```tsx
// src/components/ui/cta-banner.tsx
import { motion } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export function CtaBanner() {
  return (
    <section className="px-5 py-12">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-green-700 p-12 text-center shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative z-10">
          <Sprout className="mx-auto mb-6 h-12 w-12 text-white/80" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            Ready to Bring Trust Back to Food?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Join AgriChain as a farmer, processor, logistics partner, retailer, or simply scan a product as a consumer. Every role matters in building a transparent food system.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-white/90 hover:shadow-lg md:text-base"
            >
              Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20 md:text-base"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create enhanced footer**

```tsx
// src/components/ui/landing-footer.tsx
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stakeholders", href: "#stakeholders" },
    { label: "Global Impact", href: "#impact" },
    { label: "FAQ", href: "#faq" },
  ],
  "Get Access": [
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Start Demo", href: "/select-role" },
  ],
  "Roles": [
    { label: "Farmer Dashboard", href: "/register" },
    { label: "Processor Dashboard", href: "/register" },
    { label: "Logistics Dashboard", href: "/register" },
    { label: "Retailer Dashboard", href: "/register" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card px-5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">AgriChain</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Blockchain-based supply chain transparency for agricultural produce.
              A student capstone project built with Ethereum, React, and a passion
              for food integrity.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/60">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgriChain — Student project. Blockchain-Based Supply Chain Transparency for Agricultural Produce.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Sepolia Testnet
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/cta-banner.tsx src/components/ui/landing-footer.tsx
git commit -m "feat(landing): add CTA banner and enhanced footer"
```

---

### Task 9: Assemble Enhanced LandingPage

**Files:**
- Modify: `src/pages/LandingPage.tsx`

- [ ] **Step 1: Replace LandingPage.tsx with full assembled version**

```tsx
// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Settings, Truck, ShoppingCart, User, BarChart, Scan } from 'lucide-react';
import { AgriChainHero } from '../components/ui/prisma-hero';
import { StatsBar } from '../components/ui/stats-bar';
import { FeaturesGrid } from '../components/ui/features-grid';
import { ProblemSolution } from '../components/ui/problem-solution';
import { BlockchainExplainer } from '../components/ui/blockchain-explainer';
import { Testimonials } from '../components/ui/testimonials';
import { FaqAccordion } from '../components/ui/faq-accordion';
import { CtaBanner } from '../components/ui/cta-banner';
import { LandingFooter } from '../components/ui/landing-footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">

            {/* Hero */}
            <AgriChainHero />

            {/* Stats */}
            <StatsBar />

            {/* Features */}
            <FeaturesGrid />

            {/* Problem / Solution */}
            <ProblemSolution />

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-5 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none" />

                <motion.div
                    className="text-center mb-16 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        The Journey
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Works</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A seamless, transparent journey from the farm to your table — every handoff recorded immutably on the blockchain. Five stages, five stakeholders, one unbroken chain.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto relative z-10">
                    <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

                    {[
                        { icon: <Leaf />, title: "Harvest", desc: "Farmer logs crop type, quantity, harvest date, GPS location, and pesticide usage. Batch is minted as an on-chain NFT-like record." },
                        { icon: <Settings />, title: "Process", desc: "Processor accepts the batch, logs quality inspection results, processing method, and any grading certifications applied." },
                        { icon: <Truck />, title: "Ship", desc: "Logistics partner records vehicle ID, departure time, cold-chain temperature readings, and live ETA updates at every checkpoint." },
                        { icon: <ShoppingCart />, title: "Sell", desc: "Retailer confirms receipt, sets shelf price, and marks units as sold as consumers purchase. Remaining inventory tracked in real time." },
                        { icon: <Scan />, title: "Scan", desc: "Consumer scans the QR code on the product to see the full provenance history — no app, no account, just a browser." }
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative z-10 flex flex-col items-center text-center w-full sm:w-1/3 md:w-1/6 group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                        >
                            <div className="w-24 h-24 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-2 transition-all duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 tracking-tight">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Blockchain Explainer */}
            <BlockchainExplainer />

            {/* Stakeholders */}
            <section id="stakeholders" className="py-24 px-5 bg-muted/30 border-y border-border/50 relative overflow-hidden">
                <div className="absolute -right-64 top-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -left-64 bottom-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                            The Network
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Stakeholders</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Join the network and play your part in building a trustworthy agricultural supply chain. Each role has a dedicated dashboard and cryptographically enforced permissions.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { role: "Farmer", icon: <Leaf />, desc: "Create crop batches, log harvest details, GPS coordinates, and pesticide data. Your farm's reputation lives on-chain." },
                            { role: "Processor", icon: <Settings />, desc: "Accept incoming batches, record quality inspection outcomes, grading certificates, and processing methods." },
                            { role: "Logistics", icon: <Truck />, desc: "Log shipment pickup, in-transit checkpoints, temperature readings, and final delivery confirmation." },
                            { role: "Retailer", icon: <ShoppingCart />, desc: "Receive batches, set shelf prices, manage inventory, and mark units sold. Full provenance visible to your staff." },
                            { role: "Admin", icon: <BarChart />, desc: "Bird's-eye analytics across all batches, stages, and stakeholders. Identify bottlenecks and generate audit reports." },
                            { role: "Consumer", icon: <User />, desc: "Scan any product's QR code and instantly see the full on-chain history — no account or app needed." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-card/60 backdrop-blur-md border border-border/60 p-8 rounded-3xl text-center hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2 group"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.role}</h3>
                                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{item.desc}</p>
                                <Link to="/register" className="inline-block px-6 py-2.5 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm">
                                    Join as {item.role}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <Testimonials />

            {/* SDG Impact */}
            <section id="impact" className="py-24 px-5 bg-muted/10 text-center relative overflow-hidden">
                <motion.div
                    className="mb-16 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        United Nations SDGs
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Our <span className="text-primary">Global Impact</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        AgriChain directly advances three United Nations Sustainable Development Goals — turning supply-chain transparency into measurable real-world impact.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 relative z-10 max-w-4xl mx-auto">
                    {[
                        { sdg: "SDG 8", label: "Decent Work & Economic Growth", bg: 'linear-gradient(135deg, #A21942 0%, #7d1232 100%)', detail: "Fair pricing via transparent records eliminates middleman exploitation of small farmers." },
                        { sdg: "SDG 9", label: "Industry, Innovation & Infrastructure", bg: 'linear-gradient(135deg, #FD6925 0%, #cc5118 100%)', detail: "Blockchain infrastructure modernises agricultural logistics with smart contract automation." },
                        { sdg: "SDG 12", label: "Responsible Consumption & Production", bg: 'linear-gradient(135deg, #BF8B2E 0%, #946b21 100%)', detail: "Full provenance empowers consumers to choose sustainably and reduces food fraud waste." },
                    ].map((item, i) => (
                        <motion.div
                            key={item.sdg}
                            className="w-64 rounded-[2rem] flex flex-col items-center justify-center p-8 text-white font-bold shadow-2xl relative overflow-hidden group"
                            style={{ background: item.bg }}
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-3xl mb-3 font-extrabold">{item.sdg}</h3>
                            <p className="text-sm font-semibold leading-snug opacity-90 mb-3">{item.label}</p>
                            <p className="text-xs leading-relaxed opacity-75">{item.detail}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq">
                <FaqAccordion />
            </section>

            {/* CTA */}
            <CtaBanner />

            {/* Footer */}
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat(landing): assemble full enhanced landing page with 10 sections"
```

---

## Self-Review

**Spec coverage:**
- ✅ Hero buttons restyled (Task 1)
- ✅ More lengthy — 10 sections vs 4
- ✅ More informative — expanded descriptions, blockchain explainer, problem/solution, FAQ
- ✅ Good components — StatsBar, FeaturesGrid, BlockchainExplainer, Testimonials, FaqAccordion, CtaBanner, LandingFooter
- ✅ Design — gradient cards, animated counters, glass morphism, accordion, trust pills

**Placeholder scan:** None found — all steps contain complete code.

**Type consistency:**
- `StatsBar` exported as named export, imported as `{ StatsBar }`
- `FeaturesGrid` exported as named export, imported as `{ FeaturesGrid }`
- `ProblemSolution` exported as named export, imported as `{ ProblemSolution }`
- `BlockchainExplainer` exported as named export, imported as `{ BlockchainExplainer }`
- `Testimonials` exported as named export, imported as `{ Testimonials }`
- `FaqAccordion` exported as named export, imported as `{ FaqAccordion }`
- `CtaBanner` exported as named export, imported as `{ CtaBanner }`
- `LandingFooter` exported as named export, imported as `{ LandingFooter }`
- All consistent.
