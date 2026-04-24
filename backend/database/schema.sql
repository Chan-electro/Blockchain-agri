-- Database schema for AgriChain backend
-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY,
    farmer_address TEXT NOT NULL,
    crop TEXT NOT NULL,
    weight TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
-- Price components table for detailed breakdown
CREATE TABLE IF NOT EXISTS price_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id INTEGER NOT NULL,
    stakeholder_address TEXT NOT NULL,
    role TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);
-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_batches_farmer ON batches(farmer_address);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_price_components_batch ON price_components(batch_id);