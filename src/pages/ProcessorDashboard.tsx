import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { api, type Batch } from '@/lib/api';

const ProcessorDashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingFee, setProcessingFee] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const data = await api.getAllBatches();
      // Filter batches that are ready for processing (CREATED status)
      const processorBatches = data.filter((b: Batch) => b.status === 'CREATED');
      setBatches(processorBatches);
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const handleProcess = async () => {
    if (!selectedBatch || !processingFee) {
      alert('Please enter processing fee');
      return;
    }

    setLoading(true);
    try {
      const result = await api.updateBatch(
        selectedBatch.id,
        'PROCESSOR',
        parseInt(processingFee),
        notes || 'Processing Fee'
      );

      alert(`Batch #${selectedBatch.id} processed successfully!\\nTransaction: ${result.transactionHash}`);
      setProcessingFee('');
      setNotes('');
      setSelectedBatch(null);
      await loadBatches();
    } catch (error: any) {
      alert('Error processing batch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="processor" title="Processor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Awaiting Processing</span>
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
        {/* Incoming Batches List */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Incoming Batches</h2>
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
                    <h4 className="font-semibold text-sm mb-1">Batch #{batch.id}</h4>
                    <p className="text-xs text-muted-foreground">{batch.crop} • {batch.weight}</p>
                    <p className="text-xs text-green-500 font-semibold mt-1">Current: ₹{batch.total_price}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/10 text-green-500">
                    {batch.status.replace('_', ' ')}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No batches awaiting processing</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Batch Details */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border">Processing Details</h2>
          {selectedBatch ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-1">Batch #{selectedBatch.id}</h3>
                <p className="text-muted-foreground">{selectedBatch.crop} • {selectedBatch.weight}</p>
                <p className="text-sm text-green-500 font-semibold mt-2">Current Price: ₹{selectedBatch.total_price}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Quality Check Notes</label>
                <textarea
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  placeholder="Enter quality observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Processing Fee (₹)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="20"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  New total: ₹{selectedBatch.total_price + (parseInt(processingFee) || 0)}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleProcess} className="flex-1" disabled={loading || !processingFee}>
                  {loading ? 'Processing...' : 'Mark as Processed'}
                </Button>
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
