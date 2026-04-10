"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface WaitingRoomProps {
  code: string;
  partnerLabel: string; // "A" or "B"
  accentClass: string; // e.g. "border-amber-500/20 bg-amber-500/10"
  onPartnerDone: () => void;
  pollFn: () => Promise<boolean>; // should return true when partner has completed
}

/**
 * Waiting screen while the remote partner completes their assessment.
 * Shows the sync code and polls for completion.
 */
export function WaitingRoom({
  code,
  partnerLabel,
  accentClass,
  onPartnerDone,
  pollFn,
}: WaitingRoomProps) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [dots, setDots] = useState("");

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 600);
    return () => clearInterval(t);
  }, []);

  // Poll for partner completion
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const done = await pollFn();
          if (done && !cancelled) {
            onPartnerDone();
            return;
          }
        } catch {
          // Silently retry
        }
        // Wait 8s between polls
        await new Promise((r) => setTimeout(r, 8000));
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [pollFn, onPartnerDone]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/join?code=${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Sanctuary session",
          text: `Use code ${code} to join our session on Couples Sanctuary`,
          url,
        });
      } catch {
        // Share dismissed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <motion.div
      className="flex flex-col items-center gap-6 pt-16"
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full border ${accentClass}`}
      >
        <span className="text-4xl">📡</span>
      </div>

      <h2 className="text-lg font-semibold text-zinc-50">
        Waiting for your partner{dots}
      </h2>

      <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
        You&apos;ve completed your part as Partner {partnerLabel}. Share this
        code with your partner so they can answer from their device.
      </p>

      {/* Code display */}
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
          <span className="font-mono text-3xl tracking-[0.4em] text-zinc-50">
            {code}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:bg-white/[0.08]"
          >
            {copied ? "Copied ✓" : "Copy Code"}
          </button>
          <button
            onClick={handleShare}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:bg-white/[0.08]"
          >
            Share Link
          </button>
        </div>
      </div>

      <p className="text-xs text-white/30 text-center max-w-xs">
        This code expires in 48 hours. Results will appear automatically once your
        partner finishes.
      </p>
    </motion.div>
  );
}
