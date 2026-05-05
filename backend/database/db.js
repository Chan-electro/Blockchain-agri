const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const logger = require('../lib/logger');

const DB_PATH = path.join(__dirname, 'agrichain.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        logger.error({ err }, 'Error opening database');
    } else {
        logger.info({ path: DB_PATH }, 'Connected to SQLite database');
        initializeSchema();
    }
});

function initializeSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) logger.error({ err }, 'Error initializing schema');
        else logger.info('Database schema initialized');
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function callback(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const dbHelpers = {
    // Users
    createUser: ({ email, password_hash, role, wallet_index, created_at }) =>
        run(
            `INSERT INTO users (email, password_hash, role, wallet_index, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [email, password_hash, role, wallet_index, created_at]
        ),

    getUserByEmail: (email) => get('SELECT * FROM users WHERE email = ?', [email]),
    getUserById: (id) => get('SELECT * FROM users WHERE id = ?', [id]),

    // Batches
    getBatch: (id) => get('SELECT * FROM batches WHERE id = ?', [id]),

    getAllBatches: () => all('SELECT * FROM batches ORDER BY created_at DESC', []),

    getBatchesByFarmer: (address) =>
        all('SELECT * FROM batches WHERE farmer_address = ? ORDER BY created_at DESC', [address]),

    getBatchesByStatus: (status) =>
        all('SELECT * FROM batches WHERE status = ? ORDER BY created_at DESC', [status]),

    upsertBatch: (batch) => {
        const {
            id, farmer_address, crop, weight, location, status, total_price,
            tx_hash = null, block_number = null, created_at, updated_at,
        } = batch;
        return run(
            `INSERT INTO batches
             (id, farmer_address, crop, weight, location, status, total_price, tx_hash, block_number, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               status = excluded.status,
               total_price = excluded.total_price,
               updated_at = excluded.updated_at`,
            [id, farmer_address, crop, weight, location, status, total_price, tx_hash, block_number, created_at, updated_at]
        );
    },

    // Price components
    insertPriceComponent: (component) => {
        const {
            batch_id, stakeholder_address, role, amount, description, timestamp,
            tx_hash = null, block_number = null,
        } = component;
        return run(
            `INSERT INTO price_components
             (batch_id, stakeholder_address, role, amount, description, timestamp, tx_hash, block_number)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [batch_id, stakeholder_address, role, amount, description, timestamp, tx_hash, block_number]
        );
    },

    getPriceBreakdown: (batchId) =>
        all('SELECT * FROM price_components WHERE batch_id = ? ORDER BY timestamp ASC', [batchId]),

    // Admin
    countUsers: () => get('SELECT COUNT(*) AS n FROM users', []),
    countBatchesByStatus: () =>
        all('SELECT status, COUNT(*) AS n FROM batches GROUP BY status', []),
    volumeByDay: (days = 30) => {
        const sinceMs = Date.now() - days * 24 * 60 * 60 * 1000;
        return all(
            `SELECT DATE(created_at/1000, 'unixepoch') AS day,
                    COUNT(*) AS batches,
                    COALESCE(SUM(total_price), 0) AS volume
             FROM batches
             WHERE created_at >= ?
             GROUP BY day
             ORDER BY day ASC`,
            [sinceMs]
        );
    },
    recentPriceEvents: (limit = 20) =>
        all(
            `SELECT pc.*, b.crop, b.status AS batch_status
             FROM price_components pc
             LEFT JOIN batches b ON b.id = pc.batch_id
             ORDER BY pc.timestamp DESC
             LIMIT ?`,
            [limit]
        ),

    // Maintenance
    resetAll: async () => {
        await run('DELETE FROM price_components');
        await run('DELETE FROM batches');
        await run('DELETE FROM users');
    },
};

module.exports = { db, dbHelpers };
