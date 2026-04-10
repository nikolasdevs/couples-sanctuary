"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ModeSelectProps {
  title: string;
  icon: string;
  accentClass: string; // e.g. "border-amber-500/20 bg-amber-500/10"
  onSelectTogether: () => void;
  onSelectApart: () => void;
  onJoin: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Initial screen for Check-In or Compatibility that lets partners choose:
 * - "We're Together" → pass-the-phone flow
 * - "We're Apart" → create a sync session
 * - "Join Partner" → enter a code
 */
export function ModeSelect({
  title,
  icon,
  accentClass,
  onSelectTogether,
  onSelectApart,
  onJoin,
  loading,
  error,
}: ModeSelectProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center gap-8 pt-16"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border ${accentClass}`}
      >
        <span className="text-3xl">{icon}</span>
      </div>

      <h1 className="text-xl font-semibold text-zinc-50">{title}</h1>

      <p className="max-w-xs text-center text-sm text-white/50 leading-relaxed">
        How would you like to do this? You can sit together and share one phone,
        or take the assessment from different locations.
      </p>

      {error && (
        <p className="text-xs text-red-400 text-center max-w-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex w-full flex-col gap-3">
        {/* Together — pass the phone */}
        <button
          onClick={onSelectTogether}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07]"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-50">
              We&apos;re Together
            </p>
            <p className="text-xs text-white/40">
              Share one phone, take turns
            </p>
          </div>
          <span className="text-lg">📱</span>
        </button>

        {/* Apart — sync session */}
        <button
          onClick={onSelectApart}
          disabled={loading}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-50">
              We&apos;re Apart
            </p>
            <p className="text-xs text-white/40">
              {loading ? "Creating session…" : "Get a code to share with your partner"}
            </p>
          </div>
          <span className="text-lg">🔗</span>
        </button>

        {/* Join existing session */}
        <button
          onClick={onJoin}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/[0.07]"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-50">
              Join Partner
            </p>
            <p className="text-xs text-white/40">
              I have a code from my partner
            </p>
          </div>
          <span className="text-lg">🔑</span>
        </button>
      </div>
    </motion.div>
  );
}
