import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, ArrowRight, Search, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConsumerScan = () => {
    const navigate = useNavigate();
    const [batchId, setBatchId] = useState('');

    const handleScan = () => {
        // Simulate scan
        setTimeout(() => {
            navigate('/product/BATCH-001');
        }, 1000);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (batchId) {
            navigate(`/product/${batchId}`);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <QrCode size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Scan Product QR</h1>
                    <p className="text-muted-foreground">Verify authenticity and track your product's journey from farm to table.</p>
                </div>

                <div className="space-y-6">
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg gap-2"
                        onClick={handleScan}
                    >
                        <Scan size={20} /> Scan QR Code
                    </Button>

                    <div className="relative flex items-center justify-center">
                        <div className="h-px bg-border w-full" />
                        <span className="absolute bg-card px-2 text-xs text-muted-foreground uppercase">Or enter manually</span>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Batch ID (e.g. BATCH-001)"
                            className="flex-1 h-12 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
                            <ArrowRight size={20} />
                        </Button>
                    </form>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex justify-between text-xs text-muted-foreground">
                    <span>✓ Farm Origin</span>
                    <span>✓ Processing Quality</span>
                    <span>✓ Price Transparency</span>
                </div>
            </motion.div>
        </div>
    );
};

export default ConsumerScan;
