import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Truck, ShoppingBag, Leaf, MapPin, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, type Batch } from '@/lib/api';

const ConsumerBatchDetails = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBatch();
    }, [batchId]);

    const loadBatch = async () => {
        if (!batchId) return;

        setLoading(true);
        try {
            const data = await api.getBatch(parseInt(batchId));
            setBatch(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toUpperCase()) {
            case 'FARMER': return Leaf;
            case 'PROCESSOR': return CheckCircle;
            case 'LOGISTICS': return Truck;
            case 'RETAILER': return ShoppingBag;
            default: return CheckCircle;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toUpperCase()) {
            case 'FARMER': return 'text-green-600';
            case 'PROCESSOR': return 'text-blue-600';
            case 'LOGISTICS': return 'text-yellow-600';
            case 'RETAILER': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 mb-4 mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading batch details...</p>
                </div>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-12 w-12 mb-4 mx-auto text-red-500" />
                    <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error || 'Unable to load batch information'}</p>
                    <Button onClick={() => navigate('/scan')}>
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Scan
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 pb-20">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/scan')}>
                    <ArrowLeft size={20} /> Back to Scan
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header Section */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500" />
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Leaf size={40} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{batch.crop}</h1>
                        <p className="text-muted-foreground flex items-center justify-center gap-2">
                            <MapPin size={16} /> {batch.location}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">Batch #{batch.id} • {batch.weight}</p>
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                            <CheckCircle size={16} /> Verified Authentic
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold mb-1">Current Status</h3>
                                <p className="text-muted-foreground text-sm">Last updated on blockchain</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${batch.status === 'CREATED' ? 'bg-green-500/10 text-green-500' :
                                    batch.status === 'PROCESSED' ? 'bg-blue-500/10 text-blue-500' :
                                        batch.status === 'IN_TRANSIT' ? 'bg-yellow-500/10 text-yellow-500' :
                                            batch.status === 'RETAIL' ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-500'
                                }`}>
                                {batch.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Price Transparency */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Price Breakdown</h2>
                        <div className="space-y-4">
                            {batch.priceBreakdown && batch.priceBreakdown.length > 0 ? (
                                batch.priceBreakdown.map((item, index) => {
                                    const Icon = getRoleIcon(item.role);
                                    const colorClass = getRoleColor(item.role);

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 bg-background rounded-md shadow-sm ${colorClass}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <span className="font-medium block">{item.role}</span>
                                                    {item.description && (
                                                        <span className="text-xs text-muted-foreground">{item.description}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">₹{item.amount}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {((item.amount / batch.total_price) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No price breakdown available</p>
                            )}

                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg mt-4 border border-primary/20">
                                <span className="font-bold text-lg">Total Consumer Price</span>
                                <span className="font-bold text-2xl text-primary">₹{batch.total_price}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-6">
                            ✓ This data is recorded on the blockchain and cannot be altered.
                        </p>
                    </div>

                    {/* Blockchain Info */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4">Blockchain Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Farmer Address:</span>
                                <span className="font-mono text-xs">{batch.farmer_address.substring(0, 10)}...{batch.farmer_address.substring(38)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(batch.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{new Date(batch.updated_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ConsumerBatchDetails;
