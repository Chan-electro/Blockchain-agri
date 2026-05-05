import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- AgriChain Hero ---------------- */
const navItems = [
  { label: "How It Works", href: "#how-it-works", external: false },
  { label: "Stakeholders", href: "#stakeholders", external: false },
  { label: "Impact", href: "#impact", external: false },
  { label: "Sign In", href: "/login", external: true },
  { label: "Get Started", href: "/register", external: true },
];

const AgriChainHero = () => {
  return (
    /*
      Section is taller than viewport — video fills the extra height below the fold,
      then fades to black, creating a seamless transition into the dark page.
    */
    <section className="relative w-full overflow-hidden" style={{ minHeight: "110vh" }}>

      {/* Video background — fills full 110vh, no bottom rounding for seamless bleed */}
      <div className="absolute inset-0 overflow-hidden rounded-t-2xl md:rounded-t-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />
        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        {/*
          Multi-stop gradient:
          - Top 30%: dark overlay for readability
          - 30-60%: fades to transparent (video shows)
          - 60-82%: builds back to dark for text readability
          - 82-100%: transitions from dark to white for seamless page transition
        */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0.35) 0%,
              rgba(0,0,0,0.10) 30%,
              transparent 45%,
              rgba(0,0,0,0.15) 58%,
              rgba(0,0,0,0.55) 72%,
              rgba(0,0,0,0.70) 82%,
              rgba(0,0,0,0.50) 90%,
              rgba(255,255,255,0.60) 95%,
              rgba(255,255,255,1) 100%
            )`,
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-b-2xl bg-black/90 backdrop-blur-md px-4 py-2 sm:gap-5 md:gap-8 md:rounded-b-3xl md:px-8 lg:gap-10">
          {navItems.map((item) =>
            item.external ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
              >
                {item.label}
              </a>
            )
          )}
        </div>
      </nav>

      {/* Hero content — anchored to 100vh mark so it stays in the visible viewport */}
      <div
        className="absolute left-0 right-0 z-10 px-4 sm:px-6 md:px-10"
        style={{ bottom: "18vh" }}
      >
        <div className="grid grid-cols-12 items-end gap-4">

          <div className="col-span-12 lg:col-span-8">
            <h1
              className="font-medium leading-[0.85] tracking-[-0.07em] text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7.5vw] 2xl:text-[8vw]"
              style={{ color: "#E1E0CC" }}
            >
              <WordsPullUp text="AgriChain" showAsterisk />
            </h1>
          </div>

          <div className="col-span-12 flex flex-col gap-5 pb-4 lg:col-span-4 lg:pb-6">

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm md:text-base"
              style={{ color: "rgba(225, 224, 204, 0.75)", lineHeight: 1.3 }}
            >
              A blockchain-powered platform connecting farmers, processors, logistics providers,
              retailers, and consumers — creating an immutable, transparent record of every
              crop's journey from soil to shelf.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/select-role"
                className="group relative inline-flex items-center gap-2 self-start overflow-hidden rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/70 hover:bg-indigo-500/30 hover:shadow-[0_0_24px_rgba(67,97,238,0.3)] sm:text-base"
                style={{ color: "#E1E0CC" }}
              >
                Trace Your Food
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center self-start rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 sm:text-base"
                style={{ color: "rgba(225, 224, 204, 0.85)" }}
              >
                How It Works
              </a>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-2"
            >
              {["Immutable logs", "QR traceability", "5 stakeholders"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm sm:text-xs"
                  style={{ color: "rgba(225, 224, 204, 0.7)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {tag}
                </span>
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Asterisk footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute left-4 text-[9px] sm:left-6 md:left-10 sm:text-[10px]"
        style={{ color: "rgba(225, 224, 204, 0.4)", bottom: "4vh" }}
      >
        * Blockchain-based supply chain transparency for agricultural produce
      </motion.p>

    </section>
  );
};

export { AgriChainHero };
