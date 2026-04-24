import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { Button } from '@/components/ui/button';
import { Store, ShoppingCart, QrCode } from 'lucide-react';
import { api, type Batch } from '@/lib/api';

const RetailerDashboard = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [retailBatches, setRetailBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(false);
    const [retailMarkup, setRetailMarkup] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrBatch, setQRBatch] = useState<Batch | null>(null);

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        try {
            const data = await api.getAllBatches();
            // Filter batches that are in transit (ready for retail)
            const transitBatches = data.filter((b: Batch) => b.status === 'IN_TRANSIT');
            setBatches(transitBatches);

            // Also get batches that are already in retail (for QR display)
            const retailReady = data.filter((b: Batch) => b.status === 'RETAIL');
            setRetailBatches(retailReady);
        } catch (error) {
            console.error('Error loading batches:', error);
        }
    };

    const handleReceiveBatch = async () => {
        if (!selectedBatch || !retailMarkup) {
            alert('Please enter retail markup');
            return;
        }

        setLoading(true);
        try {
            const result = await api.updateBatch(
                selectedBatch.id,
                'RETAILER',
                parseInt(retailMarkup),
                'Retail Markup'
            );

            alert(`Batch #${selectedBatch.id} received to retail!\\nTransaction: ${result.transactionHash}`);
            setRetailMarkup('');
            setSelectedBatch(null);
            await loadBatches();
        } catch (error: any) {
            alert('Error receiving batch: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="retailer" title="Retailer Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Incoming Batches</span>
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
                {/* Incoming batches */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Batches in Transit</h2>
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
                                            <ShoppingCart size={14} />
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
                                <p>No batches in transit</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing form */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Receive & Price</h2>
                    {selectedBatch ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Batch #{selectedBatch.id}</h3>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Store size={14} />
                                    {selectedBatch.crop} • {selectedBatch.weight}
                                </p>
                                <p className="text-sm text-green-500 font-semibold mt-2">
                                    Current Price: ₹{selectedBatch.total_price}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                <h4 className="font-medium text-sm">Price Breakdown</h4>
                                {selectedBatch.priceBreakdown && selectedBatch.priceBreakdown.length > 0 ? (
                                    selectedBatch.priceBreakdown.map((component, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{component.role}:</span>
                                            <span className="font-semibold">₹{component.amount}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground">No breakdown available</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Retail Markup (₹)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="50"
                                    value={retailMarkup}
                                    onChange={(e) => setRetailMarkup(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Final retail price: ₹{selectedBatch.total_price + (parseInt(retailMarkup) || 0)}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button onClick={handleReceiveBatch} className="flex-1" disabled={loading || !retailMarkup}>
                                    <Store size={16} className="mr-2" />
                                    {loading ? 'Processing...' : 'Receive to Store'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                            <Store size={48} className="mb-4 opacity-20" />
                            <p>Select a batch to receive and set retail price</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Retail Batches with QR Codes */}
            {retailBatches.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-6">Batches in Retail - QR Codes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {retailBatches.map((batch) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center"
                            >
                                <QRCodeDisplay batchId={batch.id} size={150} showDownload={true} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && qrBatch && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowQRModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background rounded-2xl p-8 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-2">Batch #{qrBatch.id}</h3>
                            <p className="text-muted-foreground">{qrBatch.crop} • {qrBatch.weight}</p>
                        </div>
                        <QRCodeDisplay batchId={qrBatch.id} size={300} showDownload={true} />
                        <Button
                            variant="outline"
                            className="w-full mt-6"
                            onClick={() => setShowQRModal(false)}
                        >
                            Close
                        </Button>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default RetailerDashboard;
