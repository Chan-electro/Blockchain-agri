import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Settings, Truck, ShoppingCart, User, BarChart, Scan } from 'lucide-react';
import { Hero } from '../components/ui/animated-hero';
import ThreeScene from '../components/ThreeScene';


const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ThreeScene />
                </div>
                <div className="relative z-10 w-full">
                    <Hero />
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-5 bg-muted/50">
                <motion.h2
                    className="text-4xl font-bold text-center mb-16 text-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    How It Works
                </motion.h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border z-0" />

                    {[
                        { icon: <Leaf />, title: "Harvest", desc: "Farmer logs harvest details" },
                        { icon: <Settings />, title: "Process", desc: "Quality checks & processing" },
                        { icon: <Truck />, title: "Ship", desc: "Logistics tracking" },
                        { icon: <ShoppingCart />, title: "Sell", desc: "Retailer inventory" },
                        { icon: <Scan />, title: "Scan", desc: "Consumer verifies history" }
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative z-10 flex flex-col items-center text-center w-full sm:w-1/3 md:w-1/6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="w-24 h-24 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary text-3xl mb-4 shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stakeholders Section */}
            <section className="py-20 px-5">
                <h2 className="text-4xl font-bold text-center mb-12">Stakeholders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {[
                        { role: "Farmer", icon: <Leaf />, desc: "Create batches and log harvest details" },
                        { role: "Processor", icon: <Settings />, desc: "Process incoming batches, quality checks" },
                        { role: "Logistics", icon: <Truck />, desc: "Shipments, transit statuses" },
                        { role: "Retailer", icon: <ShoppingCart />, desc: "Inventory, shelf/price, sold" },
                        { role: "Admin", icon: <BarChart />, desc: "Global overview, analytics" },
                        { role: "Consumer", icon: <User />, desc: "QR Scan & Transparency" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-card border border-border p-8 rounded-xl text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="text-4xl mb-4 text-primary group-hover:text-primary/80 transition-colors flex justify-center">{item.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2">{item.role}</h3>
                            <p className="text-muted-foreground mb-6">{item.desc}</p>
                            <Link to="/select-role" className="inline-block px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                                Try as {item.role}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SDG Impact Section */}
            <section className="py-20 px-5 bg-background text-center">
                <h2 className="text-4xl font-bold mb-12">SDG Impact</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    <motion.div className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center p-4 text-white font-bold shadow-lg" style={{ background: '#A21942' }} whileHover={{ scale: 1.1 }}>
                        <h3 className="text-2xl mb-2">SDG 8</h3>
                        <p className="text-sm">Decent Work & Economic Growth</p>
                    </motion.div>
                    <motion.div className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center p-4 text-white font-bold shadow-lg" style={{ background: '#FD6925' }} whileHover={{ scale: 1.1 }}>
                        <h3 className="text-2xl mb-2">SDG 9</h3>
                        <p className="text-sm">Industry, Innovation & Infrastructure</p>
                    </motion.div>
                    <motion.div className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center p-4 text-white font-bold shadow-lg" style={{ background: '#BF8B2E' }} whileHover={{ scale: 1.1 }}>
                        <h3 className="text-2xl mb-2">SDG 12</h3>
                        <p className="text-sm">Responsible Consumption & Production</p>
                    </motion.div>
                </div>
            </section>

            <footer className="py-8 bg-muted text-center text-muted-foreground text-sm">
                <p>Student project – Blockchain-Based Supply Chain Transparency for Agricultural Produce.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
