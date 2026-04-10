"use client";

import { motion, useReducedMotion } from "framer-motion";

interface StreakTrackerProps {
  streak: number;
}

export function StreakTracker({ streak }: StreakTrackerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <span className="text-2xl">🔥</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-50">
          {streak > 0 ? `${streak}-session streak` : "Start your streak"}
        </p>
        <p className="text-xs text-white/50">
          {streak > 0
            ? "Keep the connection going"
            : "Complete a bonding session to begin"}
        </p>
      </div>
      {streak > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-amber-500/80"
            />
          ))}
          {streak > 7 && (
            <span className="text-[10px] text-amber-500/70 font-medium ml-0.5">
              +{streak - 7}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
