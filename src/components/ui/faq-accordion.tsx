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
    <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-5">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-3 md:mt-4 max-w-xl text-sm md:text-lg text-muted-foreground">
            Everything you need to know about how AgriChain works and whether it's right for you.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/50 bg-white/70 backdrop-blur-md"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                className="flex w-full items-center justify-between px-4 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-bold transition-colors hover:text-primary md:text-base"
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
