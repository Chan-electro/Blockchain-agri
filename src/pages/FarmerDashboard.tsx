import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { api, type Batch } from '@/lib/api';

const FarmerDashboard = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        crop: '',
        variety: '',
        location: '',
        weight: '',
        basePrice: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Load batches on mount
    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        try {
            const data = await api.getAllBatches();
            setBatches(data);
        } catch (error) {
            console.error('Error loading batches:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.createBatch(
                formData.crop,
                `${formData.weight}kg`,
                formData.location,
                parseInt(formData.basePrice)
            );

            alert(`Batch Created Successfully!\nBatch ID: ${result.batchId}\nTransaction: ${result.transactionHash}`);
            setFormData({ crop: '', variety: '', location: '', weight: '', basePrice: '' });

            // Reload batches
            await loadBatches();
        } catch (error: any) {
            alert('Error creating batch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="farmer" title="Farmer Dashboard">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div className="bg-card border border-border p-6 rounded-xl shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <span className="text-muted-foreground text-sm font-medium">Total Batches</span>
                    <div className="text-3xl font-bold mt-2">{batches.length}</div>
                </motion.div>
                <motion.div className="bg-card border border-border p-6 rounded-xl shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <span className="text-muted-foreground text-sm font-medium">In Transit</span>
                    <div className="text-3xl font-bold mt-2">1</div>
                </motion.div>
                <motion.div className="bg-card border border-border p-6 rounded-xl shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <span className="text-muted-foreground text-sm font-medium">Sold</span>
                    <div className="text-3xl font-bold mt-2">5</div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Batch Panel */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Create New Batch</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Crop Type</label>
                            <input
                                type="text"
                                name="crop"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Rice, Wheat"
                                value={formData.crop}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Variety (Optional)</label>
                            <input
                                type="text"
                                name="variety"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Basmati"
                                value={formData.variety}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Village, State"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Total Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="1000"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Base Price (₹)</label>
                            <input
                                type="number"
                                name="basePrice"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="100"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">Your origin price for this batch</p>
                        </div>
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Batch'}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-4">
                            A QR code will be generated for this batch.
                        </p>
                    </form>
                </div>

                {/* Recent Batches List */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">My Recent Batches</h2>
                    <div className="space-y-4">
                        {batches.map((batch) => (
                            <motion.div
                                key={batch.id}
                                className="bg-background border border-border rounded-lg p-4 flex justify-between items-center hover:border-primary transition-colors cursor-pointer"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Batch #{batch.id}</h4>
                                    <p className="text-xs text-muted-foreground">{batch.crop} • {batch.weight}</p>
                                    <p className="text-xs text-green-500 font-semibold mt-1">₹{batch.total_price}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${batch.status === 'CREATED' ? 'bg-green-500/10 text-green-500' :
                                    batch.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'
                                    }`}>
                                    {batch.status.replace('_', ' ')}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FarmerDashboard;
