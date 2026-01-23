"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PauseOverlay({ onResume }: { onResume: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        // tap/click outside to dismiss (Pause only)
        if (e.target === e.currentTarget) onResume();
      }}
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
        <h2 id="pause-title" className="text-2xl font-semibold tracking-tight">
          Pause
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-200">
          Take a breath. Stay where you are.
        </p>

        <div className="mt-6">
          <button
            onClick={onResume}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 to-[#B11226] py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-900/25 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99]"
          >
            Resume
          </button>
          <p className="mt-3 text-xs text-white/55">Tap outside to close.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
