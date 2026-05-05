import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setAuthToken, type Role, type User } from "@/lib/api";

const STORAGE_KEY = "agri_token";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>(token ? "loading" : "unauthenticated");

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { user: me } = await api.me();
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const persist = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await api.login(email, password);
    persist(t, u);
    return u;
  }, [persist]);

  const register = useCallback(async (email: string, password: string, role: Role) => {
    const { token: t, user: u } = await api.register(email, password, role);
    persist(t, u);
    return u;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, status, login, register, logout }),
    [user, token, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
