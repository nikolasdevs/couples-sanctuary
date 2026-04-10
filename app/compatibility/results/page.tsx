"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { RadarChart } from "@/components/compatibility/RadarChart";
import { DIMENSION_META, type Dimension } from "@/data/compatQuestions";
import { getConversationStarter, type DimensionScore } from "@/lib/compatScoring";
import { useCompatStorage } from "@/lib/useCompatStorage";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

function alignmentLabel(score: number): { text: string; style: string } {
  if (score >= 80) return { text: "Deeply Aligned", style: "text-green-400 bg-green-500/10 border-green-500/20" };
  if (score >= 60) return { text: "Room to Grow", style: "text-amber-300 bg-amber-500/10 border-amber-500/20" };
  return { text: "Important Conversation", style: "text-rose-300 bg-rose-500/10 border-rose-500/20" };
}

export default function CompatResultsPage() {
  const { result, ready, reset } = useCompatStorage();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !ready) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-white/5" />
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-dvh bg-[#0A0A0A] pb-24">
        <div className="mx-auto w-full max-w-xl px-5 pt-16 flex flex-col items-center gap-6">
          <span className="text-4xl">🔮</span>
          <p className="text-sm text-white/50 text-center">
            No compatibility results yet. Complete the assessment with your
            partner to see your alignment map.
          </p>
          <Link
            href="/compatibility"
            className="text-sm text-purple-400 underline underline-offset-4"
          >
            Go to Compatibility →
          </Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const { dimensions, overallAlignment, strengths, growthAreas } = result;

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24">
      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.08,
                delayChildren: 0.05,
              },
            },
          }}
        >
          {/* Header */}
          <motion.div
            className="flex items-center gap-3"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <Link
              href="/compatibility"
              className="text-sm text-white/40 hover:text-white/60 transition"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-zinc-50">
              Your Compatibility Map
            </h1>
          </motion.div>

          {/* Overall score */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-2">
              Overall Alignment
            </p>
            <motion.p
              className="text-5xl font-bold text-purple-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.3 }}
            >
              {overallAlignment}%
            </motion.p>
            <p className="text-sm text-white/50 mt-1">
              across {dimensions.length} dimensions
            </p>
          </motion.div>

          {/* Radar chart */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <RadarChart scores={dimensions} />
          </motion.div>

          {/* Strengths */}
          <motion.div
            className="rounded-2xl border border-green-500/15 bg-green-500/5 p-5"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-green-400/60 mb-3">
              💪 Your Strengths
            </p>
            <div className="flex flex-col gap-2">
              {strengths.map((s) => (
                <StrengthRow key={s.dimension} score={s} />
              ))}
            </div>
          </motion.div>

          {/* Growth areas */}
          <motion.div
            className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-amber-400/60 mb-3">
              🌱 Growth Areas
            </p>
            <div className="flex flex-col gap-3">
              {growthAreas.map((s) => (
                <GrowthRow key={s.dimension} score={s} />
              ))}
            </div>
          </motion.div>

          {/* Full dimension breakdown */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">
              All Dimensions
            </p>
            <div className="flex flex-col gap-4">
              {dimensions.map((d) => (
                <DimensionRow key={d.dimension} score={d} />
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col gap-3 pb-4"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          >
            <button
              onClick={reset}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-zinc-50 transition hover:bg-white/[0.07]"
            >
              🔄 Retake Assessment
            </button>
            <Link
              href="/dashboard"
              className="text-center text-sm text-white/40 underline underline-offset-4 transition hover:text-white/60"
            >
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function StrengthRow({ score }: { score: DimensionScore }) {
  const meta = DIMENSION_META[score.dimension as Dimension];
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-200">
        {meta?.icon} {score.dimension}
      </span>
      <span className="text-sm font-semibold text-green-400 tabular-nums">
        {score.alignment}%
      </span>
    </div>
  );
}

function GrowthRow({ score }: { score: DimensionScore }) {
  const meta = DIMENSION_META[score.dimension as Dimension];
  const starter = getConversationStarter(score.dimension as Dimension, score);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-zinc-200">
          {meta?.icon} {score.dimension}
        </span>
        <span className="text-sm font-semibold text-amber-400 tabular-nums">
          {score.alignment}%
        </span>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">{starter}</p>
    </div>
  );
}

function DimensionRow({ score }: { score: DimensionScore }) {
  const meta = DIMENSION_META[score.dimension as Dimension];
  const label = alignmentLabel(score.alignment);
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{meta?.icon}</span>
          <span className="text-xs text-zinc-200">{score.dimension}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${label.style}`}
          >
            {label.text}
          </span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: meta?.color }}
          >
            {score.alignment}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: meta?.color ?? "#8b5cf6" }}
          initial={{ width: 0 }}
          animate={{ width: `${score.alignment}%` }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
      {!score.matched && (
        <div className="mt-1 flex gap-3 text-[10px] text-white/30">
          <span>A: {score.tagA}</span>
          <span>B: {score.tagB}</span>
        </div>
      )}
    </div>
  );
}
