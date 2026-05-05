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
