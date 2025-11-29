import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Settings, Truck, ShoppingCart, BarChart, Scan } from 'lucide-react';

const RoleSelection = () => {
    const roles = [
        { id: 'farmer', name: 'Farmer', icon: <Leaf size={40} />, desc: 'Create batches and log harvest details', path: '/farmer' },
        { id: 'processor', name: 'Processor', icon: <Settings size={40} />, desc: 'Process incoming batches, quality checks', path: '/processor' },
        { id: 'logistics', name: 'Logistics', icon: <Truck size={40} />, desc: 'Shipments, transit statuses', path: '/logistics' },
        { id: 'retailer', name: 'Retailer', icon: <ShoppingCart size={40} />, desc: 'Inventory, shelf/price, sold', path: '/retailer' },
        { id: 'admin', name: 'Admin', icon: <BarChart size={40} />, desc: 'Global overview, analytics', path: '/admin' },
        { id: 'consumer', name: 'Consumer', icon: <Scan size={40} />, desc: 'QR Scan & Transparency', path: '/scan' },
    ];

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 font-sans">
            <div className="text-center mb-12">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Choose Your Role
                </motion.h1>
                <motion.p
                    className="text-muted-foreground text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    This is a frontend-only demo. Select a role to explore its interface.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {roles.map((role) => (
                    <motion.div key={role.id} variants={item}>
                        <Link to={role.path} className="block bg-card border border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:text-blue-400 transition-colors">
                                {role.icon}
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">{role.name}</h2>
                            <p className="text-muted-foreground">{role.desc}</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default RoleSelection;
