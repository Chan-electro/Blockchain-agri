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
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
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
