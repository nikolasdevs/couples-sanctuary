"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  name: string;
}

interface CoupleInfo {
  id: number;
  status: "pending" | "active";
  inviteCode: string | null;
  partnerName: string | null;
}

interface AuthState {
  user: User | null;
  couple: CoupleInfo | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error?: string }>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  createInvite: () => Promise<{ inviteCode?: string; error?: string }>;
  joinCouple: (code: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    couple: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setState({ user: null, couple: null, loading: false });
        return;
      }
      const data = await res.json();
      setState({ user: data.user, couple: data.couple, loading: false });
    } catch {
      setState({ user: null, couple: null, loading: false });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error };
        setState((s) => ({ ...s, user: data.user, loading: false }));
        await refresh();
        return {};
      } catch {
        return { error: "Network error." };
      }
    },
    [refresh],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error };
        setState((s) => ({ ...s, user: data.user, loading: false }));
        await refresh();
        return {};
      } catch {
        return { error: "Network error." };
      }
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setState({ user: null, couple: null, loading: false });
  }, []);

  const createInvite = useCallback(async () => {
    try {
      const res = await fetch("/api/couples/invite", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error };
      await refresh();
      return { inviteCode: data.inviteCode };
    } catch {
      return { error: "Network error." };
    }
  }, [refresh]);

  const joinCouple = useCallback(
    async (code: string) => {
      try {
        const res = await fetch("/api/couples/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error };
        await refresh();
        return {};
      } catch {
        return { error: "Network error." };
      }
    },
    [refresh],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signup,
        login,
        logout,
        refresh,
        createInvite,
        joinCouple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
