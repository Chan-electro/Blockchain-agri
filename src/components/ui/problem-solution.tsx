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
          <h2 className="text-4xl font-black tracking-tighter md:text-5xl uppercase">
            The Problem.{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Our Answer.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Traditional agricultural supply chains are opaque, fragmented, and ripe for fraud.
            AgriChain replaces every paper trail with an on-chain audit trail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-xl font-black text-destructive uppercase">
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

          <motion.div
            className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-xl font-black text-primary uppercase">
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
