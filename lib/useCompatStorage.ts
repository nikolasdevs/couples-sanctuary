"use client";

import type { CompatResponses, CompatResult } from "@/lib/compatScoring";
import { useCallback, useEffect, useState } from "react";

const RESULT_KEY = "cs:compat:result";
const RESPONSES_KEY = "cs:compat:responses";

export function useCompatStorage() {
  const [result, setResult] = useState<CompatResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESULT_KEY);
      if (raw) setResult(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  /** Get in-progress responses */
  const getResponses = useCallback((): {
    partnerA: CompatResponses | null;
    partnerB: CompatResponses | null;
  } => {
    try {
      const raw = localStorage.getItem(RESPONSES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return { partnerA: null, partnerB: null };
  }, []);

  /** Save a partner's responses */
  const savePartnerResponses = useCallback(
    (partner: "A" | "B", responses: CompatResponses) => {
      const current = getResponses();
      if (partner === "A") current.partnerA = responses;
      else current.partnerB = responses;
      try {
        localStorage.setItem(RESPONSES_KEY, JSON.stringify(current));
      } catch {
        // ignore
      }
    },
    [getResponses],
  );

  /** Save completed result */
  const saveResult = useCallback((res: CompatResult) => {
    setResult(res);
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(res));
    } catch {
      // ignore
    }
  }, []);

  /** Reset everything (retake assessment) */
  const reset = useCallback(() => {
    setResult(null);
    try {
      localStorage.removeItem(RESULT_KEY);
      localStorage.removeItem(RESPONSES_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { result, ready, getResponses, savePartnerResponses, saveResult, reset };
}
