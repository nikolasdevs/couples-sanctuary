"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface JoinPartnerProps {
  accentBg: string; // e.g. "bg-amber-500"
  accentText: string; // e.g. "text-black"
  onJoin: (code: string) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

/**
 * Screen where Partner B enters the 6-character sync code.
 */
export function JoinPartner({
  accentBg,
  accentText,
  onJoin,
  onBack,
  loading,
  error,
}: JoinPartnerProps) {
  const reduceMotion = useReducedMotion();
  const [code, setCode] = useState("");

  const handleChange = (raw: string) => {
    // Allow only alphanumeric, uppercase, max 6 chars
    setCode(raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 pt-20"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <span className="text-3xl">🔑</span>
      </div>

      <h2 className="text-lg font-semibold text-zinc-50">Join Partner</h2>

      <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
        Enter the 6-character code your partner shared with you.
      </p>

      <input
        type="text"
        value={code}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="XXXXXX"
        maxLength={6}
        autoComplete="off"
        className="w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-2xl font-mono tracking-[0.3em] text-zinc-100 placeholder-white/20 focus:border-white/30 focus:outline-none"
      />

      {error && (
        <p className="text-xs text-red-400 text-center max-w-xs">{error}</p>
      )}

      <button
        onClick={() => code.length === 6 && onJoin(code)}
        disabled={code.length !== 6 || loading}
        className={`rounded-full ${accentBg} px-8 py-3 text-sm font-semibold ${accentText} transition disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {loading ? "Joining…" : "Join Session"}
      </button>

      <button
        onClick={onBack}
        className="text-sm text-white/40 underline underline-offset-4 transition hover:text-white/60"
      >
        ← Back
      </button>
    </motion.div>
  );
}
