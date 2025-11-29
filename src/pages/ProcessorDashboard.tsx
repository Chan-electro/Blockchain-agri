import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';

const ProcessorDashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [incomingBatches, setIncomingBatches] = useState([
    { id: 'BATCH-001', crop: 'Basmati Rice', origin: 'Farm A', date: '2023-10-15', status: 'RECEIVED' },
    { id: 'BATCH-003', crop: 'Corn', origin: 'Farm B', date: '2023-10-22', status: 'READY_FOR_PROCESSING' },
  ]);

  const handleProcess = () => {
    if (!selectedBatch) return;
    alert(`Batch ${selectedBatch.id} marked as PROCESSED! Quality Check Passed.`);
    // Update status logic would go here
  };

  return (
    <DashboardLayout role="processor" title="Processor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Awaiting Processing</span>
          <div className="text-3xl font-bold mt-2">2</div>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Processed Today</span>
          <div className="text-3xl font-bold mt-2">15</div>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Avg Processing Time</span>
          <div className="text-3xl font-bold mt-2">4h</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Batches List */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Incoming Batches</h2>
          <div className="space-y-4">
            {incomingBatches.map((batch) => (
              <motion.div
                key={batch.id}
                className={`bg-background border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${selectedBatch?.id === batch.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
                  }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedBatch(batch)}
              >
                <div>
                  <h4 className="font-semibold text-sm mb-1">{batch.id}</h4>
                  <p className="text-xs text-muted-foreground">{batch.crop} • {batch.origin}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/10 text-green-500">
                  {batch.status.replace('_', ' ')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Batch Details */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Processing Details</h2>
          {selectedBatch ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-1">{selectedBatch.id}</h3>
                <p className="text-muted-foreground">{selectedBatch.crop} from {selectedBatch.origin}</p>
                <p className="text-sm text-muted-foreground mt-1">Received: {selectedBatch.date}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Quality Check Notes</label>
                <textarea
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  placeholder="Enter quality observations..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Processing Cost Added (per kg)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5.00"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleProcess} className="flex-1">Mark as Processed</Button>
                <Button variant="destructive" className="flex-1">Reject Batch</Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
              <p>Select a batch to view details and process.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProcessorDashboard;

