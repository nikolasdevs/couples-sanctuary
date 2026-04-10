"use client";

import { useCallback, useRef, useState } from "react";

export interface SyncSession {
  code: string;
  type: "checkin" | "compatibility";
  weekKey?: string;
  status: "waiting" | "complete" | "expired";
  partnerA: { name: string; responses: Record<string, unknown> } | null;
  partnerB: { name: string; responses: Record<string, unknown> } | null;
}

/**
 * Client-side hook for sync operations — create, submit, poll.
 */
export function useSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Create a new sync session — returns the join code */
  const createSession = useCallback(
    async (
      type: "checkin" | "compatibility",
      weekKey?: string,
    ): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, weekKey }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data as { error?: string }).error ?? "Failed to create session.");
          return null;
        }
        const data = (await res.json()) as { code: string };
        return data.code;
      } catch {
        setError("Network error. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /** Submit responses for a partner */
  const submitResponses = useCallback(
    async (
      code: string,
      partner: "A" | "B",
      name: string,
      responses: Record<string, unknown>,
    ): Promise<{ ok: boolean; complete: boolean }> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/sync/${encodeURIComponent(code)}/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partner, name, responses }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data as { error?: string }).error ?? "Failed to submit.");
          return { ok: false, complete: false };
        }
        const data = (await res.json()) as { ok: boolean; complete: boolean };
        return data;
      } catch {
        setError("Network error. Please try again.");
        return { ok: false, complete: false };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /** Fetch session status once */
  const getSession = useCallback(
    async (code: string): Promise<SyncSession | null> => {
      setError(null);
      try {
        const res = await fetch(`/api/sync/${encodeURIComponent(code)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data as { error?: string }).error ?? "Session not found.");
          return null;
        }
        const data = (await res.json()) as Omit<SyncSession, "code">;
        return { code, ...data } as SyncSession;
      } catch {
        setError("Network error.");
        return null;
      }
    },
    [],
  );

  /** Start polling for partner completion. Calls onComplete when both are done. */
  const startPolling = useCallback(
    (code: string, onComplete: (session: SyncSession) => void) => {
      // Stop any existing poll
      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(async () => {
        const session = await getSession(code);
        if (!session) return;

        if (session.status === "complete" || (session.partnerA && session.partnerB)) {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          onComplete(session);
        }
      }, 8000); // poll every 8 seconds
    },
    [getSession],
  );

  /** Stop polling */
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  return {
    loading,
    error,
    createSession,
    submitResponses,
    getSession,
    startPolling,
    stopPolling,
  };
}
