import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Settings, Truck, ShoppingCart, User, BarChart, Scan } from 'lucide-react';
import { Hero } from '../components/ui/animated-hero';
import ThreeScene from '../components/ThreeScene';
import { Header } from '../components/common/Header';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ThreeScene />
                </div>
                {/* Subtle gradient overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background z-0"></div>
                <div className="relative z-10 w-full pt-20">
                    <Hero />
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-5 relative">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
                
                <motion.div 
                    className="text-center mb-16 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Works</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A seamless, transparent journey from the farm to your table, recorded immutably on the blockchain.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto relative z-10">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

                    {[
                        { icon: <Leaf />, title: "Harvest", desc: "Farmer logs harvest details" },
                        { icon: <Settings />, title: "Process", desc: "Quality checks & processing" },
                        { icon: <Truck />, title: "Ship", desc: "Logistics tracking" },
                        { icon: <ShoppingCart />, title: "Sell", desc: "Retailer inventory" },
                        { icon: <Scan />, title: "Scan", desc: "Consumer verifies history" }
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

            {/* Stakeholders Section */}
            <section id="stakeholders" className="py-24 px-5 bg-muted/30 border-y border-border/50 relative overflow-hidden">
                <div className="absolute -right-64 top-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute -left-64 bottom-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Stakeholders</span></h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Join the network and play your part in building a trustworthy agricultural supply chain.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                <Link to="/register" className="inline-block px-6 py-2.5 rounded-full border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm">
                                    Join as {item.role}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SDG Impact Section */}
            <section id="impact" className="py-24 px-5 bg-background text-center relative overflow-hidden">
                <motion.div 
                    className="mb-16 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Our <span className="text-primary">Global Impact</span></h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Aligning with the United Nations Sustainable Development Goals for a better future.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 relative z-10">
                    <motion.div 
                        className="w-56 h-56 rounded-[2rem] flex flex-col items-center justify-center p-6 text-white font-bold shadow-2xl relative overflow-hidden group" 
                        style={{ background: 'linear-gradient(135deg, #A21942 0%, #7d1232 100%)' }} 
                        whileHover={{ y: -10 }}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl mb-3 font-extrabold">SDG 8</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-90">Decent Work & Economic Growth</p>
                    </motion.div>
                    <motion.div 
                        className="w-56 h-56 rounded-[2rem] flex flex-col items-center justify-center p-6 text-white font-bold shadow-2xl relative overflow-hidden group" 
                        style={{ background: 'linear-gradient(135deg, #FD6925 0%, #cc5118 100%)' }} 
                        whileHover={{ y: -10 }}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl mb-3 font-extrabold">SDG 9</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-90">Industry, Innovation & Infrastructure</p>
                    </motion.div>
                    <motion.div 
                        className="w-56 h-56 rounded-[2rem] flex flex-col items-center justify-center p-6 text-white font-bold shadow-2xl relative overflow-hidden group" 
                        style={{ background: 'linear-gradient(135deg, #BF8B2E 0%, #946b21 100%)' }} 
                        whileHover={{ y: -10 }}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-3xl mb-3 font-extrabold">SDG 12</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-90">Responsible Consumption & Production</p>
                    </motion.div>
                </div>
            </section>

            <footer className="py-10 bg-card border-t border-border text-center text-muted-foreground text-sm">
                <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 grayscale opacity-70" />
                        <span className="font-semibold text-foreground/70">AgriChain</span>
                    </div>
                    <p>© {new Date().getFullYear()} Student project – Blockchain-Based Supply Chain Transparency for Agricultural Produce.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
