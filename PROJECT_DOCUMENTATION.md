# AgriChain — Complete Project Documentation

> **Smart Agriculture Supply Chain with Blockchain-Based Transparency**
> School of ECE, REVA University, Bengaluru

---

## 1. Project Overview

AgriChain is a full-stack web application that tracks agricultural produce from farm to consumer using blockchain technology. Every handoff (harvest → processing → shipping → retail) is recorded as an immutable on-chain transaction. Consumers scan a QR code on the physical product to view the complete, tamper-proof journey and price breakdown.

### Core Value Proposition
- **Transparency**: Every supply chain event is permanently recorded on-chain
- **Traceability**: QR codes link physical products to their digital blockchain history
- **Fair Pricing**: Price breakdown shows exactly how much each stakeholder added
- **Trust**: Data cannot be altered retroactively — cryptographically guaranteed

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LAYER                               │
│  Farmer │ Processor │ Logistics │ Retailer │ Admin │ Consumer   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   FRONTEND (React + Vite)                       │
│  Role-based dashboards, QR scanner, consumer traceability UI    │
│  Port: 5173 (dev)                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (REST API)
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                   │
│  Auth (JWT), role middleware, API routes, DB sync               │
│  Port: 3001                                                     │
├─────────────────┬───────────────────────────────────────────────┤
│   SQLite DB     │          Ethers.js v6                         │
│  (off-chain)    │     (blockchain bridge)                       │
└─────────────────┘───────────────────┬───────────────────────────┘
                                      │ JSON-RPC
┌─────────────────────────────────────▼───────────────────────────┐
│              BLOCKCHAIN (Hardhat local node)                    │
│  AgriChain.sol smart contract (Solidity 0.8.28)                 │
│  OpenZeppelin AccessControl for role-based permissions          │
│  Port: 8545 │ Chain ID: 31337                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Pattern
1. **Frontend** sends authenticated REST request to backend
2. **Backend** validates JWT + role, then calls smart contract via Ethers.js
3. **Smart contract** executes on-chain logic, emits events
4. **Backend** reads updated on-chain state, syncs to SQLite for fast queries
5. **Frontend** receives response with both DB data and blockchain tx metadata

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI framework, component-based architecture |
| Vite | 6.3 | Build tool and dev server |
| TypeScript | 5.9 | Static typing for frontend code |
| Tailwind CSS | 4.1 | Utility-first CSS framework |
| Framer Motion | 12.x | Animations and page transitions |
| React Router DOM | 7.9 | Client-side routing, role-based navigation |
| TanStack React Query | 5.x | Server state management, caching, auto-refetch |
| Recharts | 3.8 | Charts in Admin dashboard (bar, line, pie) |
| react-qr-code | 2.0 | QR code generation for product labels |
| @yudiel/react-qr-scanner | 2.4 | Camera-based QR code scanning |
| Three.js + R3F + Drei | latest | 3D visualization on landing page |
| Lucide React | 0.555 | Icon library |
| Radix UI | various | Accessible headless UI primitives |
| React Hook Form + Zod | latest | Form handling with schema validation |
| Sonner | 2.0 | Toast notifications |

### 3.2 Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Server runtime |
| Express | 5.1 | REST API framework |
| SQLite3 | 5.1 | Off-chain database for fast queries |
| Ethers.js | 6.15 | Blockchain interaction library |
| JSON Web Token | 9.0 | Authentication tokens |
| bcryptjs | 3.0 | Password hashing |
| Zod | 4.3 | Request body validation |
| Pino | 10.3 | Structured JSON logging |
| Helmet | 8.1 | HTTP security headers |
| CORS | 2.8 | Cross-origin resource sharing |
| express-rate-limit | 8.4 | API rate limiting |
| dotenv | 17.2 | Environment variable management |

### 3.3 Blockchain
| Technology | Version | Purpose |
|---|---|---|
| Hardhat | 3.0 | Development framework, local blockchain node |
| Solidity | 0.8.28 | Smart contract language |
| OpenZeppelin Contracts | 5.6 | AccessControl for role-based permissions |
| Mocha + Chai | latest | Smart contract unit testing |

---

## 4. Directory Structure

```
Blockchain-agri/
├── src/                          # FRONTEND (React + TypeScript)
│   ├── App.tsx                   # Root component, all routes defined here
│   ├── main.tsx                  # React entry point
│   ├── lib/
│   │   └── api.ts                # Typed API client, all endpoint calls
│   ├── providers/
│   │   ├── AuthProvider.tsx       # Auth context (login/register/logout)
│   │   └── QueryProvider.tsx      # TanStack Query config
│   ├── hooks/
│   │   ├── useAuth.ts            # Hook to access AuthContext
│   │   └── useBatches.ts         # Hook to fetch batch list
│   ├── pages/
│   │   ├── LandingPage.tsx       # Public marketing homepage
│   │   ├── Login.tsx             # Email + password login
│   │   ├── Register.tsx          # Registration with role selection
│   │   ├── FarmerDashboard.tsx   # Create batches, view stats
│   │   ├── ProcessorDashboard.tsx # Process CREATED batches
│   │   ├── LogisticsDashboard.tsx # Ship PROCESSED batches
│   │   ├── RetailerDashboard.tsx  # Receive shipments, publish QR
│   │   ├── AdminDashboard.tsx    # Platform analytics + charts
│   │   ├── ConsumerScan.tsx      # QR scanner + manual batch ID entry
│   │   ├── ConsumerBatchDetails.tsx # Full traceability view
│   │   ├── AllBatchesPage.tsx    # Paginated batch list
│   │   ├── SettingsPage.tsx      # User settings
│   │   └── NotFound.tsx          # 404 page
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx # Redirects unauthenticated users
│   │   │   └── RoleRoute.tsx      # Restricts access by role
│   │   ├── batches/
│   │   │   ├── BatchCreateDialog.tsx  # Form to create new batch
│   │   │   ├── BatchActionDialog.tsx  # Process/Ship/Receive dialog
│   │   │   ├── BatchDetailsSheet.tsx  # Slide-out batch detail panel
│   │   │   ├── BatchTable.tsx         # Reusable batch list table
│   │   │   ├── QRPublishDialog.tsx    # Generate + download QR code
│   │   │   └── StatCard.tsx           # Dashboard stat card
│   │   ├── common/
│   │   │   ├── Header.tsx        # Top navigation bar
│   │   │   ├── StatusBadge.tsx   # Colored status pill
│   │   │   ├── TxHashChip.tsx    # Clickable transaction hash display
│   │   │   ├── EmptyState.tsx    # Empty data placeholder
│   │   │   └── ErrorBoundary.tsx # React error boundary
│   │   ├── layout/
│   │   │   └── DashboardShell.tsx # Dashboard layout wrapper + sidebar
│   │   └── ui/                   # 25 Radix-based UI primitives
│   │       ├── prisma-hero.tsx   # Landing page hero with 3D scene
│   │       ├── features-grid.tsx # Feature cards section
│   │       ├── stats-bar.tsx     # Animated statistics counter
│   │       └── ...               # button, card, dialog, tabs, etc.
│   └── styles/                   # Global CSS
│
├── backend/                      # BACKEND (Node.js + Express)
│   ├── server.js                 # Express app setup + startup
│   ├── blockchain.js             # Ethers.js contract interaction layer
│   ├── routes/
│   │   ├── api.js                # All batch + admin API endpoints
│   │   └── auth.js               # Register, login, /me endpoints
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   ├── requireRole.js        # Role-based access middleware
│   │   └── validate.js           # Zod schema validation middleware
│   ├── database/
│   │   ├── schema.sql            # SQLite table definitions
│   │   ├── db.js                 # DB connection + helper functions
│   │   └── agrichain.db          # SQLite database file (gitignored)
│   ├── lib/
│   │   ├── config.js             # Environment variable loader
│   │   ├── wallets.js            # HD wallet derivation, contract instances
│   │   ├── errors.js             # AppError class + response helpers
│   │   └── logger.js             # Pino logger instance
│   ├── scripts/
│   │   └── seed.js               # Database seeder script
│   ├── .env                      # Backend environment variables
│   └── package.json
│
├── smart-contract/               # BLOCKCHAIN (Hardhat + Solidity)
│   ├── contracts/
│   │   └── AgriChain.sol         # Main smart contract (190 lines)
│   ├── scripts/
│   │   └── deploy.js             # Deploy + grant roles + write .env files
│   ├── test/
│   │   └── AgriChain.test.js     # 14 unit tests for contract
│   ├── hardhat.config.js         # Hardhat 3 configuration
│   ├── deployment.json           # Last deployment addresses (auto-generated)
│   └── package.json
│
├── package.json                  # Root package.json with orchestration scripts
├── vite.config.js                # Vite config (proxy, SSL, aliases)
├── tailwind.config.js            # Tailwind CSS configuration
├── index.html                    # HTML entry point
├── .env                          # Frontend env vars (VITE_*)
└── .env.example                  # Template for frontend env
```

---

## 5. Smart Contract — AgriChain.sol

### 5.1 Overview
Single Solidity contract using OpenZeppelin's `AccessControl` for role-based permissions. Implements a linear state machine where each batch progresses through stages, with each stakeholder adding their price component.

### 5.2 Roles (on-chain)
| Role | Bytes32 Hash | HD Wallet Index | Permissions |
|---|---|---|---|
| `DEFAULT_ADMIN_ROLE` | built-in | 0 | Grant/revoke roles |
| `FARMER_ROLE` | keccak256 | 1 | `createBatch()` |
| `PROCESSOR_ROLE` | keccak256 | 2 | `addProcessingDetails()` |
| `LOGISTICS_ROLE` | keccak256 | 3 | `updateLogistics()` |
| `RETAILER_ROLE` | keccak256 | 4 | `retailerReceive()` |

### 5.3 State Machine
```
CREATED ──→ PROCESSED ──→ IN_TRANSIT ──→ RETAIL ──→ (SOLD)
  │              │              │            │
 Farmer      Processor     Logistics    Retailer
```
- Each transition is **one-way** and **enforced** by the contract
- Skipping states reverts (e.g., CREATED → IN_TRANSIT is blocked)
- Each transition adds a `PriceComponent` to the batch's price breakdown

### 5.4 Data Structures

```solidity
enum Status { CREATED, PROCESSED, IN_TRANSIT, RETAIL, SOLD }

struct PriceComponent {
    address stakeholder;   // Who added this cost
    string  role;          // "FARMER", "PROCESSOR", etc.
    uint256 amount;        // Cost in smallest unit (₹)
    string  description;   // Human-readable description
    uint256 timestamp;     // Block timestamp
}

struct Batch {
    uint256 id;
    address farmer;            // Creator's address
    string  crop;              // e.g. "Basmati Rice"
    string  weight;            // e.g. "500kg"
    string  location;          // e.g. "Punjab, IN"
    uint256 createdAt;         // Block timestamp at creation
    Status  status;            // Current state
    uint256 totalPrice;        // Running sum of all price components
    PriceComponent[] priceBreakdown;  // Full cost history
}
```

### 5.5 Functions

| Function | Role Required | Input | Effect |
|---|---|---|---|
| `createBatch(crop, weight, location, basePrice)` | FARMER | Crop details + base price | Creates batch in CREATED state |
| `addProcessingDetails(batchId, fee, description)` | PROCESSOR | Batch ID + processing fee | CREATED → PROCESSED |
| `updateLogistics(batchId, fee, description)` | LOGISTICS | Batch ID + transport fee | PROCESSED → IN_TRANSIT |
| `retailerReceive(batchId, markup, description)` | RETAILER | Batch ID + retail markup | IN_TRANSIT → RETAIL |
| `getBatchDetails(batchId)` | Public | Batch ID | Returns full batch + price breakdown |
| `getBatchHistory(batchId)` | Public | Batch ID | Returns price breakdown array |
| `batchCount()` | Public | — | Returns total number of batches |

### 5.6 Events Emitted
- `BatchCreated(id, farmer, basePrice)`
- `BatchProcessed(id, processor, fee, newTotal)`
- `BatchInTransit(id, logistics, fee, newTotal)`
- `BatchRetail(id, retailer, markup, newTotal)`
- `PriceUpdated(id, stakeholder, role, amount, newTotal)`
- `StatusUpdated(id, newStatus)`

---

## 6. Backend API Reference

**Base URL**: `http://localhost:3001`
**Auth**: JWT Bearer token in `Authorization` header
**Response format**: `{ success: true, data: {...} }` or `{ success: false, error: { code, message } }`

### 6.1 Authentication Endpoints

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ email, password, role }` | `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | Yes | — | `{ user }` |

**Roles**: `FARMER`, `PROCESSOR`, `LOGISTICS`, `RETAILER`, `CONSUMER`, `ADMIN`
**Password**: min 8 characters. **Rate limit**: 10 req/min on auth endpoints.

### 6.2 Batch Write Endpoints (role-gated, rate-limited 30/min)

| Method | Path | Role | Body | Effect |
|---|---|---|---|---|
| POST | `/api/batch/create` | FARMER | `{ crop, weight, location, basePrice }` | Creates batch on-chain + DB |
| POST | `/api/batch/process` | PROCESSOR | `{ batchId, fee, description? }` | Advances to PROCESSED |
| POST | `/api/batch/ship` | LOGISTICS | `{ batchId, fee, description? }` | Advances to IN_TRANSIT |
| POST | `/api/batch/receive` | RETAILER | `{ batchId, fee, description? }` | Advances to RETAIL |
| POST | `/api/batch/update` | Varies | `{ batchId, role, fee, description? }` | Legacy generic endpoint |

### 6.3 Batch Read Endpoints (public, no auth)

| Method | Path | Query Params | Response |
|---|---|---|---|
| GET | `/api/batch/:id` | — | Single batch + priceBreakdown |
| GET | `/api/batches` | `?status=CREATED` | All batches (optionally filtered) |
| GET | `/api/stats/count` | — | `{ batchCount, contractAddress }` |

### 6.4 Admin Endpoints

| Method | Path | Role | Response |
|---|---|---|---|
| GET | `/api/admin/overview` | ADMIN | `{ users, batchesByStatus, volumeByDay, recentActivity }` |

---

## 7. Database Schema (SQLite)

### users
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| email | TEXT UNIQUE | Login identifier |
| password_hash | TEXT | bcrypt hash |
| role | TEXT | FARMER/PROCESSOR/LOGISTICS/RETAILER/CONSUMER/ADMIN |
| wallet_index | INTEGER | HD wallet derivation index (null for CONSUMER/ADMIN) |
| created_at | INTEGER | Unix timestamp in milliseconds |

### batches
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Matches on-chain batch ID |
| farmer_address | TEXT | Ethereum address of creator |
| crop | TEXT | Crop name |
| weight | TEXT | Weight string |
| location | TEXT | Origin location |
| status | TEXT | CREATED/PROCESSED/IN_TRANSIT/RETAIL/SOLD |
| total_price | INTEGER | Cumulative price in ₹ |
| tx_hash | TEXT | Creation transaction hash |
| block_number | INTEGER | Block number |
| created_at | INTEGER | Timestamp (ms) |
| updated_at | INTEGER | Last update timestamp (ms) |

### price_components
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| batch_id | INTEGER FK | References batches(id) |
| stakeholder_address | TEXT | Ethereum address |
| role | TEXT | FARMER/PROCESSOR/LOGISTICS/RETAILER |
| amount | INTEGER | Price component in ₹ |
| description | TEXT | Human description |
| timestamp | INTEGER | Timestamp (ms) |
| tx_hash | TEXT | Transaction hash |
| block_number | INTEGER | Block number |

---

## 8. Wallet & Signing Architecture

The backend uses **hybrid custody**: it holds HD-derived private keys and signs transactions on behalf of authenticated users. Users never handle private keys directly.

```
Hardhat Mnemonic: "test test test test test test test test test test test junk"

Account[0] → Admin (deployer, role granter)
Account[1] → FARMER signer    (m/44'/60'/0'/0/1)
Account[2] → PROCESSOR signer (m/44'/60'/0'/0/2)
Account[3] → LOGISTICS signer (m/44'/60'/0'/0/3)
Account[4] → RETAILER signer  (m/44'/60'/0'/0/4)
```

**Flow**: User logs in with email/password → backend verifies JWT → backend determines user's role → backend signs blockchain tx with the corresponding role wallet → tx submitted to chain.

---

## 9. Frontend Routes & Access Control

| Path | Auth | Role | Component |
|---|---|---|---|
| `/` | No | Any | LandingPage (marketing) |
| `/login` | No | Any | Login form |
| `/register` | No | Any | Registration with role selector |
| `/scan` | No | Any | QR scanner (consumer flow) |
| `/product/:batchId` | No | Any | Full batch traceability view |
| `/farmer/*` | Yes | FARMER | Farmer dashboard + sub-routes |
| `/processor/*` | Yes | PROCESSOR | Processor dashboard |
| `/logistics/*` | Yes | LOGISTICS | Logistics dashboard |
| `/retailer/*` | Yes | RETAILER | Retailer dashboard |
| `/admin/*` | Yes | ADMIN | Admin analytics dashboard |

Each dashboard has sub-routes: `/` (overview), `/batches` (all batches), `/settings`.

### Route Protection
- `<ProtectedRoute>` — redirects to `/login` if not authenticated
- `<RoleRoute allow={[...]}>` — shows forbidden message if wrong role

---

## 10. End-to-End Workflow

### Step 1: Farmer Creates Batch
1. Farmer logs in → sees FarmerDashboard
2. Clicks "Create batch" → fills crop, weight, location, base price
3. Frontend calls `POST /api/batch/create`
4. Backend signs `createBatch()` on-chain with FARMER wallet
5. Contract creates batch in CREATED state, emits `BatchCreated`
6. Backend syncs batch + price component to SQLite
7. UI shows tx hash confirmation

### Step 2: Processor Adds Fee
1. Processor logs in → sees CREATED batches in queue
2. Clicks "Process" → enters processing fee + description
3. Frontend calls `POST /api/batch/process`
4. Contract transitions CREATED → PROCESSED, adds PriceComponent
5. Backend syncs updated state to SQLite

### Step 3: Logistics Ships
1. Logistics provider logs in → sees PROCESSED batches
2. Clicks "Ship" → enters transport fee
3. Contract transitions PROCESSED → IN_TRANSIT

### Step 4: Retailer Receives
1. Retailer logs in → sees IN_TRANSIT batches in "Incoming" tab
2. Clicks "Receive" → enters retail markup
3. Contract transitions IN_TRANSIT → RETAIL
4. Retailer can now generate QR code via "QR" button in "In stock" tab

### Step 5: Consumer Scans QR
1. Consumer navigates to `/scan` (no login required)
2. Opens camera scanner OR enters batch ID manually
3. System fetches batch data from `/api/batch/:id`
4. Displays: crop info, status badge, supply chain timeline, price share pie chart, provenance details, and on-chain verification

---

## 11. Environment Variables

### Frontend (.env in project root)
```
VITE_API_BASE_URL=http://localhost:3001    # Backend URL
VITE_CHAIN_NAME=Hardhat #31337             # Display name for chain
VITE_CONTRACT_ADDRESS=0x...                # Auto-set by deploy script
```

### Backend (backend/.env)
```
PORT=3001
FRONTEND_URL=http://localhost:5173
BLOCKCHAIN_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x...                     # Auto-set by deploy script
MNEMONIC=test test test test test test test test test test test junk
JWT_SECRET=<random-64-byte-hex>
JWT_EXPIRES_IN=24h
```

---

## 12. How to Run

### Prerequisites
- Node.js (v18+)
- npm

### One-Command Start
```bash
npm run dev
```
This runs concurrently:
1. `hardhat node` — starts local blockchain on port 8545
2. `deploy.js` — compiles + deploys contract + grants roles + writes .env
3. `backend/server.js` — starts Express API on port 3001
4. `vite --host` — starts frontend dev server on port 5173

### Individual Commands
```bash
npm run chain      # Start Hardhat node only
npm run deploy     # Deploy contract only
npm run seed       # Seed database with test data
npm run reset      # Wipe DB + redeploy + reseed
npm run test       # Run smart contract tests
npm run build      # Production build
```

---

## 13. Smart Contract Tests

Located at `smart-contract/test/AgriChain.test.js` — 14 tests in 5 suites:

| Suite | Tests | What It Verifies |
|---|---|---|
| Role Management | 2 | Roles are granted correctly; outsiders excluded |
| Batch Creation | 4 | Farmer can create; non-farmer reverts; zero price reverts; count increments; event emitted |
| State Machine | 4 | Correct progression CREATED→RETAIL; skipping states reverts; re-processing reverts |
| Role Gating | 3 | Wrong role for each function reverts |
| Price Breakdown | 2 | 4 components tracked in order; timestamps ascending |
| Invalid Lookups | 1 | Non-existent batch reverts |

---

## 14. Key Design Decisions

1. **Hybrid Custody**: Users authenticate with email/password; the backend holds wallet keys. This simplifies UX (no MetaMask needed) while maintaining on-chain integrity.

2. **Dual Storage**: Critical data (batch state, price components) lives on-chain. The same data is mirrored to SQLite for fast queries, filtering, and analytics. The blockchain is the source of truth.

3. **Linear State Machine**: Batches progress through a strict sequence. This prevents invalid state transitions and ensures supply chain integrity.

4. **Public Read / Authenticated Write**: Anyone can read batch data (for consumer scanning). Only authenticated, role-verified users can write.

5. **Price-Per-Handoff Model**: Instead of a single setPrice function, each stakeholder adds their cost component during their state transition, creating a transparent price breakdown.

6. **Auto-Deploy Pipeline**: The deploy script automatically writes contract addresses to both frontend and backend .env files, eliminating manual configuration.

---

## 15. Frontend Component Architecture

```
App.tsx
├── QueryProvider (TanStack React Query)
├── AuthProvider (JWT + user state)
├── TooltipProvider (Radix)
├── BrowserRouter
│   ├── LandingPage (public marketing)
│   │   ├── AgriChainHero (3D scene + CTA)
│   │   ├── StatsBar (animated counters)
│   │   ├── FeaturesGrid (6 feature cards)
│   │   ├── ProblemSolution (before/after)
│   │   ├── BlockchainExplainer (how blockchain works)
│   │   ├── How It Works (5 steps: Harvest→Scan)
│   │   ├── Stakeholders (6 role cards)
│   │   ├── Testimonials (carousel)
│   │   ├── SDG Impact (SDG 8, 9, 12)
│   │   ├── FaqAccordion
│   │   ├── CtaBanner
│   │   └── LandingFooter
│   │
│   ├── Login / Register (auth forms)
│   │
│   ├── [Role]Dashboard (wrapped in ProtectedRoute + RoleRoute)
│   │   └── DashboardShell (sidebar nav + header + content area)
│   │       ├── StatCard (metric cards)
│   │       ├── BatchTable (sortable data table)
│   │       ├── BatchCreateDialog (farmer only)
│   │       ├── BatchActionDialog (process/ship/receive)
│   │       ├── BatchDetailsSheet (slide-out detail panel)
│   │       └── QRPublishDialog (retailer only)
│   │
│   ├── ConsumerScan (QR scanner + manual entry)
│   └── ConsumerBatchDetails (timeline + pie chart + provenance)
```

---

## 16. API Client (Frontend)

All API calls go through `src/lib/api.ts` which provides:
- **Typed request function**: `apiRequest<T>(path, init)` with automatic JWT injection
- **Envelope unwrapping**: Responses are `{ success, data, meta }` — client extracts `data`
- **Typed error handling**: Errors thrown as `ApiError` with `code`, `message`, `status`
- **Domain types**: `Batch`, `User`, `PriceComponent`, `AdminOverview`, etc.

---

## 17. Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs with 10 rounds |
| JWT auth | jsonwebtoken, 24h expiry, secret from env |
| Role enforcement | Middleware checks `req.user.role` before allowing access |
| On-chain role enforcement | OpenZeppelin AccessControl `onlyRole()` modifier |
| Rate limiting | 10 req/min on auth, 30 req/min on writes |
| Input validation | Zod schemas on all POST endpoints |
| Security headers | Helmet middleware |
| CORS | Configured via cors middleware |

---

## 18. Deployment Script Details

`smart-contract/scripts/deploy.js` does the following in order:
1. Gets signers from Hardhat node
2. Deploys `AgriChain` contract with `admin` (account[0]) as constructor arg
3. Grants `FARMER_ROLE` to account[1], `PROCESSOR_ROLE` to account[2], etc.
4. Writes `CONTRACT_ADDRESS` to `backend/.env`
5. Writes `VITE_CONTRACT_ADDRESS` + `VITE_CHAIN_NAME` to root `.env`
6. Writes `deployment.json` with all addresses for reference

---

*This documentation reflects the actual implemented codebase as of May 2026.*
