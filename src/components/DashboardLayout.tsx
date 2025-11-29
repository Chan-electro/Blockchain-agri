import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Truck, ShoppingBag, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: string;
    title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, title }) => {
    const location = useLocation();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: `/${role}` },
        { icon: <Package size={20} />, label: 'Batches', path: `/${role}/batches` },
        { icon: <Settings size={20} />, label: 'Settings', path: `/${role}/settings` },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col p-6 transition-all duration-300">
                <div className="mb-8 flex items-center gap-2">
                    <div className="text-primary font-extrabold text-xl">AgriChain</div>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded uppercase">{role} View</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                                location.pathname === item.path && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                            )}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-border">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background/50">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/20">
                            Demo Network
                        </span>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <User size={16} />
                            </div>
                            <span>Demo {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                        </div>
                    </div>
                </header>

                <motion.div
                    className="flex-1 p-8 overflow-y-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
