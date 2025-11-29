import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { AlertTriangle, TrendingUp, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
    return (
        <DashboardLayout role="admin" title="Admin Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users size={20} /></div>
                        <span className="text-muted-foreground text-sm font-medium">Total Users</span>
                    </div>
                    <div className="text-3xl font-bold">1,240</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={20} /></div>
                        <span className="text-muted-foreground text-sm font-medium">Total Batches</span>
                    </div>
                    <div className="text-3xl font-bold">8,500</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp size={20} /></div>
                        <span className="text-muted-foreground text-sm font-medium">Network Volume</span>
                    </div>
                    <div className="text-3xl font-bold">$2.4M</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-destructive/10 rounded-lg text-destructive"><AlertTriangle size={20} /></div>
                        <span className="text-muted-foreground text-sm font-medium">Flagged Issues</span>
                    </div>
                    <div className="text-3xl font-bold text-destructive">3</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Analytics Chart Placeholder */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Price Evolution (Avg)</h2>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 60, 55, 70, 65, 80, 75, 90, 85, 100, 95, 110].map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors relative group"
                                style={{ height: `${h}%` }}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    ${h * 2}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-muted-foreground px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Flagged Issues List */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">System Alerts</h2>
                    <div className="space-y-4">
                        {[
                            { id: 'ALERT-001', type: 'Quality Mismatch', batch: 'BATCH-089', severity: 'HIGH', time: '2h ago' },
                            { id: 'ALERT-002', type: 'Delay Warning', batch: 'BATCH-102', severity: 'MEDIUM', time: '5h ago' },
                            { id: 'ALERT-003', type: 'Suspicious Activity', batch: 'USER-442', severity: 'LOW', time: '1d ago' },
                        ].map((alert, i) => (
                            <motion.div
                                key={i}
                                className="bg-background border border-border rounded-lg p-4 flex justify-between items-center hover:border-destructive/50 transition-colors"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertTriangle size={16} className={alert.severity === 'HIGH' ? 'text-destructive' : 'text-yellow-500'} />
                                        <h4 className="font-semibold text-sm">{alert.type}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Ref: {alert.batch}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${alert.severity === 'HIGH' ? 'bg-destructive/10 text-destructive' :
                                            alert.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6">View All Alerts</Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
