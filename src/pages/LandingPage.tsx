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
        <div className="landing min-h-screen bg-background text-foreground overflow-x-hidden font-sans">

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
                        { icon: <Leaf />, title: "Harvest", desc: "Farmer logs crop type, quantity, harvest date, GPS location, and pesticide usage. Batch is minted as an on-chain record." },
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
