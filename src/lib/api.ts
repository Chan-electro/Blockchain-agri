// Central, typed API client. Reads VITE_API_BASE_URL from env, injects the
// Bearer token from the auth store when present, and throws a typed ApiError
// so React Query + form handlers get structured failures.

export interface ApiError extends Error {
  code: string;
  status: number;
}

interface EnvelopedSuccess<T> {
  success: true;
  data: T;
  meta?: { total?: number; page?: number; limit?: number };
}
interface EnvelopedError {
  success: false;
  error: { code: string; message: string };
}

type Envelope<T> = EnvelopedSuccess<T> | EnvelopedError;

const BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : "http://localhost:3001";

export function makeApiError(code: string, message: string, status: number): ApiError {
  const err = new Error(message) as ApiError;
  err.code = code;
  err.status = status;
  return err;
}

let currentToken: string | null = null;

export function setAuthToken(token: string | null): void {
  currentToken = token;
}

export function getAuthToken(): string | null {
  return currentToken;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch (err) {
    throw makeApiError(
      "NETWORK_ERROR",
      err instanceof Error ? err.message : "Network request failed",
      0,
    );
  }

  let body: Envelope<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON body; fall through to status-based error
  }

  if (!res.ok || !body || body.success === false) {
    const code = body && body.success === false ? body.error.code : `HTTP_${res.status}`;
    const message = body && body.success === false
      ? body.error.message
      : res.statusText || "Request failed";
    throw makeApiError(code, message, res.status);
  }
  return body.data;
}

// ---------- Domain types ----------
export type Role = "FARMER" | "PROCESSOR" | "LOGISTICS" | "RETAILER" | "CONSUMER" | "ADMIN";
export type BatchStatus = "CREATED" | "PROCESSED" | "IN_TRANSIT" | "RETAIL" | "SOLD";

export interface User {
  id: number;
  email: string;
  role: Role;
  walletIndex: number | null;
  createdAt: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PriceComponent {
  id?: number;
  batch_id?: number;
  stakeholder_address?: string;
  stakeholder?: string;
  role: string;
  amount: number;
  description?: string;
  timestamp: number;
  tx_hash?: string | null;
  block_number?: number | null;
}

export interface Batch {
  id: number;
  farmer_address: string;
  crop: string;
  weight: string;
  location: string;
  status: BatchStatus;
  total_price: number;
  tx_hash?: string | null;
  block_number?: number | null;
  created_at: number;
  updated_at: number;
  priceBreakdown: PriceComponent[];
  contractAddress?: string;
  txHash?: string;
  blockNumber?: number;
}

export interface AdminOverview {
  users: number;
  batchesByStatus: Array<{ status: BatchStatus; n: number }>;
  volumeByDay: Array<{ day: string; batches: number; volume: number }>;
  recentActivity: Array<PriceComponent & { crop?: string; batch_status?: BatchStatus }>;
  contractAddress: string;
}

// ---------- High-level endpoints ----------
export const api = {
  // Auth
  register: (email: string, password: string, role: Role) =>
    apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    }),
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiRequest<{ user: User }>("/api/auth/me"),

  // Batches
  listBatches: (status?: BatchStatus) =>
    apiRequest<Batch[]>(status ? `/api/batches?status=${status}` : "/api/batches"),
  getBatch: (id: number) => apiRequest<Batch>(`/api/batch/${id}`),
  getBatchCount: () =>
    apiRequest<{ batchCount: number; contractAddress: string }>("/api/stats/count"),

  createBatch: (input: { crop: string; weight: string; location: string; basePrice: number }) =>
    apiRequest<Batch>("/api/batch/create", { method: "POST", body: JSON.stringify(input) }),
  processBatch: (input: { batchId: number; fee: number; description?: string }) =>
    apiRequest<Batch>("/api/batch/process", { method: "POST", body: JSON.stringify(input) }),
  shipBatch: (input: { batchId: number; fee: number; description?: string }) =>
    apiRequest<Batch>("/api/batch/ship", { method: "POST", body: JSON.stringify(input) }),
  receiveBatch: (input: { batchId: number; fee: number; description?: string }) =>
    apiRequest<Batch>("/api/batch/receive", { method: "POST", body: JSON.stringify(input) }),

  adminOverview: () => apiRequest<AdminOverview>("/api/admin/overview"),
};

export const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME || "Local Chain";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
