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
    <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-5">
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
          <h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase">
            How{" "}
            <span className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
              Blockchain
            </span>{" "}
            Secures Your Food
          </h2>
          <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm md:text-lg text-muted-foreground">
            Each supply-chain event becomes an immutable block on a public ledger. Here is what a single batch journey looks like on-chain.
          </p>
        </motion.div>

        {/* Block chain visual */}
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row flex-wrap items-center justify-center gap-2">
          {blocks.map((block, i) => (
            <div key={block.id} className="flex items-center gap-2">
              <motion.div
                className="w-full md:w-44 rounded-[1.5rem] md:rounded-2xl border border-violet-500/20 bg-card/80 p-3 md:p-4 backdrop-blur-sm shadow-lg"
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
                <ArrowRight className="hidden md:block h-5 w-5 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>

        {/* Fact cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.title}
              className="rounded-[1.5rem] md:rounded-3xl border border-border/60 bg-card/60 p-6 md:p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <fact.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 md:mb-2 text-base md:text-lg font-bold">{fact.title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">{fact.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
