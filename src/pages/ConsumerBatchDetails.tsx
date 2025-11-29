import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Truck, ShoppingBag, Leaf, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConsumerBatchDetails = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const productData = {
        id: batchId,
        name: 'Premium Basmati Rice',
        origin: 'Green Valley Farms, Punjab',
        harvestDate: '15 Oct 2023',
        processor: 'AgriProcess Ltd.',
        processDate: '20 Oct 2023',
        retailer: 'FreshMart Superstore',
        priceBreakdown: [
            { stage: 'Farmer', cost: 40, icon: Leaf },
            { stage: 'Processing', cost: 15, icon: CheckCircle },
            { stage: 'Logistics', cost: 10, icon: Truck },
            { stage: 'Retailer Margin', cost: 35, icon: ShoppingBag },
        ],
        totalPrice: 100,
        journey: [
            { status: 'Harvested', location: 'Punjab, India', date: '15 Oct', completed: true },
            { status: 'Processed', location: 'Haryana, India', date: '20 Oct', completed: true },
            { status: 'In Transit', location: 'Delhi Highway', date: '21 Oct', completed: true },
            { status: 'In Store', location: 'New Delhi', date: '22 Oct', completed: true },
        ]
    };

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
                        <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
                        <p className="text-muted-foreground flex items-center justify-center gap-2">
                            <MapPin size={16} /> {productData.origin}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                            <CheckCircle size={16} /> Verified Authentic
                        </div>
                    </div>

                    {/* Journey Timeline */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Product Journey</h2>
                        <div className="relative pl-4 border-l-2 border-border space-y-8">
                            {productData.journey.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-6"
                                >
                                    <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-primary border-primary' : 'bg-background border-muted'
                                        }`} />
                                    <h4 className="font-semibold text-lg">{step.status}</h4>
                                    <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                        <MapPin size={14} /> {step.location}
                                    </p>
                                    <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                        <Calendar size={14} /> {step.date}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Price Transparency */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Price Breakdown (per kg)</h2>
                        <div className="space-y-4">
                            {productData.priceBreakdown.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-md shadow-sm text-primary">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="font-medium">{item.stage}</span>
                                    </div>
                                    <div className="font-bold">₹{item.cost}</div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg mt-4 border border-primary/20">
                                <span className="font-bold text-lg">Total Consumer Price</span>
                                <span className="font-bold text-xl text-primary">₹{productData.totalPrice}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-6">
                            * This data is recorded on the blockchain and cannot be altered.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ConsumerBatchDetails;
