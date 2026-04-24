# Blockchain-Agri — Ship-Ready Plan

## Progress Tracker

| Phase | Title | Status | Commit |
|---|---|---|---|
| 0 | Freeze baseline | DONE | `e8fd24b` + tag `v0-baseline` |
| 1 | Smart contract v2 | DONE | `dac73ee` |
| 2 | Backend v2 | DONE | `85a9e06` |
| 3 | Frontend foundation | DONE | `7c7337e` |
| 4 | Role dashboards | DONE | `5a73457` |
| 5 | Consumer flow polish | DONE | this commit |
| 6 | DX + docs | IN PROGRESS | — |
| 7 | Harden + ship | PENDING | — |

> This tracker is updated after each phase wraps. Global status of the repo can be read at a glance here.

## Context

The repo is an MVP hybrid dApp (React + Express + SQLite + Hardhat) that tracks an agricultural supply chain across 5 roles. The current state has real problems the user called out:

- **Frontend doesn't "link" to the chain** — it talks only to `http://localhost:3001` (hardcoded in [src/lib/api.ts:2](src/lib/api.ts#L2)). Users never see a tx hash, block number, or contract address.
- **UI/UX is weak** — every dashboard has hardcoded stats (e.g. [src/pages/FarmerDashboard.tsx](src/pages/FarmerDashboard.tsx)), uses `alert()` for feedback, has no loading/empty/error states, and the retailer QR modal is orphaned (`setShowQRModal` never fires in [src/pages/RetailerDashboard.tsx](src/pages/RetailerDashboard.tsx)).
- **Navigation is broken** — sidebar links in [src/components/DashboardLayout.tsx](src/components/DashboardLayout.tsx) point to `/farmer/batches` and `/farmer/settings` which don't exist; "logout" is a link to `/`.
- **Contract is insecure** — [smart-contract/contracts/AgriChain.sol:66](smart-contract/contracts/AgriChain.sol#L66) literally says "In a real app, we would check if msg.sender has PROCESSOR role". No access control, string statuses, no deploy script (the "deploy.js" just prints instructions).

The goal is a self-contained demo that runs cleanly on `npm run dev` and walks a public user end-to-end through register → role dashboard → create/process/ship/retail → QR → consumer batch page with visible on-chain proof.

## Locked decisions (per user)

| Dimension | Choice |
|---|---|
| Custody | Hybrid — backend holds 4 role signers; frontend shows `txHash` + `blockNumber` + `contractAddress` |
| Network | Local Hardhat (chainId 31337); testnet deploy is a follow-up doc section |
| Auth | JWT (Bearer header) + email/password, bcrypt, role assigned at register |
| UI | Full redesign — shadcn/ui, new tokens, DashboardShell, toasts, React Query, Recharts |

## Reuse vs. rewrite

**Reuse as-is:** `smart-contract/hardhat.config.js`, contract struct shapes, `blockchain.js` event-parse helper pattern ([backend/blockchain.js:75-86](backend/blockchain.js#L75-L86)), `src/lib/utils.ts` (`cn`), Tailwind + Vite config, Three.js hero, `@yudiel/react-qr-scanner`, `react-qr-code`.

**Extend:** `AgriChain.sol` (add AccessControl, enum, events — don't scrap), `backend/database/schema.sql` (add users, add `tx_hash` column), `backend/routes/api.js` (same routes, add middleware + tx-aware responses), `.env.example`.

**Rewrite:** `backend/server.js` middleware chain, `backend/blockchain.js` (multi-signer), `src/App.tsx` (providers + routes), `src/lib/api.ts` (env + JWT + typed client), every `alert()` → toast, all dashboard page shells, `RoleSelection.tsx` → `/register` + `/login`, `DashboardLayout.tsx` → `DashboardShell.tsx`.

---

## Phase 0 — Freeze baseline (S)

Tag current state. Copy `backend/database/agrichain.db` to `.backup/`. `git commit -am "chore: baseline before v2 rewrite"` + `git tag v0-baseline`.

**Verify:** `git tag --list` shows `v0-baseline`; app still boots.

## Phase 1 — Smart contract v2 (M) — parallel with Phase 3

Install `@openzeppelin/contracts`. Edit [smart-contract/contracts/AgriChain.sol](smart-contract/contracts/AgriChain.sol):

- Inherit `AccessControl`, define `FARMER_ROLE`, `PROCESSOR_ROLE`, `LOGISTICS_ROLE`, `RETAILER_ROLE`.
- Gate `createBatch` / `addProcessingDetails` / `updateLogistics` / `retailerReceive` with `onlyRole(...)`.
- Convert `string status` → `enum Status { CREATED, PROCESSED, IN_TRANSIT, RETAIL, SOLD }`; update `getBatchDetails` return.
- Add `require(batch.status == Status.X)` state-machine guards (no skipping CREATED→RETAIL).
- Keep existing indexed events; add `indexed role` to `PriceUpdated`.
- Add `getBatchHistory(uint256) → PriceComponent[]` (alias today, but preserves the API if we add handoff metadata later).

Rewrite [smart-contract/deploy.js](smart-contract/deploy.js) using `hardhat-ethers` so that `npx hardhat run scripts/deploy.js --network localhost` will:
1. Deploy the contract.
2. Grant each role to `accounts[1..4]` (standard Hardhat mnemonic derives them deterministically).
3. Write `CONTRACT_ADDRESS=…` to `backend/.env` and `VITE_API_BASE_URL=http://localhost:3001` + `VITE_CHAIN_NAME=Hardhat #31337` + `VITE_CONTRACT_ADDRESS=…` to root `.env`.

Expand [smart-contract/test/AgriChain.test.js](smart-contract/test/AgriChain.test.js) (currently 88 lines, happy path only): add role-grant test, 4 reverts for wrong-role callers, 1 revert for out-of-order state transition, `getBatchHistory` ordering assertion.

**Verify:** `npx hardhat test` all green; a second `npx hardhat run scripts/deploy.js --network localhost` on a fresh node writes both `.env` files.

## Phase 2 — Backend v2 (L)

Install `bcrypt`, `jsonwebtoken`, `zod`, `express-rate-limit`, `pino`, `pino-http`, `helmet`. Do NOT add cookie-parser — Bearer header is simpler.

New migration `backend/database/migrations/002_users_and_txhash.sql`:
```
CREATE TABLE users (id INTEGER PK, email TEXT UNIQUE, password_hash TEXT,
  role TEXT, wallet_index INTEGER, created_at INTEGER);
ALTER TABLE batches ADD COLUMN tx_hash TEXT;
ALTER TABLE price_components ADD COLUMN tx_hash TEXT;
```

New files:

- `backend/lib/wallets.js` — derive 4 signers from `MNEMONIC` via `ethers.HDNodeWallet.fromPhrase(MNEMONIC, undefined, \`m/44'/60'/0'/0/${walletIndex}\`)`, cached per `walletIndex`. Fail fast at boot if `MNEMONIC` missing. `getContractFor(role)` returns contract connected to that role's signer.
- `backend/lib/errors.js` — `AppError(code, message, status)`, `formatError`, global error handler → `{success:false, error:{code,message}}`.
- `backend/lib/logger.js` — pino.
- `backend/middleware/auth.js` — verifies JWT, attaches `req.user = {id, email, role, walletIndex}`.
- `backend/middleware/requireRole.js` — `requireRole('FARMER' | 'PROCESSOR' | ...)`.
- `backend/middleware/validate.js` — `validate(zodSchema, source='body')` factory.
- `backend/routes/auth.js` — `POST /api/auth/register` (zod: email, password min 8, role enum), `POST /api/auth/login`, `GET /api/auth/me`. Rate-limited 10/min. Login returns `{token, user}`.

Refactor [backend/blockchain.js](backend/blockchain.js): replace module-level `signer`/`contract` with `getContractFor(role)`; each write helper (`createBatch`, `addProcessing`, `updateLogistics`, `retailerReceive`) accepts a role and returns `{receipt, txHash, blockNumber, batchId?}`.

Refactor [backend/routes/api.js](backend/routes/api.js): each write route becomes `validate → auth → requireRole(X) → contract call (awaits tx.wait) → DB insert → respond {success, data:{...row, txHash, blockNumber, contractAddress}}`. Crucially: DB insert happens **after** `tx.wait()` resolves — if chain fails, DB stays clean; use `tx_hash` UNIQUE constraint so retries are idempotent. Add `GET /api/admin/overview` (admin role: user count, batches by status, 30-day volume series).

Tighten CORS: `cors({origin: FRONTEND_URL, credentials: false})`. Add `helmet()` and `pino-http`.

New script `backend/scripts/seed.js`: resets DB, creates 1 admin + 1 demo user per role (`farmer@demo/demo12345`, etc.), creates 5 batches at staggered stages (1 CREATED, 1 PROCESSED, 1 IN_TRANSIT, 2 RETAIL) by making real API calls in sequence.

**Verify:**
- `curl -X POST localhost:3001/api/auth/register -d '{"email":"f@x","password":"demo12345","role":"FARMER"}'` → JWT.
- `curl -H "Authorization: Bearer $TOKEN" -X POST localhost:3001/api/batch/create -d '{"crop":"rice","weight":"100kg","location":"Chennai","basePrice":50}'` → `{success, data:{batchId, txHash, blockNumber, contractAddress}}`.
- Same call as retailer role → 403.
- `node backend/scripts/seed.js` populates.

## Phase 3 — Frontend foundation (M) — parallel with Phase 1

Install: `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`, `recharts`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-tooltip`, `@radix-ui/react-scroll-area`, `@radix-ui/react-avatar`.

Scaffold shadcn primitives into `src/components/ui/`: `card`, `input`, `label`, `dialog`, `dropdown-menu`, `tabs`, `table`, `badge`, `skeleton`, `sheet`, `form`, `select`, `avatar`, `separator`, `scroll-area`, `tooltip`. Reuse existing `button.tsx`.

Rewrite [src/styles/global.css](src/styles/global.css): semantic HSL tokens — primary agri-green `142 71% 29%`, accent warm-ochre, earth-tone neutrals (stone 50-950), typography scale, radii, spacing. Keep Tailwind v4 `@theme` block.

Rewrite [src/lib/api.ts](src/lib/api.ts): `apiClient<T>(path, init)` reads `import.meta.env.VITE_API_BASE_URL`, injects `Authorization: Bearer ${token}` from `useAuth().token`, returns `Promise<T>` or throws typed `ApiError(code, message, status)`.

New:
- `src/lib/queryClient.ts` — default stale 30s, retry 1.
- `src/providers/QueryProvider.tsx`, `src/providers/AuthProvider.tsx` (localStorage `agri_token`, rehydrates `/api/auth/me`), `src/hooks/useAuth.ts`.
- `src/components/auth/ProtectedRoute.tsx`, `src/components/auth/RoleRoute.tsx`.
- `src/pages/Login.tsx`, `src/pages/Register.tsx` (RHF + zod resolver + toasts).
- `src/components/layout/DashboardShell.tsx` — topbar (logo, `NetworkBadge` using `VITE_CHAIN_NAME`, user menu with avatar + logout) + responsive sidebar with role-aware nav (**only real routes**) + main area with breadcrumbs.
- `src/components/common/TxHashChip.tsx` — copy-to-clipboard + tooltip showing contract address and block number.
- `src/components/common/EmptyState.tsx`, `src/components/common/ErrorBoundary.tsx`.

Rewrite [src/App.tsx](src/App.tsx): wrap with `<QueryProvider><AuthProvider><Toaster />`; add `/login`, `/register`, `<ErrorBoundary>`, Framer Motion `<AnimatePresence>` on `<Routes>`.

Delete `src/pages/RoleSelection.tsx` and `src/components/DashboardLayout.tsx`.

**Verify:** `/login` with bad creds shows toast; good creds redirect to `/farmer` (etc.); `/farmer` accessed as retailer bounces to `/retailer`; reload preserves session via `/me`.

## Phase 4 — Role dashboards (L)

Pattern per page (Farmer/Processor/Logistics/Retailer):
- Stat cards driven by `useQuery(['batches', role])` + derived counts.
- Batches table with search/filter/sort, status `Badge`, `Sheet` drawer per row showing price breakdown + `TxHashChip` per component + total on-chain verification.
- Primary action → shadcn `Dialog` + RHF + zod (no inline forms). On success: `toast.success`, `queryClient.invalidateQueries(['batches'])`, optimistic update if trivial.
- Loading → `Skeleton`; empty → `EmptyState`.

Retailer specifics: **Tabs** for Incoming / In Stock; **fix the orphan QR modal** by wiring `setShowQRModal(true)` on a "Generate QR" action in the In Stock tab; QR dialog uses `react-qr-code` + `window.print` + canvas download.

Admin specifics: hits `GET /api/admin/overview`; Recharts `<BarChart>` (batches by status), `<LineChart>` (30-day volume), activity feed (last 20 price updates).

**New routes** to kill dead nav: implement minimal `/farmer/batches` (full paginated list) and `/farmer/settings` (email + logout) across each role — copy-paste pattern keeps cost low. Alternative: drop the nav items. Recommend implementing minimal versions.

Replace every `alert()` call in all dashboards with `toast.success` / `toast.error`.

**Verify:** full smoke (the demo script):
1. `npm run dev` from root.
2. Register 4 users (one per role).
3. As farmer: create batch → Sheet shows tx hash.
4. As processor: process batch → price + status update.
5. As logistics: mark in-transit.
6. As retailer: receive → generate QR → print preview works.
7. Open `/scan`, paste batch id → consumer detail shows 4-stop timeline + price pie + valid on-chain badge.

## Phase 5 — Consumer flow polish (S)

`src/pages/ConsumerScan.tsx`: keep scanner, add manual `Input` fallback, persist `recentScans` in localStorage (last 5), handle camera-permission errors with `EmptyState`.

`src/pages/ConsumerBatchDetails.tsx`: vertical timeline of handoffs (role icon + role name + amount + `TxHashChip` + timestamp), Recharts `<PieChart>` for price share by role, verification badge ("Verified on Hardhat #31337 — 4/4 handoffs recorded on-chain"). Clicking a tx-hash opens a static `/tx/:hash` page showing `{txHash, blockNumber, contractAddress, chainName}` — no explorer needed because chain is local.

**Verify:** paste batch id 1 via `/scan` manual entry → full detail renders; invalid id shows `EmptyState` without crash.

## Phase 6 — DX, orchestration, docs (M) — can start during Phase 4

Convert root to a proper workspace root. New root `package.json` scripts (using `concurrently` + `wait-on`):

- `dev` → `concurrently -k -n chain,backend,web "hardhat node" "wait-on tcp:8545 && npm run deploy && npm --prefix backend run dev" "wait-on http://localhost:3001/health && vite"`
- `deploy` → `hardhat run smart-contract/scripts/deploy.js --network localhost`
- `seed` → `node backend/scripts/seed.js`
- `reset` → `rimraf backend/database/agrichain.db && npm run deploy && npm run seed`
- `build` → `vite build`
- `test` → `npm --prefix smart-contract test`

New `.env.example` files at: root (`VITE_API_BASE_URL`, `VITE_CHAIN_NAME`, `VITE_CONTRACT_ADDRESS`) and `backend/` (`PORT`, `BLOCKCHAIN_URL`, `CONTRACT_ADDRESS`, `MNEMONIC`, `JWT_SECRET`, `FRONTEND_URL`).

Rewrite `README.md`: 60-second quickstart (`npm i && npm run dev && npm run seed`), Mermaid architecture diagram (Web ⇄ Express ⇄ Hardhat ⇄ AgriChain.sol), demo credentials table, screenshot placeholders, `## Deploy to Polygon Amoy` section (deferred, just instructions).

Stub `QUICKSTART.md` → redirect to README.

Extend `.gitignore`: `backend/database/*.db`, `**/.env` (keep `.env.example`), `smart-contract/artifacts/`, `smart-contract/cache/`, `dist/`.

**Verify:** on a fresh clone, `npm i && npm run dev` boots all three processes; `npm run reset` returns to a clean demo state.

## Phase 7 — Harden + ship (S)

`ErrorBoundary` per route, 404 page, favicon + `<title>`, Suspense boundary around Three.js hero, helmet on backend, rate-limit write routes (30/min), grep for leftover `console.log`/`alert()`, ensure no secrets committed.

**Verify:** Lighthouse on landing ≥ 85 perf; `npx hardhat test` + manual E2E both pass.

---

## Critical files to modify

- [smart-contract/contracts/AgriChain.sol](smart-contract/contracts/AgriChain.sol) — AccessControl + enum + state guards
- [smart-contract/deploy.js](smart-contract/deploy.js) — real deployment + role grant + `.env` writes
- [smart-contract/test/AgriChain.test.js](smart-contract/test/AgriChain.test.js) — expanded test matrix
- [backend/server.js](backend/server.js) — helmet, pino-http, rate-limit, error handler
- [backend/blockchain.js](backend/blockchain.js) — multi-signer `getContractFor(role)`
- [backend/routes/api.js](backend/routes/api.js) — validate + auth + requireRole + tx-aware responses
- [backend/database/schema.sql](backend/database/schema.sql) — users + tx_hash columns
- [src/App.tsx](src/App.tsx) — providers + new routes
- [src/lib/api.ts](src/lib/api.ts) — env + JWT + typed client
- [src/styles/global.css](src/styles/global.css) — token rework
- [src/components/DashboardLayout.tsx](src/components/DashboardLayout.tsx) → delete, replaced by `src/components/layout/DashboardShell.tsx`
- All of [src/pages/](src/pages/) — page rewrites
- Root `package.json`, `README.md`, `.env.example`

## Top 3 risks + mitigations

1. **DB–chain desync on tx failure.** Always call contract first, await `tx.wait()`, only then insert DB; catch anywhere in the chain returns `{success:false}` without DB mutation. UNIQUE `tx_hash` column makes retries idempotent.
2. **Role signer key management.** Never accept raw private keys. Derive all 4 role signers from one `MNEMONIC` env var via HD path `m/44'/60'/0'/0/{walletIndex}` at boot; cache per role. Fail fast if `MNEMONIC` missing. Document that this is demo-custodial only and link to the Amoy follow-up section that explains what to change for production.
3. **Stale artifacts breaking the frontend.** Add a boot-time ABI check in `backend/blockchain.js`: if `contract.interface.getFunction('getBatchHistory')` is missing, log `→ run npm run reset` and `process.exit(1)`. Keep `npm run reset` as the one-liner recovery path.

## Effort summary
Phase 0 S · Phase 1 M · Phase 2 L · Phase 3 M · Phase 4 L · Phase 5 S · Phase 6 M · Phase 7 S → ~4–6 focused days solo.

## Verification (end-to-end demo script)

From a fresh clone:

```
npm i
npm run dev        # hardhat + deploy + backend + vite in one terminal
npm run seed       # in a second terminal
```

Open http://localhost:5173:
1. `/register` → farmer@demo / demo12345 / FARMER.
2. Create rice batch 100kg ₹50 → Sheet drawer shows tx hash + block number.
3. Logout, login as processor@demo → process batch → status = PROCESSED.
4. Logout, login as logistics@demo → mark in-transit.
5. Logout, login as retailer@demo → receive → generate QR → print preview works.
6. `/scan` → paste batch id 1 → timeline with 4 handoffs + price pie chart + "Verified on Hardhat #31337" badge + clickable tx hashes.
7. As admin@demo → `/admin` → charts populated from `/api/admin/overview`.

Automated:
- `npx hardhat test` — all role-gating + state-machine tests green.
- `curl` matrix in Phase 2 Verify section returns expected codes (201 for own role, 403 for wrong role).
