# AgriChain RAG Chatbot — Design Spec
**Date:** 2026-05-09  
**Status:** Approved  

---

## 1. Overview

Add a role-aware RAG (Retrieval-Augmented Generation) chatbot to AgriChain. Users — farmers, processors, logistics operators, retailers, admins, and public consumers — can ask natural language questions about crop batches, supply chain history, price breakdowns, and platform usage. The chatbot uses a local vector store built from the SQLite database, retrieves relevant batch documents, and synthesizes answers via the nvidia/nemotron-3-super-120b-a12b:free model on OpenRouter with streaming responses.

---

## 2. Architecture

```
Frontend                    Backend                         External
──────────                  ───────                         ────────
ChatSidebar (slide panel)   POST /api/chat (SSE stream)     OpenRouter API
  └─ ChatMessage              └─ EmbeddingService              (nemotron model)
  └─ ChatInput                    @xenova/transformers
  └─ useChat hook                 all-MiniLM-L6-v2
                              └─ VectorStore
                                  in-memory, cosine similarity
                                  rebuilt on start + batch writes
                              └─ ChatService
                                  RAG pipeline + OpenRouter SSE
```

### Data Flow

1. Server start → `VectorStore.rebuild()` embeds all batches from SQLite
2. Any batch write → `VectorStore.upsert(batchId)` re-indexes that batch
3. User sends message → `POST /api/chat` with `{ message, history, userContext? }`
4. `EmbeddingService.encode(message)` → 384-dim float vector
5. `VectorStore.search(vector, k=5)` → top-5 most relevant batch documents
6. `ChatService.stream()` assembles prompt → calls OpenRouter with `stream: true`
7. SSE token stream piped from OpenRouter → Express response → frontend ReadableStream
8. Frontend appends tokens in real time with blinking cursor

---

## 3. Backend Services

### 3.1 `backend/services/embedding.js`

- Loads `Xenova/all-MiniLM-L6-v2` via `@xenova/transformers` (22MB, pure JS)
- Singleton pipeline — initialized once on first use, cached in module scope
- `encode(text: string) → Float32Array` — mean-pools token embeddings
- Model download happens once, cached in `~/.cache/xenova/`

### 3.2 `backend/services/vectorStore.js`

- In-memory array of `{ id, text, vector, metadata }` objects
- `rebuild()` — queries all batches + price_components from SQLite, formats documents, encodes all, replaces index
- `upsert(batchId)` — fetches single batch, re-encodes, replaces/adds its entry
- `search(queryVector, k)` — cosine similarity across all entries, returns top-K with scores
- Document format (see section 5)

### 3.3 `backend/services/chatService.js`

- `buildSystemPrompt(userContext?)` — platform description, role definitions, data-freshness note
- `buildMessages(systemPrompt, retrievedChunks, history, userMessage)` — assembles OpenAI-compatible messages array
- `streamChat(req, res)` — fetches from OpenRouter with `stream: true`, pipes SSE through Express `res` with proper `Content-Type: text/event-stream` headers

### 3.4 `backend/routes/chat.js`

```
POST /api/chat
Headers: Authorization: Bearer <token>  (optional)
Body: {
  message: string,          // user's question
  history: [                // last N turns
    { role: "user"|"assistant", content: string }
  ]
}
Response: text/event-stream (SSE)
  data: {"token": "..."}\n\n
  data: {"done": true}\n\n
```

- Rate limit: 20 req/min per IP
- Auth middleware: `optionalAuth` — reads token if present, sets `req.user`, does not 401 on missing token
- Passes `req.user` as `userContext` to ChatService for system prompt scoping

---

## 4. Frontend Components

### 4.1 `src/components/chat/ChatSidebar.tsx`

- Fixed right panel, 380px wide, `z-index: 50`
- Slide animation: `transform: translateX(100%)` → `translateX(0)` via CSS transition
- Header: "✦ AgriChain AI" + role badge (from auth store) + close button
- Message list (scrollable) + empty state with 3 suggested questions
- Input area at bottom

### 4.2 `src/components/chat/ChatMessage.tsx`

- `role: "user" | "assistant"` prop
- User: right-aligned, indigo background, white text
- Assistant: left-aligned, white card, indigo "AI" avatar
- Streaming: last assistant message shows blinking cursor `▌` while `isStreaming` is true
- Markdown rendering for assistant responses (bold, lists, code spans)

### 4.3 `src/components/chat/ChatInput.tsx`

- Textarea with auto-resize (max 120px)
- Send on Enter (Shift+Enter for newline)
- Disabled + spinner while streaming

### 4.4 `src/hooks/useChat.ts`

- State: `messages[]`, `isStreaming`, `error`
- `sendMessage(text)` — appends user message, calls `POST /api/chat`, reads SSE stream via `ReadableStream`, appends tokens to last assistant message
- History: last 8 turns passed in every request
- Abort controller: cancels in-flight stream if user closes sidebar

### 4.5 Layout Integration

- Toggle button added to `src/components/layout/` navbar — "Ask AI" button (visible on all pages)
- `ChatSidebar` rendered in root `App.tsx`, outside page routes so it persists across navigation

---

## 5. Document Schema

Each batch is represented as a single text document:

```
Batch #<id> | Crop: <crop> | Weight: <weight> | Location: <location>
Status: <status> | Total Price: <total_price> units
Farmer Wallet: <farmer_address>
Created: <ISO timestamp> | Last Updated: <ISO timestamp>
Blockchain TX (creation): <tx_hash> | Block: <block_number>
Contract Address: <contractAddress>

Supply Chain Journey:
  [1] <ROLE> | Wallet: <stakeholder_address> | +<amount> units | "<description>"
      TX: <tx_hash> | Block: <block_number> | Time: <ISO timestamp>
  [2] ...
```

**Metadata stored alongside vector:**
```json
{ "batchId": 5, "crop": "Wheat", "status": "AT_RETAILER", "farmerAddress": "0x..." }
```

---

## 6. System Prompt

```
You are AgriChain AI, an assistant for the AgriChain blockchain-based agricultural 
supply chain platform. You help users understand crop batch journeys, price breakdowns, 
and supply chain transparency.

Platform roles: FARMER (creates batches), PROCESSOR (cleaning/grading), 
LOGISTICS (transport), RETAILER (sells to consumers), ADMIN (platform oversight), 
CONSUMER (verifies product origin via QR scan).

Data freshness: The retrieved context below is from a live database. Batch data 
includes blockchain transaction hashes for on-chain verification.

[If authenticated]:
Current user: <email> | Role: <ROLE> | Wallet: <address>
When the user says "my batches" or "my data", use their wallet/role to filter.

Answer clearly and concisely. If the retrieved context doesn't contain the answer, 
say so — do not invent batch data. For general agricultural questions, use your 
knowledge base.
```

---

## 7. Security

| Concern | Mitigation |
|---|---|
| API key exposure | `OPENROUTER_API_KEY` in `backend/.env` only, never sent to frontend |
| SQL injection | LLM never generates SQL; only reads retrieval results |
| Rate limiting | 20 req/min per IP on `/api/chat` |
| Auth scoping | Token optional; if present, scopes system prompt to user's role/wallet |
| LLM prompt injection | System prompt clearly delineated; retrieved chunks labeled as context |

---

## 8. Error States

| State | UI message |
|---|---|
| OpenRouter timeout/5xx | "AI is temporarily unavailable. Please try again." |
| Vector store not ready | "Building knowledge base, please wait a moment..." |
| No batches in DB | "No batch data yet — create some batches to ask about them." |
| Stream error mid-response | Append "[response interrupted]" to partial message |
| Rate limit hit | "Too many requests. Please wait a moment." |

---

## 9. New Files

**Backend:**
- `backend/services/embedding.js`
- `backend/services/vectorStore.js`
- `backend/services/chatService.js`
- `backend/routes/chat.js`
- `backend/middleware/optionalAuth.js`

**Frontend:**
- `src/components/chat/ChatSidebar.tsx`
- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/hooks/useChat.ts`

**Modified:**
- `backend/server.js` — mount `/api/chat` route
- `backend/routes/api.js` — call `vectorStore.upsert()` after each batch write
- `src/App.tsx` — render `ChatSidebar` outside routes
- `src/components/layout/` — add "Ask AI" toggle button
- `backend/package.json` — add `@xenova/transformers`
- `backend/.env` — add `OPENROUTER_API_KEY`

---

## 10. Environment Variables

```env
# backend/.env
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 11. Out of Scope

- Persistent chat history across sessions (in-memory only)
- Per-user conversation logs in the database
- Vector store persistence to disk (rebuilt on restart)
- Multiple concurrent AI models / model switching UI
