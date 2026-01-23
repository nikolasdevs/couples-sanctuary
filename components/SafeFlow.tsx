"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SafeFlow({
  onRedirect,
  onSkip,
  onEnd,
  onReconsider,
}: {
  onRedirect: () => void;
  onSkip: () => void;
  onEnd: () => void;
  onReconsider: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-zinc-50 shadow-2xl shadow-black/40"
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }
        }
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="mx-auto mb-3 inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200">
          Safe moment
        </div>

        <h2 id="safe-title" className="text-2xl font-semibold tracking-tight">
          A boundary was set
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-zinc-200">
          You don’t need to explain it. Choose what feels best for both of you.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={onRedirect}
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Change direction
          </button>

          <button
            onClick={onSkip}
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Skip this card
          </button>

          <div className="pt-2">
            <button
              onClick={onReconsider}
              className="w-full rounded-xl py-3 text-sm font-medium text-emerald-200 underline decoration-white/20 underline-offset-4 transition hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Reconsider
            </button>

            <button
              onClick={onEnd}
              className="mt-1 w-full rounded-xl py-3 text-sm font-semibold text-[#B11226] underline decoration-white/20 underline-offset-4 transition hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              End session
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
