# 🚀 Quick Start Guide - AgriChain

## TL;DR - Get Running in 3 Steps

### 1. Start Blockchain (Terminal 1)
```bash
cd smart-contract
npx hardhat node
```
✅ Wait for "Started HTTP and WebSocket JSON-RPC server"

### 2. Start Backend (Terminal 2)
```bash
cd backend
npm start
```
✅ Wait for "Server running on http://localhost:3001"

### 3. Start Frontend (Terminal 3)
```bash
npm run dev
```
✅ Open browser to http://localhost:5173

## 🎯 Quick Test Workflow

1. **Farmer** (`/farmer`) → Create batch with price `100`
2. **Processor** (`/processor`) → Add fee `20` → Total: `120`
3. **Logistics** (`/logistics`) → Add fee `10` → Total: `130`
4. **Retailer** (`/retailer`) → Add markup `50` → Total: `180`
5. **Consumer** (`/scan`) → Enter batch ID → See breakdown!

## 📊 Example Batch Flow

```
Batch #1: Basmati Rice
─────────────────────────
Farmer:      ₹100 (55.6%)
Processor:   ₹20  (11.1%)
Logistics:   ₹10  (5.6%)
Retailer:    ₹50  (27.8%)
─────────────────────────
Total:       ₹180
```

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Blockchain**: http://127.0.0.1:8545

## 🎮 Dashboard Routes

| URL | Role |
|-----|------|
| `/farmer` | Create batches |
| `/processor` | Add processing fees |
| `/logistics` | Add transport fees |
| `/retailer` | Add retail markup |
| `/scan` | Consumer scan |

## ⚡ Pro Tips

- Keep all 3 terminals running
- Use batch ID `1` for first batch
- Check browser console for API errors
- Backend auto-deploys contract on first run

## 🆘 Need Help?

See full [README.md](file:///e:/2025%20projects/Blockchain-Agri/README.md) for detailed instructions and troubleshooting.
