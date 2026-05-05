# AgriChain Backend

Backend server for the AgriChain blockchain supply chain system with multi-stakeholder pricing functionality.

## Features

- 🔗 Blockchain integration with Ethers.js
- 💾 SQLite database for fast querying
- 🚀 RESTful API endpoints
- 💰 Multi-stakeholder pricing support
- 📊 Price breakdown tracking

## Prerequisites

- Node.js (v14+)
- Running Hardhat local network (from `../smart-contract`)

## Installation

```bash
npm install
```

##Configuration

1. Copy `.env.example` to `.env`
2. Update the `CONTRACT_ADDRESS` after deployment

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Deploy Contract (Setup Only)
```bash
POST /deploy
```

### Create Batch
```bash
POST /api/batch/create
Body: {
  "crop": "Rice",
  "weight": "500kg",
  "location": "Punjab",
  "basePrice": 100
}
```

### Update Batch (Add Stakeholder Fee)
```bash
POST /api/batch/update
Body: {
  "batchId": 1,
  "role": "PROCESSOR",  // or "LOGISTICS", "RETAILER"
  "fee": 20,
  "description": "Processing Fee"
}
```

### Get Batch Details
```bash
GET /api/batch/:id
```

### Get All Batches
```bash
GET /api/batches
```

### Get Batch Count
```bash
GET /api/stats/count
```

## Database Schema

### Batches Table
- id
- farmer_address
- crop
- weight
- location
- status
- total_price
- created_at
- updated_at

### Price Components Table
- id
- batch_id
- stakeholder_address
- role
- amount
- description
- timestamp

## Architecture

```
backend/
├── server.js           # Main Express server
├── blockchain.js       # Blockchain interaction layer
├── database/
│   ├── db.js          # Database helpers
│   └── schema.sql     # Database schema
└── routes/
    └── api.js         # API endpoints
```

## Example Workflow

1. **Farmer** creates batch with base price (₹100)
2. **Processor** adds processing fee (₹20) → Total: ₹120
3. **Logistics** adds transport fee (₹10) → Total: ₹130
4. **Retailer** adds markup (₹50) → Total: ₹180
5. **Consumer** scans QR code and sees transparent price breakdown

## Development

The backend automatically syncs blockchain events to the SQLite database for faster querying.
