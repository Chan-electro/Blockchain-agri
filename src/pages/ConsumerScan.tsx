import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ArrowRight, QrCode, X, Camera } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';

const ConsumerScan = () => {
    const navigate = useNavigate();
    const [batchId, setBatchId] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scanError, setScanError] = useState('');

    const handleScan = () => {
        setShowScanner(true);
        setScanError('');
    };

    const handleScanResult = (result: any) => {
        if (result && result.length > 0) {
            const scannedText = result[0].rawValue;

            // Try to extract batch ID from URL or use direct ID
            let extractedBatchId = '';

            // Check if it's a URL containing /product/
            if (scannedText.includes('/product/')) {
                const match = scannedText.match(/\/product\/(\d+)/);
                if (match && match[1]) {
                    extractedBatchId = match[1];
                }
            } else {
                // Assume it's just the batch ID
                extractedBatchId = scannedText;
            }

            if (extractedBatchId) {
                setShowScanner(false);
                navigate(`/product/${extractedBatchId}`);
            } else {
                setScanError('Invalid QR code format');
            }
        }
    };

    const handleScanError = (error: any) => {
        console.error('Scanner error:', error);
        setScanError('Camera access denied or error occurred. Please use manual entry.');
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
                    <p className="text-muted-foreground">Verify authenticity and track your product's journey from farm to table with full price transparency.</p>
                </div>

                <div className="space-y-6">
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg gap-2"
                        onClick={handleScan}
                    >
                        <Camera size={20} /> Open Camera Scanner
                    </Button>

                    <div className="relative flex items-center justify-center">
                        <div className="h-px bg-border w-full" />
                        <span className="absolute bg-card px-2 text-xs text-muted-foreground uppercase">Or enter manually</span>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Batch ID (e.g. 1)"
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
                    <span>✓ Quality Track</span>
                    <span>✓ Price Details</span>
                </div>
            </motion.div>

            {/* Scanner Modal */}
            <AnimatePresence>
                {showScanner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-md bg-background rounded-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Scan className="text-primary" size={24} />
                                    <h2 className="text-lg font-semibold">Scan QR Code</h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowScanner(false)}
                                >
                                    <X size={20} />
                                </Button>
                            </div>

                            <div className="relative aspect-square bg-black">
                                <Scanner
                                    onScan={handleScanResult}
                                    onError={handleScanError}
                                    constraints={{
                                        facingMode: 'environment'
                                    }}
                                    styles={{
                                        container: {
                                            width: '100%',
                                            height: '100%',
                                        }
                                    }}
                                />

                                {/* Scanning frame overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-card">
                                {scanError ? (
                                    <p className="text-sm text-red-500 text-center">{scanError}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Position the QR code within the frame
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => setShowScanner(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ConsumerScan;
