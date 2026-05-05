import { motion } from "framer-motion";
import { CircularTestimonials } from "./circular-testimonials";
import "../../styles/circular-testimonials.css";

const teamMembers = [
  {
    quote:
      "I led the architecture of AgriChain — from designing the Solidity smart contracts on Ethereum to building the React frontend. My goal was to create a seamless, transparent supply chain that empowers every stakeholder from farmer to consumer.",
    name: "Chandan B Krishna",
    designation: "Full-Stack Developer & Project Lead",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "I built the backend API layer and handled blockchain integration for AgriChain. From designing the database architecture to connecting smart contracts with the REST endpoints, I ensured the data flows reliably across every stage of the supply chain.",
    name: "Chandu M",
    designation: "Backend Engineer & Blockchain Specialist",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "I crafted the user experience and frontend interfaces for AgriChain — designing intuitive dashboards for farmers, processors, logistics, and retailers. My focus was making blockchain technology feel accessible and effortless for every user.",
    name: "J A Dharma Sudeep",
    designation: "Frontend Developer & UI/UX Designer",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3",
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
