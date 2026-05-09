# AgriChain Backend

Express 5 API server for AgriChain. Handles JWT auth, blockchain interaction, SQLite caching, and the RAG AI chat pipeline.

## Stack

- **Express 5** + Node.js (CommonJS)
- **ethers v6** — signs transactions using HD wallets derived from `MNEMONIC`
- **SQLite** (sqlite3) — write-through cache for fast reads
- **@xenova/transformers** — local neural embedding model for RAG
- **OpenRouter API** — nvidia/nemotron-3-super-120b-a12b:free for chat completions
- **zod** — request validation
- **pino** — structured JSON logging
- **helmet** + **cors** + **express-rate-limit** — security

## Directory Structure

```
backend/
├── server.js                 App bootstrap, route mount, vectorStore.rebuild()
├── blockchain.js             ethers v6 contract interaction layer
├── database/
│   ├── db.js                 SQLite helpers + dbHelpers object
│   └── schema.sql            users · batches · price_components
├── routes/
│   ├── auth.js               POST /api/auth/register · login · me
│   ├── api.js                Batch CRUD + admin overview
│   └── chat.js               POST /api/chat — SSE streaming RAG chat
├── middleware/
│   ├── auth.js               JWT Bearer — 401 if missing/invalid
│   ├── optionalAuth.js       JWT Bearer — null if missing (chat endpoint)
│   ├── requireRole.js        Role gate — 403 if wrong role
│   └── validate.js           zod schema validation middleware
├── services/
│   ├── embedding.js          @xenova/transformers pipeline (all-MiniLM-L6-v2)
│   ├── vectorStore.js        In-memory cosine similarity vector index
│   └── chatService.js        RAG pipeline + OpenRouter SSE streaming
├── lib/
│   ├── config.js             Env vars with defaults
│   ├── wallets.js            HD wallet derivation from MNEMONIC
│   ├── errors.js             AppError + response envelope helpers
│   └── logger.js             pino logger instance
└── scripts/
    └── seed.js               6 demo users + 5 staggered batches
```

## Running

```bash
npm install
npm run dev       # node server.js
```

From the project root, `npm run dev` starts everything including this server.

## Environment Variables

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
BLOCKCHAIN_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x...
MNEMONIC=test test test test test test test test test test test junk
JWT_SECRET=dev-secret-change-me-in-production
JWT_EXPIRES_IN=24h
OPENROUTER_API_KEY=sk-or-v1-...
```

## API Endpoints

See the root `README.md` for the full API reference table.

## RAG Chat Pipeline

On startup, `vectorStore.rebuild()` embeds all existing batches as text documents using `Xenova/all-MiniLM-L6-v2`. After every batch write, `vectorStore.upsert(batchId)` re-indexes that batch. `POST /api/chat` embeds the user query, retrieves top-5 similar chunks, builds a system prompt with the retrieved context, and streams the nemotron response back as SSE.
