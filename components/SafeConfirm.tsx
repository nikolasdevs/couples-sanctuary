"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SafeConfirm({
  onConfirm,
  onCancel,
  onReconsider,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  onReconsider: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
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
        <h2
          id="confirm-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Before continuing
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-zinc-200">
          You paused for safety. Are you both comfortable continuing now?
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 to-[#B11226] py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-900/25 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99]"
          >
            We’re okay to continue
          </button>

          <button
            onClick={onCancel}
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Choose another direction
          </button>

          <button
            onClick={onReconsider}
            className="w-full rounded-xl py-3 text-sm font-medium text-emerald-200 underline decoration-white/20 underline-offset-4 transition hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Not yet — go back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
