import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Package } from 'lucide-react';
import { api, type Batch } from '@/lib/api';

const LogisticsDashboard = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(false);
    const [transportFee, setTransportFee] = useState('');
    const [routeDetails, setRouteDetails] = useState('');

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        try {
            const data = await api.getAllBatches();
            // Filter batches that are processed (ready for logistics)
            const logisticsBatches = data.filter((b: Batch) => b.status === 'PROCESSED');
            setBatches(logisticsBatches);
        } catch (error) {
            console.error('Error loading batches:', error);
        }
    };

    const handleAddTransport = async () => {
        if (!selectedBatch || !transportFee) {
            alert('Please enter transport fee');
            return;
        }

        setLoading(true);
        try {
            const result = await api.updateBatch(
                selectedBatch.id,
                'LOGISTICS',
                parseInt(transportFee),
                routeDetails || 'Transport Fee'
            );

            alert(`Transport added for Batch #${selectedBatch.id}!\\nTransaction: ${result.transactionHash}`);
            setTransportFee('');
            setRouteDetails('');
            setSelectedBatch(null);
            await loadBatches();
        } catch (error: any) {
            alert('Error adding transport: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="logistics" title="Logistics Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Awaiting Transport</span>
                    <div className="text-3xl font-bold mt-2">{batches.length}</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Selected Batch</span>
                    <div className="text-3xl font-bold mt-2">{selectedBatch ? `#${selectedBatch.id}` : '-'}</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Current Price</span>
                    <div className="text-3xl font-bold mt-2">{selectedBatch ? `₹${selectedBatch.total_price}` : '-'}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Batches awaiting transport */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Batches for Transport</h2>
                    <div className="space-y-4">
                        {batches.length > 0 ? (
                            batches.map((batch) => (
                                <motion.div
                                    key={batch.id}
                                    className={`bg-background border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${selectedBatch?.id === batch.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
                                        }`}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => setSelectedBatch(batch)}
                                >
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                                            <Package size={14} />
                                            Batch #{batch.id}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{batch.crop} • {batch.weight}</p>
                                        <p className="text-xs text-green-500 font-semibold mt-1">Current: ₹{batch.total_price}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/10 text-blue-500">
                                        {batch.status.replace('_', ' ')}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <p>No batches awaiting transport</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transport form */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Transport Details</h2>
                    {selectedBatch ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Batch #{selectedBatch.id}</h3>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <MapPin size={14} />
                                    {selectedBatch.crop} • {selectedBatch.weight}
                                </p>
                                <p className="text-sm text-green-500 font-semibold mt-2">Current Price: ₹{selectedBatch.total_price}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Route/Destination</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., Farm to Processing Center"
                                    value={routeDetails}
                                    onChange={(e) => setRouteDetails(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Transport Fee (₹)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="10"
                                    value={transportFee}
                                    onChange={(e) => setTransportFee(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    New total: ₹{selectedBatch.total_price + (parseInt(transportFee) || 0)}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button onClick={handleAddTransport} className="flex-1" disabled={loading || !transportFee}>
                                    <Truck size={16} className="mr-2" />
                                    {loading ? 'Processing...' : 'Add to Transport'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                            <Truck size={48} className="mb-4 opacity-20" />
                            <p>Select a batch to add transport details</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LogisticsDashboard;
