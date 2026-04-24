const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'agrichain.db');

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeSchema();
    }
});

function initializeSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing schema:', err);
        } else {
            console.log('✅ Database schema initialized');
        }
    });
}

// Helper functions
const dbHelpers = {
    // Get batch by ID
    getBatch: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM batches WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get all batches
    getAllBatches: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM batches ORDER BY created_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // Insert or update batch
    upsertBatch: (batch) => {
        return new Promise((resolve, reject) => {
            const { id, farmer_address, crop, weight, location, status, total_price, created_at, updated_at } = batch;

            db.run(`
                INSERT OR REPLACE INTO batches 
                (id, farmer_address, crop, weight, location, status, total_price, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, farmer_address, crop, weight, location, status, total_price, created_at, updated_at],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
        });
    },

    // Insert price component
    insertPriceComponent: (component) => {
        return new Promise((resolve, reject) => {
            const { batch_id, stakeholder_address, role, amount, description, timestamp } = component;

            db.run(`
                INSERT INTO price_components 
                (batch_id, stakeholder_address, role, amount, description, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [batch_id, stakeholder_address, role, amount, description, timestamp],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
        });
    },

    // Get price breakdown for a batch
    getPriceBreakdown: (batchId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM price_components WHERE batch_id = ? ORDER BY timestamp ASC',
                [batchId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
};

module.exports = { db, dbHelpers };
