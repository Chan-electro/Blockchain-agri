import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';

const RetailerDashboard = () => {
    const [inventory, setInventory] = useState([
        { id: 'PROD-101', name: 'Premium Basmati Rice', batchId: 'BATCH-001', price: 120, stock: '50kg', status: 'ON_SHELF' },
        { id: 'PROD-102', name: 'Organic Wheat Flour', batchId: 'BATCH-002', price: 45, stock: '200kg', status: 'WAREHOUSE' },
    ]);

    const handleUpdatePrice = (id: string) => {
        const newPrice = prompt("Enter new price per kg:");
        if (newPrice) {
            setInventory(inventory.map(item => item.id === id ? { ...item, price: Number(newPrice) } : item));
        }
    };

    return (
        <DashboardLayout role="retailer" title="Retailer Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Total Inventory</span>
                    <div className="text-3xl font-bold mt-2">250kg</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Sales Today</span>
                    <div className="text-3xl font-bold mt-2">$1,200</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                    <span className="text-muted-foreground text-sm font-medium">Low Stock Alerts</span>
                    <div className="text-3xl font-bold mt-2 text-yellow-500">2</div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Store Inventory</h2>
                <div className="space-y-4">
                    {inventory.map((item) => (
                        <motion.div
                            key={item.id}
                            className="bg-background border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary transition-colors"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex-1">
                                <h4 className="font-semibold text-lg">{item.name}</h4>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                    <span>ID: {item.id}</span>
                                    <span>Batch: {item.batchId}</span>
                                    <span>Stock: {item.stock}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">${item.price}</div>
                                    <div className="text-xs text-muted-foreground">per kg</div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleUpdatePrice(item.id)}>
                                        Update Price
                                    </Button>
                                    <Button size="sm" className="gap-2">
                                        <Scan size={16} /> View as Consumer
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RetailerDashboard;
