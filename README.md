# 🌾 AgriChain - Blockchain Supply Chain Transparency for Agriculture

A comprehensive blockchain-based supply chain tracking system with **multi-stakeholder pricing transparency**. Track agricultural products from farm to table with complete price breakdown at every stage.

## 🎯 Features

- ✅ **Multi-Stakeholder Pricing**: Transparent price tracking across Farmer → Processor → Logistics → Retailer
- ✅ **Blockchain Immutability**: All transactions recorded on Ethereum-compatible blockchain
- ✅ **Real-time Price Breakdown**: Consumers see exactly where their money goes
- ✅ **Role-Based Dashboards**: Separate interfaces for each stakeholder
- ✅ **QR Code Scanning**: Easy product verification for consumers
- ✅ **Complete Audit Trail**: Every price addition is traceable

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + TypeScript)             │
│   Farmer | Processor | Logistics | Retailer | Consumer
└────────────────────┬────────────────────────────────┘
                     │ REST API
        ┌────────────▼──────────────┐
        │  Backend (Express + SQLite) │
        │  - API Routes              │
        │  - Database Sync           │
        └────────────┬────────────────┘
                     │ Ethers.js
        ┌────────────▼────────────────┐
        │  Smart Contract (Solidity)  │
        │  AgriChain.sol             │
        │  Hardhat Network           │
        └─────────────────────────────┘
```

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Blockchain-Agri
```

### Step 2: Install Dependencies

Install dependencies for all three components:

```bash
# Install frontend dependencies
npm install

# Install smart contract dependencies
cd smart-contract
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

## 🎮 Running the Project

You need to run **three separate services** in different terminals:

### Terminal 1: Start Hardhat Network

```bash
cd smart-contract
npx hardhat node
```

Keep this running. You should see:
- ✅ "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
- ✅ List of 20 test accounts with 10000 ETH each

### Terminal 2: Start Backend Server

```bash
cd backend
npm start
```

Keep this running. You should see:
- ✅ "AgriChain Backend Server"
- ✅ "Server running on http://localhost:3001"
- ✅ "Connected to SQLite database"
- ✅ Contract address displayed

> **Note**: On first run, the contract will be automatically deployed. The contract address is saved in `backend/.env`

### Terminal 3: Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or next available port)

## 🧪 Testing the Complete Workflow

Follow this sequence to test the multi-stakeholder pricing:

### 1️⃣ Farmer Creates Batch

1. Navigate to **Farmer Dashboard** (`/farmer`)
2. Fill in the "Create New Batch" form:
   - Crop Type: `Basmati Rice`
   - Location: `Punjab, India`
   - Weight: `500`
   - **Base Price**: `100` ← New pricing field
3. Click **"Create Batch"**
4. Note the Batch ID from the success alert

**Result**: Batch created with base price ₹100

### 2️⃣ Processor Adds Processing Fee

1. Navigate to **Processor Dashboard** (`/processor`)
2. Select the newly created batch from the list
3. Add processing details:
   - Quality Notes: `Grade A quality`
   - **Processing Fee**: `20`
4. Click **"Mark as Processed"**

**Result**: Total price = ₹120 (100 + 20)

### 3️⃣ Logistics Adds Transport Fee

1. Navigate to **Logistics Dashboard** (`/logistics`)
2. Select the processed batch
3. Add transport details:
   - Route/Destination: `Farm to Processing Center`
   - **Transport Fee**: `10`
4. Click **"Add to Transport"**

**Result**: Total price = ₹130 (100 + 20 + 10)

### 4️⃣ Retailer Adds Markup

1. Navigate to **Retailer Dashboard** (`/retailer`)
2. Select the batch in transit
3. Add retail pricing:
   - **Retail Markup**: `50`
4. Click **"Receive to Store"**

**Result**: Total price = ₹180 (100 + 20 + 10 + 50)

### 5️⃣ Consumer Views Price Breakdown

1. Navigate to **Consumer Scan** (`/scan`)
2. Enter the Batch ID (e.g., `1`)
3. View the complete transparent breakdown:

```
Farmer:     ₹100 (55.6%)
Processor:  ₹20  (11.1%)
Logistics:  ₹10  (5.6%)
Retailer:   ₹50  (27.8%)
────────────────────────
Total:      ₹180
```

## 📁 Project Structure

```
Blockchain-Agri/
├── smart-contract/          # Hardhat blockchain project
│   ├── contracts/
│   │   └── AgriChain.sol   # Main smart contract
│   ├── scripts/
│   │   └── deploy.js       # Deployment script
│   ├── hardhat.config.js
│   └── package.json
│
├── backend/                 # Express API server
│   ├── server.js           # Main server file
│   ├── blockchain.js       # Contract interaction
│   ├── database/
│   │   ├── db.js          # Database helpers
│   │   └── schema.sql     # Database schema
│   ├── routes/
│   │   └── api.js         # API endpoints
│   ├── .env               # Environment config
│   └── package.json
│
├── src/                    # React frontend
│   ├── components/        # Reusable components
│   ├── pages/             # Dashboard pages
│   │   ├── FarmerDashboard.tsx
│   │   ├── ProcessorDashboard.tsx
│   │   ├── LogisticsDashboard.tsx
│   │   ├── RetailerDashboard.tsx
│   │   ├── ConsumerScan.tsx
│   │   └── ConsumerBatchDetails.tsx
│   ├── lib/
│   │   └── api.ts         # API utilities
│   └── main.tsx
│
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Located in `backend/.env`:

```env
BLOCKCHAIN_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=<auto-filled-after-deployment>
PORT=3001
```

### Frontend Configuration

The frontend connects to the backend at `http://localhost:3001`. Update in [`src/lib/api.ts`](file:///e:/2025%20projects/Blockchain-Agri/src/lib/api.ts#L2) if needed.

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/batch/create` | POST | Create new batch with base price |
| `/api/batch/update` | POST | Add stakeholder fees (processor/logistics/retailer) |
| `/api/batch/:id` | GET | Get batch details with price breakdown |
| `/api/batches` | GET | Get all batches |
| `/api/stats/count` | GET | Get total batch count |
| `/deploy` | POST | Deploy smart contract (setup only) |

## 🎨 Role-Based Routes

| Route | Role | Description |
|-------|------|-------------|
| `/` | - | Landing page |
| `/role-selection` | - | Choose stakeholder role |
| `/farmer` | Farmer | Create batches, set base price |
| `/processor` | Processor | Add processing fees |
| `/logistics` | Logistics | Add transport fees |
| `/retailer` | Retailer | Add retail markup |
| `/scan` | Consumer | Scan QR / Search batch |
| `/product/:id` | Consumer | View price breakdown |

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)
```

### Smart Contract
```bash
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat node     # Start local network
```

## 🔍 Troubleshooting

### Contract Not Deployed

If backend shows "CONTRACT_ADDRESS not set":

1. Ensure Hardhat network is running
2. Send POST request to `http://localhost:3001/deploy`
3. Contract address will be saved automatically

### Port Already in Use

- **Frontend (5173)**: Vite will auto-increment to next port
- **Backend (3001)**: Change `PORT` in `backend/.env`
- **Hardhat (8545)**: Stop existing instance

### Database Issues

Delete and recreate database:
```bash
cd backend
rm -rf database/agrichain.db
npm start  # Will recreate automatically
```

## 📚 Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, SQLite, ethers.js
- **Blockchain**: Solidity, Hardhat, Ethereum
- **Other**: Lucide Icons, shadcn/ui components

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Blockchain powered by Ethereum
- UI components from shadcn/ui

---

**Made with ❤️ for transparent agriculture supply chains**

For detailed implementation documentation, see [`walkthrough.md`](file:///C:/Users/User/.gemini/antigravity/brain/57717d8e-535d-4432-84dc-2f855af171fc/walkthrough.md)
