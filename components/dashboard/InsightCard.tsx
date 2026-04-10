"use client";

import { motion, useReducedMotion } from "framer-motion";

interface InsightCardProps {
  insight: string | null; // null = no insight yet
}

export function InsightCard({ insight }: InsightCardProps) {
  const reduceMotion = useReducedMotion();

  if (!insight) return null;

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <p className="text-sm font-semibold text-zinc-50">Weekly Insight</p>
      </div>
      <p className="text-sm leading-relaxed text-white/60">{insight}</p>
    </motion.div>
  );
}
