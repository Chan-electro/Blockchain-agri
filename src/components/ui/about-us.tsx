import { motion } from "framer-motion";
import { CircularTestimonials } from "./circular-testimonials";
import "../../styles/circular-testimonials.css";

const teamMembers = [
  {
    quote:
      "I architected AgriChain end-to-end — from writing Solidity smart contracts and designing the Ethereum integration layer to building the React frontend and crafting every visual detail of the UI. Bridging full-stack engineering with design thinking was the key to making a complex blockchain system feel intuitive and polished.",
    name: "Chandan B Krishna",
    designation: "Full-Stack Engineer & Designer",
    src: "/team/chandan.png",
  },
  {
    quote:
      "I engineered the backend infrastructure and blockchain integration that powers AgriChain. From designing the Express API layer and MongoDB schemas to deploying and interacting with Solidity smart contracts on Sepolia, I ensured every supply-chain transaction is reliably recorded on-chain and accessible through robust REST endpoints.",
    name: "Chandu M",
    designation: "Backend & Blockchain",
    src: "/team/chandu.jpeg",
  },
  {
    quote:
      "I designed and developed the user-facing experience of AgriChain — from wireframing intuitive dashboard layouts in Figma to implementing responsive React components with pixel-perfect styling. My focus was ensuring that every farmer, processor, and retailer could navigate the platform effortlessly, making blockchain technology feel invisible behind a beautiful interface.",
    name: "J A Dharma Sudeep",
    designation: "UI/UX & Frontend",
    src: "/team/sudeep.jpeg",
  },
];

export function AboutUs() {
  return (
    <section id="about-us" className="relative overflow-hidden py-16 md:py-24 px-4 md:px-5">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-coral-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            The Team
          </span>
          <h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase">
            Meet the{" "}
            <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
              Builders
            </span>
          </h2>
          <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm md:text-lg text-muted-foreground">
            The minds behind AgriChain — a passionate team of engineers and designers
            building blockchain-powered agricultural transparency.
          </p>
        </motion.div>

        {/* Circular Testimonials carousel */}
        <div className="flex items-center justify-center">
          <CircularTestimonials
            testimonials={teamMembers}
            autoplay={true}
            colors={{
              name: "#1e293b",
              designation: "#64748b",
              testimony: "#334155",
              arrowBackground: "#4361EE",
              arrowForeground: "#ffffff",
              arrowHoverBackground: "#F56E4D",
            }}
            fontSizes={{
              name: "28px",
              designation: "18px",
              quote: "18px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
