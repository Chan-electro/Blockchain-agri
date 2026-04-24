-- AgriChain v2 database schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    wallet_index INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY,
    farmer_address TEXT NOT NULL,
    crop TEXT NOT NULL,
    weight TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    tx_hash TEXT,
    block_number INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS price_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id INTEGER NOT NULL,
    stakeholder_address TEXT NOT NULL,
    role TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    timestamp INTEGER NOT NULL,
    tx_hash TEXT,
    block_number INTEGER,
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_batches_farmer ON batches(farmer_address);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_price_components_batch ON price_components(batch_id);
