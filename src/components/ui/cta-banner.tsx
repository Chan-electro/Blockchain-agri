import { motion } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export function CtaBanner() {
  return (
    <section className="px-4 md:px-5 py-8 md:py-12">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary via-indigo-500 to-blue-600 p-8 md:p-12 text-center shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative z-10">
          <Sprout className="mx-auto mb-6 h-12 w-12 text-white/80" />
          <h2 className="text-2xl font-black tracking-tighter text-white md:text-4xl lg:text-5xl uppercase">
            Ready to Bring Trust Back to Food?
          </h2>
          <p className="mx-auto mt-3 md:mt-4 max-w-xl text-xs md:text-base text-white/80 md:text-lg">
            Join AgriChain as a farmer, processor, logistics partner, retailer, or simply scan a product as a consumer. Every role matters in building a transparent food system.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 md:px-7 py-2.5 md:py-3 text-xs md:text-sm font-black text-primary uppercase tracking-wider transition-all duration-300 hover:bg-white/90 hover:shadow-lg md:text-base"
            >
              Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 md:px-7 py-2.5 md:py-3 text-xs md:text-sm font-bold text-white uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20 md:text-base"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
