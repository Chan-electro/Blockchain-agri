import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Truck, MapPin, Package, Clock } from 'lucide-react';

const LogisticsDashboard = () => {
    const shipments = [
        { id: 'SHP-001', destination: 'Delhi Central Hub', status: 'IN_TRANSIT', eta: '2h 30m', progress: 65 },
        { id: 'SHP-002', destination: 'Mumbai Port', status: 'PENDING', eta: '1d 4h', progress: 0 },
        { id: 'SHP-003', destination: 'Jaipur Distribution', status: 'DELIVERED', eta: '-', progress: 100 },
    ];

    return (
        <DashboardLayout role="logistics" title="Logistics Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Active Shipments</span>
                    <div className="text-3xl font-bold mt-2">8</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Avg Delivery Time</span>
                    <div className="text-3xl font-bold mt-2">1.2d</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Fleet Status</span>
                    <div className="text-3xl font-bold mt-2 text-green-500">Optimal</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Tracking Map Placeholder */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Live Fleet Tracking</h2>
                    <div className="flex-1 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/77.2090,28.6139,10,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="relative z-10 text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-sm">
                            <MapPin className="mx-auto mb-2 text-primary" size={32} />
                            <p className="font-medium">Map Visualization Integration</p>
                            <p className="text-xs text-muted-foreground">Connect GPS API for real-time updates</p>
                        </div>
                    </div>
                </div>

                {/* Shipment List */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Recent Shipments</h2>
                    <div className="space-y-6">
                        {shipments.map((shipment) => (
                            <motion.div
                                key={shipment.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-b border-border last:border-0 pb-4 last:pb-0"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-sm">{shipment.id}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin size={10} /> {shipment.destination}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${shipment.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                                            shipment.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {shipment.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Truck size={10} /> Progress</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> ETA: {shipment.eta}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${shipment.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LogisticsDashboard;
