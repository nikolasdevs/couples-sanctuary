"use client";

import { useCallback, useEffect, useState } from "react";

export interface DashboardData {
  partnerA: string;
  partnerB: string;
  streak: number;
  lastSessionDate: string | null;
  healthScore: number | null; // 0-100, null if no check-in yet
  checkinDay: number; // 0=Sun … 6=Sat
  latestInsight: string | null;
  checkinsDone: number;
  compatibilityDone: boolean;
}

const STORAGE_KEY = "cs:dashboard";

const defaults: DashboardData = {
  partnerA: "",
  partnerB: "",
  streak: 0,
  lastSessionDate: null,
  healthScore: null,
  checkinDay: 0,
  latestInsight: null,
  checkinsDone: 0,
  compatibilityDone: false,
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData({ ...defaults, ...JSON.parse(raw) });
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const update = useCallback(
    (patch: Partial<DashboardData>) => {
      setData((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // quota exceeded — ignore
        }
        return next;
      });
    },
    [],
  );

  // Increment streak when a bonding session completes (call from end page)
  const recordSession = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setData((prev) => {
      const isConsecutive =
        prev.lastSessionDate &&
        dayDiff(prev.lastSessionDate, today) <= 2; // within 2 days = keeps streak
      const next: DashboardData = {
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastSessionDate: today,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { data, ready, update, recordSession };
}

function dayDiff(a: string, b: string): number {
  const msA = new Date(a).getTime();
  const msB = new Date(b).getTime();
  return Math.abs(Math.round((msB - msA) / 86_400_000));
}
